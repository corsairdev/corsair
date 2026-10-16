import { logEventFromContext } from 'corsair/core';
import { ApolloAPIError, toApolloQuery } from './client';
import { News, Organizations, People } from './endpoints';
import { errorHandlers } from './error-handlers';
import { samples } from './test-samples';

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
			organizations: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			people: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
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
		body: init.body,
	};
}

const orgId = '5d0a0fbff6512580bf33a120';

const cases: [
	string,
	AnyEndpoint,
	object,
	'GET' | 'POST',
	string,
	keyof typeof samples,
][] = [
	[
		'people.search',
		People.search as AnyEndpoint,
		{ person_titles: ['ceo'], per_page: 1 },
		'POST',
		'/api/v1/mixed_people/api_search',
		'peopleSearch',
	],
	[
		'people.enrich',
		People.enrich as AnyEndpoint,
		{ first_name: 'Patrick', last_name: 'Collison', domain: 'stripe.com' },
		'POST',
		'/api/v1/people/match',
		'peopleEnrich',
	],
	[
		'people.get',
		People.get as AnyEndpoint,
		{ id: '65f0a1b2c3d4e5f600012345' },
		'GET',
		'/api/v1/people/65f0a1b2c3d4e5f600012345',
		'peopleGet',
	],
	[
		'organizations.search',
		Organizations.search as AnyEndpoint,
		{ q_organization_name: 'Stripe', per_page: 2 },
		'POST',
		'/api/v1/mixed_companies/search',
		'organizationsSearch',
	],
	[
		'organizations.enrich',
		Organizations.enrich as AnyEndpoint,
		{ domain: 'stripe.com' },
		'GET',
		'/api/v1/organizations/enrich',
		'organizationsEnrich',
	],
	[
		'organizations.get',
		Organizations.get as AnyEndpoint,
		{ id: orgId },
		'GET',
		`/api/v1/organizations/${orgId}`,
		'organizationsGet',
	],
	[
		'organizations.jobPostings',
		Organizations.jobPostings as AnyEndpoint,
		{ organization_id: orgId, per_page: 2 },
		'GET',
		`/api/v1/organizations/${orgId}/job_postings`,
		'organizationsJobPostings',
	],
	[
		'news.search',
		News.search as AnyEndpoint,
		{ organization_ids: [orgId], per_page: 2 },
		'POST',
		'/api/v1/news_articles/search',
		'newsSearch',
	],
];

beforeAll(() => {
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe.each(cases)('%s', (name, endpoint, input, method, path, sample) => {
	it(`${method} ${path} with x-api-key and parses the response`, async () => {
		respond(200, samples[sample]);
		const ctx = createContext();

		await expect(endpoint(ctx, input)).resolves.toBeDefined();

		const call = lastCall();
		expect(call.method).toBe(method);
		expect(call.url.pathname).toBe(path);
		expect(call.headers.get('x-api-key')).toBe('test-key');
		expect(call.headers.get('authorization')).toBeNull();
		expect(call.body).toBeUndefined();
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			`apollo.${name}`,
			{},
			'completed',
		);
	});
});

describe('query encoding', () => {
	it('sends arrays as repeated name[] keys and ranges as name[min]/name[max]', async () => {
		respond(200, samples.peopleSearch);

		await (People.search as AnyEndpoint)(createContext(), {
			person_titles: ['ceo', 'cto'],
			organization_num_employees_ranges: ['1,10', '250,500'],
			revenue_range: { min: 500000, max: 1500000 },
			include_similar_titles: false,
			page: 2,
			per_page: 5,
		});

		const { url } = lastCall();
		expect(url.searchParams.getAll('person_titles[]')).toEqual(['ceo', 'cto']);
		expect(
			url.searchParams.getAll('organization_num_employees_ranges[]'),
		).toEqual(['1,10', '250,500']);
		expect(url.searchParams.get('revenue_range[min]')).toBe('500000');
		expect(url.searchParams.get('revenue_range[max]')).toBe('1500000');
		expect(url.searchParams.get('include_similar_titles')).toBe('false');
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('per_page')).toBe('5');
	});

	it('keeps path parameters out of the query', async () => {
		respond(200, samples.organizationsJobPostings);

		await (Organizations.jobPostings as AnyEndpoint)(createContext(), {
			organization_id: orgId,
			page: 3,
		});

		const { url } = lastCall();
		expect(url.searchParams.has('organization_id')).toBe(false);
		expect(url.searchParams.get('page')).toBe('3');
	});

	it('drops undefined values', () => {
		expect(toApolloQuery({ a: undefined, b: ['x'], c: 1 })).toEqual({
			'b[]': ['x'],
			c: 1,
		});
	});
});

describe('input rules', () => {
	it('caps per_page at 100 and page at 500', async () => {
		await expect(
			(People.search as AnyEndpoint)(createContext(), { per_page: 101 }),
		).rejects.toThrow();
		await expect(
			(Organizations.search as AnyEndpoint)(createContext(), { page: 501 }),
		).rejects.toThrow();
	});

	it('requires min,max employee ranges', async () => {
		await expect(
			(People.search as AnyEndpoint)(createContext(), {
				organization_num_employees_ranges: ['1-10'],
			}),
		).rejects.toThrow();
	});

	it('people.enrich phone reveal needs a webhook or poll_only', async () => {
		await expect(
			(People.enrich as AnyEndpoint)(createContext(), {
				email: 'jane@example.com',
				reveal_phone_number: true,
			}),
		).rejects.toThrow('webhook_url, or poll_only');

		respond(200, samples.peopleEnrich);
		await (People.enrich as AnyEndpoint)(createContext(), {
			email: 'jane@example.com',
			reveal_phone_number: true,
			poll_only: true,
		});
		expect(lastCall().url.searchParams.get('poll_only')).toBe('true');
	});

	it('organizations.enrich needs a domain, linkedin_url, or website', async () => {
		await expect(
			(Organizations.enrich as AnyEndpoint)(createContext(), {
				name: 'Stripe',
			}),
		).rejects.toThrow('Provide domain, linkedin_url, or website');
	});

	it('news.search needs at least one organization id', async () => {
		await expect(
			(News.search as AnyEndpoint)(createContext(), { organization_ids: [] }),
		).rejects.toThrow();
	});
});

describe('caching', () => {
	it('saves an enriched organization', async () => {
		respond(200, samples.organizationsEnrich);
		const ctx = createContext();

		await (Organizations.enrich as AnyEndpoint)(ctx, { domain: 'stripe.com' });

		expect(ctx.db.organizations.upsertByEntityId).toHaveBeenCalledWith(
			orgId,
			expect.objectContaining({ name: 'Stripe' }),
		);
	});

	it('saves an enriched person and their organization', async () => {
		respond(200, samples.peopleEnrich);
		const ctx = createContext();

		await (People.enrich as AnyEndpoint)(ctx, { email: 'jane@example.com' });

		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(ctx.db.organizations.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('saves news articles with their organization ids', async () => {
		respond(200, samples.newsSearch);
		const ctx = createContext();

		await (News.search as AnyEndpoint)(ctx, { organization_ids: [orgId] });

		expect(ctx.db.newsArticles.upsertByEntityId).toHaveBeenCalledWith(
			samples.newsSearch.news_articles[0]!.id,
			expect.objectContaining({ organizationIds: [orgId] }),
		);
	});

	it('does not cache an enrichment without a match', async () => {
		respond(200, { person: null });
		const ctx = createContext();

		await (People.enrich as AnyEndpoint)(ctx, { email: 'nobody@example.com' });

		expect(ctx.db.people.upsertByEntityId).not.toHaveBeenCalled();
	});
});

describe('errors', () => {
	it('maps API_INACCESSIBLE 403 to the permission handler', async () => {
		respond(403, {
			error:
				'The api/v1/mixed_people/api_search API is not included in your Free plan and is not accessible, even with a master key.',
			error_code: 'API_INACCESSIBLE',
		});

		const error = (await (People.search as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as ApolloAPIError;

		expect(error).toBeInstanceOf(ApolloAPIError);
		expect(error.code).toBe('API_INACCESSIBLE');
		expect(error.message).toContain(
			'403 The api/v1/mixed_people/api_search API',
		);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.PERMISSION_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('maps 401 to the auth handler', async () => {
		respond(401, { error: 'Invalid access credentials.' });

		const error = (await (Organizations.enrich as AnyEndpoint)(
			createContext(),
			{
				domain: 'stripe.com',
			},
		).catch((e: Error) => e)) as ApolloAPIError;

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('maps 422 to the validation handler', async () => {
		respond(422, { error: 'Value too long' });

		const error = (await (News.search as AnyEndpoint)(createContext(), {
			organization_ids: [orgId],
		}).catch((e: Error) => e)) as ApolloAPIError;

		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});

	it('uses Retry-After on 429', async () => {
		respond(429, { error: 'Rate limit exceeded' }, { 'Retry-After': '60' });
		jest.useFakeTimers({ advanceTimers: true });

		const pending = (Organizations.enrich as AnyEndpoint)(createContext(), {
			domain: 'stripe.com',
		}).catch((e: Error) => e);
		await jest.runAllTimersAsync();
		const error = (await pending) as ApolloAPIError;
		jest.useRealTimers();

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(60000);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 60000,
		});
	});

	it('does not replay 5xx', async () => {
		respond(500, { error: 'Internal error' });

		const error = (await (Organizations.search as AnyEndpoint)(
			createContext(),
			{},
		).catch((e: Error) => e)) as ApolloAPIError;

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('fails zod validation on a malformed response', async () => {
		respond(200, { organization_job_postings: [{ title: 'No id' }] });

		const error = (await (Organizations.jobPostings as AnyEndpoint)(
			createContext(),
			{
				organization_id: orgId,
			},
		).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
