import { z } from 'zod';

// ── Schemas for the `people` family ───────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: the /api/resource
// Employee and Project list routes and frappe/handler.py (resource answers
// nest their results under a `data` key). Employee and Project documents are
// open field bags — every DocType ships its own columns and every deployment
// adds custom fields on top — so payload shapes validate as open records and
// only the wire envelope (data) is checked. Input objects are .strict() so
// typos fail at the boundary, and query names stay provider-verbatim
// (limit_page_length), exactly as the Frappe sources declare them.

// unknown: an Employee or Project document is an open record of
// provider-defined field values; no static schema can enumerate them across
// deployments (custom fields included), so the payload stays a string-keyed
// bag of JSON values.
const ErpnextPeopleValuesSchema = z.record(z.string(), z.unknown());

// GET /api/resource/Employee — the shared /api/resource list query. `fields`
// and `filters` stay JSON strings exactly as Frappe documents them: the
// provider parses both server-side.
const PeopleListEmployeesInputSchema = z
	.object({
		fields: z
			.string()
			.optional()
			.describe(
				'JSON array string of field names to return, for example ["name","employee_name","department"], passed verbatim to Frappe',
			),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["status","=","Active"]], passed verbatim',
			),
		order_by: z.string().optional(),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Maximum rows per page; Frappe treats 0 as no page limit and returns every employee',
			),
	})
	.strict();

// GET /api/resource/Project — the same list query against the Project
// records.
const PeopleListProjectsInputSchema = z
	.object({
		fields: z
			.string()
			.optional()
			.describe(
				'JSON array string of field names to return, for example ["name","project_name","status"], passed verbatim to Frappe',
			),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["status","=","Open"]], passed verbatim',
			),
		order_by: z.string().optional(),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Maximum rows per page; Frappe treats 0 as no page limit and returns every project',
			),
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// /api/resource list answers (Employee, Project) nest the rows under `data`.
const PeopleListOutputSchema = z
	.object({
		data: z.array(ErpnextPeopleValuesSchema),
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const PeopleInputSchemas = {
	'people.listEmployees': PeopleListEmployeesInputSchema,
	'people.listProjects': PeopleListProjectsInputSchema,
} as const;

export const PeopleOutputSchemas = {
	'people.listEmployees': PeopleListOutputSchema,
	'people.listProjects': PeopleListOutputSchema,
} as const;
