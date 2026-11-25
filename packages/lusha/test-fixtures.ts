// Response shapes from the V3 OpenAPI spec examples and the docs' live
// examples (https://docs.lusha.com/openapi.json). No key was available when
// these were captured, so they are spec-verified, not live-verified.

export const billing = { creditsCharged: 3, resultsReturned: 1, lowBalance: false };

export const contactSearchResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [
		{
			clientReferenceId: 'my-ref-1',
			id: '4389064654',
			firstName: 'Orit',
			lastName: 'Shilvock',
			jobTitle: {
				title: 'VP of Sales',
				departments: ['sales'],
				seniority: 'VP',
			},
			company: {
				id: '16303253',
				name: 'Lusha',
				domain: 'lusha.com',
				industry: 'internet',
			},
			location: { country: 'Israel', state: null, city: 'Tel Aviv' },
			socialLinks: { linkedin: 'https://www.linkedin.com/in/orit-shilvock-6243bb5' },
			has: ['emails', 'phones'],
			canReveal: [
				{ field: 'emails', credits: 1, availability: 'available' },
				{ field: 'phones', credits: 2, availability: 'available' },
			],
			signalTypes: ['promotion'],
		},
	],
	billing,
};

export const enrichedContact = {
	id: '4389064654',
	firstName: 'Orit',
	lastName: 'Shilvock',
	fullName: 'Orit Shilvock',
	jobTitle: {
		title: 'VP of Sales',
		departments: ['sales'],
		seniority: 'VP',
		startDate: '2021-03-01',
	},
	location: {
		country: 'Israel',
		countryIso2: 'IL',
		continent: 'AS',
		city: 'Tel Aviv',
		isEuContact: false,
	},
	tags: [{ id: 't1', name: 'ICP', color: '#FF5733' }],
	emails: [
		{
			email: 'orit.shilvock@lusha.com',
			type: 'work',
			confidence: 'A+',
			updateDate: '2026-04-23',
			dataSource: 'lusha',
		},
	],
	phones: [
		{
			number: '+14155551234',
			type: 'mobile',
			doNotCall: false,
			updateDate: '2026-04-23',
			dataSource: 'lusha',
		},
	],
	company: { id: '16303253', name: 'Lusha', domain: 'lusha.com' },
	socialLinks: { linkedin: 'https://www.linkedin.com/in/orit-shilvock-6243bb5' },
	previousEmployment: [{ company: 'Acme', title: 'Sales Director' }],
	linkedinFollowers: 1200,
	linkedinConnections: 500,
	partialProfile: false,
	updateDate: '2026-04-23',
};

export const enrichContactsResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [enrichedContact],
	billing,
};

/** A 200 that says an async provider is still working. */
export const enrichPartialResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [],
	billing: { creditsCharged: 1, resultsReturned: 0, lowBalance: false },
	status: 'partial',
	statusDescription: 'Some requested data points are still being retrieved.',
	job: {
		id: 'wf_3f2b9c1e-4a7d-4f3b-9c2e-1d6a5b8c7e90',
		status: 'processing',
		expiresAt: '2026-01-15T10:30:00Z',
		retryAfter: 5,
	},
};

export const enrichHaltedResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [],
	billing: { creditsCharged: 0, resultsReturned: 0, lowBalance: true },
	status: 'PARTIAL_OUT_OF_CREDITS',
	statusReason: 'WATERFALL_DISABLED',
	statusDescription: 'The waterfall did not run.',
};

export const companySearchResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [
		{
			clientReferenceId: 'comp-ref-1',
			id: '16303253',
			name: 'Lusha',
			domain: 'lusha.com',
			employeeCount: { exact: 400, min: 250, max: 500 },
			industry: 'internet',
			location: { country: 'Israel', state: null, city: 'Tel Aviv' },
			socialLinks: { linkedin: 'https://www.linkedin.com/company/lusha' },
			has: ['emails', 'employeesByDepartment'],
			canReveal: [{ field: 'employeesByDepartment', credits: 1 }],
			signalTypes: ['surgeInHiring'],
		},
	],
	billing,
};

export const enrichedCompany = {
	id: '16303253',
	name: 'Lusha',
	alternativeName: null,
	domain: 'lusha.com',
	alternativeDomains: ['lusha.co.il'],
	description: 'B2B contact data.',
	companyType: 'Private',
	yearFounded: 2016,
	employeeCount: { exact: 400, min: 250, max: 500 },
	industry: 'internet',
	subIndustry: 'data intelligence',
	specialities: ['sales intelligence', 'contact data'],
	sicCodes: [{ code: 7371, description: 'Custom computer programming services' }],
	naicsCodes: [{ code: 5112, description: 'Software publishers' }],
	location: {
		city: 'Tel Aviv',
		state: null,
		country: 'Israel',
		countryIso2: 'IL',
		continent: 'AS',
		zipCode: null,
	},
	additionalLocations: [],
	socialLinks: { linkedin: 'https://www.linkedin.com/company/lusha' },
	linkedinFollowers: 9000,
	funding: {
		rounds: [],
		totalRounds: 3,
		totalRoundsAmount: 208000000,
		currency: 'USD',
		isIpo: false,
		lastRoundType: 'Series D',
		lastRoundAmount: 0,
		lastRoundDate: null,
	},
	revenueRange: { min: 50000000, max: 100000000 },
	technologies: ['salesforce'],
	popularityTier: 3,
	logoUrl: 'https://cdn.lusha.com/logo.png',
	businessModel: ['B2B'],
	phones: [{ number: '+97235551234' }],
	emails: [{ email: 'info@lusha.com' }],
	keywords: ['b2b'],
	employeesByDepartment: [{ department: 'sales', count: 120 }],
	directParent: null,
	ultimateParent: null,
};

export const enrichCompaniesResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [enrichedCompany],
	billing,
};

export const searchAndEnrichCompaniesResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [{ ...enrichedCompany, clientReferenceId: 'comp-ref-1' }],
	billing,
};

export const searchAndEnrichContactsResponse = {
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	results: [{ ...enrichedContact, clientReferenceId: 'my-ref-1' }],
	billing,
};

export const accountUsageResponse = {
	credits: { total: 5000, used: 1200, remaining: 3800 },
	rateLimits: {
		daily: { limit: 100000, used: 500, remaining: 99500, resetsAt: '2026-11-26T00:00:00Z' },
		hourly: null,
		minute: { limit: 1500, used: 3, remaining: 1497, resetsAt: '2026-11-25T15:10:00Z' },
	},
	plan: {
		category: 'professional',
		renewalType: 'monthly',
		startDate: '2026-11-01',
		endDate: '2026-11-30',
	},
	pricing: {
		api_search: { credits: 1, perQuantity: 1 },
		reveal_company: { credits: 1, perQuantity: 1 },
		email: { credits: 1, perQuantity: 1 },
		phone: { credits: 2, perQuantity: 1 },
	},
};

export const jobProcessingResponse = {
	jobId: 'wf_3f2b9c1e-4a7d-4f3b-9c2e-1d6a5b8c7e90',
	status: 'processing',
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	expiresAt: '2026-01-15T10:30:00Z',
	retryAfter: 5,
	covers: [{ contactId: '4389064624', dataPoints: ['phone'] }],
};

export const jobCompleteResponse = {
	jobId: 'wf_3f2b9c1e-4a7d-4f3b-9c2e-1d6a5b8c7e90',
	status: 'complete',
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	expiresAt: '2026-01-15T10:30:00Z',
	contacts: [enrichedContact],
	creditsCharged: 2,
};

export const jobFailedResponse = {
	jobId: 'wf_3f2b9c1e-4a7d-4f3b-9c2e-1d6a5b8c7e90',
	status: 'failed',
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	expiresAt: '2026-01-15T10:30:00Z',
	reason: 'All providers exhausted',
};

export const jobExpiredResponse = {
	jobId: 'wf_3f2b9c1e-4a7d-4f3b-9c2e-1d6a5b8c7e90',
	status: 'expired',
	requestId: '3c7f6d96-4a72-40cd-96c1-2efcfabeb727',
	expiresAt: '2026-01-15T10:30:00Z',
};

// ── error bodies ──────────────────────────────────────────────────────────

/** The spec's ErrorResponse shape. */
export const validationErrorBody = {
	statusCode: 400,
	message: 'Validation failed',
	errors: ['entityType must be one of: contact, company'],
};

/** The live unauthenticated body, which adds `error` and drops `errors`. */
export const unauthorizedErrorBody = {
	statusCode: 401,
	timestamp: '2026-11-25T15:02:52.730Z',
	message: 'Missing API key. Send your Lusha API key in the api_key header.',
	error: 'Unauthorized',
};

export const outOfCreditsBody = {
	statusCode: 402,
	message: 'Insufficient credits for this operation',
};

export const planRestrictedErrorBody = {
	statusCode: 403,
	message: 'Forbidden',
	errors: ['excludeDnc is not available on your current plan'],
};

export const rateLimitedBody = {
	statusCode: 429,
	message: 'Too many requests. Please wait before making another request.',
};

/** Spec-verified 503: the job store is unreachable, retry. */
export const jobStoreDownBody = {
	statusCode: 503,
	message: 'Job store unavailable, please retry',
};
