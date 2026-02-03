import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const healthRouter = createTRPCRouter({
	check: publicProcedure.query(async ({ ctx }) => {
		// Test database connection
		const result = await ctx.db.execute(`SELECT 1 as health`);

		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
			database: result ? 'connected' : 'disconnected',
		};
	}),
});
