import { logEventFromContext } from 'corsair/core';
import type { TrelloWebhooks } from '..';
import { createTrelloActionMatch, verifyTrelloWebhookSignature } from './types';

export const cardUpdated: TrelloWebhooks['cardUpdated'] = {
	match: createTrelloActionMatch('updateCard'),

	handler: async (ctx, request) => {
		const verification = verifyTrelloWebhookSignature(request, ctx.key);
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
		const listAfter = action.data?.listAfter;
		const listBefore = action.data?.listBefore;
		let corsairEntityId = '';

		if (card?.id && ctx.db.cards) {
			try {
				const existing = await ctx.db.cards.findByEntityId(card.id);
				const entity = await ctx.db.cards.upsertByEntityId(card.id, {
					...(existing?.data ?? {}),
					...card,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update card in database from webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.card.updated',
			{
				cardId: card?.id,
				boardId: action.data?.board?.id,
				...(listAfter && {
					listBeforeId: listBefore?.id,
					listAfterId: listAfter.id,
				}),
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
