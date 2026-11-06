'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Color, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import { robotPalettes, materialRole, aiRobotGroups, type AiRobotGroupName, type RobotPalette, type RobotExpression, type MimoAction } from '@devnetra/characters';

function RobotMesh({src,palette,expression,action,onError,onLoaded}:{src:string;palette:RobotPalette;expression:RobotExpression;action:MimoAction;onError:(reason:string)=>void;onLoaded:()=>void}) {
 const [object,setObject]=useState<Group|null>(null);
 const root=useRef<Group|null>(null);
 const progress=useRef(0);
 const nodes=useRef<Partial<Record<AiRobotGroupName,Object3D>>>({});
 const sourceRotations=useRef<Partial<Record<AiRobotGroupName,Quaternion>>>({});
 const rotationDelta=useRef(new Quaternion());
 const axis=useRef(new Vector3(1,0,0));

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
   nodes.current={};
   sourceRotations.current={};
   for(const name of aiRobotGroups) {
     const part=model.getObjectByName(name);
     if(!part)continue;
     nodes.current[name]=part;
     sourceRotations.current[name]=part.quaternion.clone();
   }
   const required=['Head','LeftArm','RightArm','LeftWheel','RightWheel'] as const;
   if(required.some(name=>!nodes.current[name])) {
     onError('Missing required AI Robot part names');return;
   }
   model.traverse(child=>{
     if(!(child instanceof Mesh))return;
     child.castShadow=true;
     child.receiveShadow=true;
     const colors=robotPalettes[palette];
     const apply=(base:MeshStandardMaterial)=>{
       const m=base.clone();
       const role=materialRole(base.name);
       if(role==='shell'){m.color=new Color(colors.shell);m.roughness=.4;m.metalness=.14;}
       else if(role==='accent'){m.color=new Color(colors.trim);m.roughness=.33;}
       else if(role==='glow'){m.color=new Color(colors.light);m.emissive=new Color(colors.light);m.emissiveIntensity=.72;}
       // Preserve original eye PNG and dark hand, tire and mechanical materials.
       return m;
     };
     const original=child.material;
     if(Array.isArray(original))child.material=original.map(m=>m instanceof MeshStandardMaterial?apply(m):m);
     else if(original instanceof MeshStandardMaterial)child.material=apply(original);
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
  const roll=action==='walk';
  const blink=action==='blink';
  const targetY=celebrate?Math.abs(Math.sin(t*9))*.18:happy?Math.abs(Math.sin(t*6))*.07:Math.sin(now*1.3)*.035;
  root.current.position.y=MathUtils.damp(root.current.position.y,targetY,8,dt);
  root.current.rotation.z=MathUtils.damp(root.current.rotation.z,
    oops?-.08:celebrate?Math.sin(t*9)*.08:0,8,dt);
  // Animate the original named joints and preserve each source quaternion:
  // the Sketchfab source has non-identity, axis-conversion transforms.
  const pose=(name:AiRobotGroupName,angle:number,axisDirection:'x'|'y'|'z'='x')=>{
    const part=nodes.current[name],initial=sourceRotations.current[name];
    if(!part||!initial)return;
    axis.current.set(axisDirection==='x'?1:0,axisDirection==='y'?1:0,axisDirection==='z'?1:0);
    rotationDelta.current.setFromAxisAngle(axis.current,angle);
    part.quaternion.slerp(initial.clone().multiply(rotationDelta.current),Math.min(1,dt*12));
  };
  pose('Head',sleepy?-.18:thinking?.2:oops?-.15:celebrate?-.09:0,'z');
  pose('LeftArm',celebrate?-.75:happy?-.27:thinking?.11:0,'x');
  pose('RightArm',celebrate?.75:waving?.45+Math.sin(t*10)*.45:happy?.27:0,'x');
  pose('LeftWheel',roll?t*6:0,'x');
  pose('RightWheel',roll?t*6:0,'x');
  pose('Antenna',blink?.08*Math.sin(t*17):0,'z');
  root.current.rotation.y=MathUtils.damp(root.current.rotation.y,roll?Math.sin(t*2)*.12:0,8,dt);
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
