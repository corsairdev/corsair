import { z } from 'zod';

// Inputs use Ninox's own field names, which are camelCase. Outputs are
// `.loose()` and their documented fields nullish, so a field Ninox adds cannot
// fail a call that has already happened.
//
// A record's `values` is the interesting one: it is keyed by the table's own
// field names, so the map is open. Ninox documents each cell as boolean, null,
// number or string, never a nested object.

const WorkspaceIdSchema = z
	.string()
	.regex(/^[a-z0-9]{12}$/, 'Expected the 12-character workspace id')
	.describe('The workspace id, twelve lowercase letters or digits.');

const ModuleNameSchema = z
	.string()
	.min(1)
	.describe('The module name, as it appears in the workspace.');

const TableNameSchema = z
	.string()
	.min(1)
	.describe('The table name, as it appears in the module.');

const RecordIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The numeric record id.');

/**
 * A cell value: a string, number, boolean or null, or for a `multi` field an
 * array of option ids (Ninox answers and takes arrays there).
 */
const CellSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(z.union([z.string(), z.number()])),
]);

/** A record body keyed by the table's own field names. */
const RowValuesSchema = z
	.record(z.string(), CellSchema)
	.describe(
		'Field name to value. Ninox accepts a date, timestamp or appointment as an ISO 8601 string or a Unix millisecond value, and a choice or multi field as an option id or label.',
	);

const PagingSchema = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Most rows to return, 1 to 100.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Rows to skip. Starts at 0.'),
};

const PageInfoSchema = z
	.object({
		has_more: z.boolean().nullish(),
		limit: z.number().nullish(),
		offset: z.number().nullish(),
	})
	.loose();

// ── workspace.get ─────────────────────────────────────────────────────────

const WorkspaceGetInputSchema = z.object({ workspaceId: WorkspaceIdSchema });

export type WorkspaceGetInput = z.input<typeof WorkspaceGetInputSchema>;

const ModuleSummarySchema = z
	.object({
		moduleId: z.string().nullish(),
		name: z.string().nullish(),
		// unknown: labels are keyed by locale ("" is the default).
		labels: z.record(z.string(), z.unknown()).nullish(),
		description: z.string().nullish(),
		afterOpen: z.string().nullish(),
	})
	.loose();

export type NinoxModule = z.infer<typeof ModuleSummarySchema>;

const WorkspaceGetResponseSchema = z.object({
	modules: z.array(ModuleSummarySchema),
});

export type WorkspaceGetResponse = z.infer<typeof WorkspaceGetResponseSchema>;

// ── modules.list ──────────────────────────────────────────────────────────

const ModulesListInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	...PagingSchema,
});

export type ModulesListInput = z.input<typeof ModulesListInputSchema>;

const ModulesListResponseSchema = z.object({
	modules: z.array(ModuleSummarySchema),
	page_info: PageInfoSchema.nullish(),
});

export type ModulesListResponse = z.infer<typeof ModulesListResponseSchema>;

// ── tables.list ───────────────────────────────────────────────────────────

const TablesListInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	...PagingSchema,
});

export type TablesListInput = z.input<typeof TablesListInputSchema>;

const TableSummarySchema = z
	.object({
		name: z.string().nullish(),
		description: z.string().nullish(),
		canCreate: z.string().nullish(),
		canDelete: z.string().nullish(),
	})
	.loose();

export type NinoxTable = z.infer<typeof TableSummarySchema>;

const TablesListResponseSchema = z.object({
	tables: z.array(TableSummarySchema),
	page_info: PageInfoSchema.nullish(),
});

export type TablesListResponse = z.infer<typeof TablesListResponseSchema>;

// ── fields.list ───────────────────────────────────────────────────────────

const FieldsListInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	...PagingSchema,
});

export type FieldsListInput = z.input<typeof FieldsListInputSchema>;

/**
 * A field definition. `type` is Ninox's own field kind, such as `text`, `number`,
 * `choice`, `multi`, `date` or `icon`, and which other keys apply depends on it,
 * so the rest of the definition is passed through.
 */
const FieldSchema = z
	.object({
		name: z.string().nullish(),
		type: z.string().nullish(),
		required: z.boolean().nullish(),
		unique: z.boolean().nullish(),
		canRead: z.string().nullish(),
		canWrite: z.string().nullish(),
		binding: z.string().nullish(),
	})
	.loose();

export type NinoxField = z.infer<typeof FieldSchema>;

const FieldsListResponseSchema = z.object({
	fields: z.array(FieldSchema),
	page_info: PageInfoSchema.nullish(),
});

export type FieldsListResponse = z.infer<typeof FieldsListResponseSchema>;

// ── records.list ──────────────────────────────────────────────────────────

const RecordsListInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	fields: z
		.array(z.string().min(1))
		.optional()
		.describe('Only these field names, sent comma-separated.'),
	filter: z
		.string()
		.optional()
		.describe(
			'A JSON object of field name to value, e.g. {"email":"a@b.com"}. A filter on a choice field takes an option id or a label.',
		),
	sort: z
		.string()
		.optional()
		.describe('Comma-separated field names; prefix one with - for descending.'),
	...PagingSchema,
});

export type RecordsListInput = z.input<typeof RecordsListInputSchema>;

export const RowSchema = z
	.object({ id: z.string().nullish(), values: RowValuesSchema.nullish() })
	.loose();

export type NinoxRow = z.infer<typeof RowSchema>;

const RecordsListResponseSchema = z.object({
	rows: z.array(RowSchema),
	page_info: PageInfoSchema.nullish(),
});

export type RecordsListResponse = z.infer<typeof RecordsListResponseSchema>;

// ── records.get ───────────────────────────────────────────────────────────

const RecordGetInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	recordId: RecordIdSchema,
	fields: z.array(z.string().min(1)).optional(),
});

export type RecordGetInput = z.input<typeof RecordGetInputSchema>;

export type RecordGetResponse = NinoxRow;

// ── records.create ────────────────────────────────────────────────────────

const RecordsCreateInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	records: z.array(RowValuesSchema).min(1),
});

export type RecordsCreateInput = z.input<typeof RecordsCreateInputSchema>;

const RecordsCreatedResponseSchema = z.object({
	ids: z.array(z.string()),
});

export type RecordsCreateResponse = z.infer<
	typeof RecordsCreatedResponseSchema
>;

// ── records.update ────────────────────────────────────────────────────────

/**
 * One record to update. Ninox takes the id plus a flat map of the fields to
 * write, and an optional `_expected` map: when a field in it no longer holds
 * the value the caller read, the whole update is rejected with 409 unless
 * `override` is sent.
 */
const RecordUpdateSchema = z
	.object({
		id: RecordIdSchema,
		_expected: z
			.record(z.string(), CellSchema)
			.optional()
			.describe(
				'Field values as they were read. A mismatch rejects the update with 409 unless override is set.',
			),
	})
	// The catchall also admits a map so `_expected` type-checks beside the
	// dynamic field keys; zod still checks `_expected` with its own schema.
	.catchall(z.union([CellSchema, z.record(z.string(), CellSchema)]));

const RecordsUpdateInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	override: z
		.boolean()
		.optional()
		.describe(
			'Write the values even when one no longer matches its _expected entry, instead of answering 409.',
		),
	records: z.array(RecordUpdateSchema).min(1),
});

export type RecordsUpdateInput = z.input<typeof RecordsUpdateInputSchema>;

const RecordsUpdatedResponseSchema = z.object({
	updatedIds: z.array(z.string()),
});

export type RecordsUpdateResponse = z.infer<
	typeof RecordsUpdatedResponseSchema
>;

// ── records.delete ────────────────────────────────────────────────────────

const RecordsDeleteInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	recordIds: z
		.array(RecordIdSchema)
		.min(1)
		.describe(
			'Records to delete. Ninox deletes them in one transaction and rolls the whole set back if any id is wrong.',
		),
});

export type RecordsDeleteInput = z.input<typeof RecordsDeleteInputSchema>;

const RecordsDeletedResponseSchema = z.object({
	deletedIds: z.array(z.string()),
});

export type RecordsDeleteResponse = z.infer<
	typeof RecordsDeletedResponseSchema
>;

// ── records.upsert ────────────────────────────────────────────────────────

const RecordsUpsertInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	matchField: z
		.string()
		.min(1)
		.describe(
			'The unique field to match on. Ninox refuses a field not marked unique, and a non-unique match answers 409.',
		),
	records: z.array(RowValuesSchema).min(1),
});

export type RecordsUpsertInput = z.input<typeof RecordsUpsertInputSchema>;

const RecordsUpsertResponseSchema = z.object({
	createdIds: z.array(z.string()),
	updatedIds: z.array(z.string()),
});

export type RecordsUpsertResponse = z.infer<typeof RecordsUpsertResponseSchema>;

// ── records.changes ───────────────────────────────────────────────────────

const RecordsChangesInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	since: z
		.string()
		.datetime({ offset: true })
		.describe(
			'Return changes at or after this instant. Only tables with history tracking enabled answer; others return 400.',
		),
	asOf: z
		.string()
		.datetime({ offset: true })
		.optional()
		.describe(
			"The first page's meta.asOf, when paging through one poll so the window stays fixed.",
		),
	...PagingSchema,
});

export type RecordsChangesInput = z.input<typeof RecordsChangesInputSchema>;

const RowChangeSchema = z
	.object({
		id: z.string().nullish(),
		changeType: z.string().nullish(),
		changedAt: z.string().nullish(),
	})
	.loose();

export type NinoxRowChange = z.infer<typeof RowChangeSchema>;

const RecordsChangesResponseSchema = z.object({
	changes: z.array(RowChangeSchema),
	asOf: z
		.string()
		.nullish()
		.describe('Pass as `since` on the next poll to avoid a gap or a repeat.'),
	page_info: PageInfoSchema.nullish(),
});

export type RecordsChangesResponse = z.infer<
	typeof RecordsChangesResponseSchema
>;

// ── modules.get, tables.get/create/delete, fields.create/delete ────────────

const ModuleGetInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
});

export type ModuleGetInput = z.input<typeof ModuleGetInputSchema>;

const ModuleGetResponseSchema = z.object({ module: ModuleSummarySchema });

export type ModuleGetResponse = z.infer<typeof ModuleGetResponseSchema>;

const TableRefInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
});

export type TableRefInput = z.input<typeof TableRefInputSchema>;

/** A table with its fields, as Ninox answers a single-table read or a create. */
const TableDetailSchema = TableSummarySchema.extend({
	fields: z.array(FieldSchema).nullish(),
}).loose();

const TableResponseSchema = z.object({ table: TableDetailSchema });

export type TableResponse = z.infer<typeof TableResponseSchema>;

/** Labels keyed by locale; "" is the default label. */
const LabelsSchema = z
	.record(z.string(), z.string())
	.describe('Labels by locale, e.g. { "": "Customers", "de": "Kunden" }.');

const TableCreateInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	table: z
		.object({
			name: z
				.string()
				.min(1)
				.describe('The internal table name used in paths, e.g. customers.'),
			labels: LabelsSchema,
			hasFiles: z.boolean().optional(),
			hasHistory: z.boolean().optional(),
			isHidden: z.boolean().optional(),
		})
		// Ninox documents more keys (permissions, triggers, icon); it checks them.
		.loose(),
});

export type TableCreateInput = z.input<typeof TableCreateInputSchema>;

/** A delete answers 204, so this records what was removed. */
const DeletedSchema = z.object({ deleted: z.literal(true), name: z.string() });

export type NinoxDeleted = z.infer<typeof DeletedSchema>;

export const NINOX_FIELD_TYPES = [
	'string',
	'html',
	'number',
	'boolean',
	'choice',
	'dchoice',
	'multi',
	'dmulti',
	'file',
	'date',
	'timestamp',
	'time',
	'appointment',
	'reference',
	'reverse',
	'function',
	'color',
	'icon',
] as const;

const FieldCreateInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	field: z
		.object({
			name: z.string().min(1).describe('The internal field name.'),
			labels: LabelsSchema,
			type: z.enum(NINOX_FIELD_TYPES),
			required: z.boolean().optional(),
			unique: z.boolean().optional(),
			variant: z
				.string()
				.min(1)
				.optional()
				.describe(
					'For a string field: text, multiline-text, email, phone, url, location or signature.',
				),
			// unknown: an options array for choice/multi, or an expression string
			// for dchoice/dmulti, as Ninox documents.
			options: z
				.unknown()
				.optional()
				.describe(
					"For choice/multi: [{ label: 'red' }, { label: 'blue' }]; Ninox assigns the ids. For dchoice/dmulti: a selection expression.",
				),
			refTableName: z.string().min(1).optional(),
			expression: z.string().min(1).optional(),
		})
		// Other documented keys (roles, index, defaultValue) pass through.
		.loose(),
});

export type FieldCreateInput = z.input<typeof FieldCreateInputSchema>;

const FieldResponseSchema = z.object({ field: FieldSchema });

export type FieldResponse = z.infer<typeof FieldResponseSchema>;

const FieldDeleteInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema,
	tableName: TableNameSchema,
	fieldName: z.string().min(1).describe('The internal field name.'),
});

export type FieldDeleteInput = z.input<typeof FieldDeleteInputSchema>;

// ── views.list ────────────────────────────────────────────────────────────

const ViewSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const ViewsListResponseSchema = z.object({ views: z.array(ViewSchema) });

export type ViewsListResponse = z.infer<typeof ViewsListResponseSchema>;

// ── scripts.execute ───────────────────────────────────────────────────────

const ScriptExecuteInputSchema = z.object({
	workspaceId: WorkspaceIdSchema,
	moduleName: ModuleNameSchema.describe(
		'The module the script runs in; `do as database` stays inside it.',
	),
	script: z
		.string()
		.min(1)
		.describe('Ninox script, e.g. count(select customers).'),
	tableName: TableNameSchema.optional(),
	rowId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A record the script runs against (as `this`).'),
	mode: z
		.enum(['wait', 'background'])
		.optional()
		.describe(
			'wait (default) answers the result when the script ends in time; background answers the run at once.',
		),
});

export type ScriptExecuteInput = z.input<typeof ScriptExecuteInputSchema>;

/**
 * `result` is what the script's last expression evaluated to, or absent when
 * Ninox answered 202 with a run to follow up on instead.
 */
const ScriptExecuteResponseSchema = z.object({
	// unknown: a Ninox script can evaluate to any JSON value.
	result: z.unknown().optional(),
	/** Set instead of `result` when Ninox answered 202 (a background run). */
	run: z
		.object({ id: z.string().nullish(), status: z.string().nullish() })
		.loose()
		.optional(),
});

export type ScriptExecuteResponse = z.infer<typeof ScriptExecuteResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type NinoxEndpointInputs = {
	workspaceGet: WorkspaceGetInput;
	modulesList: ModulesListInput;
	tablesList: TablesListInput;
	fieldsList: FieldsListInput;
	recordsList: RecordsListInput;
	recordsGet: RecordGetInput;
	recordsCreate: RecordsCreateInput;
	recordsUpdate: RecordsUpdateInput;
	recordsDelete: RecordsDeleteInput;
	recordsUpsert: RecordsUpsertInput;
	recordsChanges: RecordsChangesInput;
	moduleGet: ModuleGetInput;
	tableGet: TableRefInput;
	tableCreate: TableCreateInput;
	tableDelete: TableRefInput;
	fieldCreate: FieldCreateInput;
	fieldDelete: FieldDeleteInput;
	viewsList: TableRefInput;
	scriptExecute: ScriptExecuteInput;
};

export type NinoxEndpointOutputs = {
	workspaceGet: WorkspaceGetResponse;
	modulesList: ModulesListResponse;
	tablesList: TablesListResponse;
	fieldsList: FieldsListResponse;
	recordsList: RecordsListResponse;
	recordsGet: RecordGetResponse;
	recordsCreate: RecordsCreateResponse;
	recordsUpdate: RecordsUpdateResponse;
	recordsDelete: RecordsDeleteResponse;
	recordsUpsert: RecordsUpsertResponse;
	recordsChanges: RecordsChangesResponse;
	moduleGet: ModuleGetResponse;
	tableGet: TableResponse;
	tableCreate: TableResponse;
	tableDelete: NinoxDeleted;
	fieldCreate: FieldResponse;
	fieldDelete: NinoxDeleted;
	viewsList: ViewsListResponse;
	scriptExecute: ScriptExecuteResponse;
};

export const NinoxEndpointInputSchemas = {
	workspaceGet: WorkspaceGetInputSchema,
	modulesList: ModulesListInputSchema,
	tablesList: TablesListInputSchema,
	fieldsList: FieldsListInputSchema,
	recordsList: RecordsListInputSchema,
	recordsGet: RecordGetInputSchema,
	recordsCreate: RecordsCreateInputSchema,
	recordsUpdate: RecordsUpdateInputSchema,
	recordsDelete: RecordsDeleteInputSchema,
	recordsUpsert: RecordsUpsertInputSchema,
	recordsChanges: RecordsChangesInputSchema,
	moduleGet: ModuleGetInputSchema,
	tableGet: TableRefInputSchema,
	tableCreate: TableCreateInputSchema,
	tableDelete: TableRefInputSchema,
	fieldCreate: FieldCreateInputSchema,
	fieldDelete: FieldDeleteInputSchema,
	viewsList: TableRefInputSchema,
	scriptExecute: ScriptExecuteInputSchema,
} as const;

export const NinoxEndpointOutputSchemas = {
	workspaceGet: WorkspaceGetResponseSchema,
	modulesList: ModulesListResponseSchema,
	tablesList: TablesListResponseSchema,
	fieldsList: FieldsListResponseSchema,
	recordsList: RecordsListResponseSchema,
	recordsGet: RowSchema,
	recordsCreate: RecordsCreatedResponseSchema,
	recordsUpdate: RecordsUpdatedResponseSchema,
	recordsDelete: RecordsDeletedResponseSchema,
	recordsUpsert: RecordsUpsertResponseSchema,
	recordsChanges: RecordsChangesResponseSchema,
	moduleGet: ModuleGetResponseSchema,
	tableGet: TableResponseSchema,
	tableCreate: TableResponseSchema,
	tableDelete: DeletedSchema,
	fieldCreate: FieldResponseSchema,
	fieldDelete: DeletedSchema,
	viewsList: ViewsListResponseSchema,
	scriptExecute: ScriptExecuteResponseSchema,
} as const;
