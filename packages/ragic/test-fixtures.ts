/**
 * Response bodies for the tests, from
 * https://www.ragic.com/intl/en/doc-http-api and the live refusals captured from
 * https://www.ragic.com.
 */

/** Records keyed by row id, each repeating its id in `_ragicId`. */
export const RECORDS = {
	'12345': {
		'1000001': 'Acme Corp',
		'1000002': '2024-01-15',
		'1000003': 'Active',
		_ragicId: 12345,
	},
	'12346': {
		'1000001': 'Beta Inc',
		'1000002': '2024-01-16',
		'1000003': 'Pending',
		_ragicId: 12346,
	},
};

/** The same shape with field names rather than IDs, the default naming. */
export const RECORDS_BY_NAME = {
	'1': {
		_ragicId: 1,
		_star: false,
		'Account Name': 'Alphabet Inc.',
		_index_title_: 'Alphabet Inc.',
		'Short Name': '',
		'Account ID': 'C-00002',
	},
	'0': {
		_ragicId: 0,
		_star: false,
		'Account Name': 'Ragic, Inc.',
		_index_title_: 'Ragic, Inc.',
		'Short Name': 'Ragic',
		'Account ID': 'C-00001',
	},
};

/** A record with a subtable: `_subtable_<id>` maps row id to that row's fields. */
export const RECORD_WITH_SUBTABLE = {
	'41': {
		_ragicId: 41,
		'Account Name': 'Dunder Mifflin',
		_subtable_2000154: {
			'0': {
				_ragicId: 0,
				'Contact Name': 'Jeff Kuo',
				Title: 'Technical Manager',
				Phone: '886-668-037',
			},
			'1': {
				_ragicId: 1,
				'Contact Name': 'Amy Tsai',
				Title: 'Marketing',
				Phone: '',
			},
		},
	},
};

export const RECORD = {
	'12345': {
		'1000001': 'Acme Corp',
		'1000002': '2024-01-15',
		_ragicId: 12345,
	},
};

// Live (trimmed): a create or an update answers the saved record under `data`.
export const CREATED = {
	status: 'SUCCESS',
	msg: '&nbsp;',
	ragicId: 12347,
	rv: '\u3000',
	data: {
		'1000001': 'Dunder Mifflin',
		_ragicId: 12347,
		_star: false,
	},
};

export const UPDATED = {
	status: 'SUCCESS',
	msg: '&nbsp;',
	ragicId: 3,
	rv: '\u3000',
	data: { '1000001': 'Dwight Schrute', _ragicId: 3, _star: false },
};

// Live: a delete moves the record to the sheet's recycle bin.
export const DELETED = {
	msg: 'The record has been moved to recycle bin.',
	ragicId: 3,
};

// Live: a create that left a required field empty, at HTTP 200.
export const INVALID_FIELD = {
	status: 'INVALID',
	msg: 'Field Account Owner contains empty value',
	code: 202,
};

// Live (trimmed): the comment just added, keyed by its row id. 61 timestamp,
// 65 commenter, 66 text, 73 ms; 67 (attachment) is absent without a file.
export const COMMENT_ADDED = {
	'4': {
		_ragicId: 4,
		_parentRagicId: 4,
		'61': '2026/11/12 01:58:25',
		'73': 1794466705815,
		'65': 'John Smith',
		'66': 'Please review this order.',
	},
};

export const TASK_PROGRESS = {
	status: 'RUNNING',
	progress: 45,
	total: 100,
	message: 'Processing records...',
};

export const TASK_COMPLETED = {
	status: 'COMPLETED',
	progress: 100,
	total: 100,
	message: 'Done.',
};

export const SCHEMA = {
	sheet: {
		sheetPath: '/sales',
		sheetIndex: 1,
		sheetName: 'Sales',
		keyFieldId: 1000001,
	},
	fields: [
		{
			fieldId: 1000001,
			fieldName: 'Account Name',
			type: 'text',
			required: true,
			readOnly: false,
			computed: false,
			hidden: false,
		},
		{
			fieldId: 1000002,
			fieldName: 'Close Date',
			type: 'date',
			required: false,
			computed: false,
		},
		{
			fieldId: 1000003,
			fieldName: 'Stage',
			type: 'select',
			selectionOptionsPreview: ['Active', 'Pending', 'Closed'],
		},
	],
	subtables: [
		{
			// A number, as in the reference's sample response.
			subtableKey: 2000154,
			fields: [
				{ fieldId: 2000147, fieldName: 'Contact Name', type: 'text' },
				{ fieldId: 2000148, fieldName: 'Title', type: 'text' },
			],
		},
	],
	status: 'SUCCESS',
	code: 200,
};

// Live: a protected sheet read with no key, and also with a wrong key. Both
// arrive at HTTP 200 as the guest account.
export const GUEST_106 = {
	status: 'ERROR',
	msg: 'This sheet is access right protected. You will need to provide an API key of a user who has access right to this sheet in your request to access this sheet. You are currently accessing as: guest account',
	code: 106,
};

// Live: the schema route with a non-manager key.
export const NO_RIGHT_403 = { status: 'ERROR', msg: 'no right', code: 403 };

// Live: an unknown account.
export const UNEXPECTED_500 = {
	status: 'ERROR',
	msg: 'Something Unexpected Happened... Error ID: 1794349709969',
	code: 500,
};

// The documented envelope.
export const ACCOUNT_EXPIRED = {
	status: 'ERROR',
	code: 303,
	msg: 'Your account has expired.',
};

export const INVALID_ACCOUNT = {
	status: 'ERROR',
	code: 101,
	msg: 'Invalid Account Name: nosuchacct',
};

export const INVALID_PATH = {
	status: 'ERROR',
	code: 102,
	msg: 'Invalid Path: /x',
};

export const INVALID_SHEET = {
	status: 'ERROR',
	code: 103,
	msg: 'Invalid Form Index: 9',
};

export const BAD_PARAMS = {
	status: 'ERROR',
	code: 201,
	msg: 'Error Processing Request Parameters',
};

export const CANNOT_EXECUTE = {
	status: 'ERROR',
	code: 202,
	msg: 'Error Executing Request',
};

export const CANNOT_CREATE = {
	status: 'ERROR',
	code: 109,
	msg: 'Cannot Create More Records',
};

export const CUSTOM_FORM = {
	status: 'ERROR',
	code: 104,
	msg: 'Cannot POST Data To A Custom Form',
};

export const AUTH_REQUIRED = {
	status: 'ERROR',
	code: 105,
	msg: 'Authentication Required Before Using API',
};
