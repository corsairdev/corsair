import { z } from 'zod';

// Shared Models
// Docs: https://developers.giphy.com/docs/api/schema/ (Gif, Image,
// Pagination, Meta, User, Random Id, Emoji, Category, Term, Channel objects)
export const GiphyRatingSchema = z
	.enum(['g', 'pg', 'pg-13', 'r'])
	.describe(
		'Content rating filter. See https://developers.giphy.com/docs/optional-settings/#rating',
	);

export const GiphyImageRenditionSchema = z
	.object({
		url: z.string().optional(),
		width: z.string().optional(),
		height: z.string().optional(),
		size: z.string().optional(),
		mp4: z.string().optional(),
		mp4_size: z.string().optional(),
		webp: z.string().optional(),
		webp_size: z.string().optional(),
	})
	.passthrough();

export const GiphyUserSchema = z
	.object({
		avatar_url: z.string().optional(),
		banner_image: z.string().optional(),
		banner_url: z.string().optional(),
		profile_url: z.string().optional(),
		username: z.string().optional(),
		display_name: z.string().optional(),
		description: z.string().optional(),
		instagram_url: z.string().optional(),
		website_url: z.string().optional(),
		is_verified: z.boolean().optional(),
	})
	.passthrough();

export const GiphyGifSchema = z
	.object({
		type: z.string().optional(),
		id: z.string(),
		url: z.string().optional(),
		slug: z.string().optional(),
		bitly_gif_url: z.string().optional(),
		bitly_url: z.string().optional(),
		embed_url: z.string().optional(),
		username: z.string().optional(),
		source: z.string().optional(),
		title: z.string().optional(),
		rating: z.string().optional(),
		content_url: z.string().optional(),
		source_tld: z.string().optional(),
		source_post_url: z.string().optional(),
		is_sticker: z.number().optional(),
		import_datetime: z.string().optional(),
		trending_datetime: z.string().optional(),
		images: z.record(z.string(), GiphyImageRenditionSchema).optional(),
		user: GiphyUserSchema.optional(),
	})
	.passthrough();

export const GiphyPaginationSchema = z
	.object({
		total_count: z.number().optional(),
		count: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const GiphyMetaSchema = z
	.object({
		status: z.number().optional(),
		msg: z.string().optional(),
		response_id: z.string().optional(),
	})
	.passthrough();

export const GiphyListResponseSchema = z
	.object({
		data: z.array(GiphyGifSchema),
		pagination: GiphyPaginationSchema.optional(),
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

export const GiphySingleResponseSchema = z
	.object({
		data: GiphyGifSchema,
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

export const GiphyCategorySubcategorySchema = z
	.object({
		name: z.string(),
		name_encoded: z.string().optional(),
	})
	.passthrough();

export const GiphyCategoryItemSchema = z
	.object({
		name: z.string(),
		name_encoded: z.string().optional(),
		subcategories: z.array(GiphyCategorySubcategorySchema).optional(),
		gif: GiphyGifSchema.optional(),
	})
	.passthrough();

export const GiphyCategoriesResponseSchema = z
	.object({
		data: z.array(GiphyCategoryItemSchema),
		pagination: GiphyPaginationSchema.optional(),
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

// Term Object — https://developers.giphy.com/docs/api/schema/#term-object
// Returned by the Autocomplete and Search Suggestions endpoints.
export const GiphyTermSchema = z
	.object({
		name: z.string(),
	})
	.passthrough();

export const GiphyTermsResponseSchema = z
	.object({
		data: z.array(GiphyTermSchema),
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

// Trending Search Terms — https://developers.giphy.com/docs/api/endpoint/#trending-search-terms
// `data` is a plain array of strings, not objects.
export const GiphyTrendingSearchesResponseSchema = z
	.object({
		data: z.array(z.string()),
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

// Channel Object — https://developers.giphy.com/docs/api/schema/#channel-object
export const GiphyChannelSchema = z
	.object({
		id: z.number().optional(),
		slug: z.string().optional(),
		display_name: z.string().optional(),
		content_type: z.string().optional(),
		user: GiphyUserSchema.optional(),
	})
	.passthrough();

export const GiphyChannelsResponseSchema = z
	.object({
		data: z.array(GiphyChannelSchema),
		pagination: GiphyPaginationSchema.optional(),
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

// Random Id Object — https://developers.giphy.com/docs/api/schema/#random-id-object
export const GiphyRandomIdResponseSchema = z
	.object({
		data: z.object({ random_id: z.string() }).passthrough(),
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

// Upload endpoint — https://developers.giphy.com/docs/api/endpoint/#upload
// Successful response carries the new content ID in `data.id`.
export const GiphyUploadResponseSchema = z
	.object({
		data: z.object({ id: z.string() }).passthrough(),
		meta: GiphyMetaSchema.optional(),
	})
	.passthrough();

// Action Register endpoint — https://developers.giphy.com/docs/api/endpoint/#action-register
// The pingback returns `200 OK` with an empty body on success, so the
// endpoint surface models the outcome explicitly instead of the wire body.
export const GiphyAnalyticsRegisterResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.describe('True when the analytics pingback was accepted (HTTP 200)');

// Endpoint Input Schemas
// Every list/search input below carries the docs' `customer_id` field:
// "An identifier assigned to a user in your platform. Use it consistently
// across that user's requests." Prefer the Random ID endpoint when no
// stable platform user ID exists. `country_code`/`region` are intentionally
// omitted — the docs only require them for proxied server-side requests,
// and this plugin calls GIPHY directly.
export const GifsSearchInputSchema = z.object({
	q: z.string().describe('Search query term or phrase'),
	limit: z
		.number()
		.optional()
		.describe('The maximum number of objects to return. Default: 25'),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	lang: z
		.string()
		.optional()
		.describe('Specify default language for regional content'),
	random_id: z
		.string()
		.optional()
		.describe(
			'Deprecated alias for customer_id, kept for backwards compatibility',
		),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
	channel_ids: z
		.string()
		.optional()
		.describe(
			'Filters results by specified channel IDs, separated by commas. Maximum: 5',
		),
	bundle: z.string().optional().describe('Returns upload or clips data'),
});

export const GifsTrendingInputSchema = z.object({
	limit: z
		.number()
		.optional()
		.describe('The maximum number of objects to return. Default: 25'),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	random_id: z
		.string()
		.optional()
		.describe(
			'Deprecated alias for customer_id, kept for backwards compatibility',
		),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
	bundle: z.string().optional().describe('Returns upload or clips data'),
});

export const GifsTranslateInputSchema = z.object({
	s: z.string().describe('Search term to translate into a GIF'),
	// `weirdness` (0-10) predates this review and is retained for backwards
	// compatibility; the docs' endpoint table additionally lists `rating` and
	// `customer_id`, which are added here.
	weirdness: z
		.number()
		.min(0)
		.max(10)
		.optional()
		.describe('Value from 0-10 on the weirdness scale'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const GifsRandomInputSchema = z.object({
	tag: z.string().optional().describe('Filters results by specified tag'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	random_id: z
		.string()
		.optional()
		.describe(
			'Deprecated alias for customer_id, kept for backwards compatibility',
		),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const GifsGetByIdInputSchema = z.object({
	gif_id: z.string().describe('GIPHY GIF ID'),
	rating: GiphyRatingSchema.optional().describe(
		'If the GIF rating exceeds this, the API returns an empty error response',
	),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const GifsGetByIdsInputSchema = z.object({
	ids: z
		.union([z.array(z.string()), z.string()])
		.describe('Array of GIF IDs or comma-separated string'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const GifsUploadInputSchema = z
	.object({
		// Binary input follows the repo convention (base64 string at the
		// endpoint boundary, e.g. bigmailer suppression-list upload) and is
		// decoded to a File for the multipart `file` part in endpoints/gifs.ts.
		file_base64: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Animated GIF or video file content as base64. Required when source_image_url is omitted',
			),
		file_name: z
			.string()
			.optional()
			.describe('Filename for the multipart upload part. Default: upload.gif'),
		source_image_url: z
			.string()
			.url()
			.optional()
			.describe(
				'Public URL of the image or video to upload. Required when file_base64 is omitted',
			),
		tags: z
			.string()
			.optional()
			.describe('Comma-delimited list of tags applied to the upload'),
		source_post_url: z
			.string()
			.url()
			.optional()
			.describe('URL of the source of the asset'),
		username: z
			.string()
			.optional()
			.describe('Assigned username (approved production apps only)'),
	})
	.refine(
		(input) => Boolean(input.file_base64) !== Boolean(input.source_image_url),
		{
			message: 'Exactly one of file_base64 or source_image_url is required',
		},
	);

export const StickersSearchInputSchema = z.object({
	q: z.string().describe('Search query term or phrase'),
	limit: z
		.number()
		.optional()
		.describe('The maximum number of objects to return. Default: 25'),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	lang: z
		.string()
		.optional()
		.describe('Specify default language for regional content'),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const StickersTrendingInputSchema = z.object({
	limit: z
		.number()
		.optional()
		.describe('The maximum number of objects to return. Default: 25'),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const StickersTranslateInputSchema = z.object({
	s: z.string().describe('Search term to translate into a sticker'),
	// See GifsTranslateInputSchema: `weirdness` retained for backwards
	// compatibility alongside the docs' `rating` and `customer_id`.
	weirdness: z
		.number()
		.min(0)
		.max(10)
		.optional()
		.describe('Value from 0-10 on the weirdness scale'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const StickersRandomInputSchema = z.object({
	tag: z.string().optional().describe('Filters results by specified tag'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const EmojiGetInputSchema = z.object({
	limit: z
		.number()
		.optional()
		.describe('The maximum number of objects to return. Default: 25'),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const EmojiVariationsInputSchema = z.object({
	gif_id: z.string().describe('GIPHY Emoji GIF ID to get variations for'),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

export const CategoriesListInputSchema = z
	.object({
		customer_id: z
			.string()
			.optional()
			.describe('Identifier assigned to a user in your platform'),
	})
	.optional();

// Get Category by ID — live-verified with a developer key (not in the
// public docs tables): GET /v1/gifs/categories/<category_id> returns the
// category's subcategories. `category_id` is the `name_encoded` value from
// categories.list. Unknown names return HTTP 200 with empty `data`.
export const CategoriesGetByIdInputSchema = z.object({
	category_id: z
		.string()
		.describe(
			'Category identifier (name_encoded value from categories.list, e.g. "actions")',
		),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

// Category GIFs — live-verified with a developer key (not in the public
// docs tables): GET /v1/gifs/categories/<category_id>/gifs returns a
// paginated GIF list for the category and honours limit/offset.
export const CategoriesGifsInputSchema = z.object({
	category_id: z
		.string()
		.describe(
			'Category identifier (name_encoded value from categories.list, e.g. "actions")',
		),
	limit: z
		.number()
		.optional()
		.describe('The maximum number of objects to return. Default: 25'),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	rating: GiphyRatingSchema.optional().describe(
		'Filters results by specified rating',
	),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

// Autocomplete — https://developers.giphy.com/docs/api/endpoint/#autocomplete
export const TagsAutocompleteInputSchema = z.object({
	q: z.string().describe('Tag term to autocomplete'),
	limit: z
		.number()
		.optional()
		.describe('The maximum number of objects to return. Default: 5'),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

// Trending Search Terms — https://developers.giphy.com/docs/api/endpoint/#trending-search-terms
export const TagsTrendingInputSchema = z
	.object({
		customer_id: z
			.string()
			.optional()
			.describe('Identifier assigned to a user in your platform'),
	})
	.optional();

// Search Suggestions — https://developers.giphy.com/docs/api/endpoint/#search-suggestions
// Path: /v1/tags/related/<term>
export const TagsRelatedInputSchema = z.object({
	term: z.string().describe('Tag term to find related tags for'),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

// Channel Search — https://developers.giphy.com/docs/api/endpoint/#channel-search
export const ChannelsSearchInputSchema = z.object({
	q: z.string().describe('Term to search through GIPHY channels'),
	limit: z
		.number()
		.max(50)
		.optional()
		.describe(
			'The maximum number of objects to return. Default: 25, maximum: 50',
		),
	offset: z
		.number()
		.optional()
		.describe('Specifies the starting position of the results. Default: 0'),
	customer_id: z
		.string()
		.optional()
		.describe('Identifier assigned to a user in your platform'),
});

// Random ID — https://developers.giphy.com/docs/api/endpoint/#random-id
// Takes no parameters beyond the API key in the query string.
export const RandomIdGetInputSchema = z.object({}).optional();

// Action Register — https://developers.giphy.com/docs/api/endpoint/#action-register
// The pingback URL comes from a GIF response's `analytics` object
// (onload/onclick/onsent). The host is allow-listed so a caller cannot turn
// this endpoint into an open redirector/SSRF primitive.
export const AnalyticsRegisterInputSchema = z.object({
	pingback_url: z
		.string()
		.url()
		.refine(
			(url) => {
				try {
					return (
						new URL(url).hostname.toLowerCase() === 'giphy-analytics.giphy.com'
					);
				} catch {
					return false;
				}
			},
			{
				message:
					'pingback_url must be a GIPHY analytics URL from a GIF response analytics object',
			},
		)
		.describe(
			'Tracking URL from a GIF analytics object (onload, onclick, or onsent)',
		),
	customer_id: z
		.string()
		.describe('Identifier assigned to a user in your platform'),
	ts: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'UNIX timestamp in milliseconds of when the action occurred. Default: now',
		),
});

// Inferred Types
export type GiphyImageRendition = z.infer<typeof GiphyImageRenditionSchema>;
export type GiphyUser = z.infer<typeof GiphyUserSchema>;
export type GiphyGif = z.infer<typeof GiphyGifSchema>;
export type GiphyListResponse = z.infer<typeof GiphyListResponseSchema>;
export type GiphySingleResponse = z.infer<typeof GiphySingleResponseSchema>;
export type GiphyCategoriesResponse = z.infer<
	typeof GiphyCategoriesResponseSchema
>;
export type GiphyTerm = z.infer<typeof GiphyTermSchema>;
export type GiphyTermsResponse = z.infer<typeof GiphyTermsResponseSchema>;
export type GiphyTrendingSearchesResponse = z.infer<
	typeof GiphyTrendingSearchesResponseSchema
>;
export type GiphyChannel = z.infer<typeof GiphyChannelSchema>;
export type GiphyChannelsResponse = z.infer<typeof GiphyChannelsResponseSchema>;
export type GiphyRandomIdResponse = z.infer<typeof GiphyRandomIdResponseSchema>;
export type GiphyUploadResponse = z.infer<typeof GiphyUploadResponseSchema>;
export type GiphyAnalyticsRegisterResponse = z.infer<
	typeof GiphyAnalyticsRegisterResponseSchema
>;

export type GifsSearchInput = z.infer<typeof GifsSearchInputSchema>;
export type GifsTrendingInput = z.infer<typeof GifsTrendingInputSchema>;
export type GifsTranslateInput = z.infer<typeof GifsTranslateInputSchema>;
export type GifsRandomInput = z.infer<typeof GifsRandomInputSchema>;
export type GifsGetByIdInput = z.infer<typeof GifsGetByIdInputSchema>;
export type GifsGetByIdsInput = z.infer<typeof GifsGetByIdsInputSchema>;
export type GifsUploadInput = z.infer<typeof GifsUploadInputSchema>;

export type StickersSearchInput = z.infer<typeof StickersSearchInputSchema>;
export type StickersTrendingInput = z.infer<typeof StickersTrendingInputSchema>;
export type StickersTranslateInput = z.infer<
	typeof StickersTranslateInputSchema
>;
export type StickersRandomInput = z.infer<typeof StickersRandomInputSchema>;

export type EmojiGetInput = z.infer<typeof EmojiGetInputSchema>;
export type EmojiVariationsInput = z.infer<typeof EmojiVariationsInputSchema>;

export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;
export type CategoriesGetByIdInput = z.infer<
	typeof CategoriesGetByIdInputSchema
>;
export type CategoriesGifsInput = z.infer<typeof CategoriesGifsInputSchema>;

export type TagsAutocompleteInput = z.infer<typeof TagsAutocompleteInputSchema>;
export type TagsTrendingInput = z.infer<typeof TagsTrendingInputSchema>;
export type TagsRelatedInput = z.infer<typeof TagsRelatedInputSchema>;

export type ChannelsSearchInput = z.infer<typeof ChannelsSearchInputSchema>;

export type RandomIdGetInput = z.infer<typeof RandomIdGetInputSchema>;

export type AnalyticsRegisterInput = z.infer<
	typeof AnalyticsRegisterInputSchema
>;

// Endpoint Input/Output Mappings
export type GiphyEndpointInputs = {
	gifsSearch: GifsSearchInput;
	gifsTrending: GifsTrendingInput;
	gifsTranslate: GifsTranslateInput;
	gifsRandom: GifsRandomInput;
	gifsGetById: GifsGetByIdInput;
	gifsGetByIds: GifsGetByIdsInput;
	gifsUpload: GifsUploadInput;
	stickersSearch: StickersSearchInput;
	stickersTrending: StickersTrendingInput;
	stickersTranslate: StickersTranslateInput;
	stickersRandom: StickersRandomInput;
	emojiGet: EmojiGetInput;
	emojiVariations: EmojiVariationsInput;
	categoriesList: CategoriesListInput;
	categoriesGetById: CategoriesGetByIdInput;
	categoriesGifs: CategoriesGifsInput;
	tagsAutocomplete: TagsAutocompleteInput;
	tagsTrending: TagsTrendingInput;
	tagsRelated: TagsRelatedInput;
	channelsSearch: ChannelsSearchInput;
	randomIdGet: RandomIdGetInput;
	analyticsRegister: AnalyticsRegisterInput;
};

export type GiphyEndpointOutputs = {
	gifsSearch: GiphyListResponse;
	gifsTrending: GiphyListResponse;
	gifsTranslate: GiphySingleResponse;
	gifsRandom: GiphySingleResponse;
	gifsGetById: GiphySingleResponse;
	gifsGetByIds: GiphyListResponse;
	gifsUpload: GiphyUploadResponse;
	stickersSearch: GiphyListResponse;
	stickersTrending: GiphyListResponse;
	stickersTranslate: GiphySingleResponse;
	stickersRandom: GiphySingleResponse;
	emojiGet: GiphyListResponse;
	emojiVariations: GiphyListResponse;
	categoriesList: GiphyCategoriesResponse;
	categoriesGetById: GiphyCategoriesResponse;
	categoriesGifs: GiphyListResponse;
	tagsAutocomplete: GiphyTermsResponse;
	tagsTrending: GiphyTrendingSearchesResponse;
	tagsRelated: GiphyTermsResponse;
	channelsSearch: GiphyChannelsResponse;
	randomIdGet: GiphyRandomIdResponse;
	analyticsRegister: GiphyAnalyticsRegisterResponse;
};

export const GiphyEndpointInputSchemas = {
	gifsSearch: GifsSearchInputSchema,
	gifsTrending: GifsTrendingInputSchema,
	gifsTranslate: GifsTranslateInputSchema,
	gifsRandom: GifsRandomInputSchema,
	gifsGetById: GifsGetByIdInputSchema,
	gifsGetByIds: GifsGetByIdsInputSchema,
	gifsUpload: GifsUploadInputSchema,
	stickersSearch: StickersSearchInputSchema,
	stickersTrending: StickersTrendingInputSchema,
	stickersTranslate: StickersTranslateInputSchema,
	stickersRandom: StickersRandomInputSchema,
	emojiGet: EmojiGetInputSchema,
	emojiVariations: EmojiVariationsInputSchema,
	categoriesList: CategoriesListInputSchema,
	categoriesGetById: CategoriesGetByIdInputSchema,
	categoriesGifs: CategoriesGifsInputSchema,
	tagsAutocomplete: TagsAutocompleteInputSchema,
	tagsTrending: TagsTrendingInputSchema,
	tagsRelated: TagsRelatedInputSchema,
	channelsSearch: ChannelsSearchInputSchema,
	randomIdGet: RandomIdGetInputSchema,
	analyticsRegister: AnalyticsRegisterInputSchema,
} as const;

export const GiphyEndpointOutputSchemas = {
	gifsSearch: GiphyListResponseSchema,
	gifsTrending: GiphyListResponseSchema,
	gifsTranslate: GiphySingleResponseSchema,
	gifsRandom: GiphySingleResponseSchema,
	gifsGetById: GiphySingleResponseSchema,
	gifsGetByIds: GiphyListResponseSchema,
	gifsUpload: GiphyUploadResponseSchema,
	stickersSearch: GiphyListResponseSchema,
	stickersTrending: GiphyListResponseSchema,
	stickersTranslate: GiphySingleResponseSchema,
	stickersRandom: GiphySingleResponseSchema,
	emojiGet: GiphyListResponseSchema,
	emojiVariations: GiphyListResponseSchema,
	categoriesList: GiphyCategoriesResponseSchema,
	categoriesGetById: GiphyCategoriesResponseSchema,
	categoriesGifs: GiphyListResponseSchema,
	tagsAutocomplete: GiphyTermsResponseSchema,
	tagsTrending: GiphyTrendingSearchesResponseSchema,
	tagsRelated: GiphyTermsResponseSchema,
	channelsSearch: GiphyChannelsResponseSchema,
	randomIdGet: GiphyRandomIdResponseSchema,
	analyticsRegister: GiphyAnalyticsRegisterResponseSchema,
} as const;
