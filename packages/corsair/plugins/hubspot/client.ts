/**
 * HTTP client for HubSpot API
 * Uses native fetch - no external dependencies
 */

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

class HubSpotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HubSpotAPIError';
	}
}

async function makeRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: string;
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	let url = `${HUBSPOT_API_BASE}${endpoint}`;
	if (query && Object.keys(query).length > 0) {
		const searchParams = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => {
			if (value !== undefined) {
				searchParams.append(key, String(value));
			}
		});
		url += `?${searchParams.toString()}`;
	}

	const headers: Record<string, string> = {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};

	const response = await fetch(url, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new HubSpotAPIError(
			errorData.message || `HTTP error! status: ${response.status}`,
			errorData.code || `http_${response.status}`,
		);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}

export interface HubSpotClient {
	// Contacts
	getContact(params: {
		contactId: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
		idProperty?: string;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	getManyContacts(params?: {
		limit?: number;
		after?: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
	}): Promise<{
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

	createOrUpdateContact(params: {
		properties?: Record<string, unknown>;
		associations?: Array<{
			to: { id: string };
			types: Array<{
				associationCategory: string;
				associationTypeId: number;
			}>;
		}>;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	deleteContact(params: { contactId: string }): Promise<void>;

	searchContacts(params: {
		query?: string;
		limit?: number;
		after?: string;
		sorts?: string[];
		properties?: string[];
		filterGroups?: unknown[];
	}): Promise<{
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

	// Companies
	getCompany(params: {
		companyId: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
		idProperty?: string;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	getManyCompanies(params?: {
		limit?: number;
		after?: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
	}): Promise<{
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

	createCompany(params: {
		properties?: Record<string, unknown>;
		associations?: Array<{
			to: { id: string };
			types: Array<{
				associationCategory: string;
				associationTypeId: number;
			}>;
		}>;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	updateCompany(params: {
		companyId: string;
		properties?: Record<string, unknown>;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	deleteCompany(params: { companyId: string }): Promise<void>;

	searchCompanyByDomain(params: {
		domain: string;
		properties?: string[];
	}): Promise<{
		results: Array<{
			id: string;
			properties: Record<string, unknown>;
			createdAt: string;
			updatedAt: string;
			archived?: boolean;
		}>;
	}>;

	// Deals
	getDeal(params: {
		dealId: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
		idProperty?: string;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	getManyDeals(params?: {
		limit?: number;
		after?: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
	}): Promise<{
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

	createDeal(params: {
		properties?: Record<string, unknown>;
		associations?: Array<{
			to: { id: string };
			types: Array<{
				associationCategory: string;
				associationTypeId: number;
			}>;
		}>;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	updateDeal(params: {
		dealId: string;
		properties?: Record<string, unknown>;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	deleteDeal(params: { dealId: string }): Promise<void>;

	searchDeals(params: {
		query?: string;
		limit?: number;
		after?: string;
		sorts?: string[];
		properties?: string[];
		filterGroups?: unknown[];
	}): Promise<{
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

	// Tickets
	getTicket(params: {
		ticketId: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
		idProperty?: string;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	getManyTickets(params?: {
		limit?: number;
		after?: string;
		properties?: string[];
		propertiesWithHistory?: string[];
		associations?: string[];
		archived?: boolean;
	}): Promise<{
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

	createTicket(params: {
		properties?: Record<string, unknown>;
		associations?: Array<{
			to: { id: string };
			types: Array<{
				associationCategory: string;
				associationTypeId: number;
			}>;
		}>;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	updateTicket(params: {
		ticketId: string;
		properties?: Record<string, unknown>;
	}): Promise<{
		id: string;
		properties: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
		archived?: boolean;
	}>;

	deleteTicket(params: { ticketId: string }): Promise<void>;

	// Engagements
	getEngagement(params: { engagementId: string }): Promise<{
		id: string;
		engagement: Record<string, unknown>;
		associations?: Record<string, unknown>;
		metadata?: Record<string, unknown>;
	}>;

	getManyEngagements(params?: {
		limit?: number;
		after?: string;
	}): Promise<{
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

	createEngagement(params: {
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
	}): Promise<{
		id: string;
		engagement: Record<string, unknown>;
		associations?: Record<string, unknown>;
		metadata?: Record<string, unknown>;
	}>;

	deleteEngagement(params: { engagementId: string }): Promise<void>;
}

export function createHubSpotClient(accessToken: string): HubSpotClient {
	return {
		// Contacts
		async getContact(params) {
			const { contactId, ...queryParams } = params;
			return makeRequest<ReturnType<HubSpotClient['getContact']>>(
				`/crm/v3/objects/contacts/${contactId}`,
				accessToken,
				{ query: queryParams as Record<string, string> },
			);
		},

		async getManyContacts(params) {
			return makeRequest<ReturnType<HubSpotClient['getManyContacts']>>(
				'/crm/v3/objects/contacts',
				accessToken,
				{ query: params as Record<string, string> },
			);
		},

		async createOrUpdateContact(params) {
			return makeRequest<ReturnType<HubSpotClient['createOrUpdateContact']>>(
				'/crm/v3/objects/contacts',
				accessToken,
				{
					method: 'POST',
					body: params,
				},
			);
		},

		async deleteContact(params) {
			return makeRequest<void>(
				`/crm/v3/objects/contacts/${params.contactId}`,
				accessToken,
				{ method: 'DELETE' },
			);
		},

		async searchContacts(params) {
			const { ...body } = params;
			return makeRequest<ReturnType<HubSpotClient['searchContacts']>>(
				'/crm/v3/objects/contacts/search',
				accessToken,
				{
					method: 'POST',
					body,
				},
			);
		},

		// Companies
		async getCompany(params) {
			const { companyId, ...queryParams } = params;
			return makeRequest<ReturnType<HubSpotClient['getCompany']>>(
				`/crm/v3/objects/companies/${companyId}`,
				accessToken,
				{ query: queryParams as Record<string, string> },
			);
		},

		async getManyCompanies(params) {
			return makeRequest<ReturnType<HubSpotClient['getManyCompanies']>>(
				'/crm/v3/objects/companies',
				accessToken,
				{ query: params as Record<string, string> },
			);
		},

		async createCompany(params) {
			return makeRequest<ReturnType<HubSpotClient['createCompany']>>(
				'/crm/v3/objects/companies',
				accessToken,
				{
					method: 'POST',
					body: params,
				},
			);
		},

		async updateCompany(params) {
			const { companyId, ...body } = params;
			return makeRequest<ReturnType<HubSpotClient['updateCompany']>>(
				`/crm/v3/objects/companies/${companyId}`,
				accessToken,
				{
					method: 'PATCH',
					body,
				},
			);
		},

		async deleteCompany(params) {
			return makeRequest<void>(
				`/crm/v3/objects/companies/${params.companyId}`,
				accessToken,
				{ method: 'DELETE' },
			);
		},

		async searchCompanyByDomain(params) {
			const { domain, ...queryParams } = params;
			return makeRequest<ReturnType<HubSpotClient['searchCompanyByDomain']>>(
				'/crm/v3/objects/companies/search',
				accessToken,
				{
					query: { ...queryParams, domain } as Record<string, string>,
				},
			);
		},

		// Deals
		async getDeal(params) {
			const { dealId, ...queryParams } = params;
			return makeRequest<ReturnType<HubSpotClient['getDeal']>>(
				`/crm/v3/objects/deals/${dealId}`,
				accessToken,
				{ query: queryParams as Record<string, string> },
			);
		},

		async getManyDeals(params) {
			return makeRequest<ReturnType<HubSpotClient['getManyDeals']>>(
				'/crm/v3/objects/deals',
				accessToken,
				{ query: params as Record<string, string> },
			);
		},

		async createDeal(params) {
			return makeRequest<ReturnType<HubSpotClient['createDeal']>>(
				'/crm/v3/objects/deals',
				accessToken,
				{
					method: 'POST',
					body: params,
				},
			);
		},

		async updateDeal(params) {
			const { dealId, ...body } = params;
			return makeRequest<ReturnType<HubSpotClient['updateDeal']>>(
				`/crm/v3/objects/deals/${dealId}`,
				accessToken,
				{
					method: 'PATCH',
					body,
				},
			);
		},

		async deleteDeal(params) {
			return makeRequest<void>(
				`/crm/v3/objects/deals/${params.dealId}`,
				accessToken,
				{ method: 'DELETE' },
			);
		},

		async searchDeals(params) {
			const { ...body } = params;
			return makeRequest<ReturnType<HubSpotClient['searchDeals']>>(
				'/crm/v3/objects/deals/search',
				accessToken,
				{
					method: 'POST',
					body,
				},
			);
		},

		// Tickets
		async getTicket(params) {
			const { ticketId, ...queryParams } = params;
			return makeRequest<ReturnType<HubSpotClient['getTicket']>>(
				`/crm/v3/objects/tickets/${ticketId}`,
				accessToken,
				{ query: queryParams as Record<string, string> },
			);
		},

		async getManyTickets(params) {
			return makeRequest<ReturnType<HubSpotClient['getManyTickets']>>(
				'/crm/v3/objects/tickets',
				accessToken,
				{ query: params as Record<string, string> },
			);
		},

		async createTicket(params) {
			return makeRequest<ReturnType<HubSpotClient['createTicket']>>(
				'/crm/v3/objects/tickets',
				accessToken,
				{
					method: 'POST',
					body: params,
				},
			);
		},

		async updateTicket(params) {
			const { ticketId, ...body } = params;
			return makeRequest<ReturnType<HubSpotClient['updateTicket']>>(
				`/crm/v3/objects/tickets/${ticketId}`,
				accessToken,
				{
					method: 'PATCH',
					body,
				},
			);
		},

		async deleteTicket(params) {
			return makeRequest<void>(
				`/crm/v3/objects/tickets/${params.ticketId}`,
				accessToken,
				{ method: 'DELETE' },
			);
		},

		// Engagements
		async getEngagement(params) {
			return makeRequest<ReturnType<HubSpotClient['getEngagement']>>(
				`/crm/v3/objects/engagements/${params.engagementId}`,
				accessToken,
			);
		},

		async getManyEngagements(params) {
			return makeRequest<ReturnType<HubSpotClient['getManyEngagements']>>(
				'/crm/v3/objects/engagements',
				accessToken,
				{ query: params as Record<string, string> },
			);
		},

		async createEngagement(params) {
			return makeRequest<ReturnType<HubSpotClient['createEngagement']>>(
				'/crm/v3/objects/engagements',
				accessToken,
				{
					method: 'POST',
					body: params,
				},
			);
		},

		async deleteEngagement(params) {
			return makeRequest<void>(
				`/crm/v3/objects/engagements/${params.engagementId}`,
				accessToken,
				{ method: 'DELETE' },
			);
		},
	};
}

export { HubSpotAPIError };

