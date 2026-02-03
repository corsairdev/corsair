import type { SlackWebhooks } from '..';
import { createSlackEventMatch } from './types';

export const challenge: SlackWebhooks['challenge'] = {
	match: createSlackEventMatch('url_verification'),
	handler: async (ctx, request) => {
		if (request.payload.type !== 'url_verification') {
			return {
				success: false,
				data: undefined,
			};
		}
		return {
			success: true,
			returnToSender: true,
			challenge: request.payload.challenge,
		};
	},
};
