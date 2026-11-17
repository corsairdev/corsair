import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/webhooks/event-types (ListWebhookEventTypes). */
export const list: SquareEndpoints['webhookEventTypesList'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.webhookEventTypesList.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/webhooks/event-types', {
		query: input,
		output: SquareEndpointOutputSchemas.webhookEventTypesList,
		event: 'webhookEventTypes.list',
	});
};
