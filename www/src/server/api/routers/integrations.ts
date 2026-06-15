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
import {
	clearContributorIntegrationUrls,
	emptyIntegrationUrls,
	fetchIntegrationUrls,
	fetchIntegrationUrlsByIntegrationIds,
	upsertIntegrationUrls,
} from '@/db/integration-urls';
import {
	fetchIntegrationTags,
	fetchIntegrationTagsByIntegrationIds,
} from '@/db/integration-tags';
import type { IntegrationUrls } from '@/db/schema';
import {
	authSchemes,
	integrationTags,
	integrations,
	operations,
	tags,
	triggers,
	userIntegrationEvents,
	userIntegrations,
} from '@/db/schema';
import { visibleAuthModes } from '@/lib/visible-auth-modes';
import { getGithubUserAvatars } from '@/server/github-users';

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

async function logIntegrationEvent(
	db: DB,
	params: {
		integrationId: string;
		userId: string;
		type: 'claimed' | 'unclaimed' | 'finished';
	},
) {
	await db.insert(userIntegrationEvents).values({
		integrationId: params.integrationId,
		userId: params.userId,
		type: params.type,
	});
}

export const integrationsRouter = createTRPCRouter({
	listMine: protectedProcedure.query(async ({ ctx }) => {
		const items = await ctx.db
			.select({
				id: integrations.id,
				name: integrations.name,
				slug: integrations.slug,
			})
			.from(userIntegrations)
			.innerJoin(
				integrations,
				eq(integrations.id, userIntegrations.integrationId),
			)
			.where(eq(userIntegrations.userId, ctx.user.id))
			.orderBy(asc(integrations.name));

		return { items };
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
						claimerUserId: userIntegrations.userId,
						claimerGithubUsername: user.githubUsername,
						status: userIntegrations.status,
					})
					.from(integrations)
					.leftJoin(
						userIntegrations,
						eq(userIntegrations.integrationId, integrations.id),
					)
					.leftJoin(user, eq(user.id, userIntegrations.userId))
					.where(where)
					.orderBy(asc(integrations.name))
					.limit(PAGE_SIZE)
					.offset(offset),
				ctx.db.select({ total: count() }).from(integrations).where(where),
			]);

			const total = countResult[0]?.total ?? 0;
			const integrationIds = rows.map((row) => row.id);

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
					rows
						.map((row) => row.claimerGithubUsername)
						.filter((username): username is string => username !== null),
				),
			];
			const claimerAvatars = await getGithubUserAvatars(claimerUsernames);

			const items = rows.map((row) => ({
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
				isClaimed: row.claimerUserId !== null,
				status: row.claimerUserId !== null ? row.status : null,
				claimedByCurrentUser:
					currentUserId !== undefined && row.claimerUserId === currentUserId,
				claimerGithubUsername: row.claimerGithubUsername ?? null,
				claimerAvatarUrl: row.claimerGithubUsername
					? (claimerAvatars.get(row.claimerGithubUsername) ?? null)
					: null,
			}));

			return {
				items,
				total,
				page: input.page,
				pageSize: PAGE_SIZE,
				totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
				q: input.q?.trim() ?? '',
				tags: input.tags ?? [],
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
				claimRow,
				timelineRows,
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
				ctx.db
					.select({
						userId: userIntegrations.userId,
						githubUsername: user.githubUsername,
						status: userIntegrations.status,
					})
					.from(userIntegrations)
					.leftJoin(user, eq(user.id, userIntegrations.userId))
					.where(eq(userIntegrations.integrationId, integration.id))
					.limit(1),
				ctx.db
					.select({
						id: userIntegrationEvents.id,
						type: userIntegrationEvents.type,
						createdAt: userIntegrationEvents.createdAt,
						githubUsername: user.githubUsername,
					})
					.from(userIntegrationEvents)
					.innerJoin(user, eq(user.id, userIntegrationEvents.userId))
					.where(eq(userIntegrationEvents.integrationId, integration.id))
					.orderBy(desc(userIntegrationEvents.createdAt)),
				fetchIntegrationUrls(ctx.db, integration.id),
				fetchIntegrationTags(ctx.db, integration.id),
			]);

			const claimerGithubUsername = claimRow[0]?.githubUsername ?? null;
			const timelineUsernames = [
				...new Set(
					timelineRows
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

			return {
				id: integration.id,
				name: integration.name,
				slug: integration.slug,
				description: integration.description,
				tags: integrationTagRows,
				urls: normalizeIntegrationUrls(urls),
				operationCount: operationRows.length,
				triggerCount: triggerRows.length,
				authSchemeCount: authSchemeRows.length,
				operations: operationRows,
				triggers: triggerRows,
				authSchemes: authSchemeRows,
				isClaimed: claimRow.length > 0,
				status: claimRow[0]?.status ?? null,
				claimedByCurrentUser:
					currentUserId !== undefined && claimRow[0]?.userId === currentUserId,
				claimerGithubUsername,
				claimerAvatarUrl: claimerGithubUsername
					? (avatars.get(claimerGithubUsername) ?? null)
					: null,
				timeline: timelineRows.map((event) => ({
					id: event.id,
					type: event.type,
					createdAt: event.createdAt.toISOString(),
					githubUsername: event.githubUsername ?? null,
					avatarUrl: event.githubUsername
						? (avatars.get(event.githubUsername) ?? null)
						: null,
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
			const offset = (input.page - 1) * PAGE_SIZE;

			const [rows, countResult] = await Promise.all([
				ctx.db
					.select({
						userId: userIntegrations.userId,
						githubUsername: user.githubUsername,
					})
					.from(userIntegrations)
					.innerJoin(
						integrations,
						and(
							eq(integrations.id, userIntegrations.integrationId),
							eq(integrations.show, true),
						),
					)
					.innerJoin(user, eq(user.id, userIntegrations.userId))
					.groupBy(userIntegrations.userId, user.githubUsername)
					.orderBy(desc(sql`coalesce(sum(${integrations.points}), 0)`))
					.limit(PAGE_SIZE)
					.offset(offset),
				ctx.db
					.select({
						total: sql<number>`cast(count(distinct ${userIntegrations.userId}) as int)`,
					})
					.from(userIntegrations)
					.innerJoin(
						integrations,
						and(
							eq(integrations.id, userIntegrations.integrationId),
							eq(integrations.show, true),
						),
					),
			]);

			const total = countResult[0]?.total ?? 0;
			const userIds = rows.map((row) => row.userId);

			const claims =
				userIds.length > 0
					? await ctx.db
							.select({
								userId: userIntegrations.userId,
								id: integrations.id,
								name: integrations.name,
								slug: integrations.slug,
								points: integrations.points,
							})
							.from(userIntegrations)
							.innerJoin(
								integrations,
								and(
									eq(integrations.id, userIntegrations.integrationId),
									eq(integrations.show, true),
								),
							)
							.where(inArray(userIntegrations.userId, userIds))
							.orderBy(asc(integrations.name))
					: [];

			const integrationsByUser = new Map<
				string,
				{ id: string; name: string; slug: string; points: number }[]
			>();
			for (const claim of claims) {
				const existing = integrationsByUser.get(claim.userId) ?? [];
				existing.push({
					id: claim.id,
					name: claim.name,
					slug: claim.slug,
					points: claim.points,
				});
				integrationsByUser.set(claim.userId, existing);
			}

			const usernames = [
				...new Set(
					rows
						.map((row) => row.githubUsername)
						.filter((username): username is string => username !== null),
				),
			];
			const avatars = await getGithubUserAvatars(usernames);

			const items = rows.map((row, index) => {
				const userClaimedIntegrations =
					integrationsByUser.get(row.userId) ?? [];
				const totalPoints = userClaimedIntegrations.reduce(
					(sum, integration) => sum + integration.points,
					0,
				);

				return {
					rank: offset + index + 1,
					userId: row.userId,
					githubUsername: row.githubUsername ?? null,
					avatarUrl: row.githubUsername
						? (avatars.get(row.githubUsername) ?? null)
						: null,
					totalPoints,
					integrations: userClaimedIntegrations,
				};
			});

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

			const [existingClaim] = await ctx.db
				.select({ userId: userIntegrations.userId })
				.from(userIntegrations)
				.where(eq(userIntegrations.integrationId, input.integrationId))
				.limit(1);

			if (existingClaim) {
				if (existingClaim.userId === ctx.user.id) {
					return {
						integrationId: input.integrationId,
						slug: integration.slug,
					};
				}

				throw new TRPCError({
					code: 'CONFLICT',
					message: 'This integration has already been claimed',
				});
			}

			await ctx.db.insert(userIntegrations).values({
				userId: ctx.user.id,
				integrationId: input.integrationId,
			});

			await logIntegrationEvent(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
				type: 'claimed',
			});

			return { integrationId: input.integrationId, slug: integration.slug };
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

			const [existingClaim] = await ctx.db
				.select({ userId: userIntegrations.userId })
				.from(userIntegrations)
				.where(eq(userIntegrations.integrationId, input.integrationId))
				.limit(1);

			if (!existingClaim) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'This integration is not claimed',
				});
			}

			if (existingClaim.userId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You can only unclaim integrations you have claimed',
				});
			}

			await ctx.db
				.delete(userIntegrations)
				.where(
					and(
						eq(userIntegrations.integrationId, input.integrationId),
						eq(userIntegrations.userId, ctx.user.id),
					),
				);

			await logIntegrationEvent(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
				type: 'unclaimed',
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

			const [claim] = await ctx.db
				.select({ userId: userIntegrations.userId })
				.from(userIntegrations)
				.where(eq(userIntegrations.integrationId, input.integrationId))
				.limit(1);

			if (!claim || claim.userId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Only the integration owner can update URLs',
				});
			}

			const urls = normalizeIntegrationUrls(input.urls);

			await upsertIntegrationUrls(ctx.db, input.integrationId, urls);

			return {
				integrationId: input.integrationId,
				slug: integration.slug,
				urls,
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

			const [claim] = await ctx.db
				.select({
					userId: userIntegrations.userId,
					status: userIntegrations.status,
				})
				.from(userIntegrations)
				.where(eq(userIntegrations.integrationId, input.integrationId))
				.limit(1);

			if (!claim) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'This integration is not claimed',
				});
			}

			if (claim.userId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Only the integration owner can mark it as finished',
				});
			}

			if (claim.status === 'finished') {
				return {
					integrationId: input.integrationId,
					slug: integration.slug,
					status: 'finished' as const,
				};
			}

			const urls = normalizeIntegrationUrls(
				await fetchIntegrationUrls(ctx.db, input.integrationId),
			);
			if (!urls.issueUrl || !urls.prUrl) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message:
						'Add both an issue URL and a PR URL before marking this integration as finished',
				});
			}

			await ctx.db
				.update(userIntegrations)
				.set({ status: 'finished' })
				.where(
					and(
						eq(userIntegrations.integrationId, input.integrationId),
						eq(userIntegrations.userId, ctx.user.id),
					),
				);

			await logIntegrationEvent(ctx.db, {
				integrationId: input.integrationId,
				userId: ctx.user.id,
				type: 'finished',
			});

			return {
				integrationId: input.integrationId,
				slug: integration.slug,
				status: 'finished' as const,
			};
		}),
});
