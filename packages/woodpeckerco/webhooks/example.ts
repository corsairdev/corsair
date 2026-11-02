import { logEventFromContext } from 'corsair/core';
import type { WoodpeckerCoWebhooks } from '..';
import {
	createWoodpeckerCoMatch,
	verifyWoodpeckerCoWebhookSignature,
} from './types';

export const example: WoodpeckerCoWebhooks['example'] = {
	match: createWoodpeckerCoMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyWoodpeckerCoWebhookSignature(request, ctx.key);
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
			'woodpeckerco.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
