import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isClaimPhaseAvailable, resolveClaimDecision } from './claim-decision';
import { claimLockKeys, resolveClaimOutcome } from './claim-integration';

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
	it('serializes one user across different integrations (user lock ignores integration)', () => {
		const [userLockA] = claimLockKeys('user-a', 'integration-1');
		const [userLockB] = claimLockKeys('user-a', 'integration-2');
		assert.deepEqual(userLockA, userLockB);
	});

	it('serializes different users on the same integration (integration lock ignores user)', () => {
		const [, intLockA] = claimLockKeys('user-a', 'integration-1');
		const [, intLockB] = claimLockKeys('user-b', 'integration-1');
		assert.deepEqual(intLockA, intLockB);
	});

	it('locks user and integration in distinct classes', () => {
		const [[userClass], [intClass]] = claimLockKeys('same-id', 'same-id');
		assert.notEqual(userClass, intClass);
	});

	it('returns the user lock first then integration (fixed order prevents deadlock)', () => {
		const [userLock, intLock] = claimLockKeys('u', 'i');
		assert.equal(userLock[1], 'u');
		assert.equal(intLock[1], 'i');
	});
});

describe('resolveClaimOutcome', () => {
	it('returns an existing claim without querying eligibility', async () => {
		let queried = false;
		const outcome = await resolveClaimOutcome(
			{ action: 'return_existing', phase: 'awaiting_issue' },
			async () => {
				queried = true;
				return { canClaim: true, blockReason: null };
			},
		);
		assert.deepEqual(outcome, {
			action: 'return_existing',
			phase: 'awaiting_issue',
		});
		assert.equal(queried, false);
	});

	it('reports a conflict without querying eligibility', async () => {
		let queried = false;
		const outcome = await resolveClaimOutcome(
			{ action: 'conflict' },
			async () => {
				queried = true;
				return { canClaim: true, blockReason: null };
			},
		);
		assert.deepEqual(outcome, { action: 'conflict' });
		assert.equal(queried, false);
	});

	it('blocks a genuinely new claim when the user is at the claim cap', async () => {
		const outcome = await resolveClaimOutcome(
			{ action: 'insert' },
			async () => ({
				canClaim: false,
				blockReason: 'limit_reached',
			}),
		);
		assert.deepEqual(outcome, {
			action: 'blocked',
			blockReason: 'limit_reached',
		});
	});

	it('allows a new claim when the user is eligible', async () => {
		const outcome = await resolveClaimOutcome(
			{ action: 'insert' },
			async () => ({
				canClaim: true,
				blockReason: null,
			}),
		);
		assert.deepEqual(outcome, { action: 'insert' });
	});
});
