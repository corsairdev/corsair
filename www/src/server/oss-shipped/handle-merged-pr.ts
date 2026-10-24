import { and, count, desc, eq, like } from 'drizzle-orm';
import type { DB } from '@/db';
import { account, user } from '@/db/auth-schema';
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

/** The claim a merged PR finishes: the integration whose linked PR URL is this PR. */
async function findClaimForPullRequest(db: DB, prNumber: number) {
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
	const match = rows.find(
		(row) => parsePullRequestNumber(row.url) === prNumber,
	);
	if (!match) return null;

	const [integration] = await db
		.select({
			id: integrations.id,
			name: integrations.name,
			slug: integrations.slug,
			points: integrations.points,
		})
		.from(integrations)
		.where(eq(integrations.id, match.integrationId))
		.limit(1);
	if (!integration) return null;

	const latest = await getLatestStatusForIntegration(db, integration.id);
	return { integration, latest };
}

async function claimerProfile(db: DB, userId: string) {
	const [row] = await db
		.select({ githubUsername: user.githubUsername })
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);
	// Filled in once the contributor connects Discord on their OSS profile.
	const [discord] = await db
		.select({ discordUserId: account.accountId })
		.from(account)
		.where(and(eq(account.userId, userId), eq(account.providerId, 'discord')))
		.limit(1);
	return {
		githubUsername: row?.githubUsername ?? null,
		discordUserId: discord?.discordUserId ?? null,
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
): Promise<{ outcome: string; integrationId?: string }> {
	const pr = event.pull_request;
	if (event.action !== 'closed' || !pr.merged || pr.draft)
		return { outcome: 'not_merged' };
	if (event.repository.full_name.toLowerCase() !== SHIPPED_REPO)
		return { outcome: 'other_repo' };

	const claim = await findClaimForPullRequest(db, pr.number);
	let credit: ShippedCredit | null = null;
	let finishedRowId: string | null = null;

	if (claim) {
		const profile = claim.latest
			? await claimerProfile(db, claim.latest.userId)
			: null;
		const decision = decideMergeCredit({
			latestPhase: claim.latest?.phase ?? null,
			claimerGithubLogin: profile?.githubUsername ?? null,
			prAuthorLogin: pr.user.login,
		});

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
		const meta = (row?.metadata ?? {}) as Record<string, unknown>;
		await db
			.update(integrationStatus)
			.set({ metadata: { ...meta, shippedMessageId: posted.id } })
			.where(eq(integrationStatus.id, finishedRowId));
	}
	return {
		outcome: credit ? 'credited' : 'posted',
		integrationId: claim?.integration.id,
	};
}
