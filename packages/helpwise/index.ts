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
import { AuthMissingError } from 'corsair/core';
import { splitKeyAndSecret } from './client';
import {
	Contacts,
	Conversations,
	CustomFields,
	Inboxes,
	Messages,
	Notes,
	Reports,
	Tags,
	Users,
	Whatsapp,
} from './endpoints';
import type {
	HelpwiseEndpointInputs,
	HelpwiseEndpointOutputs,
} from './endpoints/types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HelpwiseSchema } from './schema';

export type HelpwisePluginOptions = {
	authType?: PickAuth<'api_key'>;
	apiKey?: string;
	apiSecret?: string;
	key?: string;
	hooks?: InternalHelpwisePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof helpwiseEndpointsNested>;
};

export const helpwiseAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type HelpwiseContext = CorsairPluginContext<
	typeof HelpwiseSchema,
	HelpwisePluginOptions,
	undefined,
	typeof helpwiseAuthConfig
>;

export type HelpwiseKeyBuilderContext = KeyBuilderContext<
	HelpwisePluginOptions,
	typeof helpwiseAuthConfig
>;

export type HelpwiseBoundEndpoints = BindEndpoints<
	typeof helpwiseEndpointsNested
>;

export type HelpwiseEndpoint<K extends keyof HelpwiseEndpointOutputs> =
	CorsairEndpoint<
		HelpwiseContext,
		HelpwiseEndpointInputs[K],
		HelpwiseEndpointOutputs[K]
	>;

export const helpwiseEndpointsNested = {
	conversations: {
		close: Conversations.close,
		moveToInbox: Conversations.moveToInbox,
		spam: Conversations.spam,
		trash: Conversations.trash,
		delete: Conversations.deleteConversation,
		list: Conversations.list,
		get: Conversations.get,
		assign: Conversations.assign,
	},
	messages: {
		sendEmail: Messages.sendEmail,
		listEmails: Messages.listEmails,
		sendSms: Messages.sendSms,
		sendWhatsApp: Messages.sendWhatsApp,
		sendChat: Messages.sendChat,
	},
	inboxes: {
		list: Inboxes.list,
		get: Inboxes.get,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		search: Contacts.search,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
		apply: Tags.apply,
		remove: Tags.remove,
	},
	customFields: {
		list: CustomFields.list,
		get: CustomFields.get,
		create: CustomFields.create,
		update: CustomFields.update,
		delete: CustomFields.deleteField,
		listByInbox: CustomFields.listByInbox,
		updateByInbox: CustomFields.updateByInbox,
	},
	users: {
		getMe: Users.getMe,
		list: Users.list,
	},
	notes: {
		create: Notes.create,
	},
	whatsapp: {
		listTemplates: Whatsapp.listTemplates,
	},
	reports: {
		getOverall: Reports.getOverall,
		getTags: Reports.getTags,
	},
} as const;

export const helpwiseEndpointSchemas = {
	'conversations.close': {
		input: HelpwiseEndpointInputSchemas['conversations.close'],
		output: HelpwiseEndpointOutputSchemas['conversations.close'],
	},
	'conversations.moveToInbox': {
		input: HelpwiseEndpointInputSchemas['conversations.moveToInbox'],
		output: HelpwiseEndpointOutputSchemas['conversations.moveToInbox'],
	},
	'conversations.spam': {
		input: HelpwiseEndpointInputSchemas['conversations.spam'],
		output: HelpwiseEndpointOutputSchemas['conversations.spam'],
	},
	'conversations.trash': {
		input: HelpwiseEndpointInputSchemas['conversations.trash'],
		output: HelpwiseEndpointOutputSchemas['conversations.trash'],
	},
	'conversations.delete': {
		input: HelpwiseEndpointInputSchemas['conversations.delete'],
		output: HelpwiseEndpointOutputSchemas['conversations.delete'],
	},
	'conversations.list': {
		input: HelpwiseEndpointInputSchemas['conversations.list'],
		output: HelpwiseEndpointOutputSchemas['conversations.list'],
	},
	'conversations.get': {
		input: HelpwiseEndpointInputSchemas['conversations.get'],
		output: HelpwiseEndpointOutputSchemas['conversations.get'],
	},
	'conversations.assign': {
		input: HelpwiseEndpointInputSchemas['conversations.assign'],
		output: HelpwiseEndpointOutputSchemas['conversations.assign'],
	},
	'messages.sendEmail': {
		input: HelpwiseEndpointInputSchemas['messages.sendEmail'],
		output: HelpwiseEndpointOutputSchemas['messages.sendEmail'],
	},
	'messages.listEmails': {
		input: HelpwiseEndpointInputSchemas['messages.listEmails'],
		output: HelpwiseEndpointOutputSchemas['messages.listEmails'],
	},
	'messages.sendSms': {
		input: HelpwiseEndpointInputSchemas['messages.sendSms'],
		output: HelpwiseEndpointOutputSchemas['messages.sendSms'],
	},
	'messages.sendWhatsApp': {
		input: HelpwiseEndpointInputSchemas['messages.sendWhatsApp'],
		output: HelpwiseEndpointOutputSchemas['messages.sendWhatsApp'],
	},
	'messages.sendChat': {
		input: HelpwiseEndpointInputSchemas['messages.sendChat'],
		output: HelpwiseEndpointOutputSchemas['messages.sendChat'],
	},
	'inboxes.list': {
		input: HelpwiseEndpointInputSchemas['inboxes.list'],
		output: HelpwiseEndpointOutputSchemas['inboxes.list'],
	},
	'inboxes.get': {
		input: HelpwiseEndpointInputSchemas['inboxes.get'],
		output: HelpwiseEndpointOutputSchemas['inboxes.get'],
	},
	'contacts.list': {
		input: HelpwiseEndpointInputSchemas['contacts.list'],
		output: HelpwiseEndpointOutputSchemas['contacts.list'],
	},
	'contacts.get': {
		input: HelpwiseEndpointInputSchemas['contacts.get'],
		output: HelpwiseEndpointOutputSchemas['contacts.get'],
	},
	'contacts.create': {
		input: HelpwiseEndpointInputSchemas['contacts.create'],
		output: HelpwiseEndpointOutputSchemas['contacts.create'],
	},
	'contacts.update': {
		input: HelpwiseEndpointInputSchemas['contacts.update'],
		output: HelpwiseEndpointOutputSchemas['contacts.update'],
	},
	'contacts.search': {
		input: HelpwiseEndpointInputSchemas['contacts.search'],
		output: HelpwiseEndpointOutputSchemas['contacts.search'],
	},
	'tags.list': {
		input: HelpwiseEndpointInputSchemas['tags.list'],
		output: HelpwiseEndpointOutputSchemas['tags.list'],
	},
	'tags.get': {
		input: HelpwiseEndpointInputSchemas['tags.get'],
		output: HelpwiseEndpointOutputSchemas['tags.get'],
	},
	'tags.apply': {
		input: HelpwiseEndpointInputSchemas['tags.apply'],
		output: HelpwiseEndpointOutputSchemas['tags.apply'],
	},
	'tags.remove': {
		input: HelpwiseEndpointInputSchemas['tags.remove'],
		output: HelpwiseEndpointOutputSchemas['tags.remove'],
	},
	'customFields.list': {
		input: HelpwiseEndpointInputSchemas['customFields.list'],
		output: HelpwiseEndpointOutputSchemas['customFields.list'],
	},
	'customFields.get': {
		input: HelpwiseEndpointInputSchemas['customFields.get'],
		output: HelpwiseEndpointOutputSchemas['customFields.get'],
	},
	'customFields.create': {
		input: HelpwiseEndpointInputSchemas['customFields.create'],
		output: HelpwiseEndpointOutputSchemas['customFields.create'],
	},
	'customFields.update': {
		input: HelpwiseEndpointInputSchemas['customFields.update'],
		output: HelpwiseEndpointOutputSchemas['customFields.update'],
	},
	'customFields.delete': {
		input: HelpwiseEndpointInputSchemas['customFields.delete'],
		output: HelpwiseEndpointOutputSchemas['customFields.delete'],
	},
	'customFields.listByInbox': {
		input: HelpwiseEndpointInputSchemas['customFields.listByInbox'],
		output: HelpwiseEndpointOutputSchemas['customFields.listByInbox'],
	},
	'customFields.updateByInbox': {
		input: HelpwiseEndpointInputSchemas['customFields.updateByInbox'],
		output: HelpwiseEndpointOutputSchemas['customFields.updateByInbox'],
	},
	'users.getMe': {
		input: HelpwiseEndpointInputSchemas['users.getMe'],
		output: HelpwiseEndpointOutputSchemas['users.getMe'],
	},
	'users.list': {
		input: HelpwiseEndpointInputSchemas['users.list'],
		output: HelpwiseEndpointOutputSchemas['users.list'],
	},
	'notes.create': {
		input: HelpwiseEndpointInputSchemas['notes.create'],
		output: HelpwiseEndpointOutputSchemas['notes.create'],
	},
	'whatsapp.listTemplates': {
		input: HelpwiseEndpointInputSchemas['whatsapp.listTemplates'],
		output: HelpwiseEndpointOutputSchemas['whatsapp.listTemplates'],
	},
	'reports.getOverall': {
		input: HelpwiseEndpointInputSchemas['reports.getOverall'],
		output: HelpwiseEndpointOutputSchemas['reports.getOverall'],
	},
	'reports.getTags': {
		input: HelpwiseEndpointInputSchemas['reports.getTags'],
		output: HelpwiseEndpointOutputSchemas['reports.getTags'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof helpwiseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const helpwiseEndpointMeta = {
	'conversations.close': {
		riskLevel: 'write',
		description: 'Close conversations by ID',
	},
	'conversations.moveToInbox': {
		riskLevel: 'write',
		description: 'Move conversations back to inbox',
	},
	'conversations.spam': {
		riskLevel: 'write',
		description: 'Mark conversations as spam',
	},
	'conversations.trash': {
		riskLevel: 'write',
		description: 'Move conversations to trash',
	},
	'conversations.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete conversations',
	},
	'conversations.list': {
		riskLevel: 'read',
		description: 'List conversations with filters and pagination',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Get a conversation by inbox and conversation ID',
	},
	'conversations.assign': {
		riskLevel: 'write',
		description: 'Assign conversation to a user',
	},
	'messages.sendEmail': {
		riskLevel: 'destructive',
		description: 'Send an email message through a Helpwise mailbox',
	},
	'messages.listEmails': {
		riskLevel: 'read',
		description: 'List emails in a conversation thread',
	},
	'messages.sendSms': {
		riskLevel: 'destructive',
		description: 'Send an SMS message',
	},
	'messages.sendWhatsApp': {
		riskLevel: 'destructive',
		description: 'Send a WhatsApp message',
	},
	'messages.sendChat': {
		riskLevel: 'destructive',
		description: 'Send a live chat message in a thread',
	},
	'inboxes.list': {
		riskLevel: 'read',
		description: 'List shared mailboxes and inboxes',
	},
	'inboxes.get': {
		riskLevel: 'read',
		description: 'Get mailbox details by ID',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with pagination',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a contact by ID',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact by ID',
	},
	'contacts.search': {
		riskLevel: 'read',
		description: 'Search contacts by term',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List all tags',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get tag details by ID',
	},
	'tags.apply': {
		riskLevel: 'write',
		description: 'Apply tags to conversations',
	},
	'tags.remove': {
		riskLevel: 'write',
		description: 'Remove tags from conversations',
	},
	'customFields.list': {
		riskLevel: 'read',
		description: 'List all custom fields',
	},
	'customFields.get': {
		riskLevel: 'read',
		description: 'Get custom field details by ID',
	},
	'customFields.create': {
		riskLevel: 'write',
		description: 'Create a new custom field',
	},
	'customFields.update': {
		riskLevel: 'write',
		description: 'Update a custom field by ID',
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field by ID',
	},
	'customFields.listByInbox': {
		riskLevel: 'read',
		description: 'List custom fields enabled for an inbox',
	},
	'customFields.updateByInbox': {
		riskLevel: 'write',
		description: 'Update inbox custom field visibility',
	},
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get current authenticated user profile',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users in account or mailbox',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Add an internal note to a conversation thread',
	},
	'whatsapp.listTemplates': {
		riskLevel: 'read',
		description: 'List WhatsApp message templates',
	},
	'reports.getOverall': {
		riskLevel: 'read',
		description: 'Get overall account analytics report',
	},
	'reports.getTags': {
		riskLevel: 'read',
		description: 'Get tag analytics report for an inbox',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof helpwiseEndpointsNested>;

export type BaseHelpwisePlugin<T extends HelpwisePluginOptions> = CorsairPlugin<
	'helpwise',
	typeof HelpwiseSchema,
	typeof helpwiseEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof helpwiseAuthConfig
>;

export type InternalHelpwisePlugin = BaseHelpwisePlugin<HelpwisePluginOptions>;

export type ExternalHelpwisePlugin<T extends HelpwisePluginOptions> =
	BaseHelpwisePlugin<T>;

export function helpwise<const T extends HelpwisePluginOptions>(
	incomingOptions: HelpwisePluginOptions & T = {} as HelpwisePluginOptions & T,
): ExternalHelpwisePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'helpwise',
		authConfig: helpwiseAuthConfig,
		schema: HelpwiseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: helpwiseEndpointsNested,
		webhooks: {} as const,
		endpointMeta: helpwiseEndpointMeta,
		endpointSchemas: helpwiseEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: HelpwiseKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';

			if (options.apiKey && options.apiSecret) {
				return `${options.apiKey}:${options.apiSecret}`;
			}

			if (options.key) {
				return options.key;
			}

			if (!ctx.keys) {
				throw new AuthMissingError('helpwise', 'api_key');
			}

			const storedKey = await ctx.keys.get_api_key();
			const storedSecret = await ctx.keys.get_api_secret();
			const pair =
				storedKey && !storedSecret ? splitKeyAndSecret(storedKey) : null;
			const apiKey = pair?.apiKey ?? storedKey;
			const apiSecret = pair?.apiSecret ?? storedSecret;

			if (!apiKey || !apiSecret) {
				throw new AuthMissingError('helpwise', 'api_key');
			}

			return `${apiKey}:${apiSecret}`;
		},
	} satisfies InternalHelpwisePlugin;
}

export type {
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsSearchInput,
	ContactsSearchResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	ConversationsActionInput,
	ConversationsAssignInput,
	ConversationsGetInput,
	ConversationsGetResponse,
	ConversationsListInput,
	ConversationsListResponse,
	CustomFieldsCreateInput,
	CustomFieldsCreateResponse,
	CustomFieldsDeleteInput,
	CustomFieldsDeleteResponse,
	CustomFieldsGetInput,
	CustomFieldsGetResponse,
	CustomFieldsListByInboxInput,
	CustomFieldsListByInboxResponse,
	CustomFieldsListInput,
	CustomFieldsListResponse,
	CustomFieldsUpdateByInboxInput,
	CustomFieldsUpdateByInboxResponse,
	CustomFieldsUpdateInput,
	CustomFieldsUpdateResponse,
	HelpwiseEndpointInputs,
	HelpwiseEndpointOutputs,
	InboxesGetInput,
	InboxesGetResponse,
	InboxesListInput,
	InboxesListResponse,
	ListEmailsInput,
	ListEmailsResponse,
	NotesCreateInput,
	NotesCreateResponse,
	ReportsGetOverallInput,
	ReportsGetOverallResponse,
	ReportsGetTagsInput,
	ReportsGetTagsResponse,
	SendChatInput,
	SendChatResponse,
	SendEmailInput,
	SendEmailResponse,
	SendSmsInput,
	SendSmsResponse,
	SendWhatsAppInput,
	SendWhatsAppResponse,
	StandardActionResponse,
	TagsActionInput,
	TagsActionResponse,
	TagsGetInput,
	TagsGetResponse,
	TagsListInput,
	TagsListResponse,
	UsersGetMeInput,
	UsersGetMeResponse,
	UsersListInput,
	UsersListResponse,
	WhatsAppListTemplatesInput,
	WhatsAppListTemplatesResponse,
} from './endpoints/types';
