import { z } from 'zod'

export const DiscordEmbed = z.object({
  title: z.string().optional(),
  type: z
    .enum([
      'rich',
      'image',
      'video',
      'gifv',
      'article',
      'link',
      'auto_moderation_message',
      'poll_result',
    ])
    .optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  timestamp: z.string().optional(),
  color: z.number().optional(),
  footer: z
    .object({
      text: z.string(),
      icon_url: z.string().optional(),
      proxy_icon_url: z.string().optional(),
    })
    .optional(),
  image: z
    .object({
      url: z.string(),
      proxy_url: z.string().optional(),
      height: z.number().optional(),
      width: z.number().optional(),
    })
    .optional(),
  thumbnail: z
    .object({
      url: z.string(),
      proxy_url: z.string().optional(),
      height: z.number().optional(),
      width: z.number().optional(),
    })
    .optional(),
  video: z
    .object({
      url: z.string().optional(),
      proxy_url: z.string().optional(),
      height: z.number().optional(),
      width: z.number().optional(),
    })
    .optional(),
  provider: z
    .object({
      name: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  author: z
    .object({
      name: z.string(),
      url: z.string().optional(),
      icon_url: z.string().optional(),
      proxy_icon_url: z.string().optional(),
    })
    .optional(),
  fields: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        inline: z.boolean().optional(),
      }),
    )
    .optional(),
})

const DiscordAttachment = z.object({
  id: z.string(),
  filename: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content_type: z.string().optional(),
  size: z.number(),
  url: z.string(),
  proxy_url: z.string(),
  height: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  ephemeral: z.boolean().optional(),
  duration_secs: z.number().optional(),
  waveform: z.string().optional(),
  flags: z.number().int().optional(),
})

const DiscordAuthor = z
  .object({
    id: z.string(),
    username: z.string(),
    discriminator: z.string(),
    global_name: z.string().nullable(),
    avatar: z.string().nullable(),
    bot: z.boolean().optional(),
    system: z.boolean().optional(),
    mfa_enabled: z.boolean().optional(),
    banner: z.string().nullable().optional(),
    accent_color: z.number().int().nullable().optional(),
    locale: z.string().optional(),
    verified: z.boolean().optional(),
    email: z.string().nullable().optional(),
    flags: z.number().int().optional(),
    premium_type: z.number().int().optional(),
    public_flags: z.number().int().optional(),
    avatar_decoration: z.string().nullable().optional(),
    avatar_decoration_data: z
      .object({
        asset: z.string(),
        sku_id: z.string(),
      })
      .nullable()
      .optional(),
    collectibles: z
      .object({
        nameplate: z
          .object({
            sku_id: z.string(),
            asset: z.string(),
            label: z.string(),
            palette: z.enum([
              'berry',
              'bubble_gum',
              'clover',
              'cobalt',
              'crimson',
              'forest',
              'lemon',
              'sky',
              'teal',
              'violet',
              'white',
            ]),
          })
          .optional(),
      })
      .nullable()
      .optional(),
    primary_guild: z
      .object({
        identity_guild_id: z.string().nullable(),
        identity_enabled: z.boolean().nullable(),
        tag: z.string().nullable(),
        badge: z.string().nullable(),
      })
      .nullable()
      .optional(),
  })
  .strict();

const DiscordSticker = z.object({
  id: z.string(),
  pack_id: z.string().optional(),
  name: z.string(),
  description: z.string().nullable(),
  tags: z.string(),
  asset: z.literal('').optional(),
  type: z.number(),
  format_type: z.number(),
  available: z.boolean().optional(),
  guild_id: z.string().optional(),
  user: DiscordAuthor.optional(),
  sort_value: z.number().optional(),
})

const DiscordEmoji = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable(),
  roles: z.array(z.string()).optional(),
  user: DiscordAuthor.optional(),
  require_colons: z.boolean().optional(),
  managed: z.boolean().optional(),
  animated: z.boolean().optional(),
  available: z.boolean().optional(),
})

export const DiscordRole = z.object({
  id: z.string(),
  name: z.string(),
  color: z.number(),
  colors: z
    .object({
      primary_color: z.number(),
      secondary_color: z.number().nullable().optional(),
      tertiary_color: z.number().nullable().optional(),
    })
    .optional(),
  hoist: z.boolean(),
  icon: z.string().nullable().optional(),
  unicode_emoji: z.string().nullable().optional(),
  position: z.number(),
  permissions: z.string(),
  managed: z.boolean(),
  mentionable: z.boolean(),
  tags: z
    .object({
      bot_id: z.string().optional(),
      integration_id: z.string().optional(),
      premium_subscriber: z.null().optional(),
      subscription_listing_id: z.string().optional(),
      available_for_purchase: z.null().optional(),
      guild_connections: z.null().optional(),
    })
    .optional(),
  flags: z.number().optional(),
})

export const DiscordGuildMember = z.object({
  user: DiscordAuthor.optional(),
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
  avatar_decoration_data: z
    .object({
      asset: z.string(),
      sku_id: z.string(),
    })
    .nullable()
    .optional(),
})

export const DiscordChannel = z.object({
  id: z.string(),
  type: z.number(),
  guild_id: z.string().optional(),
  position: z.number().optional(),
  permission_overwrites: z
    .array(
      z.object({
        id: z.string(),
        type: z.number(),
        allow: z.string(),
        deny: z.string(),
      }),
    )
    .optional(),
  name: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  nsfw: z.boolean().optional(),
  last_message_id: z.string().nullable().optional(),
  bitrate: z.number().optional(),
  user_limit: z.number().optional(),
  rate_limit_per_user: z.number().optional(),
  recipients: z.array(DiscordAuthor).optional(),
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
  thread_metadata: z
    .object({
      archived: z.boolean(),
      auto_archive_duration: z.number(),
      archive_timestamp: z.string(),
      locked: z.boolean(),
      invitable: z.boolean().optional(),
      create_timestamp: z.string().nullable().optional(),
    })
    .optional(),
  member: z
    .object({
      id: z.string().optional(),
      user_id: z.string().optional(),
      join_timestamp: z.string(),
      flags: z.number(),
      member: DiscordGuildMember.optional(),
    })
    .optional(),
  default_auto_archive_duration: z.number().optional(),
  permissions: z.string().optional(),
  flags: z.number().optional(),
  total_message_sent: z.number().optional(),
  available_tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        moderated: z.boolean(),
        emoji_id: z.string().nullable().optional(),
        emoji_name: z.string().nullable().optional(),
      }),
    )
    .optional(),
  applied_tags: z.array(z.string()).optional(),
  default_reaction_emoji: z
    .object({
      emoji_id: z.string().nullable().optional(),
      emoji_name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  default_thread_rate_limit_per_user: z.number().optional(),
  default_sort_order: z.number().nullable().optional(),
  default_forum_layout: z.number().optional(),
})

const DiscordApplication = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  description: z.string(),
  rpc_origins: z.array(z.string()).optional(),
  bot_public: z.boolean(),
  bot_require_code_grant: z.boolean(),
  bot: DiscordAuthor.partial().optional(),
  terms_of_service_url: z.string().optional(),
  privacy_policy_url: z.string().optional(),
  owner: DiscordAuthor.partial().optional(),
  verify_key: z.string(),
  team: z
    .object({
      icon: z.string().nullable(),
      id: z.string(),
      members: z.array(
        z.object({
          membership_state: z.number(),
          team_id: z.string(),
          user: DiscordAuthor.partial(),
          role: z.string(),
        }),
      ),
      name: z.string(),
      owner_user_id: z.string(),
    })
    .nullable(),
  guild_id: z.string().optional(),
  guild: z.lazy(() => DiscordGuild.partial()).optional(),
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
  install_params: z
    .object({
      scopes: z.array(z.string()),
      permissions: z.string(),
    })
    .optional(),
  integration_types_config: z.record(z.number()).optional(),
  custom_install_url: z.string().optional(),
})

const DiscordEntitlement = z.object({
  id: z.string(),
  sku_id: z.string(),
  application_id: z.string(),
  user_id: z.string().optional(),
  type: z.number(),
  deleted: z.boolean(),
  starts_at: z.string().nullable(),
  ends_at: z.string().nullable(),
  guild_id: z.string().optional(),
  consumed: z.boolean().optional(),
})

const DiscordResolvedData = z.object({
  users: z.record(DiscordAuthor).optional(),
  members: z.record(DiscordGuildMember.partial()).optional(),
  roles: z.record(DiscordRole).optional(),
  channels: z.record(DiscordChannel.partial()).optional(),
  messages: z.record(z.lazy(() => DiscordMessage)).optional(),
  attachments: z.record(DiscordAttachment).optional(),
})

const DiscordApplicationCommandInteractionDataOption = z.lazy((): z.ZodType =>
  z.object({
    name: z.string(),
    type: z.number(),
    value: z.union([z.string(), z.number(), z.boolean()]).optional(),
    options: z.array(DiscordApplicationCommandInteractionDataOption).optional(),
    focused: z.boolean().optional(),
  }),
)

const DiscordApplicationCommandData = z.object({
  id: z.string(),
  name: z.string(),
  type: z.number(),
  resolved: DiscordResolvedData.optional(),
  options: z.array(DiscordApplicationCommandInteractionDataOption).optional(),
  guild_id: z.string().optional(),
  target_id: z.string().optional(),
})

const DiscordMessageComponentData = z.object({
  custom_id: z.string(),
  component_type: z.number(),
  values: z.array(z.string()).optional(),
  resolved: DiscordResolvedData.optional(),
})

const DiscordModalSubmitData = z.object({
  custom_id: z.string(),
  components: z.array(z.unknown()),
  resolved: DiscordResolvedData.optional(),
})

export const DiscordInteraction = z.object({
  id: z.string(),
  application_id: z.string(),
  type: z.number(),
  data: z.unknown().optional(),
  token: z.string(),
  version: z.number(),
  guild: z.lazy(() => DiscordGuild.partial()).optional(),
  guild_id: z.string().optional(),
  channel: DiscordChannel.partial().optional(),
  channel_id: z.string().optional(),
  member: DiscordGuildMember.optional(),
  user: DiscordAuthor.optional(),
  message: z.lazy(() => DiscordMessage).optional(),
  app_permissions: z.string(),
  locale: z.string().optional(),
  guild_locale: z.string().optional(),
  entitlements: z.array(DiscordEntitlement),
  authorizing_integration_owners: z.record(z.string()),
  context: z.number().optional(),
  attachment_size_limit: z.number(),
  application_command_data: DiscordApplicationCommandData.optional(),
  component_data: DiscordMessageComponentData.optional(),
  modal_submit_data: DiscordModalSubmitData.optional(),
})

export const DiscordInvite = z.object({
  type: z.number(),
  code: z.string(),
  guild: z.lazy(() => DiscordGuild.partial()).optional(),
  channel: DiscordChannel.partial().nullable(),
  inviter: DiscordAuthor.optional(),
  target_type: z.number().optional(),
  target_user: DiscordAuthor.optional(),
  target_application: DiscordApplication.partial().optional(),
  approximate_presence_count: z.number().optional(),
  approximate_member_count: z.number().optional(),
  expires_at: z.string().nullable(),
  guild_scheduled_event: z
    .object({
      id: z.string(),
      guild_id: z.string(),
      channel_id: z.string().nullable(),
      creator_id: z.string().nullable().optional(),
      name: z.string(),
      description: z.string().nullable().optional(),
      scheduled_start_time: z.string(),
      scheduled_end_time: z.string().nullable(),
      privacy_level: z.number(),
      status: z.number(),
      entity_type: z.number(),
      entity_id: z.string().nullable(),
      entity_metadata: z
        .object({
          location: z.string().optional(),
        })
        .nullable(),
      creator: DiscordAuthor.optional(),
      user_count: z.number().optional(),
      image: z.string().nullable().optional(),
    })
    .optional(),
  flags: z.number().optional(),
  roles: z.array(DiscordRole).optional(),
})

export const DiscordWebhook = z.object({
  id: z.string(),
  type: z.number(),
  guild_id: z.string().nullable().optional(),
  channel_id: z.string().nullable(),
  user: DiscordAuthor.optional(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  token: z.string().optional(),
  application_id: z.string().nullable(),
  source_guild: z.lazy(() => DiscordGuild.partial()).optional(),
  source_channel: DiscordChannel.partial().optional(),
  url: z.string().optional(),
})

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
  welcome_screen: z
    .object({
      description: z.string().nullable().optional(),
      welcome_channels: z.array(
        z.object({
          channel_id: z.string(),
          description: z.string(),
          emoji_id: z.string().nullable().optional(),
          emoji_name: z.string().nullable().optional(),
        }),
      ),
    })
    .optional(),
  nsfw_level: z.number(),
  stickers: z.array(DiscordSticker).optional(),
  premium_progress_bar_enabled: z.boolean(),
  safety_alerts_channel_id: z.string().nullable(),
  incidents_data: z
    .object({
      invites_disabled_until: z.string().nullable().optional(),
      dms_disabled_until: z.string().nullable().optional(),
      dm_spam_detected_at: z.string().nullable().optional(),
      raid_detected_at: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
})

export const DiscordUser = DiscordAuthor;

export const DiscordMessage: z.ZodType = z.lazy(() =>
  z
    .object({
      id: z.string(),
      channel_id: z.string(),
      author: DiscordAuthor,
      content: z.string(),
      timestamp: z.string(),
      edited_timestamp: z.string().nullable(),
      tts: z.boolean(),
      mention_everyone: z.boolean(),
      mentions: z.array(DiscordAuthor),
      mention_roles: z.array(z.string()),
      mention_channels: z
        .array(
          z.object({
            id: z.string(),
            guild_id: z.string(),
            type: z.number().int(),
            name: z.string(),
          }),
        )
        .optional(),
      attachments: z.array(DiscordAttachment),
      embeds: z.array(DiscordEmbed),
      reactions: z
        .array(
          z.object({
            count: z.number(),
            count_details: z.object({
              burst: z.number(),
              normal: z.number(),
            }),
            me: z.boolean(),
            me_burst: z.boolean(),
            emoji: z.object({
              id: z.string().nullable(),
              name: z.string().nullable(),
              animated: z.boolean().optional(),
            }),
            burst_colors: z.array(z.string()),
          }),
        )
        .optional(),
      nonce: z.union([z.number(), z.string()]).optional(),
      pinned: z.boolean(),
      webhook_id: z.string().optional(),
      type: z.number(),
      activity: z
        .object({
          type: z.number(),
          party_id: z.string().optional(),
        })
        .optional(),
      application: z
        .object({
          id: z.string().optional(),
        })
        .partial()
        .passthrough()
        .optional(),
      application_id: z.string().optional(),
      message_reference: z
        .object({
          type: z.union([z.literal(0), z.literal(1)]).optional(),
          message_id: z.string().optional(),
          channel_id: z.string(),
          guild_id: z.string().optional(),
        })
        .optional(),
      flags: z.number().int().optional(),
      referenced_message: DiscordMessage.nullable().optional(),
      interaction_metadata: z
        .object({
          id: z.string(),
          type: z.number().int(),
          user: DiscordAuthor,
          authorizing_integration_owners: z.record(
            z.string(),
            z.string(),
          ),
          original_response_message_id: z.string().optional(),
          target_user: DiscordAuthor.optional(),
          target_message_id: z.string().optional(),
          interacted_message_id: z.string().optional(),
          triggering_interaction_metadata: z.unknown().optional(),
        })
        .optional(),
      interaction: z
        .object({
          id: z.string(),
          type: z.number().int(),
          name: z.string(),
          user: DiscordAuthor,
          member: z
            .object({
              avatar: z.string().nullable().optional(),
              communication_disabled_until: z.string().nullable().optional(),
              deaf: z.boolean().optional(),
              joined_at: z.string().optional(),
              mute: z.boolean().optional(),
              nick: z.string().nullable().optional(),
              pending: z.boolean().optional(),
              premium_since: z.string().nullable().optional(),
              roles: z.array(z.string()).optional(),
            })
            .optional(),
        })
        .optional(),
      thread: z
        .object({
          id: z.string(),
          type: z.number().int(),
        })
        .passthrough()
        .optional(),
      components: z
        .array(
          z.object({
            type: z.number().int(),
          })
            .passthrough(),
        )
        .optional(),
      sticker_items: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            format_type: z.number().int(),
          }),
        )
        .optional(),
      stickers: z
        .array(DiscordSticker)
        .optional(),
      position: z.number().optional(),
      role_subscription_data: z
        .object({
          role_subscription_listing_id: z.string(),
          tier_name: z.string(),
          total_months_subscribed: z.number(),
          is_renewal: z.boolean(),
        })
        .optional(),
      resolved: z
        .object({
          users: z.record(z.string(), DiscordAuthor).optional(),
          roles: z
            .record(
              z.string(),
              z
                .object({
                  id: z.string(),
                })
                .passthrough(),
            )
            .optional(),
          members: z
            .record(
              z.string(),
              z
                .object({
                  roles: z.array(z.string()).optional(),
                })
                .passthrough(),
            )
            .optional(),
          channels: z
            .record(
              z.string(),
              z
                .object({
                  id: z.string(),
                  type: z.number().int(),
                })
                .passthrough(),
            )
            .optional(),
          attachments: z
            .record(z.string(), DiscordAttachment)
            .optional(),
        })
        .optional(),
      poll: z
        .object({
          question: z.object({
            text: z.string().optional(),
            emoji: z
              .object({
                id: z.string().nullable(),
                name: z.string().nullable(),
                animated: z.boolean().optional(),
              })
              .optional(),
          }),
          allow_multiselect: z.boolean(),
          layout_type: z.number(),
          answers: z.array(
            z.object({
              answer_id: z.number(),
              poll_media: z.object({
                text: z.string().optional(),
                emoji: z
                  .object({
                    id: z.string().nullable(),
                    name: z.string().nullable(),
                    animated: z.boolean().optional(),
                  })
                  .optional(),
              }),
            }),
          ),
          expiry: z.string(),
          results: z
            .object({
              is_finalized: z.boolean(),
              answer_counts: z.array(
                z.object({
                  id: z.number(),
                  count: z.number(),
                  me_voted: z.boolean(),
                }),
              ),
            })
            .optional(),
        })
        .optional(),
      message_snapshots: z
        .array(
          z.object({
            message: z.object({
              attachments: z.array(DiscordAttachment),
              components: z
                .array(
                  z.object({
                    type: z.number().int(),
                  })
                    .passthrough(),
                )
                .optional(),
              content: z.string(),
              edited_timestamp: z.string().nullable(),
              embeds: z.array(DiscordEmbed),
              flags: z.number().int().optional(),
              mention_roles: z.array(z.string()),
              mentions: z.array(DiscordAuthor),
              sticker_items: z
                .array(
                  z.object({
                    id: z.string(),
                    name: z.string(),
                    format_type: z.number().int(),
                  }),
                )
                .optional(),
              stickers: z
                .array(DiscordSticker)
                .optional(),
              timestamp: z.string(),
              type: z.number(),
            }),
            guild_id: z.string().optional(),
          }),
        )
        .optional(),
      call: z
        .object({
          participants: z.array(z.string()),
          ended_timestamp: z.string().nullable().optional(),
        })
        .optional(),
    })
    .strict(),
);



export type DiscordUser = z.infer<typeof DiscordUser>;
export type DiscordMessage = z.infer<typeof DiscordMessage>;
export type DiscordGuild = z.infer<typeof DiscordGuild>;
export type DiscordRole = z.infer<typeof DiscordRole>;
export type DiscordInvite = z.infer<typeof DiscordInvite>;
export type DiscordWebhook = z.infer<typeof DiscordWebhook>;
export type DiscordInteraction = z.infer<typeof DiscordInteraction>;
export type DiscordChannel = z.infer<typeof DiscordChannel>;
export type DiscordGuildMember = z.infer<typeof DiscordGuildMember>;