import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import {
	UnsubscribeWebhookInputSchema,
	UnsubscribeWebhookResponseSchema,
} from './types';

export const unsubscribeWebhook: DynapicturesEndpoints['unsubscribeWebhook'] =
	async (ctx, rawInput) => {
		const input = UnsubscribeWebhookInputSchema.parse(rawInput);
		const response = await makeDynapicturesRequest<unknown>('/hooks', ctx.key, {
			method: 'DELETE',
			body: {
				targetUrl: input.targetUrl,
				eventType: input.eventType,
				templateId: input.templateId,
			},
		});
		const parsed = UnsubscribeWebhookResponseSchema.parse(response);
		await logEventFromContext(
			ctx,
			'dynapictures.webhooks.unsubscribe',
			{ templateId: input.templateId },
			'completed',
		);
		return parsed;
	};
