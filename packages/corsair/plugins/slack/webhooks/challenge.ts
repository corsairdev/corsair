import type { SlackWebhooks } from '..';
import { createSlackEventMatch } from './types';

export const challenge: SlackWebhooks['challenge'] = {
	match: createSlackEventMatch('url_verification'),
	handler: async (ctx, request) => {
		// Type guard: SlackUrlVerificationPayload has challenge but no 'event' property
		// SlackEventPayload has 'event' property
		if ('event' in request.payload || !('challenge' in request.payload)) {
			return {
				success: false,
				data: undefined,
			};
		}

		// At this point, TypeScript knows it's SlackUrlVerificationPayload
		return {
			success: true,
			returnToSender: true,
			data: {
				challenge: request.payload.challenge,
			},
		};
	},
};
