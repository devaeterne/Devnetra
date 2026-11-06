import test from 'node:test';
import assert from 'node:assert/strict';
import { DvButton, DvCard, DvProgress } from '../dist/index.js';
test('public wrapper exports', () => { assert.equal(typeof DvButton, 'function');assert.equal(typeof DvCard, 'function');assert.equal(typeof DvProgress,'function'); });
