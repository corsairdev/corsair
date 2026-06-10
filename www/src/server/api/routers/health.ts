import { sql } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const healthRouter = createTRPCRouter({
	check: publicProcedure
		.input(z.object({ detailed: z.boolean().optional() }).optional())
		.query(async ({ ctx, input }) => {
			const detailed = input?.detailed ?? false;

			let database: 'connected' | 'disconnected' = 'disconnected';
			try {
				await ctx.db.execute(sql`SELECT 1`);
				database = 'connected';
			} catch {
				database = 'disconnected';
			}

			return {
				status: database === 'connected' ? 'ok' : 'degraded',
				timestamp: new Date().toISOString(),
				...(detailed && {
					services: {
						database,
					},
				}),
			};
		}),
});
