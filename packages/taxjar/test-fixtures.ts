// Fixtures built from the response examples in TaxJar's API reference
// (https://developers.taxjar.com/api/reference/). The shapes that matter:
// amounts on transactions and rates are decimal strings, the `taxes` answer
// sends numbers, and the list routes return bare ID arrays under an envelope.

export const categories = {
	categories: [
		{
			name: 'Installation Services',
			product_tax_code: '10040',
			description:
				'Installation services separately stated from sales of tangible personal property.',
		},
		{
			name: 'General Services',
			product_tax_code: '19000',
			description:
				'Miscellaneous services which are not subject to a tax levy.',
		},
	],
};

export const rates = {
	rate: {
		zip: '90404',
		state: 'CA',
		// Rates are strings.
		state_rate: '0.0625',
		county: 'LOS ANGELES',
		county_rate: '0.01',
		city: 'SANTA MONICA',
		city_rate: '0.0',
		combined_district_rate: '0.025',
		combined_rate: '0.0975',
		freight_taxable: false,
	},
};

export const ratesInternational = {
	rate: {
		zip: '05495-2086',
		country: 'US',
		country_rate: '0.0',
		state: 'VT',
		state_rate: '0.06',
		county: 'CHITTENDEN',
		county_rate: '0.0',
		city: 'WILLISTON',
		city_rate: '0.0',
		combined_district_rate: '0.01',
		combined_rate: '0.07',
		freight_taxable: true,
	},
};

export const nexusRegions = {
	regions: [
		{
			country_code: 'US',
			country: 'United States',
			region_code: 'CA',
			region: 'California',
		},
		{
			country_code: 'US',
			country: 'United States',
			region_code: 'NY',
			region: 'New York',
		},
	],
};

export const summaryRates = {
	summary_rates: [
		{
			country_code: 'US',
			country: 'United States',
			region_code: 'CA',
			region: 'California',
			minimum_rate: { label: 'State Tax', rate: 0.065 },
			average_rate: { label: 'Tax', rate: 0.0827 },
		},
	],
};

export const validatedAddresses = {
	addresses: [
		{
			zip: '85297-2176',
			street: '3301 S Greenfield Rd',
			state: 'AZ',
			country: 'US',
			city: 'Gilbert',
		},
	],
};

// The taxes answer sends numbers, unlike the transaction routes.
export const taxCalculation = {
	tax: {
		order_total_amount: 16.5,
		shipping: 1.5,
		taxable_amount: 15,
		amount_to_collect: 1.35,
		rate: 0.09,
		has_nexus: true,
		freight_taxable: false,
		tax_source: 'destination',
		jurisdictions: {
			country: 'US',
			state: 'CA',
			county: 'LOS ANGELES',
			city: 'LOS ANGELES',
		},
		breakdown: {
			taxable_amount: 15,
			tax_collectable: 1.35,
			combined_tax_rate: 0.09,
			state_taxable_amount: 15,
			state_tax_rate: 0.0625,
			state_tax_collectable: 0.94,
			county_taxable_amount: 15,
			county_tax_rate: 0.0025,
			county_tax_collectable: 0.04,
			city_taxable_amount: 0,
			city_tax_rate: 0,
			city_tax_collectable: 0,
			special_district_taxable_amount: 15,
			special_tax_rate: 0.025,
			special_district_tax_collectable: 0.38,
			line_items: [
				{
					id: '1',
					taxable_amount: 15,
					tax_collectable: 1.35,
					combined_tax_rate: 0.09,
				},
			],
		},
	},
};

export const orderIds = { orders: ['123', '456'] };

export const order = {
	order: {
		transaction_id: '123',
		user_id: 10649,
		transaction_date: '2015-05-14T00:00:00Z',
		provider: 'api',
		to_country: 'US',
		to_zip: '90002',
		to_state: 'CA',
		to_city: 'LOS ANGELES',
		to_street: '123 Palm Grove Ln',
		// Amounts are strings on transactions.
		amount: '16.5',
		shipping: '1.5',
		sales_tax: '0.95',
		line_items: [
			{
				id: '1',
				quantity: 1,
				product_identifier: '12-34243-9',
				description: 'Fuzzy Widget',
				unit_price: '15.0',
				discount: '0.0',
				sales_tax: '0.95',
			},
		],
	},
};

export const refundIds = { refunds: ['r1', 'r2'] };

export const refund = {
	refund: {
		transaction_id: 'r1',
		transaction_reference_id: '123',
		user_id: 10649,
		transaction_date: '2015-05-15T00:00:00Z',
		provider: 'api',
		to_country: 'US',
		to_zip: '90002',
		amount: '16.5',
		shipping: '1.5',
		sales_tax: '0.95',
		line_items: [
			{
				id: '1',
				quantity: 1,
				product_identifier: '12-34243-9',
				unit_price: '15.0',
				sales_tax: '0.95',
			},
		],
	},
};

export const customerIds = { customers: ['123', '124', '125'] };

export const customer = {
	customer: {
		customer_id: '123',
		exemption_type: 'wholesale',
		exempt_regions: [
			{ country: 'US', state: 'FL' },
			{ country: 'US', state: 'PA' },
		],
		name: 'Dunder Mifflin Paper Company',
		country: 'US',
		state: 'PA',
		zip: '18504',
		city: 'Scranton',
		street: '1725 Slough Avenue',
	},
};

export const unauthorizedResponse = {
	detail: "Not authorized for route 'GET /v2/categories'",
	status: 401,
	error: 'Unauthorized',
};

export const notFoundResponse = {
	detail: "No such route 'GET /v2/nope'",
	status: 404,
	error: 'Not Found',
};

// A validation failure names the offending field.
export const unprocessableResponse = {
	detail: 'to_zip is not a valid postal code',
	status: 422,
	error: 'Unprocessable Entity',
};

/** DELETE answers from the sandbox (11-16): the removed record, fields nulled. */
export const orderDeleted = {
	order: {
		to_zip: null,
		line_items: [],
		shipping: null,
		user_id: 335723,
		sales_tax: null,
		provider: 'api',
		transaction_id: '123',
		amount: null,
	},
};

export const refundDeleted = {
	refund: {
		to_zip: null,
		line_items: [],
		shipping: null,
		user_id: 335723,
		sales_tax: null,
		provider: 'api',
		transaction_id: 'r1',
		amount: null,
	},
};

export const customerDeleted = {
	customer: {
		customer_id: '123',
		name: 'Dunder Mifflin Paper Company',
		exemption_type: 'wholesale',
	},
};
