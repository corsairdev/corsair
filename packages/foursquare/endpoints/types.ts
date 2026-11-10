import { z } from 'zod';

// ── Shared place schema ───────────────────────────────────────────────────
//
// Built from the OpenAPI schemas embedded in the docs. Foursquare returns this
// same place object from search, details and match, so it is defined once.
// Almost nothing is required: the `fields` parameter decides what comes back,
// so a caller who asks for three fields gets a three-field object.

const CategoryIconSchema = z
	.object({
		id: z.string().nullish(),
		prefix: z
			.string()
			.nullish()
			.describe('Concatenate with a size and the suffix to get an image URL'),
		suffix: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
	})
	.loose();

const CategorySchema = z
	.object({
		fsq_category_id: z.string().nullish(),
		name: z.string().nullish(),
		short_name: z.string().nullish(),
		plural_name: z.string().nullish(),
		icon: CategoryIconSchema.nullish(),
	})
	.loose();

const ChainSchema = z
	.object({
		fsq_chain_id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const LocationSchema = z
	.object({
		address: z.string().nullish(),
		locality: z.string().nullish(),
		region: z.string().nullish(),
		postcode: z.string().nullish(),
		country: z.string().nullish(),
		admin_region: z.string().nullish(),
		post_town: z.string().nullish(),
		po_box: z.string().nullish(),
		formatted_address: z.string().nullish(),
	})
	.loose();

const SocialMediaSchema = z
	.object({
		facebook_id: z.string().nullish(),
		instagram: z.string().nullish(),
		twitter: z.string().nullish(),
	})
	.loose();

const StatsSchema = z
	.object({
		total_photos: z.number().nullish(),
		total_ratings: z.number().nullish(),
		total_tips: z.number().nullish(),
	})
	.loose();

const RelatedPlacesSchema = z
	.object({
		// unknown: a related place is itself a place object, and nesting the full
		// PlaceSchema here would be recursive. The parent and children are not
		// used by any operation, so the contents stay open.
		parent: z.record(z.string(), z.unknown()).nullish(),
		children: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

const HoursSchema = z
	.object({
		display: z.string().nullish(),
		is_local_holiday: z.boolean().nullish(),
		open_now: z.boolean().nullish(),
		// unknown: each regular-hours entry is a day-to-segments map whose keys are
		// weekday names and whose values are open/close pairs, but Foursquare does
		// not document the exact shape, so it stays open.
		regular: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

const PlaceSchema = z
	.object({
		fsq_place_id: z.string().describe('The place id used by every other call'),
		name: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		distance: z
			.number()
			.nullish()
			.describe('Metres from the search location; Place Search only'),
		categories: z.array(CategorySchema).nullish(),
		chains: z.array(ChainSchema).nullish(),
		location: LocationSchema.nullish(),
		tel: z.string().nullish(),
		email: z.string().nullish(),
		website: z.string().nullish(),
		social_media: SocialMediaSchema.nullish(),
		link: z.string().nullish().describe('The Place Details URL for this place'),
		description: z.string().nullish(),
		price: z.number().nullish().describe('1 to 4'),
		rating: z.number().nullish().describe('0.0 to 10.0'),
		popularity: z.number().nullish(),
		stats: StatsSchema.nullish(),
		related_places: RelatedPlacesSchema.nullish(),
		hours: HoursSchema.nullish(),
		// Verified live: present on every response and absent from the docs' schema.
		extended_location: z
			.object({
				dma: z.string().nullish(),
				census_block_id: z.string().nullish(),
			})
			.loose()
			.nullish(),
		date_created: z.string().nullish(),
		date_refreshed: z.string().nullish(),
		date_closed: z.string().nullish(),
		placemaker_url: z.string().nullish(),
		store_id: z.string().nullish(),
		tastes: z.array(z.string()).nullish(),
		menu: z.string().nullish(),
		// unknown: attributes and verification data are open maps whose keys
		// Foursquare extends per place type.
		attributes: z.record(z.string(), z.unknown()).nullish(),
		veracity_rating: z.record(z.string(), z.unknown()).nullish(),
		unresolved_flags: z.array(z.string()).nullish(),
	})
	.loose();

export type FoursquarePlace = z.infer<typeof PlaceSchema>;

// ── places.search ─────────────────────────────────────────────────────────

const PlacesSearchInputSchema = z.object({
	query: z.string().optional().describe('Text to match against a place'),
	ll: z
		.string()
		.optional()
		.describe('latitude,longitude, e.g. 41.8781,-87.6298'),
	near: z
		.string()
		.optional()
		.describe('A geocodable locality, e.g. Chicago, IL'),
	ne: z.string().optional().describe('North-east corner of a rectangle'),
	sw: z.string().optional().describe('South-west corner of a rectangle'),
	radius: z
		.number()
		.int()
		.min(0)
		.max(100_000)
		.optional()
		.describe('Metres; only with ll or ip bias. Default 22000'),
	fsq_category_ids: z
		.array(z.string())
		.optional()
		.describe('Category ids, comma-joined before sending'),
	fsq_chain_ids: z.array(z.string()).optional(),
	exclude_fsq_chain_ids: z.array(z.string()).optional(),
	exclude_all_chains: z.boolean().optional(),
	min_price: z.number().int().min(1).max(4).optional(),
	max_price: z.number().int().min(1).max(4).optional(),
	open_now: z.boolean().optional(),
	open_at: z.string().optional().describe('A local day and time window'),
	sort: z
		.enum(['RELEVANCE', 'RATING', 'DISTANCE', 'POPULARITY'])
		.optional()
		.describe('Defaults to RELEVANCE'),
	tel_format: z
		.enum(['NATIONAL', 'E164'])
		.optional()
		.describe('Format of the returned telephone number'),
	fields: z
		.array(z.string())
		.optional()
		.describe('Response fields; all Pro fields when omitted'),
	cursor: z
		.string()
		.optional()
		.describe(
			'Next-page cursor from a previous response. Omit it for the first page',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Results per page, max 50, default 10'),
});

export type PlacesSearchInput = z.input<typeof PlacesSearchInputSchema>;

const PlacesSearchResponseSchema = z
	.object({
		results: z.array(PlaceSchema),
		/**
		 * Present on a real search, absent from the docs' own schema: verified
		 * live, it carries the search origin, as in
		 * `{ geo_bounds: { circle: { center, radius } } }`.
		 */
		context: z
			.object({
				// unknown: the bounds are shaped as `{ circle: { center, radius } }`
				// today, and Foursquare may add a rectangle form. The value is not
				// read by any operation, so it stays open rather than breaking a
				// search when the shape changes.
				geo_bounds: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
		/**
		 * Cursor for the next page, parsed from Foursquare's `link` response
		 * header. Absent on the last page. Pass it back as `cursor` to continue
		 * the same search.
		 */
		nextCursor: z
			.string()
			.nullish()
			.describe('Pass this back as cursor to fetch the next page'),
	})
	.loose();

export type PlacesSearchResponse = z.infer<typeof PlacesSearchResponseSchema>;

// ── places.get ────────────────────────────────────────────────────────────

const PlacesGetInputSchema = z.object({
	fsq_place_id: z.string().min(1),
	fields: z.array(z.string()).optional(),
});

export type PlacesGetInput = z.input<typeof PlacesGetInputSchema>;

const PlacesGetResponseSchema = PlaceSchema;

export type PlacesGetResponse = z.infer<typeof PlacesGetResponseSchema>;

// ── places.autocomplete ───────────────────────────────────────────────────

const PlacesAutocompleteInputSchema = z.object({
	query: z.string().min(3).describe('At least 3 characters'),
	ll: z.string().optional(),
	radius: z.number().int().min(0).max(100_000).optional(),
	types: z
		.array(z.enum(['place', 'search', 'geo']))
		.optional()
		.describe('Any combination of result types'),
	bias: z
		.enum(['place', 'search', 'geo'])
		.optional()
		.describe('Prefer one result type'),
	session_token: z
		.string()
		.optional()
		.describe('Groups a query with the selection it leads to'),
	limit: z.number().int().min(1).max(50).optional(),
});

export type PlacesAutocompleteInput = z.input<
	typeof PlacesAutocompleteInputSchema
>;

/**
 * An autocomplete result is a different shape from a place. Verified live: a
 * place result is `{ type, text, link, place }` where `text` is an **object**
 * (`{ primary, secondary, highlight[] }`) and the whole place is nested under
 * `place`. A `geo` or `search` result carries `text` and `link` with no `place`.
 */
const AutocompleteTextSchema = z
	.object({
		primary: z.string().nullish(),
		secondary: z.string().nullish(),
		highlight: z
			.array(
				z
					.object({ start: z.number().nullish(), length: z.number().nullish() })
					.loose(),
			)
			.nullish(),
	})
	.loose();

const AutocompleteResultSchema = z
	.object({
		type: z.string().describe('place, search, geo or address'),
		text: AutocompleteTextSchema.nullish(),
		link: z.string().nullish(),
		place: PlaceSchema.nullish(),
	})
	.loose();

export type FoursquareAutocompleteResult = z.infer<
	typeof AutocompleteResultSchema
>;

const PlacesAutocompleteResponseSchema = z
	.object({
		results: z.array(AutocompleteResultSchema),
	})
	.loose();

export type PlacesAutocompleteResponse = z.infer<
	typeof PlacesAutocompleteResponseSchema
>;

// ── places.tips ───────────────────────────────────────────────────────────

const PlacesTipsInputSchema = z.object({
	fsq_place_id: z.string().min(1),
	limit: z.number().int().min(1).max(50).optional(),
	sort: z
		.enum(['POPULAR', 'NEWEST'])
		.optional()
		.describe('Defaults to POPULAR'),
	fields: z.array(z.string()).optional(),
});

export type PlacesTipsInput = z.input<typeof PlacesTipsInputSchema>;

const TipSchema = z
	.object({
		fsq_tip_id: z.string(),
		created_at: z.string().nullish().describe('ISO 8601'),
		text: z.string().nullish(),
		url: z.string().nullish(),
		lang: z.string().nullish(),
		agree_count: z.number().nullish(),
		disagree_count: z.number().nullish(),
	})
	.loose();

export type FoursquareTip = z.infer<typeof TipSchema>;

const PlacesTipsResponseSchema = z.object({
	tips: z.array(TipSchema),
});

export type PlacesTipsResponse = z.infer<typeof PlacesTipsResponseSchema>;

// ── places.photos ─────────────────────────────────────────────────────────

const PlacesPhotosInputSchema = z.object({
	fsq_place_id: z.string().min(1),
	limit: z.number().int().min(1).max(50).optional(),
	sort: z
		.enum(['POPULAR', 'NEWEST'])
		.optional()
		.describe('Defaults to POPULAR'),
	classifications: z
		.array(z.string())
		.optional()
		.describe('Restrict to these photo classifications'),
});

export type PlacesPhotosInput = z.input<typeof PlacesPhotosInputSchema>;

const PhotoSchema = z
	.object({
		id: z.string(),
		created_at: z.string().nullish(),
		prefix: z
			.string()
			.describe('Concatenate with a size and the suffix to get an image URL'),
		suffix: z.string(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		classifications: z.array(z.string()).nullish(),
	})
	.loose();

export type FoursquarePhoto = z.infer<typeof PhotoSchema>;

const PlacesPhotosResponseSchema = z.object({
	photos: z.array(PhotoSchema),
});

export type PlacesPhotosResponse = z.infer<typeof PlacesPhotosResponseSchema>;

// ── places.match ──────────────────────────────────────────────────────────

const PlacesMatchInputSchema = z.object({
	name: z.string().min(1).describe('Name of the place to match'),
	address: z.string().min(1).describe('Street address'),
	city: z.string().min(1),
	state: z.string().optional(),
	postal_code: z.string().optional(),
	cc: z
		.string()
		.length(2)
		.describe(
			'2-letter country code, e.g. US. Foursquare supports English-speaking countries only',
		),
	ll: z.string().optional().describe('latitude,longitude'),
	fields: z.array(z.string()).optional(),
});

export type PlacesMatchInput = z.input<typeof PlacesMatchInputSchema>;

const PlacesMatchResponseSchema = z
	.object({
		place: PlaceSchema.nullish(),
		match_score: z
			.number()
			.nullish()
			.describe('How confident the match is, from 0 to 1'),
		// unknown: match context is provider-defined metadata that differs per
		// match; no operation reads it, so it stays open.
		context: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type PlacesMatchResponse = z.infer<typeof PlacesMatchResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type FoursquareEndpointInputs = {
	placesSearch: PlacesSearchInput;
	placesGet: PlacesGetInput;
	placesAutocomplete: PlacesAutocompleteInput;
	placesTips: PlacesTipsInput;
	placesPhotos: PlacesPhotosInput;
	placesMatch: PlacesMatchInput;
};

export type FoursquareEndpointOutputs = {
	placesSearch: PlacesSearchResponse;
	placesGet: PlacesGetResponse;
	placesAutocomplete: PlacesAutocompleteResponse;
	placesTips: PlacesTipsResponse;
	placesPhotos: PlacesPhotosResponse;
	placesMatch: PlacesMatchResponse;
};

export const FoursquareEndpointInputSchemas = {
	placesSearch: PlacesSearchInputSchema,
	placesGet: PlacesGetInputSchema,
	placesAutocomplete: PlacesAutocompleteInputSchema,
	placesTips: PlacesTipsInputSchema,
	placesPhotos: PlacesPhotosInputSchema,
	placesMatch: PlacesMatchInputSchema,
} as const;

export const FoursquareEndpointOutputSchemas = {
	placesSearch: PlacesSearchResponseSchema,
	placesGet: PlacesGetResponseSchema,
	placesAutocomplete: PlacesAutocompleteResponseSchema,
	placesTips: PlacesTipsResponseSchema,
	placesPhotos: PlacesPhotosResponseSchema,
	placesMatch: PlacesMatchResponseSchema,
} as const;
