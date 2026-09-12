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
import { Batch, Check, Credits, Status } from './endpoints';
import type {
	TpscheckEndpointInputs,
	TpscheckEndpointOutputs,
} from './endpoints/types';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TpscheckSchema } from './schema';

export type TpscheckPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTpscheckPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tpscheckEndpointsNested>;
};

export type TpscheckContext = CorsairPluginContext<
	typeof TpscheckSchema,
	TpscheckPluginOptions
>;

export type TpscheckKeyBuilderContext =
	KeyBuilderContext<TpscheckPluginOptions>;

export type TpscheckBoundEndpoints = BindEndpoints<
	typeof tpscheckEndpointsNested
>;

type TpscheckEndpoint<K extends keyof TpscheckEndpointOutputs> =
	CorsairEndpoint<
		TpscheckContext,
		TpscheckEndpointInputs[K],
		TpscheckEndpointOutputs[K]
	>;

export type TpscheckEndpoints = {
	check: TpscheckEndpoint<'check'>;
	batch: TpscheckEndpoint<'batch'>;
	credits: TpscheckEndpoint<'credits'>;
	status: TpscheckEndpoint<'status'>;
};

const tpscheckEndpointsNested = {
	check: {
		post: Check.post,
	},
	batch: {
		post: Batch.post,
	},
	credits: {
		get: Credits.get,
	},
	status: {
		get: Status.get,
	},
} as const;

export const tpscheckEndpointSchemas = {
	'check.post': {
		input: TpscheckEndpointInputSchemas.check,
		output: TpscheckEndpointOutputSchemas.check,
	},
	'batch.post': {
		input: TpscheckEndpointInputSchemas.batch,
		output: TpscheckEndpointOutputSchemas.batch,
	},
	'credits.get': {
		input: TpscheckEndpointInputSchemas.credits,
		output: TpscheckEndpointOutputSchemas.credits,
	},
	'status.get': {
		input: TpscheckEndpointInputSchemas.status,
		output: TpscheckEndpointOutputSchemas.status,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tpscheckEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tpscheckEndpointMeta = {
	'check.post': {
		riskLevel: 'read',
		description: 'Check a UK phone number against TPS and CTPS registers',
	},
	'batch.post': {
		riskLevel: 'read',
		description:
			'Check multiple UK phone numbers against TPS and CTPS registers',
	},
	'credits.get': {
		riskLevel: 'read',
		description: 'Get TPSCheck API usage and remaining credits',
	},
	'status.get': {
		riskLevel: 'read',
		description: 'Check TPSCheck API health and version',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tpscheckEndpointsNested>;

export const tpscheckAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseTpscheckPlugin<T extends TpscheckPluginOptions> = CorsairPlugin<
	'tpscheck',
	typeof TpscheckSchema,
	typeof tpscheckEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalTpscheckPlugin = BaseTpscheckPlugin<TpscheckPluginOptions>;

export type ExternalTpscheckPlugin<T extends TpscheckPluginOptions> =
	BaseTpscheckPlugin<T>;

export function tpscheck<const T extends TpscheckPluginOptions>(
	incomingOptions: TpscheckPluginOptions & T = {} as TpscheckPluginOptions & T,
): ExternalTpscheckPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'tpscheck',
		authConfig: tpscheckAuthConfig,
		schema: TpscheckSchema,
		options,
		hooks: options.hooks,
		endpoints: tpscheckEndpointsNested,
		endpointMeta: tpscheckEndpointMeta,
		endpointSchemas: tpscheckEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TpscheckKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('tpscheck', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('tpscheck', 'api_key');
		},
	} satisfies InternalTpscheckPlugin;
}

export type {
	BatchInput,
	BatchResponse,
	CheckInput,
	CheckResponse,
	CreditsInput,
	CreditsResponse,
	StatusInput,
	StatusResponse,
	TpscheckEndpointInputs,
	TpscheckEndpointOutputs,
} from './endpoints/types';
