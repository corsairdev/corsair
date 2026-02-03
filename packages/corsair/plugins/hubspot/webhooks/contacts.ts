import type { HubSpotWebhooks } from '..';
import type {
	ContactCreatedEventType,
	ContactDeletedEventType,
	ContactUpdatedEventType,
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

export const contactCreated: HubSpotWebhooks['contactCreated'] = {
	match: createHubSpotMatch('contact.creation'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| ContactCreatedEventType
			| Array<ContactCreatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

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
	match: createHubSpotMatch('contact.propertyChange'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| ContactUpdatedEventType
			| Array<ContactUpdatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

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
	match: createHubSpotMatch('contact.deletion'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| ContactDeletedEventType
			| Array<ContactDeletedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

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
