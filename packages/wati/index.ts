import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Contacts,
	Conversations,
	Messages,
	Templates,
	Webhooks,
	Workspace,
} from './endpoints';
import type {
	WatiEndpointInputs,
	WatiEndpointOutputs,
} from './endpoints/types';
import {
	WatiEndpointInputSchemas,
	WatiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WatiSchema } from './schema';

/** WATI has three regional hosts, and a token only works in its own. */
export type WatiRegionOption = 'global' | 'eu' | 'ksa';

export type WatiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The region the workspace lives in. A token is bound to its region, and
	 * nothing in the token says which, so this has to be configured.
	 */
	region?: WatiRegionOption;
	hooks?: InternalWatiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof watiEndpointsNested>;
};

export type WatiContext = CorsairPluginContext<
	typeof WatiSchema,
	WatiPluginOptions
>;

export type WatiKeyBuilderContext = KeyBuilderContext<WatiPluginOptions>;

export type WatiBoundEndpoints = BindEndpoints<typeof watiEndpointsNested>;

type WatiEndpoint<K extends keyof WatiEndpointOutputs> = CorsairEndpoint<
	WatiContext,
	WatiEndpointInputs[K],
	WatiEndpointOutputs[K]
>;

export type WatiEndpoints = {
	contactsCreate: WatiEndpoint<'contactsCreate'>;
	contactsGet: WatiEndpoint<'contactsGet'>;
	contactsList: WatiEndpoint<'contactsList'>;
	contactsCount: WatiEndpoint<'contactsCount'>;
	contactsDelete: WatiEndpoint<'contactsDelete'>;
	conversationsList: WatiEndpoint<'conversationsList'>;
	conversationsMessages: WatiEndpoint<'conversationsMessages'>;
	messagesSendText: WatiEndpoint<'messagesSendText'>;
	messagesSendTemplate: WatiEndpoint<'messagesSendTemplate'>;
	messagesSendFile: WatiEndpoint<'messagesSendFile'>;
	templatesList: WatiEndpoint<'templatesList'>;
	templatesGet: WatiEndpoint<'templatesGet'>;
	channelsList: WatiEndpoint<'channelsList'>;
	accountCredits: WatiEndpoint<'accountCredits'>;
	broadcastsList: WatiEndpoint<'broadcastsList'>;
	broadcastsGet: WatiEndpoint<'broadcastsGet'>;
	broadcastsRecipients: WatiEndpoint<'broadcastsRecipients'>;
	segmentsList: WatiEndpoint<'segmentsList'>;
	segmentsGet: WatiEndpoint<'segmentsGet'>;
	segmentsEvaluate: WatiEndpoint<'segmentsEvaluate'>;
	webhooksList: WatiEndpoint<'webhooksList'>;
	webhooksGet: WatiEndpoint<'webhooksGet'>;
	webhooksDelete: WatiEndpoint<'webhooksDelete'>;
};

const watiEndpointsNested = {
	contacts: {
		create: Contacts.create,
		get: Contacts.get,
		list: Contacts.list,
		count: Contacts.count,
		delete: Contacts.remove,
	},
	conversations: {
		list: Conversations.list,
		messages: Conversations.messages,
	},
	messages: {
		sendText: Messages.sendText,
		sendTemplate: Messages.sendTemplate,
		sendFile: Messages.sendFile,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
	},
	channels: {
		list: Workspace.channels,
	},
	account: {
		credits: Workspace.credits,
	},
	broadcasts: {
		list: Workspace.broadcasts,
		get: Workspace.broadcast,
		recipients: Workspace.recipients,
	},
	segments: {
		list: Workspace.segments,
		get: Workspace.segmentGet,
		evaluate: Workspace.evaluate,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		delete: Webhooks.remove,
	},
} as const;

export const watiEndpointSchemas = {
	'contacts.create': {
		input: WatiEndpointInputSchemas.contactsCreate,
		output: WatiEndpointOutputSchemas.contactsCreate,
	},
	'contacts.get': {
		input: WatiEndpointInputSchemas.contactsGet,
		output: WatiEndpointOutputSchemas.contactsGet,
	},
	'contacts.list': {
		input: WatiEndpointInputSchemas.contactsList,
		output: WatiEndpointOutputSchemas.contactsList,
	},
	'contacts.count': {
		input: WatiEndpointInputSchemas.contactsCount,
		output: WatiEndpointOutputSchemas.contactsCount,
	},
	'contacts.delete': {
		input: WatiEndpointInputSchemas.contactsDelete,
		output: WatiEndpointOutputSchemas.contactsDelete,
	},
	'conversations.list': {
		input: WatiEndpointInputSchemas.conversationsList,
		output: WatiEndpointOutputSchemas.conversationsList,
	},
	'conversations.messages': {
		input: WatiEndpointInputSchemas.conversationsMessages,
		output: WatiEndpointOutputSchemas.conversationsMessages,
	},
	'messages.sendText': {
		input: WatiEndpointInputSchemas.messagesSendText,
		output: WatiEndpointOutputSchemas.messagesSendText,
	},
	'messages.sendTemplate': {
		input: WatiEndpointInputSchemas.messagesSendTemplate,
		output: WatiEndpointOutputSchemas.messagesSendTemplate,
	},
	'messages.sendFile': {
		input: WatiEndpointInputSchemas.messagesSendFile,
		output: WatiEndpointOutputSchemas.messagesSendFile,
	},
	'templates.list': {
		input: WatiEndpointInputSchemas.templatesList,
		output: WatiEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: WatiEndpointInputSchemas.templatesGet,
		output: WatiEndpointOutputSchemas.templatesGet,
	},
	'channels.list': {
		input: WatiEndpointInputSchemas.channelsList,
		output: WatiEndpointOutputSchemas.channelsList,
	},
	'account.credits': {
		input: WatiEndpointInputSchemas.accountCredits,
		output: WatiEndpointOutputSchemas.accountCredits,
	},
	'broadcasts.list': {
		input: WatiEndpointInputSchemas.broadcastsList,
		output: WatiEndpointOutputSchemas.broadcastsList,
	},
	'broadcasts.get': {
		input: WatiEndpointInputSchemas.broadcastsGet,
		output: WatiEndpointOutputSchemas.broadcastsGet,
	},
	'broadcasts.recipients': {
		input: WatiEndpointInputSchemas.broadcastsRecipients,
		output: WatiEndpointOutputSchemas.broadcastsRecipients,
	},
	'segments.list': {
		input: WatiEndpointInputSchemas.segmentsList,
		output: WatiEndpointOutputSchemas.segmentsList,
	},
	'segments.get': {
		input: WatiEndpointInputSchemas.segmentsGet,
		output: WatiEndpointOutputSchemas.segmentsGet,
	},
	'segments.evaluate': {
		input: WatiEndpointInputSchemas.segmentsEvaluate,
		output: WatiEndpointOutputSchemas.segmentsEvaluate,
	},
	'webhooks.list': {
		input: WatiEndpointInputSchemas.webhooksList,
		output: WatiEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: WatiEndpointInputSchemas.webhooksGet,
		output: WatiEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.delete': {
		input: WatiEndpointInputSchemas.webhooksDelete,
		output: WatiEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof watiEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const watiEndpointMeta = {
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Add a contact by WhatsApp number, with a name and custom attributes as name/value pairs',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Read one contact by wa_id or phone number, including custom attributes and opt-in state',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'Page through contacts, 100 per page at most',
	},
	'contacts.count': {
		riskLevel: 'read',
		description: 'Count the contacts on the workspace',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a contact and their conversation history; this cannot be undone',
	},
	'conversations.list': {
		riskLevel: 'read',
		description:
			'List conversations newest first, filtered by channel type or channel',
	},
	'conversations.messages': {
		riskLevel: 'read',
		description:
			'Read the messages in one conversation; the target is a wa_id, phone number or conversation ID, not a bare contact ID',
	},
	'messages.sendText': {
		riskLevel: 'write',
		description:
			'Send a free-text message, which only works inside the 24-hour service window',
	},
	'messages.sendTemplate': {
		riskLevel: 'write',
		description:
			'Send an approved template with bound placeholders, optionally as a named campaign; the only route outside the service window',
	},
	'messages.sendFile': {
		riskLevel: 'write',
		description: 'Send a file from a public URL, with an optional caption',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List the message templates with their approval status',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one message template and its components',
	},
	'channels.list': {
		riskLevel: 'read',
		description: 'List the channels connected to the workspace',
	},
	'account.credits': {
		riskLevel: 'read',
		description: 'Read the workspace messaging credit balance',
	},
	'broadcasts.list': {
		riskLevel: 'read',
		description: 'List campaigns with their delivery counts',
	},
	'broadcasts.get': {
		riskLevel: 'read',
		description: 'Read one campaign',
	},
	'broadcasts.recipients': {
		riskLevel: 'read',
		description: 'Read per-recipient delivery outcomes for a campaign',
	},
	'segments.list': {
		riskLevel: 'read',
		description: 'List saved segments',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Read one saved segment',
	},
	'segments.evaluate': {
		riskLevel: 'read',
		description:
			'Evaluate a segment to see how many contacts match, without saving anything',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List webhook subscriptions; creating one still needs the V2 route, which this plugin does not wrap',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook subscription and its event list',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a webhook subscription, which stops delivery to that URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof watiEndpointsNested>;

export type BaseWatiPlugin<T extends WatiPluginOptions> = CorsairPlugin<
	'wati',
	typeof WatiSchema,
	typeof watiEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalWatiPlugin = BaseWatiPlugin<WatiPluginOptions>;

export type ExternalWatiPlugin<T extends WatiPluginOptions> = BaseWatiPlugin<T>;

export function wati<const T extends WatiPluginOptions>(
	incomingOptions: WatiPluginOptions & T = {} as WatiPluginOptions & T,
): ExternalWatiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wati',
		schema: WatiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: watiEndpointsNested,
		webhooks: {},
		endpointMeta: watiEndpointMeta,
		endpointSchemas: watiEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WatiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('wati', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWatiPlugin;
}

export type { WatiRegion } from './client';
export {
	isWatiFailure,
	segment,
	target,
	WATI_API_BASE,
	WATI_REGIONS,
	WatiAPIError,
} from './client';

export type {
	BroadcastResponse,
	BroadcastsGetInput,
	BroadcastsListInput,
	BroadcastsListResponse,
	BroadcastsRecipientsInput,
	BroadcastsRecipientsResponse,
	ChannelsListInput,
	ChannelsListResponse,
	ContactResponse,
	ContactsCountInput,
	ContactsCountResponse,
	ContactsCreateInput,
	ContactsDeleteInput,
	ContactsGetInput,
	ContactsListInput,
	ContactsListResponse,
	ConversationsListInput,
	ConversationsListResponse,
	ConversationsMessagesInput,
	ConversationsMessagesResponse,
	CreditsInput,
	CreditsResponse,
	DeleteResponse,
	MessagesSendFileInput,
	MessagesSendTemplateInput,
	MessagesSendTextInput,
	SegmentEvaluateResponse,
	SegmentResponse,
	SegmentsEvaluateInput,
	SegmentsGetInput,
	SegmentsListInput,
	SegmentsListResponse,
	SendResponse,
	TemplateResponse,
	TemplatesGetInput,
	TemplatesListInput,
	TemplatesListResponse,
	WatiBroadcast,
	WatiBroadcastRecipient,
	WatiChannel,
	WatiContact,
	WatiConversation,
	WatiEndpointInputs,
	WatiEndpointOutputs,
	WatiMessage,
	WatiSegment,
	WatiTemplate,
	WatiWebhook,
	WebhookResponse,
	WebhooksDeleteInput,
	WebhooksGetInput,
	WebhooksListInput,
	WebhooksListResponse,
} from './endpoints/types';
