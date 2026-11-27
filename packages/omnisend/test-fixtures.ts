// Fixtures built from the documented examples in the official reference pages
// (api-docs.omnisend.com). No live key was available while building, so no
// response here has been seen on the wire; api.test.ts parses real answers
// through the same schemas when a key exists.

export const contact = {
	id: '60a6170920d91c215e949b5c',
	email: 'example@example.com',
	phone: ['+1234567890'],
	status: 'subscribed',
	firstName: 'John',
	lastName: 'Doe',
	gender: 'm',
	tags: ['tag1', 'tag2'],
	segments: ['60a6170920d91c215e949b5d'],
	customProperties: { externalCreated: '2024-01-01T00:00:00Z' },
	identifiers: [
		{
			id: 'example@example.com',
			type: 'email',
			channels: {
				email: { status: 'subscribed', statusChangedAt: '2021-05-20T12:00:00Z' },
			},
		},
	],
	createdAt: '2021-05-20T12:00:00Z',
	updatedAt: '2021-05-20T12:30:00Z',
};

export const contactsListResponse = {
	contacts: [
		contact,
		{ ...contact, id: '60a6170920d91c215e949b5d', email: 'other@example.com' },
	],
	paging: {
		limit: 50,
		hasMore: true,
		cursors: { after: 'eyJpZCI6ImNvbnRhY3QtNDU2In0', before: null },
	},
};

export const campaign = {
	id: '000000000000000000000001',
	name: 'Welcome Email Campaign',
	type: 'regular',
	channel: 'email',
	status: 'draft',
	language: 'en_US',
	content: {
		email: {
			contentID: '000000000000000000000002',
			subject: 'Welcome to Omnisend!',
			preheader: 'Discover what we have in store for you',
			senderName: 'My Store',
		},
	},
	audience: { includedSegmentIDs: [], excludedSegmentIDs: [] },
	sendingSettings: { strategy: 'immediate' },
	brandID: '000000000000000000000003',
	url: 'https://app.omnisend.com/campaigns/1',
	createdAt: '2026-01-15T10:30:00Z',
	updatedAt: '2026-01-15T10:30:00Z',
};

export const campaignsListResponse = {
	campaigns: [campaign],
	paging: {
		limit: 50,
		hasMore: false,
		cursors: { after: null, before: 'eyJpZCI6ImNhbXAtMTIzIn0' },
	},
};

export const utmResponse = {
	tags: { source: 'omnisend', medium: 'email', campaign: 'Welcome Email' },
};

export const eventItem = {
	name: 'placed order',
	displayName: 'Placed Order',
	origins: ['shopify', 'api'],
	explicitlyDefined: true,
	properties: {
		orderId: {
			type: 'string',
			displayName: 'Order ID',
			explicitlyDefined: true,
		},
	},
};

export const eventsMetadataResponse = { events: [eventItem] };

export const eventWriteResponse = { event: eventItem };

export const product = {
	id: 'shoes-blue-123',
	title: 'My Product',
	currency: 'USD',
	url: 'https://example.com/product',
	status: 'inStock',
	variants: [
		{
			id: 'shoes-blue-123-42',
			title: 'My Variant',
			price: 9.99,
			url: 'https://example.com/variant',
			sku: 'SKU1234567890',
		},
	],
	categoryIDs: ['C1234'],
	tags: ['tag1'],
	createdAt: '2021-01-01T00:00:00Z',
	updatedAt: '2021-01-01T00:00:00Z',
};

export const productsListResponse = {
	products: [product],
	paging: {
		limit: 100,
		offset: 0,
		next: 'https://api.omnisend.com/api/products?limit=100&offset=100',
		previous: null,
	},
};

export const category = {
	categoryID: 'C1234',
	title: 'Beauty products',
	createdAt: '2024-01-15T10:30:00Z',
	updatedAt: '2024-01-16T14:45:00Z',
};

export const categoriesListResponse = {
	categories: [category],
	paging: {
		limit: 100,
		offset: 0,
		next: null,
		previous: null,
	},
};

export const templateListItem = {
	id: '68beca12d2e99b0c8d19fd5e',
	name: 'Welcome Email 1',
	createdAt: '2021-01-01T01:02:03Z',
	updatedAt: '2021-01-01T01:02:03Z',
};

export const templatesListResponse = {
	templates: [templateListItem],
	paging: {
		limit: 50,
		hasMore: false,
		cursors: { after: null, before: null },
	},
};

export const template = {
	...templateListItem,
	sections: [{ type: 'header', rows: [] }],
	generalSettings: {
		body: { backgroundColor: '#EDEEF0' },
		content: {
			backgroundColor: '#FFFFFF',
			color: '#212121',
			fontFamily: 'Arial, sans-serif',
			fontSize: '16px',
			width: '600px',
		},
	},
};

export const batch = {
	batchID: '5f92cbf10cf217478ba93561',
	status: 'inProgress',
	totalCount: 100,
	finishedCount: 40,
	errorsCount: 0,
	errors: [],
	responses: [
		{
			itemID: '60a6170920d91c215e949b5c',
			response: { contactID: '60a6170920d91c215e949b5c' },
			responseCode: 201,
			status: 'finished',
		},
	],
	endpoint: 'contacts',
	method: 'POST',
	origin: 'api',
	startedAt: '2021-01-01T00:00:00Z',
	createdAt: '2021-01-01T00:00:00Z',
};

export const batchesCreateResponse = {
	batchID: '5f92cbf10cf217478ba93561',
	totalCount: 100,
};

export const batchesListResponse = {
	batches: [batch],
	paging: {
		limit: 100,
		offset: 0,
		next: null,
		previous: null,
	},
};

export const renderedTemplate = {
	html: '<html><body><p>Hello</p></body></html>',
};

export const unauthorized = {
	type: 'https://problems.omnisend.com/unauthorized',
	title: 'Unauthorized',
	status: 401,
};

export const rateLimited = {
	type: 'https://problems.omnisend.com/rate-limit-exceeded',
	title: 'Rate limit exceeded',
	status: 429,
	retryAfter: 5,
};

export const validationFailed = {
	type: 'https://problems.omnisend.com/validation-failed',
	title: 'Validation failed',
	status: 400,
	errors: [
		{ field: 'identifiers', code: 'required', message: 'Identifier is required.' },
	],
};

export const billingRequired = {
	type: 'https://problems.omnisend.com/payment-required',
	title: 'Payment required',
	status: 402,
	detail: 'Audience size exceeds your billing tier.',
};

export const retiredVersion = {
	type: 'https://problems.omnisend.com/gone',
	title: 'Gone',
	status: 410,
};
