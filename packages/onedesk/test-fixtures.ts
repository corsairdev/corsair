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
	customFieldsData: [{ name: 'Severity', value: 'High' }],
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
	type: 'Project',
	invoiceType: 'flat fee',
	lifecycleStatus: { name: 'Open', externalId: 'ls-1', state: 'OPEN' },
	author: { typeName: 'User', displayName: 'Ada', externalId: 'u-1' },
	discoverable: true,
	parentExternalIds: [],
	customFields: [],
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

export const customer = {
	id: 21,
	externalId: 'c-1',
	firstName: 'Ada',
	lastName: 'Lovelace',
	email: 'ada@example.com',
	phoneNumber: '+1 555 0101',
	type: 'customer',
	priority: 20,
	title: 'CTO',
	address: { address1: '1 Main St', city: 'Springfield' },
	organization: { externalId: 'co-1', name: 'Analytical Engines' },
	customFieldsData: [],
};

export const customerDetailsPage = {
	code: 'SUCCESS',
	data: [customer],
	totalNum: 1,
};

export const organization = {
	id: 31,
	externalId: 'co-1',
	name: 'Analytical Engines',
	description: 'Client',
	phoneNumber: '+1 555 0102',
	address: { address1: '1 Main St' },
	domains: [],
	customers: [],
};

export const organizationDetailsPage = {
	code: 'SUCCESS',
	data: [organization],
	totalNum: 1,
};

export const timesheet = {
	id: 41,
	externalId: 'ts-1',
	works: 2.5,
	billable: true,
	note: 'Implemented the form',
	status: 'not approved yet',
	completion: 100,
	start: '2024-05-14T09:00:00Z',
	finish: '2024-05-14T11:30:00Z',
	customFieldsData: [],
};

export const timesheetDetailsPage = {
	code: 'SUCCESS',
	data: [timesheet],
	totalNum: 1,
};

export const timer = {
	id: 51,
	externalId: 'tm-1',
	status: 'RUNNING',
	works: 1.2,
	start: '2024-05-14T09:00:00Z',
	finish: null,
};

export const timerDetailsPage = { code: 'SUCCESS', data: [timer], totalNum: 1 };

export const timerActionResult = {
	code: 'SUCCESS',
	data: { reason: null, amountOfWork: 1.2 },
};

export const invoice = {
	id: 61,
	externalId: 'inv-1',
	displayNumber: 'INV-001',
	status: 'draft',
	dueDate: '2024-06-01',
	total: 1250,
	balance: 1250,
	created: '2024-05-01T00:00:00Z',
};

export const invoiceDetailsPage = {
	code: 'SUCCESS',
	data: [invoice],
	totalNum: 1,
};

export const quote = {
	id: 71,
	externalId: 'q-1',
	displayNumber: 'QUO-001',
	status: 'sent',
	expirationDate: '2024-06-15',
	total: 900,
	created: '2024-05-01T00:00:00Z',
};

export const quoteDetailsPage = {
	code: 'SUCCESS',
	data: [quote],
	totalNum: 1,
};

export const conversation = {
	externalId: 'cv-1',
	itemExternalId: 'i-1',
	projectExternalId: null,
	publicConversation: false,
	open: true,
	lock: false,
	author: { typeName: 'User', displayName: 'Ada', externalId: 'u-1' },
};

export const conversationDetailsPage = {
	code: 'SUCCESS',
	data: [conversation],
	totalNum: 1,
};

export const message = {
	externalId: 'm-1',
	conversationExternalId: 'cv-1',
	content: 'Thanks for the update.',
	author: { typeName: 'User', displayName: 'Ada', externalId: 'u-1' },
	created: '2024-05-14T12:00:00Z',
};

export const messageDetailsPage = {
	code: 'SUCCESS',
	data: [message],
	totalNum: 1,
};

export const activity = {
	id: 81,
	externalId: 'a-1',
	activityType: 'ITEM_CREATED',
	created: '2024-05-14T12:00:00Z',
};

export const activityDetailsPage = {
	code: 'SUCCESS',
	data: [activity],
	totalNum: 1,
};

export const attachment = {
	id: 91,
	externalId: 'at-1',
	name: 'invoice.pdf',
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
