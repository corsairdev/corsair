import { logEventFromContext } from 'corsair/core';
import { DataForSeoAPIError, packCredentials } from './client';
import {
	Account,
	Ai,
	Amazon,
	AppStore,
	Backlinks,
	Keywords,
	Serp,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { envelope, results } from './test-samples';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

function respond(status: number, body: object) {
	fetchMock.mockImplementation(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json' },
			}),
	);
}

function createContext(options: { sandbox?: boolean } = {}) {
	return {
		key: packCredentials('api-login', 'api-password'),
		options,
		db: {
			keywords: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			backlinkTargets: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			amazonProducts: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]!;
	return {
		url: new URL(url),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

const us = { location_code: 2840, language_code: 'en' };
const taskId = '10161253-2813-0064-0000-c2fac51bbd3b';

const cases: [
	string,
	AnyEndpoint,
	object,
	'GET' | 'POST',
	string,
	object | null,
][] = [
	[
		'serp.googleOrganic',
		Serp.googleOrganic as AnyEndpoint,
		{ keyword: 'running shoes', ...us, depth: 10 },
		'POST',
		'/v3/serp/google/organic/live/advanced',
		results.serpGoogleOrganic,
	],
	[
		'serp.googleNews',
		Serp.googleNews as AnyEndpoint,
		{ keyword: 'stripe', ...us },
		'POST',
		'/v3/serp/google/news/live/advanced',
		results.serpGoogleNews,
	],
	[
		'serp.locations',
		Serp.locations as AnyEndpoint,
		{},
		'GET',
		'/v3/serp/google/locations',
		results.serpLocations,
	],
	[
		'serp.languages',
		Serp.languages as AnyEndpoint,
		{},
		'GET',
		'/v3/serp/google/languages',
		results.serpLanguages,
	],
	[
		'keywords.searchVolume',
		Keywords.searchVolume as AnyEndpoint,
		{ keywords: ['running shoes'], ...us },
		'POST',
		'/v3/keywords_data/google_ads/search_volume/live',
		results.keywordsSearchVolume,
	],
	[
		'keywords.suggestions',
		Keywords.suggestions as AnyEndpoint,
		{ keyword: 'running shoes', ...us, limit: 1 },
		'POST',
		'/v3/dataforseo_labs/google/keyword_suggestions/live',
		results.keywordsSuggestions,
	],
	[
		'keywords.ideas',
		Keywords.ideas as AnyEndpoint,
		{ keywords: ['running shoes'], ...us, limit: 1 },
		'POST',
		'/v3/dataforseo_labs/google/keyword_ideas/live',
		results.keywordsIdeas,
	],
	[
		'keywords.locations',
		Keywords.locations as AnyEndpoint,
		{},
		'GET',
		'/v3/dataforseo_labs/locations_and_languages',
		results.keywordsLocations,
	],
	[
		'backlinks.summary',
		Backlinks.summary as AnyEndpoint,
		{ target: 'stripe.com' },
		'POST',
		'/v3/backlinks/summary/live',
		results.backlinksSummary,
	],
	[
		'backlinks.list',
		Backlinks.list as AnyEndpoint,
		{ target: 'stripe.com', limit: 1 },
		'POST',
		'/v3/backlinks/backlinks/live',
		results.backlinksList,
	],
	[
		'backlinks.referringDomains',
		Backlinks.referringDomains as AnyEndpoint,
		{ target: 'stripe.com', limit: 1 },
		'POST',
		'/v3/backlinks/referring_domains/live',
		results.backlinksReferringDomains,
	],
	[
		'backlinks.anchors',
		Backlinks.anchors as AnyEndpoint,
		{ target: 'stripe.com', limit: 1 },
		'POST',
		'/v3/backlinks/anchors/live',
		results.backlinksAnchors,
	],
	[
		'backlinks.competitors',
		Backlinks.competitors as AnyEndpoint,
		{ target: 'stripe.com', limit: 1 },
		'POST',
		'/v3/backlinks/competitors/live',
		results.backlinksCompetitors,
	],
	[
		'backlinks.bulkRanks',
		Backlinks.bulkRanks as AnyEndpoint,
		{ targets: ['stripe.com', 'paypal.com'] },
		'POST',
		'/v3/backlinks/bulk_ranks/live',
		results.backlinksBulkRanks,
	],
	[
		'ai.chatgptResponse',
		Ai.chatgptResponse as AnyEndpoint,
		{ user_prompt: 'What does Stripe do?', model_name: 'gpt-4.1-mini' },
		'POST',
		'/v3/ai_optimization/chat_gpt/llm_responses/live',
		results.aiChatgptResponse,
	],
	[
		'ai.perplexityResponse',
		Ai.perplexityResponse as AnyEndpoint,
		{ user_prompt: 'What does Stripe do?', model_name: 'sonar' },
		'POST',
		'/v3/ai_optimization/perplexity/llm_responses/live',
		results.aiPerplexityResponse,
	],
	[
		'ai.geminiResponse',
		Ai.geminiResponse as AnyEndpoint,
		{ user_prompt: 'What does Stripe do?', model_name: 'gemini-2.5-flash' },
		'POST',
		'/v3/ai_optimization/gemini/llm_responses/live',
		results.aiGeminiResponse,
	],
	[
		'ai.mentionsSearch',
		Ai.mentionsSearch as AnyEndpoint,
		{ target: [{ domain: 'stripe.com' }], limit: 1 },
		'POST',
		'/v3/ai_optimization/llm_mentions/search_mentions/live',
		results.aiMentionsSearch,
	],
	[
		'ai.mentionsTopDomains',
		Ai.mentionsTopDomains as AnyEndpoint,
		{ target: [{ keyword: 'payment processing', match_type: 'word_match' }] },
		'POST',
		'/v3/ai_optimization/llm_mentions/top_mentioned_domains/live',
		results.aiMentionsTopDomains,
	],
	[
		'amazon.products',
		Amazon.products as AnyEndpoint,
		{ keyword: 'running shoes', location_code: 2840, language_code: 'en_US' },
		'POST',
		'/v3/merchant/amazon/products/live/advanced',
		results.amazonProducts,
	],
	[
		'amazon.asin',
		Amazon.asin as AnyEndpoint,
		{ asin: 'B0CHX1W1XY', location_code: 2840, language_code: 'en_US' },
		'POST',
		'/v3/merchant/amazon/asin/live/advanced',
		results.amazonAsin,
	],
	[
		'appStore.searchTask',
		AppStore.searchTask as AnyEndpoint,
		{ keyword: 'budget app', ...us },
		'POST',
		'/v3/app_data/apple/app_searches/task_post',
		null,
	],
	[
		'appStore.searchResult',
		AppStore.searchResult as AnyEndpoint,
		{ id: taskId },
		'GET',
		`/v3/app_data/apple/app_searches/task_get/advanced/${taskId}`,
		results.appStoreSearchResult,
	],
	[
		'appStore.infoTask',
		AppStore.infoTask as AnyEndpoint,
		{ app_id: '835599320', ...us },
		'POST',
		'/v3/app_data/apple/app_info/task_post',
		null,
	],
	[
		'appStore.infoResult',
		AppStore.infoResult as AnyEndpoint,
		{ id: taskId },
		'GET',
		`/v3/app_data/apple/app_info/task_get/advanced/${taskId}`,
		results.appStoreInfoResult,
	],
	[
		'appStore.reviewsTask',
		AppStore.reviewsTask as AnyEndpoint,
		{ app_id: '835599320', ...us, sort_by: 'most_recent' },
		'POST',
		'/v3/app_data/apple/app_reviews/task_post',
		null,
	],
	[
		'appStore.reviewsResult',
		AppStore.reviewsResult as AnyEndpoint,
		{ id: taskId },
		'GET',
		`/v3/app_data/apple/app_reviews/task_get/advanced/${taskId}`,
		results.appStoreReviewsResult,
	],
	[
		'account.userData',
		Account.userData as AnyEndpoint,
		{},
		'GET',
		'/v3/appendix/user_data',
		results.accountUserData,
	],
];

beforeAll(() => {
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe.each(cases)('%s', (name, endpoint, input, method, path, result) => {
	it(`${method} ${path} with Basic auth and parses the task envelope`, async () => {
		respond(200, envelope(path, result === null ? null : [result]));
		const ctx = createContext();

		const response = (await endpoint(ctx, input)) as {
			status_code: number;
			tasks: { id: string; result: unknown[] | null }[];
		};

		const call = lastCall();
		expect(call.method).toBe(method);
		expect(call.url.origin).toBe('https://api.dataforseo.com');
		expect(call.url.pathname).toBe(path);
		expect(call.headers.get('authorization')).toBe(
			`Basic ${Buffer.from('api-login:api-password').toString('base64')}`,
		);
		if (method === 'POST') expect(call.body).toEqual([input]);
		else expect(call.body).toBeUndefined();
		expect(response.status_code).toBe(20000);
		expect(response.tasks[0]!.id).toBe(taskId);
		expect(response.tasks[0]!.result).toEqual(
			result === null ? null : [expect.anything()],
		);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			`dataforseo.${name}`,
			{ cost: 0.002, taskId },
			'completed',
		);
	});
});

describe('client', () => {
	it('sends requests to the sandbox host when sandbox is set', async () => {
		respond(200, envelope('/v3/appendix/user_data', [results.accountUserData]));

		await (Account.userData as AnyEndpoint)(
			createContext({ sandbox: true }),
			{},
		);

		expect(lastCall().url.origin).toBe('https://sandbox.dataforseo.com');
	});

	it('uses the per-country locations path', async () => {
		respond(
			200,
			envelope('/v3/serp/google/locations/us', [results.serpLocations]),
		);

		await (Serp.locations as AnyEndpoint)(createContext(), { country: 'US' });

		expect(lastCall().url.pathname).toBe('/v3/serp/google/locations/us');
	});

	it('treats 40102 (no search results) as a completed, empty task', async () => {
		const body = envelope('/v3/serp/google/news/live/advanced', null);
		body.tasks[0]!.status_code = 40102;
		body.tasks[0]!.status_message = 'No Search Results.';
		respond(200, body);

		await expect(
			(Serp.googleNews as AnyEndpoint)(createContext(), {
				keyword: 'zzqqxx',
				...us,
			}),
		).resolves.toMatchObject({ tasks: [{ status_code: 40102, result: null }] });
	});

	it('throws on an envelope-level error code', async () => {
		respond(200, {
			version: '0.1.20260917',
			status_code: 40104,
			status_message: 'Please verify your account before using the API.',
			tasks: null,
		});

		const error = (await (Serp.languages as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as DataForSeoAPIError;

		expect(error).toBeInstanceOf(DataForSeoAPIError);
		expect(error.code).toBe(40104);
		expect(error.message).toBe(
			'40104 Please verify your account before using the API.',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('throws on a task-level error code in a 200 response', async () => {
		const body = envelope('/v3/backlinks/summary/live', null);
		body.tasks[0]!.status_code = 40204;
		body.tasks[0]!.status_message =
			'Access denied. Visit Plans and Subscriptions.';
		respond(200, body);

		const error = (await (Backlinks.summary as AnyEndpoint)(createContext(), {
			target: 'stripe.com',
		}).catch((e: Error) => e)) as DataForSeoAPIError;

		expect(error.code).toBe(40204);
		expect(errorHandlers.BILLING_OR_ACCESS_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.BILLING_OR_ACCESS_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('reads the code from an HTTP error body', async () => {
		respond(403, {
			status_code: 40104,
			status_message: 'Please verify your account before using the API.',
			tasks: null,
		});

		const error = (await (Account.userData as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as DataForSeoAPIError;

		expect(error.status).toBe(403);
		expect(error.code).toBe(40104);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});
});

describe('error handlers', () => {
	const withCode = (code: number) =>
		new DataForSeoAPIError(`${code} x`, { code });

	it('retries rate limits with backoff', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(withCode(40202))).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(withCode(40209))).toBe(true);
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(withCode(40202)),
		).toMatchObject({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries codes the reference says to resubmit', async () => {
		for (const code of [40101, 40103, 50000, 50401]) {
			expect(errorHandlers.SERVER_ERROR.match(withCode(code))).toBe(true);
		}
		expect(await errorHandlers.SERVER_ERROR.handler()).toMatchObject({
			maxRetries: 2,
		});
	});

	it('does not retry billing, duplicate, not-ready, or validation codes', async () => {
		expect(errorHandlers.BILLING_OR_ACCESS_ERROR.match(withCode(40210))).toBe(
			true,
		);
		expect(errorHandlers.DUPLICATE_LIMIT_ERROR.match(withCode(40206))).toBe(
			true,
		);
		expect(errorHandlers.TASK_NOT_READY.match(withCode(40602))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(withCode(40501))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(withCode(40401))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(withCode(40602))).toBe(false);
	});

	it('fails zod validation on a malformed result', async () => {
		respond(
			200,
			envelope('/v3/backlinks/bulk_ranks/live', [{ items: [{ target: 7 }] }]),
		);

		const error = (await (Backlinks.bulkRanks as AnyEndpoint)(createContext(), {
			targets: ['stripe.com'],
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});

describe('SERP items', () => {
	it('keeps type-specific fields of untyped item types', async () => {
		respond(
			200,
			envelope('/v3/serp/google/organic/live/advanced', [
				results.serpGoogleOrganic,
			]),
		);

		const response = (await (Serp.googleOrganic as AnyEndpoint)(
			createContext(),
			{
				keyword: 'running shoes',
				...us,
			},
		)) as { tasks: { result: { items: Record<string, unknown>[] }[] }[] };

		const knowledgeGraph = response.tasks[0]!.result[0]!.items.find(
			(item) => item.type === 'knowledge_graph',
		);
		expect(knowledgeGraph).toMatchObject({ sub_title: 'Footwear' });
	});

	it('rejects a typed item type that does not match its schema', async () => {
		const result = {
			...results.serpGoogleOrganic,
			items: [{ type: 'organic', rank_group: 'first' }],
		};
		respond(200, envelope('/v3/serp/google/organic/live/advanced', [result]));

		await expect(
			(Serp.googleOrganic as AnyEndpoint)(createContext(), {
				keyword: 'x',
				...us,
			}),
		).rejects.toThrow();
	});
});

describe('input rules', () => {
	it('requires a location and language unless a url is given', async () => {
		await expect(
			(Serp.googleOrganic as AnyEndpoint)(createContext(), {
				keyword: 'running shoes',
				language_code: 'en',
			}),
		).rejects.toThrow(
			'Provide location_name, location_code, or location_coordinate',
		);

		respond(
			200,
			envelope('/v3/serp/google/organic/live/advanced', [
				results.serpGoogleOrganic,
			]),
		);
		await (Serp.googleOrganic as AnyEndpoint)(createContext(), {
			keyword: 'running shoes',
			url: 'https://www.google.com/search?q=running+shoes&gl=us',
		});
	});

	it('caps depth and documented list sizes', async () => {
		await expect(
			(Serp.googleOrganic as AnyEndpoint)(createContext(), {
				keyword: 'x',
				...us,
				depth: 201,
			}),
		).rejects.toThrow();
		await expect(
			(Keywords.ideas as AnyEndpoint)(createContext(), {
				keywords: Array.from({ length: 201 }, (_, i) => `k${i}`),
				...us,
			}),
		).rejects.toThrow();
		await expect(
			(Ai.mentionsSearch as AnyEndpoint)(createContext(), {
				target: Array.from({ length: 11 }, () => ({ domain: 'stripe.com' })),
			}),
		).rejects.toThrow();
	});

	it('accepts nested filters and validates operators', async () => {
		respond(
			200,
			envelope('/v3/backlinks/backlinks/live', [results.backlinksList]),
		);
		const filters = [
			['page_from_rank', '>', 55],
			'and',
			[['dofollow', '=', true], 'or', ['rank', '>=', 500]],
		];

		await (Backlinks.list as AnyEndpoint)(createContext(), {
			target: 'stripe.com',
			filters,
			order_by: ['rank,desc'],
		});
		expect(lastCall().body[0].filters).toEqual(filters);

		await expect(
			(Backlinks.list as AnyEndpoint)(createContext(), {
				target: 'stripe.com',
				filters: ['rank', 'bigger', 1],
			}),
		).rejects.toThrow();
		await expect(
			(Backlinks.list as AnyEndpoint)(createContext(), {
				target: 'stripe.com',
				order_by: ['rank'],
			}),
		).rejects.toThrow();
	});

	it('enforces the Gemini reasoning token minimum', async () => {
		await expect(
			(Ai.geminiResponse as AnyEndpoint)(createContext(), {
				user_prompt: 'Hi',
				model_name: 'gemini-2.5-pro',
				use_reasoning: true,
				max_output_tokens: 512,
			}),
		).rejects.toThrow('max_output_tokens of at least 1024');
	});

	it('requires postback_data with postback_url', async () => {
		await expect(
			(AppStore.searchTask as AnyEndpoint)(createContext(), {
				keyword: 'budget app',
				...us,
				postback_url: 'https://example.com/hook',
			}),
		).rejects.toThrow('postback_data');
	});
});

describe('caching', () => {
	it('saves keyword metrics from search volume and labs results', async () => {
		respond(
			200,
			envelope('/v3/keywords_data/google_ads/search_volume/live', [
				results.keywordsSearchVolume,
			]),
		);
		const ctx = createContext();

		await (Keywords.searchVolume as AnyEndpoint)(ctx, {
			keywords: ['running shoes'],
			...us,
		});

		expect(ctx.db.keywords.upsertByEntityId).toHaveBeenCalledWith(
			'running shoes:2840:en',
			expect.objectContaining({ searchVolume: 246000, competition: 'HIGH' }),
		);

		respond(
			200,
			envelope('/v3/dataforseo_labs/google/keyword_ideas/live', [
				results.keywordsIdeas,
			]),
		);
		await (Keywords.ideas as AnyEndpoint)(ctx, {
			keywords: ['running shoes'],
			...us,
		});
		expect(ctx.db.keywords.upsertByEntityId).toHaveBeenCalledWith(
			'running shoes for women:2840:en',
			expect.objectContaining({ searchVolume: 74000, cpc: 1.21 }),
		);
	});

	it('saves backlink summaries by target', async () => {
		respond(
			200,
			envelope('/v3/backlinks/summary/live', [results.backlinksSummary]),
		);
		const ctx = createContext();

		await (Backlinks.summary as AnyEndpoint)(ctx, { target: 'stripe.com' });

		expect(ctx.db.backlinkTargets.upsertByEntityId).toHaveBeenCalledWith(
			'stripe.com',
			expect.objectContaining({ rank: 812, referringDomains: 41022 }),
		);
	});

	it('saves Amazon products by ASIN', async () => {
		respond(
			200,
			envelope('/v3/merchant/amazon/asin/live/advanced', [results.amazonAsin]),
		);
		const ctx = createContext();

		await (Amazon.asin as AnyEndpoint)(ctx, {
			asin: 'B0CHX1W1XY',
			location_code: 2840,
			language_code: 'en_US',
		});

		expect(ctx.db.amazonProducts.upsertByEntityId).toHaveBeenCalledWith(
			'B0CHX1W1XY',
			expect.objectContaining({
				priceFrom: 139.95,
				rating: 4.6,
				isAvailable: true,
			}),
		);
	});
});
