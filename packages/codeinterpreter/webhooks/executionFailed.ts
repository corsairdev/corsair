import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterWebhooks } from '..';
import { createCodeInterpreterMatch, verifyCodeInterpreterWebhookSignature } from './types';

export const executionFailed: CodeInterpreterWebhooks['executionFailed'] = {
	match: createCodeInterpreterMatch('execution.failed'),

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
		if (event.type !== 'execution.failed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'codeinterpreter.execution.failed', { ...event }, 'failed');

		return { success: true, data: event };
	},
};
