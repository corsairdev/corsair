import type { NotionWebhooks } from '../index';
import { createNotionMatch } from './types';

export const verification: NotionWebhooks['verification'] = {
	match: createNotionMatch('url_verification'),
	handler: async (ctx, request) => {
		if (
			!('verification_token' in request.payload) ||
			!request.payload.verification_token
		) {
			return {
				success: false,
				data: undefined,
			};
		}

		const existingSecret = await ctx.keys.get_webhook_signature();
		if (existingSecret) {
			if (existingSecret !== request.payload.verification_token) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid verification token',
				};
			}
		} else {
			await ctx.keys.set_webhook_signature(request.payload.verification_token);
		}

		console.log('Notion webhook verification request received');

		return {
			success: true,
			returnToSender: {
				verification_token: request.payload.verification_token,
			},
			data: {
				verification_token: request.payload.verification_token,
				type: 'url_verification',
			},
		};
	},
};
