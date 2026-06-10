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
import { BrowserSessions, Data, Usage } from './endpoints';
import type {
	AgentQLEndpointInputs,
	AgentQLEndpointOutputs,
} from './endpoints/types';
import {
	AgentQLEndpointInputSchemas,
	AgentQLEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AgentQLSchema } from './schema';

export type AgentQLPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAgentQLPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agentQLEndpointsNested>;
};

export type AgentQLContext = CorsairPluginContext<
	typeof AgentQLSchema,
	AgentQLPluginOptions
>;

export type AgentQLKeyBuilderContext = KeyBuilderContext<AgentQLPluginOptions>;

export type AgentQLBoundEndpoints = BindEndpoints<typeof agentQLEndpointsNested>;

type AgentQLEndpoint<K extends keyof AgentQLEndpointOutputs> = CorsairEndpoint<
	AgentQLContext,
	AgentQLEndpointInputs[K],
	AgentQLEndpointOutputs[K]
>;

export type AgentQLEndpoints = {
	createRemoteBrowserSession: AgentQLEndpoint<'createRemoteBrowserSession'>;
	getUsage: AgentQLEndpoint<'getUsage'>;
	queryData: AgentQLEndpoint<'queryData'>;
};

const agentQLEndpointsNested = {
	browserSessions: {
		createRemoteBrowserSession:
			BrowserSessions.createRemoteBrowserSession,
	},
	data: {
		query: Data.query,
	},
	usage: {
		get: Usage.get,
	},
} as const;

const agentQLWebhooksNested = {} as const;

export const agentQLEndpointSchemas = {
	'browserSessions.createRemoteBrowserSession': {
		input: AgentQLEndpointInputSchemas.createRemoteBrowserSession,
		output: AgentQLEndpointOutputSchemas.createRemoteBrowserSession,
	},
	'data.query': {
		input: AgentQLEndpointInputSchemas.queryData,
		output: AgentQLEndpointOutputSchemas.queryData,
	},
	'usage.get': {
		input: AgentQLEndpointInputSchemas.getUsage,
		output: AgentQLEndpointOutputSchemas.getUsage,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof agentQLEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const agentQLEndpointMeta = {
	'browserSessions.createRemoteBrowserSession': {
		riskLevel: 'write',
		description:
			'Tool to create a remote browser session. Use when you need to run browser automation on remote infrastructure.',
	},
	'data.query': {
		riskLevel: 'read',
		description:
			'Tool to query structured data as JSON from a web page using an AgentQL query or natural language prompt. Use after defining your query or prompt and a URL or HTML.',
	},
	'usage.get': {
		riskLevel: 'read',
		description:
			'Retrieves API usage statistics and subscription limits for the AgentQL account. Returns current billing cycle dates, lifetime usage limits, API key usage counts, and total account usage. Useful for monitoring quota consumption and planning usage. No parameters required - uses the authenticated API key from connection settings.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof agentQLEndpointsNested>;

export const agentQLAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgentQLPlugin<T extends AgentQLPluginOptions> = CorsairPlugin<
	'agentql',
	typeof AgentQLSchema,
	typeof agentQLEndpointsNested,
	typeof agentQLWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAgentQLPlugin = BaseAgentQLPlugin<AgentQLPluginOptions>;

export type ExternalAgentQLPlugin<T extends AgentQLPluginOptions> =
	BaseAgentQLPlugin<T>;

export function agentql<const T extends AgentQLPluginOptions>(
	incomingOptions: AgentQLPluginOptions & T = {} as AgentQLPluginOptions & T,
): ExternalAgentQLPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agentql',
		schema: AgentQLSchema,
		options: options,
		hooks: options.hooks,
		endpoints: agentQLEndpointsNested,
		webhooks: agentQLWebhooksNested,
		endpointMeta: agentQLEndpointMeta,
		endpointSchemas: agentQLEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgentQLKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('agentql', 'api_key');
		},
	} satisfies InternalAgentQLPlugin;
}

export type {
	AgentQLCreateRemoteBrowserSessionInput,
	AgentQLCreateRemoteBrowserSessionResponse,
	AgentQLEndpointInputs,
	AgentQLEndpointOutputs,
	AgentQLGetUsageInput,
	AgentQLGetUsageResponse,
	AgentQLQueryDataInput,
	AgentQLQueryDataResponse,
} from './endpoints/types';
