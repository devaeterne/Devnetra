import test from 'node:test';import assert from 'node:assert/strict';
import {feedbackForEvent,mascotFeedbackText,transitionMimo,completeMimo} from '../dist/index.js';
test('all six game events mapped to EN/TR encouragement',()=>{
 const events=['game.start','answer.correct','answer.wrong','challenge.complete','hint.request','break.start'];
 for(const event of events){const feedback=feedbackForEvent(event);for(const lang of ['tr','en'])assert.ok(mascotFeedbackText(lang,feedback.key).length>3);assert.ok(feedback.durationMs>=1000);}
 assert.equal(mascotFeedbackText('tr','correct'),'Aferin!');
 assert.equal(mascotFeedbackText('tr','great'),'Harika!');
 assert.equal(feedbackForEvent('answer.wrong').action,'oops');
});
test('priority prevents low-value interruption and action expires',()=>{
 const idle={action:'idle',startedAt:0,serial:0};
 const success=transitionMimo(idle,'celebrate',1000);
 assert.equal(transitionMimo(success,'blink',1200),success);
 assert.equal(completeMimo(success,5000).action,'idle');
});
