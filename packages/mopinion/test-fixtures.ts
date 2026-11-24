// Bodies trimmed from live calls on a Mopinion trial account (API 2.5.5,
// 11-24): ids, names and texts replaced, structure kept. The 401 and 500
// problem bodies were captured from the live API too.

export const meta = {
	code: 200,
	message: 'OK',
	has_more: true,
	previous: false,
	next: '/reports/1/feedback?limit=2&page=2',
	count: 2,
	total: 5,
};

export const dataset = {
	name: 'Website feedback',
	report_id: 1,
	description: '',
	id: 123,
	data_source: 'survey',
};

export const report = {
	name: 'Default',
	description: '',
	language: 'en_US',
	id: 1,
	dataSets: [dataset],
	created: '2026-11-24 10:00:00',
};

export const account = {
	name: 'Example Org',
	package: 'Trial',
	enddate: '2026-12-08 23:59:00',
	number_users: 3,
	number_charts: 10,
	number_forms: 5,
	number_reports: 2,
	reports: [report],
	_meta: { ...meta, has_more: false, next: false, count: 1, total: 1 },
};

export const field = {
	report_id: 1,
	dataset_id: 123,
	label: 'What is your opinion of this page?',
	short_label: 'Opinion',
	key: '123.rating.b65dda97',
	type: 'rating',
};

export const feedbackItem = {
	id: 19699283,
	created: '2026-11-24',
	report_id: 1,
	dataset_id: 123,
	fields: [
		{
			key: '123.category.4ca0abe0',
			label: 'Please select your feedback category below:',
			value: 'Bug',
		},
		{
			key: '123.rating.b65dda97',
			label: 'What is your opinion of this page?',
			value: '4',
		},
		{ key: 'Device', label: 'Device', value: 'desktop' },
	],
	tags: [],
};

export const deployment = {
	id: 'abcDEF123',
	domain: 'example.com',
	org_id: 42,
	datetime: '2026-11-24 10:00:00',
	name: 'Web Feedback Deployment',
	published: true,
	revision: 2,
	type: 'web',
	user_uuid: '00000000-0000-0000-0000-000000000000',
	rules: [{ id: 'rule1', if: [{ trigger: 'passive' }], then: [{}] }],
};

/** The live 401 body for a request with a bad signature. */
export const invalidCredentialsProblem = {
	status: 401,
	error_code: 18,
	title: 'The credentials you provided are not valid',
	type: 'https://developer.mopinion.com/api/error-codes#invalid-credentials',
};

/** The live 500 body (GET /deployments on the trial account). */
export const serverProblem = {
	status: 500,
	error_code: 2,
	title: 'Server error',
	type: 'https://developer.mopinion.com/api/error-codes#server-error',
	details: [
		'Something unexpected happened. If the problem persists please contact us at support@mopinion.com',
	],
};
