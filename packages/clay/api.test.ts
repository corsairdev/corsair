import { logEventFromContext } from 'corsair/core';
import { ClayAPIError } from './client';
import { Account, Routines, Search } from './endpoints';
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
			people: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			companies: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			routineRuns: {
				findByEntityId: jest.fn().mockResolvedValue(null),
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

const person = {
	clay_profile_id: 123456,
	name: 'Jane Doe',
	first_name: 'Jane',
	last_name: 'Doe',
	linkedin_url: 'https://www.linkedin.com/in/janedoe',
	location: {
		name: 'San Francisco, California',
		city: 'San Francisco',
		state_or_province: 'California',
	},
	matched_experiences: [
		{
			company: 'Initech',
			title: 'VP Engineering',
			location: 'Austin',
			start_date: '2019-03',
			end_date: '2022-12',
		},
		{
			company: 'Acme',
			title: 'CTO',
			location: 'San Francisco',
			start_date: '2023-01',
			end_date: null,
		},
	],
};

const company = {
	clay_company_id: 987,
	name: 'Stripe',
	domain: 'stripe.com',
	size: '5,001-10,000 employees',
	type: 'Privately Held',
	country: 'United States',
	industry: 'Financial Services',
	location: 'South San Francisco, California',
	description: 'Financial infrastructure for the internet.',
	linkedin_url: 'https://www.linkedin.com/company/stripe',
	annual_revenue: '$1B+',
	total_funding_amount_range_usd: null,
};

beforeAll(() => {
	// unknown: the jest mock lacks fetch's static members, so it needs a two-step cast.
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe('account', () => {
	it('me sends clay-api-key and parses user and workspace', async () => {
		const body = {
			user: {
				id: '1',
				name: 'Jane',
				email: 'jane@example.com',
				cli_onboarded: false,
			},
			workspace: { id: '42', name: 'Acme' },
		};
		respond(200, body);

		const result = await (Account.me as AnyEndpoint)(createContext(), {});

		const { url, method, headers } = lastCall();
		expect(method).toBe('GET');
		expect(url.href).toBe('https://api.clay.com/public/v0/me');
		expect(headers.get('clay-api-key')).toBe('test-key');
		expect(headers.get('authorization')).toBeNull();
		expect(result).toEqual(body);
	});

	it('credits accepts a balance without actions', async () => {
		respond(200, { balance: 1000 });

		await expect(
			(Account.credits as AnyEndpoint)(createContext(), {}),
		).resolves.toEqual({ balance: 1000 });
		expect(lastCall().url.pathname).toBe('/public/v0/credits/balance');
	});
});

describe('routines', () => {
	it('run posts items to the routine and records the run', async () => {
		respond(202, { routine_run_id: 'run_1', status: 'in_progress' });
		const ctx = createContext();

		const result = await (Routines.run as AnyEndpoint)(ctx, {
			routine_id: 'function:t_abc123',
			items: [{ id: 'row-1', inputs: { domain: 'clay.com' } }],
			webhook_id: 'wh_1',
		});

		const { url, method, body } = lastCall();
		expect(method).toBe('POST');
		expect(url.pathname).toBe('/public/v0/routines/function:t_abc123/run');
		expect(body).toEqual({
			items: [{ id: 'row-1', inputs: { domain: 'clay.com' } }],
			webhook_id: 'wh_1',
		});
		expect(result).toEqual({ routine_run_id: 'run_1', status: 'in_progress' });
		expect(ctx.db.routineRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run_1',
			expect.objectContaining({
				routineId: 'function:t_abc123',
				status: 'in_progress',
				total: 1,
			}),
		);
	});

	it('run rejects more than 100 items', async () => {
		const items = Array.from({ length: 101 }, (_, i) => ({
			id: `row-${i}`,
			inputs: {},
		}));
		await expect(
			(Routines.run as AnyEndpoint)(createContext(), {
				routine_id: 'function:t_abc123',
				items,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('getResults returns progress on 202', async () => {
		respond(202, {
			routine_run_id: 'run_1',
			status: 'in_progress',
			total: 2,
			finished: 1,
		});

		const result = await (Routines.getResults as AnyEndpoint)(createContext(), {
			routine_run_id: 'run_1',
		});

		expect(lastCall().url.pathname).toBe(
			'/public/v0/routines/run/run_1/results',
		);
		expect(result).toEqual({
			routine_run_id: 'run_1',
			status: 'in_progress',
			total: 2,
			finished: 1,
		});
	});

	it('getResults pages complete results with cursor and limit', async () => {
		const body = {
			routine_run_id: 'run_1',
			status: 'complete',
			total: 2,
			finished: 2,
			data: [
				{ id: 'row-1', status: 'complete', result: { company_name: 'Clay' } },
				{
					id: 'row-2',
					status: 'failed',
					error: { message: 'Provider request failed' },
				},
			],
			cursor: 'next_page_token',
		};
		respond(200, body);
		const ctx = createContext();

		const result = await (Routines.getResults as AnyEndpoint)(ctx, {
			routine_run_id: 'run_1',
			cursor: 'page_2',
			limit: 2,
		});

		const { url } = lastCall();
		expect(url.searchParams.get('cursor')).toBe('page_2');
		expect(url.searchParams.get('limit')).toBe('2');
		expect(result).toEqual(body);
		expect(ctx.db.routineRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run_1',
			expect.objectContaining({ status: 'complete', finished: 2 }),
		);
	});

	it('getResults treats an unknown terminal status as terminal', async () => {
		respond(200, {
			routine_run_id: 'run_1',
			status: 'cancelled',
			total: 1,
			finished: 0,
			data: [],
		});

		await expect(
			(Routines.getResults as AnyEndpoint)(createContext(), {
				routine_run_id: 'run_1',
			}),
		).resolves.toMatchObject({ status: 'cancelled', data: [] });
	});
});

describe('search', () => {
	it('reference returns the query grammar', async () => {
		respond(200, { reference: '# Clay search query reference' });

		await expect(
			(Search.reference as AnyEndpoint)(createContext(), {}),
		).resolves.toEqual({ reference: '# Clay search query reference' });
		expect(lastCall().url.pathname).toBe(
			'/public/v0/search/query-mode/reference',
		);
	});

	it('create posts the query', async () => {
		respond(200, { search_id: 's_1', source_type: 'people' });
		const query = 'select from people\nwhere location_city in ("New York")';

		const result = await (Search.create as AnyEndpoint)(createContext(), {
			query,
		});

		const { url, method, body } = lastCall();
		expect(method).toBe('POST');
		expect(url.pathname).toBe('/public/v0/search/query-mode');
		expect(body).toEqual({ query });
		expect(result).toEqual({ search_id: 's_1', source_type: 'people' });
	});

	it('run pages people results and caches them', async () => {
		const body = {
			source_type: 'people',
			data: [person],
			has_more: true,
			period_quota: {
				limit: 1000000,
				used: 3,
				remaining: 999997,
				resets_at: '2027-01-01T00:00:00.000Z',
			},
		};
		respond(200, body);
		const ctx = createContext();

		const result = await (Search.run as AnyEndpoint)(ctx, {
			search_id: 's_1',
			limit: 1,
		});

		const { url, body: sent } = lastCall();
		expect(url.pathname).toBe('/public/v0/search/query-mode/s_1/run');
		expect(sent).toEqual({ limit: 1 });
		expect(result).toEqual(body);
		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'123456',
			expect.objectContaining({
				name: 'Jane Doe',
				currentTitle: 'CTO',
				currentCompany: 'Acme',
			}),
		);
	});

	it('leaves current job empty when every matched role has ended', async () => {
		respond(200, {
			source_type: 'people',
			data: [
				{
					...person,
					matched_experiences: [person.matched_experiences[0]],
				},
			],
			has_more: false,
			period_quota: {
				limit: 1000000,
				used: 4,
				remaining: 999996,
				resets_at: '2027-01-01T00:00:00.000Z',
			},
		});
		const ctx = createContext();

		await (Search.run as AnyEndpoint)(ctx, { search_id: 's_1' });

		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'123456',
			expect.objectContaining({
				currentTitle: undefined,
				currentCompany: undefined,
			}),
		);
	});

	it('run pages company results and caches them', async () => {
		const body = {
			source_type: 'companies',
			data: [company],
			has_more: false,
			exhaustion_reason: 'no_more_results',
		};
		respond(200, body);
		const ctx = createContext();

		await expect(
			(Search.run as AnyEndpoint)(ctx, { search_id: 's_2' }),
		).resolves.toEqual(body);
		expect(ctx.db.companies.upsertByEntityId).toHaveBeenCalledWith(
			'987',
			expect.objectContaining({ domain: 'stripe.com' }),
		);
	});

	it('run rejects a limit above 500', async () => {
		await expect(
			(Search.run as AnyEndpoint)(createContext(), {
				search_id: 's_1',
				limit: 501,
			}),
		).rejects.toThrow();
	});
});

describe('errors', () => {
	it('maps 401 to ClayAPIError with the message', async () => {
		respond(401, { message: 'Invalid API key' });

		const error = (await (Account.me as AnyEndpoint)(createContext(), {}).catch(
			(e: Error) => e,
		)) as ClayAPIError;

		expect(error).toBeInstanceOf(ClayAPIError);
		expect(error.status).toBe(401);
		expect(error.message).toBe('401 Invalid API key');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('maps 403 from a scoped key to the permission handler', async () => {
		respond(403, { message: 'API key does not have the required scope' });

		const error = (await (Search.create as AnyEndpoint)(createContext(), {
			query: 'select from people',
		}).catch((e: Error) => e)) as ClayAPIError;

		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
	});

	it('maps 402 search quota to the quota handler', async () => {
		respond(402, { message: 'Search results quota exceeded' });

		const error = (await (Search.run as AnyEndpoint)(createContext(), {
			search_id: 's_1',
		}).catch((e: Error) => e)) as ClayAPIError;

		expect(errorHandlers.QUOTA_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.QUOTA_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('hands a 429 to the handler after one request, with Retry-After', async () => {
		respond(429, { message: 'Too many requests' }, { 'Retry-After': '3' });

		const error = (await (Account.credits as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as ClayAPIError;

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
		});
	});

	it('routes 404 for an unknown routine', async () => {
		respond(404, { message: 'Routine not found' });

		const error = (await (Routines.run as AnyEndpoint)(createContext(), {
			routine_id: 'function:t_missing',
			items: [{ id: 'row-1', inputs: {} }],
		}).catch((e: Error) => e)) as ClayAPIError;

		expect(error.message).toBe('404 Routine not found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
	});

	it('does not replay 5xx', async () => {
		respond(503, { message: 'Service unavailable' });

		const error = (await (Search.run as AnyEndpoint)(createContext(), {
			search_id: 's_1',
		}).catch((e: Error) => e)) as ClayAPIError;

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('fails zod validation on a malformed search page', async () => {
		respond(200, {
			source_type: 'people',
			data: [{ name: 'Jane' }],
			has_more: false,
		});

		const error = (await (Search.run as AnyEndpoint)(createContext(), {
			search_id: 's_1',
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
