import { logEventFromContext } from 'corsair/core';
import { makeDiscordRequest } from '../client';
import type { DiscordContext, DiscordEndpoints } from '../index';
import type { DiscordEndpointInputs, DiscordEndpointOutputs } from './types';

export const followChannel = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['followChannel'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['followChannel']>(
		`/channels/${input.channel_id}/followers`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const addGuildMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['addGuildMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['addGuildMember']>(
		`/guilds/${input.guild_id}/members/${input.user_id}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const addMyMessageReaction = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['addMyMessageReaction'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['addMyMessageReaction']>(
		`/channels/${input.channel_id}/messages/${input.message_id}/reactions/${input.emoji_name}/@me`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const addGroupDmUser = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['addGroupDmUser'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['addGroupDmUser']>(
		`/channels/${input.channel_id}/recipients/${input.user_id}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const addThreadMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['addThreadMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['addThreadMember']>(
		`/channels/${input.channel_id}/thread-members/${input.user_id}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const addGuildMemberRole = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['addGuildMemberRole'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['addGuildMemberRole']>(
		`/guilds/${input.guild_id}/members/${input.user_id}/roles/${input.role_id}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const banUserFromGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['banUserFromGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['banUserFromGuild']>(
		`/guilds/${input.guild_id}/bans/${input.user_id}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const bulkBanUsersFromGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['bulkBanUsersFromGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['bulkBanUsersFromGuild']>(
		`/guilds/${input.guild_id}/bulk-ban`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createChannelInvite = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createChannelInvite'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createChannelInvite']>(
		`/channels/${input.channel_id}/invites`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createStageInstance = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createStageInstance'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createStageInstance']>(
		`/stage-instances`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createApplicationCommand']>(
		`/applications/${input.application_id}/commands`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createWebhook = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createWebhook'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createWebhook']>(
		`/channels/${input.channel_id}/webhooks`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createGuildApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['createGuildApplicationCommand']
	>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createAutoModerationRule = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createAutoModerationRule'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createAutoModerationRule']>(
		`/guilds/${input.guild_id}/auto-moderation/rules`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createGuildChannel = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildChannel'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createGuildChannel']>(
		`/guilds/${input.guild_id}/channels`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createGuildEmoji = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildEmoji'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createGuildEmoji']>(
		`/guilds/${input.guild_id}/emojis`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createGuildScheduledEvent = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildScheduledEvent'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['createGuildScheduledEvent']
	>(`/guilds/${input.guild_id}/scheduled-events`, ctx.key, {
		method: 'POST',
		body: input,
	});
};

export const createGuildSticker = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildSticker'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createGuildSticker']>(
		`/guilds/${input.guild_id}/stickers`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createGuildTemplate = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildTemplate'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createGuildTemplate']>(
		`/guilds/${input.guild_id}/templates`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createGuild']>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createThread = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createThread'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createThread']>(
		`/channels/${input.channel_id}/threads`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createGuildRole = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildRole'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createGuildRole']>(
		`/guilds/${input.guild_id}/roles`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createThreadFromMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createThreadFromMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createThreadFromMessage']>(
		`/channels/${input.channel_id}/messages/${input.message_id}/threads`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const crosspostMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['crosspostMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['crosspostMessage']>(
		`/channels/${input.channel_id}/messages/${input.message_id}/crosspost`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const deleteAllMessageReactions = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteAllMessageReactions'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['deleteAllMessageReactions']
	>(
		`/channels/${input.channel_id}/messages/${input.message_id}/reactions`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteApplicationCommand']>(
		`/applications/${input.application_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteChannel = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteChannel'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteChannel']>(
		`/channels/${input.channel_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteMessage']>(
		`/channels/${input.channel_id}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteAllMessageReactionsByEmoji = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteAllMessageReactionsByEmoji'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['deleteAllMessageReactionsByEmoji']
	>(
		`/channels/${input.channel_id}/messages/${input.message_id}/reactions/${input.emoji_name}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteChannelPermissionOverwrite = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteChannelPermissionOverwrite'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['deleteChannelPermissionOverwrite']
	>(
		`/channels/${input.channel_id}/permissions/${input.overwrite_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteThreadMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteThreadMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteThreadMember']>(
		`/channels/${input.channel_id}/thread-members/${input.user_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteAutoModerationRule = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteAutoModerationRule'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteAutoModerationRule']>(
		`/guilds/${input.guild_id}/auto-moderation/rules/${input.rule_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuild']>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['deleteGuildApplicationCommand']
	>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildEmoji = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildEmoji'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildEmoji']>(
		`/guilds/${input.guild_id}/emojis/${input.emoji_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildIntegration = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildIntegration'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildIntegration']>(
		`/guilds/${input.guild_id}/integrations/${input.integration_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildMember']>(
		`/guilds/${input.guild_id}/members/${input.user_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildMemberRole = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildMemberRole'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildMemberRole']>(
		`/guilds/${input.guild_id}/members/${input.user_id}/roles/${input.role_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildScheduledEvent = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildScheduledEvent'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['deleteGuildScheduledEvent']
	>(
		`/guilds/${input.guild_id}/scheduled-events/${input.guild_scheduled_event_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildSticker = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildSticker'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildSticker']>(
		`/guilds/${input.guild_id}/stickers/${input.sticker_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildTemplate = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildTemplate'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildTemplate']>(
		`/guilds/${input.guild_id}/templates/${input.code}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const inviteRevoke = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['inviteRevoke'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['inviteRevoke']>(
		`/invites/${input.code}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteOriginalWebhookMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteOriginalWebhookMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['deleteOriginalWebhookMessage']
	>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}/messages/@original`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGuildRole = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGuildRole'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildRole']>(
		`/guilds/${input.guild_id}/roles/${input.role_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteStageInstance = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteStageInstance'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteStageInstance']>(
		`/stage-instances/${input.channel_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteUserMessageReaction = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteUserMessageReaction'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['deleteUserMessageReaction']
	>(
		`/channels/${input.channel_id}/messages/${input.message_id}/reactions/${input.emoji_name}/${input.user_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteMyMessageReaction = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteMyMessageReaction'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteMyMessageReaction']>(
		`/channels/${input.channel_id}/messages/${input.message_id}/reactions/${input.emoji_name}/@me`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteWebhook = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteWebhook'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteWebhook']>(
		`/webhooks/${input.webhook_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteWebhookMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteWebhookMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteWebhookMessage']>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteWebhookByToken = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteWebhookByToken'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteWebhookByToken']>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const getApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getApplicationCommand']>(
		`/applications/${input.application_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildEmoji = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildEmoji'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildEmoji']>(
		`/guilds/${input.guild_id}/emojis/${input.emoji_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['getGuildApplicationCommand']
	>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildApplicationCommands = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildApplicationCommands'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['listGuildApplicationCommands']
	>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listMessages = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listMessages'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listMessages']>(
		`/channels/${input.channel_id}/messages`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listVoiceRegions = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listVoiceRegions'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listVoiceRegions']>(
		`/voice/regions`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildApplicationCommandPermissions = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildApplicationCommandPermissions'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['listGuildApplicationCommandPermissions']
	>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands/permissions`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listPrivateArchivedThreads = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listPrivateArchivedThreads'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['listPrivateArchivedThreads']
	>(`/channels/${input.channel_id}/threads/archived/private`, ctx.key, {
		method: 'GET',
		query: input,
	});
};

export const listPublicArchivedThreads = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listPublicArchivedThreads'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['listPublicArchivedThreads']
	>(`/channels/${input.channel_id}/threads/archived/public`, ctx.key, {
		method: 'GET',
		query: input,
	});
};

export const listMessageReactionsByEmoji = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listMessageReactionsByEmoji'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['listMessageReactionsByEmoji']
	>(
		`/channels/${input.channel_id}/messages/${input.message_id}/reactions/${input.emoji_name}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGateway = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGateway'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGateway']>(
		`/gateway`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildAuditLogEntries = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildAuditLogEntries'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildAuditLogEntries']>(
		`/guilds/${input.guild_id}/audit-logs`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildMembers = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildMembers'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildMembers']>(
		`/guilds/${input.guild_id}/members`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildsOnboarding = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildsOnboarding'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildsOnboarding']>(
		`/guilds/${input.guild_id}/onboarding`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildScheduledEvent = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildScheduledEvent'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildScheduledEvent']>(
		`/guilds/${input.guild_id}/scheduled-events/${input.guild_scheduled_event_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildTemplates = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildTemplates'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildTemplates']>(
		`/guilds/${input.guild_id}/templates`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildWidgetPng = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildWidgetPng'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildWidgetPng']>(
		`/guilds/${input.guild_id}/widget.png`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getMyOauth2Application = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getMyOauth2Application'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getMyOauth2Application']>(
		`/oauth2/applications/@me`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getPublicKeys = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getPublicKeys'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getPublicKeys']>(
		`/oauth2/keys`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listMyPrivateArchivedThreads = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listMyPrivateArchivedThreads'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['listMyPrivateArchivedThreads']
	>(
		`/channels/${input.channel_id}/users/@me/threads/archived/private`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getApplicationUserRoleConnection = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getApplicationUserRoleConnection'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['getApplicationUserRoleConnection']
	>(
		`/users/@me/applications/${input.application_id}/role-connection`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getMyApplication = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getMyApplication'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getMyApplication']>(
		`/applications/@me`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const executeGithubCompatibleWebhook = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['executeGithubCompatibleWebhook'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['executeGithubCompatibleWebhook']
	>(`/webhooks/${input.webhook_id}/${input.webhook_token}/github`, ctx.key, {
		method: 'POST',
		body: input,
	});
};

export const createDm = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createDm'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createDm']>(
		`/users/@me/channels`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const joinThread = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['joinThread'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['joinThread']>(
		`/channels/${input.channel_id}/thread-members/@me`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const leaveGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['leaveGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['leaveGuild']>(
		`/users/@me/guilds/${input.guild_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const listChannelInvites = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listChannelInvites'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listChannelInvites']>(
		`/channels/${input.channel_id}/invites`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getActiveGuildThreads = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getActiveGuildThreads'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getActiveGuildThreads']>(
		`/guilds/${input.guild_id}/threads/active`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listApplicationCommands = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listApplicationCommands'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listApplicationCommands']>(
		`/applications/${input.application_id}/commands`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildBans = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildBans'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildBans']>(
		`/guilds/${input.guild_id}/bans`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildIntegrations = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildIntegrations'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildIntegrations']>(
		`/guilds/${input.guild_id}/integrations`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildVoiceRegions = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildVoiceRegions'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildVoiceRegions']>(
		`/guilds/${input.guild_id}/regions`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildRoles = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildRoles'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildRoles']>(
		`/guilds/${input.guild_id}/roles`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listStickerPacks = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listStickerPacks'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listStickerPacks']>(
		`/sticker-packs`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listThreadMembers = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listThreadMembers'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listThreadMembers']>(
		`/channels/${input.channel_id}/thread-members`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const updateApplication = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateApplication'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateApplication']>(
		`/applications/${input.application_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const setChannelPermissionOverwrite = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['setChannelPermissionOverwrite'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['setChannelPermissionOverwrite']
	>(
		`/channels/${input.channel_id}/permissions/${input.overwrite_id}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const updateAutoModerationRule = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateAutoModerationRule'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateAutoModerationRule']>(
		`/guilds/${input.guild_id}/auto-moderation/rules/${input.rule_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateGuildMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateGuildMember']>(
		`/guilds/${input.guild_id}/members/${input.user_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateGuildRole = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildRole'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateGuildRole']>(
		`/guilds/${input.guild_id}/roles/${input.role_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateSelfVoiceState = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateSelfVoiceState'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateSelfVoiceState']>(
		`/guilds/${input.guild_id}/voice-states/@me`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateApplicationCommand']>(
		`/applications/${input.application_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateGuildTemplate = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildTemplate'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateGuildTemplate']>(
		`/guilds/${input.guild_id}/templates/${input.code}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateVoiceState = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateVoiceState'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateVoiceState']>(
		`/guilds/${input.guild_id}/voice-states/${input.user_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateOriginalWebhookMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateOriginalWebhookMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['updateOriginalWebhookMessage']
	>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}/messages/@original`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const pinMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['pinMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['pinMessage']>(
		`/channels/${input.channel_id}/pins/${input.message_id}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const createGuildFromTemplate = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createGuildFromTemplate'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createGuildFromTemplate']>(
		`/guilds/templates/${input.template_code}`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createInteractionResponse = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createInteractionResponse'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['createInteractionResponse']
	>(
		`/interactions/${input.interaction_id}/${input.interaction_token}/callback`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const createMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['createMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['createMessage']>(
		`/channels/${input.channel_id}/messages`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const executeSlackCompatibleWebhook = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['executeSlackCompatibleWebhook'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['executeSlackCompatibleWebhook']
	>(`/webhooks/${input.webhook_id}/${input.webhook_token}/slack`, ctx.key, {
		method: 'POST',
		body: input,
	});
};

export const executeWebhook = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['executeWebhook'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['executeWebhook']>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const getGuildPreview = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildPreview'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildPreview']>(
		`/guilds/${input.guild_id}/preview`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const pruneGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['pruneGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['pruneGuild']>(
		`/guilds/${input.guild_id}/prune`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const leaveThread = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['leaveThread'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['leaveThread']>(
		`/channels/${input.channel_id}/thread-members/@me`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const unbanUserFromGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['unbanUserFromGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['unbanUserFromGuild']>(
		`/guilds/${input.guild_id}/bans/${input.user_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const deleteGroupDmUser = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['deleteGroupDmUser'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['deleteGroupDmUser']>(
		`/channels/${input.channel_id}/recipients/${input.user_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const getApplication = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getApplication'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getApplication']>(
		`/applications/${input.application_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getApplicationRoleConnectionsMetadata = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getApplicationRoleConnectionsMetadata'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['getApplicationRoleConnectionsMetadata']
	>(
		`/applications/${input.application_id}/role-connections/metadata`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getAutoModerationRule = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getAutoModerationRule'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getAutoModerationRule']>(
		`/guilds/${input.guild_id}/auto-moderation/rules/${input.rule_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getBotGateway = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getBotGateway'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getBotGateway']>(
		`/gateway/bot`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getChannel = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getChannel'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getChannel']>(
		`/channels/${input.channel_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listChannelWebhooks = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listChannelWebhooks'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listChannelWebhooks']>(
		`/channels/${input.channel_id}/webhooks`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listAutoModerationRules = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listAutoModerationRules'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listAutoModerationRules']>(
		`/guilds/${input.guild_id}/auto-moderation/rules`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildChannels = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildChannels'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildChannels']>(
		`/guilds/${input.guild_id}/channels`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildApplicationCommandPermissions = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildApplicationCommandPermissions'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['getGuildApplicationCommandPermissions']
	>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands/${input.command_id}/permissions`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuild']>(
		`/guilds/${input.guild_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildEmojis = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildEmojis'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildEmojis']>(
		`/guilds/${input.guild_id}/emojis`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildInvites = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildInvites'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildInvites']>(
		`/guilds/${input.guild_id}/invites`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildMember']>(
		`/guilds/${input.guild_id}/members/${input.user_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const previewPruneGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['previewPruneGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['previewPruneGuild']>(
		`/guilds/${input.guild_id}/prune`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildScheduledEvents = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildScheduledEvents'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildScheduledEvents']>(
		`/guilds/${input.guild_id}/scheduled-events`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildStickers = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildStickers'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listGuildStickers']>(
		`/guilds/${input.guild_id}/stickers`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildTemplate = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildTemplate'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildTemplate']>(
		`/guilds/templates/${input.code}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildBan = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildBan'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildBan']>(
		`/guilds/${input.guild_id}/bans/${input.user_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildVanityUrl = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildVanityUrl'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildVanityUrl']>(
		`/guilds/${input.guild_id}/vanity-url`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildWebhooks = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildWebhooks'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildWebhooks']>(
		`/guilds/${input.guild_id}/webhooks`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildWelcomeScreen = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildWelcomeScreen'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildWelcomeScreen']>(
		`/guilds/${input.guild_id}/welcome-screen`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildWidgetSettings = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildWidgetSettings'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildWidgetSettings']>(
		`/guilds/${input.guild_id}/widget`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildWidget = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildWidget'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildWidget']>(
		`/guilds/${input.guild_id}/widget.json`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const inviteResolve = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['inviteResolve'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['inviteResolve']>(
		`/invites/${input.code}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getMessage']>(
		`/channels/${input.channel_id}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getOriginalWebhookMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getOriginalWebhookMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['getOriginalWebhookMessage']
	>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}/messages/@original`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listPinnedMessages = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listPinnedMessages'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['listPinnedMessages']>(
		`/channels/${input.channel_id}/pins`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getStageInstance = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getStageInstance'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getStageInstance']>(
		`/stage-instances/${input.channel_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getSticker = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getSticker'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getSticker']>(
		`/stickers/${input.sticker_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getGuildSticker = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getGuildSticker'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getGuildSticker']>(
		`/guilds/${input.guild_id}/stickers/${input.sticker_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getThreadMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getThreadMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getThreadMember']>(
		`/channels/${input.channel_id}/thread-members/${input.user_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getUser = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getUser'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getUser']>(
		`/users/${input.user_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const listGuildScheduledEventUsers = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['listGuildScheduledEventUsers'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['listGuildScheduledEventUsers']
	>(
		`/guilds/${input.guild_id}/scheduled-events/${input.guild_scheduled_event_id}/users`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getWebhook = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getWebhook'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getWebhook']>(
		`/webhooks/${input.webhook_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getWebhookByToken = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getWebhookByToken'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getWebhookByToken']>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const getWebhookMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['getWebhookMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['getWebhookMessage']>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const searchGuildMembers = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['searchGuildMembers'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['searchGuildMembers']>(
		`/guilds/${input.guild_id}/members/search`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const testAuth = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['testAuth'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['testAuth']>(
		`/users/@me`,
		ctx.key,
		{ method: 'GET', query: input },
	);
};

export const triggerTypingIndicator = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['triggerTypingIndicator'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['triggerTypingIndicator']>(
		`/channels/${input.channel_id}/typing`,
		ctx.key,
		{ method: 'POST', body: input },
	);
};

export const unpinMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['unpinMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['unpinMessage']>(
		`/channels/${input.channel_id}/pins/${input.message_id}`,
		ctx.key,
		{ method: 'DELETE', body: input },
	);
};

export const updateGuildWidgetSettings = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildWidgetSettings'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['updateGuildWidgetSettings']
	>(`/guilds/${input.guild_id}/widget`, ctx.key, {
		method: 'PATCH',
		body: input,
	});
};

export const updateMyApplication = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateMyApplication'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateMyApplication']>(
		`/applications/@me`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateGuildApplicationCommand = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildApplicationCommand'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['updateGuildApplicationCommand']
	>(
		`/applications/${input.application_id}/guilds/${input.guild_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateMyGuildMember = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateMyGuildMember'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateMyGuildMember']>(
		`/guilds/${input.guild_id}/members/@me`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateMessage']>(
		`/channels/${input.channel_id}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateChannel = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateChannel'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateChannel']>(
		`/channels/${input.channel_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateMyUser = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateMyUser'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateMyUser']>(
		`/users/@me`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateWebhookMessage = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateWebhookMessage'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateWebhookMessage']>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateGuildEmoji = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildEmoji'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateGuildEmoji']>(
		`/guilds/${input.guild_id}/emojis/${input.emoji_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const putGuildsOnboarding = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['putGuildsOnboarding'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['putGuildsOnboarding']>(
		`/guilds/${input.guild_id}/onboarding`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const updateGuildScheduledEvent = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildScheduledEvent'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['updateGuildScheduledEvent']
	>(
		`/guilds/${input.guild_id}/scheduled-events/${input.guild_scheduled_event_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateGuild = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuild'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateGuild']>(
		`/guilds/${input.guild_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateGuildSticker = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildSticker'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateGuildSticker']>(
		`/guilds/${input.guild_id}/stickers/${input.sticker_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const syncGuildTemplate = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['syncGuildTemplate'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['syncGuildTemplate']>(
		`/guilds/${input.guild_id}/templates/${input.code}`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const updateGuildWelcomeScreen = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateGuildWelcomeScreen'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateGuildWelcomeScreen']>(
		`/guilds/${input.guild_id}/welcome-screen`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateApplicationUserRoleConnection = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateApplicationUserRoleConnection'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<
		DiscordEndpointOutputs['updateApplicationUserRoleConnection']
	>(
		`/users/@me/applications/${input.application_id}/role-connection`,
		ctx.key,
		{ method: 'PUT', body: input },
	);
};

export const updateWebhook = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateWebhook'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateWebhook']>(
		`/webhooks/${input.webhook_id}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const updateWebhookByToken = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['updateWebhookByToken'],
) => {
	// Auto-generated endpoint
	return makeDiscordRequest<DiscordEndpointOutputs['updateWebhookByToken']>(
		`/webhooks/${input.webhook_id}/${input.webhook_token}`,
		ctx.key,
		{ method: 'PATCH', body: input },
	);
};

export const bulkDeleteMessages = async (
	ctx: DiscordContext,
	input: DiscordEndpointInputs['bulkDeleteMessages'],
) => {
	const { channel_id, ...body } = input;
	await makeDiscordRequest<void>(
		`channels/${channel_id}/messages/bulk-delete`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'discord.generated.bulkDeleteMessages',
		{ channel_id, ...body },
		'completed',
	);
	return undefined as any;
};
