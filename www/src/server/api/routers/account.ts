import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { user } from '@/db/auth-schema';

import {
	discordUsernameSchema,
	githubUsernameSchema,
} from '../schemas/usernames';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const accountRouter = createTRPCRouter({
	getProfile: protectedProcedure.query(async ({ ctx }) => {
		const [profile] = await ctx.db
			.select({
				email: user.email,
				githubUsername: user.githubUsername,
				discordUsername: user.discordUsername,
			})
			.from(user)
			.where(eq(user.id, ctx.user.id))
			.limit(1);

		return {
			email: profile?.email ?? ctx.user.email,
			githubUsername: profile?.githubUsername ?? null,
			discordUsername: profile?.discordUsername ?? null,
		};
	}),

	joinWaitlist: protectedProcedure
		.input(
			z.object({
				discordUsername: discordUsernameSchema,
				githubUsername: githubUsernameSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [existingGithub] = await ctx.db
				.select({ id: user.id })
				.from(user)
				.where(eq(user.githubUsername, input.githubUsername))
				.limit(1);

			if (existingGithub && existingGithub.id !== ctx.user.id) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'That GitHub username is already taken',
				});
			}

			const [updated] = await ctx.db
				.update(user)
				.set({
					githubUsername: input.githubUsername,
					discordUsername: input.discordUsername,
				})
				.where(eq(user.id, ctx.user.id))
				.returning({
					email: user.email,
					githubUsername: user.githubUsername,
					discordUsername: user.discordUsername,
				});

			return {
				email: updated?.email ?? ctx.user.email,
				githubUsername: updated?.githubUsername ?? input.githubUsername,
				discordUsername: updated?.discordUsername ?? input.discordUsername,
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

	setDiscordUsername: protectedProcedure
		.input(z.object({ username: discordUsernameSchema }))
		.mutation(async ({ ctx, input }) => {
			const [updated] = await ctx.db
				.update(user)
				.set({ discordUsername: input.username })
				.where(eq(user.id, ctx.user.id))
				.returning({ discordUsername: user.discordUsername });

			return {
				discordUsername: updated?.discordUsername ?? input.username,
			};
		}),
});
