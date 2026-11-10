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

// The docs do not publish a create response; Ragic echoes the record it wrote.
export const CREATED = {
	recordId: 12347,
	_ragicId: 12347,
	'1000001': 'Dunder Mifflin',
};

export const UPDATED = {
	_ragicId: 3,
	'1000001': 'Dwight Schrute',
};

export const DELETED = { status: 'SUCCESS', code: 200 };

// Comment fields by fixed id: 61 timestamp, 65 commenter, 66 text, 67 attachment, 73 ms.
export const COMMENT_ADDED = {
	'61': '2025/02/13 14:30',
	'65': 'John Smith',
	'66': 'Please review this order.',
	'67': '',
	'73': '1739425800000',
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
			subtableKey: '2000154',
			fields: [
				{ fieldId: 2000147, fieldName: 'Contact Name', type: 'text' },
				{ fieldId: 2000148, fieldName: 'Title', type: 'text' },
			],
		},
	],
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
