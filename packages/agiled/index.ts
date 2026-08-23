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
import { Contacts } from './endpoints';
import type {
	AgiledEndpointInputs,
	AgiledEndpointOutputs,
} from './endpoints/types';
import {
	AgiledEndpointInputSchemas,
	AgiledEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AgiledSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAgiledOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAgiledTenantWebhook } from './webhooks/tenant-matcher';
import type { AgiledWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AgiledPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAgiledPlugin['hooks'];
	webhookHooks?: InternalAgiledPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agiledEndpointsNested>;
};

export type AgiledContext = CorsairPluginContext<
	typeof AgiledSchema,
	AgiledPluginOptions
>;

export type AgiledKeyBuilderContext = KeyBuilderContext<AgiledPluginOptions>;

export type AgiledBoundEndpoints = BindEndpoints<typeof agiledEndpointsNested>;

type AgiledEndpoint<K extends keyof AgiledEndpointOutputs> = CorsairEndpoint<
	AgiledContext,
	AgiledEndpointInputs[K],
	AgiledEndpointOutputs[K]
>;

export type AgiledEndpoints = {
	listContacts: AgiledEndpoint<'listContacts'>;
};

type AgiledWebhook<
	K extends keyof AgiledWebhookOutputs,
	TEvent,
> = CorsairWebhook<AgiledContext, TEvent, AgiledWebhookOutputs[K]>;

export type AgiledWebhooks = {
	example: AgiledWebhook<'example', ExampleEvent>;
};

export type AgiledBoundWebhooks = BindWebhooks<AgiledWebhooks>;

const agiledEndpointsNested = {
	contacts: {
		list: Contacts.list,
	},
} as const;

const agiledWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const agiledEndpointSchemas = {
	'contacts.list': {
		input: AgiledEndpointInputSchemas.listContacts,
		output: AgiledEndpointOutputSchemas.listContacts,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof agiledEndpointsNested
>;

const agiledWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof agiledWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const agiledEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description: 'Get an list of contacts from agiled ',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof agiledEndpointsNested>;

export const agiledAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgiledPlugin<T extends AgiledPluginOptions> = CorsairPlugin<
	'agiled',
	typeof AgiledSchema,
	typeof agiledEndpointsNested,
	typeof agiledWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAgiledPlugin = BaseAgiledPlugin<AgiledPluginOptions>;

export type ExternalAgiledPlugin<T extends AgiledPluginOptions> =
	BaseAgiledPlugin<T>;

export function agiled<const T extends AgiledPluginOptions>(
	incomingOptions: AgiledPluginOptions & T = {} as AgiledPluginOptions & T,
): ExternalAgiledPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agiled',
		authConfig: agiledAuthConfig,
		schema: AgiledSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: agiledEndpointsNested,
		webhooks: agiledWebhooksNested,
		endpointMeta: agiledEndpointMeta,
		endpointSchemas: agiledEndpointSchemas,
		webhookSchemas: agiledWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-agiled-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAgiledTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAgiledOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgiledKeyBuilderContext, source) => {
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
	} satisfies InternalAgiledPlugin;
}

export type {
	AgiledEndpointInputs,
	AgiledEndpointOutputs,
	ListContactsInput,
	ListContactsResponse,
} from './endpoints/types';
export type {
	AgiledWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
