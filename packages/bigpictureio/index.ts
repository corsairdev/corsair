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
import { Company } from './endpoints';
import type {
	BigpictureioEndpointInputs,
	BigpictureioEndpointOutputs,
} from './endpoints/types';
import {
	BigpictureioEndpointInputSchemas,
	BigpictureioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BigpictureioSchema } from './schema';

export type BigpictureioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBigpictureioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bigpictureioEndpointsNested>;
};

export type BigpictureioContext = CorsairPluginContext<
	typeof BigpictureioSchema,
	BigpictureioPluginOptions
>;

export type BigpictureioKeyBuilderContext =
	KeyBuilderContext<BigpictureioPluginOptions>;

export type BigpictureioBoundEndpoints = BindEndpoints<
	typeof bigpictureioEndpointsNested
>;

type BigpictureioEndpoint<K extends keyof BigpictureioEndpointOutputs> =
	CorsairEndpoint<
		BigpictureioContext,
		BigpictureioEndpointInputs[K],
		BigpictureioEndpointOutputs[K]
	>;

export type BigpictureioEndpoints = {
	companyFind: BigpictureioEndpoint<'companyFind'>;
};

const bigpictureioEndpointsNested = {
	company: {
		find: Company.find,
	},
} as const;

const bigpictureioWebhooksNested = {} as const;

export const bigpictureioEndpointSchemas = {
	'company.find': {
		input: BigpictureioEndpointInputSchemas.companyFind,
		output: BigpictureioEndpointOutputSchemas.companyFind,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bigpictureioEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bigpictureioEndpointMeta = {
	'company.find': {
		riskLevel: 'read',
		description: 'Find detailed company information by domain',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bigpictureioEndpointsNested
>;

export const bigpictureioAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBigpictureioPlugin<T extends BigpictureioPluginOptions> =
	CorsairPlugin<
		'bigpictureio',
		typeof BigpictureioSchema,
		typeof bigpictureioEndpointsNested,
		typeof bigpictureioWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBigpictureioPlugin =
	BaseBigpictureioPlugin<BigpictureioPluginOptions>;

export type ExternalBigpictureioPlugin<T extends BigpictureioPluginOptions> =
	BaseBigpictureioPlugin<T>;

export function bigpictureio<const T extends BigpictureioPluginOptions>(
	incomingOptions: BigpictureioPluginOptions &
		T = {} as BigpictureioPluginOptions & T,
): ExternalBigpictureioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
	return {
		id: 'bigpictureio',
		authConfig: bigpictureioAuthConfig,
		schema: BigpictureioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: bigpictureioEndpointsNested,
		webhooks: bigpictureioWebhooksNested,
		endpointMeta: bigpictureioEndpointMeta,
		endpointSchemas: bigpictureioEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...specificDefaults,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
		},
		keyBuilder: async (ctx: BigpictureioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('bigpictureio', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('bigpictureio', 'api_key');
		},
	} satisfies InternalBigpictureioPlugin;
}

export type {
	BigpictureioEndpointInputs,
	BigpictureioEndpointOutputs,
	CompanyFindInput,
	CompanyFindResponse,
} from './endpoints/types';
