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
	CoassembleEndpointInputs,
	CoassembleEndpointOutputs,
} from './endpoints/types';
import {
	CoassembleEndpointInputSchemas,
	CoassembleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CoassembleSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveCoassembleOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCoassembleTenantWebhook } from './webhooks/tenant-matcher';
import type { CoassembleWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CoassemblePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCoassemblePlugin['hooks'];
	webhookHooks?: InternalCoassemblePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof coassembleEndpointsNested>;
};

export type CoassembleContext = CorsairPluginContext<
	typeof CoassembleSchema,
	CoassemblePluginOptions
>;

export type CoassembleKeyBuilderContext =
	KeyBuilderContext<CoassemblePluginOptions>;

export type CoassembleBoundEndpoints = BindEndpoints<
	typeof coassembleEndpointsNested
>;

type CoassembleEndpoint<K extends keyof CoassembleEndpointOutputs> =
	CorsairEndpoint<
		CoassembleContext,
		CoassembleEndpointInputs[K],
		CoassembleEndpointOutputs[K]
	>;

export type CoassembleEndpoints = {
	exampleGet: CoassembleEndpoint<'exampleGet'>;
};

type CoassembleWebhook<
	K extends keyof CoassembleWebhookOutputs,
	TEvent,
> = CorsairWebhook<CoassembleContext, TEvent, CoassembleWebhookOutputs[K]>;

export type CoassembleWebhooks = {
	example: CoassembleWebhook<'example', ExampleEvent>;
};

export type CoassembleBoundWebhooks = BindWebhooks<CoassembleWebhooks>;

const coassembleEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const coassembleWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const coassembleEndpointSchemas = {
	'example.get': {
		input: CoassembleEndpointInputSchemas.exampleGet,
		output: CoassembleEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof coassembleEndpointsNested
>;

const coassembleWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof coassembleWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const coassembleEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof coassembleEndpointsNested
>;

export const coassembleAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCoassemblePlugin<T extends CoassemblePluginOptions> =
	CorsairPlugin<
		'coassemble',
		typeof CoassembleSchema,
		typeof coassembleEndpointsNested,
		typeof coassembleWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCoassemblePlugin =
	BaseCoassemblePlugin<CoassemblePluginOptions>;

export type ExternalCoassemblePlugin<T extends CoassemblePluginOptions> =
	BaseCoassemblePlugin<T>;

export function coassemble<const T extends CoassemblePluginOptions>(
	incomingOptions: CoassemblePluginOptions & T = {} as CoassemblePluginOptions &
		T,
): ExternalCoassemblePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'coassemble',
		authConfig: coassembleAuthConfig,
		schema: CoassembleSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: coassembleEndpointsNested,
		webhooks: coassembleWebhooksNested,
		endpointMeta: coassembleEndpointMeta,
		endpointSchemas: coassembleEndpointSchemas,
		webhookSchemas: coassembleWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-coassemble-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCoassembleTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCoassembleOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CoassembleKeyBuilderContext, source) => {
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
	} satisfies InternalCoassemblePlugin;
}

export type {
	CoassembleEndpointInputs,
	CoassembleEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	CoassembleWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
