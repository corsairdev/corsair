import { logEventFromContext } from 'corsair/core';
import { Articles } from './endpoints';
import { article, articlesList } from './test-fixtures';

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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses the live list shape: status, numResults and the articles', async () => {
		respond(articlesList);
		const page = (await invoke(Articles.list, {})) as {
			numResults?: number;
			articles: Array<{ articleId?: string; pubDate?: string }>;
		};
		expect(page.numResults).toBe(1234);
		expect(page.articles[0]?.articleId).toBe('a1b2c3');
		expect(page.articles[0]?.pubDate).toBe(article.pubDate);
	});

	it('keeps a null content field nullish rather than a string', async () => {
		respond({
			status: 200,
			numResults: 1,
			articles: [{ ...article, content: null }],
		});
		const page = (await invoke(Articles.list, {})) as {
			articles: Array<{ content?: string | null }>;
		};
		expect(page.articles[0]?.content).toBeNull();
	});

	it('rejects an article whose source is a string, not the publisher object', async () => {
		respond({
			status: 200,
			numResults: 1,
			articles: [{ ...article, source: 'x' }],
		});
		await rejects(Articles.list, {}, 'object');
	});

	it('rejects a list answer without its array', async () => {
		respond({ status: 200, numResults: 0 });
		await rejects(Articles.list, {}, 'articles');
	});
});

describe('input validation', () => {
	it('rejects a sortBy outside the documented values', async () => {
		await rejects(Articles.list, { sortBy: 'source' }, 'invalid_value');
	});

	it('rejects a size over 100', async () => {
		await rejects(Articles.list, { size: 101 }, '100');
	});

	it('rejects a negative page', async () => {
		await rejects(Articles.list, { page: -1 }, 'page');
	});
});
