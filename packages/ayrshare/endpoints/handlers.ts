import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { AyrshareRequestOptions } from '../client';
import { compactBody, compactQuery, makeAyrshareRequest } from '../client';
import type { AyrshareEndpoints } from '../index';
import { AyrshareAutoSchedule, AyrsharePost } from '../schema/database';
import type { AyrshareEndpointOutputs } from './types';

type CallCtx = {
	key: string;
	options: { profileKey?: string | undefined };
	keys?: { get_profile_key?: () => Promise<string | null | undefined> };
};

type Store<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

type Evictor = {
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

async function ayrshareCall<T>(
	ctx: CallCtx,
	endpoint: string,
	options: AyrshareRequestOptions = {},
): Promise<T> {
	const profileKey =
		ctx.options.profileKey ??
		(await ctx.keys?.get_profile_key?.()) ??
		undefined;
	return await makeAyrshareRequest<T>(endpoint, ctx.key, {
		...options,
		profileKey,
	});
}

function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	for (const key of identifierKeys) {
		if (input[key] !== undefined) payload[key] = input[key];
	}
	const fields = Object.keys(input).filter((key) => input[key] !== undefined);
	if (fields.length > 0) payload.fields = fields;
	return payload;
}

async function cacheEntity<Schema extends z.ZodType>(
	store: Store<z.infer<Schema>> | undefined,
	schema: Schema,
	record: unknown,
	options: {
		label: string;
		entityId?: (parsed: z.infer<Schema>) => string | undefined;
	},
): Promise<void> {
	if (!store || record == null) return;
	const parsed = schema.safeParse(record);
	if (!parsed.success) {
		console.warn(
			`[AYRSHARE] skipped caching a ${options.label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}
	const rawId =
		options.entityId?.(parsed.data) ?? (parsed.data as { id?: unknown }).id;
	const id =
		typeof rawId === 'number' || typeof rawId === 'string'
			? String(rawId)
			: undefined;
	if (!id) return;
	try {
		await store.upsertByEntityId(id, parsed.data);
	} catch (error) {
		console.warn(`[AYRSHARE] failed to cache ${options.label} ${id}:`, error);
	}
}

async function cacheEntities<Schema extends z.ZodType>(
	store: Store<z.infer<Schema>> | undefined,
	schema: Schema,
	records: readonly unknown[] | undefined | null,
	options: {
		label: string;
		entityId?: (parsed: z.infer<Schema>) => string | undefined;
	},
): Promise<void> {
	if (!store || !records?.length) return;
	await Promise.all(
		records.map((record) => cacheEntity(store, schema, record, options)),
	);
}

async function evictEntity(
	store: Evictor | undefined,
	entityId: string | undefined,
	label: string,
): Promise<void> {
	if (!store || entityId == null) return;
	try {
		await store.deleteByEntityId(entityId);
	} catch (error) {
		console.warn(`[AYRSHARE] failed to evict ${label} ${entityId}:`, error);
	}
}

const titleAsId = (parsed: { title: string }) => parsed.title;

/** POST /api/auto-schedule/set */
export const set: AyrshareEndpoints['setAutoSchedule'] = async (ctx, input) => {
	const result = await ayrshareCall<AyrshareEndpointOutputs['setAutoSchedule']>(
		ctx,
		'auto-schedule/set',
		{
			method: 'POST',
			body: compactBody({
				schedule: input.schedule,
				title: input.title,
				setStartDate: input.setStartDate,
				daysOfWeek: input.daysOfWeek,
				excludeDates: input.excludeDates,
			}),
		},
	);

	await cacheEntity(
		ctx.db.autoSchedules,
		AyrshareAutoSchedule,
		{
			title: result.title,
			schedule: result.schedule ?? input.schedule,
			daysOfWeek: result.daysOfWeek ?? input.daysOfWeek,
			excludeDates: result.excludeDates ?? input.excludeDates,
		},
		{ label: 'auto-schedule', entityId: titleAsId },
	);

	await logEventFromContext(
		ctx,
		'ayrshare.autoSchedule.set',
		auditPayload(input, ['title']),
		'completed',
	);
	return result;
};

/** GET /api/auto-schedule/list */
export const list: AyrshareEndpoints['listAutoSchedules'] = async (
	ctx,
	input,
) => {
	const result = await ayrshareCall<
		AyrshareEndpointOutputs['listAutoSchedules']
	>(ctx, 'auto-schedule/list');

	await cacheEntities(
		ctx.db.autoSchedules,
		AyrshareAutoSchedule,
		Object.entries(result.schedules ?? {}).map(([title, value]) => ({
			...value,
			title,
		})),
		{ label: 'auto-schedule', entityId: titleAsId },
	);

	await logEventFromContext(
		ctx,
		'ayrshare.autoSchedule.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** DELETE /api/post */
export const deletePost: AyrshareEndpoints['deletePost'] = async (
	ctx,
	input,
) => {
	const result = await ayrshareCall<AyrshareEndpointOutputs['deletePost']>(
		ctx,
		'post',
		{
			method: 'DELETE',
			body: compactBody({
				id: input.id,
				markManualDeleted: input.markManualDeleted,
			}),
		},
	);

	await evictEntity(ctx.db.posts, input.id, 'post');

	await logEventFromContext(
		ctx,
		'ayrshare.posts.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return result;
};

/** GET /api/history */
export const history: AyrshareEndpoints['getPostHistory'] = async (
	ctx,
	input,
) => {
	const result = await ayrshareCall<AyrshareEndpointOutputs['getPostHistory']>(
		ctx,
		'history',
		{
			query: compactQuery({
				limit: input.limit,
				lastDays: input.lastDays,
				startDate: input.startDate,
				endDate: input.endDate,
				status: input.status,
				platforms:
					input.platforms && input.platforms.length > 0
						? input.platforms.join(',')
						: undefined,
				type: input.type,
			}),
		},
	);

	await cacheEntities(ctx.db.posts, AyrsharePost, result.history, {
		label: 'post',
	});

	await logEventFromContext(
		ctx,
		'ayrshare.posts.history',
		auditPayload(input, ['status', 'limit', 'lastDays']),
		'completed',
	);
	return result;
};
