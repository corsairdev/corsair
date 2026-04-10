import type { OnedriveWebhooks } from '..';
import {
	createOnedriveValidationMatch,
	extractOnedriveValidationToken,
} from './types';

export const validation: OnedriveWebhooks['validation'] = {
	match: createOnedriveValidationMatch(),
	handler: async (_ctx, request) => {
		const token = extractOnedriveValidationToken(request);
		if (!token) {
			return {
				success: false,
				error: 'Missing validation token in OneDrive validation request',
			};
		}

		return {
			success: true,
			returnToSender: {
				validationToken: token,
			},
			data: {
				validationToken: token,
			},
			responseHeaders: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
		};
	},
};
