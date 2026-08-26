import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailWebhooks } from '..';
import {
	createBenchmarkEmailMatch,
	verifyBenchmarkEmailWebhookSignature,
} from './types';

export const example: BenchmarkEmailWebhooks['example'] = {
	match: createBenchmarkEmailMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBenchmarkEmailWebhookSignature(request, ctx.key);
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
			'benchmarkemail.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
