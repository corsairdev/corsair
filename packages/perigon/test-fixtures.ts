/**
 * Fixtures trimmed from live Perigon answers (11-21, free plan), with names,
 * URLs and ids replaced by made-up values. Lists answer
 * { status, numResults, <articles | results> }.
 */

export const invalidKey = {
	status: 401,
	message: 'Invalid API key.',
	timestamp: 1795208487008,
};

export const article = {
	url: 'https://example.com/news/chip-demand',
	authorsByline: 'Jane Roe',
	articleId: 'a1b2c3',
	clusterId: 'c1d2e3',
	source: {
		domain: 'example.com',
	},
	imageUrl: 'https://example.com/img.jpg',
	country: 'us',
	language: 'en',
	pubDate: '2022-12-06T01:04:13+00:00',
	addDate: '2022-12-06T01:46:22.095933+00:00',
	refreshDate: '2022-12-06T01:46:22.095934+00:00',
	score: 70.24305,
	title: 'Chip demand keeps rising',
	description: 'A short summary of the story.',
	medium: 'Article',
	reprint: false,
	sentiment: {
		positive: 0.021231238,
		negative: 0.039899915,
		neutral: 0.9388688,
	},
	topics: [
		{
			name: 'Nvidia',
		},
	],
	categories: [],
	content: 'Full body text.',
};

export const articlesList = {
	status: 200,
	numResults: 1234,
	articles: [article],
};

export const story = {
	createdAt: '2026-11-21T03:28:33.359398+00:00',
	updatedAt: '2026-11-21T06:16:46.908292+00:00',
	initializedAt: '2026-11-21T05:34:43.626290+00:00',
	id: 'c1d2e3',
	name: 'Chip demand story',
	summary: 'Clustered summary.',
	shortSummary: 'Short summary.',
	uniqueCount: 5,
	reprintCount: 10,
	totalCount: 15,
	uniqueSourcesCount: 12,
	sourceDiversity: 0.8,
	topTopics: [
		{
			name: 'Markets',
		},
	],
};

export const storiesList = { status: 200, numResults: 56, results: [story] };

export const journalist = {
	id: 'j1',
	name: 'Jane Roe',
	fullName: 'Jane Roe',
	headline: null,
	description: null,
	title: 'Reporter',
	updatedAt: '2026-11-17T08:11:08.548231+00:00',
	avgMonthlyPosts: 110,
	twitterHandle: null,
	imageUrl: null,
	linkedinUrl: 'https://www.linkedin.com/in/example',
};

export const journalistsList = {
	status: 200,
	numResults: 7,
	results: [journalist],
};

export const person = {
	wikidataId: 'Q1',
	updatedAt: '2026-11-20T10:54:16.980744+00:00',
	name: 'John Example',
	gender: {
		label: 'male',
	},
	dateOfBirth: {
		time: '+1960-01-01T00:00:00Z',
	},
	dateOfDeath: null,
	description: 'Example person',
	aliases: ['J. Example'],
	occupation: [
		{
			label: 'executive',
		},
	],
	position: [],
	politicalParty: [],
	image: null,
	abstract: 'Abstract.',
};

export const peopleList = { status: 200, numResults: 3, results: [person] };

export const company = {
	id: 'co1',
	name: 'Example Chips Inc',
	updatedAt: '2026-11-16T08:23:15.439018+00:00',
	altNames: ['Example Chips'],
	domains: ['example.com'],
	monthlyVisits: 36815660,
	globalRank: 984,
	description: 'Makes chips.',
	ceo: 'John Example',
	industry: 'Semiconductors',
	sector: 'Technology',
	country: 'us',
	fullTimeEmployees: 42000,
	city: 'Example City',
	state: 'CA',
	logo: 'https://example.com/logo.png',
	favicon: 'https://example.com/favicon.ico',
	isEtf: false,
	symbols: [
		{
			symbol: 'EXC',
			exchange: 'NASDAQ',
		},
	],
	isin: 'US0000000000',
	yearFounded: 1993,
	revenue: 'over-1b',
};

export const companiesList = { status: 200, numResults: 2, results: [company] };

/** /v1/limits wraps the limits in data. */
export const limits = {
	data: {
		organizationName: 'Example Org',
		requestsUsed: 3,
		requestLimit: 150,
		maxPageSize: 100,
		paginationLimit: 300,
		since: '2026-11-21T14:35:31.763872Z',
		resetAt: '2026-12-21T14:35:31.763872Z',
	},
};
