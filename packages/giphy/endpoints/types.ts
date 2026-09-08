import { z } from 'zod';

// Shared Models
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

// Endpoint Input Schemas
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
	rating: z
		.enum(['g', 'pg', 'pg-13', 'r'])
		.optional()
		.describe('Filters results by specified rating'),
	lang: z
		.string()
		.optional()
		.describe('Specify default language for regional content'),
	random_id: z.string().optional().describe('An ID/token for a unique user'),
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
	rating: z
		.enum(['g', 'pg', 'pg-13', 'r'])
		.optional()
		.describe('Filters results by specified rating'),
	random_id: z.string().optional().describe('An ID/token for a unique user'),
	bundle: z.string().optional().describe('Returns upload or clips data'),
});

export const GifsTranslateInputSchema = z.object({
	s: z.string().describe('Search term to translate into a GIF'),
	weirdness: z
		.number()
		.min(0)
		.max(10)
		.optional()
		.describe('Value from 0-10 on the weirdness scale'),
});

export const GifsRandomInputSchema = z.object({
	tag: z.string().optional().describe('Filters results by specified tag'),
	rating: z
		.enum(['g', 'pg', 'pg-13', 'r'])
		.optional()
		.describe('Filters results by specified rating'),
	random_id: z.string().optional().describe('An ID/token for a unique user'),
});

export const GifsGetByIdInputSchema = z.object({
	gif_id: z.string().describe('GIPHY GIF ID'),
});

export const GifsGetByIdsInputSchema = z.object({
	ids: z
		.union([z.array(z.string()), z.string()])
		.describe('Array of GIF IDs or comma-separated string'),
});

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
	rating: z
		.enum(['g', 'pg', 'pg-13', 'r'])
		.optional()
		.describe('Filters results by specified rating'),
	lang: z
		.string()
		.optional()
		.describe('Specify default language for regional content'),
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
	rating: z
		.enum(['g', 'pg', 'pg-13', 'r'])
		.optional()
		.describe('Filters results by specified rating'),
});

export const StickersTranslateInputSchema = z.object({
	s: z.string().describe('Search term to translate into a sticker'),
	weirdness: z
		.number()
		.min(0)
		.max(10)
		.optional()
		.describe('Value from 0-10 on the weirdness scale'),
});

export const StickersRandomInputSchema = z.object({
	tag: z.string().optional().describe('Filters results by specified tag'),
	rating: z
		.enum(['g', 'pg', 'pg-13', 'r'])
		.optional()
		.describe('Filters results by specified rating'),
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
});

export const EmojiVariationsInputSchema = z.object({
	gif_id: z.string().describe('GIPHY Emoji GIF ID to get variations for'),
});

export const CategoriesListInputSchema = z.object({}).optional();

// Inferred Types
export type GiphyImageRendition = z.infer<typeof GiphyImageRenditionSchema>;
export type GiphyUser = z.infer<typeof GiphyUserSchema>;
export type GiphyGif = z.infer<typeof GiphyGifSchema>;
export type GiphyListResponse = z.infer<typeof GiphyListResponseSchema>;
export type GiphySingleResponse = z.infer<typeof GiphySingleResponseSchema>;
export type GiphyCategoriesResponse = z.infer<
	typeof GiphyCategoriesResponseSchema
>;

export type GifsSearchInput = z.infer<typeof GifsSearchInputSchema>;
export type GifsTrendingInput = z.infer<typeof GifsTrendingInputSchema>;
export type GifsTranslateInput = z.infer<typeof GifsTranslateInputSchema>;
export type GifsRandomInput = z.infer<typeof GifsRandomInputSchema>;
export type GifsGetByIdInput = z.infer<typeof GifsGetByIdInputSchema>;
export type GifsGetByIdsInput = z.infer<typeof GifsGetByIdsInputSchema>;

export type StickersSearchInput = z.infer<typeof StickersSearchInputSchema>;
export type StickersTrendingInput = z.infer<typeof StickersTrendingInputSchema>;
export type StickersTranslateInput = z.infer<
	typeof StickersTranslateInputSchema
>;
export type StickersRandomInput = z.infer<typeof StickersRandomInputSchema>;

export type EmojiGetInput = z.infer<typeof EmojiGetInputSchema>;
export type EmojiVariationsInput = z.infer<typeof EmojiVariationsInputSchema>;

export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;

// Endpoint Input/Output Mappings
export type GiphyEndpointInputs = {
	gifsSearch: GifsSearchInput;
	gifsTrending: GifsTrendingInput;
	gifsTranslate: GifsTranslateInput;
	gifsRandom: GifsRandomInput;
	gifsGetById: GifsGetByIdInput;
	gifsGetByIds: GifsGetByIdsInput;
	stickersSearch: StickersSearchInput;
	stickersTrending: StickersTrendingInput;
	stickersTranslate: StickersTranslateInput;
	stickersRandom: StickersRandomInput;
	emojiGet: EmojiGetInput;
	emojiVariations: EmojiVariationsInput;
	categoriesList: CategoriesListInput;
};

export type GiphyEndpointOutputs = {
	gifsSearch: GiphyListResponse;
	gifsTrending: GiphyListResponse;
	gifsTranslate: GiphySingleResponse;
	gifsRandom: GiphySingleResponse;
	gifsGetById: GiphySingleResponse;
	gifsGetByIds: GiphyListResponse;
	stickersSearch: GiphyListResponse;
	stickersTrending: GiphyListResponse;
	stickersTranslate: GiphySingleResponse;
	stickersRandom: GiphySingleResponse;
	emojiGet: GiphyListResponse;
	emojiVariations: GiphyListResponse;
	categoriesList: GiphyCategoriesResponse;
};

export const GiphyEndpointInputSchemas = {
	gifsSearch: GifsSearchInputSchema,
	gifsTrending: GifsTrendingInputSchema,
	gifsTranslate: GifsTranslateInputSchema,
	gifsRandom: GifsRandomInputSchema,
	gifsGetById: GifsGetByIdInputSchema,
	gifsGetByIds: GifsGetByIdsInputSchema,
	stickersSearch: StickersSearchInputSchema,
	stickersTrending: StickersTrendingInputSchema,
	stickersTranslate: StickersTranslateInputSchema,
	stickersRandom: StickersRandomInputSchema,
	emojiGet: EmojiGetInputSchema,
	emojiVariations: EmojiVariationsInputSchema,
	categoriesList: CategoriesListInputSchema,
} as const;

export const GiphyEndpointOutputSchemas = {
	gifsSearch: GiphyListResponseSchema,
	gifsTrending: GiphyListResponseSchema,
	gifsTranslate: GiphySingleResponseSchema,
	gifsRandom: GiphySingleResponseSchema,
	gifsGetById: GiphySingleResponseSchema,
	gifsGetByIds: GiphyListResponseSchema,
	stickersSearch: GiphyListResponseSchema,
	stickersTrending: GiphyListResponseSchema,
	stickersTranslate: GiphySingleResponseSchema,
	stickersRandom: GiphySingleResponseSchema,
	emojiGet: GiphyListResponseSchema,
	emojiVariations: GiphyListResponseSchema,
	categoriesList: GiphyCategoriesResponseSchema,
} as const;
