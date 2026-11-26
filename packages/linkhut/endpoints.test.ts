import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import {
	LINKHUT_MIN_INTERVAL_MS,
	linkhutRequestFacts,
	linkhutRequestGap,
} from './client';
import { Posts, Tags } from './endpoints';
import { shapePostsAllPage, shapePostsSuggest } from './endpoints/posts';
import {
	allHashes as allHashesBody,
	dates as datesBody,
	done,
	failure,
	htmlShell,
	post,
	postsOfOneDay,
	privatePost,
	suggest as suggestBody,
	tagCounts,
	updateTime,
} from './test-fixtures';
import {
	captureError,
	createTestContext,
	mockFetchResponse,
} from './test-helpers';

// The one-second gap is a live-API etiquette rule; no test needs it.
beforeEach(() => {
	linkhutRequestGap.minIntervalMs = 0;
});

beforeEach(() => {
	linkhutRequestGap.minIntervalMs = 0;
});

afterEach(() => {
	linkhutRequestGap.minIntervalMs = LINKHUT_MIN_INTERVAL_MS;
	jest.restoreAllMocks();
});

function responds(
	body: unknown, // unknown: the body is whichever JSON the case under test needs.
	status = 200,
) {
	return mockFetchResponse({ body, status });
}

describe('posts.lastUpdated', () => {
	it('parses the update time', async () => {
		responds(updateTime);
		await expect(Posts.lastUpdated(createTestContext(), {})).resolves.toEqual(
			updateTime,
		);
	});

	it('reads the epoch linkhut answers for an account with no bookmarks', async () => {
		responds({ update_time: '1970-01-01T00:00:00Z' });
		const result = await Posts.lastUpdated(createTestContext(), {});
		expect(result.update_time).toBe('1970-01-01T00:00:00Z');
	});

	it('tolerates a missing update time', async () => {
		responds({});
		const result = await Posts.lastUpdated(createTestContext(), {});
		expect(result.update_time).toBeUndefined();
	});
});

describe('posts.get', () => {
	it('answers no posts when the url is not saved (linkhut sends 404)', async () => {
		responds(failure, 404);
		const result = await Posts.get(createTestContext(), {
			url: 'https://not-saved.example/',
		});
		expect(result).toEqual({ posts: [] });
	});

	it('lets a 404 through when no url was asked for', async () => {
		responds(failure, 404);
		const error = (await captureError(
			Posts.get(createTestContext(), { tag: 'oss' }),
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
	});

	it('cuts a full timestamp to the day linkhut parses', async () => {
		const fetchMock = responds(postsOfOneDay);
		await Posts.get(createTestContext(), { dt: '2020-12-24T16:11:14Z' });
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(new URL(url).searchParams.get('dt')).toBe('2020-12-24');
	});

	it('refuses a dt that is neither a day nor a UTC timestamp', async () => {
		responds(postsOfOneDay);
		await expect(
			Posts.get(createTestContext(), { dt: '24/12/2020' }),
		).rejects.toBeInstanceOf(ZodError);
	});

	it('reads the others count the server sends', async () => {
		responds({ posts: [post] });
		const result = await Posts.get(createTestContext(), {});
		expect(result.posts[0]?.others).toBe(0);
	});

	it('parses the posts of one day', async () => {
		responds(postsOfOneDay);
		const result = await Posts.get(createTestContext(), {
			dt: '2020-12-24T00:00:00Z',
		});
		expect(result.posts).toHaveLength(2);
		expect(result.posts[0]).toMatchObject({
			href: post.href,
			hash: post.hash,
		});
	});

	it('rejects a yes/no field that arrived as a boolean', async () => {
		responds({
			posts: [{ ...post, toread: false }],
		});
		const error = await captureError(Posts.get(createTestContext(), {}));
		expect(error).toBeInstanceOf(ZodError);
	});
});

describe('posts.recent', () => {
	it('parses the most recent posts', async () => {
		responds({ posts: [privatePost] });
		const result = await Posts.recent(createTestContext(), { count: 1 });
		expect(result.posts[0]).toMatchObject({ shared: 'no', toread: 'yes' });
		expect(result.posts[0]?.meta).toBeNull();
	});
});

describe('posts.dates', () => {
	it('parses the day-to-count map', async () => {
		responds(datesBody);
		await expect(Posts.dates(createTestContext(), {})).resolves.toEqual(
			datesBody,
		);
	});

	it('rejects an HTML shell, which is what a wrong route answers', async () => {
		responds(htmlShell);
		const error = await captureError(Posts.dates(createTestContext(), {}));
		expect(error).toBeInstanceOf(ZodError);
	});
});

describe('posts.all', () => {
	it('shapes a bare array into a page and ends paging on a short page', async () => {
		responds([post, privatePost]);
		const result = await Posts.all(createTestContext(), { results: 1000 });
		expect(result.posts).toHaveLength(2);
		expect(result.start).toBe(0);
		expect(result.results).toBe(1000);
		expect(result.nextStart).toBeNull();
	});

	it('points at the next offset while the page is full', async () => {
		responds([post, privatePost]);
		const result = await Posts.all(createTestContext(), {
			start: 100,
			results: 2,
		});
		expect(result.nextStart).toBe(102);
	});

	it('rejects a wrapped body, which is posts/get, not posts/all', async () => {
		responds(postsOfOneDay);
		const error = await captureError(Posts.all(createTestContext(), {}));
		expect(error).toBeInstanceOf(ZodError);
	});

	it('rejects a page whose entries are not posts', async () => {
		responds(['just a string']);
		const error = await captureError(Posts.all(createTestContext(), {}));
		expect(error).toBeInstanceOf(ZodError);
	});
});

describe('shapePostsAllPage', () => {
	it('fills the paging fields from the input', () => {
		const page = shapePostsAllPage([post, privatePost], {
			start: 50,
			results: 2,
		});
		expect(page.start).toBe(50);
		expect(page.results).toBe(2);
		expect(page.nextStart).toBe(52);
	});

	it('reports no next page for a short page', () => {
		const page = shapePostsAllPage([], { start: 50 });
		expect(page.nextStart).toBeNull();
	});
});

describe('posts.suggest', () => {
	it('reads both lists from the two-element array', async () => {
		responds(suggestBody);
		const result = await Posts.suggest(createTestContext(), {
			url: 'https://sourcehut.org/',
		});
		expect(result.popular).toEqual(['software', 'oss']);
		expect(result.recommended).toEqual(['development', 'git']);
	});

	it('reads a reversed array and tolerates a missing list', async () => {
		responds([{ recommended: ['git'] }, { popular: ['oss'] }]);
		const result = await Posts.suggest(createTestContext(), {
			url: 'https://sourcehut.org/',
		});
		expect(result.popular).toEqual(['oss']);
		expect(result.recommended).toEqual(['git']);
	});

	it('rejects a body that is not an array instead of returning empty lists', async () => {
		responds(htmlShell);
		const error = await captureError(
			Posts.suggest(createTestContext(), { url: 'https://sourcehut.org/' }),
		);
		expect(error).toBeInstanceOf(ApiError);
	});

	it('rejects an element that is not an object', async () => {
		responds(['popular']);
		const error = await captureError(
			Posts.suggest(createTestContext(), { url: 'https://sourcehut.org/' }),
		);
		expect(error).toBeInstanceOf(ApiError);
	});

	it('rejects a list that is not an array', async () => {
		responds([{ popular: 'oss' }]);
		const error = await captureError(
			Posts.suggest(createTestContext(), { url: 'https://sourcehut.org/' }),
		);
		expect(error).toBeInstanceOf(ApiError);
	});
});

describe('shapePostsSuggest', () => {
	it('merges the lists across elements', () => {
		const shape = shapePostsSuggest([
			{ popular: ['a', 'b'] },
			{ recommended: ['c'] },
			{ popular: ['d'] },
		]);
		expect(shape.popular).toEqual(['a', 'b', 'd']);
		expect(shape.recommended).toEqual(['c']);
	});

	it('reports empty lists for an empty array', () => {
		const shape = shapePostsSuggest([]);
		expect(shape.popular).toEqual([]);
		expect(shape.recommended).toEqual([]);
	});
});

describe('writes that answer result_code', () => {
	it.each([
		[
			'posts.add',
			(input: string) =>
				Posts.add(createTestContext(), { url: input, description: 'x' }),
		],
		[
			'posts.delete',
			(input: string) => Posts.remove(createTestContext(), { url: input }),
		],
		[
			'tags.delete',
			(input: string) => Tags.remove(createTestContext(), { tag: input }),
		],
		[
			'tags.rename',
			(input: string) =>
				Tags.rename(createTestContext(), { old: input, new: 'b' }),
		],
	])('%s accepts done', async (_name, run) => {
		responds(done);
		await expect(run('https://example.com/')).resolves.toEqual(done);
	});

	it.each([
		[
			'posts.add',
			(input: string) =>
				Posts.add(createTestContext(), { url: input, description: 'x' }),
		],
		[
			'posts.delete',
			(input: string) => Posts.remove(createTestContext(), { url: input }),
		],
		[
			'tags.delete',
			(input: string) => Tags.remove(createTestContext(), { tag: input }),
		],
		[
			'tags.rename',
			(input: string) =>
				Tags.rename(createTestContext(), { old: input, new: 'b' }),
		],
	])('%s fails loudly on a %s body at HTTP 200', async (_name, run) => {
		responds(failure);
		const error = (await captureError(run('https://example.com/'))) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.body).toEqual(failure);
		expect(error.status).toBe(200);
		expect(linkhutRequestFacts(error)?.replayable).toBe(false);
		expect(error.message).toContain('something went wrong');
	});

	it.each([
		[
			'posts.add',
			(input: string) =>
				Posts.add(createTestContext(), { url: input, description: 'x' }),
		],
		[
			'tags.rename',
			(input: string) =>
				Tags.rename(createTestContext(), { old: input, new: 'b' }),
		],
	])(
		'%s fails loudly when the body has no result_code at all',
		async (_name, run) => {
			responds(htmlShell);
			const error = (await captureError(
				run('https://example.com/'),
			)) as ApiError;
			expect(error).toBeInstanceOf(ApiError);
			expect(error.message).not.toContain(htmlShell);
		},
	);
});

describe('posts.allHashes', () => {
	it('wraps the bare manifest array in { hashes }', async () => {
		responds(allHashesBody);
		const result = await Posts.allHashes(createTestContext(), {});
		expect(result.hashes).toEqual(allHashesBody);
	});

	it('rejects a body that is not an array', async () => {
		responds({ posts: [] });
		await expect(
			Posts.allHashes(createTestContext(), {}),
		).rejects.toBeInstanceOf(ZodError);
	});
});

describe('posts.add replace', () => {
	it('accepts yes and no for replace, shared and toread', async () => {
		responds(done);
		await expect(
			Posts.add(createTestContext(), {
				url: 'https://example.com/',
				description: 'x',
				replace: 'yes',
				shared: 'yes',
				toread: 'no',
			}),
		).resolves.toEqual(done);
	});

	it('marks only an update replayable', async () => {
		responds(failure, 500);
		const create = (await captureError(
			Posts.add(createTestContext(), {
				url: 'https://example.com/',
				description: 'x',
			}),
		)) as ApiError;
		expect(linkhutRequestFacts(create)?.replayable).toBe(false);

		responds(failure, 500);
		const update = (await captureError(
			Posts.add(createTestContext(), {
				url: 'https://example.com/',
				description: 'x',
				replace: 'yes',
			}),
		)) as ApiError;
		expect(linkhutRequestFacts(update)?.replayable).toBe(true);
	});
});

describe('tags.get', () => {
	it('parses the flat tag-to-count map', async () => {
		responds(tagCounts);
		await expect(Tags.get(createTestContext(), {})).resolves.toEqual(tagCounts);
	});

	it('accepts an account with no tags', async () => {
		responds({});
		await expect(Tags.get(createTestContext(), {})).resolves.toEqual({});
	});
});
