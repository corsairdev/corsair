import { z } from 'zod';

// ── Shared Discord API Types ───────────────────────────────────────────────────

// ── Zod Schemas for Validation ─────────────────────────────────────────────────

export const DiscordUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	discriminator: z.string(),
	global_name: z.string().nullable(),
	avatar: z.string().nullable(),
	bot: z.boolean().optional(),
	system: z.boolean().optional(),
	email: z.string().nullable().optional(),
	verified: z.boolean().optional(),
	locale: z.string().optional(),
	premium_type: z.number().optional(),
	public_flags: z.number().optional(),
	flags: z.number().optional(),
});
export type DiscordUser = z.infer<typeof DiscordUserSchema>;

export const EmbedSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	color: z.number().optional(),
	fields: z
		.array(
			z.object({
				name: z.string(),
				value: z.string(),
				inline: z.boolean().optional(),
			}),
		)
		.optional(),
	footer: z
		.object({ text: z.string(), icon_url: z.string().optional() })
		.optional(),
	image: z.object({ url: z.string() }).optional(),
	thumbnail: z.object({ url: z.string() }).optional(),
	author: z
		.object({
			name: z.string(),
			url: z.string().optional(),
			icon_url: z.string().optional(),
		})
		.optional(),
	timestamp: z.string().optional(),
});
export type Embed = z.infer<typeof EmbedSchema>;

export const AttachmentSchema = z.object({
	id: z.string(),
	filename: z.string(),
	description: z.string().optional(),
	content_type: z.string().optional(),
	size: z.number(),
	url: z.string(),
	proxy_url: z.string(),
	height: z.number().nullable().optional(),
	width: z.number().nullable().optional(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

export const MessageReferenceSchema = z.object({
	message_id: z.string().optional(),
	channel_id: z.string().optional(),
	guild_id: z.string().optional(),
});
export type MessageReference = z.infer<typeof MessageReferenceSchema>;

export const ChannelSchema = z.object({
	id: z.string(),
	type: z.number(),
	guild_id: z.string().optional(),
	name: z.string().nullable().optional(),
	topic: z.string().nullable().optional(),
	position: z.number().optional(),
	parent_id: z.string().nullable().optional(),
	last_message_id: z.string().nullable().optional(),
	owner_id: z.string().optional(),
	thread_metadata: z
		.object({
			archived: z.boolean(),
			auto_archive_duration: z.number(),
			archive_timestamp: z.string(),
			locked: z.boolean(),
			invitable: z.boolean().optional(),
		})
		.optional(),
});
export type Channel = z.infer<typeof ChannelSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Recursive type
//
// Message references itself via referenced_message?: Message | null.
// BaseSchema holds all non-recursive fields; the final schema extends it with
// the circular field via z.lazy(). The exported type is derived from the schema.
// ─────────────────────────────────────────────────────────────────────────────

const MessageBaseSchema = z.object({
	id: z.string(),
	channel_id: z.string(),
	author: DiscordUserSchema,
	content: z.string(),
	timestamp: z.string(),
	edited_timestamp: z.string().nullable(),
	tts: z.boolean(),
	mention_everyone: z.boolean(),
	mentions: z.array(DiscordUserSchema),
	mention_roles: z.array(z.string()),
	attachments: z.array(AttachmentSchema),
	embeds: z.array(EmbedSchema),
	reactions: z
		.array(
			z.object({
				count: z.number(),
				me: z.boolean(),
				emoji: z.object({ id: z.string().nullable(), name: z.string() }),
			}),
		)
		.optional(),
	pinned: z.boolean(),
	type: z.number(),
	flags: z.number().optional(),
	message_reference: MessageReferenceSchema.optional(),
	thread: ChannelSchema.optional(),
	nonce: z.union([z.string(), z.number()]).optional(),
});

type MessageShape = z.infer<typeof MessageBaseSchema> & {
	referenced_message?: MessageShape | null;
};

export const MessageSchema: z.ZodType<MessageShape> = MessageBaseSchema.extend({
	referenced_message: z.lazy(() => MessageSchema.nullable().optional()),
});

export type Message = z.infer<typeof MessageSchema>;

export const RoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	permissions: z.string(),
	position: z.number(),
	color: z.number(),
	hoist: z.boolean(),
	managed: z.boolean(),
	mentionable: z.boolean(),
});
export type Role = z.infer<typeof RoleSchema>;

export const GuildSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	splash: z.string().nullable(),
	owner_id: z.string(),
	afk_timeout: z.number(),
	verification_level: z.number(),
	default_message_notifications: z.number(),
	explicit_content_filter: z.number(),
	roles: z.array(RoleSchema),
	features: z.array(z.string()),
	mfa_level: z.number(),
	description: z.string().nullable(),
	premium_tier: z.number(),
	premium_subscription_count: z.number().optional(),
	preferred_locale: z.string(),
	approximate_member_count: z.number().optional(),
	approximate_presence_count: z.number().optional(),
});
export type Guild = z.infer<typeof GuildSchema>;

export const PartialGuildSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	owner: z.boolean(),
	permissions: z.string(),
	features: z.array(z.string()),
	approximate_member_count: z.number().optional(),
	approximate_presence_count: z.number().optional(),
});
export type PartialGuild = z.infer<typeof PartialGuildSchema>;

export const GuildMemberSchema = z.object({
	user: DiscordUserSchema.optional(),
	nick: z.string().nullable(),
	avatar: z.string().nullable().optional(),
	roles: z.array(z.string()),
	joined_at: z.string(),
	premium_since: z.string().nullable(),
	deaf: z.boolean(),
	mute: z.boolean(),
	flags: z.number(),
	pending: z.boolean().optional(),
});
export type GuildMember = z.infer<typeof GuildMemberSchema>;

export const ApplicationCommandSchema = z.object({
	id: z.string(),
	type: z.number().optional(),
	application_id: z.string(),
	guild_id: z.string().optional(),
	name: z.string(),
	description: z.string(),
	options: z.array(z.any()).optional(),
	default_member_permissions: z.string().nullable().optional(),
	dm_permission: z.boolean().optional(),
	nsfw: z.boolean().optional(),
	version: z.string(),
});
export type ApplicationCommand = z.infer<typeof ApplicationCommandSchema>;

export const BanSchema = z.object({
	reason: z.string().nullable(),
	user: DiscordUserSchema,
});
export type Ban = z.infer<typeof BanSchema>;

// ── Endpoint Input Schemas ─────────────────────────────────────────────────────

export const FollowChannelInputSchema = z.record(z.string(), z.any());
export type FollowChannelInput = z.infer<typeof FollowChannelInputSchema>;

export const AddGuildMemberInputSchema = z.record(z.string(), z.any());
export type AddGuildMemberInput = z.infer<typeof AddGuildMemberInputSchema>;

export const AddMyMessageReactionInputSchema = z.record(z.string(), z.any());
export type AddMyMessageReactionInput = z.infer<typeof AddMyMessageReactionInputSchema>;

export const AddGroupDmUserInputSchema = z.record(z.string(), z.any());
export type AddGroupDmUserInput = z.infer<typeof AddGroupDmUserInputSchema>;

export const AddThreadMemberInputSchema = z.record(z.string(), z.any());
export type AddThreadMemberInput = z.infer<typeof AddThreadMemberInputSchema>;

export const AddGuildMemberRoleInputSchema = z.record(z.string(), z.any());
export type AddGuildMemberRoleInput = z.infer<typeof AddGuildMemberRoleInputSchema>;

export const BanUserFromGuildInputSchema = z.record(z.string(), z.any());
export type BanUserFromGuildInput = z.infer<typeof BanUserFromGuildInputSchema>;

export const BulkBanUsersFromGuildInputSchema = z.record(z.string(), z.any());
export type BulkBanUsersFromGuildInput = z.infer<typeof BulkBanUsersFromGuildInputSchema>;

export const CreateChannelInviteInputSchema = z.record(z.string(), z.any());
export type CreateChannelInviteInput = z.infer<typeof CreateChannelInviteInputSchema>;

export const CreateStageInstanceInputSchema = z.record(z.string(), z.any());
export type CreateStageInstanceInput = z.infer<typeof CreateStageInstanceInputSchema>;

export const CreateApplicationCommandInputSchema = z.record(z.string(), z.any());
export type CreateApplicationCommandInput = z.infer<typeof CreateApplicationCommandInputSchema>;

export const CreateWebhookInputSchema = z.record(z.string(), z.any());
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;

export const CreateGuildApplicationCommandInputSchema = z.record(z.string(), z.any());
export type CreateGuildApplicationCommandInput = z.infer<typeof CreateGuildApplicationCommandInputSchema>;

export const CreateAutoModerationRuleInputSchema = z.record(z.string(), z.any());
export type CreateAutoModerationRuleInput = z.infer<typeof CreateAutoModerationRuleInputSchema>;

export const CreateGuildChannelInputSchema = z.record(z.string(), z.any());
export type CreateGuildChannelInput = z.infer<typeof CreateGuildChannelInputSchema>;

export const CreateGuildEmojiInputSchema = z.record(z.string(), z.any());
export type CreateGuildEmojiInput = z.infer<typeof CreateGuildEmojiInputSchema>;

export const CreateGuildScheduledEventInputSchema = z.record(z.string(), z.any());
export type CreateGuildScheduledEventInput = z.infer<typeof CreateGuildScheduledEventInputSchema>;

export const CreateGuildStickerInputSchema = z.record(z.string(), z.any());
export type CreateGuildStickerInput = z.infer<typeof CreateGuildStickerInputSchema>;

export const CreateGuildTemplateInputSchema = z.record(z.string(), z.any());
export type CreateGuildTemplateInput = z.infer<typeof CreateGuildTemplateInputSchema>;

export const CreateGuildInputSchema = z.record(z.string(), z.any());
export type CreateGuildInput = z.infer<typeof CreateGuildInputSchema>;

export const CreateThreadInputSchema = z.record(z.string(), z.any());
export type CreateThreadInput = z.infer<typeof CreateThreadInputSchema>;

export const CreateGuildRoleInputSchema = z.record(z.string(), z.any());
export type CreateGuildRoleInput = z.infer<typeof CreateGuildRoleInputSchema>;

export const CreateThreadFromMessageInputSchema = z.record(z.string(), z.any());
export type CreateThreadFromMessageInput = z.infer<typeof CreateThreadFromMessageInputSchema>;

export const CrosspostMessageInputSchema = z.record(z.string(), z.any());
export type CrosspostMessageInput = z.infer<typeof CrosspostMessageInputSchema>;

export const DeleteAllMessageReactionsInputSchema = z.record(z.string(), z.any());
export type DeleteAllMessageReactionsInput = z.infer<typeof DeleteAllMessageReactionsInputSchema>;

export const DeleteApplicationCommandInputSchema = z.record(z.string(), z.any());
export type DeleteApplicationCommandInput = z.infer<typeof DeleteApplicationCommandInputSchema>;

export const DeleteChannelInputSchema = z.record(z.string(), z.any());
export type DeleteChannelInput = z.infer<typeof DeleteChannelInputSchema>;

export const DeleteMessageInputSchema = z.record(z.string(), z.any());
export type DeleteMessageInput = z.infer<typeof DeleteMessageInputSchema>;

export const DeleteAllMessageReactionsByEmojiInputSchema = z.record(z.string(), z.any());
export type DeleteAllMessageReactionsByEmojiInput = z.infer<typeof DeleteAllMessageReactionsByEmojiInputSchema>;

export const DeleteChannelPermissionOverwriteInputSchema = z.record(z.string(), z.any());
export type DeleteChannelPermissionOverwriteInput = z.infer<typeof DeleteChannelPermissionOverwriteInputSchema>;

export const DeleteThreadMemberInputSchema = z.record(z.string(), z.any());
export type DeleteThreadMemberInput = z.infer<typeof DeleteThreadMemberInputSchema>;

export const DeleteAutoModerationRuleInputSchema = z.record(z.string(), z.any());
export type DeleteAutoModerationRuleInput = z.infer<typeof DeleteAutoModerationRuleInputSchema>;

export const DeleteGuildInputSchema = z.record(z.string(), z.any());
export type DeleteGuildInput = z.infer<typeof DeleteGuildInputSchema>;

export const DeleteGuildApplicationCommandInputSchema = z.record(z.string(), z.any());
export type DeleteGuildApplicationCommandInput = z.infer<typeof DeleteGuildApplicationCommandInputSchema>;

export const DeleteGuildEmojiInputSchema = z.record(z.string(), z.any());
export type DeleteGuildEmojiInput = z.infer<typeof DeleteGuildEmojiInputSchema>;

export const DeleteGuildIntegrationInputSchema = z.record(z.string(), z.any());
export type DeleteGuildIntegrationInput = z.infer<typeof DeleteGuildIntegrationInputSchema>;

export const DeleteGuildMemberInputSchema = z.record(z.string(), z.any());
export type DeleteGuildMemberInput = z.infer<typeof DeleteGuildMemberInputSchema>;

export const DeleteGuildMemberRoleInputSchema = z.record(z.string(), z.any());
export type DeleteGuildMemberRoleInput = z.infer<typeof DeleteGuildMemberRoleInputSchema>;

export const DeleteGuildScheduledEventInputSchema = z.record(z.string(), z.any());
export type DeleteGuildScheduledEventInput = z.infer<typeof DeleteGuildScheduledEventInputSchema>;

export const DeleteGuildStickerInputSchema = z.record(z.string(), z.any());
export type DeleteGuildStickerInput = z.infer<typeof DeleteGuildStickerInputSchema>;

export const DeleteGuildTemplateInputSchema = z.record(z.string(), z.any());
export type DeleteGuildTemplateInput = z.infer<typeof DeleteGuildTemplateInputSchema>;

export const InviteRevokeInputSchema = z.record(z.string(), z.any());
export type InviteRevokeInput = z.infer<typeof InviteRevokeInputSchema>;

export const DeleteOriginalWebhookMessageInputSchema = z.record(z.string(), z.any());
export type DeleteOriginalWebhookMessageInput = z.infer<typeof DeleteOriginalWebhookMessageInputSchema>;

export const DeleteGuildRoleInputSchema = z.record(z.string(), z.any());
export type DeleteGuildRoleInput = z.infer<typeof DeleteGuildRoleInputSchema>;

export const DeleteStageInstanceInputSchema = z.record(z.string(), z.any());
export type DeleteStageInstanceInput = z.infer<typeof DeleteStageInstanceInputSchema>;

export const DeleteUserMessageReactionInputSchema = z.record(z.string(), z.any());
export type DeleteUserMessageReactionInput = z.infer<typeof DeleteUserMessageReactionInputSchema>;

export const DeleteMyMessageReactionInputSchema = z.record(z.string(), z.any());
export type DeleteMyMessageReactionInput = z.infer<typeof DeleteMyMessageReactionInputSchema>;

export const DeleteWebhookInputSchema = z.record(z.string(), z.any());
export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;

export const DeleteWebhookMessageInputSchema = z.record(z.string(), z.any());
export type DeleteWebhookMessageInput = z.infer<typeof DeleteWebhookMessageInputSchema>;

export const DeleteWebhookByTokenInputSchema = z.record(z.string(), z.any());
export type DeleteWebhookByTokenInput = z.infer<typeof DeleteWebhookByTokenInputSchema>;

export const GetApplicationCommandInputSchema = z.record(z.string(), z.any());
export type GetApplicationCommandInput = z.infer<typeof GetApplicationCommandInputSchema>;

export const GetGuildEmojiInputSchema = z.record(z.string(), z.any());
export type GetGuildEmojiInput = z.infer<typeof GetGuildEmojiInputSchema>;

export const GetGuildApplicationCommandInputSchema = z.record(z.string(), z.any());
export type GetGuildApplicationCommandInput = z.infer<typeof GetGuildApplicationCommandInputSchema>;

export const ListGuildApplicationCommandsInputSchema = z.record(z.string(), z.any());
export type ListGuildApplicationCommandsInput = z.infer<typeof ListGuildApplicationCommandsInputSchema>;

export const ListMessagesInputSchema = z.record(z.string(), z.any());
export type ListMessagesInput = z.infer<typeof ListMessagesInputSchema>;

export const ListVoiceRegionsInputSchema = z.record(z.string(), z.any());
export type ListVoiceRegionsInput = z.infer<typeof ListVoiceRegionsInputSchema>;

export const ListGuildApplicationCommandPermissionsInputSchema = z.record(z.string(), z.any());
export type ListGuildApplicationCommandPermissionsInput = z.infer<typeof ListGuildApplicationCommandPermissionsInputSchema>;

export const ListPrivateArchivedThreadsInputSchema = z.record(z.string(), z.any());
export type ListPrivateArchivedThreadsInput = z.infer<typeof ListPrivateArchivedThreadsInputSchema>;

export const ListPublicArchivedThreadsInputSchema = z.record(z.string(), z.any());
export type ListPublicArchivedThreadsInput = z.infer<typeof ListPublicArchivedThreadsInputSchema>;

export const ListMessageReactionsByEmojiInputSchema = z.record(z.string(), z.any());
export type ListMessageReactionsByEmojiInput = z.infer<typeof ListMessageReactionsByEmojiInputSchema>;

export const GetGatewayInputSchema = z.record(z.string(), z.any());
export type GetGatewayInput = z.infer<typeof GetGatewayInputSchema>;

export const ListGuildAuditLogEntriesInputSchema = z.record(z.string(), z.any());
export type ListGuildAuditLogEntriesInput = z.infer<typeof ListGuildAuditLogEntriesInputSchema>;

export const ListGuildMembersInputSchema = z.record(z.string(), z.any());
export type ListGuildMembersInput = z.infer<typeof ListGuildMembersInputSchema>;

export const GetGuildsOnboardingInputSchema = z.record(z.string(), z.any());
export type GetGuildsOnboardingInput = z.infer<typeof GetGuildsOnboardingInputSchema>;

export const GetGuildScheduledEventInputSchema = z.record(z.string(), z.any());
export type GetGuildScheduledEventInput = z.infer<typeof GetGuildScheduledEventInputSchema>;

export const ListGuildTemplatesInputSchema = z.record(z.string(), z.any());
export type ListGuildTemplatesInput = z.infer<typeof ListGuildTemplatesInputSchema>;

export const GetGuildWidgetPngInputSchema = z.record(z.string(), z.any());
export type GetGuildWidgetPngInput = z.infer<typeof GetGuildWidgetPngInputSchema>;

export const GetMyOauth2ApplicationInputSchema = z.record(z.string(), z.any());
export type GetMyOauth2ApplicationInput = z.infer<typeof GetMyOauth2ApplicationInputSchema>;

export const GetPublicKeysInputSchema = z.record(z.string(), z.any());
export type GetPublicKeysInput = z.infer<typeof GetPublicKeysInputSchema>;

export const ListMyPrivateArchivedThreadsInputSchema = z.record(z.string(), z.any());
export type ListMyPrivateArchivedThreadsInput = z.infer<typeof ListMyPrivateArchivedThreadsInputSchema>;

export const GetApplicationUserRoleConnectionInputSchema = z.record(z.string(), z.any());
export type GetApplicationUserRoleConnectionInput = z.infer<typeof GetApplicationUserRoleConnectionInputSchema>;

export const GetMyApplicationInputSchema = z.record(z.string(), z.any());
export type GetMyApplicationInput = z.infer<typeof GetMyApplicationInputSchema>;

export const ExecuteGithubCompatibleWebhookInputSchema = z.record(z.string(), z.any());
export type ExecuteGithubCompatibleWebhookInput = z.infer<typeof ExecuteGithubCompatibleWebhookInputSchema>;

export const CreateDmInputSchema = z.record(z.string(), z.any());
export type CreateDmInput = z.infer<typeof CreateDmInputSchema>;

export const JoinThreadInputSchema = z.record(z.string(), z.any());
export type JoinThreadInput = z.infer<typeof JoinThreadInputSchema>;

export const LeaveGuildInputSchema = z.record(z.string(), z.any());
export type LeaveGuildInput = z.infer<typeof LeaveGuildInputSchema>;

export const ListChannelInvitesInputSchema = z.record(z.string(), z.any());
export type ListChannelInvitesInput = z.infer<typeof ListChannelInvitesInputSchema>;

export const GetActiveGuildThreadsInputSchema = z.record(z.string(), z.any());
export type GetActiveGuildThreadsInput = z.infer<typeof GetActiveGuildThreadsInputSchema>;

export const ListApplicationCommandsInputSchema = z.record(z.string(), z.any());
export type ListApplicationCommandsInput = z.infer<typeof ListApplicationCommandsInputSchema>;

export const ListGuildBansInputSchema = z.record(z.string(), z.any());
export type ListGuildBansInput = z.infer<typeof ListGuildBansInputSchema>;

export const ListGuildIntegrationsInputSchema = z.record(z.string(), z.any());
export type ListGuildIntegrationsInput = z.infer<typeof ListGuildIntegrationsInputSchema>;

export const ListGuildVoiceRegionsInputSchema = z.record(z.string(), z.any());
export type ListGuildVoiceRegionsInput = z.infer<typeof ListGuildVoiceRegionsInputSchema>;

export const ListGuildRolesInputSchema = z.record(z.string(), z.any());
export type ListGuildRolesInput = z.infer<typeof ListGuildRolesInputSchema>;

export const ListStickerPacksInputSchema = z.record(z.string(), z.any());
export type ListStickerPacksInput = z.infer<typeof ListStickerPacksInputSchema>;

export const ListThreadMembersInputSchema = z.record(z.string(), z.any());
export type ListThreadMembersInput = z.infer<typeof ListThreadMembersInputSchema>;

export const UpdateApplicationInputSchema = z.record(z.string(), z.any());
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationInputSchema>;

export const SetChannelPermissionOverwriteInputSchema = z.record(z.string(), z.any());
export type SetChannelPermissionOverwriteInput = z.infer<typeof SetChannelPermissionOverwriteInputSchema>;

export const UpdateAutoModerationRuleInputSchema = z.record(z.string(), z.any());
export type UpdateAutoModerationRuleInput = z.infer<typeof UpdateAutoModerationRuleInputSchema>;

export const UpdateGuildMemberInputSchema = z.record(z.string(), z.any());
export type UpdateGuildMemberInput = z.infer<typeof UpdateGuildMemberInputSchema>;

export const UpdateGuildRoleInputSchema = z.record(z.string(), z.any());
export type UpdateGuildRoleInput = z.infer<typeof UpdateGuildRoleInputSchema>;

export const UpdateSelfVoiceStateInputSchema = z.record(z.string(), z.any());
export type UpdateSelfVoiceStateInput = z.infer<typeof UpdateSelfVoiceStateInputSchema>;

export const UpdateApplicationCommandInputSchema = z.record(z.string(), z.any());
export type UpdateApplicationCommandInput = z.infer<typeof UpdateApplicationCommandInputSchema>;

export const UpdateGuildTemplateInputSchema = z.record(z.string(), z.any());
export type UpdateGuildTemplateInput = z.infer<typeof UpdateGuildTemplateInputSchema>;

export const UpdateVoiceStateInputSchema = z.record(z.string(), z.any());
export type UpdateVoiceStateInput = z.infer<typeof UpdateVoiceStateInputSchema>;

export const UpdateOriginalWebhookMessageInputSchema = z.record(z.string(), z.any());
export type UpdateOriginalWebhookMessageInput = z.infer<typeof UpdateOriginalWebhookMessageInputSchema>;

export const PinMessageInputSchema = z.record(z.string(), z.any());
export type PinMessageInput = z.infer<typeof PinMessageInputSchema>;

export const CreateGuildFromTemplateInputSchema = z.record(z.string(), z.any());
export type CreateGuildFromTemplateInput = z.infer<typeof CreateGuildFromTemplateInputSchema>;

export const CreateInteractionResponseInputSchema = z.record(z.string(), z.any());
export type CreateInteractionResponseInput = z.infer<typeof CreateInteractionResponseInputSchema>;

export const CreateMessageInputSchema = z.record(z.string(), z.any());
export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;

export const ExecuteSlackCompatibleWebhookInputSchema = z.record(z.string(), z.any());
export type ExecuteSlackCompatibleWebhookInput = z.infer<typeof ExecuteSlackCompatibleWebhookInputSchema>;

export const ExecuteWebhookInputSchema = z.record(z.string(), z.any());
export type ExecuteWebhookInput = z.infer<typeof ExecuteWebhookInputSchema>;

export const GetGuildPreviewInputSchema = z.record(z.string(), z.any());
export type GetGuildPreviewInput = z.infer<typeof GetGuildPreviewInputSchema>;

export const PruneGuildInputSchema = z.record(z.string(), z.any());
export type PruneGuildInput = z.infer<typeof PruneGuildInputSchema>;

export const LeaveThreadInputSchema = z.record(z.string(), z.any());
export type LeaveThreadInput = z.infer<typeof LeaveThreadInputSchema>;

export const UnbanUserFromGuildInputSchema = z.record(z.string(), z.any());
export type UnbanUserFromGuildInput = z.infer<typeof UnbanUserFromGuildInputSchema>;

export const DeleteGroupDmUserInputSchema = z.record(z.string(), z.any());
export type DeleteGroupDmUserInput = z.infer<typeof DeleteGroupDmUserInputSchema>;

export const GetApplicationInputSchema = z.record(z.string(), z.any());
export type GetApplicationInput = z.infer<typeof GetApplicationInputSchema>;

export const GetApplicationRoleConnectionsMetadataInputSchema = z.record(z.string(), z.any());
export type GetApplicationRoleConnectionsMetadataInput = z.infer<typeof GetApplicationRoleConnectionsMetadataInputSchema>;

export const GetAutoModerationRuleInputSchema = z.record(z.string(), z.any());
export type GetAutoModerationRuleInput = z.infer<typeof GetAutoModerationRuleInputSchema>;

export const GetBotGatewayInputSchema = z.record(z.string(), z.any());
export type GetBotGatewayInput = z.infer<typeof GetBotGatewayInputSchema>;

export const GetChannelInputSchema = z.record(z.string(), z.any());
export type GetChannelInput = z.infer<typeof GetChannelInputSchema>;

export const ListChannelWebhooksInputSchema = z.record(z.string(), z.any());
export type ListChannelWebhooksInput = z.infer<typeof ListChannelWebhooksInputSchema>;

export const ListAutoModerationRulesInputSchema = z.record(z.string(), z.any());
export type ListAutoModerationRulesInput = z.infer<typeof ListAutoModerationRulesInputSchema>;

export const ListGuildChannelsInputSchema = z.record(z.string(), z.any());
export type ListGuildChannelsInput = z.infer<typeof ListGuildChannelsInputSchema>;

export const GetGuildApplicationCommandPermissionsInputSchema = z.record(z.string(), z.any());
export type GetGuildApplicationCommandPermissionsInput = z.infer<typeof GetGuildApplicationCommandPermissionsInputSchema>;

export const GetGuildInputSchema = z.record(z.string(), z.any());
export type GetGuildInput = z.infer<typeof GetGuildInputSchema>;

export const ListGuildEmojisInputSchema = z.record(z.string(), z.any());
export type ListGuildEmojisInput = z.infer<typeof ListGuildEmojisInputSchema>;

export const ListGuildInvitesInputSchema = z.record(z.string(), z.any());
export type ListGuildInvitesInput = z.infer<typeof ListGuildInvitesInputSchema>;

export const GetGuildMemberInputSchema = z.record(z.string(), z.any());
export type GetGuildMemberInput = z.infer<typeof GetGuildMemberInputSchema>;

export const PreviewPruneGuildInputSchema = z.record(z.string(), z.any());
export type PreviewPruneGuildInput = z.infer<typeof PreviewPruneGuildInputSchema>;

export const ListGuildScheduledEventsInputSchema = z.record(z.string(), z.any());
export type ListGuildScheduledEventsInput = z.infer<typeof ListGuildScheduledEventsInputSchema>;

export const ListGuildStickersInputSchema = z.record(z.string(), z.any());
export type ListGuildStickersInput = z.infer<typeof ListGuildStickersInputSchema>;

export const GetGuildTemplateInputSchema = z.record(z.string(), z.any());
export type GetGuildTemplateInput = z.infer<typeof GetGuildTemplateInputSchema>;

export const GetGuildBanInputSchema = z.record(z.string(), z.any());
export type GetGuildBanInput = z.infer<typeof GetGuildBanInputSchema>;

export const GetGuildVanityUrlInputSchema = z.record(z.string(), z.any());
export type GetGuildVanityUrlInput = z.infer<typeof GetGuildVanityUrlInputSchema>;

export const GetGuildWebhooksInputSchema = z.record(z.string(), z.any());
export type GetGuildWebhooksInput = z.infer<typeof GetGuildWebhooksInputSchema>;

export const GetGuildWelcomeScreenInputSchema = z.record(z.string(), z.any());
export type GetGuildWelcomeScreenInput = z.infer<typeof GetGuildWelcomeScreenInputSchema>;

export const GetGuildWidgetSettingsInputSchema = z.record(z.string(), z.any());
export type GetGuildWidgetSettingsInput = z.infer<typeof GetGuildWidgetSettingsInputSchema>;

export const GetGuildWidgetInputSchema = z.record(z.string(), z.any());
export type GetGuildWidgetInput = z.infer<typeof GetGuildWidgetInputSchema>;

export const InviteResolveInputSchema = z.record(z.string(), z.any());
export type InviteResolveInput = z.infer<typeof InviteResolveInputSchema>;

export const GetMessageInputSchema = z.record(z.string(), z.any());
export type GetMessageInput = z.infer<typeof GetMessageInputSchema>;

export const GetOriginalWebhookMessageInputSchema = z.record(z.string(), z.any());
export type GetOriginalWebhookMessageInput = z.infer<typeof GetOriginalWebhookMessageInputSchema>;

export const ListPinnedMessagesInputSchema = z.record(z.string(), z.any());
export type ListPinnedMessagesInput = z.infer<typeof ListPinnedMessagesInputSchema>;

export const GetStageInstanceInputSchema = z.record(z.string(), z.any());
export type GetStageInstanceInput = z.infer<typeof GetStageInstanceInputSchema>;

export const GetStickerInputSchema = z.record(z.string(), z.any());
export type GetStickerInput = z.infer<typeof GetStickerInputSchema>;

export const GetGuildStickerInputSchema = z.record(z.string(), z.any());
export type GetGuildStickerInput = z.infer<typeof GetGuildStickerInputSchema>;

export const GetThreadMemberInputSchema = z.record(z.string(), z.any());
export type GetThreadMemberInput = z.infer<typeof GetThreadMemberInputSchema>;

export const GetUserInputSchema = z.record(z.string(), z.any());
export type GetUserInput = z.infer<typeof GetUserInputSchema>;

export const ListGuildScheduledEventUsersInputSchema = z.record(z.string(), z.any());
export type ListGuildScheduledEventUsersInput = z.infer<typeof ListGuildScheduledEventUsersInputSchema>;

export const GetWebhookInputSchema = z.record(z.string(), z.any());
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;

export const GetWebhookByTokenInputSchema = z.record(z.string(), z.any());
export type GetWebhookByTokenInput = z.infer<typeof GetWebhookByTokenInputSchema>;

export const GetWebhookMessageInputSchema = z.record(z.string(), z.any());
export type GetWebhookMessageInput = z.infer<typeof GetWebhookMessageInputSchema>;

export const SearchGuildMembersInputSchema = z.record(z.string(), z.any());
export type SearchGuildMembersInput = z.infer<typeof SearchGuildMembersInputSchema>;

export const TestAuthInputSchema = z.record(z.string(), z.any());
export type TestAuthInput = z.infer<typeof TestAuthInputSchema>;

export const TriggerTypingIndicatorInputSchema = z.record(z.string(), z.any());
export type TriggerTypingIndicatorInput = z.infer<typeof TriggerTypingIndicatorInputSchema>;

export const UnpinMessageInputSchema = z.record(z.string(), z.any());
export type UnpinMessageInput = z.infer<typeof UnpinMessageInputSchema>;

export const UpdateGuildWidgetSettingsInputSchema = z.record(z.string(), z.any());
export type UpdateGuildWidgetSettingsInput = z.infer<typeof UpdateGuildWidgetSettingsInputSchema>;

export const UpdateMyApplicationInputSchema = z.record(z.string(), z.any());
export type UpdateMyApplicationInput = z.infer<typeof UpdateMyApplicationInputSchema>;

export const UpdateGuildApplicationCommandInputSchema = z.record(z.string(), z.any());
export type UpdateGuildApplicationCommandInput = z.infer<typeof UpdateGuildApplicationCommandInputSchema>;

export const UpdateMyGuildMemberInputSchema = z.record(z.string(), z.any());
export type UpdateMyGuildMemberInput = z.infer<typeof UpdateMyGuildMemberInputSchema>;

export const UpdateMessageInputSchema = z.record(z.string(), z.any());
export type UpdateMessageInput = z.infer<typeof UpdateMessageInputSchema>;

export const UpdateChannelInputSchema = z.record(z.string(), z.any());
export type UpdateChannelInput = z.infer<typeof UpdateChannelInputSchema>;

export const UpdateMyUserInputSchema = z.record(z.string(), z.any());
export type UpdateMyUserInput = z.infer<typeof UpdateMyUserInputSchema>;

export const UpdateWebhookMessageInputSchema = z.record(z.string(), z.any());
export type UpdateWebhookMessageInput = z.infer<typeof UpdateWebhookMessageInputSchema>;

export const UpdateGuildEmojiInputSchema = z.record(z.string(), z.any());
export type UpdateGuildEmojiInput = z.infer<typeof UpdateGuildEmojiInputSchema>;

export const PutGuildsOnboardingInputSchema = z.record(z.string(), z.any());
export type PutGuildsOnboardingInput = z.infer<typeof PutGuildsOnboardingInputSchema>;

export const UpdateGuildScheduledEventInputSchema = z.record(z.string(), z.any());
export type UpdateGuildScheduledEventInput = z.infer<typeof UpdateGuildScheduledEventInputSchema>;

export const UpdateGuildInputSchema = z.record(z.string(), z.any());
export type UpdateGuildInput = z.infer<typeof UpdateGuildInputSchema>;

export const UpdateGuildStickerInputSchema = z.record(z.string(), z.any());
export type UpdateGuildStickerInput = z.infer<typeof UpdateGuildStickerInputSchema>;

export const SyncGuildTemplateInputSchema = z.record(z.string(), z.any());
export type SyncGuildTemplateInput = z.infer<typeof SyncGuildTemplateInputSchema>;

export const UpdateGuildWelcomeScreenInputSchema = z.record(z.string(), z.any());
export type UpdateGuildWelcomeScreenInput = z.infer<typeof UpdateGuildWelcomeScreenInputSchema>;

export const UpdateApplicationUserRoleConnectionInputSchema = z.record(z.string(), z.any());
export type UpdateApplicationUserRoleConnectionInput = z.infer<typeof UpdateApplicationUserRoleConnectionInputSchema>;

export const UpdateWebhookInputSchema = z.record(z.string(), z.any());
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;

export const UpdateWebhookByTokenInputSchema = z.record(z.string(), z.any());
export type UpdateWebhookByTokenInput = z.infer<typeof UpdateWebhookByTokenInputSchema>;


export const MessagesSendInputSchema = z.object({
	channel_id: z.string(),
	content: z.string().optional(),
	embeds: z.array(EmbedSchema).optional(),
	tts: z.boolean().optional(),
	nonce: z.union([z.string(), z.number()]).optional(),
});
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

export const MessagesReplyInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	content: z.string().optional(),
	embeds: z.array(EmbedSchema).optional(),
	fail_if_not_exists: z.boolean().optional(),
});
export type MessagesReplyInput = z.infer<typeof MessagesReplyInputSchema>;

export const MessagesGetInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
});
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;

export const MessagesListInputSchema = z.object({
	channel_id: z.string(),
	limit: z.number().optional(),
	before: z.string().optional(),
	after: z.string().optional(),
	around: z.string().optional(),
});
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

export const MessagesEditInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	content: z.string().optional(),
	embeds: z.array(EmbedSchema).optional(),
});
export type MessagesEditInput = z.infer<typeof MessagesEditInputSchema>;

export const MessagesDeleteInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
});
export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;

const AutoArchiveDurationSchema = z.union([
	z.literal(60),
	z.literal(1440),
	z.literal(4320),
	z.literal(10080),
]);

export const ThreadsCreateInputSchema = z.object({
	channel_id: z.string(),
	name: z.string(),
	auto_archive_duration: AutoArchiveDurationSchema.optional(),
	type: z.number().optional(),
	invitable: z.boolean().optional(),
});
export type ThreadsCreateInput = z.infer<typeof ThreadsCreateInputSchema>;

export const ThreadsCreateFromMessageInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	name: z.string(),
	auto_archive_duration: AutoArchiveDurationSchema.optional(),
});
export type ThreadsCreateFromMessageInput = z.infer<
	typeof ThreadsCreateFromMessageInputSchema
>;

export const ReactionsAddInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	emoji: z.string(),
});
export type ReactionsAddInput = z.infer<typeof ReactionsAddInputSchema>;

export const ReactionsRemoveInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	emoji: z.string(),
});
export type ReactionsRemoveInput = z.infer<typeof ReactionsRemoveInputSchema>;

export const ReactionsListInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	emoji: z.string(),
	limit: z.number().optional(),
	after: z.string().optional(),
});
export type ReactionsListInput = z.infer<typeof ReactionsListInputSchema>;

export const GuildsListInputSchema = z.object({
	before: z.string().optional(),
	after: z.string().optional(),
	limit: z.number().optional(),
	with_counts: z.boolean().optional(),
});
export type GuildsListInput = z.infer<typeof GuildsListInputSchema>;

export const GuildsGetInputSchema = z.object({
	guild_id: z.string(),
	with_counts: z.boolean().optional(),
});
export type GuildsGetInput = z.infer<typeof GuildsGetInputSchema>;

export const ChannelsListInputSchema = z.object({
	guild_id: z.string(),
});
export type ChannelsListInput = z.infer<typeof ChannelsListInputSchema>;

export const MembersListInputSchema = z.object({
	guild_id: z.string(),
	limit: z.number().optional(),
	after: z.string().optional(),
});
export type MembersListInput = z.infer<typeof MembersListInputSchema>;

export const MembersGetInputSchema = z.object({
	guild_id: z.string(),
	user_id: z.string(),
});
export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;

// Application Commands Input Schemas
export const CommandsCreateGlobalInputSchema = z.object({
	application_id: z.string(),
	name: z.string(),
	description: z.string(),
	options: z.array(z.any()).optional(),
	default_member_permissions: z.string().nullable().optional(),
	dm_permission: z.boolean().optional(),
	type: z.number().optional(),
	nsfw: z.boolean().optional(),
});
export type CommandsCreateGlobalInput = z.infer<typeof CommandsCreateGlobalInputSchema>;

export const CommandsGetGlobalInputSchema = z.object({
	application_id: z.string(),
	command_id: z.string(),
});
export type CommandsGetGlobalInput = z.infer<typeof CommandsGetGlobalInputSchema>;

export const CommandsListGlobalInputSchema = z.object({
	application_id: z.string(),
	with_localizations: z.boolean().optional(),
});
export type CommandsListGlobalInput = z.infer<typeof CommandsListGlobalInputSchema>;

export const CommandsUpdateGlobalInputSchema = z.object({
	application_id: z.string(),
	command_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	options: z.array(z.any()).optional(),
	default_member_permissions: z.string().nullable().optional(),
	dm_permission: z.boolean().optional(),
	nsfw: z.boolean().optional(),
});
export type CommandsUpdateGlobalInput = z.infer<typeof CommandsUpdateGlobalInputSchema>;

export const CommandsDeleteGlobalInputSchema = z.object({
	application_id: z.string(),
	command_id: z.string(),
});
export type CommandsDeleteGlobalInput = z.infer<typeof CommandsDeleteGlobalInputSchema>;

export const CommandsCreateGuildInputSchema = z.object({
	application_id: z.string(),
	guild_id: z.string(),
	name: z.string(),
	description: z.string(),
	options: z.array(z.any()).optional(),
	default_member_permissions: z.string().nullable().optional(),
	type: z.number().optional(),
	nsfw: z.boolean().optional(),
});
export type CommandsCreateGuildInput = z.infer<typeof CommandsCreateGuildInputSchema>;

export const CommandsGetGuildInputSchema = z.object({
	application_id: z.string(),
	guild_id: z.string(),
	command_id: z.string(),
});
export type CommandsGetGuildInput = z.infer<typeof CommandsGetGuildInputSchema>;

export const CommandsListGuildInputSchema = z.object({
	application_id: z.string(),
	guild_id: z.string(),
	with_localizations: z.boolean().optional(),
});
export type CommandsListGuildInput = z.infer<typeof CommandsListGuildInputSchema>;

export const CommandsUpdateGuildInputSchema = z.object({
	application_id: z.string(),
	guild_id: z.string(),
	command_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	options: z.array(z.any()).optional(),
	default_member_permissions: z.string().nullable().optional(),
	nsfw: z.boolean().optional(),
});
export type CommandsUpdateGuildInput = z.infer<typeof CommandsUpdateGuildInputSchema>;

export const CommandsDeleteGuildInputSchema = z.object({
	application_id: z.string(),
	guild_id: z.string(),
	command_id: z.string(),
});
export type CommandsDeleteGuildInput = z.infer<typeof CommandsDeleteGuildInputSchema>;

// Guild Moderation Input Schemas
export const GuildsBanAddInputSchema = z.object({
	guild_id: z.string(),
	user_id: z.string(),
	delete_message_seconds: z.number().optional(),
});
export type GuildsBanAddInput = z.infer<typeof GuildsBanAddInputSchema>;

export const GuildsBanRemoveInputSchema = z.object({
	guild_id: z.string(),
	user_id: z.string(),
});
export type GuildsBanRemoveInput = z.infer<typeof GuildsBanRemoveInputSchema>;

export const GuildsBansListInputSchema = z.object({
	guild_id: z.string(),
	limit: z.number().optional(),
	before: z.string().optional(),
	after: z.string().optional(),
});
export type GuildsBansListInput = z.infer<typeof GuildsBansListInputSchema>;

export const GuildsBanGetInputSchema = z.object({
	guild_id: z.string(),
	user_id: z.string(),
});
export type GuildsBanGetInput = z.infer<typeof GuildsBanGetInputSchema>;

// ── Shared response schemas ────────────────────────────────────────────────────

export const BulkDeleteMessagesInputSchema = z.object({
  channel_id: z.string(),
  messages: z.array(z.string())
});
export type BulkDeleteMessagesInput = z.infer<typeof BulkDeleteMessagesInputSchema>;

export const SuccessResponseSchema = z.object({ success: z.literal(true) });
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

// ── Endpoint Input/Output Schema Maps ─────────────────────────────────────────

export const DiscordEndpointInputSchemas = {
  bulkDeleteMessages: BulkDeleteMessagesInputSchema,
  followChannel: FollowChannelInputSchema,
  addGuildMember: AddGuildMemberInputSchema,
  addMyMessageReaction: AddMyMessageReactionInputSchema,
  addGroupDmUser: AddGroupDmUserInputSchema,
  addThreadMember: AddThreadMemberInputSchema,
  addGuildMemberRole: AddGuildMemberRoleInputSchema,
  banUserFromGuild: BanUserFromGuildInputSchema,
  bulkBanUsersFromGuild: BulkBanUsersFromGuildInputSchema,
  createChannelInvite: CreateChannelInviteInputSchema,
  createStageInstance: CreateStageInstanceInputSchema,
  createApplicationCommand: CreateApplicationCommandInputSchema,
  createWebhook: CreateWebhookInputSchema,
  createGuildApplicationCommand: CreateGuildApplicationCommandInputSchema,
  createAutoModerationRule: CreateAutoModerationRuleInputSchema,
  createGuildChannel: CreateGuildChannelInputSchema,
  createGuildEmoji: CreateGuildEmojiInputSchema,
  createGuildScheduledEvent: CreateGuildScheduledEventInputSchema,
  createGuildSticker: CreateGuildStickerInputSchema,
  createGuildTemplate: CreateGuildTemplateInputSchema,
  createGuild: CreateGuildInputSchema,
  createThread: CreateThreadInputSchema,
  createGuildRole: CreateGuildRoleInputSchema,
  createThreadFromMessage: CreateThreadFromMessageInputSchema,
  crosspostMessage: CrosspostMessageInputSchema,
  deleteAllMessageReactions: DeleteAllMessageReactionsInputSchema,
  deleteApplicationCommand: DeleteApplicationCommandInputSchema,
  deleteChannel: DeleteChannelInputSchema,
  deleteMessage: DeleteMessageInputSchema,
  deleteAllMessageReactionsByEmoji: DeleteAllMessageReactionsByEmojiInputSchema,
  deleteChannelPermissionOverwrite: DeleteChannelPermissionOverwriteInputSchema,
  deleteThreadMember: DeleteThreadMemberInputSchema,
  deleteAutoModerationRule: DeleteAutoModerationRuleInputSchema,
  deleteGuild: DeleteGuildInputSchema,
  deleteGuildApplicationCommand: DeleteGuildApplicationCommandInputSchema,
  deleteGuildEmoji: DeleteGuildEmojiInputSchema,
  deleteGuildIntegration: DeleteGuildIntegrationInputSchema,
  deleteGuildMember: DeleteGuildMemberInputSchema,
  deleteGuildMemberRole: DeleteGuildMemberRoleInputSchema,
  deleteGuildScheduledEvent: DeleteGuildScheduledEventInputSchema,
  deleteGuildSticker: DeleteGuildStickerInputSchema,
  deleteGuildTemplate: DeleteGuildTemplateInputSchema,
  inviteRevoke: InviteRevokeInputSchema,
  deleteOriginalWebhookMessage: DeleteOriginalWebhookMessageInputSchema,
  deleteGuildRole: DeleteGuildRoleInputSchema,
  deleteStageInstance: DeleteStageInstanceInputSchema,
  deleteUserMessageReaction: DeleteUserMessageReactionInputSchema,
  deleteMyMessageReaction: DeleteMyMessageReactionInputSchema,
  deleteWebhook: DeleteWebhookInputSchema,
  deleteWebhookMessage: DeleteWebhookMessageInputSchema,
  deleteWebhookByToken: DeleteWebhookByTokenInputSchema,
  getApplicationCommand: GetApplicationCommandInputSchema,
  getGuildEmoji: GetGuildEmojiInputSchema,
  getGuildApplicationCommand: GetGuildApplicationCommandInputSchema,
  listGuildApplicationCommands: ListGuildApplicationCommandsInputSchema,
  listMessages: ListMessagesInputSchema,
  listVoiceRegions: ListVoiceRegionsInputSchema,
  listGuildApplicationCommandPermissions: ListGuildApplicationCommandPermissionsInputSchema,
  listPrivateArchivedThreads: ListPrivateArchivedThreadsInputSchema,
  listPublicArchivedThreads: ListPublicArchivedThreadsInputSchema,
  listMessageReactionsByEmoji: ListMessageReactionsByEmojiInputSchema,
  getGateway: GetGatewayInputSchema,
  listGuildAuditLogEntries: ListGuildAuditLogEntriesInputSchema,
  listGuildMembers: ListGuildMembersInputSchema,
  getGuildsOnboarding: GetGuildsOnboardingInputSchema,
  getGuildScheduledEvent: GetGuildScheduledEventInputSchema,
  listGuildTemplates: ListGuildTemplatesInputSchema,
  getGuildWidgetPng: GetGuildWidgetPngInputSchema,
  getMyOauth2Application: GetMyOauth2ApplicationInputSchema,
  getPublicKeys: GetPublicKeysInputSchema,
  listMyPrivateArchivedThreads: ListMyPrivateArchivedThreadsInputSchema,
  getApplicationUserRoleConnection: GetApplicationUserRoleConnectionInputSchema,
  getMyApplication: GetMyApplicationInputSchema,
  executeGithubCompatibleWebhook: ExecuteGithubCompatibleWebhookInputSchema,
  createDm: CreateDmInputSchema,
  joinThread: JoinThreadInputSchema,
  leaveGuild: LeaveGuildInputSchema,
  listChannelInvites: ListChannelInvitesInputSchema,
  getActiveGuildThreads: GetActiveGuildThreadsInputSchema,
  listApplicationCommands: ListApplicationCommandsInputSchema,
  listGuildBans: ListGuildBansInputSchema,
  listGuildIntegrations: ListGuildIntegrationsInputSchema,
  listGuildVoiceRegions: ListGuildVoiceRegionsInputSchema,
  listGuildRoles: ListGuildRolesInputSchema,
  listStickerPacks: ListStickerPacksInputSchema,
  listThreadMembers: ListThreadMembersInputSchema,
  updateApplication: UpdateApplicationInputSchema,
  setChannelPermissionOverwrite: SetChannelPermissionOverwriteInputSchema,
  updateAutoModerationRule: UpdateAutoModerationRuleInputSchema,
  updateGuildMember: UpdateGuildMemberInputSchema,
  updateGuildRole: UpdateGuildRoleInputSchema,
  updateSelfVoiceState: UpdateSelfVoiceStateInputSchema,
  updateApplicationCommand: UpdateApplicationCommandInputSchema,
  updateGuildTemplate: UpdateGuildTemplateInputSchema,
  updateVoiceState: UpdateVoiceStateInputSchema,
  updateOriginalWebhookMessage: UpdateOriginalWebhookMessageInputSchema,
  pinMessage: PinMessageInputSchema,
  createGuildFromTemplate: CreateGuildFromTemplateInputSchema,
  createInteractionResponse: CreateInteractionResponseInputSchema,
  createMessage: CreateMessageInputSchema,
  executeSlackCompatibleWebhook: ExecuteSlackCompatibleWebhookInputSchema,
  executeWebhook: ExecuteWebhookInputSchema,
  getGuildPreview: GetGuildPreviewInputSchema,
  pruneGuild: PruneGuildInputSchema,
  leaveThread: LeaveThreadInputSchema,
  unbanUserFromGuild: UnbanUserFromGuildInputSchema,
  deleteGroupDmUser: DeleteGroupDmUserInputSchema,
  getApplication: GetApplicationInputSchema,
  getApplicationRoleConnectionsMetadata: GetApplicationRoleConnectionsMetadataInputSchema,
  getAutoModerationRule: GetAutoModerationRuleInputSchema,
  getBotGateway: GetBotGatewayInputSchema,
  getChannel: GetChannelInputSchema,
  listChannelWebhooks: ListChannelWebhooksInputSchema,
  listAutoModerationRules: ListAutoModerationRulesInputSchema,
  listGuildChannels: ListGuildChannelsInputSchema,
  getGuildApplicationCommandPermissions: GetGuildApplicationCommandPermissionsInputSchema,
  getGuild: GetGuildInputSchema,
  listGuildEmojis: ListGuildEmojisInputSchema,
  listGuildInvites: ListGuildInvitesInputSchema,
  getGuildMember: GetGuildMemberInputSchema,
  previewPruneGuild: PreviewPruneGuildInputSchema,
  listGuildScheduledEvents: ListGuildScheduledEventsInputSchema,
  listGuildStickers: ListGuildStickersInputSchema,
  getGuildTemplate: GetGuildTemplateInputSchema,
  getGuildBan: GetGuildBanInputSchema,
  getGuildVanityUrl: GetGuildVanityUrlInputSchema,
  getGuildWebhooks: GetGuildWebhooksInputSchema,
  getGuildWelcomeScreen: GetGuildWelcomeScreenInputSchema,
  getGuildWidgetSettings: GetGuildWidgetSettingsInputSchema,
  getGuildWidget: GetGuildWidgetInputSchema,
  inviteResolve: InviteResolveInputSchema,
  getMessage: GetMessageInputSchema,
  getOriginalWebhookMessage: GetOriginalWebhookMessageInputSchema,
  listPinnedMessages: ListPinnedMessagesInputSchema,
  getStageInstance: GetStageInstanceInputSchema,
  getSticker: GetStickerInputSchema,
  getGuildSticker: GetGuildStickerInputSchema,
  getThreadMember: GetThreadMemberInputSchema,
  getUser: GetUserInputSchema,
  listGuildScheduledEventUsers: ListGuildScheduledEventUsersInputSchema,
  getWebhook: GetWebhookInputSchema,
  getWebhookByToken: GetWebhookByTokenInputSchema,
  getWebhookMessage: GetWebhookMessageInputSchema,
  searchGuildMembers: SearchGuildMembersInputSchema,
  testAuth: TestAuthInputSchema,
  triggerTypingIndicator: TriggerTypingIndicatorInputSchema,
  unpinMessage: UnpinMessageInputSchema,
  updateGuildWidgetSettings: UpdateGuildWidgetSettingsInputSchema,
  updateMyApplication: UpdateMyApplicationInputSchema,
  updateGuildApplicationCommand: UpdateGuildApplicationCommandInputSchema,
  updateMyGuildMember: UpdateMyGuildMemberInputSchema,
  updateMessage: UpdateMessageInputSchema,
  updateChannel: UpdateChannelInputSchema,
  updateMyUser: UpdateMyUserInputSchema,
  updateWebhookMessage: UpdateWebhookMessageInputSchema,
  updateGuildEmoji: UpdateGuildEmojiInputSchema,
  putGuildsOnboarding: PutGuildsOnboardingInputSchema,
  updateGuildScheduledEvent: UpdateGuildScheduledEventInputSchema,
  updateGuild: UpdateGuildInputSchema,
  updateGuildSticker: UpdateGuildStickerInputSchema,
  syncGuildTemplate: SyncGuildTemplateInputSchema,
  updateGuildWelcomeScreen: UpdateGuildWelcomeScreenInputSchema,
  updateApplicationUserRoleConnection: UpdateApplicationUserRoleConnectionInputSchema,
  updateWebhook: UpdateWebhookInputSchema,
  updateWebhookByToken: UpdateWebhookByTokenInputSchema,

	messagesSend: MessagesSendInputSchema,
	messagesReply: MessagesReplyInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesList: MessagesListInputSchema,
	messagesEdit: MessagesEditInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	threadsCreate: ThreadsCreateInputSchema,
	threadsCreateFromMessage: ThreadsCreateFromMessageInputSchema,
	reactionsAdd: ReactionsAddInputSchema,
	reactionsRemove: ReactionsRemoveInputSchema,
	reactionsList: ReactionsListInputSchema,
	guildsList: GuildsListInputSchema,
	guildsGet: GuildsGetInputSchema,
	channelsList: ChannelsListInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
	commandsCreateGlobal: CommandsCreateGlobalInputSchema,
	commandsGetGlobal: CommandsGetGlobalInputSchema,
	commandsListGlobal: CommandsListGlobalInputSchema,
	commandsUpdateGlobal: CommandsUpdateGlobalInputSchema,
	commandsDeleteGlobal: CommandsDeleteGlobalInputSchema,
	commandsCreateGuild: CommandsCreateGuildInputSchema,
	commandsGetGuild: CommandsGetGuildInputSchema,
	commandsListGuild: CommandsListGuildInputSchema,
	commandsUpdateGuild: CommandsUpdateGuildInputSchema,
	commandsDeleteGuild: CommandsDeleteGuildInputSchema,
	guildsBanAdd: GuildsBanAddInputSchema,
	guildsBanRemove: GuildsBanRemoveInputSchema,
	guildsBansList: GuildsBansListInputSchema,
	guildsBanGet: GuildsBanGetInputSchema,
} as const;

export type DiscordEndpointInputs = {
	[K in keyof typeof DiscordEndpointInputSchemas]: z.infer<
		(typeof DiscordEndpointInputSchemas)[K]
	>;
};

export const DiscordEndpointOutputSchemas = {
  bulkDeleteMessages: z.any(),
  followChannel: z.any(),
  addGuildMember: z.any(),
  addMyMessageReaction: z.any(),
  addGroupDmUser: z.any(),
  addThreadMember: z.any(),
  addGuildMemberRole: z.any(),
  banUserFromGuild: z.any(),
  bulkBanUsersFromGuild: z.any(),
  createChannelInvite: z.any(),
  createStageInstance: z.any(),
  createApplicationCommand: z.any(),
  createWebhook: z.any(),
  createGuildApplicationCommand: z.any(),
  createAutoModerationRule: z.any(),
  createGuildChannel: z.any(),
  createGuildEmoji: z.any(),
  createGuildScheduledEvent: z.any(),
  createGuildSticker: z.any(),
  createGuildTemplate: z.any(),
  createGuild: z.any(),
  createThread: z.any(),
  createGuildRole: z.any(),
  createThreadFromMessage: z.any(),
  crosspostMessage: z.any(),
  deleteAllMessageReactions: z.any(),
  deleteApplicationCommand: z.any(),
  deleteChannel: z.any(),
  deleteMessage: z.any(),
  deleteAllMessageReactionsByEmoji: z.any(),
  deleteChannelPermissionOverwrite: z.any(),
  deleteThreadMember: z.any(),
  deleteAutoModerationRule: z.any(),
  deleteGuild: z.any(),
  deleteGuildApplicationCommand: z.any(),
  deleteGuildEmoji: z.any(),
  deleteGuildIntegration: z.any(),
  deleteGuildMember: z.any(),
  deleteGuildMemberRole: z.any(),
  deleteGuildScheduledEvent: z.any(),
  deleteGuildSticker: z.any(),
  deleteGuildTemplate: z.any(),
  inviteRevoke: z.any(),
  deleteOriginalWebhookMessage: z.any(),
  deleteGuildRole: z.any(),
  deleteStageInstance: z.any(),
  deleteUserMessageReaction: z.any(),
  deleteMyMessageReaction: z.any(),
  deleteWebhook: z.any(),
  deleteWebhookMessage: z.any(),
  deleteWebhookByToken: z.any(),
  getApplicationCommand: z.any(),
  getGuildEmoji: z.any(),
  getGuildApplicationCommand: z.any(),
  listGuildApplicationCommands: z.any(),
  listMessages: z.any(),
  listVoiceRegions: z.any(),
  listGuildApplicationCommandPermissions: z.any(),
  listPrivateArchivedThreads: z.any(),
  listPublicArchivedThreads: z.any(),
  listMessageReactionsByEmoji: z.any(),
  getGateway: z.any(),
  listGuildAuditLogEntries: z.any(),
  listGuildMembers: z.any(),
  getGuildsOnboarding: z.any(),
  getGuildScheduledEvent: z.any(),
  listGuildTemplates: z.any(),
  getGuildWidgetPng: z.any(),
  getMyOauth2Application: z.any(),
  getPublicKeys: z.any(),
  listMyPrivateArchivedThreads: z.any(),
  getApplicationUserRoleConnection: z.any(),
  getMyApplication: z.any(),
  executeGithubCompatibleWebhook: z.any(),
  createDm: z.any(),
  joinThread: z.any(),
  leaveGuild: z.any(),
  listChannelInvites: z.any(),
  getActiveGuildThreads: z.any(),
  listApplicationCommands: z.any(),
  listGuildBans: z.any(),
  listGuildIntegrations: z.any(),
  listGuildVoiceRegions: z.any(),
  listGuildRoles: z.any(),
  listStickerPacks: z.any(),
  listThreadMembers: z.any(),
  updateApplication: z.any(),
  setChannelPermissionOverwrite: z.any(),
  updateAutoModerationRule: z.any(),
  updateGuildMember: z.any(),
  updateGuildRole: z.any(),
  updateSelfVoiceState: z.any(),
  updateApplicationCommand: z.any(),
  updateGuildTemplate: z.any(),
  updateVoiceState: z.any(),
  updateOriginalWebhookMessage: z.any(),
  pinMessage: z.any(),
  createGuildFromTemplate: z.any(),
  createInteractionResponse: z.any(),
  createMessage: z.any(),
  executeSlackCompatibleWebhook: z.any(),
  executeWebhook: z.any(),
  getGuildPreview: z.any(),
  pruneGuild: z.any(),
  leaveThread: z.any(),
  unbanUserFromGuild: z.any(),
  deleteGroupDmUser: z.any(),
  getApplication: z.any(),
  getApplicationRoleConnectionsMetadata: z.any(),
  getAutoModerationRule: z.any(),
  getBotGateway: z.any(),
  getChannel: z.any(),
  listChannelWebhooks: z.any(),
  listAutoModerationRules: z.any(),
  listGuildChannels: z.any(),
  getGuildApplicationCommandPermissions: z.any(),
  getGuild: z.any(),
  listGuildEmojis: z.any(),
  listGuildInvites: z.any(),
  getGuildMember: z.any(),
  previewPruneGuild: z.any(),
  listGuildScheduledEvents: z.any(),
  listGuildStickers: z.any(),
  getGuildTemplate: z.any(),
  getGuildBan: z.any(),
  getGuildVanityUrl: z.any(),
  getGuildWebhooks: z.any(),
  getGuildWelcomeScreen: z.any(),
  getGuildWidgetSettings: z.any(),
  getGuildWidget: z.any(),
  inviteResolve: z.any(),
  getMessage: z.any(),
  getOriginalWebhookMessage: z.any(),
  listPinnedMessages: z.any(),
  getStageInstance: z.any(),
  getSticker: z.any(),
  getGuildSticker: z.any(),
  getThreadMember: z.any(),
  getUser: z.any(),
  listGuildScheduledEventUsers: z.any(),
  getWebhook: z.any(),
  getWebhookByToken: z.any(),
  getWebhookMessage: z.any(),
  searchGuildMembers: z.any(),
  testAuth: z.any(),
  triggerTypingIndicator: z.any(),
  unpinMessage: z.any(),
  updateGuildWidgetSettings: z.any(),
  updateMyApplication: z.any(),
  updateGuildApplicationCommand: z.any(),
  updateMyGuildMember: z.any(),
  updateMessage: z.any(),
  updateChannel: z.any(),
  updateMyUser: z.any(),
  updateWebhookMessage: z.any(),
  updateGuildEmoji: z.any(),
  putGuildsOnboarding: z.any(),
  updateGuildScheduledEvent: z.any(),
  updateGuild: z.any(),
  updateGuildSticker: z.any(),
  syncGuildTemplate: z.any(),
  updateGuildWelcomeScreen: z.any(),
  updateApplicationUserRoleConnection: z.any(),
  updateWebhook: z.any(),
  updateWebhookByToken: z.any(),

	messagesSend: MessageSchema,
	messagesReply: MessageSchema,
	messagesGet: MessageSchema,
	messagesList: z.array(MessageSchema),
	messagesEdit: MessageSchema,
	messagesDelete: SuccessResponseSchema,
	threadsCreate: ChannelSchema,
	threadsCreateFromMessage: ChannelSchema,
	reactionsAdd: SuccessResponseSchema,
	reactionsRemove: SuccessResponseSchema,
	reactionsList: z.array(DiscordUserSchema),
	guildsList: z.array(PartialGuildSchema),
	guildsGet: GuildSchema,
	channelsList: z.array(ChannelSchema),
	membersList: z.array(GuildMemberSchema),
	membersGet: GuildMemberSchema,
	commandsCreateGlobal: ApplicationCommandSchema,
	commandsGetGlobal: ApplicationCommandSchema,
	commandsListGlobal: z.array(ApplicationCommandSchema),
	commandsUpdateGlobal: ApplicationCommandSchema,
	commandsDeleteGlobal: SuccessResponseSchema,
	commandsCreateGuild: ApplicationCommandSchema,
	commandsGetGuild: ApplicationCommandSchema,
	commandsListGuild: z.array(ApplicationCommandSchema),
	commandsUpdateGuild: ApplicationCommandSchema,
	commandsDeleteGuild: SuccessResponseSchema,
	guildsBanAdd: SuccessResponseSchema,
	guildsBanRemove: SuccessResponseSchema,
		guildsBansList: z.array(BanSchema),
	guildsBanGet: BanSchema,
} as const;

export type DiscordEndpointOutputs = {
	[K in keyof typeof DiscordEndpointOutputSchemas]: z.infer<
		(typeof DiscordEndpointOutputSchemas)[K]
	>;
};
