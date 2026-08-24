import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import { buildContentQuery } from './shared';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * Get a passage (single verse or range like "JHN.3.16" or "GEN.1.1-GEN.1.3").
 * API: GET /bibles/{bibleId}/passages/{passageId}
 * Docs: https://api.bible and https://api.bible/passages-api
 */
export const get: ApiBibleEndpoints['passagesGet'] = async (ctx, input) => {
	const { bibleId, passageId, ...contentOptions } = input;

	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['passagesGet']
	>(`bibles/${bibleId}/passages/${passageId}`, ctx.key, {
		query: buildContentQuery(contentOptions),
	});

	await logEventFromContext(
		ctx,
		'apibible.passages.get',
		{ ...input },
		'completed',
	);

	return response;
};
