'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { assetRegistry } from '@devnetra/assets';
import {type RobotPalette,type RobotExpression,robotPalettes,robotExpressions,defaultRobotPreferences,mimoActions,type MimoEvent,type MascotGameEvent, type MascotLocale} from '@devnetra/characters';
import {useMascotGameFeedback} from './use-mascot-game-feedback';
import {MascotMiniChallenge} from './mascot-mini-challenge';
import {MascotBubble, type MascotBubbleMessage} from './mascot-bubble';

const modelId='f7c4e4dcd1594e3e92b2d35a4ec8a93a';
const AiRobotCanvas=dynamic(()=>import('./ai-robot-canvas').then(mod=>mod.AiRobotCanvas),{ssr:false});
const configuredUrl=process.env.NEXT_PUBLIC_ROBOT_MODEL_URL?.trim()??'';
const allowedUrl=(()=>{if(!configuredUrl)return '';try{const u=new URL(configuredUrl);return u.protocol==='https:'&&u.pathname.toLowerCase().endsWith('.glb')?u.href:''}catch{return ''}})();
const expressionLabels:Record<RobotExpression,string>={happy:'Happy',thinking:'Thinking',excited:'Excited',surprised:'Surprised',sleepy:'Sleepy',cool:'Cool',oops:'Oops',celebrate:'Celebrate'};
export function AiRobotPreview() {
  const [palette,setPalette]=useState<RobotPalette>(defaultRobotPreferences.palette);
  const [expression,setExpression]=useState<RobotExpression>(defaultRobotPreferences.expression);
  const animation=useMascotGameFeedback();
  const [locale,setLocale]=useState<MascotLocale>('tr');
  const [bubble,setBubble]=useState<MascotBubbleMessage|null>(null);
  const expireBubble=useCallback((id:number)=>setBubble(current=>current?.id===id?null:current),[]);
  const bubbleSeq=useRef(0);
  const manualEventSeq=useRef(0);
  const events:ReadonlyArray<{event:MimoEvent;tr:string;en:string}>=[
    {event:'game.start',tr:'Oyuna başla',en:'Start game'},
    {event:'answer.correct',tr:'Doğru cevap',en:'Correct answer'},
    {event:'answer.wrong',tr:'Tekrar dene',en:'Try again'},
    {event:'challenge.complete',tr:'Görev tamamlandı',en:'Challenge complete'},
    {event:'hint.request',tr:'İpucu iste',en:'Request hint'},
    {event:'break.start',tr:'Mola',en:'Break'},
  ];
  function triggerGameEvent(event:MascotGameEvent){
    const decision=animation.dispatch(event);
    if(decision.status==='accepted'&&decision.state.feedback){
      const value=decision.state.feedback.value;
      setBubble({id:++bubbleSeq.current,key:value.key,durationMs:value.durationMs});
    }
  }
  function trigger(event:MimoEvent){
    triggerGameEvent({id:'studio.manual'+(++manualEventSeq.current),type:event});
  }
  const [localUrl,setLocalUrl]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [error,setError]=useState('');
  const previous=useRef<string|null>(null);
  const src=localUrl||allowedUrl||assetRegistry['kids.robot.ai-robot'].bundledPath||'';

  useEffect(()=>()=>{if(previous.current)URL.revokeObjectURL(previous.current)},[]);
  function choose(file:File|undefined){
    if(!file)return;
    if(!file.name.toLowerCase().endsWith('.glb')||file.size>30*1024*1024){
      setError('Choose a valid .glb file under 30 MB');return;
    }
    if(previous.current)URL.revokeObjectURL(previous.current);
    const url=URL.createObjectURL(file);previous.current=url;
    setLoaded(false);setError('');setLocalUrl(url);
  }
  return <section className="dv-ai-robot-preview" aria-label="AI Robot character editor">
    <header><h2>AI Robot — Character editor</h2><p>Source: AI Robot by Noores on Sketchfab. Model is bundled for preview, and colors/actions work directly without uploading a file.</p></header>
    <div className="dv-ai-robot-preview__frame" data-robot-mode={src?'editable':'external'}>
      {src?<div className="dv-ai-robot-preview__canvas"><AiRobotCanvas src={src} palette={palette} expression={expression} action={animation.action} serial={animation.serial} onLoaded={()=>{setLoaded(true);setError('')}} onError={reason=>{setError(reason);setLoaded(false)}}/><span role="status" className="dv-ai-robot-preview__status">{loaded?'3D model loaded':error||'Loading 3D model…'}</span>
        <MascotBubble message={bubble} locale={locale} onExpire={expireBubble}/>
      </div>:
      <iframe title="AI Robot by Noores on Sketchfab" src={'https://sketchfab.com/models/'+modelId+'/embed?autostart=0&ui_theme=dark'} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/>}
    </div>
    <a href={'https://sketchfab.com/3d-models/ai-robot-'+modelId} target="_blank" rel="noopener noreferrer">Open original model on Sketchfab</a>
    <label className="dv-ai-robot-preview__label">Optional: preview another authorized .glb file (up to 30 MB)
      <input aria-label="Choose AI Robot GLB" type="file" accept=".glb,model/gltf-binary" onChange={event=>choose(event.target.files?.[0])}/>
    </label>
    <p>The bundled AI Robot loads automatically. An optional custom file remains local to your browser session. No file upload is required.</p>
    {error&&<p role="alert">{error}</p>}
    <h3>Robot colors</h3>
    <div className="dv-ai-robot-preview__colors" role="group" aria-label="Robot color palette">
      {(Object.keys(robotPalettes) as RobotPalette[]).map(name=><button key={name} type="button" aria-pressed={palette===name} onClick={()=>setPalette(name)}><span className="dv-ai-robot-preview__swatch" style={{background:robotPalettes[name].shell}}/>{name}</button>)}
    </div>
    <label className="dv-ai-robot-preview__label">Expression preset
      <select value={expression} onChange={event=>setExpression(event.target.value as RobotExpression)}>
        {robotExpressions.map(v=><option key={v} value={v}>{expressionLabels[v]}</option>)}
      </select>
    </label>
    <h3>Motion preview</h3>
    <div className="dv-ai-robot-preview__colors" role="group" aria-label="Robot animation actions">
     {mimoActions.map(v=><button type="button" key={v} aria-pressed={animation.action===v} onClick={()=>animation.play(v)}>{v}</button>)}
    </div>
    <h3>Game reactions & speech bubbles</h3>
    <label className="dv-ai-robot-preview__label">Message language
      <select aria-label="Message language" value={locale} onChange={e=>setLocale(e.target.value as MascotLocale)}>
        <option value="tr">Türkçe</option><option value="en">English</option>
      </select>
    </label>
    <div className="dv-ai-robot-preview__colors" role="group" aria-label="Game reaction events">
      {events.map(({event,tr,en})=><button type="button" key={event} onClick={()=>trigger(event)}>{locale==='tr'?tr:en}</button>)}
    </div>
    <MascotMiniChallenge locale={locale} onEvent={triggerGameEvent} onReset={()=>{animation.play("idle");setBubble(null)}}/>
    <output className="dv-ai-robot-preview__output">Selected: {palette} · {expression} · {animation.action}</output>
    <p>Expressions drive the robot's animated face texture and physical pose. This playground is developer-only; real learning products and XP are not connected yet.</p>
  </section>;
}
