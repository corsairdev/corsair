import type { HubSpotWebhooks } from '..';
import type {
	TicketCreatedEventType,
	TicketDeletedEventType,
	TicketUpdatedEventType,
} from './types';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

function createHubSpotMatch(subscriptionType: string) {
	return (request: import('../../../core/webhooks').RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as
			| Record<string, unknown>
			| Array<Record<string, unknown>>;
		const events = Array.isArray(parsedBody) ? parsedBody : [parsedBody];
		return events.some(
			(event) => (event.subscriptionType as string) === subscriptionType,
		);
	};
}

export const ticketCreated: HubSpotWebhooks['ticketCreated'] = {
	match: createHubSpotMatch('ticket.creation'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| TicketCreatedEventType
			| Array<TicketCreatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

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
	match: createHubSpotMatch('ticket.propertyChange'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| TicketUpdatedEventType
			| Array<TicketUpdatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

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
	match: createHubSpotMatch('ticket.deletion'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| TicketDeletedEventType
			| Array<TicketDeletedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

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
