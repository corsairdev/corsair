import { z } from 'zod';

// ── Schemas for the `webhooks` family ─────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: the /api/resource
// Webhook list and create routes and frappe/handler.py (resource answers nest
// their results under a `data` key). The Webhook doctype is provider-defined —
// its webhook_doctype_event, request_url, request_method, and condition fields
// ship with the framework and every deployment can add custom fields on top —
// so payload shapes validate as open records and only the wire envelope (data)
// is checked. Input objects are .strict() so typos fail at the boundary, and
// query names stay provider-verbatim (limit_page_length), exactly as the
// Frappe sources declare them.

// unknown: a Webhook document is an open record of provider-defined field
// values; no static schema can enumerate them across deployments (custom
// fields included), so the payload stays a string-keyed bag of JSON values.
const ErpnextWebhookValuesSchema = z.record(z.string(), z.unknown());

// The shared factory forwards the `body` input key verbatim as the JSON
// request body, so every body-carrying operation nests its wire payload under
// a top-level `body` object.

// GET /api/resource/Webhook — `filters` stays a JSON string exactly as Frappe
// documents it: the provider parses it server-side. `limit_start` and
// `limit_page_length` are the provider-verbatim pagination keys, and 0 for
// limit_page_length means all rows.
const WebhooksListInputSchema = z
	.object({
		filters: z
			.string()
			.optional()
			.describe(
				'JSON string filter expression in Frappe list format, for example [["webhook_doctype","=","Sales Invoice"]], passed verbatim',
			),
		limit_start: z.number().int().min(0).optional(),
		limit_page_length: z.number().int().min(0).optional(),
	})
	.strict();

// POST /api/resource/Webhook — the body is the Webhook document's field
// values; Frappe fills creation/modified/owner itself and the route derives
// the Webhook doctype from the path.
const WebhooksCreateInputSchema = z
	.object({
		body: ErpnextWebhookValuesSchema,
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// /api/resource list answers nest the rows under `data`.
const WebhooksListOutputSchema = z
	.object({
		data: z.array(ErpnextWebhookValuesSchema),
	})
	.loose();

// /api/resource create answers the created Webhook document under `data`.
const WebhooksCreateOutputSchema = z
	.object({
		data: ErpnextWebhookValuesSchema,
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const WebhooksInputSchemas = {
	'webhooks.list': WebhooksListInputSchema,
	'webhooks.create': WebhooksCreateInputSchema,
} as const;

export const WebhooksOutputSchemas = {
	'webhooks.list': WebhooksListOutputSchema,
	'webhooks.create': WebhooksCreateOutputSchema,
} as const;
