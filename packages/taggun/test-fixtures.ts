// Fixtures are the canonical responses from developers.taggun.io: the simple
// and verbose examples for the Chipotle receipt that Taggun publishes, and the
// pass/fail campaign-validation examples. Coordinate arrays are emptied in the
// published examples for readability; one is filled in here from the spec's own
// example, so the nested shape is actually exercised.
//
// `regions` is an array of shapes, each shape an array of `{x, y}` points.

/** The region the Taggun spec publishes for `totalAmount`. */
export const TOTAL_AMOUNT_REGIONS = [
	[
		{ x: 437, y: 787 },
		{ x: 499, y: 788 },
		{ x: 499, y: 808 },
		{ x: 437, y: 807 },
	],
];

export const SIMPLE_RECEIPT = {
	totalAmount: {
		data: 14.42,
		confidenceLevel: 0.9199999999999999,
		regions: TOTAL_AMOUNT_REGIONS,
	},
	taxAmount: { data: 0.82, confidenceLevel: 0.9199999999999999 },
	confidenceLevel: 0.898,
	date: {
		data: '2024-09-25T12:00:00.000Z',
		confidenceLevel: 0.9199999999999999,
	},
	merchantName: { data: 'CHIPOTLE MEXICAN GRILL', confidenceLevel: 0.81 },
	merchantAddress: {
		data: '702 E Boise Ave, Boise, Idaho, 83706',
		confidenceLevel: 0.99,
	},
	merchantCity: { data: 'Boise', confidenceLevel: 0.99 },
	merchantState: { data: 'Ada County, Idaho', confidenceLevel: 0.99 },
	merchantCountryCode: { data: 'US', confidenceLevel: 0.99 },
	merchantPostalCode: { data: '83706', confidenceLevel: 0.99 },
	// The published example returns this field with only a confidenceLevel.
	merchantTypes: { confidenceLevel: 0 },
};

export const VERBOSE_RECEIPT = {
	totalAmount: {
		data: 14.42,
		confidenceLevel: 0.9199999999999999,
		text: 'CP Card 14.42',
		index: 20,
		keyword: '-',
		currencyCode: 'USD',
		regions: TOTAL_AMOUNT_REGIONS,
	},
	taxAmount: {
		data: 0.82,
		confidenceLevel: 0.9199999999999999,
		text: 'Tax 0.82',
		index: 18,
		keyword: '-',
		currencyCode: 'USD',
		regions: [],
	},
	discountAmount: { confidenceLevel: 0 },
	paidAmount: {
		data: 14.42,
		confidenceLevel: 0.9199999999999999,
		text: 'CP Card 14.42',
		index: 20,
		regions: [],
	},
	confidenceLevel: 0.898,
	date: {
		data: '2024-09-25T12:00:00.000Z',
		confidenceLevel: 0.9199999999999999,
		text: 'Host: Cicily 09/25/2024',
		index: 6,
		regions: [],
	},
	dueDate: { confidenceLevel: 0 },
	text: {
		text: 'CHIPOTLE\nMEVIC GRILL\nSubtotal 13.60\nTax 0.82',
		regions: [],
	},
	amounts: [{ data: 9.1, index: 9, regions: [], text: 'Chicken Bowl 9.10' }],
	numbers: [
		{ data: 702, text: '702 E Boise Avenue', regions: [], index: 3 },
		{
			data: 409,
			text: 'ORDER #409 10310',
			regions: [],
			index: 8,
			classifyResult: 'primaryTotal',
		},
	],
	entities: {
		productLineItems: [
			{
				data: {
					quantity: { data: 1, regions: [], text: '1' },
					unitPrice: { data: 9.1, regions: [], text: '9.10' },
					totalPrice: { data: 9.1, regions: [], text: '9.10' },
					name: { data: 'Chicken Bowl', regions: [], text: 'Chicken Bowl' },
				},
				confidenceLevel: 0.65,
				text: 'Chicken Bowl 9.10',
				index: 9,
				regions: [],
			},
			{
				data: {
					quantity: { data: 1, regions: [], text: '1' },
					unitPrice: { data: 2.65, regions: [], text: '2.65' },
					totalPrice: { data: 2.65, regions: [], text: '2.65' },
					name: { data: 'Chips', regions: [], text: 'Chips 2.65' },
				},
				confidenceLevel: 0.65,
				text: 'Chips 2.65',
				index: 11,
				regions: [],
			},
		],
		invoiceNumber: { confidenceLevel: 0 },
		receiptNumber: {
			data: '10310',
			confidenceLevel: 0.9199999999999999,
			text: 'ORDER #409 10310',
			keyword: '-',
			index: 8,
			regions: [],
		},
		last4: { confidenceLevel: 0 },
	},
	lineAmounts: [],
	itemsCount: { data: 3, confidenceLevel: 0.8 },
	paymentType: { confidenceLevel: 0 },
	trackingId: 'T-20241008-6053437',
	merchantName: {
		data: 'CHIPOTLE',
		confidenceLevel: 0.8100000000000002,
		text: 'CHIPOTLE',
		index: 0,
		regions: [],
	},
	merchantAddress: {
		data: '702 E Boise Ave, Boise, Idaho, 83706',
		confidenceLevel: 0.99,
		text: '702 E Boise Avenue\nBoise, ID 83706',
		index: 4,
		regions: [],
	},
	merchantCity: { data: 'Boise', confidenceLevel: 0.99, index: 4, regions: [] },
	merchantState: {
		data: 'Ada County, Idaho',
		confidenceLevel: 0.99,
		index: 4,
		regions: [],
	},
	merchantCountryCode: {
		data: 'US',
		confidenceLevel: 0.99,
		index: 4,
		regions: [],
	},
	merchantPostalCode: {
		data: '83706',
		confidenceLevel: 0.99,
		index: 4,
		regions: [],
	},
	targetRotation: 0,
	elapsed: 4538.480549000204,
};

/** A receipt Taggun could not read: every field is absent, only the id is set. */
export const UNREADABLE_RECEIPT = { trackingId: 'T-20241008-0000000' };

export const CAMPAIGN_VALIDATION_PASSED = {
	successful: true,
	failedValidations: [],
	passedValidations: [
		'merchant_name_validated',
		'date_validated',
		'product_line_items_validated',
		'fraud_detection_unique_receipt_validated',
		'is_credit_card',
	],
	productLineItems: [
		{ name: 'COCA COLA 12PK', unitPrice: 6.99, totalPrice: 13.98, quantity: 2 },
		{ name: 'DORITOS NACHO', unitPrice: 4.99, totalPrice: 4.99, quantity: 1 },
	],
	matchedProductLineItems: [
		{ name: 'COCA COLA 12PK', unitPrice: 6.99, totalPrice: 13.98, quantity: 2 },
	],
	date: '2024-10-15T14:22:31.000Z',
	merchantName: 'Walmart',
	productCodes: [],
	// The documented example sends null for these, not an omitted property.
	balanceAmount: null,
	smartValidate: { is_credit_card: true },
	totalAmount: 23.97,
	receiptNumber: '0021556789',
	invoiceNumber: null,
	trackingId: 'T-20241015-8834567',
	targetRotation: 0,
	similarReceipts: [],
	tamperDetection: { isTampered: false },
};

export const CAMPAIGN_VALIDATION_FAILED = {
	successful: false,
	failedValidations: [
		'merchant_name_validated',
		'product_line_items_validated',
		'fraud_detection_unique_receipt_validated',
		'is_credit_card',
	],
	passedValidations: ['date_validated'],
	productLineItems: [
		{ name: 'PEPSI 12PK', unitPrice: 6.99, totalPrice: 13.98, quantity: 2 },
	],
	matchedProductLineItems: [],
	date: '2024-10-15T14:22:31.000Z',
	merchantName: 'Kroger',
	productCodes: [],
	balanceAmount: null,
	smartValidate: { is_credit_card: false },
	totalAmount: 23.97,
	receiptNumber: '0021556789',
	invoiceNumber: null,
	trackingId: 'T-20241015-8834567',
	targetRotation: 0,
	similarReceipts: [
		{
			referenceId: null,
			userId: null,
			trackingId: 'T-20250121-6165563',
			similarityScore: 0.93,
		},
	],
	tamperDetection: { isTampered: false },
};

export const CAMPAIGN_SETTINGS = {
	date: { start: '2026-06-01T00:00:00.000Z', end: '2026-06-30T23:59:59.999Z' },
	merchantNames: { allowList: ['Fresh Market'] },
	productCodes: { list: ['COF-250', 'COF-500'] },
	productLineItems: {
		names: ['Coffee Beans'],
		quantity: { min: 1, max: 5 },
		totalPrice: { min: 5, max: 80 },
	},
	balanceOwing: { max: 0.01 },
	fraudDetection: { allowSimilarityCheck: true },
	smartValidate: {
		prompts: [
			{
				question: 'Does this receipt show payment by credit card?',
				example: { is_credit_card: true },
				skip: false,
			},
		],
	},
};

export const CAMPAIGN_IDS = ['coffee-june-2026', 'summer-promo-2026'];

export const CREATE_ACK = {
	result: 'Successfully created campaign settings',
	statusCode: 201,
};

export const UPDATE_ACK = {
	result:
		'Successfully updated campaign settings for campaign - coffee-june-2026',
	statusCode: 200,
};

export const DELETE_ACK = {
	result:
		'Successfully remove campaign settings for campaign - coffee-june-2026',
	statusCode: 200,
};

export const NOT_FOUND_ACK = {
	result: 'Campaign ID not found - coffee-june-2026',
	statusCode: 404,
};

/** Boom's envelope, used by every application-level 400. */
export const BOOM_BAD_REQUEST = {
	statusCode: 400,
	error: 'Bad Request',
	message: 'Invalid request payload input',
};

export const FEATURE_UNAVAILABLE = {
	statusCode: 400,
	error: 'Bad Request',
	message: 'Please contact Taggun for the feature Campaign Validation',
};

export const MISSING_KEY = { message: 'No API key found in request' };

export const INVALID_KEY = { message: 'Invalid authentication credentials' };

export const RATE_LIMITED = { message: 'API rate limit exceeded' };

export const UPSTREAM_ERROR = {
	message: 'An invalid response was received from the upstream server',
};

/** The 1x1 PNG a test uploads when it needs a real Blob. */
export const PNG_BYTES = Buffer.from(
	'89504e470d0a1a0a0000000d494844520000000100000001080600000' +
		'01f15c4890000000a49444154789c6360000002000154a24f5f0000000049454e44ae426082',
	'hex',
);

export const PNG_BASE64 = PNG_BYTES.toString('base64');
