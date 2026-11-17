/**
 * Shapes taken from the documented examples in
 * https://support.simplekpi.com/ai-core/api. Values keep every documented field
 * type honest, including the nulls the API sends for unset relations.
 */

export const kpi = {
	id: 1234,
	category_id: 5478,
	icon_id: 1,
	unit_id: 123,
	frequency_id: 'W',
	name: 'New Sales',
	description: 'Closed-won deals per week',
	target_default: 100,
	value_direction: 'U',
	aggregate_function: 'SUM',
	is_calculated: false,
	sort_order: 1,
	is_active: true,
	created_at: '2026-02-21T10:57:00',
	updated_at: '2026-02-21T10:58:00',
};

export const category = {
	id: 5478,
	name: 'Sales',
	sort_order: 1,
	created_at: '2026-02-21T10:57:00',
	updated_at: '2026-02-21T10:58:00',
};

export const breakdownItem = {
	id: 77,
	name: 'EMEA',
	breakdown_id: 12,
	user_id: null,
	is_system: false,
	created_at: '2026-02-21T10:57:00',
	updated_at: '2026-02-21T10:58:00',
};

export const entry = {
	id: 987654,
	user_id: null,
	source_id: 0,
	kpi_id: 1234,
	entry_date: '2026-08-03T00:00:00',
	actual: 42,
	target: 50,
	notes: null,
	created_at: '2026-08-04T09:12:00',
	updated_at: '2026-08-04T09:12:00',
};

/** What a valid write with every value empty answers, with a 200. */
export const nothingStored = {
	stored: false,
	source_id: 0,
	kpi_id: 1234,
	entry_date: '2026-08-03',
	detail: 'Nothing to store: actual, target and notes were all empty.',
};

export const frequency = { id: 'W', name: 'Weekly' };
export const icon = { id: 1, name: 'Bar chart' };

export const unit = {
	id: 123,
	name: 'Pounds',
	entry_format: '#,##0.00',
	display_format: '#,##0',
	is_percentage: false,
	created_at: '2026-02-21T10:57:00',
	updated_at: '2026-02-21T10:57:00',
};

export const reportRow = {
	kpi_id: 1234,
	kpi_name: 'New Sales',
	kpi_description: 'Closed-won deals per week',
	item_id: null,
	item_name: null,
	period_id: 'W',
	period: 'Weekly',
	label_format: '#,##0',
	is_percentage: false,
	has_target: true,
	direction: 'U',
	direction_name: 'Up',
	entry_date: '2026-08-03',
	actual: 42,
	target: 50,
	notes: null,
};

export const user = {
	id: 12,
	user_type: 'Admin',
	user_status_id: 'A',
	first_name: 'Alex',
	last_name: 'Doe',
	email: 'alex@example.com',
	created_at: '2026-02-21T10:57:00',
	updated_at: '2026-02-21T10:58:00',
};

/** A 400 body carrying the field map, which is the part worth showing. */
export const validationProblem = {
	type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
	title: 'One or more validation errors occurred.',
	status: 400,
	errors: {
		aggregate_function: [
			'The aggregate function is case sensitive and can only be AVG or SUM.',
		],
		value_direction: [
			'The value direction is case sensitive and can only be U(p), D(own) or N(one).',
		],
	},
};

/** A 404 with the extra trace id the live API sends. */
export const notFoundProblem = {
	type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5',
	title: 'Not Found',
	status: 404,
	detail: 'No KPI with id 9999 on this account.',
	instance: '/v1/kpis/9999',
	trace_id: '00-abc-def-01',
};
