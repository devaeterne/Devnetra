import test from 'node:test';
import assert from 'node:assert/strict';
import { robotPalettes,robotExpressions,parseRobotPreferences } from '../dist/index.js';

test('five themes and eight moods',()=>{assert.equal(Object.keys(robotPalettes).length,5);assert.equal(robotExpressions.length,8)});
test('preferences are strictly validated',()=>{
 assert.deepEqual(parseRobotPreferences({palette:'__proto__',expression:'bad'}),{palette:'ocean',expression:'happy'});
 assert.deepEqual(parseRobotPreferences({palette:'violet',expression:'thinking'}),{palette:'violet',expression:'thinking'});
});
