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
import { Session } from './endpoints';
import type {
	DevinMcpEndpointInputs,
	DevinMcpEndpointOutputs,
} from './endpoints/types';
import {
	DevinMcpEndpointInputSchemas,
	DevinMcpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DevinMcpSchema } from './schema';

export type DevinMcpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDevinMcpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof devinMcpEndpointsNested>;
};

export type DevinMcpContext = CorsairPluginContext<
	typeof DevinMcpSchema,
	DevinMcpPluginOptions
>;

export type DevinMcpKeyBuilderContext =
	KeyBuilderContext<DevinMcpPluginOptions>;

export type DevinMcpBoundEndpoints = BindEndpoints<
	typeof devinMcpEndpointsNested
>;

type DevinMcpEndpoint<K extends keyof DevinMcpEndpointOutputs> =
	CorsairEndpoint<
		DevinMcpContext,
		DevinMcpEndpointInputs[K],
		DevinMcpEndpointOutputs[K]
	>;

export type DevinMcpEndpoints = {
	createSession: DevinMcpEndpoint<'createSession'>;
	getSession: DevinMcpEndpoint<'getSession'>;
	listSessions: DevinMcpEndpoint<'listSessions'>;
	sendMessage: DevinMcpEndpoint<'sendMessage'>;
};

const devinMcpEndpointsNested = {
	session: {
		create: Session.create,
		get: Session.get,
		list: Session.list,
		sendMessage: Session.sendMessage,
	},
} as const;

export const devinMcpEndpointSchemas = {
	'session.create': {
		input: DevinMcpEndpointInputSchemas.createSession,
		output: DevinMcpEndpointOutputSchemas.createSession,
	},
	'session.get': {
		input: DevinMcpEndpointInputSchemas.getSession,
		output: DevinMcpEndpointOutputSchemas.getSession,
	},
	'session.list': {
		input: DevinMcpEndpointInputSchemas.listSessions,
		output: DevinMcpEndpointOutputSchemas.listSessions,
	},
	'session.sendMessage': {
		input: DevinMcpEndpointInputSchemas.sendMessage,
		output: DevinMcpEndpointOutputSchemas.sendMessage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof devinMcpEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const devinMcpEndpointMeta = {
	'session.create': {
		riskLevel: 'write',
		description: 'Create a new Devin session to start working on a task',
	},
	'session.get': {
		riskLevel: 'read',
		description: 'Get details and status of an existing Devin session',
	},
	'session.list': {
		riskLevel: 'read',
		description: 'List Devin sessions',
	},
	'session.sendMessage': {
		riskLevel: 'write',
		description: 'Send a follow-up message to an existing Devin session',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof devinMcpEndpointsNested>;

export const devinMcpAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDevinMcpPlugin<T extends DevinMcpPluginOptions> = CorsairPlugin<
	'devinmcp',
	typeof DevinMcpSchema,
	typeof devinMcpEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof devinMcpAuthConfig
>;

export type InternalDevinMcpPlugin = BaseDevinMcpPlugin<DevinMcpPluginOptions>;

export type ExternalDevinMcpPlugin<T extends DevinMcpPluginOptions> =
	BaseDevinMcpPlugin<T>;

export function devinmcp<const T extends DevinMcpPluginOptions>(
	incomingOptions: DevinMcpPluginOptions & T = {} as DevinMcpPluginOptions & T,
): ExternalDevinMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'devinmcp',
		authConfig: devinMcpAuthConfig,
		schema: DevinMcpSchema,
		options,
		hooks: options.hooks,
		endpoints: devinMcpEndpointsNested,
		webhooks: {},
		endpointMeta: devinMcpEndpointMeta,
		endpointSchemas: devinMcpEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: DevinMcpKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('devinmcp', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('devinmcp', 'api_key');
		},
	} satisfies InternalDevinMcpPlugin;
}

export type {
	CreateSessionInput,
	CreateSessionResponse,
	DevinMcpEndpointInputs,
	DevinMcpEndpointOutputs,
	GetSessionInput,
	GetSessionResponse,
	ListSessionsInput,
	ListSessionsResponse,
	SendMessageInput,
	SendMessageResponse,
	SessionResponse,
} from './endpoints/types';
