import type { HubSpotWebhooks } from '..';
import type {
	CompanyCreatedEventType,
	CompanyDeletedEventType,
	CompanyUpdatedEventType,
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

export const companyCreated: HubSpotWebhooks['companyCreated'] = {
	match: createHubSpotMatch('company.creation'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| CompanyCreatedEventType
			| Array<CompanyCreatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

		for (const event of events) {
			if (event.subscriptionType !== 'company.creation') continue;

			console.log('🏢 HubSpot Company Created:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.companies && event.objectId) {
				try {
					await ctx.db.companies.upsert(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {},
						createdAt: new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to save company to database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const companyUpdated: HubSpotWebhooks['companyUpdated'] = {
	match: createHubSpotMatch('company.propertyChange'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| CompanyUpdatedEventType
			| Array<CompanyUpdatedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

		for (const event of events) {
			if (event.subscriptionType !== 'company.propertyChange') continue;

			console.log('📝 HubSpot Company Updated:', {
				objectId: event.objectId,
				propertyName: event.propertyName,
				propertyValue: event.propertyValue,
			});

			if (ctx.db.companies && event.objectId) {
				try {
					const existing = await ctx.db.companies.findByEntityId(
						event.objectId.toString(),
					);
					await ctx.db.companies.upsert(event.objectId.toString(), {
						id: event.objectId.toString(),
						properties: {
							...(existing?.data?.properties || {}),
							[event.propertyName || '']: event.propertyValue,
						},
						createdAt: existing?.data?.createdAt || new Date(event.occurredAt),
						updatedAt: new Date(event.occurredAt),
					});
				} catch (error) {
					console.warn('Failed to update company in database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};

export const companyDeleted: HubSpotWebhooks['companyDeleted'] = {
	match: createHubSpotMatch('company.deletion'),

	handler: async (ctx, request) => {
		const payload = request.payload as
			| CompanyDeletedEventType
			| Array<CompanyDeletedEventType>;
		const events = Array.isArray(payload) ? payload : [payload];

		for (const event of events) {
			if (event.subscriptionType !== 'company.deletion') continue;

			console.log('🗑️ HubSpot Company Deleted:', {
				objectId: event.objectId,
				portalId: event.portalId,
			});

			if (ctx.db.companies && event.objectId) {
				try {
					await ctx.db.companies.deleteByEntityId(event.objectId.toString());
				} catch (error) {
					console.warn('Failed to delete company from database:', error);
				}
			}
		}

		return {
			success: true,
			data: { success: true },
		};
	},
};
