import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterWebhooks } from '..';
import { createCodeInterpreterMatch, verifyCodeInterpreterWebhookSignature } from './types';

export const executionCompleted: CodeInterpreterWebhooks['executionCompleted'] = {
	match: createCodeInterpreterMatch('execution.completed'),

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
		if (event.type !== 'execution.completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'codeinterpreter.execution.completed', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
