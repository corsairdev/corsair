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
import { Wiki } from './endpoints';
import type {
	DeepwikiMcpEndpointInputs,
	DeepwikiMcpEndpointOutputs,
} from './endpoints/types';
import {
	DeepwikiMcpEndpointInputSchemas,
	DeepwikiMcpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DeepwikiMcpSchema } from './schema';

export type DeepwikiMcpPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalDeepwikiMcpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof deepwikiMcpEndpointsNested>;
};

export type DeepwikiMcpContext = CorsairPluginContext<
	typeof DeepwikiMcpSchema,
	DeepwikiMcpPluginOptions
>;
export type DeepwikiMcpKeyBuilderContext =
	KeyBuilderContext<DeepwikiMcpPluginOptions>;
export type DeepwikiMcpBoundEndpoints = BindEndpoints<
	typeof deepwikiMcpEndpointsNested
>;

type DeepwikiMcpEndpoint<K extends keyof DeepwikiMcpEndpointOutputs> =
	CorsairEndpoint<
		DeepwikiMcpContext,
		DeepwikiMcpEndpointInputs[K],
		DeepwikiMcpEndpointOutputs[K]
	>;

export type DeepwikiMcpEndpoints = {
	askQuestion: DeepwikiMcpEndpoint<'askQuestion'>;
	readWikiContents: DeepwikiMcpEndpoint<'readWikiContents'>;
	readWikiStructure: DeepwikiMcpEndpoint<'readWikiStructure'>;
};

const deepwikiMcpEndpointsNested = {
	wiki: {
		askQuestion: Wiki.askQuestion,
		readWikiContents: Wiki.readWikiContents,
		readWikiStructure: Wiki.readWikiStructure,
	},
} as const;

export const deepwikiMcpEndpointSchemas = {
	'wiki.askQuestion': {
		input: DeepwikiMcpEndpointInputSchemas.askQuestion,
		output: DeepwikiMcpEndpointOutputSchemas.askQuestion,
	},
	'wiki.readWikiContents': {
		input: DeepwikiMcpEndpointInputSchemas.readWikiContents,
		output: DeepwikiMcpEndpointOutputSchemas.readWikiContents,
	},
	'wiki.readWikiStructure': {
		input: DeepwikiMcpEndpointInputSchemas.readWikiStructure,
		output: DeepwikiMcpEndpointOutputSchemas.readWikiStructure,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof deepwikiMcpEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const deepwikiMcpEndpointMeta = {
	'wiki.askQuestion': {
		riskLevel: 'read',
		description: 'Ask a question about one or more GitHub repositories',
	},
	'wiki.readWikiContents': {
		riskLevel: 'read',
		description: 'Read documentation contents for a GitHub repository',
	},
	'wiki.readWikiStructure': {
		riskLevel: 'read',
		description: 'Read documentation topics for a GitHub repository',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof deepwikiMcpEndpointsNested
>;

export const deepwikiMcpAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseDeepwikiMcpPlugin<T extends DeepwikiMcpPluginOptions> =
	CorsairPlugin<
		'deepwikimcp',
		typeof DeepwikiMcpSchema,
		typeof deepwikiMcpEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;
export type InternalDeepwikiMcpPlugin =
	BaseDeepwikiMcpPlugin<DeepwikiMcpPluginOptions>;
export type ExternalDeepwikiMcpPlugin<T extends DeepwikiMcpPluginOptions> =
	BaseDeepwikiMcpPlugin<T>;

export function deepwikimcp<const T extends DeepwikiMcpPluginOptions>(
	incomingOptions: DeepwikiMcpPluginOptions &
		T = {} as DeepwikiMcpPluginOptions & T,
): ExternalDeepwikiMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'deepwikimcp',
		authConfig: deepwikiMcpAuthConfig,
		schema: DeepwikiMcpSchema,
		options,
		hooks: options.hooks,
		endpoints: deepwikiMcpEndpointsNested,
		webhooks: {},
		endpointMeta: deepwikiMcpEndpointMeta,
		endpointSchemas: deepwikiMcpEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: DeepwikiMcpKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key')
				return (await ctx.keys.get_api_key()) ?? '';
			if (source === 'endpoint' && ctx.authType === 'oauth_2')
				return (await ctx.keys.get_access_token()) ?? '';
			return '';
		},
	} satisfies InternalDeepwikiMcpPlugin;
}

export type {
	AskQuestionInput,
	DeepwikiMcpEndpointInputs,
	DeepwikiMcpEndpointOutputs,
	DeepwikiMcpToolResponse,
	ReadWikiContentsInput,
	ReadWikiStructureInput,
} from './endpoints/types';
