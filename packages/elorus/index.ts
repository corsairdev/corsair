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
import type { ElorusEndpointInputs, ElorusEndpointOutputs } from './endpoints/types';
import { ElorusEndpointInputSchemas, ElorusEndpointOutputSchemas } from './endpoints/types';
import type {
	ElorusWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ElorusSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchElorusTenantWebhook } from './webhooks/tenant-matcher';
import { resolveElorusOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ElorusPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalElorusPlugin['hooks'];
	webhookHooks?: InternalElorusPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof elorusEndpointsNested>;
};

export type ElorusContext = CorsairPluginContext<
	typeof ElorusSchema,
	ElorusPluginOptions
>;

export type ElorusKeyBuilderContext = KeyBuilderContext<ElorusPluginOptions>;

export type ElorusBoundEndpoints = BindEndpoints<typeof elorusEndpointsNested>;

type ElorusEndpoint<
	K extends keyof ElorusEndpointOutputs,
> = CorsairEndpoint<
	ElorusContext,
	ElorusEndpointInputs[K],
	ElorusEndpointOutputs[K]
>;

export type ElorusEndpoints = {
	exampleGet: ElorusEndpoint<'exampleGet'>;
};

type ElorusWebhook<
	K extends keyof ElorusWebhookOutputs,
	TEvent,
> = CorsairWebhook<ElorusContext, TEvent, ElorusWebhookOutputs[K]>;

export type ElorusWebhooks = {
	example: ElorusWebhook<'example', ExampleEvent>;
};

export type ElorusBoundWebhooks = BindWebhooks<ElorusWebhooks>;

const elorusEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const elorusWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const elorusEndpointSchemas = {
	'example.get': {
		input: ElorusEndpointInputSchemas.exampleGet,
		output: ElorusEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof elorusEndpointsNested>;

const elorusWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof elorusWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const elorusEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof elorusEndpointsNested>;

export const elorusAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseElorusPlugin<T extends ElorusPluginOptions> = CorsairPlugin<
	'elorus',
	typeof ElorusSchema,
	typeof elorusEndpointsNested,
	typeof elorusWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalElorusPlugin = BaseElorusPlugin<ElorusPluginOptions>;

export type ExternalElorusPlugin<T extends ElorusPluginOptions> =
	BaseElorusPlugin<T>;

export function elorus<const T extends ElorusPluginOptions>(
	incomingOptions: ElorusPluginOptions & T = {} as ElorusPluginOptions & T,
): ExternalElorusPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'elorus',
		authConfig: elorusAuthConfig,
		schema: ElorusSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: elorusEndpointsNested,
		webhooks: elorusWebhooksNested,
		endpointMeta: elorusEndpointMeta,
		endpointSchemas: elorusEndpointSchemas,
		webhookSchemas: elorusWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-elorus-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchElorusTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveElorusOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ElorusKeyBuilderContext, source) => {
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
	} satisfies InternalElorusPlugin;
}

export type {
	ExampleEvent,
	ElorusWebhookOutputs,
} from './webhooks/types';

export type {
	ElorusEndpointInputs,
	ElorusEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
