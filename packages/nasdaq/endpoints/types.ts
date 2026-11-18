import { z } from 'zod';

// Inputs use Nasdaq Data Link's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a column Nasdaq adds or omits cannot fail
// a call that has already happened.

/**
 * A table code is `{vendor}/{table}`, e.g. `NDAQ/RTAT10` or `MER/F1`. The slash
 * is part of the path, not an encoded character.
 */
const TableCodeSchema = z
	.string()
	.regex(/^[A-Za-z0-9_]+\/[A-Za-z0-9_]+$/, 'Expected {vendor}/{table}')
	.describe('The table code, e.g. NDAQ/RTAT10.');

/**
 * Every table takes its own row filters, and they are documented per table. A
 * filter on a column that is not filterable is rejected by Nasdaq, so the pair
 * is passed through as sent rather than guessed at here.
 */
const FilterValueSchema = z.union([z.string(), z.number(), z.boolean()]);

const FiltersSchema = z
	.record(z.string(), FilterValueSchema)
	.optional()
	.describe(
		'Row filters as column name to value, e.g. { ticker: "AAPL" }. Operators append to the name: `date.gte`, `date.lte`, `ticker.in[]`. Only columns the table marks filterable are accepted.',
	);

// ── tables.rows ───────────────────────────────────────────────────────────

export const NASDAQ_MAX_PER_PAGE = 10_000;

const TablesRowsInputSchema = z.object({
	table: TableCodeSchema,
	filters: FiltersSchema,
	columns: z
		.array(z.string().min(1))
		.optional()
		.describe('Only these columns, sent as qopts.columns.'),
	per_page: z
		.number()
		.int()
		.min(1)
		.max(NASDAQ_MAX_PER_PAGE)
		.optional()
		.describe(
			`Rows per page, up to ${NASDAQ_MAX_PER_PAGE}. Nasdaq returns at most ${NASDAQ_MAX_PER_PAGE} rows per call whatever this says.`,
		),
	cursor_id: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The `next_cursor_id` from the previous page. Nasdaq answers 400 QESx06 for an expired cursor.',
		),
});

export type TablesRowsInput = z.input<typeof TablesRowsInputSchema>;

const ColumnSchema = z
	.object({ name: z.string(), type: z.string().nullish() })
	.loose();

/**
 * The JSON shape wraps rows in `datatable.data`, a list of arrays in the same
 * order as `datatable.columns`, not a list of objects. Both are passed through
 * so a caller can zip them.
 */
const TablesRowsResponseSchema = z.object({
	columns: z.array(ColumnSchema),
	rows: z.array(
		z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
	),
	next_cursor_id: z
		.string()
		.nullish()
		.describe(
			'The cursor for the next page. Null or absent on the last page; check for either. Nasdaq sends no other paging state.',
		),
});

export type TablesRowsResponse = z.infer<typeof TablesRowsResponseSchema>;

// ── tables.metadata ───────────────────────────────────────────────────────

const TablesMetadataInputSchema = z.object({
	table: TableCodeSchema,
});

export type TablesMetadataInput = z.input<typeof TablesMetadataInputSchema>;

const TableStatusSchema = z
	.object({
		refreshed_at: z.string().nullish(),
		status: z.string().nullish(),
		expected_at: z.string().nullish(),
		update_frequency: z.string().nullish(),
	})
	.loose();

const DataVersionSchema = z
	.object({
		code: z.string().nullish(),
		default: z.boolean().nullish(),
		description: z.string().nullish(),
	})
	.loose();

const TablesMetadataResponseSchema = z.object({
	vendor_code: z.string().nullish(),
	datatable_code: z.string().nullish(),
	name: z.string().nullish(),
	description: z.string().nullish(),
	columns: z.array(ColumnSchema),
	/** The columns a caller may put in `filters`. */
	filters: z.array(z.string()).nullish(),
	primary_key: z.array(z.string()).nullish(),
	premium: z.boolean().nullish(),
	status: TableStatusSchema.nullish(),
	data_version: DataVersionSchema.nullish(),
});

export type TablesMetadataResponse = z.infer<
	typeof TablesMetadataResponseSchema
>;

// ── tables.export ─────────────────────────────────────────────────────────

const TablesExportInputSchema = z.object({
	table: TableCodeSchema,
	filters: FiltersSchema,
	columns: z
		.array(z.string().min(1))
		.optional()
		.describe('Only these columns in the export.'),
});

export type TablesExportInput = z.input<typeof TablesExportInputSchema>;

const ExportFileSchema = z
	.object({
		link: z
			.string()
			.nullish()
			.describe(
				'The signed download URL, valid for 30 minutes. Null while Nasdaq is still building the file.',
			),
		status: z.string().nullish(),
		data_snapshot_time: z.string().nullish(),
	})
	.loose();

const TablesExportResponseSchema = z.object({
	file: ExportFileSchema.nullish(),
	datatable: z
		.object({ last_refreshed_time: z.string().nullish() })
		.loose()
		.nullish(),
	status: z
		.string()
		.nullish()
		.describe(
			'fresh, creating or regenerating, lowercase as Nasdaq sends it (its docs capitalise them). Only fresh means the link is ready.',
		),
});

export type TablesExportResponse = z.infer<typeof TablesExportResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type NasdaqEndpointInputs = {
	tablesRows: TablesRowsInput;
	tablesMetadata: TablesMetadataInput;
	tablesExport: TablesExportInput;
};

export type NasdaqEndpointOutputs = {
	tablesRows: TablesRowsResponse;
	tablesMetadata: TablesMetadataResponse;
	tablesExport: TablesExportResponse;
};

export const NasdaqEndpointInputSchemas = {
	tablesRows: TablesRowsInputSchema,
	tablesMetadata: TablesMetadataInputSchema,
	tablesExport: TablesExportInputSchema,
} as const;

export const NasdaqEndpointOutputSchemas = {
	tablesRows: TablesRowsResponseSchema,
	tablesMetadata: TablesMetadataResponseSchema,
	tablesExport: TablesExportResponseSchema,
} as const;
