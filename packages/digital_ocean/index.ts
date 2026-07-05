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
	digitalOceanEndpointMeta as generatedDigitalOceanEndpointMeta,
	digitalOceanEndpointSchemas,
	digitalOceanEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { DigitalOceanSchema } from './schema';

export const digitalOceanEndpointMeta =
	generatedDigitalOceanEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof digitalOceanEndpointsNested
	>;

export type DigitalOceanPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDigitalOceanPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof digitalOceanEndpointsNested>;
};

export type DigitalOceanContext = CorsairPluginContext<
	typeof DigitalOceanSchema,
	DigitalOceanPluginOptions
>;

export type DigitalOceanKeyBuilderContext = KeyBuilderContext<DigitalOceanPluginOptions>;

export type DigitalOceanBoundEndpoints = BindEndpoints<typeof digitalOceanEndpointsNested>;

export type DigitalOceanEndpoints = typeof digitalOceanEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const digitalOceanAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseDigitalOceanPlugin<T extends DigitalOceanPluginOptions> = CorsairPlugin<
	'digital_ocean',
	typeof DigitalOceanSchema,
	typeof digitalOceanEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalDigitalOceanPlugin = BaseDigitalOceanPlugin<DigitalOceanPluginOptions>;

export type ExternalDigitalOceanPlugin<T extends DigitalOceanPluginOptions> =
	BaseDigitalOceanPlugin<T>;

export function digital_ocean<const T extends DigitalOceanPluginOptions>(
	incomingOptions: DigitalOceanPluginOptions & T = {} as DigitalOceanPluginOptions & T,
): ExternalDigitalOceanPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'digital_ocean',
		schema: DigitalOceanSchema,
		options,
		authConfig: digitalOceanAuthConfig,
		hooks: options.hooks,
		endpoints: digitalOceanEndpointsNested,
		webhooks: {},
		endpointMeta: digitalOceanEndpointMeta,
		endpointSchemas: digitalOceanEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DigitalOceanKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[DIGITALOCEAN] API key missing — connect DigitalOcean or pass key in plugin options.',
					);
					throw new AuthMissingError('digital_ocean', 'api_key');
				}
				return res;
			}

			console.error(
				'[DIGITALOCEAN] Authentication required for DigitalOcean API requests.',
			);
			throw new AuthMissingError('digital_ocean', 'api_key');
		},
	} satisfies InternalDigitalOceanPlugin;
}

export type {
	DigitalOceanEndpointInputs,
	DigitalOceanEndpointOutputs,
} from './endpoints/types';

export { digitalOceanEndpointsNested, digitalOceanEndpointSchemas };
