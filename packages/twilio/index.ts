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
import { Calls, Messages } from './endpoints';
import type {
	TwilioEndpointInputs,
	TwilioEndpointOutputs,
} from './endpoints/types';
import {
	TwilioEndpointInputSchemas,
	TwilioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwilioSchema } from './schema';
import { CallWebhooks, MessageWebhooks } from './webhooks';
import { matchTwilioTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CallStatusEvent,
	MessageReceivedEvent,
	MessageStatusEvent,
	TwilioWebhookOutputs,
} from './webhooks/types';
import {
	CallStatusEventSchema,
	MessageReceivedEventSchema,
	MessageStatusEventSchema,
} from './webhooks/types';

// ── Auth Config ───────────────────────────────────────────────────────────────

export const twilioAuthConfig = {
	api_key: {
		account: ['accountSid'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type TwilioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Auth Token (used for both API auth and webhook signature verification) */
	key?: string;
	/** Twilio Account SID (required for constructing API paths) */
	accountSid?: string;
	/** Webhook secret (defaults to Auth Token if not set) */
	webhookSecret?: string;
	hooks?: InternalTwilioPlugin['hooks'];
	webhookHooks?: InternalTwilioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Twilio plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Twilio endpoint tree.
	 */
	permissions?: PluginPermissionsConfig<typeof twilioEndpointsNested>;
};

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type TwilioContext = CorsairPluginContext<
	typeof TwilioSchema,
	TwilioPluginOptions,
	undefined,
	typeof twilioAuthConfig
>;

export type TwilioKeyBuilderContext = KeyBuilderContext<
	TwilioPluginOptions,
	typeof twilioAuthConfig
>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

type TwilioEndpoint<K extends keyof TwilioEndpointOutputs> = CorsairEndpoint<
	TwilioContext,
	TwilioEndpointInputs[K],
	TwilioEndpointOutputs[K]
>;

export type TwilioEndpoints = {
	messagesSend: TwilioEndpoint<'messagesSend'>;
	messagesGet: TwilioEndpoint<'messagesGet'>;
	messagesList: TwilioEndpoint<'messagesList'>;
	callsCreate: TwilioEndpoint<'callsCreate'>;
	callsGet: TwilioEndpoint<'callsGet'>;
	callsList: TwilioEndpoint<'callsList'>;
};

export type TwilioBoundEndpoints = BindEndpoints<typeof twilioEndpointsNested>;

// ── Webhook Types ─────────────────────────────────────────────────────────────

type TwilioWebhook<
	K extends keyof TwilioWebhookOutputs,
	TEvent,
> = CorsairWebhook<TwilioContext, TEvent, TwilioWebhookOutputs[K]>;

export type TwilioWebhooks = {
	messageReceived: TwilioWebhook<'messageReceived', MessageReceivedEvent>;
	messageStatus: TwilioWebhook<'messageStatus', MessageStatusEvent>;
	callStatus: TwilioWebhook<'callStatus', CallStatusEvent>;
};

export type TwilioBoundWebhooks = BindWebhooks<TwilioWebhooks>;

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const twilioEndpointsNested = {
	messages: {
		send: Messages.send,
		get: Messages.get,
		list: Messages.list,
	},
	calls: {
		create: Calls.create,
		get: Calls.get,
		list: Calls.list,
	},
} as const;

const twilioWebhooksNested = {
	message: {
		received: MessageWebhooks.received,
		statusUpdate: MessageWebhooks.statusUpdate,
	},
	call: {
		statusUpdate: CallWebhooks.statusUpdate,
	},
} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const twilioEndpointSchemas = {
	'messages.send': {
		input: TwilioEndpointInputSchemas.messagesSend,
		output: TwilioEndpointOutputSchemas.messagesSend,
	},
	'messages.get': {
		input: TwilioEndpointInputSchemas.messagesGet,
		output: TwilioEndpointOutputSchemas.messagesGet,
	},
	'messages.list': {
		input: TwilioEndpointInputSchemas.messagesList,
		output: TwilioEndpointOutputSchemas.messagesList,
	},
	'calls.create': {
		input: TwilioEndpointInputSchemas.callsCreate,
		output: TwilioEndpointOutputSchemas.callsCreate,
	},
	'calls.get': {
		input: TwilioEndpointInputSchemas.callsGet,
		output: TwilioEndpointOutputSchemas.callsGet,
	},
	'calls.list': {
		input: TwilioEndpointInputSchemas.callsList,
		output: TwilioEndpointOutputSchemas.callsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof twilioEndpointsNested
>;

// ── Webhook Schemas ───────────────────────────────────────────────────────────

const twilioWebhookSchemas = {
	'message.received': {
		description: 'An incoming SMS/MMS message was received',
		payload: MessageReceivedEventSchema,
		response: MessageReceivedEventSchema,
	},
	'message.statusUpdate': {
		description:
			'A message delivery status changed (sent, delivered, failed, etc.)',
		payload: MessageStatusEventSchema,
		response: MessageStatusEventSchema,
	},
	'call.statusUpdate': {
		description:
			'A call status changed (ringing, in-progress, completed, etc.)',
		payload: CallStatusEventSchema,
		response: CallStatusEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof twilioWebhooksNested>;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const twilioEndpointMeta = {
	'messages.send': {
		riskLevel: 'write',
		description: 'Send an SMS or MMS message',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Retrieve a message by SID',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages with optional filters',
	},
	'calls.create': {
		riskLevel: 'write',
		description: 'Initiate an outbound phone call',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Retrieve a call record by SID',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List call records with optional filters',
	},
} satisfies RequiredPluginEndpointMeta<typeof twilioEndpointsNested>;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const;

export type BaseTwilioPlugin<T extends TwilioPluginOptions> = CorsairPlugin<
	'twilio',
	typeof TwilioSchema,
	typeof twilioEndpointsNested,
	typeof twilioWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof twilioAuthConfig
>;

export type InternalTwilioPlugin = BaseTwilioPlugin<TwilioPluginOptions>;

export type ExternalTwilioPlugin<T extends TwilioPluginOptions> =
	BaseTwilioPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function twilio<const T extends TwilioPluginOptions>(
	// Type assertion: empty object is a safe default because all TwilioPluginOptions fields are optional
	incomingOptions: TwilioPluginOptions & T = {} as TwilioPluginOptions & T,
): ExternalTwilioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'twilio',
		schema: TwilioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: twilioEndpointsNested,
		webhooks: twilioWebhooksNested,
		authConfig: twilioAuthConfig,
		endpointMeta: twilioEndpointMeta,
		endpointSchemas: twilioEndpointSchemas,
		webhookSchemas: twilioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return 'x-twilio-signature' in request.headers;
		},
		pluginTenantWebhookMatcher: matchTwilioTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TwilioKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) {
					return options.webhookSecret;
				}
				if (options.key) {
					return options.key;
				}
				const webhookSig = await ctx.keys.get_webhook_signature();
				if (webhookSig) {
					return webhookSig;
				}
				if (ctx.authType === 'api_key') {
					const apiKey = await ctx.keys.get_api_key();
					return apiKey ?? '';
				}
				return '';
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
	} satisfies InternalTwilioPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CallStatusEvent,
	MessageReceivedEvent,
	MessageStatusEvent,
	TwilioWebhookOutputs,
} from './webhooks/types';

export { verifyTwilioWebhookSignature } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CallsCreateInput,
	CallsCreateResponse,
	CallsGetInput,
	CallsGetResponse,
	CallsListInput,
	CallsListResponse,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListResponse,
	MessagesSendInput,
	MessagesSendResponse,
	TwilioEndpointInputs,
	TwilioEndpointOutputs,
} from './endpoints/types';
