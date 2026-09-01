import type { SendGridWebhooks } from '..';
import { createSendGridMatch } from './types';

export const emailEvent: SendGridWebhooks['emailEvent'] = {
	match: createSendGridMatch(),
	handler: async (_ctx, request) => {
		const events = Array.isArray(request.payload) ? request.payload : [];
		return {
			success: true,
			data: {
				events,
			},
		};
	},
};
