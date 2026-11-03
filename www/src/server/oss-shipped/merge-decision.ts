import type { IntegrationPhase } from '@/db/schema';

export const SHIPPED_REPO = 'corsairdev/corsair';

/** The PR number of a corsairdev/corsair pull request URL, ignoring trailing paths like /files. */
export function parsePullRequestNumber(
	url: string,
	repo = SHIPPED_REPO,
): number | null {
	const match = url
		.trim()
		.match(
			/^https?:\/\/(?:www\.)?github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)(?:[/?#].*)?$/i,
		);
	if (!match?.[1] || !match[2]) return null;
	if (match[1].toLowerCase() !== repo.toLowerCase()) return null;
	return Number(match[2]);
}

export type MergeCreditDecision =
	| { kind: 'credit'; finish: boolean }
	| { kind: 'not_active' }
	| { kind: 'unverified' }
	| { kind: 'author_mismatch' };

/**
 * Whether a merged PR that's linked to a claim earns the claimer the integration.
 * Mirrors admin.markMerged: only an active claim can finish. The claimer must have
 * connected GitHub on their OSS profile, and that account must be the PR's author,
 * so a typed username or someone else's merged PR earns nothing. An admin can still
 * finish the claim by hand.
 */
export function decideMergeCredit(params: {
	latestPhase: IntegrationPhase | null;
	/** The claimer's connected GitHub account id, or null if they haven't connected GitHub. */
	claimerGithubId: string | null;
	prAuthorId: number;
}): MergeCreditDecision {
	if (params.latestPhase == null || params.latestPhase === 'released') {
		return { kind: 'not_active' };
	}
	if (!params.claimerGithubId) return { kind: 'unverified' };
	if (params.claimerGithubId !== String(params.prAuthorId)) {
		return { kind: 'author_mismatch' };
	}
	return { kind: 'credit', finish: params.latestPhase !== 'finished' };
}
