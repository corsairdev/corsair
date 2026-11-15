/**
 * Response bodies for the tests, transcribed from the schemas in RocketReach's
 * documentation (https://docs.rocketreach.co) and the live refusals captured from
 * https://api.rocketreach.co/api/v2.
 */

export const ACCOUNT = {
	id: 123456,
	first_name: 'Mark',
	last_name: 'Cuban',
	email: 'name@example.com',
	state: 'registered',
	credit_usage: [
		{ credit_type: 'person_lookup', allocated: 1000, used: 42, remaining: 958 },
		{
			credit_type: 'email_verification',
			allocated: 500,
			used: 12,
			remaining: 488,
		},
	],
	rate_limits: [
		{
			action: 'person_lookup',
			duration: 'minute',
			limit: 50,
			used: 3,
			remaining: 47,
		},
	],
};

// The universal account echoes the caller's own api_key; the plugin strips it.
export const UNIVERSAL_ACCOUNT = {
	id: 123456,
	first_name: 'Mark',
	last_name: 'Cuban',
	email: 'name@example.com',
	state: 'registered',
	plan: { id: 3, name: 'Pro', lookup_limit: 20000, export_limit: 5000 },
	api_key: 'live-secret-key-that-must-not-leak',
	api_key_domain: 'example.com',
	daily_api_num_calls: 42,
	daily_api_limit: '10000',
	credit_usage: { universal: { allocated: 5000, used: 42, remaining: 4958 } },
	credit_usage_by_action: [{ action: 'person_lookup', used: 40 }],
	rate_limits: [
		{ action: 'person_lookup', duration: 'minute', limit: 50, used: 3 },
	],
};

export const COMPLETE_PROFILE = {
	id: 5244,
	status: 'complete',
	name: 'John Doe',
	linkedin_url: 'https://www.linkedin.com/in/johndoe',
	connections: 500,
	location: 'San Francisco, California, United States',
	city: 'San Francisco',
	region: 'California',
	country: 'United States',
	country_code: 'US',
	current_title: 'Software Engineer',
	current_employer: 'Google',
	current_employer_id: 9876,
	current_employer_domain: 'google.com',
	current_employer_website: 'https://google.com',
	job_history: [
		{
			start_date: '2020-01-01',
			company: 'Google',
			company_name: 'Google',
			title: 'Software Engineer',
			is_current: true,
		},
	],
	education: [
		{ major: 'Computer Science', school: 'Stanford University', degree: 'BS' },
	],
	skills: ['Python', 'SQL'],
	recommended_email: 'johndoe@google.com',
	current_work_email: 'johndoe@google.com',
	return_cached_emails: true,
	linkedin_url_active: true,
	emails: [
		{
			email: 'johndoe@google.com',
			smtp_valid: 'valid',
			type: 'professional',
			grade: 'A',
		},
	],
	phones: [
		{
			number: '+1 234-555-6789',
			e164: '+12345556789',
			country_code: '1',
			type: 'mobile',
			grade: 'A',
			recommended: true,
		},
	],
};

// A lookup that has not finished: the contact fields are empty and status says why.
export const PROGRESS_PROFILE = {
	id: 5244,
	status: 'progress',
	name: 'John Doe',
	current_employer: 'Google',
	current_title: 'Software Engineer',
	emails: [],
	phones: [],
	return_cached_emails: false,
	recommended_email: null,
	current_work_email: null,
};

export const EMAIL_VERIFIED = {
	email: 'johndoe@google.com',
	status: 'valid',
	credits_charged: 1,
	mx_record: 'smtp.google.com',
	checks: {
		format_valid: true,
		domain_valid: true,
		disposable: false,
		catchall: false,
	},
};

export const EMAIL_CATCHALL = {
	email: 'someone@example.com',
	status: 'catchall',
	credits_charged: 1,
	mx_record: 'mx.example.com',
	checks: {
		format_valid: true,
		domain_valid: true,
		disposable: false,
		catchall: true,
	},
};

export const EMAIL_UNKNOWN = {
	email: 'nobody@nowhere.invalid',
	status: 'unknown',
	credits_charged: 0,
	mx_record: null,
	checks: {
		format_valid: true,
		domain_valid: false,
		disposable: null,
		catchall: null,
	},
};

export const EMAIL_MALFORMED = {
	email: 'not-an-address',
	status: 'invalid',
	credits_charged: 0,
	mx_record: null,
	checks: {
		format_valid: false,
		domain_valid: false,
		disposable: null,
		catchall: null,
	},
};

export const COMPANY = {
	id: 9876,
	name: 'Google',
	domain: 'google.com',
	email_domain: 'google.com',
	website_domain: 'google.com',
	ticker_symbol: 'GOOGL',
	year_founded: 1998,
	address: {
		street: '1600 Amphitheatre Parkway',
		city: 'Mountain View',
		region: 'California',
		country: 'United States',
		postal_code: '94043',
	},
	num_employees: 182502,
	revenue: 282836000000,
	industry: 'Internet',
	sic_codes: ['7370'],
	naics_codes: ['519130'],
	rr_profile_url: 'https://rocketreach.co/google-profile_b5c12345',
	description: 'A search engine company.',
	techstack: ['Go', 'Python'],
	industries: ['Internet', 'Software'],
	competitors: ['Microsoft', 'Amazon'],
};

export const COMPANY_ROW = {
	id: 9876,
	name: 'Google',
	email_domain: 'google.com',
	ticker_symbol: 'GOOGL',
	industry_str: 'Internet',
	city: 'Mountain View',
	region: 'California',
	country_code: 'US',
	linkedin_url: 'https://www.linkedin.com/company/google',
	logo_url: 'https://logo.clearbit.com/google.com',
};

export const PERSON_ROW = {
	id: 5244,
	status: 'complete',
	name: 'John Doe',
	linkedin_url: 'https://www.linkedin.com/in/johndoe',
	connections: 500,
	location: 'San Francisco, California, United States',
	city: 'San Francisco',
	region: 'California',
	country: 'United States',
	country_code: 'US',
	current_title: 'Software Engineer',
	current_employer: 'Google',
	current_employer_id: 9876,
	current_employer_domain: 'google.com',
	teaser: { emails: [{ email: 'j***@google.com' }] },
	update_time: '2025-01-01T00:00:00Z',
};

export const PERSON_SEARCH = [
	PERSON_ROW,
	{ ...PERSON_ROW, id: 5245, name: 'Jane Roe' },
];

export const COMPANY_SEARCH = [COMPANY_ROW];

// Live: any route with an unrecognised key.
export const INVALID_KEY = {
	detail: 'Invalid API key',
	error_code: 'authentication_failed',
};

// Live: a call with no key at all.
export const ANONYMOUS_KEY = {
	detail: 'Anonymous requests are not allowed. Please use the test API key.',
	error_code: 'authentication_failed',
};

// A lookup with no credits left: the docs say 403 carries only a detail.
export const NO_LOOKUP_CREDITS = {
	detail:
		'You have run out of lookup credits. Visit https://rocketreach.co/account to buy more.',
};

// The email-verification pool reports itself as a 402 with a credit_type.
export const NO_VERIFICATION_CREDITS = {
	detail:
		'Your RocketReach account does not have sufficient verification credits. You can review your account here: https://rocketreach.co/verify/',
	error_code: 202,
	credit_type: 'email_verification',
	purchase_url: 'https://rocketreach.co/verify/purchase_credits',
};

export const MALFORMED = {
	detail: 'email: Enter a valid email address.',
	error_code: 'invalid',
};

export const NOT_FOUND = {
	detail: 'Not found.',
	error_code: 'not_found',
};

export const PAYLOAD_TOO_LARGE = {
	detail: 'Request body exceeds 2.5 MB',
	error_code: 'payload_too_large',
};

export const RATE_LIMITED = {
	detail: 'Request was throttled.',
	error_code: 'throttled',
};

export const SERVER_ERROR = {
	detail: 'Internal server error',
	error_code: 'server_error',
};
