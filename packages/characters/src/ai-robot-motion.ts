import type {MimoAction} from './animation.js';

/** Bounded deterministic targets; roll action rotates wheels in place, not along a path. */
export type AiRobotMotionPose=Readonly<{
 bob:number;lean:number;turn:number;pitch:number;head:number;
 leftArm:number;rightArm:number;leftWheel:number;rightWheel:number;antenna:number;
}>;
const zero:AiRobotMotionPose={bob:0,lean:0,turn:0,pitch:0,head:0,leftArm:0,rightArm:0,leftWheel:0,rightWheel:0,antenna:0};
export function aiRobotMotionPose(action:MimoAction,seconds:number,reduced=false):AiRobotMotionPose{
 if(reduced||!Number.isFinite(seconds))return zero;
 const t=Math.max(0,seconds),sin=Math.sin;
 switch(action){
 case 'idle':return {...zero,bob:sin(t*1.6)*.018,head:sin(t*1.1)*.024};
 case 'wave':return {...zero,bob:Math.abs(sin(t*3.1))*.034,head:.11,rightArm:2+sin(t*11)*.22,lean:sin(t*3)*.035};
 case 'happy':return {...zero,bob:Math.abs(sin(t*7))*.12,leftArm:-.73,rightArm:.73,head:-.085,lean:sin(t*7)*.055,antenna:sin(t*8)*.09};
 case 'celebrate':return {...zero,bob:Math.abs(sin(t*8.5))*.17,leftArm:-1.95,rightArm:1.95,head:-.095,lean:sin(t*8)*.09,turn:sin(t*4)*.11,antenna:sin(t*9)*.18};
 case 'walk':return {...zero,bob:Math.abs(sin(t*8))*.035,lean:sin(t*4)*.035,turn:sin(t*2.5)*.19,pitch:sin(t*4)*.045,leftWheel:sin(t*7.5)*1.1,rightWheel:sin(t*7.5)*1.1,leftArm:sin(t*4)*.16,rightArm:-sin(t*4)*.16};
 case 'think':return {...zero,head:.21,rightArm:.15,turn:-.08};
 case 'oops':return {...zero,head:-.16,lean:-.09,turn:.08,leftArm:-.12,rightArm:.12};
 case 'sleep':return {...zero,head:-.19,pitch:.06};
 case 'blink':return {...zero,antenna:sin(t*18)*.09};
 }
}
