import { z } from 'zod'
// Base Types

const Embed = z.object({
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
});

const Attachment = z.object({
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
});

const Author = z
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

const Sticker = z.object({
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
	user: Author.optional(),
	sort_value: z.number().optional(),
});

const Emoji = z.object({
	id: z.string().nullable().optional(),
	name: z.string().nullable(),
	roles: z.array(z.string()).optional(),
	user: Author.optional(),
	require_colons: z.boolean().optional(),
	managed: z.boolean().optional(),
	animated: z.boolean().optional(),
	available: z.boolean().optional(),
});

const Role = z.object({
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
});

const GuildMember = z.object({
	user: Author.optional(),
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
});

const Channel = z.object({
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
	recipients: z.array(Author).optional(),
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
			member: GuildMember.optional(),
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
});

const Application = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	description: z.string(),
	rpc_origins: z.array(z.string()).optional(),
	bot_public: z.boolean(),
	bot_require_code_grant: z.boolean(),
	bot: Author.partial().optional(),
	terms_of_service_url: z.string().optional(),
	privacy_policy_url: z.string().optional(),
	owner: Author.partial().optional(),
	verify_key: z.string(),
	team: z
		.object({
			icon: z.string().nullable(),
			id: z.string(),
			members: z.array(
				z.object({
					membership_state: z.number(),
					team_id: z.string(),
					user: Author.partial(),
					role: z.string(),
				}),
			),
			name: z.string(),
			owner_user_id: z.string(),
		})
		.nullable(),
	guild_id: z.string().optional(),
	guild: z.lazy(() => Guild.partial()).optional(),
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
});

const Entitlement = z.object({
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
});

const ResolvedData = z.object({
	users: z.record(Author).optional(),
	members: z.record(GuildMember.partial()).optional(),
	roles: z.record(Role).optional(),
	channels: z.record(Channel.partial()).optional(),
	messages: z.record(z.lazy(() => Message)).optional(),
	attachments: z.record(Attachment).optional(),
});

const ApplicationCommandInteractionDataOption = z.lazy(
	(): z.ZodType =>
		z.object({
			name: z.string(),
			type: z.number(),
			value: z.union([z.string(), z.number(), z.boolean()]).optional(),
			options: z.array(ApplicationCommandInteractionDataOption).optional(),
			focused: z.boolean().optional(),
		}),
);

const ApplicationCommandData = z.object({
	id: z.string(),
	name: z.string(),
	type: z.number(),
	resolved: ResolvedData.optional(),
	options: z.array(ApplicationCommandInteractionDataOption).optional(),
	guild_id: z.string().optional(),
	target_id: z.string().optional(),
});

const MessageComponentData = z.object({
	custom_id: z.string(),
	component_type: z.number(),
	values: z.array(z.string()).optional(),
	resolved: ResolvedData.optional(),
});

const ModalSubmitData = z.object({
	custom_id: z.string(),
	components: z.array(z.unknown()),
	resolved: ResolvedData.optional(),
});

const Interaction = z.object({
	id: z.string(),
	application_id: z.string(),
	type: z.number(),
	data: z.unknown().optional(),
	token: z.string(),
	version: z.number(),
	guild: z.lazy(() => Guild.partial()).optional(),
	guild_id: z.string().optional(),
	channel: Channel.partial().optional(),
	channel_id: z.string().optional(),
	member: GuildMember.optional(),
	user: Author.optional(),
	message: z.lazy(() => Message).optional(),
	app_permissions: z.string(),
	locale: z.string().optional(),
	guild_locale: z.string().optional(),
	entitlements: z.array(Entitlement),
	authorizing_integration_owners: z.record(z.string()),
	context: z.number().optional(),
	attachment_size_limit: z.number(),
	application_command_data: ApplicationCommandData.optional(),
	component_data: MessageComponentData.optional(),
	modal_submit_data: ModalSubmitData.optional(),
});

const Invite = z.object({
	type: z.number(),
	code: z.string(),
	guild: z.lazy(() => Guild.partial()).optional(),
	channel: Channel.partial().nullable(),
	inviter: Author.optional(),
	target_type: z.number().optional(),
	target_user: Author.optional(),
	target_application: Application.partial().optional(),
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
			creator: Author.optional(),
			user_count: z.number().optional(),
			image: z.string().nullable().optional(),
		})
		.optional(),
	flags: z.number().optional(),
	roles: z.array(Role).optional(),
});

const Webhook = z.object({
	id: z.string(),
	type: z.number(),
	guild_id: z.string().nullable().optional(),
	channel_id: z.string().nullable(),
	user: Author.optional(),
	name: z.string().nullable(),
	avatar: z.string().nullable(),
	token: z.string().optional(),
	application_id: z.string().nullable(),
	source_guild: z.lazy(() => Guild.partial()).optional(),
	source_channel: Channel.partial().optional(),
	url: z.string().optional(),
});

const Guild = z.object({
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
	roles: z.array(Role),
	emojis: z.array(Emoji),
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
	stickers: z.array(Sticker).optional(),
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
});

const User = Author;

const Message: z.ZodType = z.lazy(() =>
	z
		.object({
			id: z.string(),
			channel_id: z.string(),
			author: Author,
			content: z.string(),
			timestamp: z.string(),
			edited_timestamp: z.string().nullable(),
			tts: z.boolean(),
			mention_everyone: z.boolean(),
			mentions: z.array(Author),
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
			attachments: z.array(Attachment),
			embeds: z.array(Embed),
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
			referenced_message: Message.nullable().optional(),
			interaction_metadata: z
				.object({
					id: z.string(),
					type: z.number().int(),
					user: Author,
					authorizing_integration_owners: z.record(z.string(), z.string()),
					original_response_message_id: z.string().optional(),
					target_user: Author.optional(),
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
					user: Author,
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
					z
						.object({
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
			stickers: z.array(Sticker).optional(),
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
					users: z.record(z.string(), Author).optional(),
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
					attachments: z.record(z.string(), Attachment).optional(),
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
							attachments: z.array(Attachment),
							components: z
								.array(
									z
										.object({
											type: z.number().int(),
										})
										.passthrough(),
								)
								.optional(),
							content: z.string(),
							edited_timestamp: z.string().nullable(),
							embeds: z.array(Embed),
							flags: z.number().int().optional(),
							mention_roles: z.array(z.string()),
							mentions: z.array(Author),
							sticker_items: z
								.array(
									z.object({
										id: z.string(),
										name: z.string(),
										format_type: z.number().int(),
									}),
								)
								.optional(),
							stickers: z.array(Sticker).optional(),
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

// Endpoint Input Types

const GetGuildInputSchema = z.object({
	guildId: z.string(),
});

const CreateGuildInputSchema = z.object({
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
});

const UpdateGuildInputSchema = z.object({
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
});

const DeleteGuildInputSchema = z.object({
	guildId: z.string(),
});

const ListGuildMembersInputSchema = z.object({
	guildId: z.string(),
});

const GetChannelInputSchema = z.object({
	channelId: z.string(),
});

const ModifyChannelInputSchema = z.object({
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
				}),
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
				}),
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
});

const DeleteChannelInputSchema = z.object({
	channelId: z.string(),
});

const ListGuildChannelsInputSchema = z.object({
	guildId: z.string(),
});

const CreateGuildChannelInputSchema = z.object({
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
					}),
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
});

const SendChannelMessageInputSchema = z.object({
	channelId: z.string(),
	message: z.object({
		content: z.string().optional(),
		tts: z.boolean().optional(),
		nonce: z.union([z.string(), z.number()]).optional(),
		embeds: z.array(Embed).optional(),
		allowed_mentions: z.unknown().optional(),
		message_reference: z.unknown().optional(),
		components: z.array(z.unknown()).optional(),
		sticker_ids: z.array(z.string()).optional(),
		attachments: z.array(z.unknown()).optional(),
		flags: z.number().int().optional(),
	}),
});

const GetChannelMessagesInputSchema = z.object({
	channelId: z.string(),
	around: z.string().optional(),
	before: z.string().optional(),
	after: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

const EditChannelMessageInputSchema = z.object({
	channelId: z.string(),
	messageId: z.string(),
	message: z
		.object({
			content: z.string().nullable().optional(),
			embeds: z.array(Embed).optional(),
			allowed_mentions: z.unknown().optional(),
			components: z.array(z.unknown()).optional(),
			attachments: z.array(z.unknown()).optional(),
			flags: z.number().int().optional(),
		})
		.strict(),
});

const DeleteChannelMessageInputSchema = z.object({
	channelId: z.string(),
	messageId: z.string(),
});

const AddChannelMessageReactionInputSchema = z.object({
	channelId: z.string(),
	messageId: z.string(),
	emoji: z.string(),
});

const GetMemberInputSchema = z.object({
	guildId: z.string(),
	userId: z.string(),
});

const AddMemberInputSchema = z.object({
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
});

const ModifyMemberInputSchema = z.object({
	guildId: z.string(),
	userId: z.string(),
	member: z
		.object({
			nick: z.string().nullable().optional(),
			roles: z.array(z.string()).optional(),
		})
		.strict(),
});

const KickMemberInputSchema = z.object({
	guildId: z.string(),
	userId: z.string(),
});
const ListRolesInputSchema = z.object({
	guildId: z.string(),
});

const CreateRoleInputSchema = z.object({
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
});

const UpdateRoleInputSchema = z.object({
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
});

const DeleteRoleInputSchema = z.object({
	guildId: z.string(),
	roleId: z.string(),
});

const AssignRoleToMemberInputSchema = z.object({
	guildId: z.string(),
	userId: z.string(),
	roleId: z.string(),
});

const GetCurrentUserInputSchema = z.object({}).strict();

const GetUserInputSchema = z.object({
	userId: z.string(),
});

const ModifyCurrentUserInputSchema = z.object({
	user: z
		.object({
			username: z.string().optional(),
			avatar: z.string().nullable().optional(),
			banner: z.string().nullable().optional(),
		})
		.strict(),
});

const GetInviteInputSchema = z.object({
	code: z.string(),
	with_counts: z.boolean().optional(),
	with_expiration: z.boolean().optional(),
	guild_scheduled_event_id: z.string().optional(),
});

const CreateChannelInviteInputSchema = z.object({
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
});

const RevokeInviteInputSchema = z.object({
	code: z.string(),
});

const ListGuildInvitesInputSchema = z.object({
	guildId: z.string(),
});

const CreateChannelWebhookInputSchema = z.object({
	channelId: z.string(),
	webhook: z
		.object({
			name: z.string(),
			avatar: z.string().nullable().optional(),
		})
		.strict(),
});

const ListGuildWebhooksInputSchema = z.object({
	guildId: z.string(),
});

const ExecuteWebhookInputSchema = z.object({
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
});

const RegisterCommandInputSchema = z.object({
	applicationId: z.string(),
	command: z.unknown(),
});

const RespondToInteractionInputSchema = z.object({
	interactionId: z.string(),
	token: z.string(),
	callback: z.unknown(),
});

// ─── Endpoint Response Types ─────────────────────────────────────────────────

const GetGuildResponseSchema = z.object({
	guild: Guild,
});

const CreateGuildResponseSchema = z.object({
	guild: Guild,
});

const UpdateGuildResponseSchema = z.object({
	guild: Guild,
});

const DeleteGuildResponseSchema = z.object({
	success: z.boolean(),
});

const ListGuildMembersResponseSchema = z.object({
	members: z.array(GuildMember),
});

const GetChannelResponseSchema = z.object({
	channel: Channel,
});

const ModifyChannelResponseSchema = z.object({
	channel: Channel,
});

const DeleteChannelResponseSchema = z.object({
	success: z.boolean(),
});

const ListGuildChannelsResponseSchema = z.object({
	channels: z.array(Channel),
});

const CreateGuildChannelResponseSchema = z.object({
	channel: Channel,
});

const SendChannelMessageResponseSchema = z.object({
	message: Message,
});
const GetChannelMessagesResponseSchema = z.object({
	messages: z.array(Message),
});

const EditChannelMessageResponseSchema = z.object({
	message: Message,
});

const DeleteChannelMessageResponseSchema = z.object({
	success: z.boolean(),
});

const AddChannelMessageReactionResponseSchema = z.object({
	success: z.boolean(),
});

const GetMemberResponseSchema = z.object({
	member: GuildMember,
});

const AddMemberResponseSchema = z.object({
	member: GuildMember,
});

const ModifyMemberResponseSchema = z.object({
	member: GuildMember,
});

const KickMemberResponseSchema = z.object({
	success: z.boolean(),
});

const ListRolesResponseSchema = z.object({
	roles: z.array(Role),
});

const CreateRoleResponseSchema = z.object({
	role: Role,
});

const UpdateRoleResponseSchema = z.object({
	role: Role,
});

const DeleteRoleResponseSchema = z.object({
	success: z.boolean(),
});

const AssignRoleToMemberResponseSchema = z.object({
	success: z.boolean(),
});

const GetCurrentUserResponseSchema = z.object({
  user: User,
})

const GetUserResponseSchema = z.object({
  user: User,
})

const ModifyCurrentUserResponseSchema = z.object({
  user: User,
})

const GetInviteResponseSchema = z.object({
  invite: Invite,
})

const CreateChannelInviteResponseSchema = z.object({
  invite: Invite,
})

const RevokeInviteResponseSchema = z.object({
  success: z.boolean(),
})

const ListGuildInvitesResponseSchema = z.object({
  invites: z.array(Invite),
})

const CreateChannelWebhookResponseSchema = z.object({
  webhook: Webhook,
})

const ListGuildWebhooksResponseSchema = z.object({
  webhooks: z.array(Webhook),
})

const ExecuteWebhookResponseSchema = z.object({
  message: Message,
})

export type DiscordEndpointName =
  | 'guildGet'
  | 'guildCreate'
  | 'guildUpdate'
  | 'guildDelete'
  | 'guildMembersList'
  | 'channelGet'
  | 'channelModify'
  | 'channelDelete'
  | 'guildChannelsList'
  | 'guildChannelCreate'
  | 'channelMessageSend'
  | 'channelMessagesGet'
  | 'channelMessageEdit'
  | 'channelMessageDelete'
  | 'channelMessageReactionAdd'
  | 'memberGet'
  | 'memberAdd'
  | 'memberModify'
  | 'memberKick'
  | 'rolesList'
  | 'roleCreate'
  | 'roleUpdate'
  | 'roleDelete'
  | 'roleAssignToMember'
  | 'currentUserGet'
  | 'userGet'
  | 'currentUserModify'
  | 'inviteGet'
  | 'channelInviteCreate'
  | 'inviteRevoke'
  | 'guildInvitesList'
  | 'channelWebhookCreate'
  | 'guildWebhooksList'
  | 'webhookExecute'
  | 'commandRegister'
  | 'interactionRespond';

export const DiscordEndpointInputSchemas: Record<DiscordEndpointName, z.ZodTypeAny> = {
  guildGet: GetGuildInputSchema,
  guildCreate: CreateGuildInputSchema,
  guildUpdate: UpdateGuildInputSchema,
  guildDelete: DeleteGuildInputSchema,
  guildMembersList: ListGuildMembersInputSchema,
  channelGet: GetChannelInputSchema,
  channelModify: ModifyChannelInputSchema,
  channelDelete: DeleteChannelInputSchema,
  guildChannelsList: ListGuildChannelsInputSchema,
  guildChannelCreate: CreateGuildChannelInputSchema,
  channelMessageSend: SendChannelMessageInputSchema,
  channelMessagesGet: GetChannelMessagesInputSchema,
  channelMessageEdit: EditChannelMessageInputSchema,
  channelMessageDelete: DeleteChannelMessageInputSchema,
  channelMessageReactionAdd: AddChannelMessageReactionInputSchema,
  memberGet: GetMemberInputSchema,
  memberAdd: AddMemberInputSchema,
  memberModify: ModifyMemberInputSchema,
  memberKick: KickMemberInputSchema,
  rolesList: ListRolesInputSchema,
  roleCreate: CreateRoleInputSchema,
  roleUpdate: UpdateRoleInputSchema,
  roleDelete: DeleteRoleInputSchema,
  roleAssignToMember: AssignRoleToMemberInputSchema,
  currentUserGet: GetCurrentUserInputSchema,
  userGet: GetUserInputSchema,
  currentUserModify: ModifyCurrentUserInputSchema,
  inviteGet: GetInviteInputSchema,
  channelInviteCreate: CreateChannelInviteInputSchema,
  inviteRevoke: RevokeInviteInputSchema,
  guildInvitesList: ListGuildInvitesInputSchema,
  channelWebhookCreate: CreateChannelWebhookInputSchema,
  guildWebhooksList: ListGuildWebhooksInputSchema,
  webhookExecute: ExecuteWebhookInputSchema,
  commandRegister: RegisterCommandInputSchema,
  interactionRespond: RespondToInteractionInputSchema,
} as const

export const DiscordEndpointOutputSchemas: Record<DiscordEndpointName, z.ZodTypeAny> = {
	guildGet: GetGuildResponseSchema,
	guildCreate: CreateGuildResponseSchema,
	guildUpdate: UpdateGuildResponseSchema,
	guildDelete: DeleteGuildResponseSchema,
	guildMembersList: ListGuildMembersResponseSchema,
	channelGet: GetChannelResponseSchema,
	channelModify: ModifyChannelResponseSchema,
	channelDelete: DeleteChannelResponseSchema,
	guildChannelsList: ListGuildChannelsResponseSchema,
	guildChannelCreate: CreateGuildChannelResponseSchema,
	channelMessageSend: SendChannelMessageResponseSchema,
	channelMessagesGet: GetChannelMessagesResponseSchema,
	channelMessageEdit: EditChannelMessageResponseSchema,
	channelMessageDelete: DeleteChannelMessageResponseSchema,
	channelMessageReactionAdd: AddChannelMessageReactionResponseSchema,
	memberGet: GetMemberResponseSchema,
	memberAdd: AddMemberResponseSchema,
	memberModify: ModifyMemberResponseSchema,
	memberKick: KickMemberResponseSchema,
	rolesList: ListRolesResponseSchema,
	roleCreate: CreateRoleResponseSchema,
	roleUpdate: UpdateRoleResponseSchema,
	roleDelete: DeleteRoleResponseSchema,
	roleAssignToMember: AssignRoleToMemberResponseSchema,
  currentUserGet: GetCurrentUserResponseSchema,
  userGet: GetUserResponseSchema,
  currentUserModify: ModifyCurrentUserResponseSchema,
  inviteGet: GetInviteResponseSchema,
  channelInviteCreate: CreateChannelInviteResponseSchema,
  inviteRevoke: RevokeInviteResponseSchema,
  guildInvitesList: ListGuildInvitesResponseSchema,
  channelWebhookCreate: CreateChannelWebhookResponseSchema,
  guildWebhooksList: ListGuildWebhooksResponseSchema,
  webhookExecute: ExecuteWebhookResponseSchema,
  commandRegister: RegisterCommandInputSchema,
  interactionRespond: RespondToInteractionInputSchema,
} as const;

export type DiscordEndpointInputs = {
  [K in keyof typeof DiscordEndpointInputSchemas]: z.infer<
    (typeof DiscordEndpointInputSchemas)[K]
  >;
}

export type DiscordEndpointOutputs = {
	[K in keyof typeof DiscordEndpointOutputSchemas]: z.infer<
		(typeof DiscordEndpointOutputSchemas)[K]
	>;
};

export type GetGuildResponse = z.infer<typeof GetGuildResponseSchema>;
export type CreateGuildResponse = z.infer<typeof CreateGuildResponseSchema>;
export type UpdateGuildResponse = z.infer<typeof UpdateGuildResponseSchema>;
export type DeleteGuildResponse = z.infer<typeof DeleteGuildResponseSchema>;
export type ListGuildMembersResponse = z.infer<typeof ListGuildMembersResponseSchema>;

export type GetChannelResponse = z.infer<typeof GetChannelResponseSchema>;
export type ModifyChannelResponse = z.infer<typeof ModifyChannelResponseSchema>;
export type DeleteChannelResponse = z.infer<typeof DeleteChannelResponseSchema>;
export type ListGuildChannelsResponse = z.infer<typeof ListGuildChannelsResponseSchema>;
export type CreateGuildChannelResponse = z.infer<typeof CreateGuildChannelResponseSchema>;

export type SendChannelMessageResponse = z.infer<typeof SendChannelMessageResponseSchema>;
export type GetChannelMessagesResponse = z.infer<typeof GetChannelMessagesResponseSchema>;
export type EditChannelMessageResponse = z.infer<typeof EditChannelMessageResponseSchema>;
export type DeleteChannelMessageResponse = z.infer<typeof DeleteChannelMessageResponseSchema>;
export type AddChannelMessageReactionResponse = z.infer<typeof AddChannelMessageReactionResponseSchema>;

export type GetMemberResponse = z.infer<typeof GetMemberResponseSchema>;
export type AddMemberResponse = z.infer<typeof AddMemberResponseSchema>;
export type ModifyMemberResponse = z.infer<typeof ModifyMemberResponseSchema>;
export type KickMemberResponse = z.infer<typeof KickMemberResponseSchema>;

export type ListRolesResponse = z.infer<typeof ListRolesResponseSchema>;
export type CreateRoleResponse = z.infer<typeof CreateRoleResponseSchema>;
export type UpdateRoleResponse = z.infer<typeof UpdateRoleResponseSchema>;
export type DeleteRoleResponse = z.infer<typeof DeleteRoleResponseSchema>;
export type AssignRoleToMemberResponse = z.infer<typeof AssignRoleToMemberResponseSchema>;

export type GetCurrentUserResponse = z.infer<typeof GetCurrentUserResponseSchema>;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type ModifyCurrentUserResponse = z.infer<typeof ModifyCurrentUserResponseSchema>;

export type GetInviteResponse = z.infer<typeof GetInviteResponseSchema>;
export type CreateChannelInviteResponse = z.infer<typeof CreateChannelInviteResponseSchema>;
export type RevokeInviteResponse = z.infer<typeof RevokeInviteResponseSchema>;
export type ListGuildInvitesResponse = z.infer<typeof ListGuildInvitesResponseSchema>;

export type CreateChannelWebhookResponse = z.infer<typeof CreateChannelWebhookResponseSchema>;
export type ListGuildWebhooksResponse = z.infer<typeof ListGuildWebhooksResponseSchema>;
export type ExecuteWebhookResponse = z.infer<typeof ExecuteWebhookResponseSchema>;

export type RegisterCommandResponse = z.infer<typeof RegisterCommandInputSchema>;
export type RespondToInteractionResponse = z.infer<typeof RespondToInteractionInputSchema>;