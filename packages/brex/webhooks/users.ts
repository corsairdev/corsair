import { asRecord, logEventFromContext } from 'corsair/core';
import type { BrexWebhooks } from '../index';
import { BrexUser } from '../schema';
import { createBrexEventMatch, verifyBrexWebhookSignature } from './types';

export const userUpdated: BrexWebhooks['userUpdated'] = {
	match: createBrexEventMatch('USER_UPDATED'),

	handler: async (ctx, request) => {
		if (!request.hubVerified) {
			const verification = verifyBrexWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
		}

		const event = request.payload;
		if (event.event_type !== 'USER_UPDATED') {
			return { success: true, data: undefined };
		}

		const user = asRecord(event.data);
		const userId = typeof user?.id === 'string' ? user.id : undefined;
		if (userId && ctx.db.users) {
			try {
				const parsed = BrexUser.parse(user);
				await ctx.db.users.upsertByEntityId(userId, parsed);
			} catch (error) {
				console.warn('[brex] Failed to save user webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'brex.webhook.users.updated',
			{ event_id: event.event_id, company_id: event.company_id },
			'completed',
		);

		return { success: true, data: event };
	},
};
