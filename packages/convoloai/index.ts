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
import type { ConvoloAiEndpointInputs, ConvoloAiEndpointOutputs } from './endpoints/types';
import { ConvoloAiEndpointInputSchemas, ConvoloAiEndpointOutputSchemas } from './endpoints/types';
import type {
	ConvoloAiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ConvoloAiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchConvoloAiTenantWebhook } from './webhooks/tenant-matcher';
import { resolveConvoloAiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ConvoloAiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalConvoloAiPlugin['hooks'];
	webhookHooks?: InternalConvoloAiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof convoloAiEndpointsNested>;
};

export type ConvoloAiContext = CorsairPluginContext<
	typeof ConvoloAiSchema,
	ConvoloAiPluginOptions
>;

export type ConvoloAiKeyBuilderContext = KeyBuilderContext<ConvoloAiPluginOptions>;

export type ConvoloAiBoundEndpoints = BindEndpoints<typeof convoloAiEndpointsNested>;

type ConvoloAiEndpoint<
	K extends keyof ConvoloAiEndpointOutputs,
> = CorsairEndpoint<
	ConvoloAiContext,
	ConvoloAiEndpointInputs[K],
	ConvoloAiEndpointOutputs[K]
>;

export type ConvoloAiEndpoints = {
	exampleGet: ConvoloAiEndpoint<'exampleGet'>;
};

type ConvoloAiWebhook<
	K extends keyof ConvoloAiWebhookOutputs,
	TEvent,
> = CorsairWebhook<ConvoloAiContext, TEvent, ConvoloAiWebhookOutputs[K]>;

export type ConvoloAiWebhooks = {
	example: ConvoloAiWebhook<'example', ExampleEvent>;
};

export type ConvoloAiBoundWebhooks = BindWebhooks<ConvoloAiWebhooks>;

const convoloAiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const convoloAiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const convoloAiEndpointSchemas = {
	'example.get': {
		input: ConvoloAiEndpointInputSchemas.exampleGet,
		output: ConvoloAiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof convoloAiEndpointsNested>;

const convoloAiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof convoloAiWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const convoloAiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof convoloAiEndpointsNested>;

export const convoloAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseConvoloAiPlugin<T extends ConvoloAiPluginOptions> = CorsairPlugin<
	'convoloai',
	typeof ConvoloAiSchema,
	typeof convoloAiEndpointsNested,
	typeof convoloAiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalConvoloAiPlugin = BaseConvoloAiPlugin<ConvoloAiPluginOptions>;

export type ExternalConvoloAiPlugin<T extends ConvoloAiPluginOptions> =
	BaseConvoloAiPlugin<T>;

export function convoloai<const T extends ConvoloAiPluginOptions>(
	incomingOptions: ConvoloAiPluginOptions & T = {} as ConvoloAiPluginOptions & T,
): ExternalConvoloAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'convoloai',
		authConfig: convoloAiAuthConfig,
		schema: ConvoloAiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: convoloAiEndpointsNested,
		webhooks: convoloAiWebhooksNested,
		endpointMeta: convoloAiEndpointMeta,
		endpointSchemas: convoloAiEndpointSchemas,
		webhookSchemas: convoloAiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-convoloai-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchConvoloAiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveConvoloAiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ConvoloAiKeyBuilderContext, source) => {
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
	} satisfies InternalConvoloAiPlugin;
}

export type {
	ExampleEvent,
	ConvoloAiWebhookOutputs,
} from './webhooks/types';

export type {
	ConvoloAiEndpointInputs,
	ConvoloAiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
