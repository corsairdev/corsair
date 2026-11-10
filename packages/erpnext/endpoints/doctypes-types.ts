import { z } from 'zod';

// ── Schemas for the `doctypes` family ─────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: the /api/resource
// DocType list route and frappe/handler.py (every /api/method answer wraps its
// result in a `message` key). DocType metadata is provider-defined — the
// framework ships its own DocTypes and every deployment adds custom fields,
// permissions, and naming rules on top — so payload shapes validate as open
// records and only the wire envelope (data / message) is checked. Input
// objects are .strict() so typos fail at the boundary, and query names stay
// provider-verbatim (limit_page_length, with_parent), exactly as the Frappe
// sources declare them.

// unknown: a DocType resource row or metadata blob is a provider-defined
// record — field definitions, permissions, and naming rules differ per
// DocType and per deployment — so the payload stays a string-keyed bag of
// JSON values.
const ErpnextDoctypeRecordSchema = z.record(z.string(), z.unknown());

// GET /api/resource/DocType — `filters` stays a JSON string exactly as Frappe
// documents it: the provider parses it server-side. `limit_start` and
// `limit_page_length` are the provider-verbatim pagination keys.
const DoctypesListInputSchema = z
	.object({
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["module","=","Core"]], passed verbatim',
			),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z.number().int().min(0).optional(),
	})
	.strict();

// GET /api/method/frappe.desk.form.load.getdoctype — doctype names the schema
// to load and with_parent additionally loads parent and child DocTypes
// (Frappe accepts int|bool on the wire; the transport serializes the boolean
// as true/false).
const DoctypesGetMetaInputSchema = z
	.object({
		doctype: z.string().min(1),
		with_parent: z.boolean().optional(),
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// /api/resource list answers nest the rows under `data`.
const DoctypesListOutputSchema = z
	.object({
		data: z.array(ErpnextDoctypeRecordSchema),
	})
	.loose();

// frappe/desk/form/load.py getdoctype answers { meta, docs } which the
// /api/method wrapper nests under `message`: meta carries the DocType schema
// (field definitions, permissions) and docs the DocType plus parent/child
// documents.
const DoctypesGetMetaOutputSchema = z
	.object({
		message: z
			.object({
				meta: ErpnextDoctypeRecordSchema,
				docs: z.array(ErpnextDoctypeRecordSchema),
			})
			.loose(),
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const DoctypesInputSchemas = {
	'doctypes.list': DoctypesListInputSchema,
	'doctypes.getMeta': DoctypesGetMetaInputSchema,
} as const;

export const DoctypesOutputSchemas = {
	'doctypes.list': DoctypesListOutputSchema,
	'doctypes.getMeta': DoctypesGetMetaOutputSchema,
} as const;
