import test from 'node:test';
import assert from 'node:assert/strict';
import {
 clearStoredRobotPreferences,defaultStoredRobotPreferences,
 loadStoredRobotPreferences,parseStoredRobotPreferences,
 robotPreferenceStorageKey,saveStoredRobotPreferences,
} from '../dist/index.js';

function memoryStore(){
 const map=new Map();
 return {
  map,
  getItem:key=>map.get(key)??null,
  setItem:(key,value)=>map.set(key,value),
  removeItem:key=>map.delete(key),
 };
}
test('does not persist anything until explicitly saved',()=>{
 const store=memoryStore();
 assert.equal(loadStoredRobotPreferences(store),null);
 assert.equal(store.map.size,0);
 assert.deepEqual(defaultStoredRobotPreferences,{palette:'ocean',expression:'happy',ageTrack:'6-8'});
});
test('round trips only three allowlisted fields with versioned schema',()=>{
 const store=memoryStore();
 assert.equal(saveStoredRobotPreferences(store,{palette:'violet',expression:'thinking',ageTrack:'9-12',childName:'should never persist'}),true);
 const raw=JSON.parse(store.getItem(robotPreferenceStorageKey));
 assert.deepEqual(raw,{version:1,preferences:{palette:'violet',expression:'thinking',ageTrack:'9-12'}});
 assert.deepEqual(loadStoredRobotPreferences(store),{palette:'violet',expression:'thinking',ageTrack:'9-12'});
 assert.equal(clearStoredRobotPreferences(store),true);
 assert.equal(loadStoredRobotPreferences(store),null);
});
test('rejects corrupted records, wrong version and prototype pollution',()=>{
 for(const payload of [
  {version:2,preferences:defaultStoredRobotPreferences},
  {version:1,preferences:{palette:'__proto__',expression:'happy',ageTrack:'6-8'}},
  {version:1,preferences:{palette:'ocean',expression:'bad',ageTrack:'6-8'}},
  {version:1,preferences:{palette:'ocean',expression:'happy',ageTrack:'5-6'}},
  {version:1,preferences:{palette:'ocean',expression:'happy'}},
  [],
  null,
 ])assert.equal(parseStoredRobotPreferences(payload),null);
 const store=memoryStore();
 store.setItem(robotPreferenceStorageKey,'{bad json');
 assert.equal(loadStoredRobotPreferences(store),null);
 store.setItem(robotPreferenceStorageKey,'x'.repeat(1025));
 assert.equal(loadStoredRobotPreferences(store),null);
});
test('storage failures do not crash app and never report a false save',()=>{
 const denied={
  getItem(){throw Error('SecurityError')},
  setItem(){throw Error('QuotaExceededError')},
  removeItem(){throw Error('SecurityError')},
 };
 assert.equal(loadStoredRobotPreferences(denied),null);
 assert.equal(saveStoredRobotPreferences(denied,defaultStoredRobotPreferences),false);
 assert.equal(clearStoredRobotPreferences(denied),false);
 assert.equal(saveStoredRobotPreferences(memoryStore(),{palette:'invalid',expression:'happy',ageTrack:'6-8'}),false);
});
