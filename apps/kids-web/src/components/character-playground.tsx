'use client';

import {useState} from 'react';
import {DvButton,DvCard} from '@devnetra/ui-web';
import {DvIcon} from '@devnetra/icons';
import {mimoActions, type MimoAction, type MimoEvent} from '@devnetra/characters';
import {DvCharacter3D} from './dv-character-3d';
import {useMimoAnimation} from './use-mimo-animation';

const labels:Record<MimoAction,string>={idle:'Idle',wave:'Wave',think:'Think',happy:'Happy',celebrate:'Celebrate',walk:'Walk',blink:'Blink',oops:'Oops',sleep:'Sleep'};
const eventLabels:Record<MimoEvent,string>={
  'game.start':'Game started',
  'answer.correct':'Correct answer',
  'answer.wrong':'Wrong answer',
  'challenge.complete':'Challenge completed',
  'hint.request':'Hint requested',
  'break.start':'Time to rest',
};
export function CharacterPlayground(){
 const controller=useMimoAnimation();
 const [speed,setSpeed]=useState(1);
 const [brightness,setBrightness]=useState(1.05);
 return <main className="dv-playground">
  <header className="dv-playground__header"><p className="dv-eyebrow">Devnetra / Internal tools</p><h1>Meet Mimo</h1><p>Try the original 3D mascot, its actions and the events triggered by a learning game.</p></header>
  <div className="dv-playground__layout">
   <DvCard>
    <div className="dv-playground__stage">
      <DvCharacter3D label="Mimo, Devnetra Kids robot" action={controller.action} serial={controller.serial} speed={speed} brightness={brightness}/>
      <p className="dv-playground__status" role="status" aria-live="polite">Now playing: <strong>{labels[controller.action]}</strong></p>
    </div>
   </DvCard>
   <DvCard>
    <h2>Animations</h2>
    <div className="dv-playground__buttons">
      {mimoActions.map(action=><DvButton key={action} type="button" aria-pressed={controller.action===action} variant={controller.action===action?'primary':'ghost'} onClick={()=>controller.play(action,true)}>{labels[action]}</DvButton>)}
    </div>
    <label className="dv-playground__slider">Speed: {speed.toFixed(1)}×
      <input type="range" min=".5" max="2" step=".1" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/>
    </label>
    <label className="dv-playground__slider">Studio lighting: {brightness.toFixed(1)}×
      <input type="range" min=".6" max="1.8" step=".1" value={brightness} onChange={e=>setBrightness(Number(e.target.value))}/>
    </label>
    <h2>Learning events</h2>
    <div className="dv-playground__buttons">
      {(Object.keys(eventLabels) as MimoEvent[]).map(event=><DvButton type="button" key={event} variant="secondary" icon={<DvIcon name="sparkles" size={18}/>} onClick={()=>controller.react(event)}>{eventLabels[event]}</DvButton>)}
    </div>
    <p className="dv-playground__note">Short actions return to Idle automatically. Higher-priority celebrations cannot be interrupted by low-priority events. Direct animation buttons override priority for preview.</p>
   </DvCard>
  </div>
 </main>;
}
