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
import type { MailcoachEndpointInputs, MailcoachEndpointOutputs } from './endpoints/types';
import { MailcoachEndpointInputSchemas, MailcoachEndpointOutputSchemas } from './endpoints/types';
import type {
	MailcoachWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { MailcoachSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchMailcoachTenantWebhook } from './webhooks/tenant-matcher';
import { resolveMailcoachOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type MailcoachPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMailcoachPlugin['hooks'];
	webhookHooks?: InternalMailcoachPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailcoachEndpointsNested>;
};

export type MailcoachContext = CorsairPluginContext<
	typeof MailcoachSchema,
	MailcoachPluginOptions
>;

export type MailcoachKeyBuilderContext = KeyBuilderContext<MailcoachPluginOptions>;

export type MailcoachBoundEndpoints = BindEndpoints<typeof mailcoachEndpointsNested>;

type MailcoachEndpoint<
	K extends keyof MailcoachEndpointOutputs,
> = CorsairEndpoint<
	MailcoachContext,
	MailcoachEndpointInputs[K],
	MailcoachEndpointOutputs[K]
>;

export type MailcoachEndpoints = {
	exampleGet: MailcoachEndpoint<'exampleGet'>;
};

type MailcoachWebhook<
	K extends keyof MailcoachWebhookOutputs,
	TEvent,
> = CorsairWebhook<MailcoachContext, TEvent, MailcoachWebhookOutputs[K]>;

export type MailcoachWebhooks = {
	example: MailcoachWebhook<'example', ExampleEvent>;
};

export type MailcoachBoundWebhooks = BindWebhooks<MailcoachWebhooks>;

const mailcoachEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const mailcoachWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const mailcoachEndpointSchemas = {
	'example.get': {
		input: MailcoachEndpointInputSchemas.exampleGet,
		output: MailcoachEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof mailcoachEndpointsNested>;

const mailcoachWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof mailcoachWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mailcoachEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mailcoachEndpointsNested>;

export const mailcoachAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMailcoachPlugin<T extends MailcoachPluginOptions> = CorsairPlugin<
	'mailcoach',
	typeof MailcoachSchema,
	typeof mailcoachEndpointsNested,
	typeof mailcoachWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMailcoachPlugin = BaseMailcoachPlugin<MailcoachPluginOptions>;

export type ExternalMailcoachPlugin<T extends MailcoachPluginOptions> =
	BaseMailcoachPlugin<T>;

export function mailcoach<const T extends MailcoachPluginOptions>(
	incomingOptions: MailcoachPluginOptions & T = {} as MailcoachPluginOptions & T,
): ExternalMailcoachPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailcoach',
		authConfig: mailcoachAuthConfig,
		schema: MailcoachSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mailcoachEndpointsNested,
		webhooks: mailcoachWebhooksNested,
		endpointMeta: mailcoachEndpointMeta,
		endpointSchemas: mailcoachEndpointSchemas,
		webhookSchemas: mailcoachWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-mailcoach-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMailcoachTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMailcoachOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailcoachKeyBuilderContext, source) => {
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
	} satisfies InternalMailcoachPlugin;
}

export type {
	ExampleEvent,
	MailcoachWebhookOutputs,
} from './webhooks/types';

export type {
	MailcoachEndpointInputs,
	MailcoachEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
