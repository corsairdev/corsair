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
import type { LemlistEndpointInputs, LemlistEndpointOutputs } from './endpoints/types';
import { LemlistEndpointInputSchemas, LemlistEndpointOutputSchemas } from './endpoints/types';
import type {
	LemlistWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { LemlistSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchLemlistTenantWebhook } from './webhooks/tenant-matcher';
import { resolveLemlistOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type LemlistPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLemlistPlugin['hooks'];
	webhookHooks?: InternalLemlistPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lemlistEndpointsNested>;
};

export type LemlistContext = CorsairPluginContext<
	typeof LemlistSchema,
	LemlistPluginOptions
>;

export type LemlistKeyBuilderContext = KeyBuilderContext<LemlistPluginOptions>;

export type LemlistBoundEndpoints = BindEndpoints<typeof lemlistEndpointsNested>;

type LemlistEndpoint<
	K extends keyof LemlistEndpointOutputs,
> = CorsairEndpoint<
	LemlistContext,
	LemlistEndpointInputs[K],
	LemlistEndpointOutputs[K]
>;

export type LemlistEndpoints = {
	exampleGet: LemlistEndpoint<'exampleGet'>;
};

type LemlistWebhook<
	K extends keyof LemlistWebhookOutputs,
	TEvent,
> = CorsairWebhook<LemlistContext, TEvent, LemlistWebhookOutputs[K]>;

export type LemlistWebhooks = {
	example: LemlistWebhook<'example', ExampleEvent>;
};

export type LemlistBoundWebhooks = BindWebhooks<LemlistWebhooks>;

const lemlistEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const lemlistWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const lemlistEndpointSchemas = {
	'example.get': {
		input: LemlistEndpointInputSchemas.exampleGet,
		output: LemlistEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lemlistEndpointsNested>;

const lemlistWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof lemlistWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const lemlistEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lemlistEndpointsNested>;

export const lemlistAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLemlistPlugin<T extends LemlistPluginOptions> = CorsairPlugin<
	'lemlist',
	typeof LemlistSchema,
	typeof lemlistEndpointsNested,
	typeof lemlistWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLemlistPlugin = BaseLemlistPlugin<LemlistPluginOptions>;

export type ExternalLemlistPlugin<T extends LemlistPluginOptions> =
	BaseLemlistPlugin<T>;

export function lemlist<const T extends LemlistPluginOptions>(
	incomingOptions: LemlistPluginOptions & T = {} as LemlistPluginOptions & T,
): ExternalLemlistPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lemlist',
		authConfig: lemlistAuthConfig,
		schema: LemlistSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: lemlistEndpointsNested,
		webhooks: lemlistWebhooksNested,
		endpointMeta: lemlistEndpointMeta,
		endpointSchemas: lemlistEndpointSchemas,
		webhookSchemas: lemlistWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-lemlist-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLemlistTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLemlistOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LemlistKeyBuilderContext, source) => {
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
	} satisfies InternalLemlistPlugin;
}

export type {
	ExampleEvent,
	LemlistWebhookOutputs,
} from './webhooks/types';

export type {
	LemlistEndpointInputs,
	LemlistEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
