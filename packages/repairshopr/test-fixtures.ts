// Fixtures are built from the OpenAPI document RepairShopr publishes at
// https://api-docs.repairshopr.com/swagger.json, and from the live envelopes a
// keyless call returns.

export const CUSTOMER_ID = 1;
export const TICKET_ID = 3;
export const INVOICE_ID = 6;
export const PRODUCT_ID = 7;

/** The live 401 body, verbatim from a call with no key. */
export const AUTH_ERROR = { error: 'Failed to authenticate account' };

/** A 422 listing more than one bad field, with the values echoed back. */
export const VALIDATION_ERROR = {
	success: false,
	message: [
		'Email is not an email',
		'Email Only able to parse up to "it is not an email"',
	],
	params: { email: 'it is not an email' },
};

/** A 422 on a ticket create, which carries a single string error. */
export const TICKET_VALIDATION_ERROR = { error: 'Customer required field' };

export const META = { total_pages: 1, total_entries: 1, per_page: 25, page: 1 };
export const META_MORE = {
	total_pages: 3,
	total_entries: 3,
	per_page: 1,
	page: 1,
};

export const CUSTOMER = {
	id: CUSTOMER_ID,
	firstname: 'Walkin',
	lastname: 'Customer',
	fullname: 'Walkin Customer',
	business_name: null,
	email: 'walkin@example.com',
	phone: '555-0100',
	mobile: null,
	address: '1 Market St',
	address_2: null,
	city: 'San Francisco',
	state: 'CA',
	zip: '94105',
	latitude: 37.7936,
	longitude: -122.3965,
	notes: '',
	created_at: '2026-01-10T10:00:00.000-08:00',
	updated_at: '2026-11-01T09:00:00.000-08:00',
	pdf_url: 'https://acme.repairshopr.com/customers/1.pdf',
	location_name: 'Main',
	get_sms: false,
	opt_out: false,
	no_email: false,
	get_billing: true,
	get_marketing: false,
	get_reports: false,
	disabled: false,
	// A caller-defined custom-field map.
	properties: { loyalty_tier: 'gold' },
};

export const CUSTOMER_PAGE = { customers: [CUSTOMER], meta: META };
export const CUSTOMER_PAGE_MORE = { customers: [CUSTOMER], meta: META_MORE };

export const TICKET = {
	id: TICKET_ID,
	number: 2012,
	subject: 'Laptop will not boot',
	created_at: '2026-11-04T06:55:01.883-08:00',
	updated_at: '2026-11-05T06:55:01.883-08:00',
	customer_id: CUSTOMER_ID,
	customer_business_then_name: 'Walkin Customer',
	due_date: '2026-11-10',
	resolved_at: null,
	start_at: null,
	end_at: null,
	location_id: 1,
	location_name: 'Main',
	problem_type: 'Hardware',
	status: 'New',
	ticket_type_id: 2,
	ticket_type_name: 'Repair',
	user_id: 5,
	pdf_url: 'https://acme.repairshopr.com/tickets/3.pdf',
	priority: 'High',
	billing_status: 'Not Billed',
	tag_list: ['urgent'],
	sla_name: 'Standard',
	contact_id: null,
	parent_id: null,
	properties: { intake_source: 'phone' },
};

export const TICKET_PAGE = { tickets: [TICKET], meta: META };

export const INVOICE = {
	id: INVOICE_ID,
	name: 'February',
	number: '9999',
	external_id: null,
	schedule_id: null,
	qbsdk_external_id: null,
	xero_id: null,
	customer_id: CUSTOMER_ID,
	customer_business_then_name: 'Walkin Customer',
	ticket_id: TICKET_ID,
	location_id: 1,
	contact_id: null,
	po_number: null,
	created_at: '2026-02-01T10:00:00.000-08:00',
	updated_at: '2026-02-02T10:00:00.000-08:00',
	date: '2026-02-01',
	due_date: '2026-03-01',
	// RepairShopr returns money as strings on this resource.
	subtotal: '150.00',
	total: '181.50',
	tax: '31.50',
	verified_paid: false,
	tech_marked_paid: false,
	is_paid: false,
	pdf_url: 'https://acme.repairshopr.com/invoices/6.pdf',
};

export const INVOICE_PAGE = { invoices: [INVOICE], meta: META };

export const PRODUCT = {
	id: PRODUCT_ID,
	name: 'SSD 1TB',
	description: 'Samsung 980 Pro',
	condition: 'New',
	price_cost: 90,
	price_retail: 150,
	price_wholesale: 120,
	maintain_stock: true,
	quantity: 12,
	warranty: '1 year',
	sort_order: 0,
	reorder_at: 2,
	disabled: false,
	taxable: true,
	product_category: 'Parts',
	category_path: 'Parts/Storage',
	upc_code: '887276123456',
	discount_percent: 0,
	warranty_template_id: null,
	qb_item_id: null,
	desired_stock_level: 5,
	notes: '',
	tax_rate_id: 1,
	physical_location: 'Shelf B2',
	serialized: false,
};

/** This collection carries no `meta` block in RepairShopr's own example. */
export const PRODUCT_PAGE = { products: [PRODUCT] };

export const CONTACT = {
	id: 21,
	name: 'Jordan Lee',
	address1: '1 Market St',
	address2: null,
	city: 'San Francisco',
	state: 'CA',
	zip: '94105',
	email: 'jordan@example.com',
	phone: '555-0111',
	mobile: null,
	latitude: 37.7936,
	longitude: -122.3965,
	customer_id: CUSTOMER_ID,
	vendor_id: null,
	account_id: 1,
	notes: '',
	opt_out: false,
	created_at: '2026-03-01T10:00:00.000-08:00',
	updated_at: '2026-03-02T10:00:00.000-08:00',
	properties: {},
};

export const CONTACT_PAGE = { contacts: [CONTACT], meta: META };

export const VENDOR = {
	id: 31,
	name: 'Parts Depot',
	rep_first_name: 'Alex',
	rep_last_name: 'Kim',
	email: 'sales@partsdepot.example.com',
	phone: '555-0122',
	account_number: 'VD-100',
	address: '500 Industrial Way',
	city: 'Oakland',
	state: 'CA',
	zip: '94607',
	website: 'https://partsdepot.example.com',
	notes: '',
	created_at: '2025-06-01T10:00:00.000-07:00',
	updated_at: '2026-01-02T10:00:00.000-08:00',
};

/** This collection carries no `meta` block either. */
export const VENDOR_PAGE = { vendors: [VENDOR] };
