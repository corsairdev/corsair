/**
 * Response bodies for the tests. The success bodies are live responses from
 * analytics.babelstreet.com on a free-trial key (11-12), trimmed; the field names
 * match the official Java binding's model classes
 * (https://github.com/rosette-api/java, model/.../apimodel).
 */

export const PING = {
	message: 'Babel Street Analytics Server at your service',
	time: 1794460423822,
};

export const INFO = {
	name: 'Babel Street Analytics Server',
	version: '1.39.0',
	buildNumber: '2d103cf6',
	buildTime: '20260922013523',
};

// There is no top-level `language`: the first detection is the most likely one.
export const LANGUAGE = {
	languageDetections: [
		{ language: 'eng', confidence: 0.87597701 },
		{ language: 'nld', confidence: 0.02437225 },
	],
};

export const ENTITIES = {
	entities: [
		{
			type: 'PERSON',
			mention: 'John Smith',
			normalized: 'John Smith',
			count: 1,
			mentionOffsets: [{ startOffset: 0, endOffset: 10 }],
			entityId: 'Q16200474',
			confidence: 0.91628879,
			linkingConfidence: 0.0746221,
		},
		{
			type: 'ORGANIZATION',
			mention: 'Acme Corp',
			normalized: 'Acme Corp',
			count: 1,
			mentionOffsets: [{ startOffset: 20, endOffset: 29 }],
			entityId: 'T1',
			confidence: 0.62137556,
		},
		{
			type: 'LOCATION',
			mention: 'Seattle',
			normalized: 'Seattle',
			count: 1,
			mentionOffsets: [{ startOffset: 33, endOffset: 40 }],
			entityId: 'Q5083',
			linkingConfidence: 0.76339067,
		},
	],
};

// A label with a confidence, for the document and inside each entity; no score.
export const SENTIMENT = {
	document: { label: 'neg', confidence: 0.50514893 },
	entities: [
		{
			type: 'PERSON',
			mention: 'John Smith',
			normalized: 'John Smith',
			count: 1,
			mentionOffsets: [{ startOffset: 48, endOffset: 58 }],
			entityId: 'T0',
			confidence: 0.91822904,
			sentiment: { label: 'neg', confidence: 0.51519182 },
		},
	],
};

// Tokens only; tags and lemmas come from morphology.
export const TOKENS = { tokens: ['The', 'quick', 'brown', 'fox'] };

// The sentences themselves, with their trailing whitespace, not offsets.
export const SENTENCES = {
	sentences: ['The quick brown fox. ', 'It jumped over the dog.'],
};

// Live from /morphology/complete (11-12): a compound splits into its parts, and a
// token with no parts (or no Han reading) is null in the same position.
export const MORPHOLOGY = {
	tokens: ['Rechtsschutzversicherungsgesellschaften', 'running'],
	posTags: ['NOUN', 'ADV'],
	lemmas: ['Rechtsschutzversicherungsgesellschaft', 'running'],
	compoundComponents: [
		['Recht', 'Schutz', 'Versicherung', 'Gesellschaft'],
		null,
	],
	hanReadings: [null, null],
};

export const CATEGORIES = {
	categories: [
		{
			label: 'TECHNOLOGY_AND_COMPUTING',
			confidence: 0.05797729,
			score: 0.12309286,
		},
		{ label: 'AUTOMOTIVE', confidence: 0.05555504, score: 0.08041562 },
	],
};

// Keyphrases from the text and broader concepts, each with a salience.
export const TOPICS = {
	keyphrases: [
		{ phrase: 'recommendation systems', salience: 0.79139363 },
		{ phrase: 'startup', salience: 0.77872994 },
	],
	concepts: [
		{
			phrase: 'San Francisco Bay Area',
			salience: 0.16027612,
			conceptId: 'Q6460070',
		},
	],
};

// Arguments are plain strings with an optional ID, not objects.
export const RELATIONSHIPS = {
	relationships: [
		{
			predicate: 'Person Employee or Member of',
			predicateId: 'PER-EMPLOYEE-MEMBER-OF',
			arg1: 'John Smith',
			arg1Id: 'Q16200474',
			arg2: 'Acme Corp.',
		},
	],
};

// Live from /semantics/similar (11-12), trimmed: terms keyed by result language.
export const SIMILAR_TERMS = {
	similarTerms: {
		eng: [
			{ term: 'car', similarity: 1.0 },
			{ term: 'sunbeam_automobile', similarity: 0.97575432 },
		],
		spa: [{ term: 'automóvil', similarity: 0.9123 }],
	},
};

// Live (11-12): the route refuses a request without resultLanguages.
export const SIMILAR_TERMS_NO_LANGUAGES = {
	code: 'badRequestFormat',
	message:
		"/semantics/similar endpoint requires a non-empty 'resultLanguages' option",
	stack: null,
};

// The live vector has 300 numbers; trimmed to four.
export const VECTOR = {
	documentEmbedding: [0.00904728, -0.11852804, 0.04762501, 0.04446864],
};

export const NAME_SIMILARITY = { score: 0.94313833 };

export const NAME_TRANSLATION = {
	extendedInformation: { processedByBabel: true },
	sourceScript: 'Latn',
	sourceLanguageOfUse: 'eng',
	targetLanguage: 'rus',
	targetScript: 'Cyrl',
	targetScheme: 'NATIVE',
	translation: 'Жоан Смит',
	confidence: 0.14273171,
};

// Live (11-12) for content 'Mohammed Ali' with language 'ara'.
export const TRANSLITERATION = { transliteration: 'محمد علي' };

// Live, on every endpoint, including with a wrong key.
export const FORBIDDEN = {
	code: 'forbidden',
	message:
		'you have either provided an invalid API key, or are not authorized to call the endpoint, or have exceeded the daily or monthly API call limits',
};

// Live (11-12), for a request with no content.
export const BAD_REQUEST = {
	code: 'badRequestFormat',
	message:
		'no content provided; must be one of an attachment, an inline "content" field, or an external "contentUri"',
	stack: null,
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
