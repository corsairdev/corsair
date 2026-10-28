import { and, count, desc, eq, inArray, like } from 'drizzle-orm';
import type { DB } from '@/db';
import { account } from '@/db/auth-schema';
import {
	getLatestStatusForIntegration,
	insertIntegrationStatus,
} from '@/db/integration-status';
import { integrationStatus, integrations, integrationUrls } from '@/db/schema';
import type { ShippedCredit, ShippedMessage, ShippedPullRequest } from './card';
import { buildShippedMessage } from './card';
import {
	decideMergeCredit,
	parsePullRequestNumber,
	SHIPPED_REPO,
} from './merge-decision';

export type PullRequestClosedEvent = {
	action: string;
	pull_request: ShippedPullRequest & { merged: boolean; draft?: boolean };
	repository: { full_name: string };
};

type SendToShipped = (
	message: ShippedMessage,
) => Promise<{ id: string } | null>;

/**
 * Every claim that links this PR. More than one integration can link the same URL,
 * so the caller picks the one the PR's author holds rather than whichever row comes first.
 */
async function findClaimsForPullRequest(db: DB, prNumber: number) {
	const rows = await db
		.select({
			integrationId: integrationUrls.integrationId,
			url: integrationUrls.url,
		})
		.from(integrationUrls)
		.where(
			and(
				eq(integrationUrls.type, 'pr'),
				like(integrationUrls.url, `%/pull/${prNumber}%`),
			),
		);
	const integrationIds = [
		...new Set(
			rows
				.filter((row) => parsePullRequestNumber(row.url) === prNumber)
				.map((row) => row.integrationId),
		),
	];

	const claims = [];
	for (const integrationId of integrationIds) {
		const [integration] = await db
			.select({
				id: integrations.id,
				name: integrations.name,
				slug: integrations.slug,
				points: integrations.points,
			})
			.from(integrations)
			.where(eq(integrations.id, integrationId))
			.limit(1);
		if (!integration) continue;
		const latest = await getLatestStatusForIntegration(db, integration.id);
		claims.push({ integration, latest });
	}
	return claims;
}

/** The GitHub and Discord accounts the claimer connected on their OSS profile. */
async function claimerProfile(db: DB, userId: string) {
	const linked = await db
		.select({ providerId: account.providerId, accountId: account.accountId })
		.from(account)
		.where(
			and(
				eq(account.userId, userId),
				inArray(account.providerId, ['github', 'discord']),
			),
		);
	const idFor = (providerId: string) =>
		linked.find((row) => row.providerId === providerId)?.accountId ?? null;
	return {
		githubUserId: idFor('github'),
		discordUserId: idFor('discord'),
	};
}

async function finishedCount(db: DB, userId: string) {
	const [row] = await db
		.select({ n: count() })
		.from(integrationStatus)
		.where(
			and(
				eq(integrationStatus.userId, userId),
				eq(integrationStatus.phase, 'finished'),
			),
		);
	return row?.n ?? 0;
}

/** The latest finished row for an integration, to record the Discord post on it once. */
async function latestFinishedRow(db: DB, integrationId: string) {
	const [row] = await db
		.select({ id: integrationStatus.id, metadata: integrationStatus.metadata })
		.from(integrationStatus)
		.where(
			and(
				eq(integrationStatus.integrationId, integrationId),
				eq(integrationStatus.phase, 'finished'),
			),
		)
		.orderBy(desc(integrationStatus.occurredAt))
		.limit(1);
	return row ?? null;
}

/**
 * Runs when GitHub reports a closed PR on corsairdev/corsair. A merged PR that is
 * linked to an active claim finishes it (what admin.markMerged does by hand) and
 * posts a #shipped card with the points; any other merge gets the plain card.
 */
export async function handleMergedPullRequest(
	db: DB,
	event: PullRequestClosedEvent,
	send: SendToShipped,
): Promise<{
	outcome: string;
	integrationId?: string;
	integrationSlug?: string;
}> {
	const pr = event.pull_request;
	if (event.action !== 'closed' || !pr.merged || pr.draft)
		return { outcome: 'not_merged' };
	if (event.repository.full_name.toLowerCase() !== SHIPPED_REPO)
		return { outcome: 'other_repo' };

	// The claim the PR's author holds wins; otherwise the first one, for the log below.
	let picked: {
		claim: Awaited<ReturnType<typeof findClaimsForPullRequest>>[number];
		profile: Awaited<ReturnType<typeof claimerProfile>> | null;
		decision: ReturnType<typeof decideMergeCredit>;
	} | null = null;
	for (const candidate of await findClaimsForPullRequest(db, pr.number)) {
		const candidateProfile = candidate.latest
			? await claimerProfile(db, candidate.latest.userId)
			: null;
		const candidateDecision = decideMergeCredit({
			latestPhase: candidate.latest?.phase ?? null,
			claimerGithubId: candidateProfile?.githubUserId ?? null,
			prAuthorId: pr.user.id,
		});
		if (!picked || candidateDecision.kind === 'credit') {
			picked = {
				claim: candidate,
				profile: candidateProfile,
				decision: candidateDecision,
			};
		}
		if (candidateDecision.kind === 'credit') break;
	}
	const claim = picked?.claim ?? null;
	let credit: ShippedCredit | null = null;
	let finishedRowId: string | null = null;

	if (claim && picked) {
		const { profile, decision } = picked;

		if (decision.kind === 'credit' && claim.latest && profile) {
			if (decision.finish) {
				const row = await insertIntegrationStatus(db, {
					integrationId: claim.integration.id,
					userId: claim.latest.userId,
					phase: 'finished',
					greptileScore: claim.latest.greptileScore,
					metadata: {
						source: 'github_merge',
						prNumber: pr.number,
						mergedAt: pr.merged_at,
					},
				});
				finishedRowId = row?.id ?? null;
			} else {
				// Already finished (e.g. by hand). Post once: skip if a card was recorded.
				const row = await latestFinishedRow(db, claim.integration.id);
				// `metadata` is an untyped jsonb column holding free-form keys (source,
				// prNumber, shippedMessageId); a string-keyed record is as strict as it allows.
				const meta = (row?.metadata ?? {}) as Record<string, unknown>;
				if (meta.shippedMessageId)
					return {
						outcome: 'already_posted',
						integrationId: claim.integration.id,
					};
				finishedRowId = row?.id ?? null;
			}
			credit = {
				integrationName: claim.integration.name,
				integrationSlug: claim.integration.slug,
				points: claim.integration.points,
				discordUserId: profile.discordUserId,
				firstMerge: (await finishedCount(db, claim.latest.userId)) === 1,
			};
		} else if (decision.kind === 'unverified') {
			console.info(
				"[oss-shipped] claimer hasn't connected GitHub; leaving the claim for an admin",
				{ pr: pr.number, integrationId: claim.integration.id },
			);
		} else if (decision.kind === 'author_mismatch') {
			console.warn(
				'[oss-shipped] merged PR is linked to a claim by someone else; not finishing it',
				{
					pr: pr.number,
					integrationId: claim.integration.id,
				},
			);
		}
	}

	const message = buildShippedMessage(pr, credit);
	if (!message)
		return { outcome: 'skipped', integrationId: claim?.integration.id };

	const posted = await send(message);
	if (posted && finishedRowId) {
		const [row] = await db
			.select({ metadata: integrationStatus.metadata })
			.from(integrationStatus)
			.where(eq(integrationStatus.id, finishedRowId))
			.limit(1);
		// Same untyped jsonb column as above: keep its keys and add the message id.
		const meta = (row?.metadata ?? {}) as Record<string, unknown>;
		await db
			.update(integrationStatus)
			.set({ metadata: { ...meta, shippedMessageId: posted.id } })
			.where(eq(integrationStatus.id, finishedRowId));
	}
	return {
		outcome: credit ? 'credited' : 'posted',
		integrationId: claim?.integration.id,
		integrationSlug: credit ? claim?.integration.slug : undefined,
	};
}
