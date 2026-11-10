/**
 * Captured from the live API on a scratch account. Values are trimmed to what
 * the plugin reads, with the real field names kept.
 */

/** `GET /ping` answers exactly this. */
export const pingFixture = { status: 'OK' } as const;

/** `GET /authorization`. Every value is a placeholder, not a real account. */
export const authorizationFixture = {
	identity: {
		id: 100000,
		name: 'Example Account',
		email: 'owner@example.com',
		publishable_key: 'example-publishable-key',
		href: 'https://example-000000.quadernoapp.com/api/',
		default_api_version: 20241028,
	},
} as const;

/** `POST /contacts`, captured live. A create wraps nothing: the row is bare. */
export const contactFixture = {
	id: 78395726,
	kind: 'person',
	first_name: 'Corsair',
	last_name: 'Probe',
	full_name: 'Corsair Probe',
	email: 'probe@example.com',
	country: 'US',
	city: null,
	tax_status: 'taxable',
	language: 'EN',
	notes: null,
	discount: null,
	permalink: 'https://example-000000.quadernoapp.com/billing/abc',
	created_at: 1794285133,
} as const;

/** A list route answers a **bare array**, captured live. */
export const contactsFixture = [contactFixture] as const;

/** `POST /items`, captured live. Note `unit_cost` came back as `"10.0"`. */
export const productFixture = {
	id: 321034,
	created_at: 1794285129,
	code: 'PROBE-1',
	name: 'Corsair Probe Item',
	description: null,
	product_type: 'service',
	unit_cost: '10.0',
	currency: 'USD',
	stock: null,
	tax_class: 'eservice',
	kind: 'one_off',
	tax_type: 'excluded',
	tax_based_on: 'customer_country',
	url: 'https://example-000000.quadernoapp.com/api/items/321034',
} as const;

export const productsFixture = [productFixture] as const;

/**
 * `POST /invoices`, captured live. Fields the spec omits but the API sends:
 * `blocked`, `delivery_state`, `secure_id`, `verification_code`,
 * `verification_permalink` and `credits`.
 */
export const invoiceFixture = {
	id: 181235103,
	blocked: true,
	number: 'I2026-00001',
	issue_date: '2026-11-10',
	created_at: 1794285134,
	contact: contactFixture,
	currency: 'USD',
	state: 'outstanding',
	delivery_state: 'not_delivered',
	subtotal_cents: 1000,
	discount_cents: 0,
	total_cents: 1000,
	processor_fee_cents: 0,
	items: [
		{
			id: 237364409,
			description: 'Probe item',
			quantity: 1,
			unit_price: '10.0',
			discount_rate: 0,
			product_code: null,
			total_amount: '10.0',
			subtotal_cents: 1000,
			discount_cents: 0,
			tax_1_name: null,
			tax_1_rate: null,
			tax_1_country: null,
			tax_1_region: null,
		},
	],
	taxes: [],
	payments: [],
	notes: null,
	payment_details: null,
	subject: null,
	po_number: null,
	tag_list: [],
	secure_id: 'c10ace1a9cea4e1a4863ee180e76e523d27d055a',
	verification_code: '100669',
	verification_permalink: 'https://example-000000.quadernoapp.com/billing/abc',
	permalink: 'https://example-000000.quadernoapp.com/billing/abc',
	pdf: 'https://example-000000.quadernoapp.com/pdf/abc',
	url: 'https://example-000000.quadernoapp.com/api/invoices/181235103',
} as const;

export const invoicesFixture = [invoiceFixture] as const;

/**
 * The same invoice after `PUT /invoices/{id}/void`, captured live. Voiding is
 * not deletion: it records an `offset` payment for the full amount and issues a
 * credit note beside it.
 */
export const voidedInvoiceFixture = {
	...invoiceFixture,
	state: 'paid',
	payments: [
		{
			id: 171741154,
			date: '2026-11-10',
			payment_method: 'offset',
			amount: '10.0',
			amount_cents: 1000,
			processor: null,
			processor_id: null,
			created_at: 1794285134,
		},
	],
	credits: [
		{
			id: 181235112,
			number: 'C2026-00001',
			issue_date: '2026-11-10',
			total_cents: 1000,
		},
	],
} as const;

/** `POST /invoices/{id}/payments`, captured live. Note there is no created_at. */
export const paymentFixture = {
	id: 171741922,
	date: '2026-11-10',
	payment_method: 'cash',
	processor: null,
	processor_id: null,
	amount_cents: 1000,
	url: 'https://example-000000.quadernoapp.com/api/invoices/181235879/payments/171741922.json',
} as const;

/** A receipt, shaped like an invoice. Not captured: none existed to read. */
export const receiptFixture = {
	...invoiceFixture,
	id: 181235200,
	number: 'R2026-00001',
	state: 'paid',
} as const;

/** A credit note, captured live as `C2026-00001` beside the voided invoice. */
export const creditFixture = {
	...invoiceFixture,
	id: 181235112,
	number: 'C2026-00001',
	state: 'paid',
} as const;

/** A proforma. Not captured: creating one would consume a number. */
export const proformaFixture = {
	...invoiceFixture,
	id: 181235300,
	number: 'P2026-00001',
	state: 'open',
} as const;

/** `GET /tax_codes`, captured live: a bare array, and `id` is a slug string. */
export const taxCodesFixture = [
	{
		id: 'standard',
		name: 'Generally taxable',
		description: 'Any taxable good or service.',
	},
	{
		id: 'saas',
		name: 'SaaS',
		description: 'Cloud services software delivered over the internet.',
	},
] as const;

/**
 * One tax code, as the API sends it: **bare**, which is what the endpoint
 * wraps. Captured live: the `id` is the slug, not a number.
 */
export const taxCodeFixture = {
	id: 'standard',
	name: 'Generally taxable',
	description: 'Any taxable good or service.',
} as const;

/** `GET /jurisdictions`, captured live: a bare array of 292 entries. */
export const jurisdictionsFixture = [
	{ id: 1, country: 'IN', name: 'India', region: null },
	{ id: 2, country: 'US', name: 'United States', region: null },
] as const;

export const jurisdictionFixture = {
	jurisdiction: { id: 1, country: 'IN', name: 'India', region: null },
} as const;

/** `GET /tax_rates/calculate`. Not captured: needs a taxable customer pair. */
export const taxRateFixture = {
	tax_rates: [
		{
			name: 'VAT',
			rate: 20,
			country: 'GB',
			region: null,
			transaction_type: 'eservice',
			tax_code: 'standard',
			notes: null,
		},
	],
	amount: '10.0',
	total: '12.0',
} as const;

/** `GET /tax_ids/validate`. Not captured: needs a real VAT number. */
export const taxIdValidationFixture = {
	valid: true,
	valid_format: true,
	company_name: 'Example Ltd',
	company_address: '1 Example Street, London',
} as const;

/** `GET /webhooks`, a bare array. Empty on the scratch account. */
export const webhooksFixture = [] as const;

/**
 * One webhook as the reference documents it. Not captured: the scratch account
 * had none. The timestamps are date-time strings, the events are `events_types`,
 * and `auth_key` is the secret the deliveries are signed with (a placeholder
 * here).
 */
export const webhookFixture = {
	id: 4821,
	url: 'https://example.com/hooks/quaderno',
	auth_key: 'example-signing-secret',
	events_types: ['invoice.created', 'credit.created'],
	events_sent: 12,
	last_sent_at: '2026-11-10T09:30:00Z',
	last_error: null,
	last_error_at: null,
	created_at: '2026-11-10T09:00:00Z',
} as const;

// ── Errors, captured live ─────────────────────────────────────────────────

/** A wrong key. HTTP 401. */
export const wrongKeyBody = {
	error: 'Wrong API key or the user does not exist.',
} as const;

/**
 * A missing record, which Quaderno reports with **401**, not 404. The message is
 * the only thing that separates it from a bad key.
 */
export const missingRecordBody = {
	error: 'Unauthorized access or contact does not exist.',
} as const;

/** A validation failure. HTTP 422, a different envelope from the ones above. */
export const validationErrorBody = {
	errors: { kind: ['is not included in the list'] },
} as const;

/** Deleting a contact that still has documents. HTTP 422. */
export const contactHasDocumentsBody = {
	errors: {
		base: ['The contact cannot be deleted as it has associated documents.'],
	},
} as const;

/** Deleting an invoice, which Quaderno forbids outright. HTTP 405. */
export const invoiceNotDeletableBody = {
	error:
		'Invoices cannot be deleted. Tax law requires retaining all transaction records. If you need to reverse an invoice, use the void endpoint instead.',
} as const;
