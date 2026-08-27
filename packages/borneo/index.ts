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
	BorneoEndpointInputs,
	BorneoEndpointOutputs,
} from './endpoints/types';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BorneoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBorneoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBorneoTenantWebhook } from './webhooks/tenant-matcher';
import type { BorneoWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BorneoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBorneoPlugin['hooks'];
	webhookHooks?: InternalBorneoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof borneoEndpointsNested>;
};

export type BorneoContext = CorsairPluginContext<
	typeof BorneoSchema,
	BorneoPluginOptions
>;

export type BorneoKeyBuilderContext = KeyBuilderContext<BorneoPluginOptions>;

export type BorneoBoundEndpoints = BindEndpoints<typeof borneoEndpointsNested>;

type BorneoEndpoint<K extends keyof BorneoEndpointOutputs> = CorsairEndpoint<
	BorneoContext,
	BorneoEndpointInputs[K],
	BorneoEndpointOutputs[K]
>;

export type BorneoEndpoints = {
	exampleGet: BorneoEndpoint<'exampleGet'>;
};

type BorneoWebhook<
	K extends keyof BorneoWebhookOutputs,
	TEvent,
> = CorsairWebhook<BorneoContext, TEvent, BorneoWebhookOutputs[K]>;

export type BorneoWebhooks = {
	example: BorneoWebhook<'example', ExampleEvent>;
};

export type BorneoBoundWebhooks = BindWebhooks<BorneoWebhooks>;

const borneoEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const borneoWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const borneoEndpointSchemas = {
	'example.get': {
		input: BorneoEndpointInputSchemas.exampleGet,
		output: BorneoEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof borneoEndpointsNested
>;

const borneoWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof borneoWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const borneoEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof borneoEndpointsNested>;

export const borneoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBorneoPlugin<T extends BorneoPluginOptions> = CorsairPlugin<
	'borneo',
	typeof BorneoSchema,
	typeof borneoEndpointsNested,
	typeof borneoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBorneoPlugin = BaseBorneoPlugin<BorneoPluginOptions>;

export type ExternalBorneoPlugin<T extends BorneoPluginOptions> =
	BaseBorneoPlugin<T>;

export function borneo<const T extends BorneoPluginOptions>(
	incomingOptions: BorneoPluginOptions & T = {} as BorneoPluginOptions & T,
): ExternalBorneoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'borneo',
		authConfig: borneoAuthConfig,
		schema: BorneoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: borneoEndpointsNested,
		webhooks: borneoWebhooksNested,
		endpointMeta: borneoEndpointMeta,
		endpointSchemas: borneoEndpointSchemas,
		webhookSchemas: borneoWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-borneo-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBorneoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBorneoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BorneoKeyBuilderContext, source) => {
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
	} satisfies InternalBorneoPlugin;
}

export type {
	BorneoEndpointInputs,
	BorneoEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BorneoWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
