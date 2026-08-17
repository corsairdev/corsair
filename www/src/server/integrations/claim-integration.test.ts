import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isClaimPhaseAvailable, resolveClaimDecision } from './claim-decision';
import { claimLockKeys } from './claim-integration';

describe('isClaimPhaseAvailable', () => {
	it('treats null and released as available', () => {
		assert.equal(isClaimPhaseAvailable(null), true);
		assert.equal(isClaimPhaseAvailable(undefined), true);
		assert.equal(isClaimPhaseAvailable('released'), true);
	});

	it('treats active phases as unavailable', () => {
		assert.equal(isClaimPhaseAvailable('awaiting_issue'), false);
		assert.equal(isClaimPhaseAvailable('finished'), false);
	});
});

describe('resolveClaimDecision', () => {
	it('allows insert when there is no prior status', () => {
		assert.deepEqual(
			resolveClaimDecision({
				latestPhase: null,
				latestUserId: null,
				claimantUserId: 'user-a',
			}),
			{ action: 'insert' },
		);
	});

	it('allows insert when the latest phase is released', () => {
		assert.deepEqual(
			resolveClaimDecision({
				latestPhase: 'released',
				latestUserId: 'user-b',
				claimantUserId: 'user-a',
			}),
			{ action: 'insert' },
		);
	});

	it('returns the existing claim when the same user re-claims', () => {
		assert.deepEqual(
			resolveClaimDecision({
				latestPhase: 'awaiting_issue',
				latestUserId: 'user-a',
				claimantUserId: 'user-a',
			}),
			{ action: 'return_existing', phase: 'awaiting_issue' },
		);

		assert.deepEqual(
			resolveClaimDecision({
				latestPhase: 'building',
				latestUserId: 'user-a',
				claimantUserId: 'user-a',
			}),
			{ action: 'return_existing', phase: 'building' },
		);
	});

	it('conflicts when another user holds a non-released claim', () => {
		for (const phase of [
			'awaiting_issue',
			'awaiting_pr',
			'building',
			'ready_to_review',
			'finished',
		] as const) {
			assert.deepEqual(
				resolveClaimDecision({
					latestPhase: phase,
					latestUserId: 'user-b',
					claimantUserId: 'user-a',
				}),
				{ action: 'conflict' },
			);
		}
	});
});

describe('claimLockKeys', () => {
	it('serializes one user across different integrations (user key ignores integration)', () => {
		const [userKeyA] = claimLockKeys('user-a', 'integration-1');
		const [userKeyB] = claimLockKeys('user-a', 'integration-2');
		assert.equal(userKeyA, userKeyB);
	});

	it('serializes different users on the same integration (integration key ignores user)', () => {
		const [, intKeyA] = claimLockKeys('user-a', 'integration-1');
		const [, intKeyB] = claimLockKeys('user-b', 'integration-1');
		assert.equal(intKeyA, intKeyB);
	});

	it('keeps user and integration locks in distinct namespaces', () => {
		const [userKey, intKey] = claimLockKeys('same-id', 'same-id');
		assert.notEqual(userKey, intKey);
	});

	it('returns keys user-first then integration (fixed order prevents deadlock)', () => {
		const [first, second] = claimLockKeys('u', 'i');
		assert.match(first, /^claim:user:/);
		assert.match(second, /^claim:integration:/);
	});
});
