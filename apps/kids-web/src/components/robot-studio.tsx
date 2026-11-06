'use client';
import {useState} from 'react';
import {CharacterPlayground} from './character-playground';
import {AiRobotPreview} from './ai-robot-preview';
export function RobotStudio() {
 const [active,setActive]=useState<'ai'|'mimo'>('ai');
 return <main className="dv-robot-studio">
  <div className="dv-robot-studio__tabs" role="group" aria-label="Choose mascot preview">
   <button type="button" aria-pressed={active==='ai'} onClick={()=>setActive('ai')}>AI Robot candidate</button>
   <button type="button" aria-pressed={active==='mimo'} onClick={()=>setActive('mimo')}>Mimo animation engine</button>
  </div>
  {active==='ai'?<AiRobotPreview/>:<CharacterPlayground/>}
 </main>;
}
