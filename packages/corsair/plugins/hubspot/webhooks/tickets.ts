import type { HubSpotWebhooks } from '..';
import {
	createHubSpotEventMatch,
	verifyHubSpotWebhookSignature,
} from './types';

export const ticketCreated: HubSpotWebhooks['ticketCreated'] = {
	match: createHubSpotEventMatch('ticket.creation'),

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
			if (event.subscriptionType !== 'ticket.creation') continue;

			console.log('🎫 HubSpot Ticket Created:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.tickets && event.objectId) {
				try {
					await ctx.db.tickets.upsertByEntityId(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {},
						createdAt: new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to save ticket to database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const ticketUpdated: HubSpotWebhooks['ticketUpdated'] = {
	match: createHubSpotEventMatch('ticket.propertyChange'),

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
			if (event.subscriptionType !== 'ticket.propertyChange') continue;

			console.log('📝 HubSpot Ticket Updated:', {
				objectId: event.objectId,
				propertyName: event.propertyName,
				propertyValue: event.propertyValue,
			});

			if (ctx.db.tickets && event.objectId) {
				try {
					const existing = await ctx.db.tickets.findByEntityId(
						event.objectId.toString(),
					);
					await ctx.db.tickets.upsertByEntityId(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {
							...(existing?.data?.properties || {}),
							[event.propertyName || '']: event.propertyValue,
						},
						createdAt: existing?.data?.createdAt || new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to update ticket in database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const ticketDeleted: HubSpotWebhooks['ticketDeleted'] = {
	match: createHubSpotEventMatch('ticket.deletion'),

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
			if (event.subscriptionType !== 'ticket.deletion') continue;

			console.log('🗑️ HubSpot Ticket Deleted:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.tickets && event.objectId) {
				try {
					await ctx.db.tickets.deleteByEntityId(event.objectId.toString());
				} catch (error) {
					console.warn('Failed to delete ticket from database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};
