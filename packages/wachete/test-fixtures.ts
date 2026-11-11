// Response bodies built from the examples in https://wachete.com/api and the
// live OpenAPI document at https://api.wachete.com/swagger/v1/swagger.json,
// with made-up ids and hosts. They were not captured from the live API.

export const taskId = '9f7e1ae7-9a7f-49e0-baa2-ffd8760f7b9e';
export const folderId = '576b3f7e-e126-4e92-9b95-f72a8d187a18';

export const task = {
	id: taskId,
	name: 'My First Monitor',
	method: 'GET',
	url: 'http://www.mypage.com',
	xPath: '/',
	excludeXPath: null,
	regex: null,
	alerts: [
		{ type: 'Error', value: null },
		{ type: 'NotEq', value: null },
	],
	recurrenceInSeconds: 86_400,
	folderId: null,
	data: {
		lastCheckTimestamp: '2015-07-12T12:52:48Z',
		valueChangedTimestamp: '2015-07-12T11:52:48Z',
		raw: 'This is content of my page',
		error: null,
		diff: null,
	},
	notificationEndpoints: [
		{ type: 'Webhook', value: 'https://www.myservice.com/callback' },
	],
	proxies: null,
	location: null,
	dynamicContent: false,
	scrollPage: false,
	ignoreInvalidPages: false,
	collectRawHtml: false,
	jobType: 'SinglePage',
	crawlingDepth: 0,
	crawlBinaryContent: false,
	crawlPagesFromAllDomains: false,
};

/** A monitor whose last check failed, which is what `data.error` reports. */
export const failedTask = {
	...task,
	data: {
		lastCheckTimestamp: '2015-07-12T12:52:48Z',
		valueChangedTimestamp: null,
		raw: null,
		error: 'HTTP 503 returned',
		diff: null,
	},
};

/** A Portal monitor, which crawls rather than watching one page. */
export const portalTask = {
	...task,
	id: 'c0a1b2c3-1111-2222-3333-444455556666',
	name: 'Docs portal',
	jobType: 'Portal',
	crawlingDepth: 2,
	urlFilter: {
		include: [{ filter: 'http://products/catalog/', type: 'Contains' }],
		exclude: [{ filter: 'cars[0-9]+', type: 'Regex' }],
	},
};

export const notification = {
	id: 'alert-1',
	type: 'NotEq',
	current: 'New value',
	comparand: 'Old value',
	html: null,
	error: null,
	timestamp: '2015-07-12T12:52:48Z',
	serverTime: '2015-07-12T12:52:48Z',
	taskId,
	taskName: 'My First Monitor',
	url: 'http://www.mypage.com',
};

export const notificationsPage = {
	data: [notification],
	continuationToken: 'next-page-token',
};

/** The last page carries no token at all. */
export const notificationsLastPage = {
	data: [notification],
	continuationToken: null,
};

export const notificationHtml = {
	jobType: 'SinglePage',
	syntheticExpression: '/',
	url: 'http://www.mypage.com',
	name: 'My First Monitor',
	html: '<html><body><p>This is content of my page</p></body></html>',
	timestampUtc: '2015-07-12T12:52:48Z',
};

export const dataHistory = {
	data: [
		{
			lastCheckTimestamp: '2015-07-12T12:52:48Z',
			valueChangedTimestamp: '2015-07-12T11:52:48Z',
			raw: 'This is content of my page',
			error: null,
			diff: null,
		},
		{
			lastCheckTimestamp: '2015-07-12T11:52:48Z',
			valueChangedTimestamp: null,
			raw: 'This was the old content',
			error: null,
			diff: null,
		},
	],
	continuationToken: null,
};

/** With `returnDiff=true`, each entry carries a Google-style diff. */
export const dataHistoryWithDiff = {
	data: [
		{
			lastCheckTimestamp: '2015-07-12T12:52:48Z',
			valueChangedTimestamp: '2015-07-12T11:52:48Z',
			raw: 'This is content of my page',
			error: null,
			diff: [{ operation: 1, text: 'This is content' }],
		},
	],
	continuationToken: null,
};

export const folder = {
	id: folderId,
	name: 'Products',
	parentId: null,
	count: 3,
	failedCount: 1,
	pausedCount: 0,
};

export const folderContent = {
	subfolders: [folder],
	tasks: [task],
	path: [folder],
	continuationToken: null,
};

export const searchResults = { tasks: [task, portalTask] };

export const pages = {
	pages: [
		{ id: 'page-1', name: '/', url: 'http://www.mypage.com' },
		{ id: 'page-2', name: '/about', url: 'http://www.mypage.com/about' },
	],
};

/** The login answer, which is the only place a token comes from. */
export const loginResponse = {
	token: 'QSQ26DJM2HPAD4NP4MSAVZGH5FUJGNYZY498XDP9AFLDT95PZJQFKVVFZ35FU3BVU',
	expiresInSec: 3600,
};

/** The error bodies the API sends. */
export const invalidCredentials = {
	message: 'Invalid userId or apiKey',
	code: 'Unauthorized',
};

export const missingAuth = {
	message: 'No authorization header was provided',
	code: 'Unauthorized',
};

export const invalidToken = { message: 'Invalid token', code: 'Unauthorized' };

export const notFound = { message: 'Task not found', code: 'NotFound' };
