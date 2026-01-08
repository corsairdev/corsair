import type {
	BasePluginConfig,
	BasePluginContext,
	BasePluginResponse,
	BaseDatabaseContext,
} from '../base';
import type { HubSpotSchemaOverride, ResolvedHubSpotSchema } from './schema';

export type HubSpotPlugin = BasePluginConfig<HubSpotSchemaOverride> & {
	/**
	 * HubSpot API access token
	 */
	accessToken: string;
};

// Response types for Contacts
export type GetContactResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

export type GetManyContactsResponse = BasePluginResponse<{
	results: Array<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;
	paging?: {
		next?: { after: string };
		prev?: { before: string };
	};
}>;

export type CreateOrUpdateContactResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

// Response types for Companies
export type GetCompanyResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

export type GetManyCompaniesResponse = BasePluginResponse<{
	results: Array<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;
	paging?: {
		next?: { after: string };
		prev?: { before: string };
	};
}>;

export type CreateCompanyResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

export type UpdateCompanyResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

// Response types for Deals
export type GetDealResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

export type GetManyDealsResponse = BasePluginResponse<{
	results: Array<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;
	paging?: {
		next?: { after: string };
		prev?: { before: string };
	};
}>;

export type CreateDealResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

export type UpdateDealResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

// Response types for Tickets
export type GetTicketResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

export type GetManyTicketsResponse = BasePluginResponse<{
	results: Array<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;
	paging?: {
		next?: { after: string };
		prev?: { before: string };
	};
}>;

export type CreateTicketResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

export type UpdateTicketResponse = BasePluginResponse<{
	id: string;
	properties: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
}>;

// Response types for Engagements
export type GetEngagementResponse = BasePluginResponse<{
	id: string;
	engagement: Record<string, unknown>;
	associations?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}>;

export type GetManyEngagementsResponse = BasePluginResponse<{
	results: Array<{
		id: string;
		engagement: Record<string, unknown>;
		associations?: Record<string, unknown>;
		metadata?: Record<string, unknown>;
	}>;
	paging?: {
		next?: { after: string };
	};
}>;

export type CreateEngagementResponse = BasePluginResponse<{
	id: string;
	engagement: Record<string, unknown>;
	associations?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}>;

/**
 * Database context type for plugin operations
 */
export type HubSpotDatabaseContext<
	TSchemaOverride extends HubSpotSchemaOverride = HubSpotSchemaOverride,
> = BaseDatabaseContext<ResolvedHubSpotSchema<TSchemaOverride>>;

/**
 * Plugin operation context
 */
export type HubSpotPluginContext<
	TSchemaOverride extends HubSpotSchemaOverride = HubSpotSchemaOverride,
> = BasePluginContext<ResolvedHubSpotSchema<TSchemaOverride>>;

/**
 * HubSpotClient type for operations
 */
export type { HubSpotClient } from './client';

export type { HubSpotSchemaOverride } from './schema';

