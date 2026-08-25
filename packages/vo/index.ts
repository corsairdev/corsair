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
import type { VoEndpointInputs, VoEndpointOutputs } from './endpoints/types';
import { VoEndpointInputSchemas, VoEndpointOutputSchemas } from './endpoints/types';
import type {
	VoWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { VoSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchVoTenantWebhook } from './webhooks/tenant-matcher';
import { resolveVoOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type VoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalVoPlugin['hooks'];
	webhookHooks?: InternalVoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof voEndpointsNested>;
};

export type VoContext = CorsairPluginContext<
	typeof VoSchema,
	VoPluginOptions
>;

export type VoKeyBuilderContext = KeyBuilderContext<VoPluginOptions>;

export type VoBoundEndpoints = BindEndpoints<typeof voEndpointsNested>;

type VoEndpoint<
	K extends keyof VoEndpointOutputs,
> = CorsairEndpoint<
	VoContext,
	VoEndpointInputs[K],
	VoEndpointOutputs[K]
>;

export type VoEndpoints = {
	exampleGet: VoEndpoint<'exampleGet'>;
};

type VoWebhook<
	K extends keyof VoWebhookOutputs,
	TEvent,
> = CorsairWebhook<VoContext, TEvent, VoWebhookOutputs[K]>;

export type VoWebhooks = {
	example: VoWebhook<'example', ExampleEvent>;
};

export type VoBoundWebhooks = BindWebhooks<VoWebhooks>;

const voEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const voWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const voEndpointSchemas = {
	'example.get': {
		input: VoEndpointInputSchemas.exampleGet,
		output: VoEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof voEndpointsNested>;

const voWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof voWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const voEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof voEndpointsNested>;

export const voAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseVoPlugin<T extends VoPluginOptions> = CorsairPlugin<
	'vo',
	typeof VoSchema,
	typeof voEndpointsNested,
	typeof voWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalVoPlugin = BaseVoPlugin<VoPluginOptions>;

export type ExternalVoPlugin<T extends VoPluginOptions> =
	BaseVoPlugin<T>;

export function vo<const T extends VoPluginOptions>(
	incomingOptions: VoPluginOptions & T = {} as VoPluginOptions & T,
): ExternalVoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vo',
		authConfig: voAuthConfig,
		schema: VoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: voEndpointsNested,
		webhooks: voWebhooksNested,
		endpointMeta: voEndpointMeta,
		endpointSchemas: voEndpointSchemas,
		webhookSchemas: voWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-vo-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchVoTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveVoOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VoKeyBuilderContext, source) => {
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
	} satisfies InternalVoPlugin;
}

export type {
	ExampleEvent,
	VoWebhookOutputs,
} from './webhooks/types';

export type {
	VoEndpointInputs,
	VoEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
