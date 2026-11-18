// Fixtures are built from the shapes in Ramp's published OpenAPI document
// (https://docs.ramp.com/openapi/developer-api.json) and from the live API's
// documented examples. Values are Ramp's own examples where they exist.

export const TRANSACTION_ID = 'fd14cd6a-846e-4994-9315-5a59e6bb465f';
export const BILL_ID = '1e3b0a4e-6f4c-4b3a-9f6d-0a1b2c3d4e5f';
export const VENDOR_ID = '9b1c0a4e-6f4c-4b3a-9f6d-0a1b2c3d4e5f';
export const USER_ID = 'bde8334e-042e-4f39-9a5d-355ae17342e6';
export const DEPARTMENT_ID = 'c16b6ee1-2f5d-45e9-9fb4-c1c541a9ea70';
export const MERCHANT_ID = '7e4d2c10-3b5a-4f8e-9c1d-2a3b4c5d6e7f';

/** The `error_v2` envelope Ramp sends for a rejected token. */
export const INVALID_TOKEN_BODY = {
	error_v2: {
		message: 'Access token with given access_token not found',
		notes: '',
		error_code: 'DEVELOPER_7002',
		additional_info: {},
		error_id: '40ef21e2',
	},
	error: {
		message: 'Access token with given access_token not found',
		details: {},
	},
};

/** A 400 validation envelope, with Ramp's `notes` field carrying context. */
export const VALIDATION_ERROR_BODY = {
	error_v2: {
		message: 'Invalid request body',
		notes: 'invoice_currency must be a three-letter ISO code',
		error_code: 'DEVELOPER_7001',
		additional_info: {},
		error_id: 'a1b2c3d4',
	},
};

/** A read-only token refused a write. */
export const SCOPE_ERROR_BODY = {
	error_v2: {
		message: 'These scopes are not allowed for this token: transactions:write',
		notes: '',
		error_code: 'DEVELOPER_7100',
		additional_info: {},
		error_id: 'b2c3d4e5',
	},
};

/**
 * One transaction, with the field types the OpenAPI document declares and the
 * `null` values the API is documented to send for an unset optional.
 */
export const TRANSACTION = {
	id: TRANSACTION_ID,
	amount: 90,
	currency_code: 'USD',
	memo: 'Team lunch',
	state: 'CLEARED',
	sync_status: 'SYNCED',
	sk_category_id: 19,
	sk_category_name: 'Restaurants',
	merchant_id: MERCHANT_ID,
	merchant_name: 'Chipotle',
	merchant_descriptor: 'CHIPOTLE 1234',
	merchant_category_code: '5812',
	merchant_category_code_description: 'Eating Places',
	merchant_location: {
		city: 'San Francisco',
		country: 'US',
		postal_code: '94105',
		state: 'CA',
	},
	card_id: '6bc41b14-f853-4862-bae5-4f122f123f6e',
	card_holder: {
		department_id: 'd471d830-2e73-4082-8a75-68540f83e86e',
		department_name: 'Executive',
		first_name: 'Patrick',
		last_name: 'Robinson',
		location_id: '4fcf3423-a2e6-42f6-8dd8-9b3a8c51e069',
		location_name: 'San Francisco',
		user_id: 'a26c82c9-6b7d-4022-bc4b-a55b4c4743c7',
	},
	card_present: false,
	user_transaction_time: '2026-05-03T18:24:11+00:00',
	accounting_date: '2026-05-03T00:00:00+00:00',
	settlement_date: '2026-05-04T00:00:00+00:00',
	updated_at: '2026-05-04T01:00:00+00:00',
	synced_at: '2026-05-04T02:00:00+00:00',
	entity_id: '24850cdb-1b3f-4eb9-bf20-967ca9f97605',
	statement_id: null,
	trip_id: null,
	trip_name: null,
	fund_id: '5e25f547-bd09-40ad-aab3-b8fefdf16885',
	limit_id: '5e25f547-bd09-40ad-aab3-b8fefdf16885',
	spend_program_id: null,
	original_transaction_id: null,
	all_requirements_met_and_approved: true,
	requires_accounting_vendor_creation_to_sync: false,
	entity_amount: { currency: 'USD', value: 9000 },
	merchant_amount: { currency: 'USD', value: 9000 },
	original_transaction_amount: {
		amount: 9000,
		currency_code: 'USD',
		minor_unit_conversion_rate: 100,
	},
	line_items: [
		{
			id: '11111111-1111-1111-1111-111111111111',
			memo: 'Entrees',
			accounting_field_selections: [],
			amount: {
				amount: 5000,
				currency_code: 'USD',
				minor_unit_conversion_rate: 100,
			},
			converted_amount: {
				amount: 5000,
				currency_code: 'USD',
				minor_unit_conversion_rate: 100,
			},
		},
	],
	receipts: [],
	disputes: [],
	policy_violations: [],
};

export const TRANSACTION_PAGE = {
	data: [TRANSACTION],
	page: {
		next: null,
		total_count: null,
		total_count_capped: null,
	},
};

/** A page with a cursor, so `next_cursor` has a value to read. */
export const TRANSACTION_PAGE_WITH_NEXT = {
	data: [TRANSACTION],
	page: {
		next: `https://api.ramp.com/developer/v1/transactions?start=${TRANSACTION_ID}&page_size=20`,
	},
};

export const BILL = {
	id: BILL_ID,
	invoice_number: 'INV-2026-0042',
	memo: 'Q2 hosting',
	vendor_memo: 'PO 4471',
	status: 'PAID',
	status_summary: 'PAID',
	approval_status: 'APPROVED',
	sync_status: 'BILL_AND_PAYMENT_SYNCED',
	amount: {
		amount: 125000,
		currency_code: 'USD',
		minor_unit_conversion_rate: 100,
	},
	due_at: '2026-06-01T00:00:00+00:00',
	issued_at: '2026-05-01T00:00:00+00:00',
	created_at: '2026-05-01T00:00:00+00:00',
	paid_at: '2026-05-28T00:00:00+00:00',
	accounting_date: '2026-05-01T00:00:00+00:00',
	posting_date: null,
	archived_at: null,
	entity_id: '24850cdb-1b3f-4eb9-bf20-967ca9f97605',
	draft_bill_id: null,
	remote_id: null,
	purchase_order_id: null,
	vendor_contact_id: null,
	deep_link_url: 'https://app.ramp.com/bills/1e3b0a4e',
	is_payment_sync_ready: true,
	fx_conversion_rate: '1.0',
	vendor: {
		id: VENDOR_ID,
		name: 'Northwind Hosting',
		remote_code: null,
		remote_id: null,
		remote_name: null,
		type: 'VENDOR',
	},
	bill_owner: { id: USER_ID, first_name: 'Linda', last_name: 'Gu' },
	payment: {
		id: '22334455-6677-8899-aabb-ccddeeff0011',
		customer_friendly_payment_id: 'PAY-4471',
		payment_method: 'ACH',
		payment_date: '2026-05-28',
		effective_date: '2026-05-28',
		amount: {
			amount: 125000,
			currency_code: 'USD',
			minor_unit_conversion_rate: 100,
		},
	},
	line_items: [
		{
			id: '33445566-7788-99aa-bbcc-ddeeff001122',
			memo: 'Hosting',
			accounting_field_selections: [],
			amount: {
				amount: 125000,
				currency_code: 'USD',
				minor_unit_conversion_rate: 100,
			},
			purchase_order_line_item_id: null,
		},
	],
	invoice_urls: ['https://cdn.ramp.com/invoice-42.pdf'],
	item_receipt_ids: [],
};

export const BILL_PAGE = { data: [BILL], page: { next: null } };

export const MERCHANT = {
	id: MERCHANT_ID,
	merchant_name: 'Chipotle',
	sk_category_name: 'Restaurants',
	is_auto_approved: true,
};

export const MERCHANT_PAGE = { data: [MERCHANT], page: { next: null } };

export const VIRTUAL_CARD = {
	id: '44556677-8899-aabb-ccdd-eeff00112233',
	fund_id: '5e25f547-bd09-40ad-aab3-b8fefdf16885',
	user_id: USER_ID,
	is_card_suspended: false,
	created_at: '2026-01-15T00:00:00+00:00',
};

export const VIRTUAL_CARD_PAGE = {
	data: [VIRTUAL_CARD],
	page: { next: null },
};

export const REIMBURSEMENT = {
	id: '55667788-99aa-bbcc-ddee-ff0011223344',
	type: 'MILEAGE',
	direction: 'BUSINESS_TO_USER',
	state: 'APPROVED',
	sync_status: 'SYNCED',
	memo: 'Client visit',
	merchant: 'Mileage',
	merchant_id: null,
	user_id: USER_ID,
	user_email: 'linda@company.com',
	user_full_name: 'Linda Gu',
	employee_id: null,
	entity_id: '24850cdb-1b3f-4eb9-bf20-967ca9f97605',
	fund_id: null,
	trip_id: null,
	transaction_date: '2026-05-20',
	accounting_date: '2026-05-20T00:00:00+00:00',
	created_at: '2026-05-20T00:00:00+00:00',
	updated_at: '2026-05-21T00:00:00+00:00',
	submitted_at: '2026-05-20T00:00:00+00:00',
	approved_at: '2026-05-21T00:00:00+00:00',
	synced_at: '2026-05-22T00:00:00+00:00',
	payment_processed_at: null,
	distance: 42.5,
	payee_amount: {
		amount: 2975,
		currency_code: 'USD',
		minor_unit_conversion_rate: 100,
	},
	entity_amount: {
		currency: 'USD',
		value: 2975,
		minor_unit_conversion_rate: 100,
	},
	merchant_amount: {
		currency: 'USD',
		value: 2975,
		minor_unit_conversion_rate: 100,
	},
	receipts: [],
	line_items: [],
	attendees: [],
	waypoints: ['Union Square, San Francisco, CA'],
};

export const REIMBURSEMENT_PAGE = {
	data: [REIMBURSEMENT],
	page: { next: null },
};

/**
 * The memo endpoints answer the memo alone, not a `{ data, page }` envelope, so
 * they use these rather than a page fixture.
 */
export const MEMO = { id: TRANSACTION_ID, memo: 'Team lunch' };

export const DEPARTMENT = { id: DEPARTMENT_ID, name: 'Engineering' };
export const DEPARTMENT_PAGE = { data: [DEPARTMENT], page: { next: null } };

export const USER = {
	id: USER_ID,
	first_name: 'Linda',
	last_name: 'Gu',
	email: 'linda@company.com',
	role: 'BUSINESS_USER',
	status: 'USER_ACTIVE',
	employee_id: 'f4efe11c-337f-49a5-86b3-5df128233f2c',
	business_id: '9abffcf0-dd7d-42f0-b806-ce0502ab6496',
	entity_id: '0e90959a-28ba-4f7d-a75b-9c241f384b9a',
	department_id: '2d68eb67-f6eb-4284-8683-7d530c77a5a6',
	location_id: 'f4efe11c-221f-4b49-a1e4-33eaf96a49ee',
	manager_id: 'ccc5d4cc-337f-49a5-86b3-5df128233f2c',
	is_manager: false,
	// The OpenAPI example carries this as a bare number, not a string, so the
	// fixture keeps it that way to pin the schema's tolerance.
	phone: 8004559999,
	scheduled_deactivation_date: null,
	scheduled_invitation_date: null,
	custom_fields: [{ name: 'Region', value: 'EMEA' }],
};

export const USER_PAGE = { data: [USER], page: { next: null } };

export const BUSINESS = {
	id: '9abffcf0-dd7d-42f0-b806-ce0502ab6496',
	business_name_legal: 'Northwind Labs, Inc.',
	business_name_on_card: 'Northwind',
	active: true,
	website: 'https://northwind.example.com',
	phone: '+1 415 555 0100',
	created_time: '2024-01-01T00:00:00+00:00',
	enforce_sso: true,
	is_integrated_with_slack: false,
	is_reimbursements_enabled: true,
	limit_locked: false,
	billing_address: {
		address_line1: '1 Market St',
		address_line2: 'Suite 100',
		city: 'San Francisco',
		state: 'CA',
		postal_code: '94105',
		country: 'US',
	},
};
