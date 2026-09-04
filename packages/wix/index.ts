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
	wixEndpointMeta as generatedWixEndpointMeta,
	wixEndpointSchemas,
	wixEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { WixSchema } from './schema';

export const wixEndpointMeta =
	generatedWixEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof wixEndpointsNested
	>;

export type WixPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	siteId?: string;
	hooks?: InternalWixPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wixEndpointsNested>;
};

export type WixContext = CorsairPluginContext<
	typeof WixSchema,
	WixPluginOptions
>;

export type WixKeyBuilderContext = KeyBuilderContext<WixPluginOptions>;

export type WixBoundEndpoints = BindEndpoints<typeof wixEndpointsNested>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export const wixAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWixPlugin<T extends WixPluginOptions> = CorsairPlugin<
	'wix',
	typeof WixSchema,
	typeof wixEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalWixPlugin = BaseWixPlugin<WixPluginOptions>;

export type ExternalWixPlugin<T extends WixPluginOptions> = BaseWixPlugin<T>;

export function wix<const T extends WixPluginOptions>(
	incomingOptions: WixPluginOptions & T = {} as WixPluginOptions & T,
): ExternalWixPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wix',
		schema: WixSchema,
		options,
		authConfig: wixAuthConfig,
		hooks: options.hooks,
		endpoints: wixEndpointsNested,
		webhooks: {},
		endpointMeta: wixEndpointMeta,
		endpointSchemas: wixEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WixKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[WIX] API key missing — connect Wix or pass key in plugin options.',
					);
					throw new AuthMissingError('wix', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					console.error(
						'[WIX] OAuth access token missing — connect Wix or pass key in plugin options.',
					);
					throw new AuthMissingError('wix', 'oauth_2');
				}
				return res;
			}

			console.error('[WIX] Authentication required for Wix API requests.');
			throw new AuthMissingError('wix', ctx.authType ?? defaultAuthType);
		},
	};
}

export type {
	WixEndpointInputs,
	WixEndpointOutputs,
} from './endpoints/types';
