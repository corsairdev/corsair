// Fixtures follow the schemas Rollbar embeds in each reference page
// (https://docs.rollbar.com/llms.txt). The 401 body is the live response.

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

/** A rate limit, whose wait is named in the message rather than a header. */
export const RATE_LIMITED = {
	err: 1,
	message: 'rate limit exceeded, retry after 60 seconds',
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

export const ITEM_PAGE = {
	err: 0,
	result: {
		page: 1,
		total_count: 1,
		items: [ITEM],
	},
};

export const ITEM_RESULT = { err: 0, result: ITEM };

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
	item_id: ITEM_ID,
	project_id: PROJECT_ID,
	user_id: 7,
	body: 'Fixed in the next deploy.',
	timestamp: 1765602474,
};

export const COMMENT_PAGE = {
	err: 0,
	result: { page: 1, total_count: 1, comments: [COMMENT] },
};

export const COMMENT_CREATED = { err: 0, result: { id: 100, body: 'Thanks!' } };

export const EVENT = {
	id: 7,
	event_name: 'status_change',
	event: 'status_change',
	timestamp: 1765602474,
	user_id: 7,
	data: { from: 'active', to: 'resolved' },
};

export const EVENT_PAGE = {
	err: 0,
	result: { page: 1, total_count: 1, events: [EVENT] },
};

/** This route names occurrences `instances`. */
export const OCCURRENCE = {
	id: OCCURRENCE_ID,
	project_id: PROJECT_ID,
	item_id: ITEM_ID,
	environment: 'production',
	level: 'error',
	timestamp: 1765602474,
	platform: 'javascript',
	framework: 'react',
	language: 'js',
	server: {},
	client: {},
	request: {},
	person: {},
	body: {},
};

export const OCCURRENCE_PAGE = {
	err: 0,
	result: { page: 1, total_count: 1, instances: [OCCURRENCE] },
};

export const OCCURRENCE_RESULT = {
	err: 0,
	result: { instance: OCCURRENCE },
};

export const PROJECT = {
	id: PROJECT_ID,
	name: 'Acme Web',
	account_id: 1,
	status: 'enabled',
	date_created: 1765000000,
	date_modified: 1765602474,
	settings: {},
	access_tokens: [],
};

export const PROJECT_PAGE = {
	err: 0,
	result: { page: 1, total_count: 1, projects: [PROJECT] },
};

export const DEPLOY = {
	id: DEPLOY_ID,
	project_id: PROJECT_ID,
	environment: 'production',
	revision: 'abc1234',
	comment: 'Ship it',
	status: 'succeeded',
	local_username: 'sam',
	rollbar_username: 'sam',
	start_time: 1765602400,
	end_time: 1765602474,
};

export const DEPLOY_PAGE = {
	err: 0,
	result: { page: 1, total_count: 1, deploys: [DEPLOY] },
};

export const DEPLOY_CREATED = { err: 0, result: { id: DEPLOY_ID } };
