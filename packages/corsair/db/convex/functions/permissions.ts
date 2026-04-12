import { queryGeneric, mutationGeneric } from 'convex/server';
import { v } from 'convex/values';
import type { QueryCtx, MutationCtx } from './types';

const query = queryGeneric as typeof queryGeneric;
const mutation = mutationGeneric as typeof mutationGeneric;

export const findById = query({
	args: { id: v.string() },
	handler: async (ctx: QueryCtx, args) => {
		return ctx.db
			.query('corsair_permissions')
			.withIndex('by_corsair_id', (q) => q.eq('id', args.id))
			.first();
	},
});

export const findByToken = query({
	args: { token: v.string() },
	handler: async (ctx: QueryCtx, args) => {
		return ctx.db
			.query('corsair_permissions')
			.withIndex('by_token', (q) => q.eq('token', args.token))
			.first();
	},
});

export const findActiveForEndpoint = query({
	args: {
		plugin: v.string(),
		endpoint: v.string(),
		argsStr: v.string(),
		tenantId: v.string(),
		now: v.string(),
	},
	handler: async (ctx: QueryCtx, args) => {
		const results = await ctx.db
			.query('corsair_permissions')
			.withIndex('by_plugin_endpoint_tenant', (q) =>
				q
					.eq('plugin', args.plugin)
					.eq('endpoint', args.endpoint)
					.eq('tenant_id', args.tenantId),
			)
			.collect();

		const activeStatuses = new Set(['pending', 'approved', 'executing']);
		const match = results
			.filter(
				(row) =>
					row.args === args.argsStr &&
					row.expires_at > args.now &&
					activeStatuses.has(row.status),
			)
			.sort((a, b) => b.created_at - a.created_at);

		return match[0] ?? null;
	},
});

export const create = mutation({
	args: { data: v.any() },
	handler: async (ctx: MutationCtx, args) => {
		const _id = await ctx.db.insert('corsair_permissions', args.data);
		return ctx.db.get(_id);
	},
});

export const updateStatus = mutation({
	args: {
		id: v.string(),
		status: v.string(),
		error: v.optional(v.union(v.string(), v.null())),
	},
	handler: async (ctx: MutationCtx, args) => {
		const existing = await ctx.db
			.query('corsair_permissions')
			.withIndex('by_corsair_id', (q) => q.eq('id', args.id))
			.first();
		if (!existing) return;
		const patch: Record<string, unknown> = {
			status: args.status,
			updated_at: Date.now(),
		};
		if (args.error !== undefined) {
			patch.error = args.error;
		}
		await ctx.db.patch(existing._id, patch);
	},
});
