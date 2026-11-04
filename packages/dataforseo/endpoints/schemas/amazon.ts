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

const AmazonRating = z
	.object({
		type: Text,
		position: Text,
		rating_type: Text,
		value: Num,
		votes_count: Num,
		rating_max: Num,
	})
	.nullish();

const AmazonListing = {
	domain: Text,
	title: Text,
	url: Text,
	image_url: Text,
	bought_past_month: Num,
	price_from: Num,
	price_to: Num,
	currency: Text,
	special_offers: Strings,
	data_asin: Text,
	rating: AmazonRating,
	is_amazon_choice: Bool,
	is_best_seller: Bool,
	delivery_info: z
		.object({
			delivery_message: Text,
			delivery_date_from: Text,
			delivery_date_to: Text,
			fastest_delivery_date_from: Text,
			fastest_delivery_date_to: Text,
			delivery_price: PriceInfo,
		})
		.nullish(),
	labels: z
		.array(z.object({ type: Text, title: Text, url: Text, domain: Text }))
		.nullish(),
};

const ItemBase = {
	rank_group: Num,
	rank_absolute: Num,
	position: Text,
	xpath: Text,
};

const ListingGroup = z
	.array(z.object({ type: Text, xpath: Text, ...AmazonListing }))
	.nullish();

const AmazonSearchItem = z.discriminatedUnion('type', [
	z.object({ type: z.literal('amazon_serp'), ...ItemBase, ...AmazonListing }),
	z.object({ type: z.literal('amazon_paid'), ...ItemBase, ...AmazonListing }),
	z.object({
		type: z.literal('editorial_recommendations'),
		...ItemBase,
		items: ListingGroup,
	}),
	z.object({
		type: z.literal('top_rated_from_our_brands'),
		...ItemBase,
		items: ListingGroup,
	}),
	z.object({
		type: z.literal('related_searches'),
		...ItemBase,
		items: z
			.array(
				z.object({
					type: Text,
					title: Text,
					url: Text,
					image_alt: Text,
					image_url: Text,
				}),
			)
			.nullish(),
	}),
]);

export const AmazonProductsResult = z.object({
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
	// Department name -> result count, as listed beside the results.
	categories: z.record(z.string(), z.number().nullable()).nullish(),
	items_count: Num,
	items: z.array(AmazonSearchItem).nullish(),
});

const ProductInformation = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('product_information_details_item'),
		section_name: Text,
		body: z.record(z.string(), z.string().nullable()).nullish(),
	}),
	z.object({
		type: z.literal('product_information_text_item'),
		section_name: Text,
		text: Text,
	}),
	z.object({
		type: z.literal('product_information_extended_item'),
		section_name: Text,
		contents: z
			.array(
				z.object({
					type: Text,
					title: Text,
					rows: z
						.array(z.object({ type: Text, text: Text, alt: Text, url: Text }))
						.nullish(),
				}),
			)
			.nullish(),
	}),
]);

const AmazonReview = z.object({
	type: Text,
	...ItemBase,
	verified: Bool,
	subtitle: Text,
	helpful_votes: Text,
	images: z.array(ImageElement).nullish(),
	videos: z.array(VideoElement).nullish(),
	user_profile: z
		.object({
			name: Text,
			avatar: Text,
			url: Text,
			reviews_count: Num,
			locations: Text,
		})
		.nullish(),
	title: Text,
	url: Text,
	review_text: Text,
	publication_date: Text,
	rating: RatingInfo,
});

export const AmazonProduct = z.object({
	type: Text,
	...ItemBase,
	title: Text,
	details: Text,
	image_url: Text,
	author: Text,
	data_asin: Text,
	parent_asin: Text,
	product_asins: Strings,
	price_from: Num,
	price_to: Num,
	percentage_discount: Text,
	currency: Text,
	is_amazon_choice: Bool,
	rating: AmazonRating,
	is_newer_model_available: Bool,
	is_prime_video: Bool,
	newer_model: z.object({ title: Text, newer_model_asin: Text }).nullish(),
	categories: z.array(z.object({ category: Text, url: Text })).nullish(),
	product_information: z.array(ProductInformation).nullish(),
	product_images_list: Strings,
	product_videos_list: Strings,
	description: Text,
	is_available: Bool,
	top_local_reviews: z.array(AmazonReview).nullish(),
	top_global_reviews: z.array(AmazonReview).nullish(),
});

export type AmazonProduct = z.infer<typeof AmazonProduct>;

export const AmazonAsinResult = z.object({
	asin: Text,
	type: Text,
	se_domain: Text,
	location_code: Num,
	language_code: Text,
	check_url: Text,
	datetime: Text,
	item_types: Strings,
	items_count: Num,
	items: z.array(AmazonProduct).nullish(),
});

// Inputs

const AmazonLocation = {
	...Location,
	...Coordinate,
	se_domain: z.string().optional(),
	...Tag,
};

export const AmazonProductsInput = z
	.object({
		keyword: Keyword,
		url: z.url().optional(),
		...AmazonLocation,
		depth: z.number().int().min(1).max(700).optional(),
		max_crawl_pages: z.number().int().min(1).max(7).optional(),
		department: z.string().optional(),
		search_param: z.string().optional(),
		price_min: z.number().int().min(0).optional(),
		price_max: z.number().int().min(0).optional(),
		sort_by: z
			.enum([
				'relevance',
				'price_low_to_high',
				'price_high_to_low',
				'featured',
				'avg_customer_review',
				'newest_arrival',
			])
			.optional(),
	})
	.refine((input) => input.url || hasLocation(input), locationMessage)
	.refine((input) => input.url || hasLanguage(input), languageMessage);

export const AmazonAsinInput = z
	.object({
		asin: z.string().regex(/^[A-Z0-9]{10}$/, 'Expected a 10-character ASIN'),
		...AmazonLocation,
	})
	.refine(hasLocation, locationMessage)
	.refine(hasLanguage, languageMessage);
