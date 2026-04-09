import { logEventFromContext } from 'corsair/core';
import type { TrelloWebhooks } from '..';
import { createTrelloActionMatch, verifyTrelloWebhookSignature } from './types';

export const commentCreated: TrelloWebhooks['commentCreated'] = {
	match: createTrelloActionMatch('commentCard'),

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

		if (card?.id && ctx.db.cards) {
			try {
				const existing = await ctx.db.cards.findByEntityId(card.id);
				await ctx.db.cards.upsertByEntityId(card.id, {
					...(existing?.data ?? {}),
					...card,
				});
			} catch (error) {
				console.warn(
					'Failed to update card in database from comment webhook:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.comment.created',
			{
				cardId: card?.id,
				boardId: action.data?.board?.id,
				text: action.data?.text,
			},
			'completed',
		);

		return {
			success: true,
			data: payload,
		};
	},
};
