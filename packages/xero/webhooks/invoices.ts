import { logEventFromContext } from 'corsair/core';
import type { XeroWebhooks } from '../index';
import { createXeroEventMatch, verifyXeroWebhookSignature } from './types';

export const invoiceCreated: XeroWebhooks['invoiceCreated'] = {
	match: createXeroEventMatch('INVOICE', 'CREATE'),

	handler: async (ctx, request) => {
		const verification = verifyXeroWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'xero.webhook.invoice.created',
			{ count: event.events?.length ?? 0 },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const invoiceUpdated: XeroWebhooks['invoiceUpdated'] = {
	match: createXeroEventMatch('INVOICE', 'UPDATE'),

	handler: async (ctx, request) => {
		const verification = verifyXeroWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'xero.webhook.invoice.updated',
			{ count: event.events?.length ?? 0 },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const InvoiceWebhooks = {
	created: invoiceCreated,
	updated: invoiceUpdated,
};
