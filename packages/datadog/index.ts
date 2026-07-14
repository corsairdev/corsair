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
	DatadogEndpointInputs,
	DatadogEndpointOutputs,
} from './endpoints/types';
import {
	DatadogEndpointInputSchemas,
	DatadogEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DatadogSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDatadogOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDatadogTenantWebhook } from './webhooks/tenant-matcher';
import type { DatadogWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DatadogPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDatadogPlugin['hooks'];
	webhookHooks?: InternalDatadogPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof datadogEndpointsNested>;
};

export type DatadogContext = CorsairPluginContext<
	typeof DatadogSchema,
	DatadogPluginOptions
>;

export type DatadogKeyBuilderContext = KeyBuilderContext<DatadogPluginOptions>;

export type DatadogBoundEndpoints = BindEndpoints<
	typeof datadogEndpointsNested
>;

type DatadogEndpoint<K extends keyof DatadogEndpointOutputs> = CorsairEndpoint<
	DatadogContext,
	DatadogEndpointInputs[K],
	DatadogEndpointOutputs[K]
>;

export type DatadogEndpoints = {
	exampleGet: DatadogEndpoint<'exampleGet'>;
};

type DatadogWebhook<
	K extends keyof DatadogWebhookOutputs,
	TEvent,
> = CorsairWebhook<DatadogContext, TEvent, DatadogWebhookOutputs[K]>;

export type DatadogWebhooks = {
	example: DatadogWebhook<'example', ExampleEvent>;
};

export type DatadogBoundWebhooks = BindWebhooks<DatadogWebhooks>;

const datadogEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const datadogWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const datadogEndpointSchemas = {
	'example.get': {
		input: DatadogEndpointInputSchemas.exampleGet,
		output: DatadogEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof datadogEndpointsNested
>;

const datadogWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof datadogWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const datadogEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof datadogEndpointsNested>;

export const datadogAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDatadogPlugin<T extends DatadogPluginOptions> = CorsairPlugin<
	'datadog',
	typeof DatadogSchema,
	typeof datadogEndpointsNested,
	typeof datadogWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDatadogPlugin = BaseDatadogPlugin<DatadogPluginOptions>;

export type ExternalDatadogPlugin<T extends DatadogPluginOptions> =
	BaseDatadogPlugin<T>;

export function datadog<const T extends DatadogPluginOptions>(
	incomingOptions: DatadogPluginOptions & T = {} as DatadogPluginOptions & T,
): ExternalDatadogPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'datadog',
		authConfig: datadogAuthConfig,
		schema: DatadogSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: datadogEndpointsNested,
		webhooks: datadogWebhooksNested,
		endpointMeta: datadogEndpointMeta,
		endpointSchemas: datadogEndpointSchemas,
		webhookSchemas: datadogWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-datadog-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDatadogTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDatadogOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DatadogKeyBuilderContext, source) => {
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
	} satisfies InternalDatadogPlugin;
}

export type {
	DatadogEndpointInputs,
	DatadogEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	DatadogWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
