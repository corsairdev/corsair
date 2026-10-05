import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ReviewComment } from './parse-greptile.ts';
import { parseFindings } from './parse-greptile.ts';

// Inline, not a fixture file: `**/fixtures` is gitignored (.gitignore:209), so
// the recorded payloads this used to read were never committable and the test
// could not run on a clean checkout.
const badge = (sev: string) =>
	`<a href="https://app.greptile.com/review/github"><img alt="${sev}" src="https://img.shields.io/badge/${sev}-orange" /></a>`;

const comments: ReviewComment[] = [
	{
		id: 101,
		pull_request_review_id: 9001,
		user: { login: 'greptile-apps[bot]' },
		path: 'packages/facebook/client.ts',
		line: 42,
		body: `${badge('P1')} **Missing Authorization header** The request is sent without the bearer token, so every call 401s.`,
	},
	{
		id: 102,
		pull_request_review_id: 9001,
		user: { login: 'greptile-apps[bot]' },
		path: 'packages/facebook/endpoints.ts',
		line: 17,
		body: `${badge('P2')} **Unvalidated response** The provider payload is returned without a zod parse.`,
	},
	{
		id: 103,
		pull_request_review_id: 9002,
		user: { login: 'greptile-apps[bot]' },
		path: 'packages/facebook/schema/database.ts',
		line: null,
		body: `${badge('P0')} **Secret written to the entity table** The access token is persisted in plaintext.`,
	},
	{
		id: 104,
		pull_request_review_id: 9001,
		user: { login: 'a-human' },
		path: 'packages/facebook/client.ts',
		line: 5,
		body: `${badge('P0')} **Looks fine to me** not a Greptile finding.`,
	},
];

test('parses Greptile review comments into findings', () => {
	const findings = parseFindings(comments);
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
	// The badge anchor is stripped, so it never leaks into the title or detail.
	assert.ok(!auth.title.includes('<a href'));
	assert.ok(!auth.detail.includes('img alt'));
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
	const all = parseFindings(comments);
	const byReview = parseFindings(comments, 9001);
	assert.ok(byReview.length < all.length);
	assert.ok(byReview.length >= 1);
	assert.ok(byReview.every((f) => f.path.startsWith('packages/facebook/')));
	assert.ok(!byReview.some((f) => f.commentId === 103));
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

// A rule-based finding leads with prose; its first bold is the "Rule Used:"
// label, which must not become the title.
test('rule-based finding gets a real title, not "Rule Used:"', () => {
	const findings = parseFindings([
		{
			id: 201,
			pull_request_review_id: 9003,
			user: { login: 'greptile-apps[bot]' },
			path: 'packages/corsair/core/eval.ts',
			line: 12,
			body: `${badge('P0')} Generated content is passed to new Function(), which executes it.\n\n**Rule Used:** Never use eval/new Function on generated content.`,
		},
	]);
	assert.equal(findings.length, 1);
	const finding = findings[0];
	assert.ok(finding);
	assert.equal(finding.severity, 'P0');
	assert.ok(!finding.title.includes('Rule Used'));
	assert.ok(finding.title.includes('new Function()'));
});

test('a null line is carried through rather than dropped', () => {
	const [finding] = parseFindings(comments, 9002);
	assert.ok(finding);
	assert.equal(finding.line, null);
});
