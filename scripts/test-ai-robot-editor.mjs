import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://localhost:3000/dev/characters',{waitUntil:'networkidle'});
 assert.equal(response?.status(),200);
 await page.getByRole('heading',{name:'AI Robot — Character editor'}).waitFor();
 await page.getByLabel('Choose AI Robot GLB').setInputFiles('apps/kids-web/public/assets/characters/devnetra-mimo.glb');
 await page.getByRole('status').getByText('3D model loaded').waitFor({timeout:15000});
 assert.equal(await page.locator('canvas').count(),1);
 await page.getByRole('button',{name:'violet',exact:true}).click();
 await page.getByRole('status').getByText('3D model loaded').waitFor({timeout:15000});
 await page.getByLabel('Expression preset').selectOption('thinking');
 await page.getByRole('group',{name:'Robot animation actions'}).getByRole('button',{name:'wave'}).click();
 const output=await page.locator('.dv-ai-robot-preview__output').innerText();
 assert.match(output,/violet · thinking · wave/);
 assert.deepEqual(errors,[]);
 console.log('AI_ROBOT_EDITOR_BROWSER_PASS: local GLB, palette, expression, wave');
}finally{await browser.close();}

