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
	MailtrapEndpointInputs,
	MailtrapEndpointOutputs,
} from './endpoints/types';
import {
	MailtrapEndpointInputSchemas,
	MailtrapEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MailtrapSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveMailtrapOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchMailtrapTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, MailtrapWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type MailtrapPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMailtrapPlugin['hooks'];
	webhookHooks?: InternalMailtrapPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailtrapEndpointsNested>;
};

export type MailtrapContext = CorsairPluginContext<
	typeof MailtrapSchema,
	MailtrapPluginOptions
>;

export type MailtrapKeyBuilderContext =
	KeyBuilderContext<MailtrapPluginOptions>;

export type MailtrapBoundEndpoints = BindEndpoints<
	typeof mailtrapEndpointsNested
>;

type MailtrapEndpoint<K extends keyof MailtrapEndpointOutputs> =
	CorsairEndpoint<
		MailtrapContext,
		MailtrapEndpointInputs[K],
		MailtrapEndpointOutputs[K]
	>;

export type MailtrapEndpoints = {
	exampleGet: MailtrapEndpoint<'exampleGet'>;
};

type MailtrapWebhook<
	K extends keyof MailtrapWebhookOutputs,
	TEvent,
> = CorsairWebhook<MailtrapContext, TEvent, MailtrapWebhookOutputs[K]>;

export type MailtrapWebhooks = {
	example: MailtrapWebhook<'example', ExampleEvent>;
};

export type MailtrapBoundWebhooks = BindWebhooks<MailtrapWebhooks>;

const mailtrapEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const mailtrapWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const mailtrapEndpointSchemas = {
	'example.get': {
		input: MailtrapEndpointInputSchemas.exampleGet,
		output: MailtrapEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailtrapEndpointsNested
>;

const mailtrapWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof mailtrapWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mailtrapEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mailtrapEndpointsNested>;

export const mailtrapAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMailtrapPlugin<T extends MailtrapPluginOptions> = CorsairPlugin<
	'mailtrap',
	typeof MailtrapSchema,
	typeof mailtrapEndpointsNested,
	typeof mailtrapWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMailtrapPlugin = BaseMailtrapPlugin<MailtrapPluginOptions>;

export type ExternalMailtrapPlugin<T extends MailtrapPluginOptions> =
	BaseMailtrapPlugin<T>;

export function mailtrap<const T extends MailtrapPluginOptions>(
	incomingOptions: MailtrapPluginOptions & T = {} as MailtrapPluginOptions & T,
): ExternalMailtrapPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailtrap',
		authConfig: mailtrapAuthConfig,
		schema: MailtrapSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mailtrapEndpointsNested,
		webhooks: mailtrapWebhooksNested,
		endpointMeta: mailtrapEndpointMeta,
		endpointSchemas: mailtrapEndpointSchemas,
		webhookSchemas: mailtrapWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-mailtrap-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMailtrapTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMailtrapOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailtrapKeyBuilderContext, source) => {
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
	} satisfies InternalMailtrapPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	MailtrapEndpointInputs,
	MailtrapEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	MailtrapWebhookOutputs,
} from './webhooks/types';
