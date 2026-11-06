import test from 'node:test';
import assert from 'node:assert/strict';
import { ageBands } from '../dist/index.js';
test('core contract', () => { assert.deepEqual(ageBands, ['6-8','9-12']); });
