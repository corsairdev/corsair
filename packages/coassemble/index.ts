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

import { getClients, getCourses, getTrackings, getUsers } from './endpoints';

import type {
	CoassembleEndpointInputs,
	CoassembleEndpointOutputs,
} from './endpoints/types';

import {
	CoassembleEndpointInputSchemas,
	CoassembleEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { CoassembleSchema } from './schema';

export type CoassemblePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	workspaceId: string;
	hooks?: InternalCoassemblePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof coassembleEndpointsNested>;
};

export type CoassembleContext = CorsairPluginContext<
	typeof CoassembleSchema,
	CoassemblePluginOptions,
	undefined,
	typeof coassembleAuthConfig
>;

export type CoassembleKeyBuilderContext = KeyBuilderContext<
	CoassemblePluginOptions,
	typeof coassembleAuthConfig
>;

export type CoassembleBoundEndpoints = BindEndpoints<
	typeof coassembleEndpointsNested
>;

type CoassembleEndpoint<K extends keyof CoassembleEndpointOutputs> =
	CorsairEndpoint<
		CoassembleContext,
		CoassembleEndpointInputs[K],
		CoassembleEndpointOutputs[K]
	>;

export type CoassembleEndpoints = {
	getClients: CoassembleEndpoint<'getClients'>;
	getCourses: CoassembleEndpoint<'getCourses'>;
	getTrackings: CoassembleEndpoint<'getTrackings'>;
	getUsers: CoassembleEndpoint<'getUsers'>;
};

const coassembleEndpointsNested = {
	clients: {
		get: getClients,
	},
	courses: {
		get: getCourses,
	},
	trackings: {
		get: getTrackings,
	},
	users: {
		get: getUsers,
	},
} as const;

export const coassembleEndpointSchemas = {
	'clients.get': {
		input: CoassembleEndpointInputSchemas.getClients,
		output: CoassembleEndpointOutputSchemas.getClients,
	},
	'courses.get': {
		input: CoassembleEndpointInputSchemas.getCourses,
		output: CoassembleEndpointOutputSchemas.getCourses,
	},
	'trackings.get': {
		input: CoassembleEndpointInputSchemas.getTrackings,
		output: CoassembleEndpointOutputSchemas.getTrackings,
	},
	'users.get': {
		input: CoassembleEndpointInputSchemas.getUsers,
		output: CoassembleEndpointOutputSchemas.getUsers,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof coassembleEndpointsNested
>;

const coassembleEndpointMeta = {
	'clients.get': {
		riskLevel: 'read',
		description: 'Get a paginated list of Coassemble clients',
	},
	'courses.get': {
		riskLevel: 'read',
		description: 'Get a paginated list of Coassemble courses',
	},
	'trackings.get': {
		riskLevel: 'read',
		description: 'Get learner progress tracking for a Coassemble course',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a paginated list of Coassemble users',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof coassembleEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const coassembleAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

const coassembleWebhooksNested = {} as const;

export type BaseCoassemblePlugin<T extends CoassemblePluginOptions> =
	CorsairPlugin<
		'coassemble',
		typeof CoassembleSchema,
		typeof coassembleEndpointsNested,
		typeof coassembleWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof coassembleAuthConfig
	>;

export type InternalCoassemblePlugin =
	BaseCoassemblePlugin<CoassemblePluginOptions>;

export type ExternalCoassemblePlugin<T extends CoassemblePluginOptions> =
	BaseCoassemblePlugin<T>;

export function coassemble<const T extends CoassemblePluginOptions>(
	incomingOptions: CoassemblePluginOptions & T,
): ExternalCoassemblePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'coassemble',
		authConfig: coassembleAuthConfig,
		schema: CoassembleSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: coassembleEndpointsNested,
		webhooks: coassembleWebhooksNested,
		endpointMeta: coassembleEndpointMeta,
		endpointSchemas: coassembleEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CoassembleKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await ctx.keys?.get_api_key();

				if (!res) {
					throw new AuthMissingError('coassemble', 'api_key');
				}

				return res;
			}

			return '';
		},
	} satisfies InternalCoassemblePlugin;
}

export type {
	CoassembleEndpointInputs,
	CoassembleEndpointOutputs,
	GetClientsInput,
	GetClientsResponse,
	GetCoursesInput,
	GetCoursesResponse,
	GetTrackingsInput,
	GetTrackingsResponse,
	GetUsersInput,
	GetUsersResponse,
} from './endpoints/types';

export {
	GetClientsInputSchema,
	GetClientsResponseSchema,
	GetCoursesInputSchema,
	GetCoursesResponseSchema,
	GetTrackingsInputSchema,
	GetTrackingsResponseSchema,
	GetUsersInputSchema,
	GetUsersResponseSchema,
} from './endpoints/types';
