import { TRPCError } from '@trpc/server';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

import type { DB } from '@/db';
import { account, user } from '@/db/auth-schema';

import {
	discordUsernameSchema,
	githubUsernameSchema,
} from '../schemas/usernames';
import { createTRPCRouter, protectedProcedure } from '../trpc';

/** Once GitHub is connected, github_username comes from that account and can't be typed over. */
async function assertGithubNotConnected(db: DB, userId: string) {
	const [linked] = await db
		.select({ id: account.id })
		.from(account)
		.where(and(eq(account.userId, userId), eq(account.providerId, 'github')))
		.limit(1);
	if (linked) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'Your GitHub username comes from your connected GitHub account',
		});
	}
}

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
		const linked = await ctx.db
			.select({ providerId: account.providerId })
			.from(account)
			.where(
				and(
					eq(account.userId, ctx.user.id),
					inArray(account.providerId, ['github', 'discord']),
				),
			);
		const isLinked = (providerId: string) =>
			linked.some((row) => row.providerId === providerId);

		return {
			email: profile?.email ?? ctx.user.email,
			githubUsername: profile?.githubUsername ?? null,
			discordUsername: profile?.discordUsername ?? null,
			// Connected only once the name was copied: if that failed, the connect
			// button comes back and linking again retries the copy.
			connected: {
				github: isLinked('github') && Boolean(profile?.githubUsername),
				discord: isLinked('discord') && Boolean(profile?.discordUsername),
			},
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
			await assertGithubNotConnected(ctx.db, ctx.user.id);
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
			await assertGithubNotConnected(ctx.db, ctx.user.id);
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
