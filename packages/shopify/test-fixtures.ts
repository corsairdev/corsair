/**
 * Fixtures built from the response shapes documented for 2026-10, with the
 * field names read from the live reference rather than the prose examples.
 * Two examples on Shopify's own pages are wrong for this version: Customer has
 * no `email`, and Order has `totalPriceSet`, not `totalPrice`.
 */

export const pageInfo = {
	hasNextPage: false,
	hasPreviousPage: false,
	startCursor: 'cursor-start',
	endCursor: 'cursor-end',
};

export const money = { amount: '10.00', currencyCode: 'USD' };

export const product = {
	id: 'gid://shopify/Product/1',
	title: 'Hiking backpack',
	handle: 'hiking-backpack',
	status: 'ACTIVE',
	vendor: 'Acme',
	productType: 'Bags',
	tags: ['outdoor'],
	createdAt: '2026-01-01T00:00:00Z',
	updatedAt: '2026-01-02T00:00:00Z',
	publishedAt: '2026-01-01T12:00:00Z',
	descriptionHtml: '<p>A pack</p>',
	totalInventory: 12,
	onlineStoreUrl: 'https://shop.example.com/products/hiking-backpack',
	variants: {
		edges: [
			{
				node: {
					id: 'gid://shopify/ProductVariant/11',
					title: 'Default',
					sku: 'PACK-1',
					price: '99.00',
					compareAtPrice: null,
					inventoryQuantity: 12,
				},
				cursor: 'v1',
			},
		],
		pageInfo,
	},
};

export const productPage = {
	products: {
		edges: [{ node: product, cursor: 'p1' }],
		pageInfo,
	},
};

export const collection = {
	id: 'gid://shopify/Collection/5',
	title: 'Outdoor',
	handle: 'outdoor',
	descriptionHtml: '',
	updatedAt: '2026-01-02T00:00:00Z',
	sortOrder: 'BEST_SELLING',
	productsCount: { count: 3 },
};

export const order = {
	id: 'gid://shopify/Order/1001',
	name: '#1001',
	createdAt: '2026-01-01T00:00:00Z',
	updatedAt: '2026-01-01T00:00:00Z',
	processedAt: '2026-01-01T00:00:00Z',
	cancelledAt: null,
	closedAt: null,
	email: 'buyer@example.com',
	phone: null,
	note: null,
	tags: [],
	currencyCode: 'USD',
	displayFinancialStatus: 'PAID',
	displayFulfillmentStatus: 'UNFULFILLED',
	cancelReason: null,
	totalPriceSet: { shopMoney: money, presentmentMoney: money },
	totalTaxSet: { shopMoney: money },
	subtotalPriceSet: { shopMoney: money },
	totalDiscountsSet: { shopMoney: money },
	customer: {
		id: 'gid://shopify/Customer/7',
		displayName: 'Jenny Test',
		defaultEmailAddress: { emailAddress: 'jenny@example.com' },
	},
	lineItems: {
		edges: [
			{
				node: {
					id: 'gid://shopify/LineItem/1',
					title: 'Hiking backpack',
					quantity: 1,
					sku: 'PACK-1',
					variant: { id: 'gid://shopify/ProductVariant/11' },
					originalUnitPriceSet: { shopMoney: money },
				},
				cursor: 'l1',
			},
		],
		pageInfo,
	},
};

export const customer = {
	id: 'gid://shopify/Customer/7',
	displayName: 'Jenny Test',
	firstName: 'Jenny',
	lastName: 'Test',
	state: 'ENABLED',
	note: null,
	tags: ['vip'],
	createdAt: '2026-01-01T00:00:00Z',
	updatedAt: '2026-01-01T00:00:00Z',
	numberOfOrders: '2',
	taxExempt: false,
	verifiedEmail: true,
	defaultEmailAddress: {
		emailAddress: 'jenny@example.com',
		marketingState: 'NOT_SUBSCRIBED',
	},
	defaultPhoneNumber: null,
	amountSpent: money,
};

export const location = {
	id: 'gid://shopify/Location/9',
	name: 'Warehouse',
	isActive: true,
	address1: '1 Main St',
	city: 'Ottawa',
	province: 'Ontario',
	countryCode: 'CA',
};

export const inventoryItem = {
	id: 'gid://shopify/InventoryItem/3',
	sku: 'PACK-1',
	tracked: true,
	inventoryLevels: {
		edges: [
			{
				node: {
					id: 'gid://shopify/InventoryLevel/4',
					isActive: true,
					updatedAt: '2026-01-01T00:00:00Z',
					item: { id: 'gid://shopify/InventoryItem/3', sku: 'PACK-1' },
					location: { id: 'gid://shopify/Location/9', name: 'Warehouse' },
					quantities: [{ name: 'available', quantity: 4 }],
				},
				cursor: 'il1',
			},
		],
		pageInfo,
	},
};

export const webhookSubscription = {
	id: 'gid://shopify/WebhookSubscription/2',
	topic: 'ORDERS_CREATE',
	uri: 'https://example.com/webhook',
	format: 'JSON',
	createdAt: '2026-01-01T00:00:00Z',
	updatedAt: '2026-01-01T00:00:00Z',
};

export const shop = {
	id: 'gid://shopify/Shop/1',
	name: 'Corsair Test',
	myshopifyDomain: 'corsair-test.myshopify.com',
	currencyCode: 'USD',
	ianaTimezone: 'UTC',
	email: 'owner@example.com',
	description: null,
	plan: { displayName: 'Basic' },
};

/** An order payload as Shopify sends it to a webhook, not through GraphQL. */
export const orderWebhookPayload = {
	id: 1001,
	admin_graphql_api_id: 'gid://shopify/Order/1001',
	name: '#1001',
	email: 'buyer@example.com',
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
	currency: 'USD',
	financial_status: 'paid',
	fulfillment_status: null,
	current_total_price: '10.00',
	order_number: 1001,
	line_items: [{ id: 1, title: 'Hiking backpack', quantity: 1, sku: 'PACK-1' }],
	customer: {
		id: 7,
		email: 'jenny@example.com',
		first_name: 'Jenny',
		last_name: 'Test',
	},
};

/** The body Shopify returns when the token is wrong. `errors` is a string. */
export const authFailureBody = {
	errors:
		'[API] Invalid API key or access token (unrecognized login or wrong password)',
};

/** A THROTTLED failure: HTTP 200, with the code in the body. */
export const throttledBody = {
	errors: [
		{
			message: 'Throttled',
			extensions: { code: 'THROTTLED' },
		},
	],
	extensions: {
		cost: {
			requestedQueryCost: 100,
			actualQueryCost: null,
			throttleStatus: {
				maximumAvailable: 1000,
				currentlyAvailable: 50,
				restoreRate: 50,
			},
		},
	},
};

/** A rejected mutation: HTTP 200, data present, userErrors populated. */
export const userErrorProductCreate = {
	data: {
		productCreate: {
			product: null,
			userErrors: [{ field: ['title'], message: 'Title is invalid' }],
		},
	},
};
