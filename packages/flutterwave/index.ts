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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	flutterwaveEndpointSchemas,
	flutterwaveEndpointsNested,
	flutterwaveEndpointMeta as generatedFlutterwaveEndpointMeta,
} from './endpoints';
import type {
	FlutterwaveEndpointInputs,
	FlutterwaveEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FlutterwaveSchema } from './schema';

export const flutterwaveEndpointMeta =
	generatedFlutterwaveEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof flutterwaveEndpointsNested
	>;

export const typedFlutterwaveEndpointSchemas =
	flutterwaveEndpointSchemas as unknown as RequiredPluginEndpointSchemas<
		typeof flutterwaveEndpointsNested
	>;

export type FlutterwavePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFlutterwavePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof flutterwaveEndpointsNested>;
};

export type FlutterwaveContext = CorsairPluginContext<
	typeof FlutterwaveSchema,
	FlutterwavePluginOptions
>;

export type FlutterwaveKeyBuilderContext =
	KeyBuilderContext<FlutterwavePluginOptions>;

export type FlutterwaveBoundEndpoints = BindEndpoints<
	typeof flutterwaveEndpointsNested
>;

export type FlutterwaveEndpoints = typeof flutterwaveEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const flutterwaveAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFlutterwavePlugin<T extends FlutterwavePluginOptions> =
	CorsairPlugin<
		'flutterwave',
		typeof FlutterwaveSchema,
		typeof flutterwaveEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalFlutterwavePlugin =
	BaseFlutterwavePlugin<FlutterwavePluginOptions>;

export type ExternalFlutterwavePlugin<T extends FlutterwavePluginOptions> =
	BaseFlutterwavePlugin<T>;

export function flutterwave<const T extends FlutterwavePluginOptions>(
	incomingOptions: FlutterwavePluginOptions &
		T = {} as FlutterwavePluginOptions & T,
): ExternalFlutterwavePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'flutterwave',
		schema: FlutterwaveSchema,
		options,
		authConfig: flutterwaveAuthConfig,
		hooks: options.hooks,
		endpoints: flutterwaveEndpointsNested,
		webhooks: {},
		endpointMeta: flutterwaveEndpointMeta,
		endpointSchemas: typedFlutterwaveEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FlutterwaveKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('flutterwave', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('flutterwave', 'api_key');
		},
	} satisfies InternalFlutterwavePlugin;
}

export type {
	FlutterwaveEndpointInput,
	FlutterwaveEndpointInputs,
	FlutterwaveEndpointOutputs,
} from './endpoints/types';

export { flutterwaveEndpointsNested, flutterwaveEndpointSchemas };
