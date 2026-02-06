import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import { createSlackEventMatch, verifySlackWebhookSignature } from './types';

export const teamJoin: SlackWebhooks['teamJoin'] = {
	match: createSlackEventMatch('team_join'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.options.key;
		const verification = verifySlackWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event?.type !== 'team_join') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('👋 Slack Team Join Event:', {
			userId: event.user.id,
			name: event.user.name,
			real_name: event.user.real_name,
		});

		let corsairEntityId = '';

		if (ctx.db.users && event.user.id) {
			try {
				const entity = await ctx.db.users.upsertByEntityId(event.user.id, {
					...event.user,
					display_name: event.user.profile?.display_name,
					email: event.user.profile?.email,
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.teamJoin',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const userChange: SlackWebhooks['userChange'] = {
	match: createSlackEventMatch('user_change'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.options.key;
		const verification = verifySlackWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event?.type !== 'user_change') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('👤 Slack User Change Event:', {
			userId: event.user.id,
			name: event.user.name,
			real_name: event.user.real_name,
		});

		let corsairEntityId = '';

		if (ctx.db.users && event.user.id) {
			try {
				const entity = await ctx.db.users.upsertByEntityId(event.user.id, {
					...event.user,
					display_name: event.user.profile?.display_name,
					email: event.user.profile?.email,
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update user in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.userChange',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
