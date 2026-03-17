import { logEventFromContext } from '../../utils/events';
import type { ExaWebhooks } from '..';
import { createExaEventMatch, verifyExaWebhookSignature } from './types';

export const searchAlert: ExaWebhooks['searchAlert'] = {
	match: createExaEventMatch('search.alert'),

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

		if (event.type !== 'search.alert') {
			return {
				success: true,
				data: undefined,
			};
		}

		if (ctx.db.searchResults) {
			try {
				for (const searchResult of event.data.results) {
					await ctx.db.searchResults.upsertByEntityId(searchResult.id, {
						...searchResult,
						query: event.data.query,
						createdAt: searchResult.publishedDate
							? new Date(searchResult.publishedDate)
							: new Date(),
					});
				}
			} catch (error) {
				console.warn('Failed to save search results to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'exa.webhook.searchAlert',
			{ query: event.data.query, resultCount: event.data.results.length },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
