import { TRPCError } from '@trpc/server';
import type { SQL } from 'drizzle-orm';
import {
	and,
	asc,
	count,
	desc,
	eq,
	ilike,
	inArray,
	or,
	sql,
} from 'drizzle-orm';
import { z } from 'zod';
import type { DB } from '@/db';
import { user } from '@/db/auth-schema';
import type { LatestIntegrationStatus } from '@/db/integration-status';
import {
	getActiveClaimsForUser,
	getClaimExpiredForUser,
	getIntegrationStatusHistory,
	getLatestStatusesForIntegrations,
	getLatestStatusForIntegration,
	getUserActiveDeadlineClaim,
	getUserWipClaim,
	ISSUE_DEADLINE_MS,
	insertIntegrationStatus,
	isIntegrationActivelyClaimed,
	isIntegrationAvailable,
	legacyStatusFromPhase,
	PR_DEADLINE_MS,
	releaseIntegrationClaim,
	userHasWipClaim,
} from '@/db/integration-status';
import {
	fetchIntegrationTags,
	fetchIntegrationTagsByIntegrationIds,
} from '@/db/integration-tags';
import {
	clearContributorIntegrationUrls,
	emptyIntegrationUrls,
	fetchIntegrationUrls,
	fetchIntegrationUrlsByIntegrationIds,
	upsertIntegrationUrls,
} from '@/db/integration-urls';
import type { IntegrationPhase, IntegrationUrls } from '@/db/schema';
import {
	authSchemes,
	integrationStatus,
	integrations,
	integrationTags,
	operations,
	tags,
	triggers,
} from '@/db/schema';
import { visibleAuthModes } from '@/lib/visible-auth-modes';
import { getGithubUserAvatars } from '@/server/github-users';
import {
	sendClaimCreatedEvent,
	sendIssueLinkedEvent,
	sendPrLinkedEvent,
} from '@/server/inngest/events';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const PAGE_SIZE = 50;

const optionalUrlSchema = z.preprocess(
	(value) => (value == null ? '' : value),
	z
		.string()
		.trim()
		.max(2048)
		.transform((value) => {
			if (!value) return null;

			if (/^https?:\/\//i.test(value)) {
				return value;
			}

			return `https://${value}`;
		})
		.refine(
			(value) => value === null || /^https?:\/\/.+/i.test(value),
			'Enter a valid URL',
		),
);

const integrationUrlsSchema = z.object({
	issueUrl: optionalUrlSchema,
	prUrl: optionalUrlSchema,
	docsUrl: optionalUrlSchema,
});

function normalizeIntegrationUrls(
	urls:
		| IntegrationUrls
		| z.infer<typeof integrationUrlsSchema>
		| null
		| undefined,
) {
	const parsed = integrationUrlsSchema.safeParse(urls ?? {});
	if (!parsed.success) {
		return { issueUrl: null, prUrl: null, docsUrl: null };
	}

	return {
		issueUrl: parsed.data.issueUrl,
		prUrl: parsed.data.prUrl,
		docsUrl: parsed.data.docsUrl,
	};
}

function searchFilter(query: string | undefined): SQL | undefined {
	const term = query?.trim();
	if (!term) return undefined;

	const pattern = `%${term}%`;

	return or(
		ilike(integrations.name, pattern),
		ilike(integrations.slug, pattern),
		ilike(integrations.description, pattern),
	);
}

function visibleIntegrationsFilter(query?: string, tagSlugs?: string[]): SQL {
	const conditions: SQL[] = [eq(integrations.show, true)];

	const search = searchFilter(query);
	if (search) conditions.push(search);

	const slugs = tagSlugs?.map((slug) => slug.trim()).filter(Boolean);
	if (slugs?.length) {
		conditions.push(
			inArray(
				integrations.id,
				sql`(
					select ${integrationTags.integrationId}
					from ${integrationTags}
					inner join ${tags} on ${integrationTags.tagId} = ${tags.id}
					where ${inArray(tags.slug, slugs)}
					group by ${integrationTags.integrationId}
					having count(distinct ${tags.slug}) = ${slugs.length}
				)`,
			),
		);
	}

	return and(...conditions)!;
}

function mapIntegrationClaimFields(
	integrationId: string,
	currentUserId: string | undefined,
	latestStatus: LatestIntegrationStatus | undefined,
	claimerGithubUsername: string | null,
	claimerAvatarUrl: string | null,
) {
	const isClaimed =
		latestStatus != null && isIntegrationActivelyClaimed(latestStatus.phase);

	return {
		isClaimed,
		phase: isClaimed ? latestStatus!.phase : null,
		status: legacyStatusFromPhase(isClaimed ? latestStatus!.phase : null),
		claimedByCurrentUser:
			currentUserId !== undefined &&
			isClaimed &&
			latestStatus!.userId === currentUserId,
		claimerGithubUsername: isClaimed ? claimerGithubUsername : null,
		claimerAvatarUrl: isClaimed ? claimerAvatarUrl : null,
		issueDeadlineAt: isClaimed
			? (latestStatus!.issueDeadlineAt?.toISOString() ?? null)
			: null,
		prDeadlineAt: isClaimed
			? (latestStatus!.prDeadlineAt?.toISOString() ?? null)
			: null,
		greptileScore: isClaimed ? latestStatus!.greptileScore : null,
	};
}

async function maybeAdvancePhaseAfterUrlUpdate(
	db: DB,
	params: {
		integrationId: string;
		userId: string;
		slug: string;
		previousUrls: IntegrationUrls;
		nextUrls: IntegrationUrls;
	},
) {
	const latest = await getLatestStatusForIntegration(db, params.integrationId);

	if (!latest || latest.userId !== params.userId) {
		return null;
	}

	const issueNewlyLinked =
		!params.previousUrls.issueUrl &&
		Boolean(params.nextUrls.issueUrl) &&
		latest.phase === 'awaiting_issue';

	if (issueNewlyLinked) {
		const prDeadlineAt = new Date(Date.now() + PR_DEADLINE_MS);
		const status = await insertIntegrationStatus(db, {
			integrationId: params.integrationId,
			userId: params.userId,
			phase: 'awaiting_pr',
			prDeadlineAt,
		});

		await sendIssueLinkedEvent({
			statusId: status.id,
			integrationId: params.integrationId,
			userId: params.userId,
			slug: params.slug,
		});

		return status;
	}

	const prNewlyLinked =
		!params.previousUrls.prUrl &&
		Boolean(params.nextUrls.prUrl) &&
		latest.phase === 'awaiting_pr';

	if (prNewlyLinked) {
		const status = await insertIntegrationStatus(db, {
			integrationId: params.integrationId,
			userId: params.userId,
			phase: 'building',
		});

		await sendPrLinkedEvent({
			statusId: status.id,
			integrationId: params.integrationId,
			userId: params.userId,
			slug: params.slug,
		});

		return status;
	}

	return null;
}

export const integrationsRouter = createTRPCRouter({
	stats: publicProcedure.query(async ({ ctx }) => {
		const visibleRows = await ctx.db
			.select({ id: integrations.id })
			.from(integrations)
			.where(eq(integrations.show, true));

		const total = visibleRows.length;
		const latestStatuses = await getLatestStatusesForIntegrations(
			ctx.db,
			visibleRows.map((row) => row.id),
		);

		let claimed = 0;
		let finished = 0;
		const contributorIds = new Set<string>();

		for (const status of latestStatuses.values()) {
			if (!isIntegrationActivelyClaimed(status.phase)) continue;

			claimed += 1;
			contributorIds.add(status.userId);
			if (status.phase === 'finished') {
				finished += 1;
			}
		}

		return {
			total,
			claimed,
			finished,
			inProgress: Math.max(0, claimed - finished),
			unclaimed: Math.max(0, total - claimed),
			contributors: contributorIds.size,
		};
	}),

	recentActivity: publicProcedure
		.input(
			z
				.object({ limit: z.number().int().min(1).max(50).default(12) })
				.default({ limit: 12 }),
		)
		.query(async ({ ctx, input }) => {
			const rows = await ctx.db
				.select({
					id: integrationStatus.id,
					phase: integrationStatus.phase,
					occurredAt: integrationStatus.occurredAt,
					githubUsername: user.githubUsername,
					integrationName: integrations.name,
					integrationSlug: integrations.slug,
					points: integrations.points,
				})
				.from(integrationStatus)
				.innerJoin(user, eq(user.id, integrationStatus.userId))
				.innerJoin(
					integrations,
					and(
						eq(integrations.id, integrationStatus.integrationId),
						eq(integrations.show, true),
					),
				)
				.where(
					inArray(integrationStatus.phase, [
						'awaiting_issue',
						'released',
						'finished',
					]),
				)
				.orderBy(desc(integrationStatus.occurredAt))
				.limit(input.limit);

			const usernames = [
				...new Set(
					rows
						.map((row) => row.githubUsername)
						.filter((username): username is string => username !== null),
				),
			];
			const avatars = await getGithubUserAvatars(usernames);

			const phaseToType = (
				phase: IntegrationPhase,
			): 'claimed' | 'unclaimed' | 'finished' => {
				switch (phase) {
					case 'released':
						return 'unclaimed';
					case 'finished':
						return 'finished';
					default:
						return 'claimed';
				}
			};

			return {
				items: rows.map((row) => ({
					id: row.id,
					type: phaseToType(row.phase),
					createdAt: row.occurredAt.toISOString(),
					githubUsername: row.githubUsername ?? null,
					avatarUrl: row.githubUsername
						? (avatars.get(row.githubUsername) ?? null)
						: null,
					integrationName: row.integrationName,
					integrationSlug: row.integrationSlug,
					points: row.points,
				})),
			};
		}),

	activeDeadlineClaim: protectedProcedure.query(async ({ ctx }) => {
		const claim = await getUserActiveDeadlineClaim(ctx.db, ctx.user.id);

		if (!claim) {
			return null;
		}

		return {
			slug: claim.slug,
			name: claim.name,
			phase: claim.phase,
			deadlineAt: claim.deadlineAt.toISOString(),
			label:
				claim.phase === 'awaiting_issue'
					? 'Time left to link your issue'
					: 'Time left to link your PR',
		};
	}),

	listMine: protectedProcedure.query(async ({ ctx }) => {
		const activeClaims = await getActiveClaimsForUser(ctx.db, ctx.user.id);

		if (activeClaims.length === 0) {
			return { items: [] };
		}

		const phaseByIntegration = new Map(
			activeClaims.map((claim) => [claim.integrationId, claim.phase]),
		);

		const items = await ctx.db
			.select({
				id: integrations.id,
				name: integrations.name,
				slug: integrations.slug,
			})
			.from(integrations)
			.where(
				inArray(
					integrations.id,
					activeClaims.map((claim) => claim.integrationId),
				),
			)
			.orderBy(asc(integrations.name));

		return {
			items: items.map((item) => ({
				...item,
				phase: phaseByIntegration.get(item.id) ?? null,
			})),
		};
	}),

	list: publicProcedure
		.input(
			z
				.object({
					page: z.number().int().min(1).default(1),
					q: z.string().optional(),
					tags: z.array(z.string().min(1)).optional(),
				})
				.default({ page: 1 }),
		)
		.query(async ({ ctx, input }) => {
			const offset = (input.page - 1) * PAGE_SIZE;
			const where = visibleIntegrationsFilter(input.q, input.tags);
			const currentUserId = ctx.session?.user?.id;

			const [rows, countResult] = await Promise.all([
				ctx.db
					.select({
						id: integrations.id,
						name: integrations.name,
						slug: integrations.slug,
						description: integrations.description,
						points: integrations.points,
					})
					.from(integrations)
					.where(where)
					.orderBy(asc(integrations.name))
					.limit(PAGE_SIZE)
					.offset(offset),
				ctx.db.select({ total: count() }).from(integrations).where(where),
			]);

			const total = countResult[0]?.total ?? 0;
			const integrationIds = rows.map((row) => row.id);
			const latestStatuses = await getLatestStatusesForIntegrations(
				ctx.db,
				integrationIds,
			);

			const claimerUserIds = [
				...new Set(
					[...latestStatuses.values()]
						.filter((status) => isIntegrationActivelyClaimed(status.phase))
						.map((status) => status.userId),
				),
			];

			const claimerUsers =
				claimerUserIds.length > 0
					? await ctx.db
							.select({
								id: user.id,
								githubUsername: user.githubUsername,
							})
							.from(user)
							.where(inArray(user.id, claimerUserIds))
					: [];

			const claimerUsernamesById = new Map(
				claimerUsers.map((row) => [row.id, row.githubUsername]),
			);

			const [
				operationCountRows,
				triggerCountRows,
				authSchemeCountRows,
				urlsByIntegration,
				tagsByIntegration,
			] =
				integrationIds.length > 0
					? await Promise.all([
							ctx.db
								.select({
									integrationId: operations.integrationId,
									count: count(),
								})
								.from(operations)
								.where(inArray(operations.integrationId, integrationIds))
								.groupBy(operations.integrationId),
							ctx.db
								.select({
									integrationId: triggers.integrationId,
									count: count(),
								})
								.from(triggers)
								.where(inArray(triggers.integrationId, integrationIds))
								.groupBy(triggers.integrationId),
							ctx.db
								.select({
									integrationId: authSchemes.integrationId,
									count: count(),
								})
								.from(authSchemes)
								.where(
									and(
										inArray(authSchemes.integrationId, integrationIds),
										inArray(authSchemes.mode, visibleAuthModes),
									),
								)
								.groupBy(authSchemes.integrationId),
							fetchIntegrationUrlsByIntegrationIds(ctx.db, integrationIds),
							fetchIntegrationTagsByIntegrationIds(ctx.db, integrationIds),
						])
					: [[], [], [], new Map<string, IntegrationUrls>(), new Map()];

			const operationCounts = new Map(
				operationCountRows.map((row) => [row.integrationId, row.count]),
			);
			const triggerCounts = new Map(
				triggerCountRows.map((row) => [row.integrationId, row.count]),
			);
			const authSchemeCounts = new Map(
				authSchemeCountRows.map((row) => [row.integrationId, row.count]),
			);

			const claimerUsernames = [
				...new Set(
					[...latestStatuses.values()]
						.map((status) => claimerUsernamesById.get(status.userId))
						.filter((username): username is string => username != null),
				),
			];
			const claimerAvatars = await getGithubUserAvatars(claimerUsernames);
			const wipClaim = currentUserId
				? await getUserWipClaim(ctx.db, currentUserId)
				: null;
			const userCanClaim = wipClaim == null;

			const items = rows.map((row) => {
				const latestStatus = latestStatuses.get(row.id);
				const claimerGithubUsername = latestStatus
					? (claimerUsernamesById.get(latestStatus.userId) ?? null)
					: null;

				return {
					id: row.id,
					name: row.name,
					slug: row.slug,
					description: row.description,
					points: row.points,
					tags: tagsByIntegration.get(row.id) ?? [],
					urls: normalizeIntegrationUrls(
						urlsByIntegration.get(row.id) ?? emptyIntegrationUrls(),
					),
					operationCount: operationCounts.get(row.id) ?? 0,
					triggerCount: triggerCounts.get(row.id) ?? 0,
					authSchemeCount: authSchemeCounts.get(row.id) ?? 0,
					...mapIntegrationClaimFields(
						row.id,
						currentUserId,
						latestStatus,
						claimerGithubUsername,
						claimerGithubUsername
							? (claimerAvatars.get(claimerGithubUsername) ?? null)
							: null,
					),
					userCanClaim,
				};
			});

			return {
				items,
				total,
				page: input.page,
				pageSize: PAGE_SIZE,
				totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
				q: input.q?.trim() ?? '',
				tags: input.tags ?? [],
				wipIntegrationName: wipClaim?.name ?? null,
			};
		}),

	listTags: publicProcedure.query(async ({ ctx }) => {
		const items = await ctx.db
			.select({
				id: tags.id,
				name: tags.name,
				slug: tags.slug,
				color: tags.color,
				integrationCount: count(integrationTags.id),
			})
			.from(tags)
			.leftJoin(integrationTags, eq(integrationTags.tagId, tags.id))
			.groupBy(tags.id, tags.name, tags.slug, tags.color)
			.orderBy(desc(count(integrationTags.id)), asc(tags.name));

		return { items };
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const [integration] = await ctx.db
				.select({
					id: integrations.id,
					name: integrations.name,
					slug: integrations.slug,
					description: integrations.description,
					points: integrations.points,
				})
				.from(integrations)
				.where(
					and(eq(integrations.slug, input.slug), eq(integrations.show, true)),
				)
				.limit(1);

			if (!integration) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Integration not found',
				});
			}

			const currentUserId = ctx.session?.user?.id;

			const [
				operationRows,
				triggerRows,
				authSchemeRows,
				latestStatus,
				statusHistory,
				urls,
				integrationTagRows,
			] = await Promise.all([
				ctx.db
					.select({
						id: operations.id,
						slug: operations.slug,
						name: operations.name,
						description: operations.description,
						tags: operations.tags,
						isDeprecated: operations.isDeprecated,
					})
					.from(operations)
					.where(eq(operations.integrationId, integration.id))
					.orderBy(asc(operations.name)),
				ctx.db
					.select({
						id: triggers.id,
						slug: triggers.slug,
						name: triggers.name,
						description: triggers.description,
						type: triggers.type,
					})
					.from(triggers)
					.where(eq(triggers.integrationId, integration.id))
					.orderBy(asc(triggers.name)),
				ctx.db
					.select({
						id: authSchemes.id,
						mode: authSchemes.mode,
						name: authSchemes.name,
						requiredFields: authSchemes.requiredFields,
						optionalFields: authSchemes.optionalFields,
					})
					.from(authSchemes)
					.where(
						and(
							eq(authSchemes.integrationId, integration.id),
							inArray(authSchemes.mode, visibleAuthModes),
						),
					)
					.orderBy(asc(authSchemes.name)),
				getLatestStatusForIntegration(ctx.db, integration.id),
				getIntegrationStatusHistory(ctx.db, integration.id),
				fetchIntegrationUrls(ctx.db, integration.id),
				fetchIntegrationTags(ctx.db, integration.id),
			]);

			const claimerGithubUsername = latestStatus
				? ((
						await ctx.db
							.select({ githubUsername: user.githubUsername })
							.from(user)
							.where(eq(user.id, latestStatus.userId))
							.limit(1)
					)[0]?.githubUsername ?? null)
				: null;
			const timelineUsernames = [
				...new Set(
					statusHistory
						.map((row) => row.githubUsername)
						.filter((username): username is string => username !== null),
				),
			];
			if (claimerGithubUsername) {
				timelineUsernames.push(claimerGithubUsername);
			}

			const avatars = await getGithubUserAvatars([
				...new Set(timelineUsernames),
			]);

			const claimFields = mapIntegrationClaimFields(
				integration.id,
				currentUserId,
				latestStatus ?? undefined,
				claimerGithubUsername,
				claimerGithubUsername
					? (avatars.get(claimerGithubUsername) ?? null)
					: null,
			);

			const wipClaim = currentUserId
				? await getUserWipClaim(ctx.db, currentUserId)
				: null;

			const claimExpiredForCurrentUser = getClaimExpiredForUser(
				currentUserId,
				latestStatus,
			);

			return {
				id: integration.id,
				name: integration.name,
				slug: integration.slug,
				description: integration.description,
				points: integration.points,
				tags: integrationTagRows,
				urls: normalizeIntegrationUrls(urls),
				operationCount: operationRows.length,
				triggerCount: triggerRows.length,
				authSchemeCount: authSchemeRows.length,
				operations: operationRows,
				triggers: triggerRows,
				authSchemes: authSchemeRows,
				...claimFields,
				canClaimAnother: wipClaim == null,
				wipIntegrationName: wipClaim?.name ?? null,
				claimExpiredForCurrentUser,
				timeline: statusHistory.map((event) => ({
					id: event.id,
					phase: event.phase,
					type: event.phase,
					createdAt: event.occurredAt.toISOString(),
					githubUsername: event.githubUsername ?? null,
					avatarUrl: event.githubUsername
						? (avatars.get(event.githubUsername) ?? null)
						: null,
					releaseReason: event.releaseReason,
				})),
			};
		}),

	leaderboard: publicProcedure
		.input(
			z
				.object({
					page: z.number().int().min(1).default(1),
				})
				.default({ page: 1 }),
		)
		.query(async ({ ctx, input }) => {
			const visibleRows = await ctx.db
				.select({
					id: integrations.id,
					name: integrations.name,
					slug: integrations.slug,
					points: integrations.points,
				})
				.from(integrations)
				.where(eq(integrations.show, true));

			const latestStatuses = await getLatestStatusesForIntegrations(
				ctx.db,
				visibleRows.map((row) => row.id),
			);

			const integrationsById = new Map(visibleRows.map((row) => [row.id, row]));

			const userClaims = new Map<
				string,
				{ id: string; name: string; slug: string; points: number }[]
			>();

			for (const status of latestStatuses.values()) {
				if (!isIntegrationActivelyClaimed(status.phase)) continue;

				const integration = integrationsById.get(status.integrationId);
				if (!integration) continue;

				const existing = userClaims.get(status.userId) ?? [];
				existing.push({
					id: integration.id,
					name: integration.name,
					slug: integration.slug,
					points: integration.points,
				});
				userClaims.set(status.userId, existing);
			}

			const userIds = [...userClaims.keys()];
			const users =
				userIds.length > 0
					? await ctx.db
							.select({
								id: user.id,
								githubUsername: user.githubUsername,
							})
							.from(user)
							.where(inArray(user.id, userIds))
					: [];

			const ranked = users
				.map((row) => {
					const claimedIntegrations = userClaims.get(row.id) ?? [];
					const totalPoints = claimedIntegrations.reduce(
						(sum, integration) => sum + integration.points,
						0,
					);

					return {
						userId: row.id,
						githubUsername: row.githubUsername ?? null,
						totalPoints,
						integrations: claimedIntegrations.sort((a, b) =>
							a.name.localeCompare(b.name),
						),
					};
				})
				.sort((a, b) => b.totalPoints - a.totalPoints);

			const total = ranked.length;
			const offset = (input.page - 1) * PAGE_SIZE;
			const pageItems = ranked.slice(offset, offset + PAGE_SIZE);
			const usernames = [
				...new Set(
					pageItems
						.map((row) => row.githubUsername)
						.filter((username): username is string => username !== null),
				),
			];
			const avatars = await getGithubUserAvatars(usernames);

			const items = pageItems.map((row, index) => ({
				rank: offset + index + 1,
				userId: row.userId,
				githubUsername: row.githubUsername,
				avatarUrl: row.githubUsername
					? (avatars.get(row.githubUsername) ?? null)
					: null,
				totalPoints: row.totalPoints,
				integrations: row.integrations,
			}));

			return {
				items,
				total,
				page: input.page,
				pageSize: PAGE_SIZE,
				totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
			};
		}),

	claim: protectedProcedure
		.input(z.object({ integrationId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			if (await userHasWipClaim(ctx.db, ctx.user.id)) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message:
						'Finish your current integration or mark it ready to review before claiming another',
				});
			}

			const [integration] = await ctx.db
				.select({ id: integrations.id, slug: integrations.slug })
				.from(integrations)
				.where(
					and(
						eq(integrations.id, input.integrationId),
						eq(integrations.show, true),
					),
				)
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

			if (latestStatus && !isIntegrationAvailable(latestStatus.phase)) {
				if (latestStatus.userId === ctx.user.id) {
					return {
						integrationId: input.integrationId,
						slug: integration.slug,
						phase: latestStatus.phase,
					};
				}

				throw new TRPCError({
					code: 'CONFLICT',
					message: 'This integration has already been claimed',
				});
			}

			const issueDeadlineAt = new Date(Date.now() + ISSUE_DEADLINE_MS);
			const status = await insertIntegrationStatus(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
				phase: 'awaiting_issue',
				issueDeadlineAt,
			});

			await sendClaimCreatedEvent({
				statusId: status.id,
				integrationId: input.integrationId,
				userId: ctx.user.id,
				slug: integration.slug,
			});

			return {
				integrationId: input.integrationId,
				slug: integration.slug,
				phase: status.phase,
				issueDeadlineAt: status.issueDeadlineAt,
			};
		}),

	unclaim: protectedProcedure
		.input(z.object({ integrationId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const [integration] = await ctx.db
				.select({ slug: integrations.slug })
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
					code: 'NOT_FOUND',
					message: 'This integration is not claimed',
				});
			}

			if (latestStatus.userId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You can only unclaim integrations you have claimed',
				});
			}

			await releaseIntegrationClaim(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
				reason: 'manual',
			});

			await clearContributorIntegrationUrls(ctx.db, input.integrationId);

			return { integrationId: input.integrationId, slug: integration.slug };
		}),

	updateUrls: protectedProcedure
		.input(
			z.object({
				integrationId: z.string().min(1),
				urls: integrationUrlsSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [integration] = await ctx.db
				.select({ id: integrations.id, slug: integrations.slug })
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

			if (
				!latestStatus ||
				latestStatus.userId !== ctx.user.id ||
				!isIntegrationActivelyClaimed(latestStatus.phase)
			) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Only the integration owner can update URLs',
				});
			}

			const previousUrls = normalizeIntegrationUrls(
				await fetchIntegrationUrls(ctx.db, input.integrationId),
			);
			const urls = normalizeIntegrationUrls(input.urls);

			await upsertIntegrationUrls(ctx.db, input.integrationId, urls);

			await maybeAdvancePhaseAfterUrlUpdate(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
				slug: integration.slug,
				previousUrls,
				nextUrls: urls,
			});

			const updatedStatus = await getLatestStatusForIntegration(
				ctx.db,
				input.integrationId,
			);

			return {
				integrationId: input.integrationId,
				slug: integration.slug,
				urls,
				phase: updatedStatus?.phase ?? latestStatus.phase,
				issueDeadlineAt: updatedStatus?.issueDeadlineAt ?? null,
				prDeadlineAt: updatedStatus?.prDeadlineAt ?? null,
			};
		}),

	markReadyToReview: protectedProcedure
		.input(z.object({ integrationId: z.string().min(1) }))
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

			if (!latestStatus || latestStatus.userId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Only the integration owner can mark it ready to review',
				});
			}

			if (latestStatus.phase === 'ready_to_review') {
				return {
					integrationId: input.integrationId,
					slug: integration.slug,
					phase: 'ready_to_review' as const,
				};
			}

			if (latestStatus.phase !== 'building') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Link your issue and PR before marking ready to review',
				});
			}

			const urls = normalizeIntegrationUrls(
				await fetchIntegrationUrls(ctx.db, input.integrationId),
			);
			if (!urls.issueUrl || !urls.prUrl) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message:
						'Add both an issue URL and a PR URL before marking ready to review',
				});
			}

			const greptileScore = latestStatus.greptileScore;
			if (greptileScore != null && greptileScore < 4) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Greptile score must be at least 4 before marking ready',
				});
			}

			const status = await insertIntegrationStatus(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
				phase: 'ready_to_review',
				greptileScore,
			});

			return {
				integrationId: input.integrationId,
				slug: integration.slug,
				phase: status.phase,
			};
		}),

	markFinished: protectedProcedure
		.input(z.object({ integrationId: z.string().min(1) }))
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

			if (!latestStatus || latestStatus.userId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Only the integration owner can mark it as finished',
				});
			}

			if (latestStatus.phase === 'finished') {
				return {
					integrationId: input.integrationId,
					slug: integration.slug,
					phase: 'finished' as const,
				};
			}

			if (latestStatus.phase !== 'ready_to_review') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Mark the integration ready to review before finishing',
				});
			}

			const status = await insertIntegrationStatus(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
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
