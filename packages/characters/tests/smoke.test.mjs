import test from 'node:test';
import assert from 'node:assert/strict';
import { DvCharacter, characterRegistry } from '../dist/index.js';
test('robot has fallback and defined animations', () => {
 assert.equal(typeof DvCharacter,'function');
 assert.equal(characterRegistry['kids.robot'].fallback,'kids.robot.fallback');
 assert.deepEqual(characterRegistry['kids.robot'].animations,['idle','celebrate']);
});
