import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
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
	// unknown: safe because the zod parse below validates the payload before it is
	// used; no static type fits since the request layer cannot know each response.
	const response = await makeStartonRequest<unknown>(
		'v3/smart-contract-template',
		ctx.key,
		{ method: 'GET', query },
	);
	const page = StartonEndpointOutputSchemas.templateList.parse(response);
	await logEventFromContext(
		ctx,
		'starton.template.list',
		{ count: page.items.length },
		'completed',
	);
	return page;
};
