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
import type { TicketTailorEndpointInputs, TicketTailorEndpointOutputs } from './endpoints/types';
import { TicketTailorEndpointInputSchemas, TicketTailorEndpointOutputSchemas } from './endpoints/types';
import type {
	TicketTailorWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { TicketTailorSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchTicketTailorTenantWebhook } from './webhooks/tenant-matcher';
import { resolveTicketTailorOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type TicketTailorPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTicketTailorPlugin['hooks'];
	webhookHooks?: InternalTicketTailorPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ticketTailorEndpointsNested>;
};

export type TicketTailorContext = CorsairPluginContext<
	typeof TicketTailorSchema,
	TicketTailorPluginOptions
>;

export type TicketTailorKeyBuilderContext = KeyBuilderContext<TicketTailorPluginOptions>;

export type TicketTailorBoundEndpoints = BindEndpoints<typeof ticketTailorEndpointsNested>;

type TicketTailorEndpoint<
	K extends keyof TicketTailorEndpointOutputs,
> = CorsairEndpoint<
	TicketTailorContext,
	TicketTailorEndpointInputs[K],
	TicketTailorEndpointOutputs[K]
>;

export type TicketTailorEndpoints = {
	exampleGet: TicketTailorEndpoint<'exampleGet'>;
};

type TicketTailorWebhook<
	K extends keyof TicketTailorWebhookOutputs,
	TEvent,
> = CorsairWebhook<TicketTailorContext, TEvent, TicketTailorWebhookOutputs[K]>;

export type TicketTailorWebhooks = {
	example: TicketTailorWebhook<'example', ExampleEvent>;
};

export type TicketTailorBoundWebhooks = BindWebhooks<TicketTailorWebhooks>;

const ticketTailorEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const ticketTailorWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const ticketTailorEndpointSchemas = {
	'example.get': {
		input: TicketTailorEndpointInputSchemas.exampleGet,
		output: TicketTailorEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ticketTailorEndpointsNested>;

const ticketTailorWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof ticketTailorWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ticketTailorEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ticketTailorEndpointsNested>;

export const ticketTailorAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTicketTailorPlugin<T extends TicketTailorPluginOptions> = CorsairPlugin<
	'tickettailor',
	typeof TicketTailorSchema,
	typeof ticketTailorEndpointsNested,
	typeof ticketTailorWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTicketTailorPlugin = BaseTicketTailorPlugin<TicketTailorPluginOptions>;

export type ExternalTicketTailorPlugin<T extends TicketTailorPluginOptions> =
	BaseTicketTailorPlugin<T>;

export function tickettailor<const T extends TicketTailorPluginOptions>(
	incomingOptions: TicketTailorPluginOptions & T = {} as TicketTailorPluginOptions & T,
): ExternalTicketTailorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tickettailor',
		authConfig: ticketTailorAuthConfig,
		schema: TicketTailorSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ticketTailorEndpointsNested,
		webhooks: ticketTailorWebhooksNested,
		endpointMeta: ticketTailorEndpointMeta,
		endpointSchemas: ticketTailorEndpointSchemas,
		webhookSchemas: ticketTailorWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-tickettailor-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTicketTailorTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTicketTailorOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TicketTailorKeyBuilderContext, source) => {
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
	} satisfies InternalTicketTailorPlugin;
}

export type {
	ExampleEvent,
	TicketTailorWebhookOutputs,
} from './webhooks/types';

export type {
	TicketTailorEndpointInputs,
	TicketTailorEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
