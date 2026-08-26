import { logEventFromContext } from 'corsair/core';
import type { PDFMonkeyWebhooks } from '../index';
import {
	createPDFMonkeyMatch,
	DocumentGenerationFailureEventSchema,
	DocumentGenerationSuccessEventSchema,
	verifyPDFMonkeyWebhookSignature,
} from './types';

export const generationSuccess: PDFMonkeyWebhooks['generationSuccess'] = {
	match: createPDFMonkeyMatch('success'),

	handler: async (ctx, request) => {
		const verification = verifyPDFMonkeyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = DocumentGenerationSuccessEventSchema.parse(request.payload);

		await logEventFromContext(
			ctx,
			'pdfmonkey.webhook.generationSuccess',
			{ id: event.document.id, status: event.document.status },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const generationFailure: PDFMonkeyWebhooks['generationFailure'] = {
	match: createPDFMonkeyMatch('failure'),

	handler: async (ctx, request) => {
		const verification = verifyPDFMonkeyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = DocumentGenerationFailureEventSchema.parse(request.payload);

		await logEventFromContext(
			ctx,
			'pdfmonkey.webhook.generationFailure',
			{ id: event.document.id, status: event.document.status },
			'completed',
		);

		return { success: true, data: event };
	},
};
