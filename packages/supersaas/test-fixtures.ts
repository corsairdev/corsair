/**
 * Shapes from the live API (11-16, a test account; names replaced). Ids come
 * back as numbers, and the schedule reads wrap their rows in `bookings` or
 * `slots`.
 */

export const user = {
	id: 15294233,
	fk: null,
	created_on: '2026-11-16T00:52:26Z',
	role: 3,
	last_login: null,
	name: 'jane@example.com',
	full_name: 'Jane Smith',
	mobile: null,
	address: null,
};

/** A booking on a capacity schedule, as `GET /api/bookings/{id}.json` answers. */
export const booking = {
	id: 153818785,
	slot_id: 74660627,
	created_on: '2026-11-16T00:52:39Z',
	user_id: 15294233,
	created_by: 'jane@example.com / *',
	waitlisted: false,
	price: null,
	deleted: false,
	full_name: 'Jane Smith',
};

/** A booking on a resource schedule. */
export const resourceBooking = {
	id: 121573357,
	start: '2026-12-01T10:00',
	finish: '2026-12-01T11:00',
	created_on: '2026-11-16T00:53:02Z',
	user_id: null,
	full_name: 'Jane Smith',
	email: 'jane@example.com',
	price: null,
	deleted: false,
};

export const slot = {
	id: 74660627,
	start: '2026-12-01T10:00',
	finish: '2026-12-01T11:00',
	title: 'Workshop',
	description: '',
	location: '',
	capacity: 2,
	level: 0,
	waiting: 0,
	color: 0,
};

/** `GET /api/changes/{schedule}.json` and `/agenda`. */
export const bookingsEnvelope = { bookings: [booking] };

/** `GET /api/range/{capacity schedule}.json` and `/free`. */
export const slotsEnvelope = { slots: [{ ...slot, count: 1 }] };
