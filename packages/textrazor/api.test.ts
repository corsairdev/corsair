import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import {
	AccountEndpoints,
	AnalysisEndpoints,
	ClassifierEndpoints,
	DictionaryEndpoints,
} from './endpoints';
import {
	TextrazorEndpointInputSchemas,
	TextrazorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import {
	assertTextrazorOk,
	TEXTRAZOR_API_BASE,
	TextrazorAPIError,
	toFormBody,
} from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} auth for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	},
}));

jest.mock('corsair/http', () => {
	class MockApiError extends Error {
		status: number;
		statusText: string;
		body: unknown;
		retryAfter: number | undefined;

		constructor(
			status: number,
			message: string,
			statusText = '',
			body: unknown = undefined,
			retryAfter: number | undefined = undefined,
		) {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.statusText = statusText;
			this.body = body;
			this.retryAfter = retryAfter;
		}
	}

	return { ApiError: MockApiError, request: jest.fn() };
});

const requestMock = request as unknown as jest.Mock;

function call(fn: unknown, ctx: unknown, input?: unknown): Promise<unknown> {
	return (fn as (c: unknown, i: unknown) => Promise<unknown>)(ctx, input);
}

function createContext() {
	return {
		key: 'test-key',
		db: {
			accounts: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			dictionaries: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			dictionaryEntries: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			categories: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			entities: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	};
}

const entityApple = {
	id: 0,
	matchingTokens: [0, 1],
	entityId: 'Apple Inc.',
	confidenceScore: 10.2,
	wikiLink: 'http://en.wikipedia.org/wiki/Apple_Inc.',
	matchedText: 'Apple Inc.',
	relevanceScore: 0.9,
	entityEnglishId: 'Apple Inc.',
	startingPos: 0,
	endingPos: 10,
	wikidataId: 'Q312',
	wikidataTypes: ['Q4830453/business'],
	type: ['Organisation', 'Company'],
};

describe('TextRazor form encoding', () => {
	it('encodes extractors as a comma-separated form field', () => {
		expect(
			toFormBody({
				extractors: ['entities', 'topics'],
				text: 'hello',
				'entities.allowOverlap': true,
			}),
		).toBe(
			'extractors=entities%2Ctopics&text=hello&entities.allowOverlap=true',
		);
	});

	it('omits empty arrays and undefined values', () => {
		expect(
			toFormBody({ extractors: [], text: undefined, url: 'https://x.test' }),
		).toBe('url=https%3A%2F%2Fx.test');
	});
});

describe('TextRazor schemas', () => {
	it('requires exactly one of text or url', () => {
		const schema = TextrazorEndpointInputSchemas.analyzeContent;
		expect(
			schema.safeParse({ extractors: ['entities'], text: 'hi' }).success,
		).toBe(true);
		expect(
			schema.safeParse({
				extractors: ['entities'],
				url: 'https://example.com',
			}).success,
		).toBe(true);
		expect(schema.safeParse({ extractors: ['entities'] }).success).toBe(false);
		expect(
			schema.safeParse({
				extractors: ['entities'],
				text: 'hi',
				url: 'https://example.com',
			}).success,
		).toBe(false);
	});

	it('parses a live classify payload shape', () => {
		TextrazorEndpointOutputSchemas.classifyText.parse({
			ok: true,
			time: 0.01671,
			response: {
				language: 'eng',
				languageIsReliable: true,
				entities: [entityApple],
				categories: [
					{
						id: 0,
						classifierId: 'textrazor_iab',
						categoryId: 'IAB17',
						label: 'Sports',
						score: 0.66,
					},
				],
			},
		});
	});

	it('parses a live account payload, including planDailyRequestsIncluded', () => {
		TextrazorEndpointOutputSchemas.getAccount.parse({
			ok: true,
			response: {
				plan: 'FREE',
				concurrentRequestLimit: 2,
				concurrentRequestsUsed: 1,
				planDailyRequestsIncluded: 500,
				requestsUsedToday: 0,
			},
		});
	});

	it('accepts an empty dictionary list envelope', () => {
		TextrazorEndpointOutputSchemas.listDictionaries.parse({
			ok: true,
			time: 0.09491,
		});
	});

	it('validates dictionary and classifier list payloads', () => {
		expect(
			TextrazorEndpointOutputSchemas.listDictionaries.safeParse({
				ok: true,
				response: [{ id: 'test_ents', matchType: 'token' }],
			}).success,
		).toBe(true);
		expect(
			TextrazorEndpointOutputSchemas.listDictionaries.safeParse({
				ok: true,
				response: { dictionaries: [{ id: 'test_ents' }] },
			}).success,
		).toBe(true);
		expect(
			TextrazorEndpointOutputSchemas.listDictionaries.safeParse({
				ok: true,
				response: 'not-a-list',
			}).success,
		).toBe(false);

		expect(
			TextrazorEndpointOutputSchemas.listDictionaryEntries.safeParse({
				ok: true,
				response: [{ id: 'DEV1', text: 'Bjarne Stroustrup' }],
				limit: 20,
				offset: 0,
			}).success,
		).toBe(true);
		expect(
			TextrazorEndpointOutputSchemas.listDictionaryEntries.safeParse({
				ok: true,
				response: 12,
			}).success,
		).toBe(false);

		expect(
			TextrazorEndpointOutputSchemas.listClassifierCategories.safeParse({
				ok: true,
				response: [{ categoryId: '100', label: 'Golf' }],
			}).success,
		).toBe(true);
		expect(
			TextrazorEndpointOutputSchemas.listClassifierCategories.safeParse({
				ok: true,
				response: { categories: [{ categoryId: '100' }] },
			}).success,
		).toBe(true);
		expect(
			TextrazorEndpointOutputSchemas.listClassifierCategories.safeParse({
				ok: true,
				response: true,
			}).success,
		).toBe(false);
	});
});

describe('TextRazor endpoint routing', () => {
	beforeEach(() => {
		requestMock.mockReset();
		requestMock.mockResolvedValue({ ok: true });
		(logEventFromContext as unknown as jest.Mock).mockReset();
	});

	it('sends X-TextRazor-Key and never a bearer token', async () => {
		requestMock.mockResolvedValue({
			ok: true,
			response: { entities: [entityApple] },
		});
		await call(AnalysisEndpoints.analyzeContent, createContext(), {
			text: 'Apple Inc. announced a partnership.',
			extractors: ['entities', 'topics'],
		});

		const [config, options] = requestMock.mock.calls[0] as [
			{ BASE: string; TOKEN?: string; HEADERS: Record<string, string> },
			{ method: string; url: string; body: string; mediaType: string },
		];
		expect(config.BASE).toBe(TEXTRAZOR_API_BASE);
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS['X-TextRazor-Key']).toBe('test-key');
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/');
		expect(options.mediaType).toBe('application/x-www-form-urlencoded');
		expect(options.body).toContain('extractors=entities%2Ctopics');
		expect(options.body).toContain('text=Apple');
	});

	it('filters extracted entities by score thresholds', async () => {
		requestMock.mockResolvedValue({
			ok: true,
			response: {
				entities: [
					{ ...entityApple, relevanceScore: 0.2, confidenceScore: 1 },
					{
						...entityApple,
						entityId: 'OpenAI',
						relevanceScore: 0.9,
						confidenceScore: 8,
					},
				],
			},
		});
		const result = (await call(
			AnalysisEndpoints.extractEntities,
			createContext(),
			{
				text: 'Apple Inc. announced a partnership with OpenAI.',
				minRelevanceScore: 0.5,
				minConfidenceScore: 2,
			},
		)) as { response?: { entities?: Array<{ entityId?: string }> } };
		expect(result.response?.entities).toEqual([
			expect.objectContaining({ entityId: 'OpenAI' }),
		]);
	});

	it('GETs account/', async () => {
		requestMock.mockResolvedValue({
			ok: true,
			response: { plan: 'FREE', planDailyRequestsIncluded: 500 },
		});
		await call(AccountEndpoints.get, createContext(), {});
		const [, options] = requestMock.mock.calls[0] as [
			unknown,
			{ method: string; url: string },
		];
		expect(options.method).toBe('GET');
		expect(options.url).toBe('account/');
	});

	it('creates, lists, pages, and deletes dictionaries', async () => {
		const ctx = createContext();
		await call(DictionaryEndpoints.create, ctx, {
			id: 'test_ents',
			matchType: 'token',
			caseInsensitive: true,
			language: 'eng',
		});
		await call(DictionaryEndpoints.list, ctx, {});
		await call(DictionaryEndpoints.get, ctx, { id: 'test_ents' });
		await call(DictionaryEndpoints.listEntries, ctx, {
			id: 'test_ents',
			limit: 20,
			offset: 0,
		});
		await call(DictionaryEndpoints.addEntries, ctx, {
			id: 'test_ents',
			entries: [{ text: 'Bjarne Stroustrup', id: 'DEV2' }],
		});
		await call(DictionaryEndpoints.getEntry, ctx, {
			id: 'test_ents',
			entryId: 'DEV2',
		});
		await call(DictionaryEndpoints.deleteEntry, ctx, {
			id: 'test_ents',
			entryId: 'DEV2',
		});
		await call(DictionaryEndpoints.delete, ctx, { id: 'test_ents' });

		const urls = requestMock.mock.calls.map(
			(callArgs) =>
				(callArgs[1] as { method: string; url: string }).method +
				' ' +
				(callArgs[1] as { url: string }).url,
		);
		expect(urls).toEqual([
			'PUT entities/test_ents',
			'GET entities/',
			'GET entities/test_ents',
			'GET entities/test_ents/_all',
			'POST entities/test_ents/',
			'GET entities/test_ents/DEV2',
			'DELETE entities/test_ents/DEV2',
			'DELETE entities/test_ents',
		]);
		const listEntries = requestMock.mock.calls[3] as [
			unknown,
			{ query: { limit: number; offset: number } },
		];
		expect(listEntries[1].query).toEqual({ limit: 20, offset: 0 });
	});

	it('creates, pages, and deletes custom classifiers', async () => {
		const ctx = createContext();
		await call(ClassifierEndpoints.put, ctx, {
			id: 'sport',
			categories: [
				{ categoryId: '100', label: 'Golf', query: "concept('sport>golf')" },
			],
		});
		await call(ClassifierEndpoints.listCategories, ctx, {
			id: 'sport',
			limit: 20,
			offset: 0,
		});
		await call(ClassifierEndpoints.getCategory, ctx, {
			id: 'sport',
			categoryId: '100',
		});
		await call(ClassifierEndpoints.deleteCategory, ctx, {
			id: 'sport',
			categoryId: '100',
		});
		await call(ClassifierEndpoints.delete, ctx, { id: 'sport' });

		const urls = requestMock.mock.calls.map(
			(callArgs) =>
				(callArgs[1] as { method: string; url: string }).method +
				' ' +
				(callArgs[1] as { url: string }).url,
		);
		expect(urls).toEqual([
			'PUT categories/sport',
			'GET categories/sport/_all',
			'GET categories/sport/100',
			'DELETE categories/sport/100',
			'DELETE categories/sport',
		]);
	});

	it('throws when TextRazor returns ok:false', () => {
		expect(() =>
			assertTextrazorOk({ ok: false, error: 'bad document' }),
		).toThrow(TextrazorAPIError);
	});

	it('does not retry auth failures', async () => {
		const error = new TextrazorAPIError('Unauthorized');
		(error as { status?: number }).status = 401;
		const matched = errorHandlers.AUTH_ERROR.match(error);
		expect(matched).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries server errors', async () => {
		const error = new TextrazorAPIError('Internal Server Error');
		(error as { status?: number }).status = 500;
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});
});
