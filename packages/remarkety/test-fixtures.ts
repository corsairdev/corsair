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

// Live: a healthy store still carries the last runner message in syncLastError.
export const STORE_STATUS = {
	syncStatus: 'OK',
	lastSyncSuccess: null,
	lastSyncAttempt: null,
	syncLastError: 'Campaign runner completed ( success: 0 )',
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

// Live shape (trimmed): each template's details sit under `metadata`.
export const MASTER_TEMPLATES = [
	{
		metadata: {
			id: 22690,
			name: 'Amazing Christmas For Everyone',
			date_uploaded: '2025-11-09 12:56:26',
			days_ago_uploaded: 367,
			public: true,
			tags: [],
			thumbnail: 'https://cdn.example.com/templates/christmas.jpg',
			editor: 'beefree-v1',
			campaignTypes: [1],
		},
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

// Live shape (trimmed): a map keyed by rule type, and possibleValues is an empty
// string for a free-text rule and a value-to-label map for a select.
export const RULES = {
	CART_FOLLOWUP_TIME: {
		inputType: 'interval-hours',
		displayName: 'Number of hours since last modification of cart',
		operators: ['is'],
		details: 'Number of hours since last modification of cart',
		defaultValue: [],
		possibleValues: '',
	},
	CAMPAIGN_ACTION: {
		inputType: 'select-single',
		displayName: 'CAMPAIGN_ACTION',
		operators: ['is', 'is not'],
		details: 'CAMPAIGN_ACTION_CONDITION_DESCRIPTION',
		defaultValue: [],
		possibleValues: { '1': 'Opened', '2': 'Clicked', '3': 'Purchase' },
	},
};

export const RULE = RULES.CART_FOLLOWUP_TIME;

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
