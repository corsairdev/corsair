import { logEventFromContext } from 'corsair/core';
import type { TeamsWebhooks } from '..';
import { makeTeamsRequest } from '../client';
import { toChannelRecord } from '../endpoints/channels';
import type { TeamsEndpointOutputs } from '../endpoints/types';
import {
	createTeamsNotificationMatch,
	extractODataId,
	verifyTeamsClientState,
} from './types';

export const channelCreated: TeamsWebhooks['channelCreated'] = {
	match: createTeamsNotificationMatch(
		/teams\([^)]+\)\/channels/,
		'#Microsoft.Graph.channel',
	),

	handler: async (ctx, request) => {
		const clientState = ctx.key;
		const verification = verifyTeamsClientState(request.payload, clientState);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'clientState verification failed',
			};
		}

		const notifications = request.payload.value;
		let corsairEntityId = '';

		const accessToken = await ctx.keys.get_access_token();

		if (ctx.db.channels) {
			try {
				for (const notification of notifications) {
					const channelId = notification.resourceData?.id;
					if (!channelId) continue;

					// resource format: teams('teamId')/channels('channelId')
					const teamId = extractODataId(
						notification.resource.split('/')[0] ?? '',
					);

					if (notification.changeType === 'deleted') {
						await ctx.db.channels.deleteByEntityId(channelId);
					} else if (accessToken) {
						const fullChannel = await makeTeamsRequest<
							TeamsEndpointOutputs['channelsGet']
						>(`teams/${teamId}/channels/${channelId}`, accessToken);
						const entity = await ctx.db.channels.upsertByEntityId(
							channelId,
							toChannelRecord(fullChannel, teamId),
						);
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn('Failed to process channel webhook in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'teams.webhook.channelCreated',
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
