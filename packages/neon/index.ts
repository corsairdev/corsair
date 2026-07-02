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
	neonEndpointMeta as generatedNeonEndpointMeta,
	neonEndpointSchemas,
	neonEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { NeonSchema } from './schema';

export const neonEndpointMeta =
	generatedNeonEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof neonEndpointsNested
	>;

export type NeonPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNeonPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof neonEndpointsNested>;
};

export type NeonContext = CorsairPluginContext<
	typeof NeonSchema,
	NeonPluginOptions
>;

export type NeonKeyBuilderContext = KeyBuilderContext<NeonPluginOptions>;

export type NeonBoundEndpoints = BindEndpoints<typeof neonEndpointsNested>;

export type NeonEndpoints = typeof neonEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const neonAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseNeonPlugin<T extends NeonPluginOptions> = CorsairPlugin<
	'neon',
	typeof NeonSchema,
	typeof neonEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof neonAuthConfig
>;

export type InternalNeonPlugin = BaseNeonPlugin<NeonPluginOptions>;

export type ExternalNeonPlugin<T extends NeonPluginOptions> = BaseNeonPlugin<T>;

export function neon<const T extends NeonPluginOptions>(
	// The empty object keeps plugin setup ergonomic while preserving selected auth options.
	incomingOptions: NeonPluginOptions & T = {} as NeonPluginOptions & T,
): ExternalNeonPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'neon',
		schema: NeonSchema,
		options: options,
		authConfig: neonAuthConfig,
		hooks: options.hooks,
		endpoints: neonEndpointsNested,
		webhooks: {},
		endpointMeta: neonEndpointMeta,
		endpointSchemas: neonEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NeonKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('neon', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('neon', ctx.authType);
		},
	} satisfies InternalNeonPlugin;
}

export type {
	NeonEndpointInput,
	NeonEndpointInputs,
	NeonEndpointOutput,
	NeonEndpointOutputs,
} from './endpoints/types';

export { neonEndpointSchemas, neonEndpointsNested };
