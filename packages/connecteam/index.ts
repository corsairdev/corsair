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
	archiveUsers,
	createUsers,
	generateUploadUrl,
	getChat,
	getCustomFieldCategories,
	getCustomFields,
	getForms,
	getJobs,
	getPerformanceIndicators,
	getPolicyTypes,
	getPublishers,
	getSchedulers,
	getSmartGroups,
	getTaskBoards,
	getUsers,
	listMe,
} from './endpoints';
import type {
	ConnecteamEndpointInputs,
	ConnecteamEndpointOutputs,
} from './endpoints/types';
import {
	ConnecteamEndpointInputSchemas,
	ConnecteamEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ConnecteamSchema } from './schema';

export type ConnecteamPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalConnecteamPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof connecteamEndpointsNested>;
};

export type ConnecteamContext = CorsairPluginContext<
	typeof ConnecteamSchema,
	ConnecteamPluginOptions
>;

export type ConnecteamKeyBuilderContext =
	KeyBuilderContext<ConnecteamPluginOptions>;

export type ConnecteamBoundEndpoints = BindEndpoints<
	typeof connecteamEndpointsNested
>;

type ConnecteamEndpoint<K extends keyof ConnecteamEndpointOutputs> =
	CorsairEndpoint<
		ConnecteamContext,
		ConnecteamEndpointInputs[K],
		ConnecteamEndpointOutputs[K]
	>;

export type ConnecteamEndpoints = {
	listMe: ConnecteamEndpoint<'listMe'>;
	getUsers: ConnecteamEndpoint<'getUsers'>;
	createUsers: ConnecteamEndpoint<'createUsers'>;
	archiveUsers: ConnecteamEndpoint<'archiveUsers'>;
	generateUploadUrl: ConnecteamEndpoint<'generateUploadUrl'>;
	getChat: ConnecteamEndpoint<'getChat'>;
	getCustomFieldCategories: ConnecteamEndpoint<'getCustomFieldCategories'>;
	getCustomFields: ConnecteamEndpoint<'getCustomFields'>;
	getForms: ConnecteamEndpoint<'getForms'>;
	getJobs: ConnecteamEndpoint<'getJobs'>;
	getPerformanceIndicators: ConnecteamEndpoint<'getPerformanceIndicators'>;
	getPolicyTypes: ConnecteamEndpoint<'getPolicyTypes'>;
	getPublishers: ConnecteamEndpoint<'getPublishers'>;
	getSchedulers: ConnecteamEndpoint<'getSchedulers'>;
	getSmartGroups: ConnecteamEndpoint<'getSmartGroups'>;
	getTaskBoards: ConnecteamEndpoint<'getTaskBoards'>;
};

const connecteamEndpointsNested = {
	me: { list: listMe },
	users: {
		get: getUsers,
		create: createUsers,
		archive: archiveUsers,
	},
	attachments: { generateUploadUrl },
	chat: { get: getChat },
	customFieldCategories: { get: getCustomFieldCategories },
	customFields: { get: getCustomFields },
	forms: { get: getForms },
	jobs: { get: getJobs },
	performanceIndicators: { get: getPerformanceIndicators },
	policyTypes: { get: getPolicyTypes },
	publishers: { get: getPublishers },
	schedulers: { get: getSchedulers },
	smartGroups: { get: getSmartGroups },
	taskBoards: { get: getTaskBoards },
} as const;

export const connecteamEndpointSchemas = {
	'me.list': {
		input: ConnecteamEndpointInputSchemas.listMe,
		output: ConnecteamEndpointOutputSchemas.listMe,
	},
	'users.get': {
		input: ConnecteamEndpointInputSchemas.getUsers,
		output: ConnecteamEndpointOutputSchemas.getUsers,
	},
	'users.create': {
		input: ConnecteamEndpointInputSchemas.createUsers,
		output: ConnecteamEndpointOutputSchemas.createUsers,
	},
	'users.archive': {
		input: ConnecteamEndpointInputSchemas.archiveUsers,
		output: ConnecteamEndpointOutputSchemas.archiveUsers,
	},
	'attachments.generateUploadUrl': {
		input: ConnecteamEndpointInputSchemas.generateUploadUrl,
		output: ConnecteamEndpointOutputSchemas.generateUploadUrl,
	},
	'chat.get': {
		input: ConnecteamEndpointInputSchemas.getChat,
		output: ConnecteamEndpointOutputSchemas.getChat,
	},
	'customFieldCategories.get': {
		input: ConnecteamEndpointInputSchemas.getCustomFieldCategories,
		output: ConnecteamEndpointOutputSchemas.getCustomFieldCategories,
	},
	'customFields.get': {
		input: ConnecteamEndpointInputSchemas.getCustomFields,
		output: ConnecteamEndpointOutputSchemas.getCustomFields,
	},
	'forms.get': {
		input: ConnecteamEndpointInputSchemas.getForms,
		output: ConnecteamEndpointOutputSchemas.getForms,
	},
	'jobs.get': {
		input: ConnecteamEndpointInputSchemas.getJobs,
		output: ConnecteamEndpointOutputSchemas.getJobs,
	},
	'performanceIndicators.get': {
		input: ConnecteamEndpointInputSchemas.getPerformanceIndicators,
		output: ConnecteamEndpointOutputSchemas.getPerformanceIndicators,
	},
	'policyTypes.get': {
		input: ConnecteamEndpointInputSchemas.getPolicyTypes,
		output: ConnecteamEndpointOutputSchemas.getPolicyTypes,
	},
	'publishers.get': {
		input: ConnecteamEndpointInputSchemas.getPublishers,
		output: ConnecteamEndpointOutputSchemas.getPublishers,
	},
	'schedulers.get': {
		input: ConnecteamEndpointInputSchemas.getSchedulers,
		output: ConnecteamEndpointOutputSchemas.getSchedulers,
	},
	'smartGroups.get': {
		input: ConnecteamEndpointInputSchemas.getSmartGroups,
		output: ConnecteamEndpointOutputSchemas.getSmartGroups,
	},
	'taskBoards.get': {
		input: ConnecteamEndpointInputSchemas.getTaskBoards,
		output: ConnecteamEndpointOutputSchemas.getTaskBoards,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof connecteamEndpointsNested
>;

const connecteamEndpointMeta = {
	'me.list': {
		riskLevel: 'read',
		description: 'Get Connecteam account company name and company ID',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'List Connecteam users with optional filters and pagination',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create users in Connecteam',
	},
	'users.archive': {
		riskLevel: 'write',
		description: 'Archive Connecteam users by ID without deleting records',
	},
	'attachments.generateUploadUrl': {
		riskLevel: 'write',
		description: 'Generate a time-limited pre-signed file upload URL',
	},
	'chat.get': {
		riskLevel: 'read',
		description: 'List team chats and channels',
	},
	'customFieldCategories.get': {
		riskLevel: 'read',
		description: 'List custom field categories',
	},
	'customFields.get': {
		riskLevel: 'read',
		description: 'List custom fields with optional filters and pagination',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'List form definitions',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'List jobs for a scheduler or time clock instance',
	},
	'performanceIndicators.get': {
		riskLevel: 'read',
		description: 'List performance metric indicators',
	},
	'policyTypes.get': {
		riskLevel: 'read',
		description: 'List time-off policy types',
	},
	'publishers.get': {
		riskLevel: 'read',
		description: 'List custom publishers',
	},
	'schedulers.get': {
		riskLevel: 'read',
		description: 'List job schedulers',
	},
	'smartGroups.get': {
		riskLevel: 'read',
		description: 'List smart groups',
	},
	'taskBoards.get': {
		riskLevel: 'read',
		description: 'List task boards',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof connecteamEndpointsNested
>;

export const connecteamAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key';

export type BaseConnecteamPlugin<T extends ConnecteamPluginOptions> =
	CorsairPlugin<
		'connecteam',
		typeof ConnecteamSchema,
		typeof connecteamEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalConnecteamPlugin =
	BaseConnecteamPlugin<ConnecteamPluginOptions>;

export type ExternalConnecteamPlugin<T extends ConnecteamPluginOptions> =
	BaseConnecteamPlugin<T>;

export function connecteam<const T extends ConnecteamPluginOptions>(
	incomingOptions: ConnecteamPluginOptions & T = {} as ConnecteamPluginOptions &
		T,
): ExternalConnecteamPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'connecteam',
		authConfig: connecteamAuthConfig,
		schema: ConnecteamSchema,
		options,
		hooks: options.hooks,
		endpoints: connecteamEndpointsNested,
		webhooks: {},
		endpointMeta: connecteamEndpointMeta,
		endpointSchemas: connecteamEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ConnecteamKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('connecteam', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('connecteam', 'api_key');
		},
	} satisfies InternalConnecteamPlugin;
}

export type { ConnecteamEndpointInputs, ConnecteamEndpointOutputs };
