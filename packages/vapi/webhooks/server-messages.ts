import { logEventFromContext } from 'corsair/core';
import type { VapiWebhooks } from '../index';
import {
	createVapiMessageMatch,
	verifyVapiWebhookSecret,
} from './types';

export const assistantRequest: VapiWebhooks['assistantRequest'] = {
	match: createVapiMessageMatch('assistant-request'),

	handler: async (ctx, request) => {
		const verification = verifyVapiWebhookSecret(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error ?? 'Unauthorized' };
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'vapi.webhook.assistant-request', {}, 'completed');
		return { success: true, data: event };
	},
};

export const toolCalls: VapiWebhooks['toolCalls'] = {
	match: createVapiMessageMatch('tool-calls'),

	handler: async (ctx, request) => {
		const verification = verifyVapiWebhookSecret(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error ?? 'Unauthorized' };
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'vapi.webhook.tool-calls', {}, 'completed');
		return { success: true, data: event };
	},
};

export const transferDestinationRequest: VapiWebhooks['transferDestinationRequest'] = {
	match: createVapiMessageMatch('transfer-destination-request'),

	handler: async (ctx, request) => {
		const verification = verifyVapiWebhookSecret(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error ?? 'Unauthorized' };
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'vapi.webhook.transfer-destination-request', {}, 'completed');
		return { success: true, data: event };
	},
};

export const endOfCallReport: VapiWebhooks['endOfCallReport'] = {
	match: createVapiMessageMatch('end-of-call-report'),

	handler: async (ctx, request) => {
		const verification = verifyVapiWebhookSecret(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error ?? 'Unauthorized' };
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'vapi.webhook.end-of-call-report', {}, 'completed');
		return { success: true, data: event };
	},
};

export const statusUpdate: VapiWebhooks['statusUpdate'] = {
	match: createVapiMessageMatch('status-update'),

	handler: async (ctx, request) => {
		const verification = verifyVapiWebhookSecret(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error ?? 'Unauthorized' };
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'vapi.webhook.status-update', {}, 'completed');
		return { success: true, data: event };
	},
};
