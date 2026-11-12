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
import { Contacts, Conversations, Messages, Space } from './endpoints';
import type {
	RespondioEndpointInputs,
	RespondioEndpointOutputs,
} from './endpoints/types';
import {
	RespondioEndpointInputSchemas,
	RespondioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RespondioSchema } from './schema';

export type RespondioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRespondioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof respondioEndpointsNested>;
};

export type RespondioContext = CorsairPluginContext<
	typeof RespondioSchema,
	RespondioPluginOptions
>;

export type RespondioKeyBuilderContext =
	KeyBuilderContext<RespondioPluginOptions>;

export type RespondioBoundEndpoints = BindEndpoints<
	typeof respondioEndpointsNested
>;

type RespondioEndpoint<K extends keyof RespondioEndpointOutputs> =
	CorsairEndpoint<
		RespondioContext,
		RespondioEndpointInputs[K],
		RespondioEndpointOutputs[K]
	>;

export type RespondioEndpoints = {
	contactGet: RespondioEndpoint<'contactGet'>;
	contactCreate: RespondioEndpoint<'contactCreate'>;
	contactUpdate: RespondioEndpoint<'contactUpdate'>;
	contactDelete: RespondioEndpoint<'contactDelete'>;
	contactUpsert: RespondioEndpoint<'contactUpsert'>;
	contactMerge: RespondioEndpoint<'contactMerge'>;
	contactList: RespondioEndpoint<'contactList'>;
	contactAddTags: RespondioEndpoint<'contactAddTags'>;
	contactDeleteTags: RespondioEndpoint<'contactDeleteTags'>;
	contactChannels: RespondioEndpoint<'contactChannels'>;
	contactLifecycle: RespondioEndpoint<'contactLifecycle'>;
	conversationAssign: RespondioEndpoint<'conversationAssign'>;
	conversationStatus: RespondioEndpoint<'conversationStatus'>;
	messageSend: RespondioEndpoint<'messageSend'>;
	messageGet: RespondioEndpoint<'messageGet'>;
	messageList: RespondioEndpoint<'messageList'>;
	spaceListUsers: RespondioEndpoint<'spaceListUsers'>;
	spaceGetUser: RespondioEndpoint<'spaceGetUser'>;
	spaceChannels: RespondioEndpoint<'spaceChannels'>;
	spaceTemplates: RespondioEndpoint<'spaceTemplates'>;
	spaceClosingNotes: RespondioEndpoint<'spaceClosingNotes'>;
	spaceCustomFields: RespondioEndpoint<'spaceCustomFields'>;
	commentCreate: RespondioEndpoint<'commentCreate'>;
};

const respondioEndpointsNested = {
	contacts: {
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
		upsert: Contacts.upsert,
		merge: Contacts.merge,
		list: Contacts.list,
		addTags: Contacts.addTags,
		deleteTags: Contacts.deleteTags,
		channels: Contacts.channels,
		lifecycle: Contacts.lifecycle,
	},
	conversations: {
		assign: Conversations.assign,
		status: Conversations.status,
	},
	messages: {
		send: Messages.send,
		get: Messages.get,
		list: Messages.list,
		comment: Messages.comment,
	},
	space: {
		listUsers: Space.listUsers,
		getUser: Space.getUser,
		listChannels: Space.listChannels,
		listTemplates: Space.listTemplates,
		listClosingNotes: Space.listClosingNotes,
		listCustomFields: Space.listCustomFields,
	},
} as const;

export const respondioEndpointSchemas = {
	'contacts.get': {
		input: RespondioEndpointInputSchemas.contactGet,
		output: RespondioEndpointOutputSchemas.contactGet,
	},
	'contacts.create': {
		input: RespondioEndpointInputSchemas.contactCreate,
		output: RespondioEndpointOutputSchemas.contactCreate,
	},
	'contacts.update': {
		input: RespondioEndpointInputSchemas.contactUpdate,
		output: RespondioEndpointOutputSchemas.contactUpdate,
	},
	'contacts.delete': {
		input: RespondioEndpointInputSchemas.contactDelete,
		output: RespondioEndpointOutputSchemas.contactDelete,
	},
	'contacts.upsert': {
		input: RespondioEndpointInputSchemas.contactUpsert,
		output: RespondioEndpointOutputSchemas.contactUpsert,
	},
	'contacts.merge': {
		input: RespondioEndpointInputSchemas.contactMerge,
		output: RespondioEndpointOutputSchemas.contactMerge,
	},
	'contacts.list': {
		input: RespondioEndpointInputSchemas.contactList,
		output: RespondioEndpointOutputSchemas.contactList,
	},
	'contacts.addTags': {
		input: RespondioEndpointInputSchemas.contactAddTags,
		output: RespondioEndpointOutputSchemas.contactAddTags,
	},
	'contacts.deleteTags': {
		input: RespondioEndpointInputSchemas.contactDeleteTags,
		output: RespondioEndpointOutputSchemas.contactDeleteTags,
	},
	'contacts.channels': {
		input: RespondioEndpointInputSchemas.contactChannels,
		output: RespondioEndpointOutputSchemas.contactChannels,
	},
	'contacts.lifecycle': {
		input: RespondioEndpointInputSchemas.contactLifecycle,
		output: RespondioEndpointOutputSchemas.contactLifecycle,
	},
	'conversations.assign': {
		input: RespondioEndpointInputSchemas.conversationAssign,
		output: RespondioEndpointOutputSchemas.conversationAssign,
	},
	'conversations.status': {
		input: RespondioEndpointInputSchemas.conversationStatus,
		output: RespondioEndpointOutputSchemas.conversationStatus,
	},
	'messages.send': {
		input: RespondioEndpointInputSchemas.messageSend,
		output: RespondioEndpointOutputSchemas.messageSend,
	},
	'messages.get': {
		input: RespondioEndpointInputSchemas.messageGet,
		output: RespondioEndpointOutputSchemas.messageGet,
	},
	'messages.list': {
		input: RespondioEndpointInputSchemas.messageList,
		output: RespondioEndpointOutputSchemas.messageList,
	},
	'messages.comment': {
		input: RespondioEndpointInputSchemas.commentCreate,
		output: RespondioEndpointOutputSchemas.commentCreate,
	},
	'space.listUsers': {
		input: RespondioEndpointInputSchemas.spaceListUsers,
		output: RespondioEndpointOutputSchemas.spaceListUsers,
	},
	'space.getUser': {
		input: RespondioEndpointInputSchemas.spaceGetUser,
		output: RespondioEndpointOutputSchemas.spaceGetUser,
	},
	'space.listChannels': {
		input: RespondioEndpointInputSchemas.spaceChannels,
		output: RespondioEndpointOutputSchemas.spaceChannels,
	},
	'space.listTemplates': {
		input: RespondioEndpointInputSchemas.spaceTemplates,
		output: RespondioEndpointOutputSchemas.spaceTemplates,
	},
	'space.listClosingNotes': {
		input: RespondioEndpointInputSchemas.spaceClosingNotes,
		output: RespondioEndpointOutputSchemas.spaceClosingNotes,
	},
	'space.listCustomFields': {
		input: RespondioEndpointInputSchemas.spaceCustomFields,
		output: RespondioEndpointOutputSchemas.spaceCustomFields,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof respondioEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const respondioEndpointMeta = {
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Read one contact by id:, email: or phone: identifier, with its fields, tags, assignee and lifecycle',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a contact at an identifier; respond.io needs processing time afterwards, so wait before acting on it',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: "Update a contact's fields by identifier",
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact and its conversation history',
	},
	'contacts.upsert': {
		riskLevel: 'write',
		description:
			'Create or update a contact in one call, which is the safe choice when you do not know whether it exists',
	},
	'contacts.merge': {
		riskLevel: 'destructive',
		description:
			'Merge two contacts by their IDs, setting the merged fields; the older contact stays and the other is removed',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts with an $and or $or filter over fields, tags and lifecycle, a free-text search, and cursor paging',
	},
	'contacts.addTags': {
		riskLevel: 'write',
		description: 'Add tags to a contact',
	},
	'contacts.deleteTags': {
		riskLevel: 'write',
		description: 'Remove tags from a contact',
	},
	'contacts.channels': {
		riskLevel: 'read',
		description:
			'List the channels a contact has interacted on, whose IDs a custom-payload message needs',
	},
	'contacts.lifecycle': {
		riskLevel: 'write',
		description:
			'Move a contact to a lifecycle stage by name, or clear it with null',
	},
	'conversations.assign': {
		riskLevel: 'write',
		description:
			'Assign a contact to a user, or unassign it by sending a null assignee',
	},
	'conversations.status': {
		riskLevel: 'write',
		description:
			"Open or close a contact's conversation, optionally recording a closing note and summary when closing",
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a message to a contact, on the last channel it used unless channelId is given; this reaches the customer',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Read one message by id, with its delivery status and sender',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			"List a contact's messages, optionally mixing in its comments; keep paging until pagination.next is null, since a page can be empty with more to come",
	},
	'messages.comment': {
		riskLevel: 'write',
		description:
			'Add an internal comment to a contact, which the customer never sees',
	},
	'space.listUsers': {
		riskLevel: 'read',
		description: 'List the workspace users',
	},
	'space.getUser': {
		riskLevel: 'read',
		description: 'Read one workspace user by ID',
	},
	'space.listChannels': {
		riskLevel: 'read',
		description: 'List the messaging channels connected in the workspace',
	},
	'space.listTemplates': {
		riskLevel: 'read',
		description: 'List the message templates of one connected channel',
	},
	'space.listClosingNotes': {
		riskLevel: 'read',
		description:
			'List the closing notes a conversation can be closed with, sorted by category',
	},
	'space.listCustomFields': {
		riskLevel: 'read',
		description:
			'List the custom field definitions, whose types a contact write must match',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof respondioEndpointsNested
>;

export type BaseRespondioPlugin<T extends RespondioPluginOptions> =
	CorsairPlugin<
		'respondio',
		typeof RespondioSchema,
		typeof respondioEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalRespondioPlugin =
	BaseRespondioPlugin<RespondioPluginOptions>;

export type ExternalRespondioPlugin<T extends RespondioPluginOptions> =
	BaseRespondioPlugin<T>;

export function respondio<const T extends RespondioPluginOptions>(
	incomingOptions: RespondioPluginOptions & T = {} as RespondioPluginOptions &
		T,
): ExternalRespondioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'respondio',
		schema: RespondioSchema,
		options: options,
		hooks: options.hooks,
		endpoints: respondioEndpointsNested,
		webhooks: {},
		endpointMeta: respondioEndpointMeta,
		endpointSchemas: respondioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RespondioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('respondio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRespondioPlugin;
}

export { RespondioAPIError } from './client';

export type {
	CommentCreateInput,
	CommentCreateResponse,
	ContactChannelsInput,
	ContactChannelsResponse,
	ContactCreateInput,
	ContactCreateResponse,
	ContactDeleteInput,
	ContactDeleteResponse,
	ContactGetInput,
	ContactGetResponse,
	ContactLifecycleInput,
	ContactLifecycleResponse,
	ContactListInput,
	ContactListResponse,
	ContactMergeInput,
	ContactMergeResponse,
	ContactTagsInput,
	ContactTagsResponse,
	ContactUpdateInput,
	ContactUpdateResponse,
	ContactUpsertInput,
	ContactUpsertResponse,
	ConversationAssignInput,
	ConversationAssignResponse,
	ConversationStatusInput,
	ConversationStatusResponse,
	MessageGetInput,
	MessageGetResponse,
	MessageListInput,
	MessageListResponse,
	MessageSendInput,
	MessageSendResponse,
	RespondioAck,
	RespondioContact,
	RespondioContactIdResponse,
	RespondioCustomField,
	RespondioEndpointInputs,
	RespondioEndpointOutputs,
	RespondioMessage,
	RespondioUser,
	SpaceChannelsInput,
	SpaceChannelsResponse,
	SpaceClosingNotesResponse,
	SpaceCustomFieldsResponse,
	SpaceGetUserInput,
	SpaceGetUserResponse,
	SpaceListUsersInput,
	SpaceTemplatesInput,
	SpaceTemplatesResponse,
	SpaceUsersResponse,
} from './endpoints/types';
