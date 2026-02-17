import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const channelsRouter: ReturnType<typeof createTRPCRouter> =
	createTRPCRouter({
		list: publicProcedure
			.input(
				z
					.object({
						limit: z.number().min(1).max(100).optional().default(20),
						offset: z.number().min(0).optional().default(0),
					})
					.optional(),
			)
			.query(async ({ ctx, input }) => {
				const { tenantId, corsair } = ctx;
				const { limit = 20, offset = 0 } = input ?? {};

				const channels = await corsair
					.withTenant(tenantId)
					.slack.db.channels.list({
						limit,
						offset,
					});

				return {
					channels,
					pagination: {
						limit,
						offset,
						total: channels.length,
					},
				};
			}),

		getById: publicProcedure
			.input(z.object({ channelId: z.string() }))
			.query(async ({ ctx, input }) => {
				const { tenantId, corsair } = ctx;
				const { channelId } = input;

				const channel = await corsair
					.withTenant(tenantId)
					.slack.db.channels.findById(channelId);

				if (!channel) {
					throw new Error(`Channel ${channelId} not found`);
				}

				return channel;
			}),
	});
