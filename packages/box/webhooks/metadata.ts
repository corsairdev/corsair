import { logEventFromContext } from 'corsair/core';
import type { BoxWebhooks } from '../index';
import { createBoxMatch, verifyBoxWebhookSignature } from './types';

export const instanceCreated: BoxWebhooks['metadataInstanceCreated'] = {
	match: createBoxMatch('METADATA_INSTANCE.CREATED'),

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
			'box.webhook.metadataInstanceCreated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const instanceDeleted: BoxWebhooks['metadataInstanceDeleted'] = {
	match: createBoxMatch('METADATA_INSTANCE.DELETED'),

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
			'box.webhook.metadataInstanceDeleted',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const instanceUpdated: BoxWebhooks['metadataInstanceUpdated'] = {
	match: createBoxMatch('METADATA_INSTANCE.UPDATED'),

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
			'box.webhook.metadataInstanceUpdated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};
