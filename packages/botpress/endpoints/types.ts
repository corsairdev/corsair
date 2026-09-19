import { z } from 'zod';

/**
 * Shared entity and operation shapes for the Botpress Admin/Billing/Files/
 * Chat surface.
 *
 * Ground truth for every route (method, path, request body/query fields)
 * comes from `@botpress/client` v2.2.0's bundled source (npm, current major
 * v2) — not from docs prose, per the playbook. Response shapes come from a
 * mix of that same package's TypeScript declarations and live captures
 * against a real account on 2026-08-16 (noted per schema below). Where a
 * response is a deeply nested provider-defined manifest (bot, integration)
 * that was never fully captured live, it is modeled loosely with `.loose()`
 * rather than guessed field-by-field.
 *
 * @see https://botpress.com/docs/api-reference
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/* -------------------------------------------------------------------------- */
/* entities                                                                    */
/* -------------------------------------------------------------------------- */

/** Live-captured 2026-08-16 from `GET /v1/admin/workspaces`. */
export const BotpressWorkspaceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		ownerId: S,
		createdAt: S,
		updatedAt: S,
		blocked: B,
		plan: S,
		billingVersion: S,
		spendingLimit: N,
		botCount: N,
		about: S,
		profilePicture: S,
		contactEmail: S,
		website: S,
		socialAccounts: z.array(z.unknown()).nullable().optional(),
		isPublic: B,
		handle: S,
		activeTrialId: S,
	})
	.loose();
export type BotpressWorkspace = z.infer<typeof BotpressWorkspaceSchema>;

/**
 * The bot manifest nests states/message/user/conversation/events/actions/
 * integrations/plugins/configuration, each an open-ended, provider-defined
 * schema. Only the identifying fields are typed; the rest is unknown to this
 * plugin rather than guessed.
 */
export const BotpressBotSchema = z
	.object({
		id: z.string(),
		name: S,
		createdAt: S,
		updatedAt: S,
		createdBy: S,
		dev: B,
		alwaysAlive: B,
		status: S,
		type: S,
		signingSecret: S,
		tags: z.record(z.string(), z.string()).nullable().optional(),
	})
	.loose();
export type BotpressBot = z.infer<typeof BotpressBotSchema>;

/**
 * The integration manifest is even larger than the bot's (configuration
 * schema, per-channel message schemas, actions, events, entities,
 * interfaces). Only identifying/listing fields are typed.
 */
export const BotpressIntegrationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		version: z.string(),
		title: S,
		description: S,
		createdAt: S,
		updatedAt: S,
		visibility: z.enum(['public', 'private', 'unlisted']).nullable().optional(),
		verificationStatus: S,
		dev: B,
		url: S,
		iconUrl: S,
		readmeUrl: S,
		signingSecret: S,
	})
	.loose();
export type BotpressIntegration = z.infer<typeof BotpressIntegrationSchema>;

/**
 * Live-captured 2026-08-16 from `GET /v1/admin/hub/integrations` (list).
 * `hub.getIntegration`/`getIntegrationById` return a fuller manifest per
 * `GetPublicIntegrationResponse` (configuration, actions, events, channels,
 * entities, secrets by name, interfaces) - `.loose()` preserves those extra
 * fields without validating them, same rationale as `BotpressIntegration`.
 */
export const BotpressPublicIntegrationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		version: z.string(),
		title: S,
		description: S,
		iconUrl: S,
		createdAt: S,
		updatedAt: S,
		public: B,
		visibility: S,
		verificationStatus: S,
		lifecycleStatus: S,
		ownerWorkspace: z
			.object({ id: S, handle: S, name: S })
			.loose()
			.nullable()
			.optional(),
	})
	.loose();
export type BotpressPublicIntegration = z.infer<
	typeof BotpressPublicIntegrationSchema
>;

/** Live-captured 2026-08-16 from `GET /v1/admin/hub/plugins`. */
export const BotpressPublicPluginSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		version: z.string(),
		title: S,
		description: S,
		iconUrl: S,
		createdAt: S,
		updatedAt: S,
		public: B,
		visibility: S,
		lifecycleStatus: S,
	})
	.loose();
export type BotpressPublicPlugin = z.infer<typeof BotpressPublicPluginSchema>;

/** Live-captured 2026-08-16 from `GET /v1/admin/hub/interfaces`. */
export const BotpressPublicInterfaceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		version: z.string(),
		title: S,
		description: S,
		iconUrl: S,
		readmeUrl: S,
		createdAt: S,
		updatedAt: S,
		public: B,
	})
	.loose();
export type BotpressPublicInterface = z.infer<
	typeof BotpressPublicInterfaceSchema
>;

/** From `CreateConversationResponse`/`ListConversationsResponse` in @botpress/client v2.2.0. */
export const BotpressConversationSchema = z
	.object({
		id: z.string(),
		createdAt: S,
		updatedAt: S,
		channel: S,
		integration: S,
		tags: z.record(z.string(), z.string()).nullable().optional(),
		messageCount: N,
		properties: z.record(z.string(), z.string()).nullable().optional(),
	})
	.loose();
export type BotpressConversation = z.infer<typeof BotpressConversationSchema>;

/** From `CreateMessageResponse` in @botpress/client v2.2.0. */
export const BotpressMessageSchema = z
	.object({
		id: z.string(),
		createdAt: S,
		updatedAt: S,
		type: S,
		payload: z.record(z.string(), z.unknown()).nullable().optional(),
		direction: z.enum(['incoming', 'outgoing']).nullable().optional(),
		userId: S,
		conversationId: S,
		tags: z.record(z.string(), z.string()).nullable().optional(),
		origin: z.literal('synthetic').nullable().optional(),
	})
	.loose();
export type BotpressMessage = z.infer<typeof BotpressMessageSchema>;

/** From `UpdateWorkflowResponse` in @botpress/client v2.2.0. */
export const BotpressWorkflowSchema = z
	.object({
		id: z.string(),
		name: S,
		status: z
			.enum([
				'pending',
				'in_progress',
				'failed',
				'completed',
				'listening',
				'paused',
				'timedout',
				'cancelled',
			])
			.nullable()
			.optional(),
		input: z.record(z.string(), z.unknown()).nullable().optional(),
		output: z.record(z.string(), z.unknown()).nullable().optional(),
		parentWorkflowId: S,
		conversationId: S,
		userId: S,
		createdAt: S,
		updatedAt: S,
		completedAt: S,
		failureReason: S,
		timeoutAt: S,
		tags: z.record(z.string(), z.string()).nullable().optional(),
	})
	.loose();
export type BotpressWorkflow = z.infer<typeof BotpressWorkflowSchema>;

/** From `ListWorkspaceInvoicesResponse` in @botpress/client v2.2.0. */
export const BotpressInvoiceSchema = z
	.object({
		id: z.string(),
		period: z.object({ month: z.number(), year: z.number() }).loose(),
		date: S,
		amount: N,
		currency: S,
		paymentStatus: z
			.enum(['deleted', 'draft', 'open', 'paid', 'uncollectible', 'void'])
			.nullable()
			.optional(),
		dueDate: S,
		paymentAttemptCount: N,
		nextPaymentAttemptDate: S,
		pdfUrl: S,
	})
	.loose();
export type BotpressInvoice = z.infer<typeof BotpressInvoiceSchema>;

/**
 * Live-captured 2026-08-16 from `GET .../billing/upcoming-invoice` (empty
 * `lineItems`); the line item shape comes from `GetUpcomingInvoiceResponse`
 * in `@botpress/client` v2.2.0's type declarations.
 */
export const BotpressUpcomingInvoiceSchema = z
	.object({
		total: N,
		lineItems: z
			.array(
				z
					.object({
						id: z.string(),
						description: S,
						totalInCents: N,
						currency: S,
						pricePerUnitInCents: N,
						quantity: N,
						type: z.enum(['invoiceitem', 'subscription']).nullable().optional(),
						periodStart: S,
						periodEnd: S,
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();
export type BotpressUpcomingInvoice = z.infer<
	typeof BotpressUpcomingInvoiceSchema
>;

const BotpressQuotaTypeSchema = z.enum([
	'invocation_timeout',
	'invocation_calls',
	'storage_count',
	'bot_count',
	'knowledgebase_vector_storage',
	'workspace_ratelimit',
	'table_row_count',
	'workspace_member_count',
	'integrations_owned_count',
	'ai_spend',
	'openai_spend',
	'bing_search_spend',
	'always_alive',
	'indexed_file_count',
	'file_max_size_bytes',
]);
export type BotpressQuotaType = z.infer<typeof BotpressQuotaTypeSchema>;

/** From `GetWorkspaceQuotaResponse` in @botpress/client v2.2.0. */
export const BotpressQuotaSchema = z
	.object({
		period: S,
		value: N,
		type: BotpressQuotaTypeSchema.nullable().optional(),
	})
	.loose();
export type BotpressQuota = z.infer<typeof BotpressQuotaSchema>;

/** From `ListUsageHistoryResponse` in @botpress/client v2.2.0. */
export const BotpressUsageHistoryItemSchema = z
	.object({
		id: S,
		period: S,
		value: N,
		quota: N,
		type: BotpressQuotaTypeSchema.nullable().optional(),
	})
	.loose();
export type BotpressUsageHistoryItem = z.infer<
	typeof BotpressUsageHistoryItemSchema
>;

/** From `BreakDownWorkspaceUsageByBotResponse` in @botpress/client v2.2.0. */
export const BotpressUsageByBotItemSchema = z
	.object({ botId: S, value: N })
	.loose();
export type BotpressUsageByBotItem = z.infer<
	typeof BotpressUsageByBotItemSchema
>;

/**
 * `GetAllWorkspaceQuotaCompletionResponse` is a map keyed by workspace id
 * rather than a list (confirmed live: `GET .../usages/quota-completion`
 * returned `{}` for an account with a single workspace).
 */
export const BotpressQuotaCompletionMapSchema = z.record(
	z.string(),
	z
		.object({
			type: BotpressQuotaTypeSchema.nullable().optional(),
			completion: N,
		})
		.loose(),
);
export type BotpressQuotaCompletionMap = z.infer<
	typeof BotpressQuotaCompletionMapSchema
>;

/** From `ListActionRunsResponse` in @botpress/client v2.2.0. */
export const BotpressActionRunSchema = z
	.object({
		timestamp: S,
		integrationName: S,
		actionType: S,
		input: z.record(z.string(), z.unknown()).nullable().optional(),
		inputTruncated: B,
		output: z.record(z.string(), z.unknown()).nullable().optional(),
		outputTruncated: B,
		status: z.enum(['SUCCESS', 'FAILURE']).nullable().optional(),
		durationMs: N,
		cached: B,
		errorMessage: S,
	})
	.loose();
export type BotpressActionRun = z.infer<typeof BotpressActionRunSchema>;

/** From `ListBotIssuesResponse` in @botpress/client v2.2.0. */
export const BotpressBotIssueSchema = z
	.object({
		id: z.string(),
		code: S,
		createdAt: S,
		lastSeenAt: S,
		title: S,
		description: S,
		eventsCount: N,
		category: z
			.enum(['user_code', 'limits', 'configuration', 'other'])
			.nullable()
			.optional(),
		resolutionLink: S,
	})
	.loose();
export type BotpressBotIssue = z.infer<typeof BotpressBotIssueSchema>;

/** From `ListIntegrationApiKeysResponse` in @botpress/client v2.2.0. */
export const BotpressIntegrationApiKeySchema = z
	.object({ id: z.string(), createdAt: S, note: S })
	.loose();
export type BotpressIntegrationApiKey = z.infer<
	typeof BotpressIntegrationApiKeySchema
>;

/** From `ListKnowledgeBasesResponse` in @botpress/client v2.2.0. */
export const BotpressKnowledgeBaseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: S,
		createdAt: S,
		tags: z.record(z.string(), z.string()).nullable().optional(),
	})
	.loose();
export type BotpressKnowledgeBase = z.infer<typeof BotpressKnowledgeBaseSchema>;

/**
 * From `GetTableRowResponse` in @botpress/client v2.2.0. Rows carry
 * user-defined table columns beyond the fixed fields below, hence `.loose()`.
 */
export const BotpressTableRowSchema = z
	.object({
		id: z.number(),
		createdAt: S,
		updatedAt: S,
	})
	.loose();
export type BotpressTableRow = z.infer<typeof BotpressTableRowSchema>;

/** Live-captured 2026-08-16 from `GET /v1/admin/account/me`. */
export const BotpressAccountSchema = z
	.object({
		id: z.string(),
		email: S,
		displayName: S,
		createdAt: S,
		emailVerified: B,
	})
	.loose();
export type BotpressAccount = z.infer<typeof BotpressAccountSchema>;

/** From `CheckHandleAvailabilityResponse` in @botpress/client v2.2.0. */
export const BotpressHandleAvailabilitySchema = z
	.object({
		available: z.boolean(),
		suggestions: z.array(z.string()).nullable().optional(),
		usedBy: S,
	})
	.loose();
export type BotpressHandleAvailability = z.infer<
	typeof BotpressHandleAvailabilitySchema
>;

/** From `ChargeWorkspaceUnpaidInvoicesResponse` in @botpress/client v2.2.0. */
export const BotpressChargeUnpaidInvoicesResultSchema = z
	.object({
		chargedInvoices: z
			.array(z.object({ id: z.string(), amount: z.number() }).loose())
			.nullable()
			.optional(),
		failedInvoices: z
			.array(
				z
					.object({
						id: z.string(),
						amount: z.number(),
						failedReason: z.string(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();
export type BotpressChargeUnpaidInvoicesResult = z.infer<
	typeof BotpressChargeUnpaidInvoicesResultSchema
>;

/** Live-captured 2026-08-16 from `POST /v1/admin/helper/vrl`. */
export const BotpressVrlResultSchema = z
	.object({
		data: z.unknown(),
		result: z.unknown(),
	})
	.loose();
export type BotpressVrlResult = z.infer<typeof BotpressVrlResultSchema>;

/** Empty-body 2xx responses (delete, request-verification, set-preference). */
export const EmptyResultSchema = z.object({}).loose();
export type EmptyResult = z.infer<typeof EmptyResultSchema>;

const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

const nonempty = z.string().trim().min(1);

/* Shared pagination envelope for the list operations that accept it. */
const PageInputSchema = z.object({
	nextToken: nonempty.optional(),
	pageSize: z.number().int().positive().optional(),
});

/* -------------------------------------------------------------------------- */
/* account                                                                     */
/* -------------------------------------------------------------------------- */

const AccountGetInputSchema = z.object({});
export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

const AccountUpdateInputSchema = z.object({
	displayName: z.string().optional(),
	profilePicture: z.string().optional(),
	/** Re-fetches the display name/picture from the SSO provider when true. */
	refresh: z.boolean().optional(),
});
export type AccountUpdateInput = z.infer<typeof AccountUpdateInputSchema>;

const AccountGetPreferenceInputSchema = z.object({
	key: nonempty,
});
export type AccountGetPreferenceInput = z.infer<
	typeof AccountGetPreferenceInputSchema
>;

const AccountSetPreferenceInputSchema = z.object({
	key: nonempty,
	/**
	 * Botpress types the stored preference value as `any` — never observed a
	 * stable shape across preference keys, so it is passed through unknown.
	 */
	value: z.unknown(),
});
export type AccountSetPreferenceInput = z.infer<
	typeof AccountSetPreferenceInputSchema
>;

/* -------------------------------------------------------------------------- */
/* workspaces                                                                  */
/* -------------------------------------------------------------------------- */

const WorkspacesCreateInputSchema = z.object({
	name: nonempty,
	billingVersion: z.string().optional(),
});
export type WorkspacesCreateInput = z.infer<typeof WorkspacesCreateInputSchema>;

const WorkspacesGetInputSchema = z.object({
	id: nonempty,
});
export type WorkspacesGetInput = z.infer<typeof WorkspacesGetInputSchema>;

const WorkspacesUpdateInputSchema = z.object({
	id: nonempty,
	name: z.string().optional(),
	spendingLimit: z.number().optional(),
	about: z.string().optional(),
	profilePicture: z.string().optional(),
	contactEmail: z.string().optional(),
	website: z.string().optional(),
	socialAccounts: z.array(z.unknown()).optional(),
	isPublic: z.boolean().optional(),
	handle: z.string().optional(),
});
export type WorkspacesUpdateInput = z.infer<typeof WorkspacesUpdateInputSchema>;

const WorkspacesDeleteInputSchema = z.object({
	id: nonempty,
});
export type WorkspacesDeleteInput = z.infer<typeof WorkspacesDeleteInputSchema>;

const WorkspacesListInputSchema = PageInputSchema.extend({
	/** Substring match on workspace handle. */
	handle: z.string().optional(),
});
export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;

const WorkspacesListPublicInputSchema = PageInputSchema.extend({
	workspaceIds: z.array(z.string()).optional(),
	search: z.string().optional(),
});
export type WorkspacesListPublicInput = z.infer<
	typeof WorkspacesListPublicInputSchema
>;

const WorkspacesCheckHandleAvailabilityInputSchema = z.object({
	handle: nonempty,
});
export type WorkspacesCheckHandleAvailabilityInput = z.infer<
	typeof WorkspacesCheckHandleAvailabilityInputSchema
>;

/**
 * No workspace id in the path (confirmed live: `PUT
 * /v1/admin/workspaces/preferences/{key}`), so the acting workspace comes
 * from `x-workspace-id`.
 */
const WorkspacesSetPreferenceInputSchema = z.object({
	key: nonempty,
	value: z.unknown(),
});
export type WorkspacesSetPreferenceInput = z.infer<
	typeof WorkspacesSetPreferenceInputSchema
>;

const WorkspacesGetQuotaInputSchema = z.object({
	id: nonempty,
	type: BotpressQuotaTypeSchema,
	period: z.string().optional(),
});
export type WorkspacesGetQuotaInput = z.infer<
	typeof WorkspacesGetQuotaInputSchema
>;

const WorkspacesGetAllQuotaCompletionInputSchema = z.object({});
export type WorkspacesGetAllQuotaCompletionInput = z.infer<
	typeof WorkspacesGetAllQuotaCompletionInputSchema
>;

const WorkspacesBreakDownUsageByBotInputSchema = z.object({
	id: nonempty,
	type: BotpressQuotaTypeSchema,
	period: z.string().optional(),
});
export type WorkspacesBreakDownUsageByBotInput = z.infer<
	typeof WorkspacesBreakDownUsageByBotInputSchema
>;

/* -------------------------------------------------------------------------- */
/* billing                                                                     */
/* -------------------------------------------------------------------------- */

const BillingListInvoicesInputSchema = z.object({
	workspaceId: nonempty,
});
export type BillingListInvoicesInput = z.infer<
	typeof BillingListInvoicesInputSchema
>;

const BillingGetUpcomingInvoiceInputSchema = z.object({
	workspaceId: nonempty,
});
export type BillingGetUpcomingInvoiceInput = z.infer<
	typeof BillingGetUpcomingInvoiceInputSchema
>;

/**
 * A real financial action — see `error-handlers.ts` (`isNonIdempotent`) and
 * the PR description. Never exercised against a live account with a real
 * payment method during development.
 *
 * `ChargeWorkspaceUnpaidInvoicesRequestBody.invoiceIds` is optional in the
 * real API (`@botpress/client` v2.2.0 types it `invoiceIds?: string[]`,
 * `@minItems 1` when present) — omitting it likely charges every unpaid
 * invoice on the workspace. This plugin requires it deliberately, narrower
 * than what the API allows, so an agent cannot trigger an unbounded charge
 * by omitting the field.
 */
const BillingChargeUnpaidInvoicesInputSchema = z.object({
	workspaceId: nonempty,
	invoiceIds: z.array(nonempty).min(1),
});
export type BillingChargeUnpaidInvoicesInput = z.infer<
	typeof BillingChargeUnpaidInvoicesInputSchema
>;

const BillingListUsageHistoryInputSchema = z.object({
	/** A workspace id or a bot id — this route reports usage for either. */
	id: nonempty,
	type: BotpressQuotaTypeSchema,
});
export type BillingListUsageHistoryInput = z.infer<
	typeof BillingListUsageHistoryInputSchema
>;

/* -------------------------------------------------------------------------- */
/* bots                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * `states`, `events`, `recurringEvents`, `actions`, `configuration`, `user`,
 * `conversation`, `message` and `subscriptions` are each provider-defined
 * maps (confirmed from `CreateBotRequestBody`/`UpdateBotRequestBody` in
 * `@botpress/client` v2.2.0's type declarations) - modeled as opaque records,
 * same rationale as `BotpressBot`.
 *
 * The catalog description also names "integrations" as something a create
 * call configures, but `CreateBotRequestBody` has no such field - only
 * `UpdateBotRequestBody` does (`bots.update`'s `integrations` field below).
 * A newly created bot installs integrations through that follow-up call, so
 * no `integrations` field is exposed here; adding one that the real API
 * ignores would look accepted while silently doing nothing.
 */
const BotsCreateInputSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	tags: z.record(z.string(), z.string()).optional(),
	dev: z.boolean().optional(),
	code: z.string().optional(),
	url: z.string().optional(),
	states: z.record(z.string(), z.unknown()).optional(),
	events: z.record(z.string(), z.unknown()).optional(),
	recurringEvents: z.record(z.string(), z.unknown()).optional(),
	actions: z.record(z.string(), z.unknown()).optional(),
	configuration: z.record(z.string(), z.unknown()).optional(),
	user: z.record(z.string(), z.unknown()).optional(),
	conversation: z.record(z.string(), z.unknown()).optional(),
	message: z.record(z.string(), z.unknown()).optional(),
	subscriptions: z.record(z.string(), z.unknown()).optional(),
	maxExecutionTime: z.number().optional(),
	medias: z.record(z.string(), z.unknown()).optional(),
	secrets: z.record(z.string(), z.string().nullable()).optional(),
	type: z.enum(['studio', 'adk']).optional(),
	moduleFormat: z.enum(['cjs', 'esm']).optional(),
});
export type BotsCreateInput = z.infer<typeof BotsCreateInputSchema>;

const BotsUpdateInputSchema = z.object({
	id: nonempty,
	name: z.string().optional(),
	description: z.string().optional(),
	tags: z.record(z.string(), z.string()).optional(),
	blocked: z.boolean().optional(),
	alwaysAlive: z.boolean().optional(),
	maxExecutionTime: z.number().optional(),
	url: z.string().nullable().optional(),
	authentication: z.enum(['iam', 'hmac-sha256']).optional(),
	configuration: z.record(z.string(), z.unknown()).optional(),
	user: z.record(z.string(), z.unknown()).optional(),
	message: z.record(z.string(), z.unknown()).optional(),
	conversation: z.record(z.string(), z.unknown()).optional(),
	events: z.record(z.string(), z.unknown()).optional(),
	actions: z.record(z.string(), z.unknown()).optional(),
	states: z.record(z.string(), z.unknown()).optional(),
	recurringEvents: z.record(z.string(), z.unknown()).optional(),
	/** Installed integrations, keyed by integration id or alias. */
	integrations: z.record(z.string(), z.unknown()).optional(),
	/** Installed plugins, keyed by plugin alias. */
	plugins: z.record(z.string(), z.unknown()).optional(),
	subscriptions: z.record(z.string(), z.unknown()).optional(),
	code: z.string().optional(),
	medias: z.record(z.string(), z.unknown()).optional(),
	secrets: z.record(z.string(), z.string().nullable()).optional(),
	layers: z.array(z.string()).optional(),
	type: z.enum(['studio', 'adk']).optional(),
	moduleFormat: z.enum(['cjs', 'esm']).optional(),
});
export type BotsUpdateInput = z.infer<typeof BotsUpdateInputSchema>;

const BotsListActionRunsInputSchema = PageInputSchema.extend({
	id: nonempty,
	integrationName: z.string().optional(),
	timestampFrom: z.string().optional(),
	timestampUntil: z.string().optional(),
});
export type BotsListActionRunsInput = z.infer<
	typeof BotsListActionRunsInputSchema
>;

const BotsListIssuesInputSchema = PageInputSchema.extend({
	id: nonempty,
});
export type BotsListIssuesInput = z.infer<typeof BotsListIssuesInputSchema>;

/* -------------------------------------------------------------------------- */
/* chat (requires botId — see client.ts BotpressBotIdMissingError)            */
/* -------------------------------------------------------------------------- */

const ChatCreateConversationInputSchema = z.object({
	botId: nonempty,
	channel: nonempty,
	tags: z.record(z.string(), z.string()),
	properties: z.record(z.string(), z.string()).optional(),
});
export type ChatCreateConversationInput = z.infer<
	typeof ChatCreateConversationInputSchema
>;

const ChatListConversationsInputSchema = PageInputSchema.extend({
	botId: nonempty,
	tags: z.record(z.string(), z.string()).optional(),
	sortField: z.enum(['createdAt', 'updatedAt']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
	participantIds: z.array(z.string()).optional(),
	integrationName: z.string().optional(),
	channel: z.string().optional(),
	afterDate: z.string().optional(),
	beforeDate: z.string().optional(),
	minMessageCount: z.number().optional(),
	maxMessageCount: z.number().optional(),
});
export type ChatListConversationsInput = z.infer<
	typeof ChatListConversationsInputSchema
>;

const ChatSendMessageInputSchema = z.object({
	botId: nonempty,
	conversationId: nonempty,
	userId: nonempty,
	type: nonempty,
	payload: z.record(z.string(), z.unknown()),
	/** Required by `CreateMessageRequestBody` - pass `{}` for no tags. */
	tags: z.record(z.string(), z.string()),
	/** Either `dateTime` or `delay` must be set to actually schedule the send. */
	schedule: z
		.object({
			dateTime: z.string().optional(),
			delay: z.number().optional(),
		})
		.optional(),
	/** Marks the message as system-generated rather than sent by the bot/user. */
	origin: z.literal('synthetic').optional(),
});
export type ChatSendMessageInput = z.infer<typeof ChatSendMessageInputSchema>;

/**
 * `UpdateWorkflowRequestBody`'s status enum (6 values) is narrower than the
 * `Workflow` entity's own status field (which also has `pending` and
 * `timedout`) - those two are system-set and not accepted on update.
 */
const ChatUpdateWorkflowInputSchema = z.object({
	botId: nonempty,
	id: nonempty,
	status: z
		.enum([
			'completed',
			'cancelled',
			'listening',
			'paused',
			'failed',
			'in_progress',
		])
		.optional(),
	output: z.record(z.string(), z.unknown()).optional(),
	timeoutAt: z.string().optional(),
	failureReason: z.string().optional(),
	/** Set a key to `null` to remove that tag. */
	tags: z.record(z.string(), z.string().nullable()).optional(),
	userId: z.string().optional(),
	/** Required when `status` is set to `in_progress`. */
	eventId: z.string().optional(),
});
export type ChatUpdateWorkflowInput = z.infer<
	typeof ChatUpdateWorkflowInputSchema
>;

/* -------------------------------------------------------------------------- */
/* integrations                                                               */
/* -------------------------------------------------------------------------- */

/**
 * `configuration`, `configurations`, `states`, `events`, `actions`,
 * `entities`, `channels`, `user`, `interfaces` and `extraOperations` are each
 * a map keyed by name to a provider-defined JSON-schema-style definition
 * (confirmed from `CreateIntegrationRequestBody` in `@botpress/client`
 * v2.2.0's type declarations) - modeled as opaque records rather than typed
 * field-by-field, per the same rationale as the `BotpressIntegration` output
 * schema.
 */
const IntegrationsCreateInputSchema = z.object({
	name: nonempty,
	version: nonempty,
	title: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	code: z.string().optional(),
	configuration: z.record(z.string(), z.unknown()).optional(),
	configurations: z.record(z.string(), z.unknown()).optional(),
	states: z.record(z.string(), z.unknown()).optional(),
	events: z.record(z.string(), z.unknown()).optional(),
	actions: z.record(z.string(), z.unknown()).optional(),
	entities: z.record(z.string(), z.unknown()).optional(),
	channels: z.record(z.string(), z.unknown()).optional(),
	user: z.record(z.string(), z.unknown()).optional(),
	interfaces: z.record(z.string(), z.unknown()).optional(),
	identifier: z
		.object({
			fallbackHandlerScript: z.string().optional(),
			extractScript: z.string().optional(),
		})
		.optional(),
	extraOperations: z
		.record(z.string(), z.object({ enabled: z.boolean() }))
		.optional(),
	sdkVersion: z.string().optional(),
	/** Integration-wide `SECRET_*` environment variables. */
	secrets: z.record(z.string(), z.string().nullable()).optional(),
	/** Base64-encoded SVG icon. */
	icon: z.string().optional(),
	/** Base64-encoded markdown readme. */
	readme: z.string().optional(),
	/** @deprecated Use `visibility` instead - kept because the API still accepts it. */
	public: z.boolean().optional(),
	visibility: z.enum(['public', 'private', 'unlisted']).optional(),
	layers: z.array(z.string()).optional(),
	attributes: z.record(z.string(), z.string()).optional(),
});
export type IntegrationsCreateInput = z.infer<
	typeof IntegrationsCreateInputSchema
>;

/**
 * `BOTPRESS_GET_INTEGRATION` is described as "by name and version... supports
 * retrieving specific versions or the latest version" - that is
 * `getIntegrationByName`, not the by-id `getIntegration`. Confirmed live:
 * `GET /v1/admin/integrations/{name}/{version}` needs `x-workspace-id`
 * (unlike the by-id route, whose id is unambiguous on its own), and
 * `version: "latest"` resolves to the newest version (confirmed against the
 * public hub's `agi/edge` integration, which has many versions).
 */
const IntegrationsGetInputSchema = z.object({
	name: nonempty,
	/** A specific version, or `"latest"` for the newest one. */
	version: nonempty,
});
export type IntegrationsGetInput = z.infer<typeof IntegrationsGetInputSchema>;

const IntegrationsListInputSchema = PageInputSchema.extend({
	limit: z.number().int().positive().optional(),
	name: z.string().optional(),
	version: z.string().optional(),
	interfaceId: z.string().optional(),
	interfaceName: z.string().optional(),
	installedByBotId: z.string().optional(),
	verificationStatus: z
		.enum(['unapproved', 'pending', 'approved', 'rejected'])
		.optional(),
	search: z.string().optional(),
	sortBy: z
		.enum(['popularity', 'name', 'createdAt', 'updatedAt', 'installCount'])
		.optional(),
	direction: z.enum(['asc', 'desc']).optional(),
	visibility: z.enum(['public', 'private']).optional(),
	dev: z.boolean().optional(),
});
export type IntegrationsListInput = z.infer<typeof IntegrationsListInputSchema>;

const IntegrationsValidateUpdateInputSchema = z.object({
	id: nonempty,
	configuration: z.record(z.string(), z.unknown()).optional(),
	configurations: z.record(z.string(), z.unknown()).optional(),
	states: z.record(z.string(), z.unknown()).optional(),
	events: z.record(z.string(), z.unknown()).optional(),
	actions: z.record(z.string(), z.unknown()).optional(),
	entities: z.record(z.string(), z.unknown()).optional(),
	channels: z.record(z.string(), z.unknown()).optional(),
	user: z.record(z.string(), z.unknown()).optional(),
	interfaces: z.record(z.string(), z.unknown()).optional(),
	identifier: z
		.object({
			fallbackHandlerScript: z.string().optional(),
			extractScript: z.string().optional(),
		})
		.optional(),
	extraOperations: z
		.record(z.string(), z.object({ enabled: z.boolean() }))
		.optional(),
	sdkVersion: z.string().optional(),
	maxExecutionTime: z.number().optional(),
	secrets: z.record(z.string(), z.string().nullable()).optional(),
	icon: z.string().optional(),
	readme: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	public: z.boolean().optional(),
	visibility: z.enum(['public', 'private', 'unlisted']).optional(),
	layers: z.array(z.string()).optional(),
});
export type IntegrationsValidateUpdateInput = z.infer<
	typeof IntegrationsValidateUpdateInputSchema
>;

const IntegrationsRequestVerificationInputSchema = z.object({
	integrationId: nonempty,
});
export type IntegrationsRequestVerificationInput = z.infer<
	typeof IntegrationsRequestVerificationInputSchema
>;

const IntegrationsListApiKeysInputSchema = z.object({
	integrationId: nonempty,
});
export type IntegrationsListApiKeysInput = z.infer<
	typeof IntegrationsListApiKeysInputSchema
>;

const IntegrationsDeleteShareableIdInputSchema = z.object({
	botId: nonempty,
	integrationId: nonempty,
	integrationInstanceAlias: z.string().optional(),
});
export type IntegrationsDeleteShareableIdInput = z.infer<
	typeof IntegrationsDeleteShareableIdInputSchema
>;

/* -------------------------------------------------------------------------- */
/* hub (public catalog — no workspace scoping; confirmed live)                */
/* -------------------------------------------------------------------------- */

const HubListIntegrationsInputSchema = PageInputSchema.extend({
	limit: z.number().int().positive().optional(),
	name: z.string().optional(),
	version: z.string().optional(),
	interfaceId: z.string().optional(),
	interfaceName: z.string().optional(),
	installedByBotId: z.string().optional(),
	verificationStatus: z
		.enum(['unapproved', 'pending', 'approved', 'rejected'])
		.optional(),
	search: z.string().optional(),
	sortBy: z
		.enum(['popularity', 'name', 'createdAt', 'updatedAt', 'installCount'])
		.optional(),
	direction: z.enum(['asc', 'desc']).optional(),
});
export type HubListIntegrationsInput = z.infer<
	typeof HubListIntegrationsInputSchema
>;

const HubGetIntegrationInputSchema = z.object({
	name: nonempty,
	version: nonempty,
});
export type HubGetIntegrationInput = z.infer<
	typeof HubGetIntegrationInputSchema
>;

const HubGetIntegrationByIdInputSchema = z.object({
	id: nonempty,
});
export type HubGetIntegrationByIdInput = z.infer<
	typeof HubGetIntegrationByIdInputSchema
>;

const HubListInterfacesInputSchema = PageInputSchema.extend({
	name: z.string().optional(),
	version: z.string().optional(),
});
export type HubListInterfacesInput = z.infer<
	typeof HubListInterfacesInputSchema
>;

const HubGetInterfaceInputSchema = z.object({
	name: nonempty,
	version: nonempty,
});
export type HubGetInterfaceInput = z.infer<typeof HubGetInterfaceInputSchema>;

const HubGetInterfaceByIdInputSchema = z.object({
	id: nonempty,
});
export type HubGetInterfaceByIdInput = z.infer<
	typeof HubGetInterfaceByIdInputSchema
>;

const HubListPluginsInputSchema = PageInputSchema.extend({
	name: z.string().optional(),
	version: z.string().optional(),
});
export type HubListPluginsInput = z.infer<typeof HubListPluginsInputSchema>;

const HubGetPluginInputSchema = z.object({
	name: nonempty,
	version: nonempty,
});
export type HubGetPluginInput = z.infer<typeof HubGetPluginInputSchema>;

const HubGetPluginByIdInputSchema = z.object({
	id: nonempty,
});
export type HubGetPluginByIdInput = z.infer<typeof HubGetPluginByIdInputSchema>;

const HubGetPluginCodeInputSchema = z.object({
	id: nonempty,
	platform: z.enum(['node', 'browser']),
});
export type HubGetPluginCodeInput = z.infer<typeof HubGetPluginCodeInputSchema>;

const HubGetDereferencedPluginByIdInputSchema = z.object({
	id: nonempty,
	/**
	 * Required mapping of interface alias -> backing integration id
	 * (`GetDereferencedPublicPluginByIdRequestQuery` in `@botpress/client`
	 * v2.2.0's type declarations - not optional, and not a plain list of
	 * interface names as the query parameter's minified field name alone
	 * suggested).
	 */
	interfaces: z.record(z.string(), z.string()),
});
export type HubGetDereferencedPluginByIdInput = z.infer<
	typeof HubGetDereferencedPluginByIdInputSchema
>;

/* -------------------------------------------------------------------------- */
/* plugins (workspace-installed, not the public hub)                          */
/* -------------------------------------------------------------------------- */

const PluginsListInputSchema = PageInputSchema.extend({
	name: z.string().optional(),
	version: z.string().optional(),
});
export type PluginsListInput = z.infer<typeof PluginsListInputSchema>;

/* -------------------------------------------------------------------------- */
/* files (requires botId)                                                     */
/* -------------------------------------------------------------------------- */

const FilesDeleteInputSchema = z.object({
	botId: nonempty,
	id: nonempty,
});
export type FilesDeleteInput = z.infer<typeof FilesDeleteInputSchema>;

const FilesListTagsInputSchema = PageInputSchema.extend({
	botId: nonempty,
});
export type FilesListTagsInput = z.infer<typeof FilesListTagsInputSchema>;

const FilesListTagValuesInputSchema = PageInputSchema.extend({
	botId: nonempty,
	tag: nonempty,
});
export type FilesListTagValuesInput = z.infer<
	typeof FilesListTagValuesInputSchema
>;

/* -------------------------------------------------------------------------- */
/* knowledgeBases (requires botId)                                            */
/* -------------------------------------------------------------------------- */

const KnowledgeBasesListInputSchema = PageInputSchema.extend({
	botId: nonempty,
	tags: z.record(z.string(), z.string()).optional(),
});
export type KnowledgeBasesListInput = z.infer<
	typeof KnowledgeBasesListInputSchema
>;

const KnowledgeBasesDeleteInputSchema = z.object({
	botId: nonempty,
	id: nonempty,
});
export type KnowledgeBasesDeleteInput = z.infer<
	typeof KnowledgeBasesDeleteInputSchema
>;

/* -------------------------------------------------------------------------- */
/* tools (VRL is workspace-agnostic; table row requires botId)                */
/* -------------------------------------------------------------------------- */

const ToolsRunVrlInputSchema = z.object({
	/** Arbitrary input data made available to the script as `.` in VRL. */
	data: z.record(z.string(), z.unknown()),
	script: nonempty,
});
export type ToolsRunVrlInput = z.infer<typeof ToolsRunVrlInputSchema>;

const ToolsGetTableRowInputSchema = z.object({
	botId: nonempty,
	table: nonempty,
	id: z.number(),
});
export type ToolsGetTableRowInput = z.infer<typeof ToolsGetTableRowInputSchema>;

/* -------------------------------------------------------------------------- */
/* input/output maps                                                          */
/* -------------------------------------------------------------------------- */

export type BotpressEndpointInputs = {
	accountGet: AccountGetInput;
	accountUpdate: AccountUpdateInput;
	accountGetPreference: AccountGetPreferenceInput;
	accountSetPreference: AccountSetPreferenceInput;
	workspacesCreate: WorkspacesCreateInput;
	workspacesGet: WorkspacesGetInput;
	workspacesUpdate: WorkspacesUpdateInput;
	workspacesDelete: WorkspacesDeleteInput;
	workspacesList: WorkspacesListInput;
	workspacesListPublic: WorkspacesListPublicInput;
	workspacesCheckHandleAvailability: WorkspacesCheckHandleAvailabilityInput;
	workspacesSetPreference: WorkspacesSetPreferenceInput;
	workspacesGetQuota: WorkspacesGetQuotaInput;
	workspacesGetAllQuotaCompletion: WorkspacesGetAllQuotaCompletionInput;
	workspacesBreakDownUsageByBot: WorkspacesBreakDownUsageByBotInput;
	billingListInvoices: BillingListInvoicesInput;
	billingGetUpcomingInvoice: BillingGetUpcomingInvoiceInput;
	billingChargeUnpaidInvoices: BillingChargeUnpaidInvoicesInput;
	billingListUsageHistory: BillingListUsageHistoryInput;
	botsCreate: BotsCreateInput;
	botsUpdate: BotsUpdateInput;
	botsListActionRuns: BotsListActionRunsInput;
	botsListIssues: BotsListIssuesInput;
	chatCreateConversation: ChatCreateConversationInput;
	chatListConversations: ChatListConversationsInput;
	chatSendMessage: ChatSendMessageInput;
	chatUpdateWorkflow: ChatUpdateWorkflowInput;
	integrationsCreate: IntegrationsCreateInput;
	integrationsGet: IntegrationsGetInput;
	integrationsList: IntegrationsListInput;
	integrationsValidateUpdate: IntegrationsValidateUpdateInput;
	integrationsRequestVerification: IntegrationsRequestVerificationInput;
	integrationsListApiKeys: IntegrationsListApiKeysInput;
	integrationsDeleteShareableId: IntegrationsDeleteShareableIdInput;
	hubListIntegrations: HubListIntegrationsInput;
	hubGetIntegration: HubGetIntegrationInput;
	hubGetIntegrationById: HubGetIntegrationByIdInput;
	hubListInterfaces: HubListInterfacesInput;
	hubGetInterface: HubGetInterfaceInput;
	hubGetInterfaceById: HubGetInterfaceByIdInput;
	hubListPlugins: HubListPluginsInput;
	hubGetPlugin: HubGetPluginInput;
	hubGetPluginById: HubGetPluginByIdInput;
	hubGetPluginCode: HubGetPluginCodeInput;
	hubGetDereferencedPluginById: HubGetDereferencedPluginByIdInput;
	pluginsList: PluginsListInput;
	filesDelete: FilesDeleteInput;
	filesListTags: FilesListTagsInput;
	filesListTagValues: FilesListTagValuesInput;
	knowledgeBasesList: KnowledgeBasesListInput;
	knowledgeBasesDelete: KnowledgeBasesDeleteInput;
	toolsRunVrl: ToolsRunVrlInput;
	toolsGetTableRow: ToolsGetTableRowInput;
};

export type BotpressEndpointOutputs = {
	accountGet: BotpressAccount;
	accountUpdate: BotpressAccount;
	accountGetPreference: { value?: unknown };
	accountSetPreference: EmptyResult;
	workspacesCreate: BotpressWorkspace;
	workspacesGet: BotpressWorkspace;
	workspacesUpdate: BotpressWorkspace;
	workspacesDelete: EmptyResult;
	workspacesList: { workspaces: BotpressWorkspace[]; nextToken?: string };
	workspacesListPublic: { workspaces: BotpressWorkspace[]; nextToken?: string };
	workspacesCheckHandleAvailability: BotpressHandleAvailability;
	workspacesSetPreference: EmptyResult;
	workspacesGetQuota: BotpressQuota;
	workspacesGetAllQuotaCompletion: BotpressQuotaCompletionMap;
	workspacesBreakDownUsageByBot: BotpressUsageByBotItem[];
	billingListInvoices: BotpressInvoice[];
	billingGetUpcomingInvoice: BotpressUpcomingInvoice;
	billingChargeUnpaidInvoices: BotpressChargeUnpaidInvoicesResult;
	billingListUsageHistory: BotpressUsageHistoryItem[];
	botsCreate: BotpressBot;
	botsUpdate: BotpressBot;
	botsListActionRuns: { data: BotpressActionRun[]; nextToken?: string };
	botsListIssues: { issues: BotpressBotIssue[]; nextToken?: string };
	chatCreateConversation: BotpressConversation;
	chatListConversations: {
		conversations: BotpressConversation[];
		nextToken?: string;
	};
	chatSendMessage: BotpressMessage;
	chatUpdateWorkflow: BotpressWorkflow;
	integrationsCreate: BotpressIntegration;
	integrationsGet: BotpressIntegration;
	integrationsList: { integrations: BotpressIntegration[]; nextToken?: string };
	integrationsValidateUpdate: EmptyResult;
	integrationsRequestVerification: EmptyResult;
	integrationsListApiKeys: BotpressIntegrationApiKey[];
	integrationsDeleteShareableId: EmptyResult;
	hubListIntegrations: {
		integrations: BotpressPublicIntegration[];
		nextToken?: string;
	};
	hubGetIntegration: BotpressPublicIntegration;
	hubGetIntegrationById: BotpressPublicIntegration;
	hubListInterfaces: {
		interfaces: BotpressPublicInterface[];
		nextToken?: string;
	};
	hubGetInterface: BotpressPublicInterface;
	hubGetInterfaceById: BotpressPublicInterface;
	hubListPlugins: { plugins: BotpressPublicPlugin[]; nextToken?: string };
	hubGetPlugin: BotpressPublicPlugin;
	hubGetPluginById: BotpressPublicPlugin;
	hubGetPluginCode: { code: string };
	hubGetDereferencedPluginById: Record<string, unknown>;
	pluginsList: { plugins: BotpressPublicPlugin[]; nextToken?: string };
	filesDelete: EmptyResult;
	filesListTags: { tags: string[]; nextToken?: string };
	filesListTagValues: { values: string[]; nextToken?: string };
	knowledgeBasesList: {
		knowledgeBases: BotpressKnowledgeBase[];
		nextToken?: string;
	};
	knowledgeBasesDelete: EmptyResult;
	toolsRunVrl: BotpressVrlResult;
	toolsGetTableRow: BotpressTableRow;
};

export const BotpressEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	accountUpdate: AccountUpdateInputSchema,
	accountGetPreference: AccountGetPreferenceInputSchema,
	accountSetPreference: AccountSetPreferenceInputSchema,
	workspacesCreate: WorkspacesCreateInputSchema,
	workspacesGet: WorkspacesGetInputSchema,
	workspacesUpdate: WorkspacesUpdateInputSchema,
	workspacesDelete: WorkspacesDeleteInputSchema,
	workspacesList: WorkspacesListInputSchema,
	workspacesListPublic: WorkspacesListPublicInputSchema,
	workspacesCheckHandleAvailability:
		WorkspacesCheckHandleAvailabilityInputSchema,
	workspacesSetPreference: WorkspacesSetPreferenceInputSchema,
	workspacesGetQuota: WorkspacesGetQuotaInputSchema,
	workspacesGetAllQuotaCompletion: WorkspacesGetAllQuotaCompletionInputSchema,
	workspacesBreakDownUsageByBot: WorkspacesBreakDownUsageByBotInputSchema,
	billingListInvoices: BillingListInvoicesInputSchema,
	billingGetUpcomingInvoice: BillingGetUpcomingInvoiceInputSchema,
	billingChargeUnpaidInvoices: BillingChargeUnpaidInvoicesInputSchema,
	billingListUsageHistory: BillingListUsageHistoryInputSchema,
	botsCreate: BotsCreateInputSchema,
	botsUpdate: BotsUpdateInputSchema,
	botsListActionRuns: BotsListActionRunsInputSchema,
	botsListIssues: BotsListIssuesInputSchema,
	chatCreateConversation: ChatCreateConversationInputSchema,
	chatListConversations: ChatListConversationsInputSchema,
	chatSendMessage: ChatSendMessageInputSchema,
	chatUpdateWorkflow: ChatUpdateWorkflowInputSchema,
	integrationsCreate: IntegrationsCreateInputSchema,
	integrationsGet: IntegrationsGetInputSchema,
	integrationsList: IntegrationsListInputSchema,
	integrationsValidateUpdate: IntegrationsValidateUpdateInputSchema,
	integrationsRequestVerification: IntegrationsRequestVerificationInputSchema,
	integrationsListApiKeys: IntegrationsListApiKeysInputSchema,
	integrationsDeleteShareableId: IntegrationsDeleteShareableIdInputSchema,
	hubListIntegrations: HubListIntegrationsInputSchema,
	hubGetIntegration: HubGetIntegrationInputSchema,
	hubGetIntegrationById: HubGetIntegrationByIdInputSchema,
	hubListInterfaces: HubListInterfacesInputSchema,
	hubGetInterface: HubGetInterfaceInputSchema,
	hubGetInterfaceById: HubGetInterfaceByIdInputSchema,
	hubListPlugins: HubListPluginsInputSchema,
	hubGetPlugin: HubGetPluginInputSchema,
	hubGetPluginById: HubGetPluginByIdInputSchema,
	hubGetPluginCode: HubGetPluginCodeInputSchema,
	hubGetDereferencedPluginById: HubGetDereferencedPluginByIdInputSchema,
	pluginsList: PluginsListInputSchema,
	filesDelete: FilesDeleteInputSchema,
	filesListTags: FilesListTagsInputSchema,
	filesListTagValues: FilesListTagValuesInputSchema,
	knowledgeBasesList: KnowledgeBasesListInputSchema,
	knowledgeBasesDelete: KnowledgeBasesDeleteInputSchema,
	toolsRunVrl: ToolsRunVrlInputSchema,
	toolsGetTableRow: ToolsGetTableRowInputSchema,
} as const;

export const BotpressEndpointOutputSchemas = {
	accountGet: BotpressAccountSchema,
	accountUpdate: BotpressAccountSchema,
	accountGetPreference: z.object({ value: z.unknown().optional() }).loose(),
	accountSetPreference: EmptyResultSchema,
	workspacesCreate: BotpressWorkspaceSchema,
	workspacesGet: BotpressWorkspaceSchema,
	workspacesUpdate: BotpressWorkspaceSchema,
	workspacesDelete: EmptyResultSchema,
	workspacesList: z.object({
		workspaces: z.array(BotpressWorkspaceSchema),
		nextToken: z.string().optional(),
	}),
	workspacesListPublic: z.object({
		workspaces: z.array(BotpressWorkspaceSchema),
		nextToken: z.string().optional(),
	}),
	workspacesCheckHandleAvailability: BotpressHandleAvailabilitySchema,
	workspacesSetPreference: EmptyResultSchema,
	workspacesGetQuota: BotpressQuotaSchema,
	workspacesGetAllQuotaCompletion: BotpressQuotaCompletionMapSchema,
	workspacesBreakDownUsageByBot: z.array(BotpressUsageByBotItemSchema),
	billingListInvoices: z.array(BotpressInvoiceSchema),
	billingGetUpcomingInvoice: BotpressUpcomingInvoiceSchema,
	billingChargeUnpaidInvoices: BotpressChargeUnpaidInvoicesResultSchema,
	billingListUsageHistory: z.array(BotpressUsageHistoryItemSchema),
	botsCreate: BotpressBotSchema,
	botsUpdate: BotpressBotSchema,
	botsListActionRuns: z.object({
		data: z.array(BotpressActionRunSchema),
		nextToken: z.string().optional(),
	}),
	botsListIssues: z.object({
		issues: z.array(BotpressBotIssueSchema),
		nextToken: z.string().optional(),
	}),
	chatCreateConversation: BotpressConversationSchema,
	chatListConversations: z.object({
		conversations: z.array(BotpressConversationSchema),
		nextToken: z.string().optional(),
	}),
	chatSendMessage: BotpressMessageSchema,
	chatUpdateWorkflow: BotpressWorkflowSchema,
	integrationsCreate: BotpressIntegrationSchema,
	integrationsGet: BotpressIntegrationSchema,
	integrationsList: z.object({
		integrations: z.array(BotpressIntegrationSchema),
		nextToken: z.string().optional(),
	}),
	integrationsValidateUpdate: EmptyResultSchema,
	integrationsRequestVerification: EmptyResultSchema,
	integrationsListApiKeys: z.array(BotpressIntegrationApiKeySchema),
	integrationsDeleteShareableId: EmptyResultSchema,
	hubListIntegrations: z.object({
		integrations: z.array(BotpressPublicIntegrationSchema),
		nextToken: z.string().optional(),
	}),
	hubGetIntegration: BotpressPublicIntegrationSchema,
	hubGetIntegrationById: BotpressPublicIntegrationSchema,
	hubListInterfaces: z.object({
		interfaces: z.array(BotpressPublicInterfaceSchema),
		nextToken: z.string().optional(),
	}),
	hubGetInterface: BotpressPublicInterfaceSchema,
	hubGetInterfaceById: BotpressPublicInterfaceSchema,
	hubListPlugins: z.object({
		plugins: z.array(BotpressPublicPluginSchema),
		nextToken: z.string().optional(),
	}),
	hubGetPlugin: BotpressPublicPluginSchema,
	hubGetPluginById: BotpressPublicPluginSchema,
	hubGetPluginCode: z.object({ code: z.string() }),
	/**
	 * A dereferenced plugin resolves interface entity references against the
	 * backing integrations supplied in the request — an open-ended, per-call
	 * shape rather than a fixed schema.
	 */
	hubGetDereferencedPluginById: z.record(z.string(), z.unknown()),
	pluginsList: z.object({
		plugins: z.array(BotpressPublicPluginSchema),
		nextToken: z.string().optional(),
	}),
	filesDelete: EmptyResultSchema,
	filesListTags: z.object({
		tags: z.array(z.string()),
		nextToken: z.string().optional(),
	}),
	filesListTagValues: z.object({
		values: z.array(z.string()),
		nextToken: z.string().optional(),
	}),
	knowledgeBasesList: z.object({
		knowledgeBases: z.array(BotpressKnowledgeBaseSchema),
		nextToken: z.string().optional(),
	}),
	knowledgeBasesDelete: EmptyResultSchema,
	toolsRunVrl: BotpressVrlResultSchema,
	toolsGetTableRow: BotpressTableRowSchema,
} as const;
