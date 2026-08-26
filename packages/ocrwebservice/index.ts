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
import { AuthMissingError } from 'corsair/core';
import { Example } from './endpoints';
import type {
	OcrWebServiceEndpointInputs,
	OcrWebServiceEndpointOutputs,
} from './endpoints/types';
import {
	OcrWebServiceEndpointInputSchemas,
	OcrWebServiceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OcrWebServiceSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveOcrWebServiceOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchOcrWebServiceTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ExampleEvent,
	OcrWebServiceWebhookOutputs,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type OcrWebServicePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalOcrWebServicePlugin['hooks'];
	webhookHooks?: InternalOcrWebServicePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ocrWebServiceEndpointsNested>;
};

export type OcrWebServiceContext = CorsairPluginContext<
	typeof OcrWebServiceSchema,
	OcrWebServicePluginOptions
>;

export type OcrWebServiceKeyBuilderContext =
	KeyBuilderContext<OcrWebServicePluginOptions>;

export type OcrWebServiceBoundEndpoints = BindEndpoints<
	typeof ocrWebServiceEndpointsNested
>;

type OcrWebServiceEndpoint<K extends keyof OcrWebServiceEndpointOutputs> =
	CorsairEndpoint<
		OcrWebServiceContext,
		OcrWebServiceEndpointInputs[K],
		OcrWebServiceEndpointOutputs[K]
	>;

export type OcrWebServiceEndpoints = {
	exampleGet: OcrWebServiceEndpoint<'exampleGet'>;
};

type OcrWebServiceWebhook<
	K extends keyof OcrWebServiceWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	OcrWebServiceContext,
	TEvent,
	OcrWebServiceWebhookOutputs[K]
>;

export type OcrWebServiceWebhooks = {
	example: OcrWebServiceWebhook<'example', ExampleEvent>;
};

export type OcrWebServiceBoundWebhooks = BindWebhooks<OcrWebServiceWebhooks>;

const ocrWebServiceEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const ocrWebServiceWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const ocrWebServiceEndpointSchemas = {
	'example.get': {
		input: OcrWebServiceEndpointInputSchemas.exampleGet,
		output: OcrWebServiceEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ocrWebServiceEndpointsNested
>;

const ocrWebServiceWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof ocrWebServiceWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ocrWebServiceEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof ocrWebServiceEndpointsNested
>;

export const ocrWebServiceAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOcrWebServicePlugin<T extends OcrWebServicePluginOptions> =
	CorsairPlugin<
		'ocrwebservice',
		typeof OcrWebServiceSchema,
		typeof ocrWebServiceEndpointsNested,
		typeof ocrWebServiceWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalOcrWebServicePlugin =
	BaseOcrWebServicePlugin<OcrWebServicePluginOptions>;

export type ExternalOcrWebServicePlugin<T extends OcrWebServicePluginOptions> =
	BaseOcrWebServicePlugin<T>;

export function ocrwebservice<const T extends OcrWebServicePluginOptions>(
	incomingOptions: OcrWebServicePluginOptions &
		T = {} as OcrWebServicePluginOptions & T,
): ExternalOcrWebServicePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ocrwebservice',
		authConfig: ocrWebServiceAuthConfig,
		schema: OcrWebServiceSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ocrWebServiceEndpointsNested,
		webhooks: ocrWebServiceWebhooksNested,
		endpointMeta: ocrWebServiceEndpointMeta,
		endpointSchemas: ocrWebServiceEndpointSchemas,
		webhookSchemas: ocrWebServiceWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-ocrwebservice-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchOcrWebServiceTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveOcrWebServiceOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OcrWebServiceKeyBuilderContext, source) => {
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
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('ocrwebservice', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('ocrwebservice', 'api_key');
		},
	} satisfies InternalOcrWebServicePlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	OcrWebServiceEndpointInputs,
	OcrWebServiceEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	OcrWebServiceWebhookOutputs,
} from './webhooks/types';
