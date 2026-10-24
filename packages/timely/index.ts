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
	TimelyEndpointInputs,
	TimelyEndpointOutputs,
} from './endpoints/types';
import {
	TimelyEndpointInputSchemas,
	TimelyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TimelySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveTimelyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchTimelyTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, TimelyWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type TimelyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTimelyPlugin['hooks'];
	webhookHooks?: InternalTimelyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof timelyEndpointsNested>;
};

export type TimelyContext = CorsairPluginContext<
	typeof TimelySchema,
	TimelyPluginOptions
>;

export type TimelyKeyBuilderContext = KeyBuilderContext<TimelyPluginOptions>;

export type TimelyBoundEndpoints = BindEndpoints<typeof timelyEndpointsNested>;

type TimelyEndpoint<K extends keyof TimelyEndpointOutputs> = CorsairEndpoint<
	TimelyContext,
	TimelyEndpointInputs[K],
	TimelyEndpointOutputs[K]
>;

export type TimelyEndpoints = {
	exampleGet: TimelyEndpoint<'exampleGet'>;
};

type TimelyWebhook<
	K extends keyof TimelyWebhookOutputs,
	TEvent,
> = CorsairWebhook<TimelyContext, TEvent, TimelyWebhookOutputs[K]>;

export type TimelyWebhooks = {
	example: TimelyWebhook<'example', ExampleEvent>;
};

export type TimelyBoundWebhooks = BindWebhooks<TimelyWebhooks>;

const timelyEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const timelyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const timelyEndpointSchemas = {
	'example.get': {
		input: TimelyEndpointInputSchemas.exampleGet,
		output: TimelyEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof timelyEndpointsNested
>;

const timelyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof timelyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const timelyEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof timelyEndpointsNested>;

export const timelyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTimelyPlugin<T extends TimelyPluginOptions> = CorsairPlugin<
	'timely',
	typeof TimelySchema,
	typeof timelyEndpointsNested,
	typeof timelyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTimelyPlugin = BaseTimelyPlugin<TimelyPluginOptions>;

export type ExternalTimelyPlugin<T extends TimelyPluginOptions> =
	BaseTimelyPlugin<T>;

export function timely<const T extends TimelyPluginOptions>(
	incomingOptions: TimelyPluginOptions & T = {} as TimelyPluginOptions & T,
): ExternalTimelyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'timely',
		authConfig: timelyAuthConfig,
		schema: TimelySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: timelyEndpointsNested,
		webhooks: timelyWebhooksNested,
		endpointMeta: timelyEndpointMeta,
		endpointSchemas: timelyEndpointSchemas,
		webhookSchemas: timelyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-timely-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTimelyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTimelyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TimelyKeyBuilderContext, source) => {
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
	} satisfies InternalTimelyPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	TimelyEndpointInputs,
	TimelyEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	TimelyWebhookOutputs,
} from './webhooks/types';
