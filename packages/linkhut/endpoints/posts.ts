import { asRecord } from 'corsair/core';
import type { LinkhutEndpoints } from '..';
import type { LinkhutRequest } from '../client';
import { linkhutApiError } from '../client';
import { call, requireDone } from './call';
import type { PostsAllInput } from './types';
import {
	LinkhutEndpointInputSchemas as Inputs,
	LinkhutEndpointOutputSchemas as Outputs,
} from './types';

/** Page size `posts.all` sends when the caller gives none: the documented default. */
export const LINKHUT_DEFAULT_RESULTS = 1000;

export const lastUpdated: LinkhutEndpoints['postsLastUpdated'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.lastUpdated',
			input: Inputs.postsLastUpdated,
			output: Outputs.postsLastUpdated,
		},
		input,
		() => ({ method: 'GET', path: '/v1/posts/update', replayable: true }),
	);

export const add: LinkhutEndpoints['postsAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.add',
			input: Inputs.postsAdd,
			output: Outputs.postsAdd,
		},
		input,
		({ url, description, extended, tags, dt, replace, shared, toread }) => ({
			method: 'GET',
			path: '/v1/posts/add',
			// corsair/http drops an undefined query value, so only set fields go.
			query: {
				url,
				description,
				extended,
				tags: tags?.join(','),
				dt,
				replace,
				shared,
				toread,
			},
			// replace=yes rewrites the saved bookmark with the same fields, so a
			// repeat converges. A create is not repeated: if the first one
			// landed, the repeat fails because the url is already saved.
			replayable: replace === 'yes',
		}),
		{ shape: requireDone('posts.add') },
	);

export const remove: LinkhutEndpoints['postsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.delete',
			input: Inputs.postsDelete,
			output: Outputs.postsDelete,
		},
		input,
		({ url }) => ({
			method: 'GET',
			path: '/v1/posts/delete',
			query: { url },
			replayable: false,
		}),
		{ shape: requireDone('posts.delete') },
	);

export const get: LinkhutEndpoints['postsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.get',
			input: Inputs.postsGet,
			output: Outputs.postsGet,
		},
		input,
		({ tag, dt, url, hashes, meta }) => ({
			method: 'GET',
			path: '/v1/posts/get',
			// linkhut parses dt as a day (Date.from_iso8601!) and answers 500
			// to a full timestamp.
			query: {
				tag,
				dt: dt?.slice(0, 10),
				url,
				hashes: hashes?.join(' '),
				meta,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.posts.length }),
			// posts/get answers 404 for a url that is not saved: no bookmark.
			onNotFound: ({ url }) => (url ? { posts: [] } : undefined),
		},
	);

export const recent: LinkhutEndpoints['postsRecent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.recent',
			input: Inputs.postsRecent,
			output: Outputs.postsRecent,
		},
		input,
		({ tag, count }) => ({
			method: 'GET',
			path: '/v1/posts/recent',
			query: { tag, count },
			replayable: true,
		}),
		{ log: (_, result) => ({ count: result.posts.length }) },
	);

export const dates: LinkhutEndpoints['postsDates'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.dates',
			input: Inputs.postsDates,
			output: Outputs.postsDates,
		},
		input,
		({ tag }) => ({
			method: 'GET',
			path: '/v1/posts/dates',
			query: { tag },
			replayable: true,
		}),
		{ log: (_, result) => ({ count: Object.keys(result.dates).length }) },
	);

export const all: LinkhutEndpoints['postsAll'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.all',
			input: Inputs.postsAll,
			output: Outputs.postsAll,
		},
		input,
		({ tag, start, results, fromdt, todt, meta }) => ({
			method: 'GET',
			path: '/v1/posts/all',
			// The page size is always sent, so shapePostsAllPage knows it.
			query: {
				tag,
				start,
				results: results ?? LINKHUT_DEFAULT_RESULTS,
				fromdt,
				todt,
				meta,
			},
			replayable: true,
		}),
		{
			shape: shapePostsAllPage,
			log: (_, result) => ({
				count: result.posts.length,
				start: result.start,
				nextStart: result.nextStart ?? undefined,
			}),
		},
	);

export type PostsAllPage = {
	posts: unknown; // unknown: the body as linkhut sent it. The output schema validates each post.
	start: number;
	results: number;
	nextStart: number | null;
};

/**
 * `shapePostsAllPage(raw: unknown, parsedInput: PostsAllInput): PostsAllPage` (unknown: the raw body.)
 *
 * `posts.all` answers a bare array with no paging fields. This returns
 * `{ posts, start, results, nextStart }`: `start` is the requested offset (0
 * when omitted), `results` the requested page size (1000 when omitted), and
 * `nextStart` is `start + posts.length` while the page is full and `null`
 * once it is short. The posts themselves are passed through untouched.
 */
export function shapePostsAllPage(
	raw: unknown, // unknown: the response body, a bare array of posts when linkhut answers as documented.
	parsedInput: PostsAllInput,
): PostsAllPage {
	const start = parsedInput.start ?? 0;
	const results = parsedInput.results ?? LINKHUT_DEFAULT_RESULTS;
	const posts = Array.isArray(raw) ? raw : undefined;
	const nextStart = posts?.length === results ? start + posts.length : null;
	return { posts: raw, start, results, nextStart };
}

export const allHashes: LinkhutEndpoints['postsAllHashes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.allHashes',
			input: Inputs.postsAllHashes,
			output: Outputs.postsAllHashes,
		},
		input,
		() => ({
			method: 'GET',
			path: '/v1/posts/all',
			// Any `hashes` value switches posts/all to the change manifest; the
			// other posts/all filters are then ignored.
			query: { hashes: 'yes' },
			replayable: true,
		}),
		{
			shape: (raw) => ({ hashes: raw }),
			log: (_, result) => ({ count: result.hashes.length }),
		},
	);

export type PostsSuggestShape = {
	popular: unknown[]; // unknown: entries as linkhut sent them. The output schema checks each is a string.
	recommended: unknown[]; // unknown: same as `popular`.
};

/**
 * `shapePostsSuggest(raw: unknown, parsed?: unknown, request?: LinkhutRequest): PostsSuggestShape`
 * (unknown: the unvalidated response body.)
 *
 * `posts.suggest` answers `[{"popular":[...]},{"recommended":[...]}]`. This
 * returns both lists, merging every element, and a list no element names is
 * `[]`. It throws core's `ApiError` (status 200) when the body is not an array of
 * objects, or when a list is not an array, instead of returning empty lists.
 * The entries are left for the output schema to check.
 */
export function shapePostsSuggest(
	raw: unknown, // unknown: the response body, unvalidated.
	_parsed?: unknown, // unknown: the parsed input, not read here.
	request: LinkhutRequest = {
		method: 'GET',
		path: '/v1/posts/suggest',
		replayable: true,
	},
): PostsSuggestShape {
	const reject = () =>
		linkhutApiError(
			request,
			{ status: 200, statusText: 'OK', body: raw },
			'Linkhut posts/suggest did not answer an array of objects',
			false,
		);
	if (!Array.isArray(raw)) throw reject();
	const popular: unknown[] = []; // unknown: entries are checked by the output schema.
	const recommended: unknown[] = []; // unknown: same as `popular`.
	// A present list that is not an array is a wrong-shaped body, not an empty one.
	const take = (
		value: unknown, // unknown: one list as its element carries it: absent, an array or wrong.
		into: unknown[], // unknown: the merged entries, unchecked until the output schema runs.
	): void => {
		if (value === undefined) return;
		if (!Array.isArray(value)) throw reject();
		into.push(...value);
	};
	for (const element of raw) {
		const record = asRecord(element);
		if (!record) throw reject();
		take(record.popular, popular);
		take(record.recommended, recommended);
	}
	return { popular, recommended };
}

export const suggest: LinkhutEndpoints['postsSuggest'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'posts.suggest',
			input: Inputs.postsSuggest,
			output: Outputs.postsSuggest,
		},
		input,
		({ url }) => ({
			method: 'GET',
			path: '/v1/posts/suggest',
			query: { url },
			replayable: true,
		}),
		{
			shape: shapePostsSuggest,
			log: (_, result) => ({
				popular: result.popular.length,
				recommended: result.recommended.length,
			}),
		},
	);
