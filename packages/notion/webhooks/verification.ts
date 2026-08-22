import crypto from 'crypto';
import type { NotionWebhooks } from '../index';
import { createNotionMatch } from './types';

/** Constant-time compare. Length may short-circuit; length is not sensitive. */
function secretsMatch(a: string, b: string): boolean {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) {
		return false;
	}
	return crypto.timingSafeEqual(aBuf, bBuf);
}

export const verification: NotionWebhooks['verification'] = {
	match: createNotionMatch('url_verification'),
	handler: async (ctx, request) => {
		if (
			!('verification_token' in request.payload) ||
			!request.payload.verification_token
		) {
			return {
				success: false,
				statusCode: 400,
				error: 'Missing verification_token',
				data: undefined,
			};
		}

		const token = request.payload.verification_token;

		try {
			await ctx.keys.set_webhook_signature_if_absent(token);
		} catch (error) {
			const existing = await ctx.keys.get_webhook_signature();
			if (existing && !secretsMatch(existing, token)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid verification token',
				};
			}
			if (!existing) {
				console.warn(
					'[corsair:notion] Failed to persist verification token:',
					error instanceof Error ? error.message : String(error),
				);
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
