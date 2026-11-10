import { z } from 'zod';

// ── Schemas for the `system` family ───────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: frappe/handler.py
// (every /api/method answer wraps its result in a `message` key),
// frappe/__init__.py (`def ping(): return "pong"`, allow_guest),
// frappe/utils/change_log.py (get_versions), and the /api/resource routes
// (list answers nest the rows under `data`). Input objects are .strict() so
// typos fail at the boundary, and query names stay provider-verbatim
// (limit_page_length), exactly as the Frappe sources declare them.
//
// `system.getUserRoles` lists the `Has Role` child DocType, whose name
// contains a space. The space is a literal part of the catalog path — not a
// path parameter — so the factory's encodeURIComponent substitution never
// touches it. The WHATWG URL parser normalizes a literal space in the path to
// %20 on the wire (new URL('https://site/api/resource/Has Role').pathname ===
// '/api/resource/Has%20Role'), which Frappe accepts, so the raw catalog path
// works as-is and no extra encoding step is added here.

// ── Input schemas ─────────────────────────────────────────────────────────────

// GET /api/method/frappe.auth.get_logged_user — takes no parameters; Frappe
// answers frappe.session.user under `message`.
const SystemGetLoggedUserInputSchema = z.object({}).strict();

// GET /api/method/ping — takes no parameters (frappe/__init__.py,
// allow_guest=True).
const SystemPingInputSchema = z.object({}).strict();

// GET /api/method/frappe.utils.change_log.get_versions — takes no parameters.
// Requires a desk user: the version report is whitelisted for desk sessions,
// so API-only roles get a permission error instead of the versions.
const SystemGetFrameworkVersionInputSchema = z.object({}).strict();

// GET /api/resource/Language — `fields` stays a JSON string exactly as Frappe
// documents it (the provider parses it server-side); `limit_page_length` is a
// non-negative integer where 0 means "no page limit".
const SystemAllLanguagesInputSchema = z
	.object({
		fields: z
			.string()
			.optional()
			.describe(
				'JSON array string of field names to return, for example ["language_code","language_name"], passed verbatim to Frappe',
			),
		limit_page_length: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Maximum rows per page; Frappe treats 0 as no page limit and returns every language',
			),
	})
	.strict();

// GET /api/resource/Role — the shared /api/resource list query. `fields` and
// `filters` stay JSON strings that Frappe parses server-side.
const SystemAllRolesInputSchema = z
	.object({
		fields: z
			.string()
			.optional()
			.describe(
				'JSON array string of field names to return, for example ["name","desk_access"], passed verbatim to Frappe',
			),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["desk_access","=",1]], passed verbatim',
			),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Maximum rows per page; Frappe treats 0 as no page limit and returns every role',
			),
	})
	.strict();

// GET /api/resource/Has Role — the same list query against the role-assignment
// child records (see the header note about the space in the DocType name).
const SystemUserRolesInputSchema = z
	.object({
		fields: z
			.string()
			.optional()
			.describe(
				'JSON array string of field names to return, for example ["parent","role"], passed verbatim to Frappe',
			),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["parenttype","=","User"]], passed verbatim',
			),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Maximum rows per page; Frappe treats 0 as no page limit and returns every assignment',
			),
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// frappe.auth.get_logged_user answers the session user's email under the
// /api/method `message` wrapper.
const SystemGetLoggedUserOutputSchema = z
	.object({
		message: z.string(),
	})
	.loose();

// frappe/__init__.py defines `def ping(): return "pong"` (allow_guest=True)
// and frappe/handler.py nests the result under `message`. The value stays a
// plain string instead of z.literal('pong') so guest-enabled or older
// deployments that phrase the reply differently still parse.
const SystemPingOutputSchema = z
	.object({
		message: z.string(),
	})
	.loose();

// frappe/utils/change_log.py get_versions answers one entry per installed
// app, keyed by app name ("frappe", "erpnext", ...).
// unknown: the per-app value carries provider-defined version metadata
// (version, branch, and other keys that vary by app and deployment), so only
// the app-name-keyed record shape is enforced.
const SystemGetFrameworkVersionOutputSchema = z
	.object({
		message: z.record(z.string(), z.unknown()),
	})
	.loose();

// /api/resource list answers (Language, Role, Has Role) nest the rows under
// `data`.
// unknown: resource list rows are open field bags — each DocType defines its
// own columns and the `fields` query picks which ones come back — so rows
// validate as string-keyed records of JSON values.
const SystemResourceListOutputSchema = z
	.object({
		data: z.array(z.record(z.string(), z.unknown())),
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const SystemInputSchemas = {
	'system.getLoggedUser': SystemGetLoggedUserInputSchema,
	'system.ping': SystemPingInputSchema,
	'system.getFrameworkVersion': SystemGetFrameworkVersionInputSchema,
	'system.getAllLanguages': SystemAllLanguagesInputSchema,
	'system.getAllRoles': SystemAllRolesInputSchema,
	'system.getUserRoles': SystemUserRolesInputSchema,
} as const;

export const SystemOutputSchemas = {
	'system.getLoggedUser': SystemGetLoggedUserOutputSchema,
	'system.ping': SystemPingOutputSchema,
	'system.getFrameworkVersion': SystemGetFrameworkVersionOutputSchema,
	'system.getAllLanguages': SystemResourceListOutputSchema,
	'system.getAllRoles': SystemResourceListOutputSchema,
	'system.getUserRoles': SystemResourceListOutputSchema,
} as const;
