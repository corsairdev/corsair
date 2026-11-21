/**
 * Response fixtures shaped after the examples in the Payhere API docs
 * (developers.payhere.co).
 */

export const unauthorized = { error: 'Unauthorized' };

export const LIST_META = {
	current_page: 1,
	next_page: null,
	prev_page: null,
	total_pages: 1,
	total_count: 1,
};

export const user = {
	id: 2,
	display_name: 'John Smith',
	email: 'john.smith@example.org',
	created_at: '2015-11-08T14:12:27.962Z',
	updated_at: '2019-03-04T13:57:32.114Z',
	type: 'users',
};

export const company = {
	id: 1,
	name: 'Alt Labs',
	legal_name: 'Alternate Labs Ltd',
	slug: 'altlabs',
	ready: true,
	country_code: 'GB',
	currency: 'gbp',
	stripe_connected: true,
	gocardless_connected: true,
};

export const companyStats = {
	currency: 'gbp',
	payments_last_30: 329.4,
	payments_comparison: 278.42,
	subscribers_last_30: 7,
	subscribers_comparison: 5,
	payments_all_time: 6239.76,
};

export const customer = {
	id: 989899294,
	name: 'Geoff Williams',
	email: 'g.williams01@example.org',
	ip_address: null,
	location: {},
	created_at: '2019-03-04T16:28:32.656Z',
	updated_at: '2019-03-04T16:28:32.656Z',
	type: 'customers',
};

export const customerDetail = {
	...customer,
	subscriptions: [],
	payments: [],
};

export const payment = {
	id: 845088515,
	hashid: 'VRSgg9kvB',
	reference: 'GW8264',
	formatted_amount: '£12.99',
	amount: 12.99,
	currency: 'gbp',
	refund_amount: 2.99,
	amount_paid: 10.0,
	company_id: 636211471,
	card_brand: 'visa',
	card_last4: null,
	status: 'part_refund',
	success: true,
	created_at: '2017-06-03T00:00:00.000Z',
	updated_at: '2017-06-03T00:00:00.000Z',
	type: 'payments',
};

export const plan = {
	id: 64,
	payment_type: 'recurring',
	name: 'Help us fight COVID-19',
	description: '',
	price: 0,
	price_in_cents: 0,
	currency: 'eur',
	slug: 'help-us-fight-covid-19',
	billing_interval: 'month',
	billing_interval_count: 1,
	hidden: false,
	type: 'plans',
};

export const subscription = {
	id: 173524457,
	customer_id: 989899294,
	last_charged: '2018-01-03T00:00:00.000Z',
	next_charge_at: '2018-02-03T00:00:00.000Z',
	status: 'active',
	stripe_subscription_id: '2e72dabd',
	billing_interval: 'month',
	membership_plan_id: 372786875,
	provider: 'stripe',
	metadata: {},
	type: 'subscriptions',
};

/** The delivery body Payhere posts: an event key plus the record. */
export const webhookEvent = {
	event: 'payment.success',
	payment: {
		id: 845088515,
		amount: 12.99,
		currency: 'gbp',
	},
};
