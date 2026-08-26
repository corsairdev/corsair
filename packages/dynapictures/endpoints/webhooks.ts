import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { UnsubscribeWebhookResponse } from './types';

export const unsubscribe: DynapicturesEndpoints['unsubscribeWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<UnsubscribeWebhookResponse>(
		'/webhooks/unsubscribe',
		ctx.key,
		{
			method: 'POST',
			body: {
				targetUrl: input.targetUrl,
				...(input.event ? { event: input.event } : {}),
			},
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.webhooks.unsubscribe',
		{ targetUrl: input.targetUrl, event: input.event },
		'completed',
	);
	return response;
};
