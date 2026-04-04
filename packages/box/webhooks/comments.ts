import { logEventFromContext } from 'corsair/core';
import type { BoxWebhooks } from '..';
import { createBoxMatch, verifyBoxWebhookSignature } from './types';

export const created: BoxWebhooks['commentCreated'] = {
	match: createBoxMatch('COMMENT.CREATED'),

	handler: async (ctx, request) => {
		const verification = verifyBoxWebhookSignature(request, ctx.key);
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
			'box.webhook.commentCreated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const deleted: BoxWebhooks['commentDeleted'] = {
	match: createBoxMatch('COMMENT.DELETED'),

	handler: async (ctx, request) => {
		const verification = verifyBoxWebhookSignature(request, ctx.key);
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
			'box.webhook.commentDeleted',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const updated: BoxWebhooks['commentUpdated'] = {
	match: createBoxMatch('COMMENT.UPDATED'),

	handler: async (ctx, request) => {
		const verification = verifyBoxWebhookSignature(request, ctx.key);
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
			'box.webhook.commentUpdated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};
