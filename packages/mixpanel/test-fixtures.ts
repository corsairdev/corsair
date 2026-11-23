// Response bodies copied from the examples embedded in the reference pages
// at https://docs.mixpanel.com/reference, with made-up people and events.
// The error envelopes were captured from the live API unauthenticated.

export const importOk = {
	code: 200,
	num_records_imported: 2,
	status: 'OK',
};

/** The 400 body when strict validation rejects part of a batch. */
export const importValidationFailed = {
	code: 400,
	error: 'some data points in the request failed validation',
	status: 'Bad Request',
	num_records_imported: 1,
	failed_records: [
		{
			index: 1,
			insert_id: '935d87b1-00cd-41b7-be34-b9d98dd08b42',
			field: 'properties.time',
			message:
				"properties.time' is invalid: must be specified as seconds since epoch",
		},
	],
};

export const cohort = {
	count: 150,
	is_visible: 1,
	description: 'Signed up in the last 30 days and opened the app twice.',
	created: '2026-03-19 23:49:51',
	project_id: 3141592,
	id: 1000,
	name: 'Recent signups',
};

export const engageResponse = {
	page: 0,
	page_size: 1000,
	results: [
		{
			$distinct_id: '4',
			$properties: {
				$created: '2026-01-12T11:20:47',
				$email: 'jordan@example.com',
				$first_name: 'Jordan',
				$last_name: 'Lee',
				$last_seen: '2026-04-09T23:08:40',
			},
		},
	],
	session_id: '1774390200-EXAMPL',
	status: 'ok',
	total: 1,
};

export const insightsResponse = {
	computed_at: '2026-04-21T16:35:41.252314+00:00',
	date_range: {
		from_date: '2026-03-31T00:00:00-07:00',
		to_date: '2026-04-12T23:59:59.999000-07:00',
	},
	headers: ['$event'],
	series: {
		'Logged in': {
			'2026-03-31T00:00:00-07:00': 9852,
			'2026-04-07T00:00:00-07:00': 4325,
		},
		'Viewed page': {
			'2026-03-31T00:00:00-07:00': 10246,
			'2026-04-07T00:00:00-07:00': 11432,
		},
	},
};

export const funnelsList = [
	{ funnel_id: 7509, name: 'Signup funnel' },
	{ funnel_id: 9070, name: 'Onboarding tutorial' },
];

export const retentionResponse = {
	'2026-04-01': { counts: [2, 1, 2], first: 2 },
	'2026-04-02': { counts: [9, 7, 6], first: 10 },
	'2026-04-03': { counts: [9, 6, 4], first: 10 },
};

/** One line of the raw export's JSONL body. */
export const exportedEventLine = JSON.stringify({
	event: 'Signed up',
	properties: {
		time: 1776700000,
		distinct_id: '91304156-cafc-4673-a237-623d1129c801',
		$insert_id: 'hpuDqcvpltpCjBsebtxwadtEBDnFAdycabFb',
		mp_processing_time_ms: 1776710000000,
		$city: 'San Francisco',
		mp_country_code: 'US',
	},
});

export const queryRateLimited = {
	request: '/api/query/insights',
	status: 'error',
	error: 'Rate limit exceeded; too many concurrent queries.',
	error_code: 'query_api.request.rate_limited',
};

/** The query API's unauthenticated 401, probed live. */
export const queryUnauthenticated = {
	request: '/api/query/cohorts/list',
	status: 'error',
	error:
		'To authenticate your request, you must use your API Secret in the HTTP Authorization header. Please see https://mixpanel.com/docs',
	error_code: 'query_api.request.unauthenticated',
};

/** The ingestion API's 401: status is the number 0, not the docs' string. */
export const ingestionUnauthenticated = {
	code: 401,
	error:
		'Access is forbidden due to request missing authentication details. Please see: https://developer.mixpanel.com/reference/ingestion-api-authentication',
	status: 0,
};

/** The raw export's 401 body is plain text, not JSON. */
export const exportUnauthenticatedText =
	'To authenticate your request, you must use your API Secret in the HTTP authorization header';

/** An engage 200 whose body still says error. */
export const engageFailedBody = {
	status: 'error',
	error: 'Invalid selector: properties["$email"] =~',
};
