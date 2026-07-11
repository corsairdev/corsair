import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { parseFindings } from './parse-greptile.ts';

const fixture = JSON.parse(
	fs.readFileSync(
		new URL('./fixtures/greptile-comments.json', import.meta.url),
		'utf8',
	),
);

test('parses real Greptile comments from PR #392', () => {
	const findings = parseFindings(fixture);
	assert.ok(findings.length >= 2);
	for (const f of findings) {
		assert.match(f.severity, /^P[0-2]$/);
		assert.ok(f.title.length > 0);
		assert.ok(f.path.length > 0);
	}
	const auth = findings.find((f) => f.title.includes('Authorization header'));
	assert.ok(auth);
	assert.equal(auth.severity, 'P1');
	assert.equal(auth.path, 'packages/facebook/client.ts');
});

test('ignores non-greptile comments', () => {
	const findings = parseFindings([
		{
			id: 1,
			pull_request_review_id: 9,
			user: { login: 'someone' },
			path: 'a.ts',
			line: 1,
			body: '<img alt="P0"> **x** y',
		},
	]);
	assert.equal(findings.length, 0);
});

test('filters by reviewId when given', () => {
	const all = parseFindings(fixture);
	const byReview = parseFindings(fixture, fixture[0].pull_request_review_id);
	assert.ok(byReview.length <= all.length);
	assert.ok(byReview.length >= 1);
});

test('comment without severity badge is skipped', () => {
	const findings = parseFindings([
		{
			id: 2,
			pull_request_review_id: 9,
			user: { login: 'greptile-apps[bot]' },
			path: 'a.ts',
			line: 1,
			body: 'just a note',
		},
	]);
	assert.equal(findings.length, 0);
});

const ruleFixture = JSON.parse(
	fs.readFileSync(
		new URL('./fixtures/greptile-rule-comment.json', import.meta.url),
		'utf8',
	),
);

test('rule-based finding gets a real title, not "Rule Used:"', () => {
	const findings = parseFindings(ruleFixture);
	assert.equal(findings.length, 1);
	const finding = findings[0];
	assert.ok(finding);
	assert.equal(finding.severity, 'P0');
	assert.ok(!finding.title.includes('Rule Used'));
	assert.ok(finding.title.includes('new Function()'));
});
