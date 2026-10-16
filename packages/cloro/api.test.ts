import { logEventFromContext } from 'corsair/core';
import { CloroAPIError } from './client';
import { Monitor, Utility } from './endpoints';
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
	body: object | unknown[],
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
			snapshots: {
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

const sources = [
	{
		position: 1,
		url: 'https://stripe.com/',
		label: 'Stripe | Financial Infrastructure',
		description: 'Stripe powers online payment processing.',
	},
	{
		position: 2,
		url: 'https://en.wikipedia.org/wiki/Stripe,_Inc.',
		label: 'Stripe, Inc. - Wikipedia',
	},
];

const citationPills = [
	{
		label: 'Stripe',
		citationPillId: 1,
		url: 'https://stripe.com/',
		domain: 'stripe.com',
		position: 1,
	},
];

beforeAll(() => {
	// unknown: the jest mock lacks fetch's static members, so it needs a two-step cast.
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe('monitor.chatgpt', () => {
	const answer = {
		text: 'Stripe is a financial infrastructure platform.',
		sources: [{ ...sources[0], footnote: true }],
		citationPills: [{ ...citationPills[0], type: 'searchResult' }],
		model: 'gpt-5-3',
		searchQueries: ['what does stripe do'],
		followUpForm: null,
	};

	it('posts the prompt with bearer auth and saves a snapshot', async () => {
		respond(200, { success: true, result: answer });
		const ctx = createContext();

		const result = await (Monitor.chatgpt as AnyEndpoint)(ctx, {
			prompt: 'What does Stripe do?',
			country: 'US',
			include: { markdown: true, searchQueries: true },
		});

		const { url, method, headers, body } = lastCall();
		expect(method).toBe('POST');
		expect(url.href).toBe('https://api.cloro.dev/v1/monitor/chatgpt');
		expect(headers.get('authorization')).toBe('Bearer test-key');
		expect(headers.get('content-type')).toContain('application/json');
		expect(body).toEqual({
			prompt: 'What does Stripe do?',
			country: 'US',
			include: { markdown: true, searchQueries: true },
		});
		expect(result).toEqual({ success: true, result: answer });
		expect(ctx.db.snapshots.upsertByEntityId).toHaveBeenCalledWith(
			'chatgpt:US:any:What does Stripe do?',
			expect.objectContaining({
				engine: 'chatgpt',
				model: 'gpt-5-3',
				sourceUrls: ['https://stripe.com/'],
			}),
		);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'cloro.monitor.chatgpt',
			{ sourceCount: 1 },
			'completed',
		);
	});

	it('accepts a multi-turn prompt and an array result', async () => {
		respond(200, {
			success: true,
			result: [answer, { ...answer, text: 'Second answer' }],
		});
		const ctx = createContext();

		await (Monitor.chatgpt as AnyEndpoint)(ctx, {
			prompt: ['What does Stripe do?', 'Who founded it?'],
			country: 'GB',
		});

		expect(ctx.db.snapshots.upsertByEntityId).toHaveBeenCalledWith(
			'chatgpt:GB:any:What does Stripe do?\nWho founded it?',
			expect.objectContaining({ text: 'Second answer' }),
		);
	});

	it('rejects more than 5 prompts', async () => {
		await expect(
			(Monitor.chatgpt as AnyEndpoint)(createContext(), {
				prompt: ['1', '2', '3', '4', '5', '6'],
				country: 'US',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('monitor.perplexity', () => {
	it('posts to /v1/monitor/perplexity', async () => {
		const result = {
			text: 'Stripe is a payments company.',
			sources,
			citationPills,
			related_queries: ['stripe fees'],
			search_model_queries: ['stripe company'],
		};
		respond(200, { success: true, result });

		const ctx = createContext();

		const response = await (Monitor.perplexity as AnyEndpoint)(ctx, {
			prompt: 'What does Stripe do?',
			country: 'US',
			state: 'CA',
		});

		const { url, body } = lastCall();
		expect(url.pathname).toBe('/v1/monitor/perplexity');
		expect(body.state).toBe('CA');
		expect(response).toEqual({ success: true, result });
		expect(ctx.db.snapshots.upsertByEntityId).toHaveBeenCalledWith(
			'perplexity:US:CA:What does Stripe do?',
			expect.objectContaining({ country: 'US', area: 'CA' }),
		);
	});
});

describe('monitor.gemini', () => {
	it('posts to /v1/monitor/gemini and parses shopping cards', async () => {
		const result = {
			text: 'Stripe offers payment APIs.',
			sources,
			shoppingCards: [
				{
					position: 1,
					title: 'Stripe Terminal Reader',
					productLink: 'https://example.com/reader',
					productId: 'p1',
					price: { value: 59, currency: 'USD', raw: '$59.00' },
				},
			],
		};
		respond(200, { success: true, result });

		const response = await (Monitor.gemini as AnyEndpoint)(createContext(), {
			prompt: 'What does Stripe do?',
			country: 'US',
		});

		expect(lastCall().url.pathname).toBe('/v1/monitor/gemini');
		expect(response).toEqual({ success: true, result });
	});
});

describe('monitor.copilot', () => {
	it('posts to /v1/monitor/copilot', async () => {
		const result = {
			text: 'Stripe is a fintech company.',
			sources,
			searchQueries: ['Stripe company overview'],
		};
		respond(200, { success: true, result });

		const response = await (Monitor.copilot as AnyEndpoint)(createContext(), {
			prompt: 'What does Stripe do?',
			country: 'US',
		});

		expect(lastCall().url.pathname).toBe('/v1/monitor/copilot');
		expect(response).toEqual({ success: true, result });
	});
});

describe('monitor.googleAiMode', () => {
	it('accepts gl instead of country', async () => {
		const result = {
			text: 'Popular picks include the Brooks Adrenaline.',
			sources: [
				{ ...sources[0], redirectLink: 'https://www.google.com/goto?url=x' },
			],
			places: [{ title: 'Fleet Feet', index: 1, rating: 4.8 }],
		};
		respond(200, { success: true, result });
		const ctx = createContext();

		await (Monitor.googleAiMode as AnyEndpoint)(ctx, {
			prompt: 'best running shoes for flat feet',
			gl: 'us',
			hl: 'en',
		});

		const { url, body } = lastCall();
		expect(url.pathname).toBe('/v1/monitor/aimode');
		expect(body).toEqual({
			prompt: 'best running shoes for flat feet',
			gl: 'us',
			hl: 'en',
		});
		expect(ctx.db.snapshots.upsertByEntityId).toHaveBeenCalledWith(
			'aimode:US:any:best running shoes for flat feet',
			expect.anything(),
		);
	});

	it('requires country or gl', async () => {
		await expect(
			(Monitor.googleAiMode as AnyEndpoint)(createContext(), {
				prompt: 'best running shoes',
			}),
		).rejects.toThrow('Provide country or gl');
	});

	it('rejects location and uule together', async () => {
		await expect(
			(Monitor.googleAiMode as AnyEndpoint)(createContext(), {
				prompt: 'running shoes',
				country: 'US',
				location: 'Austin,Texas,United States',
				uule: 'w+CAIQICIN',
			}),
		).rejects.toThrow('mutually exclusive');
	});
});

describe('monitor.googleSearch', () => {
	const result = {
		organicResults: [
			{
				position: 1,
				title: 'Running Shoes',
				link: 'https://www.nike.com/w/running-shoes',
				displayedLink: 'nike.com',
				snippet: 'Find running shoes.',
				page: 1,
			},
			{
				position: 11,
				title: 'Best Running Shoes',
				link: 'https://www.runnersworld.com/gear/',
				page: 2,
			},
		],
		peopleAlsoAsk: [
			{ question: 'What are the best running shoes?', type: 'LINK' },
		],
		relatedSearches: [
			{
				query: 'running shoes women',
				link: 'https://www.google.com/search?q=x',
			},
		],
		ads: [
			{ position: 1, blockPosition: 'top', type: 'RESULT', title: 'Shop Now' },
		],
		aioverview: {
			text: 'Running shoes are designed for...',
			sources: [
				{
					position: 1,
					url: 'https://www.runnersworld.com/',
					label: 'Runners World',
				},
			],
		},
	};

	it('pages through results and returns the AI Overview', async () => {
		respond(200, { success: true, result });
		const ctx = createContext();

		const response = await (Monitor.googleSearch as AnyEndpoint)(ctx, {
			query: 'running shoes',
			country: 'US',
			pages: 2,
			include: { aioverview: { markdown: true } },
		});

		const { url, body } = lastCall();
		expect(url.pathname).toBe('/v1/monitor/google');
		expect(body.pages).toBe(2);
		expect(response).toEqual({ success: true, result });
		expect(ctx.db.snapshots.upsertByEntityId).toHaveBeenCalledWith(
			'google:US:any:running shoes',
			expect.objectContaining({
				text: 'Running shoes are designed for...',
				sourceUrls: [
					'https://www.nike.com/w/running-shoes',
					'https://www.runnersworld.com/gear/',
				],
			}),
		);
	});

	it('accepts a null aioverview', async () => {
		respond(200, {
			success: true,
			result: { organicResults: [], aioverview: null },
		});

		await expect(
			(Monitor.googleSearch as AnyEndpoint)(createContext(), {
				query: 'running shoes',
				country: 'US',
			}),
		).resolves.toMatchObject({ result: { aioverview: null } });
	});

	it('accepts a Google search url on its own', async () => {
		respond(200, { success: true, result: { organicResults: [] } });

		await (Monitor.googleSearch as AnyEndpoint)(createContext(), {
			url: 'https://www.google.com/search?q=running+shoes&gl=us',
		});

		expect(lastCall().body).toEqual({
			url: 'https://www.google.com/search?q=running+shoes&gl=us',
		});
	});

	it('rejects url combined with pages', async () => {
		await expect(
			(Monitor.googleSearch as AnyEndpoint)(createContext(), {
				url: 'https://www.google.com/search?q=x',
				pages: 2,
			}),
		).rejects.toThrow();
	});

	it('rejects more than 10 pages', async () => {
		await expect(
			(Monitor.googleSearch as AnyEndpoint)(createContext(), {
				query: 'running shoes',
				country: 'US',
				pages: 11,
			}),
		).rejects.toThrow();
	});
});

describe('monitor.googleNews', () => {
	it('posts the query and saves article links', async () => {
		const result = {
			newsResults: [
				{
					position: 1,
					title: 'Stripe launches new feature',
					link: 'https://techcrunch.com/stripe',
					source: 'TechCrunch',
					date: '2 hours ago',
					page: 1,
				},
			],
		};
		respond(200, { success: true, result });
		const ctx = createContext();

		const response = await (Monitor.googleNews as AnyEndpoint)(ctx, {
			query: 'Stripe',
			country: 'US',
		});

		expect(lastCall().url.pathname).toBe('/v1/monitor/google/news');
		expect(response).toEqual({ success: true, result });
		expect(ctx.db.snapshots.upsertByEntityId).toHaveBeenCalledWith(
			'googleNews:US:any:Stripe',
			expect.objectContaining({
				sourceUrls: ['https://techcrunch.com/stripe'],
			}),
		);
	});
});

describe('utility', () => {
	it('countries passes the model filter', async () => {
		respond(200, ['US', 'GB', 'DE']);

		const result = await (Utility.countries as AnyEndpoint)(createContext(), {
			model: 'chatgpt',
		});

		const { url, method } = lastCall();
		expect(method).toBe('GET');
		expect(url.pathname).toBe('/v1/countries');
		expect(url.searchParams.get('model')).toBe('chatgpt');
		expect(result).toEqual(['US', 'GB', 'DE']);
	});

	it('states requires an uppercase country code', async () => {
		respond(200, [{ code: 'CA', name: 'California' }]);

		await expect(
			(Utility.states as AnyEndpoint)(createContext(), { country: 'US' }),
		).resolves.toEqual([{ code: 'CA', name: 'California' }]);
		expect(lastCall().url.searchParams.get('country')).toBe('US');

		await expect(
			(Utility.states as AnyEndpoint)(createContext(), { country: 'usa' }),
		).rejects.toThrow();
	});

	it('credits reads the balance', async () => {
		respond(200, { remaining: 462, perCycle: null, cycleResetsAt: null });

		await expect(
			(Utility.credits as AnyEndpoint)(createContext(), {}),
		).resolves.toEqual({ remaining: 462, perCycle: null, cycleResetsAt: null });
		expect(lastCall().url.pathname).toBe('/v1/credits');
	});
});

describe('errors', () => {
	it('maps 401 to CloroAPIError with the error code', async () => {
		respond(401, {
			success: false,
			error: {
				code: 'INVALID_OR_EXPIRED_API_KEY',
				message: 'Invalid or expired API key',
				timestamp: '2026-10-16T12:00:00.000Z',
			},
		});

		const error = (await (Utility.credits as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as CloroAPIError;

		expect(error).toBeInstanceOf(CloroAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('INVALID_OR_EXPIRED_API_KEY');
		expect(error.message).toBe(
			'401 INVALID_OR_EXPIRED_API_KEY: Invalid or expired API key',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('does not retry insufficient credits', async () => {
		respond(403, {
			success: false,
			error: { code: 'INSUFFICIENT_CREDITS', message: 'Insufficient credits' },
		});

		const error = (await (Monitor.gemini as AnyEndpoint)(createContext(), {
			prompt: 'x',
			country: 'US',
		}).catch((e: Error) => e)) as CloroAPIError;

		expect(errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('hands a 429 to the rate-limit handler after one request', async () => {
		respond(429, {
			success: false,
			error: {
				code: 'CONCURRENCY_LIMIT_EXCEEDED',
				message: 'Concurrency limit exceeded',
				details: { limit: 10 },
			},
		});

		const error = (await (Monitor.googleNews as AnyEndpoint)(createContext(), {
			query: 'Stripe',
			country: 'US',
		}).catch((e: Error) => e)) as CloroAPIError;

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.code).toBe('CONCURRENCY_LIMIT_EXCEEDED');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toMatchObject({
			maxRetries: 3,
		});
	});

	it('waits for Retry-After on a 503', async () => {
		respond(
			503,
			{
				success: false,
				error: {
					code: 'SERVICE_UNAVAILABLE',
					message: 'Service temporarily unavailable',
				},
			},
			{ 'Retry-After': '30' },
		);

		const error = (await (Utility.credits as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as CloroAPIError;

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(503);
		expect(error.retryAfter).toBe(30_000);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler(error)).toMatchObject({
			maxRetries: 2,
			headersRetryAfterMs: 30_000,
		});
	});

	it('surfaces MODEL_UNAVAILABLE as a non-retried 400', async () => {
		respond(400, {
			success: false,
			error: {
				code: 'MODEL_UNAVAILABLE',
				message: "We're currently unable to access Perplexity.",
			},
		});

		const error = (await (Monitor.perplexity as AnyEndpoint)(createContext(), {
			prompt: 'x',
			country: 'US',
		}).catch((e: Error) => e)) as CloroAPIError;

		expect(error.code).toBe('MODEL_UNAVAILABLE');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});

	it('does not retry a client timeout', async () => {
		const error = new CloroAPIError('The operation was aborted due to timeout');
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(false);
		expect(errorHandlers.TIMEOUT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.TIMEOUT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('fails zod validation when success is false in a 200', async () => {
		respond(200, { success: false, result: {} });

		const error = (await (Monitor.googleNews as AnyEndpoint)(createContext(), {
			query: 'Stripe',
			country: 'US',
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
