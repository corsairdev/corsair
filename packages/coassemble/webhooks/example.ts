import { logEventFromContext } from 'corsair/core';
import type { CoassembleWebhooks } from '..';
import {
	createCoassembleMatch,
	verifyCoassembleWebhookSignature,
} from './types';

export const example: CoassembleWebhooks['example'] = {
	match: createCoassembleMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCoassembleWebhookSignature(request, ctx.key);
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
			'coassemble.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
