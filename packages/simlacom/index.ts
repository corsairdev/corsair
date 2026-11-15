import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	simlaComEndpointMeta,
	simlaComEndpointSchemas,
	simlaComEndpointsNested,
} from './endpoints';
import { SIMLACOM_OPERATIONS } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SimlaComSchema } from './schema';

export type SimlaComPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** The customer instance subdomain from `https://{subdomain}.simla.com`. */
	subdomain?: string;
	hooks?: InternalSimlaComPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof simlaComEndpointsNested>;
};

export type SimlaComContext = CorsairPluginContext<
	typeof SimlaComSchema,
	SimlaComPluginOptions
>;
export type SimlaComKeyBuilderContext =
	KeyBuilderContext<SimlaComPluginOptions>;
export type SimlaComBoundEndpoints = BindEndpoints<
	typeof simlaComEndpointsNested
>;
export type SimlaComEndpoints = SimlaComBoundEndpoints;

const defaultAuthType: AuthTypes = 'api_key' as const;
const endpointMeta = simlaComEndpointMeta satisfies RequiredPluginEndpointMeta<
	typeof simlaComEndpointsNested
>;

export const simlaComAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSimlaComPlugin<T extends SimlaComPluginOptions> = CorsairPlugin<
	'simlacom',
	typeof SimlaComSchema,
	typeof simlaComEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalSimlaComPlugin = BaseSimlaComPlugin<SimlaComPluginOptions>;
export type ExternalSimlaComPlugin<T extends SimlaComPluginOptions> =
	BaseSimlaComPlugin<T>;

export function simlacom<const T extends SimlaComPluginOptions>(
	incomingOptions: SimlaComPluginOptions & T = {} as SimlaComPluginOptions & T,
): ExternalSimlaComPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'simlacom',
		authConfig: simlaComAuthConfig,
		schema: SimlaComSchema,
		options,
		hooks: options.hooks,
		endpoints: simlaComEndpointsNested,
		webhooks: {},
		endpointMeta,
		endpointSchemas: simlaComEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: SimlaComKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('simlacom', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('simlacom', 'api_key');
			return apiKey;
		},
	} satisfies InternalSimlaComPlugin;
}

export { SIMLACOM_OPERATIONS };
export type {
	JsonValue,
	SimlaComEndpointInput,
	SimlaComEndpointInputs,
	SimlaComEndpointOutput,
	SimlaComEndpointOutputs,
	SimlaComOperation,
	SimlaComOperationId,
} from './endpoints/types';
