// Every response in this file was recorded from the live Knack API against a
// real app, so the shapes are what Knack sends rather than what its docs show.
// The app's own ids are replaced with stable values of the same form.

/** `GET /objects` for the recorded app. */
export const objectsList = {
	objects: [
		{ name: 'Accounts', key: 'object_1' },
		{ name: 'Default Role', key: 'object_2' },
		{ name: 'Table 1', key: 'object_3' },
	],
};

/** `GET /objects/object_3`, trimmed to the fields the plugin reads. */
export const objectDetail = {
	object: {
		key: 'object_3',
		name: 'Table 1',
		type: 'StandardObject',
		user: false,
		_id: '6af358656e7887956647723f',
		identifier: 'field_23',
		uuid: '01a1c691-4d5c-7276-bc56-520448bd63e8',
		fields: [
			{ key: 'field_23', name: 'Name', type: 'short_text', required: true },
			{ key: 'field_24', name: 'Record ID', type: 'short_text' },
			{ key: 'field_25', name: 'Created On', type: 'date_time' },
			{ key: 'field_26', name: 'Updated On', type: 'date_time' },
			{ key: 'field_27', name: 'Created By', type: 'connection' },
			{ key: 'field_28', name: 'Updated By', type: 'connection' },
			{ key: 'field_29', name: 'Owned By', type: 'connection' },
		],
	},
};

/** `GET /objects/object_999` for a key that is not in the app: 200 and `{}`. */
export const objectMissing = {};

/** `GET /applications/{id}`, trimmed. */
export const application = {
	application: {
		name: 'Untitled App',
		description: '',
		id: '6af358626e7887956647723f',
		slug: 'untitled-app',
		counts: { object_1: 8, object_3: 0 },
		home_scene: { key: 'scene_1', slug: 'home' },
		objects: [
			{
				key: 'object_1',
				name: 'Accounts',
				type: 'UserObject',
				user: true,
				fields: [
					{ key: 'field_1', name: 'Name', type: 'name', required: true },
					{ key: 'field_2', name: 'Email', type: 'email', required: true },
				],
			},
			{
				key: 'object_3',
				name: 'Table 1',
				type: 'StandardObject',
				user: false,
				fields: [{ key: 'field_23', name: 'Name', type: 'short_text' }],
			},
		],
	},
};

/** One record exactly as the live API returns it. */
export const record = {
	id: '6af3598772ff96f3713a989d',
	field_23: 'Fixture Record',
	field_23_raw: 'Fixture Record',
	field_24: '6af3598772ff96f3713a989d',
	field_24_raw: '6af3598772ff96f3713a989d',
	field_25: '11/10/2026 11:21pm',
	field_25_raw: {
		date: '11/10/2026',
		date_formatted: '11/10/2026',
		hours: '11',
		minutes: '21',
		am_pm: 'PM',
		unix_timestamp: 1794333060000,
		iso_timestamp: '2026-11-10T17:51:00.000Z',
		timestamp: '11/10/2026 11:21 pm',
		time: 1401,
		time_formatted: '11:21pm',
		proper_unix_timestamp: 1794333060000,
		proper_iso_timestamp: '2026-11-10T17:51:00.000Z',
	},
	field_26: '11/10/2026 11:21pm',
	field_26_raw: {
		date: '11/10/2026',
		date_formatted: '11/10/2026',
		unix_timestamp: 1794333060000,
		iso_timestamp: '2026-11-10T17:51:00.000Z',
	},
	field_27:
		'<span class="167a79500000000000000002" data-kn="connection-value">Account Owner</span>',
	field_27_raw: [
		{ id: '167a79500000000000000002', identifier: 'Account Owner' },
	],
	field_28:
		'<span class="167a79500000000000000002" data-kn="connection-value">Account Owner</span>',
	field_28_raw: [
		{ id: '167a79500000000000000002', identifier: 'Account Owner' },
	],
	field_29:
		'<span class="167a79500000000000000002" data-kn="connection-value">Account Owner</span>',
	field_29_raw: [
		{ id: '167a79500000000000000002', identifier: 'Account Owner' },
	],
};

export const recordId = record.id;

/** `GET /objects/object_3/records` with one record. */
export const recordList = {
	total_pages: 1,
	current_page: 1,
	total_records: 1,
	records: [record],
};

/** An empty table: 0 pages, and `current_page` still reports the page asked for. */
export const emptyRecordList = {
	total_pages: 0,
	current_page: 1,
	total_records: 0,
	records: [],
};

/** A page past the end keeps the requested page number and reports 0 pages. */
export const pagePastEnd = {
	total_pages: 0,
	current_page: 5,
	total_records: 0,
	records: [],
};

/** A record id that does not exist answers this, with 200 and a `recast` flag. */
export const recordMissing = {
	total_pages: 0,
	current_page: 1,
	total_records: 0,
	records: [],
	recast: true,
};

/** `DELETE` answers this. */
export const deleteResult = { delete: true };

/** 400 for an id that is not 24 hex characters, as JSON. */
export const malformedRecordId = { errors: ['Malformed Record ID.'] };

/** 400 for an app id of the wrong shape, as plain text. */
export const malformedAppId = 'Malformed App ID.';

/** 401 with a missing or unknown key, as plain text. */
export const invalidApiKey = 'Invalid API Key';

/** 401 with no headers at all, as plain text. */
export const invalidApiRequest = 'Invalid API Request';

/** 429 is plain text too, unlike the JSON 400. */
export const rateLimited = 'Rate limit exceeded';
