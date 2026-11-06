export const mimoActions = ['idle','wave','think','happy','celebrate','walk','blink','oops','sleep'] as const;
export type MimoAction = typeof mimoActions[number];
export type MimoEvent = 'game.start' | 'answer.correct' | 'answer.wrong' | 'challenge.complete' | 'hint.request' | 'break.start';
export const eventToAction: Record<MimoEvent,MimoAction> = {
  'game.start':'wave', 'answer.correct':'happy', 'answer.wrong':'oops',
  'challenge.complete':'celebrate', 'hint.request':'think', 'break.start':'sleep',
};
export const actionDurationMs:Record<MimoAction,number> = {
  idle:0,wave:2300,think:2600,happy:1600,celebrate:2800,walk:4000,blink:1000,oops:1500,sleep:4000,
};
export const actionPriority:Record<MimoAction,number> = {
  idle:0,blink:1,walk:1,think:2,sleep:2,wave:2,happy:3,oops:3,celebrate:4,
};
export type AnimationState = Readonly<{ action:MimoAction; startedAt:number; serial:number }>;
export function transitionMimo(current:AnimationState,next:MimoAction,now:number,force=false):AnimationState {
  if(!Number.isFinite(now)||now<0)throw Error('Invalid animation clock');
  const expired = current.action==='idle' || now-current.startedAt>=actionDurationMs[current.action];
  if(!force && !expired && actionPriority[next]<actionPriority[current.action])return current;
  if(!force && !expired && next===current.action)return current;
  return {action:next,startedAt:now,serial:current.serial+1};
}
export function completeMimo(state:AnimationState,now:number):AnimationState {
  if(state.action==='idle'||now-state.startedAt<actionDurationMs[state.action])return state;
  return {action:'idle',startedAt:now,serial:state.serial+1};
}
export function actionForEvent(event:MimoEvent):MimoAction {return eventToAction[event];}
