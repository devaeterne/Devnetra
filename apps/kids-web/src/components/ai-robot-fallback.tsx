'use client';

import {Component, useEffect, type ReactNode} from 'react';
import {DvCharacter} from '@devnetra/characters';

/** Accessible 2D mascot rendered when AI Robot WebGL/GLB is unavailable.
 * The fallback never depends on Three.js or the binary asset. */
export function AiRobotFallback({label='Friendly robot mascot'}:{label?:string}){
 return <div className="dv-ai-robot-fallback" data-mascot-fallback="2d">
  <DvCharacter aria-label={label}/>
 </div>;
}

type BoundaryProps={children:ReactNode;onError:(reason:string)=>void};
type BoundaryState={failed:boolean};
export class AiRobotErrorBoundary extends Component<BoundaryProps,BoundaryState>{
 state:BoundaryState={failed:false};
 static getDerivedStateFromError():BoundaryState{return {failed:true};}
 componentDidCatch(){this.props.onError('3D rendering failed');}
 render(){return this.state.failed?null:this.props.children;}
}

export function hasWebGLSupport(){
 try {
  const canvas=document.createElement('canvas');
  const context=canvas.getContext('webgl2')??canvas.getContext('webgl');
  if(!context)return false;
  return true;
 }catch{return false;}
}

export function AiRobotContextGuard({canvas,onError}:{
 canvas:HTMLCanvasElement|null;onError:(reason:string)=>void;
}){
 useEffect(()=>{
  if(!canvas)return;
  const lost=(event:Event)=>{
   event.preventDefault();
   onError('3D graphics context lost');
  };
  canvas.addEventListener('webglcontextlost',lost);
  return ()=>canvas.removeEventListener('webglcontextlost',lost);
 },[canvas,onError]);
 return null;
}
