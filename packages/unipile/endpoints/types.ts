import { z } from 'zod';

// Shapes follow the official Unipile v2 SDK (unipile-node types.gen.ts, API
// 2.62) and https://developer.unipile.com/v2.0/reference. Unipile v2 is in
// beta and adds fields often, so response objects type the fields an agent
// uses and pass everything else through (`.loose()`); optional fields accept
// null. Inputs mirror the API's snake_case names so Unipile's docs apply as is.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();
const strList = z.array(z.string()).nullish();
// unknown: attachments, event metadata and provider `specifics` differ per
// provider and message kind; they are passed through as returned.
const looseList = z.array(z.unknown()).nullish();
const looseRecord = z.record(z.string(), z.unknown()).nullish();

// ── Shared inputs ─────────────────────────────────────────────────────────

const AccountId = z
	.string()
	.min(1)
	.describe(
		'Unipile account ID (acc_…) of the connected account to act as, from accounts.list',
	);

const UserId = z
	.string()
	.min(1)
	.describe(
		'Provider user ID. For LinkedIn, the member ID (ACo…) or public identifier from a profile URL; `me` is the account owner',
	);

const MeUserId = UserId.default('me');

const OffsetCursorPage = {
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Offset pagination: add the previous limit to get the next page. Use `cursor` instead when the previous page returned next_cursor',
		),
	cursor: z
		.string()
		.optional()
		.describe(
			'next_cursor from the previous page. Send it alone, without offset',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			"Page size. Leave unset to use the provider's own page size, which Unipile recommends",
		),
};

const OffsetPage = {
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Number of items to skip'),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Number of items to return'),
};

const Provider = z.enum([
	'linkedin',
	'mock',
	'whatsapp',
	'google',
	'outlook',
	'imap',
	'telegram',
	'instagram',
]);

const AccountStatus = z.enum([
	'running',
	'errored',
	'disconnected',
	'degraded',
	'partial',
]);

export const WebhookEventTypes = [
	'account.status.disconnected',
	'account.status.running',
	'account.status.errored',
	'account.status.degraded',
	'account.status.partial',
	'account.locked',
	'account.unlocked',
	'account.add',
	'account.reconnect',
	'account.remove',
	'account.initial_sync.running',
	'account.initial_sync.failed',
	'account.initial_sync.completed',
	'message.new',
	'message.update',
	'message.delete',
	'message.receipt.read',
	'message.receipt.delivery',
	'message.reaction.new',
	'message.reaction.delete',
	'chat.delete',
	'chat.update',
	'email.new',
	'email.new.bounce',
	'email.delete',
	'email.draft.new',
	'email.draft.delete',
	'email.folder.create',
	'email.folder.update',
	'email.folder.delete',
	'calendar.create',
	'calendar.update',
	'calendar.delete',
	'calendar.event.new',
	'calendar.event.update',
	'calendar.event.delete',
	'tracking.open',
	'tracking.click',
	'relation.new',
	'follower.new',
] as const;

const WebhookEventType = z.enum(WebhookEventTypes);

const Attachment = z.object({
	filename: z.string().min(1),
	content: z.string().min(1).describe('File content encoded as base64'),
	content_type: z.string().min(1).describe('MIME type, e.g. application/pdf'),
	send_mode: z
		.enum(['file', 'native'])
		.optional()
		.describe(
			"`native` sends media as the provider's own kind (picture, voice note); `file` as an uploaded file",
		),
});

// ── Shared outputs ────────────────────────────────────────────────────────

const UserSchema = z
	.object({
		id: z.string(),
		object: str,
		type: str,
		public_identifier: str,
		display_name: str,
		first_name: str,
		last_name: str,
		profile_url: str,
		public_picture_url: str,
		description: str.describe('Headline on LinkedIn'),
		specifics: z
			.object({
				location: str,
				network_distance: str.describe(
					'SELF, FIRST_DEGREE, SECOND_DEGREE, THIRD_DEGREE or OUT_OF_NETWORK',
				),
				industry: str,
				is_following: bool,
				followers_count: num,
				relations_count: num,
				shared_relations_count: num,
				is_premium: bool,
				is_verified: bool,
			})
			.loose()
			.nullish(),
	})
	.loose();

const AccountSchema = z
	.object({
		object: str,
		id: z.string(),
		name: str,
		user_id: str.describe("The owner's user ID on the provider"),
		provider: z.string(),
		status: z
			.string()
			.describe(
				'running, errored, disconnected (needs re-authentication), degraded or partial',
			),
		is_locked: bool,
		created_at: str,
		application_id: str,
		account_scope_id: str,
		metadata: z
			.object({
				connection_method: str.describe('credentials, cookies or unilogin'),
				products_connection_status: z.record(z.string(), z.string()).nullish(),
				custom_data: z.record(z.string(), z.string()).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const RelationRequestSchema = z
	.object({
		object: str,
		id: z.string(),
		type: z.string().describe('sent or received'),
		created_at: str,
		message: str,
		user: UserSchema.nullish(),
	})
	.loose();

const UserRelationSchema = z
	.object({
		object: str,
		id: z.string(),
		created_at: str,
		user: UserSchema,
	})
	.loose();

const MessageSchema = z
	.object({
		object: str,
		id: z.string(),
		chat_id: z.string(),
		sender_id: z.string(),
		text: str,
		timestamp: z.string(),
		is_sender: bool.describe('True when the connected account sent it'),
		is_seen: bool,
		is_delivered: bool,
		is_deleted: bool,
		is_edited: bool,
		is_event: bool,
		provider: str,
		attachments: looseList,
		sender: UserSchema.nullish(),
		quoted: looseRecord,
	})
	.loose();

const ChatSchema = z
	.object({
		object: str,
		id: z.string(),
		name: str,
		type: str.describe('1to1, group or channel'),
		provider: str,
		created_at: str,
		updated_at: str,
		last_message_timestamp: str,
		unread_count: num,
		is_archived: bool,
		is_readonly: bool,
		is_group: bool,
		is_1to1: bool,
		participants_count: num,
		restrictions: strList,
		folders: strList,
		user: UserSchema.nullish(),
		participants: z.array(UserSchema).nullish(),
		// unknown: the last message is either a Message or a short preview.
		last_message: looseRecord,
	})
	.loose();

const PostSchema = z
	.object({
		object: str,
		id: z.string(),
		share_url: str,
		created_at: str,
		title: str,
		text: str,
		author: UserSchema.nullish(),
		is_repost: bool,
		comments_counter: num,
		reposts_counter: num,
		reactions_counter: z
			.array(z.object({ reaction: z.string(), count: z.number() }).loose())
			.nullish(),
		attachments: looseList,
	})
	.loose();

const ReactionSchema = z
	.object({
		object: str,
		value: z.string().describe('Reaction kind, e.g. LIKE or PRAISE'),
		is_sender: bool,
		sender: UserSchema,
	})
	.loose();

const CommentSchema = z
	.object({
		object: str,
		id: z.string(),
		thread_id: str,
		created_at: str,
		text: str,
		is_sender: bool,
		reply_counter: num,
		author: UserSchema.nullish(),
	})
	.loose();

const UserProfileSchema = z
	.object({
		object: str,
		id: z.string(),
		provider: str,
		type: str,
		public_identifier: str,
		display_name: str,
		first_name: str,
		last_name: str,
		profile_url: str,
		public_picture_url: str,
		description: str.describe('Headline on LinkedIn'),
		bio: str,
		location: str,
		followers_count: num,
		relations_count: num,
		shared_relations_count: num,
		is_premium: bool,
		is_blocked: bool,
		emails: strList,
		phone_numbers: strList,
		websites: strList,
		specifics: z
			.object({
				member_id: str,
				industry: str,
				network_distance: str.describe(
					'SELF, FIRST_DEGREE, SECOND_DEGREE, THIRD_DEGREE or OUT_OF_NETWORK',
				),
				relation_request_status: str.describe(
					'PENDING, IGNORED or WITHDRAWN when an invitation exists',
				),
				can_send_inmail: bool,
				is_open_profile: bool,
				is_premium: bool,
				is_open_to_work: bool,
				is_hiring: bool,
				notify_visit_token: str.describe('Pass to users.visitProfile'),
				experience: looseList,
				education: looseList,
				skills: looseList,
			})
			.loose()
			.nullish(),
	})
	.loose();

const WebhookEndpointFields = {
	object: str,
	id: z.string(),
	url: z.string(),
	enabled: bool,
	description: str,
	trigger_events: z.array(z.string()),
	application_id: str,
	account_ids: strList,
	account_targets: looseList,
};

// list, get and update: Unipile returns the signing secret on every read, but
// the plugin only reports whether one exists, so read access cannot leak it.
const WebhookEndpointSchema = z
	.object({
		...WebhookEndpointFields,
		secret_set: z
			.boolean()
			.describe(
				'Whether the endpoint has a signing secret. Only webhookEndpoints.create returns the secret itself',
			),
	})
	.loose();

// create: the one response that carries the secret.
const CreatedWebhookEndpointSchema = z
	.object({
		...WebhookEndpointFields,
		secret: str.describe(
			'Signing secret for the unipile-signature header. Shown only once, here: store it now as the plugin webhookSecret (or the stored webhook signature). list, get and update never return it',
		),
	})
	.loose();

function page<T extends z.ZodTypeAny>(item: T) {
	return z
		.object({
			data: z.array(item),
			total_count: num,
			next_cursor: str.describe(
				'Pass as cursor to get the next page; absent on the last page',
			),
		})
		.loose();
}

const ObjectAck = z.object({ object: z.string() }).loose();
const SuccessAck = z.object({ success: z.boolean() }).loose();

// ── accounts ──────────────────────────────────────────────────────────────

const AccountsListInputSchema = z.object({
	provider: Provider.optional(),
	status: AccountStatus.optional(),
	search: z.string().optional().describe('Match on account name or id'),
	account_scope_id: z
		.string()
		.optional()
		.describe('Scope ID, or `none` for accounts without a scope'),
	...OffsetPage,
});

const AccountsListResponseSchema = z
	.object({
		object: str,
		data: z.array(AccountSchema),
		has_more: bool,
	})
	.loose();

const AccountsGetInputSchema = z.object({ account_id: AccountId });
const AccountsRemoveInputSchema = z.object({ account_id: AccountId });

const AuthMethod = z.enum(['credentials', 'cookies', 'unilogin']);
const LinkedInProduct = z.enum([
	'classic',
	'company',
	'recruiter',
	'sales_navigator',
]);
const ProviderSelection = z.union([
	z.enum(['*', '*:MESSAGING', '*:EMAILS', '*:CALENDAR', '*:SOCIAL']),
	Provider,
	z.array(Provider).min(1),
]);

const AccountsCreateAuthLinkInputSchema = z
	.object({
		providers: ProviderSelection.optional().describe(
			'Providers to offer when linking a new account, e.g. linkedin. Omit when reconnecting with account_id',
		),
		account_id: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Reconnect or reconfigure this existing account instead of linking a new one',
			),
		expires_on: z.iso
			.datetime({ offset: true })
			.optional()
			.describe(
				'When the link stops working, ISO 8601 with a timezone. Defaults to one hour from now',
			),
		redirect_uri: z
			.string()
			.url()
			.describe(
				'Where to send the user afterwards. On success Unipile adds account_id, provider and state to the query; on failure error_title',
			),
		state: z
			.string()
			.optional()
			.describe(
				'Your own ID for this user or session. Unipile returns it on the redirect and in the account.add / account.reconnect webhook',
			),
		account_scope_id: z
			.string()
			.optional()
			.describe('Scope to assign the account to'),
		domain: z
			.string()
			.optional()
			.describe('White-label Hosted Auth hostname already verified by Unipile'),
		config: z
			.object({
				linkedin: z
					.object({
						allow_methods: z
							.array(AuthMethod)
							.min(1)
							.optional()
							.describe(
								'Sign-in methods to offer: credentials, cookies, or unilogin (the UniLogin extension connects the open browser session, no password)',
							),
						products: z
							.array(LinkedInProduct)
							.min(1)
							.optional()
							.describe(
								'LinkedIn products the account may activate. Defaults to all it subscribes to',
							),
						allow_product_selection: z
							.boolean()
							.optional()
							.describe('Show the product selection screen after sign-in'),
						auto_proxy_config: z
							.object({
								country: z
									.string()
									.length(2)
									.optional()
									.describe('ISO 3166-1 alpha-2 country for the proxy'),
								ip: z
									.string()
									.optional()
									.describe('IPv4 address to infer the proxy location from'),
								allow_country_fallback: z.boolean().optional(),
							})
							.optional(),
					})
					.optional(),
				global: z
					.object({
						login_hint: z.string().optional(),
						allow_user_proxy_override: z.boolean().optional(),
						allow_user_country_override: z.boolean().optional(),
					})
					.optional(),
			})
			// Other providers' config (google, whatsapp, …) passes through as given.
			.loose()
			.optional(),
	})
	.superRefine((value, ctx) => {
		const linking = value.providers !== undefined;
		const reconnecting = value.account_id !== undefined;
		if (linking === reconnecting) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Pass providers to link a new account, or account_id to reconnect one (not both)',
				path: linking ? ['account_id'] : ['providers'],
			});
		}
	});

const AccountsCreateAuthLinkResponseSchema = z
	.object({
		object: str,
		link: z.string().describe('Hosted Auth URL to send the user to'),
	})
	.loose();

// ── users ─────────────────────────────────────────────────────────────────

const ProfileSection = z.enum([
	'linkedin_*',
	'linkedin_experience',
	'linkedin_education',
	'linkedin_languages',
	'linkedin_skills',
	'linkedin_certifications',
	'linkedin_volunteer_experience',
	'linkedin_projects',
	'linkedin_recommendations',
	'linkedin_recruiting_activity',
	'linkedin_interests',
	'linkedin_*_preview',
	'linkedin_experience_preview',
	'linkedin_education_preview',
	'linkedin_languages_preview',
	'linkedin_skills_preview',
	'linkedin_certifications_preview',
	'linkedin_volunteer_experience_preview',
	'linkedin_projects_preview',
	'linkedin_recommendations_preview',
	'linkedin_recruiting_activity_preview',
	'linkedin_interests_preview',
]);

const UsersGetProfileInputSchema = z.object({
	account_id: AccountId,
	user_id: UserId,
	with_sections: z
		.array(ProfileSection)
		.optional()
		.describe(
			'Extra LinkedIn sections to load, e.g. linkedin_experience. Each one is another request to LinkedIn',
		),
	variant: z
		.enum([
			'linkedin_classic',
			'linkedin_recruiter',
			'linkedin_sales_navigator',
		])
		.optional()
		.describe('Which LinkedIn product to read the profile through'),
});

const UsersVisitProfileInputSchema = z.object({
	account_id: AccountId,
	token: z
		.string()
		.min(1)
		.describe('specifics.notify_visit_token from users.getProfile'),
});

const UsersVisitProfileResponseSchema = ObjectAck;

const UsersListRelationsInputSchema = z.object({
	account_id: AccountId,
	user_id: MeUserId,
	search: z.string().optional().describe('Filter relations by name'),
	...OffsetCursorPage,
});

const UsersGetChatInputSchema = z.object({
	account_id: AccountId,
	user_id: UserId,
});

const UsersGetChatResponseSchema = z
	.object({
		object: str,
		data: z.array(
			z
				.object({
					chat_id: z.string(),
					inbox_id: str,
					has_history: bool,
				})
				.loose(),
		),
	})
	.loose();

const UsersListReactionsInputSchema = z.object({
	account_id: AccountId,
	user_id: MeUserId,
	...OffsetCursorPage,
});

const UsersListCommentsInputSchema = z.object({
	account_id: AccountId,
	user_id: MeUserId,
	...OffsetCursorPage,
});

const UserReactionSchema = ReactionSchema.extend({
	parent_post: PostSchema.nullish(),
});

const UserCommentSchema = CommentSchema.extend({
	parent_post: PostSchema.nullish(),
});

// ── relationRequests ──────────────────────────────────────────────────────

const RelationRequestsListInputSchema = z.object({
	account_id: AccountId,
	type: z
		.enum(['sent', 'received'])
		.describe('sent: invitations you sent; received: invitations to you'),
	...OffsetCursorPage,
});

const RelationRequestsCreateInputSchema = z.object({
	account_id: AccountId,
	user_id: z
		.string()
		.min(1)
		.describe('LinkedIn member ID (ACo…) of the person to invite'),
	message: z
		.string()
		.min(1)
		.max(300)
		.optional()
		.describe(
			'Invitation note. LinkedIn caps it at 300 characters (200 on free accounts) and allows few notes a month on free accounts',
		),
});

const RelationRequestIdInputSchema = z.object({
	account_id: AccountId,
	request_id: z
		.string()
		.min(1)
		.describe('Relation request ID from relationRequests.list'),
});

// ── chats ─────────────────────────────────────────────────────────────────

const ChatsListInputSchema = z.object({
	account_id: AccountId,
	type: z.enum(['1to1', 'group', 'channel']).optional(),
	before: z.iso
		.datetime({ offset: true })
		.optional()
		.describe('Only chats with a last message before this date-time'),
	after: z.iso
		.datetime({ offset: true })
		.optional()
		.describe('Only chats with a last message after this date-time'),
	is_archived: z.boolean().optional(),
	is_unread: z.boolean().optional(),
	...OffsetCursorPage,
});

const ChatsGetInputSchema = z.object({
	account_id: AccountId,
	chat_id: z.string().min(1),
});

const ChatsStartInputSchema = z.object({
	account_id: AccountId,
	users_ids: z
		.union([z.string().min(1), z.array(z.string().min(1)).min(1)])
		.describe(
			'One user ID (string) starts a 1-to-1 chat; an array starts a group',
		),
	text: z
		.string()
		.describe(
			'First message. Plain text; Unipile advises against HTML or Markdown',
		),
	name: z.string().optional().describe('Group name, where allowed'),
	attachments: z.array(Attachment).optional(),
	specifics: z
		.object({
			linkedin: z
				.object({
					classic: z
						.object({
							inmail: z
								.boolean()
								.optional()
								.describe('Send as an InMail (uses InMail credits)'),
							relation_request_id: z
								.string()
								.optional()
								.describe(
									'Required to message someone whose invitation you received',
								),
							company_topic: z
								.enum([
									'SERVICE_REQUEST',
									'REQUEST_A_DEMO',
									'SUPPORT',
									'CAREERS',
									'OTHER',
								])
								.optional(),
						})
						.loose()
						.optional(),
					sales_navigator: z
						.object({ subject: z.string().min(1) })
						.loose()
						.optional(),
				})
				// recruiter options pass through as given.
				.loose()
				.optional(),
		})
		.optional(),
});

const ChatsStartResponseSchema = z
	.object({
		object: str,
		chat_id: z.string(),
		message_id: z.union([z.string(), z.array(z.string())]).nullish(),
	})
	.loose();

// ── messages ──────────────────────────────────────────────────────────────

const MessagesListInputSchema = z.object({
	account_id: AccountId,
	chat_id: z.string().min(1),
	before: z.iso.datetime({ offset: true }).optional(),
	after: z.iso.datetime({ offset: true }).optional(),
	user_id: z.string().optional().describe('Only messages from this sender'),
	...OffsetCursorPage,
});

const MessagesSendInputSchema = z.object({
	account_id: AccountId,
	chat_id: z.string().min(1),
	text: z
		.string()
		.describe('Message text. Plain text; Unipile advises against HTML'),
	quote_id: z.string().optional().describe('ID of a message to reply to'),
	attachments: z.array(Attachment).optional(),
});

const MessagesSendResponseSchema = z
	.object({
		object: str,
		message_id: z.union([z.string(), z.array(z.string())]).nullish(),
	})
	.loose();

// ── posts ─────────────────────────────────────────────────────────────────

const PostsListInputSchema = z.object({
	account_id: AccountId,
	user_id: UserId,
	...OffsetCursorPage,
});

const PostId = z
	.string()
	.min(1)
	.describe('Post ID from posts.list (Unipile post IDs, not share URLs)');

const PostsListReactionsInputSchema = z.object({
	account_id: AccountId,
	post_id: PostId,
	...OffsetCursorPage,
});

const PostsListCommentsInputSchema = z.object({
	account_id: AccountId,
	post_id: PostId,
	sort_by: z.enum(['MOST_RECENT', 'MOST_RELEVANT']).optional(),
	...OffsetCursorPage,
});

// ── webhookEndpoints ──────────────────────────────────────────────────────

const WebhookEndpointsListInputSchema = z.object({ ...OffsetPage });

const WebhookEndpointsListResponseSchema = z
	.object({
		object: str,
		data: z.array(WebhookEndpointSchema),
		has_more: bool,
	})
	.loose();

const WebhookEndpointIdInputSchema = z.object({
	id: z.string().min(1).describe('Webhook endpoint ID'),
});

const WebhookEndpointsCreateInputSchema = z.object({
	url: z.string().url().describe('HTTPS URL that receives event POSTs'),
	trigger_events: z
		.array(WebhookEventType)
		.min(1)
		.describe('Events to send, e.g. relation.new, message.new'),
	account_ids: z
		.array(z.string().min(1))
		.optional()
		.describe('Only send events from these accounts. Omit for all accounts'),
	description: z.string().optional(),
});

const WebhookEndpointsUpdateInputSchema = z.object({
	id: z.string().min(1).describe('Webhook endpoint ID'),
	url: z.string().url().optional(),
	trigger_events: z.array(WebhookEventType).min(1).optional(),
	account_ids: z.array(z.string().min(1)).optional(),
	description: z.string().optional(),
	enabled: z.boolean().optional(),
});

// ── Exports ───────────────────────────────────────────────────────────────

export const UnipileEndpointInputSchemas = {
	accountsList: AccountsListInputSchema,
	accountsGet: AccountsGetInputSchema,
	accountsRemove: AccountsRemoveInputSchema,
	accountsCreateAuthLink: AccountsCreateAuthLinkInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	usersVisitProfile: UsersVisitProfileInputSchema,
	usersListRelations: UsersListRelationsInputSchema,
	usersGetChat: UsersGetChatInputSchema,
	usersListReactions: UsersListReactionsInputSchema,
	usersListComments: UsersListCommentsInputSchema,
	relationRequestsList: RelationRequestsListInputSchema,
	relationRequestsCreate: RelationRequestsCreateInputSchema,
	relationRequestsCancel: RelationRequestIdInputSchema,
	relationRequestsAccept: RelationRequestIdInputSchema,
	chatsList: ChatsListInputSchema,
	chatsGet: ChatsGetInputSchema,
	chatsStart: ChatsStartInputSchema,
	messagesList: MessagesListInputSchema,
	messagesSend: MessagesSendInputSchema,
	postsList: PostsListInputSchema,
	postsListReactions: PostsListReactionsInputSchema,
	postsListComments: PostsListCommentsInputSchema,
	webhookEndpointsList: WebhookEndpointsListInputSchema,
	webhookEndpointsGet: WebhookEndpointIdInputSchema,
	webhookEndpointsCreate: WebhookEndpointsCreateInputSchema,
	webhookEndpointsUpdate: WebhookEndpointsUpdateInputSchema,
	webhookEndpointsDelete: WebhookEndpointIdInputSchema,
} as const;

export const UnipileEndpointOutputSchemas = {
	accountsList: AccountsListResponseSchema,
	accountsGet: AccountSchema,
	accountsRemove: SuccessAck,
	accountsCreateAuthLink: AccountsCreateAuthLinkResponseSchema,
	usersGetProfile: UserProfileSchema,
	usersVisitProfile: UsersVisitProfileResponseSchema,
	usersListRelations: page(UserRelationSchema),
	usersGetChat: UsersGetChatResponseSchema,
	usersListReactions: page(UserReactionSchema),
	usersListComments: page(UserCommentSchema),
	relationRequestsList: page(RelationRequestSchema),
	relationRequestsCreate: RelationRequestSchema,
	relationRequestsCancel: ObjectAck,
	relationRequestsAccept: ObjectAck,
	chatsList: page(ChatSchema),
	chatsGet: ChatSchema,
	chatsStart: ChatsStartResponseSchema,
	messagesList: page(MessageSchema),
	messagesSend: MessagesSendResponseSchema,
	postsList: page(PostSchema),
	postsListReactions: page(ReactionSchema),
	postsListComments: page(CommentSchema),
	webhookEndpointsList: WebhookEndpointsListResponseSchema,
	webhookEndpointsGet: WebhookEndpointSchema,
	webhookEndpointsCreate: CreatedWebhookEndpointSchema,
	webhookEndpointsUpdate: WebhookEndpointSchema,
	webhookEndpointsDelete: SuccessAck,
} as const;

export type UnipileOperation = keyof typeof UnipileEndpointInputSchemas;

export type UnipileEndpointInputs = {
	[K in UnipileOperation]: z.input<(typeof UnipileEndpointInputSchemas)[K]>;
};

export type UnipileEndpointOutputs = {
	[K in UnipileOperation]: z.infer<(typeof UnipileEndpointOutputSchemas)[K]>;
};

export { AccountSchema, MessageSchema, UserRelationSchema };

export type UnipileAccount = z.infer<typeof AccountSchema>;
export type UnipileUser = z.infer<typeof UserSchema>;
export type UnipileUserProfile = z.infer<typeof UserProfileSchema>;
export type UnipileRelationRequest = z.infer<typeof RelationRequestSchema>;
export type UnipileUserRelation = z.infer<typeof UserRelationSchema>;
export type UnipileChat = z.infer<typeof ChatSchema>;
export type UnipileMessage = z.infer<typeof MessageSchema>;
export type UnipilePost = z.infer<typeof PostSchema>;
export type UnipileWebhookEndpoint = z.infer<typeof WebhookEndpointSchema>;
export type UnipileCreatedWebhookEndpoint = z.infer<
	typeof CreatedWebhookEndpointSchema
>;
export type UnipileWebhookEventType = (typeof WebhookEventTypes)[number];
export type AccountsCreateAuthLinkInput =
	UnipileEndpointInputs['accountsCreateAuthLink'];
export type RelationRequestsCreateInput =
	UnipileEndpointInputs['relationRequestsCreate'];
export type ChatsStartInput = UnipileEndpointInputs['chatsStart'];
export type MessagesSendInput = UnipileEndpointInputs['messagesSend'];
