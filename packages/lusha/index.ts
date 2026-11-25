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
import type { LushaEndpointInputs, LushaEndpointOutputs } from './endpoints/types';
import { LushaEndpointInputSchemas, LushaEndpointOutputSchemas } from './endpoints/types';
import type {
	LushaWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { LushaSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchLushaTenantWebhook } from './webhooks/tenant-matcher';
import { resolveLushaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type LushaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLushaPlugin['hooks'];
	webhookHooks?: InternalLushaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lushaEndpointsNested>;
};

export type LushaContext = CorsairPluginContext<
	typeof LushaSchema,
	LushaPluginOptions
>;

export type LushaKeyBuilderContext = KeyBuilderContext<LushaPluginOptions>;

export type LushaBoundEndpoints = BindEndpoints<typeof lushaEndpointsNested>;

type LushaEndpoint<
	K extends keyof LushaEndpointOutputs,
> = CorsairEndpoint<
	LushaContext,
	LushaEndpointInputs[K],
	LushaEndpointOutputs[K]
>;

export type LushaEndpoints = {
	exampleGet: LushaEndpoint<'exampleGet'>;
};

type LushaWebhook<
	K extends keyof LushaWebhookOutputs,
	TEvent,
> = CorsairWebhook<LushaContext, TEvent, LushaWebhookOutputs[K]>;

export type LushaWebhooks = {
	example: LushaWebhook<'example', ExampleEvent>;
};

export type LushaBoundWebhooks = BindWebhooks<LushaWebhooks>;

const lushaEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const lushaWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const lushaEndpointSchemas = {
	'example.get': {
		input: LushaEndpointInputSchemas.exampleGet,
		output: LushaEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lushaEndpointsNested>;

const lushaWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof lushaWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const lushaEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lushaEndpointsNested>;

export const lushaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLushaPlugin<T extends LushaPluginOptions> = CorsairPlugin<
	'lusha',
	typeof LushaSchema,
	typeof lushaEndpointsNested,
	typeof lushaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLushaPlugin = BaseLushaPlugin<LushaPluginOptions>;

export type ExternalLushaPlugin<T extends LushaPluginOptions> =
	BaseLushaPlugin<T>;

export function lusha<const T extends LushaPluginOptions>(
	incomingOptions: LushaPluginOptions & T = {} as LushaPluginOptions & T,
): ExternalLushaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lusha',
		authConfig: lushaAuthConfig,
		schema: LushaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: lushaEndpointsNested,
		webhooks: lushaWebhooksNested,
		endpointMeta: lushaEndpointMeta,
		endpointSchemas: lushaEndpointSchemas,
		webhookSchemas: lushaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-lusha-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLushaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLushaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LushaKeyBuilderContext, source) => {
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
	} satisfies InternalLushaPlugin;
}

export type {
	ExampleEvent,
	LushaWebhookOutputs,
} from './webhooks/types';

export type {
	LushaEndpointInputs,
	LushaEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
