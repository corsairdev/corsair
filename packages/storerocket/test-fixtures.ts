// Fixtures built from the documented examples at docs.storerocket.io.

export const user = {
	id: 'USER_ID',
	name: 'Example User',
	email: 'user@example.com',
	company: 'Example Company',
	profile_photo_url: 'https://example.com/avatar.png',
};

export const project = {
	id: 'PROJECT_ID',
	name: 'My Project',
	locations: 12,
	status: 'active',
	plan: 'Business',
};

export const location = {
	id: 'LOCATION_ID',
	name: 'Downtown Store',
	address: '123 Main St, Seattle, WA 98101',
	city: 'Seattle',
	postcode: '98101',
	phone: '555-0101',
	lat: 47.6062,
	lng: -122.3321,
	marker_id: null,
	marker_url: null,
	location_type: 'Standard',
	cover_image_url: null,
	slug: 'downtown-store',
	visible: true,
	hours: {
		name: 'Store hours',
		mon: '09:00-17:00',
		tue: '09:00-17:00',
		wed: '09:00-17:00',
		thu: '09:00-17:00',
		fri: '09:00-17:00',
		sat: '10:00-14:00',
		sun: 'closed',
	},
	filters: [],
	fields: [{ id: 'FIELD_ID', name: 'Manager', value: 'Sam' }],
	callsToAction: [
		{ id: 'CTA_ID', title: 'Book', value: 'https://example.com/book' },
	],
};

export const listPage = {
	data: [location],
	links: {
		first:
			'https://storerocket.io/api/v2/projects/PROJECT_ID/locations?limit=1&page=1',
		last: 'https://storerocket.io/api/v2/projects/PROJECT_ID/locations?limit=1&page=2',
		prev: null,
		next: 'https://storerocket.io/api/v2/projects/PROJECT_ID/locations?limit=1&page=2',
	},
	meta: {
		current_page: 1,
		from: 1,
		last_page: 2,
		path: 'https://storerocket.io/api/v2/projects/PROJECT_ID/locations',
		per_page: 1,
		to: 1,
		total: 2,
	},
};

export const geocoding = { status: 'found', match: 'address' };

export const rule = {
	id: 'k4ZqP0mE7d',
	name: 'Thanksgiving',
	holiday_key: 'US:thanksgiving-day',
	holiday_region: null,
	start_date: '2026-11-26',
	end_date: '2026-11-26',
	until_further_notice: false,
	hours: 'closed',
	repeats_yearly: true,
	note: null,
	applies_to: { type: 'countries', values: ['US'] },
	source: 'api',
	created_at: '2026-11-13T10:00:00+00:00',
	updated_at: '2026-11-13T10:00:00+00:00',
};

export const unauthenticated = { message: 'Unauthenticated.' };

export const validationError = {
	message: 'The city field is required.',
	errors: { city: ['The city field is required.'] },
};
