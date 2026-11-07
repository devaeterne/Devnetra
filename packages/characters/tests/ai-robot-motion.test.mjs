import test from 'node:test';
import assert from 'node:assert/strict';
import {mimoActions,aiRobotMotionPose} from '../dist/index.js';
test('all poses bounded and finite for long sessions',()=>{
 for(const action of mimoActions){
  for(const sec of [0,.1,.3,1,10,100,10000]){
   const pose=aiRobotMotionPose(action,sec);
   for(const [name,value] of Object.entries(pose)){
    assert.ok(Number.isFinite(value),action+'.'+name+' invalid');
    assert.ok(Math.abs(value)<=2.25,action+'.'+name+' exceeded safe angle or offset');
   }
   assert.deepEqual(pose,aiRobotMotionPose(action,sec));
  }
 }
});
test('rolling animates both wheels and returns to idle without drift',()=>{
 const moving=aiRobotMotionPose('walk',.3);
 assert.ok(Math.abs(moving.leftWheel)>.1);
 assert.equal(moving.leftWheel,moving.rightWheel);
 assert.equal(aiRobotMotionPose('idle',0).leftWheel,0);
 assert.equal(aiRobotMotionPose('idle',0).rightWheel,0);
 assert.ok(aiRobotMotionPose('celebrate',.3).leftArm<-.5);
 assert.ok(aiRobotMotionPose('happy',.3).rightArm>.5);
});
test('reduced motion zeroes all physical displacement',()=>{
 for(const action of mimoActions)assert.ok(Object.values(aiRobotMotionPose(action,3,true)).every(v=>v===0));
 assert.ok(Object.values(aiRobotMotionPose('walk',Number.NaN)).every(v=>v===0));
});
