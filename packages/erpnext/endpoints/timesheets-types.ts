import { z } from 'zod';

// ── Schemas for the `timesheets` family ───────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: the /api/resource
// Timesheet list and create routes and frappe/handler.py (resource answers
// nest their results under a `data` key). The Timesheet document is an open
// field bag — time_logs is its key child table (activity_type, from_time,
// to_time, hours rows) and every deployment adds custom fields on top of the
// shipped columns — so payload shapes validate as open records and only the
// wire envelope (data) is checked. Input objects are .strict() so typos fail
// at the boundary, and query names stay provider-verbatim
// (limit_page_length), exactly as the Frappe sources declare them.

// unknown: a Timesheet document is an open record of provider-defined field
// values — the time_logs child rows are part of that bag; no static schema
// can enumerate the fields across deployments (custom fields included), so
// the payload stays a string-keyed bag of JSON values.
const ErpnextTimesheetValuesSchema = z.record(z.string(), z.unknown());

// GET /api/resource/Timesheet — the shared /api/resource list query. `fields`
// and `filters` stay JSON strings exactly as Frappe documents them: the
// provider parses both server-side.
const TimesheetsListInputSchema = z
	.object({
		fields: z
			.string()
			.optional()
			.describe(
				'JSON array string of field names to return, for example ["name","employee","total_hours"], passed verbatim to Frappe',
			),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["docstatus","=",0]], passed verbatim',
			),
		order_by: z.string().optional(),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Maximum rows per page; Frappe treats 0 as no page limit and returns every timesheet',
			),
	})
	.strict();

// The shared factory forwards the `body` input key verbatim as the JSON
// request body, so every body-carrying operation nests its wire payload under
// a top-level `body` object.

// POST /api/resource/Timesheet — the body is the Timesheet document's field
// values (time_logs is the key child table); Frappe fills
// creation/modified/owner itself and the route derives the Timesheet doctype
// from the path.
const TimesheetsCreateInputSchema = z
	.object({
		body: ErpnextTimesheetValuesSchema,
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// /api/resource list answers nest the rows under `data`.
const TimesheetsListOutputSchema = z
	.object({
		data: z.array(ErpnextTimesheetValuesSchema),
	})
	.loose();

// /api/resource create answers the created Timesheet document under `data`.
const TimesheetsCreateOutputSchema = z
	.object({
		data: ErpnextTimesheetValuesSchema,
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const TimesheetsInputSchemas = {
	'timesheets.list': TimesheetsListInputSchema,
	'timesheets.create': TimesheetsCreateInputSchema,
} as const;

export const TimesheetsOutputSchemas = {
	'timesheets.list': TimesheetsListOutputSchema,
	'timesheets.create': TimesheetsCreateOutputSchema,
} as const;
