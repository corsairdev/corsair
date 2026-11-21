import { logEventFromContext } from 'corsair/core';
import {
	Articles,
	Companies,
	Journalists,
	Limits,
	People,
	Stories,
} from './endpoints';
import {
	articlesList,
	companiesList,
	invalidKey,
	journalistsList,
	limits,
	peopleList,
	storiesList,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pg-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

function expectAuthenticated(path: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.perigon.io');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe('GET');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

function allQuery(): Array<[string, string]> {
	const [url] = fetchMock.mock.calls.at(-1) as [string];
	return [...new URL(url).searchParams.entries()];
}

describe('articles', () => {
	it('list sends the documented filters and reads { status, numResults, articles }', async () => {
		respond(articlesList);
		const page = (await invoke(Articles.list, {
			q: 'chips AND demand',
			topic: 'Markets',
			source: ['example.com', '*.example.org'],
			from: '2025-11-01',
			showReprints: false,
			sortBy: 'date',
			page: 0,
			size: 25,
		})) as {
			numResults?: number;
			articles: Array<{ articleId?: string; source?: { domain?: string } }>;
		};

		expect(page.numResults).toBe(1234);
		expect(page.articles[0]?.articleId).toBe('a1b2c3');
		expect(page.articles[0]?.source?.domain).toBe('example.com');
		expectAuthenticated('/v1/articles/all');
		expect(allQuery()).toEqual([
			['q', 'chips AND demand'],
			['from', '2025-11-01'],
			['topic', 'Markets'],
			['source', 'example.com'],
			['source', '*.example.org'],
			['showReprints', 'false'],
			['sortBy', 'date'],
			['page', '0'],
			['size', '25'],
		]);
	});

	it('list omits unset filters', async () => {
		respond(articlesList);
		await invoke(Articles.list, {});
		expect(allQuery()).toHaveLength(0);
	});

	it('sends no filters Perigon does not document', async () => {
		respond(articlesList);
		await invoke(Articles.list, {
			sentiment: 'negative',
			removeDuplicate: true,
		});
		expect(allQuery()).toHaveLength(0);
	});

	it('asks for page 0, the first page', async () => {
		respond(articlesList);
		await invoke(Articles.list, { page: 0 });
		expect(lastRequest().query['page']).toBe('0');
	});
});

describe('stories and entities', () => {
	it('stories.list reads results', async () => {
		respond(storiesList);
		const page = (await invoke(Stories.list, {
			q: 'chips',
			minUniqueSources: 3,
			sortBy: 'updatedAt',
		})) as { results: Array<{ name?: string; uniqueCount?: number }> };
		expect(page.results[0]?.name).toBe('Chip demand story');
		expectAuthenticated('/v1/stories/all');
		expect(lastRequest().query['minUniqueSources']).toBe('3');
	});

	it('journalists.list reads results', async () => {
		respond(journalistsList);
		const page = (await invoke(Journalists.list, {
			source: 'example.com',
		})) as { results: Array<{ fullName?: string }> };
		expect(page.results[0]?.fullName).toBe('Jane Roe');
		expectAuthenticated('/v1/journalists/all');
		expect(lastRequest().query['source']).toBe('example.com');
	});

	it('people.list searches by name, not q', async () => {
		respond(peopleList);
		const page = (await invoke(People.list, { name: 'John Example' })) as {
			results: Array<{ wikidataId?: string }>;
		};
		expect(page.results[0]?.wikidataId).toBe('Q1');
		expectAuthenticated('/v1/people/all');
		expect(lastRequest().query).toEqual({ name: 'John Example' });
	});

	it('companies.list reads results', async () => {
		respond(companiesList);
		const page = (await invoke(Companies.list, { q: 'chips', size: 5 })) as {
			results: Array<{ name?: string }>;
		};
		expect(page.results[0]?.name).toBe('Example Chips Inc');
		expectAuthenticated('/v1/companies/all');
	});
});

describe('limits', () => {
	it('get reads the limits from data', async () => {
		respond(limits);
		const result = (await invoke(Limits.get, {})) as {
			data: { requestsUsed?: number; requestLimit?: number | null };
		};
		expect(result.data.requestsUsed).toBe(3);
		expect(result.data.requestLimit).toBe(150);
		expectAuthenticated('/v1/limits');
	});
});

describe('error envelope', () => {
	it('surfaces the documented 401 message', async () => {
		respond(invalidKey, 401);
		await expect(invoke(Articles.list, {})).rejects.toThrow('Invalid API key');
	});
});
