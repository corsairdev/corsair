import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
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

export type WisepopsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWisepopsPlugin['hooks'];
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
	{},
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
		endpoints: wisepopsEndpointsNested,
		webhooks: {},
		endpointMeta: wisepopsEndpointMeta,
		endpointSchemas: wisepopsEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WisepopsKeyBuilderContext, source) => {
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
	WisepopsWebhookPayload,
} from './webhooks';
export {
	verifyWisepopsWebhookSignature,
	WisepopsWebhookContactSchema,
	WisepopsWebhookPayloadSchema,
} from './webhooks';
