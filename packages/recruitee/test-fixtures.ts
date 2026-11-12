// Fixtures follow the OpenAPI definitions Recruitee embeds in each reference
// page (https://docs.recruitee.com/llms.txt). The 401 bodies are the three
// documented shapes, including the live one from a keyless call.

export const CANDIDATE_ID = 135145;
export const OFFER_ID = 42;
export const DEPARTMENT_ID = 7;

/** The live 401, verbatim from a keyless call. */
export const UNAUTHORIZED = {
	errors: [{ code: 'unauthorized', data: {}, message: 'Unauthorized' }],
};

/** The older ATS shape, as the offers reference documents it. */
export const LEGACY_UNAUTHORIZED = {
	error: 'Resource access requires authentication!',
	error_code: null,
};

/** A 422 naming a missing required attribute. */
export const VALIDATION_ERROR = {
	errors: [
		{
			code: 'unprocessable_entity',
			data: { name: ['is missing'] },
			message: "Name can't be blank",
		},
	],
};

export const NOT_FOUND = {
	errors: [{ code: 'not_found', data: {}, message: 'Not found' }],
};

/** The live 404 from `/c/{company}/candidates/1`, verbatim. */
export const PAGE_NOT_FOUND = { error: ['Page not found'] };

export const CANDIDATE = {
	id: CANDIDATE_ID,
	name: 'John Smith',
	emails: ['john@example.com'],
	phones: ['555-0100'],
	social_links: ['https://linkedin.com/in/john'],
	links: [],
	cover_letter: 'I would like to apply.',
	sources: ['careers-site'],
	admin_id: 99,
	created_at: '2026-08-19T10:21:09.046Z',
	updated_at: '2026-08-20T10:21:09.046Z',
	last_activity_at: '2026-08-19T10:21:09.046Z',
	my_last_rating: null,
	photo_url: null,
	cv_url: 'https://example.com/cv.pdf',
	placements: [
		{
			id: 142979997,
			candidate_id: CANDIDATE_ID,
			offer_id: OFFER_ID,
			stage_id: 13946406,
			talent_pool_id: null,
			location_ids: [307959],
		},
	],
	tags: ['senior'],
};

/**
 * A search hit, trimmed from a live `/search/new/candidates` answer: the
 * placement nests `offer` and `stage` as objects, and `stage` can be null.
 */
export const SEARCH_HIT = {
	id: CANDIDATE_ID,
	name: 'John Smith',
	emails: ['john@example.com'],
	phones: [],
	// The search sends tags and sources as objects; the candidate route sends
	// their names as strings.
	sources: [{ id: 4117420, name: 'Indeed' }],
	tags: [{ id: 4117407, name: 'Sample' }],
	source: 'manual',
	positive_ratings: 0,
	created_at: '2026-10-26T06:43:01.146466Z',
	placements: [
		{
			id: 142979997,
			candidate_id: CANDIDATE_ID,
			offer: {
				id: OFFER_ID,
				status: 'published',
				title: 'Senior Backend Engineer',
				kind: 'job',
				slug: 'senior-backend-engineer',
				location_ids: [],
			},
			stage: { id: 13946406, name: 'Applied', time_limit: null },
			disqualified: false,
		},
		{
			id: 142980004,
			candidate_id: CANDIDATE_ID,
			offer: { id: 2824613, kind: 'talent_pool', title: 'Rising stars' },
			stage: null,
			disqualified: false,
		},
	],
};

/** The search's envelope: `hits` and `total`, with no `meta`. */
export const CANDIDATE_PAGE = {
	aggregations: null,
	hits: [SEARCH_HIT],
	total: 1,
};
export const CANDIDATE_PAGE_MORE = {
	aggregations: null,
	hits: [SEARCH_HIT],
	total: 5,
};

export const OFFER = {
	id: OFFER_ID,
	title: 'Senior Backend Engineer',
	slug: 'senior-backend-engineer',
	status: 'published',
	kind: 'job',
	department: 'Engineering',
	department_id: DEPARTMENT_ID,
	location: 'Germany, Berlin, Berlin',
	location_ids: [2],
	city: 'Berlin',
	country_code: 'DE',
	description: 'Build the API.',
	requirements: 'Five years of experience.',
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-02-01T00:00:00.000Z',
	published_at: '2026-01-02T00:00:00.000Z',
	translations: [],
};

export const OFFER_PAGE = {
	meta: { limit: 1000, page: 1, total_count: 1 },
	offers: [OFFER],
};

export const DEPARTMENT = {
	id: DEPARTMENT_ID,
	name: 'Engineering',
	status: null,
	offers_count: 3,
};

export const DEPARTMENT_PAGE = { departments: [DEPARTMENT] };

export const LOCATION = {
	id: 2,
	name: 'Berlin',
	city: 'Berlin',
	state_name: 'Berlin',
	country_code: 'DE',
	full_address: 'Germany, Berlin, Berlin',
	note: null,
	archived_at: null,
};

export const LOCATION_PAGE = {
	meta: { limit: 1000, page: 1, total_count: 1 },
	locations: [LOCATION],
};
