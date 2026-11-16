/**
 * Bodies below follow Ninox's published OpenAPI spec
 * (https://go.ninox.com/api/docs-json). The shapes that matter: every
 * collection is `{ data, page_info }`, a row is `{ id, values }` where `values`
 * is keyed by the table's own field names, and a record id is a number.
 */

export const workspace = {
	data: {
		modules: [
			{
				name: 'CRM',
				description: 'Customer records',
				afterOpen: '',
			},
			{
				name: 'Inventory',
				description: 'Stock levels',
				afterOpen: 'alert("Opened")',
			},
		],
	},
};

export const modules = {
	data: [
		{ name: 'CRM', description: 'Customer records', afterOpen: '' },
		{ name: 'Inventory', description: 'Stock levels', afterOpen: '' },
	],
	page_info: { has_more: false, limit: 50, offset: 0 },
};

export const tables = {
	data: [
		{
			name: 'Contacts',
			description: 'People',
			canCreate: 'true',
			canDelete: 'true',
		},
	],
	page_info: { has_more: false, limit: 50, offset: 0 },
};

export const fields = {
	data: [
		{ name: 'Name', type: 'text', required: true, unique: false },
		{ name: 'Email', type: 'email', required: false, unique: true },
		{
			name: 'Status',
			type: 'choice',
			required: false,
			unique: false,
			binding: 'choice:Status',
		},
	],
	page_info: { has_more: false, limit: 50, offset: 0 },
};

/** Rows carry `id` as a string and `values` keyed by field name. */
export const rows = {
	data: [
		{
			id: '12',
			values: { Name: 'Dana Okafor', Email: 'dana@northwind.example' },
		},
		{
			id: '13',
			values: { Name: 'Sam Rivera', Email: 'sam@northwind.example' },
		},
	],
	page_info: { has_more: false, limit: 100, offset: 0 },
};

export const singleRow = {
	data: {
		id: '12',
		values: { Name: 'Dana Okafor', Email: 'dana@northwind.example' },
	},
};

export const createdRows = { data: { ids: ['14', '15'] } };
export const updatedRows = { data: { updatedIds: ['12'] } };
export const deletedRows = { data: { deletedIds: ['12', '13'] } };
export const upsertedRows = {
	data: { createdIds: ['16'], updatedIds: ['12'] },
};

/** The change feed carries `meta.asOf`, which is the next poll's `since`. */
export const changes = {
	data: [
		{ id: '12', changeType: 'update', changedAt: '2026-11-16T10:00:00Z' },
		{ id: '13', changeType: 'create', changedAt: '2026-11-16T10:05:00Z' },
	],
	meta: { asOf: '2026-11-16T10:05:00Z' },
	page_info: { has_more: false, limit: 100, offset: 0 },
};

/** A JSON error body. */
export const tableNotFound = {
	error: { message: 'Table not found' },
};

/** A conflict from a stale `_expected` value or an ambiguous upsert. */
export const conflict = {
	error: {
		message:
			'A value in _expected changed since it was read, pass override=true to overwrite',
	},
};

/** The edge answers a bare text body when the key is missing. */
export const unauthorizedText = 'Unauthorized';
