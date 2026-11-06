'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Color, Group, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { robotPalettes, type RobotPalette, type RobotExpression, type MimoAction } from '@devnetra/characters';

function RobotMesh({src,palette,expression,action,onError,onLoaded}:{src:string;palette:RobotPalette;expression:RobotExpression;action:MimoAction;onError:(reason:string)=>void;onLoaded:()=>void}) {
 const [object,setObject]=useState<Group|null>(null);
 const root=useRef<Group|null>(null);
 const progress=useRef(0);

 useEffect(()=>{
  let active=true;
  const loader=new GLTFLoader();
  loader.load(src,gltf=>{
   if(!active)return;
   const model=gltf.scene;
   const bounds=new Box3().setFromObject(model);
   const size=bounds.getSize(new Vector3());
   const center=bounds.getCenter(new Vector3());
   if(!Number.isFinite(size.y)||size.y<=0){onError('The model has invalid geometry');return}
   model.position.sub(center);
   const scale=2.75/Math.max(size.x,size.y,size.z);
   model.scale.setScalar(scale);
   model.traverse(child=>{
     if(!(child instanceof Mesh))return;
     child.castShadow=true;
     child.receiveShadow=true;
     // Non-destructive color overlays: preserve original textures and recolor selected materials.
     const colors=robotPalettes[palette];
     const apply=(base:MeshStandardMaterial,index:number)=>{
       const m=base.clone();
       if(index===0) m.color=new Color(colors.shell);
       if(index===1) m.color=new Color(colors.trim);
       m.roughness=.46;
       m.metalness=.14;
       return m;
     };
     const original=child.material;
     if(Array.isArray(original))child.material=original.map((m,i)=>m instanceof MeshStandardMaterial?apply(m,i):m);
     else if(original instanceof MeshStandardMaterial)child.material=apply(original,0);
   });
   setObject(model);
   onLoaded();
  },undefined,()=>{if(active)onError('The GLB could not be read')});
  return ()=>{active=false;setObject(null)};
 },[src,palette]);

 useEffect(()=>{progress.current=0},[action,expression]);
 useFrame((state,dt)=>{
  if(!root.current)return;
  const now=state.clock.elapsedTime;
  progress.current+=Math.min(dt,.06);
  const t=progress.current;
  const happy=action==='happy'||expression==='happy'||expression==='excited';
  const celebrate=action==='celebrate'||expression==='celebrate';
  const sleepy=action==='sleep'||expression==='sleepy';
  const oops=action==='oops'||expression==='oops'||expression==='surprised';
  const waving=action==='wave';
  const thinking=action==='think'||expression==='thinking';
  const walk=action==='walk';
  const blink=action==='blink';
  const targetY=celebrate?Math.abs(Math.sin(t*9))*.18:happy?Math.abs(Math.sin(t*6))*.07:Math.sin(now*1.3)*.035;
  root.current.position.y=MathUtils.damp(root.current.position.y,targetY,8,dt);
  root.current.rotation.z=MathUtils.damp(root.current.rotation.z,
    oops?-.22:thinking?.13:waving?Math.sin(t*7)*.12:celebrate?Math.sin(t*9)*.18:0,8,dt);
  root.current.rotation.y=MathUtils.damp(root.current.rotation.y,
    walk?Math.sin(t*5)*.3:waving?Math.sin(t*2)*.12:blink?.07:0,8,dt);
  root.current.rotation.x=MathUtils.damp(root.current.rotation.x,sleepy?.16:celebrate?-.07:0,8,dt);
 });
 return object?<group ref={root}><primitive object={object}/></group>:null;
}

export function AiRobotCanvas({src,palette,expression,action,onLoaded,onError}:{src:string;palette:RobotPalette;expression:RobotExpression;action:MimoAction;onLoaded:()=>void;onError:(reason:string)=>void}) {
 return <Canvas dpr={[1,1.75]} camera={{position:[0,1,5.6],fov:42}} shadows gl={{alpha:true,antialias:true}}>
  <ambientLight intensity={.95}/>
  <hemisphereLight args={['#fff4fb','#9be9ff',1.15]}/>
  <directionalLight position={[-3,5,5]} intensity={2.2} color="#fff4dd" castShadow/>
  <pointLight position={[3,2,2]} intensity={9} color="#d4b4ff" distance={8}/>
  <RobotMesh src={src} palette={palette} expression={expression} action={action} onLoaded={onLoaded} onError={onError}/>
 </Canvas>;
}
