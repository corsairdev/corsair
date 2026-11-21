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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	tailscaleEndpointMeta as generatedEndpointMeta,
	tailscaleEndpointSchemas,
	tailscaleEndpointsNested,
} from './endpoints/catalog';
import type {
	TailscaleEndpointInputs,
	TailscaleEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TailscaleSchema } from './schema';

export type TailscalePluginOptions = {
	/**
	 * `api_key`: either an API access token (`tskey-api-…`, admin console →
	 * Settings → Keys; it expires after at most 90 days) or an OAuth client
	 * secret (`tskey-client-…`, Settings → Trust credentials). An OAuth client
	 * never expires, carries only the scopes it was given, and is exchanged for
	 * a one-hour access token on use.
	 */
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The tailnet ID (`T1234CNTRL`, admin console → Settings → General) every
	 * call addresses unless the call names one. Leave it out to use "-", the
	 * tailnet the key belongs to.
	 */
	tailnet?: string;
	hooks?: InternalTailscalePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tailscaleEndpointsNested>;
};

export type TailscaleContext = CorsairPluginContext<
	typeof TailscaleSchema,
	TailscalePluginOptions
>;

export type TailscaleKeyBuilderContext =
	KeyBuilderContext<TailscalePluginOptions>;

export type TailscaleBoundEndpoints = BindEndpoints<
	typeof tailscaleEndpointsNested
>;

export type TailscaleEndpoints = {
	[Id in keyof TailscaleEndpointOutputs]: CorsairEndpoint<
		TailscaleContext,
		TailscaleEndpointInputs[Id],
		TailscaleEndpointOutputs[Id]
	>;
};

/**
 * No incoming webhooks yet. The plugin manages webhook endpoints
 * (webhooks.create, webhooks.list, ...), but receiving and verifying
 * Tailscale's signed events is a separate piece of work.
 */
const tailscaleWebhooksNested = {} as const;

export { tailscaleEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const tailscaleEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof tailscaleEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const tailscaleAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseTailscalePlugin<T extends TailscalePluginOptions> =
	CorsairPlugin<
		'tailscale',
		typeof TailscaleSchema,
		typeof tailscaleEndpointsNested,
		typeof tailscaleWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalTailscalePlugin =
	BaseTailscalePlugin<TailscalePluginOptions>;

export type ExternalTailscalePlugin<T extends TailscalePluginOptions> =
	BaseTailscalePlugin<T>;

export function tailscale<const T extends TailscalePluginOptions>(
	incomingOptions: TailscalePluginOptions & T = {} as TailscalePluginOptions &
		T,
): ExternalTailscalePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tailscale',
		authConfig: tailscaleAuthConfig,
		schema: TailscaleSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tailscaleEndpointsNested,
		webhooks: tailscaleWebhooksNested,
		endpointMeta: tailscaleEndpointMeta,
		endpointSchemas: tailscaleEndpointSchemas,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: TailscaleKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';

			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('tailscale', 'api_key');
			return storedKey;
		},
	} satisfies InternalTailscalePlugin;
}

export {
	createTailscaleOperation,
	getTailscaleInputSchema,
	getTailscaleOutputSchema,
	TAILSCALE_OPERATION_IDS,
} from './endpoints';
export type {
	TailscaleEndpointInputs,
	TailscaleEndpointOutputs,
	TailscaleJsonValue,
	TailscaleOperationId,
} from './endpoints/types';
export {
	TailscaleEndpointInputSchemas,
	TailscaleEndpointOutputSchemas,
} from './endpoints/types';
