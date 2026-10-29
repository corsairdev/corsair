import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List audio Bible versions.
 * API: GET /audio-bibles
 * Docs: https://api.bible and https://api.bible/audio-api
 */
export const list: ApiBibleEndpoints['audioBiblesList'] = async (
	ctx,
	input,
) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['audioBiblesList']
	>('audio-bibles', ctx.key, {
		query: { language: input.language },
	});

	await logEventFromContext(
		ctx,
		'apibible.audioBibles.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get a specific audio Bible version.
 * API: GET /audio-bibles/{audioBibleId}
 * Docs: https://api.bible and https://api.bible/audio-api
 */
export const get: ApiBibleEndpoints['audioBiblesGet'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['audioBiblesGet']
	>(`audio-bibles/${input.audioBibleId}`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.audioBibles.get',
		{ ...input },
		'completed',
	);

	return response;
};
