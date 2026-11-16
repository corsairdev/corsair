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

/** A cell value: Ninox documents exactly these four types. */
const CellSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

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
		name: z.string().nullish(),
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
	.catchall(CellSchema);

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
} as const;
