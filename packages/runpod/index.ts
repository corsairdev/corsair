import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Pods } from './endpoints';
import type {
	RunpodEndpointInputs,
	RunpodEndpointOutputs,
} from './endpoints/types';
import {
	RunpodEndpointInputSchemas,
	RunpodEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RunpodSchema } from './schema';

export type RunpodPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRunpodPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof runpodEndpointsNested>;
};

export type RunpodContext = CorsairPluginContext<
	typeof RunpodSchema,
	RunpodPluginOptions
>;

export type RunpodKeyBuilderContext = KeyBuilderContext<RunpodPluginOptions>;

export type RunpodBoundEndpoints = BindEndpoints<typeof runpodEndpointsNested>;

type RunpodEndpoint<K extends keyof RunpodEndpointOutputs> = CorsairEndpoint<
	RunpodContext,
	RunpodEndpointInputs[K],
	RunpodEndpointOutputs[K]
>;

export type RunpodEndpoints = {
	listPods: RunpodEndpoint<'listPods'>;
};

export type RunpodWebhooks = {};

export type RunpodBoundWebhooks = BindWebhooks<RunpodWebhooks>;

const runpodEndpointsNested = {
	pods: {
		list: Pods.list,
	},
} as const;

const runpodWebhooksNested = {} as const;

export const runpodEndpointSchemas = {
	'pods.list': {
		input: RunpodEndpointInputSchemas.listPods,
		output: RunpodEndpointOutputSchemas.listPods,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof runpodEndpointsNested
>;

const runpodWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof runpodWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const runpodEndpointMeta = {
	'pods.list': {
		riskLevel: 'read',
		description: 'List RunPod pods',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof runpodEndpointsNested>;

export const runpodAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRunpodPlugin<T extends RunpodPluginOptions> = CorsairPlugin<
	'runpod',
	typeof RunpodSchema,
	typeof runpodEndpointsNested,
	typeof runpodWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRunpodPlugin = BaseRunpodPlugin<RunpodPluginOptions>;

export type ExternalRunpodPlugin<T extends RunpodPluginOptions> =
	BaseRunpodPlugin<T>;

export function runpod<const T extends RunpodPluginOptions>(
	incomingOptions: RunpodPluginOptions & T = {} as RunpodPluginOptions & T,
): ExternalRunpodPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'runpod',
		authConfig: runpodAuthConfig,
		schema: RunpodSchema,
		options,
		hooks: options.hooks,
		endpoints: runpodEndpointsNested,
		webhooks: runpodWebhooksNested,
		endpointMeta: runpodEndpointMeta,
		endpointSchemas: runpodEndpointSchemas,
		webhookSchemas: runpodWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RunpodKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalRunpodPlugin;
}

export type {
	ListPodsInput,
	ListPodsResponse,
	RunpodEndpointInputs,
	RunpodEndpointOutputs,
} from './endpoints/types';
