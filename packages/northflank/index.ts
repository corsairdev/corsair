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
	northflankEndpointMeta as generatedNorthflankEndpointMeta,
	northflankEndpointSchemas,
	northflankEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { NorthflankSchema } from './schema';

export const northflankEndpointMeta =
	generatedNorthflankEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof northflankEndpointsNested
	>;

export type NorthflankPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNorthflankPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof northflankEndpointsNested>;
};

export type NorthflankContext = CorsairPluginContext<
	typeof NorthflankSchema,
	NorthflankPluginOptions
>;

export type NorthflankKeyBuilderContext =
	KeyBuilderContext<NorthflankPluginOptions>;

export type NorthflankBoundEndpoints = BindEndpoints<
	typeof northflankEndpointsNested
>;

export type NorthflankEndpoints = typeof northflankEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const northflankAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseNorthflankPlugin<T extends NorthflankPluginOptions> =
	CorsairPlugin<
		'northflank',
		typeof NorthflankSchema,
		typeof northflankEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalNorthflankPlugin =
	BaseNorthflankPlugin<NorthflankPluginOptions>;

export type ExternalNorthflankPlugin<T extends NorthflankPluginOptions> =
	BaseNorthflankPlugin<T>;

export function northflank<const T extends NorthflankPluginOptions>(
	incomingOptions: NorthflankPluginOptions & T = {} as NorthflankPluginOptions &
		T,
): ExternalNorthflankPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'northflank',
		schema: NorthflankSchema,
		options,
		authConfig: northflankAuthConfig,
		hooks: options.hooks,
		endpoints: northflankEndpointsNested,
		webhooks: {},
		endpointMeta: northflankEndpointMeta,
		endpointSchemas: northflankEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NorthflankKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[NORTHFLANK] API key missing — connect Northflank or pass key in plugin options.',
					);
					throw new AuthMissingError('northflank', 'api_key');
				}
				return res;
			}

			console.error(
				'[NORTHFLANK] Authentication required for Northflank API requests.',
			);
			throw new AuthMissingError('northflank', 'api_key');
		},
	} satisfies InternalNorthflankPlugin;
}

export type {
	NorthflankEndpointInputs,
	NorthflankEndpointOutputs,
} from './endpoints/types';

export { northflankEndpointsNested, northflankEndpointSchemas };
