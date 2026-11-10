import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// ServiceNow Table API records are not fixed: every instance extends the base
// tables with its own columns, and `sysparm_fields` narrows what comes back. So
// a record stays an open map of string fields, and the base fields that always
// exist are described rather than required.

/**
 * A record from any table.
 *
 * unknown: columns are per-instance. `incident` has `caller_id`, `cmdb_ci` and
 * `business_service`; a custom table has none of them, and a deployment can add
 * or remove fields without warning. Typing these would reject valid records.
 */
const RecordSchema = z
	.record(z.string(), z.unknown())
	.describe(
		'A ServiceNow record; fields depend on the table and sysparm_fields',
	);

export type ServicenowRecord = z.infer<typeof RecordSchema>;

/** A sys_id: 32 lowercase hex characters. */
const sysId = z
	.string()
	.regex(/^[0-9a-f]{32}$/i, 'sys_id must be 32 hexadecimal characters')
	.describe('ServiceNow sys_id');

/**
 * The query operators `sysparm_query` accepts, appended to a field name as
 * `field<operator>value`. Documented at
 * https://www.servicenow.com/docs/r/api-reference/rest-apis/c_TableAPI.html
 */
const SysparmQuerySchema = z
	.string()
	.describe(
		'Encoded query, e.g. "active=true^priority=1^ORDERBYDESCsys_created_on". Operators: = != > < >= <= LIKE STARTSWITH ENDSWITH IN ISEMPTY ISNOTEMPTY BETWEEN',
	);

const SysparmFieldsSchema = z
	.string()
	.describe(
		'Comma-separated fields to return, e.g. "number,short_description,state"',
	);

const PagingSchema = {
	sysparm_limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Records per page. ServiceNow defaults to 10000 when omitted'),
	sysparm_offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip. Add sysparm_limit per page to walk a table'),
};

// ── records.list ──────────────────────────────────────────────────────────

const RecordsListInputSchema = z.object({
	table: z
		.string()
		.min(1)
		.describe('Table name, e.g. incident, change_request'),
	sysparm_query: SysparmQuerySchema.optional(),
	sysparm_fields: SysparmFieldsSchema.optional(),
	sysparm_display_value: z
		.union([z.literal('true'), z.literal('false'), z.literal('all')])
		.optional()
		.describe(
			'false (default) returns raw values; true returns display values; all returns both',
		),
	sysparm_exclude_reference_link: z
		.boolean()
		.optional()
		.describe('Omit the per-field reference link objects'),
	sysparm_no_count: z
		.boolean()
		.optional()
		.describe('Skip the total; makes the call faster on large tables'),
	...PagingSchema,
});

export type RecordsListInput = z.input<typeof RecordsListInputSchema>;

const RecordsListResponseSchema = z.object({
	records: z.array(RecordSchema),
});

export type RecordsListResponse = z.infer<typeof RecordsListResponseSchema>;

// ── records.get ───────────────────────────────────────────────────────────

const RecordsGetInputSchema = z.object({
	table: z.string().min(1),
	sys_id: sysId,
	sysparm_fields: SysparmFieldsSchema.optional(),
	sysparm_display_value: z
		.union([z.literal('true'), z.literal('false'), z.literal('all')])
		.optional(),
	sysparm_exclude_reference_link: z
		.boolean()
		.optional()
		.describe(
			'Return a reference column as a bare sys_id instead of { link, value }',
		),
});

export type RecordsGetInput = z.input<typeof RecordsGetInputSchema>;

const RecordsGetResponseSchema = RecordSchema;

export type RecordsGetResponse = z.infer<typeof RecordsGetResponseSchema>;

// ── records.create ────────────────────────────────────────────────────────

const RecordsCreateInputSchema = z.object({
	table: z.string().min(1),
	// unknown: columns are per-instance, so the values cannot be typed here.
	fields: z
		.record(z.string(), z.unknown())
		.describe(
			'Column values for the new record, e.g. { short_description: "..." }',
		),
	sysparm_input_display_value: z
		.boolean()
		.optional()
		.describe('Treat the supplied values as display values'),
	sysparm_display_value: z
		.union([z.literal('true'), z.literal('false'), z.literal('all')])
		.optional(),
});

export type RecordsCreateInput = z.input<typeof RecordsCreateInputSchema>;

const RecordsCreateResponseSchema = RecordSchema;

export type RecordsCreateResponse = z.infer<typeof RecordsCreateResponseSchema>;

// ── records.update ────────────────────────────────────────────────────────

const RecordsUpdateInputSchema = z.object({
	table: z.string().min(1),
	sys_id: sysId,
	// unknown: columns are per-instance, so the values cannot be typed here.
	fields: z.record(z.string(), z.unknown()),
	sysparm_input_display_value: z.boolean().optional(),
});

export type RecordsUpdateInput = z.input<typeof RecordsUpdateInputSchema>;

const RecordsUpdateResponseSchema = RecordSchema;

export type RecordsUpdateResponse = z.infer<typeof RecordsUpdateResponseSchema>;

// ── records.delete ────────────────────────────────────────────────────────

const RecordsDeleteInputSchema = z.object({
	table: z.string().min(1),
	sys_id: sysId,
});

export type RecordsDeleteInput = z.input<typeof RecordsDeleteInputSchema>;

/**
 * A DELETE answers 204 with no body, so the shape echoes back what was removed
 * rather than parsing one.
 */
const RecordsDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	table: z.string(),
	sys_id: z.string(),
});

export type RecordsDeleteResponse = z.infer<typeof RecordsDeleteResponseSchema>;

// ── tables.list ───────────────────────────────────────────────────────────

const TablesListInputSchema = z.object({
	sysparm_query: SysparmQuerySchema.optional(),
	sysparm_fields: SysparmFieldsSchema.optional(),
	sysparm_exclude_reference_link: z
		.boolean()
		.optional()
		.describe(
			'Return a reference column as a bare sys_id instead of { link, value }',
		),
	...PagingSchema,
});

export type TablesListInput = z.input<typeof TablesListInputSchema>;

/**
 * A reference field. Verified live: by default ServiceNow returns
 * `{ link, value }`, and only a plain string with
 * `sysparm_exclude_reference_link=true`. So a reference column must accept both
 * or it rejects every real response.
 */
const ReferenceOrStringSchema = z
	.union([
		z.string(),
		z
			.object({
				link: z.string().nullish(),
				value: z.string().nullish(),
			})
			.loose(),
	])
	.nullish();

const TableSchema = z
	.object({
		name: z.string().describe('Table name, to pass as `table`'),
		label: z.string().nullish(),
		// A reference to the parent table, so it arrives as `{ link, value }`
		// unless reference links are excluded.
		super_class: ReferenceOrStringSchema,
		sys_id: z.string().nullish(),
	})
	.loose();

export type ServicenowTable = z.infer<typeof TableSchema>;

const TablesListResponseSchema = z.object({
	tables: z.array(TableSchema),
});

export type TablesListResponse = z.infer<typeof TablesListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ServicenowEndpointInputs = {
	recordsList: RecordsListInput;
	recordsGet: RecordsGetInput;
	recordsCreate: RecordsCreateInput;
	recordsUpdate: RecordsUpdateInput;
	recordsDelete: RecordsDeleteInput;
	tablesList: TablesListInput;
};

export type ServicenowEndpointOutputs = {
	recordsList: RecordsListResponse;
	recordsGet: RecordsGetResponse;
	recordsCreate: RecordsCreateResponse;
	recordsUpdate: RecordsUpdateResponse;
	recordsDelete: RecordsDeleteResponse;
	tablesList: TablesListResponse;
};

export const ServicenowEndpointInputSchemas = {
	recordsList: RecordsListInputSchema,
	recordsGet: RecordsGetInputSchema,
	recordsCreate: RecordsCreateInputSchema,
	recordsUpdate: RecordsUpdateInputSchema,
	recordsDelete: RecordsDeleteInputSchema,
	tablesList: TablesListInputSchema,
} as const;

export const ServicenowEndpointOutputSchemas = {
	recordsList: RecordsListResponseSchema,
	recordsGet: RecordsGetResponseSchema,
	recordsCreate: RecordsCreateResponseSchema,
	recordsUpdate: RecordsUpdateResponseSchema,
	recordsDelete: RecordsDeleteResponseSchema,
	tablesList: TablesListResponseSchema,
} as const;
