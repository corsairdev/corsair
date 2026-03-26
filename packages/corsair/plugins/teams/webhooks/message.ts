import type { TeamsWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
import { createTeamsNotificationMatch, verifyTeamsClientState } from './types';

export const channelMessage: TeamsWebhooks['channelMessage'] = {
	match: createTeamsNotificationMatch(
		/teams\/[^/]+\/channels\/[^/]+\/messages/,
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

					// resource format: teams/{teamId}/channels/{channelId}/messages/{messageId}
					const [, teamId = '', , channelId = ''] = resource.split('/');

					if (changeType === 'deleted') {
						await ctx.db.messages.deleteByEntityId(messageId);
					} else {
						const entity = await ctx.db.messages.upsertByEntityId(messageId, {
							...notificationMeta,
							id: messageId,
							teamId,
							channelId,
							createdAt: new Date(),
						});
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn('Failed to process channel message webhook in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'teams.webhook.channelMessage',
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
