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
	TursoEndpointInputs,
	TursoEndpointOutputs,
} from './endpoints/types';
import {
	TursoEndpointInputSchemas,
	TursoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TursoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveTursoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchTursoTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, TursoWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type TursoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTursoPlugin['hooks'];
	webhookHooks?: InternalTursoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tursoEndpointsNested>;
};

export type TursoContext = CorsairPluginContext<
	typeof TursoSchema,
	TursoPluginOptions
>;

export type TursoKeyBuilderContext = KeyBuilderContext<TursoPluginOptions>;

export type TursoBoundEndpoints = BindEndpoints<typeof tursoEndpointsNested>;

type TursoEndpoint<K extends keyof TursoEndpointOutputs> = CorsairEndpoint<
	TursoContext,
	TursoEndpointInputs[K],
	TursoEndpointOutputs[K]
>;

export type TursoEndpoints = {
	exampleGet: TursoEndpoint<'exampleGet'>;
};

type TursoWebhook<K extends keyof TursoWebhookOutputs, TEvent> = CorsairWebhook<
	TursoContext,
	TEvent,
	TursoWebhookOutputs[K]
>;

export type TursoWebhooks = {
	example: TursoWebhook<'example', ExampleEvent>;
};

export type TursoBoundWebhooks = BindWebhooks<TursoWebhooks>;

const tursoEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const tursoWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const tursoEndpointSchemas = {
	'example.get': {
		input: TursoEndpointInputSchemas.exampleGet,
		output: TursoEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof tursoEndpointsNested>;

const tursoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof tursoWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tursoEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tursoEndpointsNested>;

export const tursoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTursoPlugin<T extends TursoPluginOptions> = CorsairPlugin<
	'turso',
	typeof TursoSchema,
	typeof tursoEndpointsNested,
	typeof tursoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTursoPlugin = BaseTursoPlugin<TursoPluginOptions>;

export type ExternalTursoPlugin<T extends TursoPluginOptions> =
	BaseTursoPlugin<T>;

export function turso<const T extends TursoPluginOptions>(
	incomingOptions: TursoPluginOptions & T = {} as TursoPluginOptions & T,
): ExternalTursoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'turso',
		authConfig: tursoAuthConfig,
		schema: TursoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: tursoEndpointsNested,
		webhooks: tursoWebhooksNested,
		endpointMeta: tursoEndpointMeta,
		endpointSchemas: tursoEndpointSchemas,
		webhookSchemas: tursoWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-turso-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTursoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTursoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TursoKeyBuilderContext, source) => {
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
	} satisfies InternalTursoPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	TursoEndpointInputs,
	TursoEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	TursoWebhookOutputs,
} from './webhooks/types';
