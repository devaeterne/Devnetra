import {type MimoAction,type MimoEvent,actionForEvent} from './animation.js';

export type MascotLocale='en'|'tr';
export type MascotFeedbackKey='welcome'|'correct'|'great'|'retry'|'hint'|'rest';
export type MascotFeedback=Readonly<{event:MimoEvent;action:MimoAction;key:MascotFeedbackKey;durationMs:number}>;
export const mascotFeedbackCopy:Record<MascotLocale,Record<MascotFeedbackKey,string>>={
  en:{welcome:'Hello, explorer!',correct:'Well done!',great:'Amazing!',retry:'Let’s try again!',hint:'Let’s think together!',rest:'Time for a little break!'},
  tr:{welcome:'Merhaba, kaşif!',correct:'Aferin!',great:'Harika!',retry:'Bir daha deneyelim!',hint:'Beraber düşünelim!',rest:'Biraz mola verelim!'},
};
export const mascotFeedbackKeys:Record<MimoEvent,MascotFeedbackKey>={
  'game.start':'welcome','answer.correct':'correct','answer.wrong':'retry',
  'challenge.complete':'great','hint.request':'hint','break.start':'rest',
};
export function feedbackForEvent(event:MimoEvent):MascotFeedback {
  return {event,key:mascotFeedbackKeys[event],action:actionForEvent(event),durationMs:3200};
}
export function mascotFeedbackText(locale:MascotLocale,key:MascotFeedbackKey):string {
  return mascotFeedbackCopy[locale][key];
}
