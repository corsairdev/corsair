// Shapes taken from Geocodio's OpenAPI 2.1.0 document
// (https://api.geocod.io/openapi-spec.json) and live probes. A bad key answers
// 403, not 401, with `{"error":"Invalid API key","reference":"..."}`.

/** The error envelope, which carries a documentation link. */
export const invalidKey = {
	error: 'Invalid API key',
	reference: 'https://www.geocod.io/geocodio-403-forbidden-error/',
};

/** An old version answers this instead of failing, which is why warnings matter. */
export const oldVersionWarning = [
	'There is a newer API version available, please consider upgrading to v2.1. See changelog here: https://www.geocod.io/docs/#changelog',
];

/** What the live API answered (HTTP 422) for an address with no match. */
export const noMatch = {
	error: 'Could not geocode address. No matches found.',
};

export const unprocessableAddress = {
	error: 'Could not parse address',
	reference: 'https://www.geocod.io/geocodio-422-unprocessable-entity-error/',
};

/** One geocoded result, with the components Geocodio parsed. */
export const geocodeResponse = {
	results: [
		{
			stable_address_key: '1a2b3c4d5e6f7a8b',
			address_components: {
				number: '1109',
				predirectional: 'N',
				street: 'Highland',
				suffix: 'St',
				formatted_street: 'N Highland St',
				city: 'Arlington',
				county: 'Arlington County',
				state_province: 'VA',
				postal_code: '22201',
				country: 'United States',
				nation: 'US',
			},
			address_lines: ['1109 N Highland St', 'Arlington, VA 22201'],
			formatted_address: '1109 N Highland St, Arlington, VA 22201',
			location: { lat: 38.886665, lng: -77.094733 },
			accuracy: 1,
			accuracy_type: 'rooftop',
			match_type: 'exact',
			source: 'Virginia GIS Clearinghouse',
			fields: {
				timezone: {
					name: 'America/New_York',
					utc_offset: -5,
					observes_dst: true,
				},
			},
		},
	],
};

/** A weaker match, which the accuracy type and score make visible. */
export const approximateResponse = {
	results: [
		{
			address_components: {
				street: 'Highland',
				suffix: 'St',
				city: 'Arlington',
				state_province: 'VA',
				postal_code: '22201',
				country: 'United States',
				nation: 'US',
			},
			formatted_address: 'N Highland St, Arlington, VA 22201',
			location: { lat: 38.886, lng: -77.095 },
			accuracy: 0.71,
			accuracy_type: 'nearest_street',
			match_type: 'non_exact',
		},
	],
	_warnings: ['No exact match found'],
};

export const emptyResponse = { results: [] };

export const parseResponse = {
	address_components: {
		number: '1109',
		predirectional: 'N',
		street: 'Highland',
		suffix: 'St',
		formatted_street: 'N Highland St',
		city: 'Arlington',
		state_province: 'VA',
		postal_code: '22201',
		country: 'United States',
		nation: 'US',
	},
	formatted_address: '1109 N Highland St, Arlington, VA 22201',
};

export const distanceResponse = {
	origin: { query: '1109 N Highland St, Arlington, VA 22201' },
	mode: 'driving',
	destinations: [
		{
			query: '1600 Pennsylvania Ave NW, Washington, DC 20500',
			location: [38.8977, -77.0365],
			distance_miles: 5.42,
			distance_km: 8.72,
			duration_seconds: 1080,
		},
	],
};

export const matrixResponse = {
	mode: 'driving',
	results: [
		{
			origin: { query: '38.886665,-77.094733' },
			destinations: [
				{
					query: '38.8977,-77.0365',
					location: [38.8977, -77.0365],
					distance_miles: 5.42,
					distance_km: 8.72,
					duration_seconds: 1080,
				},
			],
		},
	],
};

/** A job still processing: `download_url` and `time_left` are null until it ends. */
export const job = {
	identifier: 'cb88c50a256e30b32c7c44e7bede3d5a27657d8f',
	name: 'Q4 stores',
	created_at: '2026-11-12T09:00:00.000000Z',
	origins_type: 'coordinates',
	origins_count: 1,
	destinations_type: 'coordinates',
	destinations_count: 1,
	distance_mode: 'driving',
	calculation_type: 'matrix',
	status: 'PROCESSING',
	download_url: null,
	total_calculations: 1,
	calculations_completed: 0,
	progress: 0,
	status_message: 'Processing',
	time_left: null,
	is_expired: false,
};

/** `GET /distance-jobs/{identifier}` wraps the job in `data`. */
export const jobResponse = { data: job };

/** Deleting a job answers a message, not the job. */
export const jobDeleted = { message: 'Job deleted' };

export const jobList = {
	data: [job],
	links: {
		first: 'https://api.geocod.io/v2.1/distance-jobs?page=1',
		last: 'https://api.geocod.io/v2.1/distance-jobs?page=1',
		prev: null,
		next: null,
	},
	meta: {
		current_page: 1,
		from: 1,
		last_page: 1,
		per_page: 15,
		to: 1,
		total: 1,
	},
};

/** A list as the spec documents it: a numeric id and a status object. */
export const listItem = {
	id: 148,
	fields: ['timezone'],
	file: { estimated_rows_count: 2, filename: 'stores.csv' },
	status: {
		state: 'PROCESSING',
		progress: 0,
		message: 'Processing',
		time_left_description: null,
		time_left_seconds: null,
	},
	download_url: null,
	expires_at: '2026-12-12T00:00:00.000000Z',
};

/** Deleting a list answers `{ success: true }`. */
export const listDeleted = { success: true };

export const listsResponse = {
	current_page: 1,
	current_page_url: 'https://api.geocod.io/v2.1/lists?page=1',
	per_page: 15,
	from: 1,
	to: 1,
	data: [listItem],
	next_page_url: null,
	prev_page_url: null,
	first_page_url: 'https://api.geocod.io/v2.1/lists?page=1',
	path: 'https://api.geocod.io/v2.1/lists',
};

/**
 * A batch answers one entry per input, in input order, each with the query
 * and the single-lookup answer under `response`. An unmatched entry answers
 * an empty `results` list and the reason, as the live API did.
 */
export const batchResponse = {
	results: [
		{
			query: '1109 N Highland St, Arlington, VA 22201',
			response: geocodeResponse,
		},
		{
			query: 'nowhere at all',
			response: {
				error: 'Could not geocode address. No matches found.',
				reference: 'https://www.geocod.io/geocodio-422-unprocessable-entity/',
				results: [],
			},
		},
	],
};
