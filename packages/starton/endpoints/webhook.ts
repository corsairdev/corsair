import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './types';

/**
 * List the webhook deliveries Starton's watchers have sent, with their status
 * and attempt history. Paginated via `page`/`limit`; filterable by `status`.
 *
 * API: GET /v3/webhook -> { items, meta }
 */
export const list: StartonEndpoints['webhookList'] = async (ctx, input) => {
	const query = StartonEndpointInputSchemas.webhookList.parse(input);
	// unknown: safe because the zod parse below validates the payload before it is
	// used; no static type fits since the request layer cannot know each response.
	const response = await makeStartonRequest<unknown>('v3/webhook', ctx.key, {
		method: 'GET',
		query,
	});
	const page = StartonEndpointOutputSchemas.webhookList.parse(response);
	await logEventFromContext(
		ctx,
		'starton.webhook.list',
		{ count: page.items.length },
		'completed',
	);
	return page;
};
