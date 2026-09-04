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
import { ContactWebhooks } from './webhooks';
import type {
	WisepopsWebhookOutputs,
	WisepopsWebhookPayload,
} from './webhooks/types';
import { getHeader, WisepopsWebhookPayloadSchema } from './webhooks/types';

export type WisepopsPluginOptions = {
	authType?: PickAuth<'api_key'>;
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
	TEvent = WisepopsWebhookPayload,
> = CorsairWebhook<WisepopsContext, TEvent, WisepopsWebhookOutputs[K]>;

export type WisepopsWebhooks = {
	collected: WisepopsWebhook<'collected'>;
	email: WisepopsWebhook<'email'>;
	phone: WisepopsWebhook<'phone'>;
	survey: WisepopsWebhook<'survey'>;
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
	contacts: {
		collected: ContactWebhooks.collected,
		email: ContactWebhooks.email,
		phone: ContactWebhooks.phone,
		survey: ContactWebhooks.survey,
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
	'contacts.collected': {
		description: 'A contact was collected via a Wisepops campaign',
		payload: WisepopsWebhookPayloadSchema,
		response: WisepopsWebhookPayloadSchema,
	},
	'contacts.email': {
		description: 'An email signup lead was collected via a Wisepops campaign',
		payload: WisepopsWebhookPayloadSchema,
		response: WisepopsWebhookPayloadSchema,
	},
	'contacts.phone': {
		description: 'A phone number lead was collected via a Wisepops campaign',
		payload: WisepopsWebhookPayloadSchema,
		response: WisepopsWebhookPayloadSchema,
	},
	'contacts.survey': {
		description: 'A survey response was collected via a Wisepops campaign',
		payload: WisepopsWebhookPayloadSchema,
		response: WisepopsWebhookPayloadSchema,
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
	api_key: {},
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
			return getHeader(request.headers, 'x-wisepops-signature') !== undefined;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WisepopsKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook' && options.key) {
				return options.key;
			}

			if (source === 'webhook') {
				const webhookSigKey = await (ctx.keys as any).get_webhook_signature?.();
				if (webhookSigKey) {
					return webhookSigKey;
				}
				const apiKey = await ctx.keys.get_api_key?.();
				return apiKey ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalWisepopsPlugin;
}

export {
	makeWisepopsRequest,
	WISEPOPS_API_BASE,
	WisepopsAPIError,
} from './client';
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
export {
	ContactsGetInputSchema,
	ContactsGetResponseSchema,
	DataPrivacyDeleteInputSchema,
	DataPrivacyDeleteResponseSchema,
	PerformanceGetInputSchema,
	PerformanceGetResponseSchema,
	WebhookCreateInputSchema,
	WebhookCreateResponseSchema,
	WebhookDeleteInputSchema,
	WebhookDeleteResponseSchema,
	WisepopsEndpointInputSchemas,
	WisepopsEndpointOutputSchemas,
} from './endpoints/types';
export { WisepopsSchema } from './schema';
export type {
	WisepopsWebhookContact,
	WisepopsWebhookOutputs,
	WisepopsWebhookPayload,
} from './webhooks';
export {
	ContactWebhooks,
	createWisepopsMatch,
	detectWisepopsEventType,
	verifyWisepopsWebhookSignature,
	WisepopsWebhookContactSchema,
	WisepopsWebhookPayloadSchema,
} from './webhooks';
