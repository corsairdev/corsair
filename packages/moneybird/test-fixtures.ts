// Response bodies copied from the examples on developer.moneybird.com, with
// made-up companies and people. The 401 body was captured from the live API.

export const administration = {
	id: '107693607045039116',
	name: 'Beachy BV',
	language: 'nl',
	currency: 'EUR',
	country: 'NL',
	time_zone: 'Europe/Amsterdam',
	access: 'user',
	suspended: false,
	period_locked_until: null,
	period_start_date: '2024-01-01',
};

export const contact = {
	id: '387172987357643188',
	administration_id: '107693607045039116',
	company_name: 'Beachy',
	firstname: 'Jana',
	lastname: 'Berger',
	address1: 'Strandweg 1',
	zipcode: '1234 AB',
	city: 'Amsterdam',
	country: 'NL',
	phone: '+31 20 111 22 33',
	delivery_method: 'Email',
	customer_id: '1',
	tax_number: 'NL123456789B01',
	email: 'info@beachy.example',
	send_invoices_to_email: 'invoices@beachy.example',
	direct_debit: false,
	archived: false,
	version: 1676587176540,
	created_at: '2025-11-02T10:00:00.000Z',
	updated_at: '2026-03-20T09:00:00.000Z',
};

export const salesInvoice = {
	id: '437485325512000001',
	administration_id: '107693607045039116',
	contact_id: '387172987357643188',
	contact: { id: '387172987357643188', company_name: 'Beachy' },
	invoice_id: '2026-0042',
	workflow_id: '362485010665436246',
	state: 'open',
	invoice_date: '2026-04-01',
	due_date: '2026-05-01',
	currency: 'EUR',
	prices_are_incl_tax: false,
	total_price_excl_vat: '1000.0',
	total_price_incl_vat: '1190.0',
	total_unpaid_amount: '1190.0',
	details: [
		{
			id: '437485325512000002',
			description: 'Project management',
			price_per_unit: '1000.0',
			quantity: '1',
			amount: '1000.0',
			tax: '19.0%',
		},
	],
	created_at: '2026-04-01T08:00:00.000Z',
	updated_at: '2026-04-01T08:00:00.000Z',
};

export const timeEntry = {
	id: '439926855698000001',
	administration_id: '107693607045039116',
	project_id: '1234567890',
	user_id: '933590696',
	started_at: '2026-04-09T09:00:00.000Z',
	ended_at: '2026-04-09T10:30:00.000Z',
	description: 'Kickoff call',
	paused_duration: 0,
	billable: true,
	created_at: '2026-04-09T11:00:00.000Z',
	updated_at: '2026-04-09T11:00:00.000Z',
};

export const product = {
	id: '440009337465900001',
	administration_id: '107693607045039116',
	description: 'Consulting hour',
	identifier: 'CONS-1',
	price: '120.0',
	currency: 'EUR',
	tax_rate_id: '362485010665400000',
	ledger_account_id: '362485010665400100',
	created_at: '2026-01-05T10:00:00.000Z',
	updated_at: '2026-01-05T10:00:00.000Z',
};

export const project = {
	id: '1234567890',
	name: 'Website Relaunch',
	state: 'active',
	budget: 50000,
	created_at: '2026-01-15T08:00:00.000Z',
	updated_at: '2026-04-01T12:30:00.000Z',
};

/** The probed 401 body. */
export const unauthorized = {
	error: 'access token invalid',
	symbolic: { request: 'invalid_grant' },
};

/** A 422 validation body, nested per attribute on updates. */
export const validationErrors = {
	errors: { name: ["can't be blank"] },
};
