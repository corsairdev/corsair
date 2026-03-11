import { logEventFromContext } from '../../utils/events';
import type { SentryWebhooks } from '..';
import { createSentryMatch, verifySentryWebhookSignature } from './types';

export const commentCreated: SentryWebhooks['commentCreated'] = {
	match: createSentryMatch('comment', 'created'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'sentry.webhook.commentCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const commentUpdated: SentryWebhooks['commentUpdated'] = {
	match: createSentryMatch('comment', 'updated'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'sentry.webhook.commentUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const commentDeleted: SentryWebhooks['commentDeleted'] = {
	match: createSentryMatch('comment', 'deleted'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'sentry.webhook.commentDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
