import {
  DiscordChannel,
  DiscordGuild,
  DiscordGuildMember,
  DiscordInteraction,
  DiscordInvite,
  DiscordMessage,
  DiscordRole,
  DiscordUser,
  DiscordWebhook,
} from './database'

export const DiscordSchema = {
	version: '1.0.0',
	entities: {
    guilds: DiscordGuild,
    channels: DiscordChannel,
    messages: DiscordMessage,
    guildMembers: DiscordGuildMember,
    roles: DiscordRole,
    users: DiscordUser,
    invites: DiscordInvite,
    webhooks: DiscordWebhook,
    interactions: DiscordInteraction,
  },
} as const;
