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
import { EncodianEndpointsNested } from './endpoints';
import { EncodianEndpointMeta } from './endpoints/plugin-registration';
import { EncodianEndpointSchemas } from './endpoints/plugin-schemas';
import { errorHandlers } from './error-handlers';
import { EncodianSchema } from './schema';

export type EncodianPluginOptions = {
	key?: string;
	authType?: PickAuth<'api_key'>;
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof EncodianEndpointsNested>;
};

export type EncodianContext = CorsairPluginContext<
	typeof EncodianSchema,
	EncodianPluginOptions
>;

export type EncodianKeyBuilderContext =
	KeyBuilderContext<EncodianPluginOptions>;

export type EncodianBoundEndpoints = BindEndpoints<
	typeof EncodianEndpointsNested
>;

const encodianEndpointsNested = EncodianEndpointsNested;
const encodianWebhooksNested = {} as const;

export const encodianEndpointSchemas =
	EncodianEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof encodianEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const encodianEndpointMeta =
	EncodianEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof encodianEndpointsNested
	>;

export const encodianAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseEncodianPlugin<T extends EncodianPluginOptions> = CorsairPlugin<
	'encodian',
	typeof EncodianSchema,
	typeof encodianEndpointsNested,
	typeof encodianWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEncodianPlugin = BaseEncodianPlugin<EncodianPluginOptions>;

export type ExternalEncodianPlugin<T extends EncodianPluginOptions> =
	BaseEncodianPlugin<T>;

export function encodian<const T extends EncodianPluginOptions>(
	incomingOptions: EncodianPluginOptions & T = {} as EncodianPluginOptions & T,
): ExternalEncodianPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'encodian',
		authConfig: encodianAuthConfig,
		schema: EncodianSchema,
		options: options,
		endpoints: encodianEndpointsNested,
		webhooks: encodianWebhooksNested,
		endpointMeta: encodianEndpointMeta,
		endpointSchemas: encodianEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EncodianKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('encodian', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('encodian', 'api_key');
			return apiKey;
		},
	} satisfies InternalEncodianPlugin;
}

export type {
	EncodianEndpointInputs,
	EncodianEndpointOutputs,
	EncodianOperationId,
} from './endpoints/types';
