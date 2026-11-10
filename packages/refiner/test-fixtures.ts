/**
 * Response bodies for the tests, transcribed from https://refiner.io/docs/api/.
 * The docs' JSON samples carry trailing commas in places, so these are the same
 * values in valid JSON.
 */

export const ACCOUNT = {
	subscription: {
		plan: 'Friends & Family',
		mtu_count_updated_at: '2024-02-05T16:29:18.000000Z',
		mtu_count: 9,
		mtu_limit: 5000,
		mte_count_updated_at: '2024-02-05T16:29:18.000000Z',
		mte_count: 128,
		mpv_count_updated_at: '2024-02-05T16:29:18.000000Z',
		mpv_count: 42,
		mpv_limit: 1000000,
		msr_count_updated_at: '2024-02-05T16:29:18.000000Z',
		msr_count: 23,
		msr_limit: 1000,
	},
	environments: [
		{
			uuid: '55cc62c0-ebc6-11ec-8c30-b1d2c2514c88',
			name: 'Production',
			mtu: 9,
			mte: 141,
			mpv: 42,
			msr: 23,
		},
		{
			uuid: '489e4c80-8dd0-11ed-99a5-8b847483cb52',
			name: 'Testing',
			mtu: 0,
			mte: 0,
			mpv: 0,
			msr: 0,
		},
	],
};

export const IDENTIFIED = {
	message: 'ok',
	contact_uuid: '15cce3d0-ed5d-11ea-aaef-e58a2a43e996',
};

export const OK = { message: 'ok' };

export const ACCOUNT_OBJECT = {
	uuid: '15d08cc0-ed5d-11ea-b2ce-c1b46bd4b7c4',
	remote_id: 'Your-Account-Id',
	domain: 'awesome.com',
	display_name: 'Awesome Inc.',
	first_seen_at: '2020-09-02T20:44:24.000000Z',
	last_seen_at: '2020-09-02T21:57:50.000000Z',
	attributes: {
		an_account_attribute: 'Computer Software',
		another_one: '2020',
	},
};

export const CONTACT = {
	uuid: '15cce3d0-ed5d-11ea-aaef-e58a2a43e996',
	remote_id: 'Your-Contact-ID',
	email: 'jane@awesome.com',
	display_name: 'Jane Doe',
	first_seen_at: '2020-09-02T20:44:24.000000Z',
	last_seen_at: '2020-09-02T21:57:50.000000Z',
	attributes: {
		a_user_attribute: 'Manager',
		another_one: 'Marketing',
		// A survey answer lands in the same attributes map, as a string.
		a_survey_answer: '9',
		another_answer: 'ABC',
	},
	segments: [
		{
			uuid: '0ff87720-9ae5-11ea-bce5-65a395204572',
			name: 'Power Users Segment',
		},
	],
	account: ACCOUNT_OBJECT,
};

export const CONTACTS = {
	items: [CONTACT],
	pagination: {
		items_count: 1100,
		current_page: 1,
		last_page: 22,
		page_length: 55,
		next_page_cursor: 'eyJpdiI6ImpCMlY3cERCbEo0Qk1Ge...',
	},
};

// A response whose timestamps are `YYYY-MM-DD HH:MM:SS`, not ISO 8601.
export const RESPONSE = {
	uuid: 'cb47c260-ed64-11ea-8187-a7fc8351fba4',
	first_shown_at: '2020-09-02 21:53:33',
	last_shown_at: '2020-09-02 21:53:33',
	show_counter: 1,
	first_data_reception_at: '2020-09-02 21:53:33',
	last_data_reception_at: '2020-09-02 21:53:33',
	completed_at: '2020-09-02 21:53:33',
	received_at: '2020-09-02 21:53:33',
	dismissed_at: null,
	form: {
		uuid: '3894dc20-8fe9-11ea-892e-d13af52e06ae',
		name: 'My first survey',
	},
	data: {
		first_question: 'First Reply',
		second_question: 'Second Reply',
	},
	contact: {
		uuid: 'e5365340-ed47-11ea-9a73-61d23f380055',
		remote_id: 'YOUR-USER-ID-123',
		email: 'jane@awesome.com',
		display_name: 'Jane Doe',
		account: {
			uuid: '5ab55ab0-ebf3-11ea-a442-4fa2c72e1cf7',
			remote_id: 'Your account ID',
			display_name: 'Awesome Inc.',
			domain: null,
		},
	},
};

// A survey view with no answers: `data` values are null.
export const RESPONSE_VIEW = {
	uuid: 'cb47c260-ed64-11ea-8187-a7fc8351fba4',
	first_shown_at: '2020-09-02 21:53:33',
	last_shown_at: '2020-09-02 22:53:33',
	show_counter: 2,
	first_data_reception_at: null,
	last_data_reception_at: null,
	completed_at: null,
	received_at: null,
	dismissed_at: null,
	form: {
		uuid: '3894dc20-8fe9-11ea-892e-d13af52e06ae',
		name: 'My first survey',
	},
	data: { first_question: null, second_question: null },
	contact: {
		uuid: 'e5365340-ed47-11ea-9a73-61d23f380055',
		remote_id: 'YOUR-USER-ID-123',
		email: 'jane@awesome.com',
		display_name: 'Jane Doe',
		attributes: [],
		account: {
			uuid: '5ab55ab0-ebf3-11ea-a442-4fa2c72e1cf7',
			remote_id: 'Your account ID',
			display_name: 'Awesome Inc.',
			domain: null,
			attributes: [],
		},
	},
};

export const RESPONSES = {
	items: [RESPONSE, RESPONSE_VIEW],
	pagination: {
		items_count: 1100,
		current_page: 1,
		last_page: 22,
		page_length: 55,
		next_page_cursor: 'eyJpdiI6ImpCMlY3cERCbEo0Qk1Ge...',
	},
};

export const RESPONSE_STORED = {
	message: 'ok',
	uuid: 'fcbb8b30-3dfe-11f0-a0bf-6b2696a5a3c8',
};

export const REPORT_NPS = {
	data: { detractors: 5, passives: 21, promoters: 40 },
	count: 66,
	nps: 53,
	date_range_start: '2024-12-12T08:08:00.000000Z',
	date_range_end: '2025-04-18T00:00:00.000000Z',
};

export const REPORT_CSAT = {
	data: {
		veryunsatisfied: 0,
		unsatisfied: 2,
		neutral: 10,
		satisfied: 37,
		verysatisfied: 23,
	},
	count: 72,
	csat: 83,
	date_range_start: '2024-12-12T08:08:00.000000Z',
	date_range_end: '2025-04-18T00:00:00.000000Z',
};

export const REPORT_RATINGS = {
	data: { '1': 0, '5': 1, '10': 0 },
	sum: 5,
	count: 1,
	average: 5,
	date_range_start: '2024-12-12T00:00:00.000000Z',
	date_range_end: '2024-04-17T15:14:27.541221Z',
};

export const REPORT_DISTRIBUTION = {
	data: { '4': 1, '5': 2, '8': 15, '9': 16, '10': 24 },
	responses: 66,
	datapoints: 67,
	date_range_start: '2024-12-12T08:08:00.000000Z',
	date_range_end: '2025-04-18T00:00:00.000000Z',
};

export const REPORT_COUNT = {
	views: 148,
	responses: 130,
	date_range_start: '2024-12-12T08:08:00.000000Z',
	date_range_end: '2025-04-18T00:00:00.000000Z',
};

export const FORMS = {
	items: [
		{ uuid: '4f5637d0-3d0d-11ea-b965-614418dec30c', name: 'My first survey' },
		{ uuid: '8d752bf0-3d0e-11ea-aeff-d7282664f71b', name: 'My second survey' },
	],
	pagination: {
		items_count: 10,
		current_page: 1,
		last_page: 1,
		page_length: 10,
	},
};

export const FORMS_WITH_INFO = {
	items: [
		{
			uuid: '4f5637d0-3d0d-11ea-b965-614418dec30c',
			name: 'My first survey',
			channels: ['link'],
			published_at: '2024-06-05T13:02:57.000000Z',
			archived_at: null,
			created_at: '2024-06-05T13:02:53.000000Z',
			updated_at: '2024-06-05T13:02:57.000000Z',
			responses_count: 0,
			views_count: 0,
			first_form_view_at: null,
			last_form_view_at: null,
			folder: null,
			page_url: 'https://survey.refiner.io/s/0mn1eq-odkpm3',
		},
	],
	pagination: {
		items_count: 10,
		current_page: 1,
		last_page: 1,
		page_length: 10,
	},
};

export const FORM_PUBLISHED = {
	message: 'Your form was published successfully.',
};

export const FORM_DUPLICATED = {
	message: 'ok',
	source_form_uuid: 'FORM_UUID',
	new_form_uuid: 'NEW_FORM_UUID',
};

export const FORM_HISTORY = {
	items: [
		{
			uuid: '4cfe55b0-2bc6-11f1-a89d-2107ac9c5d43',
			action: 'update',
			snapshot: {
				name: 'Net Promoter Score (NPS)',
				channels: ['web-app'],
				elements: [
					{
						name: 'How likely are you to recommend our service?',
						slug: 'nps',
						uuid: 'ede973f0-0b49-11f1-b3cb-d77341a53e22',
						order: 4,
						element_type: 'nps',
						is_account_related: false,
					},
				],
				updated_at: '2026-03-29T23:18:36.000000Z',
			},
			created_at: '2026-03-29T23:23:32.000000Z',
		},
	],
	pagination: {
		items_count: 18,
		current_page: 1,
		last_page: 9,
		page_length: 2,
		next_page_cursor: null,
	},
};

export const SEGMENTS = {
	items: [
		{
			uuid: '4f5637d0-3d0d-11ea-b965-614418dec30c',
			name: 'Power Users',
			is_manual: true,
		},
		{
			uuid: '8d752bf0-3d0e-11ea-aeff-d7282664f71b',
			name: 'Signed Up 30 Days Ago',
			is_manual: false,
		},
	],
	pagination: {
		items_count: 10,
		current_page: 1,
		last_page: 1,
		page_length: 10,
	},
};

export const SEGMENT_SYNCED = {
	message: 'ok',
	contact_uuid: '15cce3d0-ed5d-11ea-aaef-e58a2a43e996',
	segment_uuid: '4f5637d0-3d0d-11ea-b965-614418dec30c',
};

// Live: a bad key and no key at all both answer this.
export const NO_API_KEY = { error: 'No API key found in headers' };

// Live: an unknown route.
export const NOT_FOUND = { error: 'Resource or route not found.', code: 404 };

export const RATE_LIMITED = {
	error: 'You are doing this too often. Please slow down.',
	code: 429,
};

export const CONFLICT = {
	error: 'Another request for the same user is already in progress.',
};

export const BAD_REQUEST = { error: 'The form_uuid field is required.' };

export const METHOD_NOT_ALLOWED = { error: 'Method not allowed.' };

export const FORBIDDEN = {
	error: 'You do not have permission to access this resource.',
};

export const SERVER_ERROR = { error: 'Server error.' };
