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
	TwentyOneRiskEndpointInputs,
	TwentyOneRiskEndpointOutputs,
} from './endpoints/types';
import {
	TwentyOneRiskEndpointInputSchemas,
	TwentyOneRiskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwentyOneRiskSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveTwentyOneRiskOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchTwentyOneRiskTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ExampleEvent,
	TwentyOneRiskWebhookOutputs,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type TwentyOneRiskPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTwentyOneRiskPlugin['hooks'];
	webhookHooks?: InternalTwentyOneRiskPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof twentyOneRiskEndpointsNested>;
};

export type TwentyOneRiskContext = CorsairPluginContext<
	typeof TwentyOneRiskSchema,
	TwentyOneRiskPluginOptions
>;

export type TwentyOneRiskKeyBuilderContext =
	KeyBuilderContext<TwentyOneRiskPluginOptions>;

export type TwentyOneRiskBoundEndpoints = BindEndpoints<
	typeof twentyOneRiskEndpointsNested
>;

type TwentyOneRiskEndpoint<K extends keyof TwentyOneRiskEndpointOutputs> =
	CorsairEndpoint<
		TwentyOneRiskContext,
		TwentyOneRiskEndpointInputs[K],
		TwentyOneRiskEndpointOutputs[K]
	>;

export type TwentyOneRiskEndpoints = {
	exampleGet: TwentyOneRiskEndpoint<'exampleGet'>;
};

type TwentyOneRiskWebhook<
	K extends keyof TwentyOneRiskWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	TwentyOneRiskContext,
	TEvent,
	TwentyOneRiskWebhookOutputs[K]
>;

export type TwentyOneRiskWebhooks = {
	example: TwentyOneRiskWebhook<'example', ExampleEvent>;
};

export type TwentyOneRiskBoundWebhooks = BindWebhooks<TwentyOneRiskWebhooks>;

const twentyOneRiskEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const twentyOneRiskWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const twentyOneRiskEndpointSchemas = {
	'example.get': {
		input: TwentyOneRiskEndpointInputSchemas.exampleGet,
		output: TwentyOneRiskEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof twentyOneRiskEndpointsNested
>;

const twentyOneRiskWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof twentyOneRiskWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const twentyOneRiskEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof twentyOneRiskEndpointsNested
>;

export const twentyOneRiskAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTwentyOneRiskPlugin<T extends TwentyOneRiskPluginOptions> =
	CorsairPlugin<
		'twentyonerisk',
		typeof TwentyOneRiskSchema,
		typeof twentyOneRiskEndpointsNested,
		typeof twentyOneRiskWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalTwentyOneRiskPlugin =
	BaseTwentyOneRiskPlugin<TwentyOneRiskPluginOptions>;

export type ExternalTwentyOneRiskPlugin<T extends TwentyOneRiskPluginOptions> =
	BaseTwentyOneRiskPlugin<T>;

export function twentyonerisk<const T extends TwentyOneRiskPluginOptions>(
	incomingOptions: TwentyOneRiskPluginOptions &
		T = {} as TwentyOneRiskPluginOptions & T,
): ExternalTwentyOneRiskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'twentyonerisk',
		authConfig: twentyOneRiskAuthConfig,
		schema: TwentyOneRiskSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: twentyOneRiskEndpointsNested,
		webhooks: twentyOneRiskWebhooksNested,
		endpointMeta: twentyOneRiskEndpointMeta,
		endpointSchemas: twentyOneRiskEndpointSchemas,
		webhookSchemas: twentyOneRiskWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-twentyonerisk-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTwentyOneRiskTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTwentyOneRiskOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TwentyOneRiskKeyBuilderContext, source) => {
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
	} satisfies InternalTwentyOneRiskPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	TwentyOneRiskEndpointInputs,
	TwentyOneRiskEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	TwentyOneRiskWebhookOutputs,
} from './webhooks/types';
