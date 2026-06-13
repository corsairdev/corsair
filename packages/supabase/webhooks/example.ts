import { logEventFromContext } from 'corsair/core';
import type { SupabaseWebhooks } from '..';
import { createSupabaseMatch, verifySupabaseWebhookSignature } from './types';

export const example: SupabaseWebhooks['example'] = {
	match: createSupabaseMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifySupabaseWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'supabase.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
