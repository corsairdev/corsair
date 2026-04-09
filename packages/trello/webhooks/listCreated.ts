import { logEventFromContext } from 'corsair/core';
import type { TrelloWebhooks } from '..';
import { createTrelloActionMatch, verifyTrelloWebhookSignature } from './types';

export const listCreated: TrelloWebhooks['listCreated'] = {
	match: createTrelloActionMatch('createList'),

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
		const board = action.data?.board;
		let corsairEntityId = '';

		if (trelloList?.id && ctx.db.lists) {
			try {
				const entity = await ctx.db.lists.upsertByEntityId(trelloList.id, {
					...trelloList,
					idBoard: board?.id,
					createdAt: new Date(action.date),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save list to database from webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.list.created',
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
