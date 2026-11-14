import { z } from 'zod';

/**
 * Geoapify returns GeoJSON by default and can answer plain JSON or XML. Every
 * endpoint here asks for **JSON**, which keeps the response a typed object
 * instead of a geometry tree, and the schemas below describe that form.
 *
 * Only routing still offers `format: 'geojson'`, for a caller that wants the
 * route as GeoJSON features; its output schema covers both forms. Geocoding
 * always asks for JSON, since its GeoJSON form has no `results` array.
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
	/** The result's extent. The json format answers it as two corners. */
	bbox: z
		.object({
			lon1: z.number(),
			lat1: z.number(),
			lon2: z.number(),
			lat2: z.number(),
		})
		.optional(),
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
			// unknown: the parsed parts of the query differ per query (street,
			// city, expected_type and so on), so they stay an open record.
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
	/** Phone, email and fax from the place's OpenStreetMap tags, when known. */
	contact: z
		.object({
			phone: z.string().optional(),
			email: z.string().optional(),
			fax: z.string().optional(),
		})
		// Geoapify adds other contact fields (such as `phone_other`) per place.
		.passthrough()
		.optional(),
	opening_hours: z.string().optional(),
	description: z.string().optional(),
	brand: z.string().optional(),
	operator: z.string().optional(),
	facility_type: z.string().optional(),
	// unknown: the OpenStreetMap source record, whose raw tags differ per place.
	datasource: z.record(z.string(), z.unknown()).optional(),
});

const PlacesResponseSchema = z.object({
	type: z.string().optional(),
	features: z.array(
		z.object({
			type: z.string().optional(),
			properties: PlaceSchema,
			// unknown: a GeoJSON geometry (Point, Polygon and so on), whose
			// coordinates nest differently per type.
			geometry: z.record(z.string(), z.unknown()).optional(),
			bbox: z.array(z.number()).optional(),
		}),
	),
});

/** One maneuver. A live route answers it as an object, not a string. */
const RouteInstructionSchema = z.object({
	text: z.string().optional(),
	type: z.string().optional(),
	transition_instruction: z.string().optional(),
	pre_transition_instruction: z.string().optional(),
	post_transition_instruction: z.string().optional(),
	streets: z.array(z.string()).optional(),
});

/** A point of the route line in the json format. */
const RoutePointSchema = z.object({ lat: z.number(), lon: z.number() });

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
	waypoints: z
		.array(
			z.object({
				/** `[lon, lat]`, snapped to the road network. */
				location: z.array(z.number()).optional(),
				original_index: z.number().optional(),
			}),
		)
		.optional(),
	legs: z
		.array(
			z
				.object({
					distance: z.number().optional(),
					time: z.number().optional(),
					steps: z
						.array(
							z
								.object({
									distance: z.number().optional(),
									time: z.number().optional(),
									/** Indexes into the leg's geometry. */
									from_index: z.number().optional(),
									to_index: z.number().optional(),
									instruction: RouteInstructionSchema.optional(),
									name: z.string().optional(),
									toll: z.boolean().optional(),
									ferry: z.boolean().optional(),
								})
								// `details: ['route_details']` adds surface, speed limit and
								// other per-step fields that differ by road.
								.passthrough(),
						)
						.optional(),
					/** Meters above sea level along the leg, with `details: ['elevation']`. */
					elevation: z.array(z.number()).optional(),
					/** `[distance from leg start, elevation]` pairs, with `details: ['elevation']`. */
					elevation_range: z.array(z.array(z.number())).optional(),
				})
				// Other `details` (country and administrative areas) add per-leg
				// fields that differ by request.
				.passthrough(),
		)
		.optional(),
	toll: z.boolean().optional(),
	ferry: z.boolean().optional(),
	country_code: z.array(z.string()).optional(),
	/** One line per leg, each a list of points, in the json format. */
	geometry: z.array(z.array(RoutePointSchema)).optional(),
});

const RoutingResponseSchema = z.object({
	/** Set in the json format, one per route. */
	results: z.array(RouteResultSchema).optional(),
	// unknown: the request echoed back (mode, waypoints, units), whose fields
	// follow the request rather than a fixed shape.
	properties: z.record(z.string(), z.unknown()).optional(),
	bbox: z.array(z.number()).optional(),
	type: z.string().optional(),
	// unknown: set in the geojson format instead of `results`; each feature is a
	// GeoJSON route whose geometry nests by type.
	features: z.array(z.record(z.string(), z.unknown())).optional(),
});

const IsolineResponseSchema = z.object({
	type: z.string().optional(),
	/** One feature per range, each carrying its own properties. */
	features: z.array(
		z.object({
			type: z.string().optional(),
			// unknown: the isoline's own request echo (range, mode, id and so on).
			properties: z.record(z.string(), z.unknown()).optional(),
			// unknown: a GeoJSON Polygon or MultiPolygon.
			geometry: z.record(z.string(), z.unknown()).optional(),
			bbox: z.array(z.number()).optional(),
		}),
	),
	bbox: z.array(z.number()).optional(),
	/**
	 * A slow calculation answers 202 with no features and only `id` here; call
	 * `routing.isoline` again with that `id` to read the result.
	 */
	properties: z.object({ id: z.string().optional() }).passthrough().optional(),
});

/** A matrix point: where it was asked for and where it snapped to a road. */
const MatrixPointSchema = z.object({
	/** `[lon, lat]` as sent. */
	original_location: z.array(z.number()).optional(),
	/** `[lon, lat]` on the road network. */
	location: z.array(z.number()).optional(),
});

const MatrixResponseSchema = z.object({
	mode: z.string().optional(),
	units: z.string().optional(),
	distance_units: z.string().optional(),
	/** One row per source, one entry per target. */
	sources_to_targets: z.array(
		z.array(
			z.object({
				/** `null` when this pair has no route, such as across an ocean. */
				distance: z.number().nullable().optional(),
				/** `null` when this pair has no route. */
				time: z.number().nullable().optional(),
				source_index: z.number().optional(),
				target_index: z.number().optional(),
			}),
		),
	),
	sources: z.array(MatrixPointSchema).optional(),
	targets: z.array(MatrixPointSchema).optional(),
});

// unknown: each block (city, country and so on) carries names in a varying set
// of languages and extra fields per country, so they stay open records.
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
			/** The IANA name, such as `Europe/Berlin`. */
			name: z.string(),
			/** `standard` or `daylightSaving` at the requested moment. */
			type: z.string().optional(),
			/** Such as `+02:00`. */
			utc_offset: z.string().optional(),
			offset_seconds: z.number().optional(),
			/** Such as `CEST`. */
			abbreviation: z.string().optional(),
			/** The wall-clock time at the point, with its offset. */
			local_time: z.string().optional(),
			/** The next daylight saving change, when the zone has one. */
			next_transition: z
				.object({
					at: z.string().optional(),
					// unknown: the offset before and after the change, the same
					// fields as above.
					before: z.record(z.string(), z.unknown()).optional(),
					after: z.record(z.string(), z.unknown()).optional(),
					offset_change_seconds: z.number().optional(),
					kind: z.string().optional(),
				})
				// Documented as null when no change is known in the bundled range.
				.nullish(),
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
	// unknown: the query echoed back, whose fields follow the request.
	query: z.record(z.string(), z.unknown()).optional(),
});

const BoundariesResponseSchema = z.object({
	type: z.string().optional(),
	features: z.array(
		z.object({
			type: z.string().optional(),
			// unknown: a place record whose fields differ per boundary level.
			properties: z.record(z.string(), z.unknown()).optional(),
			// unknown: a GeoJSON Point or Polygon, by the requested geometry.
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
			/**
			 * Metres, or feet when the request asked for imperial. `null` where the
			 * terrain service has no value.
			 */
			elevation: z.number().nullable(),
			/** `m` or `ft`. */
			units: z.string().optional(),
			/** Distance along the line, when one was requested. */
			distance: z.number().nullable().optional(),
		}),
	),
});

const RegionSchema = z
	.enum(['global', 'eu'])
	.optional()
	.describe(
		'`eu` sends the request to api-eu.geoapify.com, where processing stays in the European Union',
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
			'building',
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
			'The points to route through, one `lat,lon` pair per entry, such as `["52.5163,13.3777", "52.52,13.405"]`',
		),
	mode: z
		.enum([
			'drive',
			'light_truck',
			'medium_truck',
			'truck',
			'heavy_truck',
			'truck_dangerous_goods',
			'long_truck',
			'bus',
			'scooter',
			'motorcycle',
			'bicycle',
			'mountain_bike',
			'road_bike',
			'walk',
			'hike',
			'transit',
			'approximated_transit',
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
		.array(
			z.enum([
				'instruction_details',
				'route_details',
				'elevation',
				'admin_areas',
				'polyline5',
				'polyline6',
			]),
		)
		.optional()
		.describe(
			'Extras to include, such as `instruction_details` (maneuver details) or `elevation`',
		),
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

const IsolineInputSchema = z
	.object({
		id: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The `properties.id` of an earlier isoline. A slow calculation answers with no areas and only this ID; call again with it alone to read the result',
			),
		lat: z
			.number()
			.min(-90)
			.max(90)
			.optional()
			.describe('Latitude of the center'),
		lon: z
			.number()
			.min(-180)
			.max(180)
			.optional()
			.describe('Longitude of the center'),
		type: z
			.enum(['time', 'distance'])
			.optional()
			.describe(
				'Whether each range is a number of seconds (at most 3600) or metres (at most 100000)',
			),
		range: z
			.array(z.number().positive())
			.min(1, 'At least one range is required')
			.max(10)
			.optional()
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
	})
	.refine(
		(input) =>
			input.id !== undefined ||
			(input.lat !== undefined &&
				input.lon !== undefined &&
				input.type !== undefined &&
				input.range !== undefined),
		{
			message:
				'Give `lat`, `lon`, `type` and `range` for a new isoline, or the `id` of an earlier one',
		},
	);

/** Geoapify takes `{ location: [lon, lat] }`; the plugin builds that from these. */
const MatrixLocationSchema = z.object({
	lat: z.number().min(-90).max(90),
	lon: z.number().min(-180).max(180),
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
		.array(MatrixLocationSchema)
		.min(1, 'At least one source is required')
		.describe('Starting points, one row each'),
	targets: z
		.array(MatrixLocationSchema)
		.min(1, 'At least one target is required')
		.describe('Destination points, one column each'),
	type: z
		.enum(['balanced', 'short', 'less_maneuvers'])
		.optional()
		.describe('What to optimize for'),
	units: z
		.enum(['metric', 'imperial'])
		.optional()
		.describe('Units of the answer'),
	avoid: z
		.array(z.enum(['tolls', 'ferries', 'highways']))
		.optional()
		.describe('Road types to avoid'),
	traffic: z
		.enum(['free_flow', 'approximated'])
		.optional()
		.describe('How to account for traffic'),
	max_speed: z.number().optional().describe('A speed cap'),
	region: RegionSchema,
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

const PostcodeSearchInputSchema = z
	.object({
		postcode: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The postcode to look up. Leave it out to search by `lat`/`lon`',
			),
		countrycode: z
			.string()
			.length(2)
			.optional()
			.describe(
				'The country the postcode belongs to, which sharpens the result',
			),
		lat: z
			.number()
			.min(-90)
			.max(90)
			.optional()
			.describe('Finds the postcode at this point, instead of by `postcode`'),
		lon: z
			.number()
			.min(-180)
			.max(180)
			.optional()
			.describe('Finds the postcode at this point, instead of by `postcode`'),
		lang: LangSchema,
		region: RegionSchema,
	})
	.refine(
		(input) =>
			(input.postcode !== undefined) !==
			(input.lat !== undefined && input.lon !== undefined),
		{
			message: 'Give either `postcode` or both `lat` and `lon`, not both',
		},
	);

const PostcodeListInputSchema = z.object({
	text: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A postcode or a prefix, such as `1011`. Optional when a `filter` or `countrycode` narrows the list',
		),
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
		.max(500)
		.optional()
		.describe('At most 500 results'),
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
			.enum(['n', 'w', 'r'])
			.optional()
			.describe(
				'The OSM type that goes with `osm_id`: `n` node, `w` way or `r` relation',
			),
		boundaries: z
			.array(z.string())
			.optional()
			.describe(
				'Which boundary kinds to return, such as `administrative` (the default) or `postal_code`',
			),
		lang: LangSchema,
		region: RegionSchema,
	})
	.refine(
		(input) =>
			input.id !== undefined ||
			(input.lat !== undefined && input.lon !== undefined) ||
			(input.osm_id !== undefined && input.osm_type !== undefined),
		{
			message:
				'Identify the place by `id`, by a `lat`/`lon` pair, or by `osm_id` with `osm_type`',
		},
	)
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
