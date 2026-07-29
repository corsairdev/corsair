import { logEventFromContext } from 'corsair/core';
import type { GoogleAddressValidationWebhooks } from '..';
import {
	createGoogleAddressValidationMatch,
	verifyGoogleAddressValidationWebhookSignature,
} from './types';

export const example: GoogleAddressValidationWebhooks['example'] = {
	match: createGoogleAddressValidationMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGoogleAddressValidationWebhookSignature(
			request,
			ctx.key,
		);
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
			'googleaddressvalidation.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
