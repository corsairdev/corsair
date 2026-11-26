import { LINKHUT_MIN_INTERVAL_MS, linkhutRequestGap } from './client';
import { Posts, Tags } from './endpoints';
import {
	dates,
	done,
	postsOfOneDay,
	suggest,
	tagCounts,
	updateTime,
} from './test-fixtures';
import { createTestContext, mockFetchResponse } from './test-helpers';

// The one-second gap is a live-API etiquette rule; no test needs it.
beforeEach(() => {
	linkhutRequestGap.minIntervalMs = 0;
});

afterEach(() => {
	linkhutRequestGap.minIntervalMs = LINKHUT_MIN_INTERVAL_MS;
	jest.restoreAllMocks();
});

/**
 * Asserts what one endpoint sent: the route, the method, where the token went
 * and every query field. `params` reads the decoded values, so an assertion
 * holds whether the wire form is `%20` or `+`.
 */
function expectRequest(
	input: Parameters<typeof mockFetchResponse>[0],
	pathname: string,
	params: Record<string, string | null>,
): (run: () => Promise<unknown>) => Promise<void> {
	// unknown: the wrapped call runs whichever operation, so only its completion matters.
	const fetchMock = mockFetchResponse(input);

	return async (run) => {
		await run();

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const parsed = new URL(url);
		expect(init.method).toBe('GET');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer linkhut-test-token',
		);
		expect(parsed.pathname).toBe(pathname);
		for (const [name, value] of Object.entries(params)) {
			if (value === null) {
				expect(parsed.searchParams.has(name)).toBe(false);
			} else {
				expect(parsed.searchParams.get(name)).toBe(value);
			}
		}
	};
}

describe('requests', () => {
	it('posts.lastUpdated GETs /v1/posts/update with no parameters', async () => {
		const check = expectRequest({ body: updateTime }, '/v1/posts/update', {});
		await check(() => Posts.lastUpdated(createTestContext(), {}));
	});

	it('posts.get GETs /v1/posts/get with tag, dt, url, hashes and meta', async () => {
		const check = expectRequest({ body: postsOfOneDay }, '/v1/posts/get', {
			tag: 'git oss',
			dt: '2020-12-24',
			url: 'https://sourcehut.org/',
			hashes:
				'f76bae21f8ea04facdb544655745c924 8f4f71216f404ce3442bae67564d88cd',
			meta: 'yes',
		});
		await check(() =>
			Posts.get(createTestContext(), {
				tag: 'git oss',
				dt: '2020-12-24T00:00:00Z',
				url: 'https://sourcehut.org/',
				hashes: [
					'f76bae21f8ea04facdb544655745c924',
					'8f4f71216f404ce3442bae67564d88cd',
				],
				meta: 'yes',
			}),
		);
	});

	it('posts.recent GETs /v1/posts/recent with tag and count', async () => {
		const check = expectRequest({ body: postsOfOneDay }, '/v1/posts/recent', {
			tag: 'diary',
			count: '5',
		});
		await check(() =>
			Posts.recent(createTestContext(), { tag: 'diary', count: 5 }),
		);
	});

	it('posts.all GETs /v1/posts/all with the paging window and sends the default page size', async () => {
		const check = expectRequest(
			{ body: [postsOfOneDay.posts[0]] },
			'/v1/posts/all',
			{
				tag: 'oss',
				start: '1000',
				results: '1000',
				fromdt: '2020-01-01T00:00:00Z',
				todt: '2021-01-01T00:00:00Z',
				meta: 'yes',
			},
		);
		await check(() =>
			Posts.all(createTestContext(), {
				tag: 'oss',
				start: 1000,
				fromdt: '2020-01-01T00:00:00Z',
				todt: '2021-01-01T00:00:00Z',
				meta: 'yes',
			}),
		);
	});

	it('posts.all sends a requested page size instead of the default', async () => {
		const check = expectRequest({ body: [] }, '/v1/posts/all', {
			start: null,
			results: '5',
			tag: null,
		});
		await check(() => Posts.all(createTestContext(), { results: 5 }));
	});

	it('posts.dates GETs /v1/posts/dates with the tag', async () => {
		const check = expectRequest({ body: dates }, '/v1/posts/dates', {
			tag: 'oss',
		});
		await check(() => Posts.dates(createTestContext(), { tag: 'oss' }));
	});

	it('posts.suggest GETs /v1/posts/suggest with the encoded url', async () => {
		const check = expectRequest({ body: suggest }, '/v1/posts/suggest', {
			url: 'https://sourcehut.org/?utm=1',
		});
		await check(() =>
			Posts.suggest(createTestContext(), {
				url: 'https://sourcehut.org/?utm=1',
			}),
		);
	});

	it('posts.add GETs /v1/posts/add with every field and comma-joins the tags', async () => {
		const check = expectRequest({ body: done }, '/v1/posts/add', {
			url: 'https://sourcehut.org/',
			description: 'sourcehut',
			extended: 'the hackers forge',
			tags: 'git,oss',
			dt: '2020-12-24T16:11:14Z',
			replace: 'no',
			shared: 'no',
			toread: 'yes',
		});
		await check(() =>
			Posts.add(createTestContext(), {
				url: 'https://sourcehut.org/',
				description: 'sourcehut',
				extended: 'the hackers forge',
				tags: ['git', 'oss'],
				dt: '2020-12-24T16:11:14Z',
				replace: 'no',
				shared: 'no',
				toread: 'yes',
			}),
		);
	});

	it('posts.get sends a bare day as it is', async () => {
		const check = expectRequest({ body: postsOfOneDay }, '/v1/posts/get', {
			dt: '2024-01-01',
		});
		await check(() => Posts.get(createTestContext(), { dt: '2024-01-01' }));
	});

	it('posts.add sends replace=yes for an update', async () => {
		const check = expectRequest({ body: done }, '/v1/posts/add', {
			url: 'https://sourcehut.org/',
			description: 'sourcehut',
			replace: 'yes',
			shared: 'yes',
		});
		await check(() =>
			Posts.add(createTestContext(), {
				url: 'https://sourcehut.org/',
				description: 'sourcehut',
				replace: 'yes',
				shared: 'yes',
			}),
		);
	});

	it('posts.allHashes GETs /v1/posts/all with hashes=yes only', async () => {
		const check = expectRequest(
			{
				body: [
					{
						url: 'f76bae21f8ea04facdb544655745c924',
						meta: '8f4f71216f404ce3442bae67564d88cd',
					},
				],
			},
			'/v1/posts/all',
			{ hashes: 'yes' },
		);
		await check(() => Posts.allHashes(createTestContext(), {}));
	});

	it('posts.delete GETs /v1/posts/delete with the url', async () => {
		const check = expectRequest({ body: done }, '/v1/posts/delete', {
			url: 'https://sourcehut.org/',
		});
		await check(() =>
			Posts.remove(createTestContext(), { url: 'https://sourcehut.org/' }),
		);
	});

	it('tags.get GETs /v1/tags/get with no parameters', async () => {
		const check = expectRequest({ body: tagCounts }, '/v1/tags/get', {});
		await check(() => Tags.get(createTestContext(), {}));
	});

	it('tags.delete GETs /v1/tags/delete with the tag', async () => {
		const check = expectRequest({ body: done }, '/v1/tags/delete', {
			tag: 'old',
		});
		await check(() => Tags.remove(createTestContext(), { tag: 'old' }));
	});

	it('tags.rename GETs /v1/tags/rename with old and new', async () => {
		const check = expectRequest({ body: done }, '/v1/tags/rename', {
			old: 'old',
			new: 'new',
		});
		await check(() =>
			Tags.rename(createTestContext(), { old: 'old', new: 'new' }),
		);
	});
});
