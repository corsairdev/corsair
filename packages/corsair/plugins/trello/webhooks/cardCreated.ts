import { logEventFromContext } from '../../utils/events';
import type { TrelloWebhooks } from '..';
import { createTrelloActionMatch, verifyTrelloWebhookSignature } from './types';

export const cardCreated: TrelloWebhooks['cardCreated'] = {
	match: createTrelloActionMatch('createCard'),

	handler: async (ctx, request) => {
		const verification = verifyTrelloWebhookSignature(
			request,
			ctx.key,
			ctx.options.webhookCallbackUrl,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload;
		const action = payload.action;

		const card = action.data?.card;
		let corsairEntityId = '';

		if (card?.id && ctx.db.cards) {
			try {
				const entity = await ctx.db.cards.upsertByEntityId(card.id, {
					...card,
					createdAt: new Date(action.date),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save card to database from webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.card.created',
			{ cardId: card?.id, boardId: action.data?.board?.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
