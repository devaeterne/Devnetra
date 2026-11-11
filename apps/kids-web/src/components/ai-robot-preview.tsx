'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { assetRegistry } from '@devnetra/assets';
import {mimoActions,type MimoEvent,type MascotGameEvent, type MascotLocale} from '@devnetra/characters';
import {useMascotGameFeedback} from './use-mascot-game-feedback';
import {MascotMiniChallenge} from './mascot-mini-challenge';
import {MascotBubble, type MascotBubbleMessage} from './mascot-bubble';
import {AiRobotFallback,AiRobotErrorBoundary,hasWebGLSupport} from './ai-robot-fallback';
import {RobotPreferenceControls,useRobotLocalPreferences} from './robot-preference-controls';

const modelId='f7c4e4dcd1594e3e92b2d35a4ec8a93a';
const AiRobotCanvas=dynamic(()=>import('./ai-robot-canvas').then(mod=>mod.AiRobotCanvas),{ssr:false});
const configuredUrl=process.env.NEXT_PUBLIC_ROBOT_MODEL_URL?.trim()??'';
const allowedUrl=(()=>{if(!configuredUrl)return '';try{const u=new URL(configuredUrl);return u.protocol==='https:'&&u.pathname.toLowerCase().endsWith('.glb')?u.href:''}catch{return ''}})();
export function AiRobotPreview() {
  const preferenceController=useRobotLocalPreferences();
  const {palette,expression}=preferenceController.preferences;
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
  const [webgl,setWebgl]=useState<'checking'|'supported'|'unsupported'>('checking');
  const [retryKey,setRetryKey]=useState(0);
  const fail=useCallback((reason:string)=>{setError(current=>current||reason);setLoaded(false)},[]);
  useEffect(()=>{setWebgl(hasWebGLSupport()?'supported':'unsupported')},[retryKey]);
  function retry(){
    setLoaded(false);setError('');setRetryKey(value=>value+1);
  }
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
    setRetryKey(value=>value+1);
  }
  return <section className="dv-ai-robot-preview" aria-label="AI Robot character editor">
    <header><h2>AI Robot — Character editor</h2><p>Source: AI Robot by Noores on Sketchfab. Model is bundled for preview, and colors/actions work directly without uploading a file.</p></header>
    <div className="dv-ai-robot-preview__frame" data-robot-mode={src&&webgl==='supported'&&!error?'editable':'fallback'}>
      <div className="dv-ai-robot-preview__canvas">
        {(!loaded||error||webgl!=='supported')&&<AiRobotFallback label={locale==='tr'?'Sevimli robot maskot':'Friendly robot mascot'}/>}
        {src&&webgl==='supported'&&!error&&<div className="dv-ai-robot-preview__webgl" aria-hidden="true">
          <AiRobotErrorBoundary key={src+retryKey} onError={fail}>
            <AiRobotCanvas src={src} palette={palette} expression={expression} action={animation.action} serial={animation.serial}
              onLoaded={()=>{setLoaded(true);setError('')}} onError={fail}/>
          </AiRobotErrorBoundary>
        </div>}
        <span role="status" className="dv-ai-robot-preview__status">
          {webgl==='checking'?'Checking 3D graphics…':webgl==='unsupported'?'2D mode: WebGL unavailable':error?'2D mode: '+error:loaded?'3D model loaded':'Loading 3D model…'}
        </span>
        <MascotBubble message={bubble} locale={locale} onExpire={expireBubble}/>
      </div>
    </div>
    {(error||webgl==='unsupported')&&<div className="dv-ai-robot-preview__recovery" role="status">
      <p>{locale==='tr'?'3D görüntü şu anda kullanılamıyor. 2D robotla devam edebilirsin.':'3D graphics are unavailable. You can continue with the 2D robot.'}</p>
      <button type="button" onClick={retry}>{locale==='tr'?'3D tekrar dene':'Retry 3D'}</button>
    </div>}
    <a href={'https://sketchfab.com/3d-models/ai-robot-'+modelId} target="_blank" rel="noopener noreferrer">Open original model on Sketchfab</a>
    <label className="dv-ai-robot-preview__label">Optional: preview another authorized .glb file (up to 30 MB)
      <input aria-label="Choose AI Robot GLB" type="file" accept=".glb,model/gltf-binary" onChange={event=>choose(event.target.files?.[0])}/>
    </label>
    <p>The bundled AI Robot loads automatically. An optional custom file remains local to your browser session. No file upload is required.</p>
    {error&&<p role="alert">{error}</p>}
    <RobotPreferenceControls controller={preferenceController} locale={locale}/>
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
