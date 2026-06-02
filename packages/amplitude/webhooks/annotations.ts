import { logEventFromContext } from 'corsair/core';
import type { AmplitudeWebhooks } from '../index';
import { createAmplitudeMatch, verifyAmplitudeWebhookSignature } from './types';

export const created: AmplitudeWebhooks['annotationsCreated'] = {
	match: createAmplitudeMatch('annotation.created'),

	handler: async (ctx, request) => {
		const verification = verifyAmplitudeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload.data;

		if (!event) {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'amplitude.webhook.annotations.created',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const updated: AmplitudeWebhooks['annotationsUpdated'] = {
	match: createAmplitudeMatch('annotation.updated'),

	handler: async (ctx, request) => {
		const verification = verifyAmplitudeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload.data;

		if (!event) {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'amplitude.webhook.annotations.updated',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
