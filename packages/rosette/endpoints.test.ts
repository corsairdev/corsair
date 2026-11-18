import { logEventFromContext } from 'corsair/core';
import * as Api from './endpoints';
import { RosetteEndpointOutputSchemas as Outputs } from './endpoints/types';
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

		const result = (await invoke(Api.ping, {})) as {
			message?: string;
			time?: number;
		};

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('GET');
		expect(request.path).toBe('/rest/v1/ping');
		expect(result.message).toBe(
			'Babel Street Analytics Server at your service',
		);
		expect(result.time).toBe(1794460423822);
	});

	it('reads the build, which explains a change in output', async () => {
		respond(fetchMock, INFO);

		const result = (await invoke(Api.info, {})) as {
			version?: string;
			buildNumber?: string;
			buildTime?: string;
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/info');
		expect(result.version).toBe('1.39.0');
		expect(result.buildNumber).toBe('2d103cf6');
		expect(result.buildTime).toBe('20260922013523');
	});
});

describe('language', () => {
	it('detects the language and its candidates', async () => {
		respond(fetchMock, LANGUAGE);

		const result = (await invoke(Api.language, {
			content: 'The quick brown fox.',
		})) as {
			languageDetections?: { language?: string; confidence?: number }[];
		};

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/rest/v1/language');
		expect(request.bodyRecord).toEqual({ content: 'The quick brown fox.' });
		expect(result.languageDetections?.[0]).toEqual({
			language: 'eng',
			confidence: 0.87597701,
		});
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

	it('logs the top candidate and the candidate count, never the text', async () => {
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
		expect(result.entities).toHaveLength(3);
		// A Q-prefixed ID is a Wikidata link; T-prefixed IDs are local to the text.
		expect(result.entities?.[0]?.entityId).toBe('Q16200474');
		expect(result.entities?.[0]?.count).toBe(1);
	});

	it('keeps each mention offset and the linking confidence', async () => {
		respond(fetchMock, ENTITIES);

		const result = (await invoke(Api.entities, { content: 'x' })) as {
			entities?: {
				mentionOffsets?: { startOffset?: number; endOffset?: number }[];
				linkingConfidence?: number;
			}[];
		};

		expect(result.entities?.[1]?.mentionOffsets).toEqual([
			{ startOffset: 20, endOffset: 29 },
		]);
		expect(result.entities?.[2]?.linkingConfidence).toBe(0.76339067);
	});

	it('logs the entity and type counts', async () => {
		respond(fetchMock, ENTITIES);

		await invoke(Api.entities, { content: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.entities',
			{ entities: 3, types: 3 },
			'completed',
		);
	});
});

describe('sentiment', () => {
	it('reads the document and per-entity sentiment', async () => {
		respond(fetchMock, SENTIMENT);

		const result = (await invoke(Api.sentiment, {
			content: 'I love this product, but the delivery was slow.',
		})) as {
			document?: { label?: string; confidence?: number };
			entities?: { sentiment?: { label?: string; confidence?: number } }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/sentiment');
		expect(result.document).toEqual({ label: 'neg', confidence: 0.50514893 });
		// An entity's sentiment is nested, a label with its own confidence.
		expect(result.entities?.[0]?.sentiment).toEqual({
			label: 'neg',
			confidence: 0.51519182,
		});
	});

	it('logs the label and confidence', async () => {
		respond(fetchMock, SENTIMENT);

		await invoke(Api.sentiment, { content: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.sentiment',
			{ label: 'neg', confidence: 0.50514893, entities: 1 },
			'completed',
		);
	});
});

describe('tokens, sentences and morphology', () => {
	it('returns the tokens', async () => {
		respond(fetchMock, TOKENS);

		const result = (await invoke(Api.tokens, { content: 'x' })) as {
			tokens?: string[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/tokens');
		expect(result.tokens).toEqual(['The', 'quick', 'brown', 'fox']);
	});

	it('returns each sentence as text', async () => {
		respond(fetchMock, SENTENCES);

		const result = (await invoke(Api.sentences, { content: 'x' })) as {
			sentences?: string[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/sentences');
		expect(result.sentences).toEqual([
			'The quick brown fox. ',
			'It jumped over the dog.',
		]);
	});

	it('logs the sentence count', async () => {
		respond(fetchMock, SENTENCES);

		await invoke(Api.sentences, { content: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.sentences',
			{ sentences: 2 },
			'completed',
		);
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
		expect(result.categories?.[0]?.label).toBe('TECHNOLOGY_AND_COMPUTING');
		expect(result.categories?.[0]?.score).toBe(0.12309286);
	});

	it('separates keyphrases from concepts', async () => {
		respond(fetchMock, TOPICS);

		const result = (await invoke(Api.topics, { content: 'x' })) as {
			keyphrases?: { phrase?: string; salience?: number }[];
			concepts?: { phrase?: string; conceptId?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/topics');
		expect(result.keyphrases?.[0]).toEqual({
			phrase: 'recommendation systems',
			salience: 0.79139363,
		});
		expect(result.concepts?.[0]?.conceptId).toBe('Q6460070');
	});

	it('logs the keyphrase and concept counts', async () => {
		respond(fetchMock, TOPICS);

		await invoke(Api.topics, { content: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rosette.topics',
			{ keyphrases: 2, concepts: 1 },
			'completed',
		);
	});

	it('extracts relationships between two arguments', async () => {
		respond(fetchMock, RELATIONSHIPS);

		const result = (await invoke(Api.relationships, { content: 'x' })) as {
			relationships?: {
				predicateId?: string;
				arg1?: string;
				arg1Id?: string;
				arg2?: string;
			}[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/relationships');
		expect(result.relationships?.[0]).toMatchObject({
			predicateId: 'PER-EMPLOYEE-MEMBER-OF',
			arg1: 'John Smith',
			arg1Id: 'Q16200474',
			arg2: 'Acme Corp.',
		});
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
		await expect(invoke(Api.similarTerms, { content: 'car' })).rejects.toThrow(
			/resultLanguages/,
		);
		await expect(
			invoke(Api.similarTerms, { content: 'car', resultLanguages: [] }),
		).rejects.toThrow(/resultLanguages/);
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
			documentEmbedding?: number[];
		};

		expect(lastRequest(fetchMock).path).toBe('/rest/v1/semantics/vector');
		expect(result.documentEmbedding).toHaveLength(4);
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
		expect(result.score).toBe(0.94313833);
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
		).rejects.toThrow(/entityType/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a name with no text', async () => {
		await expect(
			invoke(Api.nameSimilarity, { name1: {}, name2: { text: 'y' } }),
		).rejects.toThrow(/text/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends scoring parameters, which change the score (live: deletionScore 0 gave 0.0)', async () => {
		respond(fetchMock, NAME_SIMILARITY);

		await invoke(Api.nameSimilarity, {
			name1: { text: 'John Smith' },
			name2: { text: 'John Quincy Smith' },
			parameters: { deletionScore: '0.0' },
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			parameters: { deletionScore: '0.0' },
		});
	});

	it('translates a name', async () => {
		respond(fetchMock, NAME_TRANSLATION);

		const result = (await invoke(Api.nameTranslation, {
			name: 'John Smith',
			targetLanguage: 'rus',
			entityType: 'PERSON',
		})) as { translation?: string; confidence?: number; targetScript?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/rest/v1/name-translation');
		expect(result.confidence).toBe(0.14273171);
		expect(result.targetScript).toBe('Cyrl');
		expect(request.bodyRecord).toMatchObject({
			name: 'John Smith',
			targetLanguage: 'rus',
		});
		expect(result.translation).toBe('Жоан Смит');
	});

	it('rejects a translation with no target language', async () => {
		await expect(
			invoke(Api.nameTranslation, { name: 'John Smith' }),
		).rejects.toThrow(/targetLanguage/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends a targetScheme (live: IC accepted, an unknown scheme refused with 400)', async () => {
		respond(fetchMock, NAME_TRANSLATION);

		await invoke(Api.nameTranslation, {
			name: 'John Smith',
			targetLanguage: 'eng',
			targetScheme: 'IC',
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			targetScheme: 'IC',
		});
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
		await expect(invoke(Api.transliteration, { content: '' })).rejects.toThrow(
			/content/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('takes contentUri in place of content (live: 200)', async () => {
		respond(fetchMock, TRANSLITERATION);

		await invoke(Api.transliteration, {
			contentUri: 'https://example.com',
			language: 'ara',
		});

		expect(lastRequest(fetchMock).bodyRecord).toEqual({
			contentUri: 'https://example.com',
			language: 'ara',
		});
	});

	it('needs exactly one of content or contentUri', async () => {
		await expect(invoke(Api.transliteration, {})).rejects.toThrow(
			/content or contentUri/,
		);
		await expect(
			invoke(Api.transliteration, {
				content: 'x',
				contentUri: 'https://example.com',
			}),
		).rejects.toThrow(/not both/);
		expect(fetchMock).not.toHaveBeenCalled();
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

describe('output schemas declare the fields the API returns', () => {
	// The schemas are loose, so an undeclared field still passes through, but only
	// declared fields reach the typed result and the generated docs.
	const live = {
		ping: PING,
		info: INFO,
		language: LANGUAGE,
		entities: ENTITIES,
		sentiment: SENTIMENT,
		tokens: TOKENS,
		sentences: SENTENCES,
		morphology: MORPHOLOGY,
		categories: CATEGORIES,
		topics: TOPICS,
		relationships: RELATIONSHIPS,
		similarTerms: SIMILAR_TERMS,
		textEmbedding: VECTOR,
		nameSimilarity: NAME_SIMILARITY,
		nameTranslation: NAME_TRANSLATION,
		transliteration: TRANSLITERATION,
	} as const;

	it.each(Object.entries(live))('%s', (name, body) => {
		const schema = Outputs[name as keyof typeof live];
		const declared = Object.keys(schema.shape);
		expect(declared).toEqual(expect.arrayContaining(Object.keys(body)));
	});

	it('declares the nested entity, sentiment and relationship fields', () => {
		const entity = Outputs.entities.shape.entities.unwrap().unwrap().element;
		expect(Object.keys(entity.shape)).toEqual(
			expect.arrayContaining(Object.keys(ENTITIES.entities[0] ?? {})),
		);
		const sentimentEntity = Outputs.sentiment.shape.entities
			.unwrap()
			.unwrap().element;
		expect(Object.keys(sentimentEntity.shape)).toEqual(
			expect.arrayContaining(Object.keys(SENTIMENT.entities[0] ?? {})),
		);
		const relationship = Outputs.relationships.shape.relationships
			.unwrap()
			.unwrap().element;
		expect(Object.keys(relationship.shape)).toEqual(
			expect.arrayContaining(Object.keys(RELATIONSHIPS.relationships[0] ?? {})),
		);
		const keyphrase = Outputs.topics.shape.keyphrases;
		expect(keyphrase).toBeDefined();
	});
});
