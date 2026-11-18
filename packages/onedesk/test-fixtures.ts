/**
 * Responses copied from the OneDesk OpenAPI spec
 * (https://onedesk.com/public-api/swagger.html). The envelope shapes matter:
 * a 200 can still carry `code: 'ERROR_*'`, and updates answer a bare string.
 */

export const pagedIds = {
	code: 'SUCCESS',
	data: [
		'ab123456-0000-0000-0000-000000000001',
		'ab123456-0000-0000-0000-000000000002',
	],
	totalNum: 57,
	appliedPropertyFilters: [
		{ property: 'lifecycleStatus', operation: 'EQ', value: 'Open' },
	],
	appliedCustomFieldFilters: [],
	notAppliedPropertyFilters: [],
	notAppliedCustomFieldFilters: [],
};

/** A full page: the last page, so nextOffset must be null. */
export const pagedIdsLastPage = {
	code: 'SUCCESS',
	data: ['ab123456-0000-0000-0000-000000000003'],
	totalNum: 3,
	appliedPropertyFilters: [],
	notAppliedPropertyFilters: [],
};

export const item = {
	id: 2,
	externalId: '0abb5fgh-0000-0000-0000-c75df7969bad',
	name: "The blue button doesn't work",
	description: 'It was working last week!',
	type: { name: 'Ticket' },
	lifecycleStatus: { name: 'Open', externalId: 'ls-1', state: 'OPEN' },
	priority: 80,
	created: '2024-05-14T10:00:00Z',
	edited: '2024-05-14T11:00:00Z',
	latestInProgress: '2024-05-14T10:30:00Z',
	latestClose: null,
	author: { typeName: 'User', displayName: 'Ada', email: 'ada@example.com' },
	assignees: [
		{ typeName: 'User', displayName: 'Grace', email: 'grace@example.com' },
	],
	project: { externalId: 'p-1', name: 'Website' },
	agilePoints: 3,
	customFields: [{ name: 'Severity', value: 'High' }],
};

export const itemDetailsPage = {
	code: 'SUCCESS',
	data: [item],
	totalNum: 1,
	appliedPropertyFilters: [],
	notAppliedPropertyFilters: [],
};

export const itemResult = { code: 'SUCCESS', data: item };

export const createdRecord = {
	code: 'SUCCESS',
	data: '1534596f4-0000-0000-0000-cb0e42b1db19',
};

/** Updates answer a bare code string, not an object. */
export const updateCodeString = 'SUCCESS';

export const user = {
	id: 7,
	externalId: 'u-1',
	userType: 'full-time',
	created: '2024-01-01T00:00:00Z',
	priority: 0,
	registered: true,
	// Live shape: phoneWork and language, not phoneNumber.
	profile: {
		email: 'ada@example.com',
		firstName: 'Ada',
		lastName: 'Lovelace',
		phoneWork: null,
		title: 'Engineer',
		language: 'en',
	},
	address: { address1: '1 Main St', city: 'Springfield', country: 'US' },
	customFieldsData: [],
	// Live shape: team external ids, not embedded objects.
	teams: ['46d4eed9-776f-4a88-aea7-5f8fc741fa22'],
};

export const userDetailsPage = {
	code: 'SUCCESS',
	data: [user],
	totalNum: 1,
};

export const project = {
	id: 11,
	externalId: 'p-1',
	name: 'Website',
	description: 'Marketing site',
	created: '2024-02-01T00:00:00Z',
	archivedDate: null,
	// ProjectDetails: the type is a ContainerType object with a label.
	type: { label: 'Project' },
	invoiceType: 'flat fee',
	lifecycleStatus: { name: 'Open', externalId: 'ls-1', state: 'not started' },
	author: { typeName: 'User', displayName: 'Ada', externalId: 'u-1' },
	discoverable: true,
	parentExternalIds: [],
	customFields: [],
	attachments: [],
	archived: false,
	requesterCustomerOrganization: {
		name: 'Team 1',
		externalId: '5adf2c85-0000-0000-0000-dd5bb59d2dad',
	},
};

export const portfolio = {
	externalId: '9343a3e4-0000-0000-0000-e1c087ebe9ea',
	created: '2021-03-28 19:29:41.343000 +00:00',
	name: 'Sample portfolio',
	type: { label: 'Portfolio' },
	parentPortfolioExternalIds: ['9343a3e4-0000-0000-0000-e1c087ebe9eb'],
	attachments: [],
};

export const projectDetailsPage = {
	code: 'SUCCESS',
	data: [project],
	totalNum: 1,
};

/** Live shape: `userExternalIds`, not `users`, and no numeric id. */
export const team = {
	externalId: 't-1',
	name: 'Support',
	userExternalIds: ['67475168-7241-4a76-8bd5-dc4f26a40eb8'],
};

export const teamDetailsPage = { code: 'SUCCESS', data: [team], totalNum: 1 };

/** CustomerDetails: the name and email sit in `profile`, as on a user. */
export const customer = {
	id: 5,
	externalId: '03014379-0000-0000-0000-e1452fd43483',
	customerType: 'New-customer',
	created: '2023-07-31 21:07:04.112000 +00:00',
	priority: 100,
	registered: true,
	profile: {
		email: 'myemail@example.com',
		firstName: 'John',
		lastName: 'Doe',
		phoneWork: '+14381234567',
		title: 'Mr',
		language: 'english',
	},
	address: { address1: '3175 Rowes Lane', city: 'Miami', country: 'US' },
	customFieldsData: [],
	customerOrganization: '1234596f4-0000-0000-0000-cb0e42b1db19',
};

export const customerDetailsPage = {
	code: 'SUCCESS',
	data: [customer],
	totalNum: 1,
};

/** customer-organizations UserTeam: domains are plain strings. */
export const organization = {
	externalId: '3214596f4-0000-0000-0000-cb0e42b1db19',
	name: 'Analytical Engines',
	profile: {
		description: 'Client',
		phone: '+1 555 0102',
		address: '100 rue',
		city: 'Montreal',
		country: 'Canada',
	},
	invoicePreference: { currencySymbol: 'CAD', enablePrepaidHours: true },
	customerExternalIds: ['6634596f4-0000-0000-0000-cb0e42b1db19'],
	domains: ['analytical.example'],
	customFields: [],
};

export const organizationDetailsPage = {
	code: 'SUCCESS',
	data: [organization],
	totalNum: 1,
};

/** TimesheetDetails: a string id and `billable` typed as a string. */
export const timesheet = {
	id: '8-1',
	externalId: '3214596f4-0000-0000-0000-cb0e42b1db19',
	taskName: 'Sample task',
	start: '2024-05-14T09:00:00+00:00',
	finish: '2024-05-14T11:30:00+00:00',
	created: '2024-05-14T11:31:00+00:00',
	work: 2.5,
	invoiceWork: 2,
	percentCompletedReported: 50,
	comments: 'Implemented the form',
	status: 'not approved yet',
	taskExternalId: '616c7f21-0000-0000-0000-e1c087ebe9ea',
	billable: 'true',
	serviceType: 'Services',
	userRequesters: [],
	customFields: [],
};

/**
 * A timesheet as the live API returns it (11-11, trimmed): it spells
 * `percentCompleteReported` and sends one `assignee`, where the spec says
 * `percentCompletedReported` and `assignees`; `billable` is a boolean.
 */
export const timesheetLive = {
	id: '5-1',
	externalId: '79dc804d-d439-4f05-9f85-beb4b954cf9c',
	start: '2026-11-11T10:52:15.657+00:00',
	finish: '2026-11-11T10:52:15.657+00:00',
	created: '2026-11-11T10:52:15.657+00:00',
	work: 1.0,
	invoiceWork: 1.0,
	percentCompleteReported: 50.0,
	comments: 'this is an example timesheet note',
	status: 'not approved yet',
	assignee: {
		typeName: 'full-time',
		displayName: 'Sample User',
		email: 'user@example.com',
		teamName: 'sample team',
		externalId: 'a4d3f8fb-4e9a-4e81-8fc3-255f95fcd8b7',
	},
	taskName: 'Sample Ticket 2',
	taskExternalId: 'f5bbaed2-e519-4d12-b508-549a5ffa446c',
	projectExternalId: '942dd4d1-80f7-4941-984b-95e932a3a145',
	billable: true,
	serviceType: 'Services',
	invoiceableCustomerOrganizationExternalId:
		'cb0535b6-e872-414f-acfa-c8d83709c532',
	linkedInvoiceExternalId: null,
	userRequesters: [],
	customerRequesters: [],
	teamRequesters: [],
	customerOrganizationRequesters: [],
	customFields: [],
};

export const timesheetDetailsPage = {
	code: 'SUCCESS',
	data: [timesheet],
	totalNum: 1,
};

export const timer = {
	externalId: '4t52581b-0000-0000-0000-b0232f2a4453',
	userExternalId: 'ec4e9ef9-0000-0000-0000-2ae9a95c27bc',
	itemExternalId: '616c7f21-0000-0000-0000-e1c087ebe9ea',
	startDate: '2024-01-04T17:10:05.155+00:00',
	amountOfWork: 4.5,
	startCurrentTimer: '2024-01-04T17:10:05.155+00:00',
};

export const timerDetailsPage = { code: 'SUCCESS', data: [timer], totalNum: 1 };

export const timerActionResult = {
	code: 'SUCCESS',
	data: { reason: null, amountOfWork: 1.2 },
};

export const invoice = {
	id: 1,
	invoiceExternalId: '550e8400-0000-0000-0000-446655440000',
	created: '2024-01-12T16:10:29.499Z',
	customerOrganization: {
		displayName: 'John',
		emailAddress: 'jdoe@example.com',
	},
	displayNumber: 'INV-001',
	invoiceStatus: 'Sent',
	type: 'Monthly',
	dueDate: '2023-12-21T19:44:04.342+00:00',
	basicLineItems: [{ name: 'Setup', amount: 50, type: 'BASIC' }],
	totalAmount: 100,
	currency: '$',
	calculationLevel: 'TEAM',
};

export const invoiceDetailsPage = {
	code: 'SUCCESS',
	data: [invoice],
	totalNum: 1,
};

/** QuoteDetails: unlike an invoice, the id is a string. */
export const quote = {
	id: 'Q-1',
	quoteExternalId: '550e8400-0000-0000-0000-446655440001',
	created: '2024-01-12T16:10:29.499Z',
	displayNumber: 'QUO-001',
	quoteStatus: 'Sent',
	quoteExpiration: '2023-11-22T22:05:06.775+00:00',
	totalAmount: 15,
	currency: '$',
};

export const quoteDetailsPage = {
	code: 'SUCCESS',
	data: [quote],
	totalNum: 1,
};

/** Conversation: the external id is `id`, and a read says `locked`. */
export const conversation = {
	id: '1234596f4-0000-0000-0000-cb0e42b1db19@conference.im.onedesk.com',
	authorExternalId: '1234596f4-0000-0000-0000-cb0e42b1db19',
	open: true,
	publicConversation: false,
	created: '2023-12-20T18:14:24.329+00:00',
	itemExternalId: '6634596f4-0000-0000-0000-cb0e42b1db19',
	projectExternalId: null,
	locked: false,
};

export const conversationDetailsPage = {
	code: 'SUCCESS',
	data: [conversation],
	totalNum: 1,
};

export const message = {
	id: '4B85822F-0000-0000-0000-DB929C97D532',
	authorExternalId: '9343a3e4-0000-0000-0000-e1c087ebe9ea',
	conversationId:
		'1234596f4-0000-0000-0000-cb0e42b1db19@conference.im.onedesk.com',
	content: 'Thanks for the update.',
	source: 'MAIN_APP',
	creationDate: '2022-04-11T21:24:14.162+00:00',
	attachments: [],
	deleted: false,
};

export const messageDetailsPage = {
	code: 'SUCCESS',
	data: [message],
	totalNum: 1,
};

export const activity = {
	projectExternalId: '293496f4-0000-0000-0000-cb0e42b1db19',
	authorExternalId: '293496f4-0000-0000-0000-cb0e42b1db19',
	itemExternalId: '293496f4-0000-0000-0000-cb0e42b1db19',
	activityType: 'updated name',
	automationType: 'workflow triggered',
	creationDate: '2023-12-20T18:14:24.329+00:00',
	itemType: 'Portfolio',
	itemName: 'Sample Portfolio Name',
	newValue: 'portfolio name updated v2',
};

/**
 * An activity as the live API returns it (11-11): it sends
 * `automationTypeName` and `timestamp`, where the spec says `automationType`
 * and `creationDate`.
 */
export const activityLive = {
	projectExternalId: null,
	authorExternalId: null,
	itemExternalId: null,
	activityType: 'update organization financial',
	automationTypeName: null,
	timestamp: '2026-11-11T10:46:49.477+00:00',
	itemType: 'Budgeting',
	itemName: null,
	newValue: null,
};

export const activityDetailsPage = {
	code: 'SUCCESS',
	data: [activity],
	totalNum: 1,
};

/** Attachment: the id is the uuid the routes call the external id. */
export const attachment = {
	id: 'f4f93ccd-0000-0000-0000-d908c97a6190',
	name: 'invoice.pdf',
	contentType: 'application/pdf',
	creationDate: '2023-11-29T14:00:00.000+00:00',
	authorExternalId: '0abb5fgh-0000-0000-0000-c75df7969bad',
	url: 'https://app.onedesk.com/cware/view/f4f93ccd-0000-0000-0000-d908c97a6190',
};

export const attachmentDetailsPage = {
	code: 'SUCCESS',
	data: [attachment],
	totalNum: 1,
};

/** Live shape: `label` and an externalId, not `name`. */
export const organizationItemTypes = {
	code: 'SUCCESS',
	data: [
		{
			externalId: 'd3635424-57e5-4722-a3f5-dd84f410cda2',
			label: 'Problem',
			iconStyleName: 'odi_problem',
			iconColor: 15151164,
		},
		{
			externalId: '384d4dc0-6aa6-4a89-9769-acc46401a2a4',
			label: 'Feedback 5',
			iconStyleName: 'odi_knowledgeBaseArticle',
			iconColor: 12632256,
		},
	],
};

export const organizationUserTypes = {
	code: 'SUCCESS',
	data: [
		{
			label: 'full-time',
			iconStyleName: 'user_peopleItem_noColor',
			iconColor: 18556,
		},
		{
			label: 'contractor',
			iconStyleName: 'odi_userContractor',
			iconColor: 18556,
		},
	],
};

export const organizationContainerTypes = {
	code: 'SUCCESS',
	data: [
		{
			externalId: '04969ee3-f2b0-45b2-95a5-04584fe9b497',
			label: 'Project 5',
			isPortfolio: false,
			visible: false,
		},
		{
			externalId: 'c1dbd6d7-74c2-481c-b0d6-73dd21e0e4f2',
			label: 'Project 6',
			isPortfolio: true,
			visible: true,
		},
	],
};

/** Live shape: full objects, not the string array the spec shows. */
export const organizationLifecycleStatus = {
	code: 'SUCCESS',
	data: [
		{
			name: 'Missing',
			externalId: 'dd345b3d-cd67-4471-afb5-5045c6904692',
			state: 'finished',
			type: null,
		},
		{
			name: 'Open',
			externalId: '588e7778-7fa3-4922-ad7c-1f962d60dc78',
			state: 'not started',
			type: 'Feedback 8',
		},
	],
};

/** Live shape: no name/timeZone/currency, which the spec claims. */
export const organizationProfile = {
	code: 'SUCCESS',
	data: {
		dateFormat: 'MM-dd-yy',
		organizationName: 'Your Organization',
		organizationUri: 'yourorganization1794207978926',
		defaultThreadVisibilityType: 'PUBLIC_DISCUSSION_POST',
	},
};

/** A 2xx envelope that still says error: the API's most dangerous shape. */
export const securityAccessError = { code: 'ERROR_SECURITY_ACCESS' };
export const invalidIdError = { code: 'ERROR_INVALID_ID' };
export const serviceUnavailableError = { code: 'ERROR_SERVICE_UNAVAILABLE' };
