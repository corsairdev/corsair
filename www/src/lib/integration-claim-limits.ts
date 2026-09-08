export const MAX_USER_BUILT_INTEGRATIONS = 2;

export type ClaimBlockReason = 'limit_reached';

/**
 * Every claim a user still holds counts against the cap — in progress, ready to
 * review, and finished alike.
 */
export function canClaimMore(activeClaimCount: number): boolean {
	return activeClaimCount < MAX_USER_BUILT_INTEGRATIONS;
}
