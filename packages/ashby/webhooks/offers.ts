import { logEventFromContext } from 'corsair/core';
import type { AshbyWebhooks } from '../index';
import { createAshbyMatch, verifyAshbyWebhookSignature } from './types';

export const create: AshbyWebhooks['offer.create'] = {
	match: createAshbyMatch('offerCreate'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAshbyWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.action !== 'offerCreate') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';
		if (ctx.db.offers && event.data.offerId) {
			try {
				const entity = await ctx.db.offers.findById(event.data.offerId);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to find offer in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.offerCreate',
			{
				offerId: event.data.offerId,
				applicationId: event.data.applicationId,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const update: AshbyWebhooks['offer.update'] = {
	match: createAshbyMatch('offerUpdate'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAshbyWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.action !== 'offerUpdate') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';
		if (ctx.db.offers && event.data.offerId) {
			try {
				const entity = await ctx.db.offers.findById(event.data.offerId);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to find offer in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.offerUpdate',
			{
				offerId: event.data.offerId,
				applicationId: event.data.applicationId,
				status: event.data.status,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const remove: AshbyWebhooks['offer.delete'] = {
	match: createAshbyMatch('offerDelete'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAshbyWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.action !== 'offerDelete') {
			return {
				success: true,
				data: undefined,
			};
		}

		if (ctx.db.offers && event.data.offerId) {
			try {
				await ctx.db.offers.deleteById(event.data.offerId);
			} catch (error) {
				console.warn('Failed to delete offer from database:', error);
				return {
					success: false,
					statusCode: 500,
					error: 'Failed to delete offer from cache',
				};
			}
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.offerDelete',
			{
				offerId: event.data.offerId,
				applicationId: event.data.applicationId,
			},
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
