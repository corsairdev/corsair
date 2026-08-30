import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';

import type {
	ReplicateEndpointInputs,
	ReplicateEndpointOutputs,
} from './endpoints/types';

import {
	ReplicateEndpointInputSchemas,
	ReplicateEndpointOutputSchemas,
} from './endpoints/types';

import type {
	ReplicateWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';

import { ExampleEventSchema } from './webhooks/types';
import {
	CreatePrediction,
	GetPrediction,
	ListPredictions,
	CancelPrediction,
} from './endpoints';

import { ReplicateSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchReplicateTenantWebhook } from './webhooks/tenant-matcher';
import { resolveReplicateOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ReplicatePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalReplicatePlugin['hooks'];
	webhookHooks?: InternalReplicatePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof replicateEndpointsNested>;
};

export type ReplicateContext = CorsairPluginContext<
	typeof ReplicateSchema,
	ReplicatePluginOptions
>;

export type ReplicateKeyBuilderContext =
	KeyBuilderContext<ReplicatePluginOptions>;

export type ReplicateBoundEndpoints =
	BindEndpoints<typeof replicateEndpointsNested>;

type ReplicateEndpoint<
	K extends keyof ReplicateEndpointOutputs,
> = CorsairEndpoint<
	ReplicateContext,
	ReplicateEndpointInputs[K],
	ReplicateEndpointOutputs[K]
>;

export type ReplicateEndpoints = {
	createPrediction: ReplicateEndpoint<'createPrediction'>;
	getPrediction: ReplicateEndpoint<'getPrediction'>;
	listPredictions: ReplicateEndpoint<'listPredictions'>;
	cancelPrediction: ReplicateEndpoint<'cancelPrediction'>;
};

type ReplicateWebhook<
	K extends keyof ReplicateWebhookOutputs,
	TEvent,
> = CorsairWebhook<ReplicateContext, TEvent, ReplicateWebhookOutputs[K]>;

export type ReplicateWebhooks = {
	example: ReplicateWebhook<'example', ExampleEvent>;
};

export type ReplicateBoundWebhooks =
	BindWebhooks<ReplicateWebhooks>;

const replicateEndpointsNested = {
	createPrediction: CreatePrediction,
	getPrediction: GetPrediction,
	listPredictions: ListPredictions,
	cancelPrediction: CancelPrediction,
} as const;

const replicateWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const replicateEndpointSchemas = {
	createPrediction: {
		input: ReplicateEndpointInputSchemas.createPrediction,
		output: ReplicateEndpointOutputSchemas.createPrediction,
	},
	getPrediction: {
		input: ReplicateEndpointInputSchemas.getPrediction,
		output: ReplicateEndpointOutputSchemas.getPrediction,
	},
	listPredictions: {
		input: ReplicateEndpointInputSchemas.listPredictions,
		output: ReplicateEndpointOutputSchemas.listPredictions,
	},
	cancelPrediction: {
		input: ReplicateEndpointInputSchemas.cancelPrediction,
		output: ReplicateEndpointOutputSchemas.cancelPrediction,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof replicateEndpointsNested
>;

const replicateWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof replicateWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const replicateEndpointMeta = {
	createPrediction: {
		riskLevel: 'write',
		description: 'Create a Replicate prediction',
	},
	getPrediction: {
		riskLevel: 'read',
		description: 'Get a Replicate prediction by ID',
	},
	listPredictions: {
		riskLevel: 'read',
		description: 'List Replicate predictions',
	},
	cancelPrediction: {
		riskLevel: 'write',
		description: 'Cancel a Replicate prediction',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof replicateEndpointsNested
>;

export const replicateAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseReplicatePlugin<
	T extends ReplicatePluginOptions,
> = CorsairPlugin<
	'replicate',
	typeof ReplicateSchema,
	typeof replicateEndpointsNested,
	typeof replicateWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalReplicatePlugin =
	BaseReplicatePlugin<ReplicatePluginOptions>;

export type ExternalReplicatePlugin<
	T extends ReplicatePluginOptions,
> = BaseReplicatePlugin<T>;

export function replicate<const T extends ReplicatePluginOptions>(
	incomingOptions: ReplicatePluginOptions & T = {} as ReplicatePluginOptions & T,
): ExternalReplicatePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'replicate',
		authConfig: replicateAuthConfig,
		schema: ReplicateSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: replicateEndpointsNested,
		webhooks: replicateWebhooksNested,
		endpointMeta: replicateEndpointMeta,
		endpointSchemas: replicateEndpointSchemas,
		webhookSchemas: replicateWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-replicate-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchReplicateTenantWebhook,

		oauthWebhookTenantLinkResolver:
			resolveReplicateOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (
			ctx: ReplicateKeyBuilderContext,
			source,
		) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res =
					await ctx.keys.get_webhook_signature();

				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (
				source === 'endpoint' &&
				ctx.authType === 'api_key'
			) {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (
				source === 'endpoint' &&
				ctx.authType === 'oauth_2'
			) {
				const res =
					await ctx.keys.get_access_token();

				return res ?? '';
			}

			return '';
		},
	} satisfies InternalReplicatePlugin;
}

export type {
	ExampleEvent,
	ReplicateWebhookOutputs,
} from './webhooks/types';

export type {
	ReplicateEndpointInputs,
	ReplicateEndpointOutputs,
} from './endpoints/types';