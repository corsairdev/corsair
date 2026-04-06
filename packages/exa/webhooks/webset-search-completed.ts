import { logEventFromContext } from 'corsair/core';
import type { ExaWebhooks } from '..';
import { createExaEventMatch, verifyExaWebhookSignature } from './types';

export const websetSearchCompleted: ExaWebhooks['websetSearchCompleted'] = {
	match: createExaEventMatch('webset.search.completed'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyExaWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'webset.search.completed') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.websets) {
			try {
				const entity = await ctx.db.websets.upsertByEntityId(
					event.data.webset.id,
					{
						id: event.data.webset.id,
						status: event.data.webset.status,
						externalId: event.data.webset.externalId,
						createdAt: new Date(event.data.webset.createdAt),
						updatedAt: new Date(event.data.webset.updatedAt),
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save webset to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'exa.webhook.websetSearchCompleted',
			{
				websetId: event.data.webset.id,
				totalItems: event.data.totalItems,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
