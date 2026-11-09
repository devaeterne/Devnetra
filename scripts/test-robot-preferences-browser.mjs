import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const url=process.env.DEVNETRA_KIDS_URL??'http://localhost:3000/dev/characters';
const storageKey='devnetra.kids.robot.preferences.v1';
const browser=await chromium.launch({
 channel:'chrome',headless:true,
 args:['--enable-webgl','--use-angle=swiftshader','--disable-gpu-sandbox'],
});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.getByRole('heading',{name:'AI Robot — Character editor'}).waitFor();
 const prefs=page.getByRole('region',{name:'Parent-managed robot preferences'});
 const save=prefs.getByRole('button',{name:'Bu cihaza kaydet'});
 const reset=prefs.getByRole('button',{name:'Yerel ayarları sıfırla'});
 assert.equal(await save.isDisabled(),true);
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),storageKey),null);

 await prefs.getByRole('group',{name:'Robot color palette'}).getByRole('button',{name:'violet',exact:true}).click();
 await prefs.getByLabel('Expression preset').selectOption('thinking');
 await prefs.getByLabel('Learning age track').selectOption('9-12');
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),storageKey),null,
  'Live preference changes may not write before adult approval');
 await prefs.getByRole('checkbox').check();
 assert.equal(await save.isDisabled(),false);
 await save.click();
 const actual=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),storageKey);
 assert.deepEqual(actual,{version:1,preferences:{palette:'violet',expression:'thinking',ageTrack:'9-12'}});
 assert.equal(await prefs.getByRole('checkbox').isChecked(),false);
 console.log('MSCT13_PARENT_APPROVED_DEVICE_SAVE_PASS');

 await page.reload({waitUntil:'domcontentloaded'});
 await prefs.getByRole('button',{name:'violet',exact:true}).waitFor();
 assert.equal(await prefs.getByRole('button',{name:'violet',exact:true}).getAttribute('aria-pressed'),'true');
 assert.equal(await prefs.getByLabel('Expression preset').inputValue(),'thinking');
 assert.equal(await prefs.getByLabel('Learning age track').inputValue(),'9-12');
 console.log('MSCT13_RELOAD_HYDRATION_PASS');

 await reset.click();
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),storageKey),null);
 assert.equal(await prefs.getByRole('button',{name:'ocean',exact:true}).getAttribute('aria-pressed'),'true');
 assert.equal(await prefs.getByLabel('Expression preset').inputValue(),'happy');
 assert.equal(await prefs.getByLabel('Learning age track').inputValue(),'6-8');
 console.log('MSCT13_LOCAL_RESET_PASS');

 await page.evaluate(k=>localStorage.setItem(k,'{invalid'),storageKey);
 await page.reload({waitUntil:'domcontentloaded'});
 await prefs.getByRole('button',{name:'ocean',exact:true}).waitFor();
 assert.equal(await prefs.getByRole('button',{name:'ocean',exact:true}).getAttribute('aria-pressed'),'true');
 console.log('MSCT13_CORRUPT_STORAGE_SAFE_DEFAULT_PASS');

 assert.deepEqual(errors,[]);
}finally{await browser.close()}
