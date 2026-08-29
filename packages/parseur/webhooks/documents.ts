import { logEventFromContext } from 'corsair/core';
import type { ParseurWebhooks } from '../index';
import {
	createParseurMatch,
	DocumentProcessedEventSchema,
	ProcessFailedEventSchema,
	TableItemProcessedEventSchema,
	verifyParseurWebhookSignature,
} from './types';

export const documentProcessed: ParseurWebhooks['documentProcessed'] = {
	match: createParseurMatch('document.processed'),

	handler: async (ctx, request) => {
		const verification = verifyParseurWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = DocumentProcessedEventSchema.parse(request.payload);

		await logEventFromContext(
			ctx,
			'parseur.webhook.documentProcessed',
			{ event: event.event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const tableItemProcessed: ParseurWebhooks['tableItemProcessed'] = {
	match: createParseurMatch('table_item.processed'),

	handler: async (ctx, request) => {
		const verification = verifyParseurWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = TableItemProcessedEventSchema.parse(request.payload);

		await logEventFromContext(
			ctx,
			'parseur.webhook.tableItemProcessed',
			{ event: event.event },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const processFailed: ParseurWebhooks['processFailed'] = {
	match: createParseurMatch('process.failed'),

	handler: async (ctx, request) => {
		const verification = verifyParseurWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = ProcessFailedEventSchema.parse(request.payload);

		await logEventFromContext(
			ctx,
			'parseur.webhook.processFailed',
			{ event: event.event, error: event.error },
			'failed',
		);

		return { success: true, data: event };
	},
};
