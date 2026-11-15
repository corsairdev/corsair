import { z } from 'zod';

// ── Base Models ─────────────────────────────────────────────────────────────

// passthrough because Gleap tickets contain dynamic customData, attributes and formData
export const TicketSchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		ticketNumber: z.union([z.number(), z.string()]).nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		priority: z.string().nullish(),
		// unknown because session can be a string session ID or an expanded session object
		session: z.unknown().optional(),
		project: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		// unknown because customData contains dynamic customer-defined fields
		customData: z.record(z.string(), z.unknown()).optional(),
		// unknown because formData contains dynamic form submissions
		formData: z.record(z.string(), z.unknown()).optional(),
		// unknown because attributes contains dynamic ticket attributes
		attributes: z.record(z.string(), z.unknown()).optional(),
		// unknown because list responses expand the assignee to a user object, other routes send its id
		processingUser: z.unknown().optional(),
		// unknown because the team is an id or an expanded team object depending on the route
		processingTeam: z.unknown().optional(),
		slaBreached: z.boolean().nullish(),
		snoozed: z.boolean().nullish(),
		snoozedUntil: z.string().nullish(),
		// unknown because mentions and linked tickets are ids or expanded documents
		mentions: z.array(z.unknown()).nullish(),
		// unknown because mentions and linked tickets are ids or expanded documents
		linkedTickets: z.array(z.unknown()).nullish(),
	})
	.passthrough();

export type Ticket = z.infer<typeof TicketSchema>;

// passthrough because Gleap message attachments and actions have extensible properties
export const MessageSchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		// unknown because the ticket is an id or an expanded ticket object
		ticket: z.unknown().optional(),
		// unknown because list responses expand the author to a user object
		user: z.unknown().optional(),
		// unknown because the contact is an id or an expanded session object
		session: z.unknown().optional(),
		// unknown because comment can be a string or a TipTap JSON node object
		comment: z.unknown().optional(),
		markdownComment: z.string().nullish(),
		type: z.string().nullish(),
		isNote: z.boolean().nullish(),
		bot: z.boolean().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		attachments: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						url: z.string().nullish(),
						type: z.string().nullish(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

export type Message = z.infer<typeof MessageSchema>;

// passthrough because Gleap session contacts contain arbitrary custom customer data
export const SessionSchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		userId: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		value: z.number().nullish(),
		plan: z.string().nullish(),
		// unknown because customData holds user-defined key-value attributes
		customData: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.passthrough();

export type Session = z.infer<typeof SessionSchema>;

// passthrough because user profiles include project-specific roles and avatar URLs
export const UserSchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		role: z.string().nullish(),
		imageUrl: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.passthrough();

export type User = z.infer<typeof UserSchema>;

// passthrough because survey definitions have extensible blocks and rules
export const SurveySchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		name: z.string().nullish(),
		title: z.string().nullish(),
		status: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.passthrough();

export type Survey = z.infer<typeof SurveySchema>;

// passthrough because team configurations have extensible SLA options and working hours
export const TeamSchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		name: z.string().nullish(),
		assignmentMethod: z.string().nullish(),
		// unknown because members are user ids or expanded user objects
		members: z.array(z.unknown()).nullish(),
	})
	.passthrough();

export type Team = z.infer<typeof TeamSchema>;

// passthrough because boards contain column lanes and rendering rules
export const BoardSchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		path: z.string().nullish(),
		restrictedToUsers: z.array(z.string()).nullish(),
	})
	.passthrough();

export type Board = z.infer<typeof BoardSchema>;

// passthrough because company objects can store custom billing and tracking data
export const CompanySchema = z
	.object({
		id: z.string().nullish(),
		_id: z.string().nullish(),
		companyId: z.string().nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		plan: z.string().nullish(),
		value: z.number().nullish(),
	})
	.passthrough();

export type Company = z.infer<typeof CompanySchema>;

// ── Tickets Endpoints ───────────────────────────────────────────────────────

export const TicketsListInputSchema = z.object({
	type: z.string().optional(),
	status: z.string().optional(),
	priority: z.string().optional(),
	ignoreArchived: z.boolean().optional(),
	archived: z.boolean().optional(),
	isSpam: z.boolean().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	updatedAt: z.string().optional(),
	createdAt: z.string().optional(),
	sort: z.string().optional(),
	skip: z.number().optional(),
	limit: z.number().optional(),
	project: z.string().optional(),
});
export type TicketsListInput = z.infer<typeof TicketsListInputSchema>;
export const TicketsListOutputSchema = z.union([
	z.array(TicketSchema),
	// the documented shape: { tickets: [...], count }
	z
		.object({
			tickets: z.array(TicketSchema),
			count: z.number().nullish(),
		})
		.passthrough(),
	z
		.object({
			items: z.array(TicketSchema),
			total: z.number().nullish(),
		})
		.passthrough(),
]);
export type TicketsListOutput = z.infer<typeof TicketsListOutputSchema>;

export const TicketsGetInputSchema = z.object({
	ticketId: z.string().min(1, 'ticketId is required'),
	project: z.string().optional(),
});
export type TicketsGetInput = z.infer<typeof TicketsGetInputSchema>;
export const TicketsGetOutputSchema = TicketSchema;
export type TicketsGetOutput = z.infer<typeof TicketsGetOutputSchema>;

export const TicketsCreateInputSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
	priority: z.string().optional(),
	session: z.string().optional(),
	sourceTicketId: z.string().optional(),
	conversationClosed: z.boolean().optional(),
	// unknown because customData holds user-defined fields
	customData: z.record(z.string(), z.unknown()).optional(),
	// unknown because formData holds form answer fields
	formData: z.record(z.string(), z.unknown()).optional(),
	// unknown because attributes holds custom ticket attributes
	attributes: z.record(z.string(), z.unknown()).optional(),
	linkedTickets: z.array(z.string()).optional(),
	project: z.string().optional(),
});
export type TicketsCreateInput = z.infer<typeof TicketsCreateInputSchema>;
export const TicketsCreateOutputSchema = TicketSchema;
export type TicketsCreateOutput = z.infer<typeof TicketsCreateOutputSchema>;

export const TicketsUpdateInputSchema = z.object({
	ticketId: z.string().min(1, 'ticketId is required'),
	title: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
	priority: z.string().optional(),
	processingUser: z.string().nullable().optional(),
	processingTeam: z.string().nullable().optional(),
	snoozed: z.boolean().optional(),
	snoozedUntil: z.string().nullable().optional(),
	slaBreached: z.boolean().optional(),
	// unknown because customData holds user-defined fields
	customData: z.record(z.string(), z.unknown()).optional(),
	project: z.string().optional(),
});
export type TicketsUpdateInput = z.infer<typeof TicketsUpdateInputSchema>;
export const TicketsUpdateOutputSchema = TicketSchema;
export type TicketsUpdateOutput = z.infer<typeof TicketsUpdateOutputSchema>;

export const TicketsDeleteInputSchema = z.object({
	ticketId: z.string().min(1, 'ticketId is required'),
	project: z.string().optional(),
});
export type TicketsDeleteInput = z.infer<typeof TicketsDeleteInputSchema>;
// passthrough because provider responds with an empty or status JSON object
export const TicketsDeleteOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type TicketsDeleteOutput = z.infer<typeof TicketsDeleteOutputSchema>;

export const TicketsSearchInputSchema = z.object({
	searchTerm: z.string().min(1).max(100),
	type: z.string().optional(),
	status: z.string().optional(),
	archived: z.boolean().optional(),
	addSession: z.boolean().optional(),
	project: z.string().optional(),
});
export type TicketsSearchInput = z.infer<typeof TicketsSearchInputSchema>;
// passthrough because search hits include relevance scores and highlight fragments
export const TicketsSearchOutputSchema = z
	.object({
		hits: z
			.array(
				z
					.object({
						ticket: TicketSchema.optional(),
						score: z.number().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type TicketsSearchOutput = z.infer<typeof TicketsSearchOutputSchema>;

export const TicketsCountsInputSchema = z.object({
	project: z.string().optional(),
});
export type TicketsCountsInput = z.infer<typeof TicketsCountsInputSchema>;
// passthrough because count metrics group by board and lane identifiers
export const TicketsCountsOutputSchema = z.union([
	// the documented shape: [{ _id: 'OPEN', count: 12 }, ...]
	z.array(
		z
			.object({
				_id: z.string().nullish(),
				count: z.number(),
			})
			.passthrough(),
	),
	z.record(z.string(), z.number()),
	z
		.object({
			counts: z.record(z.string(), z.number()).optional(),
		})
		.passthrough(),
]);
export type TicketsCountsOutput = z.infer<typeof TicketsCountsOutputSchema>;

// ── Messages Endpoints ──────────────────────────────────────────────────────

export const MessagesListInputSchema = z.object({
	ticket: z.string().optional(),
	paginated: z.boolean().optional(),
	before: z.string().optional(),
	limit: z.number().optional(),
	skip: z.number().optional(),
	project: z.string().optional(),
});
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;
export const MessagesListOutputSchema = z.union([
	z.array(MessageSchema),
	z
		.object({
			items: z.array(MessageSchema),
			hasMore: z.boolean().nullish(),
			nextBefore: z.string().nullish(),
		})
		.passthrough(),
]);
export type MessagesListOutput = z.infer<typeof MessagesListOutputSchema>;

export const MessagesCreateInputSchema = z.object({
	ticket: z.string().min(1, 'ticket is required'),
	comment: z.string().optional(),
	markdownComment: z.string().optional(),
	type: z.string().optional(),
	isNote: z.boolean().optional(),
	replyTo: z.string().optional(),
	project: z.string().optional(),
});
export type MessagesCreateInput = z.infer<typeof MessagesCreateInputSchema>;
export const MessagesCreateOutputSchema = MessageSchema;
export type MessagesCreateOutput = z.infer<typeof MessagesCreateOutputSchema>;

// Gleap keeps only `data` on update and replaces it wholesale, so the new text is required:
// sending no content would erase the message.
export const MessagesUpdateInputSchema = z.object({
	messageId: z.string().min(1, 'messageId is required'),
	comment: z.string().min(1, 'comment (the new message text) is required'),
	project: z.string().optional(),
});
export type MessagesUpdateInput = z.infer<typeof MessagesUpdateInputSchema>;
export const MessagesUpdateOutputSchema = MessageSchema;
export type MessagesUpdateOutput = z.infer<typeof MessagesUpdateOutputSchema>;

export const MessagesDeleteInputSchema = z.object({
	messageId: z.string().min(1, 'messageId is required'),
	project: z.string().optional(),
});
export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;
// passthrough because deletion responds with empty or confirmation status
export const MessagesDeleteOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type MessagesDeleteOutput = z.infer<typeof MessagesDeleteOutputSchema>;

export const MessagesGetThreadInputSchema = z.object({
	messageId: z.string().min(1, 'messageId is required'),
	before: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
	project: z.string().optional(),
});
export type MessagesGetThreadInput = z.infer<
	typeof MessagesGetThreadInputSchema
>;
export const MessagesGetThreadOutputSchema = z.union([
	// the documented shape: { items, hasMore, nextBefore }
	z
		.object({
			items: z.array(MessageSchema),
			hasMore: z.boolean().nullish(),
			nextBefore: z.string().nullish(),
		})
		.passthrough(),
	z.array(MessageSchema),
	z
		.object({
			messages: z.array(MessageSchema),
		})
		.passthrough(),
]);
export type MessagesGetThreadOutput = z.infer<
	typeof MessagesGetThreadOutputSchema
>;

export const MessagesCreateThreadInputSchema = z.object({
	messageId: z.string().min(1, 'messageId is required'),
	comment: z.string().min(1, 'comment (the reply text) is required'),
	project: z.string().optional(),
});
export type MessagesCreateThreadInput = z.infer<
	typeof MessagesCreateThreadInputSchema
>;
export const MessagesCreateThreadOutputSchema = MessageSchema;
export type MessagesCreateThreadOutput = z.infer<
	typeof MessagesCreateThreadOutputSchema
>;

// ── Sessions / Contacts Endpoints ───────────────────────────────────────────

export const SessionsListInputSchema = z.object({
	skip: z.number().optional(),
	limit: z.number().optional(),
	sort: z.string().optional(),
	project: z.string().optional(),
});
export type SessionsListInput = z.infer<typeof SessionsListInputSchema>;
export const SessionsListOutputSchema = z.union([
	z.array(SessionSchema),
	z
		.object({
			sessions: z.array(SessionSchema),
			total: z.number().optional(),
		})
		.passthrough(),
]);
export type SessionsListOutput = z.infer<typeof SessionsListOutputSchema>;

export const SessionsGetInputSchema = z.object({
	sessionId: z.string().min(1, 'sessionId is required'),
	project: z.string().optional(),
});
export type SessionsGetInput = z.infer<typeof SessionsGetInputSchema>;
export const SessionsGetOutputSchema = SessionSchema;
export type SessionsGetOutput = z.infer<typeof SessionsGetOutputSchema>;

export const SessionsGetByUserIdInputSchema = z.object({
	userId: z.string().min(1, 'userId is required'),
	project: z.string().optional(),
});
export type SessionsGetByUserIdInput = z.infer<
	typeof SessionsGetByUserIdInputSchema
>;
export const SessionsGetByUserIdOutputSchema = SessionSchema;
export type SessionsGetByUserIdOutput = z.infer<
	typeof SessionsGetByUserIdOutputSchema
>;

export const SessionsCreateInputSchema = z.object({
	userId: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	value: z.number().optional(),
	plan: z.string().optional(),
	// unknown because customData holds arbitrary customer attributes
	customData: z.record(z.string(), z.unknown()).optional(),
	project: z.string().optional(),
});
export type SessionsCreateInput = z.infer<typeof SessionsCreateInputSchema>;
export const SessionsCreateOutputSchema = SessionSchema;
export type SessionsCreateOutput = z.infer<typeof SessionsCreateOutputSchema>;

export const SessionsUpdateInputSchema = z.object({
	sessionId: z.string().min(1, 'sessionId is required'),
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	value: z.number().optional(),
	plan: z.string().optional(),
	// unknown because customData holds arbitrary customer attributes
	customData: z.record(z.string(), z.unknown()).optional(),
	project: z.string().optional(),
});
export type SessionsUpdateInput = z.infer<typeof SessionsUpdateInputSchema>;
export const SessionsUpdateOutputSchema = SessionSchema;
export type SessionsUpdateOutput = z.infer<typeof SessionsUpdateOutputSchema>;

export const SessionsDeleteInputSchema = z.object({
	sessionId: z.string().min(1, 'sessionId is required'),
	project: z.string().optional(),
});
export type SessionsDeleteInput = z.infer<typeof SessionsDeleteInputSchema>;
// passthrough because deletion responds with confirmation or empty body
export const SessionsDeleteOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type SessionsDeleteOutput = z.infer<typeof SessionsDeleteOutputSchema>;

export const SessionsSearchInputSchema = z.object({
	// Gleap returns an empty list for terms shorter than 3 characters
	searchTerm: z.string().min(1, 'searchTerm is required'),
	project: z.string().optional(),
});
export type SessionsSearchInput = z.infer<typeof SessionsSearchInputSchema>;
export const SessionsSearchOutputSchema = z.union([
	z.array(SessionSchema),
	z
		.object({
			results: z.array(SessionSchema),
		})
		.passthrough(),
]);
export type SessionsSearchOutput = z.infer<typeof SessionsSearchOutputSchema>;

export const SessionsActivitiesInputSchema = z.object({
	sessionId: z.string().min(1, 'sessionId is required'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Activities per page (Gleap default 50)'),
	skip: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Activities to skip, newest first (Gleap default 0)'),
	project: z.string().optional(),
});
export type SessionsActivitiesInput = z.infer<
	typeof SessionsActivitiesInputSchema
>;
// passthrough because session activity logs have polymorphic event shapes
export const SessionsActivitiesOutputSchema = z.union([
	z.array(
		z
			.object({
				id: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	),
	z
		.object({
			// unknown because activities array items have diverse timeline event schemas
			activities: z.array(z.unknown()),
		})
		.passthrough(),
]);
export type SessionsActivitiesOutput = z.infer<
	typeof SessionsActivitiesOutputSchema
>;

// ── Users Endpoints ─────────────────────────────────────────────────────────

export const UsersGetMeInputSchema = z.object({});
export type UsersGetMeInput = z.infer<typeof UsersGetMeInputSchema>;
export const UsersGetMeOutputSchema = UserSchema;
export type UsersGetMeOutput = z.infer<typeof UsersGetMeOutputSchema>;

export const UsersListInputSchema = z.object({
	project: z.string().optional(),
});
export type UsersListInput = z.infer<typeof UsersListInputSchema>;
export const UsersListOutputSchema = z.array(UserSchema);
export type UsersListOutput = z.infer<typeof UsersListOutputSchema>;

// Gleap ignores the path id and only updates the API key's own user profile.
export const UsersUpdateInputSchema = z.object({
	userId: z.string().min(1, 'userId is required'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	jobTitle: z.string().optional(),
	department: z.string().optional(),
	phone: z.string().optional(),
	available: z.boolean().optional(),
	awayUntil: z.string().optional(),
});
export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;
export const UsersUpdateOutputSchema = UserSchema;
export type UsersUpdateOutput = z.infer<typeof UsersUpdateOutputSchema>;

// ── Feedback & Ratings Endpoints ────────────────────────────────────────────

export const FeedbackRateConversationInputSchema = z.object({
	conversationId: z.string().min(1, 'conversationId is required'),
	rating: z.number().int().min(0).max(10),
});
export type FeedbackRateConversationInput = z.infer<
	typeof FeedbackRateConversationInputSchema
>;
// passthrough because rating responses return provider acknowledgement payloads
export const FeedbackRateConversationOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type FeedbackRateConversationOutput = z.infer<
	typeof FeedbackRateConversationOutputSchema
>;

export const FeedbackRateMessageInputSchema = z.object({
	messageId: z.string().min(1, 'messageId is required'),
	rating: z.enum(['positive', 'negative']),
});
export type FeedbackRateMessageInput = z.infer<
	typeof FeedbackRateMessageInputSchema
>;
// passthrough because message rating returns provider confirmation object
export const FeedbackRateMessageOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type FeedbackRateMessageOutput = z.infer<
	typeof FeedbackRateMessageOutputSchema
>;

export const FeedbackSurveysListInputSchema = z.object({
	skip: z.number().optional(),
	limit: z.number().optional(),
	sort: z.string().optional(),
	project: z.string().optional(),
});
export type FeedbackSurveysListInput = z.infer<
	typeof FeedbackSurveysListInputSchema
>;
export const FeedbackSurveysListOutputSchema = z.union([
	z.array(SurveySchema),
	z
		.object({
			items: z.array(SurveySchema),
		})
		.passthrough(),
]);
export type FeedbackSurveysListOutput = z.infer<
	typeof FeedbackSurveysListOutputSchema
>;

export const FeedbackSurveysGetInputSchema = z.object({
	surveyId: z.string().min(1, 'surveyId is required'),
	project: z.string().optional(),
});
export type FeedbackSurveysGetInput = z.infer<
	typeof FeedbackSurveysGetInputSchema
>;
export const FeedbackSurveysGetOutputSchema = SurveySchema;
export type FeedbackSurveysGetOutput = z.infer<
	typeof FeedbackSurveysGetOutputSchema
>;

export const FeedbackSurveysResponsesInputSchema = z.object({
	surveyId: z.string().min(1, 'surveyId is required'),
	skip: z.number().optional(),
	limit: z.number().optional(),
	project: z.string().optional(),
});
export type FeedbackSurveysResponsesInput = z.infer<
	typeof FeedbackSurveysResponsesInputSchema
>;
// passthrough because survey answers have arbitrary question ID keys
export const FeedbackSurveysResponsesOutputSchema = z.union([
	z.array(
		z
			.object({
				id: z.string().optional(),
				// unknown because answers map directly to survey question fields
				answers: z.unknown().optional(),
			})
			.passthrough(),
	),
	z
		.object({
			// unknown because survey response items contain variable response formats
			items: z.array(z.unknown()),
		})
		.passthrough(),
]);
export type FeedbackSurveysResponsesOutput = z.infer<
	typeof FeedbackSurveysResponsesOutputSchema
>;

export const FeedbackSurveysStatsInputSchema = z.object({
	surveyId: z.string().min(1, 'surveyId is required'),
	from: z.string().optional(),
	to: z.string().optional(),
	version: z.string().optional(),
	project: z.string().optional(),
});
export type FeedbackSurveysStatsInput = z.infer<
	typeof FeedbackSurveysStatsInputSchema
>;
// passthrough because survey stats return breakdown metrics per question block
export const FeedbackSurveysStatsOutputSchema = z
	.object({
		version: z.string().optional(),
		totals: z
			.object({
				shown: z.number().optional(),
				started: z.number().optional(),
				completed: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type FeedbackSurveysStatsOutput = z.infer<
	typeof FeedbackSurveysStatsOutputSchema
>;

// ── Teams Endpoints ─────────────────────────────────────────────────────────

export const TeamsListInputSchema = z.object({
	project: z.string().optional(),
});
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;
export const TeamsListOutputSchema = z.array(TeamSchema);
export type TeamsListOutput = z.infer<typeof TeamsListOutputSchema>;

const TeamAssignmentMethodSchema = z.enum([
	'random',
	'balanced',
	'manual',
	'circular',
]);

// Gleap requires name, assignmentMethod and members (user ids, may be empty) on create and update.
export const TeamsCreateInputSchema = z.object({
	name: z.string().min(1, 'name is required'),
	assignmentMethod: TeamAssignmentMethodSchema,
	members: z.array(z.string()),
	project: z.string().optional(),
});
export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;
export const TeamsCreateOutputSchema = TeamSchema;
export type TeamsCreateOutput = z.infer<typeof TeamsCreateOutputSchema>;

export const TeamsUpdateInputSchema = z.object({
	teamId: z.string().min(1, 'teamId is required'),
	name: z.string().min(1, 'name is required'),
	assignmentMethod: TeamAssignmentMethodSchema,
	members: z.array(z.string()),
	project: z.string().optional(),
});
export type TeamsUpdateInput = z.infer<typeof TeamsUpdateInputSchema>;
export const TeamsUpdateOutputSchema = TeamSchema;
export type TeamsUpdateOutput = z.infer<typeof TeamsUpdateOutputSchema>;

export const TeamsDeleteInputSchema = z.object({
	teamId: z.string().min(1, 'teamId is required'),
	project: z.string().optional(),
});
export type TeamsDeleteInput = z.infer<typeof TeamsDeleteInputSchema>;
// passthrough because team deletion returns empty or confirmation payload
export const TeamsDeleteOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type TeamsDeleteOutput = z.infer<typeof TeamsDeleteOutputSchema>;

// ── Boards (Ticket Types) Endpoints ─────────────────────────────────────────

export const BoardsListInputSchema = z.object({
	project: z.string().optional(),
});
export type BoardsListInput = z.infer<typeof BoardsListInputSchema>;
export const BoardsListOutputSchema = z.array(BoardSchema);
export type BoardsListOutput = z.infer<typeof BoardsListOutputSchema>;

export const BoardsCreateInputSchema = z.object({
	name: z.string().min(1, 'name is required'),
	restrictedToUsers: z.array(z.string()).optional(),
	restrictedToTeams: z.array(z.string()).optional(),
	project: z.string().optional(),
});
export type BoardsCreateInput = z.infer<typeof BoardsCreateInputSchema>;
export const BoardsCreateOutputSchema = BoardSchema;
export type BoardsCreateOutput = z.infer<typeof BoardsCreateOutputSchema>;

export const BoardsUpdateInputSchema = z.object({
	type: z.string().min(1, 'type is required'),
	name: z.string().optional(),
	project: z.string().optional(),
});
export type BoardsUpdateInput = z.infer<typeof BoardsUpdateInputSchema>;
export const BoardsUpdateOutputSchema = BoardSchema;
export type BoardsUpdateOutput = z.infer<typeof BoardsUpdateOutputSchema>;

export const BoardsDeleteInputSchema = z.object({
	type: z.string().min(1, 'type is required'),
	project: z.string().optional(),
});
export type BoardsDeleteInput = z.infer<typeof BoardsDeleteInputSchema>;
// passthrough because board deletion returns empty body or status
export const BoardsDeleteOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type BoardsDeleteOutput = z.infer<typeof BoardsDeleteOutputSchema>;

// ── Companies Endpoints ─────────────────────────────────────────────────────

export const CompaniesListInputSchema = z.object({
	skip: z.number().optional(),
	limit: z.number().optional(),
	search: z.string().optional(),
	project: z.string().optional(),
});
export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;
export const CompaniesListOutputSchema = z.union([
	z.array(CompanySchema),
	z
		.object({
			companies: z.array(CompanySchema),
		})
		.passthrough(),
]);
export type CompaniesListOutput = z.infer<typeof CompaniesListOutputSchema>;

export const CompaniesGetInputSchema = z.object({
	companyId: z.string().min(1, 'companyId is required'),
	project: z.string().optional(),
});
export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;
export const CompaniesGetOutputSchema = CompanySchema;
export type CompaniesGetOutput = z.infer<typeof CompaniesGetOutputSchema>;

export const CompaniesCreateOrUpdateInputSchema = z.object({
	companyId: z.string().min(1, 'companyId is required'),
	name: z.string().optional(),
	domain: z.string().optional(),
	plan: z.string().optional(),
	value: z.number().optional(),
	// unknown because customData holds company custom attributes
	customData: z.record(z.string(), z.unknown()).optional(),
	project: z.string().optional(),
});
export type CompaniesCreateOrUpdateInput = z.infer<
	typeof CompaniesCreateOrUpdateInputSchema
>;
export const CompaniesCreateOrUpdateOutputSchema = CompanySchema;
export type CompaniesCreateOrUpdateOutput = z.infer<
	typeof CompaniesCreateOrUpdateOutputSchema
>;

export const CompaniesDeleteInputSchema = z.object({
	companyId: z.string().min(1, 'companyId is required'),
	project: z.string().optional(),
});
export type CompaniesDeleteInput = z.infer<typeof CompaniesDeleteInputSchema>;
// passthrough because deletion returns confirmation or empty payload
export const CompaniesDeleteOutputSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();
export type CompaniesDeleteOutput = z.infer<typeof CompaniesDeleteOutputSchema>;

// ── Registry Maps ───────────────────────────────────────────────────────────

export const GleapEndpointInputSchemas = {
	ticketsList: TicketsListInputSchema,
	ticketsGet: TicketsGetInputSchema,
	ticketsCreate: TicketsCreateInputSchema,
	ticketsUpdate: TicketsUpdateInputSchema,
	ticketsDelete: TicketsDeleteInputSchema,
	ticketsSearch: TicketsSearchInputSchema,
	ticketsCounts: TicketsCountsInputSchema,

	messagesList: MessagesListInputSchema,
	messagesCreate: MessagesCreateInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	messagesGetThread: MessagesGetThreadInputSchema,
	messagesCreateThread: MessagesCreateThreadInputSchema,

	sessionsList: SessionsListInputSchema,
	sessionsGet: SessionsGetInputSchema,
	sessionsGetByUserId: SessionsGetByUserIdInputSchema,
	sessionsCreate: SessionsCreateInputSchema,
	sessionsUpdate: SessionsUpdateInputSchema,
	sessionsDelete: SessionsDeleteInputSchema,
	sessionsSearch: SessionsSearchInputSchema,
	sessionsActivities: SessionsActivitiesInputSchema,

	usersGetMe: UsersGetMeInputSchema,
	usersList: UsersListInputSchema,
	usersUpdate: UsersUpdateInputSchema,

	feedbackRateConversation: FeedbackRateConversationInputSchema,
	feedbackRateMessage: FeedbackRateMessageInputSchema,
	feedbackSurveysList: FeedbackSurveysListInputSchema,
	feedbackSurveysGet: FeedbackSurveysGetInputSchema,
	feedbackSurveysResponses: FeedbackSurveysResponsesInputSchema,
	feedbackSurveysStats: FeedbackSurveysStatsInputSchema,

	teamsList: TeamsListInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsDelete: TeamsDeleteInputSchema,

	boardsList: BoardsListInputSchema,
	boardsCreate: BoardsCreateInputSchema,
	boardsUpdate: BoardsUpdateInputSchema,
	boardsDelete: BoardsDeleteInputSchema,

	companiesList: CompaniesListInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesCreateOrUpdate: CompaniesCreateOrUpdateInputSchema,
	companiesDelete: CompaniesDeleteInputSchema,
} as const;

export type GleapEndpointInputs = {
	[K in keyof typeof GleapEndpointInputSchemas]: z.infer<
		(typeof GleapEndpointInputSchemas)[K]
	>;
};

export const GleapEndpointOutputSchemas = {
	ticketsList: TicketsListOutputSchema,
	ticketsGet: TicketsGetOutputSchema,
	ticketsCreate: TicketsCreateOutputSchema,
	ticketsUpdate: TicketsUpdateOutputSchema,
	ticketsDelete: TicketsDeleteOutputSchema,
	ticketsSearch: TicketsSearchOutputSchema,
	ticketsCounts: TicketsCountsOutputSchema,

	messagesList: MessagesListOutputSchema,
	messagesCreate: MessagesCreateOutputSchema,
	messagesUpdate: MessagesUpdateOutputSchema,
	messagesDelete: MessagesDeleteOutputSchema,
	messagesGetThread: MessagesGetThreadOutputSchema,
	messagesCreateThread: MessagesCreateThreadOutputSchema,

	sessionsList: SessionsListOutputSchema,
	sessionsGet: SessionsGetOutputSchema,
	sessionsGetByUserId: SessionsGetByUserIdOutputSchema,
	sessionsCreate: SessionsCreateOutputSchema,
	sessionsUpdate: SessionsUpdateOutputSchema,
	sessionsDelete: SessionsDeleteOutputSchema,
	sessionsSearch: SessionsSearchOutputSchema,
	sessionsActivities: SessionsActivitiesOutputSchema,

	usersGetMe: UsersGetMeOutputSchema,
	usersList: UsersListOutputSchema,
	usersUpdate: UsersUpdateOutputSchema,

	feedbackRateConversation: FeedbackRateConversationOutputSchema,
	feedbackRateMessage: FeedbackRateMessageOutputSchema,
	feedbackSurveysList: FeedbackSurveysListOutputSchema,
	feedbackSurveysGet: FeedbackSurveysGetOutputSchema,
	feedbackSurveysResponses: FeedbackSurveysResponsesOutputSchema,
	feedbackSurveysStats: FeedbackSurveysStatsOutputSchema,

	teamsList: TeamsListOutputSchema,
	teamsCreate: TeamsCreateOutputSchema,
	teamsUpdate: TeamsUpdateOutputSchema,
	teamsDelete: TeamsDeleteOutputSchema,

	boardsList: BoardsListOutputSchema,
	boardsCreate: BoardsCreateOutputSchema,
	boardsUpdate: BoardsUpdateOutputSchema,
	boardsDelete: BoardsDeleteOutputSchema,

	companiesList: CompaniesListOutputSchema,
	companiesGet: CompaniesGetOutputSchema,
	companiesCreateOrUpdate: CompaniesCreateOrUpdateOutputSchema,
	companiesDelete: CompaniesDeleteOutputSchema,
} as const;

export type GleapEndpointOutputs = {
	[K in keyof typeof GleapEndpointOutputSchemas]: z.infer<
		(typeof GleapEndpointOutputSchemas)[K]
	>;
};
