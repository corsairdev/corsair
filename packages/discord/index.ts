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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Channels,
	Commands,
	Generated,
	Guilds,
	Members,
	Messages,
	Moderation,
	Reactions,
	Threads,
} from './endpoints';
import type {
	BulkDeleteMessagesInput,
	ChannelsListInput,
	DiscordEndpointOutputs,
	GuildsGetInput,
	GuildsListInput,
	MembersGetInput,
	MembersListInput,
	MessagesDeleteInput,
	MessagesEditInput,
	MessagesGetInput,
	MessagesListInput,
	MessagesReplyInput,
	MessagesSendInput,
	ReactionsAddInput,
	ReactionsListInput,
	ReactionsRemoveInput,
	ThreadsCreateFromMessageInput,
	ThreadsCreateInput,
} from './endpoints/types';
import {
	DiscordEndpointInputSchemas,
	DiscordEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DiscordSchema } from './schema';
import { InteractionWebhooks } from './webhooks';
import { matchDiscordTenantWebhook } from './webhooks/tenant-matcher';
import type {
	DiscordApplicationCommandInteraction,
	DiscordMessageComponentInteraction,
	DiscordModalSubmitInteraction,
	DiscordWebhookOutputs,
} from './webhooks/types';
import {
	DiscordApplicationCommandInteractionSchema,
	DiscordMessageComponentInteractionSchema,
	DiscordModalSubmitInteractionSchema,
	DiscordPingInteractionSchema,
} from './webhooks/types';

// ── Plugin Options ─────────────────────────────────────────────────────────────

export type DiscordPluginOptions = {
	/**
	 * Authentication method. Discord bots use an API key (bot token).
	 */
	authType?: PickAuth<'api_key'>;
	/**
	 * Bot token for Discord API calls (e.g. "MTk4NjIyNDgzNDcxOTI1MjQ4.Cl2FDg...").
	 * If omitted the key manager is used to retrieve it.
	 */
	key?: string;
	/**
	 * Ed25519 public key for verifying incoming interaction webhooks.
	 * Found in the Discord Developer Portal under Application > General Information.
	 * If omitted the key manager's webhook_signature store is used.
	 */
	publicKey?: string;
	/** Lifecycle hooks for API endpoints. */
	hooks?: InternalDiscordPlugin['hooks'];
	/** Lifecycle hooks for webhook handlers. */
	webhookHooks?: InternalDiscordPlugin['webhookHooks'];
	/** Custom error handlers (merged with built-in defaults). */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Discord plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Discord endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof discordEndpointsNested>;
};

// ── Context ────────────────────────────────────────────────────────────────────

export type DiscordContext = CorsairPluginContext<
	typeof DiscordSchema,
	DiscordPluginOptions
>;

export type DiscordKeyBuilderContext = KeyBuilderContext<DiscordPluginOptions>;

// ── Endpoint Types ─────────────────────────────────────────────────────────────

export type DiscordBoundEndpoints = BindEndpoints<
	typeof discordEndpointsNested
>;

type DiscordEndpoint<
	K extends keyof DiscordEndpointOutputs,
	Input,
> = CorsairEndpoint<DiscordContext, Input, DiscordEndpointOutputs[K]>;

export type DiscordEndpoints = {
	// Messages
	messagesSend: DiscordEndpoint<'messagesSend', MessagesSendInput>;
	messagesReply: DiscordEndpoint<'messagesReply', MessagesReplyInput>;
	messagesGet: DiscordEndpoint<'messagesGet', MessagesGetInput>;
	messagesList: DiscordEndpoint<'messagesList', MessagesListInput>;
	messagesEdit: DiscordEndpoint<'messagesEdit', MessagesEditInput>;
	messagesDelete: DiscordEndpoint<'messagesDelete', MessagesDeleteInput>;
	// Threads
	threadsCreate: DiscordEndpoint<'threadsCreate', ThreadsCreateInput>;
	threadsCreateFromMessage: DiscordEndpoint<
		'threadsCreateFromMessage',
		ThreadsCreateFromMessageInput
	>;
	// Reactions
	reactionsAdd: DiscordEndpoint<'reactionsAdd', ReactionsAddInput>;
	reactionsRemove: DiscordEndpoint<'reactionsRemove', ReactionsRemoveInput>;
	reactionsList: DiscordEndpoint<'reactionsList', ReactionsListInput>;
	// Guilds
	guildsList: DiscordEndpoint<'guildsList', GuildsListInput>;
	guildsGet: DiscordEndpoint<'guildsGet', GuildsGetInput>;
	// Channels
	channelsList: DiscordEndpoint<'channelsList', ChannelsListInput>;
	// Members
	membersList: DiscordEndpoint<'membersList', MembersListInput>;
	membersGet: DiscordEndpoint<'membersGet', MembersGetInput>;
};

// ── Webhook Types ──────────────────────────────────────────────────────────────

type DiscordWebhook<
	K extends keyof DiscordWebhookOutputs,
	TEvent,
> = CorsairWebhook<DiscordContext, TEvent, DiscordWebhookOutputs[K]>;

export type DiscordWebhooks = {
	ping: DiscordWebhook<'ping', { type: 1 }>;
	applicationCommand: DiscordWebhook<
		'applicationCommand',
		DiscordApplicationCommandInteraction
	>;
	messageComponent: DiscordWebhook<
		'messageComponent',
		DiscordMessageComponentInteraction
	>;
	modalSubmit: DiscordWebhook<'modalSubmit', DiscordModalSubmitInteraction>;
};

export type DiscordBoundWebhooks = BindWebhooks<DiscordWebhooks>;

// ── Endpoint & Webhook Trees ───────────────────────────────────────────────────

const discordEndpointsNested = {
	messages: {
		send: Messages.send,
		reply: Messages.reply,
		get: Messages.get,
		list: Messages.list,
		edit: Messages.edit,
		delete: Messages.del,
	},
	threads: {
		create: Threads.create,
		createFromMessage: Threads.createFromMessage,
	},
	reactions: {
		add: Reactions.add,
		remove: Reactions.remove,
		list: Reactions.list,
	},
	guilds: {
		list: Guilds.list,
		get: Guilds.get,
	},
	channels: {
		list: Channels.list,
	},
	members: {
		list: Members.list,
		get: Members.get,
	},
	commands: Commands,
	moderation: Moderation,
	generated: Generated,
} as const;

export const discordEndpointSchemas = {
	'generated.followChannel': {
		input: DiscordEndpointInputSchemas.followChannel,
		output: DiscordEndpointOutputSchemas.followChannel,
	},
	'generated.addGuildMember': {
		input: DiscordEndpointInputSchemas.addGuildMember,
		output: DiscordEndpointOutputSchemas.addGuildMember,
	},
	'generated.addMyMessageReaction': {
		input: DiscordEndpointInputSchemas.addMyMessageReaction,
		output: DiscordEndpointOutputSchemas.addMyMessageReaction,
	},
	'generated.addGroupDmUser': {
		input: DiscordEndpointInputSchemas.addGroupDmUser,
		output: DiscordEndpointOutputSchemas.addGroupDmUser,
	},
	'generated.addThreadMember': {
		input: DiscordEndpointInputSchemas.addThreadMember,
		output: DiscordEndpointOutputSchemas.addThreadMember,
	},
	'generated.addGuildMemberRole': {
		input: DiscordEndpointInputSchemas.addGuildMemberRole,
		output: DiscordEndpointOutputSchemas.addGuildMemberRole,
	},
	'generated.banUserFromGuild': {
		input: DiscordEndpointInputSchemas.banUserFromGuild,
		output: DiscordEndpointOutputSchemas.banUserFromGuild,
	},
	'generated.bulkBanUsersFromGuild': {
		input: DiscordEndpointInputSchemas.bulkBanUsersFromGuild,
		output: DiscordEndpointOutputSchemas.bulkBanUsersFromGuild,
	},
	'generated.createChannelInvite': {
		input: DiscordEndpointInputSchemas.createChannelInvite,
		output: DiscordEndpointOutputSchemas.createChannelInvite,
	},
	'generated.createStageInstance': {
		input: DiscordEndpointInputSchemas.createStageInstance,
		output: DiscordEndpointOutputSchemas.createStageInstance,
	},
	'generated.createApplicationCommand': {
		input: DiscordEndpointInputSchemas.createApplicationCommand,
		output: DiscordEndpointOutputSchemas.createApplicationCommand,
	},
	'generated.createWebhook': {
		input: DiscordEndpointInputSchemas.createWebhook,
		output: DiscordEndpointOutputSchemas.createWebhook,
	},
	'generated.createGuildApplicationCommand': {
		input: DiscordEndpointInputSchemas.createGuildApplicationCommand,
		output: DiscordEndpointOutputSchemas.createGuildApplicationCommand,
	},
	'generated.createAutoModerationRule': {
		input: DiscordEndpointInputSchemas.createAutoModerationRule,
		output: DiscordEndpointOutputSchemas.createAutoModerationRule,
	},
	'generated.createGuildChannel': {
		input: DiscordEndpointInputSchemas.createGuildChannel,
		output: DiscordEndpointOutputSchemas.createGuildChannel,
	},
	'generated.createGuildEmoji': {
		input: DiscordEndpointInputSchemas.createGuildEmoji,
		output: DiscordEndpointOutputSchemas.createGuildEmoji,
	},
	'generated.createGuildScheduledEvent': {
		input: DiscordEndpointInputSchemas.createGuildScheduledEvent,
		output: DiscordEndpointOutputSchemas.createGuildScheduledEvent,
	},
	'generated.createGuildSticker': {
		input: DiscordEndpointInputSchemas.createGuildSticker,
		output: DiscordEndpointOutputSchemas.createGuildSticker,
	},
	'generated.createGuildTemplate': {
		input: DiscordEndpointInputSchemas.createGuildTemplate,
		output: DiscordEndpointOutputSchemas.createGuildTemplate,
	},
	'generated.createGuild': {
		input: DiscordEndpointInputSchemas.createGuild,
		output: DiscordEndpointOutputSchemas.createGuild,
	},
	'generated.createThread': {
		input: DiscordEndpointInputSchemas.createThread,
		output: DiscordEndpointOutputSchemas.createThread,
	},
	'generated.createGuildRole': {
		input: DiscordEndpointInputSchemas.createGuildRole,
		output: DiscordEndpointOutputSchemas.createGuildRole,
	},
	'generated.createThreadFromMessage': {
		input: DiscordEndpointInputSchemas.createThreadFromMessage,
		output: DiscordEndpointOutputSchemas.createThreadFromMessage,
	},
	'generated.crosspostMessage': {
		input: DiscordEndpointInputSchemas.crosspostMessage,
		output: DiscordEndpointOutputSchemas.crosspostMessage,
	},
	'generated.deleteAllMessageReactions': {
		input: DiscordEndpointInputSchemas.deleteAllMessageReactions,
		output: DiscordEndpointOutputSchemas.deleteAllMessageReactions,
	},
	'generated.deleteApplicationCommand': {
		input: DiscordEndpointInputSchemas.deleteApplicationCommand,
		output: DiscordEndpointOutputSchemas.deleteApplicationCommand,
	},
	'generated.deleteChannel': {
		input: DiscordEndpointInputSchemas.deleteChannel,
		output: DiscordEndpointOutputSchemas.deleteChannel,
	},
	'generated.deleteMessage': {
		input: DiscordEndpointInputSchemas.deleteMessage,
		output: DiscordEndpointOutputSchemas.deleteMessage,
	},
	'generated.deleteAllMessageReactionsByEmoji': {
		input: DiscordEndpointInputSchemas.deleteAllMessageReactionsByEmoji,
		output: DiscordEndpointOutputSchemas.deleteAllMessageReactionsByEmoji,
	},
	'generated.deleteChannelPermissionOverwrite': {
		input: DiscordEndpointInputSchemas.deleteChannelPermissionOverwrite,
		output: DiscordEndpointOutputSchemas.deleteChannelPermissionOverwrite,
	},
	'generated.deleteThreadMember': {
		input: DiscordEndpointInputSchemas.deleteThreadMember,
		output: DiscordEndpointOutputSchemas.deleteThreadMember,
	},
	'generated.deleteAutoModerationRule': {
		input: DiscordEndpointInputSchemas.deleteAutoModerationRule,
		output: DiscordEndpointOutputSchemas.deleteAutoModerationRule,
	},
	'generated.deleteGuild': {
		input: DiscordEndpointInputSchemas.deleteGuild,
		output: DiscordEndpointOutputSchemas.deleteGuild,
	},
	'generated.deleteGuildApplicationCommand': {
		input: DiscordEndpointInputSchemas.deleteGuildApplicationCommand,
		output: DiscordEndpointOutputSchemas.deleteGuildApplicationCommand,
	},
	'generated.deleteGuildEmoji': {
		input: DiscordEndpointInputSchemas.deleteGuildEmoji,
		output: DiscordEndpointOutputSchemas.deleteGuildEmoji,
	},
	'generated.deleteGuildIntegration': {
		input: DiscordEndpointInputSchemas.deleteGuildIntegration,
		output: DiscordEndpointOutputSchemas.deleteGuildIntegration,
	},
	'generated.deleteGuildMember': {
		input: DiscordEndpointInputSchemas.deleteGuildMember,
		output: DiscordEndpointOutputSchemas.deleteGuildMember,
	},
	'generated.deleteGuildMemberRole': {
		input: DiscordEndpointInputSchemas.deleteGuildMemberRole,
		output: DiscordEndpointOutputSchemas.deleteGuildMemberRole,
	},
	'generated.deleteGuildScheduledEvent': {
		input: DiscordEndpointInputSchemas.deleteGuildScheduledEvent,
		output: DiscordEndpointOutputSchemas.deleteGuildScheduledEvent,
	},
	'generated.deleteGuildSticker': {
		input: DiscordEndpointInputSchemas.deleteGuildSticker,
		output: DiscordEndpointOutputSchemas.deleteGuildSticker,
	},
	'generated.deleteGuildTemplate': {
		input: DiscordEndpointInputSchemas.deleteGuildTemplate,
		output: DiscordEndpointOutputSchemas.deleteGuildTemplate,
	},
	'generated.inviteRevoke': {
		input: DiscordEndpointInputSchemas.inviteRevoke,
		output: DiscordEndpointOutputSchemas.inviteRevoke,
	},
	'generated.deleteOriginalWebhookMessage': {
		input: DiscordEndpointInputSchemas.deleteOriginalWebhookMessage,
		output: DiscordEndpointOutputSchemas.deleteOriginalWebhookMessage,
	},
	'generated.deleteGuildRole': {
		input: DiscordEndpointInputSchemas.deleteGuildRole,
		output: DiscordEndpointOutputSchemas.deleteGuildRole,
	},
	'generated.deleteStageInstance': {
		input: DiscordEndpointInputSchemas.deleteStageInstance,
		output: DiscordEndpointOutputSchemas.deleteStageInstance,
	},
	'generated.deleteUserMessageReaction': {
		input: DiscordEndpointInputSchemas.deleteUserMessageReaction,
		output: DiscordEndpointOutputSchemas.deleteUserMessageReaction,
	},
	'generated.deleteMyMessageReaction': {
		input: DiscordEndpointInputSchemas.deleteMyMessageReaction,
		output: DiscordEndpointOutputSchemas.deleteMyMessageReaction,
	},
	'generated.deleteWebhook': {
		input: DiscordEndpointInputSchemas.deleteWebhook,
		output: DiscordEndpointOutputSchemas.deleteWebhook,
	},
	'generated.deleteWebhookMessage': {
		input: DiscordEndpointInputSchemas.deleteWebhookMessage,
		output: DiscordEndpointOutputSchemas.deleteWebhookMessage,
	},
	'generated.deleteWebhookByToken': {
		input: DiscordEndpointInputSchemas.deleteWebhookByToken,
		output: DiscordEndpointOutputSchemas.deleteWebhookByToken,
	},
	'generated.getApplicationCommand': {
		input: DiscordEndpointInputSchemas.getApplicationCommand,
		output: DiscordEndpointOutputSchemas.getApplicationCommand,
	},
	'generated.getGuildEmoji': {
		input: DiscordEndpointInputSchemas.getGuildEmoji,
		output: DiscordEndpointOutputSchemas.getGuildEmoji,
	},
	'generated.getGuildApplicationCommand': {
		input: DiscordEndpointInputSchemas.getGuildApplicationCommand,
		output: DiscordEndpointOutputSchemas.getGuildApplicationCommand,
	},
	'generated.listGuildApplicationCommands': {
		input: DiscordEndpointInputSchemas.listGuildApplicationCommands,
		output: DiscordEndpointOutputSchemas.listGuildApplicationCommands,
	},
	'generated.listMessages': {
		input: DiscordEndpointInputSchemas.listMessages,
		output: DiscordEndpointOutputSchemas.listMessages,
	},
	'generated.listVoiceRegions': {
		input: DiscordEndpointInputSchemas.listVoiceRegions,
		output: DiscordEndpointOutputSchemas.listVoiceRegions,
	},
	'generated.listGuildApplicationCommandPermissions': {
		input: DiscordEndpointInputSchemas.listGuildApplicationCommandPermissions,
		output: DiscordEndpointOutputSchemas.listGuildApplicationCommandPermissions,
	},
	'generated.listPrivateArchivedThreads': {
		input: DiscordEndpointInputSchemas.listPrivateArchivedThreads,
		output: DiscordEndpointOutputSchemas.listPrivateArchivedThreads,
	},
	'generated.listPublicArchivedThreads': {
		input: DiscordEndpointInputSchemas.listPublicArchivedThreads,
		output: DiscordEndpointOutputSchemas.listPublicArchivedThreads,
	},
	'generated.listMessageReactionsByEmoji': {
		input: DiscordEndpointInputSchemas.listMessageReactionsByEmoji,
		output: DiscordEndpointOutputSchemas.listMessageReactionsByEmoji,
	},
	'generated.getGateway': {
		input: DiscordEndpointInputSchemas.getGateway,
		output: DiscordEndpointOutputSchemas.getGateway,
	},
	'generated.listGuildAuditLogEntries': {
		input: DiscordEndpointInputSchemas.listGuildAuditLogEntries,
		output: DiscordEndpointOutputSchemas.listGuildAuditLogEntries,
	},
	'generated.listGuildMembers': {
		input: DiscordEndpointInputSchemas.listGuildMembers,
		output: DiscordEndpointOutputSchemas.listGuildMembers,
	},
	'generated.getGuildsOnboarding': {
		input: DiscordEndpointInputSchemas.getGuildsOnboarding,
		output: DiscordEndpointOutputSchemas.getGuildsOnboarding,
	},
	'generated.getGuildScheduledEvent': {
		input: DiscordEndpointInputSchemas.getGuildScheduledEvent,
		output: DiscordEndpointOutputSchemas.getGuildScheduledEvent,
	},
	'generated.listGuildTemplates': {
		input: DiscordEndpointInputSchemas.listGuildTemplates,
		output: DiscordEndpointOutputSchemas.listGuildTemplates,
	},
	'generated.getGuildWidgetPng': {
		input: DiscordEndpointInputSchemas.getGuildWidgetPng,
		output: DiscordEndpointOutputSchemas.getGuildWidgetPng,
	},
	'generated.getMyOauth2Application': {
		input: DiscordEndpointInputSchemas.getMyOauth2Application,
		output: DiscordEndpointOutputSchemas.getMyOauth2Application,
	},
	'generated.getPublicKeys': {
		input: DiscordEndpointInputSchemas.getPublicKeys,
		output: DiscordEndpointOutputSchemas.getPublicKeys,
	},
	'generated.listMyPrivateArchivedThreads': {
		input: DiscordEndpointInputSchemas.listMyPrivateArchivedThreads,
		output: DiscordEndpointOutputSchemas.listMyPrivateArchivedThreads,
	},
	'generated.getApplicationUserRoleConnection': {
		input: DiscordEndpointInputSchemas.getApplicationUserRoleConnection,
		output: DiscordEndpointOutputSchemas.getApplicationUserRoleConnection,
	},
	'generated.getMyApplication': {
		input: DiscordEndpointInputSchemas.getMyApplication,
		output: DiscordEndpointOutputSchemas.getMyApplication,
	},
	'generated.executeGithubCompatibleWebhook': {
		input: DiscordEndpointInputSchemas.executeGithubCompatibleWebhook,
		output: DiscordEndpointOutputSchemas.executeGithubCompatibleWebhook,
	},
	'generated.createDm': {
		input: DiscordEndpointInputSchemas.createDm,
		output: DiscordEndpointOutputSchemas.createDm,
	},
	'generated.joinThread': {
		input: DiscordEndpointInputSchemas.joinThread,
		output: DiscordEndpointOutputSchemas.joinThread,
	},
	'generated.leaveGuild': {
		input: DiscordEndpointInputSchemas.leaveGuild,
		output: DiscordEndpointOutputSchemas.leaveGuild,
	},
	'generated.listChannelInvites': {
		input: DiscordEndpointInputSchemas.listChannelInvites,
		output: DiscordEndpointOutputSchemas.listChannelInvites,
	},
	'generated.getActiveGuildThreads': {
		input: DiscordEndpointInputSchemas.getActiveGuildThreads,
		output: DiscordEndpointOutputSchemas.getActiveGuildThreads,
	},
	'generated.listApplicationCommands': {
		input: DiscordEndpointInputSchemas.listApplicationCommands,
		output: DiscordEndpointOutputSchemas.listApplicationCommands,
	},
	'generated.listGuildBans': {
		input: DiscordEndpointInputSchemas.listGuildBans,
		output: DiscordEndpointOutputSchemas.listGuildBans,
	},
	'generated.listGuildIntegrations': {
		input: DiscordEndpointInputSchemas.listGuildIntegrations,
		output: DiscordEndpointOutputSchemas.listGuildIntegrations,
	},
	'generated.listGuildVoiceRegions': {
		input: DiscordEndpointInputSchemas.listGuildVoiceRegions,
		output: DiscordEndpointOutputSchemas.listGuildVoiceRegions,
	},
	'generated.listGuildRoles': {
		input: DiscordEndpointInputSchemas.listGuildRoles,
		output: DiscordEndpointOutputSchemas.listGuildRoles,
	},
	'generated.listStickerPacks': {
		input: DiscordEndpointInputSchemas.listStickerPacks,
		output: DiscordEndpointOutputSchemas.listStickerPacks,
	},
	'generated.listThreadMembers': {
		input: DiscordEndpointInputSchemas.listThreadMembers,
		output: DiscordEndpointOutputSchemas.listThreadMembers,
	},
	'generated.updateApplication': {
		input: DiscordEndpointInputSchemas.updateApplication,
		output: DiscordEndpointOutputSchemas.updateApplication,
	},
	'generated.setChannelPermissionOverwrite': {
		input: DiscordEndpointInputSchemas.setChannelPermissionOverwrite,
		output: DiscordEndpointOutputSchemas.setChannelPermissionOverwrite,
	},
	'generated.updateAutoModerationRule': {
		input: DiscordEndpointInputSchemas.updateAutoModerationRule,
		output: DiscordEndpointOutputSchemas.updateAutoModerationRule,
	},
	'generated.updateGuildMember': {
		input: DiscordEndpointInputSchemas.updateGuildMember,
		output: DiscordEndpointOutputSchemas.updateGuildMember,
	},
	'generated.updateGuildRole': {
		input: DiscordEndpointInputSchemas.updateGuildRole,
		output: DiscordEndpointOutputSchemas.updateGuildRole,
	},
	'generated.updateSelfVoiceState': {
		input: DiscordEndpointInputSchemas.updateSelfVoiceState,
		output: DiscordEndpointOutputSchemas.updateSelfVoiceState,
	},
	'generated.updateApplicationCommand': {
		input: DiscordEndpointInputSchemas.updateApplicationCommand,
		output: DiscordEndpointOutputSchemas.updateApplicationCommand,
	},
	'generated.updateGuildTemplate': {
		input: DiscordEndpointInputSchemas.updateGuildTemplate,
		output: DiscordEndpointOutputSchemas.updateGuildTemplate,
	},
	'generated.updateVoiceState': {
		input: DiscordEndpointInputSchemas.updateVoiceState,
		output: DiscordEndpointOutputSchemas.updateVoiceState,
	},
	'generated.updateOriginalWebhookMessage': {
		input: DiscordEndpointInputSchemas.updateOriginalWebhookMessage,
		output: DiscordEndpointOutputSchemas.updateOriginalWebhookMessage,
	},
	'generated.pinMessage': {
		input: DiscordEndpointInputSchemas.pinMessage,
		output: DiscordEndpointOutputSchemas.pinMessage,
	},
	'generated.createGuildFromTemplate': {
		input: DiscordEndpointInputSchemas.createGuildFromTemplate,
		output: DiscordEndpointOutputSchemas.createGuildFromTemplate,
	},
	'generated.createInteractionResponse': {
		input: DiscordEndpointInputSchemas.createInteractionResponse,
		output: DiscordEndpointOutputSchemas.createInteractionResponse,
	},
	'generated.createMessage': {
		input: DiscordEndpointInputSchemas.createMessage,
		output: DiscordEndpointOutputSchemas.createMessage,
	},
	'generated.executeSlackCompatibleWebhook': {
		input: DiscordEndpointInputSchemas.executeSlackCompatibleWebhook,
		output: DiscordEndpointOutputSchemas.executeSlackCompatibleWebhook,
	},
	'generated.executeWebhook': {
		input: DiscordEndpointInputSchemas.executeWebhook,
		output: DiscordEndpointOutputSchemas.executeWebhook,
	},
	'generated.getGuildPreview': {
		input: DiscordEndpointInputSchemas.getGuildPreview,
		output: DiscordEndpointOutputSchemas.getGuildPreview,
	},
	'generated.pruneGuild': {
		input: DiscordEndpointInputSchemas.pruneGuild,
		output: DiscordEndpointOutputSchemas.pruneGuild,
	},
	'generated.leaveThread': {
		input: DiscordEndpointInputSchemas.leaveThread,
		output: DiscordEndpointOutputSchemas.leaveThread,
	},
	'generated.unbanUserFromGuild': {
		input: DiscordEndpointInputSchemas.unbanUserFromGuild,
		output: DiscordEndpointOutputSchemas.unbanUserFromGuild,
	},
	'generated.deleteGroupDmUser': {
		input: DiscordEndpointInputSchemas.deleteGroupDmUser,
		output: DiscordEndpointOutputSchemas.deleteGroupDmUser,
	},
	'generated.getApplication': {
		input: DiscordEndpointInputSchemas.getApplication,
		output: DiscordEndpointOutputSchemas.getApplication,
	},
	'generated.getApplicationRoleConnectionsMetadata': {
		input: DiscordEndpointInputSchemas.getApplicationRoleConnectionsMetadata,
		output: DiscordEndpointOutputSchemas.getApplicationRoleConnectionsMetadata,
	},
	'generated.getAutoModerationRule': {
		input: DiscordEndpointInputSchemas.getAutoModerationRule,
		output: DiscordEndpointOutputSchemas.getAutoModerationRule,
	},
	'generated.getBotGateway': {
		input: DiscordEndpointInputSchemas.getBotGateway,
		output: DiscordEndpointOutputSchemas.getBotGateway,
	},
	'generated.getChannel': {
		input: DiscordEndpointInputSchemas.getChannel,
		output: DiscordEndpointOutputSchemas.getChannel,
	},
	'generated.listChannelWebhooks': {
		input: DiscordEndpointInputSchemas.listChannelWebhooks,
		output: DiscordEndpointOutputSchemas.listChannelWebhooks,
	},
	'generated.listAutoModerationRules': {
		input: DiscordEndpointInputSchemas.listAutoModerationRules,
		output: DiscordEndpointOutputSchemas.listAutoModerationRules,
	},
	'generated.listGuildChannels': {
		input: DiscordEndpointInputSchemas.listGuildChannels,
		output: DiscordEndpointOutputSchemas.listGuildChannels,
	},
	'generated.getGuildApplicationCommandPermissions': {
		input: DiscordEndpointInputSchemas.getGuildApplicationCommandPermissions,
		output: DiscordEndpointOutputSchemas.getGuildApplicationCommandPermissions,
	},
	'generated.getGuild': {
		input: DiscordEndpointInputSchemas.getGuild,
		output: DiscordEndpointOutputSchemas.getGuild,
	},
	'generated.listGuildEmojis': {
		input: DiscordEndpointInputSchemas.listGuildEmojis,
		output: DiscordEndpointOutputSchemas.listGuildEmojis,
	},
	'generated.listGuildInvites': {
		input: DiscordEndpointInputSchemas.listGuildInvites,
		output: DiscordEndpointOutputSchemas.listGuildInvites,
	},
	'generated.getGuildMember': {
		input: DiscordEndpointInputSchemas.getGuildMember,
		output: DiscordEndpointOutputSchemas.getGuildMember,
	},
	'generated.previewPruneGuild': {
		input: DiscordEndpointInputSchemas.previewPruneGuild,
		output: DiscordEndpointOutputSchemas.previewPruneGuild,
	},
	'generated.listGuildScheduledEvents': {
		input: DiscordEndpointInputSchemas.listGuildScheduledEvents,
		output: DiscordEndpointOutputSchemas.listGuildScheduledEvents,
	},
	'generated.listGuildStickers': {
		input: DiscordEndpointInputSchemas.listGuildStickers,
		output: DiscordEndpointOutputSchemas.listGuildStickers,
	},
	'generated.getGuildTemplate': {
		input: DiscordEndpointInputSchemas.getGuildTemplate,
		output: DiscordEndpointOutputSchemas.getGuildTemplate,
	},
	'generated.getGuildBan': {
		input: DiscordEndpointInputSchemas.getGuildBan,
		output: DiscordEndpointOutputSchemas.getGuildBan,
	},
	'generated.getGuildVanityUrl': {
		input: DiscordEndpointInputSchemas.getGuildVanityUrl,
		output: DiscordEndpointOutputSchemas.getGuildVanityUrl,
	},
	'generated.getGuildWebhooks': {
		input: DiscordEndpointInputSchemas.getGuildWebhooks,
		output: DiscordEndpointOutputSchemas.getGuildWebhooks,
	},
	'generated.getGuildWelcomeScreen': {
		input: DiscordEndpointInputSchemas.getGuildWelcomeScreen,
		output: DiscordEndpointOutputSchemas.getGuildWelcomeScreen,
	},
	'generated.getGuildWidgetSettings': {
		input: DiscordEndpointInputSchemas.getGuildWidgetSettings,
		output: DiscordEndpointOutputSchemas.getGuildWidgetSettings,
	},
	'generated.getGuildWidget': {
		input: DiscordEndpointInputSchemas.getGuildWidget,
		output: DiscordEndpointOutputSchemas.getGuildWidget,
	},
	'generated.inviteResolve': {
		input: DiscordEndpointInputSchemas.inviteResolve,
		output: DiscordEndpointOutputSchemas.inviteResolve,
	},
	'generated.getMessage': {
		input: DiscordEndpointInputSchemas.getMessage,
		output: DiscordEndpointOutputSchemas.getMessage,
	},
	'generated.getOriginalWebhookMessage': {
		input: DiscordEndpointInputSchemas.getOriginalWebhookMessage,
		output: DiscordEndpointOutputSchemas.getOriginalWebhookMessage,
	},
	'generated.listPinnedMessages': {
		input: DiscordEndpointInputSchemas.listPinnedMessages,
		output: DiscordEndpointOutputSchemas.listPinnedMessages,
	},
	'generated.getStageInstance': {
		input: DiscordEndpointInputSchemas.getStageInstance,
		output: DiscordEndpointOutputSchemas.getStageInstance,
	},
	'generated.getSticker': {
		input: DiscordEndpointInputSchemas.getSticker,
		output: DiscordEndpointOutputSchemas.getSticker,
	},
	'generated.getGuildSticker': {
		input: DiscordEndpointInputSchemas.getGuildSticker,
		output: DiscordEndpointOutputSchemas.getGuildSticker,
	},
	'generated.getThreadMember': {
		input: DiscordEndpointInputSchemas.getThreadMember,
		output: DiscordEndpointOutputSchemas.getThreadMember,
	},
	'generated.getUser': {
		input: DiscordEndpointInputSchemas.getUser,
		output: DiscordEndpointOutputSchemas.getUser,
	},
	'generated.listGuildScheduledEventUsers': {
		input: DiscordEndpointInputSchemas.listGuildScheduledEventUsers,
		output: DiscordEndpointOutputSchemas.listGuildScheduledEventUsers,
	},
	'generated.getWebhook': {
		input: DiscordEndpointInputSchemas.getWebhook,
		output: DiscordEndpointOutputSchemas.getWebhook,
	},
	'generated.getWebhookByToken': {
		input: DiscordEndpointInputSchemas.getWebhookByToken,
		output: DiscordEndpointOutputSchemas.getWebhookByToken,
	},
	'generated.getWebhookMessage': {
		input: DiscordEndpointInputSchemas.getWebhookMessage,
		output: DiscordEndpointOutputSchemas.getWebhookMessage,
	},
	'generated.searchGuildMembers': {
		input: DiscordEndpointInputSchemas.searchGuildMembers,
		output: DiscordEndpointOutputSchemas.searchGuildMembers,
	},
	'generated.testAuth': {
		input: DiscordEndpointInputSchemas.testAuth,
		output: DiscordEndpointOutputSchemas.testAuth,
	},
	'generated.triggerTypingIndicator': {
		input: DiscordEndpointInputSchemas.triggerTypingIndicator,
		output: DiscordEndpointOutputSchemas.triggerTypingIndicator,
	},
	'generated.unpinMessage': {
		input: DiscordEndpointInputSchemas.unpinMessage,
		output: DiscordEndpointOutputSchemas.unpinMessage,
	},
	'generated.updateGuildWidgetSettings': {
		input: DiscordEndpointInputSchemas.updateGuildWidgetSettings,
		output: DiscordEndpointOutputSchemas.updateGuildWidgetSettings,
	},
	'generated.updateMyApplication': {
		input: DiscordEndpointInputSchemas.updateMyApplication,
		output: DiscordEndpointOutputSchemas.updateMyApplication,
	},
	'generated.updateGuildApplicationCommand': {
		input: DiscordEndpointInputSchemas.updateGuildApplicationCommand,
		output: DiscordEndpointOutputSchemas.updateGuildApplicationCommand,
	},
	'generated.updateMyGuildMember': {
		input: DiscordEndpointInputSchemas.updateMyGuildMember,
		output: DiscordEndpointOutputSchemas.updateMyGuildMember,
	},
	'generated.updateMessage': {
		input: DiscordEndpointInputSchemas.updateMessage,
		output: DiscordEndpointOutputSchemas.updateMessage,
	},
	'generated.updateChannel': {
		input: DiscordEndpointInputSchemas.updateChannel,
		output: DiscordEndpointOutputSchemas.updateChannel,
	},
	'generated.updateMyUser': {
		input: DiscordEndpointInputSchemas.updateMyUser,
		output: DiscordEndpointOutputSchemas.updateMyUser,
	},
	'generated.updateWebhookMessage': {
		input: DiscordEndpointInputSchemas.updateWebhookMessage,
		output: DiscordEndpointOutputSchemas.updateWebhookMessage,
	},
	'generated.updateGuildEmoji': {
		input: DiscordEndpointInputSchemas.updateGuildEmoji,
		output: DiscordEndpointOutputSchemas.updateGuildEmoji,
	},
	'generated.putGuildsOnboarding': {
		input: DiscordEndpointInputSchemas.putGuildsOnboarding,
		output: DiscordEndpointOutputSchemas.putGuildsOnboarding,
	},
	'generated.updateGuildScheduledEvent': {
		input: DiscordEndpointInputSchemas.updateGuildScheduledEvent,
		output: DiscordEndpointOutputSchemas.updateGuildScheduledEvent,
	},
	'generated.updateGuild': {
		input: DiscordEndpointInputSchemas.updateGuild,
		output: DiscordEndpointOutputSchemas.updateGuild,
	},
	'generated.updateGuildSticker': {
		input: DiscordEndpointInputSchemas.updateGuildSticker,
		output: DiscordEndpointOutputSchemas.updateGuildSticker,
	},
	'generated.syncGuildTemplate': {
		input: DiscordEndpointInputSchemas.syncGuildTemplate,
		output: DiscordEndpointOutputSchemas.syncGuildTemplate,
	},
	'generated.updateGuildWelcomeScreen': {
		input: DiscordEndpointInputSchemas.updateGuildWelcomeScreen,
		output: DiscordEndpointOutputSchemas.updateGuildWelcomeScreen,
	},
	'generated.updateApplicationUserRoleConnection': {
		input: DiscordEndpointInputSchemas.updateApplicationUserRoleConnection,
		output: DiscordEndpointOutputSchemas.updateApplicationUserRoleConnection,
	},
	'generated.updateWebhook': {
		input: DiscordEndpointInputSchemas.updateWebhook,
		output: DiscordEndpointOutputSchemas.updateWebhook,
	},
	'generated.updateWebhookByToken': {
		input: DiscordEndpointInputSchemas.updateWebhookByToken,
		output: DiscordEndpointOutputSchemas.updateWebhookByToken,
	},
	'generated.bulkDeleteMessages': {
		input: DiscordEndpointInputSchemas.bulkDeleteMessages,
		output: DiscordEndpointOutputSchemas.bulkDeleteMessages,
	},
	'commands.createGlobal': {
		input: DiscordEndpointInputSchemas.commandsCreateGlobal,
		output: DiscordEndpointOutputSchemas.commandsCreateGlobal,
	},
	'commands.getGlobal': {
		input: DiscordEndpointInputSchemas.commandsGetGlobal,
		output: DiscordEndpointOutputSchemas.commandsGetGlobal,
	},
	'commands.listGlobal': {
		input: DiscordEndpointInputSchemas.commandsListGlobal,
		output: DiscordEndpointOutputSchemas.commandsListGlobal,
	},
	'commands.updateGlobal': {
		input: DiscordEndpointInputSchemas.commandsUpdateGlobal,
		output: DiscordEndpointOutputSchemas.commandsUpdateGlobal,
	},
	'commands.deleteGlobal': {
		input: DiscordEndpointInputSchemas.commandsDeleteGlobal,
		output: DiscordEndpointOutputSchemas.commandsDeleteGlobal,
	},
	'commands.createGuild': {
		input: DiscordEndpointInputSchemas.commandsCreateGuild,
		output: DiscordEndpointOutputSchemas.commandsCreateGuild,
	},
	'commands.getGuild': {
		input: DiscordEndpointInputSchemas.commandsGetGuild,
		output: DiscordEndpointOutputSchemas.commandsGetGuild,
	},
	'commands.listGuild': {
		input: DiscordEndpointInputSchemas.commandsListGuild,
		output: DiscordEndpointOutputSchemas.commandsListGuild,
	},
	'commands.updateGuild': {
		input: DiscordEndpointInputSchemas.commandsUpdateGuild,
		output: DiscordEndpointOutputSchemas.commandsUpdateGuild,
	},
	'commands.deleteGuild': {
		input: DiscordEndpointInputSchemas.commandsDeleteGuild,
		output: DiscordEndpointOutputSchemas.commandsDeleteGuild,
	},
	'moderation.guildsBanAdd': {
		input: DiscordEndpointInputSchemas.guildsBanAdd,
		output: DiscordEndpointOutputSchemas.guildsBanAdd,
	},
	'moderation.guildsBanRemove': {
		input: DiscordEndpointInputSchemas.guildsBanRemove,
		output: DiscordEndpointOutputSchemas.guildsBanRemove,
	},
	'moderation.guildsBansList': {
		input: DiscordEndpointInputSchemas.guildsBansList,
		output: DiscordEndpointOutputSchemas.guildsBansList,
	},
	'moderation.guildsBanGet': {
		input: DiscordEndpointInputSchemas.guildsBanGet,
		output: DiscordEndpointOutputSchemas.guildsBanGet,
	},

	'messages.send': {
		input: DiscordEndpointInputSchemas.messagesSend,
		output: DiscordEndpointOutputSchemas.messagesSend,
	},
	'messages.reply': {
		input: DiscordEndpointInputSchemas.messagesReply,
		output: DiscordEndpointOutputSchemas.messagesReply,
	},
	'messages.get': {
		input: DiscordEndpointInputSchemas.messagesGet,
		output: DiscordEndpointOutputSchemas.messagesGet,
	},
	'messages.list': {
		input: DiscordEndpointInputSchemas.messagesList,
		output: DiscordEndpointOutputSchemas.messagesList,
	},
	'messages.edit': {
		input: DiscordEndpointInputSchemas.messagesEdit,
		output: DiscordEndpointOutputSchemas.messagesEdit,
	},
	'messages.delete': {
		input: DiscordEndpointInputSchemas.messagesDelete,
		output: DiscordEndpointOutputSchemas.messagesDelete,
	},
	'threads.create': {
		input: DiscordEndpointInputSchemas.threadsCreate,
		output: DiscordEndpointOutputSchemas.threadsCreate,
	},
	'threads.createFromMessage': {
		input: DiscordEndpointInputSchemas.threadsCreateFromMessage,
		output: DiscordEndpointOutputSchemas.threadsCreateFromMessage,
	},
	'reactions.add': {
		input: DiscordEndpointInputSchemas.reactionsAdd,
		output: DiscordEndpointOutputSchemas.reactionsAdd,
	},
	'reactions.remove': {
		input: DiscordEndpointInputSchemas.reactionsRemove,
		output: DiscordEndpointOutputSchemas.reactionsRemove,
	},
	'reactions.list': {
		input: DiscordEndpointInputSchemas.reactionsList,
		output: DiscordEndpointOutputSchemas.reactionsList,
	},
	'guilds.list': {
		input: DiscordEndpointInputSchemas.guildsList,
		output: DiscordEndpointOutputSchemas.guildsList,
	},
	'guilds.get': {
		input: DiscordEndpointInputSchemas.guildsGet,
		output: DiscordEndpointOutputSchemas.guildsGet,
	},
	'channels.list': {
		input: DiscordEndpointInputSchemas.channelsList,
		output: DiscordEndpointOutputSchemas.channelsList,
	},
	'members.list': {
		input: DiscordEndpointInputSchemas.membersList,
		output: DiscordEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: DiscordEndpointInputSchemas.membersGet,
		output: DiscordEndpointOutputSchemas.membersGet,
	},
} as const;

const discordWebhooksNested = {
	interactions: {
		ping: InteractionWebhooks.ping,
		applicationCommand: InteractionWebhooks.applicationCommand,
		messageComponent: InteractionWebhooks.messageComponent,
		modalSubmit: InteractionWebhooks.modalSubmit,
	},
} as const;

// ── Auth ───────────────────────────────────────────────────────────────────────

const discordWebhookSchemas = {
	'interactions.ping': {
		description: 'Discord sends a PING to verify the endpoint is live',
		payload: DiscordPingInteractionSchema,
		response: DiscordPingInteractionSchema,
	},
	'interactions.applicationCommand': {
		description: 'A user invoked a slash command or context-menu action',
		payload: DiscordApplicationCommandInteractionSchema,
		response: DiscordApplicationCommandInteractionSchema,
	},
	'interactions.messageComponent': {
		description: 'A user clicked a button or selected a menu option',
		payload: DiscordMessageComponentInteractionSchema,
		response: DiscordMessageComponentInteractionSchema,
	},
	'interactions.modalSubmit': {
		description: 'A user submitted a modal dialog',
		payload: DiscordModalSubmitInteractionSchema,
		response: DiscordModalSubmitInteractionSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each Discord endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const discordEndpointMeta = {
	'generated.followChannel': {
		description: 'followChannel',
		riskLevel: 'read',
	},
	'generated.addGuildMember': {
		description: 'addGuildMember',
		riskLevel: 'read',
	},
	'generated.addMyMessageReaction': {
		description: 'addMyMessageReaction',
		riskLevel: 'read',
	},
	'generated.addGroupDmUser': {
		description: 'addGroupDmUser',
		riskLevel: 'read',
	},
	'generated.addThreadMember': {
		description: 'addThreadMember',
		riskLevel: 'read',
	},
	'generated.addGuildMemberRole': {
		description: 'addGuildMemberRole',
		riskLevel: 'read',
	},
	'generated.banUserFromGuild': {
		description: 'banUserFromGuild',
		riskLevel: 'read',
	},
	'generated.bulkBanUsersFromGuild': {
		description: 'bulkBanUsersFromGuild',
		riskLevel: 'read',
	},
	'generated.createChannelInvite': {
		description: 'createChannelInvite',
		riskLevel: 'read',
	},
	'generated.createStageInstance': {
		description: 'createStageInstance',
		riskLevel: 'read',
	},
	'generated.createApplicationCommand': {
		description: 'createApplicationCommand',
		riskLevel: 'read',
	},
	'generated.createWebhook': {
		description: 'createWebhook',
		riskLevel: 'read',
	},
	'generated.createGuildApplicationCommand': {
		description: 'createGuildApplicationCommand',
		riskLevel: 'read',
	},
	'generated.createAutoModerationRule': {
		description: 'createAutoModerationRule',
		riskLevel: 'read',
	},
	'generated.createGuildChannel': {
		description: 'createGuildChannel',
		riskLevel: 'read',
	},
	'generated.createGuildEmoji': {
		description: 'createGuildEmoji',
		riskLevel: 'read',
	},
	'generated.createGuildScheduledEvent': {
		description: 'createGuildScheduledEvent',
		riskLevel: 'read',
	},
	'generated.createGuildSticker': {
		description: 'createGuildSticker',
		riskLevel: 'read',
	},
	'generated.createGuildTemplate': {
		description: 'createGuildTemplate',
		riskLevel: 'read',
	},
	'generated.createGuild': { description: 'createGuild', riskLevel: 'read' },
	'generated.createThread': { description: 'createThread', riskLevel: 'read' },
	'generated.createGuildRole': {
		description: 'createGuildRole',
		riskLevel: 'read',
	},
	'generated.createThreadFromMessage': {
		description: 'createThreadFromMessage',
		riskLevel: 'read',
	},
	'generated.crosspostMessage': {
		description: 'crosspostMessage',
		riskLevel: 'read',
	},
	'generated.deleteAllMessageReactions': {
		description: 'deleteAllMessageReactions',
		riskLevel: 'read',
	},
	'generated.deleteApplicationCommand': {
		description: 'deleteApplicationCommand',
		riskLevel: 'read',
	},
	'generated.deleteChannel': {
		description: 'deleteChannel',
		riskLevel: 'read',
	},
	'generated.deleteMessage': {
		description: 'deleteMessage',
		riskLevel: 'read',
	},
	'generated.deleteAllMessageReactionsByEmoji': {
		description: 'deleteAllMessageReactionsByEmoji',
		riskLevel: 'read',
	},
	'generated.deleteChannelPermissionOverwrite': {
		description: 'deleteChannelPermissionOverwrite',
		riskLevel: 'read',
	},
	'generated.deleteThreadMember': {
		description: 'deleteThreadMember',
		riskLevel: 'read',
	},
	'generated.deleteAutoModerationRule': {
		description: 'deleteAutoModerationRule',
		riskLevel: 'read',
	},
	'generated.deleteGuild': { description: 'deleteGuild', riskLevel: 'read' },
	'generated.deleteGuildApplicationCommand': {
		description: 'deleteGuildApplicationCommand',
		riskLevel: 'read',
	},
	'generated.deleteGuildEmoji': {
		description: 'deleteGuildEmoji',
		riskLevel: 'read',
	},
	'generated.deleteGuildIntegration': {
		description: 'deleteGuildIntegration',
		riskLevel: 'read',
	},
	'generated.deleteGuildMember': {
		description: 'deleteGuildMember',
		riskLevel: 'read',
	},
	'generated.deleteGuildMemberRole': {
		description: 'deleteGuildMemberRole',
		riskLevel: 'read',
	},
	'generated.deleteGuildScheduledEvent': {
		description: 'deleteGuildScheduledEvent',
		riskLevel: 'read',
	},
	'generated.deleteGuildSticker': {
		description: 'deleteGuildSticker',
		riskLevel: 'read',
	},
	'generated.deleteGuildTemplate': {
		description: 'deleteGuildTemplate',
		riskLevel: 'read',
	},
	'generated.inviteRevoke': { description: 'inviteRevoke', riskLevel: 'read' },
	'generated.deleteOriginalWebhookMessage': {
		description: 'deleteOriginalWebhookMessage',
		riskLevel: 'read',
	},
	'generated.deleteGuildRole': {
		description: 'deleteGuildRole',
		riskLevel: 'read',
	},
	'generated.deleteStageInstance': {
		description: 'deleteStageInstance',
		riskLevel: 'read',
	},
	'generated.deleteUserMessageReaction': {
		description: 'deleteUserMessageReaction',
		riskLevel: 'read',
	},
	'generated.deleteMyMessageReaction': {
		description: 'deleteMyMessageReaction',
		riskLevel: 'read',
	},
	'generated.deleteWebhook': {
		description: 'deleteWebhook',
		riskLevel: 'read',
	},
	'generated.deleteWebhookMessage': {
		description: 'deleteWebhookMessage',
		riskLevel: 'read',
	},
	'generated.deleteWebhookByToken': {
		description: 'deleteWebhookByToken',
		riskLevel: 'read',
	},
	'generated.getApplicationCommand': {
		description: 'getApplicationCommand',
		riskLevel: 'read',
	},
	'generated.getGuildEmoji': {
		description: 'getGuildEmoji',
		riskLevel: 'read',
	},
	'generated.getGuildApplicationCommand': {
		description: 'getGuildApplicationCommand',
		riskLevel: 'read',
	},
	'generated.listGuildApplicationCommands': {
		description: 'listGuildApplicationCommands',
		riskLevel: 'read',
	},
	'generated.listMessages': { description: 'listMessages', riskLevel: 'read' },
	'generated.listVoiceRegions': {
		description: 'listVoiceRegions',
		riskLevel: 'read',
	},
	'generated.listGuildApplicationCommandPermissions': {
		description: 'listGuildApplicationCommandPermissions',
		riskLevel: 'read',
	},
	'generated.listPrivateArchivedThreads': {
		description: 'listPrivateArchivedThreads',
		riskLevel: 'read',
	},
	'generated.listPublicArchivedThreads': {
		description: 'listPublicArchivedThreads',
		riskLevel: 'read',
	},
	'generated.listMessageReactionsByEmoji': {
		description: 'listMessageReactionsByEmoji',
		riskLevel: 'read',
	},
	'generated.getGateway': { description: 'getGateway', riskLevel: 'read' },
	'generated.listGuildAuditLogEntries': {
		description: 'listGuildAuditLogEntries',
		riskLevel: 'read',
	},
	'generated.listGuildMembers': {
		description: 'listGuildMembers',
		riskLevel: 'read',
	},
	'generated.getGuildsOnboarding': {
		description: 'getGuildsOnboarding',
		riskLevel: 'read',
	},
	'generated.getGuildScheduledEvent': {
		description: 'getGuildScheduledEvent',
		riskLevel: 'read',
	},
	'generated.listGuildTemplates': {
		description: 'listGuildTemplates',
		riskLevel: 'read',
	},
	'generated.getGuildWidgetPng': {
		description: 'getGuildWidgetPng',
		riskLevel: 'read',
	},
	'generated.getMyOauth2Application': {
		description: 'getMyOauth2Application',
		riskLevel: 'read',
	},
	'generated.getPublicKeys': {
		description: 'getPublicKeys',
		riskLevel: 'read',
	},
	'generated.listMyPrivateArchivedThreads': {
		description: 'listMyPrivateArchivedThreads',
		riskLevel: 'read',
	},
	'generated.getApplicationUserRoleConnection': {
		description: 'getApplicationUserRoleConnection',
		riskLevel: 'read',
	},
	'generated.getMyApplication': {
		description: 'getMyApplication',
		riskLevel: 'read',
	},
	'generated.executeGithubCompatibleWebhook': {
		description: 'executeGithubCompatibleWebhook',
		riskLevel: 'read',
	},
	'generated.createDm': { description: 'createDm', riskLevel: 'read' },
	'generated.joinThread': { description: 'joinThread', riskLevel: 'read' },
	'generated.leaveGuild': { description: 'leaveGuild', riskLevel: 'read' },
	'generated.listChannelInvites': {
		description: 'listChannelInvites',
		riskLevel: 'read',
	},
	'generated.getActiveGuildThreads': {
		description: 'getActiveGuildThreads',
		riskLevel: 'read',
	},
	'generated.listApplicationCommands': {
		description: 'listApplicationCommands',
		riskLevel: 'read',
	},
	'generated.listGuildBans': {
		description: 'listGuildBans',
		riskLevel: 'read',
	},
	'generated.listGuildIntegrations': {
		description: 'listGuildIntegrations',
		riskLevel: 'read',
	},
	'generated.listGuildVoiceRegions': {
		description: 'listGuildVoiceRegions',
		riskLevel: 'read',
	},
	'generated.listGuildRoles': {
		description: 'listGuildRoles',
		riskLevel: 'read',
	},
	'generated.listStickerPacks': {
		description: 'listStickerPacks',
		riskLevel: 'read',
	},
	'generated.listThreadMembers': {
		description: 'listThreadMembers',
		riskLevel: 'read',
	},
	'generated.updateApplication': {
		description: 'updateApplication',
		riskLevel: 'read',
	},
	'generated.setChannelPermissionOverwrite': {
		description: 'setChannelPermissionOverwrite',
		riskLevel: 'read',
	},
	'generated.updateAutoModerationRule': {
		description: 'updateAutoModerationRule',
		riskLevel: 'read',
	},
	'generated.updateGuildMember': {
		description: 'updateGuildMember',
		riskLevel: 'read',
	},
	'generated.updateGuildRole': {
		description: 'updateGuildRole',
		riskLevel: 'read',
	},
	'generated.updateSelfVoiceState': {
		description: 'updateSelfVoiceState',
		riskLevel: 'read',
	},
	'generated.updateApplicationCommand': {
		description: 'updateApplicationCommand',
		riskLevel: 'read',
	},
	'generated.updateGuildTemplate': {
		description: 'updateGuildTemplate',
		riskLevel: 'read',
	},
	'generated.updateVoiceState': {
		description: 'updateVoiceState',
		riskLevel: 'read',
	},
	'generated.updateOriginalWebhookMessage': {
		description: 'updateOriginalWebhookMessage',
		riskLevel: 'read',
	},
	'generated.pinMessage': { description: 'pinMessage', riskLevel: 'read' },
	'generated.createGuildFromTemplate': {
		description: 'createGuildFromTemplate',
		riskLevel: 'read',
	},
	'generated.createInteractionResponse': {
		description: 'createInteractionResponse',
		riskLevel: 'read',
	},
	'generated.createMessage': {
		description: 'createMessage',
		riskLevel: 'read',
	},
	'generated.executeSlackCompatibleWebhook': {
		description: 'executeSlackCompatibleWebhook',
		riskLevel: 'read',
	},
	'generated.executeWebhook': {
		description: 'executeWebhook',
		riskLevel: 'read',
	},
	'generated.getGuildPreview': {
		description: 'getGuildPreview',
		riskLevel: 'read',
	},
	'generated.pruneGuild': { description: 'pruneGuild', riskLevel: 'read' },
	'generated.leaveThread': { description: 'leaveThread', riskLevel: 'read' },
	'generated.unbanUserFromGuild': {
		description: 'unbanUserFromGuild',
		riskLevel: 'read',
	},
	'generated.deleteGroupDmUser': {
		description: 'deleteGroupDmUser',
		riskLevel: 'read',
	},
	'generated.getApplication': {
		description: 'getApplication',
		riskLevel: 'read',
	},
	'generated.getApplicationRoleConnectionsMetadata': {
		description: 'getApplicationRoleConnectionsMetadata',
		riskLevel: 'read',
	},
	'generated.getAutoModerationRule': {
		description: 'getAutoModerationRule',
		riskLevel: 'read',
	},
	'generated.getBotGateway': {
		description: 'getBotGateway',
		riskLevel: 'read',
	},
	'generated.getChannel': { description: 'getChannel', riskLevel: 'read' },
	'generated.listChannelWebhooks': {
		description: 'listChannelWebhooks',
		riskLevel: 'read',
	},
	'generated.listAutoModerationRules': {
		description: 'listAutoModerationRules',
		riskLevel: 'read',
	},
	'generated.listGuildChannels': {
		description: 'listGuildChannels',
		riskLevel: 'read',
	},
	'generated.getGuildApplicationCommandPermissions': {
		description: 'getGuildApplicationCommandPermissions',
		riskLevel: 'read',
	},
	'generated.getGuild': { description: 'getGuild', riskLevel: 'read' },
	'generated.listGuildEmojis': {
		description: 'listGuildEmojis',
		riskLevel: 'read',
	},
	'generated.listGuildInvites': {
		description: 'listGuildInvites',
		riskLevel: 'read',
	},
	'generated.getGuildMember': {
		description: 'getGuildMember',
		riskLevel: 'read',
	},
	'generated.previewPruneGuild': {
		description: 'previewPruneGuild',
		riskLevel: 'read',
	},
	'generated.listGuildScheduledEvents': {
		description: 'listGuildScheduledEvents',
		riskLevel: 'read',
	},
	'generated.listGuildStickers': {
		description: 'listGuildStickers',
		riskLevel: 'read',
	},
	'generated.getGuildTemplate': {
		description: 'getGuildTemplate',
		riskLevel: 'read',
	},
	'generated.getGuildBan': { description: 'getGuildBan', riskLevel: 'read' },
	'generated.getGuildVanityUrl': {
		description: 'getGuildVanityUrl',
		riskLevel: 'read',
	},
	'generated.getGuildWebhooks': {
		description: 'getGuildWebhooks',
		riskLevel: 'read',
	},
	'generated.getGuildWelcomeScreen': {
		description: 'getGuildWelcomeScreen',
		riskLevel: 'read',
	},
	'generated.getGuildWidgetSettings': {
		description: 'getGuildWidgetSettings',
		riskLevel: 'read',
	},
	'generated.getGuildWidget': {
		description: 'getGuildWidget',
		riskLevel: 'read',
	},
	'generated.inviteResolve': {
		description: 'inviteResolve',
		riskLevel: 'read',
	},
	'generated.getMessage': { description: 'getMessage', riskLevel: 'read' },
	'generated.getOriginalWebhookMessage': {
		description: 'getOriginalWebhookMessage',
		riskLevel: 'read',
	},
	'generated.listPinnedMessages': {
		description: 'listPinnedMessages',
		riskLevel: 'read',
	},
	'generated.getStageInstance': {
		description: 'getStageInstance',
		riskLevel: 'read',
	},
	'generated.getSticker': { description: 'getSticker', riskLevel: 'read' },
	'generated.getGuildSticker': {
		description: 'getGuildSticker',
		riskLevel: 'read',
	},
	'generated.getThreadMember': {
		description: 'getThreadMember',
		riskLevel: 'read',
	},
	'generated.getUser': { description: 'getUser', riskLevel: 'read' },
	'generated.listGuildScheduledEventUsers': {
		description: 'listGuildScheduledEventUsers',
		riskLevel: 'read',
	},
	'generated.getWebhook': { description: 'getWebhook', riskLevel: 'read' },
	'generated.getWebhookByToken': {
		description: 'getWebhookByToken',
		riskLevel: 'read',
	},
	'generated.getWebhookMessage': {
		description: 'getWebhookMessage',
		riskLevel: 'read',
	},
	'generated.searchGuildMembers': {
		description: 'searchGuildMembers',
		riskLevel: 'read',
	},
	'generated.testAuth': { description: 'testAuth', riskLevel: 'read' },
	'generated.triggerTypingIndicator': {
		description: 'triggerTypingIndicator',
		riskLevel: 'read',
	},
	'generated.unpinMessage': { description: 'unpinMessage', riskLevel: 'read' },
	'generated.updateGuildWidgetSettings': {
		description: 'updateGuildWidgetSettings',
		riskLevel: 'read',
	},
	'generated.updateMyApplication': {
		description: 'updateMyApplication',
		riskLevel: 'read',
	},
	'generated.updateGuildApplicationCommand': {
		description: 'updateGuildApplicationCommand',
		riskLevel: 'read',
	},
	'generated.updateMyGuildMember': {
		description: 'updateMyGuildMember',
		riskLevel: 'read',
	},
	'generated.updateMessage': {
		description: 'updateMessage',
		riskLevel: 'read',
	},
	'generated.updateChannel': {
		description: 'updateChannel',
		riskLevel: 'read',
	},
	'generated.updateMyUser': { description: 'updateMyUser', riskLevel: 'read' },
	'generated.updateWebhookMessage': {
		description: 'updateWebhookMessage',
		riskLevel: 'read',
	},
	'generated.updateGuildEmoji': {
		description: 'updateGuildEmoji',
		riskLevel: 'read',
	},
	'generated.putGuildsOnboarding': {
		description: 'putGuildsOnboarding',
		riskLevel: 'read',
	},
	'generated.updateGuildScheduledEvent': {
		description: 'updateGuildScheduledEvent',
		riskLevel: 'read',
	},
	'generated.updateGuild': { description: 'updateGuild', riskLevel: 'read' },
	'generated.updateGuildSticker': {
		description: 'updateGuildSticker',
		riskLevel: 'read',
	},
	'generated.syncGuildTemplate': {
		description: 'syncGuildTemplate',
		riskLevel: 'read',
	},
	'generated.updateGuildWelcomeScreen': {
		description: 'updateGuildWelcomeScreen',
		riskLevel: 'read',
	},
	'generated.updateApplicationUserRoleConnection': {
		description: 'updateApplicationUserRoleConnection',
		riskLevel: 'read',
	},
	'generated.updateWebhook': {
		description: 'updateWebhook',
		riskLevel: 'read',
	},
	'generated.updateWebhookByToken': {
		description: 'updateWebhookByToken',
		riskLevel: 'read',
	},
	'generated.bulkDeleteMessages': {
		description: 'bulkDeleteMessages',
		riskLevel: 'read',
	},
	'commands.createGlobal': {
		description: 'createGlobal command',
		riskLevel: 'write',
	},
	'commands.getGlobal': {
		description: 'getGlobal command',
		riskLevel: 'write',
	},
	'commands.listGlobal': {
		description: 'listGlobal command',
		riskLevel: 'write',
	},
	'commands.updateGlobal': {
		description: 'updateGlobal command',
		riskLevel: 'write',
	},
	'commands.deleteGlobal': {
		description: 'deleteGlobal command',
		riskLevel: 'write',
	},
	'commands.createGuild': {
		description: 'createGuild command',
		riskLevel: 'write',
	},
	'commands.getGuild': { description: 'getGuild command', riskLevel: 'write' },
	'commands.listGuild': {
		description: 'listGuild command',
		riskLevel: 'write',
	},
	'commands.updateGuild': {
		description: 'updateGuild command',
		riskLevel: 'write',
	},
	'commands.deleteGuild': {
		description: 'deleteGuild command',
		riskLevel: 'write',
	},
	'moderation.guildsBanAdd': {
		description: 'guildsBanAdd moderation',
		riskLevel: 'write',
	},
	'moderation.guildsBanRemove': {
		description: 'guildsBanRemove moderation',
		riskLevel: 'write',
	},
	'moderation.guildsBansList': {
		description: 'guildsBansList moderation',
		riskLevel: 'write',
	},
	'moderation.guildsBanGet': {
		description: 'guildsBanGet moderation',
		riskLevel: 'write',
	},

	'messages.send': {
		riskLevel: 'write',
		description: 'Send a message to a channel',
	},
	'messages.reply': {
		riskLevel: 'write',
		description: 'Reply to a message in a channel',
	},
	'messages.get': { riskLevel: 'read', description: 'Get a specific message' },
	'messages.list': {
		riskLevel: 'read',
		description: 'List recent messages in a channel',
	},
	'messages.edit': {
		riskLevel: 'write',
		description: 'Edit an existing message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a message [DESTRUCTIVE]',
	},
	'threads.create': {
		riskLevel: 'write',
		description: 'Create a new thread in a channel',
	},
	'threads.createFromMessage': {
		riskLevel: 'write',
		description: 'Create a thread from an existing message',
	},
	'reactions.add': {
		riskLevel: 'write',
		description: 'Add a reaction to a message',
	},
	'reactions.remove': {
		riskLevel: 'write',
		description: 'Remove a reaction from a message',
	},
	'reactions.list': {
		riskLevel: 'read',
		description: 'List reactions on a message',
	},
	'guilds.list': {
		riskLevel: 'read',
		description: 'List guilds the bot is a member of',
	},
	'guilds.get': { riskLevel: 'read', description: 'Get info about a guild' },
	'channels.list': {
		riskLevel: 'read',
		description: 'List channels in a guild',
	},
	'members.list': { riskLevel: 'read', description: 'List members of a guild' },
	'members.get': {
		riskLevel: 'read',
		description: 'Get info about a guild member',
	},
} as any;

export const discordAuthConfig = {
	api_key: {
		account: ['guild_id'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Type Hierarchy ──────────────────────────────────────────────────────

export type BaseDiscordPlugin<T extends DiscordPluginOptions> = CorsairPlugin<
	'discord',
	typeof DiscordSchema,
	typeof discordEndpointsNested,
	typeof discordWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDiscordPlugin = BaseDiscordPlugin<DiscordPluginOptions>;

export type ExternalDiscordPlugin<T extends DiscordPluginOptions> =
	BaseDiscordPlugin<T>;

// ── Plugin Factory ─────────────────────────────────────────────────────────────

export function discord<const T extends DiscordPluginOptions>(
	incomingOptions: DiscordPluginOptions & T = {} as DiscordPluginOptions & T,
): ExternalDiscordPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'discord',
		authConfig: discordAuthConfig,
		schema: DiscordSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: discordEndpointsNested,
		webhooks: discordWebhooksNested,
		endpointMeta: discordEndpointMeta,
		endpointSchemas: discordEndpointSchemas,
		webhookSchemas: discordWebhookSchemas,

		/**
		 * Identifies incoming Discord interaction webhooks.
		 *
		 * Discord does not send an explicit "X-Discord-*" header, so we fingerprint
		 * the request using two signals:
		 *   1. Both Ed25519 signature headers must be present (Discord-specific names).
		 *   2. The body must look like a Discord interaction object: it must have an
		 *      `application_id` string (a Discord snowflake) and a numeric `type`
		 *      in the range 1–5 (PING → MODAL_SUBMIT).
		 */
		pluginWebhookMatcher: ({ body, headers }) => {
			if (
				!headers['x-signature-ed25519'] ||
				!headers['x-signature-timestamp']
			) {
				return false;
			}

			try {
				const parsedBody =
					typeof body === 'string'
						? (JSON.parse(body) as Record<string, unknown>)
						: (body as Record<string, unknown>);

				return (
					typeof parsedBody?.application_id === 'string' &&
					typeof parsedBody?.type === 'number' &&
					parsedBody.type >= 1 &&
					parsedBody.type <= 5
				);
			} catch {
				return false;
			}
		},
		pluginTenantWebhookMatcher: matchDiscordTenantWebhook,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		/**
		 * Resolves the appropriate credential for the calling context:
		 *
		 * - source === 'webhook'  → Ed25519 public key for interaction signature verification
		 * - source === 'endpoint' → Bot token for Discord REST API calls (used as "Bot <token>")
		 */
		keyBuilder: async (ctx: DiscordKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'webhook') {
				if (options.publicKey) return options.publicKey;
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint') {
				if (options.key) return options.key;
				if (ctx.authType === 'api_key') {
					const res = await ctx.keys.get_api_key();
					return res ?? '';
				}
			}

			throw new AuthMissingError('discord', 'api_key');
		},
	} satisfies InternalDiscordPlugin;
}

// ── Type Exports ───────────────────────────────────────────────────────────────

export type {
	// Shared response / entity types
	Attachment,
	Channel,
	// Endpoint input types (needed so callers can name them in their own code)
	ChannelsListInput,
	DiscordEndpointInputs,
	DiscordEndpointOutputs,
	DiscordUser,
	Embed,
	Guild,
	GuildMember,
	GuildsGetInput,
	GuildsListInput,
	MembersGetInput,
	MembersListInput,
	Message,
	MessageReference,
	MessagesDeleteInput,
	MessagesEditInput,
	MessagesGetInput,
	MessagesListInput,
	MessagesReplyInput,
	MessagesSendInput,
	PartialGuild,
	ReactionsAddInput,
	ReactionsListInput,
	ReactionsRemoveInput,
	Role,
	SuccessResponse,
	ThreadsCreateFromMessageInput,
	ThreadsCreateInput,
} from './endpoints/types';
export type {
	ApplicationCommandData,
	ApplicationCommandOption,
	DiscordApplicationCommandInteraction,
	DiscordGuildMemberPartial,
	DiscordInteraction,
	DiscordInteractionTypeValue,
	DiscordMessageComponentInteraction,
	DiscordMessagePartial,
	DiscordModalSubmitInteraction,
	DiscordPingInteraction,
	DiscordWebhookOutputs,
	MessageComponentData,
	ModalSubmitData,
} from './webhooks/types';
