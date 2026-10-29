/**
 * Pure claim decision helpers (no DB / Next.js imports) so they can be
 * unit-tested with node:test without path-alias bootstrapping.
 */

export type ClaimPhase =
	| 'awaiting_issue'
	| 'awaiting_pr'
	| 'building'
	| 'ready_to_review'
	| 'finished'
	| 'released';

export type ClaimDecision =
	| { action: 'insert' }
	| { action: 'return_existing'; phase: ClaimPhase }
	| { action: 'conflict' };

export function isClaimPhaseAvailable(
	phase: ClaimPhase | null | undefined,
): boolean {
	return phase == null || phase === 'released';
}

/**
 * Encodes: available → insert; same user active claim → idempotent return;
 * other user / non-released phase → conflict.
 */
export function resolveClaimDecision(input: {
	latestPhase: ClaimPhase | null;
	latestUserId: string | null;
	claimantUserId: string;
}): ClaimDecision {
	if (isClaimPhaseAvailable(input.latestPhase)) {
		return { action: 'insert' };
	}

	if (input.latestUserId === input.claimantUserId && input.latestPhase) {
		return { action: 'return_existing', phase: input.latestPhase };
	}

	return { action: 'conflict' };
}
