import assert from 'node:assert/strict';
import { test } from 'node:test';
import { navInsertIndex } from './docs-nav-order.ts';

test('a sorted list: the new key goes at its alphabetical place', () => {
	assert.equal(navInsertIndex(['Airtable', 'Box', 'Zoom'], 'Calendly'), 2);
	assert.equal(navInsertIndex(['Box', 'Zoom'], 'Airtable'), 0);
	assert.equal(navInsertIndex(['Airtable', 'Box'], 'Zoom'), 2);
	assert.equal(navInsertIndex([], 'Box'), 0);
});

test('a stray larger entry early on does not pull the new key back', () => {
	// docs.json 11-19: Cert Spotter renamed in place to "SSLMate Cert Spotter"
	// among the C's; Monday MCP then landed before it.
	const keys = [
		'Calendly',
		'SSLMate Cert Spotter',
		'Chargebee',
		'Linear',
		'Notion',
		'Zoom',
	];
	assert.equal(navInsertIndex(keys, 'Monday MCP'), 4);
});

test('a stray smaller entry late on does not push the new key forward', () => {
	// 2Captcha is filed under T (twocaptcha) on main.
	const keys = [
		'Box',
		'Linear',
		'Notion',
		'Todoist',
		'2Captcha',
		'Twilio',
		'Zoom',
	];
	assert.equal(navInsertIndex(keys, 'Monday MCP'), 2);
});

test('compares case-insensitively and numbers naturally', () => {
	assert.equal(navInsertIndex(['airtable', 'Box'], 'Asana'), 1);
	assert.equal(navInsertIndex(['Plugin 2', 'Plugin 10'], 'Plugin 3'), 1);
});
