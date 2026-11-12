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
import type { EndorsalEndpointInputs, EndorsalEndpointOutputs } from './endpoints/types';
import { EndorsalEndpointInputSchemas, EndorsalEndpointOutputSchemas } from './endpoints/types';
import type {
	EndorsalWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { EndorsalSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchEndorsalTenantWebhook } from './webhooks/tenant-matcher';
import { resolveEndorsalOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type EndorsalPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalEndorsalPlugin['hooks'];
	webhookHooks?: InternalEndorsalPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endorsalEndpointsNested>;
};

export type EndorsalContext = CorsairPluginContext<
	typeof EndorsalSchema,
	EndorsalPluginOptions
>;

export type EndorsalKeyBuilderContext = KeyBuilderContext<EndorsalPluginOptions>;

export type EndorsalBoundEndpoints = BindEndpoints<typeof endorsalEndpointsNested>;

type EndorsalEndpoint<
	K extends keyof EndorsalEndpointOutputs,
> = CorsairEndpoint<
	EndorsalContext,
	EndorsalEndpointInputs[K],
	EndorsalEndpointOutputs[K]
>;

export type EndorsalEndpoints = {
	exampleGet: EndorsalEndpoint<'exampleGet'>;
};

type EndorsalWebhook<
	K extends keyof EndorsalWebhookOutputs,
	TEvent,
> = CorsairWebhook<EndorsalContext, TEvent, EndorsalWebhookOutputs[K]>;

export type EndorsalWebhooks = {
	example: EndorsalWebhook<'example', ExampleEvent>;
};

export type EndorsalBoundWebhooks = BindWebhooks<EndorsalWebhooks>;

const endorsalEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const endorsalWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const endorsalEndpointSchemas = {
	'example.get': {
		input: EndorsalEndpointInputSchemas.exampleGet,
		output: EndorsalEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endorsalEndpointsNested>;

const endorsalWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof endorsalWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const endorsalEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endorsalEndpointsNested>;

export const endorsalAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEndorsalPlugin<T extends EndorsalPluginOptions> = CorsairPlugin<
	'endorsal',
	typeof EndorsalSchema,
	typeof endorsalEndpointsNested,
	typeof endorsalWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEndorsalPlugin = BaseEndorsalPlugin<EndorsalPluginOptions>;

export type ExternalEndorsalPlugin<T extends EndorsalPluginOptions> =
	BaseEndorsalPlugin<T>;

export function endorsal<const T extends EndorsalPluginOptions>(
	incomingOptions: EndorsalPluginOptions & T = {} as EndorsalPluginOptions & T,
): ExternalEndorsalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'endorsal',
		authConfig: endorsalAuthConfig,
		schema: EndorsalSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: endorsalEndpointsNested,
		webhooks: endorsalWebhooksNested,
		endpointMeta: endorsalEndpointMeta,
		endpointSchemas: endorsalEndpointSchemas,
		webhookSchemas: endorsalWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-endorsal-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchEndorsalTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEndorsalOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EndorsalKeyBuilderContext, source) => {
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
	} satisfies InternalEndorsalPlugin;
}

export type {
	ExampleEvent,
	EndorsalWebhookOutputs,
} from './webhooks/types';

export type {
	EndorsalEndpointInputs,
	EndorsalEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
