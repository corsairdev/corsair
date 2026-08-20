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
import type { AeroleadsEndpointInputs, AeroleadsEndpointOutputs } from './endpoints/types';
import { AeroleadsEndpointInputSchemas, AeroleadsEndpointOutputSchemas } from './endpoints/types';
import type {
	AeroleadsWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { AeroleadsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchAeroleadsTenantWebhook } from './webhooks/tenant-matcher';
import { resolveAeroleadsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type AeroleadsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAeroleadsPlugin['hooks'];
	webhookHooks?: InternalAeroleadsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof aeroleadsEndpointsNested>;
};

export type AeroleadsContext = CorsairPluginContext<
	typeof AeroleadsSchema,
	AeroleadsPluginOptions
>;

export type AeroleadsKeyBuilderContext = KeyBuilderContext<AeroleadsPluginOptions>;

export type AeroleadsBoundEndpoints = BindEndpoints<typeof aeroleadsEndpointsNested>;

type AeroleadsEndpoint<
	K extends keyof AeroleadsEndpointOutputs,
> = CorsairEndpoint<
	AeroleadsContext,
	AeroleadsEndpointInputs[K],
	AeroleadsEndpointOutputs[K]
>;

export type AeroleadsEndpoints = {
	exampleGet: AeroleadsEndpoint<'exampleGet'>;
};

type AeroleadsWebhook<
	K extends keyof AeroleadsWebhookOutputs,
	TEvent,
> = CorsairWebhook<AeroleadsContext, TEvent, AeroleadsWebhookOutputs[K]>;

export type AeroleadsWebhooks = {
	example: AeroleadsWebhook<'example', ExampleEvent>;
};

export type AeroleadsBoundWebhooks = BindWebhooks<AeroleadsWebhooks>;

const aeroleadsEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const aeroleadsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const aeroleadsEndpointSchemas = {
	'example.get': {
		input: AeroleadsEndpointInputSchemas.exampleGet,
		output: AeroleadsEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof aeroleadsEndpointsNested>;

const aeroleadsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof aeroleadsWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const aeroleadsEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof aeroleadsEndpointsNested>;

export const aeroleadsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAeroleadsPlugin<T extends AeroleadsPluginOptions> = CorsairPlugin<
	'aeroleads',
	typeof AeroleadsSchema,
	typeof aeroleadsEndpointsNested,
	typeof aeroleadsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAeroleadsPlugin = BaseAeroleadsPlugin<AeroleadsPluginOptions>;

export type ExternalAeroleadsPlugin<T extends AeroleadsPluginOptions> =
	BaseAeroleadsPlugin<T>;

export function aeroleads<const T extends AeroleadsPluginOptions>(
	incomingOptions: AeroleadsPluginOptions & T = {} as AeroleadsPluginOptions & T,
): ExternalAeroleadsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'aeroleads',
		authConfig: aeroleadsAuthConfig,
		schema: AeroleadsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: aeroleadsEndpointsNested,
		webhooks: aeroleadsWebhooksNested,
		endpointMeta: aeroleadsEndpointMeta,
		endpointSchemas: aeroleadsEndpointSchemas,
		webhookSchemas: aeroleadsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-aeroleads-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAeroleadsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAeroleadsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AeroleadsKeyBuilderContext, source) => {
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
	} satisfies InternalAeroleadsPlugin;
}

export type {
	ExampleEvent,
	AeroleadsWebhookOutputs,
} from './webhooks/types';

export type {
	AeroleadsEndpointInputs,
	AeroleadsEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
