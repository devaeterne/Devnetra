'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group, Object3D, MathUtils, Mesh, MeshStandardMaterial, Color } from 'three';
import type { MimoAction } from '@devnetra/characters';
import { mimoLighting } from '@devnetra/design-tokens';

type Parts = {
  scene: Group; head: Group; body: Group; leftArm: Group; rightArm: Group;
  leftLeg: Group; rightLeg: Group; eyes: Group[];
};

function part(name:string): Group {
  const obj = new Group();
  obj.name = 'rig:'+name;
  return obj;
}

function makeRig(root:Group):Parts {
  const head=part('head'), body=part('body');
  const leftArm=part('left-arm'),rightArm=part('right-arm');
  const leftLeg=part('left-leg'),rightLeg=part('right-leg');
  const eyes=[part('left-eye'),part('right-eye')];

  head.position.set(0,1.77,0);
  body.position.set(0,.89,0);
  leftArm.position.set(-.65,.98,0);
  rightArm.position.set(.65,.98,0);
  leftLeg.position.set(-.30,.4,0);
  rightLeg.position.set(.30,.4,0);
  eyes[0].position.set(-.34,1.87,.72);
  eyes[1].position.set(.34,1.87,.72);
  root.updateWorldMatrix(true,true);
  for(const p of [head,body,leftArm,rightArm,leftLeg,rightLeg,...eyes]) root.add(p);
  root.updateWorldMatrix(true,true);

  const pieces = [...root.children].filter(child => !child.name.startsWith('rig:'));
  const getSide=(n:string)=>n.endsWith('--1')?0:1;
  for(const mesh of pieces) {
    const name=mesh.name;
    if(/eye-white|eye-pupil|eye-glint/.test(name)) eyes[getSide(name)].attach(mesh);
    else if(/shoulder|short-arm|mitten/.test(name)) (getSide(name)===0?leftArm:rightArm).attach(mesh);
    else if(/stubby-leg|bouncy-foot|shoe-sole/.test(name)) (getSide(name)===0?leftLeg:rightLeg).attach(mesh);
    else if(/torso|soft-tummy|heart/.test(name))body.attach(mesh);
    else head.attach(mesh);
  }
  head.attach(eyes[0]);head.attach(eyes[1]);

  root.traverse((object:Object3D)=>{
    if(object instanceof Mesh) {
      object.castShadow=true;
      object.receiveShadow=true;
      const base=object.material as MeshStandardMaterial;
      // Retain the original vertex colors; increase reflected light while staying matte/toy-like.
      if(base instanceof MeshStandardMaterial) {
        object.material=base.clone();
        const material=object.material as MeshStandardMaterial;
        material.roughness=.52;
        material.metalness=.08;
        material.emissive=new Color('#10092d');
        material.emissiveIntensity=.06;
      }
    }
  });
  return {scene:root,head,body,leftArm,rightArm,leftLeg,rightLeg,eyes};
}

const set=(group:Group, prop:'x'|'y'|'z', val:number,dt:number)=>{
  group.rotation[prop]=MathUtils.damp(group.rotation[prop],val,13,dt);
};

function AnimatedModel({src,action,serial,speed,reducedMotion,onLoaded,onError}:{src:string;action:MimoAction;serial:number;speed:number;reducedMotion:boolean;onLoaded:()=>void;onError:()=>void}) {
  const [rig,setRig]=useState<Parts|null>(null);
  useEffect(()=>{
    let alive=true;
    const loader=new GLTFLoader();
    loader.load(src,gltf=>{
      if(!alive)return;
      try {
        setRig(makeRig(gltf.scene.clone(true)));
        onLoaded();
      } catch {
        onError();
      }
    },undefined,()=>{if(alive)onError()});
    return ()=>{alive=false};
  },[src]);
  const started=useRef<number|null>(null);
  useEffect(()=>{started.current=null},[action,serial]);

  useFrame(({clock},delta)=>{
    if(!rig)return;
    if(started.current===null)started.current=clock.elapsedTime;
    const t=(clock.elapsedTime-started.current)*speed;
    const d=Math.min(delta,.08);
    const idle=reducedMotion?0:Math.sin(clock.elapsedTime*2.2)*.06;
    const burst=Math.sin(Math.min(1,t/1.1)*Math.PI);
    const wave=action==='wave'&&!reducedMotion?Math.sin(t*11)*.6*burst:0;
    const celebrate=action==='celebrate'&&!reducedMotion?Math.abs(Math.sin(t*8))*.20*burst:0;
    const walk=action==='walk'&&!reducedMotion?Math.sin(t*7)*.45:0;
    const happy=action==='happy'&&!reducedMotion?Math.sin(t*12)*.10*burst:0;
    const think=action==='think'&&!reducedMotion?.18*burst:0;
    const oops=action==='oops'&&!reducedMotion?-.18*burst:0;
    const sleep=action==='sleep'&&!reducedMotion?-.1:0;
    const blink=action==='blink'&&!reducedMotion?Math.max(.12,1-.9*burst):1;
    rig.scene.position.y=MathUtils.damp(rig.scene.position.y,-1.25+idle+celebrate+happy,12,d);
    set(rig.head,'z',think+oops+Math.sin(clock.elapsedTime*1.6)*.02*(reducedMotion?0:1),d);
    set(rig.head,'x',sleep,d);
    set(rig.body,'z',action==='celebrate'?.10*Math.sin(t*9)*burst:0,d);
    set(rig.leftArm,'z',action==='celebrate'?.8:action==='happy'?.35:action==='oops'?-.23:0,d);
    set(rig.rightArm,'z',action==='celebrate'?-.8:action==='wave'?-1+wave:action==='happy'?-.35:0,d);
    set(rig.leftLeg,'x',walk,d);
    set(rig.rightLeg,'x',-walk,d);
    for(const eye of rig.eyes) {
      eye.scale.y=MathUtils.damp(eye.scale.y,action==='sleep'?.18:blink,20,d);
    }
    rig.scene.rotation.y=MathUtils.damp(rig.scene.rotation.y,action==='walk'?.16*Math.sin(t*3):0,9,d);
  });
  return rig ? <primitive object={rig.scene} scale={1.08} position={[0,-1.25,0]}/> : null;
}


export function MimoCanvas({src,action,serial=0,speed=1,brightness=1,reducedMotion=false,onLoaded,onError}:{src:string;action:MimoAction;serial?:number;speed?:number;brightness?:number;reducedMotion?:boolean;onLoaded:()=>void;onError:()=>void}) {
  return <Canvas dpr={[1,1.75]} shadows camera={{position:[0,1.1,6],fov:39}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} onCreated={({gl})=>gl.setClearColor('#000000',0)}>
    <ambientLight intensity={mimoLighting.ambient*brightness}/>
    <hemisphereLight args={[mimoLighting.sky,mimoLighting.ground,mimoLighting.hemisphere*brightness]}/>
    <directionalLight position={[-3,6,5]} intensity={mimoLighting.key*brightness} color={mimoLighting.keyColor} castShadow shadow-mapSize={[512,512]}/>
    <pointLight position={[3,2,3]} intensity={mimoLighting.lavenderRim*brightness} color={mimoLighting.lavenderColor} distance={9} decay={2}/>
    <pointLight position={[-3,1,-2]} intensity={mimoLighting.cyanFill*brightness} color={mimoLighting.cyanColor} distance={8} decay={2}/>
    <AnimatedModel src={src} action={action} serial={serial} speed={speed} reducedMotion={reducedMotion} onLoaded={onLoaded} onError={onError}/>
  </Canvas>;
}
