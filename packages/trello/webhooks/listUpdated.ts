import { logEventFromContext } from 'corsair/core';
import type { TrelloWebhooks } from '..';
import { createTrelloActionMatch, verifyTrelloWebhookSignature } from './types';

export const listUpdated: TrelloWebhooks['listUpdated'] = {
	match: createTrelloActionMatch('updateList'),

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
		const trelloList = action.data?.list;
		let corsairEntityId = '';

		if (trelloList?.id && ctx.db.lists) {
			try {
				const existing = await ctx.db.lists.findByEntityId(trelloList.id);
				const existingData = existing?.data;
				const entity = await ctx.db.lists.upsertByEntityId(trelloList.id, {
					...(existingData ?? {}),
					...trelloList,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update list in database from webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.list.updated',
			{ listId: trelloList?.id, boardId: action.data?.board?.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
