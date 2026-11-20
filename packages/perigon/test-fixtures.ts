/**
 * Response fixtures shaped after the Perigon API docs
 * (perigon.io/docs/api) and live-probed envelope.
 */

export const invalidKey = {
	status: 401,
	message: 'Invalid API key.',
	timestamp: 1795208487008,
};

const PAGINATION = {
	page: 1,
	size: 50,
	totalElements: 1,
	totalPages: 1,
};

export const article = {
	id: 'art_1',
	url: 'https://example.com/news/story-1',
	title: 'Example headline',
	description: 'A short summary of the story.',
	content: 'Full body text.',
	imageUrl: 'https://cdn.example.com/img.jpg',
	publishedAt: '2025-11-20T12:00:00Z',
	source: 'Example News',
	topic: 'Tech',
	clusterId: 'story_1',
};

export const articlesList = {
	articles: [article],
	pagination: PAGINATION,
};

export const story = {
	id: 'story_1',
	title: 'Example narrative',
	summary: 'Clustered summary.',
	articleCount: 3,
	createdAt: '2025-11-20T12:30:00Z',
	updatedAt: '2025-11-20T13:00:00Z',
};

export const storiesList = {
	stories: [story],
	pagination: PAGINATION,
};

export const journalist = {
	id: 'j_1',
	name: 'Jane Roe',
	source: 'Example News',
};

export const journalistsList = {
	journalists: [journalist],
	pagination: PAGINATION,
};

export const person = {
	id: 'p_1',
	name: 'John Smith',
	mentions: 42,
};

export const peopleList = {
	people: [person],
	pagination: PAGINATION,
};

export const company = {
	id: 'c_1',
	name: 'Example Corp',
	mentions: 17,
};

export const companiesList = {
	companies: [company],
	pagination: PAGINATION,
};

export const limits = {
	organizationName: 'Example Org',
	requestsUsed: 1200,
	requestLimit: 10000,
	maxPageSize: 100,
	paginationLimit: 10000,
	articleContentTruncation: null,
	since: '2025-11-01T00:00:00Z',
	lastMadeAt: '2025-11-21T09:00:00Z',
	resetAt: '2025-12-01T00:00:00Z',
};
