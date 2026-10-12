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
import {
	Account,
	Contacts,
	Files,
	Links,
	Members,
	Messages,
	Rooms,
	Tasks,
} from './endpoints';
import type {
	ChatworkEndpointInputs,
	ChatworkEndpointOutputs,
} from './endpoints/types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChatworkSchema } from './schema';
import { MentionsWebhooks, MessagesWebhooks } from './webhooks';
import { resolveChatworkOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchChatworkTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ChatworkWebhookOutputs,
	MentionToMeWebhookPayload,
	MessageCreatedWebhookPayload,
	MessageUpdatedWebhookPayload,
} from './webhooks/types';
import {
	MentionToMeWebhookPayloadSchema,
	MessageCreatedWebhookPayloadSchema,
	MessageUpdatedWebhookPayloadSchema,
} from './webhooks/types';

export type ChatworkPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalChatworkPlugin['hooks'];
	webhookHooks?: InternalChatworkPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chatworkEndpointsNested>;
};

export type ChatworkContext = CorsairPluginContext<
	typeof ChatworkSchema,
	ChatworkPluginOptions
>;

export type ChatworkKeyBuilderContext =
	KeyBuilderContext<ChatworkPluginOptions>;

export type ChatworkBoundEndpoints = BindEndpoints<
	typeof chatworkEndpointsNested
>;

type ChatworkEndpoint<K extends keyof ChatworkEndpointOutputs> =
	CorsairEndpoint<
		ChatworkContext,
		ChatworkEndpointInputs[K],
		ChatworkEndpointOutputs[K]
	>;

export type ChatworkEndpoints = {
	accountGet: ChatworkEndpoint<'accountGet'>;
	accountGetStatus: ChatworkEndpoint<'accountGetStatus'>;
	accountListTasks: ChatworkEndpoint<'accountListTasks'>;
	contactsList: ChatworkEndpoint<'contactsList'>;
	contactsListIncomingRequests: ChatworkEndpoint<'contactsListIncomingRequests'>;
	roomsList: ChatworkEndpoint<'roomsList'>;
	roomsGet: ChatworkEndpoint<'roomsGet'>;
	roomsCreate: ChatworkEndpoint<'roomsCreate'>;
	roomsUpdate: ChatworkEndpoint<'roomsUpdate'>;
	roomsDelete: ChatworkEndpoint<'roomsDelete'>;
	linksGet: ChatworkEndpoint<'linksGet'>;
	linksCreate: ChatworkEndpoint<'linksCreate'>;
	linksUpdate: ChatworkEndpoint<'linksUpdate'>;
	linksDelete: ChatworkEndpoint<'linksDelete'>;
	messagesList: ChatworkEndpoint<'messagesList'>;
	messagesGet: ChatworkEndpoint<'messagesGet'>;
	messagesSend: ChatworkEndpoint<'messagesSend'>;
	messagesUpdate: ChatworkEndpoint<'messagesUpdate'>;
	messagesDelete: ChatworkEndpoint<'messagesDelete'>;
	messagesMarkRead: ChatworkEndpoint<'messagesMarkRead'>;
	messagesMarkUnread: ChatworkEndpoint<'messagesMarkUnread'>;
	membersList: ChatworkEndpoint<'membersList'>;
	membersUpdate: ChatworkEndpoint<'membersUpdate'>;
	tasksList: ChatworkEndpoint<'tasksList'>;
	tasksGet: ChatworkEndpoint<'tasksGet'>;
	tasksCreate: ChatworkEndpoint<'tasksCreate'>;
	tasksUpdateStatus: ChatworkEndpoint<'tasksUpdateStatus'>;
	filesList: ChatworkEndpoint<'filesList'>;
	filesGet: ChatworkEndpoint<'filesGet'>;
	filesUpload: ChatworkEndpoint<'filesUpload'>;
};

type ChatworkWebhook<
	K extends keyof ChatworkWebhookOutputs,
	TEvent,
> = CorsairWebhook<ChatworkContext, TEvent, ChatworkWebhookOutputs[K]>;

export type ChatworkWebhooks = {
	messageCreated: ChatworkWebhook<
		'messageCreated',
		MessageCreatedWebhookPayload
	>;
	messageUpdated: ChatworkWebhook<
		'messageUpdated',
		MessageUpdatedWebhookPayload
	>;
	mentionToMe: ChatworkWebhook<'mentionToMe', MentionToMeWebhookPayload>;
};

export type ChatworkBoundWebhooks = BindWebhooks<ChatworkWebhooks>;

const chatworkEndpointsNested = {
	account: {
		get: Account.get,
		getStatus: Account.getStatus,
		listTasks: Account.listTasks,
	},
	contacts: {
		list: Contacts.list,
		listIncomingRequests: Contacts.listIncomingRequests,
	},
	rooms: {
		list: Rooms.list,
		get: Rooms.get,
		create: Rooms.create,
		update: Rooms.update,
		delete: Rooms.delete,
	},
	links: {
		get: Links.get,
		create: Links.create,
		update: Links.update,
		delete: Links.delete,
	},
	messages: {
		list: Messages.list,
		get: Messages.get,
		send: Messages.send,
		update: Messages.update,
		delete: Messages.delete,
		markRead: Messages.markRead,
		markUnread: Messages.markUnread,
	},
	members: {
		list: Members.list,
		update: Members.update,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		updateStatus: Tasks.updateStatus,
	},
	files: {
		list: Files.list,
		get: Files.get,
		upload: Files.upload,
	},
} as const;

const chatworkWebhooksNested = {
	messages: {
		created: MessagesWebhooks.created,
		updated: MessagesWebhooks.updated,
	},
	mentions: {
		toMe: MentionsWebhooks.toMe,
	},
} as const;

export const chatworkEndpointSchemas = {
	'account.get': {
		input: ChatworkEndpointInputSchemas.accountGet,
		output: ChatworkEndpointOutputSchemas.accountGet,
	},
	'account.getStatus': {
		input: ChatworkEndpointInputSchemas.accountGetStatus,
		output: ChatworkEndpointOutputSchemas.accountGetStatus,
	},
	'account.listTasks': {
		input: ChatworkEndpointInputSchemas.accountListTasks,
		output: ChatworkEndpointOutputSchemas.accountListTasks,
	},
	'contacts.list': {
		input: ChatworkEndpointInputSchemas.contactsList,
		output: ChatworkEndpointOutputSchemas.contactsList,
	},
	'contacts.listIncomingRequests': {
		input: ChatworkEndpointInputSchemas.contactsListIncomingRequests,
		output: ChatworkEndpointOutputSchemas.contactsListIncomingRequests,
	},
	'rooms.list': {
		input: ChatworkEndpointInputSchemas.roomsList,
		output: ChatworkEndpointOutputSchemas.roomsList,
	},
	'rooms.get': {
		input: ChatworkEndpointInputSchemas.roomsGet,
		output: ChatworkEndpointOutputSchemas.roomsGet,
	},
	'rooms.create': {
		input: ChatworkEndpointInputSchemas.roomsCreate,
		output: ChatworkEndpointOutputSchemas.roomsCreate,
	},
	'rooms.update': {
		input: ChatworkEndpointInputSchemas.roomsUpdate,
		output: ChatworkEndpointOutputSchemas.roomsUpdate,
	},
	'rooms.delete': {
		input: ChatworkEndpointInputSchemas.roomsDelete,
		output: ChatworkEndpointOutputSchemas.roomsDelete,
	},
	'links.get': {
		input: ChatworkEndpointInputSchemas.linksGet,
		output: ChatworkEndpointOutputSchemas.linksGet,
	},
	'links.create': {
		input: ChatworkEndpointInputSchemas.linksCreate,
		output: ChatworkEndpointOutputSchemas.linksCreate,
	},
	'links.update': {
		input: ChatworkEndpointInputSchemas.linksUpdate,
		output: ChatworkEndpointOutputSchemas.linksUpdate,
	},
	'links.delete': {
		input: ChatworkEndpointInputSchemas.linksDelete,
		output: ChatworkEndpointOutputSchemas.linksDelete,
	},
	'messages.list': {
		input: ChatworkEndpointInputSchemas.messagesList,
		output: ChatworkEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: ChatworkEndpointInputSchemas.messagesGet,
		output: ChatworkEndpointOutputSchemas.messagesGet,
	},
	'messages.send': {
		input: ChatworkEndpointInputSchemas.messagesSend,
		output: ChatworkEndpointOutputSchemas.messagesSend,
	},
	'messages.update': {
		input: ChatworkEndpointInputSchemas.messagesUpdate,
		output: ChatworkEndpointOutputSchemas.messagesUpdate,
	},
	'messages.delete': {
		input: ChatworkEndpointInputSchemas.messagesDelete,
		output: ChatworkEndpointOutputSchemas.messagesDelete,
	},
	'messages.markRead': {
		input: ChatworkEndpointInputSchemas.messagesMarkRead,
		output: ChatworkEndpointOutputSchemas.messagesMarkRead,
	},
	'messages.markUnread': {
		input: ChatworkEndpointInputSchemas.messagesMarkUnread,
		output: ChatworkEndpointOutputSchemas.messagesMarkUnread,
	},
	'members.list': {
		input: ChatworkEndpointInputSchemas.membersList,
		output: ChatworkEndpointOutputSchemas.membersList,
	},
	'members.update': {
		input: ChatworkEndpointInputSchemas.membersUpdate,
		output: ChatworkEndpointOutputSchemas.membersUpdate,
	},
	'tasks.list': {
		input: ChatworkEndpointInputSchemas.tasksList,
		output: ChatworkEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: ChatworkEndpointInputSchemas.tasksGet,
		output: ChatworkEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: ChatworkEndpointInputSchemas.tasksCreate,
		output: ChatworkEndpointOutputSchemas.tasksCreate,
	},
	'tasks.updateStatus': {
		input: ChatworkEndpointInputSchemas.tasksUpdateStatus,
		output: ChatworkEndpointOutputSchemas.tasksUpdateStatus,
	},
	'files.list': {
		input: ChatworkEndpointInputSchemas.filesList,
		output: ChatworkEndpointOutputSchemas.filesList,
	},
	'files.get': {
		input: ChatworkEndpointInputSchemas.filesGet,
		output: ChatworkEndpointOutputSchemas.filesGet,
	},
	'files.upload': {
		input: ChatworkEndpointInputSchemas.filesUpload,
		output: ChatworkEndpointOutputSchemas.filesUpload,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chatworkEndpointsNested
>;

const chatworkWebhookSchemas = {
	'messages.created': {
		description: 'A message was created in a room',
		payload: MessageCreatedWebhookPayloadSchema,
		response: MessageCreatedWebhookPayloadSchema,
	},
	'messages.updated': {
		description: 'A message was updated in a room',
		payload: MessageUpdatedWebhookPayloadSchema,
		response: MessageUpdatedWebhookPayloadSchema,
	},
	'mentions.toMe': {
		description: 'Current user was mentioned in a room message',
		payload: MentionToMeWebhookPayloadSchema,
		response: MentionToMeWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof chatworkWebhooksNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const chatworkEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get profile information of the authenticated user',
	},
	'account.getStatus': {
		riskLevel: 'read',
		description:
			'Get unread, mention and open task counts for the authenticated user',
	},
	'account.listTasks': {
		riskLevel: 'read',
		description: 'List tasks assigned to the authenticated user (up to 100)',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts of the authenticated user',
	},
	'contacts.listIncomingRequests': {
		riskLevel: 'read',
		description:
			'List pending contact requests sent to the authenticated user (up to 100)',
	},
	'rooms.list': {
		riskLevel: 'read',
		description: 'List chat rooms the authenticated user belongs to',
	},
	'rooms.get': {
		riskLevel: 'read',
		description: 'Get details of a specific chat room',
	},
	'rooms.create': {
		riskLevel: 'write',
		description: 'Create a new group chat',
	},
	'rooms.update': {
		riskLevel: 'write',
		description: 'Update the name, description or icon of a group chat',
	},
	'rooms.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Leave or permanently delete a group chat',
	},
	'links.get': {
		riskLevel: 'read',
		description: 'Get the invitation link of a group chat',
	},
	'links.create': {
		riskLevel: 'write',
		description: 'Create an invitation link for a group chat',
	},
	'links.update': {
		riskLevel: 'write',
		description: 'Update the invitation link of a group chat',
	},
	'links.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the invitation link of a group chat',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages in a chat room (up to 100)',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Get a specific message from a chat room',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a new message to a chat room',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Edit the body of a message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a message from a chat room',
	},
	'messages.markRead': {
		riskLevel: 'write',
		description: 'Mark messages in a chat room as read',
	},
	'messages.markUnread': {
		riskLevel: 'write',
		description: 'Mark messages in a chat room as unread from a given message',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List members belonging to a chat room',
	},
	'members.update': {
		riskLevel: 'write',
		description: 'Replace the member list and roles of a group chat',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks in a chat room (up to 100)',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a specific task in a chat room',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task in a chat room',
	},
	'tasks.updateStatus': {
		riskLevel: 'write',
		description: 'Mark a task as done or reopen it',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List files uploaded to a chat room (up to 100)',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Get file details, optionally with a temporary download URL',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file to a chat room',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof chatworkEndpointsNested>;

export const chatworkAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
	oauth_2: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChatworkPlugin<T extends ChatworkPluginOptions> = CorsairPlugin<
	'chatwork',
	typeof ChatworkSchema,
	typeof chatworkEndpointsNested,
	typeof chatworkWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalChatworkPlugin = BaseChatworkPlugin<ChatworkPluginOptions>;

export type ExternalChatworkPlugin<T extends ChatworkPluginOptions> =
	BaseChatworkPlugin<T>;

export function chatwork<const T extends ChatworkPluginOptions>(
	// Every ChatworkPluginOptions field is optional, so {} is a valid value; the
	// cast only widens it to the caller's generic T, matching the other plugins.
	incomingOptions: ChatworkPluginOptions & T = {} as ChatworkPluginOptions & T,
): ExternalChatworkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chatwork',
		authConfig: chatworkAuthConfig,
		oauthConfig: {
			providerName: 'Chatwork',
			authUrl: 'https://www.chatwork.com/packages/oauth2/login.php',
			tokenUrl: 'https://oauth.chatwork.com/token',
			scopes: [
				'users.profile.me:read',
				'users.status.me:read',
				'users.tasks.me:read',
				'contacts.all:read',
				'rooms:write',
				'rooms.info:read',
				'rooms.info:write',
				'rooms.messages:read',
				'rooms.messages:write',
				'rooms.members:read',
				'rooms.members:write',
				'rooms.tasks:read',
				'rooms.tasks:write',
				'rooms.files:read',
				'rooms.files:write',
				'offline_access',
			],
		},
		schema: ChatworkSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: chatworkEndpointsNested,
		webhooks: chatworkWebhooksNested,
		endpointMeta: chatworkEndpointMeta,
		endpointSchemas: chatworkEndpointSchemas,
		webhookSchemas: chatworkWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const signatureInQuery =
				typeof request.query?.chatwork_webhook_signature === 'string';
			return (
				signatureInQuery ||
				'x-chatworkwebhooksignature' in headers ||
				'x-chatwork-signature' in headers
			);
		},
		pluginTenantWebhookMatcher: matchChatworkTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveChatworkOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChatworkKeyBuilderContext, source) => {
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
	} satisfies InternalChatworkPlugin;
}

export { ChatworkAPIError } from './client';
export type {
	AccountGetInput,
	AccountGetResponse,
	AccountGetStatusInput,
	AccountGetStatusResponse,
	AccountListTasksInput,
	AccountListTasksResponse,
	ChatworkEndpointInputs,
	ChatworkEndpointOutputs,
	ChatworkRoomLink,
	ChatworkTaskItem,
	ContactsListIncomingRequestsInput,
	ContactsListIncomingRequestsResponse,
	ContactsListInput,
	ContactsListResponse,
	FilesGetInput,
	FilesGetResponse,
	FilesListInput,
	FilesListResponse,
	FilesUploadInput,
	FilesUploadResponse,
	LinksCreateInput,
	LinksDeleteInput,
	LinksGetInput,
	LinksUpdateInput,
	MembersListInput,
	MembersListResponse,
	MembersUpdateInput,
	MembersUpdateResponse,
	MessageIdResponse,
	MessagesDeleteInput,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListResponse,
	MessagesMarkReadInput,
	MessagesMarkUnreadInput,
	MessagesSendInput,
	MessagesSendResponse,
	MessagesUpdateInput,
	RoomIdResponse,
	RoomsCreateInput,
	RoomsDeleteInput,
	RoomsGetInput,
	RoomsGetResponse,
	RoomsListInput,
	RoomsListResponse,
	RoomsUpdateInput,
	SuccessResponse,
	TasksCreateInput,
	TasksCreateResponse,
	TasksGetInput,
	TasksListInput,
	TasksListResponse,
	TasksUpdateStatusInput,
	TasksUpdateStatusResponse,
	UnreadCountResponse,
} from './endpoints/types';
export * from './error-handlers';
export * from './schema';
export type {
	ChatworkWebhookOutputs,
	MentionToMeWebhookPayload,
	MessageCreatedWebhookPayload,
	MessageUpdatedWebhookPayload,
} from './webhooks/types';
export {
	createChatworkMatch,
	verifyChatworkWebhookSignature,
} from './webhooks/types';
