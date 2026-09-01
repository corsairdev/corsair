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
import { Contacts, Lists, Mail, Senders, Suppressions } from './endpoints';
import type {
	SendGridEndpointInputs,
	SendGridEndpointOutputs,
} from './endpoints/types';
import {
	SendGridEndpointInputSchemas,
	SendGridEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SendGridSchema } from './schema';
import { EventWebhooks } from './webhooks';
import { resolveSendGridOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchSendGridTenantWebhook } from './webhooks/tenant-matcher';
import type { SendGridEvent, SendGridWebhookOutputs } from './webhooks/types';
import { EmailEventWebhookSchema } from './webhooks/types';

export type SendGridPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSendGridPlugin['hooks'];
	webhookHooks?: InternalSendGridPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sendGridEndpointsNested>;
};

export type SendGridContext = CorsairPluginContext<
	typeof SendGridSchema,
	SendGridPluginOptions
>;

export type SendGridKeyBuilderContext =
	KeyBuilderContext<SendGridPluginOptions>;

export type SendGridBoundEndpoints = BindEndpoints<
	typeof sendGridEndpointsNested
>;

type SendGridEndpoint<K extends keyof SendGridEndpointOutputs> =
	CorsairEndpoint<
		SendGridContext,
		SendGridEndpointInputs[K],
		SendGridEndpointOutputs[K]
	>;

export type SendGridEndpoints = {
	mailSend: SendGridEndpoint<'mailSend'>;
	contactsAddOrUpdate: SendGridEndpoint<'contactsAddOrUpdate'>;
	listsGetAll: SendGridEndpoint<'listsGetAll'>;
	listsCreate: SendGridEndpoint<'listsCreate'>;
	suppressionsGetBounces: SendGridEndpoint<'suppressionsGetBounces'>;
	sendersGetAll: SendGridEndpoint<'sendersGetAll'>;
};

type SendGridWebhook<
	K extends keyof SendGridWebhookOutputs,
	TEvent,
> = CorsairWebhook<SendGridContext, TEvent, SendGridWebhookOutputs[K]>;

export type SendGridWebhooks = {
	emailEvent: SendGridWebhook<'emailEvent', SendGridEvent>;
};

export type SendGridBoundWebhooks = BindWebhooks<SendGridWebhooks>;

const sendGridEndpointsNested = {
	mail: {
		send: Mail.send,
	},
	contacts: {
		addOrUpdate: Contacts.addOrUpdate,
	},
	lists: {
		getAll: Lists.getAll,
		create: Lists.create,
	},
	suppressions: {
		getBounces: Suppressions.getBounces,
	},
	senders: {
		getAll: Senders.getAll,
	},
} as const;

const sendGridWebhooksNested = {
	events: {
		emailEvent: EventWebhooks.emailEvent,
	},
} as const;

export const sendGridEndpointSchemas = {
	'mail.send': {
		input: SendGridEndpointInputSchemas.mailSend,
		output: SendGridEndpointOutputSchemas.mailSend,
	},
	'contacts.addOrUpdate': {
		input: SendGridEndpointInputSchemas.contactsAddOrUpdate,
		output: SendGridEndpointOutputSchemas.contactsAddOrUpdate,
	},
	'lists.getAll': {
		input: SendGridEndpointInputSchemas.listsGetAll,
		output: SendGridEndpointOutputSchemas.listsGetAll,
	},
	'lists.create': {
		input: SendGridEndpointInputSchemas.listsCreate,
		output: SendGridEndpointOutputSchemas.listsCreate,
	},
	'suppressions.getBounces': {
		input: SendGridEndpointInputSchemas.suppressionsGetBounces,
		output: SendGridEndpointOutputSchemas.suppressionsGetBounces,
	},
	'senders.getAll': {
		input: SendGridEndpointInputSchemas.sendersGetAll,
		output: SendGridEndpointOutputSchemas.sendersGetAll,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sendGridEndpointsNested
>;

const sendGridWebhookSchemas = {
	'events.emailEvent': {
		description: 'SendGrid email event webhook notification',
		payload: EmailEventWebhookSchema,
		response: EmailEventWebhookSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof sendGridWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const sendGridEndpointMeta = {
	'mail.send': {
		riskLevel: 'write',
		description: 'Send an email via SendGrid Mail Send API v3',
	},
	'contacts.addOrUpdate': {
		riskLevel: 'write',
		description: 'Add or update contacts in SendGrid Marketing',
	},
	'lists.getAll': {
		riskLevel: 'read',
		description: 'Retrieve all marketing contact lists',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a new marketing contact list',
	},
	'suppressions.getBounces': {
		riskLevel: 'read',
		description: 'Retrieve email bounce suppressions',
	},
	'senders.getAll': {
		riskLevel: 'read',
		description: 'Retrieve verified senders',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof sendGridEndpointsNested>;

export const sendGridAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSendGridPlugin<T extends SendGridPluginOptions> = CorsairPlugin<
	'sendgrid',
	typeof SendGridSchema,
	typeof sendGridEndpointsNested,
	typeof sendGridWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSendGridPlugin = BaseSendGridPlugin<SendGridPluginOptions>;

export type ExternalSendGridPlugin<T extends SendGridPluginOptions> =
	BaseSendGridPlugin<T>;

export function sendgrid<const T extends SendGridPluginOptions>(
	incomingOptions: SendGridPluginOptions & T = {} as SendGridPluginOptions & T,
): ExternalSendGridPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sendgrid',
		authConfig: sendGridAuthConfig,
		schema: SendGridSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: sendGridEndpointsNested,
		webhooks: sendGridWebhooksNested,
		endpointMeta: sendGridEndpointMeta,
		endpointSchemas: sendGridEndpointSchemas,
		webhookSchemas: sendGridWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-twilio-email-event-webhook-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchSendGridTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSendGridOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SendGridKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalSendGridPlugin;
}

export type {
	ContactsAddOrUpdateInput,
	ContactsAddOrUpdateOutput,
	ListsCreateInput,
	ListsCreateOutput,
	ListsGetAllInput,
	ListsGetAllOutput,
	MailSendInput,
	MailSendOutput,
	SendersGetAllInput,
	SendersGetAllOutput,
	SendGridEndpointInputs,
	SendGridEndpointOutputs,
	SuppressionsGetBouncesInput,
	SuppressionsGetBouncesOutput,
} from './endpoints/types';
export type {
	SendGridEvent,
	SendGridWebhookOutputs,
} from './webhooks/types';
