import { logEventFromContext } from '../../utils/events';
import type { ExaWebhooks } from '..';
import { createExaEventMatch, verifyExaWebhookSignature } from './types';

export const contentIndexed: ExaWebhooks['contentIndexed'] = {
	match: createExaEventMatch('content.indexed'),

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

		if (event.type !== 'content.indexed') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.searchResults) {
			try {
				const entity = await ctx.db.searchResults.upsertByEntityId(event.id, {
					id: event.id,
					...event.data,
					createdAt: event.data.publishedDate
						? new Date(event.data.publishedDate)
						: new Date(),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save indexed content to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'exa.webhook.contentIndexed',
			{ url: event.data.url, title: event.data.title },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
