import type { NotionWebhooks } from '..';
import { createNotionMatch, verifyNotionWebhookSignature } from './types';

export const verification: NotionWebhooks['verification'] = {
	match: createNotionMatch('url_verification'),
	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyNotionWebhookSignature(request, request.payload.verification_token);

		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		

		if (!('verification_token' in request.payload) || !request.payload.verification_token) {
			return {
				success: false,
				data: undefined,
			};
        }
        
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
