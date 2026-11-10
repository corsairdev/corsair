import { z } from 'zod';

/**
 * Roam pages with an opaque cursor. `limit` is documented on every list route
 * without a stated maximum, so the schema only requires a positive value.
 */
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Records per page. Roam applies its own default when omitted.');

const CursorSchema = z
	.string()
	.optional()
	.describe(
		'The `next_cursor` from the previous page, passed through unchanged.',
	);

/** `expand` names relations to inline into the response. */
const ExpandSchema = z
	.array(z.string())
	.optional()
	.describe('Relations to inline, as a comma-separated list on the wire.');

/** The `cursor`/`hasMore` pair every list answer carries. */
const pagingFields = {
	next_cursor: z
		.string()
		.nullable()
		.describe('Pass as `cursor` to read the next page; null on the last.'),
	has_more: z.boolean(),
};

// ── shared output pieces ──────────────────────────────────────────────────

/**
 * One node in a Block Kit layout. Roam renders the caller's own structure, so
 * the shape is a map of scalars with nested maps and lists for the layout's
 * children; the block types themselves are pinned by `BlockSchema`.
 */
export type BlockNode =
	| string
	| number
	| boolean
	| null
	| BlockNode[]
	| { [key: string]: BlockNode };

export const BlockNodeSchema: z.ZodType<BlockNode> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(BlockNodeSchema),
		z.record(z.string(), BlockNodeSchema),
	]),
);

/**
 * A Block Kit block. Roam supports a documented subset — header, section,
 * context, divider and actions — and each block's inner layout is the client's
 * own, so the outer type is pinned and the body is passed through.
 */
export const BlockSchema = z
	.object({
		type: z.enum(['header', 'section', 'context', 'divider', 'actions']),
		text: BlockNodeSchema.optional(),
		fields: z.array(BlockNodeSchema).optional(),
		elements: z.array(BlockNodeSchema).optional(),
		accessory: BlockNodeSchema.optional(),
		block_id: z.string().optional(),
	})
	.loose();

/** A voice note attached to a message: its length and its audio file. */
export const VoiceNoteSchema = z
	.object({
		duration: z.number().nullish(),
		url: z.string().nullish(),
		waveform: z.array(z.number()).nullish(),
	})
	.loose();

/** A poll attached to a message, with Roam's own limits. */
export const PollSchema = z.object({
	question: z.string().min(1).max(256),
	options: z
		.array(z.string().min(1).max(128))
		.min(2)
		.describe('At least two options, each up to 128 characters.'),
	allowMultipleAnswers: z.boolean().optional(),
	closesAt: z.string().optional().describe('An RFC 3339 datetime.'),
});

/** A user reference as a message, group or reaction carries it. */
export const UserRefSchema = z
	.object({
		id: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		imageUrl: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

export type RoamUserRef = z.infer<typeof UserRefSchema>;

/** The out-of-office block, present only while the user is away. */
export const WillReturnSchema = z
	.object({
		returnTime: z
			.string()
			.nullish()
			.describe('When the user is expected back, as RFC 3339.'),
		reason: z
			.string()
			.nullish()
			.describe('An absence message, up to 128 chars.'),
	})
	.loose();

const UserSchema = z
	.object({
		id: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		imageUrl: z.string().nullish(),
		email: z.string().nullish(),
		isGuest: z.boolean().nullish(),
		isAdmin: z.boolean().nullish(),
		jobTitle: z.string().nullish(),
		location: z.string().nullish(),
		status: z.string().nullish(),
		available: z.boolean().nullish(),
		botCode: z.string().nullish(),
		integrationId: z.string().nullish(),
		willReturn: WillReturnSchema.nullish(),
	})
	.loose();

export type RoamUser = z.infer<typeof UserSchema>;

// ── token.info / user.info / user.list ────────────────────────────────────

const TokenInfoInputSchema = z.object({});

export type TokenInfoInput = z.input<typeof TokenInfoInputSchema>;

const TokenInfoResponseSchema = z.object({
	token: z
		.object({
			user: UserSchema.nullish(),
			scopes: z.array(z.string()).nullish(),
			version: z.string().nullish(),
			expiresAt: z.string().nullish(),
		})
		.loose(),
});

export type TokenInfoResponse = z.infer<typeof TokenInfoResponseSchema>;

const UserInfoInputSchema = z.object({
	user_id: z.string().optional().describe('The user uuid.'),
	email: z.string().optional().describe('The user email.'),
	expand: ExpandSchema,
});

export type UserInfoInput = z.input<typeof UserInfoInputSchema>;

const UserInfoResponseSchema = z.object({ user: UserSchema });
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>;

const UserListInputSchema = z.object({
	ids: z.array(z.string()).optional().describe('Only these user uuids.'),
	q: z.string().optional().describe('A search phrase.'),
	limit: LimitSchema,
	cursor: CursorSchema,
	expand: ExpandSchema,
});

export type UserListInput = z.input<typeof UserListInputSchema>;

const UserListResponseSchema = z.object({
	users: z.array(UserSchema),
	...pagingFields,
});

export type UserListResponse = z.infer<typeof UserListResponseSchema>;

// ── chat.list / chat.history ──────────────────────────────────────────────

const ChatListInputSchema = z.object({
	limit: LimitSchema,
	cursor: CursorSchema,
	expand: ExpandSchema,
});

export type ChatListInput = z.input<typeof ChatListInputSchema>;

const ChatSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		created: z.string().nullish(),
		type: z.string().nullish(),
		isGroup: z.boolean().nullish(),
		memberIds: z.array(z.string()).nullish(),
	})
	.loose();

export type RoamChat = z.infer<typeof ChatSchema>;

const ChatListResponseSchema = z.object({
	chats: z.array(ChatSchema),
	...pagingFields,
});

export type ChatListResponse = z.infer<typeof ChatListResponseSchema>;

const ChatHistoryInputSchema = z
	.object({
		chat_id: z.string().optional().describe('The chat uuid.'),
		group_id: z.string().optional().describe('The group uuid.'),
		user_ids: z
			.array(z.string())
			.optional()
			.describe('Only messages from these users.'),
		thread_timestamp: z
			.number()
			.int()
			.optional()
			.describe('Only the replies in this thread.'),
		after: z
			.string()
			.optional()
			.describe('Only messages after this timestamp.'),
		before: z
			.string()
			.optional()
			.describe('Only messages before this timestamp.'),
		ascending: z.boolean().optional(),
		cursor: CursorSchema,
		limit: LimitSchema,
		expand: ExpandSchema,
	})
	.superRefine((value, ctx) => {
		// Roam reads the target from one of these; sending neither returns an
		// unscoped history, and sending both is ambiguous.
		if (value.chat_id === undefined && value.group_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `chat_id` or `group_id`.',
				path: ['chat_id'],
			});
		}
	});

export type ChatHistoryInput = z.input<typeof ChatHistoryInputSchema>;

const ChatItemSchema = z
	.object({
		id: z.string().nullish(),
		type: z.string().nullish(),
		mime: z.string().nullish(),
		created: z.string().nullish(),
		name: z.string().nullish(),
		url: z.string().nullish(),
		thumbnail: z.string().nullish(),
		size: z.number().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
	})
	.loose();

export type RoamChatItem = z.infer<typeof ChatItemSchema>;

const ChatMessageSchema = z
	.object({
		type: z.string().nullish(),
		userId: z.string().nullish(),
		userType: z.string().nullish(),
		chatId: z.string().nullish(),
		timestamp: z.number().nullish(),
		threadTimestamp: z.number().nullish(),
		replyTimestamp: z.number().nullish(),
		ephemeral: z.boolean().nullish(),
		contentType: z.string().nullish(),
		text: z.string().nullish(),
		color: z.string().nullish(),
		replyCount: z.number().nullish(),
		items: z.array(ChatItemSchema).nullish(),
		mentions: z.array(z.string()).nullish(),
		sender: UserRefSchema.nullish(),
		poll: PollSchema.nullish(),
		blocks: z.array(BlockSchema).nullish(),
		voice: VoiceNoteSchema.nullish(),
	})
	.loose();

export type RoamChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatHistoryResponseSchema = z.object({
	messages: z.array(ChatMessageSchema),
	...pagingFields,
});

export type ChatHistoryResponse = z.infer<typeof ChatHistoryResponseSchema>;

// ── chat.post / chat.update ───────────────────────────────────────────────

const SenderSchema = z.object({
	id: z.string().optional().describe('A user uuid to post as.'),
	name: z.string().optional(),
	imageUrl: z.string().optional(),
});

/**
 * `chat.post` accepts exactly one content type, so the schema rejects a body
 * that carries none or more than one rather than letting Roam answer 400.
 */
const ChatPostInputSchema = z
	.object({
		chat_id: z.string().optional().describe('The chat to post into.'),
		group_id: z.string().optional().describe('The group to post into.'),
		user_ids: z
			.array(z.string())
			.optional()
			.describe('Open a direct chat with these users.'),
		thread_timestamp: z.number().int().optional(),
		thread_key: z.string().optional(),
		reply_timestamp: z.number().int().optional(),
		text: z.string().optional(),
		markdown: z.boolean().optional(),
		items: z
			.array(z.string())
			.optional()
			.describe('Item ids to attach to the message.'),
		asset_ids: z.array(z.string()).optional(),
		blocks: z
			.array(BlockSchema)
			.optional()
			.describe('Block Kit blocks, at most ten and 8,000 bytes in total.'),
		color: z.string().optional(),
		poll: PollSchema.optional(),
		sender: SenderSchema.optional(),
		sync: z.boolean().optional(),
		send_at: z
			.string()
			.optional()
			.describe(
				'Schedule the post for this ISO 8601 time instead of sending now.',
			),
	})
	.superRefine((value, ctx) => {
		if (
			value.chat_id === undefined &&
			value.group_id === undefined &&
			!value.user_ids?.length
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `chat_id`, `group_id` or `user_ids`.',
				path: ['chat_id'],
			});
		}
		const contentTypes = [
			value.text !== undefined,
			value.items !== undefined,
			value.asset_ids !== undefined,
			value.blocks !== undefined,
			value.poll !== undefined,
		].filter(Boolean);
		if (contentTypes.length === 0) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide one of `text`, `items`, `asset_ids`, `blocks` or `poll`.',
				path: ['text'],
			});
		}
		if (contentTypes.length > 1) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Roam accepts exactly one content type per post: `text`, `items`, `asset_ids`, `blocks` or `poll`.',
				path: ['text'],
			});
		}
	});

export type ChatPostInput = z.input<typeof ChatPostInputSchema>;

const ChatPostResponseSchema = z.object({
	post: z.object({
		ok: z.boolean().nullish(),
		chatId: z.string().nullish(),
		timestamp: z.number().nullish(),
		scheduledMessageId: z.string().nullish(),
		sendAt: z.string().nullish(),
	}),
});

export type ChatPostResponse = z.infer<typeof ChatPostResponseSchema>;

const ChatUpdateInputSchema = z
	.object({
		chat_id: z.string().min(1),
		timestamp: z.number().int().describe('The message timestamp to edit.'),
		thread_timestamp: z.number().int().optional(),
		text: z.string().optional(),
		markdown: z.boolean().optional(),
		items: z.array(z.string()).optional(),
		asset_ids: z.array(z.string()).optional(),
		blocks: z.array(BlockSchema).optional(),
		color: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		const contentTypes = [
			value.text !== undefined,
			value.items !== undefined,
			value.asset_ids !== undefined,
			value.blocks !== undefined,
		].filter(Boolean);
		if (contentTypes.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Roam accepts exactly one content type per update: `text`, `items`, `asset_ids` or `blocks`.',
				path: ['text'],
			});
		}
	});

export type ChatUpdateInput = z.input<typeof ChatUpdateInputSchema>;

const ChatUpdateResponseSchema = z.object({
	update: z.object({
		ok: z.boolean().nullish(),
		chatId: z.string().nullish(),
		timestamp: z.number().nullish(),
	}),
});

export type ChatUpdateResponse = z.infer<typeof ChatUpdateResponseSchema>;

// ── reactions ─────────────────────────────────────────────────────────────

const ReactionAddInputSchema = z.object({
	chat_id: z.string().min(1),
	timestamp: z.number().int().describe('The message timestamp to react to.'),
	thread_timestamp: z.number().int().optional(),
	name: z.string().min(1).describe('The emoji name, such as `thumbsup`.'),
});

export type ReactionAddInput = z.input<typeof ReactionAddInputSchema>;

const ReactionAddResponseSchema = z.object({
	reaction: z.object({
		ok: z.boolean().nullish(),
		chatId: z.string().nullish(),
		timestamp: z.number().nullish(),
		name: z.string().nullish(),
	}),
});

export type ReactionAddResponse = z.infer<typeof ReactionAddResponseSchema>;

const ReactionListInputSchema = z.object({
	chat_id: z.string().min(1),
	timestamp: z.number().int(),
	thread_timestamp: z.number().int().optional(),
});

export type ReactionListInput = z.input<typeof ReactionListInputSchema>;

const ReactionSchema = z
	.object({
		name: z.string().nullish(),
		count: z.number().nullish(),
		users: z.array(z.string()).nullish(),
	})
	.loose();

export type RoamReaction = z.infer<typeof ReactionSchema>;

const ReactionListResponseSchema = z.object({
	reactions: z.array(ReactionSchema),
});

export type ReactionListResponse = z.infer<typeof ReactionListResponseSchema>;

// ── groups ────────────────────────────────────────────────────────────────

const GroupListInputSchema = z.object({
	query: z.string().optional().describe('A search phrase.'),
	type: z.string().optional().describe('The group type.'),
	limit: LimitSchema,
	cursor: CursorSchema,
});

export type GroupListInput = z.input<typeof GroupListInputSchema>;

const GroupSchema = z
	.object({
		id: z.string().nullish(),
		chatId: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		accessMode: z.string().nullish(),
		groupManagement: z.string().nullish(),
		enforceThreadedMode: z.boolean().nullish(),
		dateCreated: z.string().nullish(),
		imageUrl: z.string().nullish(),
	})
	.loose();

export type RoamGroup = z.infer<typeof GroupSchema>;

const GroupListResponseSchema = z.object({
	groups: z.array(GroupSchema),
	...pagingFields,
});

export type GroupListResponse = z.infer<typeof GroupListResponseSchema>;

// ── meetings ──────────────────────────────────────────────────────────────

const MeetingListInputSchema = z.object({
	before: z
		.string()
		.optional()
		.describe('Only meetings before this timestamp.'),
	after: z.string().optional().describe('Only meetings after this timestamp.'),
	limit: LimitSchema,
	cursor: CursorSchema,
	expand: ExpandSchema,
});

export type MeetingListInput = z.input<typeof MeetingListInputSchema>;

const MeetingSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		startedAt: z.string().nullish(),
		endedAt: z.string().nullish(),
		created: z.string().nullish(),
		duration: z.number().nullish(),
		status: z.string().nullish(),
		participants: z.array(UserRefSchema).nullish(),
		locationId: z.string().nullish(),
	})
	.loose();

export type RoamMeeting = z.infer<typeof MeetingSchema>;

const MeetingListResponseSchema = z.object({
	meetings: z.array(MeetingSchema),
	...pagingFields,
});

export type MeetingListResponse = z.infer<typeof MeetingListResponseSchema>;

const MeetingTranscriptInputSchema = z.object({
	meeting_id: z.string().min(1).describe('The meeting uuid.'),
});

export type MeetingTranscriptInput = z.input<
	typeof MeetingTranscriptInputSchema
>;

/**
 * A transcript answers either structured segments or, when asked for WebVTT, a
 * non-JSON body. This plugin asks for JSON, so the segments are what it returns;
 * `vtt` is present only when Roam included a rendered copy.
 */
const TranscriptSegmentSchema = z
	.object({
		start: z.number().nullish(),
		end: z.number().nullish(),
		speaker: z.string().nullish(),
		text: z.string().nullish(),
	})
	.loose();

const MeetingTranscriptResponseSchema = z.object({
	transcript: z.object({
		id: z.string().nullish(),
		language: z.string().nullish(),
		segments: z.array(TranscriptSegmentSchema).nullish(),
		vtt: z.string().nullish(),
		ok: z.boolean().nullish(),
	}),
});

export type MeetingTranscriptResponse = z.infer<
	typeof MeetingTranscriptResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RoamEndpointInputs = {
	tokenInfo: TokenInfoInput;
	userInfo: UserInfoInput;
	userList: UserListInput;
	chatList: ChatListInput;
	chatHistory: ChatHistoryInput;
	chatPost: ChatPostInput;
	chatUpdate: ChatUpdateInput;
	reactionAdd: ReactionAddInput;
	reactionList: ReactionListInput;
	groupList: GroupListInput;
	meetingList: MeetingListInput;
	meetingTranscript: MeetingTranscriptInput;
};

export type RoamEndpointOutputs = {
	tokenInfo: TokenInfoResponse;
	userInfo: UserInfoResponse;
	userList: UserListResponse;
	chatList: ChatListResponse;
	chatHistory: ChatHistoryResponse;
	chatPost: ChatPostResponse;
	chatUpdate: ChatUpdateResponse;
	reactionAdd: ReactionAddResponse;
	reactionList: ReactionListResponse;
	groupList: GroupListResponse;
	meetingList: MeetingListResponse;
	meetingTranscript: MeetingTranscriptResponse;
};

export const RoamEndpointInputSchemas = {
	tokenInfo: TokenInfoInputSchema,
	userInfo: UserInfoInputSchema,
	userList: UserListInputSchema,
	chatList: ChatListInputSchema,
	chatHistory: ChatHistoryInputSchema,
	chatPost: ChatPostInputSchema,
	chatUpdate: ChatUpdateInputSchema,
	reactionAdd: ReactionAddInputSchema,
	reactionList: ReactionListInputSchema,
	groupList: GroupListInputSchema,
	meetingList: MeetingListInputSchema,
	meetingTranscript: MeetingTranscriptInputSchema,
} as const;

export const RoamEndpointOutputSchemas = {
	tokenInfo: TokenInfoResponseSchema,
	userInfo: UserInfoResponseSchema,
	userList: UserListResponseSchema,
	chatList: ChatListResponseSchema,
	chatHistory: ChatHistoryResponseSchema,
	chatPost: ChatPostResponseSchema,
	chatUpdate: ChatUpdateResponseSchema,
	reactionAdd: ReactionAddResponseSchema,
	reactionList: ReactionListResponseSchema,
	groupList: GroupListResponseSchema,
	meetingList: MeetingListResponseSchema,
	meetingTranscript: MeetingTranscriptResponseSchema,
} as const;
