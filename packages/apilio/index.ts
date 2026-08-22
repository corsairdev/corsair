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
	ApilioEndpointInputs,
	ApilioEndpointOutputs,
} from './endpoints/types';
import {
	ApilioEndpointInputSchemas,
	ApilioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApilioSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveApilioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchApilioTenantWebhook } from './webhooks/tenant-matcher';
import type { ApilioWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ApilioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalApilioPlugin['hooks'];
	webhookHooks?: InternalApilioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apilioEndpointsNested>;
};

export type ApilioContext = CorsairPluginContext<
	typeof ApilioSchema,
	ApilioPluginOptions
>;

export type ApilioKeyBuilderContext = KeyBuilderContext<ApilioPluginOptions>;

export type ApilioBoundEndpoints = BindEndpoints<typeof apilioEndpointsNested>;

type ApilioEndpoint<K extends keyof ApilioEndpointOutputs> = CorsairEndpoint<
	ApilioContext,
	ApilioEndpointInputs[K],
	ApilioEndpointOutputs[K]
>;

export type ApilioEndpoints = {
	exampleGet: ApilioEndpoint<'exampleGet'>;
};

type ApilioWebhook<
	K extends keyof ApilioWebhookOutputs,
	TEvent,
> = CorsairWebhook<ApilioContext, TEvent, ApilioWebhookOutputs[K]>;

export type ApilioWebhooks = {
	example: ApilioWebhook<'example', ExampleEvent>;
};

export type ApilioBoundWebhooks = BindWebhooks<ApilioWebhooks>;

const apilioEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const apilioWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const apilioEndpointSchemas = {
	'example.get': {
		input: ApilioEndpointInputSchemas.exampleGet,
		output: ApilioEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof apilioEndpointsNested
>;

const apilioWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof apilioWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const apilioEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof apilioEndpointsNested>;

export const apilioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseApilioPlugin<T extends ApilioPluginOptions> = CorsairPlugin<
	'apilio',
	typeof ApilioSchema,
	typeof apilioEndpointsNested,
	typeof apilioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalApilioPlugin = BaseApilioPlugin<ApilioPluginOptions>;

export type ExternalApilioPlugin<T extends ApilioPluginOptions> =
	BaseApilioPlugin<T>;

export function apilio<const T extends ApilioPluginOptions>(
	incomingOptions: ApilioPluginOptions & T = {} as ApilioPluginOptions & T,
): ExternalApilioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apilio',
		authConfig: apilioAuthConfig,
		schema: ApilioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: apilioEndpointsNested,
		webhooks: apilioWebhooksNested,
		endpointMeta: apilioEndpointMeta,
		endpointSchemas: apilioEndpointSchemas,
		webhookSchemas: apilioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-apilio-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchApilioTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveApilioOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ApilioKeyBuilderContext, source) => {
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
	} satisfies InternalApilioPlugin;
}

export type {
	ApilioEndpointInputs,
	ApilioEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	ApilioWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
