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
	BeaconstacEndpointInputs,
	BeaconstacEndpointOutputs,
} from './endpoints/types';
import {
	BeaconstacEndpointInputSchemas,
	BeaconstacEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BeaconstacSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBeaconstacOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBeaconstacTenantWebhook } from './webhooks/tenant-matcher';
import type { BeaconstacWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BeaconstacPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBeaconstacPlugin['hooks'];
	webhookHooks?: InternalBeaconstacPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof beaconstacEndpointsNested>;
};

export type BeaconstacContext = CorsairPluginContext<
	typeof BeaconstacSchema,
	BeaconstacPluginOptions
>;

export type BeaconstacKeyBuilderContext =
	KeyBuilderContext<BeaconstacPluginOptions>;

export type BeaconstacBoundEndpoints = BindEndpoints<
	typeof beaconstacEndpointsNested
>;

type BeaconstacEndpoint<K extends keyof BeaconstacEndpointOutputs> =
	CorsairEndpoint<
		BeaconstacContext,
		BeaconstacEndpointInputs[K],
		BeaconstacEndpointOutputs[K]
	>;

export type BeaconstacEndpoints = {
	exampleGet: BeaconstacEndpoint<'exampleGet'>;
};

type BeaconstacWebhook<
	K extends keyof BeaconstacWebhookOutputs,
	TEvent,
> = CorsairWebhook<BeaconstacContext, TEvent, BeaconstacWebhookOutputs[K]>;

export type BeaconstacWebhooks = {
	example: BeaconstacWebhook<'example', ExampleEvent>;
};

export type BeaconstacBoundWebhooks = BindWebhooks<BeaconstacWebhooks>;

const beaconstacEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const beaconstacWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const beaconstacEndpointSchemas = {
	'example.get': {
		input: BeaconstacEndpointInputSchemas.exampleGet,
		output: BeaconstacEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof beaconstacEndpointsNested
>;

const beaconstacWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof beaconstacWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const beaconstacEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof beaconstacEndpointsNested
>;

export const beaconstacAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBeaconstacPlugin<T extends BeaconstacPluginOptions> =
	CorsairPlugin<
		'beaconstac',
		typeof BeaconstacSchema,
		typeof beaconstacEndpointsNested,
		typeof beaconstacWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBeaconstacPlugin =
	BaseBeaconstacPlugin<BeaconstacPluginOptions>;

export type ExternalBeaconstacPlugin<T extends BeaconstacPluginOptions> =
	BaseBeaconstacPlugin<T>;

export function beaconstac<const T extends BeaconstacPluginOptions>(
	incomingOptions: BeaconstacPluginOptions & T = {} as BeaconstacPluginOptions &
		T,
): ExternalBeaconstacPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'beaconstac',
		authConfig: beaconstacAuthConfig,
		schema: BeaconstacSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: beaconstacEndpointsNested,
		webhooks: beaconstacWebhooksNested,
		endpointMeta: beaconstacEndpointMeta,
		endpointSchemas: beaconstacEndpointSchemas,
		webhookSchemas: beaconstacWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-beaconstac-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBeaconstacTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBeaconstacOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BeaconstacKeyBuilderContext, source) => {
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
	} satisfies InternalBeaconstacPlugin;
}

export type {
	BeaconstacEndpointInputs,
	BeaconstacEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BeaconstacWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
