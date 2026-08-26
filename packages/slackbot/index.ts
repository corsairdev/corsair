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
	Calls,
	Canvases,
	Conversations,
	Files,
	Messages,
	Reminders,
	Team,
	UserGroups,
	Users,
} from './endpoints';
import type {
	SlackbotEndpointInputs,
	SlackbotEndpointOutputs,
} from './endpoints/types';
import {
	SlackbotEndpointInputSchemas,
	SlackbotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SlackbotSchema } from './schema';
import {
	ChannelWebhooks,
	MessageWebhooks,
	ReactionWebhooks,
	SetupWebhooks,
} from './webhooks';
import { resolveSlackbotOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchSlackbotTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ChannelCreatedEvent,
	MessageEvent,
	ReactionAddedEvent,
	ReactionRemovedEvent,
	SlackbotWebhookOutputs,
	UrlVerificationEvent,
} from './webhooks/types';
import {
	ChallengeResponseSchema,
	ChannelCreatedEventSchema,
	MessageEventSchema,
	ReactionAddedEventSchema,
	ReactionRemovedEventSchema,
	UrlVerificationSchema,
} from './webhooks/types';

export type SlackbotPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Bot token (`xoxb-…`), when not sourced from stored OAuth credentials. */
	key?: string;
	/**
	 * Slack app signing secret, used to verify `X-Slack-Signature` on inbound
	 * Events API requests. Distinct from the bot token: one authenticates
	 * outbound calls, the other authenticates inbound ones.
	 */
	signingSecret?: string;
	hooks?: InternalSlackbotPlugin['hooks'];
	webhookHooks?: InternalSlackbotPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof slackbotEndpointsNested>;
};

export type SlackbotContext = CorsairPluginContext<
	typeof SlackbotSchema,
	SlackbotPluginOptions
>;

export type SlackbotKeyBuilderContext =
	KeyBuilderContext<SlackbotPluginOptions>;

export type SlackbotBoundEndpoints = BindEndpoints<
	typeof slackbotEndpointsNested
>;

type SlackbotEndpoint<K extends keyof SlackbotEndpointOutputs> =
	CorsairEndpoint<
		SlackbotContext,
		SlackbotEndpointInputs[K],
		SlackbotEndpointOutputs[K]
	>;

/** Every operation, keyed exactly as in the endpoint schema registry. */
export type SlackbotEndpoints = {
	[K in keyof SlackbotEndpointOutputs]: SlackbotEndpoint<K>;
};

type SlackbotWebhook<
	K extends keyof SlackbotWebhookOutputs,
	TEvent,
> = CorsairWebhook<SlackbotContext, TEvent, SlackbotWebhookOutputs[K]>;

export type SlackbotWebhooks = {
	message: SlackbotWebhook<'message', MessageEvent>;
	directMessage: SlackbotWebhook<'directMessage', MessageEvent>;
	groupDirectMessage: SlackbotWebhook<'groupDirectMessage', MessageEvent>;
	privateChannelMessage: SlackbotWebhook<'privateChannelMessage', MessageEvent>;
	botMessage: SlackbotWebhook<'botMessage', MessageEvent>;
	threadReply: SlackbotWebhook<'threadReply', MessageEvent>;
	reactionAdded: SlackbotWebhook<'reactionAdded', ReactionAddedEvent>;
	reactionRemoved: SlackbotWebhook<'reactionRemoved', ReactionRemovedEvent>;
	channelCreated: SlackbotWebhook<'channelCreated', ChannelCreatedEvent>;
	challenge: SlackbotWebhook<'challenge', UrlVerificationEvent>;
};

export type SlackbotBoundWebhooks = BindWebhooks<SlackbotWebhooks>;

const slackbotEndpointsNested = {
	files: Files,
	messages: Messages,
	conversations: Conversations,
	users: Users,
	reminders: Reminders,
	userGroups: UserGroups,
	canvases: Canvases,
	calls: Calls,
	team: Team,
} as const;

const slackbotWebhooksNested = {
	messages: MessageWebhooks,
	reactions: ReactionWebhooks,
	channels: ChannelWebhooks,
	setup: SetupWebhooks,
} as const;

export const slackbotEndpointSchemas = {
	// files
	'files.info': {
		input: SlackbotEndpointInputSchemas.filesInfo,
		output: SlackbotEndpointOutputSchemas.filesInfo,
	},
	'files.list': {
		input: SlackbotEndpointInputSchemas.filesList,
		output: SlackbotEndpointOutputSchemas.filesList,
	},
	'files.delete': {
		input: SlackbotEndpointInputSchemas.filesDelete,
		output: SlackbotEndpointOutputSchemas.filesDelete,
	},
	'files.upload': {
		input: SlackbotEndpointInputSchemas.filesUpload,
		output: SlackbotEndpointOutputSchemas.filesUpload,
	},
	'files.download': {
		input: SlackbotEndpointInputSchemas.filesDownload,
		output: SlackbotEndpointOutputSchemas.filesDownload,
	},
	'files.commentsDelete': {
		input: SlackbotEndpointInputSchemas.filesCommentsDelete,
		output: SlackbotEndpointOutputSchemas.filesCommentsDelete,
	},
	'files.sharePublicUrl': {
		input: SlackbotEndpointInputSchemas.filesSharePublicUrl,
		output: SlackbotEndpointOutputSchemas.filesSharePublicUrl,
	},
	'files.revokePublicUrl': {
		input: SlackbotEndpointInputSchemas.filesRevokePublicUrl,
		output: SlackbotEndpointOutputSchemas.filesRevokePublicUrl,
	},
	'files.remoteAdd': {
		input: SlackbotEndpointInputSchemas.filesRemoteAdd,
		output: SlackbotEndpointOutputSchemas.filesRemoteAdd,
	},
	'files.remoteInfo': {
		input: SlackbotEndpointInputSchemas.filesRemoteInfo,
		output: SlackbotEndpointOutputSchemas.filesRemoteInfo,
	},
	'files.remoteList': {
		input: SlackbotEndpointInputSchemas.filesRemoteList,
		output: SlackbotEndpointOutputSchemas.filesRemoteList,
	},
	'files.remoteUpdate': {
		input: SlackbotEndpointInputSchemas.filesRemoteUpdate,
		output: SlackbotEndpointOutputSchemas.filesRemoteUpdate,
	},
	'files.remoteRemove': {
		input: SlackbotEndpointInputSchemas.filesRemoteRemove,
		output: SlackbotEndpointOutputSchemas.filesRemoteRemove,
	},
	'files.remoteShare': {
		input: SlackbotEndpointInputSchemas.filesRemoteShare,
		output: SlackbotEndpointOutputSchemas.filesRemoteShare,
	},
	// messages
	'messages.post': {
		input: SlackbotEndpointInputSchemas.messagesPost,
		output: SlackbotEndpointOutputSchemas.messagesPost,
	},
	'messages.postEphemeral': {
		input: SlackbotEndpointInputSchemas.messagesPostEphemeral,
		output: SlackbotEndpointOutputSchemas.messagesPostEphemeral,
	},
	'messages.postMe': {
		input: SlackbotEndpointInputSchemas.messagesPostMe,
		output: SlackbotEndpointOutputSchemas.messagesPostMe,
	},
	'messages.schedule': {
		input: SlackbotEndpointInputSchemas.messagesSchedule,
		output: SlackbotEndpointOutputSchemas.messagesSchedule,
	},
	'messages.deleteScheduled': {
		input: SlackbotEndpointInputSchemas.messagesDeleteScheduled,
		output: SlackbotEndpointOutputSchemas.messagesDeleteScheduled,
	},
	'messages.update': {
		input: SlackbotEndpointInputSchemas.messagesUpdate,
		output: SlackbotEndpointOutputSchemas.messagesUpdate,
	},
	'messages.delete': {
		input: SlackbotEndpointInputSchemas.messagesDelete,
		output: SlackbotEndpointOutputSchemas.messagesDelete,
	},
	'messages.history': {
		input: SlackbotEndpointInputSchemas.messagesHistory,
		output: SlackbotEndpointOutputSchemas.messagesHistory,
	},
	'messages.replies': {
		input: SlackbotEndpointInputSchemas.messagesReplies,
		output: SlackbotEndpointOutputSchemas.messagesReplies,
	},
	'messages.reactionAdd': {
		input: SlackbotEndpointInputSchemas.messagesReactionAdd,
		output: SlackbotEndpointOutputSchemas.messagesReactionAdd,
	},
	'messages.reactionRemove': {
		input: SlackbotEndpointInputSchemas.messagesReactionRemove,
		output: SlackbotEndpointOutputSchemas.messagesReactionRemove,
	},
	'messages.reactionsGet': {
		input: SlackbotEndpointInputSchemas.messagesReactionsGet,
		output: SlackbotEndpointOutputSchemas.messagesReactionsGet,
	},
	'messages.reactionsList': {
		input: SlackbotEndpointInputSchemas.messagesReactionsList,
		output: SlackbotEndpointOutputSchemas.messagesReactionsList,
	},
	'messages.pinAdd': {
		input: SlackbotEndpointInputSchemas.messagesPinAdd,
		output: SlackbotEndpointOutputSchemas.messagesPinAdd,
	},
	'messages.pinRemove': {
		input: SlackbotEndpointInputSchemas.messagesPinRemove,
		output: SlackbotEndpointOutputSchemas.messagesPinRemove,
	},
	'messages.pinsList': {
		input: SlackbotEndpointInputSchemas.messagesPinsList,
		output: SlackbotEndpointOutputSchemas.messagesPinsList,
	},
	// conversations
	'conversations.create': {
		input: SlackbotEndpointInputSchemas.conversationsCreate,
		output: SlackbotEndpointOutputSchemas.conversationsCreate,
	},
	'conversations.info': {
		input: SlackbotEndpointInputSchemas.conversationsInfo,
		output: SlackbotEndpointOutputSchemas.conversationsInfo,
	},
	'conversations.list': {
		input: SlackbotEndpointInputSchemas.conversationsList,
		output: SlackbotEndpointOutputSchemas.conversationsList,
	},
	'conversations.listForUser': {
		input: SlackbotEndpointInputSchemas.conversationsListForUser,
		output: SlackbotEndpointOutputSchemas.conversationsListForUser,
	},
	'conversations.find': {
		input: SlackbotEndpointInputSchemas.conversationsFind,
		output: SlackbotEndpointOutputSchemas.conversationsFind,
	},
	'conversations.members': {
		input: SlackbotEndpointInputSchemas.conversationsMembers,
		output: SlackbotEndpointOutputSchemas.conversationsMembers,
	},
	'conversations.invite': {
		input: SlackbotEndpointInputSchemas.conversationsInvite,
		output: SlackbotEndpointOutputSchemas.conversationsInvite,
	},
	'conversations.kick': {
		input: SlackbotEndpointInputSchemas.conversationsKick,
		output: SlackbotEndpointOutputSchemas.conversationsKick,
	},
	'conversations.join': {
		input: SlackbotEndpointInputSchemas.conversationsJoin,
		output: SlackbotEndpointOutputSchemas.conversationsJoin,
	},
	'conversations.leave': {
		input: SlackbotEndpointInputSchemas.conversationsLeave,
		output: SlackbotEndpointOutputSchemas.conversationsLeave,
	},
	'conversations.rename': {
		input: SlackbotEndpointInputSchemas.conversationsRename,
		output: SlackbotEndpointOutputSchemas.conversationsRename,
	},
	'conversations.setPurpose': {
		input: SlackbotEndpointInputSchemas.conversationsSetPurpose,
		output: SlackbotEndpointOutputSchemas.conversationsSetPurpose,
	},
	'conversations.setTopic': {
		input: SlackbotEndpointInputSchemas.conversationsSetTopic,
		output: SlackbotEndpointOutputSchemas.conversationsSetTopic,
	},
	'conversations.mark': {
		input: SlackbotEndpointInputSchemas.conversationsMark,
		output: SlackbotEndpointOutputSchemas.conversationsMark,
	},
	'conversations.archive': {
		input: SlackbotEndpointInputSchemas.conversationsArchive,
		output: SlackbotEndpointOutputSchemas.conversationsArchive,
	},
	'conversations.unarchive': {
		input: SlackbotEndpointInputSchemas.conversationsUnarchive,
		output: SlackbotEndpointOutputSchemas.conversationsUnarchive,
	},
	'conversations.close': {
		input: SlackbotEndpointInputSchemas.conversationsClose,
		output: SlackbotEndpointOutputSchemas.conversationsClose,
	},
	// users
	'users.list': {
		input: SlackbotEndpointInputSchemas.usersList,
		output: SlackbotEndpointOutputSchemas.usersList,
	},
	'users.find': {
		input: SlackbotEndpointInputSchemas.usersFind,
		output: SlackbotEndpointOutputSchemas.usersFind,
	},
	'users.info': {
		input: SlackbotEndpointInputSchemas.usersInfo,
		output: SlackbotEndpointOutputSchemas.usersInfo,
	},
	'users.getProfile': {
		input: SlackbotEndpointInputSchemas.usersGetProfile,
		output: SlackbotEndpointOutputSchemas.usersGetProfile,
	},
	'users.getPresence': {
		input: SlackbotEndpointInputSchemas.usersGetPresence,
		output: SlackbotEndpointOutputSchemas.usersGetPresence,
	},
	'users.setPresence': {
		input: SlackbotEndpointInputSchemas.usersSetPresence,
		output: SlackbotEndpointOutputSchemas.usersSetPresence,
	},
	'users.setActive': {
		input: SlackbotEndpointInputSchemas.usersSetActive,
		output: SlackbotEndpointOutputSchemas.usersSetActive,
	},
	'users.lookupByEmail': {
		input: SlackbotEndpointInputSchemas.usersLookupByEmail,
		output: SlackbotEndpointOutputSchemas.usersLookupByEmail,
	},
	'users.botsInfo': {
		input: SlackbotEndpointInputSchemas.usersBotsInfo,
		output: SlackbotEndpointOutputSchemas.usersBotsInfo,
	},
	'users.dndInfo': {
		input: SlackbotEndpointInputSchemas.usersDndInfo,
		output: SlackbotEndpointOutputSchemas.usersDndInfo,
	},
	'users.dndTeamInfo': {
		input: SlackbotEndpointInputSchemas.usersDndTeamInfo,
		output: SlackbotEndpointOutputSchemas.usersDndTeamInfo,
	},
	// reminders
	'reminders.add': {
		input: SlackbotEndpointInputSchemas.remindersAdd,
		output: SlackbotEndpointOutputSchemas.remindersAdd,
	},
	'reminders.info': {
		input: SlackbotEndpointInputSchemas.remindersInfo,
		output: SlackbotEndpointOutputSchemas.remindersInfo,
	},
	'reminders.list': {
		input: SlackbotEndpointInputSchemas.remindersList,
		output: SlackbotEndpointOutputSchemas.remindersList,
	},
	'reminders.delete': {
		input: SlackbotEndpointInputSchemas.remindersDelete,
		output: SlackbotEndpointOutputSchemas.remindersDelete,
	},
	'reminders.complete': {
		input: SlackbotEndpointInputSchemas.remindersComplete,
		output: SlackbotEndpointOutputSchemas.remindersComplete,
	},
	// userGroups
	'userGroups.create': {
		input: SlackbotEndpointInputSchemas.userGroupsCreate,
		output: SlackbotEndpointOutputSchemas.userGroupsCreate,
	},
	'userGroups.update': {
		input: SlackbotEndpointInputSchemas.userGroupsUpdate,
		output: SlackbotEndpointOutputSchemas.userGroupsUpdate,
	},
	'userGroups.list': {
		input: SlackbotEndpointInputSchemas.userGroupsList,
		output: SlackbotEndpointOutputSchemas.userGroupsList,
	},
	'userGroups.disable': {
		input: SlackbotEndpointInputSchemas.userGroupsDisable,
		output: SlackbotEndpointOutputSchemas.userGroupsDisable,
	},
	'userGroups.enable': {
		input: SlackbotEndpointInputSchemas.userGroupsEnable,
		output: SlackbotEndpointOutputSchemas.userGroupsEnable,
	},
	'userGroups.usersList': {
		input: SlackbotEndpointInputSchemas.userGroupsUsersList,
		output: SlackbotEndpointOutputSchemas.userGroupsUsersList,
	},
	'userGroups.usersUpdate': {
		input: SlackbotEndpointInputSchemas.userGroupsUsersUpdate,
		output: SlackbotEndpointOutputSchemas.userGroupsUsersUpdate,
	},
	// canvases
	'canvases.create': {
		input: SlackbotEndpointInputSchemas.canvasesCreate,
		output: SlackbotEndpointOutputSchemas.canvasesCreate,
	},
	'canvases.edit': {
		input: SlackbotEndpointInputSchemas.canvasesEdit,
		output: SlackbotEndpointOutputSchemas.canvasesEdit,
	},
	'canvases.delete': {
		input: SlackbotEndpointInputSchemas.canvasesDelete,
		output: SlackbotEndpointOutputSchemas.canvasesDelete,
	},
	'canvases.get': {
		input: SlackbotEndpointInputSchemas.canvasesGet,
		output: SlackbotEndpointOutputSchemas.canvasesGet,
	},
	'canvases.list': {
		input: SlackbotEndpointInputSchemas.canvasesList,
		output: SlackbotEndpointOutputSchemas.canvasesList,
	},
	'canvases.sectionsLookup': {
		input: SlackbotEndpointInputSchemas.canvasesSectionsLookup,
		output: SlackbotEndpointOutputSchemas.canvasesSectionsLookup,
	},
	// calls
	'calls.add': {
		input: SlackbotEndpointInputSchemas.callsAdd,
		output: SlackbotEndpointOutputSchemas.callsAdd,
	},
	'calls.info': {
		input: SlackbotEndpointInputSchemas.callsInfo,
		output: SlackbotEndpointOutputSchemas.callsInfo,
	},
	'calls.update': {
		input: SlackbotEndpointInputSchemas.callsUpdate,
		output: SlackbotEndpointOutputSchemas.callsUpdate,
	},
	'calls.end': {
		input: SlackbotEndpointInputSchemas.callsEnd,
		output: SlackbotEndpointOutputSchemas.callsEnd,
	},
	'calls.participantsAdd': {
		input: SlackbotEndpointInputSchemas.callsParticipantsAdd,
		output: SlackbotEndpointOutputSchemas.callsParticipantsAdd,
	},
	'calls.participantsRemove': {
		input: SlackbotEndpointInputSchemas.callsParticipantsRemove,
		output: SlackbotEndpointOutputSchemas.callsParticipantsRemove,
	},
	// team
	'team.info': {
		input: SlackbotEndpointInputSchemas.teamInfo,
		output: SlackbotEndpointOutputSchemas.teamInfo,
	},
	'team.profileGet': {
		input: SlackbotEndpointInputSchemas.teamProfileGet,
		output: SlackbotEndpointOutputSchemas.teamProfileGet,
	},
	'team.emojiList': {
		input: SlackbotEndpointInputSchemas.teamEmojiList,
		output: SlackbotEndpointOutputSchemas.teamEmojiList,
	},
	'team.unfurl': {
		input: SlackbotEndpointInputSchemas.teamUnfurl,
		output: SlackbotEndpointOutputSchemas.teamUnfurl,
	},
	'team.openDm': {
		input: SlackbotEndpointInputSchemas.teamOpenDm,
		output: SlackbotEndpointOutputSchemas.teamOpenDm,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof slackbotEndpointsNested
>;

const slackbotEndpointMeta = {
	// files
	'files.info': {
		riskLevel: 'read',
		description: 'Retrieve detailed information about a file',
	},
	'files.list': {
		riskLevel: 'read',
		description:
			'List files in the workspace, filtered by channel, user or type',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a file by ID',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file to Slack and optionally share it to a channel',
	},
	'files.download': {
		riskLevel: 'read',
		description: 'Download the contents of a Slack file',
	},
	'files.commentsDelete': {
		riskLevel: 'destructive',
		description: 'Delete a comment on a file',
	},
	'files.sharePublicUrl': {
		riskLevel: 'write',
		description: 'Create a public URL for a file',
	},
	'files.revokePublicUrl': {
		riskLevel: 'write',
		description: 'Revoke a file public URL',
	},
	'files.remoteAdd': {
		riskLevel: 'write',
		description: 'Register an externally hosted file with Slack',
	},
	'files.remoteInfo': {
		riskLevel: 'read',
		description: 'Retrieve a remote file metadata',
	},
	'files.remoteList': {
		riskLevel: 'read',
		description: 'List remote files',
	},
	'files.remoteUpdate': {
		riskLevel: 'write',
		description: 'Update an existing remote file',
	},
	'files.remoteRemove': {
		riskLevel: 'destructive',
		description: 'Remove a remote file',
	},
	'files.remoteShare': {
		riskLevel: 'write',
		description: 'Share a remote file into one or more channels',
	},
	// messages
	'messages.post': {
		riskLevel: 'write',
		description: 'Send a message to a channel, DM or thread',
	},
	'messages.postEphemeral': {
		riskLevel: 'write',
		description: 'Send a message visible only to a single user',
	},
	'messages.postMe': {
		riskLevel: 'write',
		description: 'Send a me-style message to a channel',
	},
	'messages.schedule': {
		riskLevel: 'write',
		description: 'Schedule a message to be sent at a future time',
	},
	'messages.deleteScheduled': {
		riskLevel: 'destructive',
		description: 'Cancel a scheduled message before it sends',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Update the text or blocks of an existing message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message from a conversation',
	},
	'messages.history': {
		riskLevel: 'read',
		description: 'Fetch a conversation message history',
	},
	'messages.replies': {
		riskLevel: 'read',
		description: 'Fetch the replies in a message thread',
	},
	'messages.reactionAdd': {
		riskLevel: 'write',
		description: 'Add an emoji reaction to a message',
	},
	'messages.reactionRemove': {
		riskLevel: 'destructive',
		description: 'Remove an emoji reaction from a message',
	},
	'messages.reactionsGet': {
		riskLevel: 'read',
		description: 'Fetch the reactions on a message or file',
	},
	'messages.reactionsList': {
		riskLevel: 'read',
		description: 'List the items a user has reacted to',
	},
	'messages.pinAdd': {
		riskLevel: 'write',
		description: 'Pin a message to a channel',
	},
	'messages.pinRemove': {
		riskLevel: 'destructive',
		description: 'Unpin a message from a channel',
	},
	'messages.pinsList': {
		riskLevel: 'read',
		description: 'List the pinned items in a channel',
	},
	// conversations
	'conversations.create': {
		riskLevel: 'write',
		description: 'Create a public or private channel',
	},
	'conversations.info': {
		riskLevel: 'read',
		description: 'Retrieve information about a conversation',
	},
	'conversations.list': {
		riskLevel: 'read',
		description: 'List conversations in the workspace',
	},
	'conversations.listForUser': {
		riskLevel: 'read',
		description: 'List the conversations a user belongs to',
	},
	'conversations.find': {
		riskLevel: 'read',
		description: 'Search conversations by name',
	},
	'conversations.members': {
		riskLevel: 'read',
		description: 'List the members of a conversation',
	},
	'conversations.invite': {
		riskLevel: 'write',
		description: 'Invite users to a channel',
	},
	'conversations.kick': {
		riskLevel: 'destructive',
		description: 'Remove a user from a conversation',
	},
	'conversations.join': {
		riskLevel: 'write',
		description: 'Join a public channel',
	},
	'conversations.leave': {
		riskLevel: 'write',
		description: 'Leave a conversation',
	},
	'conversations.rename': {
		riskLevel: 'write',
		description: 'Rename a conversation',
	},
	'conversations.setPurpose': {
		riskLevel: 'write',
		description: 'Set a conversation purpose',
	},
	'conversations.setTopic': {
		riskLevel: 'write',
		description: 'Set a conversation topic',
	},
	'conversations.mark': {
		riskLevel: 'write',
		description: 'Move a conversation read cursor',
	},
	'conversations.archive': {
		riskLevel: 'destructive',
		description: 'Archive a conversation',
	},
	'conversations.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive a conversation',
	},
	'conversations.close': {
		riskLevel: 'write',
		description: 'Close a direct message or group conversation',
	},
	// users
	'users.list': {
		riskLevel: 'read',
		description: 'List the users in the workspace',
	},
	'users.find': {
		riskLevel: 'read',
		description: 'Search users by name, display name or email',
	},
	'users.info': {
		riskLevel: 'read',
		description: 'Retrieve detailed information about a user',
	},
	'users.getProfile': {
		riskLevel: 'read',
		description: 'Retrieve a user profile',
	},
	'users.getPresence': {
		riskLevel: 'read',
		description: 'Retrieve a user presence',
	},
	'users.setPresence': {
		riskLevel: 'write',
		description: 'Set the calling user presence',
	},
	'users.setActive': {
		riskLevel: 'write',
		description: 'Mark the calling user as active',
	},
	'users.lookupByEmail': {
		riskLevel: 'read',
		description: 'Look up a user by email address (deprecated by Slack)',
	},
	'users.botsInfo': {
		riskLevel: 'read',
		description: 'Retrieve information about a bot user',
	},
	'users.dndInfo': {
		riskLevel: 'read',
		description: 'Retrieve a user do-not-disturb status',
	},
	'users.dndTeamInfo': {
		riskLevel: 'read',
		description: 'Retrieve do-not-disturb status for several users',
	},
	// reminders
	'reminders.add': {
		riskLevel: 'write',
		description: 'Create a reminder',
	},
	'reminders.info': {
		riskLevel: 'read',
		description: 'Retrieve information about a reminder',
	},
	'reminders.list': {
		riskLevel: 'read',
		description: 'List the reminders visible to the token',
	},
	'reminders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a reminder',
	},
	'reminders.complete': {
		riskLevel: 'write',
		description: 'Mark a reminder complete (deprecated by Slack)',
	},
	// userGroups
	'userGroups.create': {
		riskLevel: 'write',
		description: 'Create a user group',
	},
	'userGroups.update': {
		riskLevel: 'write',
		description: 'Update a user group name, handle or channels',
	},
	'userGroups.list': {
		riskLevel: 'read',
		description: 'List the workspace user groups',
	},
	'userGroups.disable': {
		riskLevel: 'write',
		description: 'Disable a user group',
	},
	'userGroups.enable': {
		riskLevel: 'write',
		description: 'Enable a user group',
	},
	'userGroups.usersList': {
		riskLevel: 'read',
		description: 'List the members of a user group',
	},
	'userGroups.usersUpdate': {
		riskLevel: 'write',
		description: 'Replace a user group membership',
	},
	// canvases
	'canvases.create': {
		riskLevel: 'write',
		description: 'Create a standalone or channel canvas',
	},
	'canvases.edit': {
		riskLevel: 'write',
		description: 'Apply changes to a canvas',
	},
	'canvases.delete': {
		riskLevel: 'destructive',
		description: 'Delete a canvas',
	},
	'canvases.get': {
		riskLevel: 'read',
		description: 'Retrieve a canvas and its content',
	},
	'canvases.list': {
		riskLevel: 'read',
		description: 'List canvases in the workspace',
	},
	'canvases.sectionsLookup': {
		riskLevel: 'read',
		description: 'Look up section ids within a canvas',
	},
	// calls
	'calls.add': {
		riskLevel: 'write',
		description: 'Register a call with Slack',
	},
	'calls.info': {
		riskLevel: 'read',
		description: 'Retrieve information about a call',
	},
	'calls.update': {
		riskLevel: 'write',
		description: 'Update a call title or join URLs',
	},
	'calls.end': {
		riskLevel: 'write',
		description: 'End an in-progress call',
	},
	'calls.participantsAdd': {
		riskLevel: 'write',
		description: 'Add participants to a call',
	},
	'calls.participantsRemove': {
		riskLevel: 'write',
		description: 'Remove participants from a call',
	},
	// team
	'team.info': {
		riskLevel: 'read',
		description: 'Fetch workspace information',
	},
	'team.profileGet': {
		riskLevel: 'read',
		description: 'Fetch the workspace profile field definitions',
	},
	'team.emojiList': {
		riskLevel: 'read',
		description: 'List the workspace custom emoji',
	},
	'team.unfurl': {
		riskLevel: 'write',
		description: 'Attach a custom preview to a link in a message',
	},
	'team.openDm': {
		riskLevel: 'write',
		description: 'Open a direct or multi-person direct message',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof slackbotEndpointsNested>;

const slackbotWebhookSchemas = {
	'messages.message': {
		description: 'A message posted by a person in a public channel',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
	'messages.directMessage': {
		description: 'A direct message sent to the bot',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
	'messages.groupDirectMessage': {
		description: 'A message in a multi-person direct message',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
	'messages.privateChannelMessage': {
		description: 'A message posted by a person in a private channel',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
	'messages.botMessage': {
		description: 'A message posted by another bot or app',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
	'messages.threadReply': {
		description: 'A reply posted inside a message thread',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
	'reactions.added': {
		description: 'An emoji reaction added to a message or file',
		payload: ReactionAddedEventSchema,
		response: ReactionAddedEventSchema,
	},
	'reactions.removed': {
		description: 'An emoji reaction removed from a message or file',
		payload: ReactionRemovedEventSchema,
		response: ReactionRemovedEventSchema,
	},
	'channels.created': {
		description: 'A new channel created in the workspace',
		payload: ChannelCreatedEventSchema,
		response: ChannelCreatedEventSchema,
	},
	'setup.challenge': {
		description: 'Slack Events API URL verification handshake',
		payload: UrlVerificationSchema,
		response: ChallengeResponseSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof slackbotWebhooksNested
>;

/**
 * Slack bot installs are per-workspace, so credentials and inbound webhooks are
 * both keyed on `team_id` — the same id `oauth.v2.access` returns and the
 * Events API stamps on every delivery.
 */
export const slackbotAuthConfig = {
	oauth_2: {
		account: ['team_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export type BaseSlackbotPlugin<T extends SlackbotPluginOptions> = CorsairPlugin<
	'slackbot',
	typeof SlackbotSchema,
	typeof slackbotEndpointsNested,
	typeof slackbotWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSlackbotPlugin = BaseSlackbotPlugin<SlackbotPluginOptions>;

export type ExternalSlackbotPlugin<T extends SlackbotPluginOptions> =
	BaseSlackbotPlugin<T>;

export function slackbot<const T extends SlackbotPluginOptions>(
	incomingOptions: SlackbotPluginOptions & T = {} as SlackbotPluginOptions & T,
): ExternalSlackbotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'slackbot',
		authConfig: slackbotAuthConfig,
		schema: SlackbotSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: slackbotEndpointsNested,
		webhooks: slackbotWebhooksNested,
		endpointMeta: slackbotEndpointMeta,
		endpointSchemas: slackbotEndpointSchemas,
		webhookSchemas: slackbotWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// Every Events API delivery is signed. The URL verification handshake
			// is signed too, so this claims the setup request as well.
			return 'x-slack-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchSlackbotTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSlackbotOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SlackbotKeyBuilderContext, source) => {
			// Inbound requests are verified with the signing secret; outbound calls
			// are authorised with the bot token. They are different secrets and must
			// never be interchanged.
			if (source === 'webhook') {
				if (options.signingSecret) return options.signingSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint') {
				if (options.key) return options.key;
				const token = await ctx.keys.get_access_token();
				return token ?? '';
			}

			return '';
		},
	} satisfies InternalSlackbotPlugin;
}

export {
	Calls,
	Canvases,
	Conversations,
	Files,
	Messages,
	Reminders,
	Team,
	UserGroups,
	Users,
} from './endpoints';
export type {
	SlackbotEndpointInputs,
	SlackbotEndpointName,
	SlackbotEndpointOutputs,
	SlackCall,
	SlackCallUser,
	SlackCanvasChange,
	SlackChannel,
	SlackConversationType,
	SlackFile,
	SlackMessage,
	SlackReminder,
	SlackUser,
	SlackUserGroup,
} from './endpoints/types';
export { SlackbotSchema } from './schema';
export type {
	ChannelCreatedEvent,
	MessageEvent,
	ReactionAddedEvent,
	ReactionRemovedEvent,
	SlackbotWebhookOutputs,
	SlackChannelType,
	UrlVerificationEvent,
} from './webhooks/types';
