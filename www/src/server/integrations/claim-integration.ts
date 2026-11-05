import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';

import type { DB } from '@/db';
import type {
	LatestIntegrationStatus,
	UserClaimEligibility,
} from '@/db/integration-status';
import {
	getLatestStatusForIntegration,
	getUserClaimEligibility,
	ISSUE_DEADLINE_MS,
	insertIntegrationStatus,
	MAX_USER_BUILT_INTEGRATIONS,
} from '@/db/integration-status';
import type { IntegrationPhase } from '@/db/schema';
import { integrations } from '@/db/schema';
import type {
	ClaimDecision,
	ClaimPhase,
} from '@/server/integrations/claim-decision';
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

// Advisory-lock classes for the two-arg pg_advisory_xact_lock(class, id) form —
// a key space separate from the single-arg form. Distinct classes keep user and
// integration locks from ever colliding.
const USER_LOCK_CLASS = 1;
const INTEGRATION_LOCK_CLASS = 2;

/**
 * Advisory-lock (class, id) pairs for a claim, user first then integration. The
 * user lock serializes one user claiming two integrations at once (eligibility
 * is per-user, so per-integration locks alone don't); the fixed order avoids
 * deadlock.
 */
export function claimLockKeys(
	userId: string,
	integrationId: string,
): [userLock: [number, string], integrationLock: [number, string]] {
	return [
		[USER_LOCK_CLASS, userId],
		[INTEGRATION_LOCK_CLASS, integrationId],
	];
}

type ClaimEligibility = Pick<UserClaimEligibility, 'canClaim' | 'blockReason'>;

/**
 * Claim precedence: an existing same-user claim or a conflict on this
 * integration is resolved before the per-user eligibility gate, so re-claiming
 * an integration you already hold returns already_owned instead of failing the
 * claim cap. Eligibility is a thunk, only queried for a genuinely new insert.
 */
export async function resolveClaimOutcome(
	decision: ClaimDecision,
	getEligibility: () => Promise<ClaimEligibility>,
): Promise<
	| { action: 'return_existing'; phase: ClaimPhase }
	| { action: 'conflict' }
	| { action: 'blocked'; blockReason: ClaimEligibility['blockReason'] }
	| { action: 'insert' }
> {
	if (decision.action === 'return_existing') {
		return { action: 'return_existing', phase: decision.phase };
	}
	if (decision.action === 'conflict') {
		return { action: 'conflict' };
	}
	const eligibility = await getEligibility();
	if (!eligibility.canClaim) {
		return { action: 'blocked', blockReason: eligibility.blockReason };
	}
	return { action: 'insert' };
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

		// Two-arg pg_advisory_xact_lock(class, id) — a key space separate from the
		// single-arg form; xact locks auto-release on commit/rollback. User lock
		// first (see claimLockKeys) so concurrent claims can't deadlock.
		const [userLock, integrationLock] = claimLockKeys(
			params.userId,
			params.integrationId,
		);
		await tx.execute(
			sql`SELECT pg_advisory_xact_lock(${userLock[0]}, hashtext(${userLock[1]}))`,
		);
		await tx.execute(
			sql`SELECT pg_advisory_xact_lock(${integrationLock[0]}, hashtext(${integrationLock[1]}))`,
		);

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

		const outcome = await resolveClaimOutcome(decision, () =>
			getUserClaimEligibility(claimDb, params.userId),
		);

		if (outcome.action === 'return_existing') {
			return {
				kind: 'already_owned',
				integrationId: params.integrationId,
				slug: integration.slug,
				phase: outcome.phase,
			};
		}

		if (outcome.action === 'conflict') {
			throw new TRPCError({
				code: 'CONFLICT',
				message: 'This integration has already been claimed',
			});
		}

		if (outcome.action === 'blocked') {
			throw new TRPCError({
				code: 'PRECONDITION_FAILED',
				message: `You've claimed the maximum of ${MAX_USER_BUILT_INTEGRATIONS} integrations and can't claim another`,
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
