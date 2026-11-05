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
	webflowEndpointMeta as generatedWebflowEndpointMeta,
	webflowEndpointSchemas,
	webflowEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { WebflowSchema } from './schema';

export const webflowEndpointMeta =
	generatedWebflowEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof webflowEndpointsNested
	>;

export type WebflowPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalWebflowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof webflowEndpointsNested>;
};

export type WebflowContext = CorsairPluginContext<
	typeof WebflowSchema,
	WebflowPluginOptions
>;

export type WebflowKeyBuilderContext = KeyBuilderContext<WebflowPluginOptions>;

export type WebflowBoundEndpoints = BindEndpoints<
	typeof webflowEndpointsNested
>;

export type WebflowEndpoints = typeof webflowEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const webflowAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseWebflowPlugin<T extends WebflowPluginOptions> = CorsairPlugin<
	'webflow',
	typeof WebflowSchema,
	typeof webflowEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof webflowAuthConfig
>;

export type InternalWebflowPlugin = BaseWebflowPlugin<WebflowPluginOptions>;

export type ExternalWebflowPlugin<T extends WebflowPluginOptions> =
	BaseWebflowPlugin<T>;

export function webflow<const T extends WebflowPluginOptions>(
	// The empty object keeps plugin setup ergonomic while preserving selected auth options.
	incomingOptions: WebflowPluginOptions & T = {} as WebflowPluginOptions & T,
): ExternalWebflowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'webflow',
		schema: WebflowSchema,
		options: options,
		authConfig: webflowAuthConfig,
		oauthConfig: {
			providerName: 'Webflow',
			authUrl: 'https://webflow.com/oauth/authorize',
			tokenUrl: 'https://api.webflow.com/oauth/access_token',
			scopes: [
				'authorized_user:read',
				'assets:read',
				'assets:write',
				'cms:read',
				'cms:write',
				'comments:read',
				'components:read',
				'ecommerce:read',
				'ecommerce:write',
				'forms:read',
				'pages:read',
				'pages:write',
				'sites:read',
				'sites:write',
			],
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		endpoints: webflowEndpointsNested,
		webhooks: {},
		endpointMeta: webflowEndpointMeta,
		endpointSchemas: webflowEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WebflowKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('webflow', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('webflow', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('webflow', ctx.authType);
		},
	} satisfies InternalWebflowPlugin;
}

export type {
	WebflowEndpointInput,
	WebflowEndpointInputs,
	WebflowEndpointOutput,
	WebflowEndpointOutputs,
} from './endpoints/types';

export { webflowEndpointSchemas, webflowEndpointsNested };
