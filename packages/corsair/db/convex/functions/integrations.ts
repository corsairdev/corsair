import { queryGeneric as query, mutationGeneric as mutation } from 'convex/server';
import { v } from 'convex/values';

export const findById = query({
	args: { id: v.string() },
	handler: async (ctx, args) => {
		return ctx.db
			.query('corsair_integrations')
			.withIndex('by_corsair_id', (q: any) => q.eq('id', args.id))
			.first();
	},
});

export const findByName = query({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		return ctx.db
			.query('corsair_integrations')
			.withIndex('by_name', (q: any) => q.eq('name', args.name))
			.first();
	},
});

export const findOne = query({
	args: { where: v.any() },
	handler: async (ctx, args) => {
		const q = ctx.db.query('corsair_integrations');
		const where = args.where as Record<string, unknown>;
		if (where.name) {
			return q
				.withIndex('by_name', (idx: any) => idx.eq('name', where.name as string))
				.first();
		}
		if (where.id) {
			return q
				.withIndex('by_corsair_id', (idx: any) => idx.eq('id', where.id as string))
				.first();
		}
		const results = await q.collect();
		return (
			results.find((row: any) =>
				Object.entries(where).every(
					([key, val]) => (row as Record<string, unknown>)[key] === val,
				),
			) ?? null
		);
	},
});

export const findMany = query({
	args: { where: v.optional(v.any()), limit: v.optional(v.float64()), offset: v.optional(v.float64()) },
	handler: async (ctx, args) => {
		let results: any[] = await ctx.db.query('corsair_integrations').collect();
		if (args.where) {
			const where = args.where as Record<string, unknown>;
			results = results.filter((row: any) =>
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

export const create = mutation({
	args: { data: v.any() },
	handler: async (ctx, args) => {
		const _id = await ctx.db.insert('corsair_integrations' as any, args.data);
		return ctx.db.get(_id);
	},
});

export const update = mutation({
	args: { id: v.string(), data: v.any() },
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('corsair_integrations')
			.withIndex('by_corsair_id', (q: any) => q.eq('id', args.id))
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
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('corsair_integrations')
			.withIndex('by_corsair_id', (q: any) => q.eq('id', args.id))
			.first();
		if (!existing) return false;
		await ctx.db.delete(existing._id);
		return true;
	},
});

export const count = query({
	args: { where: v.optional(v.any()) },
	handler: async (ctx, args) => {
		let results: any[] = await ctx.db.query('corsair_integrations').collect();
		if (args.where) {
			const where = args.where as Record<string, unknown>;
			results = results.filter((row: any) =>
				Object.entries(where).every(
					([key, val]) => (row as Record<string, unknown>)[key] === val,
				),
			);
		}
		return results.length;
	},
});

export const upsertByName = mutation({
	args: { name: v.string(), data: v.any() },
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('corsair_integrations')
			.withIndex('by_name', (q: any) => q.eq('name', args.name))
			.first();
		if (existing) {
			await ctx.db.patch(existing._id, {
				...(args.data as Record<string, unknown>),
				updated_at: Date.now(),
			});
			return ctx.db.get(existing._id);
		}
		const _id = await ctx.db.insert('corsair_integrations' as any, {
			...(args.data as Record<string, unknown>),
			name: args.name,
		} as any);
		return ctx.db.get(_id);
	},
});
