import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const findById = query({
	args: { id: v.string() },
	handler: async (ctx, args) => {
		return ctx.db
			.query('corsair_entities')
			.withIndex('by_id', (q) => q.eq('id', args.id))
			.first();
	},
});

export const findOne = query({
	args: { where: v.any() },
	handler: async (ctx, args) => {
		const where = args.where as Record<string, unknown>;
		if (where.account_id && where.entity_type && where.entity_id) {
			return ctx.db
				.query('corsair_entities')
				.withIndex('by_account_type_entity', (q) =>
					q
						.eq('account_id', where.account_id as string)
						.eq('entity_type', where.entity_type as string)
						.eq('entity_id', where.entity_id as string),
				)
				.first();
		}
		if (where.id) {
			return ctx.db
				.query('corsair_entities')
				.withIndex('by_id', (q) => q.eq('id', where.id as string))
				.first();
		}
		const results = await ctx.db.query('corsair_entities').collect();
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
	handler: async (ctx, args) => {
		let results = await ctx.db.query('corsair_entities').collect();
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

export const findByEntityId = query({
	args: { accountId: v.string(), entityType: v.string(), entityId: v.string() },
	handler: async (ctx, args) => {
		return ctx.db
			.query('corsair_entities')
			.withIndex('by_account_type_entity', (q) =>
				q
					.eq('account_id', args.accountId)
					.eq('entity_type', args.entityType)
					.eq('entity_id', args.entityId),
			)
			.first();
	},
});

export const findManyByEntityIds = query({
	args: { accountId: v.string(), entityType: v.string(), entityIds: v.array(v.string()) },
	handler: async (ctx, args) => {
		const idSet = new Set(args.entityIds);
		const results = await ctx.db
			.query('corsair_entities')
			.withIndex('by_account_type', (q) =>
				q.eq('account_id', args.accountId).eq('entity_type', args.entityType),
			)
			.collect();
		return results.filter((row) => idSet.has(row.entity_id));
	},
});

export const listByScope = query({
	args: { accountId: v.string(), entityType: v.string(), limit: v.optional(v.float64()), offset: v.optional(v.float64()) },
	handler: async (ctx, args) => {
		const results = await ctx.db
			.query('corsair_entities')
			.withIndex('by_account_type', (q) =>
				q.eq('account_id', args.accountId).eq('entity_type', args.entityType),
			)
			.collect();
		const offset = args.offset ?? 0;
		const limit = args.limit ?? results.length;
		return results.slice(offset, offset + limit);
	},
});

export const searchByEntityId = query({
	args: { accountId: v.string(), entityType: v.string(), queryStr: v.string(), limit: v.optional(v.float64()), offset: v.optional(v.float64()) },
	handler: async (ctx, args) => {
		const results = await ctx.db
			.query('corsair_entities')
			.withIndex('by_account_type', (q) =>
				q.eq('account_id', args.accountId).eq('entity_type', args.entityType),
			)
			.collect();
		const filtered = results.filter((row) =>
			row.entity_id.toLowerCase().includes(args.queryStr.toLowerCase()),
		);
		const offset = args.offset ?? 0;
		const limit = args.limit ?? filtered.length;
		return filtered.slice(offset, offset + limit);
	},
});

export const create = mutation({
	args: { data: v.any() },
	handler: async (ctx, args) => {
		const _id = await ctx.db.insert('corsair_entities', args.data);
		return ctx.db.get(_id);
	},
});

export const update = mutation({
	args: { id: v.string(), data: v.any() },
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('corsair_entities')
			.withIndex('by_id', (q) => q.eq('id', args.id))
			.first();
		if (!existing) return null;
		await ctx.db.patch(existing._id, {
			...args.data,
			updated_at: Date.now(),
		});
		return ctx.db.get(existing._id);
	},
});

export const upsertByEntityId = mutation({
	args: {
		accountId: v.string(),
		entityType: v.string(),
		entityId: v.string(),
		version: v.string(),
		data: v.any(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('corsair_entities')
			.withIndex('by_account_type_entity', (q) =>
				q
					.eq('account_id', args.accountId)
					.eq('entity_type', args.entityType)
					.eq('entity_id', args.entityId),
			)
			.first();
		if (existing) {
			await ctx.db.patch(existing._id, {
				version: args.version,
				data: args.data,
				updated_at: Date.now(),
			});
			return ctx.db.get(existing._id);
		}
		const now = Date.now();
		const id = crypto.randomUUID();
		const _id = await ctx.db.insert('corsair_entities', {
			id,
			created_at: now,
			updated_at: now,
			account_id: args.accountId,
			entity_type: args.entityType,
			entity_id: args.entityId,
			version: args.version,
			data: args.data,
		});
		return ctx.db.get(_id);
	},
});

export const remove = mutation({
	args: { id: v.string() },
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('corsair_entities')
			.withIndex('by_id', (q) => q.eq('id', args.id))
			.first();
		if (!existing) return false;
		await ctx.db.delete(existing._id);
		return true;
	},
});

export const removeByEntityId = mutation({
	args: { accountId: v.string(), entityType: v.string(), entityId: v.string() },
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('corsair_entities')
			.withIndex('by_account_type_entity', (q) =>
				q
					.eq('account_id', args.accountId)
					.eq('entity_type', args.entityType)
					.eq('entity_id', args.entityId),
			)
			.first();
		if (!existing) return false;
		await ctx.db.delete(existing._id);
		return true;
	},
});

export const count = query({
	args: { where: v.optional(v.any()) },
	handler: async (ctx, args) => {
		let results = await ctx.db.query('corsair_entities').collect();
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
	handler: async (ctx, args) => {
		const where = args.where as Record<string, unknown>;
		const results = await ctx.db.query('corsair_entities').collect();
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
	handler: async (ctx, args) => {
		const where = args.where as Record<string, unknown>;
		const results = await ctx.db.query('corsair_entities').collect();
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
