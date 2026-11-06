import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const file=process.argv[2];
if(!file){console.error('Usage: node scripts/audit-ai-robot-glb.mjs /path/to/ai_robot.glb');process.exit(2)}
const bytes=fs.readFileSync(file);
assert.equal(bytes.toString('ascii',0,4),'glTF','Not a GLB binary');
assert.equal(bytes.readUInt32LE(4),2,'Not GLB v2');
assert.equal(bytes.readUInt32LE(8),bytes.length,'Invalid GLB length');
const jsonSize=bytes.readUInt32LE(12);
assert.equal(bytes.toString('ascii',16,20),'JSON','Missing glTF JSON chunk');
const gltf=JSON.parse(bytes.subarray(20,20+jsonSize).toString('utf8'));
const summary={
  sizeBytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
  meshes:gltf.meshes?.length??0,nodes:gltf.nodes?.length??0,materials:gltf.materials?.length??0,
  animations:gltf.animations?.length??0,skins:gltf.skins?.length??0,
  images:gltf.images?.length??0,textures:gltf.textures?.length??0,
  materialNames:(gltf.materials??[]).map(m=>m.name??null),
  groupNames:(gltf.nodes??[]).filter(n=>!Number.isInteger(n.mesh)).map(n=>n.name??null),
  groupedParts:{},
};
const groups=['Head','Antenna','Chest','Hips','Neck','MidSpine','LeftArm','RightArm','LeftWheel','RightWheel'];
for(const name of groups){
 const node=gltf.nodes?.find(n=>n.name===name);
 assert.ok(node,'Missing expected AI Robot group: '+name);
 summary.groupedParts[name]=(node.children??[]).map(i=>gltf.nodes[i].name);
}
assert.ok(summary.materialNames.includes('Eyes'),'Eye material missing');
assert.ok(summary.materialNames.includes('light'),'Emissive antenna material missing');
const eyeMat=gltf.materials.find(m=>m.name==='Eyes');
const lightMat=gltf.materials.find(m=>m.name==='light');
summary.eyeTexture=Boolean(eyeMat?.pbrMetallicRoughness?.baseColorTexture);
summary.antennaEmissive=lightMat?.emissiveFactor??null;
summary.transformCaution='Source scene contains axis-conversion node matrices. Do not assume global X/Y/Z align to part-local axes.';
summary.releaseStatus='Audit only; rights for public binary redistribution must be separately recorded.';
console.log(JSON.stringify(summary,null,2));
