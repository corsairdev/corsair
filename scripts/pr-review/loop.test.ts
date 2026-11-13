import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	buildEscalationComment,
	buildResolvedComment,
	buildRoundOneComment,
	currentRound,
	decide,
	reviewSupersededByCleanSummary,
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
	assert.equal(decide(1, [f('P1')]), 'escalate');
	assert.equal(decide(2, [f('P0')]), 'escalate'); // legacy round-2 marker still escalates
	assert.equal(decide(0, []), 'done');
	assert.equal(decide(1, [f('P2')]), 'done'); // P2s alone never escalate
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

const summaryBody = (sha: string, badges = '') =>
	`<h3>Greptile Summary</h3>${badges}\nConfidence Score: 5/5\nReviews (5) · Last reviewed commit: ["fix(ramp): time out a token response bod..."](https://github.com/corsairdev/corsair/commit/${sha}) · [Reviewed by Greptile](https://www.greptile.com/)`;
const summary = (sha: string, updatedAt: string, badges = '') => ({
	body: summaryBody(sha, badges),
	updatedAt,
});
const review = (commitId: string, submittedAt: string) => ({
	commitId,
	submittedAt,
});
const OLD = 'f8411cb362779897ed7000c25a20e3e566871a9f';
const NEW = 'dbbfc849d8bb4914a4b2d1ddb50328027aea3669';

test('a later clean summary supersedes an older review (corsair#2184, 11-12)', () => {
	assert.equal(
		reviewSupersededByCleanSummary(
			summary(NEW, '2026-11-12T19:05:00Z'),
			review(OLD, '2026-11-12T18:16:10Z'),
		),
		true,
	);
});

test('a review newer than the summary keeps its findings', () => {
	// Review B lands with findings while the summary still names clean commit A.
	assert.equal(
		reviewSupersededByCleanSummary(
			summary(OLD, '2026-11-12T18:16:10Z'),
			review(NEW, '2026-11-12T19:05:00Z'),
		),
		false,
	);
});

test('the review is current when the summary names its commit', () => {
	assert.equal(
		reviewSupersededByCleanSummary(
			summary(OLD, '2026-11-12T19:05:00Z'),
			review(OLD, '2026-11-12T18:16:10Z'),
		),
		false,
	);
});

test('a later summary that still shows a P0 or P1 does not clear the review', () => {
	assert.equal(
		reviewSupersededByCleanSummary(
			summary(NEW, '2026-11-12T19:05:00Z', '<img alt="P1" src="x">'),
			review(OLD, '2026-11-12T18:16:10Z'),
		),
		false,
	);
});

test('missing pieces keep the review', () => {
	assert.equal(
		reviewSupersededByCleanSummary(
			undefined,
			review(OLD, '2026-11-12T18:16:10Z'),
		),
		false,
	);
	assert.equal(
		reviewSupersededByCleanSummary(
			summary(NEW, '2026-11-12T19:05:00Z'),
			undefined,
		),
		false,
	);
	assert.equal(
		reviewSupersededByCleanSummary(
			{ body: 'no commit line here', updatedAt: '2026-11-12T19:05:00Z' },
			review(OLD, '2026-11-12T18:16:10Z'),
		),
		false,
	);
	assert.equal(
		reviewSupersededByCleanSummary(
			summary(NEW, ''),
			review(OLD, '2026-11-12T18:16:10Z'),
		),
		false,
	);
});

test('the resolved comment keeps the round=3 marker so it replaces the escalation', () => {
	const body = buildResolvedComment();
	assert.ok(body.startsWith('<!-- corsair-review-bot round=3 -->'));
	assert.match(body, /no longer needed/);
});
