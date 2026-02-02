import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import { createSlackEventMatch } from './types';

export const teamJoin: SlackWebhooks['teamJoin'] = {
	match: createSlackEventMatch('team_join'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'team_join') {
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

		if (ctx.db.users && event.user.id) {
			try {
				await ctx.db.users.upsert(event.user.id, {
					...event.user,
					display_name: event.user.profile?.display_name,
					email: event.user.profile?.email,
				});
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
			data: event,
		};
	},
};

export const userChange: SlackWebhooks['userChange'] = {
	match: createSlackEventMatch('user_change'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'user_change') {
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

		if (ctx.db.users && event.user.id) {
			try {
				await ctx.db.users.upsert(event.user.id, {
					...event.user,
					display_name: event.user.profile?.display_name,
					email: event.user.profile?.email,
				});
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
			data: event,
		};
	},
};
