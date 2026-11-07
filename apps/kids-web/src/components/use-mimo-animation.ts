'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import {type MimoAction,type MimoEvent, actionForEvent, completeMimo, transitionMimo, type AnimationState, actionDurationMs} from '@devnetra/characters';

export function useMimoAnimation() {
 const [state,setState]=useState<AnimationState>({action:'idle',startedAt:0,serial:0});
 const stateRef=useRef(state);
 useEffect(()=>{stateRef.current=state},[state]);
 const play=useCallback((next:MimoAction,force=false)=>{
   const now=Date.now();
   const value=transitionMimo(stateRef.current,next,now,force);
   const accepted=value!==stateRef.current;
   stateRef.current=value;
   setState(value);
   return accepted;
 },[]);
 const react=useCallback((event:MimoEvent)=>play(actionForEvent(event)),[play]);
 useEffect(()=>{
   if(state.action==='idle')return;
   const remaining=Math.max(0,actionDurationMs[state.action]-(Date.now()-state.startedAt));
   const timer=window.setTimeout(()=>{
     const next=completeMimo(stateRef.current,Date.now());
     stateRef.current=next;
     setState(next);
   },remaining+10);
   return ()=>window.clearTimeout(timer);
 },[state]);
 return {action:state.action,serial:state.serial,play,react};
}
