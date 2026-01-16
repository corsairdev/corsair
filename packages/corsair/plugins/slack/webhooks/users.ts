import type { SlackWebhooks } from '..';
import type { TeamJoinEvent, UserChangeEvent } from './types';
import { createSlackEventMatch } from './types';

export const teamJoin: SlackWebhooks['teamJoin'] = {
	match: createSlackEventMatch('team_join'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'team_join') {
			return {
				success: true,
				data: {},
			};
		}

		const userEvent = event as TeamJoinEvent;

		console.log('👋 Slack Team Join Event:', {
			userId: userEvent.user.id,
			name: userEvent.user.name,
			real_name: userEvent.user.real_name,
		});

		if (ctx.db.users && userEvent.user.id) {
			try {
				await ctx.db.users.upsert(userEvent.user.id, {
					...userEvent.user,
					display_name: userEvent.user.profile?.display_name,
					email: userEvent.user.profile?.email,
				});
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}

		return {
			success: true,
			data: {},
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
				data: {},
			};
		}

		const userEvent = event as UserChangeEvent;

		console.log('👤 Slack User Change Event:', {
			userId: userEvent.user.id,
			name: userEvent.user.name,
			real_name: userEvent.user.real_name,
		});

		if (ctx.db.users && userEvent.user.id) {
			try {
				await ctx.db.users.upsert(userEvent.user.id, {
					...userEvent.user,
					display_name: userEvent.user.profile?.display_name,
					email: userEvent.user.profile?.email,
				});
			} catch (error) {
				console.warn('Failed to update user in database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};
