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
	activeTrailEndpointMeta as generatedActiveTrailEndpointMeta,
	activeTrailEndpointSchemas,
	activeTrailEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { ActiveTrailSchema } from './schema';

export const activeTrailEndpointMeta =
	generatedActiveTrailEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof activeTrailEndpointsNested
	>;

export type ActiveTrailPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalActiveTrailPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof activeTrailEndpointsNested>;
};

export type ActiveTrailContext = CorsairPluginContext<
	typeof ActiveTrailSchema,
	ActiveTrailPluginOptions
>;

export type ActiveTrailKeyBuilderContext = KeyBuilderContext<ActiveTrailPluginOptions>;

export type ActiveTrailBoundEndpoints = BindEndpoints<typeof activeTrailEndpointsNested>;

export type ActiveTrailEndpoints = typeof activeTrailEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const activeTrailAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseActiveTrailPlugin<T extends ActiveTrailPluginOptions> = CorsairPlugin<
	'active_trail',
	typeof ActiveTrailSchema,
	typeof activeTrailEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalActiveTrailPlugin = BaseActiveTrailPlugin<ActiveTrailPluginOptions>;

export type ExternalActiveTrailPlugin<T extends ActiveTrailPluginOptions> =
	BaseActiveTrailPlugin<T>;

export function active_trail<const T extends ActiveTrailPluginOptions>(
	incomingOptions: ActiveTrailPluginOptions & T = {} as ActiveTrailPluginOptions & T,
): ExternalActiveTrailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'active_trail',
		schema: ActiveTrailSchema,
		options,
		authConfig: activeTrailAuthConfig,
		hooks: options.hooks,
		endpoints: activeTrailEndpointsNested,
		webhooks: {},
		endpointMeta: activeTrailEndpointMeta,
		endpointSchemas: activeTrailEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ActiveTrailKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[ACTIVETRAIL] API key missing — connect ActiveTrail or pass key in plugin options.',
					);
					throw new AuthMissingError('active_trail', 'api_key');
				}
				return res;
			}

			console.error(
				'[ACTIVETRAIL] Authentication required for ActiveTrail API requests.',
			);
			throw new AuthMissingError('active_trail', 'api_key');
		},
	} satisfies InternalActiveTrailPlugin;
}

export type {
	ActiveTrailEndpointInputs,
	ActiveTrailEndpointOutputs,
} from './endpoints/types';

export { activeTrailEndpointsNested, activeTrailEndpointSchemas };
