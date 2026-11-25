/**
 * Response bodies built from the OpenAPI spec's own examples and the live
 * probe log (2026-11-25), not invented field names.
 */

export const VERIFY_RESULT = {
	datetime: '2026-09-09T17:11:58+05:30',
	email: 'myselfi.itba@gmail.com',
	status: 'dirty',
	remarks: 'Email does not exists',
	disposable: false,
	role_based: false,
	mx_found: true,
	mx_records:
		'gmail-smtp-in.l.google.com:5,alt1.gmail-smtp-in.l.google.com:10,alt2.gmail-smtp-in.l.google.com:20',
	msp: 'GMAIL',
	email_user: 'myselfi.itba',
	email_domain: 'gmail.com',
	free_email: true,
} as const;

export const LOG_ROW = {
	id: 21,
	entered: '2022-09-29 18:23:43',
	email: 'test@example.com',
	status: 'dirty',
	remarks: 'Disposable Email',
	credits_deducted: 1,
	error_code: '',
} as const;

export const LIST_ROW = {
	list_id: 159261,
	filename: 'sample-list.csv',
	size_in_bytes: 229,
	request_time: '2021-11-06 22:37:19',
	status: 'COMPLETED',
	upload_id: 'Q1636218416-991025',
	analytics: {
		summary: {
			total: 12,
			duplicate: 1,
			// The spec's own examples send both number and string counts.
			dirty: { count: 8, perc: 66.67 },
			clean: { count: '4', perc: '33.33' },
		},
		dirty_summary: [{ count: 5, perc: 55.56, dirty_type: 'Disposable Email' }],
		clean_summary: [{ count: '1', perc: '100', clean_type: 'High Quality' }],
	},
	cost: {
		rate: { INR: 1, USD: 0.012 },
		cost: { INR: 12, USD: 0.144 },
	},
} as const;

export const LISTS_PAGE = {
	total: 7,
	cursor: 1,
	lists: [LIST_ROW],
} as const;

/** The status read answers an array holding the one list, not an object. */
export const SINGLE_LIST = [LIST_ROW] as const;

export const BATCH_ACCEPTED = {
	list_id: 159261,
} as const;

export const RESULT_ROWS = [
	{
		datetime: '2026-09-09T17:11:58+05:30',
		email: 'clean@example.com',
		status: 'clean',
		remarks: 'Mailbox exists',
		disposable: false,
		role_based: false,
		mx_found: true,
		mx_records: 'mx.example.com:10',
		msp: 'EXAMPLE',
		email_user: 'clean',
		email_domain: 'example.com',
	},
	{
		datetime: '2026-09-09T17:11:59+05:30',
		email: 'nouser@example.org',
		status: 'dirty',
		remarks: 'Email does not exists',
		disposable: false,
		role_based: true,
		mx_found: true,
		mx_records: 'mx.example.org:10',
		msp: 'EXAMPLE',
		email_user: 'nouser',
		email_domain: 'example.org',
	},
] as const;

export const ANALYTICS = {
	// unknown: the spec leaves the analytics inner shapes bare, so this
	// fixture mirrors the shape the docs describe in prose only.
	total_summary: {
		total: 100,
		clean: { count: 60, perc: 60 },
		dirty: { count: 30, perc: 30 },
		unknown: { count: 10, perc: 10 },
	},
	datewise_summary: {
		'2026-11-24': { total: 50, clean: { count: 30, perc: 60 } },
	},
	graph_summary: [{ date: '2026-11-24', clean: 30, dirty: 15 }],
} as const;

export const CREDITS = { credits: 99 } as const;

/** Failure envelopes, from the live probe log. */

export const NO_AUTH_TOKEN = {
	success: 0,
	error_code: 0,
	message: 'No auth token provided',
} as const;

export const INVALID_TOKEN = {
	success: 0,
	error_code: 0,
	message: 'Invalid token or token expired',
} as const;

export const DELETE_OK = {
	success: 1,
	error_code: 0,
	message: 'Lists deleted successfully',
} as const;
