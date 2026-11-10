/**
 * Response bodies for the tests, from the Rosette API documentation surfaced by the
 * official Python binding (https://github.com/rosette-api/python) and the live
 * refusals captured from analytics.babelstreet.com.
 */

export const PING = { message: 'ping' };

export const INFO = {
	name: 'Rosette API',
	version: '1.36',
	buildNumber: 'f8b9b2e',
	buildDate: '2026-04-01T00:00:00Z',
};

export const LANGUAGE = {
	language: 'eng',
	languageDetections: [
		{ language: 'eng', confidence: 0.98 },
		{ language: 'sco', confidence: 0.01 },
	],
};

export const ENTITIES = {
	entities: [
		{
			type: 'PERSON',
			mention: 'John Smith',
			normalized: 'John Smith',
			count: 2,
			confidence: 0.95,
			entityId: 'Q1',
			mentions: [
				{ mention: 'John Smith', startOffset: 0, endOffset: 10 },
				{ mention: 'Smith', startOffset: 40, endOffset: 45 },
			],
		},
		{
			type: 'LOCATION',
			mention: 'Seattle',
			normalized: 'Seattle',
			count: 1,
			confidence: 0.91,
			entityId: 'Q2',
		},
	],
};

export const SENTIMENT = {
	document: {
		label: 'pos',
		score: 0.723,
		confidence: 0.88,
	},
	entities: [
		{
			type: 'PERSON',
			mention: 'John Smith',
			normalized: 'John Smith',
			count: 1,
			label: 'pos',
			score: 0.5,
			confidence: 0.8,
			entityId: 'Q1',
		},
	],
};

// A neutral label can still carry a score away from zero.
export const SENTIMENT_NEUTRAL = {
	document: { label: 'neu', score: -0.12, confidence: 0.4 },
};

export const TOKENS = {
	tokens: ['The', 'quick', 'brown', 'fox'],
	posTags: ['DT', 'JJ', 'JJ', 'NN'],
	lemmas: ['the', 'quick', 'brown', 'fox'],
};

export const SENTENCES = {
	sentenceDetections: [
		{ start: 0, end: 19, text: 'The quick brown fox.' },
		{ start: 20, end: 44, text: 'It jumped over the dog.' },
	],
};

export const MORPHOLOGY = {
	tokens: ['runs', 'running'],
	lemmas: ['run', 'run'],
	posTags: ['VBZ', 'VBG'],
	compoundComponents: [{ lemma: 'run', components: ['run', 's'] }],
};

export const CATEGORIES = {
	categories: [
		{ label: '/technology', score: 0.42, confidence: 0.71 },
		{ label: '/business', score: 0.18 },
	],
};

export const TOPICS = {
	concepts: [{ label: 'Software', score: 0.61 }],
	topics: [
		{ label: 'Machine Learning', score: 0.44 },
		{ label: 'Cloud Computing', score: 0.21 },
	],
};

export const RELATIONSHIPS = {
	relationships: [
		{
			predicate: 'work for',
			predicateId: 'R1',
			confidence: 0.87,
			subject: { mention: 'John Smith', entityId: 'Q1' },
			object: { mention: 'Acme Corp', entityId: 'Q2' },
		},
	],
};

export const SIMILAR_TERMS = {
	terms: [
		{ term: 'automobile', similarity: 0.91, embedding: [0.1, 0.2] },
		{ term: 'vehicle', similarity: 0.88 },
	],
};

export const VECTOR = {
	embedding: [0.12, -0.44, 0.09, 0.31],
	dimensions: 4,
};

export const NAME_SIMILARITY = { score: 0.81 };

export const NAME_TRANSLATION = { translation: 'Хуан Смит' };

export const TRANSLITERATION = { transliteration: 'Juan Smith' };

// Live, on every endpoint, including with a wrong key.
export const FORBIDDEN = {
	code: 'forbidden',
	message:
		'you have either provided an invalid API key, or are not authorized to call the endpoint, or have exceeded the daily or monthly API call limits',
};

export const BAD_REQUEST = {
	code: 'badRequest',
	message: 'The content must be specified',
};

export const INVALID_PARAMETER = {
	code: 'invalidParameter',
	message: 'The contentUri scheme must be http, https, ftp or ftps',
};

export const NOT_AUTHORIZED = {
	code: 'notAuthorized',
	message: 'This endpoint is not included in your plan',
};

export const QUOTA_EXCEEDED = {
	code: 'quotaExceeded',
	message: 'The monthly call limit has been reached',
};

export const SERVER_ERROR = {
	code: 'internalError',
	message: 'Internal server error',
};
