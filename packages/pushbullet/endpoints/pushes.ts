import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';
import { PushbulletEndpointOutputSchemas } from './types';

export const create: PushbulletEndpoints['pushesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesCreate']
	>('pushes', ctx.key, {
		method: 'POST',
		body: input,
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
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesList']
	>('pushes', ctx.key, {
		method: 'GET',
		query: input,
		schema: PushbulletEndpointOutputSchemas.pushesList,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.pushes.list',
		{ ...input },
		'completed',
	);
	return result;
};

/** Marks a push dismissed. Pushbullet exposes no other mutable push field. */
export const update: PushbulletEndpoints['pushesUpdate'] = async (
	ctx,
	input,
) => {
	const { iden, ...body } = input;
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesUpdate']
	>(`pushes/${encodeURIComponent(iden)}`, ctx.key, {
		method: 'POST',
		body,
		schema: PushbulletEndpointOutputSchemas.pushesUpdate,
	});

	if (result.iden && ctx.db.pushes) {
		try {
			// upsertByEntityId replaces the stored record rather than merging
			// into it, so writing only the mutable fields would wipe the
			// cached type, title, body, url, direction and created. The
			// update response is the full push, so cache it like create does.
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
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: PushbulletEndpoints['pushesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesDelete']
	>(`pushes/${encodeURIComponent(input.iden)}`, ctx.key, {
		method: 'DELETE',
		schema: PushbulletEndpointOutputSchemas.pushesDelete,
	});

	if (ctx.db.pushes) {
		try {
			await ctx.db.pushes.deleteByEntityId(input.iden);
		} catch (error) {
			console.warn('Failed to evict deleted push from cache:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'pushbullet.pushes.delete',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Deletes every push on the account. Pushbullet processes this asynchronously,
 * so pushes may still be returned by `list` briefly afterwards.
 */
export const removeAll: PushbulletEndpoints['pushesDeleteAll'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['pushesDeleteAll']
	>('pushes', ctx.key, {
		method: 'DELETE',
		schema: PushbulletEndpointOutputSchemas.pushesDeleteAll,
	});

	// The remote pushes are gone, so every cached row is now stale. Leaving them
	// would let local lookups keep returning pushes that no longer exist.
	if (ctx.db.pushes) {
		let cached: Awaited<ReturnType<typeof ctx.db.pushes.search>> = [];
		try {
			cached = await ctx.db.pushes.search({});
		} catch (error) {
			// Cache reads are best-effort; a broken cache must not fail the delete.
			console.warn('Failed to read cached pushes after deleteAll:', error);
			cached = [];
		}
		// Eviction is best-effort per row: one failed delete must not abort the
		// loop, or later cached pushes would stay visible after deleteAll.
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
		{ ...input },
		'completed',
	);
	return result;
};
