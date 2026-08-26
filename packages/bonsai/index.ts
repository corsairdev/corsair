import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { BonsaiEndpointInputs, BonsaiEndpointOutputs } from './endpoints/types';
import { BonsaiEndpointInputSchemas, BonsaiEndpointOutputSchemas } from './endpoints/types';
import { Clusters, Spaces } from './endpoints';
import { BonsaiSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type BonsaiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	apiKey?: string;
	apiSecret?: string;
	hooks?: InternalBonsaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bonsaiEndpointsNested>;
};

export type BonsaiContext = CorsairPluginContext<
	typeof BonsaiSchema,
	BonsaiPluginOptions
>;

export type BonsaiKeyBuilderContext = KeyBuilderContext<BonsaiPluginOptions>;

export type BonsaiBoundEndpoints = BindEndpoints<typeof bonsaiEndpointsNested>;

type BonsaiEndpoint<
	K extends keyof BonsaiEndpointOutputs,
> = CorsairEndpoint<
	BonsaiContext,
	BonsaiEndpointInputs[K],
	BonsaiEndpointOutputs[K]
>;

export type BonsaiEndpoints = {
	clustersGet: BonsaiEndpoint<'clustersGet'>;
	spacesList: BonsaiEndpoint<'spacesList'>;
	spacesGet: BonsaiEndpoint<'spacesGet'>;
};


const bonsaiEndpointsNested = {
	clusters: {
		get: Clusters.get,
	},
	spaces: {
		list: Spaces.list,
		get: Spaces.get,
	},
} as const;

export const bonsaiEndpointSchemas = {
	'clusters.get': {
		input: BonsaiEndpointInputSchemas.clustersGet,
		output: BonsaiEndpointOutputSchemas.clustersGet,
	},
	'spaces.list': {
		input: BonsaiEndpointInputSchemas.spacesList,
		output: BonsaiEndpointOutputSchemas.spacesList,
	},
	'spaces.get': {
		input: BonsaiEndpointInputSchemas.spacesGet,
		output: BonsaiEndpointOutputSchemas.spacesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof bonsaiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bonsaiEndpointMeta = {
	'clusters.get': {
		riskLevel: 'read',
		description: 'Get Bonsai cluster details by slug',
	},
	'spaces.list': {
		riskLevel: 'read',
		description: 'List all spaces',
	},
	'spaces.get': {
		riskLevel: 'read',
		description: 'Retrieve space details by path',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bonsaiEndpointsNested>;

export const bonsaiAuthConfig = {
	api_key: {
		account: ['api_key', 'api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBonsaiPlugin<T extends BonsaiPluginOptions> = CorsairPlugin<
	'bonsai',
	typeof BonsaiSchema,
	typeof bonsaiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalBonsaiPlugin = BaseBonsaiPlugin<BonsaiPluginOptions>;

export type ExternalBonsaiPlugin<T extends BonsaiPluginOptions> =
	BaseBonsaiPlugin<T>;

export function bonsai<const T extends BonsaiPluginOptions>(
	incomingOptions: BonsaiPluginOptions & T = {} as BonsaiPluginOptions & T,
): ExternalBonsaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bonsai',
		authConfig: bonsaiAuthConfig,
		schema: BonsaiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: bonsaiEndpointsNested,
		webhooks: {} as const,
		endpointMeta: bonsaiEndpointMeta,
		endpointSchemas: bonsaiEndpointSchemas,
		webhookSchemas: {} as const,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BonsaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.apiKey && options.apiSecret) {
				return JSON.stringify({ apiKey: options.apiKey, apiSecret: options.apiSecret });
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				const apiSecret = await ctx.keys.get_api_secret();
				if (!apiKey || !apiSecret) {
					throw new Error('[auth-missing:bonsai:api_key] Bonsai API key or secret is missing');
				}
				return JSON.stringify({ apiKey, apiSecret });
			}

			throw new Error('[auth-missing:bonsai] Bonsai credentials are missing');
		},
	} satisfies InternalBonsaiPlugin;
}

export type {
	BonsaiEndpointInputs,
	BonsaiEndpointOutputs,
	ClustersGetInput,
	ClustersGetResponse,
	SpacesListInput,
	SpacesListResponse,
	SpacesGetInput,
	SpacesGetResponse,
} from './endpoints/types';
