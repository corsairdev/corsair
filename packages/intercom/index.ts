import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	Admins,
	Articles,
	Collections,
	Companies,
	Contacts,
	Conversations,
	HelpCenters,
} from './endpoints';
import type {
	IntercomEndpointInputs,
	IntercomEndpointOutputs,
} from './endpoints/types';
import {
	IntercomEndpointInputSchemas,
	IntercomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { IntercomSchema } from './schema';
import {
	ContactWebhooks,
	ConversationWebhooks,
	PingWebhooks,
} from './webhooks';
import type {
	ContactCreatedEvent,
	ContactDeletedEvent,
	ContactTagCreatedEvent,
	ConversationAssignedEvent,
	ConversationClosedEvent,
	ConversationCreatedEvent,
	IntercomWebhookOutputs,
	PingEvent,
} from './webhooks/types';
import {
	ContactCreatedEventSchema,
	ContactCreatedPayloadSchema,
	ContactDeletedEventSchema,
	ContactDeletedPayloadSchema,
	ContactTagCreatedEventSchema,
	ContactTagCreatedPayloadSchema,
	ConversationAssignedEventSchema,
	ConversationAssignedPayloadSchema,
	ConversationClosedEventSchema,
	ConversationClosedPayloadSchema,
	ConversationCreatedEventSchema,
	ConversationCreatedPayloadSchema,
	PingEventSchema,
	PingPayloadSchema,
} from './webhooks/types';

export type IntercomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalIntercomPlugin['hooks'];
	webhookHooks?: InternalIntercomPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof intercomEndpointsNested>;
};

export type IntercomContext = CorsairPluginContext<
	typeof IntercomSchema,
	IntercomPluginOptions
>;

export type IntercomKeyBuilderContext =
	KeyBuilderContext<IntercomPluginOptions>;

export type IntercomBoundEndpoints = BindEndpoints<
	typeof intercomEndpointsNested
>;

type IntercomEndpoint<K extends keyof IntercomEndpointOutputs> =
	CorsairEndpoint<
		IntercomContext,
		IntercomEndpointInputs[K],
		IntercomEndpointOutputs[K]
	>;

export type IntercomEndpoints = {
	contactsGet: IntercomEndpoint<'contactsGet'>;
	contactsList: IntercomEndpoint<'contactsList'>;
	contactsUpdate: IntercomEndpoint<'contactsUpdate'>;
	contactsDelete: IntercomEndpoint<'contactsDelete'>;
	contactsAddTag: IntercomEndpoint<'contactsAddTag'>;
	contactsRemoveTag: IntercomEndpoint<'contactsRemoveTag'>;
	contactsListTags: IntercomEndpoint<'contactsListTags'>;
	contactsAddSubscription: IntercomEndpoint<'contactsAddSubscription'>;
	contactsRemoveSubscription: IntercomEndpoint<'contactsRemoveSubscription'>;
	contactsListSubscriptions: IntercomEndpoint<'contactsListSubscriptions'>;
	contactsAttachToCompany: IntercomEndpoint<'contactsAttachToCompany'>;
	contactsDetachFromCompany: IntercomEndpoint<'contactsDetachFromCompany'>;
	contactsListAttachedCompanies: IntercomEndpoint<'contactsListAttachedCompanies'>;
	contactsListAttachedSegments: IntercomEndpoint<'contactsListAttachedSegments'>;
	contactsCreateNote: IntercomEndpoint<'contactsCreateNote'>;
	contactsListNotes: IntercomEndpoint<'contactsListNotes'>;
	contactsMerge: IntercomEndpoint<'contactsMerge'>;
	conversationsGet: IntercomEndpoint<'conversationsGet'>;
	conversationsList: IntercomEndpoint<'conversationsList'>;
	conversationsCreate: IntercomEndpoint<'conversationsCreate'>;
	conversationsSearch: IntercomEndpoint<'conversationsSearch'>;
	conversationsAssign: IntercomEndpoint<'conversationsAssign'>;
	conversationsClose: IntercomEndpoint<'conversationsClose'>;
	conversationsReopen: IntercomEndpoint<'conversationsReopen'>;
	conversationsReply: IntercomEndpoint<'conversationsReply'>;
	companiesCreateOrUpdate: IntercomEndpoint<'companiesCreateOrUpdate'>;
	companiesGet: IntercomEndpoint<'companiesGet'>;
	companiesList: IntercomEndpoint<'companiesList'>;
	companiesScroll: IntercomEndpoint<'companiesScroll'>;
	companiesDelete: IntercomEndpoint<'companiesDelete'>;
	companiesRetrieve: IntercomEndpoint<'companiesRetrieve'>;
	companiesListAttachedContacts: IntercomEndpoint<'companiesListAttachedContacts'>;
	companiesListAttachedSegments: IntercomEndpoint<'companiesListAttachedSegments'>;
	articlesGet: IntercomEndpoint<'articlesGet'>;
	articlesList: IntercomEndpoint<'articlesList'>;
	articlesCreate: IntercomEndpoint<'articlesCreate'>;
	articlesUpdate: IntercomEndpoint<'articlesUpdate'>;
	articlesDelete: IntercomEndpoint<'articlesDelete'>;
	articlesSearch: IntercomEndpoint<'articlesSearch'>;
	collectionsGet: IntercomEndpoint<'collectionsGet'>;
	collectionsList: IntercomEndpoint<'collectionsList'>;
	collectionsCreate: IntercomEndpoint<'collectionsCreate'>;
	collectionsUpdate: IntercomEndpoint<'collectionsUpdate'>;
	collectionsDelete: IntercomEndpoint<'collectionsDelete'>;
	adminsIdentify: IntercomEndpoint<'adminsIdentify'>;
	adminsList: IntercomEndpoint<'adminsList'>;
	adminsGet: IntercomEndpoint<'adminsGet'>;
	adminsListActivityLogs: IntercomEndpoint<'adminsListActivityLogs'>;
	adminsSetAway: IntercomEndpoint<'adminsSetAway'>;
	helpCentersList: IntercomEndpoint<'helpCentersList'>;
	helpCentersGet: IntercomEndpoint<'helpCentersGet'>;
};

type IntercomWebhook<
	K extends keyof IntercomWebhookOutputs,
	TEvent,
> = CorsairWebhook<IntercomContext, TEvent, IntercomWebhookOutputs[K]>;

export type IntercomWebhooks = {
	contactCreated: IntercomWebhook<'contactCreated', ContactCreatedEvent>;
	contactDeleted: IntercomWebhook<'contactDeleted', ContactDeletedEvent>;
	contactTagCreated: IntercomWebhook<
		'contactTagCreated',
		ContactTagCreatedEvent
	>;
	conversationCreated: IntercomWebhook<
		'conversationCreated',
		ConversationCreatedEvent
	>;
	conversationAssigned: IntercomWebhook<
		'conversationAssigned',
		ConversationAssignedEvent
	>;
	conversationClosed: IntercomWebhook<
		'conversationClosed',
		ConversationClosedEvent
	>;
	// Sent by Intercom during initial webhook URL registration for setup verification
	ping: IntercomWebhook<'ping', PingEvent>;
};

export type IntercomBoundWebhooks = BindWebhooks<IntercomWebhooks>;

const intercomEndpointsNested = {
	contacts: {
		get: Contacts.get,
		list: Contacts.list,
		update: Contacts.update,
		delete: Contacts.delete,
		addTag: Contacts.addTag,
		removeTag: Contacts.removeTag,
		listTags: Contacts.listTags,
		addSubscription: Contacts.addSubscription,
		removeSubscription: Contacts.removeSubscription,
		listSubscriptions: Contacts.listSubscriptions,
		attachToCompany: Contacts.attachToCompany,
		detachFromCompany: Contacts.detachFromCompany,
		listAttachedCompanies: Contacts.listAttachedCompanies,
		listAttachedSegments: Contacts.listAttachedSegments,
		createNote: Contacts.createNote,
		listNotes: Contacts.listNotes,
		merge: Contacts.merge,
	},
	conversations: {
		get: Conversations.get,
		list: Conversations.list,
		create: Conversations.create,
		search: Conversations.search,
		assign: Conversations.assign,
		close: Conversations.close,
		reopen: Conversations.reopen,
		reply: Conversations.reply,
	},
	companies: {
		createOrUpdate: Companies.createOrUpdate,
		get: Companies.get,
		list: Companies.list,
		scroll: Companies.scroll,
		delete: Companies.delete,
		retrieve: Companies.retrieve,
		listAttachedContacts: Companies.listAttachedContacts,
		listAttachedSegments: Companies.listAttachedSegments,
	},
	articles: {
		get: Articles.get,
		list: Articles.list,
		create: Articles.create,
		update: Articles.update,
		delete: Articles.delete,
		search: Articles.search,
	},
	collections: {
		get: Collections.get,
		list: Collections.list,
		create: Collections.create,
		update: Collections.update,
		delete: Collections.delete,
	},
	admins: {
		identify: Admins.identify,
		list: Admins.list,
		get: Admins.get,
		listActivityLogs: Admins.listActivityLogs,
		setAway: Admins.setAway,
	},
	helpCenters: {
		list: HelpCenters.list,
		get: HelpCenters.get,
	},
} as const;

const intercomWebhooksNested = {
	contacts: {
		created: ContactWebhooks.created,
		deleted: ContactWebhooks.deleted,
		tagCreated: ContactWebhooks.tagCreated,
	},
	conversations: {
		created: ConversationWebhooks.created,
		assigned: ConversationWebhooks.assigned,
		closed: ConversationWebhooks.closed,
	},
	// Sent by Intercom during initial webhook URL registration for setup verification
	ping: PingWebhooks.ping,
} as const;

export const intercomEndpointSchemas = {
	'contacts.get': {
		input: IntercomEndpointInputSchemas.contactsGet,
		output: IntercomEndpointOutputSchemas.contactsGet,
	},
	'contacts.list': {
		input: IntercomEndpointInputSchemas.contactsList,
		output: IntercomEndpointOutputSchemas.contactsList,
	},
	'contacts.update': {
		input: IntercomEndpointInputSchemas.contactsUpdate,
		output: IntercomEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: IntercomEndpointInputSchemas.contactsDelete,
		output: IntercomEndpointOutputSchemas.contactsDelete,
	},
	'contacts.addTag': {
		input: IntercomEndpointInputSchemas.contactsAddTag,
		output: IntercomEndpointOutputSchemas.contactsAddTag,
	},
	'contacts.removeTag': {
		input: IntercomEndpointInputSchemas.contactsRemoveTag,
		output: IntercomEndpointOutputSchemas.contactsRemoveTag,
	},
	'contacts.listTags': {
		input: IntercomEndpointInputSchemas.contactsListTags,
		output: IntercomEndpointOutputSchemas.contactsListTags,
	},
	'contacts.addSubscription': {
		input: IntercomEndpointInputSchemas.contactsAddSubscription,
		output: IntercomEndpointOutputSchemas.contactsAddSubscription,
	},
	'contacts.removeSubscription': {
		input: IntercomEndpointInputSchemas.contactsRemoveSubscription,
		output: IntercomEndpointOutputSchemas.contactsRemoveSubscription,
	},
	'contacts.listSubscriptions': {
		input: IntercomEndpointInputSchemas.contactsListSubscriptions,
		output: IntercomEndpointOutputSchemas.contactsListSubscriptions,
	},
	'contacts.attachToCompany': {
		input: IntercomEndpointInputSchemas.contactsAttachToCompany,
		output: IntercomEndpointOutputSchemas.contactsAttachToCompany,
	},
	'contacts.detachFromCompany': {
		input: IntercomEndpointInputSchemas.contactsDetachFromCompany,
		output: IntercomEndpointOutputSchemas.contactsDetachFromCompany,
	},
	'contacts.listAttachedCompanies': {
		input: IntercomEndpointInputSchemas.contactsListAttachedCompanies,
		output: IntercomEndpointOutputSchemas.contactsListAttachedCompanies,
	},
	'contacts.listAttachedSegments': {
		input: IntercomEndpointInputSchemas.contactsListAttachedSegments,
		output: IntercomEndpointOutputSchemas.contactsListAttachedSegments,
	},
	'contacts.createNote': {
		input: IntercomEndpointInputSchemas.contactsCreateNote,
		output: IntercomEndpointOutputSchemas.contactsCreateNote,
	},
	'contacts.listNotes': {
		input: IntercomEndpointInputSchemas.contactsListNotes,
		output: IntercomEndpointOutputSchemas.contactsListNotes,
	},
	'contacts.merge': {
		input: IntercomEndpointInputSchemas.contactsMerge,
		output: IntercomEndpointOutputSchemas.contactsMerge,
	},
	'conversations.get': {
		input: IntercomEndpointInputSchemas.conversationsGet,
		output: IntercomEndpointOutputSchemas.conversationsGet,
	},
	'conversations.list': {
		input: IntercomEndpointInputSchemas.conversationsList,
		output: IntercomEndpointOutputSchemas.conversationsList,
	},
	'conversations.create': {
		input: IntercomEndpointInputSchemas.conversationsCreate,
		output: IntercomEndpointOutputSchemas.conversationsCreate,
	},
	'conversations.search': {
		input: IntercomEndpointInputSchemas.conversationsSearch,
		output: IntercomEndpointOutputSchemas.conversationsSearch,
	},
	'conversations.assign': {
		input: IntercomEndpointInputSchemas.conversationsAssign,
		output: IntercomEndpointOutputSchemas.conversationsAssign,
	},
	'conversations.close': {
		input: IntercomEndpointInputSchemas.conversationsClose,
		output: IntercomEndpointOutputSchemas.conversationsClose,
	},
	'conversations.reopen': {
		input: IntercomEndpointInputSchemas.conversationsReopen,
		output: IntercomEndpointOutputSchemas.conversationsReopen,
	},
	'conversations.reply': {
		input: IntercomEndpointInputSchemas.conversationsReply,
		output: IntercomEndpointOutputSchemas.conversationsReply,
	},
	'companies.createOrUpdate': {
		input: IntercomEndpointInputSchemas.companiesCreateOrUpdate,
		output: IntercomEndpointOutputSchemas.companiesCreateOrUpdate,
	},
	'companies.get': {
		input: IntercomEndpointInputSchemas.companiesGet,
		output: IntercomEndpointOutputSchemas.companiesGet,
	},
	'companies.list': {
		input: IntercomEndpointInputSchemas.companiesList,
		output: IntercomEndpointOutputSchemas.companiesList,
	},
	'companies.scroll': {
		input: IntercomEndpointInputSchemas.companiesScroll,
		output: IntercomEndpointOutputSchemas.companiesScroll,
	},
	'companies.delete': {
		input: IntercomEndpointInputSchemas.companiesDelete,
		output: IntercomEndpointOutputSchemas.companiesDelete,
	},
	'companies.retrieve': {
		input: IntercomEndpointInputSchemas.companiesRetrieve,
		output: IntercomEndpointOutputSchemas.companiesRetrieve,
	},
	'companies.listAttachedContacts': {
		input: IntercomEndpointInputSchemas.companiesListAttachedContacts,
		output: IntercomEndpointOutputSchemas.companiesListAttachedContacts,
	},
	'companies.listAttachedSegments': {
		input: IntercomEndpointInputSchemas.companiesListAttachedSegments,
		output: IntercomEndpointOutputSchemas.companiesListAttachedSegments,
	},
	'articles.get': {
		input: IntercomEndpointInputSchemas.articlesGet,
		output: IntercomEndpointOutputSchemas.articlesGet,
	},
	'articles.list': {
		input: IntercomEndpointInputSchemas.articlesList,
		output: IntercomEndpointOutputSchemas.articlesList,
	},
	'articles.create': {
		input: IntercomEndpointInputSchemas.articlesCreate,
		output: IntercomEndpointOutputSchemas.articlesCreate,
	},
	'articles.update': {
		input: IntercomEndpointInputSchemas.articlesUpdate,
		output: IntercomEndpointOutputSchemas.articlesUpdate,
	},
	'articles.delete': {
		input: IntercomEndpointInputSchemas.articlesDelete,
		output: IntercomEndpointOutputSchemas.articlesDelete,
	},
	'articles.search': {
		input: IntercomEndpointInputSchemas.articlesSearch,
		output: IntercomEndpointOutputSchemas.articlesSearch,
	},
	'collections.get': {
		input: IntercomEndpointInputSchemas.collectionsGet,
		output: IntercomEndpointOutputSchemas.collectionsGet,
	},
	'collections.list': {
		input: IntercomEndpointInputSchemas.collectionsList,
		output: IntercomEndpointOutputSchemas.collectionsList,
	},
	'collections.create': {
		input: IntercomEndpointInputSchemas.collectionsCreate,
		output: IntercomEndpointOutputSchemas.collectionsCreate,
	},
	'collections.update': {
		input: IntercomEndpointInputSchemas.collectionsUpdate,
		output: IntercomEndpointOutputSchemas.collectionsUpdate,
	},
	'collections.delete': {
		input: IntercomEndpointInputSchemas.collectionsDelete,
		output: IntercomEndpointOutputSchemas.collectionsDelete,
	},
	'admins.identify': {
		input: IntercomEndpointInputSchemas.adminsIdentify,
		output: IntercomEndpointOutputSchemas.adminsIdentify,
	},
	'admins.list': {
		input: IntercomEndpointInputSchemas.adminsList,
		output: IntercomEndpointOutputSchemas.adminsList,
	},
	'admins.get': {
		input: IntercomEndpointInputSchemas.adminsGet,
		output: IntercomEndpointOutputSchemas.adminsGet,
	},
	'admins.listActivityLogs': {
		input: IntercomEndpointInputSchemas.adminsListActivityLogs,
		output: IntercomEndpointOutputSchemas.adminsListActivityLogs,
	},
	'admins.setAway': {
		input: IntercomEndpointInputSchemas.adminsSetAway,
		output: IntercomEndpointOutputSchemas.adminsSetAway,
	},
	'helpCenters.list': {
		input: IntercomEndpointInputSchemas.helpCentersList,
		output: IntercomEndpointOutputSchemas.helpCentersList,
	},
	'helpCenters.get': {
		input: IntercomEndpointInputSchemas.helpCentersGet,
		output: IntercomEndpointOutputSchemas.helpCentersGet,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const intercomEndpointMeta = {
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a single contact by ID',
	},
	'contacts.list': { riskLevel: 'read', description: 'List all contacts' },
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact [DESTRUCTIVE]',
	},
	'contacts.addTag': {
		riskLevel: 'write',
		description: 'Add a tag to a contact',
	},
	'contacts.removeTag': {
		riskLevel: 'write',
		description: 'Remove a tag from a contact',
	},
	'contacts.listTags': {
		riskLevel: 'read',
		description: 'List all tags attached to a contact',
	},
	'contacts.addSubscription': {
		riskLevel: 'write',
		description: 'Add a subscription to a contact',
	},
	'contacts.removeSubscription': {
		riskLevel: 'write',
		description: 'Remove a subscription from a contact',
	},
	'contacts.listSubscriptions': {
		riskLevel: 'read',
		description: 'List subscription types for a contact',
	},
	'contacts.attachToCompany': {
		riskLevel: 'write',
		description: 'Attach a contact to a company',
	},
	'contacts.detachFromCompany': {
		riskLevel: 'write',
		description: 'Detach a contact from a company',
	},
	'contacts.listAttachedCompanies': {
		riskLevel: 'read',
		description: 'List companies attached to a contact',
	},
	'contacts.listAttachedSegments': {
		riskLevel: 'read',
		description: 'List segments attached to a contact',
	},
	'contacts.createNote': {
		riskLevel: 'write',
		description: 'Create a note for a contact',
	},
	'contacts.listNotes': {
		riskLevel: 'read',
		description: 'List all notes for a contact',
	},
	'contacts.merge': {
		riskLevel: 'write',
		description: 'Merge a lead into a user contact',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Get a conversation by ID with all messages and details',
	},
	'conversations.list': {
		riskLevel: 'read',
		description: 'List conversations with filtering and pagination',
	},
	'conversations.create': {
		riskLevel: 'write',
		description: 'Create a new conversation',
	},
	'conversations.search': {
		riskLevel: 'read',
		description: 'Search conversations using query string',
	},
	'conversations.assign': {
		riskLevel: 'write',
		description: 'Assign a conversation to an admin or team',
	},
	'conversations.close': {
		riskLevel: 'write',
		description: 'Close a conversation',
	},
	'conversations.reopen': {
		riskLevel: 'write',
		description: 'Reopen a closed conversation',
	},
	'conversations.reply': {
		riskLevel: 'write',
		description: 'Send a reply to a conversation',
	},
	'companies.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create or update a company',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Retrieve a company by Intercom ID',
	},
	'companies.list': { riskLevel: 'read', description: 'List all companies' },
	'companies.scroll': {
		riskLevel: 'read',
		description: 'Scroll over all companies for large datasets',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		description: 'Delete a company [DESTRUCTIVE]',
	},
	'companies.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a company by company_id or name',
	},
	'companies.listAttachedContacts': {
		riskLevel: 'read',
		description: 'List contacts attached to a company',
	},
	'companies.listAttachedSegments': {
		riskLevel: 'read',
		description: 'List segments attached to a company',
	},
	'articles.get': {
		riskLevel: 'read',
		description: 'Retrieve a single article',
	},
	'articles.list': { riskLevel: 'read', description: 'List all articles' },
	'articles.create': {
		riskLevel: 'write',
		description: 'Create a new article',
	},
	'articles.update': {
		riskLevel: 'write',
		description: 'Update an existing article',
	},
	'articles.delete': {
		riskLevel: 'destructive',
		description: 'Delete an article [DESTRUCTIVE]',
	},
	'articles.search': { riskLevel: 'read', description: 'Search for articles' },
	'collections.get': {
		riskLevel: 'read',
		description: 'Retrieve a single collection',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List all collections',
	},
	'collections.create': {
		riskLevel: 'write',
		description: 'Create a new collection',
	},
	'collections.update': {
		riskLevel: 'write',
		description: 'Update a collection',
	},
	'collections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a collection [DESTRUCTIVE]',
	},
	'admins.identify': {
		riskLevel: 'read',
		description: 'Identify the currently authorised admin',
	},
	'admins.list': {
		riskLevel: 'read',
		description: 'List all admins in the workspace',
	},
	'admins.get': { riskLevel: 'read', description: 'Retrieve a single admin' },
	'admins.listActivityLogs': {
		riskLevel: 'read',
		description: 'List all admin activity logs',
	},
	'admins.setAway': { riskLevel: 'write', description: 'Set an admin as away' },
	'helpCenters.list': {
		riskLevel: 'read',
		description: 'List all help centers',
	},
	'helpCenters.get': {
		riskLevel: 'read',
		description: 'Retrieve a single help center',
	},
} satisfies RequiredPluginEndpointMeta<typeof intercomEndpointsNested>;

export const intercomAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

const intercomWebhookSchemas = {
	'contacts.created': {
		description: 'A new contact was created in Intercom',
		payload: ContactCreatedPayloadSchema,
		response: ContactCreatedEventSchema,
	},
	'contacts.deleted': {
		description: 'A contact was deleted from Intercom',
		payload: ContactDeletedPayloadSchema,
		response: ContactDeletedEventSchema,
	},
	'contacts.tagCreated': {
		description: 'A tag was added to a contact',
		payload: ContactTagCreatedPayloadSchema,
		response: ContactTagCreatedEventSchema,
	},
	'conversations.created': {
		description: 'A new conversation was created',
		payload: ConversationCreatedPayloadSchema,
		response: ConversationCreatedEventSchema,
	},
	'conversations.assigned': {
		description: 'A conversation was assigned to an admin or team',
		payload: ConversationAssignedPayloadSchema,
		response: ConversationAssignedEventSchema,
	},
	'conversations.closed': {
		description: 'A conversation was closed',
		payload: ConversationClosedPayloadSchema,
		response: ConversationClosedEventSchema,
	},
	// Sent by Intercom during initial webhook URL registration for setup verification
	ping: {
		description:
			'Initial ping sent by Intercom when a webhook URL is first registered',
		payload: PingPayloadSchema,
		response: PingEventSchema,
	},
} as const;

export type BaseIntercomPlugin<T extends IntercomPluginOptions> = CorsairPlugin<
	'intercom',
	typeof IntercomSchema,
	typeof intercomEndpointsNested,
	typeof intercomWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalIntercomPlugin = BaseIntercomPlugin<IntercomPluginOptions>;

export type ExternalIntercomPlugin<T extends IntercomPluginOptions> =
	BaseIntercomPlugin<T>;

export function intercom<const T extends IntercomPluginOptions>(
	incomingOptions: IntercomPluginOptions & T = {} as IntercomPluginOptions & T,
): ExternalIntercomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'intercom',
		schema: IntercomSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: intercomEndpointsNested,
		webhooks: intercomWebhooksNested,
		endpointMeta: intercomEndpointMeta,
		endpointSchemas: intercomEndpointSchemas,
		webhookSchemas: intercomWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasSignature = 'x-hub-signature' in headers;
			const hasSubscriptionId = 'intercom-webhook-subscription-id' in headers;
			return hasSignature && hasSubscriptionId;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: IntercomKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalIntercomPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ContactCreatedEvent,
	ContactDeletedEvent,
	ContactTagCreatedEvent,
	ConversationAssignedEvent,
	ConversationClosedEvent,
	ConversationCreatedEvent,
	IntercomWebhookOutputs,
	PingEvent,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AdminsGetInput,
	AdminsGetResponse,
	AdminsIdentifyInput,
	AdminsIdentifyResponse,
	AdminsListActivityLogsInput,
	AdminsListActivityLogsResponse,
	AdminsListInput,
	AdminsListResponse,
	AdminsSetAwayInput,
	AdminsSetAwayResponse,
	ArticlesCreateInput,
	ArticlesCreateResponse,
	ArticlesDeleteInput,
	ArticlesDeleteResponse,
	ArticlesGetInput,
	ArticlesGetResponse,
	ArticlesListInput,
	ArticlesListResponse,
	ArticlesSearchInput,
	ArticlesSearchResponse,
	ArticlesUpdateInput,
	ArticlesUpdateResponse,
	CollectionsCreateInput,
	CollectionsCreateResponse,
	CollectionsDeleteInput,
	CollectionsDeleteResponse,
	CollectionsGetInput,
	CollectionsGetResponse,
	CollectionsListInput,
	CollectionsListResponse,
	CollectionsUpdateInput,
	CollectionsUpdateResponse,
	CompaniesCreateOrUpdateInput,
	CompaniesCreateOrUpdateResponse,
	CompaniesDeleteInput,
	CompaniesDeleteResponse,
	CompaniesGetInput,
	CompaniesGetResponse,
	CompaniesListAttachedContactsInput,
	CompaniesListAttachedContactsResponse,
	CompaniesListAttachedSegmentsInput,
	CompaniesListAttachedSegmentsResponse,
	CompaniesListInput,
	CompaniesListResponse,
	CompaniesRetrieveInput,
	CompaniesRetrieveResponse,
	CompaniesScrollInput,
	CompaniesScrollResponse,
	ContactsAddSubscriptionInput,
	ContactsAddSubscriptionResponse,
	ContactsAddTagInput,
	ContactsAddTagResponse,
	ContactsAttachToCompanyInput,
	ContactsAttachToCompanyResponse,
	ContactsCreateNoteInput,
	ContactsCreateNoteResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsDetachFromCompanyInput,
	ContactsDetachFromCompanyResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListAttachedCompaniesInput,
	ContactsListAttachedCompaniesResponse,
	ContactsListAttachedSegmentsInput,
	ContactsListAttachedSegmentsResponse,
	ContactsListInput,
	ContactsListNotesInput,
	ContactsListNotesResponse,
	ContactsListResponse,
	ContactsListSubscriptionsInput,
	ContactsListSubscriptionsResponse,
	ContactsListTagsInput,
	ContactsListTagsResponse,
	ContactsMergeInput,
	ContactsMergeResponse,
	ContactsRemoveSubscriptionInput,
	ContactsRemoveSubscriptionResponse,
	ContactsRemoveTagInput,
	ContactsRemoveTagResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	ConversationsAssignInput,
	ConversationsAssignResponse,
	ConversationsCloseInput,
	ConversationsCloseResponse,
	ConversationsCreateInput,
	ConversationsCreateResponse,
	ConversationsGetInput,
	ConversationsGetResponse,
	ConversationsListInput,
	ConversationsListResponse,
	ConversationsReopenInput,
	ConversationsReopenResponse,
	ConversationsReplyInput,
	ConversationsReplyResponse,
	ConversationsSearchInput,
	ConversationsSearchResponse,
	HelpCentersGetInput,
	HelpCentersGetResponse,
	HelpCentersListInput,
	HelpCentersListResponse,
	IntercomEndpointInputs,
	IntercomEndpointOutputs,
} from './endpoints/types';
