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
	WizaEndpointInputs,
	WizaEndpointOutputs,
} from './endpoints/types';
import {
	WizaEndpointInputSchemas,
	WizaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WizaSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveWizaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchWizaTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, WizaWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type WizaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWizaPlugin['hooks'];
	webhookHooks?: InternalWizaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wizaEndpointsNested>;
};

export type WizaContext = CorsairPluginContext<
	typeof WizaSchema,
	WizaPluginOptions
>;

export type WizaKeyBuilderContext = KeyBuilderContext<WizaPluginOptions>;

export type WizaBoundEndpoints = BindEndpoints<typeof wizaEndpointsNested>;

type WizaEndpoint<K extends keyof WizaEndpointOutputs> = CorsairEndpoint<
	WizaContext,
	WizaEndpointInputs[K],
	WizaEndpointOutputs[K]
>;

export type WizaEndpoints = {
	exampleGet: WizaEndpoint<'exampleGet'>;
};

type WizaWebhook<K extends keyof WizaWebhookOutputs, TEvent> = CorsairWebhook<
	WizaContext,
	TEvent,
	WizaWebhookOutputs[K]
>;

export type WizaWebhooks = {
	example: WizaWebhook<'example', ExampleEvent>;
};

export type WizaBoundWebhooks = BindWebhooks<WizaWebhooks>;

const wizaEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const wizaWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const wizaEndpointSchemas = {
	'example.get': {
		input: WizaEndpointInputSchemas.exampleGet,
		output: WizaEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof wizaEndpointsNested>;

const wizaWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof wizaWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const wizaEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wizaEndpointsNested>;

export const wizaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWizaPlugin<T extends WizaPluginOptions> = CorsairPlugin<
	'wiza',
	typeof WizaSchema,
	typeof wizaEndpointsNested,
	typeof wizaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWizaPlugin = BaseWizaPlugin<WizaPluginOptions>;

export type ExternalWizaPlugin<T extends WizaPluginOptions> = BaseWizaPlugin<T>;

export function wiza<const T extends WizaPluginOptions>(
	incomingOptions: WizaPluginOptions & T = {} as WizaPluginOptions & T,
): ExternalWizaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wiza',
		authConfig: wizaAuthConfig,
		schema: WizaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: wizaEndpointsNested,
		webhooks: wizaWebhooksNested,
		endpointMeta: wizaEndpointMeta,
		endpointSchemas: wizaEndpointSchemas,
		webhookSchemas: wizaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-wiza-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchWizaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWizaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WizaKeyBuilderContext, source) => {
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
	} satisfies InternalWizaPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	WizaEndpointInputs,
	WizaEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	WizaWebhookOutputs,
} from './webhooks/types';
