import { z } from 'zod';

// Inputs use Ticketmaster's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field Ticketmaster adds or omits
// cannot fail a read that has already happened.
// Field reference: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

/** Ticketmaster's default page size; also what `next_page` is computed from. */
export const TICKETMASTER_DEFAULT_PAGE_SIZE = 20;
/** Deep paging stops at the 1000th item: `size * page` must stay below this. */
export const TICKETMASTER_MAX_ITEMS = 1000;

const pageSize = z
	.number()
	.int()
	.min(1)
	.max(200)
	.optional()
	.describe(
		`Items per page. Ticketmaster defaults to ${TICKETMASTER_DEFAULT_PAGE_SIZE}.`,
	);
// 0-based, not 1-based, unlike most Corsair paginators.
const pageNumber = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('0-based page number.');

/** Documented as "yes" / "no" / "only" strings, not booleans. */
const yesNoOnly = z.enum(['yes', 'no', 'only']);
const yesNo = z.enum(['yes', 'no']);
const unit = z.enum(['miles', 'km']).optional();
const preferredCountry = z.enum(['us', 'ca']).optional();
const locale = z
	.string()
	.min(1)
	.optional()
	.describe(
		"ISO locale, such as 'en-us'. Comma-separated values are allowed; '*' may end the list.",
	);
const domain = z
	.array(z.string().min(1))
	.min(1)
	.optional()
	.describe(
		'Only entities available on these domains, such as ticketmaster.com.',
	);

/**
 * Ticketmaster rejects a page whose `size * page` reaches 1000, so the bound is
 * checked here instead of spending a call on the 400.
 */
function withinDeepPaging<T extends { page?: number; size?: number }>(
	input: T,
): boolean {
	const size = input.size ?? TICKETMASTER_DEFAULT_PAGE_SIZE;
	return (input.page ?? 0) * size < TICKETMASTER_MAX_ITEMS;
}

const deepPagingError = {
	message: `Ticketmaster stops at the ${TICKETMASTER_MAX_ITEMS}th item: size * page must be under ${TICKETMASTER_MAX_ITEMS}. Narrow the search instead of paging further.`,
	path: ['page'],
};

// ── Shared output shapes ──────────────────────────────────────────────────

export const ImageSchema = z
	.object({
		url: z.string().nullish(),
		ratio: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		fallback: z.boolean().nullish(),
	})
	.loose();

export type TicketmasterImage = z.infer<typeof ImageSchema>;

// `_links` is a map of either one link, one link per relation, or a list of
// them, depending on the entity. It is passed through untouched, because its
// shape varies per relation and callers rarely read it.
// unknown: every entity type puts a different set of relations here, so a
// stricter type would have to enumerate them all and would still drift.
const LinksSchema = z.record(z.string(), z.unknown()).nullish();

/** One HAL link: `{ href, templated }`, as sent in `_links` and `outlets`. */
const LinkRefSchema = z
	.object({ href: z.string().nullish(), templated: z.boolean().nullish() })
	.loose();

/**
 * The classification tree is two levels deep, not arbitrary: a segment holds
 * genres, and a genre holds sub-genres, each a `{ id, name }` node. Spelling the
 * two levels out keeps named types in the API docs and in IntelliSense, which a
 * recursive `z.lazy` schema does not: the docs renderer prints it as `lazy`.
 *
 * `href` and `templated` are here because a node in some responses carries them
 * alongside `id` and `name`; `.loose()` would otherwise leave them typed as
 * `unknown`.
 */
export const ClassificationNodeSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		locale: z.string().nullish(),
		href: z.string().nullish(),
		templated: z.boolean().nullish(),
		_links: LinksSchema,
	})
	.loose();

/** A sub-genre: the bottom of the tree, so it holds no `_embedded`. */
export type TicketmasterSubGenre = z.infer<typeof ClassificationNodeSchema>;

/** A genre, which lists its sub-genres. */
export const GenreNodeSchema = ClassificationNodeSchema.extend({
	_embedded: z
		.object({ subgenres: z.array(ClassificationNodeSchema).nullish() })
		.loose()
		.nullish(),
}).loose();

export type TicketmasterGenre = z.infer<typeof GenreNodeSchema>;

/** A segment, which lists its genres. */
export const SegmentNodeSchema = ClassificationNodeSchema.extend({
	_embedded: z
		.object({ genres: z.array(GenreNodeSchema).nullish() })
		.loose()
		.nullish(),
}).loose();

export type TicketmasterSegment = z.infer<typeof SegmentNodeSchema>;

const ClassificationObjectSchema = z
	.object({
		primary: z.boolean().nullish(),
		family: z.boolean().nullish(),
		segment: SegmentNodeSchema.nullish(),
		genre: GenreNodeSchema.nullish(),
		subGenre: ClassificationNodeSchema.nullish(),
		type: ClassificationNodeSchema.nullish(),
		subType: ClassificationNodeSchema.nullish(),
	})
	.loose();

type ClassificationObjectSchemaType = typeof ClassificationObjectSchema;

/**
 * The type of `ClassificationSchema`, named so the built `.d.ts` refers to it
 * instead of repeating it.
 *
 * Declaration emit writes an inferred zod type out in full at every use. An
 * event lists classifications and embeds attractions, which list them again,
 * so the emitted event type carried the segment → genre → sub-genre tree twice,
 * each copy a separate type. Code compiled against the built package, as Hub
 * is, had to resolve an event's output type from the top in one pass and hit
 * TypeScript's instantiation depth limit: TS2589 on `ticketmaster()`,
 * `events.search`, `events.get` and `suggest.get`. TypeScript prints an
 * interface by name, so the tree is written out once.
 */
export interface TicketmasterClassificationSchema
	extends ClassificationObjectSchemaType {}

/**
 * One entry of a classification response. Ticketmaster fills whichever levels
 * the entry belongs to, so a segment entry has `segment`, a genre entry has
 * `segment` and `genre`, and a sub-genre entry has all three.
 */
export const ClassificationSchema: TicketmasterClassificationSchema =
	ClassificationObjectSchema;

export type TicketmasterClassification = z.infer<typeof ClassificationSchema>;

const CitySchema = z.object({ name: z.string().nullish() }).loose();
const StateSchema = z
	.object({ name: z.string().nullish(), stateCode: z.string().nullish() })
	.loose();
const CountrySchema = z
	.object({
		name: z.string().nullish(),
		countryCode: z.string().nullish(),
	})
	.loose();
const AddressSchema = z.object({ line1: z.string().nullish() }).loose();
const LocationSchema = z
	.object({
		// Ticketmaster sends these as strings, not numbers.
		longitude: z.union([z.string(), z.number()]).nullish(),
		latitude: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();
const MarketRefSchema = z
	.object({ id: z.union([z.string(), z.number()]).nullish() })
	.loose();
const DmaRefSchema = z.object({ id: z.number().nullish() }).loose();

export const VenueSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		test: z.boolean().nullish(),
		url: z.string().nullish(),
		locale: z.string().nullish(),
		description: z.string().nullish(),
		additionalInfo: z.string().nullish(),
		postalCode: z.string().nullish(),
		timezone: z.string().nullish(),
		currency: z.string().nullish(),
		city: CitySchema.nullish(),
		state: StateSchema.nullish(),
		country: CountrySchema.nullish(),
		address: AddressSchema.nullish(),
		location: LocationSchema.nullish(),
		markets: z.array(MarketRefSchema).nullish(),
		dmas: z.array(DmaRefSchema).nullish(),
		images: z.array(ImageSchema).nullish(),
		// unknown: the box office, parking and social blocks are per-venue maps
		// that change shape, so they are passed through as Ticketmaster sends them.
		boxOfficeInfo: z.record(z.string(), z.unknown()).nullish(),
		generalInfo: z.record(z.string(), z.unknown()).nullish(),
		social: z.record(z.string(), z.unknown()).nullish(),
		parkingDetail: z.string().nullish(),
		accessibleSeatingDetail: z.string().nullish(),
		upcomingEvents: z.record(z.string(), z.unknown()).nullish(),
		_links: LinksSchema,
	})
	.loose();

export type TicketmasterVenue = z.infer<typeof VenueSchema>;

export const AttractionSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		test: z.boolean().nullish(),
		url: z.string().nullish(),
		locale: z.string().nullish(),
		description: z.string().nullish(),
		additionalInfo: z.string().nullish(),
		images: z.array(ImageSchema).nullish(),
		classifications: z.array(ClassificationSchema).nullish(),
		aliases: z.array(z.string()).nullish(),
		// unknown: locale to alias map, passed through as Ticketmaster sends it.
		localizedAliases: z.record(z.string(), z.unknown()).nullish(),
		externalLinks: z.record(z.string(), z.unknown()).nullish(),
		upcomingEvents: z.record(z.string(), z.unknown()).nullish(),
		_links: LinksSchema,
	})
	.loose();

export type TicketmasterAttraction = z.infer<typeof AttractionSchema>;

const EventDatesSchema = z
	.object({
		start: z
			.object({
				localDate: z.string().nullish(),
				localTime: z.string().nullish(),
				dateTime: z.string().nullish(),
				dateTBD: z.boolean().nullish(),
				dateTBA: z.boolean().nullish(),
				timeTBA: z.boolean().nullish(),
				noSpecificTime: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		end: z
			.object({
				localDate: z.string().nullish(),
				localTime: z.string().nullish(),
				dateTime: z.string().nullish(),
				approximate: z.boolean().nullish(),
				noSpecificTime: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		timezone: z.string().nullish(),
		spanMultipleDays: z.boolean().nullish(),
		status: z
			.object({
				// The documented codes, but sent as a plain string so a new one
				// cannot fail a read.
				code: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

/**
 * The onsale window for an event. Ticketmaster names the public one `public`
 * (the docs' examples show `sales.public.startDateTime`), and each presale
 * carries its own name and window.
 */
const SaleWindowSchema = z
	.object({
		startDateTime: z.string().nullish(),
		endDateTime: z.string().nullish(),
		startTBD: z.boolean().nullish(),
		startTBA: z.boolean().nullish(),
	})
	.loose();

const PresaleSchema = z
	.object({
		name: z.string().nullish(),
		description: z.string().nullish(),
		url: z.string().nullish(),
		startDateTime: z.string().nullish(),
		endDateTime: z.string().nullish(),
		startTBD: z.boolean().nullish(),
		startTBA: z.boolean().nullish(),
	})
	.loose();

export type TicketmasterSaleWindow = z.infer<typeof SaleWindowSchema>;

const EventSalesSchema = z
	.object({
		public: SaleWindowSchema.nullish(),
		presales: z.array(PresaleSchema).nullish(),
	})
	.loose();

const PriceRangeSchema = z
	.object({
		type: z.string().nullish(),
		currency: z.string().nullish(),
		min: z.number().nullish(),
		max: z.number().nullish(),
	})
	.loose();

export const EventSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		test: z.boolean().nullish(),
		url: z.string().nullish(),
		locale: z.string().nullish(),
		description: z.string().nullish(),
		additionalInfo: z.string().nullish(),
		info: z.string().nullish(),
		pleaseNote: z.string().nullish(),
		productType: z.string().nullish(),
		images: z.array(ImageSchema).nullish(),
		dates: EventDatesSchema.nullish(),
		sales: EventSalesSchema.nullish(),
		priceRanges: z.array(PriceRangeSchema).nullish(),
		classifications: z.array(ClassificationSchema).nullish(),
		promoter: z.object({ id: z.string().nullish() }).loose().nullish(),
		promoters: z
			.array(z.object({ id: z.string().nullish() }).loose())
			.nullish(),
		outlets: z.array(LinkRefSchema).nullish(),
		products: z.array(LinkRefSchema).nullish(),
		aliases: z.array(z.string()).nullish(),
		// unknown: nested per-event maps (seatmap, accessibility, ticket limit,
		// place) that are not worth pinning; Ticketmaster changes them.
		seatmap: z.record(z.string(), z.unknown()).nullish(),
		accessibility: z.record(z.string(), z.unknown()).nullish(),
		ticketLimit: z.record(z.string(), z.unknown()).nullish(),
		place: z.record(z.string(), z.unknown()).nullish(),
		externalLinks: z.record(z.string(), z.unknown()).nullish(),
		localizedAliases: z.record(z.string(), z.unknown()).nullish(),
		_embedded: z
			.object({
				venues: z.array(VenueSchema).nullish(),
				attractions: z.array(AttractionSchema).nullish(),
			})
			.loose()
			.nullish(),
		_links: LinksSchema,
	})
	.loose();

export type TicketmasterEvent = z.infer<typeof EventSchema>;

/** The `page` block every search returns. */
export const PageSchema = z
	.object({
		size: z.number().nullish(),
		totalElements: z.number().nullish(),
		totalPages: z.number().nullish(),
		// 0-based.
		number: z.number().nullish(),
	})
	.loose();

export type TicketmasterPage = z.infer<typeof PageSchema>;

const NextPageSchema = z
	.number()
	.nullable()
	.describe(
		`The next 0-based page, or null on the last one. Ticketmaster stops at the ${TICKETMASTER_MAX_ITEMS}th item, so this is also null once that limit is reached.`,
	);

/**
 * Tickets pages by number, and `_links.next` is a templated href rather than a
 * cursor, so the next page is the current one plus one while pages remain.
 */
export function nextPage(
	page: TicketmasterPage | undefined,
	requested: { page?: number; size?: number },
): number | null {
	const current = page?.number ?? requested.page ?? 0;
	const size = page?.size ?? requested.size ?? TICKETMASTER_DEFAULT_PAGE_SIZE;
	const total = page?.totalPages;
	if (typeof total === 'number' && current + 1 >= total) return null;
	if ((current + 1) * size >= TICKETMASTER_MAX_ITEMS) return null;
	return current + 1;
}

// ── events.search ─────────────────────────────────────────────────────────

const EventsSearchInputSchema = z
	.object({
		id: z.string().min(1).optional().describe('Only this event ID.'),
		keyword: z
			.string()
			.min(1)
			.optional()
			.describe('Free-text search on the event name.'),
		attractionId: z
			.string()
			.min(1)
			.optional()
			.describe('Only events by this attraction (artist, team, show).'),
		venueId: z
			.string()
			.min(1)
			.optional()
			.describe('Only events at this venue.'),
		postalCode: z.string().min(1).optional(),
		latlong: z
			.string()
			.min(1)
			.optional()
			.describe(
				"'latitude,longitude'. Deprecated by Ticketmaster in favour of geoPoint.",
			),
		geoPoint: z
			.string()
			.min(1)
			.optional()
			.describe('Geo hash to search around, with radius and unit.'),
		radius: z
			.number()
			.positive()
			.optional()
			.describe('Search radius; the unit is `unit`.'),
		unit,
		source: z
			.string()
			.min(1)
			.optional()
			.describe(
				"Publishing source, such as 'ticketmaster', 'universe', 'frontgate' or 'tmr'. Comma-separated values are allowed.",
			),
		locale,
		marketId: z.string().min(1).optional(),
		dmaId: z.string().min(1).optional(),
		startDateTime: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Only events starting at or after this UTC time, such as 2026-01-01T00:00:00Z.',
			),
		endDateTime: z
			.string()
			.min(1)
			.optional()
			.describe('Only events starting at or before this UTC time.'),
		localStartDateTime: z
			.string()
			.min(1)
			.optional()
			.describe('A local-time range as two comma-separated timestamps.'),
		onsaleStartDateTime: z.string().min(1).optional(),
		onsaleEndDateTime: z.string().min(1).optional(),
		includeTBA: yesNoOnly.optional().describe('Date to be announced events.'),
		includeTBD: yesNoOnly.optional().describe('Date to be defined events.'),
		includeTest: yesNoOnly.optional(),
		includeFamily: yesNoOnly.optional(),
		includeSpellcheck: yesNo.optional(),
		city: z.array(z.string().min(1)).min(1).optional(),
		countryCode: z
			.string()
			.min(1)
			.optional()
			.describe('ISO country code, such as US.'),
		stateCode: z
			.string()
			.min(1)
			.optional()
			.describe('US state code, such as NY.'),
		classificationName: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe(
				"Segment, genre or sub-genre names, such as 'music'. A '-'-prefixed value excludes it.",
			),
		classificationId: z.array(z.string().min(1)).min(1).optional(),
		segmentId: z.array(z.string().min(1)).min(1).optional(),
		segmentName: z.array(z.string().min(1)).min(1).optional(),
		genreId: z.array(z.string().min(1)).min(1).optional(),
		subGenreId: z.array(z.string().min(1)).min(1).optional(),
		typeId: z.array(z.string().min(1)).min(1).optional(),
		subTypeId: z.array(z.string().min(1)).min(1).optional(),
		collectionId: z.array(z.string().min(1)).min(1).optional(),
		promoterId: z.string().min(1).optional(),
		sort: z
			.string()
			.min(1)
			.optional()
			.describe(
				"Field and direction, such as 'date,asc' or 'relevance,desc'. Ticketmaster defaults to relevance,desc.",
			),
		preferredCountry,
		size: pageSize,
		page: pageNumber,
		domain,
	})
	.refine(withinDeepPaging, deepPagingError);

export type EventsSearchInput = z.infer<typeof EventsSearchInputSchema>;

const EventsSearchResponseSchema = z.object({
	events: z.array(EventSchema),
	page: PageSchema.nullish(),
	next_page: NextPageSchema,
});

export type EventsSearchResponse = z.infer<typeof EventsSearchResponseSchema>;

// ── events.get ────────────────────────────────────────────────────────────

const EventIdInputSchema = {
	id: z.string().min(1).describe('The event ID.'),
	locale: locale,
	domain,
};

const EventsGetInputSchema = z.object(EventIdInputSchema);

export type EventsGetInput = z.infer<typeof EventsGetInputSchema>;

/** One event, by ID. */
const EventsGetResponseSchema = EventSchema;

export type EventsGetResponse = z.infer<typeof EventsGetResponseSchema>;

// ── events.getImages ──────────────────────────────────────────────────────

const EventsGetImagesInputSchema = z.object(EventIdInputSchema);

export type EventsGetImagesInput = z.infer<typeof EventsGetImagesInputSchema>;

const EventsGetImagesResponseSchema = z.object({
	id: z.string().nullish(),
	type: z.string().nullish(),
	images: z.array(ImageSchema),
});

export type EventsGetImagesResponse = z.infer<
	typeof EventsGetImagesResponseSchema
>;

// ── attractions.search ────────────────────────────────────────────────────

const AttractionsSearchInputSchema = z
	.object({
		id: z.string().min(1).optional(),
		keyword: z.string().min(1).optional(),
		source: z
			.string()
			.min(1)
			.optional()
			.describe(
				"Publishing source, such as 'ticketmaster', 'universe', 'frontgate' or 'tmr'.",
			),
		locale,
		includeTest: yesNoOnly.optional(),
		includeFamily: yesNoOnly.optional(),
		includeSpellcheck: yesNo.optional(),
		classificationName: z.array(z.string().min(1)).min(1).optional(),
		classificationId: z.array(z.string().min(1)).min(1).optional(),
		segmentId: z.array(z.string().min(1)).min(1).optional(),
		genreId: z.array(z.string().min(1)).min(1).optional(),
		subGenreId: z.array(z.string().min(1)).min(1).optional(),
		typeId: z.array(z.string().min(1)).min(1).optional(),
		subTypeId: z.array(z.string().min(1)).min(1).optional(),
		sort: z
			.string()
			.min(1)
			.optional()
			.describe(
				"Field and direction, such as 'name,asc' or 'relevance,desc'. Ticketmaster defaults to relevance,desc.",
			),
		preferredCountry,
		size: pageSize,
		page: pageNumber,
		domain,
	})
	.refine(withinDeepPaging, deepPagingError);

export type AttractionsSearchInput = z.infer<
	typeof AttractionsSearchInputSchema
>;

const AttractionsSearchResponseSchema = z.object({
	attractions: z.array(AttractionSchema),
	page: PageSchema.nullish(),
	next_page: NextPageSchema,
});

export type AttractionsSearchResponse = z.infer<
	typeof AttractionsSearchResponseSchema
>;

// ── attractions.get ───────────────────────────────────────────────────────

const AttractionsGetInputSchema = z.object({
	id: z.string().min(1).describe('The attraction ID.'),
	locale: locale,
	domain,
});

export type AttractionsGetInput = z.infer<typeof AttractionsGetInputSchema>;

const AttractionsGetResponseSchema = AttractionSchema;

export type AttractionsGetResponse = z.infer<
	typeof AttractionsGetResponseSchema
>;

// ── venues.search ─────────────────────────────────────────────────────────

const VenuesSearchInputSchema = z
	.object({
		id: z.string().min(1).optional(),
		keyword: z.string().min(1).optional(),
		latlong: z
			.string()
			.min(1)
			.optional()
			.describe(
				"'latitude,longitude'. Deprecated by Ticketmaster in favour of geoPoint.",
			),
		geoPoint: z.string().min(1).optional(),
		radius: z.number().positive().optional(),
		unit,
		source: z
			.string()
			.min(1)
			.optional()
			.describe(
				"Publishing source, such as 'ticketmaster', 'universe', 'frontgate' or 'tmr'.",
			),
		locale,
		includeTest: yesNoOnly.optional(),
		includeSpellcheck: yesNo.optional(),
		countryCode: z.string().min(1).optional(),
		stateCode: z.string().min(1).optional(),
		sort: z
			.string()
			.min(1)
			.optional()
			.describe(
				"Field and direction, such as 'name,asc' or 'distance,asc'. Ticketmaster defaults to relevance,desc.",
			),
		preferredCountry,
		size: pageSize,
		page: pageNumber,
		domain,
	})
	.refine(withinDeepPaging, deepPagingError);

export type VenuesSearchInput = z.infer<typeof VenuesSearchInputSchema>;

const VenuesSearchResponseSchema = z.object({
	venues: z.array(VenueSchema),
	page: PageSchema.nullish(),
	next_page: NextPageSchema,
});

export type VenuesSearchResponse = z.infer<typeof VenuesSearchResponseSchema>;

// ── venues.get ────────────────────────────────────────────────────────────

const VenuesGetInputSchema = z.object({
	id: z.string().min(1).describe('The venue ID.'),
	locale: locale,
	domain,
});

export type VenuesGetInput = z.infer<typeof VenuesGetInputSchema>;

const VenuesGetResponseSchema = VenueSchema;

export type VenuesGetResponse = z.infer<typeof VenuesGetResponseSchema>;

// ── classifications.search ────────────────────────────────────────────────

/**
 * The search returns the whole tree with each entry: the same node shape as
 * `ClassificationSchema`, plus the entry's own `id`.
 */
export const ClassificationEntrySchema = ClassificationSchema.extend({
	id: z.string().nullish(),
	_links: LinksSchema,
}).loose();

export type TicketmasterClassificationEntry = z.infer<
	typeof ClassificationEntrySchema
>;

const ClassificationsSearchInputSchema = z
	.object({
		id: z.string().min(1).optional(),
		keyword: z.string().min(1).optional(),
		source: z
			.string()
			.min(1)
			.optional()
			.describe(
				"Publishing source, such as 'ticketmaster', 'universe', 'frontgate' or 'tmr'.",
			),
		locale,
		includeTest: yesNoOnly.optional(),
		includeSpellcheck: yesNo.optional(),
		sort: z
			.string()
			.min(1)
			.optional()
			.describe('Field and direction. Ticketmaster defaults to name,asc.'),
		preferredCountry,
		size: pageSize,
		page: pageNumber,
		domain,
	})
	.refine(withinDeepPaging, deepPagingError);

export type ClassificationsSearchInput = z.infer<
	typeof ClassificationsSearchInputSchema
>;

const ClassificationsSearchResponseSchema = z.object({
	classifications: z.array(ClassificationEntrySchema),
	page: PageSchema.nullish(),
	next_page: NextPageSchema,
});

export type ClassificationsSearchResponse = z.infer<
	typeof ClassificationsSearchResponseSchema
>;

// ── classifications.get ───────────────────────────────────────────────────

const ClassificationsGetInputSchema = z.object({
	id: z.string().min(1).describe('A segment, genre or sub-genre ID.'),
	locale: locale,
	domain,
});

export type ClassificationsGetInput = z.infer<
	typeof ClassificationsGetInputSchema
>;

const ClassificationsGetResponseSchema = ClassificationEntrySchema;

export type ClassificationsGetResponse = z.infer<
	typeof ClassificationsGetResponseSchema
>;

// ── suggest.get ───────────────────────────────────────────────────────────

export const SUGGEST_RESOURCES = [
	'attractions',
	'events',
	'venues',
	'products',
] as const;

const SuggestGetInputSchema = z.object({
	keyword: z
		.string()
		.min(1)
		.optional()
		.describe('What the user has typed so far.'),
	latlong: z.string().min(1).optional(),
	geoPoint: z.string().min(1).optional(),
	radius: z.number().positive().optional(),
	unit,
	source: z.string().min(1).optional(),
	locale,
	countryCode: z.string().min(1).optional(),
	segmentId: z.array(z.string().min(1)).min(1).optional(),
	resource: z
		.array(z.enum(SUGGEST_RESOURCES))
		.min(1)
		.optional()
		.describe(
			'Which collections to suggest from. Ticketmaster defaults to all four.',
		),
	includeTBA: yesNoOnly.optional(),
	includeTBD: yesNoOnly.optional(),
	includeTest: yesNoOnly.optional(),
	includeSpellcheck: yesNo.optional(),
	startEndDateTime: z.string().min(1).optional(),
	localStartEndDateTime: z.string().min(1).optional(),
	preferredCountry,
	size: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe('Items per collection. Ticketmaster defaults to 5.'),
	domain,
});

export type SuggestGetInput = z.infer<typeof SuggestGetInputSchema>;

/**
 * Suggest returns the same `_embedded` envelope as the searches, despite its
 * docs describing the response only as "schema (string)". The live API answers
 * `{ _links, _embedded: { venues, attractions, events, products } }`, so every
 * collection is read from there and an absent one is an empty list.
 *
 * `EventSchema` and `AttractionSchema` are reused as-is: a suggest row carries
 * the same fields as a search row for these types.
 */
const SuggestGetResponseSchema = z.object({
	attractions: z.array(AttractionSchema),
	events: z.array(EventSchema),
	venues: z.array(VenueSchema),
	// unknown: products are only ever returned by suggest, and they are shaped
	// like an event with a `_embedded` of venues and attractions. They are passed
	// through rather than pinned to a schema nothing else uses.
	products: z.array(z.record(z.string(), z.unknown())),
});

export type SuggestGetResponse = z.infer<typeof SuggestGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type TicketmasterEndpointInputs = {
	eventsSearch: EventsSearchInput;
	eventsGet: EventsGetInput;
	eventsGetImages: EventsGetImagesInput;
	attractionsSearch: AttractionsSearchInput;
	attractionsGet: AttractionsGetInput;
	venuesSearch: VenuesSearchInput;
	venuesGet: VenuesGetInput;
	classificationsSearch: ClassificationsSearchInput;
	classificationsGet: ClassificationsGetInput;
	suggestGet: SuggestGetInput;
};

export type TicketmasterEndpointOutputs = {
	eventsSearch: EventsSearchResponse;
	eventsGet: EventsGetResponse;
	eventsGetImages: EventsGetImagesResponse;
	attractionsSearch: AttractionsSearchResponse;
	attractionsGet: AttractionsGetResponse;
	venuesSearch: VenuesSearchResponse;
	venuesGet: VenuesGetResponse;
	classificationsSearch: ClassificationsSearchResponse;
	classificationsGet: ClassificationsGetResponse;
	suggestGet: SuggestGetResponse;
};

export const TicketmasterEndpointInputSchemas = {
	eventsSearch: EventsSearchInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsGetImages: EventsGetImagesInputSchema,
	attractionsSearch: AttractionsSearchInputSchema,
	attractionsGet: AttractionsGetInputSchema,
	venuesSearch: VenuesSearchInputSchema,
	venuesGet: VenuesGetInputSchema,
	classificationsSearch: ClassificationsSearchInputSchema,
	classificationsGet: ClassificationsGetInputSchema,
	suggestGet: SuggestGetInputSchema,
} as const;

export const TicketmasterEndpointOutputSchemas = {
	eventsSearch: EventsSearchResponseSchema,
	eventsGet: EventsGetResponseSchema,
	eventsGetImages: EventsGetImagesResponseSchema,
	attractionsSearch: AttractionsSearchResponseSchema,
	attractionsGet: AttractionsGetResponseSchema,
	venuesSearch: VenuesSearchResponseSchema,
	venuesGet: VenuesGetResponseSchema,
	classificationsSearch: ClassificationsSearchResponseSchema,
	classificationsGet: ClassificationsGetResponseSchema,
	suggestGet: SuggestGetResponseSchema,
} as const;
