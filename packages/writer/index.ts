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
	WriterEndpointInputs,
	WriterEndpointOutputs,
} from './endpoints/types';
import {
	WriterEndpointInputSchemas,
	WriterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WriterSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveWriterOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchWriterTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, WriterWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type WriterPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWriterPlugin['hooks'];
	webhookHooks?: InternalWriterPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof writerEndpointsNested>;
};

export type WriterContext = CorsairPluginContext<
	typeof WriterSchema,
	WriterPluginOptions
>;

export type WriterKeyBuilderContext = KeyBuilderContext<WriterPluginOptions>;

export type WriterBoundEndpoints = BindEndpoints<typeof writerEndpointsNested>;

type WriterEndpoint<K extends keyof WriterEndpointOutputs> = CorsairEndpoint<
	WriterContext,
	WriterEndpointInputs[K],
	WriterEndpointOutputs[K]
>;

export type WriterEndpoints = {
	exampleGet: WriterEndpoint<'exampleGet'>;
};

type WriterWebhook<
	K extends keyof WriterWebhookOutputs,
	TEvent,
> = CorsairWebhook<WriterContext, TEvent, WriterWebhookOutputs[K]>;

export type WriterWebhooks = {
	example: WriterWebhook<'example', ExampleEvent>;
};

export type WriterBoundWebhooks = BindWebhooks<WriterWebhooks>;

const writerEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const writerWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const writerEndpointSchemas = {
	'example.get': {
		input: WriterEndpointInputSchemas.exampleGet,
		output: WriterEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof writerEndpointsNested
>;

const writerWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof writerWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const writerEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof writerEndpointsNested>;

export const writerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWriterPlugin<T extends WriterPluginOptions> = CorsairPlugin<
	'writer',
	typeof WriterSchema,
	typeof writerEndpointsNested,
	typeof writerWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWriterPlugin = BaseWriterPlugin<WriterPluginOptions>;

export type ExternalWriterPlugin<T extends WriterPluginOptions> =
	BaseWriterPlugin<T>;

export function writer<const T extends WriterPluginOptions>(
	incomingOptions: WriterPluginOptions & T = {} as WriterPluginOptions & T,
): ExternalWriterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'writer',
		authConfig: writerAuthConfig,
		schema: WriterSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: writerEndpointsNested,
		webhooks: writerWebhooksNested,
		endpointMeta: writerEndpointMeta,
		endpointSchemas: writerEndpointSchemas,
		webhookSchemas: writerWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-writer-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchWriterTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWriterOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WriterKeyBuilderContext, source) => {
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
	} satisfies InternalWriterPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	WriterEndpointInputs,
	WriterEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	WriterWebhookOutputs,
} from './webhooks/types';
