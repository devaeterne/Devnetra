import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd();
const required=['AGENTS.md','.agents/rules/testing.md','.agents/rules/localization.md','.agents/rules/design-system.md','.agents/platforms/kids-web.md','.agents/platforms/kids-mobile.md','.agents/platforms/adult-web.md','.agents/platforms/adult-mobile.md','docs/decisions/ADR-015-local-only-ci.md','docs/decisions/ADR-016-parent-kids-progress.md','docs/decisions/ADR-017-i18n-and-assets.md','design/pages/kids/robot-maze.md','pnpm-workspace.yaml','turbo.json'];
const check=(condition,message)=>{if(!condition)throw Error(message);process.stdout.write('PASS '+message+'\n');};
for(const file of required)check(fs.existsSync(path.join(root,file)),'required: '+file);
check(!fs.existsSync(path.join(root,'.github/workflows')),'GitHub workflows absent');
const rule=fs.readFileSync(path.join(root,'AGENTS.md'),'utf8');
check(rule.includes('DO NOT create GitHub Actions'),'local-only CI policy present');
check(rule.includes('6–8')&&rule.includes('9–12'),'Kids age bands defined');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
check(Boolean(pkg.scripts['ci:local']),'local CI script declared');
let sha='unknown';try{sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()}catch{sha='unavailable'}
process.stdout.write('Local governance contract checks PASS at commit '+sha+'\n');
