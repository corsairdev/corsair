import { logEventFromContext } from 'corsair/core';
import type { FalWebhooks } from '..';
import {
	FAL_WEBHOOK_HEADERS,
	headerValue,
	matchRequestCompleted,
	verifyFalWebhookSignature,
} from './types';

export const completed: FalWebhooks['requestCompleted'] = {
	match: matchRequestCompleted,

	handler: async (ctx, request) => {
		const verification = await verifyFalWebhookSignature(request);
		if (verification.retryable) {
			// Throwing makes processWebhook report a failure, so the HTTP handler
			// can answer non-2xx and fal delivers again; a refusal would be lost.
			throw new Error(verification.error);
		}
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error:
					verification.error || 'fal webhook signature verification failed',
			};
		}

		// fal signs for whichever fal account made the request, and anyone with
		// a fal account can point a webhook at any URL. When the tenant's account
		// stores its fal user id, only that account's deliveries are accepted.
		const signedUserId = headerValue(
			request.headers,
			FAL_WEBHOOK_HEADERS.userId,
		);
		// unknown: the webhook context's key manager is typed for every plugin and
		// does not list the user_id field falAuthConfig declares for fal accounts.
		const keys = ctx.keys as unknown as {
			get_user_id?: () => Promise<string | null | undefined>;
		};
		let accountUserId: string | null | undefined;
		try {
			accountUserId = await keys?.get_user_id?.();
		} catch {
			// No stored keys for this account yet (the key came from fal({ key })),
			// so there is no user id to hold the delivery to.
			accountUserId = undefined;
		}
		if (accountUserId && signedUserId !== accountUserId) {
			return {
				success: false,
				statusCode: 403,
				error: 'fal webhook was made for a different fal account',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'fal.webhook.requests.completed',
			{ requestId: event.request_id, status: event.status },
			'completed',
		);

		return { success: true, data: event };
	},
};
