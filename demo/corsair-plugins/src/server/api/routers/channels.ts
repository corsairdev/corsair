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
				return []
			}),

		getById: publicProcedure
			.input(z.object({ channelId: z.string() }))
			.query(async ({ ctx, input }) => {
				return []
			}),
	});
