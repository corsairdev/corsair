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
	HumanitixEndpointInputs,
	HumanitixEndpointOutputs,
} from './endpoints/types';
import {
	HumanitixEndpointInputSchemas,
	HumanitixEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HumanitixSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveHumanitixOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchHumanitixTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, HumanitixWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type HumanitixPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHumanitixPlugin['hooks'];
	webhookHooks?: InternalHumanitixPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof humanitixEndpointsNested>;
};

export type HumanitixContext = CorsairPluginContext<
	typeof HumanitixSchema,
	HumanitixPluginOptions
>;

export type HumanitixKeyBuilderContext =
	KeyBuilderContext<HumanitixPluginOptions>;

export type HumanitixBoundEndpoints = BindEndpoints<
	typeof humanitixEndpointsNested
>;

type HumanitixEndpoint<K extends keyof HumanitixEndpointOutputs> =
	CorsairEndpoint<
		HumanitixContext,
		HumanitixEndpointInputs[K],
		HumanitixEndpointOutputs[K]
	>;

export type HumanitixEndpoints = {
	getEvent: HumanitixEndpoint<'getEvent'>;
	getEvents: HumanitixEndpoint<'getEvents'>;
	getTags: HumanitixEndpoint<'getTags'>;
};

type HumanitixWebhook<
	K extends keyof HumanitixWebhookOutputs,
	TEvent,
> = CorsairWebhook<HumanitixContext, TEvent, HumanitixWebhookOutputs[K]>;

export type HumanitixWebhooks = {
	example: HumanitixWebhook<'example', ExampleEvent>;
};

export type HumanitixBoundWebhooks = BindWebhooks<HumanitixWebhooks>;

const humanitixEndpointsNested = {
	events: {
		get: Example.getEvent,
		list: Example.getEvents,
	},
	tags: {
		list: Example.getTags,
	},
} as const;

const humanitixWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const humanitixEndpointSchemas = {
	'events.get': {
		input: HumanitixEndpointInputSchemas.getEvent,
		output: HumanitixEndpointOutputSchemas.getEvent,
	},
	'events.list': {
		input: HumanitixEndpointInputSchemas.getEvents,
		output: HumanitixEndpointOutputSchemas.getEvents,
	},
	'tags.list': {
		input: HumanitixEndpointInputSchemas.getTags,
		output: HumanitixEndpointOutputSchemas.getTags,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof humanitixEndpointsNested
>;

const humanitixWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof humanitixWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const humanitixEndpointMeta = {
	'events.get': {
		riskLevel: 'read',
		description: 'Get a specific Humanitix event by ID',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List Humanitix events with pagination and filters',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List Humanitix tags with pagination',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof humanitixEndpointsNested
>;

export const humanitixAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHumanitixPlugin<T extends HumanitixPluginOptions> =
	CorsairPlugin<
		'humanitix',
		typeof HumanitixSchema,
		typeof humanitixEndpointsNested,
		typeof humanitixWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalHumanitixPlugin =
	BaseHumanitixPlugin<HumanitixPluginOptions>;

export type ExternalHumanitixPlugin<T extends HumanitixPluginOptions> =
	BaseHumanitixPlugin<T>;

export function humanitix<const T extends HumanitixPluginOptions>(
	incomingOptions: HumanitixPluginOptions & T = {} as HumanitixPluginOptions &
		T,
): ExternalHumanitixPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'humanitix',
		authConfig: humanitixAuthConfig,
		schema: HumanitixSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: humanitixEndpointsNested,
		webhooks: humanitixWebhooksNested,
		endpointMeta: humanitixEndpointMeta,
		endpointSchemas: humanitixEndpointSchemas,
		webhookSchemas: humanitixWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-humanitix-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHumanitixTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHumanitixOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HumanitixKeyBuilderContext, source) => {
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
	} satisfies InternalHumanitixPlugin;
}

export type {
	HumanitixEndpointInputs,
	HumanitixEndpointOutputs,
} from './endpoints/types';
export type { ExampleEvent, HumanitixWebhookOutputs } from './webhooks/types';
