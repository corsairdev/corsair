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
import { Send } from './endpoints';
import type {
	DocupostEndpointInputs,
	DocupostEndpointOutputs,
} from './endpoints/types';
import {
	DocupostEndpointInputSchemas,
	DocupostEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DocupostSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDocupostOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDocupostTenantWebhook } from './webhooks/tenant-matcher';
import type { DocupostWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DocupostPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDocupostPlugin['hooks'];
	webhookHooks?: InternalDocupostPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docupostEndpointsNested>;
};

export type DocupostContext = CorsairPluginContext<
	typeof DocupostSchema,
	DocupostPluginOptions
>;

export type DocupostKeyBuilderContext =
	KeyBuilderContext<DocupostPluginOptions>;

export type DocupostBoundEndpoints = BindEndpoints<
	typeof docupostEndpointsNested
>;

export type DocupostEndpoints = {
	accountBalance: DocupostEndpoint<'accountBalance'>;
	sendLetter: DocupostEndpoint<'sendLetter'>;
	sendPostcard: DocupostEndpoint<'sendPostcard'>;
};
const docupostEndpointsNested = {
	send: {
		letter: Send.letter,
		postcard: Send.postcard,
	},
} as const;
type DocupostEndpoint<K extends keyof DocupostEndpointOutputs> =
	CorsairEndpoint<
		DocupostContext,
		DocupostEndpointInputs[K],
		DocupostEndpointOutputs[K]
	>;

type DocupostWebhook<
	K extends keyof DocupostWebhookOutputs,
	TEvent,
> = CorsairWebhook<DocupostContext, TEvent, DocupostWebhookOutputs[K]>;

export type DocupostWebhooks = {
	example: DocupostWebhook<'example', ExampleEvent>;
};

export type DocupostBoundWebhooks = BindWebhooks<DocupostWebhooks>;

const docupostWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const docupostEndpointSchemas = {
	'send.letter': {
		input: DocupostEndpointInputSchemas.sendLetter,
		output: DocupostEndpointOutputSchemas.sendLetter,
	},
	'send.postcard': {
		input: DocupostEndpointInputSchemas.sendPostcard,
		output: DocupostEndpointOutputSchemas.sendPostcard,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docupostEndpointsNested
>;
const docupostWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof docupostWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const docupostEndpointMeta = {
	'send.letter': {
		riskLevel: 'write',
		description: 'Send a physical letter through DocuPost',
	},
	'send.postcard': {
		riskLevel: 'write',
		description: 'Send a physical postcard through DocuPost',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docupostEndpointsNested>;
export const docupostAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDocupostPlugin<T extends DocupostPluginOptions> = CorsairPlugin<
	'docupost',
	typeof DocupostSchema,
	typeof docupostEndpointsNested,
	typeof docupostWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDocupostPlugin = BaseDocupostPlugin<DocupostPluginOptions>;

export type ExternalDocupostPlugin<T extends DocupostPluginOptions> =
	BaseDocupostPlugin<T>;

export function docupost<const T extends DocupostPluginOptions>(
	incomingOptions: DocupostPluginOptions & T = {} as DocupostPluginOptions & T,
): ExternalDocupostPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docupost',
		authConfig: docupostAuthConfig,
		schema: DocupostSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: docupostEndpointsNested,
		webhooks: docupostWebhooksNested,
		endpointMeta: docupostEndpointMeta,
		endpointSchemas: docupostEndpointSchemas,
		webhookSchemas: docupostWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-docupost-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDocupostTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDocupostOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DocupostKeyBuilderContext, source) => {
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
	} satisfies InternalDocupostPlugin;
}

export type {
	AccountBalanceInput,
	AccountBalanceResponse,
	DocupostEndpointInputs,
	DocupostEndpointOutputs,
	SendLetterInput,
	SendLetterResponse,
	SendPostcardInput,
	SendPostcardResponse,
} from './endpoints/types';
export type {
	DocupostWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
