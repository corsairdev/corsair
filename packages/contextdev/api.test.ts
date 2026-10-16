import { logEventFromContext } from 'corsair/core';
import { ContextDevAPIError } from './client';
import { Account, Brand, News, People, Web } from './endpoints';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

function respond(
	status: number,
	body: object,
	headers: Record<string, string> = {},
) {
	fetchMock.mockImplementation(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json', ...headers },
			}),
	);
}

function createContext() {
	return {
		key: 'test-key',
		options: {},
		db: {
			brands: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			newsArticles: {
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

const billing = {
	key_metadata: { credits_consumed: 1, credits_remaining: 999 },
	request_id: 'req_1',
};
const cache = { cache_metadata: { status: 'miss', age_ms: 0 } };
const typography = {
	fontFamily: 'Sohne',
	fontFallbacks: ['sans-serif'],
	fontSize: '48px',
	fontWeight: 500,
	lineHeight: '1.1',
	letterSpacing: '-0.02em',
};
const pageMetadata = {
	title: 'Stripe Pricing',
	headings: [{ level: 1, text: 'Pricing' }],
};
const notRequested = { requested: false, success: null, data: null };

const passThrough: [
	string,
	AnyEndpoint,
	object,
	'GET' | 'POST',
	string,
	object,
][] = [
	[
		'brand.search',
		Brand.search as AnyEndpoint,
		{ query: 'stripe', typoTolerance: 1 },
		'GET',
		'/v1/brand/search',
		{
			results: [
				{
					domain: 'stripe.com',
					name: 'Stripe',
					logo: 'https://media.context.dev/stripe.png',
				},
			],
			...billing,
		},
	],
	[
		'brand.styleguide',
		Brand.styleguide as AnyEndpoint,
		{ domain: 'stripe.com' },
		'GET',
		'/v1/web/styleguide',
		{
			status: 'ok',
			domain: 'stripe.com',
			styleguide: {
				mode: 'light',
				colors: { accent: '#635bff', background: '#ffffff', text: '#0a2540' },
				typography: { headings: { h1: typography }, p: typography },
				elementSpacing: {
					xs: '4px',
					sm: '8px',
					md: '16px',
					lg: '24px',
					xl: '32px',
				},
				shadows: {
					sm: 'none',
					md: 'none',
					lg: 'none',
					xl: 'none',
					inner: 'none',
				},
				fontLinks: {
					Sohne: {
						type: 'custom',
						files: { '400': 'https://b.stripecdn.com/sohne.woff2' },
					},
				},
				components: { button: {} },
			},
			code: 200,
			...cache,
			...billing,
		},
	],
	[
		'brand.fonts',
		Brand.fonts as AnyEndpoint,
		{ domain: 'stripe.com' },
		'GET',
		'/v1/web/fonts',
		{
			status: 'ok',
			domain: 'stripe.com',
			fonts: [
				{
					font: 'Sohne',
					uses: ['body'],
					fallbacks: ['sans-serif'],
					num_elements: 120,
					num_words: 900,
					percent_words: 0.9,
					percent_elements: 0.8,
				},
			],
			code: 200,
			...cache,
			...billing,
		},
	],
	[
		'brand.naics',
		Brand.naics as AnyEndpoint,
		{ input: 'stripe.com', maxResults: 2 },
		'GET',
		'/v1/web/naics',
		{
			status: 'ok',
			domain: 'stripe.com',
			codes: [
				{
					code: '522320',
					name: 'Financial Transactions Processing',
					confidence: 'high',
				},
			],
			...billing,
		},
	],
	[
		'brand.sic',
		Brand.sic as AnyEndpoint,
		{ input: 'stripe.com', type: 'latest_sec' },
		'GET',
		'/v1/web/sic',
		{
			status: 'ok',
			classification: 'latest_sec',
			codes: [
				{
					code: '7374',
					name: 'Services-Computer Processing',
					confidence: 'high',
					office: 'Office of Technology',
				},
			],
			...billing,
		},
	],
	[
		'brand.prefetch',
		Brand.prefetch as AnyEndpoint,
		{ type: 'brand', identifier: { domain: 'linear.app' } },
		'POST',
		'/v1/utility/prefetch',
		{ status: 'ok', type: 'brand', domain: 'linear.app', request_id: 'req_1' },
	],
	[
		'web.urls',
		Web.urls as AnyEndpoint,
		{ domain: 'stripe.com', maxLinks: 3, search: 'pricing' },
		'GET',
		'/v1/web/urls',
		{
			success: true,
			domain: 'stripe.com',
			urls: [{ url: 'https://stripe.com/pricing', title: 'Pricing' }],
			...billing,
		},
	],
	[
		'web.crawl',
		Web.crawl as AnyEndpoint,
		{ url: 'https://example.com', maxPages: 2 },
		'POST',
		'/v1/web/crawl',
		{
			results: [
				{
					markdown: '# Example Domain',
					metadata: {
						sourceUrl: 'https://example.com',
						finalUrl: 'https://example.com/',
						url: 'https://example.com/',
						title: 'Example Domain',
						crawlDepth: 0,
						statusCode: 200,
						success: true,
					},
				},
			],
			metadata: {
				numUrls: 1,
				maxCrawlDepth: 0,
				numSucceeded: 1,
				numFailed: 0,
				numSkipped: 0,
			},
			...cache,
			...billing,
		},
	],
	[
		'web.extract',
		Web.extract as AnyEndpoint,
		{
			url: 'https://stripe.com/pricing',
			maxPages: 1,
			schema: { type: 'object', properties: { card_fee: { type: 'string' } } },
		},
		'POST',
		'/v1/web/extract',
		{
			status: 'ok',
			url: 'https://stripe.com/pricing',
			urls_analyzed: ['https://stripe.com/pricing'],
			data: { card_fee: '2.9% + 30¢' },
			metadata: {
				numUrls: 1,
				maxCrawlDepth: 0,
				numSucceeded: 1,
				numFailed: 0,
				numSkipped: 0,
				numBlocked: 0,
			},
			...cache,
			...billing,
		},
	],
	[
		'web.search',
		Web.search as AnyEndpoint,
		{ query: 'running shoes', numResults: 2, freshness: 'last_month' },
		'POST',
		'/v1/web/search',
		{
			query: 'running shoes',
			results: [
				{
					url: 'https://www.runnersworld.com/gear/',
					title: 'Best Running Shoes',
					description: 'Tested picks.',
					relevance: 'high',
					markdown: { markdown: null, code: 'NOT_REQUESTED' },
					highlights: { highlights: null, code: 'NOT_REQUESTED' },
				},
			],
			...cache,
			...billing,
		},
	],
	[
		'web.answers',
		Web.answers as AnyEndpoint,
		{
			task: 'What year was Stripe founded?',
			mode: 'fast',
			json_format: { year: 2010 },
		},
		'POST',
		'/v1/web/answers',
		{
			json_content: { year: 2010 },
			sources: ['https://en.wikipedia.org/wiki/Stripe,_Inc.'],
			key_metadata: { credits_consumed: 10, credits_remaining: 989 },
		},
	],
	[
		'people.enrich',
		People.enrich as AnyEndpoint,
		{
			name: { first: 'Patrick', last: 'Collison' },
			company: { domain: 'stripe.com' },
		},
		'POST',
		'/v1/people/enrich',
		{
			match: {
				status: 'candidate',
				score: 92,
				person: {
					name: { full: 'Patrick Collison' },
					social_urls: ['https://www.linkedin.com/in/patrickcollison'],
					website_urls: [],
					current_role: {
						title: 'CEO',
						organization: { name: 'Stripe', domain: 'stripe.com' },
					},
					current_role_status: 'present',
					experience: [],
					education: [],
					skills: [],
				},
			},
			...billing,
		},
	],
	[
		'account.usage',
		Account.usage as AnyEndpoint,
		{},
		'GET',
		'/v1/org/usage',
		{
			credits_remaining: 1000,
			period: { start: '2026-10-14T07:01:00.000Z', credits_used: 0 },
			next_refill: null,
			auto_topup: {
				enabled: false,
				credits_used_this_period: 0,
				monthly_budget_credits: null,
			},
			...billing,
		},
	],
];

beforeAll(() => {
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe.each(passThrough)(
	'%s',
	(name, endpoint, input, method, path, body) => {
		it(`${method} ${path} with bearer auth and parses the response`, async () => {
			respond(200, body);
			const ctx = createContext();

			const result = await endpoint(ctx, input);

			const call = lastCall();
			expect(call.method).toBe(method);
			expect(call.url.pathname).toBe(path);
			expect(call.headers.get('authorization')).toBe('Bearer test-key');
			if (method === 'POST') expect(call.body).toEqual(input);
			expect(result).toEqual(body);
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`contextdev.${name}`,
				expect.any(Object),
				'completed',
			);
		});
	},
);

describe('query encoding', () => {
	it('sends GET inputs as query parameters, objects in deepObject style', async () => {
		respond(200, passThrough[1]![5]);

		await (Brand.styleguide as AnyEndpoint)(createContext(), {
			domain: 'stripe.com',
			colorScheme: 'dark',
			timeoutOpts: { milliseconds: 5000, behavior: 'fail' },
		});

		const { url } = lastCall();
		expect(url.searchParams.get('domain')).toBe('stripe.com');
		expect(url.searchParams.get('colorScheme')).toBe('dark');
		expect(url.searchParams.get('timeoutOpts[milliseconds]')).toBe('5000');
		expect(url.searchParams.get('timeoutOpts[behavior]')).toBe('fail');
	});

	it('requires exactly one of domain or directUrl', async () => {
		await expect(
			(Brand.fonts as AnyEndpoint)(createContext(), {
				domain: 'stripe.com',
				directUrl: 'https://stripe.com/pricing',
			}),
		).rejects.toThrow('Provide either domain or directUrl');
		await expect(
			(Brand.fonts as AnyEndpoint)(createContext(), {}),
		).rejects.toThrow('Provide either domain or directUrl');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('brand.retrieve', () => {
	it('posts the lookup and caches the brand by domain', async () => {
		const body = {
			status: 'ok',
			brand: {
				domain: 'stripe.com',
				title: 'Stripe',
				colors: [{ hex: '#635bff', name: 'Blurple' }],
				logos: [{ url: 'https://media.context.dev/stripe.svg', type: 'logo' }],
				industries: {
					eic: [
						{ industry: 'Finance', subindustry: 'Payments & Money Movement' },
					],
				},
				employees: { range: '5001 to 10000' },
				address: { country_code: 'US' },
			},
			code: 200,
			...cache,
			...billing,
		};
		respond(200, body);
		const ctx = createContext();

		const result = await (Brand.retrieve as AnyEndpoint)(ctx, {
			type: 'by_domain',
			domain: 'stripe.com',
		});

		expect(lastCall().body).toEqual({
			type: 'by_domain',
			domain: 'stripe.com',
		});
		expect(result).toEqual(body);
		expect(ctx.db.brands.upsertByEntityId).toHaveBeenCalledWith(
			'stripe.com',
			expect.objectContaining({
				title: 'Stripe',
				logoUrl: 'https://media.context.dev/stripe.svg',
				primaryColor: '#635bff',
				industry: 'Finance',
				country: 'US',
			}),
		);
	});

	it('rejects an unknown lookup type', async () => {
		await expect(
			(Brand.retrieve as AnyEndpoint)(createContext(), {
				type: 'by_phone',
				phone: '555',
			}),
		).rejects.toThrow();
	});
});

describe('web.scrape', () => {
	const body = {
		url: 'https://stripe.com/pricing',
		html: notRequested,
		markdown: { requested: true, success: true, data: '# Pricing' },
		screenshot: notRequested,
		images: notRequested,
		highlights: {
			requested: true,
			success: false,
			data: null,
			error_code: 'NO_MATCH',
			message: 'No passage matched',
		},
		json: notRequested,
		metadata: pageMetadata,
		...cache,
		...billing,
	};

	it('posts formats with their params and parses each output', async () => {
		respond(200, body);

		const result = await (Web.scrape as AnyEndpoint)(createContext(), {
			url: 'https://stripe.com/pricing',
			formats: { markdown: true, highlights: true },
			highlightsParams: { query: 'card processing fee' },
		});

		expect(lastCall().url.pathname).toBe('/v1/web/scrape');
		expect(result).toEqual(body);
	});

	it('requires at least one format', async () => {
		await expect(
			(Web.scrape as AnyEndpoint)(createContext(), {
				url: 'https://stripe.com',
				formats: {},
			}),
		).rejects.toThrow('Enable at least one format');
	});

	it('requires highlightsParams with formats.highlights', async () => {
		await expect(
			(Web.scrape as AnyEndpoint)(createContext(), {
				url: 'https://stripe.com',
				formats: { highlights: true },
			}),
		).rejects.toThrow('formats.highlights requires highlightsParams');
	});

	it('rejects markdownParams without formats.markdown', async () => {
		await expect(
			(Web.scrape as AnyEndpoint)(createContext(), {
				url: 'https://stripe.com',
				formats: { html: true },
				markdownParams: { includeLinks: false },
			}),
		).rejects.toThrow('markdownParams requires formats.markdown');
	});
});

describe('news.search', () => {
	const article = {
		id: 'art_1',
		story_id: 'story_1',
		url: 'https://techcrunch.com/stripe',
		title: 'Stripe launches stablecoin accounts',
		description: null,
		language: 'en',
		authors: [],
		image_url: null,
		published_at: '2026-10-15T12:00:00.000Z',
		type: 'editorial',
		source: { name: 'TechCrunch', domain: 'techcrunch.com', direct: true },
		match: { level: 'primary', confidence: 0.98 },
	};

	it('pages with a cursor and caches articles', async () => {
		const body = {
			data: [article],
			has_more: true,
			next_cursor: 'cur_2',
			meta: { count: 1 },
			...billing,
		};
		respond(200, body);
		const ctx = createContext();

		const result = await (News.search as AnyEndpoint)(ctx, {
			searchBy: {
				type: 'entity',
				entity: { type: 'domain', domain: 'stripe.com' },
			},
			sortBy: { type: 'newest' },
			limit: 1,
			cursor: 'cur_1',
		});

		expect(lastCall().body).toMatchObject({ limit: 1, cursor: 'cur_1' });
		expect(result).toEqual(body);
		expect(ctx.db.newsArticles.upsertByEntityId).toHaveBeenCalledWith(
			'art_1',
			expect.objectContaining({
				sourceDomain: 'techcrunch.com',
				storyId: 'story_1',
			}),
		);
	});

	it('allows only one filter category', async () => {
		await expect(
			(News.search as AnyEndpoint)(createContext(), {
				searchBy: { type: 'entity', entity: { type: 'name', name: 'Stripe' } },
				filterBy: { sourceCountry: ['us'], articleLanguage: ['en'] },
			}),
		).rejects.toThrow('Use at most one of');
	});
});

describe('people.enrich', () => {
	it('parses a not_found match', async () => {
		respond(200, {
			match: { status: 'not_found', score: null, person: null },
			request_id: 'req_2',
		});

		await expect(
			(People.enrich as AnyEndpoint)(createContext(), {
				email: 'nobody@example.com',
			}),
		).resolves.toMatchObject({ match: { status: 'not_found' } });
	});

	it('requires an identity clue', async () => {
		await expect(
			(People.enrich as AnyEndpoint)(createContext(), {
				company: { domain: 'stripe.com' },
			}),
		).rejects.toThrow('Provide an email, social_urls, or a name');
	});
});

describe('errors', () => {
	it('maps 401 USAGE_EXCEEDED to the auth handler', async () => {
		respond(401, {
			message: 'No credits left',
			error_code: 'USAGE_EXCEEDED',
			request_id: 'req_3',
		});

		const error = (await (Account.usage as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as ContextDevAPIError;

		expect(error).toBeInstanceOf(ContextDevAPIError);
		expect(error.code).toBe('USAGE_EXCEEDED');
		expect(error.requestId).toBe('req_3');
		expect(error.message).toBe('401 USAGE_EXCEEDED: No credits left');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('maps a paid-plan 403 to the permission handler', async () => {
		respond(403, {
			message: 'People enrichment requires a paid plan.',
			error_code: 'FORBIDDEN',
			request_id: 'req_4',
		});

		const error = (await (People.enrich as AnyEndpoint)(createContext(), {
			email: 'patrick@stripe.com',
		}).catch((e: Error) => e)) as ContextDevAPIError;

		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
	});

	it('uses Retry-After on 429', async () => {
		respond(
			429,
			{
				message: 'Rate limit exceeded',
				error_code: 'RATE_LIMITED',
				request_id: 'req_5',
			},
			{ 'Retry-After': '2' },
		);
		jest.useFakeTimers({ advanceTimers: true });

		const pending = (Account.usage as AnyEndpoint)(createContext(), {}).catch(
			(e: Error) => e,
		);
		await jest.runAllTimersAsync();
		const error = (await pending) as ContextDevAPIError;
		jest.useRealTimers();

		expect(error.code).toBe('RATE_LIMITED');
		expect(error.retryAfter).toBe(2000);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
		});
	});

	it('does not retry a 408 deadline', async () => {
		respond(408, {
			message: 'Request timed out',
			error_code: 'TIMEOUT',
			request_id: 'req_6',
		});

		const error = (await (Web.crawl as AnyEndpoint)(createContext(), {
			url: 'https://example.com',
		}).catch((e: Error) => e)) as ContextDevAPIError;

		expect(errorHandlers.TIMEOUT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.TIMEOUT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('retries 5xx with backoff', async () => {
		respond(500, {
			message: 'Internal error',
			error_code: 'INTERNAL_ERROR',
			request_id: 'req_7',
		});

		const error = (await (Web.search as AnyEndpoint)(createContext(), {
			query: 'x',
		}).catch((e: Error) => e)) as ContextDevAPIError;

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toMatchObject({
			maxRetries: 2,
		});
	});

	it('fails zod validation on a malformed response', async () => {
		respond(200, { results: [{ domain: 'stripe.com' }], request_id: 'req_8' });

		const error = (await (Brand.search as AnyEndpoint)(createContext(), {
			query: 'stripe',
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
