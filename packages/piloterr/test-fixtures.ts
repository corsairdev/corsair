/**
 * Response fixtures shaped after the Piloterr API docs
 * (docs.piloterr.com reference).
 */

export const invalidApiKey = { error: 'Invalid API Key' };
export const forbidden = { error: 'Forbidden' };
export const badRequest = { error: 'Bad Request' };
export const rateLimited = {
	error:
		"Rate limit exceeded: You've exceeded the search rate limit on your subscription",
};

/** The crawler and rendering endpoints answer a JSON-encoded HTML string. */
export const crawledHtml = JSON.stringify(
	'<!DOCTYPE html><html><head><title>Example</title></head><body><h1>Hello</h1></body></html>',
);

export const pagination = {
	next: 2,
	current: 1,
	per_page: 10,
	other_pages: [2],
	has_next_page: true,
};

export const organicResult = {
	link: 'https://example.com/cars',
	title: 'Best electric cars of 2024',
	domain: 'example.com',
	source: 'Example',
	snippet: 'Our picks for the year.',
	position: 1,
	displayed_link: 'https://example.com',
	snippet_matched: ['electric cars'],
};

export const googleSearch = {
	pagination,
	organic_results: [organicResult],
	related_searches: [{ query: 'cheapest ev 2024' }],
	knowledge_graph: null,
	search_parameters: {
		q: 'best electric cars 2024',
		gl: 'us',
		hl: 'en',
		engine: 'google',
	},
	search_information: { total_results: 1200000, time_taken_displayed: '0.42' },
};

export const autocomplete = {
	suggestions: [{ value: 'coffee near me' }, { value: 'coffee beans' }],
	search_parameters: { q: 'coff', cp: 0, engine: 'google_autocomplete' },
};

export const newsResult = {
	...organicResult,
	date: '3 hours ago',
};

export const googleNews = {
	pagination: { ...pagination, has_next_page: false },
	organic_results: [newsResult],
};

export const linkedinCompany = {
	company_id: 7050,
	company_name: 'Ferrari',
	company_url: 'https://www.linkedin.com/company/ferrari',
	tagline: 'We are the competition.',
	description: 'Italian sports car manufacturer.',
	website: 'https://www.ferrari.com',
	industry: 'Automotive',
	founded: 1939,
	staff_count: 5000,
	staff_range: '1001-5000',
	follower_count: 21000000,
	headquarter: {
		city: 'Maranello',
		line1: 'Via Abetone Inferiore 4',
		country: 'Italy',
		postal_code: '41053',
	},
	locations: ['Maranello, Italy'],
	specialities: ['sports cars', 'racing'],
	employees: [
		{ name: 'John Roe', profile_url: 'https://www.linkedin.com/in/john' },
	],
	posts: [{ post_id: '1', post_url: 'https://www.linkedin.com/posts/1' }],
	logo_url: 'https://example.com/ferrari.png',
};

export const linkedinProfile = {
	username: 'example-user',
	member_identifier: 'ACoAAA8BYqEBmLJMezmvqCLszS5NiJtJz7L9N9M',
	full_name: 'Alex Martin',
	headline: 'Growth at Example',
	summary: 'I grow things.',
	profile_url: 'https://www.linkedin.com/in/example-user',
	photo_url: 'https://example.com/photo.jpg',
	address: null,
	connection_count: 500,
	follower_count: 1200,
	skills: ['seo', 'content'],
	experiences: [
		{
			company: 'Example',
			job_title: 'Head of Growth',
			start_date: '2022-01-01',
			end_date: null,
			company_url: 'https://www.linkedin.com/company/example',
			description: null,
			company_logo: 'https://example.com/logo.png',
		},
	],
	educations: [
		{
			school: 'Example University',
			field_of_study: 'Business',
			start_year: 2015,
			end_year: 2019,
			start_date: null,
			end_date: null,
		},
	],
	certifications: [],
	languages: [],
	recommendations: [],
	articles: [],
};

export const linkedinJob = {
	id: 4390885746,
	title: 'Senior Software Engineer',
	job_url: 'https://www.linkedin.com/jobs/view/4390885746',
	job_description: 'Build things.',
	location: 'Paris, France',
	address: {
		city: 'Paris',
		state: null,
		county: null,
		country: 'France',
		country_code: 'FR',
	},
	industry: ['Software Development'],
	functions: ['Engineering'],
	list_date: '2026-11-01',
	employment_type: 'Full-time',
	seniority_level: 'Mid-Senior level',
	total_applicants: 25,
	compensation_salary: '60K-80K EUR',
	company_name: 'Example',
	company_url: 'https://www.linkedin.com/company/example',
	company_logo: 'https://example.com/logo.png',
	recruiter: {
		full_name: 'Sam Roe',
		headline: 'Talent at Example',
		profile_url: 'https://www.linkedin.com/in/sam',
	},
};

export const linkedinJobSearch = {
	results: [
		{
			id: 4390885746,
			url: 'https://www.linkedin.com/jobs/view/4390885746',
			title: 'Senior Software Engineer',
			city: 'Paris',
			country: 'France',
			location: 'Paris, France',
			geo_id: '105073465',
			list_date: '2026-11-01',
			company_name: 'Example',
			company_url: 'https://www.linkedin.com/company/example',
		},
	],
	pagination: { ...pagination, per_page: 10 },
};

export const linkedinPost = {
	id: '7027826235833520128',
	url: 'https://www.linkedin.com/posts/example-activity-7027826235833520128-m0GW',
	text: 'We are hiring!',
	author: {
		url: 'https://www.linkedin.com/in/example-user',
		full_name: 'Alex Martin',
		image_url: null,
		profile_type: 'person',
	},
	images: [],
	comments: [
		{
			text: 'Congrats!',
			author: { url: 'https://www.linkedin.com/in/sam', full_name: 'Sam Roe' },
		},
	],
};

export const emailFound = {
	email: 'alex.martin@example.com',
	status: 'valid',
	first_name: 'Alex',
	last_name: 'Martin',
	company_domain: 'example.com',
};

export const emailVerified = {
	email: 'alex.martin@example.com',
	status: 'valid',
};

export const emailAnalyzed = {
	is_microsoft_365: true,
	is_google_workspace: false,
	microsoft_365_domains: ['example.com', 'example.onmicrosoft.com'],
	google_workspace_domains: [],
	domains: {
		'example.com': ['v=spf1 include:spf.protection.outlook.com -all'],
	},
};

export const usage = {
	remaining: 450,
	total_used: 1550,
	renewal_date: '2026-04-25',
	period: { start: '2026-03-25', end: '2026-04-25' },
	subscription: { used: 1500, total: 5000, remaining: 3500, percent_used: 30 },
	packs: null,
	credits: { given: 500, consumed: 0, remaining: 500 },
	rate_limit: { per_minute: 60, per_second: 2 },
	account: { name: 'Example', slug: 'example' },
	api_key: {
		alias: 'prod-key',
		active: true,
		category: 'production',
		expires: null,
		quotas: {},
	},
};

export const jobCompleted = {
	id: 'abc123',
	success: true,
	status: 'CompletedJob',
	endpoint: 'website_rendering',
	created_at: '2026-11-21T10:00:00Z',
	started_at: '2026-11-21T10:00:01Z',
	completed_at: '2026-11-21T10:00:09Z',
	duration_ms: 8213,
	progress: 100,
	args: { query: 'https://example.com' },
	result: '<html>done</html>',
};

/** A binary screenshot answer as the transport hands it to the endpoint. */
export function screenshotBytes(contentType = 'image/png'): {
	bytes: Uint8Array;
	contentType: string;
} {
	return {
		bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
		contentType,
	};
}
