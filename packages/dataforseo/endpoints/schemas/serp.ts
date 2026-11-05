import { z } from 'zod';
import {
	Bool,
	Coordinate,
	hasLanguage,
	hasLocation,
	ImageElement,
	Keyword,
	Location,
	languageMessage,
	locationMessage,
	Num,
	PriceInfo,
	RatingInfo,
	Spell,
	Strings,
	Tag,
	Text,
	VideoElement,
} from './shared';

// SERP element items. The API documents 61 item types, discriminated by `type`;
// the types below are fully typed, and every other type is parsed as
// SerpItemBase with its type-specific fields kept as returned.

const SerpItemBase = {
	type: z.string(),
	rank_group: Num,
	rank_absolute: Num,
	page: Num,
	position: Text,
	xpath: Text,
};

const LinkElement = z.object({
	type: Text,
	title: Text,
	snippet: Text,
	description: Text,
	url: Text,
	domain: Text,
});

const ResultFields = {
	domain: Text,
	title: Text,
	description: Text,
	url: Text,
	breadcrumb: Text,
	website_name: Text,
	is_image: Bool,
	is_video: Bool,
	images: z.array(ImageElement).nullish(),
	highlighted: Strings,
	rating: RatingInfo,
	price: PriceInfo,
	timestamp: Text,
};

const AiOverviewReferences = z
	.array(
		z.object({
			type: Text,
			source: Text,
			domain: Text,
			url: Text,
			title: Text,
			text: Text,
		}),
	)
	.nullish();

const OrganicItem = z.object({
	...SerpItemBase,
	type: z.literal('organic'),
	...ResultFields,
	cache_url: Text,
	related_search_url: Text,
	is_featured_snippet: Bool,
	is_malicious: Bool,
	is_web_story: Bool,
	pre_snippet: Text,
	extended_snippet: Text,
	amp_version: Bool,
	links: z.array(LinkElement).nullish(),
	faq: z
		.object({
			type: Text,
			items: z
				.array(
					z.object({
						type: Text,
						title: Text,
						description: Text,
						links: z.array(LinkElement).nullish(),
					}),
				)
				.nullish(),
		})
		.nullish(),
});

const PaidItem = z.object({
	...SerpItemBase,
	type: z.literal('paid'),
	...ResultFields,
	description_rows: Strings,
	links: z
		.array(
			z.object({
				type: Text,
				title: Text,
				description: Text,
				url: Text,
				domain: Text,
			}),
		)
		.nullish(),
});

const FeaturedSnippetItem = z.object({
	...SerpItemBase,
	type: z.literal('featured_snippet'),
	...ResultFields,
	featured_title: Text,
	table: z
		.object({
			table_element: Text,
			table_header: Strings,
			table_content: z.array(z.array(z.string())).nullish(),
		})
		.nullish(),
});

const PeopleAlsoAskItem = z.object({
	...SerpItemBase,
	type: z.literal('people_also_ask'),
	items: z
		.array(
			z.object({
				type: Text,
				title: Text,
				seed_question: Text,
				xpath: Text,
				// people_also_ask_expanded_element carries the answer;
				// people_also_ask_ai_overview_expanded_element carries references.
				expanded_element: z
					.array(
						z.object({
							type: Text,
							featured_title: Text,
							url: Text,
							domain: Text,
							title: Text,
							description: Text,
							images: z.array(ImageElement).nullish(),
							timestamp: Text,
							asynchronous_ai_overview: Bool,
							references: AiOverviewReferences,
						}),
					)
					.nullish(),
			}),
		)
		.nullish(),
});

const RelatedSearchesItem = z.object({
	...SerpItemBase,
	type: z.literal('related_searches'),
	items: Strings,
});

const TopStoriesItem = z.object({
	...SerpItemBase,
	type: z.literal('top_stories'),
	title: Text,
	items: z
		.array(
			z.object({
				type: Text,
				source: Text,
				domain: Text,
				title: Text,
				date: Text,
				timestamp: Text,
				url: Text,
				image_url: Text,
			}),
		)
		.nullish(),
});

const LocalPackItem = z.object({
	...SerpItemBase,
	type: z.literal('local_pack'),
	title: Text,
	description: Text,
	domain: Text,
	phone: Text,
	booking_url: Text,
	url: Text,
	is_paid: Bool,
	rating: RatingInfo,
	cid: Text,
});

const AiOverviewItem = z.object({
	...SerpItemBase,
	type: z.literal('ai_overview'),
	asynchronous_ai_overview: Bool,
	markdown: Text,
	references: AiOverviewReferences,
});

const VideoItem = z.object({
	...SerpItemBase,
	type: z.literal('video'),
	items: z.array(VideoElement).nullish(),
});

const typedItems = [
	OrganicItem,
	PaidItem,
	FeaturedSnippetItem,
	PeopleAlsoAskItem,
	RelatedSearchesItem,
	TopStoriesItem,
	LocalPackItem,
	AiOverviewItem,
	VideoItem,
] as const;

const typedItemTypes: readonly string[] = typedItems.map(
	(item) => item.shape.type.value,
);

// Any of the other documented item types (knowledge_graph, images, jobs, ...).
const OtherSerpItem = z
	.object(SerpItemBase)
	.loose()
	.refine((item) => !typedItemTypes.includes(item.type), {
		message: 'Item matched a typed SERP element type but not its schema',
	});

export const SerpItem = z.union([...typedItems, OtherSerpItem]);

export type SerpItem = z.infer<typeof SerpItem>;

const SerpResultBase = {
	keyword: Text,
	type: Text,
	se_domain: Text,
	location_code: Num,
	language_code: Text,
	check_url: Text,
	datetime: Text,
	spell: Spell,
	item_types: Strings,
	se_results_count: Num,
	items_count: Num,
};

export const GoogleOrganicResult = z.object({
	...SerpResultBase,
	pages_count: Num,
	refinement_chips: z
		.object({
			type: Text,
			xpath: Text,
			items: z
				.array(z.object({ type: Text, title: Text, url: Text, domain: Text }))
				.nullish(),
		})
		.nullish(),
	items: z.array(SerpItem).nullish(),
});

const NewsItem = z.discriminatedUnion('type', [
	z.object({
		...SerpItemBase,
		type: z.literal('news_search'),
		domain: Text,
		title: Text,
		url: Text,
		image_url: Text,
		snippet: Text,
		time_published: Text,
		timestamp: Text,
	}),
	z.object({
		...SerpItemBase,
		type: z.literal('top_stories'),
		items: z
			.array(
				z.object({
					type: Text,
					source: Text,
					domain: Text,
					title: Text,
					date: Text,
					timestamp: Text,
					url: Text,
					image_url: Text,
				}),
			)
			.nullish(),
	}),
]);

export const GoogleNewsResult = z.object({
	...SerpResultBase,
	includes_non_news_search_results: Bool,
	items: z.array(NewsItem).nullish(),
});

// Inputs

const SerpRequest = {
	keyword: Keyword,
	...Location,
	...Coordinate,
	depth: z.number().int().min(1).max(200).optional(),
	max_crawl_pages: z.number().int().min(1).max(100).optional(),
	search_param: z.string().optional(),
	se_domain: z.string().optional(),
	url: z.url().optional(),
	...Tag,
};

const ElementType = z.enum([
	'organic',
	'paid',
	'local_pack',
	'featured_snippet',
	'events',
	'google_flights',
	'images',
	'jobs',
	'knowledge_graph',
	'local_service',
	'map',
	'scholarly_articles',
	'third_party_reviews',
	'twitter',
]);

export const GoogleOrganicInput = z
	.object({
		...SerpRequest,
		device: z.enum(['desktop', 'mobile']).optional(),
		os: z.enum(['windows', 'macos', 'android', 'ios']).optional(),
		load_async_ai_overview: z.boolean().optional(),
		people_also_ask_click_depth: z.number().int().min(1).max(4).optional(),
		group_organic_results: z.boolean().optional(),
		remove_from_url: z.array(z.string()).max(10).optional(),
		target: z.string().optional(),
		target_search_mode: z.enum(['all', 'any']).optional(),
		find_targets_in: z.array(ElementType).optional(),
		ignore_targets_in: z.array(ElementType).optional(),
		stop_crawl_on_match: z
			.array(
				z.object({
					match_value: z.string().min(1),
					match_type: z.enum(['domain', 'with_subdomains', 'wildcard']),
				}),
			)
			.max(10)
			.optional(),
	})
	.refine((input) => input.url || hasLocation(input), locationMessage)
	.refine((input) => input.url || hasLanguage(input), languageMessage);

export const GoogleNewsInput = z
	.object({
		...SerpRequest,
		os: z.enum(['windows', 'macos']).optional(),
	})
	.refine((input) => input.url || hasLocation(input), locationMessage)
	.refine((input) => input.url || hasLanguage(input), languageMessage);
