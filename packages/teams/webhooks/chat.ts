import { logEventFromContext } from 'corsair/core';
import type { TeamsWebhooks } from '..';
import { makeTeamsRequest } from '../client';
import { toMessageRecord } from '../endpoints/messages';
import type { TeamsEndpointOutputs } from '../endpoints/types';
import {
	createTeamsNotificationMatch,
	extractODataId,
	verifyTeamsClientState,
} from './types';

export const chatMessage: TeamsWebhooks['chatMessage'] = {
	match: createTeamsNotificationMatch(
		/chats\([^)]+\)\/messages/,
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

		const accessToken = await ctx.keys.get_access_token();

		if (ctx.db.messages) {
			try {
				for (const { resourceData, resource, changeType } of notifications) {
					const messageId = resourceData?.id;
					if (!messageId) continue;

					// resource format: chats('chatId')/messages('messageId')
					const chatId = extractODataId(resource.split('/')[0] ?? '');

					if (changeType === 'deleted') {
						await ctx.db.messages.deleteByEntityId(messageId);
					} else if (accessToken) {
						const fullMsg = await makeTeamsRequest<
							TeamsEndpointOutputs['messagesGet']
						>(`chats/${chatId}/messages/${messageId}`, accessToken);
						const entity = await ctx.db.messages.upsertByEntityId(
							messageId,
							toMessageRecord(fullMsg, { chatId }),
						);
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn(
					'Failed to process chat message webhook in database:',
					error,
				);
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
