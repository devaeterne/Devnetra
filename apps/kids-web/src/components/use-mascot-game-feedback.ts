'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import {
  actionDurationMs,applyMascotGameEvent,completeMimo,
  initialMascotGameFeedbackState,transitionMimo,
  type MascotGameEvent,type MimoAction,
} from '@devnetra/characters';

/** Single client-side animation and event pipeline; no XP or child data stored. */
export function useMascotGameFeedback(){
 const [state,setState]=useState(initialMascotGameFeedbackState);
 const current=useRef(state);
 const publish=useCallback((next:typeof state)=>{
  current.current=next;setState(next);
 },[]);
 const dispatch=useCallback((event:MascotGameEvent)=>{
  const decision=applyMascotGameEvent(current.current,event,Date.now());
  if(decision.state!==current.current)publish(decision.state);
  return decision;
 },[publish]);
 const play=useCallback((action:MimoAction)=>{
  const animation=transitionMimo(current.current.animation,action,Date.now(),true);
  publish({...current.current,animation});
 },[publish]);
 useEffect(()=>{
  const animation=state.animation;
  if(animation.action==='idle')return;
  const remaining=Math.max(0,actionDurationMs[animation.action]-(Date.now()-animation.startedAt));
  const timer=window.setTimeout(()=>{
   publish({...current.current,animation:completeMimo(current.current.animation,Date.now())});
  },remaining+12);
  return ()=>window.clearTimeout(timer);
 },[state.animation,publish]);
 return {
  action:state.animation.action,serial:state.animation.serial,play,dispatch,
 };
}
