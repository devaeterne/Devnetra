'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import { robotPalettes, materialRole, aiRobotGroups, aiRobotMoodFor, aiRobotMoodLight, aiRobotMotionPose, type AiRobotMood, type AiRobotGroupName, type RobotPalette, type RobotExpression, type MimoAction } from '@devnetra/characters';
import {createAiRobotFace} from './ai-robot-face';

function RobotMesh({src,palette,expression,action,serial,onError,onLoaded}:{src:string;palette:RobotPalette;expression:RobotExpression;action:MimoAction;serial:number;onError:(reason:string)=>void;onLoaded:()=>void}) {
 const [object,setObject]=useState<Group|null>(null);
 const root=useRef<Group|null>(null);
 const progress=useRef(0);
 const reduced=useRef(false);
 const nodes=useRef<Partial<Record<AiRobotGroupName,Object3D>>>({});
 const sourceRotations=useRef<Partial<Record<AiRobotGroupName,Quaternion>>>({});
 const rotationDelta=useRef(new Quaternion());
 const axis=useRef(new Vector3(1,0,0));
 const eyes=useRef<MeshStandardMaterial[]>([]);
 const antennaLights=useRef<MeshStandardMaterial[]>([]);
 const face=useRef<ReturnType<typeof createAiRobotFace>|null>(null);
 const previousFace=useRef<{mood:AiRobotMood;openness:number}|null>(null);


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
   const scale=2.75/Math.max(size.x,size.y,size.z);
   model.scale.setScalar(scale);
   model.position.copy(center).multiplyScalar(-scale);
   nodes.current={};
   sourceRotations.current={};
   eyes.current=[];
   antennaLights.current=[];
   face.current?.dispose();face.current=null;previousFace.current=null;

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
     // Clone once; never mutate a shared GLTF material or alter eye textures.
     const clone=(m:MeshStandardMaterial)=>m instanceof MeshStandardMaterial?m.clone():m;
     if(Array.isArray(child.material))child.material=child.material.map(m=>m instanceof MeshStandardMaterial?clone(m):m);
     else if(child.material instanceof MeshStandardMaterial)child.material=clone(child.material);
     const parts=Array.isArray(child.material)?child.material:[child.material];
     for(const material of parts){
       if(!(material instanceof MeshStandardMaterial))continue;
       const role=materialRole(material.name);
       if(role==='eyes'){
         eyes.current.push(material);
         const original=material.emissiveMap??material.map;
         if(original){
           if(!face.current)face.current=createAiRobotFace(original);
           material.map=face.current.texture;
           material.emissiveMap=face.current.texture;
           material.needsUpdate=true;
         }
       }else if(role==='glow')antennaLights.current.push(material);
     }
   });
   setObject(model);
   onLoaded();
  },undefined,()=>{if(active)onError('The GLB could not be read')});
  return ()=>{active=false;face.current?.dispose();face.current=null;setObject(null)};
 },[src]);

 useEffect(()=>{
   if(!object)return;
   const colors=robotPalettes[palette];
   object.traverse(child=>{
     if(!(child instanceof Mesh))return;
     const apply=(m:MeshStandardMaterial)=>{
       if(!(m instanceof MeshStandardMaterial))return;
       const role=materialRole(m.name);
       if(role==='shell'){m.color.set(colors.shell);m.roughness=.4;m.metalness=.14;}
       else if(role==='accent'){m.color.set(colors.trim);m.roughness=.33;}
       else if(role==='glow'){m.color.set(colors.light);m.emissive.set(colors.light);}
       // Eyes, hands, joints and tires keep source colors and textures.
       m.needsUpdate=true;
     };
     if(Array.isArray(child.material))child.material.forEach(apply);
     else apply(child.material);
   });
 },[object,palette]);

 useEffect(()=>{progress.current=0},[action,serial,expression]);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{reduced.current=media.matches};
  update();media.addEventListener('change',update);
  return ()=>media.removeEventListener('change',update);
 },[]);
 useFrame((state,dt)=>{
  if(!root.current)return;
  const now=state.clock.elapsedTime;
  progress.current+=Math.min(dt,.06);
  const t=progress.current;
  const mood=aiRobotMoodLight[aiRobotMoodFor(action,expression)];
  const moodName=aiRobotMoodFor(action,expression);
  const pulse=1+(reduced.current?0:Math.sin(now*(action==='celebrate'?9:3.5))*mood.pulse);
  const eyeBlink=action==='blink'&&!reduced.current
    ?Math.max(.03,Math.abs(Math.sin(t*10))) : 1;
  if(face.current){
    const prior=previousFace.current;
    if(!prior||prior.mood!==moodName||Math.abs(prior.openness-eyeBlink)>.035){
      face.current.draw(moodName,eyeBlink);
      previousFace.current={mood:moodName,openness:eyeBlink};
    }
  }
  // The original Eyes material has an emissive PNG texture. Modify intensity
  // only to preserve the pupil artwork; clone prevents global asset mutation.
  const eyeTarget=mood.eye*pulse;
  const antennaTarget=mood.antenna*pulse;
  for(const mat of eyes.current)mat.emissiveIntensity=MathUtils.damp(mat.emissiveIntensity,eyeTarget,9,dt);
  for(const mat of antennaLights.current)mat.emissiveIntensity=MathUtils.damp(mat.emissiveIntensity,antennaTarget,9,dt);
  const target=aiRobotMotionPose(action,t,reduced.current);
  // In-place roll preview: wheels move, scene position stays anchored.
  root.current.position.y=MathUtils.damp(root.current.position.y,target.bob,8,dt);
  root.current.rotation.z=MathUtils.damp(root.current.rotation.z,target.lean,8,dt);
  root.current.rotation.y=MathUtils.damp(root.current.rotation.y,target.turn,8,dt);
  root.current.rotation.x=MathUtils.damp(root.current.rotation.x,target.pitch,8,dt);
  const pose=(name:AiRobotGroupName,angle:number,axisDirection:'x'|'y'|'z'='x')=>{
    const part=nodes.current[name],initial=sourceRotations.current[name];
    if(!part||!initial)return;
    axis.current.set(axisDirection==='x'?1:0,axisDirection==='y'?1:0,axisDirection==='z'?1:0);
    part.parent?.getWorldQuaternion(rotationDelta.current);
    axis.current.applyQuaternion(rotationDelta.current.invert()).normalize();
    rotationDelta.current.setFromAxisAngle(axis.current,angle);
    part.quaternion.slerp(rotationDelta.current.multiply(initial.clone()),Math.min(1,dt*12));
  };
  pose('Head',target.head,'z');
  pose('LeftArm',target.leftArm,'z');
  pose('RightArm',target.rightArm,'z');
  pose('LeftWheel',target.leftWheel,'x');
  pose('RightWheel',target.rightWheel,'x');
  pose('Antenna',target.antenna,'z');
 });
 return object?<group ref={root}><primitive object={object}/></group>:null;
}

export function AiRobotCanvas({src,palette,expression,action,serial=0,onLoaded,onError}:{src:string;palette:RobotPalette;expression:RobotExpression;action:MimoAction;serial?:number;onLoaded:()=>void;onError:(reason:string)=>void}) {
 return <Canvas dpr={[1,1.75]} camera={{position:[0,1,5.6],fov:42}} shadows gl={{alpha:true,antialias:true}}>
  <ambientLight intensity={.95}/>
  <hemisphereLight args={['#fff4fb','#9be9ff',1.15]}/>
  <directionalLight position={[-3,5,5]} intensity={2.2} color="#fff4dd" castShadow/>
  <pointLight position={[3,2,2]} intensity={9} color="#d4b4ff" distance={8}/>
  <RobotMesh src={src} palette={palette} expression={expression} action={action} serial={serial} onLoaded={onLoaded} onError={onError}/>
 </Canvas>;
}
