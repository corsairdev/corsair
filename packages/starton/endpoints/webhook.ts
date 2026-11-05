import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
import { persistEntities } from './persist';
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
	// Safe: the zod parse below validates the payload before it is used.
	// A narrower type is not practical because the request layer cannot know each response shape.
	const response = await makeStartonRequest<unknown>('v3/webhook', ctx.key, {
		method: 'GET',
		query,
	});
	const page = StartonEndpointOutputSchemas.webhookList.parse(response);
	await persistEntities(
		ctx.db.webhooks,
		page.items.map((data) => ({ entityId: data.id, data })),
		'webhooks',
	);
	await logEventFromContext(
		ctx,
		'starton.webhook.list',
		{ count: page.items.length },
		'completed',
	);
	return page;
};
