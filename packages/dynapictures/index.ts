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
import { DynapicturesEndpoints } from './endpoints';
import type {
	DynapicturesEndpointInputs,
	DynapicturesEndpointOutputs,
} from './endpoints/types';
import {
	DynapicturesEndpointInputSchemas,
	DynapicturesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DynapicturesSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDynapicturesOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDynapicturesTenantWebhook } from './webhooks/tenant-matcher';
import type {
	DynapicturesWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DynapicturesPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDynapicturesPlugin['hooks'];
	webhookHooks?: InternalDynapicturesPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dynapicturesEndpointsNested>;
};

export type DynapicturesContext = CorsairPluginContext<
	typeof DynapicturesSchema,
	DynapicturesPluginOptions
>;

export type DynapicturesKeyBuilderContext =
	KeyBuilderContext<DynapicturesPluginOptions>;

export type DynapicturesBoundEndpoints = BindEndpoints<
	typeof dynapicturesEndpointsNested
>;

type DynapicturesEndpoint<K extends keyof DynapicturesEndpointOutputs> =
	CorsairEndpoint<
		DynapicturesContext,
		DynapicturesEndpointInputs[K],
		DynapicturesEndpointOutputs[K]
	>;

export type DynapicturesEndpoints = {
	exampleGet: DynapicturesEndpoint<'exampleGet'>;
};

type DynapicturesWebhook<
	K extends keyof DynapicturesWebhookOutputs,
	TEvent,
> = CorsairWebhook<DynapicturesContext, TEvent, DynapicturesWebhookOutputs[K]>;

export type DynapicturesWebhooks = {
	example: DynapicturesWebhook<'example', ExampleEvent>;
};

export type DynapicturesBoundWebhooks = BindWebhooks<DynapicturesWebhooks>;

const dynapicturesEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const dynapicturesWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const dynapicturesEndpointSchemas = {
	'example.get': {
		input: DynapicturesEndpointInputSchemas.exampleGet,
		output: DynapicturesEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dynapicturesEndpointsNested
>;

const dynapicturesWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof dynapicturesWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dynapicturesEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dynapicturesEndpointsNested
>;

export const dynapicturesAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	CorsairPlugin<
		'dynapictures',
		typeof DynapicturesSchema,
		typeof dynapicturesEndpointsNested,
		typeof dynapicturesWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDynapicturesPlugin =
	BaseDynapicturesPlugin<DynapicturesPluginOptions>;

export type ExternalDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	BaseDynapicturesPlugin<T>;

export function dynapictures<const T extends DynapicturesPluginOptions>(
	incomingOptions: DynapicturesPluginOptions &
		T = {} as DynapicturesPluginOptions & T,
): ExternalDynapicturesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dynapictures',
		authConfig: dynapicturesAuthConfig,
		schema: DynapicturesSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dynapicturesEndpointsNested,
		webhooks: dynapicturesWebhooksNested,
		endpointMeta: dynapicturesEndpointMeta,
		endpointSchemas: dynapicturesEndpointSchemas,
		webhookSchemas: dynapicturesWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-dynapictures-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDynapicturesTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDynapicturesOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DynapicturesKeyBuilderContext, source) => {
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
	} satisfies InternalDynapicturesPlugin;
}

export type {
	DynapicturesEndpointInputs,
	DynapicturesEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	DynapicturesWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
