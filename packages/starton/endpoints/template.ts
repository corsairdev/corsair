import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
import { persistEntities } from './persist';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './types';

/**
 * List the Starton Library smart contract templates. Use a template `id` as
 * `templateId` in `smartContract.deployFromTemplate`.
 *
 * API: GET /v3/smart-contract-template -> { items, meta }
 */
export const list: StartonEndpoints['templateList'] = async (ctx, input) => {
	const query = StartonEndpointInputSchemas.templateList.parse(input);
	// Safe: the zod parse below validates the payload before it is used.
	// A narrower type is not practical because the request layer cannot know each response shape.
	const response = await makeStartonRequest<unknown>(
		'v3/smart-contract-template',
		ctx.key,
		{ method: 'GET', query },
	);
	const page = StartonEndpointOutputSchemas.templateList.parse(response);
	await persistEntities(
		ctx.db.templates,
		page.items.map((data) => ({ entityId: data.id, data })),
		'templates',
	);
	await logEventFromContext(
		ctx,
		'starton.template.list',
		{ count: page.items.length },
		'completed',
	);
	return page;
};
