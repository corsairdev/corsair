import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const testWebhookDelivery: BenzingaEndpoints['testWebhookDelivery'] =
	async (ctx, input) => {
		const response = await makeBenzingaRequest<
			BenzingaEndpointOutputs['testWebhookDelivery']
		>('/api/v1/webhook/test', ctx.key, {
			method: 'GET',
			query: {
				destination: input.destination,
				version: input.version,
				kind: input.kind,
			},
		});

		await logEventFromContext(
			ctx,
			'benzinga.webhook.testDelivery',
			{ ...input, destination: input.destination, kind: input.kind },
			'completed',
		);

		return response;
	};
