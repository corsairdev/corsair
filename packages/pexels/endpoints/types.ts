import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** A photographer attribution. */
export const PhotographerSchema = z
	.object({
		id: z.number().nullish().describe('Photographer id'),
		name: z.string().nullish().describe('Photographer name'),
		url: z.string().nullish().describe('Photographer profile URL'),
	})
	.loose();

/** The published asset sizes a photo carries. */
export const PhotoSourcesSchema = z
	.object({
		original: z.string().nullish().describe('Original file URL'),
		large2x: z.string().nullish().describe('Large 2x rendition URL'),
		large: z.string().nullish().describe('Large rendition URL'),
		medium: z.string().nullish().describe('Medium rendition URL'),
		small: z.string().nullish().describe('Small rendition URL'),
		landscape: z.string().nullish().describe('Landscape crop URL'),
		portrait: z.string().nullish().describe('Portrait crop URL'),
		tiny: z.string().nullish().describe('Tiny rendition URL'),
	})
	.loose()
	.describe('Rendition URLs of the photo');

/** A photo, as the Photos API returns it. */
export const PhotoSchema = z
	.object({
		id: z.number().nullish().describe('Photo id'),
		width: z.number().nullish().describe('Width in pixels'),
		height: z.number().nullish().describe('Height in pixels'),
		url: z.string().nullish().describe('Photo page URL on Pexels'),
		photographer: z.string().nullish().describe('Photographer name'),
		photographer_url: z.string().nullish().describe('Photographer profile URL'),
		photographer_id: z.number().nullish().describe('Photographer id'),
		avg_color: z.string().nullish().describe('Average colour, e.g. #374824'),
		src: PhotoSourcesSchema.nullish().describe('Rendition URLs'),
		liked: z
			.boolean()
			.nullish()
			.describe('Whether the API key has liked the photo'),
		alt: z.string().nullish().describe('Alt text'),
	})
	.loose()
	.describe('A Pexels photo');
export type Photo = z.infer<typeof PhotoSchema>;

/** The published renditions a video carries. */
export const VideoFileSchema = z
	.object({
		id: z.number().nullish().describe('File id'),
		quality: z.string().nullish().describe('File quality, e.g. hd, sd'),
		file_type: z.string().nullish().describe('File type, e.g. video/mp4'),
		width: z.number().nullish().describe('Width in pixels'),
		height: z.number().nullish().describe('Height in pixels'),
		link: z.string().nullish().describe('File download URL'),
	})
	.loose()
	.describe('A downloadable video rendition');

/** A video, as the Videos API returns it. */
export const VideoSchema = z
	.object({
		id: z.number().nullish().describe('Video id'),
		width: z.number().nullish().describe('Width in pixels'),
		height: z.number().nullish().describe('Height in pixels'),
		url: z.string().nullish().describe('Video page URL on Pexels'),
		image: z.string().nullish().describe('Poster image URL'),
		duration: z.number().nullish().describe('Duration in seconds'),
		full_res: z
			.unknown()
			.nullish()
			.describe('Full-resolution info, when Pexels has it'),
		tags: z.array(z.string()).nullish().describe('Tags'),
		avg_color: z.string().nullish().describe('Average colour'),
		video_pictures: z
			.array(
				z
					.object({
						id: z.number().nullish().describe('Picture id'),
						nr: z.number().nullish().describe('Position in the video'),
						picture: z.string().nullish().describe('Preview image URL'),
					})
					.loose(),
			)
			.nullish()
			.describe('Preview pictures'),
		user: PhotographerSchema.nullish().describe('Video creator'),
		video_files: z
			.array(VideoFileSchema)
			.nullish()
			.describe('Downloadable renditions'),
	})
	.loose()
	.describe('A Pexels video');
export type Video = z.infer<typeof VideoSchema>;

/** A media collection. */
export const CollectionSchema = z
	.object({
		id: z.string().min(1).describe('Collection id'),
		title: z.string().nullish().describe('Collection title'),
		description: z.string().nullish().describe('Collection description'),
		private: z
			.boolean()
			.nullish()
			.describe('Whether the collection is private'),
		media_count: z.number().nullish().describe('Media items in the collection'),
		photos_count: z.number().nullish().describe('Photos in the collection'),
		videos_count: z.number().nullish().describe('Videos in the collection'),
	})
	.loose()
	.describe('A Pexels media collection');
export type Collection = z.infer<typeof CollectionSchema>;

/**
 * A collection media item: a photo or a video object with a `type` of
 * "Photo" or "Video" beside its own fields.
 */
export const CollectionMediaSchema = z
	.object({
		...PhotoSchema.shape,
		...VideoSchema.shape,
		type: z
			.string()
			.nullish()
			.describe('Photo or Video; the other fields follow that object'),
	})
	.loose()
	.describe('A photo or video in a collection');
export type CollectionMedia = z.infer<typeof CollectionMediaSchema>;

/** The page block every list answer carries. */
export const ListMetaSchema = z
	.object({
		page: z.number().describe('Page returned'),
		per_page: z.number().describe('Results per page'),
		total_results: z.number().describe('Total matching records'),
		next_page: z
			.string()
			.nullish()
			.describe('URL of the next page, when one exists'),
		prev_page: z
			.string()
			.nullish()
			.describe('URL of the previous page, when one exists'),
	})
	.loose()
	.describe('Pagination metadata');

/** The paging parameters every list endpoint takes. */
const pagingParams = {
	page: z.number().int().min(1).optional().describe('Page number'),
	per_page: z
		.number()
		.int()
		.min(1)
		.max(80)
		.optional()
		.describe('Results per page, at most 80'),
};

// ── photos ─────────────────────────────────────────────────────────────────

export const SearchPhotosInputSchema = z
	.object({
		query: z.string().min(1).describe('Search query'),
		orientation: z
			.enum(['landscape', 'portrait', 'square'])
			.optional()
			.describe('Aspect orientation filter'),
		size: z
			.enum(['large', 'medium', 'small'])
			.optional()
			.describe('Minimum size filter'),
		color: z
			.string()
			.optional()
			.describe('Dominant color filter: a color name or a hex value'),
		locale: z
			.string()
			.min(2)
			.optional()
			.describe('Search locale, e.g. en-US, de-DE, ja-JP'),
		...pagingParams,
	})
	.describe('Search photos by query');
export type SearchPhotosInput = z.infer<typeof SearchPhotosInputSchema>;

export const SearchPhotosOutputSchema = z
	.object({
		photos: z.array(PhotoSchema).describe('Photos on this page'),
		page: z.number().nullish().describe('Page returned'),
		per_page: z.number().nullish().describe('Results per page'),
		total_results: z.number().nullish().describe('Total matching photos'),
		next_page: z.string().nullish().describe('URL of the next page'),
		prev_page: z.string().nullish().describe('URL of the previous page'),
	})
	.loose()
	.describe('A page of photo search results');
export type SearchPhotosOutput = z.infer<typeof SearchPhotosOutputSchema>;

export const GetPhotoInputSchema = z
	.object({ photoId: z.number().int().describe('Photo id') })
	.describe('Input for reading one photo');
export type GetPhotoInput = z.infer<typeof GetPhotoInputSchema>;

export const GetPhotoOutputSchema = PhotoSchema.describe('The photo');
export type GetPhotoOutput = z.infer<typeof GetPhotoOutputSchema>;

export const ListCuratedInputSchema = z
	.object({ ...pagingParams })
	.describe('Query parameters for listing curated photos');
export type ListCuratedInput = z.infer<typeof ListCuratedInputSchema>;

export const ListCuratedOutputSchema = z
	.object({
		photos: z.array(PhotoSchema).describe('Curated photos on this page'),
		page: z.number().nullish().describe('Page returned'),
		per_page: z.number().nullish().describe('Results per page'),
		total_results: z.number().nullish().describe('Total curated photos'),
		next_page: z.string().nullish().describe('URL of the next page'),
		prev_page: z.string().nullish().describe('URL of the previous page'),
	})
	.loose()
	.describe('A page of curated photos');
export type ListCuratedOutput = z.infer<typeof ListCuratedOutputSchema>;

// ── videos ─────────────────────────────────────────────────────────────────

export const SearchVideosInputSchema = z
	.object({
		query: z.string().min(1).describe('Search query'),
		orientation: z
			.enum(['landscape', 'portrait', 'square'])
			.optional()
			.describe('Aspect orientation filter'),
		size: z
			.enum(['large', 'medium', 'small'])
			.optional()
			.describe('Minimum size: large 4K, medium full HD, small HD'),
		locale: z
			.string()
			.min(2)
			.optional()
			.describe('Search locale, e.g. en-US, de-DE, ja-JP'),
		...pagingParams,
	})
	.describe('Search videos by query');
export type SearchVideosInput = z.infer<typeof SearchVideosInputSchema>;

export const SearchVideosOutputSchema = z
	.object({
		videos: z.array(VideoSchema).describe('Videos on this page'),
		page: z.number().nullish().describe('Page returned'),
		per_page: z.number().nullish().describe('Results per page'),
		total_results: z.number().nullish().describe('Total matching videos'),
		next_page: z.string().nullish().describe('URL of the next page'),
		prev_page: z.string().nullish().describe('URL of the previous page'),
	})
	.loose()
	.describe('A page of video search results');
export type SearchVideosOutput = z.infer<typeof SearchVideosOutputSchema>;

export const GetVideoInputSchema = z
	.object({ videoId: z.number().int().describe('Video id') })
	.describe('Input for reading one video');
export type GetVideoInput = z.infer<typeof GetVideoInputSchema>;

export const GetVideoOutputSchema = VideoSchema.describe('The video');
export type GetVideoOutput = z.infer<typeof GetVideoOutputSchema>;

export const ListPopularVideosInputSchema = z
	.object({
		min_width: z.number().int().optional().describe('Minimum width in pixels'),
		min_height: z
			.number()
			.int()
			.optional()
			.describe('Minimum height in pixels'),
		min_duration: z
			.number()
			.int()
			.optional()
			.describe('Minimum duration in seconds'),
		max_duration: z
			.number()
			.int()
			.optional()
			.describe('Maximum duration in seconds'),
		...pagingParams,
	})
	.describe('Query parameters for listing popular videos');
export type ListPopularVideosInput = z.infer<
	typeof ListPopularVideosInputSchema
>;

export const ListPopularVideosOutputSchema = z
	.object({
		videos: z.array(VideoSchema).describe('Popular videos on this page'),
		page: z.number().nullish().describe('Page returned'),
		per_page: z.number().nullish().describe('Results per page'),
		total_results: z.number().nullish().describe('Total popular videos'),
		next_page: z.string().nullish().describe('URL of the next page'),
		prev_page: z.string().nullish().describe('URL of the previous page'),
	})
	.loose()
	.describe('A page of popular videos');
export type ListPopularVideosOutput = z.infer<
	typeof ListPopularVideosOutputSchema
>;

// ── collections ────────────────────────────────────────────────────────────

export const ListCollectionsInputSchema = z
	.object({ ...pagingParams })
	.describe('Query parameters for listing collections');
export type ListCollectionsInput = z.infer<typeof ListCollectionsInputSchema>;

export const ListCollectionsOutputSchema = z
	.object({
		collections: z.array(CollectionSchema).describe('Collections on this page'),
		page: z.number().nullish().describe('Page returned'),
		per_page: z.number().nullish().describe('Results per page'),
		total_results: z.number().nullish().describe('Total collections'),
		next_page: z.string().nullish().describe('URL of the next page'),
		prev_page: z.string().nullish().describe('URL of the previous page'),
	})
	.loose()
	.describe('A page of collections');
export type ListCollectionsOutput = z.infer<typeof ListCollectionsOutputSchema>;

export const ListFeaturedCollectionsInputSchema = z
	.object({ ...pagingParams })
	.describe('Query parameters for listing featured collections');
export type ListFeaturedCollectionsInput = z.infer<
	typeof ListFeaturedCollectionsInputSchema
>;

export const ListFeaturedCollectionsOutputSchema = z
	.object({
		collections: z
			.array(CollectionSchema)
			.describe('Featured collections on this page'),
		page: z.number().nullish().describe('Page returned'),
		per_page: z.number().nullish().describe('Results per page'),
		total_results: z.number().nullish().describe('Total featured collections'),
		next_page: z.string().nullish().describe('URL of the next page'),
		prev_page: z.string().nullish().describe('URL of the previous page'),
	})
	.loose()
	.describe('A page of featured collections');
export type ListFeaturedCollectionsOutput = z.infer<
	typeof ListFeaturedCollectionsOutputSchema
>;

export const ListCollectionMediaInputSchema = z
	.object({
		collectionId: z.string().min(1).describe('Collection id'),
		type: z
			.enum(['photos', 'videos'])
			.optional()
			.describe('Only photos or only videos; both when omitted'),
		sort: z
			.enum(['asc', 'desc'])
			.optional()
			.describe('Order by when the item was added'),
		...pagingParams,
	})
	.describe('Query parameters for the media of a collection');
export type ListCollectionMediaInput = z.infer<
	typeof ListCollectionMediaInputSchema
>;

export const ListCollectionMediaOutputSchema = z
	.object({
		media: z.array(CollectionMediaSchema).describe('Media items on this page'),
		page: z.number().nullish().describe('Page returned'),
		per_page: z.number().nullish().describe('Results per page'),
		total_results: z.number().nullish().describe('Total media items'),
		next_page: z.string().nullish().describe('URL of the next page'),
		prev_page: z.string().nullish().describe('URL of the previous page'),
	})
	.loose()
	.describe('A page of collection media');
export type ListCollectionMediaOutput = z.infer<
	typeof ListCollectionMediaOutputSchema
>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PexelsEndpointInputSchemas = {
	photosSearch: SearchPhotosInputSchema,
	photosGet: GetPhotoInputSchema,
	photosCurated: ListCuratedInputSchema,
	videosSearch: SearchVideosInputSchema,
	videosGet: GetVideoInputSchema,
	videosPopular: ListPopularVideosInputSchema,
	collectionsList: ListCollectionsInputSchema,
	collectionsListFeatured: ListFeaturedCollectionsInputSchema,
	collectionsListMedia: ListCollectionMediaInputSchema,
};

export const PexelsEndpointOutputSchemas = {
	photosSearch: SearchPhotosOutputSchema,
	photosGet: GetPhotoOutputSchema,
	photosCurated: ListCuratedOutputSchema,
	videosSearch: SearchVideosOutputSchema,
	videosGet: GetVideoOutputSchema,
	videosPopular: ListPopularVideosOutputSchema,
	collectionsList: ListCollectionsOutputSchema,
	collectionsListFeatured: ListFeaturedCollectionsOutputSchema,
	collectionsListMedia: ListCollectionMediaOutputSchema,
};

export type PexelsEndpointInputs = {
	[K in keyof typeof PexelsEndpointInputSchemas]: z.input<
		(typeof PexelsEndpointInputSchemas)[K]
	>;
};

export type PexelsEndpointOutputs = {
	[K in keyof typeof PexelsEndpointOutputSchemas]: z.infer<
		(typeof PexelsEndpointOutputSchemas)[K]
	>;
};
