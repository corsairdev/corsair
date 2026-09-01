import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';
import {
	PushbulletEndpointInputSchemas,
	PushbulletEndpointOutputSchemas,
} from './types';

export const create: PushbulletEndpoints['pushesCreate'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.pushesCreate.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesCreate']
	>('pushes', ctx.key, {
		method: 'POST',
		body: { ...parsed },
		schema: PushbulletEndpointOutputSchemas.pushesCreate,
	});

	if (result.iden && ctx.db.pushes) {
		try {
			await ctx.db.pushes.upsertByEntityId(result.iden, {
				id: result.iden,
				type: result.type,
				title: result.title,
				body: result.body,
				url: result.url,
				active: result.active,
				dismissed: result.dismissed,
				direction: result.direction,
				created: result.created,
			});
		} catch (error) {
			// Caching is best-effort; it must not fail the send it mirrors.
			console.warn('Failed to cache push:', error);
		}
	}

	// The event log keeps identifiers, not content: the push title, body and
	// the target email are personal data and do not belong in events.
	await logEventFromContext(
		ctx,
		'pushbullet.pushes.create',
		{ iden: result.iden, type: result.type },
		'completed',
	);
	return result;
};

export const list: PushbulletEndpoints['pushesList'] = async (ctx, input) => {
	const parsed = PushbulletEndpointInputSchemas.pushesList.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesList']
	>('pushes', ctx.key, {
		method: 'GET',
		query: parsed,
		schema: PushbulletEndpointOutputSchemas.pushesList,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.pushes.list',
		{ ...parsed },
		'completed',
	);
	return result;
};

export const update: PushbulletEndpoints['pushesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.pushesUpdate.parse(input);
	const { iden, ...body } = parsed;
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesUpdate']
	>(`pushes/${encodeURIComponent(iden)}`, ctx.key, {
		method: 'POST',
		body,
		schema: PushbulletEndpointOutputSchemas.pushesUpdate,
	});

	if (result.iden && ctx.db.pushes) {
		try {
			await ctx.db.pushes.upsertByEntityId(result.iden, {
				id: result.iden,
				type: result.type,
				title: result.title,
				body: result.body,
				url: result.url,
				active: result.active,
				dismissed: result.dismissed,
				direction: result.direction,
				created: result.created,
			});
		} catch (error) {
			console.warn('Failed to update cached push:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'pushbullet.pushes.update',
		{ ...parsed },
		'completed',
	);
	return result;
};

export const remove: PushbulletEndpoints['pushesDelete'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.pushesDelete.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesDelete']
	>(`pushes/${encodeURIComponent(parsed.iden)}`, ctx.key, {
		method: 'DELETE',
		schema: PushbulletEndpointOutputSchemas.pushesDelete,
	});

	if (ctx.db.pushes) {
		try {
			await ctx.db.pushes.deleteByEntityId(parsed.iden);
		} catch (error) {
			console.warn('Failed to evict deleted push from cache:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'pushbullet.pushes.delete',
		{ ...parsed },
		'completed',
	);
	return result;
};

export const removeAll: PushbulletEndpoints['pushesDeleteAll'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.pushesDeleteAll.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesDeleteAll']
	>('pushes', ctx.key, {
		method: 'DELETE',
		schema: PushbulletEndpointOutputSchemas.pushesDeleteAll,
	});

	if (ctx.db.pushes) {
		let cached: Awaited<ReturnType<typeof ctx.db.pushes.search>> = [];
		try {
			cached = await ctx.db.pushes.search({});
		} catch (error) {
			console.warn('Failed to read cached pushes after deleteAll:', error);
			cached = [];
		}
		for (const entity of cached) {
			try {
				await ctx.db.pushes.deleteByEntityId(entity.entity_id);
			} catch (error) {
				console.warn('Failed to evict cached push after deleteAll:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'pushbullet.pushes.deleteAll',
		{ ...parsed },
		'completed',
	);
	return result;
};
