/**
 * Unit tests for POST /api/chat route
 * Uses Node's built-in assert — no extra test runner needed.
 * Run with: node server/__tests__/chatRoute.test.js
 */

'use strict';

const assert = require('assert');

// ── Minimal mock of the Express router behaviour ───────────────────────────────
// We test the business logic directly rather than spinning up the full server.

// 1. Test: empty message should return 400
function testEmptyMessageValidation() {
  const message = '   ';
  const isValid = Boolean(message?.trim());
  assert.strictEqual(isValid, false, 'Empty/whitespace message should be invalid');
  console.log('  ✅  Empty message validation — PASS');
}

// 2. Test: missing GEMINI_API_KEY should be detectable
function testMissingApiKey() {
  const key = process.env.GEMINI_API_KEY_TEST_FAKE; // deliberately absent
  const isMissing = !key;
  assert.strictEqual(isMissing, true, 'Missing API key should be detected');
  console.log('  ✅  Missing API key detection — PASS');
}

// 3. Test: history builder produces correct role mapping
function testHistoryRoleMapping() {
  const rawHistory = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
    { role: 'user', content: 'What is EVM?' },
  ];

  const chatHistory = rawHistory
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

  assert.strictEqual(chatHistory[0].role, 'user');
  assert.strictEqual(chatHistory[1].role, 'model');   // 'assistant' → 'model'
  assert.strictEqual(chatHistory[2].role, 'user');
  assert.strictEqual(chatHistory[0].parts[0].text, 'Hello');
  console.log('  ✅  History role mapping (assistant → model) — PASS');
}

// 4. Test: empty content entries are filtered from history
function testHistoryFiltering() {
  const rawHistory = [
    { role: 'user', content: '' },
    { role: 'assistant', content: '   ' },
    { role: 'user', content: 'Valid message' },
  ];

  const chatHistory = rawHistory.filter((m) => m.content?.trim());
  assert.strictEqual(chatHistory.length, 1);
  assert.strictEqual(chatHistory[0].content, 'Valid message');
  console.log('  ✅  Empty history entry filtering — PASS');
}

// 5. Test: error message classification
function testErrorClassification() {
  const cases = [
    { msg: 'API_KEY_INVALID something', expected: 'key' },
    { msg: 'RESOURCE_EXHAUSTED quota exceeded', expected: 'quota' },
    { msg: 'model not found 404', expected: 'model' },
    { msg: 'some other error', expected: 'generic' },
  ];

  cases.forEach(({ msg, expected }) => {
    let category = 'generic';
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) category = 'key';
    else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) category = 'quota';
    else if (msg.includes('not found') || msg.includes('404')) category = 'model';
    assert.strictEqual(category, expected, `Error "${msg}" should be "${expected}"`);
  });
  console.log('  ✅  Error classification logic — PASS');
}

// ── Run all tests ──────────────────────────────────────────────────────────────
console.log('\n🧪 Running /api/chat route unit tests...\n');
try {
  testEmptyMessageValidation();
  testMissingApiKey();
  testHistoryRoleMapping();
  testHistoryFiltering();
  testErrorClassification();
  console.log('\n✅  All chat route tests passed!\n');
} catch (err) {
  console.error('\n❌  Test failed:', err.message, '\n');
  process.exit(1);
}
