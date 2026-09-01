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
import { Users } from './endpoints';
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
	authType?: PickAuth<'api_key' | 'oauth_2'>;
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
	getUsers: ConnecteamEndpoint<'getUsers'>;
	getUserById: ConnecteamEndpoint<'getUserById'>;
	archiveUsers: ConnecteamEndpoint<'archiveUsers'>;
	createUsers: ConnecteamEndpoint<'createUsers'>;
	updateUsers: ConnecteamEndpoint<'updateUsers'>;
};

const connecteamEndpointsNested = {
	users: {
		get: Users.get,
		getById: Users.getById,
		archive: Users.archive,
		create: Users.create,
		update: Users.update,
	},
} as const;

export const connecteamEndpointSchemas = {
	'users.get': {
		input: ConnecteamEndpointInputSchemas.getUsers,
		output: ConnecteamEndpointOutputSchemas.getUsers,
	},
	'users.getById': {
		input: ConnecteamEndpointInputSchemas.getUserById,
		output: ConnecteamEndpointOutputSchemas.getUserById,
	},
	'users.archive': {
		input: ConnecteamEndpointInputSchemas.archiveUsers,
		output: ConnecteamEndpointOutputSchemas.archiveUsers,
	},
	'users.create': {
		input: ConnecteamEndpointInputSchemas.createUsers,
		output: ConnecteamEndpointOutputSchemas.createUsers,
	},
	'users.update': {
		input: ConnecteamEndpointInputSchemas.updateUsers,
		output: ConnecteamEndpointOutputSchemas.updateUsers,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof connecteamEndpointsNested
>;

const connecteamEndpointMeta = {
	'users.get': {
		riskLevel: 'read',
		description: 'Get users from Connecteam',
	},
	'users.getById': {
		riskLevel: 'read',
		description: 'Get a Connecteam user by ID',
	},
	'users.archive': {
		riskLevel: 'write',
		description: 'Archive or delete users in Connecteam',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create users in Connecteam',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update users in Connecteam',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof connecteamEndpointsNested
>;

export const connecteamAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
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
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalConnecteamPlugin;
}

export type {
	ArchiveUsersInput,
	ArchiveUsersResponse,
	CreateUsersInput,
	CreateUsersResponse,
	GetUserByIdInput,
	GetUserByIdResponse,
	GetUsersInput,
	GetUsersResponse,
	UpdateUsersInput,
	UpdateUsersResponse,
} from './endpoints/types';
