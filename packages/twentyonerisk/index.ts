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
import { Organizations } from './endpoints';
import type {
	TwentyOneRiskEndpointInputs,
	TwentyOneRiskEndpointOutputs,
} from './endpoints/types';
import {
	TwentyOneRiskEndpointInputSchemas,
	TwentyOneRiskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwentyOneRiskSchema } from './schema';

export type TwentyOneRiskPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTwentyOneRiskPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof twentyOneRiskEndpointsNested>;
};

export type TwentyOneRiskContext = CorsairPluginContext<
	typeof TwentyOneRiskSchema,
	TwentyOneRiskPluginOptions
>;

export type TwentyOneRiskKeyBuilderContext =
	KeyBuilderContext<TwentyOneRiskPluginOptions>;

export type TwentyOneRiskBoundEndpoints = BindEndpoints<
	typeof twentyOneRiskEndpointsNested
>;

type TwentyOneRiskEndpoint<K extends keyof TwentyOneRiskEndpointOutputs> =
	CorsairEndpoint<
		TwentyOneRiskContext,
		TwentyOneRiskEndpointInputs[K],
		TwentyOneRiskEndpointOutputs[K]
	>;

export type TwentyOneRiskEndpoints = {
	organizationsGet: TwentyOneRiskEndpoint<'organizationsGet'>;
};

const twentyOneRiskEndpointsNested = {
	organizations: {
		get: Organizations.get,
	},
} as const;

export const twentyOneRiskEndpointSchemas = {
	'organizations.get': {
		input: TwentyOneRiskEndpointInputSchemas.organizationsGet,
		output: TwentyOneRiskEndpointOutputSchemas.organizationsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof twentyOneRiskEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const twentyOneRiskEndpointMeta = {
	'organizations.get': {
		riskLevel: 'read',
		description:
			'Retrieve organizations from the 21RISK OData API with optional filtering and pagination',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof twentyOneRiskEndpointsNested
>;

export const twentyOneRiskAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTwentyOneRiskPlugin<T extends TwentyOneRiskPluginOptions> =
	CorsairPlugin<
		'twentyonerisk',
		typeof TwentyOneRiskSchema,
		typeof twentyOneRiskEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalTwentyOneRiskPlugin =
	BaseTwentyOneRiskPlugin<TwentyOneRiskPluginOptions>;

export type ExternalTwentyOneRiskPlugin<T extends TwentyOneRiskPluginOptions> =
	BaseTwentyOneRiskPlugin<T>;

export function twentyonerisk<const T extends TwentyOneRiskPluginOptions>(
	incomingOptions: TwentyOneRiskPluginOptions &
		T = {} as TwentyOneRiskPluginOptions & T,
): ExternalTwentyOneRiskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'twentyonerisk',
		authConfig: twentyOneRiskAuthConfig,
		schema: TwentyOneRiskSchema,
		options: options,
		hooks: options.hooks,
		endpoints: twentyOneRiskEndpointsNested,
		webhooks: {},
		endpointMeta: twentyOneRiskEndpointMeta,
		endpointSchemas: twentyOneRiskEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TwentyOneRiskKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalTwentyOneRiskPlugin;
}

export type {
	OrganizationsGetInput,
	OrganizationsGetResponse,
	TwentyOneRiskEndpointInputs,
	TwentyOneRiskEndpointOutputs,
} from './endpoints/types';
