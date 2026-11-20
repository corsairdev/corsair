/**
 * Responses follow NEURONwriter's API documentation
 * (https://neuronwriter.com/faqs/neuronwriter-api-how-to-use/). The shapes that
 * matter: every call is a POST to `/{method}`, lists come back as bare arrays,
 * and `get-query` answers only a status until the analysis is ready.
 */

export const projects = [
	{
		project: 'ed0b47151fb35b02',
		name: 'adidas.com',
		language: 'English',
		engine: 'google.co.uk',
	},
	{
		project: 'e6a3198027aa1b96',
		name: 'asics.com',
		language: 'English',
		engine: 'google.co.uk',
	},
];

export const startedAnalysis = {
	query: '32dee2a89374a722',
	query_url: 'https://app.neuronwriter.com/analysis/view/32dee2a89374a722',
	share_url:
		'https://app.neuronwriter.com/analysis/share/32dee2a89374a722/c63b64f6b13a064c12b78dac7dc3410c1',
	readonly_url:
		'https://app.neuronwriter.com/analysis/content-preview/32dee2a89374a722/02db6ba3e78557302723220bdef73c771',
};

/** While the analysis runs, the response is just the status. */
export const analysisWaiting = { status: 'waiting' };

export const analysisInProgress = { status: 'in progress' };

/** Once ready, the recommendations come with it. */
export const analysisReady = {
	status: 'ready',
	metrics: {
		word_count: { median: 1864, target: 1864 },
		readability: { median: 40, target: 40 },
	},
	terms_txt: {
		title: 'trail running shoesbest trail running shoes2024',
		h1: 'trail running shoes',
		content_basic: 'trail running shoeterraintractionlugcushion',
	},
	terms: {
		title: [
			{ t: 'running shoe', usage_pc: 88 },
			{ t: 'trail running shoe', usage_pc: 75 },
		],
		content_basic: [
			{ t: 'running shoe', usage_pc: 88, sugg_usage: [1, 32] },
			{ t: 'traction', usage_pc: 62, sugg_usage: [1, 16] },
		],
		entities: [
			{
				t: 'Trail running',
				importance: 27.31264,
				relevance: 0.42676,
				confidence: 3.2872,
				links: [['wikipedia', '']],
			},
		],
	},
	ideas: {
		suggest_questions: [
			{ q: 'where to buy trail running shoes' },
			{ q: 'are trail running shoes comfortable' },
		],
		people_also_ask: [
			{
				q: 'What is the difference between a running shoe and a trail running shoe?',
			},
		],
		content_questions: [{ q: 'How many miles do trail running shoes last?' }],
	},
	competitors: [
		{
			rank: 1,
			url: 'https://www.runnersworld.com/gear/a22115120/best-trail-running-shoes/',
			title: 'The 11 Best Trail Running Shoes of 2024',
			desc: "Check out the Runner's World editors' picks.",
			content_score: 72,
		},
	],
};

export const queryList = [
	{
		query: 'a6d0fb2bf9a7a2be',
		created: '2026-01-19T14:48:31+00:00',
		updated: '2026-01-19T14:49:52+00:00',
		keyword: 'how should running shoes fit',
		language: 'English',
		engine: 'google.co.uk',
		source: 'neuron-api',
		tags: ['Done'],
	},
	{
		query: 'bdc73d8e0057ed8f',
		created: '2026-01-19T14:48:31+00:00',
		updated: '2026-01-19T14:49:52+00:00',
		keyword: 'trail running shoes for winter',
		language: 'English',
		engine: 'google.co.uk',
		source: 'neuron',
		tags: [],
	},
];

export const savedContent = {
	content:
		'<h1>Top 10 Best Winter Running Shoes of 2024</h1><p>Winter running shoes are designed to provide support.</p>',
	title: 'Top 10 Best Winter Running Shoes of 2024',
	description:
		'Discover the top 10 best winter running shoes of 2024 for staying warm.',
	created: '2026-01-19T14:49:52+00:00',
	type: 'manual',
};

export const importOk = { status: 'ok' };

/** A failed import answers the same shape with an error instead. */
export const importFailed = {
	status: 'error',
	error: 'Could not import content from the given URL.',
};

/** The one error body NEURONwriter sends. */
export const invalidKey = { error: 'Invalid or inactive API key.' };
