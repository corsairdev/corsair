import type { SpokiWebhooks } from '../index';
import { verifySpokiWebhookRequest } from './tenant-matcher';

function hasSpokiSignatureHeader(
	headers: Record<string, string | string[] | undefined>,
): boolean {
	return Object.keys(headers).some(
		(key) => key.toLowerCase() === 'x-spoki-signature',
	);
}

export const spokiEvent: SpokiWebhooks['event'] = {
	match: (request) => hasSpokiSignatureHeader(request.headers ?? {}),

	handler: async (ctx, request) => {
		const verification = verifySpokiWebhookRequest(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		return {
			success: true,
			data: request.payload,
		};
	},
};
