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
import type { LodgifyEndpointInputs, LodgifyEndpointOutputs } from './endpoints/types';
import { LodgifyEndpointInputSchemas, LodgifyEndpointOutputSchemas } from './endpoints/types';
import type {
	LodgifyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { LodgifySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchLodgifyTenantWebhook } from './webhooks/tenant-matcher';
import { resolveLodgifyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type LodgifyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLodgifyPlugin['hooks'];
	webhookHooks?: InternalLodgifyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lodgifyEndpointsNested>;
};

export type LodgifyContext = CorsairPluginContext<
	typeof LodgifySchema,
	LodgifyPluginOptions
>;

export type LodgifyKeyBuilderContext = KeyBuilderContext<LodgifyPluginOptions>;

export type LodgifyBoundEndpoints = BindEndpoints<typeof lodgifyEndpointsNested>;

type LodgifyEndpoint<
	K extends keyof LodgifyEndpointOutputs,
> = CorsairEndpoint<
	LodgifyContext,
	LodgifyEndpointInputs[K],
	LodgifyEndpointOutputs[K]
>;

export type LodgifyEndpoints = {
	exampleGet: LodgifyEndpoint<'exampleGet'>;
};

type LodgifyWebhook<
	K extends keyof LodgifyWebhookOutputs,
	TEvent,
> = CorsairWebhook<LodgifyContext, TEvent, LodgifyWebhookOutputs[K]>;

export type LodgifyWebhooks = {
	example: LodgifyWebhook<'example', ExampleEvent>;
};

export type LodgifyBoundWebhooks = BindWebhooks<LodgifyWebhooks>;

const lodgifyEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const lodgifyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const lodgifyEndpointSchemas = {
	'example.get': {
		input: LodgifyEndpointInputSchemas.exampleGet,
		output: LodgifyEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lodgifyEndpointsNested>;

const lodgifyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof lodgifyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const lodgifyEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lodgifyEndpointsNested>;

export const lodgifyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLodgifyPlugin<T extends LodgifyPluginOptions> = CorsairPlugin<
	'lodgify',
	typeof LodgifySchema,
	typeof lodgifyEndpointsNested,
	typeof lodgifyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLodgifyPlugin = BaseLodgifyPlugin<LodgifyPluginOptions>;

export type ExternalLodgifyPlugin<T extends LodgifyPluginOptions> =
	BaseLodgifyPlugin<T>;

export function lodgify<const T extends LodgifyPluginOptions>(
	incomingOptions: LodgifyPluginOptions & T = {} as LodgifyPluginOptions & T,
): ExternalLodgifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lodgify',
		authConfig: lodgifyAuthConfig,
		schema: LodgifySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: lodgifyEndpointsNested,
		webhooks: lodgifyWebhooksNested,
		endpointMeta: lodgifyEndpointMeta,
		endpointSchemas: lodgifyEndpointSchemas,
		webhookSchemas: lodgifyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-lodgify-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLodgifyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLodgifyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LodgifyKeyBuilderContext, source) => {
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
	} satisfies InternalLodgifyPlugin;
}

export type {
	ExampleEvent,
	LodgifyWebhookOutputs,
} from './webhooks/types';

export type {
	LodgifyEndpointInputs,
	LodgifyEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
