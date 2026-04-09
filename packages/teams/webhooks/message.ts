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

export const channelMessage: TeamsWebhooks['channelMessage'] = {
	match: createTeamsNotificationMatch(
		/teams\([^)]+\)\/channels\([^)]+\)\/messages/,
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

					// resource format: teams('teamId')/channels('channelId')/messages('messageId')
					const parts = resource.split('/');
					const teamId = extractODataId(parts[0] ?? '');
					const channelId = extractODataId(parts[1] ?? '');

					if (changeType === 'deleted') {
						await ctx.db.messages.deleteByEntityId(messageId);
					} else if (accessToken) {
						const fullMsg = await makeTeamsRequest<
							TeamsEndpointOutputs['messagesGet']
						>(
							`teams/${teamId}/channels/${channelId}/messages/${messageId}`,
							accessToken,
						);
						const entity = await ctx.db.messages.upsertByEntityId(
							messageId,
							toMessageRecord(fullMsg, { teamId, channelId }),
						);
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn(
					'Failed to process channel message webhook in database:',
					error,
				);
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
