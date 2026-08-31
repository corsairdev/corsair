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
import { Contacts, DataPrivacy, Performance, Webhooks } from './endpoints';
import type {
	WisepopsEndpointInputs,
	WisepopsEndpointOutputs,
} from './endpoints/types';
import {
	WisepopsEndpointInputSchemas,
	WisepopsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WisepopsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveWisepopsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchWisepopsTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, WisepopsWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type WisepopsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWisepopsPlugin['hooks'];
	webhookHooks?: InternalWisepopsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wisepopsEndpointsNested>;
};

export type WisepopsContext = CorsairPluginContext<
	typeof WisepopsSchema,
	WisepopsPluginOptions
>;

export type WisepopsKeyBuilderContext =
	KeyBuilderContext<WisepopsPluginOptions>;

export type WisepopsBoundEndpoints = BindEndpoints<
	typeof wisepopsEndpointsNested
>;

type WisepopsEndpoint<K extends keyof WisepopsEndpointOutputs> =
	CorsairEndpoint<
		WisepopsContext,
		WisepopsEndpointInputs[K],
		WisepopsEndpointOutputs[K]
	>;

export type WisepopsEndpoints = {
	contactsGet: WisepopsEndpoint<'contactsGet'>;
	performanceGet: WisepopsEndpoint<'performanceGet'>;
	webhookCreate: WisepopsEndpoint<'webhookCreate'>;
	webhookDelete: WisepopsEndpoint<'webhookDelete'>;
	dataPrivacyDelete: WisepopsEndpoint<'dataPrivacyDelete'>;
};

type WisepopsWebhook<
	K extends keyof WisepopsWebhookOutputs,
	TEvent,
> = CorsairWebhook<WisepopsContext, TEvent, WisepopsWebhookOutputs[K]>;

export type WisepopsWebhooks = {
	example: WisepopsWebhook<'example', ExampleEvent>;
};

export type WisepopsBoundWebhooks = BindWebhooks<WisepopsWebhooks>;

const wisepopsEndpointsNested = {
	contacts: {
		get: Contacts.get,
	},
	performance: {
		get: Performance.get,
	},
	webhook: {
		create: Webhooks.createWebhook,
		delete: Webhooks.deleteWebhook,
	},
	dataPrivacy: {
		delete: DataPrivacy.deleteData,
	},
} as const;

const wisepopsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const wisepopsEndpointSchemas = {
	'contacts.get': {
		input: WisepopsEndpointInputSchemas.contactsGet,
		output: WisepopsEndpointOutputSchemas.contactsGet,
	},
	'performance.get': {
		input: WisepopsEndpointInputSchemas.performanceGet,
		output: WisepopsEndpointOutputSchemas.performanceGet,
	},
	'webhook.create': {
		input: WisepopsEndpointInputSchemas.webhookCreate,
		output: WisepopsEndpointOutputSchemas.webhookCreate,
	},
	'webhook.delete': {
		input: WisepopsEndpointInputSchemas.webhookDelete,
		output: WisepopsEndpointOutputSchemas.webhookDelete,
	},
	'dataPrivacy.delete': {
		input: WisepopsEndpointInputSchemas.dataPrivacyDelete,
		output: WisepopsEndpointOutputSchemas.dataPrivacyDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof wisepopsEndpointsNested
>;

const wisepopsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof wisepopsWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const wisepopsEndpointMeta = {
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve Collected Contacts',
	},
	'performance.get': {
		riskLevel: 'read',
		description: 'Get Performance Data',
	},
	'webhook.create': {
		riskLevel: 'write',
		description: 'Create Webhook',
	},
	'webhook.delete': {
		riskLevel: 'write',
		description: 'Delete Webhook',
	},
	'dataPrivacy.delete': {
		riskLevel: 'write',
		description: 'Delete User Data',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wisepopsEndpointsNested>;

export const wisepopsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWisepopsPlugin<T extends WisepopsPluginOptions> = CorsairPlugin<
	'wisepops',
	typeof WisepopsSchema,
	typeof wisepopsEndpointsNested,
	typeof wisepopsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWisepopsPlugin = BaseWisepopsPlugin<WisepopsPluginOptions>;

export type ExternalWisepopsPlugin<T extends WisepopsPluginOptions> =
	BaseWisepopsPlugin<T>;

export function wisepops<const T extends WisepopsPluginOptions>(
	incomingOptions: WisepopsPluginOptions & T = {} as WisepopsPluginOptions & T,
): ExternalWisepopsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wisepops',
		authConfig: wisepopsAuthConfig,
		schema: WisepopsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: wisepopsEndpointsNested,
		webhooks: wisepopsWebhooksNested,
		endpointMeta: wisepopsEndpointMeta,
		endpointSchemas: wisepopsEndpointSchemas,
		webhookSchemas: wisepopsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-wisepops-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchWisepopsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWisepopsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WisepopsKeyBuilderContext, source) => {
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
	} satisfies InternalWisepopsPlugin;
}

export type {
	ContactsGetInput,
	ContactsGetResponse,
	DataPrivacyDeleteInput,
	DataPrivacyDeleteResponse,
	PerformanceGetInput,
	PerformanceGetResponse,
	WebhookCreateInput,
	WebhookCreateResponse,
	WebhookDeleteInput,
	WebhookDeleteResponse,
	WisepopsEndpointInputs,
	WisepopsEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	WisepopsWebhookOutputs,
} from './webhooks/types';
