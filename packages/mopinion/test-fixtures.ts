// Envelope bodies modeled on the docs and spec examples
// (developer.mopinion.com, data API v3.0.0-alpha). The 401 problem body was
// captured from the live API.

export const account = {
	id: 12345,
	name: 'Beachy',
	created_at: '2025-01-15T08:00:00+0000',
	updated_at: '2026-03-20T09:00:00+0000',
};

export const meta = {
	code: 200,
	message: 'OK',
	has_more: true,
	previous: false,
	next: '/reports/1/feedback?page=2&limit=10',
	count: 10,
	total: 25,
};

export const dataset = {
	id: 123456,
	name: 'Website feedback',
	created_at: '2026-01-15T08:00:00+0000',
	updated_at: '2026-04-01T12:30:00+0000',
};

export const feedbackItem = {
	id: 987654,
	dataset_id: 123456,
	datetime: '2026-04-09T14:32:00+0000',
	nps: 9,
	tags: ['promoter'],
	answers: { 'How easy was it?': 'Very easy' },
};

export const deployment = {
	id: 441,
	name: 'Website popup',
	created_at: '2026-02-01T10:00:00+0000',
	updated_at: '2026-04-05T16:00:00+0000',
};

/** The probed RFC 7807 401 body for unsigned requests. */
export const invalidCredentialsProblem = {
	status: 401,
	error_code: 18,
	title: 'The credentials you provided are not valid',
	type: 'https://developer.mopinion.com/api/error-codes#invalid-credentials',
};

/** A 422 validation problem, per the Errors section's `details` list. */
export const validationProblem = {
	status: 422,
	error_code: 30,
	title: 'The given data was invalid',
	type: 'https://developer.mopinion.com/api/error-codes#validation',
	details: [{ limit: ['The limit may not be greater than 1000.'] }],
};
