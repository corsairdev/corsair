import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { UnsubscribeWebhookResponse } from './types';

export const unsubscribe: DynapicturesEndpoints['unsubscribeWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<UnsubscribeWebhookResponse>(
		'/hooks',
		ctx.key,
		{
			method: 'DELETE',
			body: {
				targetUrl: input.targetUrl,
				eventType: input.eventType,
				templateId: input.templateId,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.webhooks.unsubscribe',
		{
			targetUrl: input.targetUrl,
			eventType: input.eventType,
			templateId: input.templateId,
		},
		'completed',
	);
	return response;
};
