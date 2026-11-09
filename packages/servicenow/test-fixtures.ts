/**
 * Fixtures built from the documented Table API contract. Unlike the Foursquare
 * build, these were NOT captured from a live instance: a ServiceNow instance is
 * per-customer and a free Personal Developer Instance needs a signup, so no
 * instance was available to probe.
 *
 * The shapes here follow the published API: a success wraps `result`, a failure
 * wraps `error` with a real HTTP status, and a record is an open map whose keys
 * depend on the table and on `sysparm_fields`.
 */

/** A record as the Table API returns it, with raw values. */
export const incidentRecord = {
	sys_id: '9d385017c611228701d22104cc95c371',
	number: 'INC0010001',
	short_description: 'Printer on floor 3 is offline',
	state: '2',
	priority: '3',
	active: 'true',
	sys_created_on: '2026-01-15 10:00:00',
	sys_updated_on: '2026-01-15 10:05:00',
	caller_id: {
		value: '6816f79cc0a8016401c5a33be7409464',
		link: 'https://acme.service-now.com/api/now/table/sys_user/6816f79cc0a8016401c5a33be7409464',
	},
};

/** The same record with `sysparm_display_value=all`: every field is a pair. */
export const incidentRecordDisplayAll = {
	sys_id: {
		value: '9d385017c611228701d22104cc95c371',
		display_value: '9d385017c611228701d22104cc95c371',
	},
	number: { value: 'INC0010001', display_value: 'INC0010001' },
	state: { value: '2', display_value: 'In Progress' },
};

export const listResponse = { result: [incidentRecord] };

export const emptyListResponse = { result: [] };

export const getResponse = { result: incidentRecord };

export const createResponse = {
	result: {
		sys_id: 'a1b2c3d4e5f60718293a4b5c6d7e8f90',
		number: 'INC0010002',
		short_description: 'Printer on floor 3 is offline',
		state: '1',
	},
};

export const updateResponse = {
	result: {
		sys_id: '9d385017c611228701d22104cc95c371',
		number: 'INC0010001',
		state: '3',
	},
};

export const tablesResponse = {
	result: [
		{
			sys_id: '5a1b2c3d4e5f60718293a4b5c6d7e8f9',
			name: 'incident',
			label: 'Incident',
			super_class: 'task',
		},
		{
			sys_id: '6b2c3d4e5f60718293a4b5c6d7e8f901',
			name: 'u_custom_asset',
			label: 'Custom Asset',
			super_class: '',
		},
	],
};

/** A 401 from a wrong username or password. */
export const authErrorBody = {
	error: {
		message: 'User Not Authenticated',
		detail: 'Required to provide Auth information',
	},
	status: 'failure',
};

/** A 404 from a table name that does not exist. */
export const notFoundBody = {
	error: {
		message: 'No Record found',
		detail: 'Record does not exist',
	},
	status: 'failure',
};

/** A 400 when a required field or a value is rejected. */
export const validationErrorBody = {
	error: {
		message: 'Invalid input data',
		detail: 'The value in field state is not valid',
	},
	status: 'failure',
};

/** A 204 answer to a DELETE. */
export const noContent = null;
