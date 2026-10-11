import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
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
	const response = await makeStartonRequest<unknown>(
		`v3/watcher/${encodeStartonPathSegment(id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const watcher = StartonEndpointOutputSchemas.watcherGet.parse(response);
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
	const response = await makeStartonRequest<unknown>(
		`v3/watcher/${encodeStartonPathSegment(id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const deleted = StartonEndpointOutputSchemas.watcherDelete.parse(response);
	await logEventFromContext(ctx, 'starton.watcher.delete', { id }, 'completed');
	return deleted;
};
