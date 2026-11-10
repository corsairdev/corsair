import { z } from 'zod';

// ── Schemas for the `documents` family ────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: frappe/client.py
// (the frappe.client.* RPC whitelist), the /api/resource routes, frappe/
// handler.py (every /api/method answer wraps its result in a `message` key),
// and frappe/desk/search.py (search_link rows). A Frappe document is an open
// field bag — every DocType defines its own fields on top of the framework
// columns (doctype, name, owner, creation, modified, docstatus) — so document
// payloads validate as open records and only the wire envelope (data /
// message / docs) is checked. Input objects are .strict() so typos fail at the
// boundary, and field names stay provider-verbatim (limit_page_length,
// fieldname), exactly as the Frappe sources declare them.

// unknown: a Frappe document is an open record of provider-defined field
// values; no static schema can enumerate them across DocTypes, so the payload
// stays a string-keyed bag of JSON values.
const ErpnextDocumentValuesSchema = z.record(z.string(), z.unknown());

// frappe.client.insert and frappe.client.save build the target document with
// frappe.get_doc(doc), which requires the doctype field (frappe/client.py:
// insert, save), so the open record is refined to require it.
const ErpnextDocumentWithDoctypeSchema = ErpnextDocumentValuesSchema.refine(
	(doc) => typeof doc.doctype === 'string' && doc.doctype.length > 0,
	{ message: 'the document object must carry its doctype field' },
);

// The shared factory forwards the `body` input key verbatim as the JSON
// request body, so every body-carrying operation nests its wire payload under
// a top-level `body` object.

// POST /api/resource/{doctype} — the body is the document's field values;
// Frappe fills creation/modified/owner itself.
const DocumentsCreateInputSchema = z
	.object({
		doctype: z.string().min(1),
		body: ErpnextDocumentValuesSchema,
	})
	.strict();

// POST /api/method/frappe.client.insert — doc carries the full document
// object including its doctype (frappe/client.py: insert).
const DocumentsInsertInputSchema = z
	.object({
		body: z.object({ doc: ErpnextDocumentWithDoctypeSchema }).strict(),
	})
	.strict();

// POST /api/method/frappe.client.save — doc carries the complete document
// object with its changes (frappe/client.py: save).
const DocumentsSaveDocumentInputSchema = z
	.object({
		body: z.object({ doc: ErpnextDocumentWithDoctypeSchema }).strict(),
	})
	.strict();

// POST /api/method/frappe.client.save — the submit/cancel alias sends the
// docstatus alongside the field values on the same wire call.
const DocumentsSaveDocsInputSchema = z
	.object({
		body: z.object({ doc: ErpnextDocumentWithDoctypeSchema }).strict(),
	})
	.strict();

// POST /api/method/frappe.client.insert_many — docs is a list of document
// objects; Frappe rejects requests above 200 inserts
// (frappe/client.py: "Only 200 inserts allowed in one request").
const DocumentsInsertManyInputSchema = z
	.object({
		body: z
			.object({
				docs: z.array(ErpnextDocumentWithDoctypeSchema).max(200),
			})
			.strict(),
	})
	.strict();

// The doctype+name pair identifying one document: a path pair for the
// /api/resource/{doctype}/{name} routes and a query pair for the
// frappe.client.get and frappe.desk.form.load.getdoc methods.
const ErpnextDoctypeNameSchema = z
	.object({
		doctype: z.string().min(1),
		name: z.string().min(1),
	})
	.strict();

// GET /api/resource/{doctype} and GET /api/method/frappe.client.get_list —
// the shared list query. `fields` and `filters` stay JSON strings exactly as
// Frappe documents them: the provider parses both server-side
// (frappe/client.py get_list accepts str | list | dict for each).
const DocumentsListInputSchema = z
	.object({
		doctype: z.string().min(1),
		fields: z
			.string()
			.optional()
			.describe(
				'JSON array string of field names to return, for example ["name","customer_name"], passed verbatim to Frappe',
			),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["customer_type","=","Company"]], passed verbatim',
			),
		order_by: z.string().optional(),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z.number().int().min(0).optional(),
	})
	.strict();

// PUT /api/resource/{doctype}/{name} — the body carries the fields to change.
const DocumentsUpdateInputSchema = z
	.object({
		doctype: z.string().min(1),
		name: z.string().min(1),
		body: ErpnextDocumentValuesSchema,
	})
	.strict();

// POST /api/method/frappe.client.set_value — fieldname is a single field name
// or a dict of field -> value; when it is a dict the value parameter stays
// unset (frappe/client.py: set_value doctype, name, fieldname, value).
const DocumentsSetValueInputSchema = z
	.object({
		body: z
			.object({
				doctype: z.string().min(1),
				name: z.string().min(1),
				fieldname: z.union([z.string().min(1), ErpnextDocumentValuesSchema]),
				// unknown: the field value is whatever the caller writes to the
				// DocType field — text, number, date, or JSON — so it is forwarded
				// unvalidated after the boundary parse.
				value: z.unknown().optional(),
			})
			.strict(),
	})
	.strict();

// GET /api/method/frappe.client.get_value — fieldname is parsed as JSON
// first, so list and dict field selections pass as JSON strings while a plain
// name falls back to a single-field list (frappe/client.py: get_value).
const DocumentsGetValueInputSchema = z
	.object({
		doctype: z.string().min(1),
		fieldname: z.string().min(1),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression identifying the record, for example {"name":"CUST-00001"}, passed verbatim',
			),
	})
	.strict();

// GET /api/method/frappe.client.get_count — filters is the same JSON string
// form as the list operations (frappe/client.py: get_count).
const DocumentsGetCountInputSchema = z
	.object({
		doctype: z.string().min(1),
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression, for example [["status","=","Open"]], passed verbatim',
			),
	})
	.strict();

// POST /api/method/frappe.client.rename_doc — merge optionally folds the old
// document into an existing one (frappe/client.py: rename_doc).
const DocumentsRenameDocInputSchema = z
	.object({
		body: z
			.object({
				doctype: z.string().min(1),
				old_name: z.string().min(1),
				new_name: z.string().min(1),
				merge: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();

// GET /api/method/frappe.desk.search.search_link — an empty txt is a valid
// provider call (the Link field sends it on focus to load the first page
// unfiltered), so only the presence of txt is required.
const DocumentsSearchLinkInputSchema = z
	.object({
		doctype: z.string().min(1),
		txt: z.string(),
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// /api/resource single-document answers nest the document under `data`.
const ErpnextDocumentDataOutputSchema = z
	.object({ data: ErpnextDocumentValuesSchema })
	.loose();

// frappe.client RPC single-document answers nest the result under `message`.
const ErpnextDocumentMessageOutputSchema = z
	.object({ message: ErpnextDocumentValuesSchema })
	.loose();

// /api/resource list answers nest the rows under `data`.
const ErpnextDocumentListDataOutputSchema = z
	.object({ data: z.array(ErpnextDocumentValuesSchema) })
	.loose();

// frappe.client.get_list nests the rows under `message`.
const ErpnextDocumentListMessageOutputSchema = z
	.object({ message: z.array(ErpnextDocumentValuesSchema) })
	.loose();

// frappe.client.insert_many answers the created document names
// (frappe/client.py: [insert_doc(doc).name for doc in docs]).
// unknown: entries are document names in practice, but the provider contract
// is a bare JSON array, so the rows stay open.
const DocumentsInsertManyOutputSchema = z
	.object({
		message: z.array(z.unknown()),
	})
	.loose();

// frappe/desk/form/load.py getdoc answers { docs: [doc], docinfo: {...}, ... };
// only the docs array presence is part of the documented envelope.
const DocumentsGetWithMetaOutputSchema = z
	.object({
		docs: z.array(ErpnextDocumentValuesSchema),
	})
	.loose();

// The resource DELETE route answers {"message": "ok"} on success.
const DocumentsDeleteOutputSchema = z
	.object({
		message: z.string(),
	})
	.loose();

// set_value answers the updated document, get_value a field-to-value dict,
// and rename_doc the new name; the message envelope is the only contract
// stable across deployments, so the value stays open.
// unknown: the provider result varies by method (document dict, field map, or
// new name), so only the presence of the message key is enforced.
const ErpnextMessageOutputSchema = z
	.object({
		message: z.unknown(),
	})
	.loose();

// frappe/client.py get_count returns the row count from
// frappe.desk.reportview.get_count — a plain integer.
const DocumentsGetCountOutputSchema = z
	.object({
		message: z.number(),
	})
	.loose();

// frappe/desk/search.py search_link returns a list of LinkSearchResults rows
// ({value, description, label?, image?}) which the /api/method wrapper nests
// under `message` — it does not return an object holding a `results` key.
const DocumentsSearchLinkOutputSchema = z
	.object({
		message: z.array(
			z
				.object({
					value: z.string(),
					description: z.string(),
					label: z.string().optional(),
					image: z.string().optional(),
				})
				.loose(),
		),
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const DocumentsInputSchemas = {
	'documents.create': DocumentsCreateInputSchema,
	'documents.insert': DocumentsInsertInputSchema,
	'documents.saveDocument': DocumentsSaveDocumentInputSchema,
	'documents.saveDocs': DocumentsSaveDocsInputSchema,
	'documents.insertMany': DocumentsInsertManyInputSchema,
	'documents.get': ErpnextDoctypeNameSchema,
	'documents.getClient': ErpnextDoctypeNameSchema,
	'documents.getWithMeta': ErpnextDoctypeNameSchema,
	'documents.list': DocumentsListInputSchema,
	'documents.getList': DocumentsListInputSchema,
	'documents.update': DocumentsUpdateInputSchema,
	'documents.delete': ErpnextDoctypeNameSchema,
	'documents.setValue': DocumentsSetValueInputSchema,
	'documents.getValue': DocumentsGetValueInputSchema,
	'documents.getCount': DocumentsGetCountInputSchema,
	'documents.renameDoc': DocumentsRenameDocInputSchema,
	'documents.searchLink': DocumentsSearchLinkInputSchema,
} as const;

export const DocumentsOutputSchemas = {
	'documents.create': ErpnextDocumentDataOutputSchema,
	'documents.insert': ErpnextDocumentMessageOutputSchema,
	'documents.saveDocument': ErpnextDocumentMessageOutputSchema,
	'documents.saveDocs': ErpnextDocumentMessageOutputSchema,
	'documents.insertMany': DocumentsInsertManyOutputSchema,
	'documents.get': ErpnextDocumentDataOutputSchema,
	'documents.getClient': ErpnextDocumentMessageOutputSchema,
	'documents.getWithMeta': DocumentsGetWithMetaOutputSchema,
	'documents.list': ErpnextDocumentListDataOutputSchema,
	'documents.getList': ErpnextDocumentListMessageOutputSchema,
	'documents.update': ErpnextDocumentDataOutputSchema,
	'documents.delete': DocumentsDeleteOutputSchema,
	'documents.setValue': ErpnextMessageOutputSchema,
	'documents.getValue': ErpnextMessageOutputSchema,
	'documents.getCount': DocumentsGetCountOutputSchema,
	'documents.renameDoc': ErpnextMessageOutputSchema,
	'documents.searchLink': DocumentsSearchLinkOutputSchema,
} as const;
