import type { TeamsWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
import { createTeamsNotificationMatch, verifyTeamsClientState } from './types';

export const membershipChanged: TeamsWebhooks['membershipChanged'] = {
	match: createTeamsNotificationMatch(
		/teams\/[^/]+\/members/,
		'#Microsoft.Graph.aadUserConversationMember',
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

		if (ctx.db.members) {
			try {
				for (const notification of notifications) {
					const membershipId = notification.resourceData?.id;
					if (!membershipId) continue;

					// Extract teamId from the resource path
					// resource format: teams/{teamId}/members/{membershipId}
					const resourceParts = notification.resource.split('/');
					const teamId = resourceParts[1] ?? '';

					if (notification.changeType === 'deleted') {
						await ctx.db.members.deleteByEntityId(membershipId);
					} else {
						const entity = await ctx.db.members.upsertByEntityId(membershipId, {
							id: membershipId,
							teamId,
						});
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn('Failed to process membership webhook in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'teams.webhook.membershipChanged',
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
