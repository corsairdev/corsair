import { z } from 'zod';

// Field reference: the machine-readable route catalog served at
// https://api.stormboard.com/json (the same data the docs site at
// /docs renders), plus https://api.stormboard.com/docs for errors, rate
// limits and auth. Every documented route was probed live: all answer the
// JSON auth envelope except the two /templates routes, which answer an HTML
// 404 and are therefore left out of this plugin.
// Output objects are .loose(); optional output fields are nullish because
// providers send JSON null.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();

const positiveInt = z.number().int().positive();
const nonNegInt = z.number().int().min(0);

const isoDate = z
	.string()
	.regex(
		/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2}))?$/,
		'Expected an ISO 8601 date',
	)
	.describe('An ISO 8601 date; dates without a timezone are read as UTC.');

// ── Shared record shapes (from the documented response examples) ──────────

export const UserStubSchema = z
	.object({
		// The examples mix numeric ids ({"id": 999}) and string ids
		// ({"id": "999"}), so both are accepted.
		id: z.union([z.number(), z.string()]).nullish(),
		name: str,
	})
	.loose();

export type StormboardUserStub = z.infer<typeof UserStubSchema>;

const IdeaDataSchema = z
	.object({
		text: str,
		name: str,
	})
	.loose();

export const IdeaSchema = z
	.object({
		id: num,
		storm: z
			.object({
				id: num,
				title: str,
			})
			.loose()
			.nullish(),
		x: num,
		y: num,
		z: num,
		color: str,
		lock: num,
		comments: num,
		votes: num,
		type: str,
		data: IdeaDataSchema.nullish(),
		// unknown: the task object's keys depend on the assignment state, so
		// it stays an open record.
		task: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type StormboardIdea = z.infer<typeof IdeaSchema>;

export const StormSchema = z
	.object({
		id: num,
		key: str,
		title: str,
		description: str,
		admin: num,
		favorite: num,
		palette: str,
		closed: bool,
		team: z
			.object({
				id: num,
			})
			.loose()
			.nullish(),
		activity: num,
		votesperuser: num,
		votesperadmin: num,
		avatars: num,
		ideacreator: num,
		chatlocked: num,
	})
	.loose();

export type StormboardStorm = z.infer<typeof StormSchema>;

export const CommentSchema = z
	.object({
		id: num,
		comment: str,
		created: str,
		user: UserStubSchema.nullish(),
	})
	.loose();

export type StormboardComment = z.infer<typeof CommentSchema>;

export const ConnectorSchema = z
	.object({
		id: num,
		from: num,
		to: num,
		label: str,
		style: z
			.object({
				color: str,
				fromEndType: str,
				toEndType: str,
			})
			.loose()
			.nullish(),
		// unknown: the connector path points are renderer coordinates with
		// no documented element shape.
		points: z.array(z.unknown()).nullish(),
	})
	.loose();

export type StormboardConnector = z.infer<typeof ConnectorSchema>;

export const ChatMessageSchema = z
	.object({
		isnew: bool,
		storm: num,
		user: UserStubSchema.nullish(),
		created: str,
		msg: str,
	})
	.loose();

export type StormboardChatMessage = z.infer<typeof ChatMessageSchema>;

export const TagSchema = z
	.object({
		id: num,
		name: str,
		type: str,
		status: str,
	})
	.loose();

export type StormboardTag = z.infer<typeof TagSchema>;

export const TaskSchema = z
	.object({
		assignees: z.array(UserStubSchema).nullish(),
		date: z
			.object({
				due: str,
				completed: str,
			})
			.loose()
			.nullish(),
		status: str,
	})
	.loose();

export type StormboardTask = z.infer<typeof TaskSchema>;

// A message-plus-id answer is the most common write response
// ({"message": "idea created", "id": 10000001}).
const MessageWithIdSchema = z
	.object({
		message: z.union([z.string(), z.number()]),
		id: z.union([z.number(), z.string()]).nullish(),
	})
	.loose();

// ── Users ─────────────────────────────────────────────────────────────────

export const ProfileSchema = z
	.object({
		auth: z
			.object({
				api_key: str,
			})
			.loose()
			.nullish(),
		id: num,
		firstname: str,
		lastname: str,
		username: str,
		email: str,
		plan: str,
		team: z
			.object({
				id: str,
				name: str,
			})
			.loose()
			.nullish(),
		notifications: z
			.object({
				dailyemail: str,
				newstormuser: str,
				newsletter: str,
			})
			.loose()
			.nullish(),
	})
	.loose();

export type StormboardProfile = z.infer<typeof ProfileSchema>;

// ── Inputs ────────────────────────────────────────────────────────────────

const notificationFlag = z
	.number()
	.int()
	.min(0)
	.max(1)
	.optional()
	.describe('1 turns the notification on, 0 turns it off.');

const UsersCreateInputSchema = z.object({
	firstname: z.string().min(1),
	lastname: z.string().min(1),
	email: z.string().email(),
	username: z.string().min(1),
	password: z.string().min(1),
});

const UsersVerifyInputSchema = z.object({
	code: z.string().min(1),
});

const UsersUpdateProfileInputSchema = z.object({
	firstname: z.string().min(1).optional(),
	lastname: z.string().min(1).optional(),
	email: z.string().email().optional(),
	username: z.string().min(1).optional(),
	password: z.string().min(1).optional(),
});

const UsersGetProfileInputSchema = z.object({});

const UsersGetAuthInputSchema = z.object({});

const UsersTestInputSchema = z.object({});

const UsersUpdateNotificationsInputSchema = z.object({
	dailyemail: notificationFlag,
	newstormuser: notificationFlag,
	newsletter: notificationFlag,
});

// ── Storms ────────────────────────────────────────────────────────────────

const StormsCreateInputSchema = z.object({
	plan: z
		.string()
		.min(1)
		.describe(
			'The Storm plan; the docs name no closed list, so any plan string is passed through.',
		),
	title: z.string().min(1),
	description: z.string().optional(),
	template: nonNegInt.optional(),
	votesperuser: nonNegInt.optional(),
	avatars: z.union([z.literal(0), z.literal(1)]).optional(),
	ideacreator: z.union([z.literal(0), z.literal(1)]).optional(),
	team_id: nonNegInt.optional(),
});

const StormsGetInputSchema = z.object({
	stormId: positiveInt,
	thumbnail: z.string().optional(),
});

const StormsUpdateInputSchema = z.object({
	stormId: positiveInt,
	title: z.string().min(1).optional(),
	description: z.string().nullish().optional(),
	template: nonNegInt.nullish().optional(),
	votesperuser: nonNegInt.optional(),
	avatars: z.union([z.literal(0), z.literal(1)]).optional(),
	ideacreator: z.union([z.literal(0), z.literal(1)]).optional(),
});

const StormsUpdateLegendInputSchema = z.object({
	stormId: positiveInt,
	// The documented example sends a color-to-label map
	// ({"color": {"yellow": "Yellow Label", "pink": "Pinky"}}).
	color: z.record(z.string(), z.string()),
});

const StormsGetTemplateInputSchema = z.object({
	stormId: positiveInt,
});

const StormsUpdateSectionInputSchema = z.object({
	stormId: positiveInt,
	sectionIndex: nonNegInt,
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	character: z.string().optional(),
});

const StormsGetAccessInputSchema = z.object({
	stormId: positiveInt,
});

const StormsListIdeasInputSchema = z.object({
	stormId: positiveInt,
	lastModifiedMin: isoDate.optional(),
});

const StormsListUsersInputSchema = z.object({
	stormId: positiveInt,
});

const StormsListInputSchema = z.object({
	team: nonNegInt.optional(),
	folder: nonNegInt.optional(),
	needle: z.string().optional(),
	status: z
		.enum(['active', 'closed'])
		.optional()
		.describe('Filter by Storm state; the API defaults to active.'),
	start: nonNegInt.optional(),
	order: z
		.enum(['activity', 'created', 'title'])
		.optional()
		.describe('Sort order; the API defaults to activity.'),
	results: nonNegInt.optional(),
});

const StormsListInvitesInputSchema = z.object({
	team: nonNegInt.optional(),
	needle: z.string().optional(),
});

const StormsListConnectorsInputSchema = z.object({
	stormId: positiveInt,
});

const StormsCloseInputSchema = z.object({
	stormId: positiveInt,
});

const StormsReopenInputSchema = z.object({
	stormId: positiveInt,
});

const StormsInviteInputSchema = z.object({
	stormId: positiveInt,
	participants: z
		.array(z.string().email())
		.min(1)
		.describe('Email addresses of the participants to invite.'),
	message: z.string().optional(),
	type: z
		.enum(['contributor', 'admin', 'viewer'])
		.optional()
		.describe('The access the invite grants; the API defaults to contributor.'),
});

const StormsAcceptInviteInputSchema = z.object({
	stormId: positiveInt,
});

const StormsDeclineInviteInputSchema = z.object({
	stormId: positiveInt,
});

const StormsJoinInputSchema = z.object({
	stormid: positiveInt,
	stormkey: z.string().min(1),
});

const StormsLeaveInputSchema = z.object({
	stormId: positiveInt,
});

const StormsDuplicateInputSchema = z.object({
	stormId: positiveInt,
	stormname: z.string().min(1).optional(),
});

const StormsFavoriteInputSchema = z.object({
	stormId: positiveInt,
});

const StormsUnfavoriteInputSchema = z.object({
	stormId: positiveInt,
});

// ── Ideas ─────────────────────────────────────────────────────────────────

const IdeasCreateInputSchema = z.object({
	stormid: positiveInt,
	type: z.string().optional(),
	data: z.string().min(1),
	name: z.string().optional(),
	color: z.string().optional(),
	shape: z.string().optional(),
	sectionindex: z.string().optional(),
	x: nonNegInt.optional(),
	y: nonNegInt.optional(),
	lock: z.union([z.literal(0), z.literal(1)]).optional(),
});

const IdeasUpdateInputSchema = z.object({
	ideaId: positiveInt,
	type: z.string().optional(),
	data: z.string().min(1),
	color: z.string().optional(),
	shape: z.string().optional(),
	x: nonNegInt.optional(),
	y: nonNegInt.optional(),
	lock: z.union([z.literal(0), z.literal(1)]).optional(),
});

const IdeasGetInputSchema = z.object({
	ideaId: positiveInt,
});

const IdeasDeleteInputSchema = z.object({
	ideaId: positiveInt,
});

const IdeasVoteInputSchema = z.object({
	ideaId: positiveInt,
});

const IdeasUnvoteInputSchema = z.object({
	ideaId: positiveInt,
});

const IdeasCreateCommentInputSchema = z.object({
	ideaId: positiveInt,
	comment: z.string().min(1),
});

const IdeasUpdateCommentInputSchema = z.object({
	ideaId: positiveInt,
	commentId: positiveInt,
	comment: z.string().min(1),
});

const IdeasDeleteCommentInputSchema = z.object({
	ideaId: positiveInt,
	commentId: positiveInt,
});

const IdeasListCommentsInputSchema = z.object({
	ideaId: positiveInt,
	order: z.enum(['asc', 'desc']).optional(),
	avatars: z.union([z.literal(0), z.literal(1)]).optional(),
});

const IdeasCreateConnectorInputSchema = z.object({
	from_idea_id: positiveInt,
	to_idea_id: positiveInt,
	label: z.string().optional(),
	color: z.string().optional(),
	to_end_type: z.string().optional(),
	from_end_type: z.string().optional(),
});

const IdeasUpdateConnectorInputSchema = z.object({
	connectorId: positiveInt,
	label: z.string().optional(),
	color: z.string().optional(),
	to_end_type: z.string().optional(),
	from_end_type: z.string().optional(),
});

const IdeasDeleteConnectorInputSchema = z.object({
	connectorId: positiveInt,
});

const IdeasDeleteConnectorBetweenInputSchema = z.object({
	from_idea_id: positiveInt,
	to_idea_id: positiveInt,
});

const IdeasUpdateTaskInputSchema = z.object({
	ideaId: positiveInt,
	assigned_to: nonNegInt.optional(),
	date_due: isoDate.optional(),
	date_completed: isoDate.optional(),
	notify: z.union([z.literal(0), z.literal(1)]).optional(),
});

// ── Tags ──────────────────────────────────────────────────────────────────

const TagsCreateForStormInputSchema = z.object({
	stormId: positiveInt,
	name: z.string().min(1),
});

const TagsCreateForIdeaInputSchema = z.object({
	ideaId: positiveInt,
	// The documented example sends a name-to-value map
	// ({"data": {"Integration ID": "..."}}).
	data: z.record(z.string(), z.string()),
});

const TagsListForStormInputSchema = z.object({
	stormId: positiveInt,
});

const TagsGetForIdeaInputSchema = z.object({
	ideaId: positiveInt,
});

// ── Chat ──────────────────────────────────────────────────────────────────

const ChatCreateInputSchema = z.object({
	stormId: positiveInt,
	message: z.string().min(1),
});

const ChatListInputSchema = z.object({
	stormId: positiveInt,
});

const ChatListUnreadInputSchema = z.object({
	stormId: positiveInt,
});

const ChatMarkAllReadInputSchema = z.object({
	stormId: positiveInt,
});

// ── Folders ───────────────────────────────────────────────────────────────

const FoldersListInputSchema = z.object({
	teamId: positiveInt,
});

// ── Outputs ───────────────────────────────────────────────────────────────

const StormListPageSchema = z
	.object({
		hasmore: bool,
		storms: z.array(StormSchema),
	})
	.loose();

const MessageListSchema = z.object({ messages: z.array(ChatMessageSchema) });

export const StormboardEndpointInputSchemas = {
	usersCreate: UsersCreateInputSchema,
	usersVerify: UsersVerifyInputSchema,
	usersUpdateProfile: UsersUpdateProfileInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	usersGetAuth: UsersGetAuthInputSchema,
	usersTest: UsersTestInputSchema,
	usersUpdateNotifications: UsersUpdateNotificationsInputSchema,
	stormsCreate: StormsCreateInputSchema,
	stormsGet: StormsGetInputSchema,
	stormsUpdate: StormsUpdateInputSchema,
	stormsUpdateLegend: StormsUpdateLegendInputSchema,
	stormsGetTemplate: StormsGetTemplateInputSchema,
	stormsUpdateSection: StormsUpdateSectionInputSchema,
	stormsGetAccess: StormsGetAccessInputSchema,
	stormsListIdeas: StormsListIdeasInputSchema,
	stormsListUsers: StormsListUsersInputSchema,
	stormsList: StormsListInputSchema,
	stormsListInvites: StormsListInvitesInputSchema,
	stormsListConnectors: StormsListConnectorsInputSchema,
	stormsClose: StormsCloseInputSchema,
	stormsReopen: StormsReopenInputSchema,
	stormsInvite: StormsInviteInputSchema,
	stormsAcceptInvite: StormsAcceptInviteInputSchema,
	stormsDeclineInvite: StormsDeclineInviteInputSchema,
	stormsJoin: StormsJoinInputSchema,
	stormsLeave: StormsLeaveInputSchema,
	stormsDuplicate: StormsDuplicateInputSchema,
	stormsFavorite: StormsFavoriteInputSchema,
	stormsUnfavorite: StormsUnfavoriteInputSchema,
	ideasCreate: IdeasCreateInputSchema,
	ideasUpdate: IdeasUpdateInputSchema,
	ideasGet: IdeasGetInputSchema,
	ideasDelete: IdeasDeleteInputSchema,
	ideasAddVote: IdeasVoteInputSchema,
	ideasRemoveVote: IdeasUnvoteInputSchema,
	ideasCreateComment: IdeasCreateCommentInputSchema,
	ideasUpdateComment: IdeasUpdateCommentInputSchema,
	ideasDeleteComment: IdeasDeleteCommentInputSchema,
	ideasListComments: IdeasListCommentsInputSchema,
	ideasCreateConnector: IdeasCreateConnectorInputSchema,
	ideasUpdateConnector: IdeasUpdateConnectorInputSchema,
	ideasDeleteConnector: IdeasDeleteConnectorInputSchema,
	ideasDeleteConnectorBetween: IdeasDeleteConnectorBetweenInputSchema,
	ideasUpdateTask: IdeasUpdateTaskInputSchema,
	tagsCreateForStorm: TagsCreateForStormInputSchema,
	tagsCreateForIdea: TagsCreateForIdeaInputSchema,
	tagsListForStorm: TagsListForStormInputSchema,
	tagsGetForIdea: TagsGetForIdeaInputSchema,
	chatCreate: ChatCreateInputSchema,
	chatList: ChatListInputSchema,
	chatListUnread: ChatListUnreadInputSchema,
	chatMarkAllRead: ChatMarkAllReadInputSchema,
	foldersList: FoldersListInputSchema,
};

export const StormboardEndpointOutputSchemas = {
	usersCreate: z
		.object({
			message: z.union([z.string(), z.number()]),
			id: z.union([z.number(), z.string()]).nullish(),
			// Creating a user returns the new account's API key.
			api_key: str,
		})
		.loose(),
	usersVerify: MessageWithIdSchema,
	usersUpdateProfile: MessageWithIdSchema,
	usersGetProfile: z.object({ profile: ProfileSchema }).loose(),
	// The auth list carries the account's API keys with creation dates.
	usersGetAuth: z
		.object({
			auth: z.array(
				z
					.object({
						key: str,
						created: str,
						expires: str,
					})
					.loose(),
			),
		})
		.loose(),
	usersTest: z
		.object({
			message: z.union([z.string(), z.number()]).nullish(),
			status: num,
		})
		.loose(),
	usersUpdateNotifications: MessageWithIdSchema,
	stormsCreate: MessageWithIdSchema,
	stormsGet: z.object({ storm: StormSchema }).loose(),
	stormsUpdate: MessageWithIdSchema,
	stormsUpdateLegend: MessageWithIdSchema,
	stormsGetTemplate: z.object({}).loose(),
	stormsUpdateSection: MessageWithIdSchema,
	stormsGetAccess: z
		.object({
			administrator: bool,
			type: str,
		})
		.loose(),
	stormsListIdeas: z.object({ ideas: z.array(IdeaSchema) }).loose(),
	stormsListUsers: z
		.object({
			users: z.array(
				z
					.object({
						firstname: str,
						lastname: str,
						email: str,
						ideas: num,
						comments: num,
						votes: num,
						lastactivity: str,
					})
					.loose(),
			),
		})
		.loose(),
	stormsList: StormListPageSchema,
	stormsListInvites: StormListPageSchema,
	stormsListConnectors: z
		.object({ connectors: z.array(ConnectorSchema) })
		.loose(),
	stormsClose: MessageWithIdSchema,
	stormsReopen: MessageWithIdSchema,
	stormsInvite: z
		.object({
			message: z.union([z.string(), z.number()]),
			invited: num,
		})
		.loose(),
	stormsAcceptInvite: MessageWithIdSchema,
	stormsDeclineInvite: MessageWithIdSchema,
	stormsJoin: MessageWithIdSchema,
	stormsLeave: MessageWithIdSchema,
	stormsDuplicate: MessageWithIdSchema,
	// The docs document no response example for the favorite toggles.
	stormsFavorite: z.object({}).loose(),
	stormsUnfavorite: z.object({}).loose(),
	ideasCreate: MessageWithIdSchema,
	ideasUpdate: MessageWithIdSchema,
	ideasGet: z.object({ idea: IdeaSchema }).loose(),
	ideasDelete: MessageWithIdSchema,
	ideasAddVote: z
		.object({
			message: z.union([z.string(), z.number()]),
			id: z.union([z.number(), z.string()]).nullish(),
			idea: z
				.object({
					totalvotes: num,
					myvotes: z.union([z.number(), z.string()]).nullish(),
				})
				.loose()
				.nullish(),
			storm: z
				.object({
					// The vote example carries the storm id as a string.
					id: z.union([z.number(), z.string()]).nullish(),
					title: str,
					votesremaining: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	ideasRemoveVote: z
		.object({
			message: z.union([z.string(), z.number()]),
			id: z.union([z.number(), z.string()]).nullish(),
			idea: z
				.object({
					totalvotes: num,
					myvotes: z.union([z.number(), z.string()]).nullish(),
				})
				.loose()
				.nullish(),
			storm: z
				.object({
					// The vote example carries the storm id as a string.
					id: z.union([z.number(), z.string()]).nullish(),
					title: str,
					votesremaining: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	ideasCreateComment: z
		.object({
			message: z.union([z.string(), z.number()]),
			comment: CommentSchema.nullish(),
		})
		.loose(),
	ideasUpdateComment: MessageWithIdSchema,
	ideasDeleteComment: MessageWithIdSchema,
	ideasListComments: z.object({ comments: z.array(CommentSchema) }).loose(),
	ideasCreateConnector: ConnectorSchema,
	ideasUpdateConnector: ConnectorSchema,
	ideasDeleteConnector: MessageWithIdSchema,
	ideasDeleteConnectorBetween: MessageWithIdSchema,
	ideasUpdateTask: z.object({ task: TaskSchema }).loose(),
	// The docs document no response example for tag creation.
	tagsCreateForStorm: z.object({}).loose(),
	tagsCreateForIdea: z.object({}).loose(),
	tagsListForStorm: z.object({ tags: z.array(TagSchema) }).loose(),
	tagsGetForIdea: z
		.object({
			data: z.record(z.string(), z.string()),
		})
		.loose(),
	chatCreate: z
		.object({
			// On this route the message key holds the created chat message
			// object, not a status string.
			message: ChatMessageSchema,
		})
		.loose(),
	chatList: MessageListSchema,
	chatListUnread: MessageListSchema,
	// The documented example shows {"success": 1}; a numeric flag.
	chatMarkAllRead: z
		.object({
			success: z.union([z.number(), z.string()]),
		})
		.loose(),
	// The documented folders example repeats the templates object, which
	// looks like a docs copy error, so the body stays open.
	foldersList: z.object({}).loose(),
};

export type StormboardEndpointInputs = {
	[K in keyof typeof StormboardEndpointInputSchemas]: z.input<
		(typeof StormboardEndpointInputSchemas)[K]
	>;
};

export type StormboardEndpointOutputs = {
	[K in keyof typeof StormboardEndpointOutputSchemas]: z.infer<
		(typeof StormboardEndpointOutputSchemas)[K]
	>;
};
