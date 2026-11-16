/**
 * Shapes taken from Simplero's OpenAPI schemas at
 * https://simplero.com/api/v2/reference/openapi.json. Values keep every
 * documented field type honest, including the nulls the API sends.
 */

export const pagination = {
	page: 1,
	per_page: 20,
	total: 42,
	total_pages: 3,
	next_after: 41,
};

export const cursorPagination = {
	page: null,
	per_page: 20,
	total: null,
	total_pages: null,
	next_after: 77,
};

export const customer = {
	id: 12,
	first_names: 'Alex',
	last_name: 'Doe',
	email: 'alex@example.com',
	alternative_emails: [],
	phone_number: null,
	do_not_contact: false,
	do_not_sms: false,
	locale: 'en',
	gdpr_consent: true,
	lead_score: 7,
	lifetime_value_cents_excl_tax: 19900,
	lead_acquisition_cost_cents_excl_tax: null,
	customer_acquisition_cost_cents_excl_tax: null,
	created_at: '2026-02-01T10:00:00Z',
	updated_at: '2026-02-02T10:00:00Z',
};

export const list = {
	id: 31,
	token: 'list_abc',
	name: 'Newsletter',
	internal_name: 'newsletter',
	handle: 'newsletter',
	labels: [],
	show_in_admin: true,
	require_confirmation: true,
	sender_name: 'Acme',
	sender_email: 'news@acme.example',
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};

export const tag = {
	id: 5,
	token: 'tag_abc',
	name: 'VIP',
	description: 'High value',
	color: '#ff0000',
	labels: [],
	show_in_admin: true,
	undeleted_customers_count: 12,
	last_tagging_at: '2026-02-01T00:00:00Z',
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};

export const product = {
	id: 77,
	token: 'prod_abc',
	name: 'Course',
	internal_name: 'course',
	subtitle: 'Learn it',
	summary: 'A course',
	short_description: 'Short',
	long_description: null,
	listing_type: 'public',
	product_type: 'course',
	labels: [],
	show_in_admin: true,
	recurring: false,
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};

export const purchase = {
	token: 'pur_abc',
	customer_id: 12,
	product_id: 34,
	price_id: 56,
	state: 'complete',
	email: 'alex@example.com',
	first_names: 'Alex',
	last_name: 'Doe',
	currency_code: 'USD',
	country_code: 'US',
	received_price_cents: 19900,
	purchased_at: '2026-02-01T10:00:00Z',
	canceled_at: null,
	refunded_at: null,
};

export const subscription = {
	token: 'sub_abc',
	list_id: 7,
	customer_id: 12,
	active: true,
	confirmed: true,
	first_activated_at: '2026-01-01T00:00:00Z',
	unsubscribed_at: null,
	suspended_at: null,
};

export const actionOk = { success: true, message: 'Tag added' };

/** The 401 body the live API answers. */
export const authProblem = { error: 'Bad API key' };

/** The 422 body, a flat list of strings rather than a field map. */
export const validationProblem = {
	errors: ['Email is invalid', 'Lead score must be a number'],
};
