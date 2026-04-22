import type { MondayWebhooks } from '../index';
import { createMondayChallengeMatch } from './types';

export const challenge: MondayWebhooks['challenge'] = {
	match: createMondayChallengeMatch(),

	handler: async (ctx, request) => {
		if (!request.payload.challenge) {
			return {
				success: false,
				error: 'Missing challenge field',
			};
		}

		return {
			success: true,
			returnToSender: {
				challenge: request.payload.challenge,
			},
			data: request.payload,
		};
	},
};
