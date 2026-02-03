import type { HubSpotWebhooks } from '..';
import type {
	DealCreatedEventType,
	DealDeletedEventType,
	DealUpdatedEventType,
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

export const dealCreated: HubSpotWebhooks['dealCreated'] = {
	match: createHubSpotMatch('deal.creation'),

	handler: async (ctx, request) => {
		const payload = request.payload as DealCreatedEventType | Array<DealCreatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

		for (const event of events) {
			if (event.subscriptionType !== 'deal.creation') continue;

			console.log('💼 HubSpot Deal Created:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.deals && event.objectId) {
				try {
					await ctx.db.deals.upsert(event.objectId.toString(), {
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
	match: createHubSpotMatch('deal.propertyChange'),

	handler: async (ctx, request) => {
		const payload = request.payload as DealUpdatedEventType | Array<DealUpdatedEventType>;
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
					await ctx.db.deals.upsert(event.objectId.toString(), {
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
	match: createHubSpotMatch('deal.deletion'),

	handler: async (ctx, request) => {
		const payload = request.payload as DealDeletedEventType | Array<DealDeletedEventType>;
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
