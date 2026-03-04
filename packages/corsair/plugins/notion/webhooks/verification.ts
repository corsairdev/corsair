import type { NotionWebhooks } from '..';
import { createNotionMatch } from './types';

export const verification: NotionWebhooks['verification'] = {
	match: createNotionMatch('url_verification'),
	handler: async (ctx, request) => {

		if (!('verification_token' in request.payload) || !request.payload.verification_token) {
			return {
				success: false,
				data: undefined,
			};
		}
		
		ctx.keys.set_webhook_signature(request.payload.verification_token);
		console.log(`Enter this key in your Notion webhook verification modal: ${ctx.key}`)

        
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
