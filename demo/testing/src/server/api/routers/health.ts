import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const healthRouter = createTRPCRouter({
	check: publicProcedure
		.input(z.object({ detailed: z.boolean().optional() }).optional())
		.query(async ({ input }) => {
			const detailed = input?.detailed ?? false;

			return {
				status: 'ok',
				timestamp: new Date().toISOString(),
				...(detailed && {
					services: {
						database: 'connected',
						corsair: 'initialized',
					},
				}),
			};
		}),
});
