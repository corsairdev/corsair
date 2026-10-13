import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
import { persistEntities } from './persist';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './types';

/**
 * Fetch a blockchain event watcher by id.
 *
 * API: GET /v3/watcher/{id} -> Watcher
 */
export const get: StartonEndpoints['watcherGet'] = async (ctx, input) => {
	const { id } = StartonEndpointInputSchemas.watcherGet.parse(input);
	// Safe: the zod parse below validates the payload before it is used.
	// A narrower type is not practical because the request layer cannot know each response shape.
	const response = await makeStartonRequest<unknown>(
		`v3/watcher/${encodeStartonPathSegment(id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const watcher = StartonEndpointOutputSchemas.watcherGet.parse(response);
	await persistEntities(
		ctx.db.watchers,
		[{ entityId: watcher.id, data: watcher }],
		'watcher',
	);
	await logEventFromContext(
		ctx,
		'starton.watcher.get',
		{ id, type: watcher.type },
		'completed',
	);
	return watcher;
};

/**
 * Delete a blockchain event watcher by id. Starton stops sending its webhooks.
 *
 * API: DELETE /v3/watcher/{id} -> number
 */
export const deleteWatcher: StartonEndpoints['watcherDelete'] = async (
	ctx,
	input,
) => {
	const { id } = StartonEndpointInputSchemas.watcherDelete.parse(input);
	// Safe: the zod parse below validates the payload before it is used.
	// A narrower type is not practical because the request layer cannot know each response shape.
	const response = await makeStartonRequest<unknown>(
		`v3/watcher/${encodeStartonPathSegment(id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const deleted = StartonEndpointOutputSchemas.watcherDelete.parse(response);
	try {
		await ctx.db.watchers.deleteByEntityId(id);
	} catch (error) {
		console.warn('Failed to remove Starton watcher from database:', error);
	}
	await logEventFromContext(ctx, 'starton.watcher.delete', { id }, 'completed');
	return deleted;
};
