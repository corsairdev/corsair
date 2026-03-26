import type { TeamsWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
import { createTeamsNotificationMatch, verifyTeamsClientState } from './types';

export const channelCreated: TeamsWebhooks['channelCreated'] = {
	match: createTeamsNotificationMatch(
		/teams\/[^/]+\/channels/,
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

		if (ctx.db.channels) {
			try {
				for (const notification of notifications) {
					const channelId = notification.resourceData?.id;
					if (!channelId) continue;

					// Extract teamId from the resource path
					// resource format: teams/{teamId}/channels/{channelId}
					const resourceParts = notification.resource.split('/');
					const teamId = resourceParts[1] ?? '';

					if (notification.changeType === 'deleted') {
						await ctx.db.channels.deleteByEntityId(channelId);
					} else {
						const entity = await ctx.db.channels.upsertByEntityId(channelId, {
							id: channelId,
							teamId,
							createdAt: new Date(),
						});
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
