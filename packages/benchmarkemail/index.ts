import type {
	AuthTypes,
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
import { Example } from './endpoints';
import type {
	BenchmarkEmailEndpointInputs,
	BenchmarkEmailEndpointOutputs,
} from './endpoints/types';
import {
	BenchmarkEmailEndpointInputSchemas,
	BenchmarkEmailEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BenchmarkEmailSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBenchmarkEmailOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBenchmarkEmailTenantWebhook } from './webhooks/tenant-matcher';
import type {
	BenchmarkEmailWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BenchmarkEmailPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBenchmarkEmailPlugin['hooks'];
	webhookHooks?: InternalBenchmarkEmailPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof benchmarkEmailEndpointsNested>;
};

export type BenchmarkEmailContext = CorsairPluginContext<
	typeof BenchmarkEmailSchema,
	BenchmarkEmailPluginOptions
>;

export type BenchmarkEmailKeyBuilderContext =
	KeyBuilderContext<BenchmarkEmailPluginOptions>;

export type BenchmarkEmailBoundEndpoints = BindEndpoints<
	typeof benchmarkEmailEndpointsNested
>;

type BenchmarkEmailEndpoint<K extends keyof BenchmarkEmailEndpointOutputs> =
	CorsairEndpoint<
		BenchmarkEmailContext,
		BenchmarkEmailEndpointInputs[K],
		BenchmarkEmailEndpointOutputs[K]
	>;

export type BenchmarkEmailEndpoints = {
	exampleGet: BenchmarkEmailEndpoint<'exampleGet'>;
};

type BenchmarkEmailWebhook<
	K extends keyof BenchmarkEmailWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	BenchmarkEmailContext,
	TEvent,
	BenchmarkEmailWebhookOutputs[K]
>;

export type BenchmarkEmailWebhooks = {
	example: BenchmarkEmailWebhook<'example', ExampleEvent>;
};

export type BenchmarkEmailBoundWebhooks = BindWebhooks<BenchmarkEmailWebhooks>;

const benchmarkEmailEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const benchmarkEmailWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const benchmarkEmailEndpointSchemas = {
	'example.get': {
		input: BenchmarkEmailEndpointInputSchemas.exampleGet,
		output: BenchmarkEmailEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof benchmarkEmailEndpointsNested
>;

const benchmarkEmailWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof benchmarkEmailWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const benchmarkEmailEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof benchmarkEmailEndpointsNested
>;

export const benchmarkEmailAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBenchmarkEmailPlugin<T extends BenchmarkEmailPluginOptions> =
	CorsairPlugin<
		'benchmarkemail',
		typeof BenchmarkEmailSchema,
		typeof benchmarkEmailEndpointsNested,
		typeof benchmarkEmailWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBenchmarkEmailPlugin =
	BaseBenchmarkEmailPlugin<BenchmarkEmailPluginOptions>;

export type ExternalBenchmarkEmailPlugin<
	T extends BenchmarkEmailPluginOptions,
> = BaseBenchmarkEmailPlugin<T>;

export function benchmarkemail<const T extends BenchmarkEmailPluginOptions>(
	incomingOptions: BenchmarkEmailPluginOptions &
		T = {} as BenchmarkEmailPluginOptions & T,
): ExternalBenchmarkEmailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'benchmarkemail',
		authConfig: benchmarkEmailAuthConfig,
		schema: BenchmarkEmailSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: benchmarkEmailEndpointsNested,
		webhooks: benchmarkEmailWebhooksNested,
		endpointMeta: benchmarkEmailEndpointMeta,
		endpointSchemas: benchmarkEmailEndpointSchemas,
		webhookSchemas: benchmarkEmailWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-benchmarkemail-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBenchmarkEmailTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBenchmarkEmailOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BenchmarkEmailKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBenchmarkEmailPlugin;
}

export type {
	BenchmarkEmailEndpointInputs,
	BenchmarkEmailEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BenchmarkEmailWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
