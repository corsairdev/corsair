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
import type { HyperbrowserEndpointInputs, HyperbrowserEndpointOutputs } from './endpoints/types';
import { HyperbrowserEndpointInputSchemas, HyperbrowserEndpointOutputSchemas } from './endpoints/types';
import type {
	HyperbrowserWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { HyperbrowserSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchHyperbrowserTenantWebhook } from './webhooks/tenant-matcher';
import { resolveHyperbrowserOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type HyperbrowserPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHyperbrowserPlugin['hooks'];
	webhookHooks?: InternalHyperbrowserPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hyperbrowserEndpointsNested>;
};

export type HyperbrowserContext = CorsairPluginContext<
	typeof HyperbrowserSchema,
	HyperbrowserPluginOptions
>;

export type HyperbrowserKeyBuilderContext = KeyBuilderContext<HyperbrowserPluginOptions>;

export type HyperbrowserBoundEndpoints = BindEndpoints<typeof hyperbrowserEndpointsNested>;

type HyperbrowserEndpoint<
	K extends keyof HyperbrowserEndpointOutputs,
> = CorsairEndpoint<
	HyperbrowserContext,
	HyperbrowserEndpointInputs[K],
	HyperbrowserEndpointOutputs[K]
>;

export type HyperbrowserEndpoints = {
	exampleGet: HyperbrowserEndpoint<'exampleGet'>;
};

type HyperbrowserWebhook<
	K extends keyof HyperbrowserWebhookOutputs,
	TEvent,
> = CorsairWebhook<HyperbrowserContext, TEvent, HyperbrowserWebhookOutputs[K]>;

export type HyperbrowserWebhooks = {
	example: HyperbrowserWebhook<'example', ExampleEvent>;
};

export type HyperbrowserBoundWebhooks = BindWebhooks<HyperbrowserWebhooks>;

const hyperbrowserEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const hyperbrowserWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const hyperbrowserEndpointSchemas = {
	'example.get': {
		input: HyperbrowserEndpointInputSchemas.exampleGet,
		output: HyperbrowserEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof hyperbrowserEndpointsNested>;

const hyperbrowserWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof hyperbrowserWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hyperbrowserEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hyperbrowserEndpointsNested>;

export const hyperbrowserAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHyperbrowserPlugin<T extends HyperbrowserPluginOptions> = CorsairPlugin<
	'hyperbrowser',
	typeof HyperbrowserSchema,
	typeof hyperbrowserEndpointsNested,
	typeof hyperbrowserWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHyperbrowserPlugin = BaseHyperbrowserPlugin<HyperbrowserPluginOptions>;

export type ExternalHyperbrowserPlugin<T extends HyperbrowserPluginOptions> =
	BaseHyperbrowserPlugin<T>;

export function hyperbrowser<const T extends HyperbrowserPluginOptions>(
	incomingOptions: HyperbrowserPluginOptions & T = {} as HyperbrowserPluginOptions & T,
): ExternalHyperbrowserPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hyperbrowser',
		authConfig: hyperbrowserAuthConfig,
		schema: HyperbrowserSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: hyperbrowserEndpointsNested,
		webhooks: hyperbrowserWebhooksNested,
		endpointMeta: hyperbrowserEndpointMeta,
		endpointSchemas: hyperbrowserEndpointSchemas,
		webhookSchemas: hyperbrowserWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-hyperbrowser-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHyperbrowserTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHyperbrowserOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HyperbrowserKeyBuilderContext, source) => {
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
	} satisfies InternalHyperbrowserPlugin;
}

export type {
	ExampleEvent,
	HyperbrowserWebhookOutputs,
} from './webhooks/types';

export type {
	HyperbrowserEndpointInputs,
	HyperbrowserEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
