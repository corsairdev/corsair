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
import type { FireberryEndpointInputs, FireberryEndpointOutputs } from './endpoints/types';
import { FireberryEndpointInputSchemas, FireberryEndpointOutputSchemas } from './endpoints/types';
import type {
	FireberryWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FireberrySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFireberryTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFireberryOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FireberryPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFireberryPlugin['hooks'];
	webhookHooks?: InternalFireberryPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fireberryEndpointsNested>;
};

export type FireberryContext = CorsairPluginContext<
	typeof FireberrySchema,
	FireberryPluginOptions
>;

export type FireberryKeyBuilderContext = KeyBuilderContext<FireberryPluginOptions>;

export type FireberryBoundEndpoints = BindEndpoints<typeof fireberryEndpointsNested>;

type FireberryEndpoint<
	K extends keyof FireberryEndpointOutputs,
> = CorsairEndpoint<
	FireberryContext,
	FireberryEndpointInputs[K],
	FireberryEndpointOutputs[K]
>;

export type FireberryEndpoints = {
	exampleGet: FireberryEndpoint<'exampleGet'>;
};

type FireberryWebhook<
	K extends keyof FireberryWebhookOutputs,
	TEvent,
> = CorsairWebhook<FireberryContext, TEvent, FireberryWebhookOutputs[K]>;

export type FireberryWebhooks = {
	example: FireberryWebhook<'example', ExampleEvent>;
};

export type FireberryBoundWebhooks = BindWebhooks<FireberryWebhooks>;

const fireberryEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const fireberryWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const fireberryEndpointSchemas = {
	'example.get': {
		input: FireberryEndpointInputSchemas.exampleGet,
		output: FireberryEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fireberryEndpointsNested>;

const fireberryWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof fireberryWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fireberryEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fireberryEndpointsNested>;

export const fireberryAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFireberryPlugin<T extends FireberryPluginOptions> = CorsairPlugin<
	'fireberry',
	typeof FireberrySchema,
	typeof fireberryEndpointsNested,
	typeof fireberryWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFireberryPlugin = BaseFireberryPlugin<FireberryPluginOptions>;

export type ExternalFireberryPlugin<T extends FireberryPluginOptions> =
	BaseFireberryPlugin<T>;

export function fireberry<const T extends FireberryPluginOptions>(
	incomingOptions: FireberryPluginOptions & T = {} as FireberryPluginOptions & T,
): ExternalFireberryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fireberry',
		authConfig: fireberryAuthConfig,
		schema: FireberrySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: fireberryEndpointsNested,
		webhooks: fireberryWebhooksNested,
		endpointMeta: fireberryEndpointMeta,
		endpointSchemas: fireberryEndpointSchemas,
		webhookSchemas: fireberryWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-fireberry-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFireberryTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFireberryOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FireberryKeyBuilderContext, source) => {
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
	} satisfies InternalFireberryPlugin;
}

export type {
	ExampleEvent,
	FireberryWebhookOutputs,
} from './webhooks/types';

export type {
	FireberryEndpointInputs,
	FireberryEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
