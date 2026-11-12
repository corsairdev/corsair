import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Companies, Contacts, Leads, Tasks } from './endpoints';
import type {
	KommoEndpointInputs,
	KommoEndpointOutputs,
} from './endpoints/types';
import {
	KommoEndpointInputSchemas,
	KommoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KommoSchema } from './schema';

export type KommoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The account subdomain: `acme` for `acme.kommo.com`. Every account is served
	 * from its own host, so a call without one cannot be addressed. Falls back to
	 * the stored credential.
	 */
	subdomain?: string;
	hooks?: InternalKommoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kommoEndpointsNested>;
};

/**
 * The subdomain is an account-level field, so the key manager generates
 * `get_subdomain()` for it. `get_integration_credentials` is only installed for
 * `oauth_2`, which this plugin does not use.
 */
export const kommoAuthConfig = {
	api_key: {
		account: ['subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KommoContext = CorsairPluginContext<
	typeof KommoSchema,
	KommoPluginOptions,
	undefined,
	typeof kommoAuthConfig
>;

export type KommoKeyBuilderContext = KeyBuilderContext<
	KommoPluginOptions,
	typeof kommoAuthConfig
>;

export type KommoBoundEndpoints = BindEndpoints<typeof kommoEndpointsNested>;

type KommoEndpoint<K extends keyof KommoEndpointOutputs> = CorsairEndpoint<
	KommoContext,
	KommoEndpointInputs[K],
	KommoEndpointOutputs[K]
>;

export type KommoEndpoints = {
	accountGet: KommoEndpoint<'accountGet'>;
	leadsList: KommoEndpoint<'leadsList'>;
	leadsGet: KommoEndpoint<'leadsGet'>;
	leadsCreate: KommoEndpoint<'leadsCreate'>;
	leadsUpdate: KommoEndpoint<'leadsUpdate'>;
	contactsList: KommoEndpoint<'contactsList'>;
	contactsGet: KommoEndpoint<'contactsGet'>;
	contactsCreate: KommoEndpoint<'contactsCreate'>;
	contactsUpdate: KommoEndpoint<'contactsUpdate'>;
	companiesList: KommoEndpoint<'companiesList'>;
	tasksList: KommoEndpoint<'tasksList'>;
	tasksCreate: KommoEndpoint<'tasksCreate'>;
	pipelinesList: KommoEndpoint<'pipelinesList'>;
	usersList: KommoEndpoint<'usersList'>;
};

const kommoEndpointsNested = {
	account: {
		get: Account.account,
	},
	leads: {
		list: Leads.list,
		get: Leads.get,
		create: Leads.create,
		update: Leads.update,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
	},
	companies: {
		list: Companies.list,
	},
	tasks: {
		list: Tasks.list,
		create: Tasks.create,
	},
	pipelines: {
		list: Account.pipelines,
	},
	users: {
		list: Account.users,
	},
} as const;

export const kommoEndpointSchemas = {
	'account.get': {
		input: KommoEndpointInputSchemas.accountGet,
		output: KommoEndpointOutputSchemas.accountGet,
	},
	'leads.list': {
		input: KommoEndpointInputSchemas.leadsList,
		output: KommoEndpointOutputSchemas.leadsList,
	},
	'leads.get': {
		input: KommoEndpointInputSchemas.leadsGet,
		output: KommoEndpointOutputSchemas.leadsGet,
	},
	'leads.create': {
		input: KommoEndpointInputSchemas.leadsCreate,
		output: KommoEndpointOutputSchemas.leadsCreate,
	},
	'leads.update': {
		input: KommoEndpointInputSchemas.leadsUpdate,
		output: KommoEndpointOutputSchemas.leadsUpdate,
	},
	'contacts.list': {
		input: KommoEndpointInputSchemas.contactsList,
		output: KommoEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: KommoEndpointInputSchemas.contactsGet,
		output: KommoEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: KommoEndpointInputSchemas.contactsCreate,
		output: KommoEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: KommoEndpointInputSchemas.contactsUpdate,
		output: KommoEndpointOutputSchemas.contactsUpdate,
	},
	'companies.list': {
		input: KommoEndpointInputSchemas.companiesList,
		output: KommoEndpointOutputSchemas.companiesList,
	},
	'tasks.list': {
		input: KommoEndpointInputSchemas.tasksList,
		output: KommoEndpointOutputSchemas.tasksList,
	},
	'tasks.create': {
		input: KommoEndpointInputSchemas.tasksCreate,
		output: KommoEndpointOutputSchemas.tasksCreate,
	},
	'pipelines.list': {
		input: KommoEndpointInputSchemas.pipelinesList,
		output: KommoEndpointOutputSchemas.pipelinesList,
	},
	'users.list': {
		input: KommoEndpointInputSchemas.usersList,
		output: KommoEndpointOutputSchemas.usersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof kommoEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const kommoEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'The account itself: its name, subdomain, currency and country',
	},
	'leads.list': {
		riskLevel: 'read',
		description:
			'Leads by pipeline, stage, owner or date, paged 250 at a time; `next_page` says whether another exists',
	},
	'leads.get': {
		riskLevel: 'read',
		description:
			'One lead with its custom field values and, on request, its contacts, loss reason and source',
	},
	'leads.create': {
		riskLevel: 'write',
		description:
			'Create up to 250 leads in one request, each with its price, stage, pipeline and custom fields',
	},
	'leads.update': {
		riskLevel: 'write',
		description:
			'Change fields on one or more leads, each named by its `id`; a field left out is untouched',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'Contacts by owner or update date, paged, optionally with their leads',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'One contact with its custom field values',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create contacts, each with a name or a first and last name, and custom fields',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Change fields on one or more contacts, each named by its `id`',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'Companies by owner or update date, paged',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'Tasks by entity, owner or completion, paged; the deadline is a Unix timestamp',
	},
	'tasks.create': {
		riskLevel: 'write',
		description:
			'Create tasks against a lead, contact or company; every task needs a `complete_till` deadline',
	},
	'pipelines.list': {
		riskLevel: 'read',
		description:
			'The lead pipelines with their stages, which is where a lead’s `pipeline_id` and `status_id` come from',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'The account’s users, for looking up a responsible user ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kommoEndpointsNested>;

export type BaseKommoPlugin<T extends KommoPluginOptions> = CorsairPlugin<
	'kommo',
	typeof KommoSchema,
	typeof kommoEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof kommoAuthConfig
>;

export type InternalKommoPlugin = BaseKommoPlugin<KommoPluginOptions>;

export type ExternalKommoPlugin<T extends KommoPluginOptions> =
	BaseKommoPlugin<T>;

export function kommo<const T extends KommoPluginOptions>(
	incomingOptions: KommoPluginOptions & T = {} as KommoPluginOptions & T,
): ExternalKommoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kommo',
		schema: KommoSchema,
		options,
		hooks: options.hooks,
		endpoints: kommoEndpointsNested,
		webhooks: {},
		authConfig: kommoAuthConfig,
		endpointMeta: kommoEndpointMeta,
		endpointSchemas: kommoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KommoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('kommo', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKommoPlugin;
}

export { KommoAPIError } from './client';

export type {
	AccountGetInput,
	AccountResponse,
	CompaniesListInput,
	CompaniesListResponse,
	ContactGetInput,
	ContactResponse,
	ContactsCreateInput,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsWriteResponse,
	KommoCompany,
	KommoContact,
	KommoCustomFieldValue,
	KommoLead,
	KommoPipeline,
	KommoStage,
	KommoTask,
	KommoUser,
	LeadGetInput,
	LeadResponse,
	LeadsCreateInput,
	LeadsListInput,
	LeadsListResponse,
	LeadsUpdateInput,
	LeadsWriteResponse,
	PipelinesListInput,
	PipelinesListResponse,
	TasksCreateInput,
	TasksListInput,
	TasksListResponse,
	TasksWriteResponse,
	UsersListInput,
	UsersListResponse,
} from './endpoints/types';
