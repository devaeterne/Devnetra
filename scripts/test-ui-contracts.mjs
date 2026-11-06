import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const entry=JSON.parse(read('packages/assets/package.json'));
const tokens=read('packages/design-tokens/src/index.ts');
const style=read('packages/design-tokens/styles.css');
const app=read('apps/kids-web/src/app/page.tsx');
const main=read('AGENTS.md');
const required=[
 '.agents/rules/ui-components.md','.agents/rules/icon-system.md','.agents/rules/character-system.md',
 '.agents/rules/asset-registry.md','.agents/rules/visual-testing.md',
 'docs/decisions/ADR-032-shared-ui-kids-robot.md','design/pages/kids/home.md',
 'packages/icons/src/index.tsx','packages/ui-web/src/index.tsx',
 'packages/characters/src/index.tsx','packages/assets/src/index.ts'
];
for(const f of required){assert.ok(fs.existsSync(path.join(root,f)),f+' missing');console.log('PASS UI file '+f)}
assert.match(tokens,/designSystemVersion = '1.0.0'/);
for(const name of ['background','surface','surfaceRaised','text','muted','primary','primaryText','accent','success','warning','reward','border','focus']){
 const cssName=name.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
 assert.ok(style.includes('--dv-'+cssName+':'),'missing CSS token '+name);
}
assert.match(tokens,/minTouchTarget: \{ kids: 48/);
assert.match(main,/DN-002/);
assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(app),'raw hex in Kids feature screen');
assert.ok(!/from ['"]lucide-react['"]/.test(app),'direct Lucide forbidden in app screen');
for(const name of ['@devnetra/ui-web','@devnetra/icons']) assert.ok(app.includes(name),'missing UI wrapper usage '+name);
const assetSource=read('packages/assets/src/index.ts');
assert.match(assetSource,/status: 'available', bundledPath: '\/assets\/characters\/devnetra-mimo.glb'/);
assert.match(read('packages/characters/src/index.tsx'),/DvCharacter/);
assert.match(app,/DvCharacter3D/);
assert.equal(entry.name,'@devnetra/assets');
assert.ok(!fs.existsSync(path.join(root,'.github/workflows')),'hosted CI forbidden');
console.log('UI-CONTRACTS-PASS: rules, design tokens, icon and mascot registry, asset status, no hosted CI');
