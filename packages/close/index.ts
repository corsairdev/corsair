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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	activitiesCreateNote,
	activitiesListCalls,
	activitiesListEmails,
	activitiesListNotes,
	contactsCreate,
	contactsDelete,
	contactsGet,
	contactsList,
	contactsUpdate,
	customFieldsListContact,
	customFieldsListLead,
	leadsCreate,
	leadsDelete,
	leadsGet,
	leadsList,
	leadsUpdate,
	opportunitiesCreate,
	opportunitiesDelete,
	opportunitiesGet,
	opportunitiesList,
	opportunitiesUpdate,
	tasksCreate,
	tasksDelete,
	tasksGet,
	tasksList,
	tasksUpdate,
	usersGetMe,
	usersList,
} from './endpoints';
import type {
	CloseEndpointInputs,
	CloseEndpointOutputs,
} from './endpoints/types';
import {
	CloseEndpointInputSchemas,
	CloseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloseSchema } from './schema';
import {
	CloseWebhooks,
	matchCloseTenantWebhook,
	resolveCloseOAuthWebhookTenantLink,
} from './webhooks';
import type {
	CloseActivityNoteCreatedEvent,
	CloseContactCreatedEvent,
	CloseLeadCreatedEvent,
	CloseLeadUpdatedEvent,
	CloseOpportunityCreatedEvent,
	CloseTaskCreatedEvent,
	CloseWebhookOutputs,
} from './webhooks/types';
import {
	CloseActivityNoteCreatedEventSchema,
	CloseContactCreatedEventSchema,
	CloseLeadCreatedEventSchema,
	CloseLeadUpdatedEventSchema,
	CloseOpportunityCreatedEventSchema,
	CloseTaskCreatedEventSchema,
} from './webhooks/types';

export type ClosePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalClosePlugin['hooks'];
	webhookHooks?: InternalClosePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof closeEndpointsNested>;
};

export type CloseContext = CorsairPluginContext<
	typeof CloseSchema,
	ClosePluginOptions
>;

export type CloseKeyBuilderContext = KeyBuilderContext<ClosePluginOptions>;

export type CloseBoundEndpoints = BindEndpoints<typeof closeEndpointsNested>;

type CloseEndpoint<K extends keyof CloseEndpointOutputs> = CorsairEndpoint<
	CloseContext,
	CloseEndpointInputs[K],
	CloseEndpointOutputs[K]
>;

export type CloseEndpoints = {
	leadsList: CloseEndpoint<'leadsList'>;
	leadsGet: CloseEndpoint<'leadsGet'>;
	leadsCreate: CloseEndpoint<'leadsCreate'>;
	leadsUpdate: CloseEndpoint<'leadsUpdate'>;
	leadsDelete: CloseEndpoint<'leadsDelete'>;
	contactsList: CloseEndpoint<'contactsList'>;
	contactsGet: CloseEndpoint<'contactsGet'>;
	contactsCreate: CloseEndpoint<'contactsCreate'>;
	contactsUpdate: CloseEndpoint<'contactsUpdate'>;
	contactsDelete: CloseEndpoint<'contactsDelete'>;
	opportunitiesList: CloseEndpoint<'opportunitiesList'>;
	opportunitiesGet: CloseEndpoint<'opportunitiesGet'>;
	opportunitiesCreate: CloseEndpoint<'opportunitiesCreate'>;
	opportunitiesUpdate: CloseEndpoint<'opportunitiesUpdate'>;
	opportunitiesDelete: CloseEndpoint<'opportunitiesDelete'>;
	tasksList: CloseEndpoint<'tasksList'>;
	tasksGet: CloseEndpoint<'tasksGet'>;
	tasksCreate: CloseEndpoint<'tasksCreate'>;
	tasksUpdate: CloseEndpoint<'tasksUpdate'>;
	tasksDelete: CloseEndpoint<'tasksDelete'>;
	activitiesListNotes: CloseEndpoint<'activitiesListNotes'>;
	activitiesCreateNote: CloseEndpoint<'activitiesCreateNote'>;
	activitiesListCalls: CloseEndpoint<'activitiesListCalls'>;
	activitiesListEmails: CloseEndpoint<'activitiesListEmails'>;
	usersGetMe: CloseEndpoint<'usersGetMe'>;
	usersList: CloseEndpoint<'usersList'>;
	customFieldsListLead: CloseEndpoint<'customFieldsListLead'>;
	customFieldsListContact: CloseEndpoint<'customFieldsListContact'>;
};

type CloseWebhook<K extends keyof CloseWebhookOutputs, TEvent> = CorsairWebhook<
	CloseContext,
	TEvent,
	CloseWebhookOutputs[K]
>;

export type CloseWebhooksType = {
	leadCreated: CloseWebhook<'leadCreated', CloseLeadCreatedEvent>;
	leadUpdated: CloseWebhook<'leadUpdated', CloseLeadUpdatedEvent>;
	contactCreated: CloseWebhook<'contactCreated', CloseContactCreatedEvent>;
	opportunityCreated: CloseWebhook<
		'opportunityCreated',
		CloseOpportunityCreatedEvent
	>;
	taskCreated: CloseWebhook<'taskCreated', CloseTaskCreatedEvent>;
	activityNoteCreated: CloseWebhook<
		'activityNoteCreated',
		CloseActivityNoteCreatedEvent
	>;
};

export type CloseBoundWebhooks = BindWebhooks<CloseWebhooksType>;

const closeEndpointsNested = {
	leads: {
		list: leadsList,
		get: leadsGet,
		create: leadsCreate,
		update: leadsUpdate,
		delete: leadsDelete,
	},
	contacts: {
		list: contactsList,
		get: contactsGet,
		create: contactsCreate,
		update: contactsUpdate,
		delete: contactsDelete,
	},
	opportunities: {
		list: opportunitiesList,
		get: opportunitiesGet,
		create: opportunitiesCreate,
		update: opportunitiesUpdate,
		delete: opportunitiesDelete,
	},
	tasks: {
		list: tasksList,
		get: tasksGet,
		create: tasksCreate,
		update: tasksUpdate,
		delete: tasksDelete,
	},
	activities: {
		listNotes: activitiesListNotes,
		createNote: activitiesCreateNote,
		listCalls: activitiesListCalls,
		listEmails: activitiesListEmails,
	},
	users: {
		getMe: usersGetMe,
		list: usersList,
	},
	customFields: {
		listLead: customFieldsListLead,
		listContact: customFieldsListContact,
	},
} as const;

const closeWebhooksNested = {
	lead: {
		created: CloseWebhooks.leadCreated,
		updated: CloseWebhooks.leadUpdated,
	},
	contact: {
		created: CloseWebhooks.contactCreated,
	},
	opportunity: {
		created: CloseWebhooks.opportunityCreated,
	},
	task: {
		created: CloseWebhooks.taskCreated,
	},
	activityNote: {
		created: CloseWebhooks.activityNoteCreated,
	},
} as const;

export const closeEndpointSchemas = {
	'leads.list': {
		input: CloseEndpointInputSchemas.leadsList,
		output: CloseEndpointOutputSchemas.leadsList,
	},
	'leads.get': {
		input: CloseEndpointInputSchemas.leadsGet,
		output: CloseEndpointOutputSchemas.leadsGet,
	},
	'leads.create': {
		input: CloseEndpointInputSchemas.leadsCreate,
		output: CloseEndpointOutputSchemas.leadsCreate,
	},
	'leads.update': {
		input: CloseEndpointInputSchemas.leadsUpdate,
		output: CloseEndpointOutputSchemas.leadsUpdate,
	},
	'leads.delete': {
		input: CloseEndpointInputSchemas.leadsDelete,
		output: CloseEndpointOutputSchemas.leadsDelete,
	},
	'contacts.list': {
		input: CloseEndpointInputSchemas.contactsList,
		output: CloseEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: CloseEndpointInputSchemas.contactsGet,
		output: CloseEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: CloseEndpointInputSchemas.contactsCreate,
		output: CloseEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: CloseEndpointInputSchemas.contactsUpdate,
		output: CloseEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: CloseEndpointInputSchemas.contactsDelete,
		output: CloseEndpointOutputSchemas.contactsDelete,
	},
	'opportunities.list': {
		input: CloseEndpointInputSchemas.opportunitiesList,
		output: CloseEndpointOutputSchemas.opportunitiesList,
	},
	'opportunities.get': {
		input: CloseEndpointInputSchemas.opportunitiesGet,
		output: CloseEndpointOutputSchemas.opportunitiesGet,
	},
	'opportunities.create': {
		input: CloseEndpointInputSchemas.opportunitiesCreate,
		output: CloseEndpointOutputSchemas.opportunitiesCreate,
	},
	'opportunities.update': {
		input: CloseEndpointInputSchemas.opportunitiesUpdate,
		output: CloseEndpointOutputSchemas.opportunitiesUpdate,
	},
	'opportunities.delete': {
		input: CloseEndpointInputSchemas.opportunitiesDelete,
		output: CloseEndpointOutputSchemas.opportunitiesDelete,
	},
	'tasks.list': {
		input: CloseEndpointInputSchemas.tasksList,
		output: CloseEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: CloseEndpointInputSchemas.tasksGet,
		output: CloseEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: CloseEndpointInputSchemas.tasksCreate,
		output: CloseEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: CloseEndpointInputSchemas.tasksUpdate,
		output: CloseEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: CloseEndpointInputSchemas.tasksDelete,
		output: CloseEndpointOutputSchemas.tasksDelete,
	},
	'activities.listNotes': {
		input: CloseEndpointInputSchemas.activitiesListNotes,
		output: CloseEndpointOutputSchemas.activitiesListNotes,
	},
	'activities.createNote': {
		input: CloseEndpointInputSchemas.activitiesCreateNote,
		output: CloseEndpointOutputSchemas.activitiesCreateNote,
	},
	'activities.listCalls': {
		input: CloseEndpointInputSchemas.activitiesListCalls,
		output: CloseEndpointOutputSchemas.activitiesListCalls,
	},
	'activities.listEmails': {
		input: CloseEndpointInputSchemas.activitiesListEmails,
		output: CloseEndpointOutputSchemas.activitiesListEmails,
	},
	'users.getMe': {
		input: CloseEndpointInputSchemas.usersGetMe,
		output: CloseEndpointOutputSchemas.usersGetMe,
	},
	'users.list': {
		input: CloseEndpointInputSchemas.usersList,
		output: CloseEndpointOutputSchemas.usersList,
	},
	'customFields.listLead': {
		input: CloseEndpointInputSchemas.customFieldsListLead,
		output: CloseEndpointOutputSchemas.customFieldsListLead,
	},
	'customFields.listContact': {
		input: CloseEndpointInputSchemas.customFieldsListContact,
		output: CloseEndpointOutputSchemas.customFieldsListContact,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof closeEndpointsNested>;

const closeWebhookSchemas = {
	'lead.created': {
		description: 'A lead was created in Close CRM',
		payload: CloseLeadCreatedEventSchema,
		response: CloseLeadCreatedEventSchema,
	},
	'lead.updated': {
		description: 'A lead was updated in Close CRM',
		payload: CloseLeadUpdatedEventSchema,
		response: CloseLeadUpdatedEventSchema,
	},
	'contact.created': {
		description: 'A contact was created in Close CRM',
		payload: CloseContactCreatedEventSchema,
		response: CloseContactCreatedEventSchema,
	},
	'opportunity.created': {
		description: 'An opportunity was created in Close CRM',
		payload: CloseOpportunityCreatedEventSchema,
		response: CloseOpportunityCreatedEventSchema,
	},
	'task.created': {
		description: 'A task was created in Close CRM',
		payload: CloseTaskCreatedEventSchema,
		response: CloseTaskCreatedEventSchema,
	},
	'activityNote.created': {
		description: 'A note activity was created in Close CRM',
		payload: CloseActivityNoteCreatedEventSchema,
		response: CloseActivityNoteCreatedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof closeWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const closeEndpointMeta = {
	'leads.list': {
		riskLevel: 'read',
		description: 'List leads with optional filters',
	},
	'leads.get': { riskLevel: 'read', description: 'Retrieve a lead by ID' },
	'leads.create': { riskLevel: 'write', description: 'Create a new lead' },
	'leads.update': {
		riskLevel: 'write',
		description: 'Update an existing lead',
	},
	'leads.delete': {
		riskLevel: 'destructive',
		description: 'Delete a lead by ID',
	},
	'contacts.list': { riskLevel: 'read', description: 'List contacts' },
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve a contact by ID',
	},
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	'contacts.update': { riskLevel: 'write', description: 'Update a contact' },
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'opportunities.list': {
		riskLevel: 'read',
		description: 'List opportunities',
	},
	'opportunities.get': {
		riskLevel: 'read',
		description: 'Retrieve an opportunity by ID',
	},
	'opportunities.create': {
		riskLevel: 'write',
		description: 'Create an opportunity',
	},
	'opportunities.update': {
		riskLevel: 'write',
		description: 'Update an opportunity',
	},
	'opportunities.delete': {
		riskLevel: 'destructive',
		description: 'Delete an opportunity',
	},
	'tasks.list': { riskLevel: 'read', description: 'List tasks' },
	'tasks.get': { riskLevel: 'read', description: 'Retrieve a task by ID' },
	'tasks.create': { riskLevel: 'write', description: 'Create a task' },
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'tasks.delete': { riskLevel: 'destructive', description: 'Delete a task' },
	'activities.listNotes': {
		riskLevel: 'read',
		description: 'List note activities',
	},
	'activities.createNote': {
		riskLevel: 'write',
		description: 'Create a note activity',
	},
	'activities.listCalls': {
		riskLevel: 'read',
		description: 'List call activities',
	},
	'activities.listEmails': {
		riskLevel: 'read',
		description: 'List email activities',
	},
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get current authenticated user info',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users in the organization',
	},
	'customFields.listLead': {
		riskLevel: 'read',
		description: 'List lead custom fields',
	},
	'customFields.listContact': {
		riskLevel: 'read',
		description: 'List contact custom fields',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof closeEndpointsNested>;

export const closeAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
	oauth_2: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClosePlugin<T extends ClosePluginOptions> = CorsairPlugin<
	'close',
	typeof CloseSchema,
	typeof closeEndpointsNested,
	typeof closeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalClosePlugin = BaseClosePlugin<ClosePluginOptions>;

export type ExternalClosePlugin<T extends ClosePluginOptions> =
	BaseClosePlugin<T>;

export function close<const T extends ClosePluginOptions>(
	incomingOptions: ClosePluginOptions & T = {} as ClosePluginOptions & T,
): ExternalClosePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'close',
		authConfig: closeAuthConfig,
		schema: CloseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: closeEndpointsNested,
		webhooks: closeWebhooksNested,
		endpointMeta: closeEndpointMeta,
		endpointSchemas: closeEndpointSchemas,
		webhookSchemas: closeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-close-signature' in headers || 'close-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCloseTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCloseOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloseKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('close', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('close', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('close', ctx.authType ?? 'api_key');
		},
	} satisfies InternalClosePlugin;
}

export * from './endpoints/types';
export * from './schema';
export * from './webhooks/types';
