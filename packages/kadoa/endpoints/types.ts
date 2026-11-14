import { z } from 'zod';

// Inputs use Kadoa's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Kadoa adds or omits cannot fail a call
// that has already happened. Reference: https://api.kadoa.com/openapi

const WorkflowIdSchema = z
	.string()
	.min(1)
	.describe('The workflow ID, as returned by `workflows.list`.');

const SchemaIdSchema = z.string().min(1).describe('The schema ID.');

const VariableIdSchema = z.string().min(1).describe('The variable ID.');

// ── shared enums ──────────────────────────────────────────────────────────

export const KADOA_WORKFLOW_STATES = [
	'ACTIVE',
	'DRAFT',
	'PAUSED',
	'PREVIEW',
	'QUEUED',
	'SETUP',
	'COMPLIANCE_REVIEW',
	'COMPLIANCE_REJECTED',
	'NOT_SUPPORTED',
	'ERROR',
	'DELETED',
] as const;

export const KADOA_DISPLAY_STATES = [
	'ACTIVE',
	'DRAFT',
	'PAUSED',
	'PREVIEW',
	'FAILED',
	'RUNNING',
	'VALIDATING',
	'INVESTIGATING',
	'PENDING_START',
	'COMPLIANCE_REVIEW',
	'COMPLIANCE_REJECTED',
] as const;

export const KADOA_RUN_STATES = [
	'IN_PROGRESS',
	'VALIDATING',
	'FINISHED',
	'FAILED',
	'STOPPED',
	'NOT_SUPPORTED',
	'FAILED_INSUFFICIENT_FUNDS',
] as const;

export const KADOA_JOB_STATES = [
	'IN_PROGRESS',
	'FINISHED',
	'FAILED',
	'NOT_SUPPORTED',
	'FAILED_INSUFFICIENT_FUNDS',
] as const;

/**
 * Accepted on create. `workflows.updateMetadata` takes a different, shorter
 * list (`KADOA_UPDATE_INTERVALS`), which is why the two are separate.
 */
export const KADOA_INTERVALS = [
	'ONLY_ONCE',
	'EVERY_10_MINUTES',
	'EVERY_20_MINUTES',
	'HALF_HOURLY',
	'HOURLY',
	'TWO_HOURLY',
	'THREE_HOURLY',
	'FOUR_HOURLY',
	'SIX_HOURLY',
	'TWELVE_HOURLY',
	'EIGHTEEN_HOURLY',
	'DAILY',
	'TWO_DAY',
	'THREE_DAY',
	'WEEKLY',
	'BIWEEKLY',
	'TRIWEEKLY',
	'FOUR_WEEKS',
	'MONTHLY',
	'CUSTOM',
] as const;

export const KADOA_UPDATE_INTERVALS = [
	'ONLY_ONCE',
	'EVERY_10_MINUTES',
	'HALF_HOURLY',
	'HOURLY',
	'THREE_HOURLY',
	'SIX_HOURLY',
	'TWELVE_HOURLY',
	'EIGHTEEN_HOURLY',
	'DAILY',
	'TWO_DAY',
	'THREE_DAY',
	'WEEKLY',
	'BIWEEKLY',
	'TRIWEEKLY',
	'FOUR_WEEKS',
	'MONTHLY',
	'CUSTOM',
] as const;

export const KADOA_FIELD_DATA_TYPES = [
	'STRING',
	'NUMBER',
	'BOOLEAN',
	'DATE',
	'DATETIME',
	'MONEY',
	'IMAGE',
	'LINK',
	'OBJECT',
	'ARRAY',
] as const;

export const KADOA_TRIGGER_EVENT_TYPES = [
	'workflow_started',
	'workflow_finished',
	'workflow_export_completed',
	'workflow_failed',
	'workflow_recovered',
	'workflow_sample_finished',
	'workflow_data_change',
	'workflow_data_quality_change',
	'workflow_health_degraded',
] as const;

const IntervalSchema = z.enum(KADOA_INTERVALS);
const UpdateIntervalSchema = z.enum(KADOA_UPDATE_INTERVALS);

const LocationInputSchema = z
	.object({
		type: z.enum(['auto', 'manual']),
		isoCode: z
			.string()
			.optional()
			.describe('Two-letter country code. Required when `type` is `manual`.'),
	})
	.superRefine((value, ctx) => {
		if (value.type === 'manual' && !value.isoCode) {
			ctx.addIssue({
				code: 'custom',
				path: ['isoCode'],
				message: '`isoCode` is required when `type` is `manual`.',
			});
		}
	});

// ── workflows.list ────────────────────────────────────────────────────────

export const KADOA_DEFAULT_WORKFLOW_LIMIT = 25;

const WorkflowsListInputSchema = z.object({
	search: z
		.string()
		.optional()
		.describe('Filter workflows by name or workflow ID.'),
	skip: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Number of workflows to skip. Defaults to 0.'),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			`Maximum workflows to return. Defaults to ${KADOA_DEFAULT_WORKFLOW_LIMIT}.`,
		),
	state: z
		.enum(KADOA_WORKFLOW_STATES)
		.optional()
		.describe(
			'Only workflows in this persisted state. DRAFT is excluded unless asked for.',
		),
	runState: z
		.enum(['FAILED', 'FINISHED', 'RUNNING', 'STOPPED'])
		.optional()
		.describe('Only workflows whose latest run is in this state.'),
	displayState: z
		.array(z.enum(KADOA_DISPLAY_STATES))
		.min(1)
		.optional()
		.describe(
			'Only workflows whose computed operational state is one of these. Sent comma-separated.',
		),
	tags: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only workflows carrying at least one of these tags.'),
	statusFilters: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Dashboard category filter, such as `group:attention` for workflows waiting on the caller.',
		),
	monitoring: z
		.boolean()
		.optional()
		.describe('Only workflows with change monitoring on or off.'),
	updateInterval: z
		.enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'REAL_TIME'])
		.optional()
		.describe('Only workflows on this schedule.'),
	scheduleType: z
		.enum(['RUN_ONCE', 'RECURRING'])
		.optional()
		.describe('RUN_ONCE for no recurring schedule, RECURRING for one.'),
	templateId: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only workflows created from these templates.'),
	includeDeleted: z
		.boolean()
		.optional()
		.describe(
			'Include deleted workflows. Only useful for compliance officers.',
		),
});

export type WorkflowsListInput = z.input<typeof WorkflowsListInputSchema>;

const PaginationSchema = z
	.object({
		totalCount: z.number().nullish(),
		page: z.number().nullish(),
		totalPages: z.number().nullish(),
		limit: z.number().nullish(),
	})
	.loose();

export type KadoaPagination = z.infer<typeof PaginationSchema>;

const WorkflowSchemaFieldSchema = z
	.object({
		name: z.string().nullish(),
		description: z.string().nullish(),
		// Kadoa's DataField takes one sample or a list of them.
		example: z.union([z.string(), z.array(z.string())]).nullish(),
		dataType: z.string().nullish(),
		isKey: z.boolean().nullish(),
		isRequired: z.boolean().nullish(),
		isUnique: z.boolean().nullish(),
	})
	.loose();

export type KadoaWorkflowSchemaField = z.infer<
	typeof WorkflowSchemaFieldSchema
>;

const AwaitingUserInputSchema = z
	.object({
		since: z.string(),
		prompt: z.string().nullish(),
	})
	.loose();

const WorkflowErrorSchema = z
	.object({
		errorCode: z.string().nullish(),
		message: z.string().nullish(),
		occurredAt: z.string().nullish(),
		screenshot: z.string().nullish(),
		// unknown: Kadoa sends a free-form context object whose keys depend on
		// the error code; there is no closed shape to type.
		context: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type KadoaWorkflowError = z.infer<typeof WorkflowErrorSchema>;

export const KadoaWorkflowSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		// A string rather than the enum: a state Kadoa adds must not fail a read.
		state: z.string().nullish(),
		displayState: z.string().nullish(),
		reviewReason: z.string().nullish(),
		inSupport: z.boolean().nullish(),
		awaitingUserInput: AwaitingUserInputSchema.nullish(),
		userId: z.string().nullish(),
		userName: z.string().nullish(),
		userEmail: z.string().nullish(),
		createdAt: z.string().nullish(),
		updateInterval: z.string().nullish(),
		isRealTime: z.boolean().nullish(),
		lastDataChangedAt: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		limit: z.number().nullish(),
		runState: z.string().nullish(),
		jobId: z.string().nullish(),
		totalRecords: z.number().nullish(),
		url: z.string().nullish(),
		urls: z.array(z.string()).nullish(),
		schemaName: z.string().nullish(),
		schemaId: z.string().nullish(),
		schema: z.array(WorkflowSchemaFieldSchema).nullish(),
		errors: z.array(WorkflowErrorSchema).nullish(),
		templateId: z.string().nullish(),
		templateVersion: z.number().nullish(),
		templateLatestVersion: z.number().nullish(),
		templateIsOutdated: z.boolean().nullish(),
	})
	.loose();

export type KadoaWorkflow = z.infer<typeof KadoaWorkflowSchema>;

const WorkflowsListResponseSchema = z
	.object({
		workflows: z.array(KadoaWorkflowSchema),
		pagination: PaginationSchema.nullish(),
		nextSkip: z
			.number()
			.nullable()
			.describe(
				'The `skip` for the next page while this one came back full; null otherwise.',
			),
	})
	.loose();

export type WorkflowsListResponse = z.infer<typeof WorkflowsListResponseSchema>;

// ── workflows.get ─────────────────────────────────────────────────────────

const WorkflowGetInputSchema = z.object({ workflowId: WorkflowIdSchema });

export type WorkflowGetInput = z.input<typeof WorkflowGetInputSchema>;

const WorkflowDetailResponseSchema = KadoaWorkflowSchema.extend({
	schedules: z.array(z.string()).nullish(),
	scheduleTimezone: z.string().nullish(),
	nextInvocation: z.string().nullish(),
	entity: z.string().nullish(),
	isSchemaEditable: z.boolean().nullish(),
	dataQualityIssues: z.number().nullish(),
	// unknown: the extraction spec and transform document are large internal
	// documents that change between releases, so they pass through untouched.
	extractionSpec: z.record(z.string(), z.unknown()).nullish(),
	transformation: z.record(z.string(), z.unknown()).nullish(),
}).loose();

export type WorkflowDetailResponse = z.infer<
	typeof WorkflowDetailResponseSchema
>;

// ── workflows.create ──────────────────────────────────────────────────────

const FieldSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.regex(/^[^.]*$/, 'A field name cannot contain a dot.')
			.describe('Field name, without a dot, such as `productName`.'),
		fieldType: z
			.enum(['SCHEMA', 'CLASSIFICATION'])
			.describe(
				'`SCHEMA` for an extracted value, `CLASSIFICATION` for one of a fixed label set.',
			),
		description: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The field meaning, extraction instructions and sample values. Required for `SCHEMA` fields.',
			),
		dataType: z
			.enum(KADOA_FIELD_DATA_TYPES)
			.optional()
			.describe('Required for `SCHEMA` fields.'),
		isKey: z
			.boolean()
			.optional()
			.describe('Marks the field as part of the record key.'),
		categories: z
			.array(
				z.object({
					title: z.string().min(1),
					definition: z.string().min(1),
				}),
			)
			.min(1)
			.optional()
			.describe(
				'Required for `CLASSIFICATION` fields: the labels to choose from.',
			),
		mapper: z
			.enum([
				'jobDescription',
				'categoryClassifier',
				'taxonomyMapping',
				'stableUniqueId',
				'linkExtraction',
				'additionalData',
				'categorize',
			])
			.optional()
			.describe('A Kadoa-managed function that computes this field.'),
		// unknown: mapperConfig is defined per mapper, with no closed shape.
		mapperConfig: z.record(z.string(), z.unknown()).optional(),
	})
	.superRefine((field, ctx) => {
		if (field.fieldType === 'SCHEMA' && !field.dataType) {
			ctx.addIssue({
				code: 'custom',
				path: ['dataType'],
				message: 'A SCHEMA field needs a `dataType`.',
			});
		}
		if (field.fieldType === 'SCHEMA' && !field.description) {
			ctx.addIssue({
				code: 'custom',
				path: ['description'],
				message: 'A SCHEMA field needs a `description`.',
			});
		}
		if (field.fieldType === 'CLASSIFICATION' && !field.categories) {
			ctx.addIssue({
				code: 'custom',
				path: ['categories'],
				message: 'A CLASSIFICATION field needs `categories`.',
			});
		}
		if (field.fieldType === 'SCHEMA' && field.categories) {
			ctx.addIssue({
				code: 'custom',
				path: ['categories'],
				message: 'Only a CLASSIFICATION field takes `categories`.',
			});
		}
		if (field.fieldType === 'CLASSIFICATION' && field.dataType) {
			ctx.addIssue({
				code: 'custom',
				path: ['dataType'],
				message: 'A CLASSIFICATION field takes `categories`, not `dataType`.',
			});
		}
	});

export type KadoaFieldInput = z.input<typeof FieldSchema>;

const CREATE_WORKFLOW_MODES = [
	'prompt',
	'schema',
	'fields',
	'template',
] as const;

const WorkflowsCreateInputSchema = z
	.object({
		urls: z
			.array(z.url())
			.min(1)
			.describe(
				'Sources. Several URLs must belong to one website: subdomains and country domains of the same name count as one, and a request spanning two sites is rejected.',
			),
		name: z
			.string()
			.min(1)
			.optional()
			.describe('Human-readable workflow name.'),
		description: z
			.string()
			.max(500)
			.optional()
			.describe('What the workflow does, at most 500 characters.'),
		tags: z
			.array(z.string().min(2))
			.optional()
			.describe('Tags for grouping. Each is at least two characters.'),
		limit: z
			.number()
			.int()
			.min(1)
			.nullable()
			.optional()
			.describe('Maximum records per run. Omit or send null for no limit.'),
		interval: IntervalSchema.optional().describe(
			'How often the workflow runs. Defaults to Kadoa’s choice for the workflow type.',
		),
		schedules: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe('Cron expressions. Overrides `interval`.'),
		timezone: z
			.string()
			.optional()
			.describe(
				'IANA timezone for `schedules`, such as `America/New_York`. Defaults to UTC.',
			),
		location: LocationInputSchema.optional(),
		userPrompt: z
			.string()
			.min(10)
			.max(5000)
			.optional()
			.describe(
				'What to extract and how to navigate the site. Required unless the workflow is built from `schemaId`, `entity` with `fields`, or `templateId`.',
			),
		schemaId: SchemaIdSchema.optional().describe(
			'Build from an existing schema instead of inline fields.',
		),
		entity: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Entity name for inline extraction, such as `Product`. Needs `fields` unless `userPrompt` is set.',
			),
		fields: z
			.array(FieldSchema)
			.min(1)
			.optional()
			.describe(
				'Inline extraction fields. Need `entity` unless `userPrompt` is set.',
			),
		templateId: z
			.string()
			.min(1)
			.optional()
			.describe('Build from a published template.'),
		templateVersion: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Pin a template version. Omit for the latest published one.'),
		bypassPreview: z
			.boolean()
			.optional()
			.describe(
				'Skip preview and validation and deploy at once. Only for a configuration you are sure of.',
			),
	})
	.superRefine((value, ctx) => {
		const modes = CREATE_WORKFLOW_MODES.filter((mode) => {
			if (mode === 'prompt') return value.userPrompt !== undefined;
			if (mode === 'schema') return value.schemaId !== undefined;
			if (mode === 'template') return value.templateId !== undefined;
			return value.entity !== undefined || value.fields !== undefined;
		});

		// A prompt workflow takes `entity` and `fields` as separate optional hints;
		// only a workflow built from inline fields alone needs both.
		if (
			value.userPrompt === undefined &&
			(value.entity === undefined) !== (value.fields === undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				path: [value.entity === undefined ? 'entity' : 'fields'],
				message: '`entity` and `fields` are used together.',
			});
		}
		if (value.templateVersion !== undefined && value.templateId === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['templateVersion'],
				message: '`templateVersion` needs a `templateId`.',
			});
		}
		if (value.templateId !== undefined && value.schemaId !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['templateId'],
				message: 'A workflow comes from a template or a schema, not both.',
			});
		}
		if (
			value.schemaId !== undefined &&
			(value.entity !== undefined || value.fields !== undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['schemaId'],
				message:
					'A workflow uses an existing schema or inline fields, not both.',
			});
		}
		if (modes.length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['userPrompt'],
				message:
					'Give the workflow something to build from: `userPrompt`, `schemaId`, `entity` with `fields`, or `templateId`.',
			});
		}
	});

export type WorkflowsCreateInput = z.input<typeof WorkflowsCreateInputSchema>;

const CreateWorkflowResponseSchema = z
	.object({
		error: z.boolean(),
		success: z.boolean(),
		workflowId: z.string(),
		message: z.string(),
	})
	.loose();

export type CreateWorkflowResponse = z.infer<
	typeof CreateWorkflowResponseSchema
>;

// ── workflows.updateMetadata ──────────────────────────────────────────────

const MonitoringFieldSchema = z.object({
	fieldName: z.string().min(1).describe('The schema field to watch.'),
	operator: z.enum(['changed', 'added', 'removed']),
	isKeyField: z
		.boolean()
		.optional()
		.describe(
			'Also set this field’s key flag. Omit to leave the flag as it is.',
		),
});

const WorkflowsUpdateMetadataInputSchema = z
	.object({
		workflowId: WorkflowIdSchema,
		urls: z
			.array(z.url())
			.min(1)
			.optional()
			.describe('Replace the workflow’s sources.'),
		limit: z
			.number()
			.int()
			.min(1)
			.nullable()
			.optional()
			.describe('Maximum records per run. Send null to remove the limit.'),
		updateInterval: UpdateIntervalSchema.optional(),
		schedules: z.array(z.string().min(1)).min(1).optional(),
		timezone: z.string().optional().describe('IANA timezone for `schedules`.'),
		name: z.string().min(1).optional(),
		description: z.string().max(500).optional(),
		tags: z.array(z.string().min(2)).optional(),
		location: LocationInputSchema.optional(),
		monitoring: z
			.object({ fields: z.array(MonitoringFieldSchema).min(1) })
			.optional()
			.describe('Change monitoring: the fields to watch.'),
	})
	.superRefine((value, ctx) => {
		const { workflowId: _workflowId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['workflowId'],
				message: 'Send at least one field to update.',
			});
		}
	});

export type WorkflowsUpdateMetadataInput = z.input<
	typeof WorkflowsUpdateMetadataInputSchema
>;

const SuccessMessageResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		message: z.string(),
	})
	.loose();

export type SuccessMessageResponse = z.infer<
	typeof SuccessMessageResponseSchema
>;

// ── workflows.remove ──────────────────────────────────────────────────────

const WorkflowRemoveInputSchema = z.object({ workflowId: WorkflowIdSchema });

export type WorkflowRemoveInput = z.input<typeof WorkflowRemoveInputSchema>;

const MessageResponseSchema = z.object({
	message: z.string(),
});

export type MessageResponse = z.infer<typeof MessageResponseSchema>;

// ── workflows.run ─────────────────────────────────────────────────────────

const WorkflowsRunInputSchema = z
	.object({
		workflowId: WorkflowIdSchema,
		variables: z
			.record(z.string(), z.string())
			.optional()
			.describe('Values for the workflow’s variables, as text.'),
		limit: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Maximum records this run processes.'),
		preview: z
			.boolean()
			.optional()
			.describe(
				'Rerun the preview of a PREVIEW workflow instead of starting a production run.',
			),
	})
	.superRefine((value, ctx) => {
		// A preview run is a sample of the workflow, so Kadoa does not apply the
		// production record limit to it.
		if (value.preview === true && value.limit !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['limit'],
				message: 'A preview run takes no `limit`; remove one of the two.',
			});
		}
	});

export type WorkflowsRunInput = z.input<typeof WorkflowsRunInputSchema>;

const WorkflowsRunResponseSchema = z
	.object({
		message: z.string().nullish(),
		jobId: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type WorkflowsRunResponse = z.infer<typeof WorkflowsRunResponseSchema>;

// ── workflows.pause / resume / stop ───────────────────────────────────────

const WorkflowControlInputSchema = z.object({ workflowId: WorkflowIdSchema });

export type WorkflowControlInput = z.input<typeof WorkflowControlInputSchema>;

// pause answers text/plain; resume answers a message and sometimes a new job.
const WorkflowsResumeResponseSchema = z
	.object({
		message: z.string(),
		jobId: z
			.string()
			.nullish()
			.describe(
				'A new preview run, set when the preview no longer matched the settings.',
			),
	})
	.loose();

export type WorkflowsResumeResponse = z.infer<
	typeof WorkflowsResumeResponseSchema
>;

// ── workflows.schedule ────────────────────────────────────────────────────

const WorkflowsScheduleInputSchema = z.object({
	workflowId: WorkflowIdSchema,
	date: z.iso
		.datetime({ offset: true })
		.describe('When to run next, in UTC, such as 2026-03-01T09:00:00.000Z.'),
});

export type WorkflowsScheduleInput = z.input<
	typeof WorkflowsScheduleInputSchema
>;

// ── workflows.history ─────────────────────────────────────────────────────

export const KADOA_DEFAULT_HISTORY_LIMIT = 25;

const WorkflowRunSchema = z
	.object({
		id: z.string(),
		state: z.string().nullish(),
		startedAt: z.string().nullish(),
		finishedAt: z.string().nullish(),
		screenshot: z.string().nullish(),
		records: z.number().nullish(),
		startedBy: z.string().nullish(),
		// Who stopped the run: an object, not a name.
		stoppedBy: z
			.object({
				kind: z.string().nullish(),
				name: z.string().nullish(),
				via: z.string().nullish(),
			})
			.loose()
			.nullish(),
		errors: z.array(WorkflowErrorSchema).nullish(),
	})
	.loose();

export type KadoaWorkflowRun = z.infer<typeof WorkflowRunSchema>;

const WorkflowsHistoryInputSchema = z.object({
	workflowId: WorkflowIdSchema,
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('1-based page. Defaults to 1.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe(`Runs per page. Defaults to ${KADOA_DEFAULT_HISTORY_LIMIT}.`),
	runId: z
		.string()
		.min(1)
		.optional()
		.describe('Read one run, whatever the page.'),
	status: z
		.enum(['success', 'failed', 'in_progress', 'stopped'])
		.optional()
		.describe('Only runs with this outcome.'),
});

export type WorkflowsHistoryInput = z.input<typeof WorkflowsHistoryInputSchema>;

const WorkflowsHistoryResponseSchema = z
	.object({
		workflowId: z.string(),
		workflowRuns: z.array(WorkflowRunSchema),
		totalCount: z.number().nullish(),
		pagination: PaginationSchema.nullish(),
		nextPage: z
			.number()
			.nullable()
			.describe('The next page number, null on the last page.'),
	})
	.loose();

export type WorkflowsHistoryResponse = z.infer<
	typeof WorkflowsHistoryResponseSchema
>;

// ── workflows.data ────────────────────────────────────────────────────────

export const KADOA_DEFAULT_DATA_LIMIT = 25;

const DataFilterValueSchema = z.union([z.string(), z.number(), z.boolean()]);

const DataFilterSchema = z.object({
	field: z.string().min(1),
	operator: z
		.string()
		.min(1)
		.describe(
			'A comparison such as `CONTAINS`, `GREATER_THAN`, `IN` or `IS_NULL`.',
		),
	value: z
		.union([DataFilterValueSchema, z.array(DataFilterValueSchema).min(1)])
		.optional()
		.describe(
			'The value to compare with: an array for `IN` and `NOT_IN`, a day count for `WITHIN_LAST_DAYS`, and none for `IS_NULL`, `IS_NOT_NULL`, `IS_EMPTY` and `IS_NOT_EMPTY`.',
		),
});

const WorkflowsDataInputSchema = z.object({
	workflowId: WorkflowIdSchema,
	runId: z.string().min(1).optional().describe('Read a specific run’s data.'),
	sortBy: z.string().min(1).optional().describe('Field to sort by.'),
	order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Sort direction. Defaults to asc.'),
	filters: z
		.array(DataFilterSchema)
		.min(1)
		.optional()
		.describe('Row filters, sent JSON-encoded.'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('1-based page. Defaults to 1.'),
	limit: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			`Rows per page. Defaults to ${KADOA_DEFAULT_DATA_LIMIT}; 0 streams every row and ignores paging.`,
		),
	rowIds: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only these row IDs, sent comma-separated.'),
});

export type WorkflowsDataInput = z.input<typeof WorkflowsDataInputSchema>;

// Rows carry whatever fields the workflow's schema produced, so a row is an
// open record rather than a fixed shape.
// unknown: the column names come from the workflow's own schema, which the
// caller defines, so no static type can describe them.
const WorkflowDataRowSchema = z.record(z.string(), z.unknown());

const WorkflowsDataResponseSchema = z
	.object({
		workflowId: z.string(),
		runId: z.string().nullish(),
		executedAt: z.string().nullish(),
		data: z.array(WorkflowDataRowSchema),
		pagination: PaginationSchema.nullish(),
		nextPage: z
			.number()
			.nullable()
			.describe(
				'The next page number while more rows remain; null on the last page and when every row was streamed at once.',
			),
	})
	.loose();

export type WorkflowsDataResponse = z.infer<typeof WorkflowsDataResponseSchema>;

// ── workflows.jobStatus ───────────────────────────────────────────────────

const WorkflowsJobStatusInputSchema = z.object({
	workflowId: WorkflowIdSchema,
	jobId: z.string().min(1).describe('The `jobId` a run returned.'),
});

export type WorkflowsJobStatusInput = z.input<
	typeof WorkflowsJobStatusInputSchema
>;

const JobStatusResponseSchema = z
	.object({
		id: z.string(),
		state: z.string(),
		startedAt: z.string().nullish(),
		finishedAt: z.string().nullish(),
		estimatedFinishedAtUtc: z.string().nullish(),
		limit: z.number().nullish(),
		workflowId: z.string().nullish(),
		// unknown: a job's variables are whatever the caller passed to the run,
		// so their values have no static type.
		variables: z.record(z.string(), z.unknown()).nullish(),
		errors: z.array(WorkflowErrorSchema).nullish(),
	})
	.loose();

export type WorkflowsJobStatusResponse = z.infer<
	typeof JobStatusResponseSchema
>;

// ── workflows.connectors ──────────────────────────────────────────────────

const WorkflowsConnectorsInputSchema = z.object({
	workflowId: WorkflowIdSchema,
});

export type WorkflowsConnectorsInput = z.input<
	typeof WorkflowsConnectorsInputSchema
>;

const ConnectorSchema = z
	.object({
		name: z.string().nullish(),
		provider: z.string().nullish(),
		destination: z.string().nullish(),
		formats: z.array(z.string()).nullish(),
	})
	.loose();

const WorkflowsConnectorsResponseSchema = z
	.object({ connectors: z.array(ConnectorSchema) })
	.loose();

export type WorkflowsConnectorsResponse = z.infer<
	typeof WorkflowsConnectorsResponseSchema
>;

// ── schemas ───────────────────────────────────────────────────────────────

export const KadoaSchemaDefinitionSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		isPublic: z.boolean().nullish(),
		entity: z.string().nullish(),
		schema: z.array(WorkflowSchemaFieldSchema).nullish(),
		description: z.object({ hintText: z.string().nullish() }).loose().nullish(),
	})
	.loose();

export type KadoaSchemaDefinition = z.infer<typeof KadoaSchemaDefinitionSchema>;

const SchemasListInputSchema = z.object({});

export type SchemasListInput = z.input<typeof SchemasListInputSchema>;

const SchemasListResponseSchema = z
	.object({
		error: z.boolean().nullish(),
		data: z.array(KadoaSchemaDefinitionSchema),
	})
	.loose();

export type SchemasListResponse = z.infer<typeof SchemasListResponseSchema>;

const SchemaGetInputSchema = z.object({ schemaId: SchemaIdSchema });

export type SchemaGetInput = z.input<typeof SchemaGetInputSchema>;

const SchemaGetResponseSchema = z
	.object({
		error: z.boolean().nullish(),
		data: KadoaSchemaDefinitionSchema,
	})
	.loose();

export type SchemaGetResponse = z.infer<typeof SchemaGetResponseSchema>;

const SchemaCreateInputSchema = z.object({
	name: z.string().min(1).max(255).describe('The schema name.'),
	entity: z
		.string()
		.min(1)
		.optional()
		.describe('Entity the schema describes, such as `Product`.'),
	fields: z.array(FieldSchema).min(1).describe('The fields to extract.'),
});

export type SchemaCreateInput = z.input<typeof SchemaCreateInputSchema>;

const SchemaCreateResponseSchema = z
	.object({
		error: z.boolean().nullish(),
		success: z.boolean().nullish(),
		schemaId: z.string(),
		message: z.string().nullish(),
	})
	.loose();

export type SchemaCreateResponse = z.infer<typeof SchemaCreateResponseSchema>;

const SchemaUpdateInputSchema = z
	.object({
		schemaId: SchemaIdSchema,
		name: z.string().min(1).max(255).optional(),
		entity: z
			.string()
			.min(1)
			.nullable()
			.optional()
			.describe('The entity name. Send null to clear it.'),
		fields: z
			.array(FieldSchema)
			.min(1)
			.optional()
			.describe(
				'Replace every field. Kadoa keeps the previous revision, so workflows on it keep the old shape.',
			),
	})
	.superRefine((value, ctx) => {
		const { schemaId: _schemaId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['schemaId'],
				message: 'Send `name`, `entity` or `fields`.',
			});
		}
	});

export type SchemaUpdateInput = z.input<typeof SchemaUpdateInputSchema>;

const SchemaUpdateResponseSchema = z
	.object({
		error: z.boolean().nullish(),
		success: z.boolean().nullish(),
		message: z.string().nullish(),
		updatedSchema: KadoaSchemaDefinitionSchema.nullish(),
	})
	.loose();

export type SchemaUpdateResponse = z.infer<typeof SchemaUpdateResponseSchema>;

const SchemaRemoveInputSchema = z.object({ schemaId: SchemaIdSchema });

export type SchemaRemoveInput = z.input<typeof SchemaRemoveInputSchema>;

const SchemaRemoveResponseSchema = z
	.object({
		error: z.boolean().nullish(),
		success: z.boolean().nullish(),
		message: z.string(),
	})
	.loose();

export type SchemaRemoveResponse = z.infer<typeof SchemaRemoveResponseSchema>;

// ── changes ───────────────────────────────────────────────────────────────

const ChangeDifferenceFieldSchema = z
	.object({
		key: z.string(),
		value: z.string().nullish(),
		previousValue: z.string().nullish(),
	})
	.loose();

const ChangeDifferenceSchema = z
	.object({
		type: z.string(),
		fields: z.array(ChangeDifferenceFieldSchema).nullish(),
	})
	.loose();

export const KadoaChangeSchema = z
	.object({
		id: z.string(),
		workflowId: z.string().nullish(),
		data: z.array(WorkflowDataRowSchema).nullish(),
		dataPending: z.boolean().nullish(),
		differences: z.array(ChangeDifferenceSchema).nullish(),
		differencesCounts: z
			.object({
				added: z.number().nullish(),
				removed: z.number().nullish(),
				changed: z.number().nullish(),
			})
			.loose()
			.nullish(),
		url: z.string().nullish(),
		summary: z.string().nullish(),
		screenshotUrl: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type KadoaChange = z.infer<typeof KadoaChangeSchema>;

export const KADOA_DEFAULT_CHANGES_LIMIT = 25;

const ChangesListInputSchema = z.object({
	workflowIds: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Only changes in these workflows, sent comma-separated. Omit for every ACTIVE workflow.',
		),
	startDate: z
		.string()
		.optional()
		.describe('Earliest change, as an ISO date or date-time.'),
	endDate: z
		.string()
		.optional()
		.describe(
			'Latest change, as an ISO date or date-time. A date alone covers that whole day.',
		),
	skip: z.number().int().min(0).optional().describe('Changes to skip.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe(
			`Changes to return, at most 100. Defaults to ${KADOA_DEFAULT_CHANGES_LIMIT}.`,
		),
	exclude: z
		.array(z.enum(['data', 'differences']))
		.min(1)
		.optional()
		.describe(
			'Drop these large fields from each change. The counts stay available.',
		),
});

export type ChangesListInput = z.input<typeof ChangesListInputSchema>;

const ChangesListResponseSchema = z
	.object({
		timestamp: z.string().nullish(),
		changesCount: z.number().nullish(),
		changes: z.array(KadoaChangeSchema),
		pagination: PaginationSchema.nullish(),
		nextSkip: z
			.number()
			.nullable()
			.describe(
				'The `skip` for the next page while this one came back full; null otherwise.',
			),
	})
	.loose();

export type ChangesListResponse = z.infer<typeof ChangesListResponseSchema>;

const ChangeGetInputSchema = z.object({
	changeId: z.string().min(1).describe('The change ID from `changes.list`.'),
});

export type ChangeGetInput = z.input<typeof ChangeGetInputSchema>;

const ChangeGetResponseSchema = KadoaChangeSchema.loose();

export type ChangeGetResponse = z.infer<typeof ChangeGetResponseSchema>;

// ── variables ─────────────────────────────────────────────────────────────

const VariableSchema = z
	.object({
		id: z.string(),
		key: z.string(),
		// Kadoa omits `value` on a secret, so it is optional here.
		value: z.string().nullish(),
		dataType: z.string().nullish(),
		provider: z.string().nullish(),
		managementMode: z.string().nullish(),
		status: z.string().nullish(),
		currentVersion: z.string().nullish(),
		lastResolvedVersion: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		lastRotatedAt: z.string().nullish(),
		lastResolvedAt: z.string().nullish(),
		workflowCount: z.number().nullish(),
		workflows: z
			.array(z.object({ id: z.string(), name: z.string() }).loose())
			.nullish(),
	})
	.loose();

export type KadoaVariable = z.infer<typeof VariableSchema>;

const VariablesListInputSchema = z.object({
	workflowId: z
		.string()
		.min(1)
		.optional()
		.describe('Only variables this workflow references.'),
	includeWorkflows: z
		.boolean()
		.optional()
		.describe('Also list the workflows that reference each variable.'),
});

export type VariablesListInput = z.input<typeof VariablesListInputSchema>;

const VariablesListResponseSchema = z
	.object({
		variables: z.array(VariableSchema),
		error: z.string().nullish(),
	})
	.loose();

export type VariablesListResponse = z.infer<typeof VariablesListResponseSchema>;

const VariableGetInputSchema = z.object({ variableId: VariableIdSchema });

export type VariableGetInput = z.input<typeof VariableGetInputSchema>;

const VariableGetResponseSchema = z
	.object({
		variable: VariableSchema.nullish(),
		error: z.string().nullish(),
	})
	.loose();

export type VariableGetResponse = z.infer<typeof VariableGetResponseSchema>;

export const KADOA_VARIABLE_DATA_TYPES = [
	'STRING',
	'OBJECT',
	'ARRAY',
	'NUMBER',
	'SECRET',
] as const;

const VariableCreateInputSchema = z
	.object({
		key: z.string().min(1).describe('Unique within the team.'),
		value: z
			.string()
			.optional()
			.describe(
				'The value. For OBJECT and ARRAY, a JSON string. May be empty, except for a Kadoa-managed secret. Omit only for a CUSTOMER_MANAGED secret.',
			),
		dataType: z
			.enum(KADOA_VARIABLE_DATA_TYPES)
			.optional()
			.describe('Defaults to STRING.'),
		managementMode: z
			.enum(['KADOA_MANAGED', 'CUSTOMER_MANAGED'])
			.optional()
			.describe('SECRET only. Defaults to KADOA_MANAGED.'),
		providerConnectionId: z
			.string()
			.min(1)
			.optional()
			.describe(
				'SECRET with CUSTOMER_MANAGED: the Google Secret Manager connection.',
			),
		resourceReference: z
			.string()
			.min(1)
			.optional()
			.describe('SECRET with CUSTOMER_MANAGED: the secret resource to read.'),
	})
	.superRefine((value, ctx) => {
		if (value.dataType !== 'SECRET') {
			if (value.value === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['value'],
					message: 'A variable needs a `value`.',
				});
			}
			for (const field of [
				'managementMode',
				'providerConnectionId',
				'resourceReference',
			] as const) {
				if (value[field] !== undefined) {
					ctx.addIssue({
						code: 'custom',
						path: [field],
						message: 'Only a SECRET variable takes this field.',
					});
				}
			}
			return;
		}

		const customerManaged = value.managementMode === 'CUSTOMER_MANAGED';
		if (customerManaged) {
			if (value.value !== undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['value'],
					message:
						'A customer-managed secret is read from your vault, so it takes no `value`.',
				});
			}
			for (const field of [
				'providerConnectionId',
				'resourceReference',
			] as const) {
				if (value[field] === undefined) {
					ctx.addIssue({
						code: 'custom',
						path: [field],
						message: 'A customer-managed secret needs this field.',
					});
				}
			}
			return;
		}

		if (value.value === undefined || value.value.length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['value'],
				message: 'A Kadoa-managed secret needs a non-empty `value`.',
			});
		}
		for (const field of [
			'providerConnectionId',
			'resourceReference',
		] as const) {
			if (value[field] !== undefined) {
				ctx.addIssue({
					code: 'custom',
					path: [field],
					message: 'Only a customer-managed secret takes this field.',
				});
			}
		}
	});

export type VariableCreateInput = z.input<typeof VariableCreateInputSchema>;

const VariableUpdateInputSchema = z
	.object({
		variableId: VariableIdSchema,
		key: z.string().min(1).optional(),
		value: z
			.string()
			.optional()
			.describe(
				'New value. For OBJECT and ARRAY, a JSON string. Empty is rejected by Kadoa for a secret.',
			),
		dataType: z
			.enum(KADOA_VARIABLE_DATA_TYPES)
			.optional()
			.describe(
				'Accepted but cannot change the stored type, which Kadoa keeps. A mismatch is rejected by Kadoa.',
			),
	})
	.superRefine((value, ctx) => {
		const { variableId: _variableId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['variableId'],
				message: 'Send `key`, `value` or `dataType`.',
			});
		}
	});

export type VariableUpdateInput = z.input<typeof VariableUpdateInputSchema>;

const VariableRemoveInputSchema = z.object({ variableId: VariableIdSchema });

export type VariableRemoveInput = z.input<typeof VariableRemoveInputSchema>;

// ── triggers ──────────────────────────────────────────────────────────────

// `GET /v4/workflows/{workflowId}/triggers` is the only trigger route with a
// documented response: the outgoing rows under `triggers` and the incoming ones
// under `incoming`, each carrying `targetWorkflowName` when the caller can read
// the target. The create, read-one, update and delete routes document no body
// at all, so this plugin leaves them out rather than guess at what they return.
const TriggerSchema = z
	.object({
		id: z.string(),
		sourceWorkflowId: z.string().nullish(),
		targetWorkflowId: z.string().nullish(),
		targetWorkflowName: z.string().nullish(),
		eventType: z.string().nullish(),
		enabled: z.boolean().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type KadoaTrigger = z.infer<typeof TriggerSchema>;

const TriggersListInputSchema = z.object({ workflowId: WorkflowIdSchema });

export type TriggersListInput = z.input<typeof TriggersListInputSchema>;

const TriggersListResponseSchema = z
	.object({
		triggers: z
			.array(TriggerSchema)
			.describe('Triggers where this workflow is the source.'),
		incoming: z
			.array(TriggerSchema)
			.describe('Triggers where this workflow is the target.'),
	})
	.loose();

export type TriggersListResponse = z.infer<typeof TriggersListResponseSchema>;

// ── locations ─────────────────────────────────────────────────────────────

const LocationsListInputSchema = z.object({});

export type LocationsListInput = z.input<typeof LocationsListInputSchema>;

const LocationSchema = z
	.object({
		countryName: z.string().nullish(),
		isoCode: z.string().nullish(),
	})
	.loose();

export type KadoaLocation = z.infer<typeof LocationSchema>;

const LocationsListResponseSchema = z
	.object({ locations: z.array(LocationSchema) })
	.loose();

export type LocationsListResponse = z.infer<typeof LocationsListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KadoaEndpointInputs = {
	workflowsList: WorkflowsListInput;
	workflowsGet: WorkflowGetInput;
	workflowsCreate: WorkflowsCreateInput;
	workflowsUpdateMetadata: WorkflowsUpdateMetadataInput;
	workflowsRemove: WorkflowRemoveInput;
	workflowsRun: WorkflowsRunInput;
	workflowsPause: WorkflowControlInput;
	workflowsResume: WorkflowControlInput;
	workflowsStop: WorkflowControlInput;
	workflowsSchedule: WorkflowsScheduleInput;
	workflowsHistory: WorkflowsHistoryInput;
	workflowsData: WorkflowsDataInput;
	workflowsJobStatus: WorkflowsJobStatusInput;
	workflowsConnectors: WorkflowsConnectorsInput;
	schemasList: SchemasListInput;
	schemasGet: SchemaGetInput;
	schemasCreate: SchemaCreateInput;
	schemasUpdate: SchemaUpdateInput;
	schemasRemove: SchemaRemoveInput;
	changesList: ChangesListInput;
	changesGet: ChangeGetInput;
	variablesList: VariablesListInput;
	variablesGet: VariableGetInput;
	variablesCreate: VariableCreateInput;
	variablesUpdate: VariableUpdateInput;
	variablesRemove: VariableRemoveInput;
	triggersList: TriggersListInput;
	locationsList: LocationsListInput;
};

export type KadoaEndpointOutputs = {
	workflowsList: WorkflowsListResponse;
	workflowsGet: WorkflowDetailResponse;
	workflowsCreate: CreateWorkflowResponse;
	workflowsUpdateMetadata: SuccessMessageResponse;
	workflowsRemove: MessageResponse;
	workflowsRun: WorkflowsRunResponse;
	workflowsPause: MessageResponse;
	workflowsResume: WorkflowsResumeResponse;
	workflowsStop: MessageResponse;
	workflowsSchedule: MessageResponse;
	workflowsHistory: WorkflowsHistoryResponse;
	workflowsData: WorkflowsDataResponse;
	workflowsJobStatus: WorkflowsJobStatusResponse;
	workflowsConnectors: WorkflowsConnectorsResponse;
	schemasList: SchemasListResponse;
	schemasGet: SchemaGetResponse;
	schemasCreate: SchemaCreateResponse;
	schemasUpdate: SchemaUpdateResponse;
	schemasRemove: SchemaRemoveResponse;
	changesList: ChangesListResponse;
	changesGet: ChangeGetResponse;
	variablesList: VariablesListResponse;
	variablesGet: VariableGetResponse;
	variablesCreate: VariableGetResponse;
	variablesUpdate: VariableGetResponse;
	variablesRemove: VariableGetResponse;
	triggersList: TriggersListResponse;
	locationsList: LocationsListResponse;
};

export const KadoaEndpointInputSchemas = {
	workflowsList: WorkflowsListInputSchema,
	workflowsGet: WorkflowGetInputSchema,
	workflowsCreate: WorkflowsCreateInputSchema,
	workflowsUpdateMetadata: WorkflowsUpdateMetadataInputSchema,
	workflowsRemove: WorkflowRemoveInputSchema,
	workflowsRun: WorkflowsRunInputSchema,
	workflowsPause: WorkflowControlInputSchema,
	workflowsResume: WorkflowControlInputSchema,
	workflowsStop: WorkflowControlInputSchema,
	workflowsSchedule: WorkflowsScheduleInputSchema,
	workflowsHistory: WorkflowsHistoryInputSchema,
	workflowsData: WorkflowsDataInputSchema,
	workflowsJobStatus: WorkflowsJobStatusInputSchema,
	workflowsConnectors: WorkflowsConnectorsInputSchema,
	schemasList: SchemasListInputSchema,
	schemasGet: SchemaGetInputSchema,
	schemasCreate: SchemaCreateInputSchema,
	schemasUpdate: SchemaUpdateInputSchema,
	schemasRemove: SchemaRemoveInputSchema,
	changesList: ChangesListInputSchema,
	changesGet: ChangeGetInputSchema,
	variablesList: VariablesListInputSchema,
	variablesGet: VariableGetInputSchema,
	variablesCreate: VariableCreateInputSchema,
	variablesUpdate: VariableUpdateInputSchema,
	variablesRemove: VariableRemoveInputSchema,
	triggersList: TriggersListInputSchema,
	locationsList: LocationsListInputSchema,
} as const;

export const KadoaEndpointOutputSchemas = {
	workflowsList: WorkflowsListResponseSchema,
	workflowsGet: WorkflowDetailResponseSchema,
	workflowsCreate: CreateWorkflowResponseSchema,
	workflowsUpdateMetadata: SuccessMessageResponseSchema,
	workflowsRemove: MessageResponseSchema,
	workflowsRun: WorkflowsRunResponseSchema,
	workflowsPause: MessageResponseSchema,
	workflowsResume: WorkflowsResumeResponseSchema,
	workflowsStop: MessageResponseSchema,
	workflowsSchedule: MessageResponseSchema,
	workflowsHistory: WorkflowsHistoryResponseSchema,
	workflowsData: WorkflowsDataResponseSchema,
	workflowsJobStatus: JobStatusResponseSchema,
	workflowsConnectors: WorkflowsConnectorsResponseSchema,
	schemasList: SchemasListResponseSchema,
	schemasGet: SchemaGetResponseSchema,
	schemasCreate: SchemaCreateResponseSchema,
	schemasUpdate: SchemaUpdateResponseSchema,
	schemasRemove: SchemaRemoveResponseSchema,
	changesList: ChangesListResponseSchema,
	changesGet: ChangeGetResponseSchema,
	variablesList: VariablesListResponseSchema,
	variablesGet: VariableGetResponseSchema,
	variablesCreate: VariableGetResponseSchema,
	variablesUpdate: VariableGetResponseSchema,
	variablesRemove: VariableGetResponseSchema,
	triggersList: TriggersListResponseSchema,
	locationsList: LocationsListResponseSchema,
} as const;
