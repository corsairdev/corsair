import { z } from 'zod';

// The Google Photos Library API is read through paging tokens and written
// through album and media item operations. Outputs are `.loose()` because
// Google adds fields to these resources, and every optional field is
// `.nullish()`: unset fields are omitted from the response.
//
// Sources: the discovery document at
// https://photoslibrary.googleapis.com/$discovery/rest?version=v1 for every
// method, its parameters and its response message;
// https://developers.google.com/photos/library/guides/upload-media for the
// upload headers, the 50-item batch limit and the 30 second 429 delay;
// https://developers.google.com/photos/library/guides/apply-filters for the
// filter shape and the orderBy values; and
// https://developers.google.com/photos/support/updates for the April 2025 scope
// change, which is why there is no shared-album operation in this plugin.

// ── shared ──────────────────────────────────────────────────────────────────

const albumId = z
	.string()
	.min(1)
	.describe('An album id from albums.create or albums.list');

const mediaItemId = z
	.string()
	.min(1)
	.describe('A media item id from a search or a batchCreate result');

/** albums.list defaults to 20 and caps at 50. */
const albumPageSize = z
	.number()
	.int()
	.min(1)
	.max(50)
	.nullish()
	.describe('1 to 50. The API default is 20');

/** mediaItems.list defaults to 25 and caps at 100. */
const mediaItemPageSize = z
	.number()
	.int()
	.min(1)
	.max(100)
	.nullish()
	.describe('1 to 100. The API default is 25');

const pageToken = z
	.string()
	.nullish()
	.describe('nextPageToken from a previous page of the same call');

/** A google.type.Date: every part is optional, and an absent part is a wildcard. */
const GoogleDateSchema = z
	.object({
		year: z.number().int().nullish(),
		month: z.number().int().min(1).max(12).nullish(),
		day: z.number().int().min(1).max(31).nullish(),
	})
	.strict();

// ── resources ───────────────────────────────────────────────────────────────

const ContributorInfoSchema = z
	.object({
		profilePictureBaseUrl: z.string().nullish(),
		displayName: z.string().nullish(),
	})
	.loose();

const PhotoMetadataSchema = z
	.object({
		cameraMake: z.string().nullish(),
		cameraModel: z.string().nullish(),
		focalLength: z.number().nullish(),
		apertureFNumber: z.number().nullish(),
		isoEquivalent: z.number().nullish(),
		exposureTime: z.string().nullish(),
	})
	.loose();

const VideoStatusValues = [
	'UNSPECIFIED',
	'PROCESSING',
	'READY',
	'FAILED',
] as const;

const VideoMetadataSchema = z
	.object({
		cameraMake: z.string().nullish(),
		cameraModel: z.string().nullish(),
		fps: z.number().nullish(),
		status: z
			.enum(VideoStatusValues)
			.nullish()
			.describe(
				'A new upload is PROCESSING first and READY once Google has finished with it',
			),
	})
	.loose();

const MediaMetadataSchema = z
	.object({
		creationTime: z
			.string()
			.nullish()
			.describe(
				'RFC 3339. When the item was created, not when it was uploaded',
			),
		width: z.string().nullish().describe('int64 as a string'),
		height: z.string().nullish().describe('int64 as a string'),
		photo: PhotoMetadataSchema.nullish(),
		video: VideoMetadataSchema.nullish(),
	})
	.loose();

/** The MediaItem resource, as every read and create returns it. */
const MediaItemSchema = z
	.object({
		id: z.string().describe('A persistent id, stable between sessions'),
		filename: z.string().nullish(),
		mimeType: z.string().nullish().describe('e.g. `image/jpeg`'),
		description: z.string().nullish(),
		productUrl: z
			.string()
			.nullish()
			.describe('A Google Photos link the user can open when signed in'),
		baseUrl: z
			.string()
			.nullish()
			.describe(
				'A prefix for the bytes. A size parameter must be appended before it can be fetched; see the media.bytes helper',
			),
		mediaMetadata: MediaMetadataSchema.nullish(),
		contributorInfo: ContributorInfoSchema.nullish(),
	})
	.loose();

const SharedAlbumOptionsSchema = z
	.object({
		isCollaborative: z.boolean().nullish(),
		isCommentable: z.boolean().nullish(),
	})
	.loose();

/**
 * Shared-album info. The API can no longer share, unshare, join or list shared
 * albums after the April 2025 change, but an album the app created earlier can
 * still carry this field, so it is read rather than dropped.
 */
const ShareInfoSchema = z
	.object({
		sharedAlbumOptions: SharedAlbumOptionsSchema.nullish(),
		shareableUrl: z.string().nullish(),
		shareToken: z.string().nullish(),
		isOwned: z.boolean().nullish(),
		isJoinable: z.boolean().nullish(),
		isJoined: z.boolean().nullish(),
	})
	.loose();

/** The Album resource. */
const AlbumSchema = z
	.object({
		id: z.string().describe('A persistent album id'),
		title: z.string().nullish().describe('At most 500 characters'),
		productUrl: z.string().nullish(),
		isWriteable: z
			.boolean()
			.nullish()
			.describe('True when the granted scopes allow adding items'),
		mediaItemsCount: z
			.string()
			.nullish()
			.describe('int64 as a string, not a number'),
		coverPhotoBaseUrl: z
			.string()
			.nullish()
			.describe('A prefix that needs a size parameter, like a media baseUrl'),
		coverPhotoMediaItemId: z.string().nullish(),
		shareInfo: ShareInfoSchema.nullish(),
	})
	.loose();

/**
 * The per-item status. Google omits `code` on success, so a success entry is
 * `{ message: 'Success' }` with no code at all rather than a zero.
 */
const StatusSchema = z
	.object({
		code: z
			.number()
			.nullish()
			.describe('Absent on success; any set value is the failure code'),
		message: z.string().nullish(),
		details: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

/** A per-item status counts as failed only when it names a non-zero code. */
export function isFailureStatus(
	status: { code?: number | null } | null | undefined,
): boolean {
	return typeof status?.code === 'number' && status.code !== 0;
}

// ── albums ──────────────────────────────────────────────────────────────────

const AlbumsListInputSchema = z
	.object({
		pageSize: albumPageSize,
		pageToken,
		excludeNonAppCreatedData: z
			.boolean()
			.nullish()
			.describe(
				"Leave out albums the app did not create. Reads of the user's whole library need a scope Google removed in April 2025, so this is effectively the only data a current scope can see",
			),
	})
	.strict();

const AlbumsGetInputSchema = z.object({ albumId }).strict();

const AlbumsCreateInputSchema = z
	.object({
		title: z
			.string()
			.min(1)
			.describe(
				'The album name, at most 500 characters. The only writable field',
			),
	})
	.strict();

/**
 * albums.patch updates `title` or `cover_photo_media_item_id`. Google documents
 * the cover photo id as accepted, but the album resource marks the cover as
 * output only, so this plugin exposes only the title, which is documented as
 * writable in both places.
 */
const AlbumsUpdateInputSchema = z
	.object({
		albumId,
		title: z.string().min(1),
	})
	.strict();

const AlbumsListOutputSchema = z.object({
	albums: z
		.array(AlbumSchema)
		.nullish()
		.describe('Absent when the account has no albums'),
	nextPageToken: z.string().nullish(),
});

// ── media items ─────────────────────────────────────────────────────────────

/** Max content categories the docs allow per filter. */
const CONTENT_CATEGORIES = [
	'NONE',
	'LANDSCAPES',
	'RECEIPTS',
	'CITYSCAPES',
	'LANDMARKS',
	'SELFIES',
	'PEOPLE',
	'PETS',
	'WEDDINGS',
	'BIRTHDAYS',
	'DOCUMENTS',
	'TRAVEL',
	'ANIMALS',
	'FOOD',
	'SPORT',
	'NIGHT',
	'PERFORMANCES',
	'WHITEBOARDS',
	'SCREENSHOTS',
	'UTILITY',
	'ARTS',
	'CRAFTS',
	'FASHION',
	'HOUSES',
	'GARDENS',
	'FLOWERS',
	'HOLIDAYS',
] as const;

const ContentCategorySchema = z.enum(CONTENT_CATEGORIES);

const MediaTypeSchema = z.enum(['ALL_MEDIA', 'VIDEO', 'PHOTO']);

/**
 * Only `.optional()` and never `.default()` here, so an unset filter is absent
 * from the request rather than sent as a null the API would have to interpret.
 */
const SearchFiltersSchema = z
	.object({
		dateFilter: z
			.object({
				dates: z
					.array(GoogleDateSchema)
					.max(5)
					.optional()
					.describe('At most 5 dates'),
				ranges: z
					.array(
						z.object({
							startDate: GoogleDateSchema.optional(),
							endDate: GoogleDateSchema.optional(),
						}),
					)
					.max(5)
					.optional()
					.describe('At most 5 ranges, both ends in the same format'),
			})
			.optional(),
		contentFilter: z
			.object({
				includedContentCategories: z
					.array(ContentCategorySchema)
					.max(10)
					.optional(),
				excludedContentCategories: z
					.array(ContentCategorySchema)
					.max(10)
					.optional(),
			})
			.optional(),
		mediaTypeFilter: z
			.object({
				mediaTypes: z
					.array(MediaTypeSchema)
					.max(1)
					.optional()
					.describe('Only one media type; more than one is rejected'),
			})
			.optional(),
		featureFilter: z
			.object({
				includedFeatures: z.array(z.enum(['NONE', 'FAVORITES'])).optional(),
			})
			.optional(),
		includeArchivedMedia: z.boolean().optional(),
		excludeNonAppCreatedData: z.boolean().optional(),
	})
	.strict();

const MediaItemsSearchInputSchema = z
	.object({
		albumId: z
			.string()
			.nullish()
			.describe('Search inside one album. Cannot be combined with filters'),
		filters: SearchFiltersSchema.nullish(),
		orderBy: z
			.enum(['MediaMetadata.creation_time desc', 'MediaMetadata.creation_time'])
			.nullish()
			.describe(
				'Only usable with a date filter. `desc` is newest first, which is also the default',
			),
		pageSize: mediaItemPageSize,
		pageToken,
	})
	.strict()
	.superRefine((value, ctx) => {
		// The docs are explicit that a filter with an album id answers a 400.
		if (value.albumId && value.filters) {
			ctx.addIssue({
				code: 'custom',
				path: ['filters'],
				message: 'filters cannot be combined with albumId; the API answers 400',
			});
		}
		if (value.orderBy && !value.filters?.dateFilter) {
			ctx.addIssue({
				code: 'custom',
				path: ['orderBy'],
				message: 'orderBy only works with a date filter',
			});
		}
	});

const MediaItemsListInputSchema = z
	.object({
		pageSize: mediaItemPageSize,
		pageToken,
	})
	.strict();

const MediaItemsGetInputSchema = z.object({ mediaItemId }).strict();

const MediaItemsBatchGetInputSchema = z
	.object({
		mediaItemIds: z
			.array(z.string().min(1))
			.min(1)
			.describe('The ids to read in one call'),
	})
	.strict();

const MediaItemsUpdateInputSchema = z
	.object({
		mediaItemId,
		description: z
			.string()
			.describe(
				'The new description. The only field the API lets an update change',
			),
	})
	.strict();

/**
 * The bytes are uploaded separately, which returns a token; batchCreate turns
 * tokens into media items. 50 per call is the documented maximum.
 */
const NewMediaItemSchema = z
	.object({
		fileName: z
			.string()
			.min(1)
			.describe(
				'The file name shown in Google Photos, including its extension, e.g. `beach.jpg`',
			),
		contentType: z
			.string()
			.min(1)
			.describe(
				'The MIME type of the bytes: `image/jpeg`, `image/png`, `video/mp4` and so on. Uploading needs it in `X-Goog-Upload-Content-Type`',
			),
		bytes: z
			.string()
			.min(1)
			.describe(
				'The file bytes, base64-encoded. The endpoint decodes them and uploads the raw bytes',
			),
		description: z.string().nullish(),
	})
	.strict();

/** The position an item is inserted at, inside an album. */
const AlbumPositionSchema = z
	.object({
		position: z
			.enum([
				'POSITION_TYPE_UNSPECIFIED',
				'FIRST_IN_ALBUM',
				'LAST_IN_ALBUM',
				'AFTER_MEDIA_ITEM',
				'AFTER_ENRICHMENT_ITEM',
			])
			.describe('Where in the album the item goes'),
		relativeMediaItemId: z
			.string()
			.nullish()
			.describe('Required when position is AFTER_MEDIA_ITEM'),
		relativeEnrichmentItemId: z
			.string()
			.nullish()
			.describe('Required when position is AFTER_ENRICHMENT_ITEM'),
	})
	.strict()
	.superRefine((value, ctx) => {
		if (value.position === 'AFTER_MEDIA_ITEM' && !value.relativeMediaItemId) {
			ctx.addIssue({
				code: 'custom',
				path: ['relativeMediaItemId'],
				message: 'AFTER_MEDIA_ITEM needs relativeMediaItemId',
			});
		}
		if (
			value.position === 'AFTER_ENRICHMENT_ITEM' &&
			!value.relativeEnrichmentItemId
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['relativeEnrichmentItemId'],
				message: 'AFTER_ENRICHMENT_ITEM needs relativeEnrichmentItemId',
			});
		}
	});

const MediaItemsCreateInputSchema = z
	.object({
		newMediaItems: z
			.array(NewMediaItemSchema)
			.min(1)
			.max(50)
			.describe('1 to 50 items per call; the API refuses more'),
		albumId: z
			.string()
			.nullish()
			.describe('Also add the items to this album, which must be app-created'),
		albumPosition: AlbumPositionSchema.nullish(),
	})
	.strict();

const MediaItemsSearchOutputSchema = z.object({
	mediaItems: z
		.array(MediaItemSchema)
		.nullish()
		.describe('Absent when nothing matched'),
	nextPageToken: z
		.string()
		.nullish()
		.describe('Its presence is the only reliable sign that more pages exist'),
});

const MediaItemsListOutputSchema = z.object({
	mediaItems: z.array(MediaItemSchema).nullish(),
	nextPageToken: z.string().nullish(),
});

const NewMediaItemResultSchema = z
	.object({
		uploadToken: z.string().nullish(),
		status: StatusSchema.nullish().describe(
			'A non-zero code means this one item failed',
		),
		mediaItem: MediaItemSchema.nullish(),
	})
	.loose();

const MediaItemsCreateOutputSchema = z.object({
	newMediaItemResults: z
		.array(NewMediaItemResultSchema)
		.describe(
			'One entry per submitted item, in the order they were sent, each with its own status',
		),
});

const MediaItemResultSchema = z
	.object({
		status: StatusSchema.nullish(),
		mediaItem: MediaItemSchema.nullish(),
	})
	.loose();

const MediaItemsBatchGetOutputSchema = z.object({
	mediaItemResults: z
		.array(MediaItemResultSchema)
		.describe(
			'One entry per requested id. An entry can carry a status error instead of an item',
		),
});

// ── album membership ────────────────────────────────────────────────────────

const AlbumMediaItemsInputSchema = z
	.object({
		albumId,
		mediaItemIds: z
			.array(z.string().min(1))
			.min(1)
			.max(50)
			.describe('1 to 50 ids per call'),
	})
	.strict();

const AlbumMediaItemsOutputSchema = z.object({}).loose();

const TextEnrichmentSchema = z
	.object({
		text: z.string().min(1).describe('The text shown in the album'),
	})
	.strict();

const LocationSchema = z
	.object({
		locationName: z.string().nullish(),
		latlng: z
			.object({
				latitude: z.number().min(-90).max(90),
				longitude: z.number().min(-180).max(180),
			})
			.strict()
			.nullish(),
	})
	.strict();

/** albums.addEnrichment adds one text or location note to an app-created album. */
const AlbumsAddEnrichmentInputSchema = z
	.object({
		albumId,
		text: z.string().min(1).nullish().describe('A text note to add'),
		location: LocationSchema.nullish(),
		position: AlbumPositionSchema.optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		const set = [value.text, value.location].filter(
			(part) => part !== undefined && part !== null,
		);
		if (set.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['text'],
				message: 'Send exactly one of text or location',
			});
		}
	});

const AlbumsAddEnrichmentOutputSchema = z
	.object({
		enrichmentItem: z
			.object({ id: z.string().nullish() })
			.loose()
			.nullish()
			.describe('The new enrichment, named by its id'),
	})
	.loose();

// ── exports ────────────────────────────────────────────────────────────────

export type GooglePhotosEndpointInputs = {
	albumsList: z.input<typeof AlbumsListInputSchema>;
	albumsGet: z.input<typeof AlbumsGetInputSchema>;
	albumsCreate: z.input<typeof AlbumsCreateInputSchema>;
	albumsUpdate: z.input<typeof AlbumsUpdateInputSchema>;
	albumsAddEnrichment: z.input<typeof AlbumsAddEnrichmentInputSchema>;
	albumsBatchAddMediaItems: z.input<typeof AlbumMediaItemsInputSchema>;
	albumsBatchRemoveMediaItems: z.input<typeof AlbumMediaItemsInputSchema>;
	mediaItemsSearch: z.input<typeof MediaItemsSearchInputSchema>;
	mediaItemsList: z.input<typeof MediaItemsListInputSchema>;
	mediaItemsGet: z.input<typeof MediaItemsGetInputSchema>;
	mediaItemsBatchGet: z.input<typeof MediaItemsBatchGetInputSchema>;
	mediaItemsUpdate: z.input<typeof MediaItemsUpdateInputSchema>;
	mediaItemsCreate: z.input<typeof MediaItemsCreateInputSchema>;
};

export type GooglePhotosEndpointOutputs = {
	albumsList: z.output<typeof AlbumsListOutputSchema>;
	albumsGet: z.output<typeof AlbumSchema>;
	albumsCreate: z.output<typeof AlbumSchema>;
	albumsUpdate: z.output<typeof AlbumSchema>;
	albumsAddEnrichment: z.output<typeof AlbumsAddEnrichmentOutputSchema>;
	albumsBatchAddMediaItems: z.output<typeof AlbumMediaItemsOutputSchema>;
	albumsBatchRemoveMediaItems: z.output<typeof AlbumMediaItemsOutputSchema>;
	mediaItemsSearch: z.output<typeof MediaItemsSearchOutputSchema>;
	mediaItemsList: z.output<typeof MediaItemsListOutputSchema>;
	mediaItemsGet: z.output<typeof MediaItemSchema>;
	mediaItemsBatchGet: z.output<typeof MediaItemsBatchGetOutputSchema>;
	mediaItemsUpdate: z.output<typeof MediaItemSchema>;
	mediaItemsCreate: z.output<typeof MediaItemsCreateOutputSchema>;
};

export const GooglePhotosEndpointInputSchemas = {
	albumsList: AlbumsListInputSchema,
	albumsGet: AlbumsGetInputSchema,
	albumsCreate: AlbumsCreateInputSchema,
	albumsUpdate: AlbumsUpdateInputSchema,
	albumsAddEnrichment: AlbumsAddEnrichmentInputSchema,
	albumsBatchAddMediaItems: AlbumMediaItemsInputSchema,
	albumsBatchRemoveMediaItems: AlbumMediaItemsInputSchema,
	mediaItemsSearch: MediaItemsSearchInputSchema,
	mediaItemsList: MediaItemsListInputSchema,
	mediaItemsGet: MediaItemsGetInputSchema,
	mediaItemsBatchGet: MediaItemsBatchGetInputSchema,
	mediaItemsUpdate: MediaItemsUpdateInputSchema,
	mediaItemsCreate: MediaItemsCreateInputSchema,
} as const;

export const GooglePhotosEndpointOutputSchemas = {
	albumsList: AlbumsListOutputSchema,
	albumsGet: AlbumSchema,
	albumsCreate: AlbumSchema,
	albumsUpdate: AlbumSchema,
	albumsAddEnrichment: AlbumsAddEnrichmentOutputSchema,
	albumsBatchAddMediaItems: AlbumMediaItemsOutputSchema,
	albumsBatchRemoveMediaItems: AlbumMediaItemsOutputSchema,
	mediaItemsSearch: MediaItemsSearchOutputSchema,
	mediaItemsList: MediaItemsListOutputSchema,
	mediaItemsGet: MediaItemSchema,
	mediaItemsBatchGet: MediaItemsBatchGetOutputSchema,
	mediaItemsUpdate: MediaItemSchema,
	mediaItemsCreate: MediaItemsCreateOutputSchema,
} as const;

export {
	AlbumSchema,
	MediaItemSchema,
	AlbumPositionSchema,
	SearchFiltersSchema,
	CONTENT_CATEGORIES,
};
