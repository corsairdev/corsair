import type { DiscordContext, DiscordEndpoints } from '../index';
import { logEventFromContext } from 'corsair/core';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';
import type { DiscordEndpointInputs } from './types';


export const followChannel = async (ctx: DiscordContext, input: DiscordEndpointInputs['followChannel']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['followChannel']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const addGuildMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['addGuildMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['addGuildMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const addMyMessageReaction = async (ctx: DiscordContext, input: DiscordEndpointInputs['addMyMessageReaction']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['addMyMessageReaction']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const addGroupDmUser = async (ctx: DiscordContext, input: DiscordEndpointInputs['addGroupDmUser']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['addGroupDmUser']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const addThreadMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['addThreadMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['addThreadMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const addGuildMemberRole = async (ctx: DiscordContext, input: DiscordEndpointInputs['addGuildMemberRole']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['addGuildMemberRole']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const banUserFromGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['banUserFromGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['banUserFromGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const bulkBanUsersFromGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['bulkBanUsersFromGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['bulkBanUsersFromGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createChannelInvite = async (ctx: DiscordContext, input: DiscordEndpointInputs['createChannelInvite']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createChannelInvite']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createStageInstance = async (ctx: DiscordContext, input: DiscordEndpointInputs['createStageInstance']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createStageInstance']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['createApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createWebhook = async (ctx: DiscordContext, input: DiscordEndpointInputs['createWebhook']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createWebhook']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createAutoModerationRule = async (ctx: DiscordContext, input: DiscordEndpointInputs['createAutoModerationRule']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createAutoModerationRule']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildChannel = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildChannel']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildChannel']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildEmoji = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildEmoji']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildEmoji']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildScheduledEvent = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildScheduledEvent']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildScheduledEvent']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildSticker = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildSticker']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildSticker']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildTemplate = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildTemplate']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildTemplate']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createThread = async (ctx: DiscordContext, input: DiscordEndpointInputs['createThread']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createThread']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildRole = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildRole']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildRole']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createThreadFromMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['createThreadFromMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createThreadFromMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const crosspostMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['crosspostMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['crosspostMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteAllMessageReactions = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteAllMessageReactions']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteAllMessageReactions']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteChannel = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteChannel']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteChannel']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteAllMessageReactionsByEmoji = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteAllMessageReactionsByEmoji']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteAllMessageReactionsByEmoji']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteChannelPermissionOverwrite = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteChannelPermissionOverwrite']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteChannelPermissionOverwrite']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteThreadMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteThreadMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteThreadMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteAutoModerationRule = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteAutoModerationRule']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteAutoModerationRule']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildEmoji = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildEmoji']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildEmoji']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildIntegration = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildIntegration']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildIntegration']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildMemberRole = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildMemberRole']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildMemberRole']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildScheduledEvent = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildScheduledEvent']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildScheduledEvent']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildSticker = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildSticker']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildSticker']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildTemplate = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildTemplate']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildTemplate']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const inviteRevoke = async (ctx: DiscordContext, input: DiscordEndpointInputs['inviteRevoke']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['inviteRevoke']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteOriginalWebhookMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteOriginalWebhookMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteOriginalWebhookMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGuildRole = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGuildRole']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGuildRole']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteStageInstance = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteStageInstance']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteStageInstance']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteUserMessageReaction = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteUserMessageReaction']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteUserMessageReaction']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteMyMessageReaction = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteMyMessageReaction']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteMyMessageReaction']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteWebhook = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteWebhook']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteWebhook']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteWebhookMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteWebhookMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteWebhookMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteWebhookByToken = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteWebhookByToken']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteWebhookByToken']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['getApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildEmoji = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildEmoji']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildEmoji']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildApplicationCommands = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildApplicationCommands']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildApplicationCommands']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listMessages = async (ctx: DiscordContext, input: DiscordEndpointInputs['listMessages']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listMessages']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listVoiceRegions = async (ctx: DiscordContext, input: DiscordEndpointInputs['listVoiceRegions']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listVoiceRegions']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildApplicationCommandPermissions = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildApplicationCommandPermissions']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildApplicationCommandPermissions']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listPrivateArchivedThreads = async (ctx: DiscordContext, input: DiscordEndpointInputs['listPrivateArchivedThreads']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listPrivateArchivedThreads']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listPublicArchivedThreads = async (ctx: DiscordContext, input: DiscordEndpointInputs['listPublicArchivedThreads']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listPublicArchivedThreads']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listMessageReactionsByEmoji = async (ctx: DiscordContext, input: DiscordEndpointInputs['listMessageReactionsByEmoji']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listMessageReactionsByEmoji']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGateway = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGateway']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGateway']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildAuditLogEntries = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildAuditLogEntries']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildAuditLogEntries']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildMembers = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildMembers']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildMembers']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildsOnboarding = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildsOnboarding']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildsOnboarding']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildScheduledEvent = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildScheduledEvent']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildScheduledEvent']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildTemplates = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildTemplates']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildTemplates']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildWidgetPng = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildWidgetPng']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildWidgetPng']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getMyOauth2Application = async (ctx: DiscordContext, input: DiscordEndpointInputs['getMyOauth2Application']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getMyOauth2Application']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getPublicKeys = async (ctx: DiscordContext, input: DiscordEndpointInputs['getPublicKeys']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getPublicKeys']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listMyPrivateArchivedThreads = async (ctx: DiscordContext, input: DiscordEndpointInputs['listMyPrivateArchivedThreads']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listMyPrivateArchivedThreads']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getApplicationUserRoleConnection = async (ctx: DiscordContext, input: DiscordEndpointInputs['getApplicationUserRoleConnection']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getApplicationUserRoleConnection']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getMyApplication = async (ctx: DiscordContext, input: DiscordEndpointInputs['getMyApplication']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getMyApplication']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const executeGithubCompatibleWebhook = async (ctx: DiscordContext, input: DiscordEndpointInputs['executeGithubCompatibleWebhook']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['executeGithubCompatibleWebhook']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createDm = async (ctx: DiscordContext, input: DiscordEndpointInputs['createDm']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createDm']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const joinThread = async (ctx: DiscordContext, input: DiscordEndpointInputs['joinThread']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['joinThread']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const leaveGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['leaveGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['leaveGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listChannelInvites = async (ctx: DiscordContext, input: DiscordEndpointInputs['listChannelInvites']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listChannelInvites']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getActiveGuildThreads = async (ctx: DiscordContext, input: DiscordEndpointInputs['getActiveGuildThreads']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getActiveGuildThreads']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listApplicationCommands = async (ctx: DiscordContext, input: DiscordEndpointInputs['listApplicationCommands']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listApplicationCommands']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildBans = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildBans']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildBans']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildIntegrations = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildIntegrations']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildIntegrations']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildVoiceRegions = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildVoiceRegions']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildVoiceRegions']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildRoles = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildRoles']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildRoles']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listStickerPacks = async (ctx: DiscordContext, input: DiscordEndpointInputs['listStickerPacks']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listStickerPacks']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listThreadMembers = async (ctx: DiscordContext, input: DiscordEndpointInputs['listThreadMembers']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listThreadMembers']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateApplication = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateApplication']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateApplication']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const setChannelPermissionOverwrite = async (ctx: DiscordContext, input: DiscordEndpointInputs['setChannelPermissionOverwrite']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['setChannelPermissionOverwrite']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateAutoModerationRule = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateAutoModerationRule']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateAutoModerationRule']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildRole = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildRole']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildRole']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateSelfVoiceState = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateSelfVoiceState']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateSelfVoiceState']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildTemplate = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildTemplate']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildTemplate']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateVoiceState = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateVoiceState']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateVoiceState']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateOriginalWebhookMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateOriginalWebhookMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateOriginalWebhookMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const pinMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['pinMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['pinMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createGuildFromTemplate = async (ctx: DiscordContext, input: DiscordEndpointInputs['createGuildFromTemplate']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createGuildFromTemplate']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createInteractionResponse = async (ctx: DiscordContext, input: DiscordEndpointInputs['createInteractionResponse']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createInteractionResponse']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const createMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['createMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['createMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const executeSlackCompatibleWebhook = async (ctx: DiscordContext, input: DiscordEndpointInputs['executeSlackCompatibleWebhook']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['executeSlackCompatibleWebhook']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const executeWebhook = async (ctx: DiscordContext, input: DiscordEndpointInputs['executeWebhook']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['executeWebhook']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildPreview = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildPreview']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildPreview']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const pruneGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['pruneGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['pruneGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const leaveThread = async (ctx: DiscordContext, input: DiscordEndpointInputs['leaveThread']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['leaveThread']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const unbanUserFromGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['unbanUserFromGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['unbanUserFromGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const deleteGroupDmUser = async (ctx: DiscordContext, input: DiscordEndpointInputs['deleteGroupDmUser']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['deleteGroupDmUser']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getApplication = async (ctx: DiscordContext, input: DiscordEndpointInputs['getApplication']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getApplication']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getApplicationRoleConnectionsMetadata = async (ctx: DiscordContext, input: DiscordEndpointInputs['getApplicationRoleConnectionsMetadata']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getApplicationRoleConnectionsMetadata']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getAutoModerationRule = async (ctx: DiscordContext, input: DiscordEndpointInputs['getAutoModerationRule']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getAutoModerationRule']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getBotGateway = async (ctx: DiscordContext, input: DiscordEndpointInputs['getBotGateway']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getBotGateway']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getChannel = async (ctx: DiscordContext, input: DiscordEndpointInputs['getChannel']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getChannel']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listChannelWebhooks = async (ctx: DiscordContext, input: DiscordEndpointInputs['listChannelWebhooks']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listChannelWebhooks']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listAutoModerationRules = async (ctx: DiscordContext, input: DiscordEndpointInputs['listAutoModerationRules']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listAutoModerationRules']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildChannels = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildChannels']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildChannels']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildApplicationCommandPermissions = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildApplicationCommandPermissions']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildApplicationCommandPermissions']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildEmojis = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildEmojis']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildEmojis']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildInvites = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildInvites']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildInvites']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const previewPruneGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['previewPruneGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['previewPruneGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildScheduledEvents = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildScheduledEvents']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildScheduledEvents']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildStickers = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildStickers']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildStickers']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildTemplate = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildTemplate']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildTemplate']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildBan = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildBan']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildBan']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildVanityUrl = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildVanityUrl']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildVanityUrl']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildWebhooks = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildWebhooks']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildWebhooks']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildWelcomeScreen = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildWelcomeScreen']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildWelcomeScreen']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildWidgetSettings = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildWidgetSettings']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildWidgetSettings']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildWidget = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildWidget']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildWidget']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const inviteResolve = async (ctx: DiscordContext, input: DiscordEndpointInputs['inviteResolve']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['inviteResolve']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['getMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getOriginalWebhookMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['getOriginalWebhookMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getOriginalWebhookMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listPinnedMessages = async (ctx: DiscordContext, input: DiscordEndpointInputs['listPinnedMessages']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listPinnedMessages']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getStageInstance = async (ctx: DiscordContext, input: DiscordEndpointInputs['getStageInstance']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getStageInstance']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getSticker = async (ctx: DiscordContext, input: DiscordEndpointInputs['getSticker']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getSticker']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getGuildSticker = async (ctx: DiscordContext, input: DiscordEndpointInputs['getGuildSticker']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getGuildSticker']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getThreadMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['getThreadMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getThreadMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getUser = async (ctx: DiscordContext, input: DiscordEndpointInputs['getUser']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getUser']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const listGuildScheduledEventUsers = async (ctx: DiscordContext, input: DiscordEndpointInputs['listGuildScheduledEventUsers']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['listGuildScheduledEventUsers']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getWebhook = async (ctx: DiscordContext, input: DiscordEndpointInputs['getWebhook']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getWebhook']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getWebhookByToken = async (ctx: DiscordContext, input: DiscordEndpointInputs['getWebhookByToken']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getWebhookByToken']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const getWebhookMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['getWebhookMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['getWebhookMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const searchGuildMembers = async (ctx: DiscordContext, input: DiscordEndpointInputs['searchGuildMembers']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['searchGuildMembers']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const testAuth = async (ctx: DiscordContext, input: DiscordEndpointInputs['testAuth']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['testAuth']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const triggerTypingIndicator = async (ctx: DiscordContext, input: DiscordEndpointInputs['triggerTypingIndicator']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['triggerTypingIndicator']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const unpinMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['unpinMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['unpinMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildWidgetSettings = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildWidgetSettings']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildWidgetSettings']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateMyApplication = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateMyApplication']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateMyApplication']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildApplicationCommand = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildApplicationCommand']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildApplicationCommand']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateMyGuildMember = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateMyGuildMember']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateMyGuildMember']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateChannel = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateChannel']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateChannel']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateMyUser = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateMyUser']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateMyUser']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateWebhookMessage = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateWebhookMessage']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateWebhookMessage']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildEmoji = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildEmoji']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildEmoji']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const putGuildsOnboarding = async (ctx: DiscordContext, input: DiscordEndpointInputs['putGuildsOnboarding']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['putGuildsOnboarding']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildScheduledEvent = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildScheduledEvent']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildScheduledEvent']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuild = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuild']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuild']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildSticker = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildSticker']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildSticker']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const syncGuildTemplate = async (ctx: DiscordContext, input: DiscordEndpointInputs['syncGuildTemplate']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['syncGuildTemplate']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateGuildWelcomeScreen = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateGuildWelcomeScreen']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateGuildWelcomeScreen']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateApplicationUserRoleConnection = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateApplicationUserRoleConnection']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateApplicationUserRoleConnection']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateWebhook = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateWebhook']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateWebhook']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const updateWebhookByToken = async (ctx: DiscordContext, input: DiscordEndpointInputs['updateWebhookByToken']) => {
  // Auto-generated endpoint
  return makeDiscordRequest<DiscordEndpointOutputs['updateWebhookByToken']>(
    `TODO_AUTO_GENERATE_PATH/${Date.now()}`,
    ctx.key,
    { method: 'POST', body: input }
  );
};

export const bulkDeleteMessages = async (ctx: DiscordContext, input: DiscordEndpointInputs['bulkDeleteMessages']) => {
  const { channel_id, ...body } = input;
  await makeDiscordRequest<void>(
    `channels/${channel_id}/messages/bulk-delete`,
    ctx.key,
    { method: 'POST', body }
  );
  await logEventFromContext(ctx, 'discord.generated.bulkDeleteMessages', { channel_id, ...body }, 'completed');
  return undefined as any;
};
