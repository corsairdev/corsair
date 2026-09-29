import { logEventFromContext } from 'corsair/core';
import type {
	CloudcartContext,
	CloudcartWebhooks as PluginWebhooks,
} from '../index';
import { createCloudcartMatch, verifyCloudcartWebhookSignature } from './types';

function webhookSecret(ctx: CloudcartContext): string | undefined {
	return ctx.options?.webhookSecret;
}

function eventId(event: { id?: unknown }): string {
	return typeof event.id === 'string' || typeof event.id === 'number'
		? String(event.id)
		: '';
}

export const orderCreated: PluginWebhooks['orderCreated'] = {
	match: createCloudcartMatch('order.created'),
	handler: async (ctx, request) => {
		const verification = verifyCloudcartWebhookSignature(
			request,
			webhookSecret(ctx),
		);
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
			'cloudcart.webhook.orderCreated',
			{ type: 'order.created', id: eventId(event) },
			'completed',
		);
		return { success: true, data: event };
	},
};

export const productCreated: PluginWebhooks['productCreated'] = {
	match: createCloudcartMatch('product.created'),
	handler: async (ctx, request) => {
		const verification = verifyCloudcartWebhookSignature(
			request,
			webhookSecret(ctx),
		);
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
			'cloudcart.webhook.productCreated',
			{ type: 'product.created', id: eventId(event) },
			'completed',
		);
		return { success: true, data: event };
	},
};

export const customerCreated: PluginWebhooks['customerCreated'] = {
	match: createCloudcartMatch('customer.created'),
	handler: async (ctx, request) => {
		const verification = verifyCloudcartWebhookSignature(
			request,
			webhookSecret(ctx),
		);
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
			'cloudcart.webhook.customerCreated',
			{ type: 'customer.created', id: eventId(event) },
			'completed',
		);
		return { success: true, data: event };
	},
};

export const CloudcartWebhooks = {
	orderCreated,
	productCreated,
	customerCreated,
};

export * from './tenant-matcher';
export * from './types';
