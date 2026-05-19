import { logEventFromContext } from 'corsair/core';
import type { XquikWebhooks } from '../index';
import {
	createXquikMatch,
	createXquikMonitorEventMatch,
	verifyXquikWebhookSignature,
} from './types';

export const monitorEvent: XquikWebhooks['monitorEvent'] = {
	match: createXquikMonitorEventMatch(),

	handler: async (ctx, request) => {
		const verification = verifyXquikWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				error: verification.error ?? 'Xquik webhook signature failed',
				statusCode: 401,
				success: false,
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'xquik.webhook.monitorEvent',
			{ eventType: event.eventType },
			'completed',
		);

		return { data: event, success: true };
	},
};

export const test: XquikWebhooks['test'] = {
	match: createXquikMatch('webhook.test'),

	handler: async (ctx, request) => {
		const verification = verifyXquikWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				error: verification.error ?? 'Xquik webhook signature failed',
				statusCode: 401,
				success: false,
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'xquik.webhook.test',
			{ eventType: event.eventType },
			'completed',
		);

		return { data: event, success: true };
	},
};
