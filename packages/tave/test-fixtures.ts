// Fixtures built from the schemas in the published OpenAPI document
// (https://workspace.vsco.co/api/v2/openapi.json). Lists answer
// `{ type, items, meta }`, amounts are integers in the studio currency, and
// IDs are lowercase ULIDs.

export const job = {
	id: '01h35ccwymj5ctckp8px1azhg6',
	created: '2024-01-02T03:04:05Z',
	modified: '2024-01-03T03:04:05Z',
	hidden: false,
	title: 'Smith wedding',
	name: 'Smith wedding',
	stage: 'booked',
	closed: false,
	closedReasonId: null,
	closedReasonName: null,
	closedDate: null,
	inquiryDate: '2024-01-01',
	bookingDate: '2024-01-02',
	eventDate: '2024-06-15',
	completedDate: null,
	fulfillmentDate: null,
	clientContacts: {
		data: [{ id: '01h35ccwymj5ctckp8px1azhg7' }],
		has_more: false,
	},
	contacts: { data: [{ id: '01h35ccwymj5ctckp8px1azhg7' }], has_more: false },
	customNumber: null,
	jobTypeId: '01h35ccwymj5ctckp8px1azhg8',
	jobTypeName: 'Wedding',
	leadSourceId: '01h35ccwymj5ctckp8px1azhg9',
	leadSourceName: 'Website',
	leadStatusId: null,
	leadStatusName: null,
	accountBalance: 150000,
	creditBalance: 0,
	totalCost: 50000,
	totalProfit: 100000,
	totalRevenue: 150000,
	guestCount: 120,
	brandId: null,
	workflowId: null,
	workflowName: null,
	pinned: false,
	sample: false,
	webLead: true,
	links: {
		self: {
			href: 'https://workspace.vsco.co/api/v2/job/01h35ccwymj5ctckp8px1azhg6',
			type: 'application/json',
		},
	},
};

export const jobsList = {
	type: 'job-collection',
	items: [job],
	meta: { currentPage: 1, totalPages: 2, totalItems: 2, pageSize: 1 },
};

export const product = {
	id: '01h35ccwymj5ctckp8px1azhga',
	created: '2024-01-02T03:04:05Z',
	modified: '2024-01-02T03:04:05Z',
	hidden: false,
	name: 'Wedding album',
	price: 25000,
	type: '01h35ccwymj5ctckp8px1azhgb',
	sku: 'ALBUM-01',
	descriptionHtml: '<p>A 40 page album</p>',
	manualEntry: false,
	taxable: true,
	deliverable: true,
	vendorId: null,
	expenseCategoryId: null,
};

export const productsList = {
	type: 'product-collection',
	items: [product],
	meta: { currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 100 },
};

export const payment = {
	id: '01h35ccwymj5ctckp8px1azhgc',
	created: '2024-02-01T03:04:05Z',
	modified: '2024-02-01T03:04:05Z',
	hidden: false,
	jobId: '01h35ccwymj5ctckp8px1azhg6',
	payerId: null,
	paymentMethodId: '01h35ccwymj5ctckp8px1azhgd',
	invoiceItemId: null,
	status: 'posted',
	amount: 75000,
	refundedAmount: 0,
	memo: 'Deposit',
	checkNumber: null,
	transactionId: null,
	authCode: null,
	received: '2024-02-01',
	links: {
		self: {
			href: 'https://workspace.vsco.co/api/v2/payment/01h35ccwymj5ctckp8px1azhgc',
		},
	},
};

export const paymentsList = {
	type: 'payment-collection',
	items: [payment],
	meta: { currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 100 },
};

export const task = {
	id: '01h35ccwymj5ctckp8px1azhge',
	created: '2024-01-05T03:04:05Z',
	modified: '2024-01-05T03:04:05Z',
	hidden: false,
	name: 'Send the contract',
	taskListId: '01h35ccwymj5ctckp8px1azhgf',
	jobId: '01h35ccwymj5ctckp8px1azhg6',
	userId: '01h35ccwymj5ctckp8px1azhgg',
	completed: false,
	completedAt: null,
	completedById: null,
	dueDate: '2024-02-01',
	links: { self: { href: 'https://workspace.vsco.co/api/v2/task/x' } },
};

export const tasksList = {
	type: 'task-collection',
	items: [task],
	meta: { currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 100 },
};

export const taskList = {
	id: '01h35ccwymj5ctckp8px1azhgf',
	name: 'Onboarding',
	created: '2024-01-01T00:00:00Z',
	modified: '2024-01-01T00:00:00Z',
};

export const taskListsList = {
	type: 'task-list-collection',
	items: [taskList],
	meta: { currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 100 },
};

export const note = {
	id: '01h35ccwymj5ctckp8px1azhgh',
	created: '2024-01-06T03:04:05Z',
	modified: '2024-01-06T03:04:05Z',
	hidden: false,
	contentHtml: '<p>Called about the timeline.</p>',
	date: '2024-01-06',
	jobId: '01h35ccwymj5ctckp8px1azhg6',
	contactId: null,
	authorId: '01h35ccwymj5ctckp8px1azhgg',
	author: 'Mia Black',
};

export const notesList = {
	type: 'note-collection',
	items: [note],
	meta: { currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 100 },
};

export const jobType = {
	id: '01h35ccwymj5ctckp8px1azhg8',
	name: 'Wedding',
	created: '2024-01-01T00:00:00Z',
	modified: '2024-01-01T00:00:00Z',
	hidden: false,
};

export const jobTypesList = {
	type: 'job-type-collection',
	items: [jobType],
	meta: { currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 100 },
};

export const brand = {
	id: '01h35ccwymj5ctckp8px1azhgi',
	name: 'Studio brand',
	alias: 'studio',
	created: '2024-01-01T00:00:00Z',
	modified: '2024-01-01T00:00:00Z',
	hidden: false,
};

export const brandsList = {
	type: 'brand-collection',
	items: [brand],
	meta: { currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 100 },
};

export const studio = {
	id: '01h35ccwymj5ctckp8px1azhgj',
	name: 'Example Studio',
	alias: 'example',
	currency: 'USD',
	timezone: 'America/New_York',
	email: 'hello@example.com',
	phone: '+1 555 0100',
};

// The API's failure envelope, for both a refused key and a missing record.
export const unauthorizedResponse = {
	error: true,
	status: 401,
	message: 'Unauthorized',
};

export const notFoundResponse = {
	error: true,
	status: 404,
	message: 'Not Found',
};

// A path that is not an API route answers 200 with the documentation page.
export const htmlResponse = `<!DOCTYPE HTML>
<html lang="en">
<head><title>VSCO Workspace API Documentation</title></head>
<body><div id="ApiReference">Loading...</div></body>
</html>`;
