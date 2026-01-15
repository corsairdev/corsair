import type { SlackWebhooks } from '..';
import { createSlackEventMatch } from './types';

export const addedMatch = createSlackEventMatch('reaction_added');

export const added: SlackWebhooks['reactionAdded'] = async (ctx, request) => {
	return {
		success: true,
		data: {},
	};
};
