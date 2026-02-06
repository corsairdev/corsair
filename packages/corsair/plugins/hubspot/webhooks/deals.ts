import type { HubSpotWebhooks } from '..';
import {
	createHubSpotEventMatch,
	verifyHubSpotWebhookSignature,
} from './types';
import type {
	DealCreatedEventType,
	DealDeletedEventType,
	DealUpdatedEventType,
} from './types';

export const dealCreated: HubSpotWebhooks['dealCreated'] = {
	match: createHubSpotEventMatch('deal.creation'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyHubSpotWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload as
			| DealCreatedEventType
			| Array<DealCreatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

		for (const event of events) {
			if (event.subscriptionType !== 'deal.creation') continue;

			console.log('💼 HubSpot Deal Created:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.deals && event.objectId) {
				try {
					await ctx.db.deals.upsertByEntityId(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {},
						createdAt: new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to save deal to database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const dealUpdated: HubSpotWebhooks['dealUpdated'] = {
	match: createHubSpotEventMatch('deal.propertyChange'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyHubSpotWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload as
			| DealUpdatedEventType
			| Array<DealUpdatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

		for (const event of events) {
			if (event.subscriptionType !== 'deal.propertyChange') continue;

			console.log('📝 HubSpot Deal Updated:', {
				objectId: event.objectId,
				propertyName: event.propertyName,
				propertyValue: event.propertyValue,
			});

			if (ctx.db.deals && event.objectId) {
				try {
					const existing = await ctx.db.deals.findByEntityId(
						event.objectId.toString(),
					);
					await ctx.db.deals.upsertByEntityId(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {
							...(existing?.data?.properties || {}),
							[event.propertyName || '']: event.propertyValue,
						},
						createdAt: existing?.data?.createdAt || new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to update deal in database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const dealDeleted: HubSpotWebhooks['dealDeleted'] = {
	match: createHubSpotEventMatch('deal.deletion'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyHubSpotWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload as
			| DealDeletedEventType
			| Array<DealDeletedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

		for (const event of events) {
			if (event.subscriptionType !== 'deal.deletion') continue;

			console.log('🗑️ HubSpot Deal Deleted:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.deals && event.objectId) {
				try {
					await ctx.db.deals.deleteByEntityId(event.objectId.toString());
				} catch (error) {
					console.warn('Failed to delete deal from database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};
