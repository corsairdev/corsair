import { logEventFromContext } from 'corsair/core';
import type { SecuritytrailsWebhooks } from '..';
import {
	createSecuritytrailsMatch,
	verifySecuritytrailsWebhookSignature,
} from './types';

export const example: SecuritytrailsWebhooks['example'] = {
	match: createSecuritytrailsMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifySecuritytrailsWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'securitytrails.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
