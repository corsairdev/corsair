import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '@/db/auth-schema';

import { createTRPCRouter, protectedProcedure } from '../trpc';

const githubUsernameSchema = z
	.string()
	.trim()
	.min(1, 'GitHub username is required')
	.max(39, 'GitHub username must be at most 39 characters')
	.regex(
		/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/,
		'Invalid GitHub username',
	)
	.transform((value) => value.toLowerCase());

export const accountRouter = createTRPCRouter({
	getProfile: protectedProcedure.query(async ({ ctx }) => {
		const [profile] = await ctx.db
			.select({
				githubUsername: user.githubUsername,
			})
			.from(user)
			.where(eq(user.id, ctx.user.id))
			.limit(1);

		return {
			githubUsername: profile?.githubUsername ?? null,
		};
	}),

	setGithubUsername: protectedProcedure
		.input(z.object({ username: githubUsernameSchema }))
		.mutation(async ({ ctx, input }) => {
			const [existing] = await ctx.db
				.select({ id: user.id })
				.from(user)
				.where(eq(user.githubUsername, input.username))
				.limit(1);

			if (existing && existing.id !== ctx.user.id) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'That GitHub username is already taken',
				});
			}

			const [updated] = await ctx.db
				.update(user)
				.set({ githubUsername: input.username })
				.where(eq(user.id, ctx.user.id))
				.returning({ githubUsername: user.githubUsername });

			return {
				githubUsername: updated?.githubUsername ?? input.username,
			};
		}),
});
