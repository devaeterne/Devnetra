import test from 'node:test';
import assert from 'node:assert/strict';
import { tokens, designSystemVersion } from '../dist/index.js';
test('theme contracts and version', () => {
  assert.equal(designSystemVersion, '1.0.0');
  assert.equal(tokens.spacing.md, 16);
  assert.ok(tokens.minTouchTarget.kids >= 48);
  assert.deepEqual(Object.keys(tokens.themes.kids), Object.keys(tokens.themes.adult));
});
