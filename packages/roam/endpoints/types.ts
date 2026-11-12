import { z } from 'zod';

/**
 * Roam pages with an opaque cursor. Each list route documents its own `limit`
 * maximum, and Roam answers 400 above it, so the schema takes the route's cap.
 */
function limitSchema(max: number) {
	return z
		.number()
		.int()
		.min(1)
		.max(max)
		.optional()
		.describe(
			`Records per page, at most ${max}. Roam applies its own default when omitted.`,
		);
}

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
/**
 * The `addresses` map that `expand: ['addresses']` adds to `chat.list` and
 * `chat.history`: the senders, participants and mentioned ids, keyed by id.
 */
const AddressesSchema = z
	.record(
		z.string(),
		z
			.object({
				id: z.string().nullish(),
				type: z
					.string()
					.nullish()
					.describe(
						'`user`, `bot`, `standardGroup`, `meetingGroup`, `userGroup` or `teamRoam`.',
					),
				displayName: z.string().nullish(),
				displayImageUrl: z.string().nullish(),
				email: z.string().nullish(),
				isGuest: z.boolean().nullish(),
				botCode: z.string().nullish(),
				integrationId: z.string().nullish(),
			})
			.loose(),
	)
	.optional()
	.describe(
		"Present only with `expand: ['addresses']`: display info for the ids in this page, keyed by id.",
	);

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

/** A voice note attached to a message: its audio file, length and transcript. */
export const VoiceNoteSchema = z
	.object({
		audioUrl: z.string().nullish(),
		duration: z.number().nullish(),
		transcript: z.string().nullish(),
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

/**
 * A poll as `chat.history` returns it. Unlike the input, each option comes back
 * as an object with the id that `reactions.list` reports votes against.
 */
const PollResponseSchema = z
	.object({
		question: z.string().nullish(),
		options: z
			.array(
				z
					.object({ id: z.string().nullish(), text: z.string().nullish() })
					.loose(),
			)
			.nullish(),
		allowMultipleAnswers: z.boolean().nullish(),
		closesAt: z.string().nullish(),
	})
	.loose();

/**
 * A block as `chat.history` returns it. The spec types these as plain objects,
 * so the output keeps every field and does not pin `type` to the five block
 * types a post may send.
 */
const BlockResponseSchema = z
	.object({ type: z.string().nullish() })
	.catchall(BlockNodeSchema);

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
			user: UserSchema.nullish().describe('The person who owns the token.'),
			bot: UserRefSchema.nullish().describe(
				'The bot persona the token posts as.',
			),
			clientId: z.string().nullish().describe('The API client id.'),
			scopes: z.array(z.string()).nullish(),
			roam: z
				.object({
					id: z.string().nullish(),
					name: z.string().nullish(),
					imageUrl: z.string().nullish(),
					iconUrl: z.string().nullish(),
				})
				.loose()
				.nullish()
				.describe('The workspace the token belongs to.'),
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

const UserListInputSchema = z
	.object({
		ids: z
			.array(z.string())
			.optional()
			.describe(
				'Only these user uuids, up to 100. Not combinable with `q`, `limit` or `cursor`.',
			),
		q: z.string().optional().describe('A search phrase.'),
		limit: limitSchema(100),
		cursor: CursorSchema,
		expand: ExpandSchema,
	})
	.superRefine((value, ctx) => {
		// Roam answers 400 invalid_parameter to `ids` with any directory option.
		if (
			value.ids !== undefined &&
			(value.q !== undefined ||
				value.limit !== undefined ||
				value.cursor !== undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				message: '`ids` does not combine with `q`, `limit` or `cursor`.',
				path: ['ids'],
			});
		}
	});

export type UserListInput = z.input<typeof UserListInputSchema>;

const UserListResponseSchema = z.object({
	users: z.array(UserSchema),
	...pagingFields,
});

export type UserListResponse = z.infer<typeof UserListResponseSchema>;

// ── chat.list / chat.history ──────────────────────────────────────────────

const ChatListInputSchema = z.object({
	limit: limitSchema(50),
	cursor: CursorSchema,
	expand: ExpandSchema,
});

export type ChatListInput = z.input<typeof ChatListInputSchema>;

/**
 * A chat row. The inbox fields (`lastMessageTime`, `isUnread`, `preview`,
 * `isMuted`, `isPinned`) are filled only for personal tokens.
 */
const ChatSchema = z
	.object({
		id: z.string().nullish(),
		type: z.string().nullish().describe('`dm` or `group`.'),
		name: z.string().nullish(),
		groupId: z.string().nullish(),
		threadTimestamp: z.number().nullish(),
		created: z.string().nullish(),
		lastMessageTime: z.string().nullish(),
		isUnread: z.boolean().nullish(),
		preview: z
			.object({
				text: z.string().nullish(),
				contentType: z.string().nullish(),
				senderId: z.string().nullish(),
				mentioned: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		isMuted: z.boolean().nullish(),
		isPinned: z.boolean().nullish(),
	})
	.loose();

export type RoamChat = z.infer<typeof ChatSchema>;

const ChatListResponseSchema = z.object({
	chats: z.array(ChatSchema),
	addresses: AddressesSchema,
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
			.describe(
				'Read the direct or multi-person chat with these users instead of a chat or group.',
			),
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
		limit: limitSchema(200),
		expand: ExpandSchema,
	})
	.superRefine((value, ctx) => {
		// Roam reads the target from exactly one of these and answers 400 to
		// none or to more than one.
		const destinations = [
			value.chat_id !== undefined,
			value.group_id !== undefined,
			value.user_ids !== undefined,
		].filter(Boolean).length;
		if (destinations !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide exactly one of `chat_id`, `group_id` or `user_ids`.',
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
		poll: PollResponseSchema.nullish(),
		blocks: z.array(BlockResponseSchema).nullish(),
		voice: VoiceNoteSchema.nullish(),
	})
	.loose();

export type RoamChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatHistoryResponseSchema = z.object({
	messages: z.array(ChatMessageSchema),
	addresses: AddressesSchema,
	...pagingFields,
});

export type ChatHistoryResponse = z.infer<typeof ChatHistoryResponseSchema>;

// ── chat.post / chat.update ───────────────────────────────────────────────

const SenderSchema = z.object({
	id: z.string().optional().describe('A user uuid to post as.'),
	name: z.string().optional(),
	imageUrl: z.string().optional(),
});

/** True when an ISO 8601 time sits on a 15-minute UTC boundary. */
function onQuarterHour(value: string): boolean {
	const time = new Date(value);
	if (Number.isNaN(time.getTime())) return false;
	return (
		time.getUTCMinutes() % 15 === 0 &&
		time.getUTCSeconds() === 0 &&
		time.getUTCMilliseconds() === 0
	);
}

/**
 * `chat.post` combines `text`, `items` and `asset_ids` freely, but `blocks` and
 * `poll` each stand alone. The schema rejects the bodies Roam answers 400 to.
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
		thread_key: z
			.string()
			.max(64)
			.optional()
			.describe(
				'An external id that threads every post sharing it under the first one.',
			),
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
		sync: z
			.boolean()
			.optional()
			.describe(
				'Wait for the post and return its `timestamp`, which `chat.update`, `reactions.add` and thread replies need. Without it the answer has no timestamp.',
			),
		send_at: z
			.string()
			.optional()
			.describe(
				'Schedule the post for this ISO 8601 time instead of sending now: in the future, within 30 days, on a 15-minute UTC boundary.',
			),
	})
	.superRefine((value, ctx) => {
		const destinations = [
			value.chat_id !== undefined,
			value.group_id !== undefined,
			value.user_ids !== undefined,
		].filter(Boolean).length;
		if (destinations !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide exactly one of `chat_id`, `group_id` or `user_ids`.',
				path: ['chat_id'],
			});
		}
		const hasText =
			value.text !== undefined ||
			value.items !== undefined ||
			value.asset_ids !== undefined;
		const kinds = [
			hasText,
			value.blocks !== undefined,
			value.poll !== undefined,
		].filter(Boolean).length;
		if (kinds === 0) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide `text` (with optional `items` or `asset_ids`), `blocks` or `poll`.',
				path: ['text'],
			});
		}
		if (kinds > 1) {
			ctx.addIssue({
				code: 'custom',
				message:
					'`blocks` and `poll` each stand alone: neither combines with `text`, `items`, `asset_ids` or the other.',
				path: ['text'],
			});
		}
		if (
			value.reply_timestamp !== undefined &&
			(value.blocks !== undefined || value.poll !== undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				message:
					'`reply_timestamp` works on text posts only, not `blocks` or `poll`.',
				path: ['reply_timestamp'],
			});
		}
		if (
			value.thread_timestamp !== undefined &&
			value.thread_key !== undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Use `thread_timestamp` or `thread_key`, not both.',
				path: ['thread_key'],
			});
		}
		if (value.send_at !== undefined) {
			if (!onQuarterHour(value.send_at)) {
				ctx.addIssue({
					code: 'custom',
					message:
						'`send_at` must fall on a 15-minute UTC boundary (:00, :15, :30 or :45, zero seconds).',
					path: ['send_at'],
				});
			}
			if (
				value.sync !== undefined ||
				value.poll !== undefined ||
				value.thread_key !== undefined ||
				value.reply_timestamp !== undefined
			) {
				ctx.addIssue({
					code: 'custom',
					message:
						'`send_at` cannot be combined with `sync`, `poll`, `thread_key` or `reply_timestamp`.',
					path: ['send_at'],
				});
			}
		}
	});

export type ChatPostInput = z.input<typeof ChatPostInputSchema>;

const ChatPostResponseSchema = z.object({
	post: z.object({
		ok: z.boolean().nullish(),
		chatId: z.string().nullish(),
		threadTimestamp: z.number().nullish(),
		timestamp: z.number().nullish(),
		scheduledMessageId: z.string().nullish(),
		sendAt: z.string().nullish(),
	}),
});

export type ChatPostResponse = z.infer<typeof ChatPostResponseSchema>;

/**
 * An edit carries `text` (with optional `items` or `asset_ids`) or `blocks`,
 * never both.
 */
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
		if ((value.text === undefined) === (value.blocks === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide exactly one of `text` or `blocks`.',
				path: ['text'],
			});
		}
		if (
			value.blocks !== undefined &&
			(value.items !== undefined || value.asset_ids !== undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				message: '`items` and `asset_ids` go with `text`, not with `blocks`.',
				path: ['blocks'],
			});
		}
	});

export type ChatUpdateInput = z.input<typeof ChatUpdateInputSchema>;

const ChatUpdateResponseSchema = z.object({
	update: z.object({
		ok: z.boolean().nullish(),
		chatId: z.string().nullish(),
		timestamp: z.number().nullish(),
		threadTimestamp: z.number().nullish(),
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

/** Votes per option, filled when the message is a poll. */
const PollVoteSchema = z
	.object({
		optionId: z.string().nullish(),
		text: z.string().nullish(),
		count: z.number().nullish(),
		users: z.array(z.string()).nullish(),
	})
	.loose();

const ReactionListResponseSchema = z.object({
	reactions: z.array(ReactionSchema),
	pollVotes: z.array(PollVoteSchema).nullish(),
});

export type ReactionListResponse = z.infer<typeof ReactionListResponseSchema>;

// ── groups ────────────────────────────────────────────────────────────────

const GroupListInputSchema = z.object({
	query: z.string().optional().describe('A search phrase.'),
	type: z
		.string()
		.optional()
		.describe(
			'Comma-separated group types: `standard`, `magicast`, `meeting`, `roam` or `onair`.',
		),
	limit: limitSchema(100),
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
	limit: limitSchema(100),
	cursor: CursorSchema,
	expand: z
		.array(z.enum(['summary', 'actionItems', 'chapters']))
		.optional()
		.describe(
			'Fields to inline on each meeting. Roam caps `limit` at 10 when any is set.',
		),
});

export type MeetingListInput = z.input<typeof MeetingListInputSchema>;

const MeetingHostSchema = z
	.object({
		type: z.string().nullish(),
		id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

/** Present only when `expand` asks for `actionItems`. */
const ActionItemSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		complete: z.boolean().nullish(),
		assigneeId: z.string().nullish(),
	})
	.loose();

/** Present only when `expand` asks for `chapters`. */
const ChapterSchema = z
	.object({
		name: z.string().nullish(),
		start: z.number().nullish(),
		synopsis: z.string().nullish(),
	})
	.loose();

const MeetingSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		subtitle: z.string().nullish(),
		start: z.string().nullish().describe('When the meeting started, RFC 3339.'),
		participantCount: z.number().nullish(),
		hasVideo: z.boolean().nullish(),
		videoStatus: z.string().nullish(),
		host: MeetingHostSchema.nullish(),
		summary: z.string().nullish(),
		actionItems: z.array(ActionItemSchema).nullish(),
		chapters: z.array(ChapterSchema).nullish(),
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
 * A transcript answers either structured cues or, when asked for WebVTT, a
 * non-JSON body. This plugin asks for JSON, so the cues are what it returns.
 * Each cue names its speaker by user id; `users.info` resolves the name.
 */
const TranscriptCueSchema = z
	.object({
		speakerId: z.string().nullish(),
		text: z.string().nullish(),
		start: z.number().nullish(),
		end: z.number().nullish(),
	})
	.loose();

const MeetingTranscriptResponseSchema = z.object({
	transcript: z
		.object({
			id: z.string().nullish(),
			cues: z.array(TranscriptCueSchema).nullish(),
		})
		.loose(),
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
