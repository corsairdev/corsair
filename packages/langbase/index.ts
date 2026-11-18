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
import type { LangbaseEndpointInputs, LangbaseEndpointOutputs } from './endpoints/types';
import { LangbaseEndpointInputSchemas, LangbaseEndpointOutputSchemas } from './endpoints/types';
import type {
	LangbaseWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { LangbaseSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchLangbaseTenantWebhook } from './webhooks/tenant-matcher';
import { resolveLangbaseOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type LangbasePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLangbasePlugin['hooks'];
	webhookHooks?: InternalLangbasePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof langbaseEndpointsNested>;
};

export type LangbaseContext = CorsairPluginContext<
	typeof LangbaseSchema,
	LangbasePluginOptions
>;

export type LangbaseKeyBuilderContext = KeyBuilderContext<LangbasePluginOptions>;

export type LangbaseBoundEndpoints = BindEndpoints<typeof langbaseEndpointsNested>;

type LangbaseEndpoint<
	K extends keyof LangbaseEndpointOutputs,
> = CorsairEndpoint<
	LangbaseContext,
	LangbaseEndpointInputs[K],
	LangbaseEndpointOutputs[K]
>;

export type LangbaseEndpoints = {
	exampleGet: LangbaseEndpoint<'exampleGet'>;
};

type LangbaseWebhook<
	K extends keyof LangbaseWebhookOutputs,
	TEvent,
> = CorsairWebhook<LangbaseContext, TEvent, LangbaseWebhookOutputs[K]>;

export type LangbaseWebhooks = {
	example: LangbaseWebhook<'example', ExampleEvent>;
};

export type LangbaseBoundWebhooks = BindWebhooks<LangbaseWebhooks>;

const langbaseEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const langbaseWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const langbaseEndpointSchemas = {
	'example.get': {
		input: LangbaseEndpointInputSchemas.exampleGet,
		output: LangbaseEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof langbaseEndpointsNested>;

const langbaseWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof langbaseWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const langbaseEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof langbaseEndpointsNested>;

export const langbaseAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLangbasePlugin<T extends LangbasePluginOptions> = CorsairPlugin<
	'langbase',
	typeof LangbaseSchema,
	typeof langbaseEndpointsNested,
	typeof langbaseWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLangbasePlugin = BaseLangbasePlugin<LangbasePluginOptions>;

export type ExternalLangbasePlugin<T extends LangbasePluginOptions> =
	BaseLangbasePlugin<T>;

export function langbase<const T extends LangbasePluginOptions>(
	incomingOptions: LangbasePluginOptions & T = {} as LangbasePluginOptions & T,
): ExternalLangbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'langbase',
		authConfig: langbaseAuthConfig,
		schema: LangbaseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: langbaseEndpointsNested,
		webhooks: langbaseWebhooksNested,
		endpointMeta: langbaseEndpointMeta,
		endpointSchemas: langbaseEndpointSchemas,
		webhookSchemas: langbaseWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-langbase-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLangbaseTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLangbaseOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LangbaseKeyBuilderContext, source) => {
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
	} satisfies InternalLangbasePlugin;
}

export type {
	ExampleEvent,
	LangbaseWebhookOutputs,
} from './webhooks/types';

export type {
	LangbaseEndpointInputs,
	LangbaseEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
