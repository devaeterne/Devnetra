import test from 'node:test';
import assert from 'node:assert/strict';
import { tokens } from '../dist/index.js';
test('design-tokens contract', () => { assert.equal(tokens.space.md,16); });
