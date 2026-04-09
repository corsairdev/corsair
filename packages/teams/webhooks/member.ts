import { logEventFromContext } from 'corsair/core';
import type { TeamsWebhooks } from '..';
import { makeTeamsRequest } from '../client';
import type { TeamsEndpointOutputs } from '../endpoints/types';
import {
	createTeamsNotificationMatch,
	extractODataId,
	verifyTeamsClientState,
} from './types';

export const membershipChanged: TeamsWebhooks['membershipChanged'] = {
	match: createTeamsNotificationMatch(
		/teams\([^)]+\)\/members/,
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

		const accessToken = await ctx.keys.get_access_token();

		if (ctx.db.members) {
			try {
				for (const notification of notifications) {
					const membershipId = notification.resourceData?.id;
					if (!membershipId) continue;

					// resource format: teams('teamId')/members('membershipId')
					const teamId = extractODataId(
						notification.resource.split('/')[0] ?? '',
					);

					if (notification.changeType === 'deleted') {
						await ctx.db.members.deleteByEntityId(membershipId);
					} else if (accessToken) {
						const fullMember = await makeTeamsRequest<
							TeamsEndpointOutputs['membersGet']
						>(`teams/${teamId}/members/${membershipId}`, accessToken);
						const entity = await ctx.db.members.upsertByEntityId(membershipId, {
							...fullMember,
							id: membershipId,
							teamId,
						});
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn(
					'Failed to process membership webhook in database:',
					error,
				);
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
