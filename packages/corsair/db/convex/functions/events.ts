import { queryGeneric, mutationGeneric } from 'convex/server';
import { v } from 'convex/values';
import type { QueryCtx, MutationCtx } from './types';

const query = queryGeneric as typeof queryGeneric;
const mutation = mutationGeneric as typeof mutationGeneric;

export const findById = query({
	args: { id: v.string() },
	handler: async (ctx: QueryCtx, args) => {
		return ctx.db
			.query('corsair_events')
			.withIndex('by_corsair_id', (q) => q.eq('id', args.id))
			.first();
	},
});

export const findOne = query({
	args: { where: v.any() },
	handler: async (ctx: QueryCtx, args) => {
		const where = args.where as Record<string, unknown>;
		if (where.id) {
			return ctx.db
				.query('corsair_events')
				.withIndex('by_corsair_id', (q) => q.eq('id', where.id as string))
				.first();
		}
		const results = await ctx.db.query('corsair_events').collect();
		return (
			results.find((row) =>
				Object.entries(where).every(
					([key, val]) => (row as Record<string, unknown>)[key] === val,
				),
			) ?? null
		);
	},
});

export const findMany = query({
	args: { where: v.optional(v.any()), limit: v.optional(v.float64()), offset: v.optional(v.float64()) },
	handler: async (ctx: QueryCtx, args) => {
		let results = await ctx.db.query('corsair_events').collect();
		if (args.where) {
			const where = args.where as Record<string, unknown>;
			results = results.filter((row) =>
				Object.entries(where).every(
					([key, val]) => (row as Record<string, unknown>)[key] === val,
				),
			);
		}
		const offset = args.offset ?? 0;
		const limit = args.limit ?? results.length;
		return results.slice(offset, offset + limit);
	},
});

export const listByAccount = query({
	args: { accountId: v.string(), limit: v.optional(v.float64()), offset: v.optional(v.float64()) },
	handler: async (ctx: QueryCtx, args) => {
		const results = await ctx.db
			.query('corsair_events')
			.withIndex('by_account', (q) => q.eq('account_id', args.accountId))
			.collect();
		const offset = args.offset ?? 0;
		const limit = args.limit ?? results.length;
		return results.slice(offset, offset + limit);
	},
});

export const listByStatus = query({
	args: { status: v.string(), accountId: v.optional(v.string()), limit: v.optional(v.float64()), offset: v.optional(v.float64()) },
	handler: async (ctx: QueryCtx, args) => {
		let results = await ctx.db
			.query('corsair_events')
			.withIndex('by_status', (q) => q.eq('status', args.status))
			.collect();
		if (args.accountId) {
			results = results.filter((row) => row.account_id === args.accountId);
		}
		const offset = args.offset ?? 0;
		const limit = args.limit ?? results.length;
		return results.slice(offset, offset + limit);
	},
});

export const create = mutation({
	args: { data: v.any() },
	handler: async (ctx: MutationCtx, args) => {
		const _id = await ctx.db.insert('corsair_events', args.data);
		return ctx.db.get(_id);
	},
});

export const update = mutation({
	args: { id: v.string(), data: v.any() },
	handler: async (ctx: MutationCtx, args) => {
		const existing = await ctx.db
			.query('corsair_events')
			.withIndex('by_corsair_id', (q) => q.eq('id', args.id))
			.first();
		if (!existing) return null;
		await ctx.db.patch(existing._id, {
			...args.data,
			updated_at: Date.now(),
		});
		return ctx.db.get(existing._id);
	},
});

export const remove = mutation({
	args: { id: v.string() },
	handler: async (ctx: MutationCtx, args) => {
		const existing = await ctx.db
			.query('corsair_events')
			.withIndex('by_corsair_id', (q) => q.eq('id', args.id))
			.first();
		if (!existing) return false;
		await ctx.db.delete(existing._id);
		return true;
	},
});

export const count = query({
	args: { where: v.optional(v.any()) },
	handler: async (ctx: QueryCtx, args) => {
		let results = await ctx.db.query('corsair_events').collect();
		if (args.where) {
			const where = args.where as Record<string, unknown>;
			results = results.filter((row) =>
				Object.entries(where).every(
					([key, val]) => (row as Record<string, unknown>)[key] === val,
				),
			);
		}
		return results.length;
	},
});

export const updateMany = mutation({
	args: { where: v.any(), data: v.any() },
	handler: async (ctx: MutationCtx, args) => {
		const where = args.where as Record<string, unknown>;
		const results = await ctx.db.query('corsair_events').collect();
		const matched = results.filter((row) =>
			Object.entries(where).every(
				([key, val]) => (row as Record<string, unknown>)[key] === val,
			),
		);
		for (const row of matched) {
			await ctx.db.patch(row._id, {
				...(args.data as Record<string, unknown>),
				updated_at: Date.now(),
			});
		}
		return matched.length;
	},
});

export const deleteMany = mutation({
	args: { where: v.any() },
	handler: async (ctx: MutationCtx, args) => {
		const where = args.where as Record<string, unknown>;
		const results = await ctx.db.query('corsair_events').collect();
		const matched = results.filter((row) =>
			Object.entries(where).every(
				([key, val]) => (row as Record<string, unknown>)[key] === val,
			),
		);
		for (const row of matched) {
			await ctx.db.delete(row._id);
		}
		return matched.length;
	},
});
