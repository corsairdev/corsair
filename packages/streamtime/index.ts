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
import { Organisation, Roles, Users } from './endpoints';
import type {
	StreamtimeEndpointInputs,
	StreamtimeEndpointOutputs,
} from './endpoints/types';
import {
	StreamtimeEndpointInputSchemas,
	StreamtimeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StreamtimeSchema } from './schema';

export type StreamtimePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof streamtimeEndpointsNested>;
};

export type StreamtimeContext = CorsairPluginContext<
	typeof StreamtimeSchema,
	StreamtimePluginOptions
>;

export type StreamtimeKeyBuilderContext =
	KeyBuilderContext<StreamtimePluginOptions>;

export type StreamtimeBoundEndpoints = BindEndpoints<
	typeof streamtimeEndpointsNested
>;

type StreamtimeEndpoint<K extends keyof StreamtimeEndpointOutputs> =
	CorsairEndpoint<
		StreamtimeContext,
		StreamtimeEndpointInputs[K],
		StreamtimeEndpointOutputs[K]
	>;

export type StreamtimeEndpoints = {
	getOrganisation: StreamtimeEndpoint<'getOrganisation'>;
	getRole: StreamtimeEndpoint<'getRole'>;
	listRoles: StreamtimeEndpoint<'listRoles'>;
	listSavedSegments: StreamtimeEndpoint<'listSavedSegments'>;
};

const streamtimeEndpointsNested = {
	organisation: {
		get: Organisation.get,
	},
	roles: {
		get: Roles.get,
		list: Roles.list,
	},
	users: {
		listSavedSegments: Users.listSavedSegments,
	},
} as const;

export const streamtimeEndpointSchemas = {
	'organisation.get': {
		input: StreamtimeEndpointInputSchemas.getOrganisation,
		output: StreamtimeEndpointOutputSchemas.getOrganisation,
	},
	'roles.get': {
		input: StreamtimeEndpointInputSchemas.getRole,
		output: StreamtimeEndpointOutputSchemas.getRole,
	},
	'roles.list': {
		input: StreamtimeEndpointInputSchemas.listRoles,
		output: StreamtimeEndpointOutputSchemas.listRoles,
	},
	'users.listSavedSegments': {
		input: StreamtimeEndpointInputSchemas.listSavedSegments,
		output: StreamtimeEndpointOutputSchemas.listSavedSegments,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof streamtimeEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const streamtimeEndpointMeta = {
	'organisation.get': {
		riskLevel: 'read',
		description: "Retrieve the organisation's details",
	},
	'roles.get': {
		riskLevel: 'read',
		description: 'Retrieve a role by ID',
	},
	'roles.list': {
		riskLevel: 'read',
		description: 'Retrieve all roles in the organisation',
	},
	'users.listSavedSegments': {
		riskLevel: 'read',
		description: 'Retrieve saved segments for a specific user',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof streamtimeEndpointsNested
>;

export const streamtimeAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseStreamtimePlugin<T extends StreamtimePluginOptions> =
	CorsairPlugin<
		'streamtime',
		typeof StreamtimeSchema,
		typeof streamtimeEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalStreamtimePlugin =
	BaseStreamtimePlugin<StreamtimePluginOptions>;

export type ExternalStreamtimePlugin<T extends StreamtimePluginOptions> =
	BaseStreamtimePlugin<T>;

export function streamtime<const T extends StreamtimePluginOptions>(
	incomingOptions: StreamtimePluginOptions & T = {} as StreamtimePluginOptions &
		T,
): ExternalStreamtimePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'streamtime',
		authConfig: streamtimeAuthConfig,
		schema: StreamtimeSchema,
		options: options,
		endpoints: streamtimeEndpointsNested,
		webhooks: {},
		endpointMeta: streamtimeEndpointMeta,
		endpointSchemas: streamtimeEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StreamtimeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('streamtime', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('streamtime', 'api_key');
		},
	} satisfies InternalStreamtimePlugin;
}

export type {
	GetOrganisationInput,
	GetOrganisationResponse,
	GetRoleInput,
	GetRoleResponse,
	ListRolesInput,
	ListRolesResponse,
	ListSavedSegmentsInput,
	ListSavedSegmentsResponse,
	StreamtimeEndpointInputs,
	StreamtimeEndpointOutputs,
} from './endpoints/types';
