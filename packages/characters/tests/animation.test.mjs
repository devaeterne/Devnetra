import test from 'node:test';
import assert from 'node:assert/strict';
import {mimoActions, eventToAction,transitionMimo,completeMimo} from '../dist/index.js';
test('nine actions and mapped game events',()=>{
 assert.equal(mimoActions.length,9);
 assert.equal(eventToAction['challenge.complete'],'celebrate');
});
test('celebration beats low priority and returns to idle',()=>{
 const idle={action:'idle',startedAt:0,serial:0};
 const celebrate=transitionMimo(idle,'celebrate',100);
 assert.equal(transitionMimo(celebrate,'blink',200),celebrate);
 assert.equal(completeMimo(celebrate,500).action,'celebrate');
 assert.equal(completeMimo(celebrate,2900).action,'idle');
});
test('forced user choice overrides priority and restart',()=>{
 const current={action:'celebrate',startedAt:100,serial:3};
 assert.equal(transitionMimo(current,'think',200,true).action,'think');
 assert.equal(transitionMimo(current,'celebrate',200),current);
});
test('clock validation',()=>{
 assert.throws(()=>transitionMimo({action:'idle',startedAt:0,serial:0},'wave',NaN));
});
