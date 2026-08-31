import { asRecord, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
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
			let parsed: BrexUser;
			try {
				parsed = BrexUser.parse(user);
			} catch (error) {
				return {
					success: false,
					statusCode: 400,
					error:
						error instanceof z.ZodError
							? 'invalid user payload'
							: String(error),
				};
			}
			try {
				await ctx.db.users.upsertByEntityId(userId, parsed);
			} catch (error) {
				return {
					success: false,
					statusCode: 503,
					error:
						error instanceof Error ? error.message : 'failed to persist user',
				};
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
