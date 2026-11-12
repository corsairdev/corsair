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
import type { EventeeEndpointInputs, EventeeEndpointOutputs } from './endpoints/types';
import { EventeeEndpointInputSchemas, EventeeEndpointOutputSchemas } from './endpoints/types';
import type {
	EventeeWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { EventeeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchEventeeTenantWebhook } from './webhooks/tenant-matcher';
import { resolveEventeeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type EventeePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalEventeePlugin['hooks'];
	webhookHooks?: InternalEventeePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof eventeeEndpointsNested>;
};

export type EventeeContext = CorsairPluginContext<
	typeof EventeeSchema,
	EventeePluginOptions
>;

export type EventeeKeyBuilderContext = KeyBuilderContext<EventeePluginOptions>;

export type EventeeBoundEndpoints = BindEndpoints<typeof eventeeEndpointsNested>;

type EventeeEndpoint<
	K extends keyof EventeeEndpointOutputs,
> = CorsairEndpoint<
	EventeeContext,
	EventeeEndpointInputs[K],
	EventeeEndpointOutputs[K]
>;

export type EventeeEndpoints = {
	exampleGet: EventeeEndpoint<'exampleGet'>;
};

type EventeeWebhook<
	K extends keyof EventeeWebhookOutputs,
	TEvent,
> = CorsairWebhook<EventeeContext, TEvent, EventeeWebhookOutputs[K]>;

export type EventeeWebhooks = {
	example: EventeeWebhook<'example', ExampleEvent>;
};

export type EventeeBoundWebhooks = BindWebhooks<EventeeWebhooks>;

const eventeeEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const eventeeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const eventeeEndpointSchemas = {
	'example.get': {
		input: EventeeEndpointInputSchemas.exampleGet,
		output: EventeeEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof eventeeEndpointsNested>;

const eventeeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof eventeeWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const eventeeEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof eventeeEndpointsNested>;

export const eventeeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEventeePlugin<T extends EventeePluginOptions> = CorsairPlugin<
	'eventee',
	typeof EventeeSchema,
	typeof eventeeEndpointsNested,
	typeof eventeeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEventeePlugin = BaseEventeePlugin<EventeePluginOptions>;

export type ExternalEventeePlugin<T extends EventeePluginOptions> =
	BaseEventeePlugin<T>;

export function eventee<const T extends EventeePluginOptions>(
	incomingOptions: EventeePluginOptions & T = {} as EventeePluginOptions & T,
): ExternalEventeePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'eventee',
		authConfig: eventeeAuthConfig,
		schema: EventeeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: eventeeEndpointsNested,
		webhooks: eventeeWebhooksNested,
		endpointMeta: eventeeEndpointMeta,
		endpointSchemas: eventeeEndpointSchemas,
		webhookSchemas: eventeeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-eventee-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchEventeeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEventeeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EventeeKeyBuilderContext, source) => {
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
	} satisfies InternalEventeePlugin;
}

export type {
	ExampleEvent,
	EventeeWebhookOutputs,
} from './webhooks/types';

export type {
	EventeeEndpointInputs,
	EventeeEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
