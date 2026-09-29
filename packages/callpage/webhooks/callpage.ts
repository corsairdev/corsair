import { logEventFromContext } from 'corsair/core';
import type { CallPageWebhooks } from '../index';
import {
	CallPageWebhookEventSchema,
	verifyCallPageWebhookToken,
} from './types';

export const event: CallPageWebhooks['event'] = {
	match: (body) => {
		const parsed = CallPageWebhookEventSchema.safeParse(body);
		return parsed.success;
	},
	handler: async (ctx, request) => {
		const verification = verifyCallPageWebhookToken(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Unauthorized',
			};
		}

		const payload = CallPageWebhookEventSchema.parse(request.payload);
		const eventName = payload.data.event;
		await logEventFromContext(
			ctx,
			`callpage.webhook.${eventName}`,
			{ event: eventName },
			'completed',
		);
		return { success: true, data: payload };
	},
};
