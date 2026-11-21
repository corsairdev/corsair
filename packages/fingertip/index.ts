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
import { Ping } from './endpoints';
import type {
	FingertipEndpointInputs,
	FingertipEndpointOutputs,
} from './endpoints/types';
import {
	FingertipEndpointInputSchemas,
	FingertipEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FingertipSchema } from './schema';

export type FingertipPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFingertipPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fingertipEndpointsNested>;
};

export type FingertipContext = CorsairPluginContext<
	typeof FingertipSchema,
	FingertipPluginOptions
>;

export type FingertipKeyBuilderContext =
	KeyBuilderContext<FingertipPluginOptions>;

export type FingertipBoundEndpoints = BindEndpoints<
	typeof fingertipEndpointsNested
>;

type FingertipEndpoint<K extends keyof FingertipEndpointOutputs> =
	CorsairEndpoint<
		FingertipContext,
		FingertipEndpointInputs[K],
		FingertipEndpointOutputs[K]
	>;

export type FingertipEndpoints = {
	pingGet: FingertipEndpoint<'pingGet'>;
};

const fingertipEndpointsNested = {
	ping: {
		get: Ping.get,
	},
} as const;

export const fingertipEndpointSchemas = {
	'ping.get': {
		input: FingertipEndpointInputSchemas.pingGet,
		output: FingertipEndpointOutputSchemas.pingGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof fingertipEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fingertipEndpointMeta = {
	'ping.get': {
		riskLevel: 'read',
		description: 'Verify Fingertip REST API connectivity and API key validity',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof fingertipEndpointsNested
>;

export const fingertipAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFingertipPlugin<T extends FingertipPluginOptions> =
	CorsairPlugin<
		'fingertip',
		typeof FingertipSchema,
		typeof fingertipEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalFingertipPlugin =
	BaseFingertipPlugin<FingertipPluginOptions>;

export type ExternalFingertipPlugin<T extends FingertipPluginOptions> =
	BaseFingertipPlugin<T>;

function mergeErrorHandlers(
	customHandlers?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = customHandlers ?? {};
	return {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
}

export function fingertip<const T extends FingertipPluginOptions>(
	incomingOptions: FingertipPluginOptions & T = {} as FingertipPluginOptions &
		T,
): ExternalFingertipPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'fingertip',
		authConfig: fingertipAuthConfig,
		schema: FingertipSchema,
		options,
		hooks: options.hooks,
		endpoints: fingertipEndpointsNested,
		webhooks: {},
		endpointMeta: fingertipEndpointMeta,
		endpointSchemas: fingertipEndpointSchemas,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: FingertipKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';

			if (options.key !== undefined) {
				if (options.key.length === 0) {
					throw new AuthMissingError('fingertip', 'api_key');
				}
				return options.key;
			}

			if (!ctx.keys) {
				throw new AuthMissingError('fingertip', 'api_key');
			}
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) {
				throw new AuthMissingError('fingertip', 'api_key');
			}
			return apiKey;
		},
	} satisfies InternalFingertipPlugin;
}

export type {
	FingertipEndpointInputs,
	FingertipEndpointOutputs,
	PingGetInput,
	PingGetResponse,
} from './endpoints/types';
