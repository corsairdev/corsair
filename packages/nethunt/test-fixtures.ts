/**
 * Bodies below follow NetHunt's published API documentation
 * (https://nethunt.com/integration-api). The shapes that matter: every record
 * read answers a bare array, `fields` is a map of user-defined names, and the
 * create and update bodies differ (a flat map versus per-field actions).
 */

export const folders = [
	{ id: '596f644b8f6d05e16c24b810', name: 'Leads' },
	{ id: '596f644b8f6d05e16c24b811', name: 'Deals' },
];

export const folderFields = [
	{ name: 'Name' },
	{ name: 'Birthday' },
	{ name: 'Primary Email Address' },
];

export const records = [
	{
		id: '596f644b8f6d05e16c24b830',
		recordId: '596f644b8f6d05e16c24b830',
		createdAt: '2026-01-01T12:34:15.880Z',
		updatedAt: '2026-02-01T12:30:10.510Z',
		fields: {
			Name: 'John Doe',
			Birthday: '1980-01-01',
			Employed: true,
			Salary: 100000,
			Keywords: ['Java', 'Big Data'],
			'Primary Email Address': 'John Doe <john.doe@example.com>',
			'Co-workers': ['596f64368f6d05e16c24b833', '596f644b8f6d05e16c24b834'],
		},
	},
	{
		id: '596f644b8f6d05e16c24b831',
		recordId: '596f644b8f6d05e16c24b831',
		createdAt: '2026-02-01T12:35:15.880Z',
		fields: { Name: 'Jane Doe' },
	},
];

/** The audit trail: one change per field, with before and after values. */
export const recordChanges = [
	{
		recordId: '596f644b8f6d05e16c24b830',
		time: '2026-02-01T12:30:10.510Z',
		user: '596f644b8f6d05e16c24b820',
		recordAction: 'UPDATE',
		fieldActions: {
			Salary: { before: 100000, after: 200000 },
			Country: { before: 'ES', after: 'GB' },
			Keywords: { before: ['Java'], after: ['JavaScript'] },
		},
	},
	{
		recordId: '596f644b8f6d05e16c24b831',
		time: '2026-02-02T09:00:00.000Z',
		user: '596f644b8f6d05e16c24b820',
		recordAction: 'DELETE',
		fieldActions: {},
	},
];

export const createdRecord = {
	recordId: '596f644b8f6d05e16c24b830',
	createdAt: '2026-01-01T12:34:15.880Z',
	fields: {
		Name: 'John Doe',
		Birthday: '1980-01-01',
		Country: 'GB',
		Keywords: ['Java', 'Big Data'],
	},
};

export const updatedRecord = {
	recordId: '596f644b8f6d05e16c24b830',
	updatedAt: '2026-01-05T12:34:15.880Z',
	fields: {
		Name: 'John Doe',
		Salary: 200000,
		Keywords: ['Big Data', 'JavaScript'],
	},
};

export const createdComment = {
	commentId: '5970b408bbd55ad726e11bc3',
	createdAt: '2026-01-01T12:34:15.880Z',
};

export const createdCallLog = {
	callLogId: '60672149da70705e2d1767d4',
	createdAt: '2026-04-02T13:51:05.852Z',
};

/** A delete and a thread link both answer an empty object. */
export const emptyObject = {};

/** The verify route answers a one-element array holding the user. */
export const authTest = [
	{
		user: {
			personalName: 'John Doe',
			emailAddress: 'john.doe@example.com',
		},
	},
];

/** A bad email/key pair is a 401 with this plain-text body, not JSON. */
export const badCredentials =
	'Your email address or API key does not appear to be valid';
