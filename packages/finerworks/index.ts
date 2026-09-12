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
	finerworksEndpointSchemas,
	finerworksEndpointsNested,
	finerworksEndpointMeta as generatedFinerWorksEndpointMeta,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { FinerWorksSchema } from './schema';

export const finerworksEndpointMeta =
	generatedFinerWorksEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof finerworksEndpointsNested
	>;

export type FinerWorksPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The FinerWorks `web_api_key`. Falls back to the connected account's key. */
	key?: string;
	/**
	 * The FinerWorks `app_key`, sent alongside the web API key on every request.
	 * Falls back to the connected account's stored `app_key`.
	 */
	appKey?: string;
	hooks?: InternalFinerWorksPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof finerworksEndpointsNested>;
};

/**
 * FinerWorks requires two credentials. `api_key` holds the `web_api_key`;
 * declaring `app_key: ['app_key']` generates `ctx.keys.get_app_key()`, which is
 * how the second half of the credential reaches an endpoint when it is not
 * passed as the `appKey` plugin option.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-test_my_credentials
 */
export const finerworksAuthConfig = {
	api_key: {
		account: ['app_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type FinerWorksContext = CorsairPluginContext<
	typeof FinerWorksSchema,
	FinerWorksPluginOptions,
	undefined,
	typeof finerworksAuthConfig
>;

export type FinerWorksKeyBuilderContext = KeyBuilderContext<
	FinerWorksPluginOptions,
	typeof finerworksAuthConfig
>;

export type FinerWorksBoundEndpoints = BindEndpoints<
	typeof finerworksEndpointsNested
>;

export type FinerWorksEndpoints = typeof finerworksEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseFinerWorksPlugin<T extends FinerWorksPluginOptions> =
	CorsairPlugin<
		'finerworks',
		typeof FinerWorksSchema,
		typeof finerworksEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof finerworksAuthConfig
	>;

export type InternalFinerWorksPlugin =
	BaseFinerWorksPlugin<FinerWorksPluginOptions>;

export type ExternalFinerWorksPlugin<T extends FinerWorksPluginOptions> =
	BaseFinerWorksPlugin<T>;

export function finerworks<const T extends FinerWorksPluginOptions>(
	incomingOptions: FinerWorksPluginOptions & T = {} as FinerWorksPluginOptions &
		T,
): ExternalFinerWorksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'finerworks',
		schema: FinerWorksSchema,
		options,
		authConfig: finerworksAuthConfig,
		hooks: options.hooks,
		endpoints: finerworksEndpointsNested,
		webhooks: {},
		endpointMeta: finerworksEndpointMeta,
		endpointSchemas: finerworksEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FinerWorksKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('finerworks', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('finerworks', 'api_key');
		},
	} satisfies InternalFinerWorksPlugin;
}

export type {
	FinerWorksEndpointInputs,
	FinerWorksEndpointOutputs,
} from './endpoints/types';

export { finerworksEndpointsNested, finerworksEndpointSchemas };
