import { z } from 'zod';

// Field names are Quaderno's own, read from the published OpenAPI spec
// (developers.quaderno.io, version 20241028) and corrected against live
// responses. Nothing is renamed.
//
// Outputs are `.loose()` and their documented fields `.nullish()`: Quaderno
// sends JSON `null` for unset values, and it adds response fields without a
// version bump, which the docs state as policy. A stricter schema would break
// callers on a non-breaking provider change.
//
// Every money field is a **string** in major units (`"10.0"`), not cents, and
// the `*_cents` fields beside it are integers. Both are kept as sent.

const MoneySchema = z
	.string()
	.describe('A decimal amount in major units, such as `10.0` for ten dollars.');

const IdSchema = z.number().int().positive();

// ── Shared paging ─────────────────────────────────────────────────────────

/**
 * Quaderno lists answer a **bare array**, not an envelope: `[]`, not
 * `{ data: [] }`. Verified live on every list route.
 *
 * Paging is by `created_before`: pass an object id and get records created
 * before it, newest first. The cursors ride in response **headers**
 * (`X-Pages-HasMore`, `X-Pages-NextPage`), which `corsair/http` cannot return
 * beside a body, so the next id is derived from the last row here instead.
 */
export const QUADERNO_DEFAULT_LIMIT = 25;
export const QUADERNO_MAX_LIMIT = 100;

const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(QUADERNO_MAX_LIMIT)
	.optional()
	.describe(
		`Records to return. Defaults to ${QUADERNO_DEFAULT_LIMIT}, maximum ${QUADERNO_MAX_LIMIT}.`,
	);

const CreatedBeforeSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe(
		'Return records created before this object id, newest first. Pass the previous page\u2019s last `id`; the response\u2019s `next_created_before` carries it.',
	);

/**
 * Derived beside the provider rows so a caller can page without reading a
 * header. `null` means this page was short, so it is the last one.
 */
const NextCreatedBeforeSchema = z
	.number()
	.int()
	.nullable()
	.describe(
		'The id to pass as `created_before` for the next page, or null when this is the last page.',
	);

/** Reads the paging cursor for a page, given its `limit`. */
export function nextCreatedBefore(
	rows: { id?: number | null }[],
	limit: number | undefined,
): number | null {
	const pageSize = limit ?? QUADERNO_DEFAULT_LIMIT;
	if (rows.length < pageSize) return null;
	const last = rows.at(-1)?.id;
	return typeof last === 'number' ? last : null;
}

// ── Contacts ──────────────────────────────────────────────────────────────

export const QUADERNO_CONTACT_KINDS = ['person', 'company'] as const;

export const ContactSchema = z
	.object({
		id: z.number(),
		kind: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		full_name: z.string().nullish(),
		contact_person: z.string().nullish(),
		department: z.string().nullish(),
		email: z.string().nullish(),
		phone_1: z.string().nullish(),
		web: z.string().nullish(),
		street_line_1: z.string().nullish(),
		street_line_2: z.string().nullish(),
		city: z.string().nullish(),
		postal_code: z.string().nullish(),
		region: z.string().nullish(),
		country: z.string().nullish(),
		tax_id: z.string().nullish(),
		tax_status: z.string().nullish(),
		notes: z.string().nullish(),
		discount: z.union([z.string(), z.number()]).nullish(),
		language: z.string().nullish(),
		processor: z.string().nullish(),
		processor_id: z.string().nullish(),
		permalink: z.string().nullish(),
		created_at: z.number().nullish(),
	})
	.loose();

export type QuadernoContact = z.infer<typeof ContactSchema>;

const ContactWriteShape = {
	kind: z
		.enum(QUADERNO_CONTACT_KINDS)
		.optional()
		.describe('`person` or `company`. Defaults to `person` in the dashboard.'),
	first_name: z.string().min(1).optional(),
	last_name: z.string().min(1).optional(),
	email: z.string().min(3).optional().describe('Contact email address.'),
	phone_1: z.string().optional(),
	web: z.string().optional(),
	street_line_1: z.string().optional(),
	street_line_2: z.string().optional(),
	city: z.string().optional(),
	postal_code: z.string().optional(),
	region: z.string().optional(),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('Two-letter ISO country code, such as `US`.'),
	tax_id: z.string().optional(),
	notes: z.string().optional(),
	discount: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Default discount percentage for this contact.'),
	language: z.string().optional().describe('Two-letter language code.'),
} as const;

const ContactsListInputSchema = z.object({
	q: z.string().min(1).optional().describe('Free-text search.'),
	limit: LimitSchema,
	created_before: CreatedBeforeSchema,
});

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = z.object({
	contacts: z.array(ContactSchema),
	next_created_before: NextCreatedBeforeSchema,
});

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

/**
 * `first_name` is the one field the API requires on a contact. For a `company`
 * there is no separate name field, so the company name goes here. `email` is
 * optional to Quaderno, but a contact without one cannot be sent a document.
 */
const ContactsCreateInputSchema = z.object({
	...ContactWriteShape,
	first_name: z
		.string()
		.min(1)
		.describe(
			'The first name of a person, or the company name when `kind` is `company`. Required.',
		),
	email: z
		.string()
		.min(3)
		.optional()
		.describe(
			'Contact email address. Quaderno delivers documents to it, so a contact without one cannot be emailed.',
		),
});

export type ContactsCreateInput = z.input<typeof ContactsCreateInputSchema>;

const ContactsGetInputSchema = z.object({
	id: IdSchema.describe('The contact id.'),
});

export type ContactsGetInput = z.input<typeof ContactsGetInputSchema>;

const ContactsUpdateInputSchema = z.object({
	...ContactWriteShape,
	id: IdSchema.describe('The contact to update.'),
});

export type ContactsUpdateInput = z.input<typeof ContactsUpdateInputSchema>;

const ContactsDeleteInputSchema = z.object({
	id: IdSchema.describe('The contact to delete.'),
});

export type ContactsDeleteInput = z.input<typeof ContactsDeleteInputSchema>;

/**
 * A delete answers **204 with no body**, so there is nothing to parse. Quaderno
 * refuses to delete a contact that still has documents attached, with 422.
 */
const DeleteResponseSchema = z.object({
	deleted: z.literal(true),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

const ContactResponseSchema = z.object({
	contact: ContactSchema,
});

export type ContactResponse = z.infer<typeof ContactResponseSchema>;

// ── Products ──────────────────────────────────────────────────────────────

export const QUADERNO_PRODUCT_KINDS = ['one_off', 'subscription'] as const;
export const QUADERNO_PRODUCT_TYPES = ['good', 'service'] as const;
export const QUADERNO_TAX_CLASSES = [
	'consulting',
	'eservice',
	'ebook',
	'saas',
	'standard',
	'reduced',
] as const;
export const QUADERNO_TAX_TYPES = ['included', 'excluded'] as const;
export const QUADERNO_TAX_BASES = ['customer_country', 'country'] as const;

export const ProductSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		code: z.string().nullish(),
		description: z.string().nullish(),
		unit_cost: MoneySchema.nullish(),
		currency: z.string().nullish(),
		product_type: z.string().nullish(),
		kind: z.string().nullish(),
		tax_class: z.string().nullish(),
		tax_type: z.string().nullish(),
		tax_based_on: z.string().nullish(),
		country: z.string().nullish(),
		// The spec types `stock` as a string; only `null` was seen live.
		stock: z.union([z.string(), z.number()]).nullish(),
		url: z.string().nullish(),
		created_at: z.number().nullish(),
		paypal_interval_duration: z.number().nullish(),
		paypal_interval_frequency: z.number().nullish(),
		paypal_interval_unit: z.string().nullish(),
		stripe_plan_id: z.string().nullish(),
	})
	.loose();

export type QuadernoProduct = z.infer<typeof ProductSchema>;

const ProductWriteShape = {
	name: z.string().min(1).describe('Product name.'),
	code: z.string().min(1).describe('Your own SKU or code.'),
	unit_cost: z
		.union([z.string(), z.number()])
		.describe('Price in major units, such as `10.00` or `10`.'),
	currency: z
		.string()
		.length(3)
		.optional()
		.describe(
			'Three-letter ISO currency code. Defaults to the account currency.',
		),
	description: z.string().optional(),
	product_type: z
		.enum(QUADERNO_PRODUCT_TYPES)
		.optional()
		.describe(
			'`good` for a tangible item, `service` otherwise. Defaults to `service`.',
		),
	kind: z
		.enum(QUADERNO_PRODUCT_KINDS)
		.optional()
		.describe('`one_off` or `subscription`. Defaults to `one_off`.'),
	tax_class: z.enum(QUADERNO_TAX_CLASSES).optional(),
	tax_type: z
		.enum(QUADERNO_TAX_TYPES)
		.optional()
		.describe('Whether `unit_cost` includes tax. Defaults to `included`.'),
	tax_based_on: z.enum(QUADERNO_TAX_BASES).optional(),
	stock: z.number().int().min(0).optional(),
} as const;

const ProductsListInputSchema = z.object({
	q: z.string().min(1).optional().describe('Free-text search.'),
	limit: LimitSchema,
	created_before: CreatedBeforeSchema,
});

export type ProductsListInput = z.input<typeof ProductsListInputSchema>;

const ProductsListResponseSchema = z.object({
	products: z.array(ProductSchema),
	next_created_before: NextCreatedBeforeSchema,
});

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;

const ProductsCreateInputSchema = z.object(ProductWriteShape);

export type ProductsCreateInput = z.input<typeof ProductsCreateInputSchema>;

const ProductsGetInputSchema = z.object({ id: IdSchema });

export type ProductsGetInput = z.input<typeof ProductsGetInputSchema>;

/**
 * A PUT here is a partial update: verified live, sending only `name` left the
 * code, price and tax class unchanged. Every field is therefore optional and
 * only the id is required, unlike the create schema.
 */
const ProductsUpdateInputSchema = z.object({
	id: IdSchema,
	name: ProductWriteShape.name.optional(),
	code: ProductWriteShape.code.optional(),
	unit_cost: ProductWriteShape.unit_cost.optional(),
	currency: ProductWriteShape.currency,
	description: ProductWriteShape.description,
	product_type: ProductWriteShape.product_type,
	kind: ProductWriteShape.kind,
	tax_class: ProductWriteShape.tax_class,
	tax_type: ProductWriteShape.tax_type,
	tax_based_on: ProductWriteShape.tax_based_on,
	stock: ProductWriteShape.stock,
});

export type ProductsUpdateInput = z.input<typeof ProductsUpdateInputSchema>;

const ProductsDeleteInputSchema = z.object({ id: IdSchema });

export type ProductsDeleteInput = z.input<typeof ProductsDeleteInputSchema>;

const ProductResponseSchema = z.object({ product: ProductSchema });

export type ProductResponse = z.infer<typeof ProductResponseSchema>;

// ── Documents (invoices, receipts, credits, proformas) ────────────────────

/** A line on a document. Amounts are in major units, as strings. */
export const DocumentItemSchema = z
	.object({
		id: z.number().nullish(),
		description: z.string().nullish(),
		quantity: z.number().nullish(),
		unit_price: z.union([z.string(), z.number()]).nullish(),
		discount_rate: z.union([z.string(), z.number()]).nullish(),
		product_code: z.string().nullish(),
		total_amount: z.union([z.string(), z.number()]).nullish(),
		subtotal_cents: z.number().nullish(),
		discount_cents: z.number().nullish(),
		tax_1_name: z.string().nullish(),
		tax_1_rate: z.number().nullish(),
		tax_1_country: z.string().nullish(),
		tax_1_region: z.string().nullish(),
	})
	.loose();

export type QuadernoDocumentItem = z.infer<typeof DocumentItemSchema>;

export const PaymentSchema = z
	.object({
		id: z.number().nullish(),
		date: z.string().nullish(),
		amount: z.union([z.string(), z.number()]).nullish(),
		amount_cents: z.number().nullish(),
		payment_method: z.string().nullish(),
		processor: z.string().nullish(),
		processor_id: z.string().nullish(),
		created_at: z.number().nullish(),
	})
	.loose();

export type QuadernoPayment = z.infer<typeof PaymentSchema>;

/**
 * The shape every billing document shares. Fields the spec omits but the live
 * API sends are declared too: `blocked`, `delivery_state`, `secure_id`,
 * `verification_code` and `verification_permalink`.
 */
const DocumentSchema = z
	.object({
		id: z.number(),
		number: z.string().nullish(),
		issue_date: z.string().nullish(),
		due_date: z.string().nullish(),
		currency: z.string().nullish(),
		state: z.string().nullish(),
		blocked: z.boolean().nullish(),
		delivery_state: z.string().nullish(),
		// unknown: the embedded contact is a full customer object; it is passed
		// through as sent rather than duplicated as a second schema here.
		contact: z.record(z.string(), z.unknown()).nullish(),
		items: z.array(DocumentItemSchema).nullish(),
		payments: z.array(PaymentSchema).nullish(),
		// unknown: a per-jurisdiction tax breakdown whose fields vary by country.
		taxes: z.array(z.record(z.string(), z.unknown())).nullish(),
		subtotal_cents: z.number().nullish(),
		discount_cents: z.number().nullish(),
		total_cents: z.number().nullish(),
		processor_fee_cents: z.number().nullish(),
		notes: z.string().nullish(),
		payment_details: z.string().nullish(),
		subject: z.string().nullish(),
		po_number: z.string().nullish(),
		tag_list: z.array(z.string()).nullish(),
		secure_id: z.string().nullish(),
		verification_code: z.string().nullish(),
		verification_permalink: z.string().nullish(),
		permalink: z.string().nullish(),
		pdf: z.string().nullish(),
		url: z.string().nullish(),
		created_at: z.number().nullish(),
		// unknown: caller-supplied metadata of any JSON shape, stored and returned
		// as sent; the API imposes no schema on it.
		custom_metadata: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type QuadernoDocument = z.infer<typeof DocumentSchema>;

const DocumentItemWriteSchema = z.object({
	description: z.string().min(1).describe('Line description.'),
	quantity: z.number().optional().describe('Defaults to 1.'),
	unit_price: z
		.union([z.string(), z.number()])
		.describe('Price per unit in major units, such as `10.00`.'),
	discount_rate: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Discount percentage applied to this line.'),
	product_code: z
		.string()
		.optional()
		.describe('Link this line to a product by its code.'),
	tax_1_name: z.string().optional(),
	tax_1_rate: z
		.number()
		.optional()
		.describe('Tax rate percentage for this line.'),
	tax_1_country: z.string().optional(),
	tax_1_region: z.string().optional(),
});

/** The contact reference a document takes: an id is enough. */
const DocumentContactSchema = z.object({
	id: z.number().int().positive().describe('The contact being billed.'),
});

const DocumentWriteShape = {
	contact: DocumentContactSchema.describe(
		'The contact being billed, by id. Create one with contacts.create first.',
	),
	items: z
		.array(DocumentItemWriteSchema)
		.min(1)
		.max(200)
		.describe('Line items. Quaderno caps a document at 200 lines.'),
	currency: z.string().length(3).optional(),
	issue_date: z
		.string()
		.optional()
		.describe('ISO date, such as `2026-11-10`. Defaults to today.'),
	due_date: z.string().optional().describe('ISO date.'),
	notes: z.string().optional(),
	subject: z.string().optional(),
	po_number: z.string().optional(),
	payment_details: z.string().optional(),
	tag_list: z.array(z.string()).optional(),
} as const;

/**
 * The `date` filter on a document list. Quaderno only accepts a **range**: two
 * dates joined by a comma. A single date is not a documented format.
 */
const DateRangeSchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Issue-date range as two ISO dates joined by a comma, such as `2026-01-01,2026-12-31`. A range is required; a single date is not accepted.',
	);

// Invoices

const InvoicesListInputSchema = z.object({
	q: z
		.string()
		.min(1)
		.optional()
		.describe('Search by invoice number, customer name or PO number.'),
	date: DateRangeSchema,
	state: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Only this state. Quaderno documents `outstanding`, `late`, `uncollectible` and `paid`.',
		),
	contact: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only this contact.'),
	processor_id: z.string().min(1).optional(),
	limit: LimitSchema,
	created_before: CreatedBeforeSchema,
});

export type InvoicesListInput = z.input<typeof InvoicesListInputSchema>;

const InvoicesListResponseSchema = z.object({
	invoices: z.array(DocumentSchema),
	next_created_before: NextCreatedBeforeSchema,
});

export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;

export const QUADERNO_PAYMENT_METHODS = [
	'credit_card',
	'cash',
	'wire_transfer',
	'direct_debit',
	'check',
	'iou',
	'paypal',
	'offset',
	'other',
] as const;

const InvoicesCreateInputSchema = z.object({
	...DocumentWriteShape,
	payment_method: z
		.enum(QUADERNO_PAYMENT_METHODS)
		.optional()
		.describe(
			'If set, a payment for the full amount is recorded on creation, marking the invoice paid immediately.',
		),
});

export type InvoicesCreateInput = z.input<typeof InvoicesCreateInputSchema>;

const InvoiceGetInputSchema = z.object({ id: IdSchema });

export type InvoiceGetInput = z.input<typeof InvoiceGetInputSchema>;

/**
 * A partial update, as for products: verified live that omitting a field leaves
 * it unchanged, so only the id is required.
 */
const InvoiceUpdateInputSchema = z.object({
	id: IdSchema,
	contact: DocumentWriteShape.contact.optional(),
	items: DocumentWriteShape.items.optional(),
	currency: DocumentWriteShape.currency,
	issue_date: DocumentWriteShape.issue_date,
	due_date: DocumentWriteShape.due_date,
	notes: DocumentWriteShape.notes,
	subject: DocumentWriteShape.subject,
	po_number: DocumentWriteShape.po_number,
	payment_details: DocumentWriteShape.payment_details,
	tag_list: DocumentWriteShape.tag_list,
});

export type InvoiceUpdateInput = z.input<typeof InvoiceUpdateInputSchema>;

const InvoiceVoidInputSchema = z.object({
	id: IdSchema,
	void_reason: z
		.string()
		.min(1)
		.describe(
			'Why the invoice is being voided. Required: the API answers 422 `void_reason is required` without it.',
		),
	void_description: z.string().optional(),
});

export type InvoiceVoidInput = z.input<typeof InvoiceVoidInputSchema>;

/** `POST /invoices/{id}/payments` returns the payment, wrapped here. */
const PaymentResponseSchema = z.object({ payment: PaymentSchema });

export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;

const InvoiceMarkUncollectibleInputSchema = z.object({ id: IdSchema });

export type InvoiceMarkUncollectibleInput = z.input<
	typeof InvoiceMarkUncollectibleInputSchema
>;

const InvoiceRecordPaymentInputSchema = z.object({
	id: IdSchema,
	date: z.string().min(1).describe('ISO payment date, such as `2026-11-10`.'),
	amount: z
		.union([z.string(), z.number()])
		.describe(
			'Amount in major units. Reaching the total marks the invoice paid.',
		),
	payment_method: z.enum(QUADERNO_PAYMENT_METHODS),
	reference: z.string().optional(),
});

export type InvoiceRecordPaymentInput = z.input<
	typeof InvoiceRecordPaymentInputSchema
>;

/**
 * A deliver takes the document id and nothing else. Quaderno sends to the
 * address on file for the contact; the reference documents no way to name
 * another recipient, so none is offered here.
 */
const InvoiceDeliverInputSchema = z.object({
	id: IdSchema.describe('The invoice to email to its contact.'),
});

export type InvoiceDeliverInput = z.input<typeof InvoiceDeliverInputSchema>;

const InvoiceResponseSchema = z.object({ invoice: DocumentSchema });

/**
 * The four `deliver` routes answer **200 with no body**: the reference lists no
 * response content for them. There is no document to parse, so the output only
 * confirms the request was accepted. Requiring a document here would throw
 * after the email had already gone out, and a caller would send it again.
 */
const DeliverResponseSchema = z.object({
	delivered: z.literal(true),
});

export type DeliverResponse = z.infer<typeof DeliverResponseSchema>;

export type InvoiceResponse = z.infer<typeof InvoiceResponseSchema>;

// Receipts

const ReceiptsListInputSchema = z.object({
	q: z.string().min(1).optional(),
	date: DateRangeSchema,
	state: z.string().min(1).optional(),
	contact: z.number().int().positive().optional(),
	limit: LimitSchema,
	created_before: CreatedBeforeSchema,
});

export type ReceiptsListInput = z.input<typeof ReceiptsListInputSchema>;

const ReceiptsListResponseSchema = z.object({
	receipts: z.array(DocumentSchema),
	next_created_before: NextCreatedBeforeSchema,
});

export type ReceiptsListResponse = z.infer<typeof ReceiptsListResponseSchema>;

/**
 * A receipt documents a sale that is already paid, so `payment_method` is
 * required: the API refuses a receipt without one.
 */
const ReceiptsCreateInputSchema = z.object({
	...DocumentWriteShape,
	payment_method: z
		.enum(QUADERNO_PAYMENT_METHODS)
		.describe('How the customer paid. Required on a receipt.'),
});

export type ReceiptsCreateInput = z.input<typeof ReceiptsCreateInputSchema>;

const ReceiptGetInputSchema = z.object({ id: IdSchema });

export type ReceiptGetInput = z.input<typeof ReceiptGetInputSchema>;

const ReceiptVoidInputSchema = z.object({
	id: IdSchema,
	void_reason: z.string().min(1).describe('Why the receipt is being voided.'),
	void_description: z.string().optional(),
});

export type ReceiptVoidInput = z.input<typeof ReceiptVoidInputSchema>;

const ReceiptDeliverInputSchema = z.object({
	id: IdSchema.describe('The receipt to email to its contact.'),
});

export type ReceiptDeliverInput = z.input<typeof ReceiptDeliverInputSchema>;

const ReceiptResponseSchema = z.object({ receipt: DocumentSchema });

export type ReceiptResponse = z.infer<typeof ReceiptResponseSchema>;

// Credit notes

const CreditsListInputSchema = z.object({
	q: z.string().min(1).optional(),
	date: DateRangeSchema,
	state: z.string().min(1).optional(),
	contact: z.number().int().positive().optional(),
	limit: LimitSchema,
	created_before: CreatedBeforeSchema,
});

export type CreditsListInput = z.input<typeof CreditsListInputSchema>;

const CreditsListResponseSchema = z.object({
	credits: z.array(DocumentSchema),
	next_created_before: NextCreatedBeforeSchema,
});

export type CreditsListResponse = z.infer<typeof CreditsListResponseSchema>;

/**
 * The methods a credit note's refund or a transaction's payment accepts: the
 * invoice list without `offset`, which Quaderno only records itself on a void.
 */
export const QUADERNO_REFUND_METHODS = [
	'credit_card',
	'cash',
	'wire_transfer',
	'direct_debit',
	'check',
	'iou',
	'paypal',
	'other',
] as const;

/**
 * A credit note is issued **against an existing invoice**, not built from a
 * contact and line items: the body is the invoice id, and Quaderno copies the
 * customer and lines from it.
 */
const CreditsCreateInputSchema = z.object({
	invoice_id: IdSchema.describe('The invoice being credited.'),
	payment_method: z
		.enum(QUADERNO_REFUND_METHODS)
		.optional()
		.describe('How the credited amount is refunded.'),
	credited_amount: z
		.number()
		.positive()
		.optional()
		.describe(
			'Amount to credit in major units, at most the invoice total. Only works for an invoice with a single line. Defaults to the full invoice total.',
		),
});

export type CreditsCreateInput = z.input<typeof CreditsCreateInputSchema>;

const CreditGetInputSchema = z.object({ id: IdSchema });

export type CreditGetInput = z.input<typeof CreditGetInputSchema>;

/**
 * A credit note is immutable once issued. Only its administrative fields can
 * still change, so those are the only ones offered and none is required.
 */
const CreditUpdateInputSchema = z.object({
	id: IdSchema,
	notes: DocumentWriteShape.notes,
	payment_details: DocumentWriteShape.payment_details,
	tag_list: DocumentWriteShape.tag_list,
});

export type CreditUpdateInput = z.input<typeof CreditUpdateInputSchema>;

const CreditVoidInputSchema = z.object({
	id: IdSchema,
	void_reason: z
		.string()
		.min(1)
		.describe('Why the credit note is being voided.'),
	void_description: z.string().optional(),
});

export type CreditVoidInput = z.input<typeof CreditVoidInputSchema>;

const CreditDeliverInputSchema = z.object({
	id: IdSchema.describe('The credit note to email to its contact.'),
});

export type CreditDeliverInput = z.input<typeof CreditDeliverInputSchema>;

const CreditResponseSchema = z.object({ credit: DocumentSchema });

export type CreditResponse = z.infer<typeof CreditResponseSchema>;

// Proformas

const ProformasListInputSchema = z.object({
	q: z.string().min(1).optional(),
	date: DateRangeSchema,
	state: z.string().min(1).optional(),
	contact: z.number().int().positive().optional(),
	limit: LimitSchema,
	created_before: CreatedBeforeSchema,
});

export type ProformasListInput = z.input<typeof ProformasListInputSchema>;

const ProformasListResponseSchema = z.object({
	proformas: z.array(DocumentSchema),
	next_created_before: NextCreatedBeforeSchema,
});

export type ProformasListResponse = z.infer<typeof ProformasListResponseSchema>;

const ProformasCreateInputSchema = z.object(DocumentWriteShape);

export type ProformasCreateInput = z.input<typeof ProformasCreateInputSchema>;

const ProformaGetInputSchema = z.object({ id: IdSchema });

export type ProformaGetInput = z.input<typeof ProformaGetInputSchema>;

/**
 * Partial, as for invoices: only the id is required. Requiring `items` on every
 * update would make a caller resend the lines to change a note, and Quaderno
 * documents an update with `items` as the way to add lines.
 */
const ProformaUpdateInputSchema = z.object({
	id: IdSchema,
	contact: DocumentWriteShape.contact.optional(),
	items: DocumentWriteShape.items.optional(),
	currency: DocumentWriteShape.currency,
	issue_date: DocumentWriteShape.issue_date,
	due_date: DocumentWriteShape.due_date,
	notes: DocumentWriteShape.notes,
	subject: DocumentWriteShape.subject,
	po_number: DocumentWriteShape.po_number,
	payment_details: DocumentWriteShape.payment_details,
	tag_list: DocumentWriteShape.tag_list,
});

export type ProformaUpdateInput = z.input<typeof ProformaUpdateInputSchema>;

const ProformaActionInputSchema = z.object({
	id: IdSchema.describe('The proforma to act on.'),
});

export type ProformaActionInput = z.input<typeof ProformaActionInputSchema>;

const ProformaDeliverInputSchema = z.object({
	id: IdSchema.describe('The proforma to email to its contact.'),
});

export type ProformaDeliverInput = z.input<typeof ProformaDeliverInputSchema>;

const ProformaResponseSchema = z.object({ proforma: DocumentSchema });

export type ProformaResponse = z.infer<typeof ProformaResponseSchema>;

// ── Tax ───────────────────────────────────────────────────────────────────

const TaxRateCalculateInputSchema = z
	.object({
		to_country: z
			.string()
			.length(2)
			.describe('Two-letter ISO country code of the customer.'),
		to_postal_code: z
			.string()
			.optional()
			.describe(
				'Customer postal code, needed in countries that tax by region.',
			),
		to_region: z.string().optional(),
		tax_code: z
			.string()
			.optional()
			.describe('The tax code for the product, such as `standard`.'),
		amount: z
			.union([z.string(), z.number()])
			.optional()
			.describe('Amount to compute tax on, in major units.'),
	})
	.superRefine((value, ctx) => {
		// The docs say `tax_code` and `amount` are required from API version
		// 20210316, which this plugin targets. Failing here saves a round trip.
		if (!value.tax_code) {
			ctx.addIssue({
				code: 'custom',
				path: ['tax_code'],
				message: '`tax_code` is required since API version 20210316.',
			});
		}
		if (value.amount === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['amount'],
				message: '`amount` is required since API version 20210316.',
			});
		}
	});

export type TaxRateCalculateInput = z.input<typeof TaxRateCalculateInputSchema>;

const TaxRateSchema = z
	.object({
		name: z.string().nullish(),
		rate: z.number().nullish(),
		country: z.string().nullish(),
		region: z.string().nullish(),
		transaction_type: z.string().nullish(),
		tax_code: z.string().nullish(),
		notes: z.string().nullish(),
	})
	.loose();

/**
 * Verified live, this answers a **single flat object**, not the
 * `{ tax_rates, amount, total }` wrapper the spec shows. Captured:
 * `{"country":"IN","currency":"INR","rate":0.0,"tax_behavior":"exclusive",`
 * `"tax_code":"standard","subtotal":10.0,"tax_amount":0.0,`
 * `"total_amount":10.0,"status":"non_taxable"}`.
 */
const TaxRateResponseSchema = z
	.object({
		country: z.string().nullish(),
		region: z.string().nullish(),
		currency: z.string().nullish(),
		name: z.string().nullish(),
		rate: z.number().nullish(),
		tax_behavior: z.string().nullish(),
		tax_code: z.string().nullish(),
		product_type: z.string().nullish(),
		subtotal: z.number().nullish(),
		tax_amount: z.number().nullish(),
		total_amount: z.number().nullish(),
		// `non_taxable` on a zero-rated pair, and the field to branch on.
		status: z.string().nullish(),
		import: z.boolean().nullish(),
		taxable_part: z.number().nullish(),
		notes: z.string().nullish(),
	})
	.loose();

export type TaxRateCalculateResponse = z.infer<typeof TaxRateResponseSchema>;

const TaxIdValidateInputSchema = z.object({
	tax_id: z.string().min(1).describe('The VAT or tax number to validate.'),
	country: z.string().length(2).describe('Two-letter ISO country code.'),
});

export type TaxIdValidateInput = z.input<typeof TaxIdValidateInputSchema>;

/**
 * The reference documents one field. `valid` is `true` for a registered
 * business, `false` for an invalid number, and `null` when the external registry
 * is unavailable, which is not the same as invalid.
 */
const TaxIdValidateResponseSchema = z
	.object({
		valid: z
			.boolean()
			.nullish()
			.describe(
				'`true` or `false`, or `null` when the registry could not be reached.',
			),
	})
	.loose();

export type TaxIdValidateResponse = z.infer<typeof TaxIdValidateResponseSchema>;

/**
 * Verified live: a tax code's `id` is a **string slug** (`"standard"`,
 * `"saas"`), not a number, and it carries `name` beside `description`. The spec
 * types `id` as an integer, which would fail on every real row.
 */
export const TaxCodeSchema = z
	.object({
		id: z.string(),
		code: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

const TaxCodesListInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Quaderno caps this list.'),
});

export type TaxCodesListInput = z.input<typeof TaxCodesListInputSchema>;

const TaxCodesListResponseSchema = z.object({
	tax_codes: z.array(TaxCodeSchema),
});

export type TaxCodesListResponse = z.infer<typeof TaxCodesListResponseSchema>;

const TaxCodeGetInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe('The tax code identifier, such as `standard`.'),
});

export type TaxCodeGetInput = z.input<typeof TaxCodeGetInputSchema>;

const TaxJurisdictionSchema = z
	.object({
		id: z.number().nullish(),
		country: z.string().nullish(),
		name: z.string().nullish(),
		region: z.string().nullish(),
	})
	.loose();

const JurisdictionsListInputSchema = z.object({
	// Verified live: this route ignores `limit`, so none is offered.
	country: z.string().length(2).optional().describe('Only this country.'),
});

export type JurisdictionsListInput = z.input<
	typeof JurisdictionsListInputSchema
>;

const JurisdictionsListResponseSchema = z.object({
	jurisdictions: z.array(TaxJurisdictionSchema),
});

export type JurisdictionsListResponse = z.infer<
	typeof JurisdictionsListResponseSchema
>;

const JurisdictionGetInputSchema = z.object({
	id: IdSchema.describe('The jurisdiction id.'),
});

export type JurisdictionGetInput = z.input<typeof JurisdictionGetInputSchema>;

const JurisdictionResponseSchema = z.object({
	jurisdiction: TaxJurisdictionSchema,
});

export type JurisdictionResponse = z.infer<typeof JurisdictionResponseSchema>;

// ── Account, webhooks, transactions ───────────────────────────────────────

const PingInputSchema = z.object({});

export type PingInput = z.input<typeof PingInputSchema>;

/**
 * `/ping` verifies credentials and, per the docs, does not consume an API call.
 * The live response is exactly `{"status":"OK"}`.
 */
const PingResponseSchema = z.object({ status: z.string() }).loose();

export type PingResponse = z.infer<typeof PingResponseSchema>;

const AuthorizationInputSchema = z.object({});

export type AuthorizationInput = z.input<typeof AuthorizationInputSchema>;

/**
 * Callable from the bare `quadernoapp.com` host as well as the account host,
 * and the way a caller discovers which account a key belongs to: `href` is the
 * account's own base URL.
 */
const IdentitySchema = z
	.object({
		// The reference's example sends this as a string (`"999"`).
		id: z.union([z.number(), z.string()]).nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		publishable_key: z.string().nullish(),
		href: z.string().nullish(),
		default_api_version: z.number().nullish(),
	})
	.loose();

const AuthorizationResponseSchema = z.object({ identity: IdentitySchema });

export type AuthorizationResponse = z.infer<typeof AuthorizationResponseSchema>;

export const QUADERNO_TRANSACTION_TYPES = ['sale', 'refund'] as const;

/**
 * A transaction line is **not** a document line: it carries the total charged
 * as `amount`, where an invoice line carries `unit_price`.
 */
const TransactionItemWriteSchema = z.object({
	description: z
		.string()
		.min(1)
		.optional()
		.describe(
			'What was sold or refunded. Not needed when `product_code` is set.',
		),
	product_code: z.string().optional().describe('Code of an existing product.'),
	quantity: z.number().optional().describe('Defaults to 1.'),
	amount: z
		.number()
		.describe(
			'Total charged for this line in major units, after discounts and taxes.',
		),
	discount_rate: z
		.number()
		.optional()
		.describe('Discount percentage already included in `amount`.'),
});

/**
 * `/transactions` has its own body, unlike the document routes: the buyer is
 * `customer` (not `contact`), the payment is a nested `payment` object and is
 * required, and tags are one comma-separated string named `tags`.
 */
const TransactionCreateInputSchema = z.object({
	type: z
		.enum(QUADERNO_TRANSACTION_TYPES)
		.optional()
		.describe('`sale` or `refund`. Quaderno treats it as a sale when omitted.'),
	customer: DocumentContactSchema.describe('The customer, by contact id.'),
	items: z.array(TransactionItemWriteSchema).min(1).max(200),
	payment: z
		.object({
			method: z
				.enum(QUADERNO_REFUND_METHODS)
				.describe('How the transaction was paid.'),
			processor: z
				.string()
				.optional()
				.describe('The payment processor, such as `stripe`.'),
			processor_id: z
				.string()
				.optional()
				.describe('The id of the payment in that processor.'),
		})
		.describe('The payment for the transaction. Required.'),
	currency: z.string().length(3).optional(),
	date: z
		.string()
		.min(1)
		.optional()
		.describe('ISO date of the transaction. Defaults to today.'),
	processor: z
		.string()
		.optional()
		.describe('The platform that processed the sale, such as `shopify`.'),
	processor_id: z
		.string()
		.optional()
		.describe(
			'The id of the sale in that platform. Use the same id on a refund to link it to its sale.',
		),
	po_number: z.string().optional(),
	notes: z.string().optional(),
	tags: z
		.string()
		.optional()
		.describe('Tags as one comma-separated string, such as `a,b`.'),
});

export type TransactionCreateInput = z.input<
	typeof TransactionCreateInputSchema
>;

const TransactionResponseSchema = z.object({ transaction: DocumentSchema });

export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;

const WebhooksListInputSchema = z.object({});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

/**
 * Field names and types are the reference's: the subscribed events are the
 * array `events_types`, and the timestamps are date-time **strings** here, not
 * the epoch integers the other resources use.
 *
 * `auth_key`, the secret Quaderno signs deliveries with, is deliberately not
 * declared: `webhooks.list` removes it before this schema runs, because a
 * signing secret has no business in a list result or a log.
 */
const WebhookSchema = z
	.object({
		id: z.number().nullish(),
		url: z.string().nullish(),
		events_types: z.array(z.string()).nullish(),
		events_sent: z.number().nullish(),
		last_sent_at: z.string().nullish(),
		last_error: z.string().nullish(),
		last_error_at: z.string().nullish(),
		created_at: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();

export type QuadernoWebhook = z.infer<typeof WebhookSchema>;

const WebhooksListResponseSchema = z.object({
	webhooks: z.array(WebhookSchema),
});

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type QuadernoEndpointInputs = {
	ping: PingInput;
	authorization: AuthorizationInput;
	contactsList: ContactsListInput;
	contactsCreate: ContactsCreateInput;
	contactsGet: ContactsGetInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	productsList: ProductsListInput;
	productsCreate: ProductsCreateInput;
	productsGet: ProductsGetInput;
	productsUpdate: ProductsUpdateInput;
	productsDelete: ProductsDeleteInput;
	invoicesList: InvoicesListInput;
	invoicesCreate: InvoicesCreateInput;
	invoicesGet: InvoiceGetInput;
	invoicesUpdate: InvoiceUpdateInput;
	invoicesVoid: InvoiceVoidInput;
	invoicesMarkUncollectible: InvoiceMarkUncollectibleInput;
	invoicesRecordPayment: InvoiceRecordPaymentInput;
	invoicesDeliver: InvoiceDeliverInput;
	receiptsList: ReceiptsListInput;
	receiptsCreate: ReceiptsCreateInput;
	receiptsGet: ReceiptGetInput;
	receiptsVoid: ReceiptVoidInput;
	receiptsDeliver: ReceiptDeliverInput;
	creditsList: CreditsListInput;
	creditsCreate: CreditsCreateInput;
	creditsGet: CreditGetInput;
	creditsUpdate: CreditUpdateInput;
	creditsVoid: CreditVoidInput;
	creditsDeliver: CreditDeliverInput;
	proformasList: ProformasListInput;
	proformasCreate: ProformasCreateInput;
	proformasGet: ProformaGetInput;
	proformasUpdate: ProformaUpdateInput;
	proformasAccept: ProformaActionInput;
	proformasDecline: ProformaActionInput;
	proformasRevert: ProformaActionInput;
	proformasConvert: ProformaActionInput;
	proformasDeliver: ProformaDeliverInput;
	taxRatesCalculate: TaxRateCalculateInput;
	taxIdsValidate: TaxIdValidateInput;
	taxCodesList: TaxCodesListInput;
	taxCodesGet: TaxCodeGetInput;
	jurisdictionsList: JurisdictionsListInput;
	jurisdictionsGet: JurisdictionGetInput;
	transactionsCreate: TransactionCreateInput;
	webhooksList: WebhooksListInput;
};

export type QuadernoEndpointOutputs = {
	ping: PingResponse;
	authorization: AuthorizationResponse;
	contactsList: ContactsListResponse;
	contactsCreate: ContactResponse;
	contactsGet: ContactResponse;
	contactsUpdate: ContactResponse;
	contactsDelete: DeleteResponse;
	productsList: ProductsListResponse;
	productsCreate: ProductResponse;
	productsGet: ProductResponse;
	productsUpdate: ProductResponse;
	productsDelete: DeleteResponse;
	invoicesList: InvoicesListResponse;
	invoicesCreate: InvoiceResponse;
	invoicesGet: InvoiceResponse;
	invoicesUpdate: InvoiceResponse;
	invoicesVoid: InvoiceResponse;
	invoicesMarkUncollectible: InvoiceResponse;
	invoicesRecordPayment: PaymentResponse;
	invoicesDeliver: DeliverResponse;
	receiptsList: ReceiptsListResponse;
	receiptsCreate: ReceiptResponse;
	receiptsGet: ReceiptResponse;
	receiptsVoid: ReceiptResponse;
	receiptsDeliver: DeliverResponse;
	creditsList: CreditsListResponse;
	creditsCreate: CreditResponse;
	creditsGet: CreditResponse;
	creditsUpdate: CreditResponse;
	creditsVoid: CreditResponse;
	creditsDeliver: DeliverResponse;
	proformasList: ProformasListResponse;
	proformasCreate: ProformaResponse;
	proformasGet: ProformaResponse;
	proformasUpdate: ProformaResponse;
	proformasAccept: ProformaResponse;
	proformasDecline: ProformaResponse;
	proformasRevert: ProformaResponse;
	proformasConvert: InvoiceResponse;
	proformasDeliver: DeliverResponse;
	taxRatesCalculate: TaxRateCalculateResponse;
	taxIdsValidate: TaxIdValidateResponse;
	taxCodesList: TaxCodesListResponse;
	taxCodesGet: TaxCodeResponse;
	jurisdictionsList: JurisdictionsListResponse;
	jurisdictionsGet: JurisdictionResponse;
	transactionsCreate: TransactionResponse;
	webhooksList: WebhooksListResponse;
};

export const QuadernoEndpointInputSchemas = {
	ping: PingInputSchema,
	authorization: AuthorizationInputSchema,
	contactsList: ContactsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	productsList: ProductsListInputSchema,
	productsCreate: ProductsCreateInputSchema,
	productsGet: ProductsGetInputSchema,
	productsUpdate: ProductsUpdateInputSchema,
	productsDelete: ProductsDeleteInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesCreate: InvoicesCreateInputSchema,
	invoicesGet: InvoiceGetInputSchema,
	invoicesUpdate: InvoiceUpdateInputSchema,
	invoicesVoid: InvoiceVoidInputSchema,
	invoicesMarkUncollectible: InvoiceMarkUncollectibleInputSchema,
	invoicesRecordPayment: InvoiceRecordPaymentInputSchema,
	invoicesDeliver: InvoiceDeliverInputSchema,
	receiptsList: ReceiptsListInputSchema,
	receiptsCreate: ReceiptsCreateInputSchema,
	receiptsGet: ReceiptGetInputSchema,
	receiptsVoid: ReceiptVoidInputSchema,
	receiptsDeliver: ReceiptDeliverInputSchema,
	creditsList: CreditsListInputSchema,
	creditsCreate: CreditsCreateInputSchema,
	creditsGet: CreditGetInputSchema,
	creditsUpdate: CreditUpdateInputSchema,
	creditsVoid: CreditVoidInputSchema,
	creditsDeliver: CreditDeliverInputSchema,
	proformasList: ProformasListInputSchema,
	proformasCreate: ProformasCreateInputSchema,
	proformasGet: ProformaGetInputSchema,
	proformasUpdate: ProformaUpdateInputSchema,
	proformasAccept: ProformaActionInputSchema,
	proformasDecline: ProformaActionInputSchema,
	proformasRevert: ProformaActionInputSchema,
	proformasConvert: ProformaActionInputSchema,
	proformasDeliver: ProformaDeliverInputSchema,
	taxRatesCalculate: TaxRateCalculateInputSchema,
	taxIdsValidate: TaxIdValidateInputSchema,
	taxCodesList: TaxCodesListInputSchema,
	taxCodesGet: TaxCodeGetInputSchema,
	jurisdictionsList: JurisdictionsListInputSchema,
	jurisdictionsGet: JurisdictionGetInputSchema,
	transactionsCreate: TransactionCreateInputSchema,
	webhooksList: WebhooksListInputSchema,
} as const;

const TaxCodeResponseSchema = z.object({ tax_code: TaxCodeSchema });

export type TaxCodeResponse = z.infer<typeof TaxCodeResponseSchema>;
export const QuadernoEndpointOutputSchemas = {
	ping: PingResponseSchema,
	authorization: AuthorizationResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsCreate: ContactResponseSchema,
	contactsGet: ContactResponseSchema,
	contactsUpdate: ContactResponseSchema,
	contactsDelete: DeleteResponseSchema,
	productsList: ProductsListResponseSchema,
	productsCreate: ProductResponseSchema,
	productsGet: ProductResponseSchema,
	productsUpdate: ProductResponseSchema,
	productsDelete: DeleteResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesCreate: InvoiceResponseSchema,
	invoicesGet: InvoiceResponseSchema,
	invoicesUpdate: InvoiceResponseSchema,
	invoicesVoid: InvoiceResponseSchema,
	invoicesMarkUncollectible: InvoiceResponseSchema,
	invoicesRecordPayment: PaymentResponseSchema,
	invoicesDeliver: DeliverResponseSchema,
	receiptsList: ReceiptsListResponseSchema,
	receiptsCreate: ReceiptResponseSchema,
	receiptsGet: ReceiptResponseSchema,
	receiptsVoid: ReceiptResponseSchema,
	receiptsDeliver: DeliverResponseSchema,
	creditsList: CreditsListResponseSchema,
	creditsCreate: CreditResponseSchema,
	creditsGet: CreditResponseSchema,
	creditsUpdate: CreditResponseSchema,
	creditsVoid: CreditResponseSchema,
	creditsDeliver: DeliverResponseSchema,
	proformasList: ProformasListResponseSchema,
	proformasCreate: ProformaResponseSchema,
	proformasGet: ProformaResponseSchema,
	proformasUpdate: ProformaResponseSchema,
	proformasAccept: ProformaResponseSchema,
	proformasDecline: ProformaResponseSchema,
	proformasRevert: ProformaResponseSchema,
	proformasConvert: InvoiceResponseSchema,
	proformasDeliver: DeliverResponseSchema,
	taxRatesCalculate: TaxRateResponseSchema,
	taxIdsValidate: TaxIdValidateResponseSchema,
	taxCodesList: TaxCodesListResponseSchema,
	taxCodesGet: TaxCodeResponseSchema,
	jurisdictionsList: JurisdictionsListResponseSchema,
	jurisdictionsGet: JurisdictionResponseSchema,
	transactionsCreate: TransactionResponseSchema,
	webhooksList: WebhooksListResponseSchema,
} as const;
