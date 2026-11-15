// Shapes taken from Businessmap's OpenAPI document
// (https://demo.kanbanize.com/openapi/json), not from the dashboard.

export const board = {
	board_id: 1075,
	workspace_id: 3,
	is_archived: 0,
	name: 'Product delivery',
	description: 'Everything the team ships',
	type: 1,
	revision: 12,
};

export const boards = {
	data: [board, { ...board, board_id: 1076, name: 'Ops' }],
};

export const workflow = {
	workflow_id: 1695,
	name: 'Software development',
	type: 0,
	position: 0,
	is_enabled: 1,
	is_collapsible: 1,
};

export const workflows = { data: [workflow] };

export const column = {
	column_id: 15876,
	workflow_id: 1695,
	section: 3,
	position: 1,
	name: 'In progress',
	description: 'Being worked on',
	color: '34a97b',
	limit: 5,
};

export const columns = { data: [column] };

export const lane = {
	lane_id: 9838,
	workflow_id: 1695,
	position: 0,
	name: 'Expedite',
	description: null,
	color: 'ff0000',
};

export const lanes = { data: [lane] };

export const card = {
	card_id: 539522,
	custom_id: 'ACME-42',
	board_id: 1075,
	workflow_id: 1695,
	title: 'Ship the pricing page',
	owner_user_id: 12,
	type_id: 4,
	color: '34a97b',
	section: 3,
	column_id: 15876,
	lane_id: 9838,
	position: 2,
	description: 'The page is written; it needs the new plan table.',
	size: 3,
	priority: 2,
	deadline: '2026-12-01T17:00:00+00:00',
	reporter: { type: 'internal', value: 12 },
	created_at: '2026-11-02T09:12:04+00:00',
	revision: 7,
	last_modified: '2026-11-10T14:20:00+00:00',
	in_current_position_since: '2026-11-08T08:00:00+00:00',
	is_blocked: 0,
	finished_subtask_count: 1,
	unfinished_subtask_count: 2,
	tag_ids: [31, 32],
};

export const cards = {
	data: {
		pagination: { all_pages: 1, current_page: 1, results_per_page: 200 },
		data: [card, { ...card, card_id: 539523, title: 'Fix the invoice PDF' }],
	},
};

export const comment = {
	comment_id: 91001,
	type: 'plain',
	author: { type: 'internal', value: 12 },
	text: 'Blocked on the plan table copy.',
	created_at: '2026-11-10T14:25:00+00:00',
	last_modified: null,
};

export const comments = { data: [comment] };

export const subtask = {
	subtask_id: 4401,
	description: 'Get the plan table from finance',
	owner_user_id: 12,
	deadline: '2026-11-20T17:00:00+00:00',
	finished_at: null,
	position: 0,
};

export const subtasks = { data: [subtask] };

export const tag = {
	tag_id: 31,
	label: 'pricing',
	color: 'eceff1',
	availability: 0,
	is_enabled: 1,
};

export const tags = { data: [tag, { ...tag, tag_id: 32, label: 'launch' }] };

export const user = {
	user_id: 12,
	username: 'praman',
	realname: 'Priya Raman',
	email: 'priya@acme.example',
	avatar: '/avatars/abc/80x80',
	is_enabled: 1,
};

export const users = { data: [user] };

export const me = {
	data: {
		user_id: 12,
		email: 'priya@acme.example',
		username: 'praman',
		realname: 'Priya Raman',
		avatar: '/avatars/abc/80x80',
	},
};

export const limits = {
	data: [
		{ type: 'hourly', limit: 600 },
		{ type: 'minutely', limit: 30 },
	],
};

export const webhook = {
	webhook_id: 77,
	url: 'https://corsair.example/hooks/kanbanize',
	is_enabled: 1,
	board_id: 1075,
};

export const webhooks = { data: [webhook] };

/** The 401 body Businessmap sends when the key is present but wrong. */
export const invalidKey = {
	error: { code: 'A001', message: 'Invalid API Key.' },
};

/** The 401 body it sends when no key arrived at all. */
export const notLoggedIn = {
	error: {
		code: 'A002',
		message: 'You are not logged in.',
		reference: 'GE-A002',
	},
};

/** The minutely rate limit, which carries the seconds to wait. */
export const minutelyLimit = {
	error: {
		code: 'RL02',
		message:
			"You have exceeded the minutely request limit. The limit is 30 and you've made 31 requests prior to this one. You can try again after 58 seconds.",
		reference: 'GE-RL02',
		details: { limit: 30, requests: 31, retry_after: 58 },
	},
};

/** A board that is not there, with the ID in `details`. */
export const boardNotFound = {
	error: {
		code: 'B001',
		message: "A board with id 1'204'9702 does not exist.",
		reference: 'GE-B001',
		details: { board_id: 12049702 },
	},
};

/** A validation failure that names the field it rejected. */
export const invalidField = {
	error: {
		code: 'V001',
		message: 'The field must be an integer.',
		reference: 'GE-V001',
		details: { field: 'priority' },
	},
};

/** A limit that refuses the move, which is a 409 on a card update. */
export const limitExceeded = {
	error: {
		code: 'L001',
		message: 'The WIP limit of the column has been reached.',
		reference: 'GE-L001',
	},
};
