import { logEventFromContext } from '../../utils/events';
import type { TrelloWebhooks } from '..';
import { createTrelloActionMatch, verifyTrelloWebhookSignature } from './types';

export const cardUpdated: TrelloWebhooks['cardUpdated'] = {
	match: createTrelloActionMatch('updateCard'),

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
				const existing = await ctx.db.cards.findByEntityId(card.id);
				const entity = await ctx.db.cards.upsertByEntityId(card.id, {
					...(existing?.data ?? {}),
					id: card.id,
					name: card.name ?? existing?.data?.name,
					desc: card.desc ?? existing?.data?.desc,
					idBoard: card.idBoard ?? action.data?.board?.id ?? existing?.data?.idBoard,
					idList: card.idList ?? action.data?.list?.id ?? existing?.data?.idList,
					closed: card.closed ?? existing?.data?.closed,
					pos: card.pos ?? existing?.data?.pos,
					due: card.due !== undefined ? card.due : existing?.data?.due,
					dueComplete: card.dueComplete ?? existing?.data?.dueComplete,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update card in database from webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.card.updated',
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
