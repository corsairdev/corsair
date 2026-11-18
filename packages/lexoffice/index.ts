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
import type { LexofficeEndpointInputs, LexofficeEndpointOutputs } from './endpoints/types';
import { LexofficeEndpointInputSchemas, LexofficeEndpointOutputSchemas } from './endpoints/types';
import type {
	LexofficeWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { LexofficeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchLexofficeTenantWebhook } from './webhooks/tenant-matcher';
import { resolveLexofficeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type LexofficePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLexofficePlugin['hooks'];
	webhookHooks?: InternalLexofficePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lexofficeEndpointsNested>;
};

export type LexofficeContext = CorsairPluginContext<
	typeof LexofficeSchema,
	LexofficePluginOptions
>;

export type LexofficeKeyBuilderContext = KeyBuilderContext<LexofficePluginOptions>;

export type LexofficeBoundEndpoints = BindEndpoints<typeof lexofficeEndpointsNested>;

type LexofficeEndpoint<
	K extends keyof LexofficeEndpointOutputs,
> = CorsairEndpoint<
	LexofficeContext,
	LexofficeEndpointInputs[K],
	LexofficeEndpointOutputs[K]
>;

export type LexofficeEndpoints = {
	exampleGet: LexofficeEndpoint<'exampleGet'>;
};

type LexofficeWebhook<
	K extends keyof LexofficeWebhookOutputs,
	TEvent,
> = CorsairWebhook<LexofficeContext, TEvent, LexofficeWebhookOutputs[K]>;

export type LexofficeWebhooks = {
	example: LexofficeWebhook<'example', ExampleEvent>;
};

export type LexofficeBoundWebhooks = BindWebhooks<LexofficeWebhooks>;

const lexofficeEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const lexofficeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const lexofficeEndpointSchemas = {
	'example.get': {
		input: LexofficeEndpointInputSchemas.exampleGet,
		output: LexofficeEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lexofficeEndpointsNested>;

const lexofficeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof lexofficeWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const lexofficeEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lexofficeEndpointsNested>;

export const lexofficeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLexofficePlugin<T extends LexofficePluginOptions> = CorsairPlugin<
	'lexoffice',
	typeof LexofficeSchema,
	typeof lexofficeEndpointsNested,
	typeof lexofficeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLexofficePlugin = BaseLexofficePlugin<LexofficePluginOptions>;

export type ExternalLexofficePlugin<T extends LexofficePluginOptions> =
	BaseLexofficePlugin<T>;

export function lexoffice<const T extends LexofficePluginOptions>(
	incomingOptions: LexofficePluginOptions & T = {} as LexofficePluginOptions & T,
): ExternalLexofficePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lexoffice',
		authConfig: lexofficeAuthConfig,
		schema: LexofficeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: lexofficeEndpointsNested,
		webhooks: lexofficeWebhooksNested,
		endpointMeta: lexofficeEndpointMeta,
		endpointSchemas: lexofficeEndpointSchemas,
		webhookSchemas: lexofficeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-lexoffice-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLexofficeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLexofficeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LexofficeKeyBuilderContext, source) => {
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
	} satisfies InternalLexofficePlugin;
}

export type {
	ExampleEvent,
	LexofficeWebhookOutputs,
} from './webhooks/types';

export type {
	LexofficeEndpointInputs,
	LexofficeEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
