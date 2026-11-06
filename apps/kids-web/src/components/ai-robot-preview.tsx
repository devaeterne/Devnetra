'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { type RobotPalette,type RobotExpression,robotPalettes,robotExpressions,defaultRobotPreferences,mimoActions,type MimoAction } from '@devnetra/characters';

const modelId='f7c4e4dcd1594e3e92b2d35a4ec8a93a';
const AiRobotCanvas=dynamic(()=>import('./ai-robot-canvas').then(mod=>mod.AiRobotCanvas),{ssr:false});
const configuredUrl=process.env.NEXT_PUBLIC_ROBOT_MODEL_URL?.trim()??'';
const allowedUrl=(()=>{if(!configuredUrl)return '';try{const u=new URL(configuredUrl);return u.protocol==='https:'&&u.pathname.toLowerCase().endsWith('.glb')?u.href:''}catch{return ''}})();
const expressionLabels:Record<RobotExpression,string>={happy:'Happy',thinking:'Thinking',excited:'Excited',surprised:'Surprised',sleepy:'Sleepy',cool:'Cool',oops:'Oops',celebrate:'Celebrate'};
export function AiRobotPreview() {
  const [palette,setPalette]=useState<RobotPalette>(defaultRobotPreferences.palette);
  const [expression,setExpression]=useState<RobotExpression>(defaultRobotPreferences.expression);
  const [action,setAction]=useState<MimoAction>('idle');
  const [localUrl,setLocalUrl]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [error,setError]=useState('');
  const previous=useRef<string|null>(null);
  const src=localUrl||allowedUrl;

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
    <header><h2>AI Robot — Character editor</h2><p>Source: Noores on Sketchfab. You reported that usage permission is complete; the model file must still be supplied to enable editing.</p></header>
    <div className="dv-ai-robot-preview__frame" data-robot-mode={src?'editable':'external'}>
      {src?<div className="dv-ai-robot-preview__canvas"><AiRobotCanvas src={src} palette={palette} expression={expression} action={action} onLoaded={()=>{setLoaded(true);setError('')}} onError={reason=>{setError(reason);setLoaded(false)}}/><span role="status" className="dv-ai-robot-preview__status">{loaded?'3D model loaded':error||'Loading 3D model…'}</span></div>:
      <iframe title="AI Robot by Noores on Sketchfab" src={'https://sketchfab.com/models/'+modelId+'/embed?autostart=0&ui_theme=dark'} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/>}
    </div>
    <a href={'https://sketchfab.com/3d-models/ai-robot-'+modelId} target="_blank" rel="noopener noreferrer">Open original model on Sketchfab</a>
    <label className="dv-ai-robot-preview__label">Choose the authorized model file (.glb, up to 30 MB)
      <input aria-label="Choose AI Robot GLB" type="file" accept=".glb,model/gltf-binary" onChange={event=>choose(event.target.files?.[0])}/>
    </label>
    <p>File selection is local to this browser session. Nothing is uploaded to Devnetra or GitHub. A configured public HTTPS model URL can be used later.</p>
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
     {mimoActions.map(v=><button type="button" key={v} aria-pressed={action===v} onClick={()=>setAction(v)}>{v}</button>)}
    </div>
    <output className="dv-ai-robot-preview__output">Selected: {palette} · {expression} · {action}{!src?' (upload a GLB to preview changes)':''}</output>
    <p>Expressions currently affect the robot's procedural pose, not its eye textures or facial geometry. Full facial editing requires inspecting the actual model mesh.</p>
  </section>;
}
