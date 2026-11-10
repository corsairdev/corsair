import { z } from 'zod';

// ── Schemas for the `desk` family ─────────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: frappe/desk/form/
// utils.py (add_comment's five required parameters and its returned Comment
// document), frappe/desk/doctype/tag/tag.py (add_tag(tag, dt, dn, color=None)
// returns the added tag string), frappe/desk/search.py (search_widget answers
// a list of result rows), and frappe/handler.py (every /api/method answer
// wraps its result in a `message` key). A Frappe document — and the Comment
// document with it — is an open field bag, so payload shapes validate as open
// records and only the wire envelope (message) is checked. Input objects are
// .strict() so typos fail at the boundary, and field names stay
// provider-verbatim (reference_doctype, dt, dn), exactly as the Frappe sources
// declare them.

// unknown: a Frappe document is an open record of provider-defined field
// values; no static schema can enumerate them across DocTypes, so the payload
// stays a string-keyed bag of JSON values.
const ErpnextDeskDocumentSchema = z.record(z.string(), z.unknown());

// The shared factory forwards the `body` input key verbatim as the JSON
// request body, so every body-carrying operation nests its wire payload under
// a top-level `body` object.

// POST /api/method/frappe.desk.form.utils.add_comment — all five parameters
// are required positionals of the whitelisted function (frappe/desk/form/
// utils.py: def add_comment(reference_doctype, reference_name, content,
// comment_email, comment_by)), and Frappe rejects a content that is empty
// after stripping HTML.
const DeskAddCommentInputSchema = z
	.object({
		body: z
			.object({
				reference_doctype: z.string().min(1),
				reference_name: z.string().min(1),
				content: z.string().min(1),
				comment_email: z.string().min(1),
				comment_by: z.string().min(1),
			})
			.strict(),
	})
	.strict();

// POST /api/method/frappe.desk.doctype.tag.tag.add_tag — tag, dt, and dn are
// required positionals and color is optional (frappe/desk/doctype/tag/tag.py:
// def add_tag(tag, dt, dn, color=None)).
const DeskAddTagInputSchema = z
	.object({
		body: z
			.object({
				tag: z.string().min(1),
				dt: z.string().min(1),
				dn: z.string().min(1),
				color: z.string().optional(),
			})
			.strict(),
	})
	.strict();

// GET /api/method/frappe.desk.search.search_widget — an empty txt is a valid
// provider call (link fields search with an empty txt on every focus), so only
// the presence of txt is required. `filters` stays a JSON string exactly as
// Frappe documents it: the provider parses it server-side (search_widget runs
// json.loads when filters arrives as a string).
const DeskSearchGlobalInputSchema = z
	.object({
		doctype: z.string().min(1),
		txt: z.string(),
		query: z
			.string()
			.optional()
			.describe(
				'Name of a whitelisted method implementing a custom search for the DocType; defaults to the standard search',
			),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["customer_type","=","Company"]], passed verbatim',
			),
		page_length: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Maximum number of result rows to return'),
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// add_comment inserts the Comment document and returns it, which the
// /api/method wrapper nests under `message`.
// unknown: the answered document is an open record of provider-defined field
// values that vary by DocType and Comment configuration, so only the message
// key holding a document-shaped open record is enforced.
const DeskAddCommentOutputSchema = z
	.object({
		message: ErpnextDeskDocumentSchema,
	})
	.loose();

// add_tag returns the tag it just added (frappe/desk/doctype/tag/tag.py ends
// with `return tag`), which the /api/method wrapper nests under `message`.
const DeskAddTagOutputSchema = z
	.object({
		message: z.string(),
	})
	.loose();

// search_widget answers the matched result rows nested under `message`.
// unknown: rows are positional value lists on the default as_dict=False path
// and string-keyed dicts on the as_dict/translated-doctype and custom-query
// paths, so the rows stay open JSON values.
const DeskSearchGlobalOutputSchema = z
	.object({
		message: z.array(z.unknown()),
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const DeskInputSchemas = {
	'desk.addComment': DeskAddCommentInputSchema,
	'desk.addTag': DeskAddTagInputSchema,
	'desk.searchGlobal': DeskSearchGlobalInputSchema,
} as const;

export const DeskOutputSchemas = {
	'desk.addComment': DeskAddCommentOutputSchema,
	'desk.addTag': DeskAddTagOutputSchema,
	'desk.searchGlobal': DeskSearchGlobalOutputSchema,
} as const;
