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
import { ContextSevenMcp } from './endpoints';
import type {
	ContextSevenMcpEndpointInputs,
	ContextSevenMcpEndpointOutputs,
} from './endpoints/types';
import {
	ContextSevenMcpEndpointInputSchemas,
	ContextSevenMcpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ContextSevenMcpSchema } from './schema';

export type ContextSevenMcpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalContextSevenMcpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof contextSevenMcpEndpointsNested>;
};

export type ContextSevenMcpContext = CorsairPluginContext<
	typeof ContextSevenMcpSchema,
	ContextSevenMcpPluginOptions
>;

export type ContextSevenMcpKeyBuilderContext =
	KeyBuilderContext<ContextSevenMcpPluginOptions>;

export type ContextSevenMcpBoundEndpoints = BindEndpoints<
	typeof contextSevenMcpEndpointsNested
>;

type ContextSevenMcpEndpoint<K extends keyof ContextSevenMcpEndpointOutputs> =
	CorsairEndpoint<
		ContextSevenMcpContext,
		ContextSevenMcpEndpointInputs[K],
		ContextSevenMcpEndpointOutputs[K]
	>;

export type ContextSevenMcpEndpoints = {
	librarySearch: ContextSevenMcpEndpoint<'librarySearch'>;
	contextGet: ContextSevenMcpEndpoint<'contextGet'>;
};

const contextSevenMcpEndpointsNested = {
	library: {
		search: ContextSevenMcp.librarySearch,
	},
	context: {
		get: ContextSevenMcp.contextGet,
	},
} as const;

export const contextSevenMcpEndpointSchemas = {
	'library.search': {
		input: ContextSevenMcpEndpointInputSchemas.librarySearch,
		output: ContextSevenMcpEndpointOutputSchemas.librarySearch,
	},
	'context.get': {
		input: ContextSevenMcpEndpointInputSchemas.contextGet,
		output: ContextSevenMcpEndpointOutputSchemas.contextGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof contextSevenMcpEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const contextSevenMcpEndpointMeta = {
	'library.search': {
		riskLevel: 'read',
		description: 'Search Context7 libraries by name',
	},
	'context.get': {
		riskLevel: 'read',
		description: 'Get documentation context for a library',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof contextSevenMcpEndpointsNested
>;

export const contextSevenMcpAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseContextSevenMcpPlugin<T extends ContextSevenMcpPluginOptions> =
	CorsairPlugin<
		'contextsevenmcp',
		typeof ContextSevenMcpSchema,
		typeof contextSevenMcpEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalContextSevenMcpPlugin =
	BaseContextSevenMcpPlugin<ContextSevenMcpPluginOptions>;

export type ExternalContextSevenMcpPlugin<
	T extends ContextSevenMcpPluginOptions,
> = BaseContextSevenMcpPlugin<T>;

export function contextsevenmcp<const T extends ContextSevenMcpPluginOptions>(
	incomingOptions: ContextSevenMcpPluginOptions &
		T = {} as ContextSevenMcpPluginOptions & T,
): ExternalContextSevenMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'contextsevenmcp',
		authConfig: contextSevenMcpAuthConfig,
		schema: ContextSevenMcpSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: contextSevenMcpEndpointsNested,
		webhooks: {} as const,
		endpointMeta: contextSevenMcpEndpointMeta,
		endpointSchemas: contextSevenMcpEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: ContextSevenMcpKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('contextsevenmcp', 'api_key');
				}
				return apiKey;
			}

			throw new AuthMissingError('contextsevenmcp', 'api_key');
		},
	} satisfies InternalContextSevenMcpPlugin;
}

export type {
	ContextSevenMcpEndpointInputs,
	ContextSevenMcpEndpointOutputs,
} from './endpoints/types';
