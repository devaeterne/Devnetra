'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useState, type ReactNode } from 'react';
import { assetRegistry } from '@devnetra/assets';
import { DvCharacter, type MimoAction } from '@devnetra/characters';

class MimoErrorBoundary extends Component<{children:ReactNode;onError:()=>void},{hasError:boolean}> {
  state={hasError:false};
  static getDerivedStateFromError(){return {hasError:true};}
  componentDidCatch(){this.props.onError();}
  render(){return this.state.hasError?null:this.props.children;}
}

const Renderer=dynamic(()=>import('./mimo-canvas').then(mod=>mod.MimoCanvas),{ssr:false});

export type DvCharacter3DProps = {
  label:string;
  action?:MimoAction;
  animation?:'idle'|'celebrate'; // Existing API compatibility.
  speed?:number;
  serial?:number;
  brightness?:number;
};
export function DvCharacter3D({label,action,animation='idle',speed=1,serial=0,brightness=1.05}:DvCharacter3DProps) {
  const [client,setClient]=useState(false);
  const [ready,setReady]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [failed,setFailed]=useState(false);
  const source=assetRegistry['kids.robot.3d'].bundledPath;
  useEffect(()=>{
    setClient(true);
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setReducedMotion(media.matches);
    change();
    media.addEventListener('change',change);
    return ()=>media.removeEventListener('change',change);
  },[]);
  const effectiveAction=action??animation;
  const showFallback=!client||!source||failed||!ready;
  return <div className="dv-mimo" role="img" aria-label={label} data-mimo-action={effectiveAction}>
    {client&&source&&!failed&&<div className="dv-mimo__viewer" data-mimo-loaded={ready} aria-hidden="true"><MimoErrorBoundary onError={()=>setFailed(true)}><Renderer src={source} action={effectiveAction} serial={serial} speed={Math.min(2,Math.max(.5,speed))} brightness={Math.min(1.8,Math.max(.6,brightness))} reducedMotion={reducedMotion} onLoaded={()=>setReady(true)} onError={()=>setFailed(true)}/></MimoErrorBoundary></div>}
    {showFallback&&<div className="dv-mimo__fallback"><DvCharacter aria-label={label} animation={effectiveAction==='celebrate'?'celebrate':'idle'}/></div>}
  </div>;
}
