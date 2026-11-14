// Shapes taken from GatherUp's API v2 reference (https://apidocs.gatherup.com/)
// and live probes. Every answer, success or failure, carries `errorCode` and
// `errorMessage`; `/api/test` answered a bad token with a 200 and `errorCode: 2`.

export const business = {
	id: 34291,
	name: 'Peach Trees Intl.',
	phone: '808-333-3334',
	city: 'Haiku',
	state: 'FL',
	zip: '96708',
	country: 'US',
	streetAddress: '4150 Hana Hwy',
	timezone: 'America/Denver',
	organisationType: 'company',
	emailLogo: 'http://domain.com/image-url',
	emailImage: null,
	feedbackBanner: null,
	added: '2021-07-19 13:43:45',
	websiteURL: 'https://www.peachtreeintl.example',
	package: 'pro',
	shortFeedbackUrl: 'https://local.gatherup.com/f-34291',
	communicationMethod: 'Manual',
	nps: 0,
	ratingsReceived: null,
	customersNotSent: '0',
	legalBusinessName: 'Peach Trees International LLC',
	isActive: true,
	errorCode: 0,
	errorMessage: 'Success',
};

/** A list row uses `business…` names, unlike the single read (reference example). */
export const businessRow = {
	businessId: 33733,
	businessDeleted: 0,
	businessName: 'ApiTest',
	businessPhone: '2345345345',
	businessCity: 'Los Angeles',
	businessState: 'LA',
	businessZip: '23434',
	businessCountry: 'United States',
	businessStreetAddress: 'Street',
	businessOrganisationType: 'company',
	customField: '12345',
	businessPackage: 'basic',
	extraField: 'extra123-example',
};

export const businesses = {
	page: 1,
	perPage: 2,
	pages: 2,
	count: 2,
	data: [businessRow, { ...businessRow, businessId: 33734 }],
	errorCode: 0,
	errorMessage: 'Success',
};

/** A single page, which is where `next_page` must be null. */
export const lastBusinessPage = {
	page: 1,
	perPage: 100,
	pages: 1,
	count: 1,
	data: [businessRow],
	errorCode: 0,
	errorMessage: 'Success',
};

/** Create answers the new ID at the top level. */
export const businessCreated = {
	businessId: 34298,
	errorCode: 0,
	errorMessage: 'Success',
};

export const success = { errorCode: 0, errorMessage: 'Success' };

/** Types come back as numbered keys beside the error fields. */
export const businessTypes = {
	'0': 'Alternative Medicine Practitioner',
	'1': 'Chinese Medicine Clinic',
	'2': 'Sports Medicine Clinic',
	errorCode: 0,
	errorMessage: 'Success',
};

/** A search answers one business ID. */
export const businessSearch = {
	businessId: 34292,
	errorCode: 0,
	errorMessage: 'Success',
};

/** Create answers the new customer ID, not the record. */
export const customerCreated = {
	customerId: 80717046,
	feedbackRequestErrorCode: 0,
	feedbackRequestErrorMessage: 'Success',
	errorCode: 0,
	errorMessage: 'Success',
};

export const customer = {
	id: 80717046,
	businessId: 34291,
	firstName: 'John',
	lastName: 'Smith',
	phone: '+12025550167',
	email: 'johnsmith@app.gatherup.com',
	jobId: '234-345',
	customId: 'C1-212',
	parentId: '0',
	// A rating is a decimal string, not a number.
	rating: '5.00',
	review: 'Vert good! I love you!',
	statusInfo: 'Review received',
	subscription: 1,
	unsubscribed: '0',
	createdAt: '2014-12-25T08:05:08+00:00',
	errorCode: 0,
	errorMessage: 'Success',
};

export const customers = {
	page: 1,
	pages: 1,
	count: 2,
	perPage: 500,
	data: [
		{
			id: '80717045',
			businessId: '34291',
			firstName: 'John',
			lastName: 'Smith',
			phone: '',
			email: 'john.smith@app.gatherup.com',
			jobId: '234-345',
			customId: 'C1-212',
			parentId: '0',
			rating: null,
			review: null,
			statusInfo: 'Request sent',
			subscription: 1,
			createdAt: '2014-12-25T08:05:08+00:00',
		},
		customer,
	],
	errorCode: 0,
	errorMessage: 'Success',
};

export const feedback = {
	rating: 5,
	recommend: 10,
	feedbackId: '80717046',
	businessId: '34291',
	dateOfReview: '2021-07-20T12:52:04+00:00',
	showReview: '1',
	authorEmail: 'john.smith@abc-company.us',
	authorName: 'John Smith',
	body: 'You are amazing!',
	jobId: '10',
	customId: '2',
	// One comma-separated string, not an array.
	tags: 'Auto,Towing,Roadside Service',
	negativeDetails: 'Negative Details',
};

export const feedbacks = {
	page: 1,
	pages: 1,
	count: 1,
	perPage: 500,
	data: [feedback],
	errorCode: 0,
	errorMessage: 'Success',
};

/** The failure envelope a live probe returned with HTTP 200. */
export const invalidClientOn200 = {
	errorCode: 2,
	errorMessage: 'Invalid clientId',
};

/** The same envelope on a real 401. */
export const unauthorized = {
	errorCode: 2,
	errorMessage: 'Invalid clientId',
};

/** A field GatherUp refused. */
export const invalidField = {
	errorCode: 11,
	errorMessage: 'Business name is required',
};

/** An unknown record. */
export const notFound = {
	errorCode: 7,
	errorMessage: 'Business not found',
};
