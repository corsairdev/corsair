import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	RawWebhookRequest,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { HubSpotEndpointOutputs } from './endpoints';
import {
	CompaniesEndpoints,
	ContactListsEndpoints,
	ContactsEndpoints,
	DealsEndpoints,
	EngagementsEndpoints,
	TicketsEndpoints,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import type { HubSpotCredentials } from './schema';
import { HubSpotSchema } from './schema';
import type {
	CompanyCreatedEventType,
	CompanyDeletedEventType,
	CompanyUpdatedEventType,
	ContactCreatedEventType,
	ContactDeletedEventType,
	ContactUpdatedEventType,
	DealCreatedEventType,
	DealDeletedEventType,
	DealUpdatedEventType,
	HubSpotWebhookOutputs,
	HubSpotWebhookPayload,
	HubSpotWebhookPayloadType,
	TicketCreatedEventType,
	TicketDeletedEventType,
	TicketUpdatedEventType,
} from './webhooks';
import {
	CompanyWebhooks,
	ContactWebhooks,
	DealWebhooks,
	TicketWebhooks,
} from './webhooks';

export type HubSpotContext = CorsairPluginContext<
	typeof HubSpotSchema,
	HubSpotPluginOptions
>;

export type HubSpotKeyBuilderContext = KeyBuilderContext<HubSpotPluginOptions>;

type HubSpotEndpoint<
	K extends keyof HubSpotEndpointOutputs,
	Input,
> = CorsairEndpoint<HubSpotContext, Input, HubSpotEndpointOutputs[K]>;

export type HubSpotEndpoints = {
	contactsGet: HubSpotEndpoint<
		'contactsGet',
		{
			contactId: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
			idProperty?: string;
		}
	>;
	contactsGetMany: HubSpotEndpoint<
		'contactsGetMany',
		{
			limit?: number;
			after?: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
		}
	>;
	contactsCreateOrUpdate: HubSpotEndpoint<
		'contactsCreateOrUpdate',
		{
			properties?: Record<string, any>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}
	>;
	contactsDelete: HubSpotEndpoint<
		'contactsDelete',
		{
			contactId: string;
		}
	>;
	contactsGetRecentlyCreated: HubSpotEndpoint<
		'contactsGetRecentlyCreated',
		{
			count?: number;
			after?: string;
			since?: string;
		}
	>;
	contactsGetRecentlyUpdated: HubSpotEndpoint<
		'contactsGetRecentlyUpdated',
		{
			count?: number;
			after?: string;
			since?: string;
		}
	>;
	contactsSearch: HubSpotEndpoint<
		'contactsSearch',
		{
			query?: string;
			limit?: number;
			after?: string;
			sorts?: Array<string>;
			properties?: Array<string>;
			filterGroups?: Array<any>;
		}
	>;
	companiesGet: HubSpotEndpoint<
		'companiesGet',
		{
			companyId: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
			idProperty?: string;
		}
	>;
	companiesGetMany: HubSpotEndpoint<
		'companiesGetMany',
		{
			limit?: number;
			after?: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
		}
	>;
	companiesCreate: HubSpotEndpoint<
		'companiesCreate',
		{
			properties?: Record<string, any>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}
	>;
	companiesUpdate: HubSpotEndpoint<
		'companiesUpdate',
		{
			companyId: string;
			properties?: Record<string, any>;
		}
	>;
	companiesDelete: HubSpotEndpoint<
		'companiesDelete',
		{
			companyId: string;
		}
	>;
	companiesGetRecentlyCreated: HubSpotEndpoint<
		'companiesGetRecentlyCreated',
		{
			count?: number;
			after?: string;
			since?: string;
		}
	>;
	companiesGetRecentlyUpdated: HubSpotEndpoint<
		'companiesGetRecentlyUpdated',
		{
			count?: number;
			after?: string;
			since?: string;
		}
	>;
	companiesSearchByDomain: HubSpotEndpoint<
		'companiesSearchByDomain',
		{
			domain: string;
			properties?: Array<string>;
		}
	>;
	dealsGet: HubSpotEndpoint<
		'dealsGet',
		{
			dealId: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
			idProperty?: string;
		}
	>;
	dealsGetMany: HubSpotEndpoint<
		'dealsGetMany',
		{
			limit?: number;
			after?: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
		}
	>;
	dealsCreate: HubSpotEndpoint<
		'dealsCreate',
		{
			properties?: Record<string, any>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}
	>;
	dealsUpdate: HubSpotEndpoint<
		'dealsUpdate',
		{
			dealId: string;
			properties?: Record<string, any>;
		}
	>;
	dealsDelete: HubSpotEndpoint<
		'dealsDelete',
		{
			dealId: string;
		}
	>;
	dealsGetRecentlyCreated: HubSpotEndpoint<
		'dealsGetRecentlyCreated',
		{
			count?: number;
			after?: string;
			since?: string;
		}
	>;
	dealsGetRecentlyUpdated: HubSpotEndpoint<
		'dealsGetRecentlyUpdated',
		{
			count?: number;
			after?: string;
			since?: string;
		}
	>;
	dealsSearch: HubSpotEndpoint<
		'dealsSearch',
		{
			query?: string;
			limit?: number;
			after?: string;
			sorts?: Array<string>;
			properties?: Array<string>;
			filterGroups?: Array<any>;
		}
	>;
	ticketsGet: HubSpotEndpoint<
		'ticketsGet',
		{
			ticketId: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
			idProperty?: string;
		}
	>;
	ticketsGetMany: HubSpotEndpoint<
		'ticketsGetMany',
		{
			limit?: number;
			after?: string;
			properties?: Array<string>;
			propertiesWithHistory?: Array<string>;
			associations?: Array<string>;
			archived?: boolean;
		}
	>;
	ticketsCreate: HubSpotEndpoint<
		'ticketsCreate',
		{
			properties?: Record<string, any>;
			associations?: Array<{
				to: { id: string };
				types: Array<{
					associationCategory: string;
					associationTypeId: number;
				}>;
			}>;
		}
	>;
	ticketsUpdate: HubSpotEndpoint<
		'ticketsUpdate',
		{
			ticketId: string;
			properties?: Record<string, any>;
		}
	>;
	ticketsDelete: HubSpotEndpoint<
		'ticketsDelete',
		{
			ticketId: string;
		}
	>;
	engagementsGet: HubSpotEndpoint<
		'engagementsGet',
		{
			engagementId: string;
		}
	>;
	engagementsGetMany: HubSpotEndpoint<
		'engagementsGetMany',
		{
			limit?: number;
			after?: string;
		}
	>;
	engagementsCreate: HubSpotEndpoint<
		'engagementsCreate',
		{
			engagement: {
				active?: boolean;
				type: string;
				timestamp?: number;
			};
			associations?: {
				contactIds?: Array<number>;
				companyIds?: Array<number>;
				dealIds?: Array<number>;
				ownerIds?: Array<number>;
			};
			metadata?: Record<string, any>;
		}
	>;
	engagementsDelete: HubSpotEndpoint<
		'engagementsDelete',
		{
			engagementId: string;
		}
	>;
	contactListsAddContact: HubSpotEndpoint<
		'contactListsAddContact',
		{
			listId: string;
			emails?: Array<string>;
			vids?: Array<number>;
		}
	>;
	contactListsRemoveContact: HubSpotEndpoint<
		'contactListsRemoveContact',
		{
			listId: string;
			emails?: Array<string>;
			vids?: Array<number>;
		}
	>;
};

export type HubSpotBoundEndpoints = BindEndpoints<
	typeof hubspotEndpointsNested
>;

type HubSpotWebhook<
	K extends keyof HubSpotWebhookOutputs,
	TEvent extends HubSpotWebhookPayload,
> = CorsairWebhook<
	HubSpotContext,
	HubSpotWebhookPayloadType<TEvent>,
	HubSpotWebhookOutputs[K]
>;

export type HubSpotWebhooks = {
	contactCreated: HubSpotWebhook<'contactCreated', ContactCreatedEventType>;
	contactUpdated: HubSpotWebhook<'contactUpdated', ContactUpdatedEventType>;
	contactDeleted: HubSpotWebhook<'contactDeleted', ContactDeletedEventType>;
	companyCreated: HubSpotWebhook<'companyCreated', CompanyCreatedEventType>;
	companyUpdated: HubSpotWebhook<'companyUpdated', CompanyUpdatedEventType>;
	companyDeleted: HubSpotWebhook<'companyDeleted', CompanyDeletedEventType>;
	dealCreated: HubSpotWebhook<'dealCreated', DealCreatedEventType>;
	dealUpdated: HubSpotWebhook<'dealUpdated', DealUpdatedEventType>;
	dealDeleted: HubSpotWebhook<'dealDeleted', DealDeletedEventType>;
	ticketCreated: HubSpotWebhook<'ticketCreated', TicketCreatedEventType>;
	ticketUpdated: HubSpotWebhook<'ticketUpdated', TicketUpdatedEventType>;
	ticketDeleted: HubSpotWebhook<'ticketDeleted', TicketDeletedEventType>;
};

export type HubSpotBoundWebhooks = BindWebhooks<HubSpotWebhooks>;

const hubspotEndpointsNested = {
	contacts: {
		get: ContactsEndpoints.get,
		getMany: ContactsEndpoints.getMany,
		createOrUpdate: ContactsEndpoints.createOrUpdate,
		delete: ContactsEndpoints.delete,
		getRecentlyCreated: ContactsEndpoints.getRecentlyCreated,
		getRecentlyUpdated: ContactsEndpoints.getRecentlyUpdated,
		search: ContactsEndpoints.search,
	},
	companies: {
		get: CompaniesEndpoints.get,
		getMany: CompaniesEndpoints.getMany,
		create: CompaniesEndpoints.create,
		update: CompaniesEndpoints.update,
		delete: CompaniesEndpoints.delete,
		getRecentlyCreated: CompaniesEndpoints.getRecentlyCreated,
		getRecentlyUpdated: CompaniesEndpoints.getRecentlyUpdated,
		searchByDomain: CompaniesEndpoints.searchByDomain,
	},
	deals: {
		get: DealsEndpoints.get,
		getMany: DealsEndpoints.getMany,
		create: DealsEndpoints.create,
		update: DealsEndpoints.update,
		delete: DealsEndpoints.delete,
		getRecentlyCreated: DealsEndpoints.getRecentlyCreated,
		getRecentlyUpdated: DealsEndpoints.getRecentlyUpdated,
		search: DealsEndpoints.search,
	},
	tickets: {
		get: TicketsEndpoints.get,
		getMany: TicketsEndpoints.getMany,
		create: TicketsEndpoints.create,
		update: TicketsEndpoints.update,
		delete: TicketsEndpoints.delete,
	},
	engagements: {
		get: EngagementsEndpoints.get,
		getMany: EngagementsEndpoints.getMany,
		create: EngagementsEndpoints.create,
		delete: EngagementsEndpoints.delete,
	},
	contactLists: {
		addContact: ContactListsEndpoints.addContact,
		removeContact: ContactListsEndpoints.removeContact,
	},
} as const;

const hubspotWebhooksNested = {
	contactCreated: ContactWebhooks.created,
	contactUpdated: ContactWebhooks.updated,
	contactDeleted: ContactWebhooks.deleted,
	companyCreated: CompanyWebhooks.created,
	companyUpdated: CompanyWebhooks.updated,
	companyDeleted: CompanyWebhooks.deleted,
	dealCreated: DealWebhooks.created,
	dealUpdated: DealWebhooks.updated,
	dealDeleted: DealWebhooks.deleted,
	ticketCreated: TicketWebhooks.created,
	ticketUpdated: TicketWebhooks.updated,
	ticketDeleted: TicketWebhooks.deleted,
} as const;

const defaultAuthType: AuthTypes = 'api_key';

export type HubSpotPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	credentials?: HubSpotCredentials;
	webhookSecret?: string;
	hooks?: InternalHubSpotPlugin['hooks'];
	webhookHooks?: InternalHubSpotPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type BaseHubSpotPlugin<PluginOptions extends HubSpotPluginOptions> =
	CorsairPlugin<
		'hubspot',
		typeof HubSpotSchema,
		typeof hubspotEndpointsNested,
		typeof hubspotWebhooksNested,
		PluginOptions,
		typeof defaultAuthType
	>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalHubSpotPlugin = BaseHubSpotPlugin<HubSpotPluginOptions>;

export type ExternalHubSpotPlugin<PluginOptions extends HubSpotPluginOptions> =
	BaseHubSpotPlugin<PluginOptions>;

export function hubspot<const PluginOptions extends HubSpotPluginOptions>(
	incomingOptions: HubSpotPluginOptions &
		PluginOptions = {} as HubSpotPluginOptions & PluginOptions,
): ExternalHubSpotPlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hubspot',
		schema: HubSpotSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: hubspotEndpointsNested,
		webhooks: hubspotWebhooksNested,
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const hasHubSpotSignature = 'x-hubspot-signature-v3' in headers;
			const body = request.body as
				| Record<string, unknown>
				| Array<Record<string, unknown>>;
			const events = Array.isArray(body) ? body : [body];
			const hasHubSpotPayload = events.some(
				(event) =>
					typeof event.subscriptionType === 'string' &&
					event.subscriptionType !== undefined,
			);
			return hasHubSpotSignature || hasHubSpotPayload;
		},
		errorHandlers: options.errorHandlers || errorHandlers,
		keyBuilder: async (ctx: HubSpotKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.getWebhookSignature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint') {
				if (ctx.authType === 'api_key') {
					const res = await ctx.keys.getApiKey();

					if (!res) {
						return '';
					}

					return res;
				} else if (ctx.authType === 'oauth_2') {
					const res = await ctx.keys.getAccessToken();

					if (!res) {
						return '';
					}

					return res;
				}
			}

			return '';
		},
	} satisfies InternalHubSpotPlugin;
}

export {
	createHubSpotEventMatch,
	verifyHubSpotWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CompanyCreatedEvent,
	CompanyCreatedEventType,
	CompanyDeletedEvent,
	CompanyDeletedEventType,
	CompanyUpdatedEvent,
	CompanyUpdatedEventType,
	ContactCreatedEvent,
	ContactCreatedEventType,
	ContactDeletedEvent,
	ContactDeletedEventType,
	ContactUpdatedEvent,
	ContactUpdatedEventType,
	DealCreatedEvent,
	DealCreatedEventType,
	DealDeletedEvent,
	DealDeletedEventType,
	DealUpdatedEvent,
	DealUpdatedEventType,
	HubSpotWebhookEventType,
	HubSpotWebhookOutputs,
	HubSpotWebhookPayload,
	HubSpotWebhookPayloadType,
	TicketCreatedEvent,
	TicketCreatedEventType,
	TicketDeletedEvent,
	TicketDeletedEventType,
	TicketUpdatedEvent,
	TicketUpdatedEventType,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AddContactToListResponse,
	CreateCompanyResponse,
	CreateDealResponse,
	CreateEngagementResponse,
	CreateOrUpdateContactResponse,
	CreateTicketResponse,
	GetCompanyResponse,
	GetContactResponse,
	GetDealResponse,
	GetEngagementResponse,
	GetManyCompaniesResponse,
	GetManyContactsResponse,
	GetManyDealsResponse,
	GetManyEngagementsResponse,
	GetManyTicketsResponse,
	GetTicketResponse,
	HubSpotEndpointOutputs,
	RemoveContactFromListResponse,
	SearchCompanyByDomainResponse,
	UpdateCompanyResponse,
	UpdateDealResponse,
	UpdateTicketResponse,
} from './endpoints/types';

// ─────────────────────────────────────────────────────────────────────────────
// Schema Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { HubSpotCredentials } from './schema';
