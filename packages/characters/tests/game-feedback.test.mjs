import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyMascotGameEvent,
  initialMascotGameFeedbackState,
  settleMascotGameFeedback,
} from '../dist/index.js';

test('one logical correct answer is acknowledged only once',()=>{
  const start=initialMascotGameFeedbackState();
  const event={id:'round-01:answer-01',type:'answer.correct'};
  const first=applyMascotGameEvent(start,event,1000);
  assert.equal(first.status,'accepted');
  assert.equal(first.state.feedback?.value.key,'correct');
  const repeat=applyMascotGameEvent(first.state,event,1200);
  assert.equal(repeat.status,'duplicate');
  assert.equal(repeat.state,first.state);
  assert.equal(repeat.state.animation.serial,1);
});

test('lower priority event cannot replace an active celebration bubble',()=>{
  const done=applyMascotGameEvent(initialMascotGameFeedbackState(),{
    id:'round-01:completed',type:'challenge.complete',
  },1000);
  const denied=applyMascotGameEvent(done.state,{
    id:'round-01:hint',type:'hint.request',
  },1100);
  assert.equal(denied.status,'suppressed');
  assert.equal(denied.state.animation.action,'celebrate');
  assert.equal(denied.state.feedback?.value.key,'great');
  assert.equal(applyMascotGameEvent(denied.state,{
    id:'round-01:hint',type:'hint.request',
  },5000).status,'duplicate');
});

test('expired animation returns to idle and a new event may be accepted',()=>{
  const first=applyMascotGameEvent(initialMascotGameFeedbackState(),{
    id:'round:done',type:'challenge.complete',
  },1000).state;
  assert.equal(settleMascotGameFeedback(first,1500),first);
  const idle=settleMascotGameFeedback(first,4000);
  assert.equal(idle.animation.action,'idle');
  assert.equal(idle.feedback?.value.key,'great');
  const next=applyMascotGameEvent(idle,{
    id:'round-02:start',type:'game.start',
  },4100);
  assert.equal(next.status,'accepted');
  assert.equal(next.state.animation.action,'wave');
});

test('caps event-ID memory and rejects invalid IDs or clocks',()=>{
  let state=initialMascotGameFeedbackState();
  for(let i=0;i<100;i++){
    state=applyMascotGameEvent(state,{
      id:'round:'+i,type:'answer.correct',
    },i*3000).state;
  }
  assert.equal(state.recentIds.length,64);
  assert.equal(state.recentIds[0],'round:36');
  assert.throws(()=>applyMascotGameEvent(state,{
    id:'child name or email@domain.com',type:'game.start',
  },100),/Invalid mascot event ID/);
  assert.throws(()=>applyMascotGameEvent(state,{
    id:'valid',type:'game.start',
  },Number.NaN),/clock/);
});
