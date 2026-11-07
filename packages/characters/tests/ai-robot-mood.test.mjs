import test from 'node:test';
import assert from 'node:assert/strict';
import {aiRobotMoodFor,aiRobotMoodLight} from '../dist/index.js';
test('active action overrides idle user personality',()=>{
 assert.equal(aiRobotMoodFor('celebrate','sleepy'),'celebration');
 assert.equal(aiRobotMoodFor('sleep','happy'),'sleepy');
 assert.equal(aiRobotMoodFor('wave','oops'),'cheerful');
 assert.equal(aiRobotMoodFor('idle','thinking'),'curious');
 assert.equal(aiRobotMoodFor('idle','cool'),'cool');
});
test('all moods remain within bounded source-emissive multipliers',()=>{
 for(const v of Object.values(aiRobotMoodLight)){
  assert.ok(v.eye>=.2&&v.eye<=2.1);
  assert.ok(v.antenna>=.2&&v.antenna<=2.1);
  assert.ok(v.pulse>=0&&v.pulse<=.3);
 }
});
