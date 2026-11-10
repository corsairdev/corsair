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

export const CANDIDATE = {
	id: CANDIDATE_ID,
	name: 'John Smith',
	emails: ['john@example.com'],
	phones: ['555-0100'],
	social_links: ['https://linkedin.com/in/john'],
	links: [],
	cover_letter: 'I would like to apply.',
	sources: ['careers-site'],
	status: 'open',
	stage: 'Applied',
	admin_id: 99,
	created_at: '2026-08-19T10:21:09.046Z',
	updated_at: '2026-08-20T10:21:09.046Z',
	last_activity_at: '2026-08-19T10:21:09.046Z',
	my_last_rating: null,
	photo_url: null,
	cv_url: 'https://example.com/cv.pdf',
	placements: [],
	tags: ['senior'],
};

export const CANDIDATE_PAGE = { candidates: [CANDIDATE] };
export const CANDIDATE_PAGE_MORE = {
	candidates: [CANDIDATE],
	meta: { total: 5, page: 1, limit: 1 },
};

export const OFFER = {
	id: OFFER_ID,
	title: 'Senior Backend Engineer',
	slug: 'senior-backend-engineer',
	status: 'published',
	kind: 'job',
	department: 'Engineering',
	department_id: DEPARTMENT_ID,
	location: 'Berlin',
	location_id: 2,
	description: 'Build the API.',
	requirements: 'Five years of experience.',
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-02-01T00:00:00.000Z',
	published_at: '2026-01-02T00:00:00.000Z',
	translations: [],
};

export const OFFER_PAGE = { offers: [OFFER] };

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
	country: 'Germany',
	country_code: 'DE',
	note: null,
	offers_count: 2,
};

export const LOCATION_PAGE = { locations: [LOCATION] };
