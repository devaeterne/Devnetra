import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const required=['docs/AGENTS.md','docs/README.md','docs/rules/documentation-structure.md'];
for(const file of required)assert.ok(existsSync(file),`Required docs contract: ${file}`);
const names=readdirSync('docs/workstreams',{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
assert.ok(names.includes('kids-mascot'),'Kids mascot workstream missing');
for(const slug of names){
 assert.match(slug,/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,'Workstream slugs must be kebab-case');
 const base=`docs/workstreams/${slug}`;
 for(const file of ['README.md','TASKS.md','ACCEPTANCE.md','AGENTS.md'])assert.ok(existsSync(`${base}/${file}`),`Missing ${base}/${file}`);
 const tasks=read(`${base}/TASKS.md`);
 const ids=[...tasks.matchAll(/^\| (MSCT-\d{2}) \|/gm)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`Duplicate task IDs in ${slug}`);
 assert.ok(ids.length>=10,`Task register incomplete: ${slug}`);
 for(const line of tasks.split('\n').filter(l=>/^\| MSCT-\d{2} \|/.test(l))) {
  const cells=line.split('|').map(s=>s.trim());
  assert.ok(['OPEN','IN_PROGRESS','BLOCKED','DONE','VERIFIED'].includes(cells[5]),`Invalid task state: ${line}`);
 }
}
assert.ok(!existsSync('.github/workflows'),'Hosted CI forbidden');
console.log('DOCS_CONTRACT_PASS:',names.length,'workstreams; docs/AGENTS and statuses valid');
