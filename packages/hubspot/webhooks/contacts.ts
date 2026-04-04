import type { HubSpotWebhooks } from '..';
import {
	createHubSpotEventMatch,
	verifyHubSpotWebhookSignature,
} from './types';

export const contactCreated: HubSpotWebhooks['contactCreated'] = {
	match: createHubSpotEventMatch('contact.creation'),

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

		const events = Array.isArray(request.payload)
			? request.payload
			: [request.payload];

		for (const event of events) {
			if (event.subscriptionType !== 'contact.creation') continue;

			console.log('👤 HubSpot Contact Created:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.contacts && event.objectId) {
				try {
					await ctx.db.contacts.upsertByEntityId(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {},
						createdAt: new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to save contact to database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const contactUpdated: HubSpotWebhooks['contactUpdated'] = {
	match: createHubSpotEventMatch('contact.propertyChange'),

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

		const events = Array.isArray(request.payload)
			? request.payload
			: [request.payload];

		for (const event of events) {
			if (event.subscriptionType !== 'contact.propertyChange') continue;

			console.log('📝 HubSpot Contact Updated:', {
				objectId: event.objectId,
				propertyName: event.propertyName,
				propertyValue: event.propertyValue,
			});

			if (ctx.db.contacts && event.objectId) {
				try {
					const existing = await ctx.db.contacts.findByEntityId(
						event.objectId.toString(),
					);
					await ctx.db.contacts.upsertByEntityId(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {
							...(existing?.data?.properties || {}),
							[event.propertyName || '']: event.propertyValue,
						},
						createdAt: existing?.data?.createdAt || new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to update contact in database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const contactDeleted: HubSpotWebhooks['contactDeleted'] = {
	match: createHubSpotEventMatch('contact.deletion'),

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

		const events = Array.isArray(request.payload)
			? request.payload
			: [request.payload];

		for (const event of events) {
			if (event.subscriptionType !== 'contact.deletion') continue;

			console.log('🗑️ HubSpot Contact Deleted:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.contacts && event.objectId) {
				try {
					await ctx.db.contacts.deleteByEntityId(event.objectId.toString());
				} catch (error) {
					console.warn('Failed to delete contact from database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};
