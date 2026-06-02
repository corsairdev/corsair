import { logEventFromContext } from 'corsair/core';
import type { BoxWebhooks } from '../index';
import { createBoxMatch, verifyBoxWebhookSignature } from './types';

export const accepted: BoxWebhooks['collaborationAccepted'] = {
	match: createBoxMatch('COLLABORATION.ACCEPTED'),

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
			'box.webhook.collaborationAccepted',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const created: BoxWebhooks['collaborationCreated'] = {
	match: createBoxMatch('COLLABORATION.CREATED'),

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
			'box.webhook.collaborationCreated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const rejected: BoxWebhooks['collaborationRejected'] = {
	match: createBoxMatch('COLLABORATION.REJECTED'),

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
			'box.webhook.collaborationRejected',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const removed: BoxWebhooks['collaborationRemoved'] = {
	match: createBoxMatch('COLLABORATION.REMOVED'),

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
			'box.webhook.collaborationRemoved',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const updated: BoxWebhooks['collaborationUpdated'] = {
	match: createBoxMatch('COLLABORATION.UPDATED'),

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
			'box.webhook.collaborationUpdated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};
