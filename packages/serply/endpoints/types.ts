import { z } from 'zod';
import {
	SerplyArticleEntity,
	SerplyImageEntity,
	SerplyPlaceEntity,
} from '../schema/database';

export const QueryInputSchema = z.object({
	q: z.string().min(1),
});

export const ImageInputSchema = QueryInputSchema.extend({
	num: z.number().int().min(1).max(20).optional(),
});

export const ScholarInputSchema = QueryInputSchema.extend({
	num: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe('Results per page, up to 200'),
	start: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based offset for the next page'),
});

export const ImageResponseSchema = z.object({
	images: z.array(SerplyImageEntity),
});
export const PlaceResponseSchema = z.object({
	places: z.array(SerplyPlaceEntity),
});
export const ArticleResponseSchema = z.object({
	articles: z.array(SerplyArticleEntity),
});

export type QueryInput = z.infer<typeof QueryInputSchema>;
export type ImageInput = z.infer<typeof ImageInputSchema>;
export type ScholarInput = z.infer<typeof ScholarInputSchema>;
export type ImageResponse = z.infer<typeof ImageResponseSchema>;
export type PlaceResponse = z.infer<typeof PlaceResponseSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;

export const SerplyEndpointInputSchemas = {
	'images.search': ImageInputSchema,
	'places.search': QueryInputSchema,
	'articles.search': ScholarInputSchema,
};

export const SerplyEndpointOutputSchemas = {
	'images.search': ImageResponseSchema,
	'places.search': PlaceResponseSchema,
	'articles.search': ArticleResponseSchema,
};

// ── Inputs shared by the search operations (https://serply.io/docs) ──

const ProxyLocation = z
	.enum([
		'EU',
		'CA',
		'US',
		'IE',
		'GB',
		'FR',
		'DE',
		'SE',
		'IN',
		'JP',
		'KR',
		'SG',
		'AU',
		'BR',
	])
	.optional()
	.describe('Region the search runs from (X-Proxy-Location)');
const Device = z
	.enum(['desktop', 'mobile'])
	.optional()
	.describe('Device Google sees (X-User-Agent); desktop by default');

const Located = { proxy_location: ProxyLocation, device: Device };

export const WebSearchInputSchema = z.object({
	q: z.string().min(1).describe('Search terms; Google operators work'),
	num: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page; Google serves about 10 at most'),
	start: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based offset: 10 for the second page'),
	gl: z.string().length(2).optional().describe('Country code, e.g. us or de'),
	hl: z.string().min(2).optional().describe('Interface language, e.g. en'),
	...Located,
});

export const SimpleSearchInputSchema = z.object({
	q: z.string().min(1),
	...Located,
});

export const NewsSearchInputSchema = z.object({
	q: z.string().min(1),
	ceid: z
		.string()
		.optional()
		.describe('Country and language edition, e.g. US:en or GB:en'),
	resolve_links: z
		.boolean()
		.optional()
		.describe(
			'Replace Google News redirect links with the publisher URL (2-3 s slower)',
		),
	...Located,
});

const RedditListing = {
	limit: z.number().int().min(1).max(100).optional(),
	sort: z.string().optional().describe('hot, new, top, ...'),
	t: z
		.enum(['hour', 'day', 'week', 'month', 'year', 'all'])
		.optional()
		.describe('Time window for top'),
	after: z.string().optional().describe('Cursor: the previous page data.after'),
};

const SubredditName = z
	.string()
	.min(1)
	.regex(/^[A-Za-z0-9_]+$/)
	.describe('Subreddit name without r/');

export const SubredditPostsInputSchema = z.object({
	subreddit: SubredditName,
	...RedditListing,
});
export const SubredditAboutInputSchema = z.object({ subreddit: SubredditName });
export const RedditUserInputSchema = z.object({
	username: z
		.string()
		.min(1)
		.regex(/^[A-Za-z0-9_-]+$/)
		.describe('Username without u/'),
	...RedditListing,
});
const RedditPostId = z
	.string()
	.min(1)
	.regex(/^[a-z0-9]+$/)
	.describe('Post id from the post URL, e.g. 1vfemi1');
export const RedditPostInputSchema = z.object({
	id: RedditPostId,
	sort: z.string().optional(),
	with_comments: z.boolean().optional(),
});
export const RedditCommentsInputSchema = z.object({
	id: RedditPostId,
	sort: z.string().optional().describe('confidence (default), top, new, ...'),
});

export const PageFetchInputSchema = z.object({
	url: z.string().url().describe('Page to fetch'),
	response_type: z
		.enum(['markdown', 'full'])
		.describe('markdown (good for agents) or full HTML'),
});

// ── Outputs: parsed loosely (optional, nullable, extra fields kept) ──

// unknown: Serply passes Google, Bing, eBay and Reddit fields through as is;
// the documented ones are typed, the rest stay as JSON.
const Loose = z.object({}).loose();

const SerpResult = z
	.object({
		title: z.string().nullish(),
		link: z.string().nullish(),
		description: z.string().nullish(),
		position: z.number().nullish(),
		realPosition: z.number().nullish(),
		result_type: z.string().nullish(),
	})
	.loose();

export const WebSearchOutputSchema = z
	.object({
		results: z.array(SerpResult),
		ads: z.array(SerpResult).nullish(),
		ai_overview: Loose.nullish(),
		related_questions: z.array(Loose).nullish(),
		total: z.number().nullish(),
	})
	.loose();

export const BingSearchOutputSchema = z
	.object({
		results: z.array(SerpResult),
		ads: z.array(Loose).nullish(),
		shoppingAds: z.array(Loose).nullish(),
	})
	.loose();

export const NewsSearchOutputSchema = z
	.object({
		feed: Loose.nullish(),
		entries: z
			.array(
				z
					.object({
						title: z.string().nullish(),
						link: z.string().nullish(),
						published: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const VideoSearchOutputSchema = z
	.object({ results: z.array(SerpResult) })
	.loose();

export const JobSearchOutputSchema = z
	.object({
		jobs: z.array(
			z
				.object({
					position: z.string().nullish(),
					employer: z.string().nullish(),
					location: z.string().nullish(),
					link: z.string().nullish(),
					posted_at: z.string().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export const ProductSearchOutputSchema = z
	.object({
		products: z.array(
			z
				.object({
					title: z.string().nullish(),
					link: z.string().nullish(),
					price: z.union([z.number(), z.string()]).nullish(),
				})
				.loose(),
		),
	})
	.loose();

export const EbaySearchOutputSchema = z
	.object({
		results: z.array(SerpResult),
		total: z.number().nullish(),
	})
	.loose();

const RedditThing = z
	.object({ kind: z.string().nullish(), data: Loose.nullish() })
	.loose();

export const RedditListingOutputSchema = z
	.object({
		kind: z.string().nullish(),
		data: z
			.object({
				after: z.string().nullish(),
				children: z.array(RedditThing).nullish(),
			})
			.loose(),
	})
	.loose();

export const RedditObjectOutputSchema = Loose;

export const RedditCommentsOutputSchema = z
	.object({ data: z.array(RedditListingOutputSchema) })
	.loose();

export const PageFetchOutputSchema = z
	.object({
		data: z.string().describe('Page content as markdown or HTML'),
		status: z.number().nullish().describe('HTTP status of the fetched page'),
		headers: Loose.nullish(),
	})
	.loose();
