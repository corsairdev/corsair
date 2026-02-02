import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import type { ReactionAddedEvent } from './types';
import { createSlackEventMatch } from './types';

export const added: SlackWebhooks['reactionAdded'] = {
	match: createSlackEventMatch('reaction_added'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'reaction_added') {
			return {
				success: true,
				data: {} as ReactionAddedEvent,
			};
		}

		const reactionEvent = event as ReactionAddedEvent;

		await logEventFromContext(
			ctx,
			'slack.webhook.reactionAdded',
			{ ...reactionEvent },
			'completed',
		);

		return {
			success: true,
			data: reactionEvent,
		};
	},
};
