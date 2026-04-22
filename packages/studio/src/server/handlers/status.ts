import type { HandlerFn } from '../types';

export const getStatus: HandlerFn = async (ctx) => {
	const { internal } = await ctx.getCorsair();
	return {
		multiTenancy: internal.multiTenancy,
		pluginCount: internal.plugins.length,
		hasDatabase: !!internal.database,
		cwd: ctx.cwd,
	};
};
