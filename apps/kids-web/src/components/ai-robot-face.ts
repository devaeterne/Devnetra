import {CanvasTexture,SRGBColorSpace, type Texture} from 'three';
import type {AiRobotMood} from '@devnetra/characters';

/**
 * A generated runtime eye texture for the source Head_Eyes_0 UV atlas.
 * Does not deform the original 3D faceplate. Original licensed GLB remains unchanged.
 * Coordinates are calibrated against the original 1024x1024 Eyes_baseColor atlas.
 */
export function createAiRobotFace(source:Texture) {
 const canvas=document.createElement('canvas');
 canvas.width=1024;canvas.height=1024;
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('2D face canvas unavailable');
 const texture=new CanvasTexture(canvas);
 texture.colorSpace=source.colorSpace||SRGBColorSpace;
 texture.flipY=source.flipY;
 texture.wrapS=source.wrapS;texture.wrapT=source.wrapT;
 texture.anisotropy=source.anisotropy;
 const draw=(mood:AiRobotMood, openness=1)=>{
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#000000';ctx.fillRect(0,0,w,h);
  const eyeCenters=[290,738];
  const y=504;
  const closed=mood==='sleepy';
  const excited=mood==='celebration'||mood==='surprised';
  const joyful=mood==='cheerful';
  const curious=mood==='curious';
  const oops=mood==='oops';
  const cool=mood==='cool';
  const open=Math.max(.025,Math.min(1,closed?.13:cool?.44:openness));
  for(let i=0;i<2;i++){
   const cx=eyeCenters[i]+(curious?22:0);
   const radiusX=excited?114:joyful?102:104;
   const radiusY=(excited?136:joyful?100:117)*open;
   // Soft bloom around eye shape with a constrained glow, not a full-frame flash.
   ctx.save();
   ctx.shadowColor='#00dafa';ctx.shadowBlur=34;
   ctx.fillStyle='#03d9f2';
   if(joyful&&open>.5){
    // A crescent-like smile: upper curved glow, with black inner scoop.
    ctx.beginPath();ctx.ellipse(cx,y+21,radiusX,radiusY,0,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle='#000000';ctx.beginPath();
    ctx.ellipse(cx,y-25,radiusX*1.06,radiusY*.83,0,0,Math.PI*2);ctx.fill();
   }else{
    ctx.beginPath();
    ctx.ellipse(cx,y,radiusX,radiusY,0,0,Math.PI*2);
    ctx.fill();
   }
   ctx.restore();
   if(oops&&i===0){
    ctx.strokeStyle='#03d9f2';ctx.lineWidth=13;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(cx-75,339);ctx.lineTo(cx+70,359);ctx.stroke();
   }
  }
  texture.needsUpdate=true;
 };
 draw('neutral',1);
 return {texture,draw,dispose:()=>texture.dispose()};
}
