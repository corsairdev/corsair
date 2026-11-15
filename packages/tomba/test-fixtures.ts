/**
 * Shapes from the live API and the reference.
 *
 * The error bodies are the ones an unauthenticated probe returned; the person
 * and company records follow the reference's field tables, where every field is
 * required but nullable.
 */

export const person = {
	email: 'jane.doe@stripe.com',
	first_name: 'Jane',
	last_name: 'Doe',
	full_name: 'Jane Doe',
	company: 'Stripe',
	position: 'Software Engineer',
	department: 'engineering',
	country: 'US',
	gender: 'female',
	linkedin: 'https://www.linkedin.com/in/jane-doe',
	twitter: null,
	website_url: 'stripe.com',
	pattern: '{first}.{last}',
	score: 100,
	accept_all: false,
	phone_number: false,
	type: 'personal',
	verification: { date: '2025-01-15T10:32:00+01:00', status: 'valid' },
	sources: [
		{
			uri: 'https://stripe.com/blog/engineering',
			website_url: 'stripe.com',
			extracted_on: '2024-06-01T09:14:07+01:00',
			last_seen_on: '2025-01-10T17:02:44+01:00',
			still_on_page: true,
		},
	],
	phone_data: [],
};

/** A finder miss: still a 200, with a null address. */
export const personNotFound = {
	...person,
	email: null,
	score: 0,
	sources: null,
	pattern: null,
	position: null,
	verification: null,
};

export const company = {
	name: 'Stripe',
	legalName: 'Stripe',
	domain: 'stripe.com',
	domainAliases: null,
	site: {
		phoneNumbers: null,
		emailAddresses: ['support@stripe.com'],
	},
	category: {
		sector: null,
		industryGroup: null,
		industry: null,
		subIndustry: null,
		sicCode: '73',
		sic4Codes: ['7389'],
		naicsCode: '51',
		naics6Codes: ['522320', '541511', '523940'],
		naics6Codes2022: ['522320', '541511'],
	},
	tags: ['payments'],
	description:
		'stripe is a payment processing platform enabling businesses to accept payments and manage online transactions.',
	foundedYear: '2010',
	location: 'US',
	geo: {
		streetNumber: '354 oyster point blvd',
		streetName: '354 oyster point blvd',
		subPremise: null,
		streetAddress: '354 oyster point blvd',
		city: 'San Francisco',
		postalCode: '94107',
		state: 'California',
		stateCode: 'California',
		country: 'United States',
		countryCode: 'US',
		lat: null,
		lng: null,
	},
	logo: null,
	facebook: {
		handle: 'stripehq',
		likes: null,
	},
	linkedin: {
		handle: 'stripe',
	},
	twitter: {
		handle: 'stripe',
		id: null,
		bio: null,
		followers: null,
		following: null,
		location: null,
		site: null,
		avatar: null,
	},
	type: 'privately held',
	metrics: {
		alexaUsRank: null,
		alexaGlobalRank: null,
		trafficRank: '6636',
		employees: '5K-10K',
		marketCap: null,
		raised: null,
		annualRevenue: '$100M-$250M',
		estimatedAnnualRevenue: '$100M-$250M',
		fiscalYearEnd: null,
	},
};

export const account = {
	first_name: 'Ada',
	last_name: 'Lovelace',
	email: 'ada@acme.com',
	country: 'GB',
	confirmed: true,
	blocked: false,
	deleted: false,
	created_at: '2025-01-01T00:00:00Z',
	expired: '2026-06-01T00:00:00Z',
	expired_subscription: '2026-06-01T00:00:00Z',
	requests: {
		domains: { available: 100, used: 12 },
		verifications: { available: 50, used: 3 },
		count: { available: 100, used: 0 },
	},
};

export const verification = {
	email: {
		email: 'jane.doe@stripe.com',
		status: 'valid',
		result: 'deliverable',
		score: 99,
		regex: true,
		gibberish: false,
		disposable: false,
		accept_all: false,
		block: false,
		greylisted: false,
		mx_check: true,
		smtp_check: true,
		smtp_server: true,
		smtp_provider: 'Google',
		mx: { records: ['aspmx.l.google.com'] },
		phone_number: false,
	},
};

export const emailCount = {
	website_id: 12345,
	total: 681,
	personal_emails: 640,
	generic_emails: 41,
	department: { engineering: 120, sales: 60 },
	seniority: { senior: 200, junior: 80 },
};

export const phoneValidation = {
	valid: true,
	local_format: '(415) 555-1234',
	intl_format: '+1 415-555-1234',
	e164_format: '+14155551234',
	rfc3966_format: 'tel:+1-415-555-1234',
	country_code: 'US',
	line_type: 'FIXED_LINE_OR_MOBILE',
	carrier: '',
	region: {
		name: 'California',
		code: 'CA',
	},
	timezones: ['America/Los_Angeles'],
};

export const suggestion = {
	name: 'Stripe',
	domain: 'stripe.com',
	email_count: 4964,
};

// ---------------------------------------------------------------------------
// error bodies, copied from live probes
// ---------------------------------------------------------------------------

/** No key sent at all, answered with 400. */
export const noKey = {
	errors: {
		type: 'authentication_failed',
		message:
			'No user found for the API supplied. . Sign up at https://tomba.io',
		code: 400,
	},
};

/** A well-formed key that no account owns, answered with 401. */
export const badKey = {
	errors: {
		type: 'authentication_failed',
		message: "The API key and secret don't match an account",
		code: 401,
	},
};

export const insufficientCredits = {
	errors: {
		type: 'insufficient_credits',
		message: 'Your search balance is lower than the cost of this request',
		code: 402,
	},
};

export const unknownRecord = {
	errors: {
		type: 'unknown_record',
		message: 'gmail.com is a webmail domain',
		code: 400,
	},
};

export const legalBlock = {
	errors: {
		type: 'legal_block',
		message: 'The data subject asked us to stop processing their data',
		code: 451,
	},
};

// ---------------------------------------------------------------------------
// trimmed live responses (11-16, free plan); people and addresses replaced
// ---------------------------------------------------------------------------

export const rateLimitsLive = {
	data: {
		'email-finder': {
			limits: {
				rps: 1,
				rpm: 2,
				daily: 5,
			},
			usage: {
				rpm_used: 0,
				daily_used: 0,
			},
		},
		me: {
			limits: {
				rps: 2,
				rpm: 30,
				daily: 500,
			},
			usage: {
				rpm_used: 0,
				daily_used: 0,
			},
		},
	},
};

export const domainStatusLive = {
	disposable: false,
	domain: 'stripe.com',
	webmail: false,
};

export const emailFormatLive = {
	data: [
		{
			format: '{last}',
			percentage: 2,
		},
		{
			format: '{first}.{last}',
			percentage: 9,
		},
		{
			format: '{f}{l}',
			percentage: 2,
		},
	],
};

export const locationLive = {
	data: [
		{
			name: 'IN',
			total: 4,
		},
		{
			name: 'HK',
			total: 1,
		},
		{
			name: 'NL',
			total: 2,
		},
	],
};

export const technologyLive = {
	domain: 'stripe.com',
	data: [
		{
			slug: 'contentful',
			name: 'Contentful',
			icon: 'Contentful.svg',
			website: 'contentful.com',
			description:
				'Contentful is an API-first content management platform to create, manage and publish content on any digital channel.',
			categories: [
				{
					id: 1,
					slug: 'cms',
					name: 'CMS',
				},
			],
		},
	],
};

export const similarLive = {
	data: [
		{
			website_url: 'fairbit.com',
			name: 'Fairbit',
			industries: 'Information Technology and Services',
		},
		{
			website_url: 't1payments.com',
			name: 'T1 Payments',
			industries: 'Financial Services',
		},
	],
	meta: {
		total: 37,
		pageSize: 25,
		current: 1,
		total_pages: 2,
	},
};

export const suggestionsLive = {
	data: [
		{
			name: 'Stripe',
			domain: 'stripe.com',
			email_count: 4964,
		},
		{
			name: 'STRIPE CLUB|ストライプクラブ',
			domain: 'stripe-club.com',
			email_count: 3,
		},
	],
	meta: {
		query: 'stripe',
		limit: 5,
	},
};

export const emailSourcesLive = {
	data: [
		{
			uri: 'https://stripe.com/blog/engineering',
			website_url: 'stripe.com',
			extracted_on: '2025-07-01T15:01:12+02:00',
			last_seen_on: '2025-07-01T19:33:20+02:00',
			still_on_page: true,
		},
	],
	email: 'jane.doe@stripe.com',
};

export const revealLive = {
	success: true,
	data: {
		companies: [
			{
				name: 'Acme Payments',
				description: 'Acme provides payment processing services.',
				country: 'IE',
				state: 'Leinster',
				street_address: '1 main street',
				postal_code: 'D01',
				industry: 'Financial Services',
				company_size: '1-10',
				type: '',
				founded: '2012',
				city: 'Dublin',
				website_url: 'acmepayments.ie',
				total_emails: 1,
				revenue: '$0-$1M',
				phone_number: false,
				linkedin_url: 'https://www.linkedin.com/company/acme-payments',
				facebook_url: '',
				twitter_url: '',
				total_similar: 0,
			},
		],
	},
	meta: {
		total: 74,
		page: 1,
		limit: 50,
		pages: 2,
		filters: {
			location_country: {
				include: ['IE'],
				exclude: [],
			},
		},
	},
};

export const companyFindLive = {
	data: {
		name: 'Stripe',
		legalName: 'Stripe',
		domain: 'stripe.com',
		domainAliases: null,
		site: {
			phoneNumbers: null,
			emailAddresses: ['support@stripe.com'],
		},
		category: {
			sector: null,
			industryGroup: null,
			industry: null,
			subIndustry: null,
			sicCode: '73',
			sic4Codes: ['7389'],
			naicsCode: '51',
			naics6Codes: ['522320', '541511', '523940'],
			naics6Codes2022: ['522320', '541511'],
		},
		tags: ['payments'],
		description:
			'stripe is a payment processing platform enabling businesses to accept payments and manage online transactions.',
		foundedYear: '2010',
		location: 'US',
		geo: {
			streetNumber: '354 oyster point blvd',
			streetName: '354 oyster point blvd',
			subPremise: null,
			streetAddress: '354 oyster point blvd',
			city: 'San Francisco',
			postalCode: '94107',
			state: 'California',
			stateCode: 'California',
			country: 'United States',
			countryCode: 'US',
			lat: null,
			lng: null,
		},
		logo: null,
		facebook: {
			handle: 'stripehq',
			likes: null,
		},
		linkedin: {
			handle: 'stripe',
		},
		twitter: {
			handle: 'stripe',
			id: null,
			bio: null,
			followers: null,
			following: null,
			location: null,
			site: null,
			avatar: null,
		},
		type: 'privately held',
		metrics: {
			alexaUsRank: null,
			alexaGlobalRank: null,
			trafficRank: '6636',
			employees: '5K-10K',
			marketCap: null,
			raised: null,
			annualRevenue: '$100M-$250M',
			estimatedAnnualRevenue: '$100M-$250M',
			fiscalYearEnd: null,
		},
	},
	meta: {
		domain: 'stripe.com',
	},
};

export const personFindLive = {
	data: {
		name: {
			fullName: 'Jane Doe',
			givenName: 'Jane',
			familyName: 'Doe',
		},
		email: 'jane.doe@stripe.com',
		location: 'US',
		gender: null,
		geo: {
			city: null,
			state: null,
			stateCode: null,
			country: 'United States',
			countryCode: 'US',
			lat: null,
			lng: null,
		},
		bio: null,
		site: null,
		avatar: null,
		employment: {
			domain: 'stripe.com',
			name: 'Stripe',
			title: null,
			role: null,
			subRole: null,
			seniority: null,
		},
		facebook: {
			handle: null,
		},
		github: {
			handle: null,
			id: null,
			avatar: null,
			company: null,
			blog: null,
			followers: null,
			following: null,
		},
		twitter: {
			handle: null,
			id: null,
			bio: null,
			followers: null,
			following: null,
			statuses: null,
			favorites: null,
			location: null,
			site: null,
			avatar: null,
		},
		linkedin: {
			handle: 'jane-doe',
		},
		verification: {
			date: '2026-11-16T00:00:00+01:00',
			status: 'invalid',
		},
		phone: true,
	},
	meta: {
		email: 'jane.doe@stripe.com',
	},
};

export const domainSearchLive = {
	organization: {
		website_url: 'stripe.com',
		organization: 'Stripe',
		location: {
			country: 'US',
			city: 'San Francisco',
			state: 'California',
			street_address: '354 oyster point blvd',
			postal_code: '94107',
		},
		social_links: {
			twitter_url: 'https://twitter.com/stripe',
			facebook_url: 'https://www.facebook.com/stripehq',
			linkedin_url: 'https://www.linkedin.com/company/stripe',
			instagram_url: null,
			github_url: 'https://www.github.com/stripe',
			youtube_url: null,
			pinterest_url: null,
			tiktok_url: null,
		},
		disposable: false,
		webmail: false,
		phone_number: false,
		industries: 'Information Technology and Services',
		founded: '2010',
		company_size: '5K-10K',
		company_type: 'privately held',
		revenue: '$100M-$250M',
		accept_all: true,
		pattern: '{first}',
		total_similar: 37,
		keywords: ['édition', 'rédaction'],
		last_updated: '2026-11-01T15:17:24+01:00',
	},
	meta: {
		total: 5164,
		pageSize: 10,
		current: 1,
		total_pages: 517,
	},
};

export const phoneFinderEmptyLive = {
	data: [],
	domain: 'stripe.com',
};
