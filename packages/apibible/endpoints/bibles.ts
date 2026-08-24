import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * List supported Bible versions.
 * API: GET /bibles
 * Docs: https://api.bible and https://api.bible/versions
 */
export const list: ApiBibleEndpoints['biblesList'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['biblesList']
	>('bibles', ctx.key, {
		query: { language: input.language },
	});

	await logEventFromContext(
		ctx,
		'apibible.bibles.list',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * Get a specific Bible version.
 * API: GET /bibles/{bibleId}
 * Docs: https://api.bible and https://api.bible/versions
 */
export const get: ApiBibleEndpoints['biblesGet'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['biblesGet']
	>(`bibles/${input.bibleId}`, ctx.key);

	await logEventFromContext(
		ctx,
		'apibible.bibles.get',
		{ ...input },
		'completed',
	);

	return response;
};
