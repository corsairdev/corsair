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
	anchorBrowserEndpointSchemas,
	anchorBrowserEndpointsNested,
	anchorBrowserEndpointMeta as generatedAnchorBrowserEndpointMeta,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { AnchorBrowserSchema } from './schema';

export const anchorBrowserEndpointMeta =
	generatedAnchorBrowserEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof anchorBrowserEndpointsNested
	>;

export type AnchorBrowserPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAnchorBrowserPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof anchorBrowserEndpointsNested>;
};

export type AnchorBrowserContext = CorsairPluginContext<
	typeof AnchorBrowserSchema,
	AnchorBrowserPluginOptions
>;

export type AnchorBrowserKeyBuilderContext =
	KeyBuilderContext<AnchorBrowserPluginOptions>;

export type AnchorBrowserBoundEndpoints = BindEndpoints<
	typeof anchorBrowserEndpointsNested
>;

export type AnchorBrowserEndpoints = typeof anchorBrowserEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const anchorBrowserAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAnchorBrowserPlugin<T extends AnchorBrowserPluginOptions> =
	CorsairPlugin<
		'anchorbrowser',
		typeof AnchorBrowserSchema,
		typeof anchorBrowserEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalAnchorBrowserPlugin =
	BaseAnchorBrowserPlugin<AnchorBrowserPluginOptions>;

export type ExternalAnchorBrowserPlugin<T extends AnchorBrowserPluginOptions> =
	BaseAnchorBrowserPlugin<T>;

export function anchorbrowser<const T extends AnchorBrowserPluginOptions>(
	incomingOptions: AnchorBrowserPluginOptions &
		T = {} as AnchorBrowserPluginOptions & T,
): ExternalAnchorBrowserPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'anchorbrowser',
		schema: AnchorBrowserSchema,
		options,
		authConfig: anchorBrowserAuthConfig,
		hooks: options.hooks,
		endpoints: anchorBrowserEndpointsNested,
		webhooks: {},
		endpointMeta: anchorBrowserEndpointMeta,
		endpointSchemas: anchorBrowserEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AnchorBrowserKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[ANCHORBROWSER] API key missing — connect Anchor Browser or pass key in plugin options.',
					);
					throw new AuthMissingError('anchorbrowser', 'api_key');
				}
				return res;
			}

			console.error(
				'[ANCHORBROWSER] Authentication required for Anchor Browser API requests.',
			);
			throw new AuthMissingError('anchorbrowser', 'api_key');
		},
	} satisfies InternalAnchorBrowserPlugin;
}

export type {
	AnchorBrowserEndpointInputs,
	AnchorBrowserEndpointOutputs,
} from './endpoints/types';

export { anchorBrowserEndpointsNested, anchorBrowserEndpointSchemas };
