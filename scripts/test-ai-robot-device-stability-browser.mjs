import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const report={runAt:new Date().toISOString(),deviceSizes:[],slowNetwork:null,actionReplay:null};

const url=process.env.DEVNETRA_KIDS_URL??'http://localhost:3000/dev/characters';
const cycles=Math.max(5,Math.min(60,Number(process.env.MASCOT_STABILITY_CYCLES??'20')||20));
const browser=await chromium.launch({
  channel:'chrome',headless:true,
  args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox'],
});
const collectErrors=page=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  return errors;
};
const openStudio=async page=>{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200);
  await page.getByRole('heading',{name:'AI Robot — Character editor'}).waitFor({timeout:20000});
};
try {
  // Validate actual GLB rendering at multiple CSS viewport sizes and keyboard use.
  for(const width of [320,390,768,1280]){
    const page=await browser.newPage({viewport:{width,height:850},reducedMotion:width===320?'reduce':'no-preference'});
    const errors=collectErrors(page);
    const loadStart=Date.now();
    await openStudio(page);
    await page.getByText('3D model loaded',{exact:true}).waitFor({timeout:20000});
    const loadMs=Date.now()-loadStart;
    assert.equal(await page.locator('[data-mascot-fallback]').count(),0);
    await page.getByRole('button',{name:'ocean',exact:true}).scrollIntoViewIfNeeded();
    const geometry=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth,
    }));
    assert.ok(geometry.scroll<=geometry.viewport+2,
      'Horizontal page overflow at '+width+'px: '+JSON.stringify(geometry));
    const group=page.getByRole('group',{name:'Robot color palette'});
    const violet=group.getByRole('button',{name:'violet',exact:true});
    await violet.focus();
    assert.equal(await violet.evaluate(el=>el===document.activeElement),true);
    await violet.press('Enter');
    assert.equal(await violet.getAttribute('aria-pressed'),'true');
    const paletteBox=await violet.boundingBox();
    assert.ok(paletteBox&&paletteBox.width>=44&&paletteBox.height>=44,
      'Palette target too small at '+width+'px');
    const task=page.getByRole('region',{name:'Mini learning challenge'});
    const correct=task.getByRole('button',{name:'5',exact:true});
    await correct.focus();
    const answerBox=await correct.boundingBox();
    assert.ok(answerBox&&answerBox.width>=44&&answerBox.height>=44,
      'Answer target too small at '+width+'px');
    await correct.press('Enter');
    assert.equal(await task.getByRole('status').innerText(),'Harika, beşi buldun!');
    assert.equal(await page.locator('.dv-mascot-bubble').innerText(),'Aferin!');
    const bubbleBox=await page.locator('.dv-mascot-bubble').boundingBox();
    assert.ok(bubbleBox&&bubbleBox.x>=-2&&bubbleBox.x+bubbleBox.width<=width+2,
      'Bubble extends horizontally beyond '+width+'px viewport');
    if(width===320)assert.equal(await page.locator('.dv-mascot-bubble').getAttribute('data-motion'),'reduced');
    assert.deepEqual(errors,[],'JS errors at viewport '+width);
    report.deviceSizes.push({width,loadMs,horizontalOverflowPx:Math.max(0,geometry.scroll-geometry.viewport),keyboard:true,bubbleVisible:true});
    if(width===320||width===390) {
      await page.screenshot({path:'reports/visual/mascot-device-'+width+'.png',fullPage:true});
    }
    await page.close();
    console.log('MSCT15_VIEWPORT_KEYBOARD_PASS '+width);
  }

  // Slow GLB request: 2D mascot should be visible until 3D finishes loading.
  const slow=await browser.newPage({viewport:{width:390,height:844}});
  const slowErrors=collectErrors(slow);
  let intercepted=false;
  await slow.route('**/assets/characters/ai-robot.glb',async route=>{
    intercepted=true;
    await new Promise(resolve=>setTimeout(resolve,2200));
    await route.continue();
  });
  const slowStart=Date.now();
  await openStudio(slow);
  await slow.locator('.dv-ai-robot-preview__frame').scrollIntoViewIfNeeded();
  await slow.locator('[data-mascot-fallback="2d"]').waitFor({timeout:10000});
  await slow.getByText('3D model loaded',{exact:true}).waitFor({timeout:25000});
  assert.equal(intercepted,true,'Slow GLB route was not exercised');
  assert.equal(await slow.locator('[data-mascot-fallback]').count(),0);
  assert.deepEqual(slowErrors,[]);
  report.slowNetwork={delayMs:2200,loadedWithinMs:Date.now()-slowStart,showed2dDuringLoad:true};
  await slow.close();
  console.log('MSCT15_SLOW_NETWORK_PLACEHOLDER_PASS');

  // Repeat manual action transitions on a single real WebGL instance.
  // This detects unhandled renderer errors and interaction freezes; it is not a memory leak certification.
  const stability=await browser.newPage({viewport:{width:1180,height:820}});
  const stabilityErrors=collectErrors(stability);
  await openStudio(stability);
  await stability.getByText('3D model loaded',{exact:true}).waitFor({timeout:20000});
  const group=stability.getByRole('group',{name:'Robot animation actions'});
  for(let i=0;i<cycles;i++){
    const action=['wave','happy','walk','celebrate','think','oops','idle'][i%7];
    await group.getByRole('button',{name:action,exact:true}).click();
    await stability.waitForTimeout(75);
    assert.equal(await stability.locator('canvas').count(),1,
      'Canvas lost during cycle '+i);
  }
  await group.getByRole('button',{name:'idle',exact:true}).click();
  await stability.waitForTimeout(350);
  assert.match(await stability.locator('.dv-ai-robot-preview__output').innerText(),/idle/);
  assert.deepEqual(stabilityErrors,[],'Page errors during action replay');
  report.actionReplay={cycles,returnedToIdle:true,pageErrors:stabilityErrors.length};
  console.log('MSCT15_ACTION_REPLAY_SMOKE_PASS '+cycles+' transitions');
  await stability.close();
}finally{
  await browser.close();
  await mkdir('reports/visual',{recursive:true});
  await writeFile('reports/visual/mascot-device-qa.json',JSON.stringify(report,null,2)+'\n');
}
