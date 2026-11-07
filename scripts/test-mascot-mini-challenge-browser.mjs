import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const url=process.env.DEVNETRA_KIDS_URL||'http://localhost:3101/dev/characters';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox']});
try {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  const response=await page.goto(url,{waitUntil:'domcontentloaded'});
  assert.equal(response?.status(),200);
  await page.getByRole('status').getByText('3D model loaded').waitFor({timeout:18000});
  const challenge=page.getByRole('region',{name:'Mini learning challenge'});
  await challenge.getByRole('button',{name:'4',exact:true}).click();
  assert.equal(await challenge.getByRole('status').innerText(),'Başka bir cevap deneyelim!');
  assert.equal(await page.locator('.dv-mascot-bubble').innerText(),'Bir daha deneyelim!');
  await challenge.getByRole('button',{name:'5',exact:true}).click();
  assert.equal(await challenge.getByRole('status').innerText(),'Harika, beşi buldun!');
  assert.equal(await page.locator('.dv-mascot-bubble').innerText(),'Aferin!');
  assert.equal(await challenge.getByRole('button',{name:'5',exact:true}).isDisabled(),true);
  await challenge.getByRole('button',{name:'Görevi tamamla'}).click();
  assert.equal(await page.locator('.dv-mascot-bubble').innerText(),'Harika!');
  assert.match(await page.locator('.dv-ai-robot-preview__output').innerText(),/celebrate/);
  await challenge.getByRole('button',{name:'Tekrar oyna'}).click();
  assert.match(await page.locator('.dv-ai-robot-preview__output').innerText(),/wave/);
  assert.equal(await challenge.getByRole('button',{name:'5',exact:true}).isDisabled(),false);
  assert.equal(await page.locator('.dv-mascot-bubble').innerText(),'Merhaba, kaşif!');
  await page.getByLabel('Message language').selectOption('en');
  await challenge.getByRole('button',{name:'5',exact:true}).click();
  assert.equal(await page.locator('.dv-mascot-bubble').innerText(),'Well done!');
  assert.equal(await challenge.getByRole('status').innerText(),'Great! You found five.');
  assert.deepEqual(pageErrors,[]);
  console.log('MASCOT_MINI_CHALLENGE_DESKTOP_PASS: wrong/correct/complete/restart/en, no XP');

  const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const mobileErrors=[];mobile.on('pageerror',e=>mobileErrors.push(e.message));
  await mobile.goto(url,{waitUntil:'domcontentloaded'});
  await mobile.getByRole('status').getByText('3D model loaded').waitFor({timeout:18000});
  const mobileChallenge=mobile.getByRole('region',{name:'Mini learning challenge'});
  await mobileChallenge.getByRole('button',{name:'5',exact:true}).click();
  assert.equal(await mobile.locator('.dv-mascot-bubble').innerText(),'Aferin!');
  assert.equal(await mobile.locator('.dv-mascot-bubble').getAttribute('data-motion'),'reduced');
  assert.deepEqual(mobileErrors,[]);
  console.log('MASCOT_MINI_CHALLENGE_MOBILE_REDUCED_MOTION_PASS');
} finally {await browser.close()}
