import { logEventFromContext } from '../../utils/events';
import type { TrelloWebhooks } from '..';
import { createTrelloCardMovedMatch, verifyTrelloWebhookSignature } from './types';

export const cardMoved: TrelloWebhooks['cardMoved'] = {
	match: createTrelloCardMovedMatch(),

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
		const listAfter = action.data?.listAfter;
		let corsairEntityId = '';

		if (card?.id && ctx.db.cards) {
			try {
				const existing = await ctx.db.cards.findByEntityId(card.id);
				const entity = await ctx.db.cards.upsertByEntityId(card.id, {
					...(existing?.data ?? {}),
					id: card.id,
					name: card.name ?? existing?.data?.name,
					idBoard: card.idBoard ?? action.data?.board?.id ?? existing?.data?.idBoard,
					idList: listAfter?.id ?? card.idList ?? existing?.data?.idList,
					closed: card.closed ?? existing?.data?.closed,
					pos: card.pos ?? existing?.data?.pos,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update card list in database from webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.card.moved',
			{
				cardId: card?.id,
				listBeforeId: action.data?.listBefore?.id,
				listAfterId: listAfter?.id,
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
