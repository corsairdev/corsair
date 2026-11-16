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
	Channels,
	ContactLists,
	Contacts,
	Conversations,
	Inboxes,
	Messages,
} from './endpoints';
import type {
	SuperchatEndpointInputs,
	SuperchatEndpointOutputs,
} from './endpoints/types';
import {
	SuperchatEndpointInputSchemas,
	SuperchatEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SuperchatSchema } from './schema';

export type SuperchatPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSuperchatPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof superchatEndpointsNested>;
};

export type SuperchatContext = CorsairPluginContext<
	typeof SuperchatSchema,
	SuperchatPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SuperchatEndpoint, and passing them back would make the type circular.
	undefined
>;

export type SuperchatKeyBuilderContext =
	KeyBuilderContext<SuperchatPluginOptions>;

export type SuperchatBoundEndpoints = BindEndpoints<
	typeof superchatEndpointsNested
>;

type SuperchatEndpoint<K extends keyof SuperchatEndpointOutputs> =
	CorsairEndpoint<
		SuperchatContext,
		SuperchatEndpointInputs[K],
		SuperchatEndpointOutputs[K]
	>;

export type SuperchatEndpoints = {
	contactsList: SuperchatEndpoint<'contactsList'>;
	contactsGet: SuperchatEndpoint<'contactsGet'>;
	contactsCreate: SuperchatEndpoint<'contactsCreate'>;
	contactsUpdate: SuperchatEndpoint<'contactsUpdate'>;
	contactsSearch: SuperchatEndpoint<'contactsSearch'>;
	contactsDelete: SuperchatEndpoint<'contactsDelete'>;
	contactListsList: SuperchatEndpoint<'contactListsList'>;
	contactListsCreate: SuperchatEndpoint<'contactListsCreate'>;
	contactListsDelete: SuperchatEndpoint<'contactListsDelete'>;
	contactListsForContact: SuperchatEndpoint<'contactListsForContact'>;
	contactListsAddContact: SuperchatEndpoint<'contactListsAddContact'>;
	contactListsRemoveContact: SuperchatEndpoint<'contactListsRemoveContact'>;
	conversationsList: SuperchatEndpoint<'conversationsList'>;
	conversationsGet: SuperchatEndpoint<'conversationsGet'>;
	conversationsUpdate: SuperchatEndpoint<'conversationsUpdate'>;
	conversationsMessages: SuperchatEndpoint<'conversationsMessages'>;
	messagesSend: SuperchatEndpoint<'messagesSend'>;
	messagesGet: SuperchatEndpoint<'messagesGet'>;
	channelsList: SuperchatEndpoint<'channelsList'>;
	channelsGet: SuperchatEndpoint<'channelsGet'>;
	inboxesList: SuperchatEndpoint<'inboxesList'>;
	inboxesGet: SuperchatEndpoint<'inboxesGet'>;
};

const superchatEndpointsNested = {
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		search: Contacts.search,
		delete: Contacts.remove,
	},
	contactLists: {
		list: ContactLists.list,
		create: ContactLists.create,
		delete: ContactLists.remove,
		forContact: ContactLists.forContact,
		addContact: ContactLists.addContact,
		removeContact: ContactLists.removeContact,
	},
	conversations: {
		list: Conversations.list,
		get: Conversations.get,
		update: Conversations.update,
		messages: Conversations.messages,
	},
	messages: {
		send: Messages.send,
		get: Messages.get,
	},
	channels: {
		list: Channels.list,
		get: Channels.get,
	},
	inboxes: {
		list: Inboxes.list,
		get: Inboxes.get,
	},
} as const;

export const superchatEndpointSchemas = {
	'contacts.list': {
		input: SuperchatEndpointInputSchemas.contactsList,
		output: SuperchatEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: SuperchatEndpointInputSchemas.contactsGet,
		output: SuperchatEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: SuperchatEndpointInputSchemas.contactsCreate,
		output: SuperchatEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: SuperchatEndpointInputSchemas.contactsUpdate,
		output: SuperchatEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.search': {
		input: SuperchatEndpointInputSchemas.contactsSearch,
		output: SuperchatEndpointOutputSchemas.contactsSearch,
	},
	'contacts.delete': {
		input: SuperchatEndpointInputSchemas.contactsDelete,
		output: SuperchatEndpointOutputSchemas.contactsDelete,
	},
	'contactLists.list': {
		input: SuperchatEndpointInputSchemas.contactListsList,
		output: SuperchatEndpointOutputSchemas.contactListsList,
	},
	'contactLists.create': {
		input: SuperchatEndpointInputSchemas.contactListsCreate,
		output: SuperchatEndpointOutputSchemas.contactListsCreate,
	},
	'contactLists.delete': {
		input: SuperchatEndpointInputSchemas.contactListsDelete,
		output: SuperchatEndpointOutputSchemas.contactListsDelete,
	},
	'contactLists.forContact': {
		input: SuperchatEndpointInputSchemas.contactListsForContact,
		output: SuperchatEndpointOutputSchemas.contactListsForContact,
	},
	'contactLists.addContact': {
		input: SuperchatEndpointInputSchemas.contactListsAddContact,
		output: SuperchatEndpointOutputSchemas.contactListsAddContact,
	},
	'contactLists.removeContact': {
		input: SuperchatEndpointInputSchemas.contactListsRemoveContact,
		output: SuperchatEndpointOutputSchemas.contactListsRemoveContact,
	},
	'conversations.list': {
		input: SuperchatEndpointInputSchemas.conversationsList,
		output: SuperchatEndpointOutputSchemas.conversationsList,
	},
	'conversations.get': {
		input: SuperchatEndpointInputSchemas.conversationsGet,
		output: SuperchatEndpointOutputSchemas.conversationsGet,
	},
	'conversations.update': {
		input: SuperchatEndpointInputSchemas.conversationsUpdate,
		output: SuperchatEndpointOutputSchemas.conversationsUpdate,
	},
	'conversations.messages': {
		input: SuperchatEndpointInputSchemas.conversationsMessages,
		output: SuperchatEndpointOutputSchemas.conversationsMessages,
	},
	'messages.send': {
		input: SuperchatEndpointInputSchemas.messagesSend,
		output: SuperchatEndpointOutputSchemas.messagesSend,
	},
	'messages.get': {
		input: SuperchatEndpointInputSchemas.messagesGet,
		output: SuperchatEndpointOutputSchemas.messagesGet,
	},
	'channels.list': {
		input: SuperchatEndpointInputSchemas.channelsList,
		output: SuperchatEndpointOutputSchemas.channelsList,
	},
	'channels.get': {
		input: SuperchatEndpointInputSchemas.channelsGet,
		output: SuperchatEndpointOutputSchemas.channelsGet,
	},
	'inboxes.list': {
		input: SuperchatEndpointInputSchemas.inboxesList,
		output: SuperchatEndpointOutputSchemas.inboxesList,
	},
	'inboxes.get': {
		input: SuperchatEndpointInputSchemas.inboxesGet,
		output: SuperchatEndpointOutputSchemas.inboxesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof superchatEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const superchatEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts newest first, paging with a cursor id; set after or before, never both',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Read one contact with their handles, gender and custom attribute values',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a contact. At least one handle is required, and a handle is the email address or phone number that identifies them on a channel',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			"Change a contact's names, gender, handles or custom attributes. The route requires first name, last name and gender, so all three are sent back",
	},
	'contacts.search': {
		riskLevel: 'read',
		description:
			'Search contacts by email, phone, Instagram or WhatsApp username, or a custom attribute; every expression has to match',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a contact and their handles. Conversations that referenced them lose the link, and this cannot be undone',
	},
	'contactLists.list': {
		riskLevel: 'read',
		description: 'List the contact lists in the workspace',
	},
	'contactLists.create': {
		riskLevel: 'write',
		description: 'Create a contact list that contacts can be added to',
	},
	'contactLists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a contact list. Its membership goes with it, and this cannot be undone',
	},
	'contactLists.forContact': {
		riskLevel: 'read',
		description:
			'List the contact lists one contact belongs to, paged by cursor like the other lists',
	},
	'contactLists.addContact': {
		riskLevel: 'write',
		description:
			'Add a contact to a contact list. The list is named in the body on this route, not in the path',
	},
	'contactLists.removeContact': {
		riskLevel: 'write',
		description:
			'Remove a contact from a contact list; the contact itself stays',
	},
	'conversations.list': {
		riskLevel: 'read',
		description:
			'List conversations with their status, channel, inbox and assigned users, paging with a cursor id',
	},
	'conversations.get': {
		riskLevel: 'read',
		description:
			'Read one conversation with its labels, assignees, linked contacts and snooze state',
	},
	'conversations.update': {
		riskLevel: 'write',
		description:
			"Change a conversation's status, inbox, labels or assignees. Snoozing needs both a status of snoozed and a snoozed_until time",
	},
	'conversations.messages': {
		riskLevel: 'read',
		description:
			'List the messages in one conversation, paging with a cursor id',
	},
	'messages.send': {
		riskLevel: 'destructive',
		description:
			'Send a text message on a channel to one recipient. This reaches a real person on WhatsApp, SMS or another channel, and the content has to suit that channel',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Read one message with its content, direction and status',
	},
	'channels.list': {
		riskLevel: 'read',
		description:
			'List the channels in the workspace, optionally only those in one inbox; a channel id is what a message is sent from',
	},
	'channels.get': {
		riskLevel: 'read',
		description:
			'Read one channel with its type, name and the inbox it belongs to',
	},
	'inboxes.list': {
		riskLevel: 'read',
		description: 'List the inboxes in the workspace',
	},
	'inboxes.get': {
		riskLevel: 'read',
		description: 'Read one inbox with its name and workspace url',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof superchatEndpointsNested
>;

export type BaseSuperchatPlugin<T extends SuperchatPluginOptions> =
	CorsairPlugin<
		'superchat',
		typeof SuperchatSchema,
		typeof superchatEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSuperchatPlugin =
	BaseSuperchatPlugin<SuperchatPluginOptions>;

export type ExternalSuperchatPlugin<T extends SuperchatPluginOptions> =
	BaseSuperchatPlugin<T>;

export function superchat<const T extends SuperchatPluginOptions>(
	incomingOptions: SuperchatPluginOptions & T = {} as SuperchatPluginOptions &
		T,
): ExternalSuperchatPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'superchat',
		schema: SuperchatSchema,
		options: options,
		hooks: options.hooks,
		endpoints: superchatEndpointsNested,
		webhooks: {},
		endpointMeta: superchatEndpointMeta,
		endpointSchemas: superchatEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SuperchatKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('superchat', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSuperchatPlugin;
}

export { SuperchatAPIError } from './client';

export type {
	ContactListsListInput,
	ContactsCreateInput,
	ContactsListInput,
	ContactsSearchInput,
	ContactsUpdateInput,
	ConversationsUpdateInput,
	MessagesSendInput,
	SuperchatChannel,
	SuperchatContact,
	SuperchatContactList,
	SuperchatConversation,
	SuperchatEndpointInputs,
	SuperchatEndpointOutputs,
	SuperchatInbox,
	SuperchatMessage,
	SuperchatPagination,
} from './endpoints/types';
