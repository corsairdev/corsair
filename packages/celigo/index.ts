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
import { Flow } from './endpoints';
import type {
	CeligoEndpointInputs,
	CeligoEndpointOutputs,
} from './endpoints/types';
import {
	CeligoEndpointInputSchemas,
	CeligoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CeligoSchema } from './schema';

export type CeligoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCeligoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof celigoEndpointsNested>;
};

export type CeligoContext = CorsairPluginContext<
	typeof CeligoSchema,
	CeligoPluginOptions
>;

export type CeligoKeyBuilderContext = KeyBuilderContext<CeligoPluginOptions>;

export type CeligoBoundEndpoints = BindEndpoints<typeof celigoEndpointsNested>;

type CeligoEndpoint<K extends keyof CeligoEndpointOutputs> = CorsairEndpoint<
	CeligoContext,
	CeligoEndpointInputs[K],
	CeligoEndpointOutputs[K]
>;

export type CeligoEndpoints = {
	getFlow: CeligoEndpoint<'getFlow'>;
};

const celigoEndpointsNested = {
	flow: {
		get: Flow.get,
	},
} as const;

const celigoWebhooksNested = {} as const;

export const celigoEndpointSchemas = {
	'flow.get': {
		input: CeligoEndpointInputSchemas.getFlow,
		output: CeligoEndpointOutputSchemas.getFlow,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof celigoEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const celigoEndpointMeta = {
	'flow.get': {
		riskLevel: 'read',
		description: 'Get a Celigo flow by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof celigoEndpointsNested>;

export const celigoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCeligoPlugin<T extends CeligoPluginOptions> = CorsairPlugin<
	'celigo',
	typeof CeligoSchema,
	typeof celigoEndpointsNested,
	typeof celigoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCeligoPlugin = BaseCeligoPlugin<CeligoPluginOptions>;

export type ExternalCeligoPlugin<T extends CeligoPluginOptions> =
	BaseCeligoPlugin<T>;

export function celigo<const T extends CeligoPluginOptions>(
	incomingOptions: CeligoPluginOptions & T = {} as CeligoPluginOptions & T,
): ExternalCeligoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'celigo',
		authConfig: celigoAuthConfig,
		schema: CeligoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: celigoEndpointsNested,
		webhooks: celigoWebhooksNested,
		endpointMeta: celigoEndpointMeta,
		endpointSchemas: celigoEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CeligoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('celigo', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('celigo', 'api_key');
		},
	} satisfies InternalCeligoPlugin;
}

export type {
	CeligoEndpointInputs,
	CeligoEndpointOutputs,
	GetFlowInput,
	GetFlowResponse,
} from './endpoints/types';
