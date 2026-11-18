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
import type { LapostaEndpointInputs, LapostaEndpointOutputs } from './endpoints/types';
import { LapostaEndpointInputSchemas, LapostaEndpointOutputSchemas } from './endpoints/types';
import type {
	LapostaWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { LapostaSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchLapostaTenantWebhook } from './webhooks/tenant-matcher';
import { resolveLapostaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type LapostaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLapostaPlugin['hooks'];
	webhookHooks?: InternalLapostaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lapostaEndpointsNested>;
};

export type LapostaContext = CorsairPluginContext<
	typeof LapostaSchema,
	LapostaPluginOptions
>;

export type LapostaKeyBuilderContext = KeyBuilderContext<LapostaPluginOptions>;

export type LapostaBoundEndpoints = BindEndpoints<typeof lapostaEndpointsNested>;

type LapostaEndpoint<
	K extends keyof LapostaEndpointOutputs,
> = CorsairEndpoint<
	LapostaContext,
	LapostaEndpointInputs[K],
	LapostaEndpointOutputs[K]
>;

export type LapostaEndpoints = {
	exampleGet: LapostaEndpoint<'exampleGet'>;
};

type LapostaWebhook<
	K extends keyof LapostaWebhookOutputs,
	TEvent,
> = CorsairWebhook<LapostaContext, TEvent, LapostaWebhookOutputs[K]>;

export type LapostaWebhooks = {
	example: LapostaWebhook<'example', ExampleEvent>;
};

export type LapostaBoundWebhooks = BindWebhooks<LapostaWebhooks>;

const lapostaEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const lapostaWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const lapostaEndpointSchemas = {
	'example.get': {
		input: LapostaEndpointInputSchemas.exampleGet,
		output: LapostaEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lapostaEndpointsNested>;

const lapostaWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof lapostaWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const lapostaEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lapostaEndpointsNested>;

export const lapostaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLapostaPlugin<T extends LapostaPluginOptions> = CorsairPlugin<
	'laposta',
	typeof LapostaSchema,
	typeof lapostaEndpointsNested,
	typeof lapostaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLapostaPlugin = BaseLapostaPlugin<LapostaPluginOptions>;

export type ExternalLapostaPlugin<T extends LapostaPluginOptions> =
	BaseLapostaPlugin<T>;

export function laposta<const T extends LapostaPluginOptions>(
	incomingOptions: LapostaPluginOptions & T = {} as LapostaPluginOptions & T,
): ExternalLapostaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'laposta',
		authConfig: lapostaAuthConfig,
		schema: LapostaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: lapostaEndpointsNested,
		webhooks: lapostaWebhooksNested,
		endpointMeta: lapostaEndpointMeta,
		endpointSchemas: lapostaEndpointSchemas,
		webhookSchemas: lapostaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-laposta-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLapostaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLapostaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LapostaKeyBuilderContext, source) => {
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
	} satisfies InternalLapostaPlugin;
}

export type {
	ExampleEvent,
	LapostaWebhookOutputs,
} from './webhooks/types';

export type {
	LapostaEndpointInputs,
	LapostaEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
