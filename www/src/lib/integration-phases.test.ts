import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { IntegrationPhase } from '@/db/schema';

import {
	holdsClaimSlot,
	isIntegrationActivelyClaimed,
	isWipPhase,
} from './integration-phases';

const ALL_PHASES = [
	'awaiting_issue',
	'awaiting_pr',
	'building',
	'ready_to_review',
	'finished',
	'released',
] as const satisfies readonly IntegrationPhase[];

describe('holdsClaimSlot', () => {
	it('holds a slot only while the contributor can still act', () => {
		assert.equal(holdsClaimSlot('awaiting_issue'), true);
		assert.equal(holdsClaimSlot('awaiting_pr'), true);
		assert.equal(holdsClaimSlot('building'), true);
	});

	it('frees the slot once the work is out of the contributor’s hands', () => {
		// The next move on a submitted PR belongs to a maintainer, and review has
		// taken over a week in practice. Holding the slot through it caps a
		// contributor at one integration for as long as the queue runs.
		assert.equal(holdsClaimSlot('ready_to_review'), false);
		assert.equal(holdsClaimSlot('finished'), false);
	});

	it('does not hold a slot for a released claim', () => {
		assert.equal(holdsClaimSlot('released'), false);
		assert.equal(holdsClaimSlot(null), false);
		assert.equal(holdsClaimSlot(undefined), false);
	});

	it('agrees with isWipPhase on every real phase', () => {
		for (const phase of ALL_PHASES) {
			assert.equal(holdsClaimSlot(phase), isWipPhase(phase), phase);
		}
	});
});

describe('isIntegrationActivelyClaimed', () => {
	it('still treats every unreleased phase as claimed', () => {
		// Display and points attribution keep the wider meaning: a finished
		// integration stays attached to its contributor even though it no longer
		// holds a claim slot.
		for (const phase of ALL_PHASES) {
			assert.equal(isIntegrationActivelyClaimed(phase), phase !== 'released');
		}
	});
});
