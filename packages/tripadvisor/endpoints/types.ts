import { z } from 'zod';

const NearbySearchInputBaseSchema = z.object({
	location_id: z.string().min(1).optional(),
	lat: z.number().min(-90).max(90).optional(),
	lon: z.number().min(-180).max(180).optional(),
	radius: z.number().positive().optional(),
	unit: z.enum(['MI', 'KM']).optional(),
	sw_lat: z.number().min(-90).max(90).optional(),
	sw_lon: z.number().min(-180).max(180).optional(),
	ne_lat: z.number().min(-90).max(90).optional(),
	ne_lon: z.number().min(-180).max(180).optional(),
	category: z.enum(['RESTAURANT', 'ATTRACTION', 'HOTEL']).optional(),
	min_rating: z.number().min(1).max(5).optional(),
	locale: z.array(z.string().min(1)).min(1).optional(),
	page: z.number().int().min(1).optional(),
	size: z.number().int().min(1).max(20).optional(),
	sort: z.array(z.string().min(1)).min(1).optional(),
});

export const LocationsNearbyInputSchema =
	NearbySearchInputBaseSchema.superRefine((input, ctx) => {
		const hasLocationReference = input.location_id !== undefined;
		const hasCoordinates = input.lat !== undefined && input.lon !== undefined;
		if (!hasLocationReference && !hasCoordinates) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['lat'],
				message: 'Provide location_id or both lat and lon',
			});
		}

		const hasBoundingBox =
			input.sw_lat !== undefined &&
			input.sw_lon !== undefined &&
			input.ne_lat !== undefined &&
			input.ne_lon !== undefined;
		if (input.radius === undefined && !hasBoundingBox) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['radius'],
				message: 'Provide radius or all four bounding-box coordinates',
			});
		}
	});

export type LocationsNearbyInput = z.infer<typeof LocationsNearbyInputSchema>;

const AddressSchema = z
	.object({
		city: z.string().optional(),
		country_code: z.string().optional(),
		country_name: z.string().optional(),
		formatted: z.string().optional(),
		language: z.string().optional(),
		postal_code: z.string().optional(),
		state: z.string().optional(),
		street_address: z.string().optional(),
		street_address2: z.string().optional(),
	})
	.loose();

const CoordinatesSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const TranslationSchema = z.object({
	language: z.string(),
	value: z.string(),
});

const TranslationWithPrimarySchema = TranslationSchema.extend({
	primary: z.boolean().optional(),
});

const OverallSchema = z
	.object({
		count: z.number().int().optional(),
		icon_url: z.string().optional(),
		rating: z.number().optional(),
	})
	.loose();

const TripadvisorUrlsSchema = z
	.object({
		android_intent: z.string().optional(),
		menu: z.string().optional(),
		official: z.string().optional(),
		tripadvisor: z
			.object({
				main: z.string().optional(),
				photos: z.string().optional(),
				questions_answers: z.string().optional(),
				write_review: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const CatalogLocationSchema = z
	.object({
		addresses: z.array(AddressSchema).optional(),
		coordinates: CoordinatesSchema.optional(),
		descriptions: z.array(TranslationSchema),
		geo: z.string(),
		geo_id: z.number().int(),
		id: z.number().int(),
		names: z.array(TranslationWithPrimarySchema),
		overall_rating: OverallSchema.optional(),
		urls: TripadvisorUrlsSchema.optional(),
	})
	.loose();

const NearbyCatalogLocationSchema = z
	.object({
		bearing: z.number().optional(),
		distance_kilometers: z.number().optional(),
		distance_miles: z.number().optional(),
		location: CatalogLocationSchema,
	})
	.loose();

const PageMetadataSchema = z
	.object({
		page: z.number().int().optional(),
		size: z.number().int().optional(),
		total_elements: z.number().int().optional(),
		total_pages: z.number().int().optional(),
	})
	.loose();

export const LocationsNearbyResponseSchema = z.object({
	data: z.array(NearbyCatalogLocationSchema),
	pagination: PageMetadataSchema,
});

export type LocationsNearbyResponse = z.infer<
	typeof LocationsNearbyResponseSchema
>;

// ---------------------------------------------------------------------------
// Shared building blocks for the full Location / Photo / Review / Geo models.
// Shapes below mirror the Terra OpenAPI components for
// GET /locations/{id}, GET /locations/{id}/photos,
// GET /locations/{id}/reviews and GET /geos/{id}.
// ---------------------------------------------------------------------------

const ImageUrlSchema = z
	.object({
		key: z.string().optional(),
		url: z.string().optional(),
	})
	.loose();

const PriceSchema = z
	.object({
		currency: z.string().optional(),
		max_rate: z.number().optional(),
		min_rate: z.number().optional(),
	})
	.loose();

const AccommodationSchema = z
	.object({
		brand: z.string().optional(),
		chain: z.string().optional(),
		prices: z.array(PriceSchema).optional(),
		room_count: z.number().int().optional(),
		star_rating: z.number().int().optional(),
	})
	.loose();

const AttributeSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		type_id: z.string().optional(),
	})
	.loose();

const AwardTypeSchema = z.enum([
	'Certificate of Excellence',
	"Travelers' Choice",
]);

const AwardV1Schema = z
	.object({
		category: z.string().optional(),
		geo: z.string().optional(),
		image: ImageUrlSchema.optional(),
		name: z.string().optional(),
		type: AwardTypeSchema.optional(),
		year: z.number().int().optional(),
	})
	.loose();

const ParentCategorySchema = z
	.object({
		display_name: z.string().optional(),
		id: z.string().optional(),
		parent_category: z.object({}).loose().optional(),
	})
	.loose();

const TopLevelCategorySchema = z.enum([
	'Accommodation',
	'Experience',
	'Attraction',
	'Eat & Drink',
]);

const CategorySchema = z
	.object({
		display_name: z.string().optional(),
		hierarchy: z.string().optional(),
		id: z.string(),
		parent_category: ParentCategorySchema.optional(),
		top_level_category: TopLevelCategorySchema.optional(),
	})
	.loose();

const LocationPhotoInfoSchema = z
	.object({
		total_count: z.number().int().optional(),
	})
	.loose();

const NeighborhoodSchema = z
	.object({
		geo_id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

const PhoneNumberSchema = z.object({
	type: z.string(),
	value: z.string(),
});

const DayOfWeekSchema = z.enum([
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
]);

const PeriodSchema = z
	.object({
		closes: z.string().optional(),
		day_of_week: DayOfWeekSchema.optional(),
		opens: z.string().optional(),
	})
	.loose();

const OpeningHoursSchema = z
	.object({
		formatted: z.array(z.string()).optional(),
		periods: z.array(PeriodSchema).optional(),
		timezone: z.string().optional(),
	})
	.loose();

const ListingStatusSchema = z.enum(['OPEN', 'CLOSED', 'TEMPORARILY_CLOSED']);

const StatusSchema = z
	.object({
		closed_date: z.string().optional(),
		reopen_date: z.string().optional(),
		value: ListingStatusSchema,
	})
	.loose();

const BreakdownSchema = z
	.object({
		count: z.number().int().optional(),
		rating: z.number().int().optional(),
		rating_name: z.string().optional(),
	})
	.loose();

const LanguageCountSchema = z
	.object({
		count: z.number().int().optional(),
		language: z.string().optional(),
	})
	.loose();

const SubRatingSchema = z
	.object({
		count: z.number().int().optional(),
		icon_url: z.string().optional(),
		rating: z.number().optional(),
		type: z.string().optional(),
		type_name: z.string().optional(),
	})
	.loose();

const TravelerRatingsSchema = z
	.object({
		breakdowns: z.array(BreakdownSchema).optional(),
		language_counts: z.array(LanguageCountSchema).optional(),
		overall: OverallSchema.optional(),
		subratings: z.array(SubRatingSchema).optional(),
	})
	.loose();

const RankingV1Schema = z
	.object({
		category: z.string().optional(),
		category_id: z.string().optional(),
		display_text: z.string().optional(),
		geo: z.string().optional(),
		geo_id: z.number().int().optional(),
		rank: z.number().int().optional(),
		total: z.number().int().optional(),
	})
	.loose();

/** Full Location representation returned by GET /locations/{id}. */
const LocationDetailsSchema = z
	.object({
		accommodation: AccommodationSchema.optional(),
		addresses: z.array(AddressSchema).optional(),
		attributes: z.array(AttributeSchema).optional(),
		awards: z.array(AwardV1Schema).optional(),
		categories: z.array(CategorySchema).optional(),
		coordinates: CoordinatesSchema.optional(),
		descriptions: z.array(TranslationSchema),
		geo: z.string(),
		geo_id: z.number().int(),
		id: z.number().int(),
		names: z.array(TranslationWithPrimarySchema),
		neighborhoods: z.array(NeighborhoodSchema).optional(),
		official_email: z.string().optional(),
		opening_hours: OpeningHoursSchema.optional(),
		phone_numbers: z.array(PhoneNumberSchema).optional(),
		photos: LocationPhotoInfoSchema,
		price_level: z.string().optional(),
		rankings: z.array(RankingV1Schema).optional(),
		recommended_visit_length: z.number().int().optional(),
		status: StatusSchema,
		traveler_ratings: TravelerRatingsSchema.optional(),
		urls: TripadvisorUrlsSchema.optional(),
	})
	.loose();

export const LocationDetailsInputSchema = z.object({
	id: z.number().int().positive(),
	locale: z.array(z.string().min(1)).min(1).optional(),
});

export type LocationDetailsInput = z.infer<typeof LocationDetailsInputSchema>;

export const LocationDetailsResponseSchema = LocationDetailsSchema;

export type LocationDetailsResponse = z.infer<
	typeof LocationDetailsResponseSchema
>;

// ---------------------------------------------------------------------------
// Photos: GET /locations/{id}/photos
// ---------------------------------------------------------------------------

const CVMetadataSchema = z
	.object({
		attractiveness_score: z.number().min(0).max(1).optional(),
		scene: z.string().optional(),
	})
	.loose();

const PhotoSourceNameSchema = z.enum(['Management', 'Traveler']);

const PhotoSourceSchema = z.object({
	name: PhotoSourceNameSchema,
});

const UserInfoSchema = z
	.object({
		avatar_url: ImageUrlSchema.optional(),
		geo: z.string().optional(),
		geo_id: z.number().int().optional(),
		username: z.string().optional(),
	})
	.loose();

const PhotoInfoSchema = z
	.object({
		key: z.string().optional(),
		media_type: z.string().optional(),
		original_height: z.number().int().optional(),
		original_size_url: z.string().optional(),
		original_width: z.number().int().optional(),
	})
	.loose();

const PhotoSchema = z
	.object({
		caption: z.string().optional(),
		cv_metadata: CVMetadataSchema.optional(),
		id: z.number().int(),
		location_id: z.number().int(),
		photo: PhotoInfoSchema,
		publish_ts: z.string(),
		source: PhotoSourceSchema,
		user: UserInfoSchema.optional(),
	})
	.loose();

export const LocationPhotosInputSchema = z.object({
	id: z.number().int().positive(),
	locale: z.array(z.string().min(1)).min(1).optional(),
	// The Terra spec sets minimum 0 (not 1) for this endpoint's page index.
	page: z.number().int().min(0).optional(),
	// The Terra spec sets no maximum page size for this endpoint.
	size: z.number().int().min(1).optional(),
	sort: z.array(z.string().min(1)).min(1).optional(),
});

export type LocationPhotosInput = z.infer<typeof LocationPhotosInputSchema>;

export const LocationPhotosResponseSchema = z.object({
	data: z.array(PhotoSchema),
	pagination: PageMetadataSchema,
});

export type LocationPhotosResponse = z.infer<
	typeof LocationPhotosResponseSchema
>;

// ---------------------------------------------------------------------------
// Reviews: GET /locations/{id}/reviews
// ---------------------------------------------------------------------------

const ReviewSortBySchema = z.enum(['MOST_RECENT', 'HIGHEST_RATED']);

const TripTypeSchema = z.enum([
	'BUSINESS',
	'COUPLES',
	'FAMILY',
	'FRIENDS',
	'SOLO',
	'NONE',
]);

const ReviewSubRatingSchema = z
	.object({
		icon_url: ImageUrlSchema,
		rating: z.number().int(),
		type: z.string(),
		type_name: z.string(),
	})
	.loose();

const OwnerResponseSchema = z
	.object({
		author_connection: z.string().optional(),
		avatar_url: ImageUrlSchema.optional(),
		geo_id: z.number().int().optional(),
		id: z.number().int().optional(),
		publish_date: z.string().optional(),
		text: z.array(TranslationWithPrimarySchema).optional(),
		username: z.string().optional(),
	})
	.loose();

const ReviewSchema = z
	.object({
		id: z.number().int(),
		owner_response: OwnerResponseSchema.optional(),
		photos: z.array(PhotoInfoSchema).optional(),
		publish_ts: z.string(),
		rating: z.number().int(),
		rating_icon_url: ImageUrlSchema.optional(),
		subratings: z.array(ReviewSubRatingSchema),
		text: z.array(TranslationWithPrimarySchema),
		title: z.array(TranslationWithPrimarySchema),
		travel_date: z.string(),
		trip_type: TripTypeSchema,
		url: z.string().optional(),
		user: UserInfoSchema.optional(),
	})
	.loose();

export const LocationReviewsInputSchema = z.object({
	id: z.number().int().positive(),
	// Bounds follow the Review rating range (1-5) documented in the spec.
	rating_min: z.number().min(1).max(5).optional(),
	// The spec types this query as a free-form string (e.g. business, family).
	trip_type: z.string().min(1).optional(),
	// The spec requires YYYY-MM-DD for this filter.
	published_after_ts: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
		.optional(),
	sort_by: ReviewSortBySchema.optional(),
	published_after_review_id: z.string().min(1).optional(),
	language: z.string().min(1).optional(),
	page: z.number().int().min(1).optional(),
	// The Terra spec sets no maximum page size for this endpoint.
	size: z.number().int().min(1).optional(),
});

export type LocationReviewsInput = z.infer<typeof LocationReviewsInputSchema>;

export const LocationReviewsResponseSchema = z.object({
	data: z.array(ReviewSchema),
	pagination: PageMetadataSchema,
});

export type LocationReviewsResponse = z.infer<
	typeof LocationReviewsResponseSchema
>;

// ---------------------------------------------------------------------------
// Geo: GET /geos/{id}
// ---------------------------------------------------------------------------

const GeoTypeSchema = z.object({
	id: z.number().int(),
	name: z.string(),
});

const AncestorSchema = z
	.object({
		geo_id: z.number().int().optional(),
		name: z.string().optional(),
		rank: z.number().int().optional(),
	})
	.loose();

const GeoHierarchySchema = z
	.object({
		ancestors: z.array(AncestorSchema).optional(),
	})
	.loose();

const GeoUrlsSchema = z
	.object({
		flights: z.string().optional(),
		geo_page: z.string().optional(),
		hotels: z.string().optional(),
		restaurants: z.string().optional(),
		things_to_do: z.string().optional(),
	})
	.loose();

const GeoCollectionSchema = z
	.object({
		id: z.string().optional(),
		title: z.string().optional(),
		url: z.string().optional(),
	})
	.loose();

const GeoForumFaqAnswerSchema = z
	.object({
		text: z.string().optional(),
		title: z.string().optional(),
	})
	.loose();

const GeoForumFaqSchema = z
	.object({
		answers: z.array(GeoForumFaqAnswerSchema).optional(),
		language: z.string().optional(),
		question: z.string().optional(),
	})
	.loose();

const GeoItineraryDayLocationIdSchema = z
	.object({
		id: z.number().int().optional(),
		rank: z.number().int().optional(),
	})
	.loose();

const GeoItineraryDaySchema = z
	.object({
		day: z.number().int().optional(),
		description: z.string().optional(),
		location_ids: z.array(GeoItineraryDayLocationIdSchema).optional(),
	})
	.loose();

const GeoSuggestedItinerarySchema = z
	.object({
		itinerary: z.array(GeoItineraryDaySchema).optional(),
		trip_creation_method: z.string().optional(),
		trip_id: z.number().int().optional(),
		trip_interest_tags: z.array(z.string()).optional(),
		trip_title: z.string().optional(),
		trip_url: z.string().optional(),
	})
	.loose();

const GeoDetailsSchema = z
	.object({
		abbreviation: z.string().optional(),
		awards: z.array(AwardV1Schema).optional(),
		collections: z.array(GeoCollectionSchema).optional(),
		coordinates: CoordinatesSchema.optional(),
		descriptions: z.array(TranslationSchema),
		forum_faqs: z.array(GeoForumFaqSchema).optional(),
		hierarchy: GeoHierarchySchema.optional(),
		id: z.number().int(),
		names: z.array(TranslationWithPrimarySchema),
		suggested_itineraries: z.array(GeoSuggestedItinerarySchema).optional(),
		type: GeoTypeSchema,
		urls: GeoUrlsSchema.optional(),
	})
	.loose();

export const GeoDetailsInputSchema = z.object({
	id: z.number().int().positive(),
	locale: z.array(z.string().min(1)).min(1).optional(),
});

export type GeoDetailsInput = z.infer<typeof GeoDetailsInputSchema>;

export const GeoDetailsResponseSchema = GeoDetailsSchema;

export type GeoDetailsResponse = z.infer<typeof GeoDetailsResponseSchema>;

// ---------------------------------------------------------------------------
// Full nearby search: GET /locations/nearby
// Same search parameters as the catalog variant, plus include_photo, and each
// hit carries the full Location representation. Filtering with
// category HOTEL + size 10 reproduces the legacy "location hotels" use case.
// ---------------------------------------------------------------------------

export const LocationsSearchNearbyInputSchema =
	NearbySearchInputBaseSchema.extend({
		include_photo: z.boolean().optional(),
	}).superRefine((input, ctx) => {
		const hasLocationReference = input.location_id !== undefined;
		const hasCoordinates = input.lat !== undefined && input.lon !== undefined;
		if (!hasLocationReference && !hasCoordinates) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['lat'],
				message: 'Provide location_id or both lat and lon',
			});
		}

		const hasBoundingBox =
			input.sw_lat !== undefined &&
			input.sw_lon !== undefined &&
			input.ne_lat !== undefined &&
			input.ne_lon !== undefined;
		if (input.radius === undefined && !hasBoundingBox) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['radius'],
				message: 'Provide radius or all four bounding-box coordinates',
			});
		}
	});

export type LocationsSearchNearbyInput = z.infer<
	typeof LocationsSearchNearbyInputSchema
>;

const NearbyFullLocationSchema = z
	.object({
		bearing: z.number().optional(),
		distance_kilometers: z.number().optional(),
		distance_miles: z.number().optional(),
		location: LocationDetailsSchema,
		photo: PhotoSchema.optional(),
	})
	.loose();

export const LocationsSearchNearbyResponseSchema = z.object({
	data: z.array(NearbyFullLocationSchema),
	pagination: PageMetadataSchema,
});

export type LocationsSearchNearbyResponse = z.infer<
	typeof LocationsSearchNearbyResponseSchema
>;

export type TripadvisorEndpointInputs = {
	locationsNearby: LocationsNearbyInput;
	locationDetails: LocationDetailsInput;
	locationPhotos: LocationPhotosInput;
	locationReviews: LocationReviewsInput;
	geoDetails: GeoDetailsInput;
	locationsSearchNearby: LocationsSearchNearbyInput;
};

export type TripadvisorEndpointOutputs = {
	locationsNearby: LocationsNearbyResponse;
	locationDetails: LocationDetailsResponse;
	locationPhotos: LocationPhotosResponse;
	locationReviews: LocationReviewsResponse;
	geoDetails: GeoDetailsResponse;
	locationsSearchNearby: LocationsSearchNearbyResponse;
};

export const TripadvisorEndpointInputSchemas = {
	locationsNearby: LocationsNearbyInputSchema,
	locationDetails: LocationDetailsInputSchema,
	locationPhotos: LocationPhotosInputSchema,
	locationReviews: LocationReviewsInputSchema,
	geoDetails: GeoDetailsInputSchema,
	locationsSearchNearby: LocationsSearchNearbyInputSchema,
} as const;

export const TripadvisorEndpointOutputSchemas = {
	locationsNearby: LocationsNearbyResponseSchema,
	locationDetails: LocationDetailsResponseSchema,
	locationPhotos: LocationPhotosResponseSchema,
	locationReviews: LocationReviewsResponseSchema,
	geoDetails: GeoDetailsResponseSchema,
	locationsSearchNearby: LocationsSearchNearbyResponseSchema,
} as const;
