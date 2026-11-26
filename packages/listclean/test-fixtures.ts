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

/**
 * Bodies the live API answered on 2026-11-26 (box live run), trimmed, with
 * the account's username and other accounts' filenames replaced.
 */

/** GET /lists/ on an account with no lists: total is a string. */
export const LIVE_LISTS_EMPTY = { total: '0', lists: [] } as const;

/** GET /logs: an object holding the rows and a total, not a bare array. */
export const LIVE_LOGS = {
	logs: [
		{
			entered: '2026-11-26 17:52:53',
			instance_name: 'corsair_test',
			email: 'test@example.com',
			status: 'dirty',
			source: 'api',
			reason_code: 'EH3',
			remarks: 'Role-Based Email',
		},
	],
	total_count: 1,
} as const;

/** GET /analytics: per-status count/perc objects, keyed by YYYYMMDD per day, and parallel arrays in graph_summary. */
export const LIVE_ANALYTICS = {
	total_summary: {
		total: { count: 1, perc: 100 },
		clean: { count: 0, perc: 0 },
		dirty: { count: 1, perc: 100 },
		unknown: { count: 0, perc: 0 },
		error: { count: 0, perc: 0 },
	},
	datewise_summary: {
		'20261126': {
			total: { count: 1, perc: 100 },
			clean: { count: 0, perc: 0 },
			// A string count on the same object as number counts.
			dirty: { count: '1', perc: 100 },
			unknown: { count: 0, perc: 0 },
			error: { count: 0, perc: 0 },
		},
	},
	graph_summary: {
		dates: ['2026-11-25', '2026-11-26'],
		total_counts: [0, 1],
		total_percs: [0, 100],
		dirty_counts: [0, 1],
		dirty_percs: [0, 100],
	},
} as const;

/** GET /uploads/: one row; id, not upload_id, and no progress. */
export const LIVE_UPLOAD_ROW = {
	id: 2,
	entered: '2021-11-11 01:36:59',
	client_filename: 'sample-list.csv',
	filename: '1636574819-7289_sample-list.csv',
	status: 'success',
	count: 0,
	total_records: 100,
	stage: 'Please wait..',
	remarks: null,
	import_result: null,
	separator_char: null,
	enclosure_char: null,
	escape_char: null,
	fast_process: 0,
	upload_session_id: null,
	email_column_index: null,
	token_id: 0,
	token_type: 'session',
} as const;
