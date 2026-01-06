import { initializePlugin } from '../base';
import { createHubSpotClient } from './client';
import { createCompany } from './operations/create-company';
import { createDeal } from './operations/create-deal';
import { createOrUpdateContact } from './operations/create-or-update-contact';
import { getContact } from './operations/get-contact';
import { handleHubSpotWebhook } from './operations/handle-webhook';
import { hubspotDefaultSchema } from './schema';
import type {
	HubSpotDatabaseContext,
	HubSpotPlugin,
	HubSpotPluginContext,
	HubSpotSchemaOverride,
} from './types';

/**
 * Creates a HubSpot plugin instance with database access
 * Uses the unified initialization flow from base plugin system
 */
export function createHubSpotPlugin<
	TSchemaOverride extends HubSpotSchemaOverride = HubSpotSchemaOverride,
	TDatabase extends
		HubSpotDatabaseContext<TSchemaOverride> = HubSpotDatabaseContext<TSchemaOverride>,
>(config: HubSpotPlugin, db: unknown) {
	// Initialize plugin using unified flow
	const initResult = initializePlugin(
		config,
		hubspotDefaultSchema,
		db,
		(config) => createHubSpotClient(config.accessToken),
	);
	const { config: pluginConfig, client, ctx } = {
		...initResult,
		ctx: {
			...initResult.ctx,
			db: initResult.db as HubSpotDatabaseContext<TSchemaOverride>,
		},
	} as {
		config: HubSpotPlugin;
		client: ReturnType<typeof createHubSpotClient>;
		ctx: HubSpotPluginContext<TSchemaOverride>;
	};

	return {
		// Contacts
		getContact: async (params: {
			contactId: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
			idProperty?: string;
		}) => {
			return getContact({
				config: pluginConfig,
				client,
				contactId: params.contactId,
				properties: params.properties,
				propertiesWithHistory: params.propertiesWithHistory,
				associations: params.associations,
				archived: params.archived,
				idProperty: params.idProperty,
				ctx,
			});
		},

		getManyContacts: async (params?: {
			limit?: number;
			after?: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
		}) => {
			const result = await client.getManyContacts(params);
			return {
				success: true,
				data: result,
			};
		},

		createOrUpdateContact: async (params: {
			properties?: Record<string, unknown>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}) => {
			return createOrUpdateContact({
				config: pluginConfig,
				client,
				properties: params.properties,
				associations: params.associations,
				ctx,
			});
		},

		deleteContact: async (params: { contactId: string }) => {
			await client.deleteContact(params);
			return {
				success: true,
				data: {},
			};
		},

		searchContacts: async (params: {
			query?: string;
			limit?: number;
			after?: string;
			sorts?: string[];
			properties?: string[];
			filterGroups?: unknown[];
		}) => {
			const result = await client.searchContacts(params);
			return {
				success: true,
				data: result,
			};
		},

		// Companies
		getCompany: async (params: {
			companyId: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
			idProperty?: string;
		}) => {
			const result = await client.getCompany(params);
			return {
				success: true,
				data: result,
			};
		},

		getManyCompanies: async (params?: {
			limit?: number;
			after?: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
		}) => {
			const result = await client.getManyCompanies(params);
			return {
				success: true,
				data: result,
			};
		},

		createCompany: async (params: {
			properties?: Record<string, unknown>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}) => {
			return createCompany({
				config: pluginConfig,
				client,
				properties: params.properties,
				associations: params.associations,
				ctx,
			});
		},

		updateCompany: async (params: {
			companyId: string;
			properties?: Record<string, unknown>;
		}) => {
			const result = await client.updateCompany(params);
			return {
				success: true,
				data: result,
			};
		},

		deleteCompany: async (params: { companyId: string }) => {
			await client.deleteCompany(params);
			return {
				success: true,
				data: {},
			};
		},

		searchCompanyByDomain: async (params: {
			domain: string;
			properties?: string[];
		}) => {
			const result = await client.searchCompanyByDomain(params);
			return {
				success: true,
				data: result,
			};
		},

		// Deals
		getDeal: async (params: {
			dealId: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
			idProperty?: string;
		}) => {
			const result = await client.getDeal(params);
			return {
				success: true,
				data: result,
			};
		},

		getManyDeals: async (params?: {
			limit?: number;
			after?: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
		}) => {
			const result = await client.getManyDeals(params);
			return {
				success: true,
				data: result,
			};
		},

		createDeal: async (params: {
			properties?: Record<string, unknown>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}) => {
			return createDeal({
				config: pluginConfig,
				client,
				properties: params.properties,
				associations: params.associations,
				ctx,
			});
		},

		updateDeal: async (params: {
			dealId: string;
			properties?: Record<string, unknown>;
		}) => {
			const result = await client.updateDeal(params);
			return {
				success: true,
				data: result,
			};
		},

		deleteDeal: async (params: { dealId: string }) => {
			await client.deleteDeal(params);
			return {
				success: true,
				data: {},
			};
		},

		searchDeals: async (params: {
			query?: string;
			limit?: number;
			after?: string;
			sorts?: string[];
			properties?: string[];
			filterGroups?: unknown[];
		}) => {
			const result = await client.searchDeals(params);
			return {
				success: true,
				data: result,
			};
		},

		// Tickets
		getTicket: async (params: {
			ticketId: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
			idProperty?: string;
		}) => {
			const result = await client.getTicket(params);
			return {
				success: true,
				data: result,
			};
		},

		getManyTickets: async (params?: {
			limit?: number;
			after?: string;
			properties?: string[];
			propertiesWithHistory?: string[];
			associations?: string[];
			archived?: boolean;
		}) => {
			const result = await client.getManyTickets(params);
			return {
				success: true,
				data: result,
			};
		},

		createTicket: async (params: {
			properties?: Record<string, unknown>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}) => {
			const result = await client.createTicket(params);
			return {
				success: true,
				data: result,
			};
		},

		updateTicket: async (params: {
			ticketId: string;
			properties?: Record<string, unknown>;
		}) => {
			const result = await client.updateTicket(params);
			return {
				success: true,
				data: result,
			};
		},

		deleteTicket: async (params: { ticketId: string }) => {
			await client.deleteTicket(params);
			return {
				success: true,
				data: {},
			};
		},

		// Engagements
		getEngagement: async (params: { engagementId: string }) => {
			const result = await client.getEngagement(params);
			return {
				success: true,
				data: result,
			};
		},

		getManyEngagements: async (params?: {
			limit?: number;
			after?: string;
		}) => {
			const result = await client.getManyEngagements(params);
			return {
				success: true,
				data: result,
			};
		},

		createEngagement: async (params: {
			engagement: {
				active?: boolean;
				type: string;
				timestamp?: number;
			};
			associations?: {
				contactIds?: number[];
				companyIds?: number[];
				dealIds?: number[];
				ownerIds?: number[];
			};
			metadata?: Record<string, unknown>;
		}) => {
			const result = await client.createEngagement(params);
			return {
				success: true,
				data: result,
			};
		},

		deleteEngagement: async (params: { engagementId: string }) => {
			await client.deleteEngagement(params);
			return {
				success: true,
				data: {},
			};
		},

		handleWebhook: async (params: {
			headers: Record<string, string | undefined>;
			payload: string | object | object[];
			secret?: string;
		}): Promise<ReturnType<typeof handleHubSpotWebhook>> => {
			return handleHubSpotWebhook({
				config: pluginConfig,
				client,
				ctx,
				headers: params.headers,
				payload: params.payload,
				secret: params.secret,
			});
		},
	};
}

export type { HubSpotPlugin, HubSpotSchemaOverride, HubSpotPluginContext };

