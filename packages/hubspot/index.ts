import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { z } from 'zod';
import type {
	HubSpotEndpointInputs,
	HubSpotEndpointOutputs,
} from './endpoints';
import {
	CompaniesEndpoints,
	ContactListsEndpoints,
	ContactsEndpoints,
	DealsEndpoints,
	EngagementsEndpoints,
	TicketsEndpoints,
} from './endpoints';
import {
	HubSpotEndpointInputSchemas,
	HubSpotEndpointOutputSchemas,
} from './endpoints/types';
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
import {
	CompanyCreatedEventSchema,
	CompanyDeletedEventSchema,
	CompanyUpdatedEventSchema,
	ContactCreatedEventSchema,
	ContactDeletedEventSchema,
	ContactUpdatedEventSchema,
	DealCreatedEventSchema,
	DealDeletedEventSchema,
	DealUpdatedEventSchema,
	TicketCreatedEventSchema,
	TicketDeletedEventSchema,
	TicketUpdatedEventSchema,
} from './webhooks/types';

export type HubSpotContext = CorsairPluginContext<
	typeof HubSpotSchema,
	HubSpotPluginOptions
>;

export type HubSpotKeyBuilderContext = KeyBuilderContext<HubSpotPluginOptions>;

type HubSpotEndpoint<K extends keyof HubSpotEndpointOutputs> = CorsairEndpoint<
	HubSpotContext,
	HubSpotEndpointInputs[K],
	HubSpotEndpointOutputs[K]
>;

export type HubSpotEndpoints = {
	contactsGet: HubSpotEndpoint<'contactsGet'>;
	contactsGetMany: HubSpotEndpoint<'contactsGetMany'>;
	contactsCreateOrUpdate: HubSpotEndpoint<'contactsCreateOrUpdate'>;
	contactsDelete: HubSpotEndpoint<'contactsDelete'>;
	contactsGetRecentlyCreated: HubSpotEndpoint<'contactsGetRecentlyCreated'>;
	contactsGetRecentlyUpdated: HubSpotEndpoint<'contactsGetRecentlyUpdated'>;
	contactsSearch: HubSpotEndpoint<'contactsSearch'>;
	companiesGet: HubSpotEndpoint<'companiesGet'>;
	companiesGetMany: HubSpotEndpoint<'companiesGetMany'>;
	companiesCreate: HubSpotEndpoint<'companiesCreate'>;
	companiesUpdate: HubSpotEndpoint<'companiesUpdate'>;
	companiesDelete: HubSpotEndpoint<'companiesDelete'>;
	companiesGetRecentlyCreated: HubSpotEndpoint<'companiesGetRecentlyCreated'>;
	companiesGetRecentlyUpdated: HubSpotEndpoint<'companiesGetRecentlyUpdated'>;
	companiesSearchByDomain: HubSpotEndpoint<'companiesSearchByDomain'>;
	dealsGet: HubSpotEndpoint<'dealsGet'>;
	dealsGetMany: HubSpotEndpoint<'dealsGetMany'>;
	dealsCreate: HubSpotEndpoint<'dealsCreate'>;
	dealsUpdate: HubSpotEndpoint<'dealsUpdate'>;
	dealsDelete: HubSpotEndpoint<'dealsDelete'>;
	dealsGetRecentlyCreated: HubSpotEndpoint<'dealsGetRecentlyCreated'>;
	dealsGetRecentlyUpdated: HubSpotEndpoint<'dealsGetRecentlyUpdated'>;
	dealsSearch: HubSpotEndpoint<'dealsSearch'>;
	ticketsGet: HubSpotEndpoint<'ticketsGet'>;
	ticketsGetMany: HubSpotEndpoint<'ticketsGetMany'>;
	ticketsCreate: HubSpotEndpoint<'ticketsCreate'>;
	ticketsUpdate: HubSpotEndpoint<'ticketsUpdate'>;
	ticketsDelete: HubSpotEndpoint<'ticketsDelete'>;
	engagementsGet: HubSpotEndpoint<'engagementsGet'>;
	engagementsGetMany: HubSpotEndpoint<'engagementsGetMany'>;
	engagementsCreate: HubSpotEndpoint<'engagementsCreate'>;
	engagementsDelete: HubSpotEndpoint<'engagementsDelete'>;
	contactListsAddContact: HubSpotEndpoint<'contactListsAddContact'>;
	contactListsRemoveContact: HubSpotEndpoint<'contactListsRemoveContact'>;
};

export type HubSpotBoundEndpoints = BindEndpoints<
	typeof hubspotEndpointsNested
>;

type HubSpotWebhook<
	K extends keyof HubSpotWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	HubSpotContext,
	HubSpotWebhookPayload<TEvent>,
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

export const hubspotEndpointSchemas = {
	'contacts.get': {
		input: HubSpotEndpointInputSchemas.contactsGet,
		output: HubSpotEndpointOutputSchemas.contactsGet,
	},
	'contacts.getMany': {
		input: HubSpotEndpointInputSchemas.contactsGetMany,
		output: HubSpotEndpointOutputSchemas.contactsGetMany,
	},
	'contacts.createOrUpdate': {
		input: HubSpotEndpointInputSchemas.contactsCreateOrUpdate,
		output: HubSpotEndpointOutputSchemas.contactsCreateOrUpdate,
	},
	'contacts.delete': {
		input: HubSpotEndpointInputSchemas.contactsDelete,
		output: HubSpotEndpointOutputSchemas.contactsDelete,
	},
	'contacts.getRecentlyCreated': {
		input: HubSpotEndpointInputSchemas.contactsGetRecentlyCreated,
		output: HubSpotEndpointOutputSchemas.contactsGetRecentlyCreated,
	},
	'contacts.getRecentlyUpdated': {
		input: HubSpotEndpointInputSchemas.contactsGetRecentlyUpdated,
		output: HubSpotEndpointOutputSchemas.contactsGetRecentlyUpdated,
	},
	'contacts.search': {
		input: HubSpotEndpointInputSchemas.contactsSearch,
		output: HubSpotEndpointOutputSchemas.contactsSearch,
	},
	'companies.get': {
		input: HubSpotEndpointInputSchemas.companiesGet,
		output: HubSpotEndpointOutputSchemas.companiesGet,
	},
	'companies.getMany': {
		input: HubSpotEndpointInputSchemas.companiesGetMany,
		output: HubSpotEndpointOutputSchemas.companiesGetMany,
	},
	'companies.create': {
		input: HubSpotEndpointInputSchemas.companiesCreate,
		output: HubSpotEndpointOutputSchemas.companiesCreate,
	},
	'companies.update': {
		input: HubSpotEndpointInputSchemas.companiesUpdate,
		output: HubSpotEndpointOutputSchemas.companiesUpdate,
	},
	'companies.delete': {
		input: HubSpotEndpointInputSchemas.companiesDelete,
		output: HubSpotEndpointOutputSchemas.companiesDelete,
	},
	'companies.getRecentlyCreated': {
		input: HubSpotEndpointInputSchemas.companiesGetRecentlyCreated,
		output: HubSpotEndpointOutputSchemas.companiesGetRecentlyCreated,
	},
	'companies.getRecentlyUpdated': {
		input: HubSpotEndpointInputSchemas.companiesGetRecentlyUpdated,
		output: HubSpotEndpointOutputSchemas.companiesGetRecentlyUpdated,
	},
	'companies.searchByDomain': {
		input: HubSpotEndpointInputSchemas.companiesSearchByDomain,
		output: HubSpotEndpointOutputSchemas.companiesSearchByDomain,
	},
	'deals.get': {
		input: HubSpotEndpointInputSchemas.dealsGet,
		output: HubSpotEndpointOutputSchemas.dealsGet,
	},
	'deals.getMany': {
		input: HubSpotEndpointInputSchemas.dealsGetMany,
		output: HubSpotEndpointOutputSchemas.dealsGetMany,
	},
	'deals.create': {
		input: HubSpotEndpointInputSchemas.dealsCreate,
		output: HubSpotEndpointOutputSchemas.dealsCreate,
	},
	'deals.update': {
		input: HubSpotEndpointInputSchemas.dealsUpdate,
		output: HubSpotEndpointOutputSchemas.dealsUpdate,
	},
	'deals.delete': {
		input: HubSpotEndpointInputSchemas.dealsDelete,
		output: HubSpotEndpointOutputSchemas.dealsDelete,
	},
	'deals.getRecentlyCreated': {
		input: HubSpotEndpointInputSchemas.dealsGetRecentlyCreated,
		output: HubSpotEndpointOutputSchemas.dealsGetRecentlyCreated,
	},
	'deals.getRecentlyUpdated': {
		input: HubSpotEndpointInputSchemas.dealsGetRecentlyUpdated,
		output: HubSpotEndpointOutputSchemas.dealsGetRecentlyUpdated,
	},
	'deals.search': {
		input: HubSpotEndpointInputSchemas.dealsSearch,
		output: HubSpotEndpointOutputSchemas.dealsSearch,
	},
	'tickets.get': {
		input: HubSpotEndpointInputSchemas.ticketsGet,
		output: HubSpotEndpointOutputSchemas.ticketsGet,
	},
	'tickets.getMany': {
		input: HubSpotEndpointInputSchemas.ticketsGetMany,
		output: HubSpotEndpointOutputSchemas.ticketsGetMany,
	},
	'tickets.create': {
		input: HubSpotEndpointInputSchemas.ticketsCreate,
		output: HubSpotEndpointOutputSchemas.ticketsCreate,
	},
	'tickets.update': {
		input: HubSpotEndpointInputSchemas.ticketsUpdate,
		output: HubSpotEndpointOutputSchemas.ticketsUpdate,
	},
	'tickets.delete': {
		input: HubSpotEndpointInputSchemas.ticketsDelete,
		output: HubSpotEndpointOutputSchemas.ticketsDelete,
	},
	'engagements.get': {
		input: HubSpotEndpointInputSchemas.engagementsGet,
		output: HubSpotEndpointOutputSchemas.engagementsGet,
	},
	'engagements.getMany': {
		input: HubSpotEndpointInputSchemas.engagementsGetMany,
		output: HubSpotEndpointOutputSchemas.engagementsGetMany,
	},
	'engagements.create': {
		input: HubSpotEndpointInputSchemas.engagementsCreate,
		output: HubSpotEndpointOutputSchemas.engagementsCreate,
	},
	'engagements.delete': {
		input: HubSpotEndpointInputSchemas.engagementsDelete,
		output: HubSpotEndpointOutputSchemas.engagementsDelete,
	},
	'contactLists.addContact': {
		input: HubSpotEndpointInputSchemas.contactListsAddContact,
		output: HubSpotEndpointOutputSchemas.contactListsAddContact,
	},
	'contactLists.removeContact': {
		input: HubSpotEndpointInputSchemas.contactListsRemoveContact,
		output: HubSpotEndpointOutputSchemas.contactListsRemoveContact,
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

const hubspotWebhookSchemas = {
	contactCreated: {
		description: 'A new contact was created',
		payload: ContactCreatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	contactUpdated: {
		description: 'A contact property was updated',
		payload: ContactUpdatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	contactDeleted: {
		description: 'A contact was deleted',
		payload: ContactDeletedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	companyCreated: {
		description: 'A new company was created',
		payload: CompanyCreatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	companyUpdated: {
		description: 'A company property was updated',
		payload: CompanyUpdatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	companyDeleted: {
		description: 'A company was deleted',
		payload: CompanyDeletedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	dealCreated: {
		description: 'A new deal was created',
		payload: DealCreatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	dealUpdated: {
		description: 'A deal property was updated',
		payload: DealUpdatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	dealDeleted: {
		description: 'A deal was deleted',
		payload: DealDeletedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	ticketCreated: {
		description: 'A new support ticket was created',
		payload: TicketCreatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	ticketUpdated: {
		description: 'A support ticket property was updated',
		payload: TicketUpdatedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
	ticketDeleted: {
		description: 'A support ticket was deleted',
		payload: TicketDeletedEventSchema,
		response: z.object({ success: z.boolean() }),
	},
} as const;

const defaultAuthType = 'api_key' as const;

/**
 * Risk-level metadata for each HubSpot endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const hubspotEndpointMeta = {
	'contacts.get': { riskLevel: 'read', description: 'Get a specific contact' },
	'contacts.getMany': {
		riskLevel: 'read',
		description: 'Get multiple contacts',
	},
	'contacts.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create a new contact or update an existing one',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a contact [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'contacts.getRecentlyCreated': {
		riskLevel: 'read',
		description: 'List recently created contacts',
	},
	'contacts.getRecentlyUpdated': {
		riskLevel: 'read',
		description: 'List recently updated contacts',
	},
	'contacts.search': { riskLevel: 'read', description: 'Search contacts' },
	'companies.get': { riskLevel: 'read', description: 'Get a specific company' },
	'companies.getMany': {
		riskLevel: 'read',
		description: 'Get multiple companies',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Create a new company',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Update an existing company',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a company [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'companies.getRecentlyCreated': {
		riskLevel: 'read',
		description: 'List recently created companies',
	},
	'companies.getRecentlyUpdated': {
		riskLevel: 'read',
		description: 'List recently updated companies',
	},
	'companies.searchByDomain': {
		riskLevel: 'read',
		description: 'Search companies by domain name',
	},
	'deals.get': { riskLevel: 'read', description: 'Get a specific deal' },
	'deals.getMany': { riskLevel: 'read', description: 'Get multiple deals' },
	'deals.create': { riskLevel: 'write', description: 'Create a new deal' },
	'deals.update': {
		riskLevel: 'write',
		description: 'Update an existing deal',
	},
	'deals.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a deal [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'deals.getRecentlyCreated': {
		riskLevel: 'read',
		description: 'List recently created deals',
	},
	'deals.getRecentlyUpdated': {
		riskLevel: 'read',
		description: 'List recently updated deals',
	},
	'deals.search': { riskLevel: 'read', description: 'Search deals' },
	'tickets.get': { riskLevel: 'read', description: 'Get a specific ticket' },
	'tickets.getMany': { riskLevel: 'read', description: 'Get multiple tickets' },
	'tickets.create': {
		riskLevel: 'write',
		description: 'Create a new support ticket',
	},
	'tickets.update': {
		riskLevel: 'write',
		description: 'Update an existing ticket',
	},
	'tickets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a ticket [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'engagements.get': {
		riskLevel: 'read',
		description: 'Get a specific engagement',
	},
	'engagements.getMany': {
		riskLevel: 'read',
		description: 'Get multiple engagements',
	},
	'engagements.create': {
		riskLevel: 'write',
		description: 'Create a new engagement',
	},
	'engagements.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete an engagement [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'contactLists.addContact': {
		riskLevel: 'write',
		description: 'Add a contact to a static contact list',
	},
	'contactLists.removeContact': {
		riskLevel: 'write',
		description: 'Remove a contact from a static contact list',
	},
} satisfies RequiredPluginEndpointMeta<typeof hubspotEndpointsNested>;

export type HubSpotPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	credentials?: HubSpotCredentials;
	webhookSecret?: string;
	hooks?: InternalHubSpotPlugin['hooks'];
	webhookHooks?: InternalHubSpotPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the HubSpot plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the HubSpot endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof hubspotEndpointsNested>;
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
		endpointMeta: hubspotEndpointMeta,
		endpointSchemas: hubspotEndpointSchemas,
		webhookSchemas: hubspotWebhookSchemas,
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
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint') {
				if (ctx.authType === 'api_key') {
					const res = await ctx.keys.get_api_key();

					if (!res) {
						return '';
					}

					return res;
				} else if (ctx.authType === 'oauth_2') {
					const res = await ctx.keys.get_access_token();

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
	HubSpotEndpointInputs,
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
