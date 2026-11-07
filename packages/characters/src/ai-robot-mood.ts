import type {MimoAction} from './animation.js';
import type {RobotExpression} from './personalization.js';

/** Source Eyes uses emissiveTexture with strength ~10; these bounded multipliers
 * preserve that texture and prevent glare. Source light uses emissive ~9. */
export type AiRobotMood='neutral'|'cheerful'|'celebration'|'curious'|'surprised'|'sleepy'|'oops'|'cool';
export const aiRobotMoodLight:Record<AiRobotMood,Readonly<{eye:number;antenna:number;pulse:number}>>={
 neutral:{eye:1.3,antenna:1.1,pulse:.03},
 cheerful:{eye:1.7,antenna:1.65,pulse:.14},
 celebration:{eye:1.9,antenna:2.0,pulse:.28},
 curious:{eye:1.15,antenna:1.3,pulse:.1},
 surprised:{eye:1.85,antenna:1.6,pulse:.14},
 sleepy:{eye:.25,antenna:.25,pulse:.02},
 oops:{eye:.8,antenna:.65,pulse:.08},
 cool:{eye:1.5,antenna:1.05,pulse:.04},
};
export function aiRobotMoodFor(action:MimoAction,expression:RobotExpression):AiRobotMood{
 const actionMood:Partial<Record<MimoAction,AiRobotMood>>={
  wave:'cheerful',happy:'cheerful',celebrate:'celebration',
  think:'curious',oops:'oops',sleep:'sleepy',blink:'sleepy',walk:'neutral',
 };
 if(action!=='idle')return actionMood[action]??'neutral';
 const expressionMood:Record<RobotExpression,AiRobotMood>={
  happy:'cheerful',thinking:'curious',excited:'celebration',surprised:'surprised',
  sleepy:'sleepy',cool:'cool',oops:'oops',celebrate:'celebration',
 };
 return expressionMood[expression];
}
