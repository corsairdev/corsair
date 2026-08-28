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
	HtmlToImageEndpointInputs,
	HtmlToImageEndpointOutputs,
} from './endpoints/types';
import {
	HtmlToImageEndpointInputSchemas,
	HtmlToImageEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HtmlToImageSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveHtmlToImageOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchHtmlToImageTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, HtmlToImageWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type HtmlToImagePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHtmlToImagePlugin['hooks'];
	webhookHooks?: InternalHtmlToImagePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof htmlToImageEndpointsNested>;
};

export type HtmlToImageContext = CorsairPluginContext<
	typeof HtmlToImageSchema,
	HtmlToImagePluginOptions
>;

export type HtmlToImageKeyBuilderContext =
	KeyBuilderContext<HtmlToImagePluginOptions>;

export type HtmlToImageBoundEndpoints = BindEndpoints<
	typeof htmlToImageEndpointsNested
>;

type HtmlToImageEndpoint<K extends keyof HtmlToImageEndpointOutputs> =
	CorsairEndpoint<
		HtmlToImageContext,
		HtmlToImageEndpointInputs[K],
		HtmlToImageEndpointOutputs[K]
	>;

export type HtmlToImageEndpoints = {
	exampleGet: HtmlToImageEndpoint<'exampleGet'>;
};

type HtmlToImageWebhook<
	K extends keyof HtmlToImageWebhookOutputs,
	TEvent,
> = CorsairWebhook<HtmlToImageContext, TEvent, HtmlToImageWebhookOutputs[K]>;

export type HtmlToImageWebhooks = {
	example: HtmlToImageWebhook<'example', ExampleEvent>;
};

export type HtmlToImageBoundWebhooks = BindWebhooks<HtmlToImageWebhooks>;

const htmlToImageEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const htmlToImageWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const htmlToImageEndpointSchemas = {
	'example.get': {
		input: HtmlToImageEndpointInputSchemas.exampleGet,
		output: HtmlToImageEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof htmlToImageEndpointsNested
>;

const htmlToImageWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof htmlToImageWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const htmlToImageEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof htmlToImageEndpointsNested
>;

export const htmlToImageAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHtmlToImagePlugin<T extends HtmlToImagePluginOptions> =
	CorsairPlugin<
		'htmltoimage',
		typeof HtmlToImageSchema,
		typeof htmlToImageEndpointsNested,
		typeof htmlToImageWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalHtmlToImagePlugin =
	BaseHtmlToImagePlugin<HtmlToImagePluginOptions>;

export type ExternalHtmlToImagePlugin<T extends HtmlToImagePluginOptions> =
	BaseHtmlToImagePlugin<T>;

export function htmltoimage<const T extends HtmlToImagePluginOptions>(
	incomingOptions: HtmlToImagePluginOptions &
		T = {} as HtmlToImagePluginOptions & T,
): ExternalHtmlToImagePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'htmltoimage',
		authConfig: htmlToImageAuthConfig,
		schema: HtmlToImageSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: htmlToImageEndpointsNested,
		webhooks: htmlToImageWebhooksNested,
		endpointMeta: htmlToImageEndpointMeta,
		endpointSchemas: htmlToImageEndpointSchemas,
		webhookSchemas: htmlToImageWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-htmltoimage-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHtmlToImageTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHtmlToImageOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HtmlToImageKeyBuilderContext, source) => {
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
	} satisfies InternalHtmlToImagePlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	HtmlToImageEndpointInputs,
	HtmlToImageEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	HtmlToImageWebhookOutputs,
} from './webhooks/types';
