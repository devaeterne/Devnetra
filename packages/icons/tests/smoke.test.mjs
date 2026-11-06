import test from 'node:test';
import assert from 'node:assert/strict';
import { iconRegistry } from '../dist/index.js';
test('required icon registry IDs', () => { for (const id of ['robot','play','star','trophy','arrow-right']) assert.equal(typeof iconRegistry[id], 'object'); });
