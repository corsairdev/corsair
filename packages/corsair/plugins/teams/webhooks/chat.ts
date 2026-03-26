import type { TeamsWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
import { createTeamsNotificationMatch, verifyTeamsClientState } from './types';

export const chatMessage: TeamsWebhooks['chatMessage'] = {
	match: createTeamsNotificationMatch(
		/chats\/[^/]+\/messages/,
		'#Microsoft.Graph.chatMessage',
	),

	handler: async (ctx, request) => {
		const { valid, error } = verifyTeamsClientState(request.payload, ctx.key);
		if (!valid) {
			return {
				success: false,
				statusCode: 401,
				error: error || 'clientState verification failed',
			};
		}

		const { value: notifications } = request.payload;
		let corsairEntityId = '';

		if (ctx.db.messages) {
			try {
				for (const { resourceData, resource, changeType, ...notificationMeta } of notifications) {
					const messageId = resourceData?.id;
					if (!messageId) continue;

					// resource format: chats/{chatId}/messages/{messageId}
					const [, chatId = ''] = resource.split('/');

					if (changeType === 'deleted') {
						await ctx.db.messages.deleteByEntityId(messageId);
					} else {
						const entity = await ctx.db.messages.upsertByEntityId(messageId, {
							...notificationMeta,
							id: messageId,
							chatId,
							createdAt: new Date(),
						});
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn('Failed to process chat message webhook in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'teams.webhook.chatMessage',
			{ notificationCount: notifications.length },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: notifications[0],
		};
	},
};
