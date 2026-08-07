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

		const token = request.payload.verification_token;

		try {
			await ctx.keys.set_webhook_signature_if_absent(token);
		} catch {
			const existing = await ctx.keys.get_webhook_signature();
			if (existing && existing !== token) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid verification token',
				};
			}
			if (!existing) {
				return {
					success: false,
					statusCode: 500,
					error: 'Failed to persist verification token',
				};
			}
		}

		console.log('Notion webhook verification request received');

		return {
			success: true,
			returnToSender: {
				verification_token: token,
			},
			data: {
				verification_token: token,
				type: 'url_verification',
			},
		};
	},
};
