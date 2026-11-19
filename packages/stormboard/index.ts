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
import { Chat, Folders, Ideas, Storms, Tags, Users } from './endpoints';
import type {
	StormboardEndpointInputs,
	StormboardEndpointOutputs,
} from './endpoints/types';
import {
	StormboardEndpointInputSchemas,
	StormboardEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { StormboardSchema } from './schema';

export type StormboardPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Stormboard API key (stormboard.com/users/account#api). */
	key?: string;
	hooks?: InternalStormboardPlugin['hooks'];
	webhookHooks?: InternalStormboardPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof stormboardEndpointsNested>;
};

export type StormboardContext = CorsairPluginContext<
	typeof StormboardSchema,
	StormboardPluginOptions
>;

export type StormboardKeyBuilderContext =
	KeyBuilderContext<StormboardPluginOptions>;

export type StormboardBoundEndpoints = BindEndpoints<
	typeof stormboardEndpointsNested
>;

type StormboardEndpoint<K extends keyof StormboardEndpointOutputs> =
	CorsairEndpoint<
		StormboardContext,
		StormboardEndpointInputs[K],
		StormboardEndpointOutputs[K]
	>;

export type StormboardEndpoints = {
	[K in keyof StormboardEndpointOutputs]: StormboardEndpoint<K>;
};

const stormboardEndpointsNested = {
	users: {
		create: Users.create,
		verify: Users.verify,
		updateProfile: Users.updateProfile,
		getProfile: Users.getProfile,
		getAuth: Users.getAuth,
		test: Users.test,
		updateNotifications: Users.updateNotifications,
	},
	storms: {
		create: Storms.create,
		get: Storms.get,
		update: Storms.update,
		updateLegend: Storms.updateLegend,
		getTemplate: Storms.getTemplate,
		updateSection: Storms.updateSection,
		getAccess: Storms.getAccess,
		listIdeas: Storms.listIdeas,
		listUsers: Storms.listUsers,
		list: Storms.list,
		listInvites: Storms.listInvites,
		listConnectors: Storms.listConnectors,
		close: Storms.close,
		reopen: Storms.reopen,
		invite: Storms.invite,
		acceptInvite: Storms.acceptInvite,
		declineInvite: Storms.declineInvite,
		join: Storms.join,
		leave: Storms.leave,
		duplicate: Storms.duplicate,
		favorite: Storms.favorite,
		unfavorite: Storms.unfavorite,
	},
	ideas: {
		create: Ideas.create,
		update: Ideas.update,
		get: Ideas.get,
		delete: Ideas.remove,
		addVote: Ideas.addVote,
		removeVote: Ideas.removeVote,
		createComment: Ideas.createComment,
		updateComment: Ideas.updateComment,
		deleteComment: Ideas.deleteComment,
		listComments: Ideas.listComments,
		createConnector: Ideas.createConnector,
		updateConnector: Ideas.updateConnector,
		deleteConnector: Ideas.deleteConnector,
		deleteConnectorBetween: Ideas.deleteConnectorBetween,
		updateTask: Ideas.updateTask,
	},
	tags: {
		createForStorm: Tags.createForStorm,
		createForIdea: Tags.createForIdea,
		listForStorm: Tags.listForStorm,
		getForIdea: Tags.getForIdea,
	},
	chat: {
		create: Chat.create,
		list: Chat.list,
		listUnread: Chat.listUnread,
		markAllRead: Chat.markAllRead,
	},
	folders: {
		list: Folders.list,
	},
} as const;

export const stormboardEndpointSchemas = {
	'users.create': {
		input: StormboardEndpointInputSchemas.usersCreate,
		output: StormboardEndpointOutputSchemas.usersCreate,
	},
	'users.verify': {
		input: StormboardEndpointInputSchemas.usersVerify,
		output: StormboardEndpointOutputSchemas.usersVerify,
	},
	'users.updateProfile': {
		input: StormboardEndpointInputSchemas.usersUpdateProfile,
		output: StormboardEndpointOutputSchemas.usersUpdateProfile,
	},
	'users.getProfile': {
		input: StormboardEndpointInputSchemas.usersGetProfile,
		output: StormboardEndpointOutputSchemas.usersGetProfile,
	},
	'users.getAuth': {
		input: StormboardEndpointInputSchemas.usersGetAuth,
		output: StormboardEndpointOutputSchemas.usersGetAuth,
	},
	'users.test': {
		input: StormboardEndpointInputSchemas.usersTest,
		output: StormboardEndpointOutputSchemas.usersTest,
	},
	'users.updateNotifications': {
		input: StormboardEndpointInputSchemas.usersUpdateNotifications,
		output: StormboardEndpointOutputSchemas.usersUpdateNotifications,
	},
	'storms.create': {
		input: StormboardEndpointInputSchemas.stormsCreate,
		output: StormboardEndpointOutputSchemas.stormsCreate,
	},
	'storms.get': {
		input: StormboardEndpointInputSchemas.stormsGet,
		output: StormboardEndpointOutputSchemas.stormsGet,
	},
	'storms.update': {
		input: StormboardEndpointInputSchemas.stormsUpdate,
		output: StormboardEndpointOutputSchemas.stormsUpdate,
	},
	'storms.updateLegend': {
		input: StormboardEndpointInputSchemas.stormsUpdateLegend,
		output: StormboardEndpointOutputSchemas.stormsUpdateLegend,
	},
	'storms.getTemplate': {
		input: StormboardEndpointInputSchemas.stormsGetTemplate,
		output: StormboardEndpointOutputSchemas.stormsGetTemplate,
	},
	'storms.updateSection': {
		input: StormboardEndpointInputSchemas.stormsUpdateSection,
		output: StormboardEndpointOutputSchemas.stormsUpdateSection,
	},
	'storms.getAccess': {
		input: StormboardEndpointInputSchemas.stormsGetAccess,
		output: StormboardEndpointOutputSchemas.stormsGetAccess,
	},
	'storms.listIdeas': {
		input: StormboardEndpointInputSchemas.stormsListIdeas,
		output: StormboardEndpointOutputSchemas.stormsListIdeas,
	},
	'storms.listUsers': {
		input: StormboardEndpointInputSchemas.stormsListUsers,
		output: StormboardEndpointOutputSchemas.stormsListUsers,
	},
	'storms.list': {
		input: StormboardEndpointInputSchemas.stormsList,
		output: StormboardEndpointOutputSchemas.stormsList,
	},
	'storms.listInvites': {
		input: StormboardEndpointInputSchemas.stormsListInvites,
		output: StormboardEndpointOutputSchemas.stormsListInvites,
	},
	'storms.listConnectors': {
		input: StormboardEndpointInputSchemas.stormsListConnectors,
		output: StormboardEndpointOutputSchemas.stormsListConnectors,
	},
	'storms.close': {
		input: StormboardEndpointInputSchemas.stormsClose,
		output: StormboardEndpointOutputSchemas.stormsClose,
	},
	'storms.reopen': {
		input: StormboardEndpointInputSchemas.stormsReopen,
		output: StormboardEndpointOutputSchemas.stormsReopen,
	},
	'storms.invite': {
		input: StormboardEndpointInputSchemas.stormsInvite,
		output: StormboardEndpointOutputSchemas.stormsInvite,
	},
	'storms.acceptInvite': {
		input: StormboardEndpointInputSchemas.stormsAcceptInvite,
		output: StormboardEndpointOutputSchemas.stormsAcceptInvite,
	},
	'storms.declineInvite': {
		input: StormboardEndpointInputSchemas.stormsDeclineInvite,
		output: StormboardEndpointOutputSchemas.stormsDeclineInvite,
	},
	'storms.join': {
		input: StormboardEndpointInputSchemas.stormsJoin,
		output: StormboardEndpointOutputSchemas.stormsJoin,
	},
	'storms.leave': {
		input: StormboardEndpointInputSchemas.stormsLeave,
		output: StormboardEndpointOutputSchemas.stormsLeave,
	},
	'storms.duplicate': {
		input: StormboardEndpointInputSchemas.stormsDuplicate,
		output: StormboardEndpointOutputSchemas.stormsDuplicate,
	},
	'storms.favorite': {
		input: StormboardEndpointInputSchemas.stormsFavorite,
		output: StormboardEndpointOutputSchemas.stormsFavorite,
	},
	'storms.unfavorite': {
		input: StormboardEndpointInputSchemas.stormsUnfavorite,
		output: StormboardEndpointOutputSchemas.stormsUnfavorite,
	},
	'ideas.create': {
		input: StormboardEndpointInputSchemas.ideasCreate,
		output: StormboardEndpointOutputSchemas.ideasCreate,
	},
	'ideas.update': {
		input: StormboardEndpointInputSchemas.ideasUpdate,
		output: StormboardEndpointOutputSchemas.ideasUpdate,
	},
	'ideas.get': {
		input: StormboardEndpointInputSchemas.ideasGet,
		output: StormboardEndpointOutputSchemas.ideasGet,
	},
	'ideas.delete': {
		input: StormboardEndpointInputSchemas.ideasDelete,
		output: StormboardEndpointOutputSchemas.ideasDelete,
	},
	'ideas.addVote': {
		input: StormboardEndpointInputSchemas.ideasAddVote,
		output: StormboardEndpointOutputSchemas.ideasAddVote,
	},
	'ideas.removeVote': {
		input: StormboardEndpointInputSchemas.ideasRemoveVote,
		output: StormboardEndpointOutputSchemas.ideasRemoveVote,
	},
	'ideas.createComment': {
		input: StormboardEndpointInputSchemas.ideasCreateComment,
		output: StormboardEndpointOutputSchemas.ideasCreateComment,
	},
	'ideas.updateComment': {
		input: StormboardEndpointInputSchemas.ideasUpdateComment,
		output: StormboardEndpointOutputSchemas.ideasUpdateComment,
	},
	'ideas.deleteComment': {
		input: StormboardEndpointInputSchemas.ideasDeleteComment,
		output: StormboardEndpointOutputSchemas.ideasDeleteComment,
	},
	'ideas.listComments': {
		input: StormboardEndpointInputSchemas.ideasListComments,
		output: StormboardEndpointOutputSchemas.ideasListComments,
	},
	'ideas.createConnector': {
		input: StormboardEndpointInputSchemas.ideasCreateConnector,
		output: StormboardEndpointOutputSchemas.ideasCreateConnector,
	},
	'ideas.updateConnector': {
		input: StormboardEndpointInputSchemas.ideasUpdateConnector,
		output: StormboardEndpointOutputSchemas.ideasUpdateConnector,
	},
	'ideas.deleteConnector': {
		input: StormboardEndpointInputSchemas.ideasDeleteConnector,
		output: StormboardEndpointOutputSchemas.ideasDeleteConnector,
	},
	'ideas.deleteConnectorBetween': {
		input: StormboardEndpointInputSchemas.ideasDeleteConnectorBetween,
		output: StormboardEndpointOutputSchemas.ideasDeleteConnectorBetween,
	},
	'ideas.updateTask': {
		input: StormboardEndpointInputSchemas.ideasUpdateTask,
		output: StormboardEndpointOutputSchemas.ideasUpdateTask,
	},
	'tags.createForStorm': {
		input: StormboardEndpointInputSchemas.tagsCreateForStorm,
		output: StormboardEndpointOutputSchemas.tagsCreateForStorm,
	},
	'tags.createForIdea': {
		input: StormboardEndpointInputSchemas.tagsCreateForIdea,
		output: StormboardEndpointOutputSchemas.tagsCreateForIdea,
	},
	'tags.listForStorm': {
		input: StormboardEndpointInputSchemas.tagsListForStorm,
		output: StormboardEndpointOutputSchemas.tagsListForStorm,
	},
	'tags.getForIdea': {
		input: StormboardEndpointInputSchemas.tagsGetForIdea,
		output: StormboardEndpointOutputSchemas.tagsGetForIdea,
	},
	'chat.create': {
		input: StormboardEndpointInputSchemas.chatCreate,
		output: StormboardEndpointOutputSchemas.chatCreate,
	},
	'chat.list': {
		input: StormboardEndpointInputSchemas.chatList,
		output: StormboardEndpointOutputSchemas.chatList,
	},
	'chat.listUnread': {
		input: StormboardEndpointInputSchemas.chatListUnread,
		output: StormboardEndpointOutputSchemas.chatListUnread,
	},
	'chat.markAllRead': {
		input: StormboardEndpointInputSchemas.chatMarkAllRead,
		output: StormboardEndpointOutputSchemas.chatMarkAllRead,
	},
	'folders.list': {
		input: StormboardEndpointInputSchemas.foldersList,
		output: StormboardEndpointOutputSchemas.foldersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof stormboardEndpointsNested
>;

const stormboardEndpointMeta = {
	'users.create': {
		riskLevel: 'write',
		description: 'Create a Stormboard user and return its API key',
	},
	'users.verify': {
		riskLevel: 'write',
		description: 'Verify a Stormboard account with its verification code',
	},
	'users.updateProfile': {
		riskLevel: 'write',
		description: 'Update the profile behind the token',
	},
	'users.getProfile': {
		riskLevel: 'read',
		description: 'Read the profile behind the token',
	},
	'users.getAuth': {
		riskLevel: 'read',
		description: 'Read the account API keys with their creation dates',
	},
	'users.test': {
		riskLevel: 'read',
		description: 'Check that the token authenticates',
	},
	'users.updateNotifications': {
		riskLevel: 'write',
		description: 'Update the account notification settings',
	},
	'storms.create': {
		riskLevel: 'write',
		description: 'Create a Storm',
	},
	'storms.get': {
		riskLevel: 'read',
		description: "Read one Storm's details",
	},
	'storms.update': {
		riskLevel: 'write',
		description: "Update a Storm's title, description and settings",
	},
	'storms.updateLegend': {
		riskLevel: 'write',
		description: "Set the color labels of a Storm's legend",
	},
	'storms.getTemplate': {
		riskLevel: 'read',
		description: "Read a Storm's template sections",
	},
	'storms.updateSection': {
		riskLevel: 'write',
		description: 'Update one section of a Storm',
	},
	'storms.getAccess': {
		riskLevel: 'read',
		description: "Read the token holder's access to a Storm",
	},
	'storms.listIdeas': {
		riskLevel: 'read',
		description:
			"List a Storm's ideas, optionally filtered by last modified date",
	},
	'storms.listUsers': {
		riskLevel: 'read',
		description: "List a Storm's participants with their activity",
	},
	'storms.list': {
		riskLevel: 'read',
		description: 'List your Storms with search, ordering and paging',
	},
	'storms.listInvites': {
		riskLevel: 'read',
		description: 'List your Storm invites',
	},
	'storms.listConnectors': {
		riskLevel: 'read',
		description: 'List the line connectors in a Storm',
	},
	'storms.close': {
		riskLevel: 'write',
		description: 'Close a Storm; reopening restores it',
	},
	'storms.reopen': {
		riskLevel: 'write',
		description: 'Re-open a closed Storm',
	},
	'storms.invite': {
		riskLevel: 'destructive',
		description:
			'Invite participants to a Storm by email; sends mail that cannot be recalled',
		irreversible: true,
	},
	'storms.acceptInvite': {
		riskLevel: 'write',
		description: 'Accept a Storm invite for the token holder',
	},
	'storms.declineInvite': {
		riskLevel: 'write',
		description: 'Decline a Storm invite for the token holder',
	},
	'storms.join': {
		riskLevel: 'write',
		description: 'Join a Storm with its key',
	},
	'storms.leave': {
		riskLevel: 'write',
		description: 'Leave a Storm',
	},
	'storms.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a Storm',
	},
	'storms.favorite': {
		riskLevel: 'write',
		description: 'Star a Storm',
	},
	'storms.unfavorite': {
		riskLevel: 'write',
		description: "Remove a Storm's star",
	},
	'ideas.create': {
		riskLevel: 'write',
		description: 'Create an idea on a Storm',
	},
	'ideas.update': {
		riskLevel: 'write',
		description: "Update an idea's text, position and style",
	},
	'ideas.get': {
		riskLevel: 'read',
		description: 'Read one idea',
	},
	'ideas.delete': {
		riskLevel: 'destructive',
		description: 'Delete an idea',
		irreversible: true,
	},
	'ideas.addVote': {
		riskLevel: 'write',
		description: 'Add a vote to an idea',
	},
	'ideas.removeVote': {
		riskLevel: 'write',
		description: 'Remove a vote from an idea',
	},
	'ideas.createComment': {
		riskLevel: 'write',
		description: 'Comment on an idea',
	},
	'ideas.updateComment': {
		riskLevel: 'write',
		description: 'Edit a comment on an idea',
	},
	'ideas.deleteComment': {
		riskLevel: 'write',
		description: 'Delete a comment on an idea',
	},
	'ideas.listComments': {
		riskLevel: 'read',
		description: 'List the comments on an idea',
	},
	'ideas.createConnector': {
		riskLevel: 'write',
		description: 'Draw a line connector between two ideas',
	},
	'ideas.updateConnector': {
		riskLevel: 'write',
		description: "Update a line connector's label and style",
	},
	'ideas.deleteConnector': {
		riskLevel: 'destructive',
		description: 'Delete a line connector',
		irreversible: true,
	},
	'ideas.deleteConnectorBetween': {
		riskLevel: 'destructive',
		description: 'Delete the connector between two ideas',
		irreversible: true,
	},
	'ideas.updateTask': {
		riskLevel: 'write',
		description: "Update an idea's task assignment and dates",
	},
	'tags.createForStorm': {
		riskLevel: 'write',
		description: 'Create a tag in a Storm',
	},
	'tags.createForIdea': {
		riskLevel: 'write',
		description: 'Set tag data on an idea',
	},
	'tags.listForStorm': {
		riskLevel: 'read',
		description: 'List the tags in a Storm',
	},
	'tags.getForIdea': {
		riskLevel: 'read',
		description: 'Read the tag data of an idea',
	},
	'chat.create': {
		riskLevel: 'write',
		description: 'Post a chat message to a Storm',
	},
	'chat.list': {
		riskLevel: 'read',
		description: "List a Storm's chat messages",
	},
	'chat.listUnread': {
		riskLevel: 'read',
		description: "List a Storm's unread chat messages",
	},
	'chat.markAllRead': {
		riskLevel: 'write',
		description: "Mark a Storm's chat messages as read",
	},
	'folders.list': {
		riskLevel: 'read',
		description: "List a team's folders",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof stormboardEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const stormboardAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseStormboardPlugin<T extends StormboardPluginOptions> =
	CorsairPlugin<
		'stormboard',
		typeof StormboardSchema,
		typeof stormboardEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof stormboardAuthConfig
	>;

export type InternalStormboardPlugin =
	BaseStormboardPlugin<StormboardPluginOptions>;

export type ExternalStormboardPlugin<T extends StormboardPluginOptions> =
	BaseStormboardPlugin<T>;

export function stormboard<const T extends StormboardPluginOptions>(
	incomingOptions: StormboardPluginOptions & T = {} as StormboardPluginOptions &
		T,
): ExternalStormboardPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'stormboard',
		authConfig: stormboardAuthConfig,
		schema: StormboardSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: stormboardEndpointsNested,
		// Stormboard documents no outgoing webhooks.
		webhooks: {},
		endpointMeta: stormboardEndpointMeta,
		endpointSchemas: stormboardEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: StormboardKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('stormboard', ctx.authType ?? 'api_key');
		},
	} satisfies InternalStormboardPlugin;
}

export { StormboardAPIError } from './client';
export type {
	StormboardChatMessage,
	StormboardComment,
	StormboardConnector,
	StormboardEndpointInputs,
	StormboardEndpointOutputs,
	StormboardIdea,
	StormboardProfile,
	StormboardStorm,
	StormboardTag,
	StormboardTask,
	StormboardUserStub,
} from './endpoints/types';
