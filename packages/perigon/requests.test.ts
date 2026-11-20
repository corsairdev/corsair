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

describe('articles', () => {
	it('list sends the filter family', async () => {
		respond(articlesList);
		const page = (await invoke(Articles.list, {
			q: 'climate AND policy',
			topic: 'Business',
			sentiment: 'negative',
			from: '2025-11-01',
			removeDuplicate: true,
			page: 2,
			size: 25,
			// unknown: article records are provider-shaped, so the cast keeps
			// them open.
		})) as { articles: unknown[] };

		expect(page.articles).toHaveLength(1);
		const sent = lastRequest();
		expectAuthenticated('/v1/articles/all');
		expect(sent.query['q']).toBe('climate AND policy');
		expect(sent.query['topic']).toBe('Business');
		expect(sent.query['sentiment']).toBe('negative');
		expect(sent.query['from']).toBe('2025-11-01');
		expect(sent.query['removeDuplicate']).toBe('true');
		expect(sent.query['page']).toBe('2');
		expect(sent.query['size']).toBe('25');
	});

	it('list omits unset filters', async () => {
		respond(articlesList);
		await invoke(Articles.list, {});
		const sent = lastRequest();
		expect(`${sent.origin}${sent.path}${''}`).toBe(
			'https://api.perigon.io/v1/articles/all',
		);
		expect(Object.keys(sent.query)).toHaveLength(0);
	});
});

describe('stories and entities', () => {
	it('stories.list calls stories/all', async () => {
		respond(storiesList);
		const page = (await invoke(Stories.list, {})) as { stories: unknown[] }; // unknown: story records are provider-shaped
		expect(page.stories).toHaveLength(1);
		expectAuthenticated('/v1/stories/all');
	});

	it('journalists.list calls journalists/all', async () => {
		respond(journalistsList);
		await invoke(Journalists.list, { source: 'Example News' });
		expectAuthenticated('/v1/journalists/all');
		expect(lastRequest().query['source']).toBe('Example News');
	});

	it('people.list calls people/all', async () => {
		respond(peopleList);
		await invoke(People.list, {});
		expectAuthenticated('/v1/people/all');
	});

	it('companies.list calls companies/all', async () => {
		respond(companiesList);
		await invoke(Companies.list, {});
		expectAuthenticated('/v1/companies/all');
	});
});

describe('limits', () => {
	it('get calls limits and reports the usage fields', async () => {
		respond(limits);
		const result = (await invoke(Limits.get, {})) as {
			requestsUsed?: number;
			requestLimit?: number | null;
		};
		expect(result.requestsUsed).toBe(1200);
		expect(result.requestLimit).toBe(10000);
		expectAuthenticated('/v1/limits');
	});
});

describe('error envelope', () => {
	it('surfaces the documented 401 message', async () => {
		respond(invalidKey, 401);
		await expect(invoke(Articles.list, {})).rejects.toThrow('Invalid API key');
	});
});
