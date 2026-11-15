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
	website_url: 'stripe.com',
	domain: 'stripe.com',
	industry: 'Financial Services',
	country: 'US',
	size: '5001-10000',
	linkedin: 'https://www.linkedin.com/company/stripe',
	twitter: 'https://twitter.com/stripe',
	facebook: null,
	revenue: '$10B+',
	description: 'Payments infrastructure',
	location: 'San Francisco, California, US',
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
	phone: '+14155550132',
	valid: true,
	country_code: 'US',
	line_type: 'MOBILE',
	carrier: 'AT&T',
	e164_format: '+14155550132',
	international_format: '+1 415-555-0132',
	local_format: '(415) 555-0132',
};

export const suggestion = { domain: 'stripe.com', company: 'Stripe' };

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
