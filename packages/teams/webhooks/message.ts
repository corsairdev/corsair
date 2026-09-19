import { logEventFromContext } from 'corsair/core';
import { makeTeamsRequest } from '../client';
import { toMessageRecord } from '../endpoints/messages';
import type { TeamsEndpointOutputs } from '../endpoints/types';
import type { TeamsWebhooks } from '../index';
import type { TeamsChannelMessageWebhookResponse } from './types';
import {
	createTeamsNotificationMatch,
	extractODataId,
	verifyTeamsWebhook,
} from './types';

export const channelMessage: TeamsWebhooks['channelMessage'] = {
	match: createTeamsNotificationMatch(
		/teams\([^)]+\)\/channels\([^)]+\)\/messages/,
		'#Microsoft.Graph.chatMessage',
	),

	handler: async (ctx, request) => {
		const { valid, error } = verifyTeamsWebhook(request, ctx.key);
		if (!valid) {
			return {
				success: false,
				statusCode: 401,
				error: error || 'clientState verification failed',
			};
		}

		const { value: notifications } = request.payload;
		if (!notifications[0]) {
			return {
				success: false,
				statusCode: 401,
				error: 'Invalid payload: missing notification',
			};
		}

		let corsairEntityId = '';
		let data: TeamsChannelMessageWebhookResponse = notifications[0];

		const accessToken = await ctx.keys.get_access_token();

		if (accessToken) {
			try {
				for (const { resourceData, resource, changeType } of notifications) {
					const messageId = resourceData?.id;
					if (!messageId) continue;

					// resource format: teams('teamId')/channels('channelId')/messages('messageId')
					// or, for a thread reply, .../messages('rootId')/replies('replyId')
					const parts = (resource ?? '').split('/');
					const teamId = extractODataId(parts[0] ?? '');
					const channelId = extractODataId(parts[1] ?? '');

					if (changeType === 'deleted') {
						await ctx.db.messages?.deleteByEntityId(messageId);
					} else {
						// Convert the OData notification resource to a REST path so replies
						// hydrate from .../messages/{root}/replies/{id}, not messages/{id}.
						const restPath = (resource ?? '')
							.split('/')
							.map((seg) => {
								const m = seg.match(/^([^(]+)\('([^']+)'\)$/);
								return m ? `${m[1]}/${m[2]}` : seg;
							})
							.join('/');
						const fullMsg = await makeTeamsRequest<
							TeamsEndpointOutputs['messagesGet']
						>(restPath, accessToken);
						if (data.resourceData?.id === messageId) {
							data = { ...data, teamId, channelId, message: fullMsg };
						}
						const entity = await ctx.db.messages?.upsertByEntityId(
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
			data,
		};
	},
};
