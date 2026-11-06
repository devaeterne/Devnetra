import test from 'node:test';
import assert from 'node:assert/strict';
import { messages } from '../dist/index.js';
test('localization contract', () => { assert.ok(messages.en.kids.welcome && messages.tr.kids.welcome); });
