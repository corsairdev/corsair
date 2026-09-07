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
import type { SemanticScholarEndpointInputs, SemanticScholarEndpointOutputs } from './endpoints/types';
import { SemanticScholarEndpointInputSchemas, SemanticScholarEndpointOutputSchemas } from './endpoints/types';
import type {
	SemanticScholarWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { SemanticScholarSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchSemanticScholarTenantWebhook } from './webhooks/tenant-matcher';
import { resolveSemanticScholarOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type SemanticScholarPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSemanticScholarPlugin['hooks'];
	webhookHooks?: InternalSemanticScholarPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof semanticScholarEndpointsNested>;
};

export type SemanticScholarContext = CorsairPluginContext<
	typeof SemanticScholarSchema,
	SemanticScholarPluginOptions
>;

export type SemanticScholarKeyBuilderContext = KeyBuilderContext<SemanticScholarPluginOptions>;

export type SemanticScholarBoundEndpoints = BindEndpoints<typeof semanticScholarEndpointsNested>;

type SemanticScholarEndpoint<
	K extends keyof SemanticScholarEndpointOutputs,
> = CorsairEndpoint<
	SemanticScholarContext,
	SemanticScholarEndpointInputs[K],
	SemanticScholarEndpointOutputs[K]
>;

export type SemanticScholarEndpoints = {
	exampleGet: SemanticScholarEndpoint<'exampleGet'>;
};

type SemanticScholarWebhook<
	K extends keyof SemanticScholarWebhookOutputs,
	TEvent,
> = CorsairWebhook<SemanticScholarContext, TEvent, SemanticScholarWebhookOutputs[K]>;

export type SemanticScholarWebhooks = {
	example: SemanticScholarWebhook<'example', ExampleEvent>;
};

export type SemanticScholarBoundWebhooks = BindWebhooks<SemanticScholarWebhooks>;

const semanticScholarEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const semanticScholarWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const semanticScholarEndpointSchemas = {
	'example.get': {
		input: SemanticScholarEndpointInputSchemas.exampleGet,
		output: SemanticScholarEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof semanticScholarEndpointsNested>;

const semanticScholarWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof semanticScholarWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const semanticScholarEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof semanticScholarEndpointsNested>;

export const semanticScholarAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSemanticScholarPlugin<T extends SemanticScholarPluginOptions> = CorsairPlugin<
	'semanticscholar',
	typeof SemanticScholarSchema,
	typeof semanticScholarEndpointsNested,
	typeof semanticScholarWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSemanticScholarPlugin = BaseSemanticScholarPlugin<SemanticScholarPluginOptions>;

export type ExternalSemanticScholarPlugin<T extends SemanticScholarPluginOptions> =
	BaseSemanticScholarPlugin<T>;

export function semanticscholar<const T extends SemanticScholarPluginOptions>(
	incomingOptions: SemanticScholarPluginOptions & T = {} as SemanticScholarPluginOptions & T,
): ExternalSemanticScholarPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'semanticscholar',
		authConfig: semanticScholarAuthConfig,
		schema: SemanticScholarSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: semanticScholarEndpointsNested,
		webhooks: semanticScholarWebhooksNested,
		endpointMeta: semanticScholarEndpointMeta,
		endpointSchemas: semanticScholarEndpointSchemas,
		webhookSchemas: semanticScholarWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-semanticscholar-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchSemanticScholarTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSemanticScholarOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SemanticScholarKeyBuilderContext, source) => {
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
	} satisfies InternalSemanticScholarPlugin;
}

export type {
	ExampleEvent,
	SemanticScholarWebhookOutputs,
} from './webhooks/types';

export type {
	SemanticScholarEndpointInputs,
	SemanticScholarEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
