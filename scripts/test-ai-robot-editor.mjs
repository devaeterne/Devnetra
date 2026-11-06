import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://localhost:3000/dev/characters',{waitUntil:'networkidle'});
 assert.equal(response?.status(),200);
 await page.getByRole('heading',{name:'AI Robot — Character editor'}).waitFor();
 const original=readFileSync('apps/kids-web/public/assets/characters/devnetra-mimo.glb');
 await page.getByLabel('Choose AI Robot GLB').setInputFiles({name:'mimo-negative.glb',mimeType:'model/gltf-binary',buffer:original});
 await page.getByRole('alert').getByText('Missing required AI Robot part names').waitFor({timeout:15000});
 // Synthetic named-node fixture: exercises contract, not actual Sketchfab GLB certification.
 const jsonLen=original.readUInt32LE(12);
 const doc=JSON.parse(original.subarray(20,20+jsonLen).toString('utf8'));
 const names=['Head','Antenna','Chest','Hips','Neck','MidSpine','LeftArm','RightArm','LeftWheel','RightWheel'];
 names.forEach((name,i)=>doc.nodes[i].name=name);
 const encoded=Buffer.from(JSON.stringify(doc));
 const paddedLen=(encoded.length+3)&~3;
 const binaryTail=original.subarray(20+jsonLen);
 const testModel=Buffer.alloc(20+paddedLen+binaryTail.length,0x20);
 original.copy(testModel,0,0,12);
 testModel.writeUInt32LE(testModel.length,8);
 testModel.writeUInt32LE(paddedLen,12);
 testModel.write('JSON',16,4,'ascii');
 encoded.copy(testModel,20);
 binaryTail.copy(testModel,20+paddedLen);
 await page.getByLabel('Choose AI Robot GLB').setInputFiles({name:'ai-robot-synthetic-contract.glb',mimeType:'model/gltf-binary',buffer:testModel});
 await page.getByRole('status').getByText('3D model loaded').waitFor({timeout:15000});
 assert.equal(await page.locator('canvas').count(),1);
 await page.getByRole('button',{name:'violet',exact:true}).click();
 await page.getByRole('status').getByText('3D model loaded').waitFor({timeout:15000});
 await page.getByLabel('Expression preset').selectOption('thinking');
 await page.getByRole('group',{name:'Robot animation actions'}).getByRole('button',{name:'wave'}).click();
 const output=await page.locator('.dv-ai-robot-preview__output').innerText();
 assert.match(output,/violet · thinking · wave/);
 assert.deepEqual(errors,[]);
 console.log('AI_ROBOT_EDITOR_BROWSER_PASS: negative rejection and synthetic group test; NOT real AI Robot model');
}finally{await browser.close();}

