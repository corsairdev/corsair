// Fixtures are trimmed real responses from a free Rollbar account (11-12),
// with ids and names replaced; the shapes and field types are as sent. The 401
// body is the live keyless response.

export const ITEM_ID = 12345;
export const OCCURRENCE_ID = 98765;
export const PROJECT_ID = 42;
export const DEPLOY_ID = 555;

/** The live 401, verbatim from a keyless call. */
export const TOKEN_REQUIRED = {
	err: 1,
	message: 'access token required',
};

/** A rejection Rollbar documents as a non-zero `err`. */
export const BODY_REJECTED = {
	err: 1,
	message: 'invalid status',
};

/** A 404 envelope. */
export const NOT_FOUND = {
	err: 1,
	message: 'not found',
};

/** A rate-limited call. Rollbar names the wait in headers, not the body. */
export const RATE_LIMITED = {
	err: 1,
	message: 'rate limit exceeded',
};

/** The rate-limit headers Rollbar sends on every response. */
export const RATE_LIMIT_HEADERS = {
	'X-Rate-Limit-Limit': '50000',
	'X-Rate-Limit-Remaining': '0',
	'X-Rate-Limit-Remaining-Seconds': '60',
};

export const ITEM = {
	id: ITEM_ID,
	public_item_id: 1,
	group_item_id: null,
	project_id: PROJECT_ID,
	counter: 3,
	title: 'TypeError: undefined is not a function',
	hash: 'a1b2c3d4',
	environment: 'production',
	platform: 'javascript',
	framework: 'react',
	level: 'error',
	status: 'active',
	group_status: 1,
	total_occurrences: 42,
	unique_occurrences: 12,
	last_occurrence_id: OCCURRENCE_ID,
	last_occurrence_timestamp: 1765602474,
	first_occurrence_id: 11,
	first_occurrence_timestamp: 1765000000,
	last_activated_timestamp: 1765602474,
	last_resolved_timestamp: null,
	last_modified_by: 7,
	assigned_user_id: null,
	assigned_team_id: null,
	resolved_in_version: null,
	title_lock: 0,
	level_lock: 0,
	controlling_id: 0,
	activating_occurrence_id: 0,
	integrations_data: null,
};

/** `GET /items` sends `id` as a numeric string and `integrations_data` null. */
export const ITEM_PAGE = {
	err: 0,
	result: {
		page: 1,
		total_count: 1,
		precise_count: true,
		items: [{ ...ITEM, id: String(ITEM_ID), project_slug: 'web' }],
	},
};

/** `GET /item/{id}` sends `id` as a number and `integrations_data` as a map. */
export const ITEM_RESULT = {
	err: 0,
	result: {
		...ITEM,
		integrations_data: {},
		url: 'https://example.test/item/3',
	},
};

export const ITEM_UPDATE_RESULT = {
	err: 0,
	result: {
		status: 'resolved',
		resolved_in_version: '1.2.3',
		title: 'TypeError: undefined is not a function',
		level: 'error',
		assigned_user_id: null,
		assigned_team_id: null,
		snooze_enabled: false,
		snooze_expiration_in_seconds: null,
	},
};

export const COMMENT = {
	id: 99,
	type: 'comment',
	source: 'comment',
	item_id: ITEM_ID,
	user_id: 7,
	username: 'sam',
	timestamp: 1765602474,
	text: 'Fixed in the next deploy.',
	via_api: true,
};

export const COMMENT_PAGE = {
	err: 0,
	result: { page: 1, total_count: 1, comments: [COMMENT] },
};

export const COMMENT_CREATED = {
	err: 0,
	result: { ...COMMENT, id: 100, text: 'Thanks!' },
};

export const EVENT = {
	id: 7,
	type: 'item_status_history',
	item_id: ITEM_ID,
	user_id: 7,
	username: 'sam',
	timestamp: 1765602474,
	status: 'resolved',
	comment: null,
};

export const EVENT_PAGE = {
	err: 0,
	result: { page: 1, total_count: 1, events: [EVENT] },
};

/** The notifier's payload sits under `data`. */
export const OCCURRENCE = {
	id: OCCURRENCE_ID,
	project_id: PROJECT_ID,
	item_id: ITEM_ID,
	timestamp: 1765602474,
	version: 2,
	billable: 1,
	data: {
		environment: 'production',
		level: 'error',
		framework: 'unknown',
		body: {
			trace: {
				frames: [{ filename: 'app.js', lineno: 1 }],
				exception: { class: 'TypeError', message: 'x is undefined' },
			},
		},
	},
};

/** This route names occurrences `instances` and sends no `total_count`. */
export const OCCURRENCE_PAGE = {
	err: 0,
	result: { page: 1, instances: [OCCURRENCE] },
};

/** `result` is the occurrence itself. */
export const OCCURRENCE_RESULT = {
	err: 0,
	result: OCCURRENCE,
};

export const PROJECT = {
	id: PROJECT_ID,
	name: 'Acme Web',
	account_id: 1,
	status: 'enabled',
	date_created: 1765000000,
	date_modified: 1765602474,
	settings_data: { integrations: { email: { enabled: false } } },
};

/** `GET /projects` answers a bare array in `result`. */
export const PROJECT_PAGE = {
	err: 0,
	result: [PROJECT],
};

export const DEPLOY = {
	id: DEPLOY_ID,
	project_id: PROJECT_ID,
	environment: 'production',
	revision: 'abc1234',
	comment: 'Ship it',
	status: 'succeeded',
	local_username: 'sam',
	user_id: null,
	username: null,
	start_time: 1765602400,
	finish_time: 1765602474,
};

export const DEPLOY_PAGE = {
	err: 0,
	result: { page: 1, deploys: [DEPLOY] },
};

/** The one route that answers `data` with no `err` or `result`. */
export const DEPLOY_CREATED = { data: { deploy_id: DEPLOY_ID } };
