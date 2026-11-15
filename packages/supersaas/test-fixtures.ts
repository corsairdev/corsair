/**
 * Shapes taken from SuperSaaS's API documentation at
 * https://www.supersaas.com/info/dev/user_api and /appointment_api.
 */

export const user = {
	id: '123456',
	fk: '567',
	name: 'jane@example.com',
	email: 'jane@example.com',
	full_name: 'Jane Smith',
	address: '1 Main St',
	mobile: null,
	phone: null,
	country: 'DE',
	timezone: 'Europe/Berlin',
	field_1: null,
	field_2: null,
	super_field: null,
	credit: '0',
	role: 3,
	group: null,
	created_on: '2026-01-01 10:00:00',
	last_login: null,
};

export const booking = {
	id: '987654',
	start: '2026-03-10 09:00:00',
	finish: '2026-03-10 09:30:00',
	created_on: '2026-03-01 12:00:00',
	updated_on: '2026-03-01 12:00:00',
	user_id: '123456',
	user_name: 'jane@example.com',
	full_name: 'Jane Smith',
	email: 'jane@example.com',
	resource_id: '1',
	resource_name: 'Room A',
	slot_id: null,
	field_1: null,
	field_2: null,
	field_1_r: null,
	field_2_r: null,
	super_field: null,
	form_id: null,
};

export const slot = {
	id: '555',
	start: '2026-03-10 09:00:00',
	finish: '2026-03-10 10:00:00',
	created_on: '2026-03-01 12:00:00',
	updated_on: '2026-03-01 12:00:00',
	booked: 3,
	capacity: 10,
	resource_id: null,
	resource_name: null,
};

export const change = {
	type: 'booking',
	id: '987654',
	start: '2026-03-10 09:00:00',
	finish: '2026-03-10 09:30:00',
	updated_on: '2026-03-01 12:00:00',
};

export const freeSpace = {
	start: '2026-03-10 11:00:00',
	finish: '2026-03-10 11:30:00',
	resource_id: '1',
	resource_name: 'Room A',
};
