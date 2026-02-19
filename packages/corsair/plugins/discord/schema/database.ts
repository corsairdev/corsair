import { z } from 'zod'

export const DiscordUser = z.object({})

const DiscordAvatarDecorationData = z.object({
  asset: z.string(),
  sku_id: z.string()
})

const DiscordEmoji = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable(),
  roles: z.array(z.string()).optional(),
  user: DiscordUser.optional(),
  require_colons: z.boolean().optional(),
  managed: z.boolean().optional(),
  animated: z.boolean().optional(),
  available: z.boolean().optional()
});

const DiscordSticker = z.object({
  id: z.string(),
  pack_id: z.string().optional(),
  name: z.string(),
  description: z.string().nullable(),
  tags: z.string(),
  type: z.number(),
  format_type: z.number(),
  available: z.boolean().optional(),
  guild_id: z.string().optional(),
  user: DiscordUser.optional(),
  sort_value: z.number().optional()
});

export const DiscordRole = z.object({
  id: z.string(),
  name: z.string(),
  color: z.number(),
  colors: z.object({
    primary_color: z.number(),
    secondary_color: z.number().nullable().optional(),
    tertiary_color: z.number().nullable().optional()
  }),
  hoist: z.boolean(),
  icon: z.string().nullable().optional(),
  unicode_emoji: z.string().nullable().optional(),
  position: z.number(),
  permissions: z.string(),
  managed: z.boolean(),
  mentionable: z.boolean(),
  tags: z.object({
    bot_id: z.string().optional(),
    integration_id: z.string().optional(),
    premium_subscriber: z.null().optional(),
    subscription_listing_id: z.string().optional(),
    available_for_purchase: z.null().optional(),
    guild_connections: z.null().optional()
  }).optional(),
  flags: z.number()
});

export const DiscordGuild = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  icon_hash: z.string().nullable().optional(),
  splash: z.string().nullable(),
  discovery_splash: z.string().nullable().optional(),
  owner: z.boolean().optional(),
  owner_id: z.string(),
  permissions: z.string().optional(),
  region: z.string().nullable().optional(),
  afk_channel_id: z.string().nullable(),
  afk_timeout: z.number(),
  widget_enabled: z.boolean().optional(),
  widget_channel_id: z.string().nullable().optional(),
  verification_level: z.number(),
  default_message_notifications: z.number(),
  explicit_content_filter: z.number(),
  roles: z.array(DiscordRole),
  emojis: z.array(DiscordEmoji),
  features: z.array(z.string()),
  mfa_level: z.number(),
  application_id: z.string().nullable(),
  system_channel_id: z.string().nullable(),
  system_channel_flags: z.number(),
  rules_channel_id: z.string().nullable(),
  max_presences: z.number().nullable().optional(),
  max_members: z.number().optional(),
  vanity_url_code: z.string().nullable(),
  description: z.string().nullable(),
  banner: z.string().nullable(),
  premium_tier: z.number(),
  premium_subscription_count: z.number().optional(),
  preferred_locale: z.string(),
  public_updates_channel_id: z.string().nullable(),
  max_video_channel_users: z.number().optional(),
  max_stage_video_channel_users: z.number().optional(),
  approximate_member_count: z.number().optional(),
  approximate_presence_count: z.number().optional(),
  welcome_screen: z.object({
    description: z.string().nullable().optional(),
    welcome_channels: z.array(
      z.object({
        channel_id: z.string(),
        description: z.string(),
        emoji_id: z.string().nullable().optional(),
        emoji_name: z.string().nullable().optional()
      })
    )
  }).optional(),
  nsfw_level: z.number(),
  stickers: z.array(DiscordSticker).optional(),
  premium_progress_bar_enabled: z.boolean(),
  safety_alerts_channel_id: z.string().nullable(),
  incidents_data: z.object({
    invites_disabled_until: z.string().nullable().optional(),
    dms_disabled_until: z.string().nullable().optional(),
    dm_spam_detected_at: z.string().nullable().optional(),
    raid_detected_at: z.string().nullable().optional()
  }).nullable().optional()
});

export const DiscordChannel = z.object({
  id: z.string(),
  type: z.number(),
  guild_id: z.string().optional(),
  position: z.number().optional(),
  permission_overwrites: z.array(z.object({
    id: z.string(),
    type: z.number(),
    allow: z.string(),
    deny: z.string()
  })).optional(),
  name: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  nsfw: z.boolean().optional(),
  last_message_id: z.string().nullable().optional(),
  bitrate: z.number().optional(),
  user_limit: z.number().optional(),
  rate_limit_per_user: z.number().optional(),
  recipients: z.array(DiscordUser).optional(),
  icon: z.string().nullable().optional(),
  owner_id: z.string().optional(),
  application_id: z.string().optional(),
  managed: z.boolean().optional(),
  parent_id: z.string().nullable().optional(),
  last_pin_timestamp: z.string().nullable().optional(),
  rtc_region: z.string().nullable().optional(),
  video_quality_mode: z.number().optional(),
  message_count: z.number().optional(),
  member_count: z.number().optional(),
  thread_metadata: z.object({
    archived: z.boolean(),
    auto_archive_duration: z.number(),
    archive_timestamp: z.string(),
    locked: z.boolean(),
    invitable: z.boolean().optional(),
    create_timestamp: z.string().nullable().optional()
  }).optional(),
  member: z.object({
    id: z.string().optional(),
    user_id: z.string().optional(),
    join_timestamp: z.string(),
    flags: z.number(),
    member: z.object({
      user: DiscordUser.optional(),
      nick: z.string().nullable().optional(),
      avatar: z.string().nullable().optional(),
      banner: z.string().nullable().optional(),
      roles: z.array(z.string()),
      joined_at: z.string().nullable(),
      premium_since: z.string().nullable().optional(),
      deaf: z.boolean(),
      mute: z.boolean(),
      flags: z.number(),
      pending: z.boolean().optional(),
      permissions: z.string().optional(),
      communication_disabled_until: z.string().nullable().optional(),
      avatar_decoration_data: DiscordAvatarDecorationData.nullable().optional()
    }).optional()
  }).optional(),
  default_auto_archive_duration: z.number().optional(),
  permissions: z.string().optional(),
  flags: z.number().optional(),
  total_message_sent: z.number().optional(),
  available_tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    moderated: z.boolean(),
    emoji_id: z.string().nullable().optional(),
    emoji_name: z.string().nullable().optional()
  })).optional(),
  applied_tags: z.array(z.string()).optional(),
  default_reaction_emoji: z.object({
    emoji_id: z.string().nullable().optional(),
    emoji_name: z.string().nullable().optional()
  }).nullable().optional(),
  default_thread_rate_limit_per_user: z.number().optional(),
  default_sort_order: z.number().nullable().optional(),
  default_forum_layout: z.number().optional()
});

export const DiscordMessage = z.object({
  id: z.string(),
  channel_id: z.string(),
  author: z.unknown(),
  content: z.string(),
  timestamp: z.string(),
  edited_timestamp: z.string().nullable(),
  tts: z.boolean(),
  mention_everyone: z.boolean(),
  mentions: z.array(z.unknown()),
  mention_roles: z.array(z.string()),
  mention_channels: z.array(z.unknown()).optional(),
  attachments: z.array(z.unknown()),
  embeds: z.array(z.unknown()),
  reactions: z.array(z.unknown()).optional(),
  nonce: z.union([z.string(), z.number()]).optional(),
  pinned: z.boolean(),
  webhook_id: z.string().optional(),
  type: z.number(),
  activity: z.unknown().optional(),
  application: z.unknown().optional(),
  application_id: z.string().optional(),
  flags: z.number().optional(),
  message_reference: z.unknown().optional(),
  message_snapshots: z.array(z.unknown()).optional(),
  referenced_message: z.unknown().nullable().optional(),
  interaction_metadata: z.unknown().optional(),
  interaction: z.unknown().optional(),
  thread: z.unknown().optional(),
  components: z.array(z.unknown()).optional(),
  sticker_items: z.array(z.unknown()).optional(),
  stickers: z.array(z.unknown()).optional(),
  position: z.number().optional(),
  role_subscription_data: z.unknown().optional(),
  resolved: z.unknown().optional(),
  poll: z.unknown().optional(),
  call: z.unknown().optional()
})

export const DiscordGuildMember = z.object({
  user: DiscordUser.optional(),
  nick: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  roles: z.array(z.string()),
  joined_at: z.string().nullable(),
  premium_since: z.string().nullable().optional(),
  deaf: z.boolean(),
  mute: z.boolean(),
  flags: z.number(),
  pending: z.boolean().optional(),
  permissions: z.string().optional(),
  communication_disabled_until: z.string().nullable().optional(),
  avatar_decoration_data: DiscordAvatarDecorationData.nullable().optional()
})

const DiscordApplication = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  description: z.string(),
  rpc_origins: z.array(z.string()).optional(),
  bot_public: z.boolean(),
  bot_require_code_grant: z.boolean(),
  bot: DiscordUser.partial().optional(),
  terms_of_service_url: z.string().optional(),
  privacy_policy_url: z.string().optional(),
  owner: DiscordUser.partial().optional(),
  verify_key: z.string(),
  team: z.object({
    icon: z.string().nullable(),
    id: z.string(),
    members: z.array(
      z.object({
        membership_state: z.number(),
        team_id: z.string(),
        user: DiscordUser.partial(),
        role: z.string()
      })
    ),
    name: z.string(),
    owner_user_id: z.string()
  }).nullable(),
  guild_id: z.string().optional(),
  guild: DiscordGuild.partial().optional(),
  primary_sku_id: z.string().optional(),
  slug: z.string().optional(),
  cover_image: z.string().optional(),
  flags: z.number().optional(),
  approximate_guild_count: z.number().optional(),
  approximate_user_install_count: z.number().optional(),
  approximate_user_authorization_count: z.number().optional(),
  redirect_uris: z.array(z.string()).optional(),
  interactions_endpoint_url: z.string().nullable().optional(),
  role_connections_verification_url: z.string().nullable().optional(),
  event_webhooks_url: z.string().nullable().optional(),
  event_webhooks_status: z.number(),
  event_webhooks_types: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  install_params: z.object({
    scopes: z.array(z.string()),
    permissions: z.string()
  }).optional(),
  integration_types_config: z.record(z.number()).optional(),
  custom_install_url: z.string().optional()
});

export const DiscordInvite = z.object({
  type: z.number(),
  code: z.string(),
  guild: DiscordGuild.partial().optional(),
  channel: DiscordChannel.partial().nullable(),
  inviter: DiscordUser.optional(),
  target_type: z.number().optional(),
  target_user: DiscordUser.optional(),
  target_application: DiscordApplication.partial().optional(),
  approximate_presence_count: z.number().optional(),
  approximate_member_count: z.number().optional(),
  expires_at: z.string().nullable(),
  guild_scheduled_event: z.unknown().optional(),
  flags: z.number().optional(),
  roles: z.array(z.unknown()).optional()
})

const BaseInteraction = {
  id: z.string(),
  application_id: z.string(),
  token: z.string(),
  version: z.number(),
  guild: z.unknown().optional(),
  guild_id: z.string().optional(),
  channel: z.unknown().optional(),
  channel_id: z.string().optional(),
  member: z.unknown().optional(),
  user: z.unknown().optional(),
  message: z.unknown().optional(),
  app_permissions: z.string(),
  locale: z.string().optional(),
  guild_locale: z.string().optional(),
  entitlements: z.array(z.unknown()),
  authorizing_integration_owners: z.record(z.string()),
  context: z.number().optional(),
  attachment_size_limit: z.number()
};

const ApplicationCommandData = z.object({
  id: z.string(),
  name: z.string(),
  type: z.number(),
  resolved: z.unknown().optional(),
  options: z.array(z.unknown()).optional(),
  guild_id: z.string().optional(),
  target_id: z.string().optional()
});

const MessageComponentData = z.object({
  custom_id: z.string(),
  component_type: z.number(),
  values: z.array(z.string()).optional(),
  resolved: z.unknown().optional()
});

const ModalSubmitData = z.object({
  custom_id: z.string(),
  components: z.array(z.unknown()),
  resolved: z.unknown().optional()
});

export const DiscordInteraction = z.object({
  id: z.string(),
  application_id: z.string(),
  type: z.number(),
  data: z.discriminatedUnion("type", [
    z.object({ ...BaseInteraction, type: z.literal(1) }),
    z.object({ ...BaseInteraction, type: z.literal(2), data: ApplicationCommandData }),
    z.object({ ...BaseInteraction, type: z.literal(3), data: MessageComponentData }),
    z.object({ ...BaseInteraction, type: z.literal(4), data: ApplicationCommandData }),
    z.object({ ...BaseInteraction, type: z.literal(5), data: ModalSubmitData })
  ]).optional(),
  guild: DiscordGuild.partial().optional(),
  guild_id: z.string().optional(),
  channel: DiscordChannel.partial().optional(),
  channel_id: z.string().optional(),
  member: DiscordGuildMember.optional(),
  user: DiscordUser.optional(),
  token: z.string(),
  version: z.number(),
  message: DiscordMessage.optional(),
  app_permissions: z.string(),
  locale: z.string().optional(),
  guild_locale: z.string().optional(),
  entitlements: z.array(z.object({
    id: z.string(),
    sku_id: z.string(),
    application_id: z.string(),
    user_id: z.string().optional(),
    type: z.number(),
    deleted: z.boolean(),
    starts_at: z.string().nullable(),
    ends_at: z.string().nullable(),
    guild_id: z.string().optional(),
    consumed: z.boolean().optional()
  })),
  authorizing_integration_owners: z.record(z.string()),
  context: z.number().optional(),
  attachment_size_limit: z.number()
})

export const DiscordWebhook = z.object({
  id: z.string(),
  type: z.number(),
  guild_id: z.string().nullable().optional(),
  channel_id: z.string().nullable(),
  user: DiscordUser.optional(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  token: z.string().optional(),
  application_id: z.string().nullable(),
  source_guild: DiscordGuild.partial().optional(),
  source_channel: DiscordChannel.partial().optional(),
  url: z.string().optional()
})

export type DiscordGuild = z.infer<typeof DiscordGuild>;
export type DiscordChannel = z.infer<typeof DiscordChannel>;
export type DiscordMessage = z.infer<typeof DiscordMessage>;
export type DiscordGuildMember = z.infer<typeof DiscordGuildMember>;
export type DiscordRole = z.infer<typeof DiscordRole>;
export type DiscordUser = z.infer<typeof DiscordUser>;
export type DiscordInvite = z.infer<typeof DiscordInvite>;
export type DiscordWebhook = z.infer<typeof DiscordWebhook>;
export type DiscordInteraction = z.infer<typeof DiscordInteraction>;