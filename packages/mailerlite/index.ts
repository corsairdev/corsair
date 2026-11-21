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
import type { MailerLiteEndpointInputs, MailerLiteEndpointOutputs } from './endpoints/types';
import { MailerLiteEndpointInputSchemas, MailerLiteEndpointOutputSchemas } from './endpoints/types';
import type {
	MailerLiteWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { MailerLiteSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchMailerLiteTenantWebhook } from './webhooks/tenant-matcher';
import { resolveMailerLiteOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type MailerLitePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMailerLitePlugin['hooks'];
	webhookHooks?: InternalMailerLitePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailerLiteEndpointsNested>;
};

export type MailerLiteContext = CorsairPluginContext<
	typeof MailerLiteSchema,
	MailerLitePluginOptions
>;

export type MailerLiteKeyBuilderContext = KeyBuilderContext<MailerLitePluginOptions>;

export type MailerLiteBoundEndpoints = BindEndpoints<typeof mailerLiteEndpointsNested>;

type MailerLiteEndpoint<
	K extends keyof MailerLiteEndpointOutputs,
> = CorsairEndpoint<
	MailerLiteContext,
	MailerLiteEndpointInputs[K],
	MailerLiteEndpointOutputs[K]
>;

export type MailerLiteEndpoints = {
	exampleGet: MailerLiteEndpoint<'exampleGet'>;
};

type MailerLiteWebhook<
	K extends keyof MailerLiteWebhookOutputs,
	TEvent,
> = CorsairWebhook<MailerLiteContext, TEvent, MailerLiteWebhookOutputs[K]>;

export type MailerLiteWebhooks = {
	example: MailerLiteWebhook<'example', ExampleEvent>;
};

export type MailerLiteBoundWebhooks = BindWebhooks<MailerLiteWebhooks>;

const mailerLiteEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const mailerLiteWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const mailerLiteEndpointSchemas = {
	'example.get': {
		input: MailerLiteEndpointInputSchemas.exampleGet,
		output: MailerLiteEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof mailerLiteEndpointsNested>;

const mailerLiteWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof mailerLiteWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mailerLiteEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mailerLiteEndpointsNested>;

export const mailerLiteAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMailerLitePlugin<T extends MailerLitePluginOptions> = CorsairPlugin<
	'mailerlite',
	typeof MailerLiteSchema,
	typeof mailerLiteEndpointsNested,
	typeof mailerLiteWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMailerLitePlugin = BaseMailerLitePlugin<MailerLitePluginOptions>;

export type ExternalMailerLitePlugin<T extends MailerLitePluginOptions> =
	BaseMailerLitePlugin<T>;

export function mailerlite<const T extends MailerLitePluginOptions>(
	incomingOptions: MailerLitePluginOptions & T = {} as MailerLitePluginOptions & T,
): ExternalMailerLitePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailerlite',
		authConfig: mailerLiteAuthConfig,
		schema: MailerLiteSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mailerLiteEndpointsNested,
		webhooks: mailerLiteWebhooksNested,
		endpointMeta: mailerLiteEndpointMeta,
		endpointSchemas: mailerLiteEndpointSchemas,
		webhookSchemas: mailerLiteWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-mailerlite-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMailerLiteTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMailerLiteOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailerLiteKeyBuilderContext, source) => {
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
	} satisfies InternalMailerLitePlugin;
}

export type {
	ExampleEvent,
	MailerLiteWebhookOutputs,
} from './webhooks/types';

export type {
	MailerLiteEndpointInputs,
	MailerLiteEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
