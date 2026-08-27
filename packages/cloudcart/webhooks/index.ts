import { logEventFromContext } from 'corsair/core';
import type { CloudcartWebhooks as PluginWebhooks } from '../index';
import { createCloudcartMatch, verifyCloudcartWebhookSignature } from './types';

export const orderCreated: PluginWebhooks['orderCreated'] = {
	match: createCloudcartMatch('order.created'),
	handler: async (ctx, request) => {
		const verification = verifyCloudcartWebhookSignature(
			request as any,
			ctx.key,
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
			{ ...event },
			'completed',
		);
		return { success: true, data: event };
	},
};

export const productCreated: PluginWebhooks['productCreated'] = {
	match: createCloudcartMatch('product.created'),
	handler: async (ctx, request) => {
		const verification = verifyCloudcartWebhookSignature(
			request as any,
			ctx.key,
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
			{ ...event },
			'completed',
		);
		return { success: true, data: event };
	},
};

export const customerCreated: PluginWebhooks['customerCreated'] = {
	match: createCloudcartMatch('customer.created'),
	handler: async (ctx, request) => {
		const verification = verifyCloudcartWebhookSignature(
			request as any,
			ctx.key,
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
			{ ...event },
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

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
