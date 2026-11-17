import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { serplyRequest } from '../client';
import type { SerplyContext } from '../context';
import {
	BingSearchOutputSchema,
	EbaySearchOutputSchema,
	JobSearchOutputSchema,
	NewsSearchInputSchema,
	NewsSearchOutputSchema,
	PageFetchInputSchema,
	PageFetchOutputSchema,
	ProductSearchOutputSchema,
	RedditCommentsInputSchema,
	RedditCommentsOutputSchema,
	RedditListingOutputSchema,
	RedditObjectOutputSchema,
	RedditPostInputSchema,
	RedditUserInputSchema,
	SimpleSearchInputSchema,
	SubredditAboutInputSchema,
	SubredditPostsInputSchema,
	VideoSearchOutputSchema,
	WebSearchInputSchema,
	WebSearchOutputSchema,
} from './types';

type Query = Record<string, string | number | boolean | undefined>;

/**
 * One read: parse the input, call Serply, parse the answer loosely. Events
 * log the operation and a result count, never the search terms.
 */
function op<I extends z.ZodType, O extends z.ZodType>(spec: {
	event: string;
	input: I;
	output: O;
	path: (parsed: z.output<I>) => string;
	query?: (parsed: z.output<I>) => Query;
	method?: 'GET' | 'POST';
	// unknown: the JSON body of a POST.
	body?: (parsed: z.output<I>) => Record<string, unknown>;
	count?: (result: z.output<O>) => number | undefined;
}): CorsairEndpoint<SerplyContext, z.input<I>, z.output<O>> {
	return async (ctx, input) => {
		const parsed = spec.input.parse(input ?? {});
		// unknown: the parsed input may carry the region and device fields.
		const located = parsed as { proxy_location?: string; device?: string };
		const raw = await serplyRequest<unknown>(ctx.key, spec.path(parsed), {
			method: spec.method,
			query: spec.query?.(parsed),
			body: spec.body?.(parsed),
			headers: {
				proxyLocation: located.proxy_location,
				device: located.device,
			},
		});
		const result = spec.output.parse(raw);
		await logEventFromContext(
			ctx,
			`serply.${spec.event}`,
			{ count: spec.count?.(result) },
			'completed',
		);
		return result;
	};
}

// Search routes take Google-style parameters in the query string:
// GET /v1/search/?q=...&num=... (https://serply.io/docs/resources/google-search).
const searchQuery = ({
	proxy_location: _p,
	device: _d,
	...rest
}: Record<string, unknown>): Query => rest as Query;

export const webSearch = op({
	event: 'web.search',
	input: WebSearchInputSchema,
	output: WebSearchOutputSchema,
	path: () => '/v1/search/',
	query: searchQuery,
	count: (r) => r.results.length,
});

export const bingSearch = op({
	event: 'bing.search',
	input: SimpleSearchInputSchema,
	output: BingSearchOutputSchema,
	path: () => '/v1/b/search/',
	query: searchQuery,
	count: (r) => r.results.length,
});

export const newsSearch = op({
	event: 'news.search',
	input: NewsSearchInputSchema,
	output: NewsSearchOutputSchema,
	path: () => '/v1/news/',
	query: searchQuery,
	count: (r) =>
		r.entries?.length ??
		(r.feed as { entries?: unknown[] } | null | undefined)?.entries?.length,
});

export const videoSearch = op({
	event: 'videos.search',
	input: SimpleSearchInputSchema,
	output: VideoSearchOutputSchema,
	path: () => '/v1/video/',
	query: searchQuery,
	count: (r) => r.results.length,
});

export const jobSearch = op({
	event: 'jobs.search',
	input: SimpleSearchInputSchema,
	output: JobSearchOutputSchema,
	path: () => '/v1/job/search/',
	query: searchQuery,
	count: (r) => r.jobs.length,
});

export const productSearch = op({
	event: 'products.search',
	input: SimpleSearchInputSchema,
	output: ProductSearchOutputSchema,
	path: () => '/v1/product/search/',
	query: searchQuery,
	count: (r) => r.products.length,
});

export const ebaySearch = op({
	event: 'ebay.search',
	input: SimpleSearchInputSchema,
	output: EbaySearchOutputSchema,
	path: () => '/v1/ebay/search/',
	query: searchQuery,
	count: (r) => r.results.length,
});

const listingQuery = (p: {
	limit?: number;
	sort?: string;
	t?: string;
	after?: string;
}): Query => ({ limit: p.limit, sort: p.sort, t: p.t, after: p.after });

export const redditSubredditPosts = op({
	event: 'reddit.subredditPosts',
	input: SubredditPostsInputSchema,
	output: RedditListingOutputSchema,
	path: (p) => `/v1/reddit/subreddit/${encodeURIComponent(p.subreddit)}`,
	query: listingQuery,
	count: (r) => r.data.children?.length,
});

export const redditSubredditAbout = op({
	event: 'reddit.subredditAbout',
	input: SubredditAboutInputSchema,
	output: RedditObjectOutputSchema,
	path: (p) => `/v1/reddit/subreddit/${encodeURIComponent(p.subreddit)}/about`,
});

export const redditUserPosts = op({
	event: 'reddit.userPosts',
	input: RedditUserInputSchema,
	output: RedditListingOutputSchema,
	path: (p) => `/v1/reddit/user/${encodeURIComponent(p.username)}`,
	query: listingQuery,
	count: (r) => r.data.children?.length,
});

export const redditPost = op({
	event: 'reddit.post',
	input: RedditPostInputSchema,
	output: RedditObjectOutputSchema,
	path: (p) => `/v1/reddit/post/${encodeURIComponent(p.id)}`,
	query: (p) => ({ sort: p.sort, with_comments: p.with_comments }),
});

export const redditComments = op({
	event: 'reddit.comments',
	input: RedditCommentsInputSchema,
	output: RedditCommentsOutputSchema,
	path: (p) => `/v1/reddit/comments/${encodeURIComponent(p.id)}`,
	query: (p) => ({ sort: p.sort }),
});

/** POST /v1/request: fetch a page through Serply as markdown or HTML. */
export const pageFetch = op({
	event: 'pages.fetch',
	input: PageFetchInputSchema,
	output: PageFetchOutputSchema,
	method: 'POST',
	path: () => '/v1/request',
	body: (p) => ({ url: p.url, response_type: p.response_type }),
});
