import { logEventFromContext } from 'corsair/core';
import * as Api from './endpoints';
import {
	CATEGORIES,
	ENTITIES,
	FORBIDDEN,
	INFO,
	LANGUAGE,
	MORPHOLOGY,
	NAME_SIMILARITY,
	NAME_TRANSLATION,
	PING,
	RELATIONSHIPS,
	SENTENCES,
	SENTIMENT,
	SENTIMENT_NEUTRAL,
	SIMILAR_TERMS,
	TOKENS,
	TOPICS,
	TRANSLITERATION,
	VECTOR,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	// An unqueued response must fail the test rather than reach the real API.
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('unmocked fetch'));
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('ping and info', () => {
	it('pings the host', async () => {
		respond(fetchMock, PING);

		const result = (await invoke(Api.ping, {})) as { message?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('GET');
		expect(request.path).toBe('/rest/v1/ping');
		expect(result.message).toBe('ping');
	});

	it('reads the build, which explains a change in output', async () => {
		respond(fetchMock, INFO);

		const result = (await invoke(Api.info, {})) as {
			version?: string;
			buildNumber?: string;
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/info');
		expect(result.version).toBe('1.36');
		expect(result.buildNumber).toBe('f8b9b2e');
	});
});

describe('language', () => {
	it('detects the language and its candidates', async () => {
		respond(fetchMock, LANGUAGE);

		const result = (await invoke(Api.language, {
			content: 'The quick brown fox.',
		})) as {
			language?: string;
			languageDetections?: { language?: string; confidence?: number }[];
		};

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/rest/v1/language');
		expect(request.bodyRecord).toEqual({ content: 'The quick brown fox.' });
		expect(result.language).toBe('eng');
		expect(result.languageDetections).toHaveLength(2);
	});

	it('accepts a contentUri instead of content', async () => {
		respond(fetchMock, LANGUAGE);

		await invoke(Api.language, { contentUri: 'https://example.com/a.html' });

		expect(lastRequest(fetchMock).bodyRecord).toEqual({
			contentUri: 'https://example.com/a.html',
		});
	});

	it('rejects a request with neither content nor contentUri', async () => {
		await expect(invoke(Api.language, {})).rejects.toThrow(
			/content or contentUri/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a request with both, which Rosette treats as alternatives', async () => {
		await expect(
			invoke(Api.language, {
				content: 'x',
				contentUri: 'https://example.com/a.html',
			}),
		).rejects.toThrow(/not both/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('passes the language and profileId through', async () => {
		respond(fetchMock, LANGUAGE);

		await invoke(Api.language, {
			content: 'hola',
			language: 'spa',
			profileId: 'profile-1',
		});

		const request = lastRequest(fetchMock);
		expect(request.bodyRecord).toMatchObject({ language: 'spa' });
		expect(request.query.profileId).toBe('profile-1');
	});

	it('logs the language and the candidate count, never the text', async () => {
		respond(fetchMock, LANGUAGE);

		await invoke(Api.language, { content: 'a secret sentence' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.language',
			{ language: 'eng', candidates: 2 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'a secret sentence',
		);
	});
});

describe('entities', () => {
	it('extracts entities grouped by entityId', async () => {
		respond(fetchMock, ENTITIES);

		const result = (await invoke(Api.entities, {
			content: 'John Smith works in Seattle.',
		})) as {
			entities?: { entityId?: string; mention?: string; count?: number }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/entities');
		expect(result.entities).toHaveLength(2);
		expect(result.entities?.[0]?.entityId).toBe('Q1');
		// A count of 2 means two mentions of the same entity.
		expect(result.entities?.[0]?.count).toBe(2);
	});

	it('keeps the individual mentions with their offsets', async () => {
		respond(fetchMock, ENTITIES);

		const result = (await invoke(Api.entities, { content: 'x' })) as {
			entities?: { mentions?: { mention?: string; startOffset?: number }[] }[];
		};

		expect(result.entities?.[0]?.mentions).toHaveLength(2);
		expect(result.entities?.[0]?.mentions?.[1]?.startOffset).toBe(40);
	});

	it('logs the entity and type counts', async () => {
		respond(fetchMock, ENTITIES);

		await invoke(Api.entities, { content: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.entities',
			{ entities: 2, types: 2 },
			'completed',
		);
	});
});

describe('sentiment', () => {
	it('reads the document and entity sentiment', async () => {
		respond(fetchMock, SENTIMENT);

		const result = (await invoke(Api.sentiment, {
			content: 'I love this product.',
		})) as {
			document?: { label?: string; score?: number };
			entities?: unknown[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/sentiment');
		expect(result.document?.label).toBe('pos');
		expect(result.document?.score).toBe(0.723);
		expect(result.entities).toHaveLength(1);
	});

	it('keeps a neutral label whose score is not zero', async () => {
		respond(fetchMock, SENTIMENT_NEUTRAL);

		const result = (await invoke(Api.sentiment, { content: 'x' })) as {
			document?: { label?: string; score?: number };
		};

		// The label and the score are separate signals.
		expect(result.document?.label).toBe('neu');
		expect(result.document?.score).toBe(-0.12);
	});

	it('logs the label and score', async () => {
		respond(fetchMock, SENTIMENT);

		await invoke(Api.sentiment, { content: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.sentiment',
			{ label: 'pos', score: 0.723, entities: 1 },
			'completed',
		);
	});
});

describe('tokens, sentences and morphology', () => {
	it('returns tokens with their tags and lemmas in matching order', async () => {
		respond(fetchMock, TOKENS);

		const result = (await invoke(Api.tokens, { content: 'x' })) as {
			tokens?: string[];
			posTags?: string[];
			lemmas?: string[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/tokens');
		expect(result.tokens).toHaveLength(4);
		expect(result.posTags).toHaveLength(4);
		expect(result.lemmas?.[0]).toBe('the');
	});

	it('finds sentence offsets', async () => {
		respond(fetchMock, SENTENCES);

		const result = (await invoke(Api.sentences, { content: 'x' })) as {
			sentenceDetections?: { start?: number; end?: number }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/sentences');
		expect(result.sentenceDetections).toHaveLength(2);
		expect(result.sentenceDetections?.[0]?.end).toBe(19);
	});

	it('analyses morphology on the complete route, including compounds', async () => {
		respond(fetchMock, MORPHOLOGY);

		const result = (await invoke(Api.morphology, {
			content: 'Rechtsschutzversicherungsgesellschaften running',
			language: 'deu',
		})) as {
			lemmas?: string[];
			compoundComponents?: (string[] | null)[];
			hanReadings?: (string[] | null)[];
		};

		// The bare /morphology route answers 404; the binding calls a facet, and
		// "complete" returns all of them.
		expect(lastRequest(fetchMock).path).toBe('/rest/v1/morphology/complete');
		expect(result.lemmas?.[0]).toBe('Rechtsschutzversicherungsgesellschaft');
		expect(result.compoundComponents?.[0]).toEqual([
			'Recht',
			'Schutz',
			'Versicherung',
			'Gesellschaft',
		]);
		expect(result.compoundComponents?.[1]).toBeNull();
		expect(result.hanReadings).toEqual([null, null]);
	});
});

describe('categories, topics and relationships', () => {
	it('classifies into categories with confidence', async () => {
		respond(fetchMock, CATEGORIES);

		const result = (await invoke(Api.categories, { content: 'x' })) as {
			categories?: { label?: string; score?: number }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/categories');
		expect(result.categories?.[0]?.label).toBe('/technology');
		expect(result.categories?.[0]?.score).toBe(0.42);
	});

	it('separates topics from concepts', async () => {
		respond(fetchMock, TOPICS);

		const result = (await invoke(Api.topics, { content: 'x' })) as {
			topics?: { label?: string }[];
			concepts?: { label?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/topics');
		expect(result.topics).toHaveLength(2);
		expect(result.concepts?.[0]?.label).toBe('Software');
	});

	it('extracts subject-verb-object relationships', async () => {
		respond(fetchMock, RELATIONSHIPS);

		const result = (await invoke(Api.relationships, { content: 'x' })) as {
			relationships?: {
				predicate?: string;
				confidence?: number;
				subject?: { mention?: string };
			}[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/relationships');
		expect(result.relationships?.[0]?.predicate).toBe('work for');
		expect(result.relationships?.[0]?.subject?.mention).toBe('John Smith');
	});
});

describe('semantics', () => {
	it('finds similar terms per result language', async () => {
		respond(fetchMock, SIMILAR_TERMS);

		const result = (await invoke(Api.similarTerms, {
			content: 'car',
			resultLanguages: ['eng', 'spa'],
		})) as {
			similarTerms?: Record<string, { term?: string; similarity?: number }[]>;
		};

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rest/v1/semantics/similar');
		// The API reads the languages from `options` and refuses the call without them.
		expect(request.bodyRecord).toEqual({
			content: 'car',
			options: { resultLanguages: ['eng', 'spa'] },
		});
		expect(result.similarTerms?.eng?.[1]?.term).toBe('sunbeam_automobile');
		expect(result.similarTerms?.spa).toHaveLength(1);
	});

	it('requires at least one result language before calling', async () => {
		await expect(
			invoke(Api.similarTerms, { content: 'car' }),
		).rejects.toThrow();
		await expect(
			invoke(Api.similarTerms, { content: 'car', resultLanguages: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the term count across languages', async () => {
		respond(fetchMock, SIMILAR_TERMS);

		await invoke(Api.similarTerms, {
			content: 'car',
			resultLanguages: ['eng'],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.semantics.similarTerms',
			{ terms: 3, languages: 2 },
			'completed',
		);
	});

	it('computes a text embedding', async () => {
		respond(fetchMock, VECTOR);

		const result = (await invoke(Api.textEmbedding, { content: 'x' })) as {
			embedding?: number[];
			dimensions?: number;
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/semantics/vector');
		expect(result.embedding).toHaveLength(4);
		expect(result.dimensions).toBe(4);
	});

	it('logs the dimensions', async () => {
		respond(fetchMock, VECTOR);

		await invoke(Api.textEmbedding, { content: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.semantics.vector',
			{ dimensions: 4 },
			'completed',
		);
	});
});

describe('name similarity and translation', () => {
	it('scores two names', async () => {
		respond(fetchMock, NAME_SIMILARITY);

		const result = (await invoke(Api.nameSimilarity, {
			name1: { text: 'John Smith' },
			name2: { text: 'Jon Smith' },
		})) as { score?: number };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rest/v1/name-similarity');
		expect(request.body).toEqual({
			name1: { text: 'John Smith' },
			name2: { text: 'Jon Smith' },
		});
		expect(result.score).toBe(0.81);
	});

	it('carries a name entity type', async () => {
		respond(fetchMock, NAME_SIMILARITY);

		await invoke(Api.nameSimilarity, {
			name1: { text: 'Acme', entityType: 'ORGANIZATION' },
			name2: { text: 'Acme Corp', entityType: 'ORGANIZATION' },
		});

		const body = lastRequest(fetchMock).bodyRecord as {
			name1?: { entityType?: string };
		};
		expect(body.name1?.entityType).toBe('ORGANIZATION');
	});

	it('rejects an entity type the API does not allow', async () => {
		await expect(
			invoke(Api.nameSimilarity, {
				name1: { text: 'x', entityType: 'PRODUCT' },
				name2: { text: 'y' },
			}),
		).rejects.toThrow();
	});

	it('rejects a name with no text', async () => {
		await expect(
			invoke(Api.nameSimilarity, { name1: {}, name2: { text: 'y' } }),
		).rejects.toThrow();
	});

	it('translates a name', async () => {
		respond(fetchMock, NAME_TRANSLATION);

		const result = (await invoke(Api.nameTranslation, {
			name: 'John Smith',
			targetLanguage: 'rus',
			entityType: 'PERSON',
		})) as { translation?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rest/v1/name-translation');
		expect(request.bodyRecord).toMatchObject({
			name: 'John Smith',
			targetLanguage: 'rus',
		});
		expect(result.translation).toBe('Хуан Смит');
	});

	it('rejects a translation with no target language', async () => {
		await expect(
			invoke(Api.nameTranslation, { name: 'John Smith' }),
		).rejects.toThrow();
	});
});

describe('transliteration', () => {
	it('transliterates with content and language only', async () => {
		respond(fetchMock, TRANSLITERATION);

		const result = (await invoke(Api.transliteration, {
			content: 'Mohammed Ali',
			language: 'ara',
		})) as { transliteration?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rest/v1/transliteration');
		expect(request.bodyRecord).toEqual({
			content: 'Mohammed Ali',
			language: 'ara',
		});
		expect(result.transliteration).toBe('محمد علي');
	});

	it('never sends targetScript, which the API answers with a 400', async () => {
		respond(fetchMock, TRANSLITERATION);

		await invoke(Api.transliteration, { content: 'x', targetScript: 'Latn' });

		expect(lastRequest(fetchMock).bodyRecord).toEqual({ content: 'x' });
	});

	it('rejects empty content', async () => {
		await expect(
			invoke(Api.transliteration, { content: '' }),
		).rejects.toThrow();
	});
});

describe('error propagation', () => {
	it('surfaces the shared 403 with its three possible causes', async () => {
		respond(fetchMock, FORBIDDEN, 403);

		await expect(invoke(Api.language, { content: 'x' })).rejects.toThrow(
			'invalid API key',
		);
	});

	it('names the endpoint that failed', async () => {
		respond(fetchMock, FORBIDDEN, 403);

		// unknown: the rejection is narrowed by the assertion below.
		const error = (await invoke(Api.entities, { content: 'x' }).catch(
			(e: unknown) => e,
		)) as { endpoint?: string };

		expect(error.endpoint).toBe('/entities');
	});
});
