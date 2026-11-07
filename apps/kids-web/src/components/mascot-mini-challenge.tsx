'use client';

import {useRef,useState} from 'react';
import type {MascotGameEvent,MascotLocale} from '@devnetra/characters';

const questions={
 en:{title:'Mini learning challenge',prompt:'What is 2 + 3?',hint:'Try counting two and then three more.',correct:'Great! You found five.',wrong:'Try another answer!',next:'Complete challenge',restart:'Play again',choices:[4,5,6]},
 tr:{title:'Mini öğrenme görevi',prompt:'2 + 3 kaç eder?',hint:'İkiden başlayıp üç tane daha say.',correct:'Harika, beşi buldun!',wrong:'Başka bir cevap deneyelim!',next:'Görevi tamamla',restart:'Tekrar oyna',choices:[4,5,6]},
} as const;

export function MascotMiniChallenge({locale,onEvent,onReset}:{
 locale:MascotLocale;
 onEvent:(event:MascotGameEvent)=>void;
 onReset:()=>void;
}){
 const [round,setRound]=useState(1);
 const [solved,setSolved]=useState(false);
 const [finished,setFinished]=useState(false);
 const [attempt,setAttempt]=useState(0);
 const eventNumber=useRef(0);
 const copy=questions[locale];
 const answer=(choice:number)=>{
  if(solved||finished)return;
  const correct=choice===5;
  if(correct)setSolved(true);
  else setAttempt(value=>value+1);
  onEvent({id:'demo.round'+round+'.answer'+(++eventNumber.current),type:correct?'answer.correct':'answer.wrong'});
 };
 const hint=()=>{
  if(solved||finished)return;
  onEvent({id:'demo.round'+round+'.hint',type:'hint.request'});
 };
 const finish=()=>{
  if(!solved||finished)return;
  setFinished(true);
  onEvent({id:'demo.round'+round+'.complete',type:'challenge.complete'});
 };
 const restart=()=>{
  onReset();
  setRound(value=>value+1);setSolved(false);setFinished(false);setAttempt(0);
  onEvent({id:'demo.round'+(round+1)+'.start',type:'game.start'});
 };
 return <section className="dv-mascot-challenge" aria-label="Mini learning challenge">
  <h3>{copy.title}</h3>
  <p>{copy.prompt}</p>
  <div role="group" aria-label="Answer choices" className="dv-mascot-challenge__choices">
   {copy.choices.map(value=><button key={value} type="button" disabled={solved||finished} onClick={()=>answer(value)}>{value}</button>)}
  </div>
  {!solved&&!finished&&<button type="button" onClick={hint}>{locale==='tr'?'İpucu':'Hint'}</button>}
  {solved&&!finished&&<button type="button" onClick={finish}>{copy.next}</button>}
  {finished&&<button type="button" onClick={restart}>{copy.restart}</button>}
  <p role="status" aria-live="polite" className="dv-mascot-challenge__status">
   {finished?(locale==='tr'?'Görev tamamlandı!':'Challenge complete!'):
    solved?copy.correct:attempt>0?copy.wrong:''}
  </p>
  <small>{locale==='tr'?'Yalnızca yerel demo; puan verilmez.':'Local demo only; no XP awarded.'}</small>
 </section>;
}
