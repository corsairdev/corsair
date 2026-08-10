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
	AmcardsEndpointInputs,
	AmcardsEndpointOutputs,
} from './endpoints/types';
import {
	AmcardsEndpointInputSchemas,
	AmcardsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmcardsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAmcardsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAmcardsTenantWebhook } from './webhooks/tenant-matcher';
import type { AmcardsWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AmcardsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAmcardsPlugin['hooks'];
	webhookHooks?: InternalAmcardsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof amcardsEndpointsNested>;
};

export type AmcardsContext = CorsairPluginContext<
	typeof AmcardsSchema,
	AmcardsPluginOptions
>;

export type AmcardsKeyBuilderContext = KeyBuilderContext<AmcardsPluginOptions>;

export type AmcardsBoundEndpoints = BindEndpoints<
	typeof amcardsEndpointsNested
>;

type AmcardsEndpoint<K extends keyof AmcardsEndpointOutputs> = CorsairEndpoint<
	AmcardsContext,
	AmcardsEndpointInputs[K],
	AmcardsEndpointOutputs[K]
>;

export type AmcardsEndpoints = {
	exampleGet: AmcardsEndpoint<'exampleGet'>;
};

type AmcardsWebhook<
	K extends keyof AmcardsWebhookOutputs,
	TEvent,
> = CorsairWebhook<AmcardsContext, TEvent, AmcardsWebhookOutputs[K]>;

export type AmcardsWebhooks = {
	example: AmcardsWebhook<'example', ExampleEvent>;
};

export type AmcardsBoundWebhooks = BindWebhooks<AmcardsWebhooks>;

const amcardsEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const amcardsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const amcardsEndpointSchemas = {
	'example.get': {
		input: AmcardsEndpointInputSchemas.exampleGet,
		output: AmcardsEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof amcardsEndpointsNested
>;

const amcardsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof amcardsWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const amcardsEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof amcardsEndpointsNested>;

export const amcardsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAmcardsPlugin<T extends AmcardsPluginOptions> = CorsairPlugin<
	'amcards',
	typeof AmcardsSchema,
	typeof amcardsEndpointsNested,
	typeof amcardsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAmcardsPlugin = BaseAmcardsPlugin<AmcardsPluginOptions>;

export type ExternalAmcardsPlugin<T extends AmcardsPluginOptions> =
	BaseAmcardsPlugin<T>;

export function amcards<const T extends AmcardsPluginOptions>(
	incomingOptions: AmcardsPluginOptions & T = {} as AmcardsPluginOptions & T,
): ExternalAmcardsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'amcards',
		authConfig: amcardsAuthConfig,
		schema: AmcardsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: amcardsEndpointsNested,
		webhooks: amcardsWebhooksNested,
		endpointMeta: amcardsEndpointMeta,
		endpointSchemas: amcardsEndpointSchemas,
		webhookSchemas: amcardsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-amcards-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAmcardsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAmcardsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmcardsKeyBuilderContext, source) => {
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
	} satisfies InternalAmcardsPlugin;
}

export type {
	AmcardsEndpointInputs,
	AmcardsEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	AmcardsWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
