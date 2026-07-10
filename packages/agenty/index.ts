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
	agentyEndpointSchemas,
	agentyEndpointsNested,
	agentyEndpointMeta as generatedAgentyEndpointMeta,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { AgentySchema } from './schema';

export const agentyEndpointMeta =
	generatedAgentyEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof agentyEndpointsNested
	>;

export type AgentyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAgentyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agentyEndpointsNested>;
};

export type AgentyContext = CorsairPluginContext<
	typeof AgentySchema,
	AgentyPluginOptions
>;

export type AgentyKeyBuilderContext = KeyBuilderContext<AgentyPluginOptions>;

export type AgentyBoundEndpoints = BindEndpoints<typeof agentyEndpointsNested>;

export type AgentyEndpoints = typeof agentyEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const agentyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAgentyPlugin<T extends AgentyPluginOptions> = CorsairPlugin<
	'agenty',
	typeof AgentySchema,
	typeof agentyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAgentyPlugin = BaseAgentyPlugin<AgentyPluginOptions>;

export type ExternalAgentyPlugin<T extends AgentyPluginOptions> =
	BaseAgentyPlugin<T>;

export function agenty<const T extends AgentyPluginOptions>(
	// Cast is safe: if the caller omits options entirely, an empty object is
	// immediately merged with defaults below, satisfying the T constraint.
	incomingOptions: AgentyPluginOptions & T = {} as AgentyPluginOptions & T,
): ExternalAgentyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agenty',
		schema: AgentySchema,
		options,
		authConfig: agentyAuthConfig,
		hooks: options.hooks,
		endpoints: agentyEndpointsNested,
		webhooks: {},
		endpointMeta: agentyEndpointMeta,
		endpointSchemas: agentyEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgentyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[AGENTY] API key missing — connect Agenty or pass key in plugin options.',
					);
					throw new AuthMissingError('agenty', 'api_key');
				}
				return res;
			}

			console.error(
				'[AGENTY] Authentication required for Agenty API requests.',
			);
			throw new AuthMissingError('agenty', 'api_key');
		},
	} satisfies InternalAgentyPlugin;
}

export type {
	AgentyEndpointInputs,
	AgentyEndpointOutputs,
} from './endpoints/types';

export { agentyEndpointsNested, agentyEndpointSchemas };
