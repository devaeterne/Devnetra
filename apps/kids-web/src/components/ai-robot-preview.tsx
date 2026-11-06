'use client';
import { useState } from 'react';
import { type RobotPalette,type RobotExpression,robotPalettes,robotExpressions,defaultRobotPreferences } from '@devnetra/characters';

const modelId='f7c4e4dcd1594e3e92b2d35a4ec8a93a';
export function AiRobotPreview() {
  const [palette,setPalette]=useState<RobotPalette>(defaultRobotPreferences.palette);
  const [expression,setExpression]=useState<RobotExpression>(defaultRobotPreferences.expression);
  return <section className="dv-ai-robot-preview" aria-label="AI Robot model preview">
    <header><h2>AI Robot — Sketchfab preview</h2>
      <p>Model owner: Noores. Public mesh redistribution permission is pending. No model data is stored in Devnetra.</p>
    </header>
    <div className="dv-ai-robot-preview__frame">
      <iframe title="AI Robot by Noores on Sketchfab" src={'https://sketchfab.com/models/'+modelId+'/embed?autostart=0&ui_theme=dark'} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/>
    </div>
    <a href={'https://sketchfab.com/3d-models/ai-robot-'+modelId} target="_blank" rel="noopener noreferrer">Original Sketchfab model and license</a>
    <h3>Personalization specification</h3>
    <p>These choices are a Devnetra interface preview. They do not recolor or animate the Sketchfab embed; that requires the owner's permission and an editable model.</p>
    <div className="dv-ai-robot-preview__colors" role="group" aria-label="Robot color palette">
      {(Object.keys(robotPalettes) as RobotPalette[]).map(name=><button key={name} type="button" aria-pressed={palette===name} onClick={()=>setPalette(name)}><span className="dv-ai-robot-preview__swatch" style={{background:robotPalettes[name].shell}}/>{name}</button>)}
    </div>
    <label className="dv-ai-robot-preview__label">Expression preset
      <select value={expression} onChange={event=>setExpression(event.target.value as RobotExpression)}>
        {robotExpressions.map(v=><option key={v} value={v}>{v}</option>)}
      </select>
    </label>
    <output className="dv-ai-robot-preview__output">Planned profile: {palette} · {expression}</output>
  </section>;
}
