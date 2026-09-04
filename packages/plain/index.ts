import type {
	AuthTypes,
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
import {
	Companies,
	CustomerGroups,
	Customers,
	GraphQL,
	Threads,
	Tiers,
	Users,
} from './endpoints';
import type {
	PlainEndpointInputs,
	PlainEndpointOutputs,
} from './endpoints/types';
import {
	PlainEndpointInputSchemas,
	PlainEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PlainSchema } from './schema';

export type PlainPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPlainPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof plainEndpointsNested>;
};

export const plainAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type PlainContext = CorsairPluginContext<
	typeof PlainSchema,
	PlainPluginOptions,
	undefined,
	typeof plainAuthConfig
>;

export type PlainKeyBuilderContext = KeyBuilderContext<
	PlainPluginOptions,
	typeof plainAuthConfig
>;

type PlainEndpoint<K extends keyof PlainEndpointOutputs> = CorsairEndpoint<
	PlainContext,
	PlainEndpointInputs[K],
	PlainEndpointOutputs[K]
>;

export type PlainEndpoints = {
	getCustomerById: PlainEndpoint<'getCustomerById'>;
	getCustomerByEmail: PlainEndpoint<'getCustomerByEmail'>;
	getCustomers: PlainEndpoint<'getCustomers'>;
	upsertCustomer: PlainEndpoint<'upsertCustomer'>;
	deleteCustomer: PlainEndpoint<'deleteCustomer'>;
	createThread: PlainEndpoint<'createThread'>;
	getThreadById: PlainEndpoint<'getThreadById'>;
	queryThreads: PlainEndpoint<'queryThreads'>;
	listThreadsDeprecated: PlainEndpoint<'listThreadsDeprecated'>;
	fetchIssues: PlainEndpoint<'fetchIssues'>;
	sendMessage: PlainEndpoint<'sendMessage'>;
	updateThread: PlainEndpoint<'updateThread'>;
	getUserById: PlainEndpoint<'getUserById'>;
	deleteUser: PlainEndpoint<'deleteUser'>;
	fetchCompany: PlainEndpoint<'fetchCompany'>;
	updateCompany: PlainEndpoint<'updateCompany'>;
	fetchTier: PlainEndpoint<'fetchTier'>;
	listTiers: PlainEndpoint<'listTiers'>;
	createCustomerGroup: PlainEndpoint<'createCustomerGroup'>;
	listCustomerGroups: PlainEndpoint<'listCustomerGroups'>;
	addCustomerToGroup: PlainEndpoint<'addCustomerToGroup'>;
	removeCustomerFromGroup: PlainEndpoint<'removeCustomerFromGroup'>;
	runGraphqlQuery: PlainEndpoint<'runGraphqlQuery'>;
};

const plainEndpointsNested = {
	customers: {
		getById: Customers.getById,
		getByEmail: Customers.getByEmail,
		list: Customers.list,
		upsert: Customers.upsert,
		delete: Customers.delete,
	},
	threads: {
		create: Threads.create,
		getById: Threads.getById,
		query: Threads.query,
		listDeprecated: Threads.listDeprecated,
		fetchIssues: Threads.fetchIssues,
		sendMessage: Threads.sendMessage,
		update: Threads.update,
	},
	users: {
		getById: Users.getById,
		delete: Users.delete,
	},
	companies: {
		fetch: Companies.fetch,
		update: Companies.update,
	},
	tiers: {
		fetch: Tiers.fetch,
		list: Tiers.list,
	},
	customerGroups: {
		create: CustomerGroups.create,
		list: CustomerGroups.list,
		addCustomer: CustomerGroups.addCustomer,
		removeCustomer: CustomerGroups.removeCustomer,
	},
	graphql: {
		run: GraphQL.run,
	},
} as const;

const plainWebhooksNested = {} as const;

export const plainEndpointSchemas = {
	'customers.getById': {
		input: PlainEndpointInputSchemas.getCustomerById,
		output: PlainEndpointOutputSchemas.getCustomerById,
	},
	'customers.getByEmail': {
		input: PlainEndpointInputSchemas.getCustomerByEmail,
		output: PlainEndpointOutputSchemas.getCustomerByEmail,
	},
	'customers.list': {
		input: PlainEndpointInputSchemas.getCustomers,
		output: PlainEndpointOutputSchemas.getCustomers,
	},
	'customers.upsert': {
		input: PlainEndpointInputSchemas.upsertCustomer,
		output: PlainEndpointOutputSchemas.upsertCustomer,
	},
	'customers.delete': {
		input: PlainEndpointInputSchemas.deleteCustomer,
		output: PlainEndpointOutputSchemas.deleteCustomer,
	},
	'threads.create': {
		input: PlainEndpointInputSchemas.createThread,
		output: PlainEndpointOutputSchemas.createThread,
	},
	'threads.getById': {
		input: PlainEndpointInputSchemas.getThreadById,
		output: PlainEndpointOutputSchemas.getThreadById,
	},
	'threads.query': {
		input: PlainEndpointInputSchemas.queryThreads,
		output: PlainEndpointOutputSchemas.queryThreads,
	},
	'threads.listDeprecated': {
		input: PlainEndpointInputSchemas.listThreadsDeprecated,
		output: PlainEndpointOutputSchemas.listThreadsDeprecated,
	},
	'threads.fetchIssues': {
		input: PlainEndpointInputSchemas.fetchIssues,
		output: PlainEndpointOutputSchemas.fetchIssues,
	},
	'threads.sendMessage': {
		input: PlainEndpointInputSchemas.sendMessage,
		output: PlainEndpointOutputSchemas.sendMessage,
	},
	'threads.update': {
		input: PlainEndpointInputSchemas.updateThread,
		output: PlainEndpointOutputSchemas.updateThread,
	},
	'users.getById': {
		input: PlainEndpointInputSchemas.getUserById,
		output: PlainEndpointOutputSchemas.getUserById,
	},
	'users.delete': {
		input: PlainEndpointInputSchemas.deleteUser,
		output: PlainEndpointOutputSchemas.deleteUser,
	},
	'companies.fetch': {
		input: PlainEndpointInputSchemas.fetchCompany,
		output: PlainEndpointOutputSchemas.fetchCompany,
	},
	'companies.update': {
		input: PlainEndpointInputSchemas.updateCompany,
		output: PlainEndpointOutputSchemas.updateCompany,
	},
	'tiers.fetch': {
		input: PlainEndpointInputSchemas.fetchTier,
		output: PlainEndpointOutputSchemas.fetchTier,
	},
	'tiers.list': {
		input: PlainEndpointInputSchemas.listTiers,
		output: PlainEndpointOutputSchemas.listTiers,
	},
	'customerGroups.create': {
		input: PlainEndpointInputSchemas.createCustomerGroup,
		output: PlainEndpointOutputSchemas.createCustomerGroup,
	},
	'customerGroups.list': {
		input: PlainEndpointInputSchemas.listCustomerGroups,
		output: PlainEndpointOutputSchemas.listCustomerGroups,
	},
	'customerGroups.addCustomer': {
		input: PlainEndpointInputSchemas.addCustomerToGroup,
		output: PlainEndpointOutputSchemas.addCustomerToGroup,
	},
	'customerGroups.removeCustomer': {
		input: PlainEndpointInputSchemas.removeCustomerFromGroup,
		output: PlainEndpointOutputSchemas.removeCustomerFromGroup,
	},
	'graphql.run': {
		input: PlainEndpointInputSchemas.runGraphqlQuery,
		output: PlainEndpointOutputSchemas.runGraphqlQuery,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof plainEndpointsNested>;

const plainEndpointMeta = {
	'customers.getById': {
		riskLevel: 'read',
		description: 'Fetch a customer by Plain customer ID.',
	},
	'customers.getByEmail': {
		riskLevel: 'read',
		description: 'Fetch a customer by email address.',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers with optional filters and cursor pagination (first/after or last/before).',
	},
	'customers.upsert': {
		riskLevel: 'write',
		description: 'Create or update a customer by identifier.',
	},
	'customers.delete': {
		riskLevel: 'write',
		description: 'Delete a customer asynchronously.',
	},
	'threads.create': {
		riskLevel: 'write',
		description: 'Create a thread for a customer.',
	},
	'threads.getById': {
		riskLevel: 'read',
		description: 'Fetch a thread by Plain thread ID.',
	},
	'threads.query': {
		riskLevel: 'read',
		description: 'List threads with filters, sort, and cursor pagination.',
	},
	'threads.listDeprecated': {
		riskLevel: 'read',
		description: 'Deprecated threads listing operation; use threads.query.',
	},
	'threads.fetchIssues': {
		riskLevel: 'read',
		description:
			'Fetch external thread links for a customer and flatten as issue records.',
	},
	'threads.sendMessage': {
		riskLevel: 'write',
		description: 'Reply to a thread via Plain routing.',
	},
	'threads.update': {
		riskLevel: 'write',
		description: 'Update a thread title.',
	},
	'users.getById': {
		riskLevel: 'read',
		description: 'Fetch a workspace user by ID.',
	},
	'users.delete': {
		riskLevel: 'write',
		description: 'Delete a workspace user.',
	},
	'companies.fetch': {
		riskLevel: 'read',
		description: 'Fetch a company by ID.',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Create or update a company by ID or domain.',
	},
	'tiers.fetch': {
		riskLevel: 'read',
		description: 'Fetch a tier by ID.',
	},
	'tiers.list': {
		riskLevel: 'read',
		description: 'List tiers with cursor pagination.',
	},
	'customerGroups.create': {
		riskLevel: 'write',
		description: 'Create a customer group.',
	},
	'customerGroups.list': {
		riskLevel: 'read',
		description: 'List customer groups with cursor pagination.',
	},
	'customerGroups.addCustomer': {
		riskLevel: 'write',
		description: 'Add a customer to one or more customer groups.',
	},
	'customerGroups.removeCustomer': {
		riskLevel: 'write',
		description: 'Remove a customer from one or more customer groups.',
	},
	'graphql.run': {
		riskLevel: 'write',
		description: 'Run an arbitrary GraphQL query or mutation.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof plainEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export type PlainBoundEndpoints = BindEndpoints<typeof plainEndpointsNested>;

export type BasePlainPlugin<T extends PlainPluginOptions> = CorsairPlugin<
	'plain',
	typeof PlainSchema,
	typeof plainEndpointsNested,
	typeof plainWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof plainAuthConfig
>;

export type InternalPlainPlugin = BasePlainPlugin<PlainPluginOptions>;

export type ExternalPlainPlugin<T extends PlainPluginOptions> =
	BasePlainPlugin<T>;

export function plain<const T extends PlainPluginOptions>(
	incomingOptions: PlainPluginOptions & T = {} as PlainPluginOptions & T,
): ExternalPlainPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'plain',
		authConfig: plainAuthConfig,
		schema: PlainSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: plainEndpointsNested,
		webhooks: plainWebhooksNested,
		endpointMeta: plainEndpointMeta,
		endpointSchemas: plainEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PlainKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('plain', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('plain', 'api_key');
		},
	} satisfies InternalPlainPlugin;
}

export type {
	AddCustomerToGroupInput,
	AddCustomerToGroupResponse,
	CreateCustomerGroupInput,
	CreateCustomerGroupResponse,
	CreateThreadInput,
	CreateThreadResponse,
	DeleteCustomerInput,
	DeleteCustomerResponse,
	DeleteUserInput,
	DeleteUserResponse,
	FetchCompanyInput,
	FetchCompanyResponse,
	FetchIssuesInput,
	FetchIssuesResponse,
	FetchTierInput,
	FetchTierResponse,
	GetCustomerByEmailInput,
	GetCustomerByEmailResponse,
	GetCustomerByIdInput,
	GetCustomerByIdResponse,
	GetCustomersInput,
	GetCustomersResponse,
	GetThreadByIdInput,
	GetThreadByIdResponse,
	GetUserByIdInput,
	GetUserByIdResponse,
	ListCustomerGroupsInput,
	ListCustomerGroupsResponse,
	ListTiersInput,
	ListTiersResponse,
	PlainEndpointInputs,
	PlainEndpointOutputs,
	QueryThreadsInput,
	QueryThreadsResponse,
	RemoveCustomerFromGroupInput,
	RemoveCustomerFromGroupResponse,
	RunGraphqlQueryInput,
	RunGraphqlQueryResponse,
	SendMessageInput,
	SendMessageResponse,
	UpdateCompanyInput,
	UpdateCompanyResponse,
	UpdateThreadInput,
	UpdateThreadResponse,
	UpsertCustomerInput,
	UpsertCustomerResponse,
} from './endpoints/types';
