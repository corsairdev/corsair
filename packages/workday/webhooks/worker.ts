import type { CorsairWebhook } from 'corsair/core';
import type { WorkdayContext } from '../index';
import type { WorkdayWorkerEvent } from './types';
import {
	createWorkdayEventMatch,
	verifyWorkdayWebhookSignature,
} from './types';

export const workerUpdated: CorsairWebhook<WorkdayContext, WorkdayWorkerEvent> =
	{
		match: createWorkdayEventMatch('worker.updated'),
		handler: async (ctx, request) => {
			const secret = ctx.options?.webhookSecret || (ctx as any).key || '';
			const v = verifyWorkdayWebhookSignature(request as any, secret);
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
