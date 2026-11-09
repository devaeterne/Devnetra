import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox']});
const url=process.env.DEVNETRA_KIDS_URL??'http://localhost:3102/dev/characters';
const checkPlay=async(page,expected)=>{
 const task=page.getByRole('region',{name:'Mini learning challenge'});
 await task.getByRole('button',{name:'5',exact:true}).click();
 assert.equal(await page.locator('.dv-mascot-bubble').innerText(),'Aferin!');
 assert.equal(await task.getByRole('status').innerText(),'Harika, beşi buldun!');
 assert.equal(await page.locator('.dv-ai-robot-preview__frame').getAttribute('data-robot-mode'),expected);
};
try {
 const normal=await browser.newPage({viewport:{width:1180,height:800}});
 const errors=[];normal.on('pageerror',e=>errors.push(e.message));
 await normal.goto(url,{waitUntil:'domcontentloaded'});
 await normal.getByText('3D model loaded',{exact:true}).waitFor({timeout:20000});
 assert.equal(await normal.locator('[data-mascot-fallback]').count(),0);
 assert.equal(await normal.locator('canvas').count(),1);
 assert.deepEqual(errors,[]);
 console.log('MSCT14_NORMAL_3D_PASS');

 const missing=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const missingErrors=[];missing.on('pageerror',e=>missingErrors.push(e.message));
 await missing.route('**/assets/characters/ai-robot.glb',route=>route.fulfill({status:404,body:'Missing model'}));
 await missing.goto(url,{waitUntil:'domcontentloaded'});
 await missing.locator('.dv-ai-robot-preview__frame').scrollIntoViewIfNeeded();
 await missing.locator('.dv-ai-robot-preview__status').getByText(/^2D mode:/).waitFor({timeout:20000});
 assert.equal(await missing.locator('[data-mascot-fallback="2d"]').count(),1);
 assert.equal(await missing.locator('canvas').count(),0);
 await checkPlay(missing,'fallback');
 await missing.unroute('**/assets/characters/ai-robot.glb');
 await missing.getByRole('button',{name:'3D tekrar dene'}).click();
 await missing.getByText('3D model loaded',{exact:true}).waitFor({timeout:20000});
 assert.equal(await missing.locator('[data-mascot-fallback]').count(),0);
 assert.deepEqual(missingErrors,[]);
 console.log('MSCT14_GLB_FAILURE_RECOVERY_MOBILE_PASS');

 const noWebgl=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await noWebgl.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){
   if(type==='webgl2'||type==='webgl'||type==='experimental-webgl')return null;
   return original.call(this,type,...args);
  };
 });
 const noGlErrors=[];noWebgl.on('pageerror',e=>noGlErrors.push(e.message));
 await noWebgl.goto(url,{waitUntil:'domcontentloaded'});
 await noWebgl.locator('.dv-ai-robot-preview__frame').scrollIntoViewIfNeeded();
 await noWebgl.getByText('2D mode: WebGL unavailable').waitFor({timeout:15000});
 assert.equal(await noWebgl.locator('canvas').count(),0);
 await checkPlay(noWebgl,'fallback');
 assert.deepEqual(noGlErrors,[]);
 console.log('MSCT14_WEBGL_UNAVAILABLE_MOBILE_PASS');

 const lost=await browser.newPage({viewport:{width:1280,height:850}});
 const lostErrors=[];lost.on('pageerror',e=>lostErrors.push(e.message));
 await lost.goto(url,{waitUntil:'domcontentloaded'});
 await lost.getByText('3D model loaded',{exact:true}).waitFor({timeout:20000});
 await lost.locator('canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
 await lost.getByText('2D mode: 3D graphics context lost').waitFor({timeout:15000});
 assert.equal(await lost.locator('[data-mascot-fallback="2d"]').count(),1);
 assert.equal(await lost.locator('canvas').count(),0);
 await checkPlay(lost,'fallback');
 assert.deepEqual(lostErrors,[]);
 console.log('MSCT14_WEBGL_CONTEXT_LOST_PASS');
} finally {await browser.close()}
