import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterWebhooks } from '..';
import { createCodeInterpreterMatch, verifyCodeInterpreterWebhookSignature } from './types';

export const fileReady: CodeInterpreterWebhooks['fileReady'] = {
	match: createCodeInterpreterMatch('file.ready'),

	handler: async (ctx, request) => {
		const verification = verifyCodeInterpreterWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'file.ready') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'codeinterpreter.file.ready', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
