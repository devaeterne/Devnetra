import assert from 'node:assert/strict';
import {existsSync,readFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const file=process.env.AI_ROBOT_GLB_FILE;
if(!file||!existsSync(file)) {
 console.error('Use AI_ROBOT_GLB_FILE=/private/path/ai_robot.glb pnpm test:ai-robot-real');
 process.exit(2);
}
const bytes=readFileSync(file);
assert.equal(createHash('sha256').update(bytes).digest('hex'),'e6cff59131f0100016f7b08079dd3170968bebb728666d7d26615d31401018cd','Unexpected AI Robot file version');
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:1280,height:920}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const res=await page.goto(process.env.DEVNETRA_KIDS_URL??'http://localhost:3000/dev/characters',{waitUntil:'networkidle'});
 assert.equal(res?.status(),200);
 await page.getByLabel('Choose AI Robot GLB').setInputFiles(file);
 await page.getByRole('status').getByText('3D model loaded').waitFor({timeout:20000});
 assert.equal(await page.locator('canvas').count(),1);
 mkdirSync('reports/visual',{recursive:true});
 const frame=page.locator('.dv-ai-robot-preview__frame');
 const colors=['ocean','violet','candy','lime','sunshine'];
 const shots=[];
 for(const name of colors) {
  await page.getByRole('button',{name,exact:true}).click();
  assert.equal(await page.locator('.dv-ai-robot-preview__status').innerText(),'3D model loaded','Palette changes must not reload GLB');
  await page.waitForTimeout(240);
  const shot=await frame.screenshot({path:'reports/visual/ai-robot-real-'+name+'.png'});
  shots.push(shot);
 }
 assert.ok(shots.some((x,i)=>i>0&&!x.equals(shots[0])),'Real color palettes not changing appearance');
 await page.getByRole('button',{name:'ocean',exact:true}).click();
 await page.getByRole('group',{name:'Robot animation actions'}).getByRole('button',{name:'idle'}).click();
 await page.waitForTimeout(240);
 const idle=await frame.screenshot({path:'reports/visual/ai-robot-real-idle.png'});
 await page.getByRole('group',{name:'Robot animation actions'}).getByRole('button',{name:'wave'}).click();
 await page.waitForTimeout(460);
 const wave=await frame.screenshot({path:'reports/visual/ai-robot-real-wave.png'});
 await page.getByRole('group',{name:'Robot animation actions'}).getByRole('button',{name:'celebrate'}).click();
 await page.waitForTimeout(530);
 const celebrate=await frame.screenshot({path:'reports/visual/ai-robot-real-celebrate.png'});
 assert.ok(!idle.equals(wave)&&!wave.equals(celebrate),'Motion screenshots must be visually distinct');
 assert.deepEqual(errors,[],'No page-level runtime errors');
 console.log('AI_ROBOT_REAL_BROWSER_PASS: actual GLB hash, 5 palette screenshots, wave/celebrate, no reloading; visual human review still required');
}finally{await browser.close()}
