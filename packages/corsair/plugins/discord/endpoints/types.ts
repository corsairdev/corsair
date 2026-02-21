import { z } from 'zod'
import {
  DiscordChannel,
  DiscordEmbed,
  DiscordGuild,
  DiscordGuildMember,
  DiscordMessage,
  DiscordRole,
} from '../schema/database'

// ─── Endpoint Input Types ────────────────────────────────────────────────────

export const GetGetInputSchema = z.object({
  guildId: z.string(),
})

export const CreateGuildInputSchema = z.object({
  name: z.string(),
  region: z.string().nullable().optional(), // deprecated
  icon: z.string().nullable().optional(),
  verification_level: z.number().int().nullable().optional(),
  default_message_notifications: z.number().int().nullable().optional(),
  explicit_content_filter: z.number().int().nullable().optional(),
  afk_channel_id: z.string().nullable().optional(),
  afk_timeout: z
    .union([
      z.literal(60),
      z.literal(300),
      z.literal(900),
      z.literal(1800),
      z.literal(3600),
    ])
    .optional(),
  system_channel_id: z.string().nullable().optional(),
  system_channel_flags: z.number().int().optional(),
  rules_channel_id: z.string().nullable().optional(),
  public_updates_channel_id: z.string().nullable().optional(),
  preferred_locale: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

export const UpdateGuildInputSchema = z.object({
  guildId: z.string(),
  guild: z.object({
    name: z.string(),
    region: z.string().nullable().optional(),
    verification_level: z.number().int().nullable().optional(),
    default_message_notifications: z.number().int().nullable().optional(),
    explicit_content_filter: z.number().int().nullable().optional(),
    afk_channel_id: z.string().nullable().optional(),
    afk_timeout: z.union([
      z.literal(60),
      z.literal(300),
      z.literal(900),
      z.literal(1800),
      z.literal(3600),
    ]),
    icon: z.string().nullable().optional(),
    splash: z.string().nullable().optional(),
    discovery_splash: z.string().nullable().optional(),
    banner: z.string().nullable().optional(),
    system_channel_id: z.string().nullable().optional(),
    system_channel_flags: z.number().int(),
    rules_channel_id: z.string().nullable().optional(),
    public_updates_channel_id: z.string().nullable().optional(),
    preferred_locale: z.string().nullable().optional(), // defaults to "en-US" on Discord side
    features: z.array(z.string()),
    description: z.string().nullable().optional(),
    premium_progress_bar_enabled: z.boolean(),
    safety_alerts_channel_id: z.string().nullable().optional(),
  }),
})

export const DeleteGuildInputSchema = z.object({
  guildId: z.string(),
})

export const ListGuildMembersInputSchema = z.object({
  guildId: z.string(),
})

export const GetChannelInputSchema = z.object({
  channelId: z.string(),
})

export const ModifyChannelInputSchema = z.object({
  channelId: z.string(),
  channel: z.object({
    name: z.string().min(1).max(100).optional(),
    type: z.number().int().optional(),
    position: z.number().int().optional(),
    topic: z.string().max(1024).nullable().optional(),
    nsfw: z.boolean().optional(),
    rate_limit_per_user: z.number().int().min(0).max(21600).optional(),
    bitrate: z.number().int().min(8000).optional(),
    user_limit: z.number().int().min(0).max(10_000).optional(),
    permission_overwrites: z
      .array(
        z.object({
          id: z.string(),
          type: z.number().int(),
          allow: z.string(),
          deny: z.string(),
        })
      )
      .optional(),
    parent_id: z.string().nullable().optional(),
    rtc_region: z.string().nullable().optional(),
    video_quality_mode: z.number().int().optional(),
    default_auto_archive_duration: z.number().int().optional(),
    flags: z.number().int().optional(),
    available_tags: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          moderated: z.boolean().optional(),
          emoji_id: z.string().nullable().optional(),
          emoji_name: z.string().nullable().optional(),
        })
      )
      .max(20)
      .optional(),
    default_reaction_emoji: z
      .object({
        emoji_id: z.string().nullable().optional(),
        emoji_name: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    default_thread_rate_limit_per_user: z.number().int().optional(),
    default_sort_order: z.number().int().nullable().optional(),
    default_forum_layout: z.number().int().optional(),
  }),
})

export const DeleteChannelInputSchema = z.object({
  channelId: z.string(),
})

export const ListGuildChannelsInputSchema = z.object({
  guildId: z.string(),
})

export const CreateGuildChannelInputSchema = z.object({
  guildId: z.string(),
  channel: z
    .object({
      name: z.string(),
      type: z.number().int().optional(),
      topic: z.string().nullable().optional(),
      bitrate: z.number().int().optional(),
      user_limit: z.number().int().optional(),
      rate_limit_per_user: z.number().int().optional(),
      position: z.number().int().optional(),
      permission_overwrites: z
        .array(
          z.object({
            id: z.string(),
            type: z.number().int(),
            allow: z.string(),
            deny: z.string(),
          })
        )
        .optional(),
      parent_id: z.string().nullable().optional(),
      nsfw: z.boolean().optional(),
      rtc_region: z.string().nullable().optional(),
      default_auto_archive_duration: z.number().int().optional(),
      default_reaction_emoji: z
        .object({
          emoji_id: z.string().nullable().optional(),
          emoji_name: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      default_thread_rate_limit_per_user: z.number().int().optional(),
      default_sort_order: z.number().int().nullable().optional(),
      default_forum_layout: z.number().int().optional(),
    })
    .strict(),
})

export const SendChannelMessageInputSchema = z.object({
  channelId: z.string(),
  message: z.object({
    content: z.string().optional(),
    tts: z.boolean().optional(),
    nonce: z.union([z.string(), z.number()]).optional(),
    embeds: z.array(DiscordEmbed).optional(),
    allowed_mentions: z.unknown().optional(),
    message_reference: z.unknown().optional(),
    components: z.array(z.unknown()).optional(),
    sticker_ids: z.array(z.string()).optional(),
    attachments: z.array(z.unknown()).optional(),
    flags: z.number().int().optional(),
  }),
})

export const GetChannelMessagesInputSchema = z.object({
  channelId: z.string(),
  around: z.string().optional(),
  before: z.string().optional(),
  after: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
})

export const EditChannelMessageInputSchema = z.object({
  channelId: z.string(),
  messageId: z.string(),
  message: z
    .object({
      content: z.string().nullable().optional(),
      embeds: z.array(DiscordEmbed).optional(),
      allowed_mentions: z.unknown().optional(),
      components: z.array(z.unknown()).optional(),
      attachments: z.array(z.unknown()).optional(),
      flags: z.number().int().optional(),
    })
    .strict(),
})

export const DeleteChannelMessageInputSchema = z.object({
  channelId: z.string(),
  messageId: z.string(),
})

export const AddChannelMessageReactionInputSchema = z.object({
  channelId: z.string(),
  messageId: z.string(),
  emoji: z.string(),
})

export const GetMemberInputSchema = z.object({
  guildId: z.string(),
  userId: z.string(),
})

export const AddMemberInputSchema = z.object({
  guildId: z.string(),
  userId: z.string(),
  member: z
    .object({
      access_token: z.string(),
      nick: z.string().nullable().optional(),
      roles: z.array(z.string()).optional(),
      mute: z.boolean().optional(),
      deaf: z.boolean().optional(),
    })
    .strict(),
})

export const ModifyMemberInputSchema = z.object({
  guildId: z.string(),
  userId: z.string(),
  member: z
    .object({
      nick: z.string().nullable().optional(),
      roles: z.array(z.string()).optional(),
    })
    .strict(),
})

export const KickMemberInputSchema = z.object({
  guildId: z.string(),
  userId: z.string(),
})
export const ListRolesInputSchema = z.object({
  guildId: z.string(),
})

export const CreateRoleInputSchema = z.object({
  guildId: z.string(),
  role: z
    .object({
      name: z.string(),
      permissions: z.string().optional(),
      color: z.number().int().optional(),
      hoist: z.boolean().optional(),
      icon: z.string().nullable().optional(),
      unicode_emoji: z.string().nullable().optional(),
      mentionable: z.boolean().optional(),
    })
    .strict(),
})

export const UpdateRoleInputSchema = z.object({
  guildId: z.string(),
  roleId: z.string(),
  role: z
    .object({
      name: z.string().optional(),
      permissions: z.string().optional(),
      color: z.number().int().optional(),
      hoist: z.boolean().optional(),
      icon: z.string().nullable().optional(),
      unicode_emoji: z.string().nullable().optional(),
      mentionable: z.boolean().optional(),
    })
    .strict(),
})

export const DeleteRoleInputSchema = z.object({
  guildId: z.string(),
  roleId: z.string(),
})

export const AssignRoleToMemberInputSchema = z.object({
  guildId: z.string(),
  userId: z.string(),
  roleId: z.string(),
})

export const GetCurrentUserInputSchema = z.object({}).strict()

export const GetUserInputSchema = z.object({
  userId: z.string(),
})

export const ModifyCurrentUserInputSchema = z.object({
  user: z
    .object({
      username: z.string().optional(),
      avatar: z.string().nullable().optional(),
      banner: z.string().nullable().optional(),
    })
    .strict(),
})

export const GetInviteInputSchema = z.object({
  code: z.string(),
  with_counts: z.boolean().optional(),
  with_expiration: z.boolean().optional(),
  guild_scheduled_event_id: z.string().optional(),
})

export const CreateChannelInviteInputSchema = z.object({
  channelId: z.string(),
  invite: z
    .object({
      max_age: z.number().int().min(0).optional(),
      max_uses: z.number().int().min(0).optional(),
      temporary: z.boolean().optional(),
      unique: z.boolean().optional(),
      target_type: z.number().int().optional(),
      target_user_id: z.string().optional(),
      target_application_id: z.string().optional(),
    })
    .strict(),
})

export const RevokeInviteInputSchema = z.object({
  code: z.string(),
})

export const ListGuildInvitesInputSchema = z.object({
  guildId: z.string(),
})

export const CreateChannelWebhookInputSchema = z.object({
  channelId: z.string(),
  webhook: z
    .object({
      name: z.string(),
      avatar: z.string().nullable().optional(),
    })
    .strict(),
})

export const ListGuildWebhooksInputSchema = z.object({
  guildId: z.string(),
})

export const ExecuteWebhookInputSchema = z.object({
  webhookId: z.string(),
  webhookToken: z.string(),
  query: z
    .object({
      wait: z.boolean().optional(),
      thread_id: z.string().optional(),
    })
    .strict()
    .optional(),
  message: z
    .object({
      content: z.string().optional(),
      username: z.string().optional(),
      avatar_url: z.string().optional(),
      tts: z.boolean().optional(),
      embeds: z.array(z.unknown()).optional(),
      allowed_mentions: z.unknown().optional(),
      components: z.array(z.unknown()).optional(),
      attachments: z.array(z.unknown()).optional(),
      flags: z.number().int().optional(),
    })
    .strict(),
})

export const RegisterCommandInputSchema = z.object({
  applicationId: z.string(),
  command: z.unknown(),
})

export const RespondToInteractionInputSchema = z.object({
  interactionId: z.string(),
  token: z.string(),
  callback: z.unknown(),
})

// ─── Endpoint Response Types ─────────────────────────────────────────────────

export const GetGuildResponseSchema = z.object({
  guild: DiscordGuild,
})

export const CreateGuildResponseSchema = z.object({
  guild: DiscordGuild,
})

export const UpdateGuildResponseSchema = z.object({
  guild: DiscordGuild,
})

export const DeleteGuildResponseSchema = z.object({
  success: z.boolean(),
})

export const ListGuildMembersResponseSchema = z.object({
  members: z.array(DiscordGuildMember),
})

export const GetChannelResponseSchema = z.object({
  channel: DiscordChannel,
})

export const ModifyChannelResponseSchema = z.object({
  channel: DiscordChannel,
})

export const DeleteChannelResponseSchema = z.object({
  success: z.boolean(),
})

export const ListGuildChannelsResponseSchema = z.object({
  channels: z.array(DiscordChannel),
})

export const CreateGuildChannelResponseSchema = z.object({
  channel: DiscordChannel,
})

export const SendChannelMessageResponseSchema = z.object({
  message: DiscordMessage,
})
export const GetChannelMessagesResponseSchema = z.object({
  messages: z.array(DiscordMessage),
})

export const EditChannelMessageResponseSchema = z.object({
  message: DiscordMessage,
})

export const DeleteChannelMessageResponseSchema = z.object({
  success: z.boolean(),
})

export const AddChannelMessageReactionResponseSchema = z.object({
  success: z.boolean(),
})

export const GetMemberResponseSchema = z.object({
  member: DiscordGuildMember,
})

export const AddMemberResponseSchema = z.object({
  member: DiscordGuildMember,
})

export const ModifyMemberResponseSchema = z.object({
  member: DiscordGuildMember,
})

export const KickMemberResponseSchema = z.object({
  success: z.boolean(),
})

export const ListRolesResponseSchema = z.object({
  roles: z.array(DiscordRole),
})

export const CreateRoleResponseSchema = z.object({
  role: DiscordRole,
})

export const UpdateRoleResponseSchema = z.object({
  role: DiscordRole,
})

export const DeleteRoleResponseSchema = z.object({
  success: z.boolean(),
})

export const AssignRoleToMemberResponseSchema = z.object({
  success: z.boolean(),
})
