import type { CorsairWebhookDefinition } from 'corsair/core';
import type { WorkdayWebhookOutputs } from './types';
import {
	createWorkdayEventMatch,
	verifyWorkdayWebhookSignature,
} from './types';

export const workerUpdated: CorsairWebhookDefinition<
	WorkdayWebhookOutputs,
	'worker.updated'
> = {
	match: createWorkdayEventMatch('worker.updated'),
	handler: async (ctx, request) => {
		const v = verifyWorkdayWebhookSignature(request, ctx.key);
		if (!v.valid) {
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		}
		return { success: true };
	},
};
