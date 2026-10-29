// Response bodies shaped like live AnyAPI answers (checked 2026-10-27), with
// made-up people and places.

// unknown: `data` is each endpoint's own payload.
export function runResult(data: unknown, costUsd = 0.0011, items = 1) {
	return {
		output: { found: data !== null, data },
		provider: 'AnyAPI',
		costUsd,
		items,
		replayed: false,
		source: {
			id: 'anonymous-quokka',
			name: 'Quokka',
			kind: 'anonymous',
			artworkKey: 'quokka',
		},
		resultId: 'd668386e-e52f-4383-8951-8f6b9a1c3df9',
	};
}

// unknown: extra fields (code, requestId, payment, alternatives) vary by error.
export function errorBody(error: string, extra: Record<string, unknown> = {}) {
	return { error, ...extra };
}

export const catalogEntry = {
	id: 'linkedin.company',
	slug: 'linkedin.company',
	category: 'social',
	name: 'LinkedIn Company',
	description: 'Get a LinkedIn company page by URL.',
	method: 'POST',
	path: '/v1/run/linkedin.company',
	provider: 'AnyAPI',
	execution: { mode: 'sync' },
	pricing: {
		from: {
			model: 'flat',
			unit: 'request',
			maxUsd: 0.0011,
			maxPer1kUsd: 1.1,
		},
		failoverMaxUsd: 0.00253,
	},
	failover: true,
	platformId: 'linkedin',
};

export const requestSnapshot = {
	requestId: '5f0c2d3e-8a51-4c2b-9d0e-1f2a3b4c5d6e',
	sku: 'email_verification.bounceban',
	status: 'running',
	createdAt: '2026-10-27T09:00:00.000Z',
	retryAfterSeconds: 5,
};

export const company = {
	id: '1234567',
	name: 'Fieldkit',
	universalName: 'fieldkit',
	linkedinUrl: 'https://www.linkedin.com/company/fieldkit',
	website: 'https://fieldkit.example',
	tagline: 'Field data for teams',
	description: 'Fieldkit builds data tools.',
	industry: 'Software Development',
	companyType: 'Privately Held',
	employeeCount: 35,
	employeeCountRange: { start: 11, end: 50 },
	followerCount: 4200,
	foundedOn: {},
	fundingData: null,
	specialities: ['data', 'field work'],
	locations: [{ city: 'Austin', country: 'US' }],
};

export const profile = {
	id: 'ACoAAA',
	publicIdentifier: 'maya-ruiz',
	url: 'https://www.linkedin.com/in/maya-ruiz',
	firstName: 'Maya',
	lastName: 'Ruiz',
	headline: 'Head of Engineering at Fieldkit',
	about: 'I build teams.',
	location: 'Austin, Texas, United States',
	city: 'Austin',
	country: 'United States',
	followerCount: 1200,
	connectionsCount: 500,
	openToWork: false,
	topSkills: null,
	currentPosition: [{ companyName: 'Fieldkit' }],
	experience: [{ title: 'Head of Engineering', companyName: 'Fieldkit' }],
	education: [],
	skills: ['TypeScript'],
};

export const googleData = {
	query: 'model context protocol servers',
	results: [
		{
			position: 1,
			title: 'Model Context Protocol servers',
			link: 'https://github.com/modelcontextprotocol/servers',
			snippet: 'Reference implementations',
		},
	],
	nextCursor: '2',
};

export const scrapeData = {
	url: 'https://example.com',
	statusCode: 200,
	title: 'Example Domain',
	description: '',
	language: 'en',
	markdown: '# Example Domain',
};

export const tweetsData = {
	items: [
		{
			id: '1849000000000000000',
			url: 'https://x.com/fieldkit/status/1849000000000000000',
			text: 'Shipping MCP support today',
			createdUtc: 1793000000,
			authorUsername: 'fieldkit',
			authorName: 'Fieldkit',
			authorFollowers: 4200,
			likeCount: 12,
			retweetCount: 3,
			replyCount: 1,
			viewCount: 900,
			inReplyToId: null,
			media: [],
		},
	],
	nextCursor: 'DAACCgAC',
};

export const redditData = {
	posts: [
		{
			id: '1abcde',
			title: 'What MCP servers do you use?',
			subreddit: 'ClaudeAI',
			author: 'someone',
			score: 120,
			numComments: 45,
			permalink: '/r/ClaudeAI/comments/1abcde/',
			url: 'https://www.reddit.com/r/ClaudeAI/comments/1abcde/',
			selftext: '',
			createdUtc: 1793000000,
			media: [],
		},
	],
	nextCursor: null,
};

export const instagramData = {
	userId: '528817151',
	handle: 'fieldkit',
	displayName: 'Fieldkit',
	bio: 'Field data for teams',
	followers: 4200,
	following: 12,
	posts: null,
	verified: false,
	private: false,
	isBusiness: true,
	highlightsCount: null,
	avatarUrl: 'https://cdn.example/avatar.jpg',
	bioLinks: [],
};

export const mapsData = {
	items: [
		{
			placeId: 'ChIJ123',
			name: 'Corner Coffee',
			category: 'Coffee shop',
			categories: ['Coffee shop'],
			address: '1 Congress Ave, Austin, TX',
			city: 'Austin',
			phone: '+1 512-555-0100',
			website: 'https://corner.example',
			url: 'https://maps.google.com/?cid=1',
			rating: 4.6,
			reviewCount: 812,
			latitude: 30.26,
			longitude: -97.74,
			permanentlyClosed: false,
			hours: [],
		},
	],
};
