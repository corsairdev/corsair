import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	buildEscalationComment,
	buildRoundOneComment,
	currentRound,
	decide,
} from './loop.ts';
import type { Finding } from './parse-greptile.ts';

const f = (sev: Finding['severity']): Finding => ({
	severity: sev,
	title: 'Auth header commented out',
	detail: 'Requests are unauthenticated.',
	path: 'packages/facebook/client.ts',
	line: 39,
	commentId: 1,
});

test('round detection from markers', () => {
	assert.equal(currentRound([]), 0);
	assert.equal(
		currentRound([{ body: '<!-- corsair-review-bot round=1 -->\nhi' }]),
		1,
	);
	assert.equal(
		currentRound([
			{ body: '<!-- corsair-review-bot round=1 -->' },
			{ body: '<!-- corsair-review-bot round=2 -->' },
		]),
		2,
	);
	assert.equal(currentRound([{ body: '<!-- corsair-pr-gate -->' }]), 0);
});

test('decision table', () => {
	assert.equal(decide(0, [f('P0')]), 'comment');
	assert.equal(decide(1, [f('P1')]), 'fix');
	assert.equal(decide(2, [f('P0')]), 'escalate');
	assert.equal(decide(0, []), 'done');
	assert.equal(decide(1, [f('P2')]), 'done'); // P2s alone never trigger a fix round
	assert.equal(decide(3, [f('P0')]), 'done'); // pushes after escalation stay silent
});

test('round-1 comment contains every P0/P1 with location', () => {
	const body = buildRoundOneComment(
		[f('P0'), f('P1')],
		[{ rule: 'R4', message: 'No demo video' }],
		'someuser',
	);
	assert.ok(body.startsWith('<!-- corsair-review-bot round=1 -->'));
	assert.ok(body.includes('@someuser'));
	assert.ok(body.includes('packages/facebook/client.ts:39'));
	assert.ok(body.includes('R4'));
	assert.ok(body.includes('P0'));
});

test('P2-only findings go to the optional section', () => {
	const body = buildRoundOneComment([f('P2')], [], 'someuser');
	assert.ok(body.includes('Optional improvements'));
});

test('escalation comment has round=3 marker', () => {
	assert.ok(
		buildEscalationComment([f('P0')]).startsWith(
			'<!-- corsair-review-bot round=3 -->',
		),
	);
});
