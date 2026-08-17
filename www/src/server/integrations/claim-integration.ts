import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';

import type { DB } from '@/db';
import type { LatestIntegrationStatus } from '@/db/integration-status';
import {
	getLatestStatusForIntegration,
	getUserClaimEligibility,
	ISSUE_DEADLINE_MS,
	insertIntegrationStatus,
	MAX_USER_BUILT_INTEGRATIONS,
} from '@/db/integration-status';
import type { IntegrationPhase } from '@/db/schema';
import { integrations } from '@/db/schema';
import type { ClaimPhase } from '@/server/integrations/claim-decision';
import { resolveClaimDecision } from '@/server/integrations/claim-decision';

export type {
	ClaimDecision,
	ClaimPhase,
} from '@/server/integrations/claim-decision';
export { resolveClaimDecision } from '@/server/integrations/claim-decision';

export type AtomicClaimResult =
	| {
			kind: 'claimed';
			integrationId: string;
			slug: string;
			phase: IntegrationPhase;
			issueDeadlineAt: Date | null;
			statusId: string;
			userId: string;
	  }
	| {
			kind: 'already_owned';
			integrationId: string;
			slug: string;
			phase: IntegrationPhase;
	  };

/**
 * Advisory-lock keys for a claim, user first then integration. The user key
 * serializes one user claiming two integrations at once (eligibility is a
 * per-user rule, so per-integration locks alone don't); the fixed order avoids
 * deadlock.
 */
export function claimLockKeys(
	userId: string,
	integrationId: string,
): [userKey: string, integrationKey: string] {
	return [`claim:user:${userId}`, `claim:integration:${integrationId}`];
}

/**
 * Atomically claim an integration. Locks on both the user and the integration
 * (see claimLockKeys), then re-checks eligibility + latest status before insert
 * to close the check-then-insert race.
 */
export async function claimIntegrationAtomically(
	db: DB,
	params: {
		integrationId: string;
		userId: string;
	},
): Promise<AtomicClaimResult> {
	return db.transaction(async (tx) => {
		const claimDb = tx as unknown as DB;

		// hashtext → int4 advisory key; xact locks auto-release on commit/rollback.
		const [userLockKey, integrationLockKey] = claimLockKeys(
			params.userId,
			params.integrationId,
		);
		await tx.execute(
			sql`SELECT pg_advisory_xact_lock(hashtext(${userLockKey}))`,
		);
		await tx.execute(
			sql`SELECT pg_advisory_xact_lock(hashtext(${integrationLockKey}))`,
		);

		const eligibility = await getUserClaimEligibility(claimDb, params.userId);
		if (!eligibility.canClaim) {
			if (eligibility.blockReason === 'limit_reached') {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: `You've built the maximum of ${MAX_USER_BUILT_INTEGRATIONS} integrations and can't claim another`,
				});
			}

			throw new TRPCError({
				code: 'PRECONDITION_FAILED',
				message:
					'Finish your current integration or mark it ready to review before claiming another',
			});
		}

		const [integration] = await tx
			.select({ id: integrations.id, slug: integrations.slug })
			.from(integrations)
			.where(
				and(
					eq(integrations.id, params.integrationId),
					eq(integrations.show, true),
				),
			)
			.for('update')
			.limit(1);

		if (!integration) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Integration not found',
			});
		}

		const latestStatus: LatestIntegrationStatus | null =
			await getLatestStatusForIntegration(claimDb, params.integrationId);

		const decision = resolveClaimDecision({
			latestPhase: (latestStatus?.phase ?? null) as ClaimPhase | null,
			latestUserId: latestStatus?.userId ?? null,
			claimantUserId: params.userId,
		});

		if (decision.action === 'return_existing') {
			return {
				kind: 'already_owned',
				integrationId: params.integrationId,
				slug: integration.slug,
				phase: decision.phase,
			};
		}

		if (decision.action === 'conflict') {
			throw new TRPCError({
				code: 'CONFLICT',
				message: 'This integration has already been claimed',
			});
		}

		const issueDeadlineAt = new Date(Date.now() + ISSUE_DEADLINE_MS);
		const status = await insertIntegrationStatus(claimDb, {
			integrationId: params.integrationId,
			userId: params.userId,
			phase: 'awaiting_issue',
			issueDeadlineAt,
		});

		return {
			kind: 'claimed',
			integrationId: params.integrationId,
			slug: integration.slug,
			phase: status.phase,
			issueDeadlineAt: status.issueDeadlineAt,
			statusId: status.id,
			userId: params.userId,
		};
	});
}
