import { logEventFromContext } from 'corsair/core';
import type { StripeWebhooks } from '..';
import { createStripeEventMatch, verifyStripeWebhookSignature } from './types';

export const created: StripeWebhooks['customerCreated'] = {
	match: createStripeEventMatch('customer.created'),

	handler: async (ctx, request) => {
		const verification = verifyStripeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (ctx.db.customers) {
			try {
				const customer = event.data.object;
				await ctx.db.customers.upsertByEntityId(customer.id, {
					...customer,
					createdAt: customer.created
						? new Date(customer.created * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save customer (created) to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.customer.created',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.object.id,
			data: event,
		};
	},
};

export const deleted: StripeWebhooks['customerDeleted'] = {
	match: createStripeEventMatch('customer.deleted'),

	handler: async (ctx, request) => {
		const verification = verifyStripeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (ctx.db.customers) {
			try {
				await ctx.db.customers.deleteByEntityId(event.data.object.id);
			} catch (error) {
				console.warn('Failed to delete customer from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.customer.deleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.object.id,
			data: event,
		};
	},
};

export const updated: StripeWebhooks['customerUpdated'] = {
	match: createStripeEventMatch('customer.updated'),

	handler: async (ctx, request) => {
		const verification = verifyStripeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (ctx.db.customers) {
			try {
				const customer = event.data.object;
				await ctx.db.customers.upsertByEntityId(customer.id, {
					...customer,
					createdAt: customer.created
						? new Date(customer.created * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to update customer in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.customer.updated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.object.id,
			data: event,
		};
	},
};
