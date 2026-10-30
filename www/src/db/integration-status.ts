import { desc, eq, inArray } from 'drizzle-orm';

import type { DB } from '@/db';
import { user } from '@/db/auth-schema';
import type { IntegrationPhase, IntegrationReleaseReason } from '@/db/schema';
import { integrationStatus, integrations } from '@/db/schema';
import type { ClaimBlockReason } from '@/lib/integration-claim-limits';
import { canClaimMore } from '@/lib/integration-claim-limits';
import { isIntegrationActivelyClaimed } from '@/lib/integration-phases';

export type { ClaimBlockReason } from '@/lib/integration-claim-limits';

export { MAX_USER_BUILT_INTEGRATIONS } from '@/lib/integration-claim-limits';
export {
	isIntegrationActivelyClaimed,
	isIntegrationAvailable,
	isWipPhase,
	legacyStatusFromPhase,
	phaseLabel,
	WIP_PHASES,
} from '@/lib/integration-phases';

export const ISSUE_DEADLINE_MS = 60 * 60 * 1000;
export const PR_DEADLINE_MS = 3 * 60 * 60 * 1000;

export type UserClaimEligibility = {
	canClaim: boolean;
	blockReason: ClaimBlockReason | null;
	builtCount: number;
};

export type LatestIntegrationStatus = {
	id: string;
	integrationId: string;
	userId: string;
	phase: IntegrationPhase;
	occurredAt: Date;
	issueDeadlineAt: Date | null;
	prDeadlineAt: Date | null;
	greptileScore: number | null;
	releaseReason: IntegrationReleaseReason | null;
};

export async function insertIntegrationStatus(
	db: DB,
	params: {
		integrationId: string;
		userId: string;
		phase: IntegrationPhase;
		issueDeadlineAt?: Date | null;
		prDeadlineAt?: Date | null;
		greptileScore?: number | null;
		releaseReason?: IntegrationReleaseReason | null;
		metadata?: Record<string, unknown>;
	},
) {
	const [row] = await db
		.insert(integrationStatus)
		.values({
			integrationId: params.integrationId,
			userId: params.userId,
			phase: params.phase,
			issueDeadlineAt: params.issueDeadlineAt ?? null,
			prDeadlineAt: params.prDeadlineAt ?? null,
			greptileScore: params.greptileScore ?? null,
			releaseReason: params.releaseReason ?? null,
			metadata: params.metadata ?? null,
		})
		.returning({
			id: integrationStatus.id,
			integrationId: integrationStatus.integrationId,
			userId: integrationStatus.userId,
			phase: integrationStatus.phase,
			occurredAt: integrationStatus.occurredAt,
			issueDeadlineAt: integrationStatus.issueDeadlineAt,
			prDeadlineAt: integrationStatus.prDeadlineAt,
			greptileScore: integrationStatus.greptileScore,
			releaseReason: integrationStatus.releaseReason,
		});

	return row;
}

export async function getLatestStatusForIntegration(
	db: DB,
	integrationId: string,
): Promise<LatestIntegrationStatus | null> {
	const [row] = await db
		.select({
			id: integrationStatus.id,
			integrationId: integrationStatus.integrationId,
			userId: integrationStatus.userId,
			phase: integrationStatus.phase,
			occurredAt: integrationStatus.occurredAt,
			issueDeadlineAt: integrationStatus.issueDeadlineAt,
			prDeadlineAt: integrationStatus.prDeadlineAt,
			greptileScore: integrationStatus.greptileScore,
			releaseReason: integrationStatus.releaseReason,
		})
		.from(integrationStatus)
		.where(eq(integrationStatus.integrationId, integrationId))
		.orderBy(desc(integrationStatus.occurredAt))
		.limit(1);

	return row ?? null;
}

export async function getLatestStatusesForIntegrations(
	db: DB,
	integrationIds: string[],
): Promise<Map<string, LatestIntegrationStatus>> {
	if (integrationIds.length === 0) {
		return new Map();
	}

	const rows = await db
		.selectDistinctOn([integrationStatus.integrationId], {
			id: integrationStatus.id,
			integrationId: integrationStatus.integrationId,
			userId: integrationStatus.userId,
			phase: integrationStatus.phase,
			occurredAt: integrationStatus.occurredAt,
			issueDeadlineAt: integrationStatus.issueDeadlineAt,
			prDeadlineAt: integrationStatus.prDeadlineAt,
			greptileScore: integrationStatus.greptileScore,
			releaseReason: integrationStatus.releaseReason,
		})
		.from(integrationStatus)
		.where(inArray(integrationStatus.integrationId, integrationIds))
		.orderBy(
			integrationStatus.integrationId,
			desc(integrationStatus.occurredAt),
		);

	return new Map(rows.map((row) => [row.integrationId, row]));
}

export async function getIntegrationStatusHistory(
	db: DB,
	integrationId: string,
) {
	return db
		.select({
			id: integrationStatus.id,
			userId: integrationStatus.userId,
			phase: integrationStatus.phase,
			occurredAt: integrationStatus.occurredAt,
			releaseReason: integrationStatus.releaseReason,
			githubUsername: user.githubUsername,
		})
		.from(integrationStatus)
		.leftJoin(user, eq(user.id, integrationStatus.userId))
		.where(eq(integrationStatus.integrationId, integrationId))
		.orderBy(desc(integrationStatus.occurredAt));
}

export type ActiveDeadlineClaim = {
	id: string;
	name: string;
	slug: string;
	phase: 'awaiting_issue' | 'awaiting_pr';
	deadlineAt: Date;
};

type PendingDeadline = {
	integrationId: string;
	phase: ActiveDeadlineClaim['phase'];
	deadlineAt: Date;
};

export async function getUserActiveDeadlineClaim(db: DB, userId: string) {
	const rows = await db
		.selectDistinctOn([integrationStatus.integrationId], {
			integrationId: integrationStatus.integrationId,
			phase: integrationStatus.phase,
			issueDeadlineAt: integrationStatus.issueDeadlineAt,
			prDeadlineAt: integrationStatus.prDeadlineAt,
		})
		.from(integrationStatus)
		.where(eq(integrationStatus.userId, userId))
		.orderBy(
			integrationStatus.integrationId,
			desc(integrationStatus.occurredAt),
		);

	// A user can hold two claims at once, so surface whichever deadline runs out
	// first — otherwise the expiry cron could release a claim whose countdown was
	// never shown.
	const [next] = rows
		.flatMap((row): PendingDeadline[] => {
			if (row.phase === 'awaiting_issue' && row.issueDeadlineAt) {
				return [
					{
						integrationId: row.integrationId,
						phase: 'awaiting_issue',
						deadlineAt: row.issueDeadlineAt,
					},
				];
			}

			if (row.phase === 'awaiting_pr' && row.prDeadlineAt) {
				return [
					{
						integrationId: row.integrationId,
						phase: 'awaiting_pr',
						deadlineAt: row.prDeadlineAt,
					},
				];
			}

			return [];
		})
		.sort((a, b) => a.deadlineAt.getTime() - b.deadlineAt.getTime());

	if (!next) {
		return null;
	}

	const [integration] = await db
		.select({
			id: integrations.id,
			name: integrations.name,
			slug: integrations.slug,
		})
		.from(integrations)
		.where(eq(integrations.id, next.integrationId))
		.limit(1);

	if (!integration) {
		return null;
	}

	return {
		...integration,
		phase: next.phase,
		deadlineAt: next.deadlineAt,
	} satisfies ActiveDeadlineClaim;
}

export async function getUserClaimEligibility(
	db: DB,
	userId: string,
): Promise<UserClaimEligibility> {
	// Every claim the user still holds counts against the cap — in progress,
	// ready to review, and finished alike. A slot frees up only when a claim is
	// released, by unclaiming or by a deadline timeout.
	const activeClaims = await getActiveClaimsForUser(db, userId);
	const builtCount = activeClaims.length;

	if (!canClaimMore(builtCount)) {
		return {
			canClaim: false,
			blockReason: 'limit_reached',
			builtCount,
		};
	}

	return {
		canClaim: true,
		blockReason: null,
		builtCount,
	};
}

export async function getActiveClaimsForUser(db: DB, userId: string) {
	const integrationIds = await db
		.selectDistinct({ integrationId: integrationStatus.integrationId })
		.from(integrationStatus)
		.where(eq(integrationStatus.userId, userId));

	const ids = integrationIds.map((row) => row.integrationId);
	const latestByIntegration = await getLatestStatusesForIntegrations(db, ids);

	return [...latestByIntegration.values()].filter(
		(status) =>
			status.userId === userId && isIntegrationActivelyClaimed(status.phase),
	);
}

export async function getExpiredDeadlineClaims(db: DB) {
	const rows = await db
		.selectDistinctOn([integrationStatus.integrationId], {
			id: integrationStatus.id,
			integrationId: integrationStatus.integrationId,
			userId: integrationStatus.userId,
			phase: integrationStatus.phase,
			issueDeadlineAt: integrationStatus.issueDeadlineAt,
			prDeadlineAt: integrationStatus.prDeadlineAt,
		})
		.from(integrationStatus)
		.orderBy(
			integrationStatus.integrationId,
			desc(integrationStatus.occurredAt),
		);

	const now = new Date();

	return rows.filter((row) => {
		if (row.phase === 'awaiting_issue' && row.issueDeadlineAt) {
			return row.issueDeadlineAt < now;
		}
		if (row.phase === 'awaiting_pr' && row.prDeadlineAt) {
			return row.prDeadlineAt < now;
		}
		return false;
	});
}

export async function releaseIntegrationClaim(
	db: DB,
	params: {
		integrationId: string;
		userId: string;
		reason: IntegrationReleaseReason;
	},
) {
	const latest = await getLatestStatusForIntegration(db, params.integrationId);

	if (!latest || latest.userId !== params.userId) {
		return null;
	}

	if (!isIntegrationActivelyClaimed(latest.phase)) {
		return null;
	}

	return insertIntegrationStatus(db, {
		integrationId: params.integrationId,
		userId: params.userId,
		phase: 'released',
		releaseReason: params.reason,
	});
}

export type ClaimExpiredInfo = {
	reason: 'issue_timeout' | 'pr_timeout';
	expiredAt: string;
};

export function getClaimExpiredForUser(
	currentUserId: string | undefined,
	latestStatus: LatestIntegrationStatus | null | undefined,
): ClaimExpiredInfo | null {
	if (!currentUserId || !latestStatus) {
		return null;
	}

	if (
		latestStatus.phase !== 'released' ||
		latestStatus.userId !== currentUserId ||
		(latestStatus.releaseReason !== 'issue_timeout' &&
			latestStatus.releaseReason !== 'pr_timeout')
	) {
		return null;
	}

	return {
		reason: latestStatus.releaseReason,
		expiredAt: latestStatus.occurredAt.toISOString(),
	};
}
