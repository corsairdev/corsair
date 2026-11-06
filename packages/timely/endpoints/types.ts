import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared input pieces (inputs are strict: unknown keys are rejected so a typo
// such as `projectId` instead of `project_id` fails loudly)
// ─────────────────────────────────────────────────────────────────────────────

// Ids are integers in Timely; numeric strings are accepted and sent as numbers.
const TimelyId = z
	.union([
		z.number().int().positive(),
		z.string().regex(/^\d+$/, 'must be a numeric Timely id'),
	])
	.transform((value) => Number(value));

const accountIdField = {
	accountId: TimelyId.optional().describe(
		'Timely workspace (account) id. Optional: falls back to timely({ accountId }), the stored account_id, then the only workspace the token can reach.',
	),
};

const idField = { id: TimelyId.describe('Record id') };

const DateString = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD')
	.describe('Date as YYYY-MM-DD');

const TimeString = z
	.string()
	.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'use HH:MM (24-hour)');

const HexColor = z
	.string()
	.regex(/^[0-9a-fA-F]{6}$/, 'use a 6-digit hex color without #');

const Order = z.enum(['asc', 'desc']);

const offsetPaging = {
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
};

const pagePaging = {
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(100).optional(),
};

const IdList = z.array(TimelyId).min(1);

function hasAnyField(fields: readonly string[]) {
	return (value: Record<string, unknown>) =>
		fields.some((field) => value[field] !== undefined);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared output pieces (outputs stay loose: Timely adds fields often, and
// enum-like strings are plain strings so a new value never breaks parsing)
// ─────────────────────────────────────────────────────────────────────────────

const OutId = z.union([z.number(), z.string()]);

const DurationSchema = z
	.object({
		hours: z.number().optional(),
		minutes: z.number().optional(),
		seconds: z.number().optional(),
		formatted: z.string().optional(),
		total_hours: z.number().optional(),
		total_seconds: z.number().optional(),
		total_minutes: z.number().optional(),
	})
	// unknown: Timely may add duration fields; kept loose.
	.catchall(z.unknown());

const ClientSchema = z
	.object({
		id: OutId,
		name: z.string().optional(),
		color: z.string().nullish(),
		active: z.boolean().optional(),
		external_id: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	// unknown: client payloads carry extra fields (project counts, references).
	.catchall(z.unknown());

const AccountSchema = z
	.object({
		id: OutId,
		name: z.string().optional(),
		color: z.string().nullish(),
		plan_name: z.string().nullish(),
		num_users: z.number().nullish(),
		num_projects: z.number().nullish(),
		owner_id: z.number().nullish(),
		created_at: z.number().nullish(),
	})
	// unknown: workspace payloads carry many plan/billing fields Timely changes over time.
	.catchall(z.unknown());

const ProjectSchema = z
	.object({
		id: OutId,
		account_id: OutId.optional(),
		name: z.string().optional(),
		description: z.string().nullish(),
		color: z.string().nullish(),
		rate_type: z.string().nullish(),
		billable: z.boolean().optional(),
		active: z.boolean().optional(),
		external_id: z.string().nullish(),
		client: ClientSchema.nullish(),
		budget: z.number().nullish(),
		budget_type: z.string().nullish(),
		hour_rate: z.number().nullish(),
		duration: DurationSchema.optional(),
		created_at: z.number().nullish(),
		updated_at: z.number().nullish(),
	})
	// unknown: project payloads include costs, users and label settings that vary by plan.
	.catchall(z.unknown());

const TimeEntrySchema = z
	.object({
		id: OutId,
		uid: z.string().nullish(),
		day: z.string().optional(),
		note: z.string().nullish(),
		duration: DurationSchema.optional(),
		estimated_duration: DurationSchema.optional(),
		from: z.string().nullish(),
		to: z.string().nullish(),
		billable: z.boolean().optional(),
		billed: z.boolean().optional(),
		locked: z.boolean().optional(),
		timer_state: z.union([z.string(), z.number()]).nullish(),
		external_id: z.string().nullish(),
		label_ids: z.array(OutId).optional(),
		user: z
			.object({ id: OutId, name: z.string().optional() })
			// unknown: embedded user carries avatar and profile extras.
			.catchall(z.unknown())
			.nullish(),
		project: ProjectSchema.nullish(),
		created_at: z.union([z.number(), z.string()]).nullish(),
		updated_at: z.union([z.number(), z.string()]).nullish(),
	})
	// unknown: time entries carry cost, timer and state fields that vary by plan.
	.catchall(z.unknown());

const TagSchema = z
	.object({
		id: OutId,
		name: z.string().optional(),
		parent_id: OutId.nullish(),
		emoji: z.string().nullish(),
		active: z.boolean().optional(),
		external_id: z.string().nullish(),
		sequence: z.number().nullish(),
		// unknown: child labels share this shape; kept loose to avoid a recursive schema.
		children: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	// unknown: label payloads may gain fields.
	.catchall(z.unknown());

const TeamSchema = z
	.object({
		id: OutId,
		name: z.string().optional(),
		color: z.string().nullish(),
		emoji: z.string().nullish(),
		external_id: z.string().nullish(),
		user_ids: z.array(OutId).optional(),
		project_ids: z.array(OutId).optional(),
	})
	// unknown: team payloads embed users and capacity details.
	.catchall(z.unknown());

const UserSchema = z
	.object({
		id: OutId,
		email: z.string().optional(),
		name: z.string().optional(),
		active: z.boolean().optional(),
		admin: z.boolean().optional(),
		kind: z.string().optional(),
		external_id: z.string().nullish(),
		time_zone: z.string().nullish(),
		deleted: z.boolean().optional(),
	})
	// unknown: user payloads include role, avatar, capacity and permission extras.
	.catchall(z.unknown());

const WebhookSchema = z
	.object({
		id: OutId,
		account_id: OutId.optional(),
		url: z.string(),
		subscriptions: z.array(z.string()),
		// Timely returns the signing secret; the plugin replaces it with "[redacted]".
		secret_token: z.string().nullish(),
		active: z.boolean().optional(),
		custom_headers: z.record(z.string(), z.string()).nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	// unknown: webhook payloads may gain fields.
	.catchall(z.unknown());

const BulkErrorSchema = z
	.object({
		index: z.number().optional(),
		id: OutId.optional(),
		messages: z.array(z.string()).optional(),
	})
	// unknown: per-record error rows may carry extra context.
	.catchall(z.unknown());

const BulkResultSchema = z
	.object({
		created_ids: z.array(OutId),
		updated_ids: z.array(OutId),
		deleted_ids: z.array(OutId),
		errors: z
			.object({
				create: z.array(BulkErrorSchema).optional(),
				update: z.array(BulkErrorSchema).optional(),
				delete: z.array(BulkErrorSchema).optional(),
			})
			// unknown: Timely may add error groups.
			.catchall(z.unknown())
			.optional(),
		// unknown: present (job id and status) only when Timely runs the import async (>20 records).
		job: z.record(z.string(), z.unknown()).nullish(),
	})
	// unknown: bulk responses may gain fields.
	.catchall(z.unknown());

const ReportClientRowSchema = z
	.object({
		id: OutId.nullish(),
		name: z.string().nullish(),
		duration: DurationSchema.optional(),
		// unknown: per-project report rows embed full project payloads.
		projects: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	// unknown: totals carry cost, budget and billing fields per client.
	.catchall(z.unknown());

const ReportSummarySchema = z
	.object({
		// unknown: totals carry duration and cost objects that vary by plan.
		totals: z.record(z.string(), z.unknown()).optional(),
		// unknown: each grouping row embeds its entity (client, user, label, day, team) plus totals.
		clients: z.array(z.record(z.string(), z.unknown())).optional(),
		users: z.array(z.record(z.string(), z.unknown())).optional(),
		labels: z.array(z.record(z.string(), z.unknown())).optional(),
		days: z.array(z.record(z.string(), z.unknown())).optional(),
		teams: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	// unknown: Timely adds report groupings (linked work, currencies) over time.
	.catchall(z.unknown());

const DeletedSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

// ─────────────────────────────────────────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────────────────────────────────────────

const ClientFields = {
	name: z.string().trim().min(1).max(255).optional(),
	color: HexColor.optional(),
	active: z.boolean().optional(),
	external_id: z
		.string()
		.max(512)
		.optional()
		.describe('Your system id for this client'),
};

const ProjectFields = {
	name: z.string().trim().min(1).optional(),
	rate_type: z
		.enum(['project', 'user', 'non-billable'])
		.optional()
		.describe(
			'project = one hour_rate for everyone, user = per-user rates in `users`, non-billable',
		),
	client_id: TimelyId.optional().describe(
		'Client the project belongs to (Timely requires one)',
	),
	hour_rate: z.number().min(0).optional(),
	color: HexColor.optional(),
	description: z.string().optional(),
	billable: z.boolean().optional(),
	active: z.boolean().optional().describe('false archives the project'),
	external_id: z.string().max(512).optional(),
	budget: z.number().min(0).optional(),
	budget_type: z
		.enum(['H', 'M'])
		.optional()
		.describe('H = hours budget, M = money budget'),
	users: z
		.array(
			z.object({ user_id: TimelyId, hour_rate: z.number().min(0) }).strict(),
		)
		.optional()
		.describe(
			'People who may log time on the project. On update this replaces the list: anyone left out loses access.',
		),
	team_ids: IdList.optional(),
	label_ids: z.array(TimelyId).optional(),
	required_notes: z.boolean().optional(),
	required_labels: z.boolean().optional(),
};

const TimeEntryFields = {
	project_id: TimelyId.optional(),
	day: DateString.optional(),
	hours: z.number().int().min(0).optional(),
	minutes: z.number().int().min(0).optional(),
	seconds: z.number().int().min(0).optional(),
	from: TimeString.optional().describe('Start time HH:MM (24-hour)'),
	to: TimeString.optional().describe('End time HH:MM (24-hour)'),
	note: z.string().optional(),
	user_id: TimelyId.optional().describe(
		'Log on behalf of this user (admins only); defaults to the connected user',
	),
	billable: z.boolean().optional(),
	billed: z
		.boolean()
		.optional()
		.describe('true marks the time as invoiced and locks it'),
	external_id: z.string().max(512).optional(),
	label_ids: z
		.array(TimelyId)
		.optional()
		.describe('Tag ids; the project must allow tags'),
	estimated_hours: z.number().int().min(0).optional(),
	estimated_minutes: z.number().int().min(0).optional(),
	forecast_id: TimelyId.optional().describe('Task (forecast) id'),
	state_id: TimelyId.optional().describe('Time entry state id'),
};

const TimeEntryCreateFields = z
	.object({
		...TimeEntryFields,
		project_id: TimelyId,
		day: DateString,
	})
	.strict();

const TimeEntryUpdateKeys = Object.keys(TimeEntryFields);

const TagFields = {
	name: z.string().trim().min(1).max(255).optional(),
	emoji: z.string().optional().describe('Emoji URL or character'),
	parent_id: TimelyId.optional().describe('Parent tag id for a child tag'),
	active: z.boolean().optional(),
	external_id: z.string().max(512).optional(),
};

const WEBHOOK_EVENTS = [
	'hours:created',
	'hours:updated',
	'hours:deleted',
	'projects:created',
	'projects:updated',
	'projects:deleted',
	'labels:created',
	'labels:updated',
	'labels:deleted',
	'forecasts:created',
	'forecasts:updated',
	'forecasts:deleted',
] as const;

const WebhookFields = {
	url: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'must be an https URL')
		.optional(),
	subscriptions: z.array(z.enum(WEBHOOK_EVENTS)).min(1).optional(),
	secret_token: z
		.string()
		.min(16)
		.optional()
		.describe(
			'Signing secret. Timely sends X-Signature = hex HMAC-SHA256 of the payload; Corsair rejects unsigned deliveries, so store the same value as the account webhook_signature.',
		),
	active: z.boolean().optional(),
};

export const TimelyEndpointInputSchemas = {
	accountsList: z.object({}).strict(),
	accountsGet: z.object({ ...accountIdField }).strict(),

	clientsList: z
		.object({
			...accountIdField,
			...offsetPaging,
			order: Order.optional(),
			show: z.enum(['all', 'active', 'archived']).optional(),
		})
		.strict(),
	clientsGet: z.object({ ...accountIdField, ...idField }).strict(),
	clientsCreate: z
		.object({
			...accountIdField,
			...ClientFields,
			name: z.string().trim().min(1).max(255),
		})
		.strict(),
	clientsUpdate: z
		.object({ ...accountIdField, ...idField, ...ClientFields })
		.strict()
		.refine(hasAnyField(Object.keys(ClientFields)), {
			message: 'Pass at least one field to change',
		}),

	projectsList: z
		.object({
			...accountIdField,
			...offsetPaging,
			order: Order.optional(),
			state: z.enum(['all', 'active', 'archived']).optional(),
			relation: z.enum(['all', 'assigned', 'created']).optional(),
			updated_after: z
				.string()
				.optional()
				.describe('Only projects updated after this ISO 8601 timestamp'),
			totals: z
				.boolean()
				.optional()
				.describe('false skips per-project cost/duration totals (faster)'),
		})
		.strict(),
	projectsGet: z.object({ ...accountIdField, ...idField }).strict(),
	projectsCreate: z
		.object({
			...accountIdField,
			...ProjectFields,
			name: z.string().trim().min(1),
			rate_type: z.enum(['project', 'user', 'non-billable']),
			client_id: TimelyId.describe('Client the project belongs to'),
		})
		.strict(),
	projectsUpdate: z
		.object({ ...accountIdField, ...idField, ...ProjectFields })
		.strict()
		.refine(hasAnyField(Object.keys(ProjectFields)), {
			message: 'Pass at least one field to change',
		}),
	projectsDelete: z.object({ ...accountIdField, ...idField }).strict(),

	timeEntriesList: z
		.object({
			...accountIdField,
			...pagePaging,
			since: DateString.optional().describe(
				'First day (inclusive); needs `upto`',
			),
			upto: DateString.optional().describe(
				'Last day (inclusive); needs `since`',
			),
			day: DateString.optional().describe(
				'A single day; Timely defaults to today when no range is given',
			),
			project_id: TimelyId.optional(),
			user_id: TimelyId.optional(),
			hour_ids: IdList.optional(),
			sort: z.enum(['day', 'created_at', 'updated_at']).optional(),
			order: Order.optional(),
		})
		.strict()
		.refine((v) => (v.since === undefined) === (v.upto === undefined), {
			message: 'Pass both `since` and `upto`, or neither',
		}),
	timeEntriesGet: z.object({ ...accountIdField, ...idField }).strict(),
	timeEntriesCreate: z
		.object({ ...accountIdField, ...TimeEntryCreateFields.shape })
		.strict(),
	timeEntriesUpdate: z
		.object({ ...accountIdField, ...idField, ...TimeEntryFields })
		.strict()
		.refine(hasAnyField(TimeEntryUpdateKeys), {
			message: 'Pass at least one field to change',
		}),
	timeEntriesDelete: z.object({ ...accountIdField, ...idField }).strict(),
	timeEntriesBulk: z
		.object({
			...accountIdField,
			create: z.array(TimeEntryCreateFields).optional(),
			update: z
				.array(
					z
						.object({ ...idField, ...TimeEntryFields })
						.strict()
						.refine(hasAnyField(TimeEntryUpdateKeys), {
							message: 'Each update needs at least one field to change',
						}),
				)
				.optional(),
			delete: z.array(TimelyId).optional().describe('Time entry ids to delete'),
		})
		.strict()
		.refine(
			(v) =>
				(v.create?.length ?? 0) +
					(v.update?.length ?? 0) +
					(v.delete?.length ?? 0) >
				0,
			{ message: 'Pass at least one create, update or delete record' },
		)
		.refine(
			(v) =>
				(v.create?.length ?? 0) +
					(v.update?.length ?? 0) +
					(v.delete?.length ?? 0) <=
				100,
			{ message: 'Timely accepts at most 100 records per bulk request' },
		),
	timeEntriesStartTimer: z.object({ ...accountIdField, ...idField }).strict(),
	timeEntriesStopTimer: z.object({ ...accountIdField, ...idField }).strict(),

	tagsList: z
		.object({
			...accountIdField,
			...offsetPaging,
			filter: z.enum(['all', 'active', 'archived']).optional(),
			parent_id: TimelyId.optional().describe('Only children of this tag'),
		})
		.strict(),
	tagsGet: z.object({ ...accountIdField, ...idField }).strict(),
	tagsCreate: z
		.object({
			...accountIdField,
			...TagFields,
			name: z.string().trim().min(1).max(255),
		})
		.strict(),
	tagsUpdate: z
		.object({ ...accountIdField, ...idField, ...TagFields })
		.strict()
		.refine(hasAnyField(Object.keys(TagFields)), {
			message: 'Pass at least one field to change',
		}),
	tagsDelete: z.object({ ...accountIdField, ...idField }).strict(),

	teamsList: z
		.object({ ...accountIdField, ...offsetPaging, order: Order.optional() })
		.strict(),
	teamsGet: z.object({ ...accountIdField, ...idField }).strict(),

	usersList: z
		.object({
			...accountIdField,
			...offsetPaging,
			order: Order.optional(),
			kind: z
				.enum(['human', 'agent', 'all'])
				.optional()
				.describe('Member kind; Timely defaults to human'),
			filter: z
				.literal('deleted')
				.optional()
				.describe('deleted lists archived people'),
		})
		.strict(),
	usersGet: z.object({ ...accountIdField, ...idField }).strict(),
	usersCurrent: z.object({ ...accountIdField }).strict(),

	reportsTotals: z
		.object({
			...accountIdField,
			since: DateString.optional(),
			until: DateString.optional(),
			user_ids: IdList.optional(),
			project_ids: IdList.optional(),
			client_ids: IdList.optional(),
		})
		.strict(),
	reportsFilter: z
		.object({
			...accountIdField,
			since: DateString,
			until: DateString,
			user_ids: IdList.optional(),
			project_ids: IdList.optional(),
			client_ids: IdList.optional(),
			label_ids: IdList.optional(),
			team_ids: IdList.optional(),
			state_ids: IdList.optional(),
			group_by: z
				.array(z.enum(['clients', 'users', 'labels', 'days', 'teams']))
				.min(1)
				.optional(),
			scope: z
				.enum(['totals', 'events'])
				.optional()
				.describe(
					'totals (default) returns grouped totals; events returns the matching time entries',
				),
			billed: z.boolean().optional(),
		})
		.strict(),

	webhooksList: z.object({ ...accountIdField, ...offsetPaging }).strict(),
	webhooksGet: z.object({ ...accountIdField, ...idField }).strict(),
	webhooksCreate: z
		.object({
			...accountIdField,
			...WebhookFields,
			url: z
				.string()
				.url()
				.refine(
					(value) => value.startsWith('https://'),
					'must be an https URL',
				),
			subscriptions: z.array(z.enum(WEBHOOK_EVENTS)).min(1),
			secret_token: z
				.string()
				.min(16)
				.describe(WebhookFields.secret_token.description ?? ''),
		})
		.strict(),
	webhooksUpdate: z
		.object({ ...accountIdField, ...idField, ...WebhookFields })
		.strict()
		.refine(hasAnyField(Object.keys(WebhookFields)), {
			message: 'Pass at least one field to change',
		}),
	webhooksDelete: z.object({ ...accountIdField, ...idField }).strict(),
} as const;

export const TimelyEndpointOutputSchemas = {
	accountsList: z.array(AccountSchema),
	accountsGet: AccountSchema,

	clientsList: z.array(ClientSchema),
	clientsGet: ClientSchema,
	clientsCreate: ClientSchema,
	clientsUpdate: ClientSchema,

	projectsList: z.array(ProjectSchema),
	projectsGet: ProjectSchema,
	projectsCreate: ProjectSchema,
	projectsUpdate: ProjectSchema,
	projectsDelete: DeletedSchema,

	timeEntriesList: z.array(TimeEntrySchema),
	timeEntriesGet: TimeEntrySchema,
	timeEntriesCreate: TimeEntrySchema,
	timeEntriesUpdate: TimeEntrySchema,
	timeEntriesDelete: DeletedSchema,
	timeEntriesBulk: BulkResultSchema,
	timeEntriesStartTimer: TimeEntrySchema,
	timeEntriesStopTimer: TimeEntrySchema,

	tagsList: z.array(TagSchema),
	tagsGet: TagSchema,
	tagsCreate: TagSchema,
	tagsUpdate: TagSchema,
	tagsDelete: DeletedSchema,

	teamsList: z.array(TeamSchema),
	teamsGet: TeamSchema,

	usersList: z.array(UserSchema),
	usersGet: UserSchema,
	usersCurrent: UserSchema,

	reportsTotals: z.array(ReportClientRowSchema),
	reportsFilter: z.union([ReportSummarySchema, z.array(TimeEntrySchema)]),

	webhooksList: z.array(WebhookSchema),
	webhooksGet: WebhookSchema,
	webhooksCreate: WebhookSchema,
	webhooksUpdate: WebhookSchema,
	webhooksDelete: DeletedSchema,
} as const;

export { WEBHOOK_EVENTS as TIMELY_WEBHOOK_EVENTS };

type InputSchemas = typeof TimelyEndpointInputSchemas;
type OutputSchemas = typeof TimelyEndpointOutputSchemas;

export type TimelyEndpointInputs = {
	[K in keyof InputSchemas]: z.input<InputSchemas[K]>;
};

export type TimelyEndpointOutputs = {
	[K in keyof OutputSchemas]: z.infer<OutputSchemas[K]>;
};
