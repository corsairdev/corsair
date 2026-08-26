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
	BoldsignEndpointInputs,
	BoldsignEndpointOutputs,
} from './endpoints/types';
import {
	BoldsignEndpointInputSchemas,
	BoldsignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BoldsignSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBoldsignOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBoldsignTenantWebhook } from './webhooks/tenant-matcher';
import type { BoldsignWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BoldsignPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBoldsignPlugin['hooks'];
	webhookHooks?: InternalBoldsignPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boldsignEndpointsNested>;
};

export type BoldsignContext = CorsairPluginContext<
	typeof BoldsignSchema,
	BoldsignPluginOptions
>;

export type BoldsignKeyBuilderContext =
	KeyBuilderContext<BoldsignPluginOptions>;

export type BoldsignBoundEndpoints = BindEndpoints<
	typeof boldsignEndpointsNested
>;

type BoldsignEndpoint<K extends keyof BoldsignEndpointOutputs> =
	CorsairEndpoint<
		BoldsignContext,
		BoldsignEndpointInputs[K],
		BoldsignEndpointOutputs[K]
	>;

export type BoldsignEndpoints = {
	exampleGet: BoldsignEndpoint<'exampleGet'>;
};

type BoldsignWebhook<
	K extends keyof BoldsignWebhookOutputs,
	TEvent,
> = CorsairWebhook<BoldsignContext, TEvent, BoldsignWebhookOutputs[K]>;

export type BoldsignWebhooks = {
	example: BoldsignWebhook<'example', ExampleEvent>;
};

export type BoldsignBoundWebhooks = BindWebhooks<BoldsignWebhooks>;

const boldsignEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const boldsignWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const boldsignEndpointSchemas = {
	'example.get': {
		input: BoldsignEndpointInputSchemas.exampleGet,
		output: BoldsignEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof boldsignEndpointsNested
>;

const boldsignWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof boldsignWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const boldsignEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof boldsignEndpointsNested>;

export const boldsignAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBoldsignPlugin<T extends BoldsignPluginOptions> = CorsairPlugin<
	'boldsign',
	typeof BoldsignSchema,
	typeof boldsignEndpointsNested,
	typeof boldsignWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBoldsignPlugin = BaseBoldsignPlugin<BoldsignPluginOptions>;

export type ExternalBoldsignPlugin<T extends BoldsignPluginOptions> =
	BaseBoldsignPlugin<T>;

export function boldsign<const T extends BoldsignPluginOptions>(
	incomingOptions: BoldsignPluginOptions & T = {} as BoldsignPluginOptions & T,
): ExternalBoldsignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'boldsign',
		authConfig: boldsignAuthConfig,
		schema: BoldsignSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: boldsignEndpointsNested,
		webhooks: boldsignWebhooksNested,
		endpointMeta: boldsignEndpointMeta,
		endpointSchemas: boldsignEndpointSchemas,
		webhookSchemas: boldsignWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-boldsign-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBoldsignTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBoldsignOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoldsignKeyBuilderContext, source) => {
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
	} satisfies InternalBoldsignPlugin;
}

export type {
	BoldsignEndpointInputs,
	BoldsignEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BoldsignWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
