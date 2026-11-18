// Fixtures built from the response shapes in Tapfiliate's OpenAPI spec
// (https://developers.tapfiliate.com/api-reference/openapi.json), not from the
// prose examples. Listing routes answer a bare array and the next page number
// is in the `Link` header, so no fixture carries paging fields.

export const affiliate = {
	id: 'jane-jameson',
	firstname: 'Jane',
	lastname: 'Jameson',
	email: 'jane@example-blog.inc',
	company: { name: 'Acme', description: 'Widgets' },
	address: {
		address: '1 Market St',
		address_two: null,
		postal_code: '94105',
		city: 'San Francisco',
		state: 'CA',
		country: { code: 'US', name: 'United States' },
	},
	meta_data: { foo: 'bar' },
	parent_id: null,
	affiliate_group_id: null,
	created_at: '2024-01-02T03:04:05+00:00',
	promoted_at: null,
	promotion_method: null,
	custom_fields: { field1: 'value1' },
	fraud: false,
};

export const affiliates = [affiliate];

export const createdAffiliate = {
	...affiliate,
	id: 'jane-jameson-2',
	// Present only when Tapfiliate generated the password.
	password: 'generated-password-1234',
};

export const program = {
	id: '1',
	currency: 'USD',
	title: 'Default program',
	cookie_time: 45,
	default_landing_page_url: 'https://example.com/landing',
	recurring: false,
	status: 'active',
};

export const programs = [program];

export const referralLink = {
	asset_id: '1-aaaaaa',
	link: 'https://example.com/?ref=janejameson',
	source_id: null,
};

export const programAffiliate = {
	...affiliate,
	coupon: 'JANE10OFF',
	approved: true,
	applied_at: '2024-02-01T00:00:00+00:00',
	referral_link: referralLink,
};

export const programAffiliates = [programAffiliate];

export const commission = {
	id: 1234,
	conversion_sub_amount: 30.55,
	amount: 3.05,
	commission_type: 'default',
	approved: false,
	affiliate: { id: 'jane-jameson', firstname: 'Jane', lastname: 'Jameson' },
	conversion: { id: 4321 },
	kind: 'regular',
	currency: 'USD',
	created_at: '2024-03-01T10:00:00+00:00',
	payout: false,
	comment: null,
	final: null,
	finalization_date: null,
	commission_name: 'Default commission',
};

export const commissions = [commission];

export const conversion = {
	id: 4321,
	external_id: 'order-100',
	amount: 30.55,
	click: {
		created_at: '2024-03-01T09:59:00+00:00',
		referrer: 'https://example.com',
		landing_page: 'https://example.com/pricing',
	},
	commissions: [commission],
	program: { id: '1', title: 'Default program', currency: 'USD' },
	affiliate: { id: 'jane-jameson', firstname: 'Jane', lastname: 'Jameson' },
	customer: { id: 'cu_123', customer_id: 'cust-1', status: 'paying' },
	affiliate_meta_data: { subid1: 'x' },
	meta_data: { foo: 'bar' },
	created_at: '2024-03-01T10:00:00+00:00',
};

export const conversions = [conversion];

export const customer = {
	id: 'cu_123',
	customer_id: 'cust-1',
	status: 'paying',
	created_at: '2024-03-01T10:00:00+00:00',
	click: {
		created_at: '2024-03-01T09:59:00+00:00',
		referrer: null,
		landing_page: null,
	},
	program: { id: '1', title: 'Default program', currency: 'USD' },
	affiliate: { id: 'jane-jameson', firstname: 'Jane', lastname: 'Jameson' },
	affiliate_meta_data: { subid1: 'x' },
	meta_data: { foo: 'bar' },
	warnings: null,
};

export const customers = [customer];

export const payment = {
	id: 'pa_abc123',
	created_at: '2024-04-01T00:00:00+00:00',
	affiliate: { id: 'jane-jameson', firstname: 'Jane', lastname: 'Jameson' },
	amount: 30.55,
	currency: 'USD',
};

export const payments = [payment];

export const balances = [
	{ affiliate_id: 'jane-jameson', balances: { USD: 123.45, EUR: 10.0 } },
];

export const affiliateBalances = { USD: 123.45, EUR: 10.0 };

export const affiliation = {
	applied_at: '2024-02-01T00:00:00+00:00',
	approved: true,
	coupon: 'JANE10OFF',
	id: '1',
	referral_link: referralLink,
};

export const affiliations = [affiliation];

export const customFields = [{ id: 'field1', title: 'Website', choices: [] }];

export const click = {
	id: '1-abc',
	created_at: '2024-03-01T09:59:00+00:00',
	meta_data: [{ key: 'utm_source', value: 'newsletter' }],
	details: { os: 'macOS', browser: 'Firefox', country: 'US' },
};

export const clicks = [click];

export const createdClick = { id: '1-abc' };

export const clickDetail = {
	...click,
	affiliate: { id: 'jane-jameson', firstname: 'Jane', lastname: 'Jameson' },
	program: { id: '1', title: 'Default program', currency: 'USD' },
	asset_id: '1-aaaaaa',
	source_id: null,
};

// A refused key from the gateway: no traceId in this envelope.
export const authErrorResponse = {
	message: 'Authentication Failed.',
	code: 401,
};

// A rejected request: the same shape plus a traceId.
export const requestErrorResponse = {
	message: 'Not Found',
	code: 404,
	traceId: '644cc5313427450d4fa9fd7e1e63921df7edc96abc31e32ada4b56a66758',
};

// A validation or business error: one entry per rejected field.
export const validationErrorResponse = {
	errors: [
		{
			message: 'This coupon is already in use.',
			property_path: 'coupon',
		},
	],
};

// A 409 about a Tapfiliate Pay commission, which carries a machine code.
export const commissionConflictResponse = {
	errors: [
		{
			message: "This commission can't be disapproved.",
			code: 'commission_approved',
		},
	],
};
