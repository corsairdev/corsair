import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '@/db/auth-schema';
import { getGithubUserAvatar } from '@/server/github-users';
import {
	buildContributorRankings,
	getContributorRank,
} from '@/server/contributor-rankings';

import { githubUsernameSchema } from '../schemas/usernames';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const contributorsRouter = createTRPCRouter({
	byGithubUsername: publicProcedure
		.input(z.object({ username: githubUsernameSchema }))
		.query(async ({ ctx, input }) => {
			const [profileUser] = await ctx.db
				.select({
					id: user.id,
					name: user.name,
					githubUsername: user.githubUsername,
					discordUsername: user.discordUsername,
					createdAt: user.createdAt,
				})
				.from(user)
				.where(eq(user.githubUsername, input.username))
				.limit(1);

			if (!profileUser?.githubUsername) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Contributor not found',
				});
			}

			const rankings = await buildContributorRankings(ctx.db);
			const rankingEntry = rankings.find(
				(entry) => entry.userId === profileUser.id,
			);
			const rank = getContributorRank(rankings, profileUser.id);
			const avatarUrl = await getGithubUserAvatar(profileUser.githubUsername);

			return {
				name: profileUser.name,
				githubUsername: profileUser.githubUsername,
				discordUsername: profileUser.discordUsername,
				avatarUrl,
				rank,
				completedPoints: rankingEntry?.completedPoints ?? 0,
				pendingPoints: rankingEntry?.pendingPoints ?? 0,
				totalPoints: rankingEntry?.totalPoints ?? 0,
				integrations: rankingEntry?.integrations ?? [],
				memberSince: profileUser.createdAt.toISOString(),
			};
		}),
});
