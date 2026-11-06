import test from 'node:test';
import assert from 'node:assert/strict';
import { assetRegistry } from '../dist/index.js';
test('Mimo GLB is available with a 2D fallback', () => {
 const model=assetRegistry['kids.robot.3d'];
 assert.equal(model.status,'available');
 assert.equal(model.license,'CC0');
 assert.equal(model.bundledPath,'/assets/characters/devnetra-mimo.glb');
 assert.equal(assetRegistry[model.fallback].status,'available');
});
