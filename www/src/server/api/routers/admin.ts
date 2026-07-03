import { TRPCError } from '@trpc/server';
import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '@/db/auth-schema';
import {
	getLatestStatusForIntegration,
	getLatestStatusesForIntegrations,
	insertIntegrationStatus,
	isIntegrationActivelyClaimed,
} from '@/db/integration-status';
import {
	emptyIntegrationUrls,
	fetchIntegrationUrlsByIntegrationIds,
} from '@/db/integration-urls';
import type { IntegrationPhase } from '@/db/schema';
import { integrations } from '@/db/schema';
import { phaseLabel } from '@/lib/integration-phases';
import { getGithubUserAvatars } from '@/server/github-users';

import { createTRPCRouter, ossAdminProcedure } from '../trpc';

const reviewPhaseOrder: Record<IntegrationPhase, number> = {
	ready_to_review: 0,
	building: 1,
	awaiting_pr: 2,
	awaiting_issue: 3,
	finished: 4,
	released: 5,
};

export const adminRouter = createTRPCRouter({
	reviewQueue: ossAdminProcedure.query(async ({ ctx }) => {
		const visibleRows = await ctx.db
			.select({
				id: integrations.id,
				name: integrations.name,
				slug: integrations.slug,
				points: integrations.points,
			})
			.from(integrations)
			.where(eq(integrations.show, true));

		const integrationIds = visibleRows.map((row) => row.id);
		const latestStatuses = await getLatestStatusesForIntegrations(
			ctx.db,
			integrationIds,
		);
		const integrationsById = new Map(visibleRows.map((row) => [row.id, row]));

		const activeStatuses = [...latestStatuses.values()].filter(
			(status) =>
				isIntegrationActivelyClaimed(status.phase) &&
				status.phase !== 'finished',
		);

		const claimerIds = [...new Set(activeStatuses.map((status) => status.userId))];
		const claimers =
			claimerIds.length > 0
				? await ctx.db
						.select({
							id: user.id,
							githubUsername: user.githubUsername,
							name: user.name,
						})
						.from(user)
						.where(inArray(user.id, claimerIds))
				: [];

		const claimersById = new Map(claimers.map((claimer) => [claimer.id, claimer]));
		const urlsByIntegration = await fetchIntegrationUrlsByIntegrationIds(
			ctx.db,
			activeStatuses.map((status) => status.integrationId),
		);

		const usernames = claimers
			.map((claimer) => claimer.githubUsername)
			.filter((username): username is string => username !== null);
		const avatars = await getGithubUserAvatars(usernames);

		const items = activeStatuses
			.map((status) => {
				const integration = integrationsById.get(status.integrationId);
				if (!integration) return null;

				const claimer = claimersById.get(status.userId);
				const githubUsername = claimer?.githubUsername ?? null;

				return {
					id: integration.id,
					name: integration.name,
					slug: integration.slug,
					points: integration.points,
					phase: status.phase,
					phaseLabel: phaseLabel(status.phase),
					occurredAt: status.occurredAt.toISOString(),
					claimerName: claimer?.name ?? null,
					claimerGithubUsername: githubUsername,
					claimerAvatarUrl: githubUsername
						? (avatars.get(githubUsername) ?? null)
						: null,
					urls:
						urlsByIntegration.get(integration.id) ?? emptyIntegrationUrls(),
				};
			})
			.filter((item): item is NonNullable<typeof item> => item !== null)
			.sort((left, right) => {
				const phaseDiff =
					reviewPhaseOrder[left.phase] - reviewPhaseOrder[right.phase];
				if (phaseDiff !== 0) return phaseDiff;
				return (
					new Date(left.occurredAt).getTime() -
					new Date(right.occurredAt).getTime()
				);
			});

		return {
			items,
			readyToReviewCount: items.filter(
				(item) => item.phase === 'ready_to_review',
			).length,
		};
	}),

	markMerged: ossAdminProcedure
		.input(
			z.object({
				integrationId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [integration] = await ctx.db
				.select({
					id: integrations.id,
					slug: integrations.slug,
				})
				.from(integrations)
				.where(eq(integrations.id, input.integrationId))
				.limit(1);

			if (!integration) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Integration not found',
				});
			}

			const latestStatus = await getLatestStatusForIntegration(
				ctx.db,
				input.integrationId,
			);

			if (!latestStatus || !isIntegrationActivelyClaimed(latestStatus.phase)) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Integration is not actively claimed',
				});
			}

			if (latestStatus.phase === 'finished') {
				return {
					integrationId: input.integrationId,
					slug: integration.slug,
					phase: 'finished' as const,
				};
			}

			const status = await insertIntegrationStatus(ctx.db, {
				integrationId: input.integrationId,
				userId: latestStatus.userId,
				phase: 'finished',
				greptileScore: latestStatus.greptileScore,
			});

			return {
				integrationId: input.integrationId,
				slug: integration.slug,
				phase: status.phase,
			};
		}),
});
