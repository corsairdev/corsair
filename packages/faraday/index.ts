import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
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
import { FARADAY_OPS, nestFaradayEndpoints, opKey } from './endpoints';
import type {
	FaradayEndpointInputs,
	FaradayEndpointOutputs,
} from './endpoints/types';
import {
	FaradayEndpointInputSchemas,
	FaradayEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FaradaySchema } from './schema';

export type FaradayPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFaradayPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof faradayEndpointsNested>;
};

export type FaradayContext = CorsairPluginContext<
	typeof FaradaySchema,
	FaradayPluginOptions
>;

export type FaradayKeyBuilderContext = KeyBuilderContext<FaradayPluginOptions>;

export type FaradayBoundEndpoints = BindEndpoints<
	typeof faradayEndpointsNested
>;

type FaradayEndpoint<K extends keyof FaradayEndpointOutputs> = CorsairEndpoint<
	FaradayContext,
	FaradayEndpointInputs[K],
	FaradayEndpointOutputs[K]
>;

export type FaradayEndpoints = {
	[K in keyof FaradayEndpointOutputs]: FaradayEndpoint<K>;
};

const faradayEndpointsNested = nestFaradayEndpoints() as ReturnType<
	typeof nestFaradayEndpoints
> &
	Record<string, Record<string, FaradayEndpoint<keyof FaradayEndpointOutputs>>>;

export const faradayEndpointSchemas = Object.fromEntries(
	FARADAY_OPS.map((op) => [
		opKey(op),
		{
			input: FaradayEndpointInputSchemas[opKey(op)],
			output: FaradayEndpointOutputSchemas[opKey(op)],
		},
	]),
) as unknown as RequiredPluginEndpointSchemas<typeof faradayEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const faradayEndpointMeta = Object.fromEntries(
	FARADAY_OPS.map((op) => [
		opKey(op),
		{ riskLevel: op.risk, description: op.description },
	]),
) as RequiredPluginEndpointMeta<typeof faradayEndpointsNested>;

void (faradayEndpointMeta satisfies RequiredPluginEndpointMeta<
	typeof faradayEndpointsNested
>);

export const faradayAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFaradayPlugin<T extends FaradayPluginOptions> = CorsairPlugin<
	'faraday',
	typeof FaradaySchema,
	typeof faradayEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalFaradayPlugin = BaseFaradayPlugin<FaradayPluginOptions>;

export type ExternalFaradayPlugin<T extends FaradayPluginOptions> =
	BaseFaradayPlugin<T>;

export function faraday<const T extends FaradayPluginOptions>(
	incomingOptions: FaradayPluginOptions & T = {} as FaradayPluginOptions & T,
): ExternalFaradayPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'faraday',
		authConfig: faradayAuthConfig,
		schema: FaradaySchema,
		options,
		hooks: options.hooks,
		endpoints: faradayEndpointsNested,
		webhooks: {},
		endpointMeta: faradayEndpointMeta,
		endpointSchemas: faradayEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FaradayKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('faraday', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('faraday', 'api_key');
		},
	} satisfies InternalFaradayPlugin;
}

export type {
	FaradayEndpointInputs,
	FaradayEndpointOutputs,
} from './endpoints/types';
export {
	FaradayEndpointInputSchemas,
	FaradayEndpointOutputSchemas,
} from './endpoints/types';
