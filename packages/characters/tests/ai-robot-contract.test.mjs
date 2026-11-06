import test from 'node:test';
import assert from 'node:assert/strict';
import {aiRobotGroups,materialRole,aiRobotMaterialRoles} from '../dist/index.js';
test('source-identified robot groups and all 18 material roles',()=>{
 assert.equal(aiRobotGroups.length,10);
 assert.equal(Object.keys(aiRobotMaterialRoles).length,18);
 for(const name of ['Head','LeftArm','RightArm','LeftWheel','RightWheel','Antenna'])assert.ok(aiRobotGroups.includes(name));
});
test('body recolor does not tint eyes, tires, joints or hands',()=>{
 assert.equal(materialRole('Head'),'shell');
 assert.equal(materialRole('chestMat'),'shell');
 assert.equal(materialRole('EyeBorder'),'accent');
 assert.equal(materialRole('light'),'glow');
 assert.equal(materialRole('Eyes'),'eyes');
 assert.equal(materialRole('Wheelmat'),'preserve');
 assert.equal(materialRole('HandMad'),'preserve');
 assert.equal(materialRole('unknown material'),'preserve');
});
