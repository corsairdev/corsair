// Responses in this file are copied from live Lemon Squeezy answers on
// 2026-11-10 against a test-mode store (520119), not from the docs' examples.
// The docs omit `meta.page` on single resources and show `users` fields in
// snake_case, while the live answer sends `createdAt` and `updatedAt`.

export const store = {
	type: 'stores',
	id: '520119',
	attributes: {
		name: 'test',
		slug: 'testingapi',
		domain: 'testingapi.lemonsqueezy.com',
		url: 'https://testingapi.lemonsqueezy.com',
		avatar_url:
			'https://eu.ui-avatars.com/api/?name=test&length=1&background=35389D&color=fff&size=64&rounded=true',
		plan: 'free',
		country: 'IN',
		country_nicename: 'India',
		currency: 'INR',
		total_sales: 0,
		total_revenue: 0,
		thirty_day_sales: 0,
		thirty_day_revenue: 0,
		created_at: '2026-11-10T11:25:25.000000Z',
		updated_at: '2026-11-10T11:25:25.000000Z',
	},
	relationships: {
		products: {
			links: {
				related: 'https://api.lemonsqueezy.com/v1/stores/520119/products',
				self: 'https://api.lemonsqueezy.com/v1/stores/520119/relationships/products',
			},
		},
	},
	links: { self: 'https://api.lemonsqueezy.com/v1/stores/520119' },
};

export const pageMeta = {
	page: { currentPage: 1, from: 1, lastPage: 1, perPage: 10, to: 1, total: 1 },
};

export const storeList = {
	meta: pageMeta,
	jsonapi: { version: '1.0' },
	links: {
		first:
			'https://api.lemonsqueezy.com/v1/stores?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name',
		last: 'https://api.lemonsqueezy.com/v1/stores?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name',
	},
	data: [store],
};

export const storeDetail = {
	jsonapi: { version: '1.0' },
	links: { self: 'https://api.lemonsqueezy.com/v1/stores/520119' },
	data: store,
};

/** `GET /v1/users/me`; note the camelCase timestamps. */
export const user = {
	meta: { test_mode: true },
	jsonapi: { version: '1.0' },
	links: { self: 'https://api.lemonsqueezy.com/v1/users/8345513' },
	data: {
		type: 'users',
		id: '8345513',
		attributes: {
			name: 'corsair test',
			email: 'corsairtest00@gmail.com',
			color: '#F75FDE',
			avatar_url:
				'https://www.gravatar.com/avatar/2670472243174480bc47f0f572b762b1?d=blank',
			has_custom_avatar: false,
			createdAt: '2026-11-10T11:23:40.000000Z',
			updatedAt: '2026-11-10T11:23:40.000000Z',
		},
		links: { self: 'https://api.lemonsqueezy.com/v1/users/8345513' },
	},
};

/** `POST /v1/customers` answered 201. */
export const customer = {
	jsonapi: { version: '1.0' },
	links: { self: 'https://api.lemonsqueezy.com/v1/customers/10361540' },
	data: {
		type: 'customers',
		id: '10361540',
		attributes: {
			store_id: 520119,
			name: 'Corsair Probe',
			email: 'probe@example.com',
			status: 'subscribed',
			city: null,
			region: null,
			country: null,
			total_revenue_currency: 0,
			mrr: 0,
			status_formatted: 'Subscribed',
			country_formatted: null,
			total_revenue_currency_formatted: '₹0.00',
			mrr_formatted: '₹0.00',
			urls: { customer_portal: null },
			created_at: '2026-11-10T11:30:26.000000Z',
			updated_at: '2026-11-10T11:30:26.000000Z',
			test_mode: true,
		},
		relationships: {
			store: {
				links: {
					related: 'https://api.lemonsqueezy.com/v1/customers/10361540/store',
					self: 'https://api.lemonsqueezy.com/v1/customers/10361540/relationships/store',
				},
			},
		},
	},
};

/** `POST /v1/discounts` answered 201. */
export const discount = {
	jsonapi: { version: '1.0' },
	links: { self: 'https://api.lemonsqueezy.com/v1/discounts/1248442' },
	data: {
		type: 'discounts',
		id: '1248442',
		attributes: {
			store_id: 520119,
			name: 'Probe',
			code: 'PROBE10',
			amount: 10,
			amount_type: 'percent',
			is_limited_to_products: false,
			is_limited_redemptions: false,
			max_redemptions: 0,
			starts_at: null,
			expires_at: null,
			duration: 'once',
			duration_in_months: 1,
			status: 'published',
			status_formatted: 'Published',
			created_at: '2026-11-10T11:30:36.000000Z',
			updated_at: '2026-11-10T11:30:36.000000Z',
			test_mode: true,
		},
		relationships: {
			store: {
				links: {
					related: 'https://api.lemonsqueezy.com/v1/discounts/1248442/store',
				},
			},
		},
	},
};

/** `POST /v1/webhooks` answered 201; the secret is never echoed back. */
export const webhook = {
	jsonapi: { version: '1.0' },
	links: { self: 'https://api.lemonsqueezy.com/v1/webhooks/150379' },
	data: {
		type: 'webhooks',
		id: '150379',
		attributes: {
			store_id: 520119,
			url: 'https://example.com/ls-probe',
			events: ['order_created'],
			last_sent_at: null,
			created_at: '2026-11-10T11:30:39.000000Z',
			updated_at: '2026-11-10T11:30:39.000000Z',
			test_mode: true,
		},
		relationships: {
			store: {
				links: {
					related: 'https://api.lemonsqueezy.com/v1/webhooks/150379/store',
				},
			},
		},
	},
};

/** `GET /v1/customers` on this store: one row, with the page block. */
export const customerList = {
	meta: pageMeta,
	jsonapi: { version: '1.0' },
	links: {
		first:
			'https://api.lemonsqueezy.com/v1/customers?page%5Bnumber%5D=1&page%5Bsize%5D=2&sort=-createdAt',
		last: 'https://api.lemonsqueezy.com/v1/customers?page%5Bnumber%5D=1&page%5Bsize%5D=2&sort=-createdAt',
	},
	data: [customer.data],
};

/** An empty list, which is what every collection holds on a fresh store. */
export const emptyList = {
	meta: {
		page: {
			currentPage: 1,
			from: null,
			lastPage: 1,
			perPage: 10,
			to: null,
			total: 0,
		},
	},
	jsonapi: { version: '1.0' },
	data: [],
};

/** The validation error a page size over the cap answers. */
export const invalidPageSize = {
	jsonapi: { version: '1.0' },
	errors: [
		{
			detail: 'The page.size field must be between 1 and 100.',
			source: { parameter: 'page.size' },
			status: '400',
			title: 'Invalid Query Parameter',
		},
	],
};

/** The 422 a webhook create answers without a secret. */
export const webhookMissingSecret = {
	jsonapi: { version: '1.0' },
	errors: [
		{
			detail: 'The secret field is required.',
			source: { pointer: '/data/attributes/secret' },
			status: '422',
			title: 'Unprocessable Entity',
		},
	],
};

/** A 404 for an id that does not exist: no `detail`, only the status. */
export const bareNotFound = {
	jsonapi: { version: '1.0' },
	errors: [{ status: '404', title: 'Not Found' }],
};

/** A route that does not exist names the route in `detail`. */
export const unknownRoute = {
	jsonapi: { version: '1.0' },
	errors: [
		{
			detail: 'The route v1/nope could not be found.',
			status: '404',
			title: 'Not Found',
		},
	],
};

/** A 401 for a missing or revoked key. */
export const unauthorized = {
	jsonapi: { version: '1.0' },
	errors: [
		{ detail: 'Unauthenticated.', status: '401', title: 'Unauthorized' },
	],
};

/** A 405 for a write the resource does not accept, as products answers. */
export const methodNotAllowed = {
	jsonapi: { version: '1.0' },
	errors: [
		{
			detail:
				'The POST method is not supported for route v1/products. Supported methods: GET, HEAD.',
			status: '405',
			title: 'Method Not Allowed',
		},
	],
};
