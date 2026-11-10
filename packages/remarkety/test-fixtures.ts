/**
 * Response bodies for the tests, from the Swagger 2.0 document at
 * https://api.remarkety.com/api/v1/docs/remarkety-api-v1.json and the live refusal
 * captured from app.remarkety.com.
 */

export const STORE = {
	id: 1,
	name: 'My Store',
	// The store's own sync key, which is a different secret from the plugin token.
	apiKey: 'store-sync-key',
	platform: 'MAGENTO',
	domain: 'https://shop.example.com',
};

export const STORE_STATUS = {
	syncStatus: 'OK',
	lastSyncSuccess: '2026-05-01T10:00:00Z',
	lastSyncAttempt: '2026-05-01T10:05:00Z',
};

export const STORE_STATUS_ERROR = {
	syncStatus: 'ERROR',
	syncLastError: 'Product feed rejected: missing SKU column',
	lastSyncSuccess: '2026-05-01T10:00:00Z',
	lastSyncAttempt: '2026-05-01T11:00:00Z',
};

export const CAMPAIGN = {
	id: 7,
	type: 'abandoned-cart',
	actions: [{ type: 'email', subject: 'Your cart misses you' }],
	mode: 'stop',
	testEmail: 'qa@example.com',
};

export const CAMPAIGN_RUNNING = { ...CAMPAIGN, mode: 'run' };

export const CAMPAIGNS_STATS = [
	{
		campaignId: 7,
		startDate: '2026-04-01',
		sent: 1200,
		numOrders: 34,
		totalOrdersUSD: { amount: 4120.5, currency: 'USD' },
		// The store's own currency, which differs from the USD figure.
		totalOrders: { amount: 3700, currency: 'EUR' },
	},
	{
		campaignId: 8,
		startDate: '2026-04-15',
		sent: 400,
		numOrders: 3,
		totalOrdersUSD: { amount: 210, currency: 'USD' },
		totalOrders: { amount: 210, currency: 'USD' },
	},
];

// A JSON map keyed by campaign type.
export const CAMPAIGN_TYPES = {
	'abandoned-cart': {
		delays: [1, 4, 24],
		required: ['cart'],
	},
	'post-purchase': {
		delays: [7, 30],
		required: ['order'],
	},
};

export const EMAIL_TEMPLATE = {
	type: 'html',
	html: '<html><head><title>Hi</title></head><body>{{shopper.firstName}}</body></html>',
};

export const EMAIL_TEMPLATE_EDITOR = {
	type: 'editor-v1',
	html: '<div>{{shopper.firstName}}</div>',
	masterTemplate: { id: 3, name: 'Base' },
};

export const EMAIL_PREVIEW = {
	type: 'abandoned-cart',
	shopper: { email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe' },
	order: { total: { amount: 120, currency: 'USD' }, status: 'pending' },
	cart: {
		url: 'https://shop.example.com/cart',
		total: { amount: 120, currency: 'USD' },
	},
	recommendations: [{ title: 'A product', sku: 'SKU-1' }],
	coupon: { code: 'SAVE10' },
};

export const MASTER_TEMPLATES = [
	{
		id: 3,
		name: 'Promo base',
		author: 'Remarkety',
		date_uploaded: '2025-01-01',
		public: true,
		tags: ['promo'],
	},
];

export const PRODUCTS = [
	{
		price: { amount: 29.99, currency: 'USD' },
		title: 'Blue T-Shirt',
		sku: 'TS-BLUE-M',
		thumbnailUrl: 'https://cdn.example.com/ts.jpg',
		productPageUrl: 'https://shop.example.com/ts',
		tags: ['apparel'],
	},
];

export const RULES = [
	{
		type: 'delay',
		inputType: 'number',
		displayName: 'Delay',
		operators: ['eq', 'gte'],
		details: 'Days to wait before the action runs.',
		possibleValues: [1, 2, 3],
		defaultValue: [1],
	},
	{
		type: 'segment',
		inputType: 'select',
		displayName: 'Segment',
		operators: ['in'],
	},
];

export const RULE = {
	inputType: 'number',
	displayName: 'Delay',
	operators: ['eq', 'gte'],
	details: 'Days to wait before the action runs.',
	possibleValues: [1, 2, 3],
	defaultValue: [1],
};

export const SEGMENT_COUNT = { count: 4213 };

export const SEGMENT_LIST = [
	{ email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe' },
	{ email: 'john@example.com', firstName: 'John' },
];

// Live: a missing or wrong token. Sent with Accept: application/json, without which
// the same call answers an HTML login page.
export const BAD_TOKEN = {
	message: 'Missing or invalid API Key',
	status: 'ERROR',
	guid: '6af39fd3ea435',
};

// A 400 from the email-template route, which nests individual problems.
export const TEMPLATE_VALIDATION_ERROR = {
	errors: [
		{ msg: 'html must not be empty' },
		{ msg: 'type must be html or editor-v1' },
	],
};

export const NOT_FOUND = {
	message: 'Store not found',
	status: 'ERROR',
	guid: '6af39fd3ea436',
};

export const SERVER_ERROR = {
	message: 'Internal server error',
	status: 'ERROR',
	guid: '6af39fd3ea437',
};
