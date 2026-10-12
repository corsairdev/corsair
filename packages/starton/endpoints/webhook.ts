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
	// Transport response is untyped JSON; the output schema parses it below.
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
