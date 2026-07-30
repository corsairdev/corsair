import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isClaimPhaseAvailable, resolveClaimDecision } from './claim-decision';

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
