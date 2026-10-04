export const MAX_USER_BUILT_INTEGRATIONS = 1;

export type ClaimBlockReason = 'limit_reached';

/**
 * Counts only the claims a contributor can still act on, which is what
 * `holdsClaimSlot` selects. A claim stops counting once it is handed off for
 * review, finished, or released, so the cap limits work in flight rather than
 * work completed.
 */
export function canClaimMore(activeClaimCount: number): boolean {
	return activeClaimCount < MAX_USER_BUILT_INTEGRATIONS;
}
