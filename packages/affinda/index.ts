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
	affindaEndpointSchemas,
	affindaEndpointsNested,
	affindaEndpointMeta as generatedAffindaEndpointMeta,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { AffindaSchema } from './schema';

export const affindaEndpointMeta =
	generatedAffindaEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof affindaEndpointsNested
	>;

export type AffindaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAffindaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof affindaEndpointsNested>;
};

export type AffindaContext = CorsairPluginContext<
	typeof AffindaSchema,
	AffindaPluginOptions
>;

export type AffindaKeyBuilderContext = KeyBuilderContext<AffindaPluginOptions>;

export type AffindaBoundEndpoints = BindEndpoints<
	typeof affindaEndpointsNested
>;

export type AffindaEndpoints = typeof affindaEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const affindaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAffindaPlugin<T extends AffindaPluginOptions> = CorsairPlugin<
	'affinda',
	typeof AffindaSchema,
	typeof affindaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAffindaPlugin = BaseAffindaPlugin<AffindaPluginOptions>;

export type ExternalAffindaPlugin<T extends AffindaPluginOptions> =
	BaseAffindaPlugin<T>;

export function affinda<const T extends AffindaPluginOptions>(
	incomingOptions: AffindaPluginOptions & T = {} as AffindaPluginOptions & T,
): ExternalAffindaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'affinda',
		schema: AffindaSchema,
		options,
		authConfig: affindaAuthConfig,
		hooks: options.hooks,
		endpoints: affindaEndpointsNested,
		webhooks: {},
		endpointMeta: affindaEndpointMeta,
		endpointSchemas: affindaEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AffindaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[AFFINDA] API key missing — connect Affinda or pass key in plugin options.',
					);
					throw new AuthMissingError('affinda', 'api_key');
				}
				return res;
			}

			console.error(
				'[AFFINDA] Authentication required for Affinda API requests.',
			);
			throw new AuthMissingError('affinda', 'api_key');
		},
	} satisfies InternalAffindaPlugin;
}

export type {
	AffindaEndpointInputs,
	AffindaEndpointOutputs,
} from './endpoints/types';

export { affindaEndpointsNested, affindaEndpointSchemas };
