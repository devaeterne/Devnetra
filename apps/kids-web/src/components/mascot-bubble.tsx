'use client';
import {useEffect,useState} from 'react';
import {type MascotFeedbackKey,type MascotLocale,mascotFeedbackText} from '@devnetra/characters';
export type MascotBubbleMessage=Readonly<{id:number;key:MascotFeedbackKey;durationMs:number}>;
export function MascotBubble({message,locale,onExpire}:{message:MascotBubbleMessage|null;locale:MascotLocale;onExpire:(id:number)=>void}) {
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>setReduced(media.matches);sync();
  media.addEventListener('change',sync);return ()=>media.removeEventListener('change',sync);
 },[]);
 useEffect(()=>{
  if(!message)return;
  const id=window.setTimeout(()=>onExpire(message.id),message.durationMs);
  return ()=>window.clearTimeout(id);
 },[message,onExpire]);
 return <div className="dv-mascot-bubble-slot" aria-live="polite" aria-atomic="true">
    {message&&<div key={message.id} className="dv-mascot-bubble" data-motion={reduced?'reduced':'animated'} role="status">
      {mascotFeedbackText(locale,message.key)}
    </div>}
 </div>;
}
