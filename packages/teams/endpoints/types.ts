import { z } from 'zod';

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

const TeamsMemberSettingsSchema = z
	.object({
		allowCreateUpdateChannels: z.boolean().optional(),
		allowDeleteChannels: z.boolean().optional(),
		allowAddRemoveApps: z.boolean().optional(),
		allowCreateUpdateRemoveTabs: z.boolean().optional(),
		allowCreateUpdateRemoveConnectors: z.boolean().optional(),
	})
	.passthrough();

const TeamsGuestSettingsSchema = z
	.object({
		allowCreateUpdateChannels: z.boolean().optional(),
		allowDeleteChannels: z.boolean().optional(),
	})
	.passthrough();

const TeamsMessagingSettingsSchema = z
	.object({
		allowUserEditMessages: z.boolean().optional(),
		allowUserDeleteMessages: z.boolean().optional(),
		allowOwnerDeleteMessages: z.boolean().optional(),
		allowTeamMentions: z.boolean().optional(),
		allowChannelMentions: z.boolean().optional(),
	})
	.passthrough();

const TeamsFunSettingsSchema = z
	.object({
		allowGiphy: z.boolean().optional(),
		giphyContentRating: z.string().optional(),
		allowStickersAndMemes: z.boolean().optional(),
		allowCustomMemes: z.boolean().optional(),
	})
	.passthrough();

const TeamsTeamObjectSchema = z
	.object({
		id: z.string(),
		displayName: z.string().optional(),
		description: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		classification: z.string().nullable().optional(),
		specialization: z.string().nullable().optional(),
		visibility: z.string().nullable().optional(),
		webUrl: z.string().nullable().optional(),
		isArchived: z.boolean().nullable().optional(),
		memberSettings: TeamsMemberSettingsSchema.nullable().optional(),
		guestSettings: TeamsGuestSettingsSchema.nullable().optional(),
		messagingSettings: TeamsMessagingSettingsSchema.nullable().optional(),
		funSettings: TeamsFunSettingsSchema.nullable().optional(),
	})
	.passthrough();

const TeamsChannelObjectSchema = z
	.object({
		id: z.string(),
		displayName: z.string().optional(),
		description: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		webUrl: z.string().nullable().optional(),
		membershipType: z.string().nullable().optional(),
		isFavoriteByDefault: z.boolean().nullable().optional(),
		createdDateTime: z.string().nullable().optional(),
	})
	.passthrough();

const TeamsMessageBodySchema = z
	.object({
		contentType: z.enum(['text', 'html']).optional(),
		content: z.string().optional(),
	})
	.passthrough();

const TeamsMessageFromSchema = z
	.object({
		// Application identity fields are dynamic and vary per Graph API version/context
		application: z.record(z.unknown()).nullable().optional(),
		// Device identity fields are dynamic and vary per Graph API version/context
		device: z.record(z.unknown()).nullable().optional(),
		user: z
			.object({
				id: z.string().optional(),
				displayName: z.string().nullable().optional(),
				userIdentityType: z.string().optional(),
			})
			.nullable()
			.optional(),
	})
	.passthrough();

const TeamsMessageObjectSchema = z
	.object({
		id: z.string(),
		replyToId: z.string().nullable().optional(),
		etag: z.string().optional(),
		messageType: z.string().optional(),
		createdDateTime: z.string().optional(),
		lastModifiedDateTime: z.string().optional(),
		deletedDateTime: z.string().nullable().optional(),
		subject: z.string().nullable().optional(),
		summary: z.string().nullable().optional(),
		chatId: z.string().nullable().optional(),
		importance: z.string().optional(),
		locale: z.string().optional(),
		webUrl: z.string().nullable().optional(),
		from: TeamsMessageFromSchema.nullable().optional(),
		body: TeamsMessageBodySchema.optional(),
		channelIdentity: z
			.object({
				teamId: z.string().optional(),
				channelId: z.string().optional(),
			})
			.nullable()
			.optional(),
		// Attachment shape varies by attachment type (file, image, card, etc.)
		attachments: z.array(z.record(z.unknown())).optional(),
		// Mention shape varies depending on whether user, team, tag, or channel is mentioned
		mentions: z.array(z.record(z.unknown())).optional(),
		// Reaction shape varies by emoji/reaction type
		reactions: z.array(z.record(z.unknown())).optional(),
	})
	.passthrough();

const TeamsMemberObjectSchema = z
	.object({
		id: z.string(),
		displayName: z.string().nullable().optional(),
		userId: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		tenantId: z.string().nullable().optional(),
		roles: z.array(z.string()).optional(),
		visibleHistoryStartDateTime: z.string().nullable().optional(),
	})
	.passthrough();

const TeamsChatObjectSchema = z
	.object({
		id: z.string(),
		topic: z.string().nullable().optional(),
		createdDateTime: z.string().optional(),
		lastUpdatedDateTime: z.string().optional(),
		chatType: z.string().optional(),
		webUrl: z.string().optional(),
		tenantId: z.string().optional(),
	})
	.passthrough();

// ── Team Input Schemas ────────────────────────────────────────────────────────

const TeamsListInputSchema = z
	.object({
		filter: z.string().optional(),
		select: z.string().optional(),
		top: z.number().optional(),
		skipToken: z.string().optional(),
	})
	.passthrough();

const TeamsGetInputSchema = z
	.object({
		teamId: z.string(),
	})
	.passthrough();

const TeamsCreateInputSchema = z
	.object({
		displayName: z.string(),
		description: z.string().optional(),
		visibility: z.enum(['public', 'private']).optional(),
		memberSettings: TeamsMemberSettingsSchema.optional(),
		guestSettings: TeamsGuestSettingsSchema.optional(),
		messagingSettings: TeamsMessagingSettingsSchema.optional(),
		funSettings: TeamsFunSettingsSchema.optional(),
	})
	.passthrough();

const TeamsUpdateInputSchema = z
	.object({
		teamId: z.string(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		visibility: z.string().optional(),
		memberSettings: TeamsMemberSettingsSchema.optional(),
		guestSettings: TeamsGuestSettingsSchema.optional(),
		messagingSettings: TeamsMessagingSettingsSchema.optional(),
		funSettings: TeamsFunSettingsSchema.optional(),
	})
	.passthrough();

const TeamsDeleteInputSchema = z
	.object({
		teamId: z.string(),
	})
	.passthrough();

// ── Channel Input Schemas ─────────────────────────────────────────────────────

const ChannelsListInputSchema = z
	.object({
		teamId: z.string(),
		filter: z.string().optional(),
	})
	.passthrough();

const ChannelsGetInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
	})
	.passthrough();

const ChannelsCreateInputSchema = z
	.object({
		teamId: z.string(),
		displayName: z.string(),
		description: z.string().optional(),
		membershipType: z.enum(['standard', 'private', 'shared']).optional(),
		isFavoriteByDefault: z.boolean().optional(),
	})
	.passthrough();

const ChannelsUpdateInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		isFavoriteByDefault: z.boolean().optional(),
	})
	.passthrough();

const ChannelsDeleteInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
	})
	.passthrough();

// ── Message Input Schemas ─────────────────────────────────────────────────────

const MessagesListInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
		top: z.number().optional(),
		skipToken: z.string().optional(),
	})
	.passthrough();

const MessagesGetInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
		messageId: z.string(),
	})
	.passthrough();

const MessagesSendInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
		body: z
			.object({
				content: z.string(),
				contentType: z.enum(['text', 'html']).optional(),
			})
			.passthrough(),
		subject: z.string().optional(),
		importance: z.enum(['normal', 'high', 'urgent']).optional(),
	})
	.passthrough();

const MessagesReplyInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
		messageId: z.string(),
		body: z
			.object({
				content: z.string(),
				contentType: z.enum(['text', 'html']).optional(),
			})
			.passthrough(),
		importance: z.enum(['normal', 'high', 'urgent']).optional(),
	})
	.passthrough();

const MessagesListRepliesInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
		messageId: z.string(),
		top: z.number().optional(),
	})
	.passthrough();

const MessagesDeleteInputSchema = z
	.object({
		teamId: z.string(),
		channelId: z.string(),
		messageId: z.string(),
	})
	.passthrough();

// ── Member Input Schemas ──────────────────────────────────────────────────────

const MembersListInputSchema = z
	.object({
		teamId: z.string(),
		filter: z.string().optional(),
	})
	.passthrough();

const MembersGetInputSchema = z
	.object({
		teamId: z.string(),
		membershipId: z.string(),
	})
	.passthrough();

const MembersAddInputSchema = z
	.object({
		teamId: z.string(),
		userId: z.string(),
		roles: z.array(z.enum(['owner', 'member'])).optional(),
	})
	.passthrough();

const MembersRemoveInputSchema = z
	.object({
		teamId: z.string(),
		membershipId: z.string(),
	})
	.passthrough();

// ── Chat Input Schemas ────────────────────────────────────────────────────────

const ChatsListInputSchema = z
	.object({
		filter: z.string().optional(),
		top: z.number().optional(),
	})
	.passthrough();

const ChatsGetInputSchema = z
	.object({
		chatId: z.string(),
	})
	.passthrough();

const ChatsCreateInputSchema = z
	.object({
		chatType: z.enum(['oneOnOne', 'group']),
		topic: z.string().optional(),
		members: z.array(
			z
				.object({
					userId: z.string(),
					roles: z.array(z.string()).optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

const ChatsListMessagesInputSchema = z
	.object({
		chatId: z.string(),
		top: z.number().optional(),
		skipToken: z.string().optional(),
	})
	.passthrough();

const ChatsSendMessageInputSchema = z
	.object({
		chatId: z.string(),
		body: z
			.object({
				content: z.string(),
				contentType: z.enum(['text', 'html']).optional(),
			})
			.passthrough(),
		importance: z.enum(['normal', 'high', 'urgent']).optional(),
	})
	.passthrough();

// ── Team Response Schemas ─────────────────────────────────────────────────────

const TeamsListResponseSchema = z
	.object({
		'@odata.context': z.string().optional(),
		'@odata.count': z.number().optional(),
		'@odata.nextLink': z.string().optional(),
		value: z.array(TeamsTeamObjectSchema),
	})
	.passthrough();

const TeamsGetResponseSchema = TeamsTeamObjectSchema;

// Team creation via template is async (202 Accepted, no body)
const TeamsCreateResponseSchema = z
	.object({
		id: z.string().optional(),
		displayName: z.string().optional(),
		description: z.string().nullable().optional(),
	})
	.passthrough()
	.optional();

const TeamsUpdateResponseSchema = z.object({}).passthrough();

const TeamsDeleteResponseSchema = z.object({}).passthrough();

// ── Channel Response Schemas ──────────────────────────────────────────────────

const ChannelsListResponseSchema = z
	.object({
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
		value: z.array(TeamsChannelObjectSchema),
	})
	.passthrough();

const ChannelsGetResponseSchema = TeamsChannelObjectSchema;

const ChannelsCreateResponseSchema = TeamsChannelObjectSchema;

const ChannelsUpdateResponseSchema = z.object({}).passthrough();

const ChannelsDeleteResponseSchema = z.object({}).passthrough();

// ── Message Response Schemas ──────────────────────────────────────────────────

const MessagesListResponseSchema = z
	.object({
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
		value: z.array(TeamsMessageObjectSchema),
	})
	.passthrough();

const MessagesGetResponseSchema = TeamsMessageObjectSchema;

const MessagesSendResponseSchema = TeamsMessageObjectSchema;

const MessagesReplyResponseSchema = TeamsMessageObjectSchema;

const MessagesListRepliesResponseSchema = z
	.object({
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
		value: z.array(TeamsMessageObjectSchema),
	})
	.passthrough();

const MessagesDeleteResponseSchema = z.object({}).passthrough();

// ── Member Response Schemas ───────────────────────────────────────────────────

const MembersListResponseSchema = z
	.object({
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
		value: z.array(TeamsMemberObjectSchema),
	})
	.passthrough();

const MembersGetResponseSchema = TeamsMemberObjectSchema;

const MembersAddResponseSchema = TeamsMemberObjectSchema;

const MembersRemoveResponseSchema = z.object({}).passthrough();

// ── Chat Response Schemas ─────────────────────────────────────────────────────

const ChatsListResponseSchema = z
	.object({
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
		value: z.array(TeamsChatObjectSchema),
	})
	.passthrough();

const ChatsGetResponseSchema = TeamsChatObjectSchema;

const ChatsCreateResponseSchema = TeamsChatObjectSchema;

const ChatsListMessagesResponseSchema = z
	.object({
		'@odata.context': z.string().optional(),
		'@odata.nextLink': z.string().optional(),
		value: z.array(TeamsMessageObjectSchema),
	})
	.passthrough();

const ChatsSendMessageResponseSchema = TeamsMessageObjectSchema;

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type TeamsEndpointInputs = {
	teamsList: TeamsListInput;
	teamsGet: TeamsGetInput;
	teamsCreate: TeamsCreateInput;
	teamsUpdate: TeamsUpdateInput;
	teamsDelete: TeamsDeleteInput;
	channelsList: ChannelsListInput;
	channelsGet: ChannelsGetInput;
	channelsCreate: ChannelsCreateInput;
	channelsUpdate: ChannelsUpdateInput;
	channelsDelete: ChannelsDeleteInput;
	messagesList: MessagesListInput;
	messagesGet: MessagesGetInput;
	messagesSend: MessagesSendInput;
	messagesReply: MessagesReplyInput;
	messagesListReplies: MessagesListRepliesInput;
	messagesDelete: MessagesDeleteInput;
	membersList: MembersListInput;
	membersGet: MembersGetInput;
	membersAdd: MembersAddInput;
	membersRemove: MembersRemoveInput;
	chatsList: ChatsListInput;
	chatsGet: ChatsGetInput;
	chatsCreate: ChatsCreateInput;
	chatsListMessages: ChatsListMessagesInput;
	chatsSendMessage: ChatsSendMessageInput;
};

export type TeamsEndpointOutputs = {
	teamsList: TeamsListResponse;
	teamsGet: TeamsGetResponse;
	teamsCreate: TeamsCreateResponse;
	teamsUpdate: TeamsUpdateResponse;
	teamsDelete: TeamsDeleteResponse;
	channelsList: ChannelsListResponse;
	channelsGet: ChannelsGetResponse;
	channelsCreate: ChannelsCreateResponse;
	channelsUpdate: ChannelsUpdateResponse;
	channelsDelete: ChannelsDeleteResponse;
	messagesList: MessagesListResponse;
	messagesGet: MessagesGetResponse;
	messagesSend: MessagesSendResponse;
	messagesReply: MessagesReplyResponse;
	messagesListReplies: MessagesListRepliesResponse;
	messagesDelete: MessagesDeleteResponse;
	membersList: MembersListResponse;
	membersGet: MembersGetResponse;
	membersAdd: MembersAddResponse;
	membersRemove: MembersRemoveResponse;
	chatsList: ChatsListResponse;
	chatsGet: ChatsGetResponse;
	chatsCreate: ChatsCreateResponse;
	chatsListMessages: ChatsListMessagesResponse;
	chatsSendMessage: ChatsSendMessageResponse;
};

export const TeamsEndpointInputSchemas = {
	teamsList: TeamsListInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsDelete: TeamsDeleteInputSchema,
	channelsList: ChannelsListInputSchema,
	channelsGet: ChannelsGetInputSchema,
	channelsCreate: ChannelsCreateInputSchema,
	channelsUpdate: ChannelsUpdateInputSchema,
	channelsDelete: ChannelsDeleteInputSchema,
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesReply: MessagesReplyInputSchema,
	messagesListReplies: MessagesListRepliesInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
	membersAdd: MembersAddInputSchema,
	membersRemove: MembersRemoveInputSchema,
	chatsList: ChatsListInputSchema,
	chatsGet: ChatsGetInputSchema,
	chatsCreate: ChatsCreateInputSchema,
	chatsListMessages: ChatsListMessagesInputSchema,
	chatsSendMessage: ChatsSendMessageInputSchema,
} as const;

export const TeamsEndpointOutputSchemas = {
	teamsList: TeamsListResponseSchema,
	teamsGet: TeamsGetResponseSchema,
	teamsCreate: TeamsCreateResponseSchema,
	teamsUpdate: TeamsUpdateResponseSchema,
	teamsDelete: TeamsDeleteResponseSchema,
	channelsList: ChannelsListResponseSchema,
	channelsGet: ChannelsGetResponseSchema,
	channelsCreate: ChannelsCreateResponseSchema,
	channelsUpdate: ChannelsUpdateResponseSchema,
	channelsDelete: ChannelsDeleteResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesSend: MessagesSendResponseSchema,
	messagesReply: MessagesReplyResponseSchema,
	messagesListReplies: MessagesListRepliesResponseSchema,
	messagesDelete: MessagesDeleteResponseSchema,
	membersList: MembersListResponseSchema,
	membersGet: MembersGetResponseSchema,
	membersAdd: MembersAddResponseSchema,
	membersRemove: MembersRemoveResponseSchema,
	chatsList: ChatsListResponseSchema,
	chatsGet: ChatsGetResponseSchema,
	chatsCreate: ChatsCreateResponseSchema,
	chatsListMessages: ChatsListMessagesResponseSchema,
	chatsSendMessage: ChatsSendMessageResponseSchema,
} as const;

// ── Input Type Exports ────────────────────────────────────────────────────────

export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;
export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;
export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;
export type TeamsUpdateInput = z.infer<typeof TeamsUpdateInputSchema>;
export type TeamsDeleteInput = z.infer<typeof TeamsDeleteInputSchema>;
export type ChannelsListInput = z.infer<typeof ChannelsListInputSchema>;
export type ChannelsGetInput = z.infer<typeof ChannelsGetInputSchema>;
export type ChannelsCreateInput = z.infer<typeof ChannelsCreateInputSchema>;
export type ChannelsUpdateInput = z.infer<typeof ChannelsUpdateInputSchema>;
export type ChannelsDeleteInput = z.infer<typeof ChannelsDeleteInputSchema>;
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;
export type MessagesReplyInput = z.infer<typeof MessagesReplyInputSchema>;
export type MessagesListRepliesInput = z.infer<
	typeof MessagesListRepliesInputSchema
>;
export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;
export type MembersListInput = z.infer<typeof MembersListInputSchema>;
export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;
export type MembersAddInput = z.infer<typeof MembersAddInputSchema>;
export type MembersRemoveInput = z.infer<typeof MembersRemoveInputSchema>;
export type ChatsListInput = z.infer<typeof ChatsListInputSchema>;
export type ChatsGetInput = z.infer<typeof ChatsGetInputSchema>;
export type ChatsCreateInput = z.infer<typeof ChatsCreateInputSchema>;
export type ChatsListMessagesInput = z.infer<
	typeof ChatsListMessagesInputSchema
>;
export type ChatsSendMessageInput = z.infer<typeof ChatsSendMessageInputSchema>;

// ── Response Type Exports ─────────────────────────────────────────────────────

export type TeamsListResponse = z.infer<typeof TeamsListResponseSchema>;
export type TeamsGetResponse = z.infer<typeof TeamsGetResponseSchema>;
export type TeamsCreateResponse = z.infer<typeof TeamsCreateResponseSchema>;
export type TeamsUpdateResponse = z.infer<typeof TeamsUpdateResponseSchema>;
export type TeamsDeleteResponse = z.infer<typeof TeamsDeleteResponseSchema>;
export type ChannelsListResponse = z.infer<typeof ChannelsListResponseSchema>;
export type ChannelsGetResponse = z.infer<typeof ChannelsGetResponseSchema>;
export type ChannelsCreateResponse = z.infer<
	typeof ChannelsCreateResponseSchema
>;
export type ChannelsUpdateResponse = z.infer<
	typeof ChannelsUpdateResponseSchema
>;
export type ChannelsDeleteResponse = z.infer<
	typeof ChannelsDeleteResponseSchema
>;
export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;
export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;
export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;
export type MessagesReplyResponse = z.infer<typeof MessagesReplyResponseSchema>;
export type MessagesListRepliesResponse = z.infer<
	typeof MessagesListRepliesResponseSchema
>;
export type MessagesDeleteResponse = z.infer<
	typeof MessagesDeleteResponseSchema
>;
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;
export type MembersGetResponse = z.infer<typeof MembersGetResponseSchema>;
export type MembersAddResponse = z.infer<typeof MembersAddResponseSchema>;
export type MembersRemoveResponse = z.infer<typeof MembersRemoveResponseSchema>;
export type ChatsListResponse = z.infer<typeof ChatsListResponseSchema>;
export type ChatsGetResponse = z.infer<typeof ChatsGetResponseSchema>;
export type ChatsCreateResponse = z.infer<typeof ChatsCreateResponseSchema>;
export type ChatsListMessagesResponse = z.infer<
	typeof ChatsListMessagesResponseSchema
>;
export type ChatsSendMessageResponse = z.infer<
	typeof ChatsSendMessageResponseSchema
>;
