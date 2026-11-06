import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const base=process.env.DEVNETRA_KIDS_URL ?? 'http://localhost:3000';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox']});
const errors=[];
try {
  const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'/dev/characters',{waitUntil:'networkidle',timeout:30000});
  assert.equal(response?.status(),200,'development-only Playground must be available on dev server');
  await page.getByRole('heading',{name:'Meet Mimo'}).waitFor();
  await page.locator('canvas').waitFor({timeout:15000});
  await page.locator('.dv-mimo__fallback').waitFor({state:'detached',timeout:15000});
  assert.equal(await page.locator('canvas').count(),1);
  const webgl=await page.locator('canvas').evaluate((canvas)=>Boolean(canvas.getContext('webgl2')||canvas.getContext('webgl')));
  assert.equal(webgl,true,'WebGL required for 3D acceptance');
  mkdirSync('reports/visual',{recursive:true});
  await page.locator('.dv-mimo').screenshot({path:'reports/visual/mimo-idle.png'});
  await page.getByRole('button',{name:'Wave',exact:true}).click();
  await page.getByRole('status').getByText('Wave').waitFor({timeout:4000});
  await page.waitForTimeout(320);
  await page.locator('.dv-mimo').screenshot({path:'reports/visual/mimo-wave.png'});
  await page.getByRole('button',{name:'Celebrate',exact:true}).click();
  await page.getByRole('status').getByText('Celebrate').waitFor({timeout:4000});
  await page.getByRole('button',{name:'Wrong answer'}).click();
  assert.match(await page.getByRole('status').innerText(),/Celebrate/,'lower-priority game event interrupted celebration');
  await page.getByRole('slider',{name:/Speed/}).fill('1.8');
  await page.getByRole('slider',{name:/Studio lighting/}).fill('1.7');
  assert.equal(await page.getByRole('slider',{name:/Studio lighting/}).inputValue(),'1.7');
  await page.waitForTimeout(450);
  await page.locator('.dv-mimo').screenshot({path:'reports/visual/mimo-celebrate-bright.png'});
  assert.deepEqual(errors,[],'browser uncaught runtime errors');
  console.log('MIMO_BROWSER_PASS: 3D/WebGL, Wave, Celebrate priority, Speed, Lighting, screenshots');
} finally {
  await browser.close();
}
