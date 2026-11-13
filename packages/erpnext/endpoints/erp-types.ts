import { z } from 'zod';

// ── Schemas for the `erp` family ─────────────────────────────────────────────
// Wire mappings verified against the erpnext@develop sources: erpnext/setup/
// utils.py (get_exchange_rate), erpnext/stock/get_item_details.py
// (get_item_details), erpnext/accounts/party.py (get_party_details),
// erpnext/accounts/doctype/payment_entry/payment_entry.py (get_payment_entry),
// erpnext/stock/utils.py (get_stock_balance), erpnext/selling/doctype/
// sales_order/mapper.py (make_sales_invoice, make_delivery_note,
// make_purchase_order), and erpnext/stock/doctype/stock_entry/
// stock_entry_utils.py (make_stock_entry), plus the frappe envelope:
// frappe/handler.py nests every /api/method answer under a `message` key, and
// frappe/__init__.py get_newargs only forwards query/body keys that match a
// parameter name of the whitelisted function. Input objects are .strict() so
// typos fail at the boundary, and query/body names stay provider-verbatim
// (from_currency, source_name, selected_items), exactly as the Python
// signatures declare them.

// The shared factory forwards the `body` input key verbatim as the JSON
// request body, so every body-carrying operation nests its wire payload under
// a top-level `body` object.

// unknown: mapper and helper answers are open records — get_item_details,
// get_party_details, get_payment_entry and the make_* mappers return
// provider-defined documents whose fields vary by DocType, pricing context,
// and deployment, so the payload stays a string-keyed bag of JSON values.
const ErpnextErpDocumentSchema = z.record(z.string(), z.unknown());

// ── Input schemas ─────────────────────────────────────────────────────────────

// GET /api/method/erpnext.setup.utils.get_exchange_rate — the develop
// signature is get_exchange_rate(from_currency, to_currency, transaction_date,
// args) (setup-utils.py). transaction_date is optional in the signature, but
// the provider throws "Invalid transaction date" when two different currencies
// are compared without one, so cross-currency callers should always pass it;
// same-currency calls answer 1 before the date check. The `args` context
// parameter stays out: no static schema can enumerate it and the operations
// here cover the dated-rate lookup.
const ErpGetExchangeRateInputSchema = z
	.object({
		from_currency: z.string().min(1),
		to_currency: z.string().min(1),
		transaction_date: z
			.string()
			.optional()
			.describe(
				'ISO date the rate applies to, for example 2026-01-15; Frappe requires it when the two currencies differ',
			),
	})
	.strict();

// GET /api/method/erpnext.stock.get_item_details.get_item_details — the
// develop signature renames the first parameter to `ctx`
// (get_item_details.py: get_item_details(ctx, doc, for_validate,
// overwrite_warehouse) under @erpnext.normalize_ctx_input(ItemDetailsCtx)),
// and frappe.call drops query keys that are not function parameters
// (frappe/__init__.py get_newargs), so the item context rides in the `ctx`
// query key as a JSON string — not the legacy `args` name — and the provider
// parses it server-side into ItemDetailsCtx.
const ErpGetItemDetailsInputSchema = z
	.object({
		ctx: z
			.string()
			.min(1)
			.describe(
				'JSON string of the item and pricing context, for example {"item_code":"WIDGET","qty":2}, passed verbatim to Frappe',
			),
		for_validate: z.boolean().optional(),
	})
	.strict();

// GET /api/method/erpnext.accounts.party.get_party_details — the develop
// signature defaults party_type to "Customer" (party.py), but the operation is
// generic across Customer/Supplier, so the boundary requires the caller to
// name it; every other parameter stays out rather than being invented.
const ErpGetPartyDetailsInputSchema = z
	.object({
		party: z.string().min(1),
		party_type: z.string().min(1),
	})
	.strict();

// GET /api/method/erpnext.accounts.doctype.payment_entry.payment_entry.
// get_payment_entry — the develop signature is get_payment_entry(dt, dn, ...)
// (payment_entry.py); dt is the doctype of the voucher to settle and dn its
// name. The optional amount overrides stay out.
const ErpGetPaymentEntryInputSchema = z
	.object({
		dt: z.string().min(1),
		dn: z.string().min(1),
	})
	.strict();

// GET /api/method/erpnext.stock.utils.get_stock_balance — the develop
// signature is get_stock_balance(item_code, warehouse, posting_date=None,
// ...) (stock-utils.py): warehouse carries no default, so it is a required
// argument on the wire even though it is typed nullable, and the older
// ignore_warehouse parameter no longer exists. The answer is the balance
// quantity (0.0 when there is no stock ledger entry).
const ErpGetStockBalanceInputSchema = z
	.object({
		item_code: z.string().min(1),
		warehouse: z.string().min(1),
		posting_date: z.string().optional(),
	})
	.strict();

// POST /api/method/erpnext.selling.doctype.sales_order.mapper.
// make_sales_invoice — the mapper signature is make_sales_invoice(source_name,
// target_doc=None, args=None, ignore_permissions=False) (mapper.py).
// target_doc names an existing draft invoice to update instead of creating a
// fresh one, and args stays a JSON string exactly as Frappe parses it
// server-side.
const ErpMakeSalesInvoiceInputSchema = z
	.object({
		body: z
			.object({
				source_name: z.string().min(1),
				target_doc: z.string().optional(),
				args: z
					.string()
					.optional()
					.describe('JSON string of mapper options, passed verbatim to Frappe'),
				ignore_permissions: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();

// POST /api/method/erpnext.selling.doctype.sales_order.mapper.
// make_delivery_note — the mapper signature is make_delivery_note(source_name,
// target_doc=None, kwargs=None) (mapper.py); the kwargs bag stays out rather
// than being invented, so the operation maps the full order by default.
const ErpMakeDeliveryNoteInputSchema = z
	.object({
		body: z
			.object({
				source_name: z.string().min(1),
				target_doc: z.string().optional(),
			})
			.strict(),
	})
	.strict();

// POST /api/method/erpnext.selling.doctype.sales_order.mapper.
// make_purchase_order — the mapper signature is make_purchase_order(source_name,
// selected_items=None, target_doc=None) (mapper.py). Frappe parses
// selected_items with frappe.parse_json, which accepts both a JSON string and
// a JSON array, so the schema models the union the provider declares.
const ErpMakePurchaseOrderInputSchema = z
	.object({
		body: z
			.object({
				source_name: z.string().min(1),
				selected_items: z
					.union([z.string(), z.array(z.string())])
					.optional()
					.describe(
						'Sales Order Item row names to map, for example ["SO-00001-0001"]; a JSON array string or an array both parse server-side',
					),
				target_doc: z.string().optional(),
			})
			.strict(),
	})
	.strict();

// POST /api/method/erpnext.stock.doctype.stock_entry.stock_entry_utils.
// make_stock_entry — the whitelisted helper takes arbitrary keyword arguments
// (stock_entry_utils.py: def make_stock_entry(**args)); its documented
// kwargs are item_code, qty, company, from_warehouse, to_warehouse, rate,
// serial_no, batch_no, posting_date, posting_time, purpose, do_not_save and
// do_not_submit, but the helper accepts anything, so the body stays a
// string-keyed bag forwarded verbatim after the boundary parse.
// unknown: the stock entry helper is **kwargs — no static schema can
// enumerate the keyword arguments across deployments and custom fields, so
// the bag stays open and only a non-empty body is enforced.
const ErpMakeStockEntryKwargsSchema = z
	.record(z.string(), z.unknown())
	.refine((kwargs) => Object.keys(kwargs).length > 0, {
		message: 'the stock entry kwargs must carry at least one key',
	});

const ErpMakeStockEntryInputSchema = z
	.object({
		body: ErpMakeStockEntryKwargsSchema,
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// frappe/handler.py nests every /api/method answer under `message`.

// get_exchange_rate returns 1 for identical currencies and otherwise
// flt(...) of the Currency Exchange row (setup-utils.py) — a plain number.
const ErpGetExchangeRateOutputSchema = z
	.object({
		message: z.number(),
	})
	.loose();

// get_stock_balance returns the ledger quantity
// (stock-utils.py: qty_after_transaction, 0.0 when there is no entry) — a
// plain number.
const ErpGetStockBalanceOutputSchema = z
	.object({
		message: z.number(),
	})
	.loose();

// get_item_details, get_party_details, get_payment_entry, make_sales_invoice,
// make_delivery_note and make_stock_entry each answer one document-shaped
// object (a pricing result, a party field map, a Payment Entry draft, or the
// mapped target doc from get_mapped_doc / the StockEntry helper).
// unknown: the payload fields are provider-defined and vary by DocType,
// pricing context, and deployment, so only the presence of the message key
// with an open record is enforced.
const ErpnextErpDocumentOutputSchema = z
	.object({
		message: ErpnextErpDocumentSchema,
	})
	.loose();

// make_purchase_order returns purchase_orders, a list of mapped Purchase
// Order drafts ("Creates Purchase Order for each Supplier. Returns a list of
// doc objects." — mapper.py), so the message is an array of open records.
// The mapper returns early (None) when selected_items is empty; that branch
// answers without a message key and fails this schema, which is the intended
// boundary for a call that would create nothing.
const ErpMakePurchaseOrderOutputSchema = z
	.object({
		message: z.array(ErpnextErpDocumentSchema),
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const ErpInputSchemas = {
	'erp.getExchangeRate': ErpGetExchangeRateInputSchema,
	'erp.getItemDetails': ErpGetItemDetailsInputSchema,
	'erp.getPartyDetails': ErpGetPartyDetailsInputSchema,
	'erp.getPaymentEntry': ErpGetPaymentEntryInputSchema,
	'erp.getStockBalance': ErpGetStockBalanceInputSchema,
	'erp.makeSalesInvoice': ErpMakeSalesInvoiceInputSchema,
	'erp.makeDeliveryNote': ErpMakeDeliveryNoteInputSchema,
	'erp.makePurchaseOrder': ErpMakePurchaseOrderInputSchema,
	'erp.makeStockEntry': ErpMakeStockEntryInputSchema,
} as const;

export const ErpOutputSchemas = {
	'erp.getExchangeRate': ErpGetExchangeRateOutputSchema,
	'erp.getItemDetails': ErpnextErpDocumentOutputSchema,
	'erp.getPartyDetails': ErpnextErpDocumentOutputSchema,
	'erp.getPaymentEntry': ErpnextErpDocumentOutputSchema,
	'erp.getStockBalance': ErpGetStockBalanceOutputSchema,
	'erp.makeSalesInvoice': ErpnextErpDocumentOutputSchema,
	'erp.makeDeliveryNote': ErpnextErpDocumentOutputSchema,
	'erp.makePurchaseOrder': ErpMakePurchaseOrderOutputSchema,
	'erp.makeStockEntry': ErpnextErpDocumentOutputSchema,
} as const;
