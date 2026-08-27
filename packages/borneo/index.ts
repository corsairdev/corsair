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
import { Assets, Support } from './endpoints';
import type {
	BorneoEndpointInputs,
	BorneoEndpointOutputs,
} from './endpoints/types';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BorneoSchema } from './schema';

export const borneoAuthConfig = {
	api_key: {
		account: ['base_url'] as const,
	},
	oauth_2: {
		account: ['base_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BorneoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalBorneoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof borneoEndpointsNested>;
};

export type BorneoContext = CorsairPluginContext<
	typeof BorneoSchema,
	BorneoPluginOptions,
	undefined,
	typeof borneoAuthConfig
>;

export type BorneoKeyBuilderContext = KeyBuilderContext<
	BorneoPluginOptions,
	typeof borneoAuthConfig
>;

type BorneoEndpoint<K extends keyof BorneoEndpointOutputs> = CorsairEndpoint<
	BorneoContext,
	BorneoEndpointInputs[K],
	BorneoEndpointOutputs[K]
>;

export type BorneoEndpoints = {
	createAsset: BorneoEndpoint<'createAsset'>;
	retrieveAsset: BorneoEndpoint<'retrieveAsset'>;
	updateAsset: BorneoEndpoint<'updateAsset'>;
	deleteAsset: BorneoEndpoint<'deleteAsset'>;
	postSupportChatQuery: BorneoEndpoint<'postSupportChatQuery'>;
};

const borneoEndpointsNested = {
	assets: {
		createAsset: Assets.createAsset,
		retrieveAsset: Assets.retrieveAsset,
		updateAsset: Assets.updateAsset,
		deleteAsset: Assets.deleteAsset,
	},
	support: {
		postSupportChatQuery: Support.postSupportChatQuery,
	},
} as const;

export type BorneoBoundEndpoints = BindEndpoints<typeof borneoEndpointsNested>;

export const borneoEndpointSchemas = {
	'assets.createAsset': {
		input: BorneoEndpointInputSchemas.createAsset,
		output: BorneoEndpointOutputSchemas.createAsset,
	},
	'assets.retrieveAsset': {
		input: BorneoEndpointInputSchemas.retrieveAsset,
		output: BorneoEndpointOutputSchemas.retrieveAsset,
	},
	'assets.updateAsset': {
		input: BorneoEndpointInputSchemas.updateAsset,
		output: BorneoEndpointOutputSchemas.updateAsset,
	},
	'assets.deleteAsset': {
		input: BorneoEndpointInputSchemas.deleteAsset,
		output: BorneoEndpointOutputSchemas.deleteAsset,
	},
	'support.postSupportChatQuery': {
		input: BorneoEndpointInputSchemas.postSupportChatQuery,
		output: BorneoEndpointOutputSchemas.postSupportChatQuery,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof borneoEndpointsNested
>;

const borneoEndpointMeta = {
	'assets.createAsset': {
		riskLevel: 'write',
		description: 'Create a Borneo asset',
	},
	'assets.retrieveAsset': {
		riskLevel: 'read',
		description: 'Retrieve a Borneo asset by ID',
	},
	'assets.updateAsset': {
		riskLevel: 'write',
		description: 'Update a Borneo asset by ID',
	},
	'assets.deleteAsset': {
		riskLevel: 'destructive',
		description: 'Delete a Borneo asset by ID',
	},
	'support.postSupportChatQuery': {
		riskLevel: 'write',
		description: 'Send a support chat query to Borneo',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof borneoEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBorneoPlugin<T extends BorneoPluginOptions> = CorsairPlugin<
	'borneo',
	typeof BorneoSchema,
	typeof borneoEndpointsNested,
	Record<never, never>,
	T,
	typeof defaultAuthType,
	typeof borneoAuthConfig
>;

export type InternalBorneoPlugin = BaseBorneoPlugin<BorneoPluginOptions>;
export type ExternalBorneoPlugin<T extends BorneoPluginOptions> =
	BaseBorneoPlugin<T>;

export function borneo<const T extends BorneoPluginOptions>(
	incomingOptions: BorneoPluginOptions & T = {} as BorneoPluginOptions & T,
): ExternalBorneoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'borneo',
		authConfig: borneoAuthConfig,
		schema: BorneoSchema,
		options,
		hooks: options.hooks,
		endpoints: borneoEndpointsNested,
		webhooks: {},
		endpointMeta: borneoEndpointMeta,
		endpointSchemas: borneoEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BorneoKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('borneo', 'api_key');
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('borneo', 'api_key');
				}
				return key;
			}

			if (ctx.authType === 'oauth_2') {
				const token = await ctx.keys.get_access_token();
				if (!token) {
					throw new AuthMissingError('borneo', 'oauth_2');
				}
				return token;
			}

			throw new AuthMissingError('borneo', 'api_key');
		},
	} satisfies InternalBorneoPlugin;
}

export type {
	BorneoEndpointInputs,
	BorneoEndpointOutputs,
	CreateAssetInput,
	CreateAssetResponse,
	DeleteAssetInput,
	DeleteAssetResponse,
	PostSupportChatQueryInput,
	PostSupportChatQueryResponse,
	RetrieveAssetInput,
	RetrieveAssetResponse,
	UpdateAssetInput,
	UpdateAssetResponse,
} from './endpoints/types';
