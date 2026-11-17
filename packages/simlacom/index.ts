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
import { isValidSimlaComSubdomain } from './client';
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
	/**
	 * Overrides the account subdomain stored with the connection: `acme` for
	 * `https://acme.simla.com` (the full account URL works too). Leave it unset
	 * when each connection stores its own.
	 */
	subdomain?: string;
	hooks?: InternalSimlaComPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof simlaComEndpointsNested>;
};

export type SimlaComContext = CorsairPluginContext<
	typeof SimlaComSchema,
	SimlaComPluginOptions,
	undefined,
	typeof simlaComAuthConfig
>;
export type SimlaComKeyBuilderContext = KeyBuilderContext<
	SimlaComPluginOptions,
	typeof simlaComAuthConfig
>;
export type SimlaComBoundEndpoints = BindEndpoints<
	typeof simlaComEndpointsNested
>;
export type SimlaComEndpoints = SimlaComBoundEndpoints;

const defaultAuthType: AuthTypes = 'api_key' as const;
const endpointMeta = simlaComEndpointMeta satisfies RequiredPluginEndpointMeta<
	typeof simlaComEndpointsNested
>;

/**
 * Every Simla.com account has its own host, so the subdomain is stored with the
 * key (the key manager adds `get_subdomain()`) and Hub's connect form asks for it.
 */
export const simlaComAuthConfig = {
	api_key: {
		account: ['subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSimlaComPlugin<T extends SimlaComPluginOptions> = CorsairPlugin<
	'simlacom',
	typeof SimlaComSchema,
	typeof simlaComEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof simlaComAuthConfig
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
			const apiKey = options.key ?? (await ctx.keys?.get_api_key());
			if (!apiKey) throw new AuthMissingError('simlacom', 'api_key');
			// A key without its account host reaches nothing. Failing here, not in
			// the endpoint, lets core hand back a connect link.
			const subdomain = options.subdomain ?? (await ctx.keys?.get_subdomain());
			if (!subdomain || !isValidSimlaComSubdomain(subdomain)) {
				throw new AuthMissingError(
					'simlacom',
					'api_key',
					'Simla.com subdomain is not set: connect the account with its subdomain (acme for https://acme.simla.com) or set the subdomain option.',
				);
			}
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
