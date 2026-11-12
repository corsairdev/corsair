import { z } from 'zod';
import {
	AggregationIntervalSchema,
	DateTimeSchema,
	DirectionSchema,
	ExpressionGroupSchema,
	GeoAccuracySchema,
	GeoShapeSchema,
	PAGE_SIZE_MAX,
	PageSchema,
	PropertyFilterShape,
	PropertyListOnlyFilterShape,
	PropertyTypeSchema,
	PublisherTypeSchema,
	SubscribedEventSchema,
	TransactionTypeSchema,
} from './filters';
import {
	CitySchema,
	collectionOutput,
	hydraList,
	LocationSchema,
	PointOfInterestSchema,
	PricePerMeterIndicatorSchema,
	PropertyCollectionSchema,
	PropertyDocumentSchema,
	SearchSchema,
} from './schemas';

const uuid = (what: string) =>
	z.guid().describe(`UUID of the ${what}. Taken from the \`uuid\` field.`);

const itemsPerPage = (defaultSize: number) =>
	z
		.number()
		.int()
		.min(0)
		.max(PAGE_SIZE_MAX)
		.optional()
		.describe(
			`The number of items per page. Max is ${PAGE_SIZE_MAX}; defaults to ${defaultSize}. \`0\` returns only \`hydra:totalItems\` (capped at 10 000 on properties.list).`,
		);

const direction = (what: string) =>
	DirectionSchema.optional().describe(`Order by ${what}.`);

// ── properties.list ───────────────────────────────────────────────────────

const PropertiesListInputSchema = z
	.object({
		...PropertyFilterShape,
		...PropertyListOnlyFilterShape,
		order: z
			.object({
				createdAt: direction('creation date (the API defaults to `desc`)'),
				updatedAt: direction('update date'),
				pricePerMeter: direction(
					'price per meter (the API defaults to `desc`)',
				),
				price: direction('price'),
				surface: direction('surface'),
			})
			.strict()
			.optional()
			.describe('Sent as `order[createdAt]`, `order[price]` and so on.'),
		page: PageSchema,
		itemsPerPage: itemsPerPage(10),
	})
	.strict();

export type PropertiesListInput = z.input<typeof PropertiesListInputSchema>;

export type PropertiesListResponse = z.infer<typeof PropertyCollectionSchema>;

// ── properties.get ────────────────────────────────────────────────────────

const PropertiesGetInputSchema = z.object({ id: uuid('property') }).strict();

export type PropertiesGetInput = z.input<typeof PropertiesGetInputSchema>;

export type PropertiesGetResponse = z.infer<typeof PropertyDocumentSchema>;

// ── properties.listSimilar ────────────────────────────────────────────────

const PropertiesListSimilarInputSchema = z
	.object({
		id: uuid('property to find similar ones for'),
		fromDate: DateTimeSchema.optional().describe(
			'Date from which the property is created — inclusive.',
		),
		order: z
			.object({
				createdAt: direction('creation date (the API defaults to `desc`)'),
				updatedAt: direction('update date'),
				pricePerMeter: direction(
					'price per meter (the API defaults to `desc`)',
				),
				price: direction('price'),
				surface: direction('surface'),
			})
			.strict()
			.optional(),
		page: PageSchema,
		itemsPerPage: itemsPerPage(10),
	})
	.strict();

export type PropertiesListSimilarInput = z.input<
	typeof PropertiesListSimilarInputSchema
>;

export type PropertiesListSimilarResponse = z.infer<
	typeof PropertyCollectionSchema
>;

// ── indicators.pricePerMeter ──────────────────────────────────────────────

const PricePerMeterInputSchema = z
	.object({
		...PropertyFilterShape,
		aggregationInterval: AggregationIntervalSchema.optional().describe(
			'Date histogram granularity for the time series. Defaults to `month`.',
		),
		order: z
			.object({
				createdAt: direction('creation date (the API defaults to `desc`)'),
				updatedAt: direction('update date'),
			})
			.strict()
			.optional(),
		page: PageSchema,
		itemsPerPage: itemsPerPage(30),
	})
	.strict();

export type PricePerMeterInput = z.input<typeof PricePerMeterInputSchema>;

const PricePerMeterResponseSchema = collectionOutput(
	PricePerMeterIndicatorSchema,
);

export type PricePerMeterResponse = z.infer<typeof PricePerMeterResponseSchema>;

// ── indicators.pointsOfInterest ───────────────────────────────────────────

const PointsOfInterestInputSchema = z
	.object({
		facilities: z
			.array(
				z.enum(['kindergarten', 'school', 'restaurant', 'hospital', 'parking']),
			)
			.min(1)
			.describe('Categories of points of interest to return.'),
		lat: z.number().describe('Latitude.'),
		lon: z.number().describe('Longitude.'),
		radius: z.number().describe('Distance expressed in kilometers.'),
	})
	.strict();

export type PointsOfInterestInput = z.input<typeof PointsOfInterestInputSchema>;

const PointsOfInterestResponseSchema = hydraList(PointOfInterestSchema);

export type PointsOfInterestResponse = z.infer<
	typeof PointsOfInterestResponseSchema
>;

// ── indicators.locations ──────────────────────────────────────────────────

const LocationsInputSchema = z
	.object({
		query: z.string().optional().describe('Query term to perform search.'),
		excludedCitiesIds: z
			.array(z.string())
			.optional()
			.describe('Exclude cities using their IRI, for example `/cities/37008`.'),
		excludedDepartmentsIds: z
			.array(z.string())
			.optional()
			.describe(
				'Exclude departments using their IRI, for example `/departments/77`.',
			),
	})
	.strict();

export type LocationsInput = z.input<typeof LocationsInputSchema>;

const LocationsResponseSchema = hydraList(LocationSchema);

export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;

// ── indicators.cities ─────────────────────────────────────────────────────

const CitiesInputSchema = z
	.object({
		excludeGroupedCities: z
			.boolean()
			.optional()
			.describe(
				'Set to true to exclude cities that have grouped cities under them. The API defaults to false.',
			),
		insee: z
			.union([z.string(), z.array(z.string())])
			.optional()
			.describe(
				'Filter by INSEE code. A string is sent as `insee`, an array as `insee[]`.',
			),
		polygon: z
			.array(z.object({ lat: z.number(), lon: z.number() }).strict())
			.optional()
			.describe(
				'Filter by cities inside a polygon of GPS points. Sent as `polygon[0][lat]`, `polygon[0][lon]`, and so on. The spec types this as a string; its example uses this indexed form.',
			),
		libelle: z.string().optional().describe('Filter by city label.'),
		name: z.string().optional().describe('Filter by city name.'),
		order: z
			.object({ name: direction('name (the API defaults to `asc`)') })
			.strict()
			.optional(),
		page: PageSchema,
		slug: z.string().optional().describe('Filter by city slug.'),
		zipcode: z
			.union([z.string(), z.array(z.string())])
			.optional()
			.describe(
				'Filter by zipcode. A string is sent as `zipcode`, an array as `zipcode[]`.',
			),
	})
	.strict();

export type CitiesInput = z.input<typeof CitiesInputSchema>;

const CitiesResponseSchema = collectionOutput(CitySchema);

export type CitiesResponse = z.infer<typeof CitiesResponseSchema>;

// ── searches ──────────────────────────────────────────────────────────────

const httpsUrl = (what: string) =>
	z
		.url({ protocol: /^https$/ })
		.describe(`HTTPS webhook that receives ${what}.`);

const SearchFieldsShape = {
	bedroomMin: z
		.number()
		.int()
		.optional()
		.describe('Minimum number of bedrooms in the property.'),
	bedroomMax: z
		.number()
		.int()
		.optional()
		.describe('Maximum number of bedrooms in the property.'),
	budgetMax: z.number().optional().describe('Maximum budget for the property.'),
	budgetMin: z.number().optional().describe('Minimum budget for the property.'),
	endpointRecipient: httpsUrl(
		'`match` payloads whenever a property satisfies the search. Requires `notificationEnabled: true`',
	).optional(),
	eventEndpoint: httpsUrl(
		'advert `event` payloads (price changes, expirations, etc.). Requires `notificationEnabled: true` and at least one entry in `subscribedEvents`',
	).optional(),
	excludedCities: z
		.array(z.string())
		.optional()
		.describe('Cities to be excluded.'),
	excludedSites: z
		.array(z.string())
		.optional()
		.describe('Source sites to be excluded.'),
	excludedSiteCategories: z
		.array(z.string())
		.optional()
		.describe('Site categories to be excluded.'),
	expressions: z
		.array(ExpressionGroupSchema)
		.optional()
		.describe(
			'Full-text rules on the title or description: an array of OR groups, each an array of AND terms `{ word, options: { includes, strict } }`.',
		),
	furnished: z
		.boolean()
		.optional()
		.describe('Whether the property is furnished or not.'),
	geoAccuracy: GeoAccuracySchema.optional().describe(
		'Geocoding confidence level. `1` keeps only house-number level matches and `2` includes neighborhood-level approximations. Leave empty to allow both.',
	),
	geoShapes: z
		.array(GeoShapeSchema)
		.optional()
		.describe(
			'Geographic areas to filter on: an array of polygons, each an array of `[lon, lat]` points.',
		),
	hidePropertyContact: z
		.boolean()
		.optional()
		.describe('Whether to hide property contact information or not.'),
	includedCities: z
		.array(z.string())
		.optional()
		.describe(
			'Included cities. Use `indicators.locations` to get the city IRIs, for example `/cities/30953`.',
		),
	includedDepartments: z
		.array(z.string())
		.optional()
		.describe(
			'Included departments. Use `indicators.locations` to get the department IRIs, for example `/departments/77`.',
		),
	includedSiteCategories: z
		.array(z.string())
		.optional()
		.describe('Included site categories.'),
	includedSites: z
		.array(z.string())
		.optional()
		.describe('Source sites to be included.'),
	includedZipcodes: z
		.array(z.string())
		.optional()
		.describe('Included zipcodes.'),
	includedZipcodesInsee: z
		.array(z.string())
		.optional()
		.describe(
			'Included INSEE codes (used to infer the cities associated with the search).',
		),
	landSurfaceMax: z.number().optional().describe('Maximum land surface.'),
	landSurfaceMin: z.number().optional().describe('Minimum land surface.'),
	lat: z
		.number()
		.optional()
		.describe(
			'Latitude of the center point used for radial filtering. Provide together with `lon`.',
		),
	lon: z
		.number()
		.optional()
		.describe(
			'Longitude of the center point used for radial filtering. Provide together with `lat`.',
		),
	notificationEnabled: z
		.boolean()
		.optional()
		.describe(
			'Enables delivery of matches and events by webhook (`endpointRecipient`, `eventEndpoint`) or by email (`notificationRecipient`). The API defaults to false.',
		),
	notificationRecipient: z
		.email()
		.optional()
		.describe(
			'Email address that receives alert summaries when `notificationEnabled` is true.',
		),
	pricePerMeterMax: z.number().optional().describe('Maximum price per meter.'),
	pricePerMeterMin: z.number().optional().describe('Minimum price per meter.'),
	propertyTypes: z
		.array(PropertyTypeSchema)
		.describe(
			'Type of property. Apartment `0`, House `1`, Building `2`, Parking `3`, Office `4`, Land `5`, Shop `6`. Required.',
		),
	publisherTypes: z.array(PublisherTypeSchema).optional(),
	radius: z
		.number()
		.optional()
		.describe('Distance in kilometers around the provided `lat`/`lon`.'),
	roomMin: z.number().int().optional().describe('Minimum number of rooms.'),
	roomMax: z.number().int().optional().describe('Maximum number of rooms.'),
	subscribedEvents: z
		.array(SubscribedEventSchema)
		.optional()
		.describe('Event codes you want to receive on the `eventEndpoint`.'),
	surfaceMax: z.number().optional().describe('Maximum property surface area.'),
	surfaceMin: z.number().optional().describe('Minimum property surface area.'),
	title: z.string().describe('Title of the search. Required.'),
	transactionType: TransactionTypeSchema,
	withCoherentPrice: z
		.boolean()
		.nullable()
		.optional()
		.describe(
			'Price coherence filter. `true` keeps adverts whose price passes the coherence checks, `false` keeps adverts flagged as incoherent (both also include unassessed ones), `null` disables the filter. The API defaults to `true` when omitted.',
		),
	withVirtualTour: z
		.boolean()
		.optional()
		.describe('Whether the property includes a virtual tour.'),
};

/**
 * Rules the spec states in prose: webhook endpoints need
 * `notificationEnabled: true`, an `eventEndpoint` needs a subscribed event, and
 * `lat` and `lon` are provided together. Checked here so a request the API
 * will refuse is not sent.
 */
function checkSearchRules(
	search: {
		endpointRecipient?: string;
		eventEndpoint?: string;
		notificationEnabled?: boolean;
		subscribedEvents?: string[];
		lat?: number;
		lon?: number;
	},
	ctx: z.core.$RefinementCtx,
): void {
	if (
		(search.endpointRecipient !== undefined ||
			search.eventEndpoint !== undefined) &&
		search.notificationEnabled !== true
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['notificationEnabled'],
			message:
				'endpointRecipient and eventEndpoint require notificationEnabled: true',
		});
	}
	if (
		search.eventEndpoint !== undefined &&
		(search.subscribedEvents?.length ?? 0) === 0
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['subscribedEvents'],
			message: 'eventEndpoint requires at least one entry in subscribedEvents',
		});
	}
	if ((search.lat === undefined) !== (search.lon === undefined)) {
		ctx.addIssue({
			code: 'custom',
			path: [search.lat === undefined ? 'lat' : 'lon'],
			message: 'lat and lon must be provided together',
		});
	}
}

const SearchesListInputSchema = z
	.object({
		notificationEnabled: z
			.boolean()
			.optional()
			.describe('Filter searches that have notifications enabled or not.'),
		order: z
			.object({ title: direction('title') })
			.strict()
			.optional(),
		page: PageSchema,
		title: z.string().optional().describe('Title of the search.'),
	})
	.strict();

export type SearchesListInput = z.input<typeof SearchesListInputSchema>;

const SearchesListResponseSchema = collectionOutput(SearchSchema);

export type SearchesListResponse = z.infer<typeof SearchesListResponseSchema>;

const SearchesGetInputSchema = z.object({ id: uuid('search') }).strict();

export type SearchesGetInput = z.input<typeof SearchesGetInputSchema>;

export type SearchesGetResponse = z.infer<typeof SearchSchema>;

const SearchesCreateInputSchema = z
	.object(SearchFieldsShape)
	.strict()
	.superRefine(checkSearchRules);

export type SearchesCreateInput = z.input<typeof SearchesCreateInputSchema>;

export type SearchesCreateResponse = z.infer<typeof SearchSchema>;

const SearchesUpdateInputSchema = z
	.object({ id: uuid('search to update'), ...SearchFieldsShape })
	.strict()
	.superRefine(checkSearchRules);

export type SearchesUpdateInput = z.input<typeof SearchesUpdateInputSchema>;

export type SearchesUpdateResponse = z.infer<typeof SearchSchema>;

const SearchesDeleteInputSchema = z
	.object({ id: uuid('search to delete') })
	.strict();

export type SearchesDeleteInput = z.input<typeof SearchesDeleteInputSchema>;

const SearchesDeleteResponseSchema = z.object({
	id: z.string().describe('The id of the search that was deleted.'),
	deleted: z
		.literal(true)
		.describe('The API answers 204 with no body when the search is deleted.'),
});

export type SearchesDeleteResponse = z.infer<
	typeof SearchesDeleteResponseSchema
>;

// ── webhooks.simulate ─────────────────────────────────────────────────────

const WebhooksSimulateInputSchema = z
	.object({
		endpoint: z
			.url({ protocol: /^https?$/ })
			.describe('Endpoint where the match or the event will be sent to.'),
		eventType: SubscribedEventSchema.optional().describe(
			'The type of event to trigger. Omit it to simulate a `match`.',
		),
	})
	.strict();

export type WebhooksSimulateInput = z.input<typeof WebhooksSimulateInputSchema>;

const WebhooksSimulateResponseSchema = z.object({
	sent: z
		.literal(true)
		.describe(
			'The API answered 2xx: the simulated payload was sent to the endpoint. Melo returns no delivery result.',
		),
	endpoint: z.string().describe('The endpoint the payload was sent to.'),
	simulated: z
		.union([z.literal('match'), SubscribedEventSchema])
		.describe('`match`, or the event type that was simulated.'),
});

export type WebhooksSimulateResponse = z.infer<
	typeof WebhooksSimulateResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type MeloEndpointInputs = {
	propertiesList: PropertiesListInput;
	propertiesGet: PropertiesGetInput;
	propertiesListSimilar: PropertiesListSimilarInput;
	indicatorsPricePerMeter: PricePerMeterInput;
	indicatorsPointsOfInterest: PointsOfInterestInput;
	indicatorsLocations: LocationsInput;
	indicatorsCities: CitiesInput;
	searchesList: SearchesListInput;
	searchesGet: SearchesGetInput;
	searchesCreate: SearchesCreateInput;
	searchesUpdate: SearchesUpdateInput;
	searchesDelete: SearchesDeleteInput;
	webhooksSimulate: WebhooksSimulateInput;
};

export type MeloEndpointOutputs = {
	propertiesList: PropertiesListResponse;
	propertiesGet: PropertiesGetResponse;
	propertiesListSimilar: PropertiesListSimilarResponse;
	indicatorsPricePerMeter: PricePerMeterResponse;
	indicatorsPointsOfInterest: PointsOfInterestResponse;
	indicatorsLocations: LocationsResponse;
	indicatorsCities: CitiesResponse;
	searchesList: SearchesListResponse;
	searchesGet: SearchesGetResponse;
	searchesCreate: SearchesCreateResponse;
	searchesUpdate: SearchesUpdateResponse;
	searchesDelete: SearchesDeleteResponse;
	webhooksSimulate: WebhooksSimulateResponse;
};

export const MeloEndpointInputSchemas = {
	propertiesList: PropertiesListInputSchema,
	propertiesGet: PropertiesGetInputSchema,
	propertiesListSimilar: PropertiesListSimilarInputSchema,
	indicatorsPricePerMeter: PricePerMeterInputSchema,
	indicatorsPointsOfInterest: PointsOfInterestInputSchema,
	indicatorsLocations: LocationsInputSchema,
	indicatorsCities: CitiesInputSchema,
	searchesList: SearchesListInputSchema,
	searchesGet: SearchesGetInputSchema,
	searchesCreate: SearchesCreateInputSchema,
	searchesUpdate: SearchesUpdateInputSchema,
	searchesDelete: SearchesDeleteInputSchema,
	webhooksSimulate: WebhooksSimulateInputSchema,
} as const;

export const MeloEndpointOutputSchemas = {
	propertiesList: PropertyCollectionSchema,
	propertiesGet: PropertyDocumentSchema,
	propertiesListSimilar: PropertyCollectionSchema,
	indicatorsPricePerMeter: PricePerMeterResponseSchema,
	indicatorsPointsOfInterest: PointsOfInterestResponseSchema,
	indicatorsLocations: LocationsResponseSchema,
	indicatorsCities: CitiesResponseSchema,
	searchesList: SearchesListResponseSchema,
	searchesGet: SearchSchema,
	searchesCreate: SearchSchema,
	searchesUpdate: SearchSchema,
	searchesDelete: SearchesDeleteResponseSchema,
	webhooksSimulate: WebhooksSimulateResponseSchema,
} as const;
