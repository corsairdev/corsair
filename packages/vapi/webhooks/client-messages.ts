import { logEventFromContext } from 'corsair/core';
import type { VapiWebhooks } from '../index';
import {
	createVapiMessageMatch,
	verifyVapiWebhookSecret,
} from './types';

export const workflowNodeStarted: VapiWebhooks['workflowNodeStarted'] = {
	match: createVapiMessageMatch('workflow.node.started'),

	handler: async (ctx, request) => {
		const verification = verifyVapiWebhookSecret(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error ?? 'Unauthorized' };
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'vapi.webhook.workflow-node-started', {}, 'completed');
		return { success: true, data: event };
	},
};
