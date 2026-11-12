import { z } from 'zod';

/**
 * Geoapify returns GeoJSON by default and can answer plain JSON or XML. Every
 * endpoint here asks for **JSON**, which keeps the response a typed object
 * instead of a geometry tree, and the schemas below describe that form.
 *
 * A GeoJSON `format` is still available on the endpoints that accept it, for a
 * caller that wants the geometry; the output schema then only promises the
 * fields both forms share.
 */

/** The gateway's error envelope, which every API shares. */
const GatewayErrorSchema = z.object({
	statusCode: z.number(),
	error: z.string(),
	message: z.string(),
});

/** One address result. Geoapify fills only the components that exist. */
const AddressSchema = z.object({
	/** The house number, street, city and so on, in one line. */
	formatted: z.string().optional(),
	address_line1: z.string().optional(),
	address_line2: z.string().optional(),
	name: z.string().optional(),
	housenumber: z.string().optional(),
	street: z.string().optional(),
	city: z.string().optional(),
	district: z.string().optional(),
	postcode: z.string().optional(),
	state: z.string().optional(),
	state_code: z.string().optional(),
	country: z.string().optional(),
	country_code: z.string().optional(),
	county: z.string().optional(),
	suburb: z.string().optional(),
	neighbourhood: z.string().optional(),
	region: z.string().optional(),
	lon: z.number(),
	lat: z.number(),
	/** The Geoapify place ID, which other APIs accept. */
	place_id: z.string().optional(),
	/** `building`, `street`, `city`, `country` and so on. */
	result_type: z.string().optional(),
	rank: z
		.object({
			confidence: z.number().optional(),
			confidence_city_level: z.number().optional(),
			match_type: z.string().optional(),
		})
		.optional(),
	bbox: z.array(z.number()).optional(),
	timezone: z
		.object({
			name: z.string().optional(),
			offset_STD: z.string().optional(),
			offset_STD_seconds: z.number().optional(),
			offset_DST: z.string().optional(),
			offset_DST_seconds: z.number().optional(),
			abbreviation_STD: z.string().optional(),
			abbreviation_DST: z.string().optional(),
		})
		.optional(),
});

const GeocodeResponseSchema = z.object({
	results: z.array(AddressSchema),
	/** The query the gateway understood, echoed back. */
	query: z
		.object({
			text: z.string().optional(),
			parsed: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
});

/** A place from the v2 places APIs: an address plus what is there. */
const PlaceSchema = AddressSchema.extend({
	place_id: z.string(),
	categories: z.array(z.string()).optional(),
	/** The primary category, such as `catering.restaurant`. */
	category: z.string().optional(),
	details: z.array(z.string()).optional(),
	website: z.string().optional(),
	phone: z.string().optional(),
	opening_hours: z.string().optional(),
	description: z.string().optional(),
	brand: z.string().optional(),
	operator: z.string().optional(),
	facility_type: z.string().optional(),
	datasource: z.record(z.string(), z.unknown()).optional(),
});

const PlacesResponseSchema = z.object({
	type: z.string().optional(),
	features: z.array(
		z.object({
			type: z.string().optional(),
			properties: PlaceSchema,
			geometry: z.record(z.string(), z.unknown()).optional(),
			bbox: z.array(z.number()).optional(),
		}),
	),
});

const RouteResultSchema = z.object({
	mode: z.string().optional(),
	units: z.string().optional(),
	/** Total distance, in the units the request asked for. */
	distance: z.number().optional(),
	/** Total time, in seconds. */
	time: z.number().optional(),
	distance_units: z.string().optional(),
	/** The geometry as an encoded polyline, when one was requested. */
	polyline5: z.string().optional(),
	polyline6: z.string().optional(),
	legs: z
		.array(
			z.object({
				distance: z.number().optional(),
				time: z.number().optional(),
				steps: z
					.array(
						z.object({
							distance: z.number().optional(),
							time: z.number().optional(),
							instruction: z.string().optional(),
							name: z.string().optional(),
							type: z.string().optional(),
							exit: z.number().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	toll: z.boolean().optional(),
	ferry: z.boolean().optional(),
	country_code: z.array(z.string()).optional(),
	geometry: z.record(z.string(), z.unknown()).optional(),
});

const RoutingResponseSchema = z.object({
	results: z.array(RouteResultSchema).optional(),
	properties: z.record(z.string(), z.unknown()).optional(),
	bbox: z.array(z.number()).optional(),
	type: z.string().optional(),
	features: z.array(z.record(z.string(), z.unknown())).optional(),
});

const IsolineResponseSchema = z.object({
	type: z.string().optional(),
	/** One feature per range, each carrying its own properties. */
	features: z.array(
		z.object({
			type: z.string().optional(),
			properties: z.record(z.string(), z.unknown()).optional(),
			geometry: z.record(z.string(), z.unknown()).optional(),
			bbox: z.array(z.number()).optional(),
		}),
	),
	bbox: z.array(z.number()).optional(),
	properties: z.record(z.string(), z.unknown()).optional(),
});

const MatrixResponseSchema = z.object({
	mode: z.string().optional(),
	units: z.string().optional(),
	distance_units: z.string().optional(),
	/** One row per source, one entry per target. */
	sources_to_targets: z.array(
		z.array(
			z.object({
				distance: z.number().optional(),
				time: z.number().optional(),
				/** Set when this pair has no route, such as across an ocean. */
				error: z.string().optional(),
			}),
		),
	),
	sources: z.array(z.record(z.string(), z.unknown())).optional(),
	targets: z.array(z.record(z.string(), z.unknown())).optional(),
});

const IpGeolocationResponseSchema = z.object({
	ip: z.string().optional(),
	city: z.record(z.string(), z.unknown()).optional(),
	continent: z.record(z.string(), z.unknown()).optional(),
	country: z.record(z.string(), z.unknown()).optional(),
	postal: z.record(z.string(), z.unknown()).optional(),
	state: z.record(z.string(), z.unknown()).optional(),
	location: z
		.object({
			latitude: z.number().optional(),
			longitude: z.number().optional(),
		})
		.optional(),
	subdivisions: z.array(z.record(z.string(), z.unknown())).optional(),
});

const TimezoneResponseSchema = z.object({
	at: z.string().optional(),
	lat: z.number().optional(),
	lon: z.number().optional(),
	tzdb_version: z.string().optional(),
	timezones: z.array(
		z.object({
			name: z.string(),
			/** Seconds from UTC, without daylight saving. */
			offset_STD_seconds: z.number().optional(),
			abbreviation_STD: z.string().optional(),
			offset_DST_seconds: z.number().optional(),
			abbreviation_DST: z.string().optional(),
			/** Whether daylight saving applies at the requested moment. */
			offset_at_request_seconds: z.number().optional(),
			abbreviation_at_request: z.string().optional(),
			offset_DST_at_request_seconds: z.number().optional(),
		}),
	),
});

const PostcodeItemSchema = z.object({
	postcode: z.string().optional(),
	country_code: z.string().optional(),
	lon: z.number().optional(),
	lat: z.number().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	state_code: z.string().optional(),
	district: z.string().optional(),
	suburb: z.string().optional(),
	place_id: z.string().optional(),
	formatted: z.string().optional(),
});

const PostcodeResponseSchema = z.object({
	results: z.array(PostcodeItemSchema),
	query: z.record(z.string(), z.unknown()).optional(),
});

const BoundariesResponseSchema = z.object({
	type: z.string().optional(),
	features: z.array(
		z.object({
			type: z.string().optional(),
			properties: z.record(z.string(), z.unknown()).optional(),
			geometry: z.record(z.string(), z.unknown()).optional(),
			bbox: z.array(z.number()).optional(),
		}),
	),
});

const ElevationResponseSchema = z.object({
	results: z.array(
		z.object({
			location: z
				.object({ lon: z.number().optional(), lat: z.number().optional() })
				.optional(),
			/** Metres, or feet when the request asked for imperial. */
			elevation: z.number(),
			units: z.string().optional(),
			/** Distance along the line, when one was requested. */
			distance: z.number().optional(),
		}),
	),
});

const RegionSchema = z
	.enum(['global', 'eu'])
	.optional()
	.describe(
		'`eu` sends the request to api-eu.geoapify.com, where processing stays in the European Union',
	);

const FormatSchema = z
	.enum(['json', 'geojson'])
	.optional()
	.describe(
		'Defaults to `json`. `geojson` returns the geometry too, which the schemas describe only loosely',
	);

const LangSchema = z
	.string()
	.min(2)
	.optional()
	.describe('An IETF language tag such as `en` or `de`, which localizes names');

const ForwardGeocodeInputSchema = z.object({
	text: z
		.string()
		.min(1, 'A text address is required')
		.describe(
			'The address or place to look up, such as `Berlin` or `10 Downing Street, London`',
		),
	type: z
		.enum([
			'country',
			'state',
			'city',
			'postcode',
			'street',
			'amenity',
			'locality',
		])
		.optional()
		.describe('Restricts the result to one kind of place'),
	lang: LangSchema,
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('How many results to return, at most 100'),
	countrycodes: z
		.array(z.string().length(2))
		.max(10)
		.optional()
		.describe('Restricts the search to these two-letter country codes'),
	filter: z
		.array(z.string())
		.optional()
		.describe(
			'A spatial filter such as `rect:13.3,52.4,13.5,52.6` or `countrycode:de`',
		),
	bias: z
		.array(z.string())
		.optional()
		.describe(
			'Bias results toward a point or area without excluding anything, such as `proximity:13.4,52.5`',
		),
	format: FormatSchema,
	region: RegionSchema,
});

const ReverseGeocodeInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude of the point'),
	lon: z.number().min(-180).max(180).describe('Longitude of the point'),
	type: z
		.enum([
			'country',
			'state',
			'city',
			'postcode',
			'street',
			'amenity',
			'locality',
		])
		.optional()
		.describe('Restricts the result to one kind of place'),
	lang: LangSchema,
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('At most 100 results'),
	countrycodes: z
		.array(z.string().length(2))
		.max(10)
		.optional()
		.describe('Restricts the result to these two-letter country codes'),
	format: FormatSchema,
	region: RegionSchema,
});

const AutocompleteInputSchema = z.object({
	text: z
		.string()
		.min(1, 'A partial address is required')
		.describe('The partial address as the user types'),
	type: z
		.enum([
			'country',
			'state',
			'city',
			'postcode',
			'street',
			'amenity',
			'locality',
		])
		.optional()
		.describe('Restricts the result to one kind of place'),
	lang: LangSchema,
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('At most 100 results'),
	countrycodes: z
		.array(z.string().length(2))
		.max(10)
		.optional()
		.describe('Restricts the suggestions to these two-letter country codes'),
	filter: z.array(z.string()).optional().describe('A spatial filter'),
	bias: z
		.array(z.string())
		.optional()
		.describe('Biases toward a point or area'),
	format: FormatSchema,
	region: RegionSchema,
});

const PlacesInputSchema = z.object({
	categories: z
		.array(z.string().min(1))
		.min(1, 'At least one category is required')
		.describe(
			'What to look for, such as `catering.restaurant`, `accommodation.hotel` or `commercial.supermarket`',
		),
	filter: z
		.string()
		.optional()
		.describe(
			'Where to look, such as a `circle:lon,lat,radius`, a `rect:lon1,lat1,lon2,lat2` or a `place:` ID',
		),
	bias: z.string().optional().describe('Bias results toward a point or area'),
	conditions: z
		.array(z.string())
		.optional()
		.describe('Extra conditions such as `named`, `website` or `opening_hours`'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(500)
		.optional()
		.describe('At most 500 places'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Skips this many results'),
	lang: LangSchema,
	name: z.string().optional().describe('Filters by a place name'),
	region: RegionSchema,
});

const PlaceDetailsInputSchema = z.object({
	id: z
		.string()
		.min(1, 'A place ID is required')
		.describe('The `place_id` of a place, as returned by `places.search`'),
	lang: LangSchema,
	region: RegionSchema,
});

const RoutingInputSchema = z.object({
	waypoints: z
		.array(z.string().min(1))
		.min(2, 'A route needs at least a start and an end')
		.describe(
			'The points to route through, as `lat,lon` pairs, such as `52.5,13.4|52.6,13.5`',
		),
	mode: z
		.enum([
			'drive',
			'truck',
			'light_truck',
			'bicycle',
			'mountain_bike',
			'road_bike',
			'scooter',
			'walk',
			'hike',
			'motorcycle',
			'bus',
			'approx_transit',
			'transit',
		])
		.describe('How to travel, which decides the roads and paths used'),
	type: z
		.enum(['balanced', 'short', 'less_maneuvers'])
		.optional()
		.describe('What to optimize for; balanced is the default'),
	units: z
		.enum(['metric', 'imperial'])
		.optional()
		.describe('Units of the answer'),
	lang: LangSchema,
	avoid: z
		.array(z.string())
		.optional()
		.describe('Features to avoid, such as `tollways`, `ferries` or `highways`'),
	details: z
		.array(z.string())
		.optional()
		.describe('Extras to include, such as `instruction` or `elevation`'),
	traffic: z
		.enum(['free_flow', 'approximated'])
		.optional()
		.describe('How to account for traffic'),
	max_speed: z.number().optional().describe('A speed cap for the route'),
	format: z
		.enum(['json', 'geojson'])
		.optional()
		.describe('Defaults to `json` here; `geojson` adds the route geometry'),
	region: RegionSchema,
});

const IsolineInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude of the center'),
	lon: z.number().min(-180).max(180).describe('Longitude of the center'),
	type: z
		.enum(['time', 'distance'])
		.describe('Whether each range is a number of seconds or a distance'),
	range: z
		.array(z.number())
		.min(1, 'At least one range is required')
		.describe('The ranges to draw, such as `[300, 600, 900]`'),
	mode: z
		.enum(['drive', 'truck', 'bicycle', 'scooter', 'walk', 'hike'])
		.optional()
		.describe('How to travel; drive is the default'),
	units: z
		.enum(['metric', 'imperial'])
		.optional()
		.describe('Units of the answer'),
	avoid: z.array(z.string()).optional().describe('Features to avoid'),
	traffic: z
		.enum(['free_flow', 'approximated'])
		.optional()
		.describe('How to account for traffic'),
	max_speed: z.number().optional().describe('A speed cap'),
	region: RegionSchema,
});

const RouteMatrixInputSchema = z.object({
	mode: z
		.enum([
			'drive',
			'truck',
			'light_truck',
			'bicycle',
			'mountain_bike',
			'road_bike',
			'scooter',
			'walk',
			'hike',
			'motorcycle',
			'bus',
		])
		.describe('How to travel, which decides every cell of the matrix'),
	sources: z
		.array(z.string().min(1))
		.min(1, 'At least one source is required')
		.describe('Starting points as `lat,lon` pairs, one row each'),
	targets: z
		.array(z.string().min(1))
		.min(1, 'At least one target is required')
		.describe('Destination points as `lat,lon` pairs, one column each'),
	type: z
		.enum(['balanced', 'short', 'less_maneuvers'])
		.optional()
		.describe('What to optimize for'),
	units: z
		.enum(['metric', 'imperial'])
		.optional()
		.describe('Units of the answer'),
	avoid: z.array(z.string()).optional().describe('Features to avoid'),
	traffic: z
		.enum(['free_flow', 'approximated'])
		.optional()
		.describe('How to account for traffic'),
	max_speed: z.number().optional().describe('A speed cap'),
});

const IpGeolocationInputSchema = z.object({
	ip: z
		.string()
		.optional()
		.describe(
			'The IPv4 or IPv6 address to locate. Without one, Geoapify locates the caller',
		),
	lang: LangSchema,
	region: RegionSchema,
});

const TimezoneInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude of the point'),
	lon: z.number().min(-180).max(180).describe('Longitude of the point'),
	at: z
		.string()
		.optional()
		.describe(
			'An ISO 8601 timestamp, such as `2026-11-12T09:16:00Z`, which decides whether daylight saving applies',
		),
	region: RegionSchema,
});

const PostcodeSearchInputSchema = z.object({
	postcode: z.string().min(1).describe('The postcode to look up'),
	countrycode: z
		.string()
		.length(2)
		.optional()
		.describe('The country the postcode belongs to, which sharpens the result'),
	lat: z
		.number()
		.min(-90)
		.max(90)
		.optional()
		.describe('Biases toward this point'),
	lon: z
		.number()
		.min(-180)
		.max(180)
		.optional()
		.describe('Biases toward this point'),
	lang: LangSchema,
	region: RegionSchema,
});

const PostcodeListInputSchema = z.object({
	text: z
		.string()
		.min(1, 'A postcode prefix is required')
		.describe('A postcode or a prefix, such as `1011`'),
	countrycode: z
		.string()
		.length(2)
		.optional()
		.describe('Restricts to one country'),
	filter: z.array(z.string()).optional().describe('A spatial filter'),
	bias: z
		.array(z.string())
		.optional()
		.describe('Biases toward a point or area'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('At most 100 results'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Skips this many results'),
	lang: LangSchema,
	region: RegionSchema,
});

const BoundariesInputSchema = z
	.object({
		id: z
			.string()
			.optional()
			.describe('A place ID, such as the one a geocode result returned'),
		lat: z.number().min(-90).max(90).optional().describe('Latitude of a point'),
		lon: z
			.number()
			.min(-180)
			.max(180)
			.optional()
			.describe('Longitude of a point'),
		osm_id: z.number().optional().describe('An OpenStreetMap ID'),
		osm_type: z
			.enum(['N', 'W', 'R'])
			.optional()
			.describe('The OSM type that goes with `osm_id`: node, way or relation'),
		boundaries: z
			.array(z.string())
			.optional()
			.describe(
				'Which levels to return, such as `postal_code`, `city` or `country`',
			),
		lang: LangSchema,
		region: RegionSchema,
	})
	.describe(
		'Identify the place by `id`, by a `lat`/`lon` pair, or by `osm_id` with `osm_type`',
	);

const ElevationInputSchema = z.object({
	locations: z
		.array(z.object({ lat: z.number(), lon: z.number() }))
		.min(1, 'At least one location is required')
		.describe('The points to sample, in order'),
	units: z
		.enum(['metric', 'imperial'])
		.optional()
		.describe('Metres or feet; metric is the default'),
	region: RegionSchema,
});

export type GeoapifyForwardGeocodeInput = z.infer<
	typeof ForwardGeocodeInputSchema
>;
export type GeoapifyReverseGeocodeInput = z.infer<
	typeof ReverseGeocodeInputSchema
>;
export type GeoapifyAutocompleteInput = z.infer<typeof AutocompleteInputSchema>;
export type GeoapifyPlacesInput = z.infer<typeof PlacesInputSchema>;
export type GeoapifyPlaceDetailsInput = z.infer<typeof PlaceDetailsInputSchema>;
export type GeoapifyRoutingInput = z.infer<typeof RoutingInputSchema>;
export type GeoapifyIsolineInput = z.infer<typeof IsolineInputSchema>;
export type GeoapifyRouteMatrixInput = z.infer<typeof RouteMatrixInputSchema>;
export type GeoapifyIpGeolocationInput = z.infer<
	typeof IpGeolocationInputSchema
>;
export type GeoapifyTimezoneInput = z.infer<typeof TimezoneInputSchema>;
export type GeoapifyPostcodeSearchInput = z.infer<
	typeof PostcodeSearchInputSchema
>;
export type GeoapifyPostcodeListInput = z.infer<typeof PostcodeListInputSchema>;
export type GeoapifyBoundariesInput = z.infer<typeof BoundariesInputSchema>;
export type GeoapifyElevationInput = z.infer<typeof ElevationInputSchema>;

export type GeoapifyGeocodeResponse = z.infer<typeof GeocodeResponseSchema>;
export type GeoapifyPlacesResponse = z.infer<typeof PlacesResponseSchema>;
export type GeoapifyRoutingResponse = z.infer<typeof RoutingResponseSchema>;
export type GeoapifyIsolineResponse = z.infer<typeof IsolineResponseSchema>;
export type GeoapifyRouteMatrixResponse = z.infer<typeof MatrixResponseSchema>;
export type GeoapifyIpGeolocationResponse = z.infer<
	typeof IpGeolocationResponseSchema
>;
export type GeoapifyTimezoneResponse = z.infer<typeof TimezoneResponseSchema>;
export type GeoapifyPostcodeResponse = z.infer<typeof PostcodeResponseSchema>;
export type GeoapifyBoundariesResponse = z.infer<
	typeof BoundariesResponseSchema
>;
export type GeoapifyElevationResponse = z.infer<typeof ElevationResponseSchema>;
export type GeoapifyAddress = z.infer<typeof AddressSchema>;
export type GeoapifyPlace = z.infer<typeof PlaceSchema>;
export type GeoapifyGatewayError = z.infer<typeof GatewayErrorSchema>;

export type GeoapifyEndpointInputs = {
	forwardGeocode: GeoapifyForwardGeocodeInput;
	reverseGeocode: GeoapifyReverseGeocodeInput;
	autocomplete: GeoapifyAutocompleteInput;
	placesSearch: GeoapifyPlacesInput;
	placeDetails: GeoapifyPlaceDetailsInput;
	routing: GeoapifyRoutingInput;
	isoline: GeoapifyIsolineInput;
	routeMatrix: GeoapifyRouteMatrixInput;
	ipGeolocation: GeoapifyIpGeolocationInput;
	timezone: GeoapifyTimezoneInput;
	postcodeSearch: GeoapifyPostcodeSearchInput;
	postcodeList: GeoapifyPostcodeListInput;
	boundaries: GeoapifyBoundariesInput;
	elevation: GeoapifyElevationInput;
};

export type GeoapifyEndpointOutputs = {
	forwardGeocode: GeoapifyGeocodeResponse;
	reverseGeocode: GeoapifyGeocodeResponse;
	autocomplete: GeoapifyGeocodeResponse;
	placesSearch: GeoapifyPlacesResponse;
	placeDetails: GeoapifyPlacesResponse;
	routing: GeoapifyRoutingResponse;
	isoline: GeoapifyIsolineResponse;
	routeMatrix: GeoapifyRouteMatrixResponse;
	ipGeolocation: GeoapifyIpGeolocationResponse;
	timezone: GeoapifyTimezoneResponse;
	postcodeSearch: GeoapifyPostcodeResponse;
	postcodeList: GeoapifyPostcodeResponse;
	boundaries: GeoapifyBoundariesResponse;
	elevation: GeoapifyElevationResponse;
};

export const GeoapifyEndpointInputSchemas = {
	forwardGeocode: ForwardGeocodeInputSchema,
	reverseGeocode: ReverseGeocodeInputSchema,
	autocomplete: AutocompleteInputSchema,
	placesSearch: PlacesInputSchema,
	placeDetails: PlaceDetailsInputSchema,
	routing: RoutingInputSchema,
	isoline: IsolineInputSchema,
	routeMatrix: RouteMatrixInputSchema,
	ipGeolocation: IpGeolocationInputSchema,
	timezone: TimezoneInputSchema,
	postcodeSearch: PostcodeSearchInputSchema,
	postcodeList: PostcodeListInputSchema,
	boundaries: BoundariesInputSchema,
	elevation: ElevationInputSchema,
} as const;

export const GeoapifyEndpointOutputSchemas = {
	forwardGeocode: GeocodeResponseSchema,
	reverseGeocode: GeocodeResponseSchema,
	autocomplete: GeocodeResponseSchema,
	placesSearch: PlacesResponseSchema,
	placeDetails: PlacesResponseSchema,
	routing: RoutingResponseSchema,
	isoline: IsolineResponseSchema,
	routeMatrix: MatrixResponseSchema,
	ipGeolocation: IpGeolocationResponseSchema,
	timezone: TimezoneResponseSchema,
	postcodeSearch: PostcodeResponseSchema,
	postcodeList: PostcodeResponseSchema,
	boundaries: BoundariesResponseSchema,
	elevation: ElevationResponseSchema,
} as const;
