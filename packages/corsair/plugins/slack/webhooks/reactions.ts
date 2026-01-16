import type { SlackWebhooks } from '..';
import { createSlackEventMatch } from './types';

export const added: SlackWebhooks['reactionAdded'] = {
	match: createSlackEventMatch('reaction_added'),

	handler: async (ctx, request) => {
		return {
			success: true,
			data: {},
		};
	},
};
