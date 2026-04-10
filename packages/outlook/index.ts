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
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { getValidAccessToken } from './client';
import { Calendars, Contacts, Events, Folders, Messages } from './endpoints';
import type {
	OutlookEndpointInputs,
	OutlookEndpointOutputs,
} from './endpoints/types';
import {
	OutlookEndpointInputSchemas,
	OutlookEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OutlookSchema } from './schema';
import {
	ContactWebhooks,
	EventWebhooks,
	MessageWebhooks,
	ValidationWebhooks,
} from './webhooks';
import type {
	ContactCreatedEvent,
	EventChangedEvent,
	EventCreatedEvent,
	MessageReceivedEvent,
	MessageSentEvent,
	OutlookWebhookOutputs,
	OutlookWebhookPayload,
	SubscriptionValidationPayload,
} from './webhooks/types';
import {
	ContactCreatedEventSchema,
	EventChangedEventSchema,
	EventCreatedEventSchema,
	MessageReceivedEventSchema,
	MessageSentEventSchema,
	OutlookWebhookPayloadSchema,
	SubscriptionValidationPayloadSchema,
} from './webhooks/types';

export type OutlookPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalOutlookPlugin['hooks'];
	webhookHooks?: InternalOutlookPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Outlook plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Outlook endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof outlookEndpointsNested>;
};

export type OutlookContext = CorsairPluginContext<
	typeof OutlookSchema,
	OutlookPluginOptions
>;

export type OutlookKeyBuilderContext = KeyBuilderContext<OutlookPluginOptions>;

export type OutlookBoundEndpoints = BindEndpoints<
	typeof outlookEndpointsNested
>;

type OutlookEndpoint<
	K extends keyof OutlookEndpointOutputs,
	Input = OutlookEndpointInputs[K],
> = CorsairEndpoint<OutlookContext, Input, OutlookEndpointOutputs[K]>;

export type OutlookEndpoints = {
	messagesSend: OutlookEndpoint<'messagesSend'>;
	messagesCreateDraft: OutlookEndpoint<'messagesCreateDraft'>;
	messagesGet: OutlookEndpoint<'messagesGet'>;
	messagesList: OutlookEndpoint<'messagesList'>;
	messagesQuery: OutlookEndpoint<'messagesQuery'>;
	messagesSearch: OutlookEndpoint<'messagesSearch'>;
	messagesReply: OutlookEndpoint<'messagesReply'>;
	messagesForward: OutlookEndpoint<'messagesForward'>;
	messagesDelete: OutlookEndpoint<'messagesDelete'>;
	messagesMove: OutlookEndpoint<'messagesMove'>;
	messagesUpdate: OutlookEndpoint<'messagesUpdate'>;
	messagesSendDraft: OutlookEndpoint<'messagesSendDraft'>;
	messagesBatchMove: OutlookEndpoint<'messagesBatchMove'>;
	messagesBatchUpdate: OutlookEndpoint<'messagesBatchUpdate'>;
	messagesAddAttachment: OutlookEndpoint<'messagesAddAttachment'>;
	eventsCreate: OutlookEndpoint<'eventsCreate'>;
	eventsGet: OutlookEndpoint<'eventsGet'>;
	eventsList: OutlookEndpoint<'eventsList'>;
	eventsUpdate: OutlookEndpoint<'eventsUpdate'>;
	eventsDelete: OutlookEndpoint<'eventsDelete'>;
	eventsCancel: OutlookEndpoint<'eventsCancel'>;
	eventsDecline: OutlookEndpoint<'eventsDecline'>;
	eventsFindMeetingTimes: OutlookEndpoint<'eventsFindMeetingTimes'>;
	eventsGetSchedule: OutlookEndpoint<'eventsGetSchedule'>;
	calendarsCreate: OutlookEndpoint<'calendarsCreate'>;
	calendarsGet: OutlookEndpoint<'calendarsGet'>;
	calendarsList: OutlookEndpoint<'calendarsList'>;
	calendarsDelete: OutlookEndpoint<'calendarsDelete'>;
	contactsCreate: OutlookEndpoint<'contactsCreate'>;
	contactsList: OutlookEndpoint<'contactsList'>;
	contactsUpdate: OutlookEndpoint<'contactsUpdate'>;
	contactsDelete: OutlookEndpoint<'contactsDelete'>;
	foldersCreate: OutlookEndpoint<'foldersCreate'>;
	foldersGet: OutlookEndpoint<'foldersGet'>;
	foldersList: OutlookEndpoint<'foldersList'>;
	foldersUpdate: OutlookEndpoint<'foldersUpdate'>;
	foldersDelete: OutlookEndpoint<'foldersDelete'>;
};

type OutlookWebhook<
	K extends keyof OutlookWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	OutlookContext,
	OutlookWebhookPayload,
	OutlookWebhookOutputs[K]
>;

export type OutlookWebhooks = {
	messageReceived: OutlookWebhook<'messageReceived', MessageReceivedEvent>;
	messageSent: OutlookWebhook<'messageSent', MessageSentEvent>;
	eventCreated: OutlookWebhook<'eventCreated', EventCreatedEvent>;
	eventChanged: OutlookWebhook<'eventChanged', EventChangedEvent>;
	contactCreated: OutlookWebhook<'contactCreated', ContactCreatedEvent>;
	subscriptionValidation: CorsairWebhook<
		OutlookContext,
		SubscriptionValidationPayload,
		SubscriptionValidationPayload
	>;
};

export type OutlookBoundWebhooks = BindWebhooks<OutlookWebhooks>;

const outlookEndpointsNested = {
	messages: {
		send: Messages.send,
		createDraft: Messages.createDraft,
		get: Messages.get,
		list: Messages.list,
		query: Messages.query,
		search: Messages.search,
		reply: Messages.reply,
		forward: Messages.forward,
		delete: Messages.delete,
		move: Messages.move,
		update: Messages.update,
		sendDraft: Messages.sendDraft,
		batchMove: Messages.batchMove,
		batchUpdate: Messages.batchUpdate,
		addAttachment: Messages.addAttachment,
	},
	events: {
		create: Events.create,
		get: Events.get,
		list: Events.list,
		update: Events.update,
		delete: Events.delete,
		cancel: Events.cancel,
		decline: Events.decline,
		findMeetingTimes: Events.findMeetingTimes,
		getSchedule: Events.getSchedule,
	},
	calendars: {
		create: Calendars.create,
		get: Calendars.get,
		list: Calendars.list,
		delete: Calendars.delete,
	},
	contacts: {
		create: Contacts.create,
		list: Contacts.list,
		update: Contacts.update,
		delete: Contacts.delete,
	},
	folders: {
		create: Folders.create,
		get: Folders.get,
		list: Folders.list,
		update: Folders.update,
		delete: Folders.delete,
	},
} as const;

const outlookWebhooksNested = {
	messages: {
		newMessage: MessageWebhooks.newMessage,
		sentMessage: MessageWebhooks.sentMessage,
	},
	events: {
		newEvent: EventWebhooks.newEvent,
		eventChange: EventWebhooks.eventChange,
	},
	contacts: {
		newContact: ContactWebhooks.newContact,
	},
	subscriptionValidation: ValidationWebhooks.subscriptionValidation,
} as const;

export const outlookEndpointSchemas = {
	'messages.send': {
		input: OutlookEndpointInputSchemas.messagesSend,
		output: OutlookEndpointOutputSchemas.messagesSend,
	},
	'messages.createDraft': {
		input: OutlookEndpointInputSchemas.messagesCreateDraft,
		output: OutlookEndpointOutputSchemas.messagesCreateDraft,
	},
	'messages.get': {
		input: OutlookEndpointInputSchemas.messagesGet,
		output: OutlookEndpointOutputSchemas.messagesGet,
	},
	'messages.list': {
		input: OutlookEndpointInputSchemas.messagesList,
		output: OutlookEndpointOutputSchemas.messagesList,
	},
	'messages.query': {
		input: OutlookEndpointInputSchemas.messagesQuery,
		output: OutlookEndpointOutputSchemas.messagesQuery,
	},
	'messages.search': {
		input: OutlookEndpointInputSchemas.messagesSearch,
		output: OutlookEndpointOutputSchemas.messagesSearch,
	},
	'messages.reply': {
		input: OutlookEndpointInputSchemas.messagesReply,
		output: OutlookEndpointOutputSchemas.messagesReply,
	},
	'messages.forward': {
		input: OutlookEndpointInputSchemas.messagesForward,
		output: OutlookEndpointOutputSchemas.messagesForward,
	},
	'messages.delete': {
		input: OutlookEndpointInputSchemas.messagesDelete,
		output: OutlookEndpointOutputSchemas.messagesDelete,
	},
	'messages.move': {
		input: OutlookEndpointInputSchemas.messagesMove,
		output: OutlookEndpointOutputSchemas.messagesMove,
	},
	'messages.update': {
		input: OutlookEndpointInputSchemas.messagesUpdate,
		output: OutlookEndpointOutputSchemas.messagesUpdate,
	},
	'messages.sendDraft': {
		input: OutlookEndpointInputSchemas.messagesSendDraft,
		output: OutlookEndpointOutputSchemas.messagesSendDraft,
	},
	'messages.batchMove': {
		input: OutlookEndpointInputSchemas.messagesBatchMove,
		output: OutlookEndpointOutputSchemas.messagesBatchMove,
	},
	'messages.batchUpdate': {
		input: OutlookEndpointInputSchemas.messagesBatchUpdate,
		output: OutlookEndpointOutputSchemas.messagesBatchUpdate,
	},
	'messages.addAttachment': {
		input: OutlookEndpointInputSchemas.messagesAddAttachment,
		output: OutlookEndpointOutputSchemas.messagesAddAttachment,
	},
	'events.create': {
		input: OutlookEndpointInputSchemas.eventsCreate,
		output: OutlookEndpointOutputSchemas.eventsCreate,
	},
	'events.get': {
		input: OutlookEndpointInputSchemas.eventsGet,
		output: OutlookEndpointOutputSchemas.eventsGet,
	},
	'events.list': {
		input: OutlookEndpointInputSchemas.eventsList,
		output: OutlookEndpointOutputSchemas.eventsList,
	},
	'events.update': {
		input: OutlookEndpointInputSchemas.eventsUpdate,
		output: OutlookEndpointOutputSchemas.eventsUpdate,
	},
	'events.delete': {
		input: OutlookEndpointInputSchemas.eventsDelete,
		output: OutlookEndpointOutputSchemas.eventsDelete,
	},
	'events.cancel': {
		input: OutlookEndpointInputSchemas.eventsCancel,
		output: OutlookEndpointOutputSchemas.eventsCancel,
	},
	'events.decline': {
		input: OutlookEndpointInputSchemas.eventsDecline,
		output: OutlookEndpointOutputSchemas.eventsDecline,
	},
	'events.findMeetingTimes': {
		input: OutlookEndpointInputSchemas.eventsFindMeetingTimes,
		output: OutlookEndpointOutputSchemas.eventsFindMeetingTimes,
	},
	'events.getSchedule': {
		input: OutlookEndpointInputSchemas.eventsGetSchedule,
		output: OutlookEndpointOutputSchemas.eventsGetSchedule,
	},
	'calendars.create': {
		input: OutlookEndpointInputSchemas.calendarsCreate,
		output: OutlookEndpointOutputSchemas.calendarsCreate,
	},
	'calendars.get': {
		input: OutlookEndpointInputSchemas.calendarsGet,
		output: OutlookEndpointOutputSchemas.calendarsGet,
	},
	'calendars.list': {
		input: OutlookEndpointInputSchemas.calendarsList,
		output: OutlookEndpointOutputSchemas.calendarsList,
	},
	'calendars.delete': {
		input: OutlookEndpointInputSchemas.calendarsDelete,
		output: OutlookEndpointOutputSchemas.calendarsDelete,
	},
	'contacts.create': {
		input: OutlookEndpointInputSchemas.contactsCreate,
		output: OutlookEndpointOutputSchemas.contactsCreate,
	},
	'contacts.list': {
		input: OutlookEndpointInputSchemas.contactsList,
		output: OutlookEndpointOutputSchemas.contactsList,
	},
	'contacts.update': {
		input: OutlookEndpointInputSchemas.contactsUpdate,
		output: OutlookEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: OutlookEndpointInputSchemas.contactsDelete,
		output: OutlookEndpointOutputSchemas.contactsDelete,
	},
	'folders.create': {
		input: OutlookEndpointInputSchemas.foldersCreate,
		output: OutlookEndpointOutputSchemas.foldersCreate,
	},
	'folders.get': {
		input: OutlookEndpointInputSchemas.foldersGet,
		output: OutlookEndpointOutputSchemas.foldersGet,
	},
	'folders.list': {
		input: OutlookEndpointInputSchemas.foldersList,
		output: OutlookEndpointOutputSchemas.foldersList,
	},
	'folders.update': {
		input: OutlookEndpointInputSchemas.foldersUpdate,
		output: OutlookEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: OutlookEndpointInputSchemas.foldersDelete,
		output: OutlookEndpointOutputSchemas.foldersDelete,
	},
} satisfies RequiredPluginEndpointSchemas<typeof outlookEndpointsNested>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const outlookEndpointMeta = {
	'messages.send': { riskLevel: 'write', description: 'Send an email message' },
	'messages.createDraft': {
		riskLevel: 'write',
		description: 'Create an email draft',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Get an email message by ID',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List email messages in a folder',
	},
	'messages.query': {
		riskLevel: 'read',
		description: 'Query email messages with OData filters',
	},
	'messages.search': {
		riskLevel: 'read',
		description: 'Search email messages',
	},
	'messages.reply': {
		riskLevel: 'write',
		description: 'Reply to an email message',
	},
	'messages.forward': {
		riskLevel: 'write',
		description: 'Forward an email message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete an email message [DESTRUCTIVE]',
	},
	'messages.move': {
		riskLevel: 'write',
		description: 'Move a message to a different folder',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Update an email message (e.g. mark as read)',
	},
	'messages.sendDraft': {
		riskLevel: 'write',
		description: 'Send a saved draft message',
	},
	'messages.batchMove': {
		riskLevel: 'write',
		description: 'Batch move up to 20 messages to a folder',
	},
	'messages.batchUpdate': {
		riskLevel: 'write',
		description: 'Batch update up to 20 messages',
	},
	'messages.addAttachment': {
		riskLevel: 'write',
		description: 'Add an attachment to a message',
	},
	'events.create': {
		riskLevel: 'write',
		description: 'Create a calendar event',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get a calendar event by ID',
	},
	'events.list': { riskLevel: 'read', description: 'List calendar events' },
	'events.update': {
		riskLevel: 'write',
		description: 'Update a calendar event',
	},
	'events.delete': {
		riskLevel: 'destructive',
		description: 'Delete a calendar event [DESTRUCTIVE]',
	},
	'events.cancel': {
		riskLevel: 'write',
		description: 'Cancel a calendar event and notify attendees',
	},
	'events.decline': {
		riskLevel: 'write',
		description: 'Decline a calendar event invitation',
	},
	'events.findMeetingTimes': {
		riskLevel: 'read',
		description: 'Find available meeting times for attendees',
	},
	'events.getSchedule': {
		riskLevel: 'read',
		description: 'Get free/busy schedule for a calendar',
	},
	'calendars.create': {
		riskLevel: 'write',
		description: 'Create a new calendar',
	},
	'calendars.get': { riskLevel: 'read', description: 'Get a calendar by ID' },
	'calendars.list': { riskLevel: 'read', description: 'List all calendars' },
	'calendars.delete': {
		riskLevel: 'destructive',
		description: 'Delete a calendar [DESTRUCTIVE]',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact',
	},
	'contacts.list': { riskLevel: 'read', description: 'List contacts' },
	'contacts.update': { riskLevel: 'write', description: 'Update a contact' },
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact [DESTRUCTIVE]',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a new mail folder',
	},
	'folders.get': { riskLevel: 'read', description: 'Get a mail folder by ID' },
	'folders.list': { riskLevel: 'read', description: 'List mail folders' },
	'folders.update': { riskLevel: 'write', description: 'Rename a mail folder' },
	'folders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mail folder [DESTRUCTIVE]',
	},
} satisfies RequiredPluginEndpointMeta<typeof outlookEndpointsNested>;

const outlookWebhookSchemas = {
	'messages.newMessage': {
		description:
			'Triggered when a new message is received in the Outlook mailbox',
		payload: OutlookWebhookPayloadSchema,
		response: MessageReceivedEventSchema,
	},
	'messages.sentMessage': {
		description: 'Triggered when a message is sent from the Outlook mailbox',
		payload: OutlookWebhookPayloadSchema,
		response: MessageSentEventSchema,
	},
	'events.newEvent': {
		description: 'Triggered when a new calendar event is created',
		payload: OutlookWebhookPayloadSchema,
		response: EventCreatedEventSchema,
	},
	'events.eventChange': {
		description:
			'Triggered when a calendar event is created, updated, or deleted',
		payload: OutlookWebhookPayloadSchema,
		response: EventChangedEventSchema,
	},
	'contacts.newContact': {
		description: 'Triggered when a new contact is added in Outlook contacts',
		payload: OutlookWebhookPayloadSchema,
		response: ContactCreatedEventSchema,
	},
	subscriptionValidation: {
		description: 'Microsoft Graph subscription validation handshake',
		payload: SubscriptionValidationPayloadSchema,
		response: SubscriptionValidationPayloadSchema,
	},
} satisfies RequiredPluginWebhookSchemas<typeof outlookWebhooksNested>;

export const outlookAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOutlookPlugin<T extends OutlookPluginOptions> = CorsairPlugin<
	'outlook',
	typeof OutlookSchema,
	typeof outlookEndpointsNested,
	typeof outlookWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOutlookPlugin = BaseOutlookPlugin<OutlookPluginOptions>;

export type ExternalOutlookPlugin<T extends OutlookPluginOptions> =
	BaseOutlookPlugin<T>;

export function outlook<const T extends OutlookPluginOptions>(
	incomingOptions: OutlookPluginOptions & T = {} as OutlookPluginOptions & T,
): ExternalOutlookPlugin<T> {
	const isOutlookGraphNotificationBody = (body: unknown): boolean => {
		if (body === null || typeof body !== 'object') return false;
		const value = (body as { value?: unknown }).value;
		if (!Array.isArray(value) || value.length === 0) return false;
		return value.some((notification) => {
			if (notification === null || typeof notification !== 'object')
				return false;
			const resource = (notification as { resource?: unknown }).resource;
			return typeof resource === 'string' && resource.length > 0;
		});
	};

	const hasValidationTokenBody = (body: unknown): boolean => {
		if (body === null || typeof body !== 'object') return false;
		const validationToken = (body as { validationToken?: unknown })
			.validationToken;
		return typeof validationToken === 'string' && validationToken.length > 0;
	};

	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'outlook',
		schema: OutlookSchema,
		options: options,
		authConfig: outlookAuthConfig,
		oauthConfig: {
			providerName: 'Microsoft',
			authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
			tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
			scopes: [
				'offline_access',
				'Mail.ReadWrite',
				'Mail.Send',
				'Calendars.ReadWrite',
				'Contacts.ReadWrite',
			],
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: outlookEndpointsNested,
		webhooks: outlookWebhooksNested,
		endpointMeta: outlookEndpointMeta,
		endpointSchemas: outlookEndpointSchemas,
		webhookSchemas: outlookWebhookSchemas,
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const contentType = headers['content-type'];
			if (typeof contentType !== 'string') return false;
			if (contentType.includes('application/json')) {
				return isOutlookGraphNotificationBody(request.body);
			}
			if (contentType.includes('text/plain')) {
				return hasValidationTokenBody(request.body);
			}
			return false;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OutlookKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error('No refresh token. Cannot get access token.');
				}

				const res = await ctx.keys.get_integration_credentials();
				if (!res.client_id || !res.client_secret) {
					throw new Error('No client id or client secret');
				}

				const result = await getValidAccessToken({
					accessToken,
					expiresAt,
					refreshToken,
					clientId: res.client_id,
					clientSecret: res.client_secret,
				});

				if (result.refreshed) {
					await Promise.all([
						ctx.keys.set_access_token(result.accessToken),
						ctx.keys.set_expires_at(String(result.expiresAt)),
					]);
				}

				return result.accessToken;
			}

			return '';
		},
	} satisfies InternalOutlookPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ContactCreatedEvent,
	EventChangedEvent,
	EventCreatedEvent,
	MessageReceivedEvent,
	MessageSentEvent,
	OutlookChangeNotification,
	OutlookWebhookOutputs,
	OutlookWebhookPayload,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CalendarsCreateInput,
	CalendarsCreateResponse,
	CalendarsDeleteInput,
	CalendarsDeleteResponse,
	CalendarsGetInput,
	CalendarsGetResponse,
	CalendarsListInput,
	CalendarsListResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	EventsCancelInput,
	EventsCancelResponse,
	EventsCreateInput,
	EventsCreateResponse,
	EventsDeclineInput,
	EventsDeclineResponse,
	EventsDeleteInput,
	EventsDeleteResponse,
	EventsFindMeetingTimesInput,
	EventsFindMeetingTimesResponse,
	EventsGetInput,
	EventsGetResponse,
	EventsGetScheduleInput,
	EventsGetScheduleResponse,
	EventsListInput,
	EventsListResponse,
	EventsUpdateInput,
	EventsUpdateResponse,
	FoldersCreateInput,
	FoldersCreateResponse,
	FoldersDeleteInput,
	FoldersDeleteResponse,
	FoldersGetInput,
	FoldersGetResponse,
	FoldersListInput,
	FoldersListResponse,
	FoldersUpdateInput,
	FoldersUpdateResponse,
	MessagesAddAttachmentInput,
	MessagesAddAttachmentResponse,
	MessagesBatchMoveInput,
	MessagesBatchMoveResponse,
	MessagesBatchUpdateInput,
	MessagesBatchUpdateResponse,
	MessagesCreateDraftInput,
	MessagesCreateDraftResponse,
	MessagesDeleteInput,
	MessagesDeleteResponse,
	MessagesForwardInput,
	MessagesForwardResponse,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListResponse,
	MessagesMoveInput,
	MessagesMoveResponse,
	MessagesQueryInput,
	MessagesQueryResponse,
	MessagesReplyInput,
	MessagesReplyResponse,
	MessagesSearchInput,
	MessagesSearchResponse,
	MessagesSendDraftInput,
	MessagesSendDraftResponse,
	MessagesSendInput,
	MessagesSendResponse,
	MessagesUpdateInput,
	MessagesUpdateResponse,
	OutlookEndpointInputs,
	OutlookEndpointOutputs,
} from './endpoints/types';
