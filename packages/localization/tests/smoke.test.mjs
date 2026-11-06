import test from 'node:test';
import assert from 'node:assert/strict';
import { messages, translate } from '../dist/index.js';
test('translation parity and interpolation', () => {
 assert.deepEqual(Object.keys(messages.en.kids),Object.keys(messages.tr.kids));
 assert.match(translate('tr','tracks',{bands:'6–12'}), /6–12/);
});
