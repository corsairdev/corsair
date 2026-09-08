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
import { Account, ContactLists, Contacts, Sms, Voice } from './endpoints';
import type {
	ClickSendEndpointInputs,
	ClickSendEndpointOutputs,
} from './endpoints/types';
import {
	ClickSendEndpointInputSchemas,
	ClickSendEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClickSendSchema } from './schema';
import { SmsWebhooks } from './webhooks';
import { matchClickSendTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ClickSendWebhookOutputs,
	DeliveryReceiptEvent,
	InboundSmsEvent,
} from './webhooks/types';
import {
	DeliveryReceiptEventSchema,
	InboundSmsEventSchema,
} from './webhooks/types';

// ── Auth Config ───────────────────────────────────────────────────────────────

export const clicksendAuthConfig = {
	api_key: {
		account: ['username'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type ClickSendPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** ClickSend API Key (or username:apiKey combo) */
	key?: string;
	/** ClickSend API Key */
	apiKey?: string;
	/** ClickSend Username */
	username?: string;
	/** Webhook secret / auth token for webhook verification */
	webhookSecret?: string;
	hooks?: InternalClickSendPlugin['hooks'];
	webhookHooks?: InternalClickSendPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the ClickSend plugin.
	 * Controls what the AI agent is allowed to do.
	 */
	permissions?: PluginPermissionsConfig<typeof clickSendEndpointsNested>;
};

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type ClickSendContext = CorsairPluginContext<
	typeof ClickSendSchema,
	ClickSendPluginOptions,
	undefined,
	typeof clicksendAuthConfig
>;

export type ClickSendKeyBuilderContext = KeyBuilderContext<
	ClickSendPluginOptions,
	typeof clicksendAuthConfig
>;

// ── Endpoint Types ────────────────────────────────────────────────────

type ClickSendEndpoint<K extends keyof ClickSendEndpointOutputs> =
	CorsairEndpoint<
		ClickSendContext,
		ClickSendEndpointInputs[K],
		ClickSendEndpointOutputs[K]
	>;

export type ClickSendEndpoints = {
	accountGet: ClickSendEndpoint<'accountGet'>;
	smsSend: ClickSendEndpoint<'smsSend'>;
	smsHistory: ClickSendEndpoint<'smsHistory'>;
	smsInbound: ClickSendEndpoint<'smsInbound'>;
	smsReceipts: ClickSendEndpoint<'smsReceipts'>;
	voiceSend: ClickSendEndpoint<'voiceSend'>;
	voiceHistory: ClickSendEndpoint<'voiceHistory'>;
	contactListsGetAll: ClickSendEndpoint<'contactListsGetAll'>;
	contactListsCreate: ClickSendEndpoint<'contactListsCreate'>;
	contactsCreate: ClickSendEndpoint<'contactsCreate'>;
	contactsList: ClickSendEndpoint<'contactsList'>;
};

export type ClickSendBoundEndpoints = BindEndpoints<
	typeof clickSendEndpointsNested
>;

// ── Webhook Types ─────────────────────────────────────────────────────────────

type ClickSendWebhook<
	K extends keyof ClickSendWebhookOutputs,
	TEvent,
> = CorsairWebhook<ClickSendContext, TEvent, ClickSendWebhookOutputs[K]>;

export type ClickSendWebhooks = {
	inboundSms: ClickSendWebhook<'inboundSms', InboundSmsEvent>;
	deliveryReceipt: ClickSendWebhook<'deliveryReceipt', DeliveryReceiptEvent>;
};

export type ClickSendBoundWebhooks = BindWebhooks<ClickSendWebhooks>;

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const clickSendEndpointsNested = {
	account: {
		get: Account.get,
	},
	sms: {
		send: Sms.send,
		history: Sms.history,
		inbound: Sms.inbound,
		receipts: Sms.receipts,
	},
	voice: {
		send: Voice.send,
		history: Voice.history,
	},
	contactLists: {
		getAll: ContactLists.getAll,
		create: ContactLists.create,
	},
	contacts: {
		create: Contacts.create,
		list: Contacts.list,
	},
} as const;

const clickSendWebhooksNested = {
	sms: {
		inbound: SmsWebhooks.inbound,
		deliveryReceipt: SmsWebhooks.deliveryReceipt,
	},
} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const clickSendEndpointSchemas = {
	'account.get': {
		input: ClickSendEndpointInputSchemas.accountGet,
		output: ClickSendEndpointOutputSchemas.accountGet,
	},
	'sms.send': {
		input: ClickSendEndpointInputSchemas.smsSend,
		output: ClickSendEndpointOutputSchemas.smsSend,
	},
	'sms.history': {
		input: ClickSendEndpointInputSchemas.smsHistory,
		output: ClickSendEndpointOutputSchemas.smsHistory,
	},
	'sms.inbound': {
		input: ClickSendEndpointInputSchemas.smsInbound,
		output: ClickSendEndpointOutputSchemas.smsInbound,
	},
	'sms.receipts': {
		input: ClickSendEndpointInputSchemas.smsReceipts,
		output: ClickSendEndpointOutputSchemas.smsReceipts,
	},
	'voice.send': {
		input: ClickSendEndpointInputSchemas.voiceSend,
		output: ClickSendEndpointOutputSchemas.voiceSend,
	},
	'voice.history': {
		input: ClickSendEndpointInputSchemas.voiceHistory,
		output: ClickSendEndpointOutputSchemas.voiceHistory,
	},
	'contactLists.getAll': {
		input: ClickSendEndpointInputSchemas.contactListsGetAll,
		output: ClickSendEndpointOutputSchemas.contactListsGetAll,
	},
	'contactLists.create': {
		input: ClickSendEndpointInputSchemas.contactListsCreate,
		output: ClickSendEndpointOutputSchemas.contactListsCreate,
	},
	'contacts.create': {
		input: ClickSendEndpointInputSchemas.contactsCreate,
		output: ClickSendEndpointOutputSchemas.contactsCreate,
	},
	'contacts.list': {
		input: ClickSendEndpointInputSchemas.contactsList,
		output: ClickSendEndpointOutputSchemas.contactsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clickSendEndpointsNested
>;

// ── Webhook Schemas ───────────────────────────────────────────────────────────

const clickSendWebhookSchemas = {
	'sms.inbound': {
		description: 'An incoming SMS message was received by ClickSend',
		payload: InboundSmsEventSchema,
		response: InboundSmsEventSchema,
	},
	'sms.deliveryReceipt': {
		description: 'A delivery receipt update was received for an SMS message',
		payload: DeliveryReceiptEventSchema,
		response: DeliveryReceiptEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof clickSendWebhooksNested
>;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const clickSendEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Retrieve ClickSend account details and credit balance',
	},
	'sms.send': {
		riskLevel: 'write',
		description: 'Send one or more SMS messages',
	},
	'sms.history': {
		riskLevel: 'read',
		description: 'List sent SMS message history with pagination',
	},
	'sms.inbound': {
		riskLevel: 'read',
		description: 'List received inbound SMS messages with pagination',
	},
	'sms.receipts': {
		riskLevel: 'read',
		description: 'List SMS delivery receipts with pagination',
	},
	'voice.send': {
		riskLevel: 'write',
		description: 'Initiate outbound text-to-speech voice call',
	},
	'voice.history': {
		riskLevel: 'read',
		description: 'List voice call history with pagination',
	},
	'contactLists.getAll': {
		riskLevel: 'read',
		description: 'Retrieve all contact lists with pagination',
	},
	'contactLists.create': {
		riskLevel: 'write',
		description: 'Create a new contact list',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Add a new contact to a specific list',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts within a specific contact list',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof clickSendEndpointsNested
>;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const;

export type BaseClickSendPlugin<T extends ClickSendPluginOptions> =
	CorsairPlugin<
		'clicksend',
		typeof ClickSendSchema,
		typeof clickSendEndpointsNested,
		typeof clickSendWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof clicksendAuthConfig
	>;

export type InternalClickSendPlugin =
	BaseClickSendPlugin<ClickSendPluginOptions>;

export type ExternalClickSendPlugin<T extends ClickSendPluginOptions> =
	BaseClickSendPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function clicksend<const T extends ClickSendPluginOptions>(
	incomingOptions: ClickSendPluginOptions & T = {} as ClickSendPluginOptions &
		T,
): ExternalClickSendPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		key:
			incomingOptions.key ??
			(incomingOptions.username && incomingOptions.apiKey
				? `${incomingOptions.username}:${incomingOptions.apiKey}`
				: incomingOptions.apiKey),
	};
	return {
		id: 'clicksend',
		schema: ClickSendSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: clickSendEndpointsNested,
		webhooks: clickSendWebhooksNested,
		authConfig: clicksendAuthConfig,
		endpointMeta: clickSendEndpointMeta,
		endpointSchemas: clickSendEndpointSchemas,
		webhookSchemas: clickSendWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return (
				'x-clicksend-token' in request.headers ||
				'x-webhook-secret' in request.headers ||
				(typeof request.body === 'object' &&
					request.body !== null &&
					('message_id' in (request.body as Record<string, unknown>) ||
						('from' in (request.body as Record<string, unknown>) &&
							'to' in (request.body as Record<string, unknown>))))
			);
		},
		pluginTenantWebhookMatcher: matchClickSendTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClickSendKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) {
					return options.webhookSecret;
				}
				if (options.apiKey) {
					return options.apiKey;
				}
				if (options.key) {
					return options.key;
				}
				try {
					const webhookSig = await ctx.keys.get_webhook_signature();
					if (webhookSig) {
						return webhookSig;
					}
				} catch {
					// Fallback when no account DEK in test context
				}
				if (ctx.authType === 'api_key') {
					try {
						const apiKey = await ctx.keys.get_api_key();
						return apiKey ?? '';
					} catch {
						return '';
					}
				}
				return '';
			}

			if (source === 'endpoint' && options.apiKey) {
				return options.apiKey;
			}
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				try {
					const res = await ctx.keys.get_api_key();
					return res ?? '';
				} catch {
					return '';
				}
			}

			return '';
		},
	} satisfies InternalClickSendPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ClickSendWebhookOutputs,
	DeliveryReceiptEvent,
	InboundSmsEvent,
} from './webhooks/types';

export { verifyClickSendWebhookSignature } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AccountGetInput,
	AccountGetResponse,
	ClickSendEndpointInputs,
	ClickSendEndpointOutputs,
	ContactListsCreateInput,
	ContactListsCreateResponse,
	ContactListsGetAllInput,
	ContactListsGetAllResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsListInput,
	ContactsListResponse,
	SmsHistoryInput,
	SmsHistoryResponse,
	SmsInboundInput,
	SmsInboundResponse,
	SmsMessageInput,
	SmsReceiptsInput,
	SmsReceiptsResponse,
	SmsSendInput,
	SmsSendResponse,
	VoiceHistoryInput,
	VoiceHistoryResponse,
	VoiceMessageInput,
	VoiceSendInput,
	VoiceSendResponse,
} from './endpoints/types';
