import test from 'node:test';
import assert from 'node:assert/strict';
import { assetRegistry } from '../dist/index.js';
test('unshipped 3D model is not marked available', () => {
 assert.equal(assetRegistry['kids.robot.3d'].status,'planned');
 assert.equal(assetRegistry['kids.robot.3d'].bundledPath,null);
 assert.equal(assetRegistry['kids.robot.fallback'].status,'available');
});
