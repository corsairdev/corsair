import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { decideMergeCredit, parsePullRequestNumber } from './merge-decision';

describe('parsePullRequestNumber', () => {
	it('reads the number from corsairdev/corsair PR URLs, with or without a trailing path', () => {
		assert.equal(
			parsePullRequestNumber('https://github.com/corsairdev/corsair/pull/1831'),
			1831,
		);
		assert.equal(
			parsePullRequestNumber(
				'https://github.com/corsairdev/corsair/pull/1831/files',
			),
			1831,
		);
		assert.equal(
			parsePullRequestNumber(
				'https://github.com/CorsairDev/Corsair/pull/42#issuecomment-1',
			),
			42,
		);
		assert.equal(
			parsePullRequestNumber(
				'  https://www.github.com/corsairdev/corsair/pull/7?w=1 ',
			),
			7,
		);
	});

	it('ignores other repos, issues and look-alike numbers', () => {
		assert.equal(
			parsePullRequestNumber('https://github.com/someone/corsair/pull/1831'),
			null,
		);
		assert.equal(
			parsePullRequestNumber(
				'https://github.com/corsairdev/corsair/issues/1831',
			),
			null,
		);
		assert.equal(
			parsePullRequestNumber(
				'https://github.com/corsairdev/corsair/pull/18310x',
			),
			null,
		);
		assert.equal(parsePullRequestNumber('not a url'), null);
	});
});

describe('decideMergeCredit', () => {
	const base = {
		claimerGithubLogin: 'Srinidhi444',
		prAuthorLogin: 'srinidhi444',
	};

	it('finishes an active claim when the PR author is the claimer (case-insensitive)', () => {
		assert.deepEqual(decideMergeCredit({ ...base, latestPhase: 'building' }), {
			kind: 'credit',
			finish: true,
		});
		assert.deepEqual(
			decideMergeCredit({ ...base, latestPhase: 'ready_to_review' }),
			{ kind: 'credit', finish: true },
		);
	});

	it('credits without finishing again when the claim is already finished', () => {
		assert.deepEqual(decideMergeCredit({ ...base, latestPhase: 'finished' }), {
			kind: 'credit',
			finish: false,
		});
	});

	it('does nothing for released or missing claims', () => {
		assert.deepEqual(decideMergeCredit({ ...base, latestPhase: 'released' }), {
			kind: 'not_active',
		});
		assert.deepEqual(decideMergeCredit({ ...base, latestPhase: null }), {
			kind: 'not_active',
		});
	});

	it("doesn't credit a claim for someone else's merged PR", () => {
		assert.deepEqual(
			decideMergeCredit({
				latestPhase: 'building',
				claimerGithubLogin: 'alice',
				prAuthorLogin: 'bob',
			}),
			{ kind: 'author_mismatch' },
		);
		assert.deepEqual(
			decideMergeCredit({
				latestPhase: 'building',
				claimerGithubLogin: null,
				prAuthorLogin: 'bob',
			}),
			{ kind: 'author_mismatch' },
		);
	});
});
