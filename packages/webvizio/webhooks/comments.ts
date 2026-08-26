import { logEventFromContext } from 'corsair/core';
import type { WebvizioWebhooks } from '../index';
import { createWebvizioMatch, verifyWebvizioWebhookSignature } from './types';

export const commentCreated: WebvizioWebhooks['commentCreated'] = {
	match: createWebvizioMatch('comment.created'),
	handler: async (ctx, request) => {
		const verification = verifyWebvizioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Invalid webhook signature',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'webvizio.webhook.commentCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const commentDeleted: WebvizioWebhooks['commentDeleted'] = {
	match: createWebvizioMatch('comment.deleted'),
	handler: async (ctx, request) => {
		const verification = verifyWebvizioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Invalid webhook signature',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'webvizio.webhook.commentDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
