// Fixtures are built from the OpenAPI document Rentman publishes at
// openapi-prod-openapidocumentationbucketprodf3f6f37-23pq5ujpblj3.s3.eu-west-1.amazonaws.com/1.20.0/oas.json
// (version 1.20.0), and from the live gateway envelopes a keyless call returns.

export const CONTACT_ID = 12;
export const PROJECT_ID = 201;
export const EQUIPMENT_ID = 33;
export const CREW_ID = 44;
export const APPOINTMENT_ID = 55;
export const INVOICE_ID = 66;

/** The gateway's 401, verbatim from a call with no token. */
export const GATEWAY_UNAUTHORIZED = { message: 'Unauthorized' };

/** The gateway's 403, verbatim from a call with a token it will not accept. */
export const GATEWAY_FORBIDDEN = {
	Message:
		'User is not authorized to access this resource with an explicit deny in an identity-based policy',
};

/** The app layer's own field-level validation envelope. */
export const VALIDATION_ERROR = {
	errors: {
		name: ['The name field is required.'],
		customer: ['The selected customer is invalid.'],
	},
};

export const CONTACT = {
	id: CONTACT_ID,
	created: '2026-01-10T10:00:00+00:00',
	modified: '2026-11-01T09:00:00+00:00',
	creator: '/crew/44',
	displayname: 'Acme Inc',
	folder: '/contacts',
	type: 'company',
	name: 'Acme Inc',
	firstname: '',
	surname: '',
	surfix: '',
	gender: '',
	code: 'ACME',
	accounting_code: '1000',
	vendor_accounting_code: '',
	country: 'NL',
	distance: 12.5,
	travel_time: 25,
	longitude: 4.895168,
	latitude: 52.370216,
	email_1: 'info@acme.example.com',
	phone_1: '+31 20 555 0100',
	mailing_street: 'Damrak',
	mailing_number: '1',
	mailing_postalcode: '1012 LG',
	mailing_city: 'Amsterdam',
	mailing_country: 'NL',
	visit_street: 'Damrak',
	visit_postalcode: '1012 LG',
	visit_city: 'Amsterdam',
	invoice_street: 'Damrak',
	invoice_postalcode: '1012 LG',
	invoice_city: 'Amsterdam',
	invoice_country: 'NL',
};

export const CONTACT_PAGE = {
	data: [CONTACT],
	itemCount: 1,
	limit: 300,
	offset: 0,
	next_page_url: null,
};

/** A page that carries the opaque cursor Rentman warns not to edit. */
export const CONTACT_PAGE_WITH_NEXT = {
	data: [CONTACT],
	itemCount: 1,
	limit: 1,
	offset: 0,
	next_page_url:
		'https://api.rentman.net/contacts?cursor=eyJhZnRlciI6NDU2LCJsaW1pdCI6MX0',
};

export const PROJECT = {
	id: PROJECT_ID,
	created: '2026-02-01T10:00:00+00:00',
	modified: '2026-11-02T09:00:00+00:00',
	creator: '/crew/44',
	displayname: 'Festival 2026',
	name: 'Festival 2026',
	number: 'P-2026-001',
	reference: 'PO-9988',
	project_type: '/projecttypes/1',
	deposit_status: 'no_deposit_paid',
	color: '#1171e4',
	conditions: '',
	tags: '',
	customer: `/contacts/${CONTACT_ID}`,
	cust_contact: null,
	loc_contact: null,
	location: null,
	account_manager: `/crew/${CREW_ID}`,
	usageperiod_start: '2026-07-01T00:00:00+00:00',
	usageperiod_end: '2026-07-10T00:00:00+00:00',
	planperiod_start: '2026-06-30T00:00:00+00:00',
	planperiod_end: '2026-07-11T00:00:00+00:00',
	equipment_period_from: null,
	equipment_period_to: null,
	refundabledeposit: 0,
	project_total_price: 18500,
	project_rental_price: 12000,
	project_sale_price: 0,
	project_crew_price: 4500,
	project_transport_price: 2000,
	project_other_price: 0,
	project_insurance_price: 0,
	project_services_price: 0,
	estimated_cost: 9000,
	planned_cost: 9500,
	actual_cost: 0,
	already_invoiced: 0,
	weight: 1200,
	power: 16000,
	current: 0,
	purchasecosts: 0,
	volume: 12,
	custom: {},
};

export const PROJECT_PAGE = {
	data: [PROJECT],
	itemCount: 1,
	limit: 300,
	offset: 0,
	next_page_url: null,
};

export const EQUIPMENT = {
	id: EQUIPMENT_ID,
	created: '2025-05-01T10:00:00+00:00',
	modified: '2026-10-01T09:00:00+00:00',
	creator: '/crew/44',
	displayname: 'Yamaha QL5 Mixer',
	name: 'Yamaha QL5 Mixer',
	code: 'AUD-001',
	folder: '/equipment/audio',
	factor_group: '',
	unit: 'piece',
	type: 'item',
	taxclass: '/taxclasses/1',
	ledger: '',
	ledger_debit: '',
	defaultgroup: '',
	country_of_origin: 'jp',
	image: '',
	in_shop: true,
	in_planner: true,
	in_archive: false,
	rental_sales: 'Rental',
	temporary: false,
	stock_management: 'Track stock',
	price: 150,
	list_price: 12000,
	subrental_costs: 0,
	critical_stock_level: 1,
	volume: 0.2,
	packed_per: 1,
	height: 0.4,
	width: 0.8,
	length: 0.6,
	weight: 32,
	empty_weight: 30,
	power: 250,
	current: 2,
	internal_remark: '',
	external_remark: '',
};

export const EQUIPMENT_PAGE = {
	data: [EQUIPMENT],
	itemCount: 1,
	limit: 300,
	offset: 0,
	next_page_url: null,
};

export const CREW = {
	id: CREW_ID,
	created: '2025-01-01T10:00:00+00:00',
	modified: '2026-09-01T09:00:00+00:00',
	creator: '/crew/44',
	displayname: 'Sam Rivera',
	firstname: 'Sam',
	middle_name: '',
	lastname: 'Rivera',
	email: 'sam@example.com',
	phone: '+31 20 555 0199',
	active: true,
	avatar: '',
	folder: '/crew',
	company_name: 'Example Logistics',
	external_reference: '',
	tags: '',
	street: 'Damrak',
	housenumber: '1',
	unit_number: '',
	district: '',
	city: 'Amsterdam',
	postal_code: '1012 LG',
	addressline2: '',
	extraaddressline: '',
	state: '',
	country: 'NL',
	custom: {},
};

export const CREW_PAGE = {
	data: [CREW],
	itemCount: 1,
	limit: 300,
	offset: 0,
	next_page_url: null,
};

export const APPOINTMENT = {
	id: APPOINTMENT_ID,
	created: '2026-06-01T10:00:00+00:00',
	modified: '2026-06-02T09:00:00+00:00',
	creator: '/crew/44',
	displayname: 'Load-in',
	name: 'Load-in',
	start: '2026-07-01T08:00:00+00:00',
	end: '2026-07-01T17:00:00+00:00',
	color: '#1171e4',
	location: 'Amsterdam',
	remark: '',
	is_public: false,
	is_plannable: true,
	recurrence_interval_unit: null,
	recurrence_enddate: null,
	recurrence_interval: null,
	recurrence_group: null,
	recurrence_weekdays: null,
	synchronization_id: null,
	synchronisation_uri: null,
};

export const APPOINTMENT_PAGE = {
	data: [APPOINTMENT],
	itemCount: 1,
	limit: 300,
	offset: 0,
	next_page_url: null,
};

export const INVOICE = {
	id: INVOICE_ID,
	created: '2026-08-01T10:00:00+00:00',
	modified: '2026-08-02T09:00:00+00:00',
	creator: '/crew/44',
	displayname: 'F-2026-001',
	number: 'F-2026-001',
	project: `/projects/${PROJECT_ID}`,
	customer: `/contacts/${CONTACT_ID}`,
	contact: null,
	invoicetype: 'F',
	date: '2026-08-01T00:00:00+00:00',
	expiration: '2026-08-31T00:00:00+00:00',
	finalized: true,
	price: 15000,
	price_invat: 18150,
	vat_amount: 3150,
	total_paid: 0,
	outstanding_balance: 18150,
	is_paid: false,
};

export const INVOICE_PAGE = {
	data: [INVOICE],
	itemCount: 1,
	limit: 300,
	offset: 0,
	next_page_url: null,
};
