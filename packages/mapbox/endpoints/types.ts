import { z } from 'zod';

// Response bodies below were read from the live API on 2026-11-10, not copied
// from the docs. Every output object is `.loose()` so a field Mapbox adds
// later still reaches the caller, and every optional field is `.nullish()`.

// ── Shared building blocks ────────────────────────────────────────────────

export const MAPBOX_PROFILES = [
	'mapbox/driving-traffic',
	'mapbox/driving',
	'mapbox/walking',
	'mapbox/cycling',
] as const;

const ProfileSchema = z
	.enum(MAPBOX_PROFILES)
	.describe(
		'Routing profile: mapbox/driving-traffic (live and historic traffic, falls back to driving where there is no traffic data), mapbox/driving, mapbox/walking or mapbox/cycling.',
	);

const LongitudeSchema = z
	.number()
	.min(-180)
	.max(180)
	.describe('Longitude in decimal degrees, -180 to 180.');

const LatitudeSchema = z
	.number()
	.min(-90)
	.max(90)
	.describe('Latitude in decimal degrees, -90 to 90.');

/**
 * Mapbox takes longitude first everywhere in URLs. The plugin takes named
 * fields so a caller cannot swap them by position.
 */
const CoordinateSchema = z.object({
	longitude: LongitudeSchema,
	latitude: LatitudeSchema,
});

export type MapboxCoordinate = z.infer<typeof CoordinateSchema>;

const LanguageSchema = z
	.string()
	.regex(
		/^[A-Za-z]{2,3}(-[A-Za-z0-9]+)*(,[A-Za-z]{2,3}(-[A-Za-z0-9]+)*)*$/,
		'Use IETF language tags such as en or fr-CA, comma-separated for several.',
	);

const CountrySchema = z
	.array(z.string().regex(/^[A-Za-z]{2}$/, 'Use ISO 3166 alpha-2 codes.'))
	.min(1)
	.describe('Limit results to these ISO 3166 alpha-2 country codes.');

const GeocodingTypeSchema = z.enum([
	'country',
	'region',
	'postcode',
	'district',
	'place',
	'locality',
	'neighborhood',
	'street',
	'address',
	'secondary_address',
]);

const WorldviewSchema = z
	.enum(['us', 'cl', 'cn', 'in', 'jp', 'ar', 'ma', 'rs', 'ru', 'tr', 'twc'])
	.describe('Which regional view of disputed boundaries to return.');

const PointGeometrySchema = z
	.object({
		type: z.string(),
		coordinates: z.array(z.number()),
	})
	.loose();

/** A GeoJSON LineString, Polygon or MultiPolygon coordinate array. */
const GeoCoordinatesSchema = z.union([
	z.array(z.array(z.number())),
	z.array(z.array(z.array(z.number()))),
	z.array(z.array(z.array(z.array(z.number())))),
]);

export const MAPBOX_DRIVING_PROFILES: readonly string[] = [
	'mapbox/driving-traffic',
	'mapbox/driving',
];

// What Mapbox accepts for `exclude`, per profile. The live API answers 422 for
// a value the profile does not support (walking with toll), except on
// isochrones, where it silently ignores one.
const ROUTING_EXCLUDE_VALUES = [
	'motorway',
	'toll',
	'ferry',
	'unpaved',
	'cash_only_tolls',
] as const;

const ExcludeSchema = z.enum(ROUTING_EXCLUDE_VALUES);

const WALKING_EXCLUDE: readonly string[] = ['ferry', 'cash_only_tolls'];
const CYCLING_EXCLUDE: readonly string[] = [
	'ferry',
	'cash_only_tolls',
	'unpaved',
];

export function excludeAllowedFor(profile: string, value: string): boolean {
	if (MAPBOX_DRIVING_PROFILES.includes(profile)) return true;
	if (profile === 'mapbox/walking') return WALKING_EXCLUDE.includes(value);
	return CYCLING_EXCLUDE.includes(value);
}

const GeometriesSchema = z
	.enum(['geojson', 'polyline', 'polyline6'])
	.describe(
		'Geometry encoding: polyline (default, precision 5), polyline6 (precision 6) or geojson (a LineString).',
	);

const OverviewSchema = z
	.enum(['full', 'simplified', 'false'])
	.describe(
		'Route overview geometry: simplified (default), full, or false for none.',
	);

// ── Navigation outputs shared by directions and trips ─────────────────────

const WaypointSchema = z
	.object({
		name: z.string(),
		location: z.array(z.number()).length(2),
		distance: z.number().nullish(),
		waypoint_index: z.number().nullish(),
		trips_index: z.number().nullish(),
	})
	.loose();

const RouteGeometrySchema = z.union([
	z.string(),
	z.object({ type: z.string(), coordinates: GeoCoordinatesSchema }).loose(),
]);

const RouteStepSchema = z
	.object({
		distance: z.number(),
		duration: z.number(),
		name: z.string().nullish(),
		mode: z.string().nullish(),
		geometry: RouteGeometrySchema.nullish(),
		maneuver: z
			.object({
				location: z.array(z.number()).nullish(),
				type: z.string().nullish(),
				instruction: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const RouteAnnotationSchema = z
	.object({
		duration: z.array(z.number()).nullish(),
		distance: z.array(z.number()).nullish(),
		speed: z.array(z.number()).nullish(),
		congestion: z.array(z.string()).nullish(),
		congestion_numeric: z.array(z.number().nullable()).nullish(),
	})
	.loose();

const RouteLegSchema = z
	.object({
		steps: z.array(RouteStepSchema).nullish(),
		summary: z.string().nullish(),
		distance: z.number(),
		duration: z.number(),
		weight: z.number().nullish(),
		annotation: RouteAnnotationSchema.nullish(),
	})
	.loose();

const RouteSchema = z
	.object({
		geometry: RouteGeometrySchema.nullish(),
		distance: z.number(),
		duration: z.number(),
		weight: z.number().nullish(),
		weight_name: z.string().nullish(),
		legs: z.array(RouteLegSchema),
	})
	.loose();

// ── Shared input rules for routing options ────────────────────────────────

type RoutingOptions = {
	profile: (typeof MAPBOX_PROFILES)[number];
	annotations?: readonly string[];
	overview?: string;
	steps?: boolean;
	language?: string;
	exclude?: readonly string[];
};

const TRAFFIC_ONLY_ANNOTATIONS = [
	'congestion',
	'congestion_numeric',
	'closure',
];
const DRIVING_ONLY_ANNOTATIONS = ['maxspeed'];

/**
 * Mapbox answers 200 and drops an option it cannot honour. These are the
 * documented dependencies, rejected here so a caller is not told an annotation
 * or a language applied when it did not.
 */
function refineRoutingOptions(
	value: RoutingOptions,
	ctx: z.RefinementCtx,
): void {
	if (value.annotations && value.overview !== 'full') {
		ctx.addIssue({
			code: 'custom',
			path: ['annotations'],
			message: 'annotations only apply with overview: "full".',
		});
	}
	for (const annotation of value.annotations ?? []) {
		if (
			TRAFFIC_ONLY_ANNOTATIONS.includes(annotation) &&
			value.profile !== 'mapbox/driving-traffic'
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['annotations'],
				message: `${annotation} is only available for mapbox/driving-traffic.`,
			});
		}
		if (
			DRIVING_ONLY_ANNOTATIONS.includes(annotation) &&
			!MAPBOX_DRIVING_PROFILES.includes(value.profile)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['annotations'],
				message: `${annotation} is only available for the driving profiles.`,
			});
		}
	}
	if (value.language !== undefined && value.steps !== true) {
		ctx.addIssue({
			code: 'custom',
			path: ['language'],
			message: 'language only applies with steps: true.',
		});
	}
	for (const item of value.exclude ?? []) {
		if (!excludeAllowedFor(value.profile, item)) {
			ctx.addIssue({
				code: 'custom',
				path: ['exclude'],
				message: `exclude "${item}" is not supported for ${value.profile}.`,
			});
		}
	}
}

// ── geocoding.forward ─────────────────────────────────────────────────────

const GEOCODING_QUERY_MAX_TOKENS = 20;

const GeocodingForwardInputSchema = z.object({
	q: z
		.string()
		.max(256)
		.refine((value) => value.trim().length > 0, 'q must not be blank.')
		.refine((value) => !value.includes(';'), 'q must not contain a semicolon.')
		.refine(
			(value) =>
				value.split(/[\s\p{P}\p{S}]+/u).filter(Boolean).length <=
				GEOCODING_QUERY_MAX_TOKENS,
			`q can hold at most ${GEOCODING_QUERY_MAX_TOKENS} words and numbers.`,
		)
		.describe(
			'Search text: an address, place name or similar. At most 256 characters and 20 words or numbers, no semicolons.',
		),
	autocomplete: z
		.boolean()
		.optional()
		.describe(
			'Return results that start with the text (true, the default) or only exact matches (false). Each autocomplete keystroke counts as a request.',
		),
	bbox: z
		.tuple([LongitudeSchema, LatitudeSchema, LongitudeSchema, LatitudeSchema])
		.refine(
			([minLon, minLat, maxLon, maxLat]) =>
				minLon <= maxLon && minLat <= maxLat,
			'bbox must be [minLongitude, minLatitude, maxLongitude, maxLatitude].',
		)
		.optional()
		.describe(
			'Limit results to this box, as [minLongitude, minLatitude, maxLongitude, maxLatitude]. It cannot cross the 180th meridian.',
		),
	country: CountrySchema.optional(),
	language: LanguageSchema.optional().describe(
		'Language of the response text as an IETF tag such as en or fr-CA; comma-separate several.',
	),
	limit: z
		.number()
		.int()
		.min(1)
		.max(10)
		.optional()
		.describe(
			'Maximum results, 1 to 10. Defaults to 5. Mapbox ignores a value outside that range without an error, so the plugin rejects it.',
		),
	proximity: z
		.union([z.literal('ip'), CoordinateSchema])
		.optional()
		.describe(
			'Bias results toward a location: { longitude, latitude }, or "ip" to bias by the caller\'s IP address.',
		),
	types: z
		.array(GeocodingTypeSchema)
		.min(1)
		.optional()
		.describe('Only return these feature types.'),
	worldview: WorldviewSchema.optional(),
});

export type GeocodingForwardInput = z.input<typeof GeocodingForwardInputSchema>;

const GeocodingContextEntrySchema = z
	.object({
		mapbox_id: z.string().nullish(),
		name: z.string().nullish(),
		wikidata_id: z.string().nullish(),
	})
	.loose();

const GeocodingFeatureSchema = z
	.object({
		type: z.string(),
		id: z.string().nullish(),
		geometry: PointGeometrySchema,
		properties: z
			.object({
				mapbox_id: z.string(),
				feature_type: z.string(),
				name: z.string(),
				name_preferred: z.string().nullish(),
				full_address: z.string().nullish(),
				place_formatted: z.string().nullish(),
				coordinates: z
					.object({
						longitude: z.number(),
						latitude: z.number(),
						accuracy: z.string().nullish(),
					})
					.loose(),
				bbox: z.array(z.number()).nullish(),
				context: z.record(z.string(), GeocodingContextEntrySchema).nullish(),
			})
			.loose(),
	})
	.loose();

// A query with no match is a 200 with `features: []`, not an error.
const GeocodingResponseSchema = z
	.object({
		type: z.string(),
		features: z.array(GeocodingFeatureSchema),
		attribution: z.string().nullish(),
	})
	.loose();

export type GeocodingResponse = z.infer<typeof GeocodingResponseSchema>;
export type GeocodingFeature = z.infer<typeof GeocodingFeatureSchema>;

// ── geocoding.reverse ─────────────────────────────────────────────────────

const GeocodingReverseInputSchema = z
	.object({
		longitude: LongitudeSchema,
		latitude: LatitudeSchema,
		country: CountrySchema.optional(),
		language: LanguageSchema.optional().describe(
			'Language of the response text as an IETF tag such as en or fr-CA; comma-separate several.',
		),
		limit: z
			.number()
			.int()
			.min(1)
			.max(5)
			.optional()
			.describe(
				'Maximum results, 1 to 5. Defaults to 1. More than 1 needs exactly one entry in types. Mapbox ignores a value outside that range without an error, so the plugin rejects it.',
			),
		types: z
			.array(GeocodingTypeSchema)
			.min(1)
			.optional()
			.describe('Only return these feature types.'),
		worldview: WorldviewSchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (
			value.limit !== undefined &&
			value.limit > 1 &&
			value.types?.length !== 1
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['limit'],
				message: 'limit above 1 needs exactly one entry in types.',
			});
		}
	});

export type GeocodingReverseInput = z.input<typeof GeocodingReverseInputSchema>;

// ── directions.route ──────────────────────────────────────────────────────

const DirectionsAnnotationSchema = z.enum([
	'duration',
	'distance',
	'speed',
	'congestion',
	'congestion_numeric',
	'maxspeed',
	'closure',
]);

const DirectionsRouteInputSchema = z
	.object({
		profile: ProfileSchema,
		coordinates: z
			.array(CoordinateSchema)
			.min(2)
			.max(25)
			.describe(
				'Between 2 and 25 waypoints, visited in order. Each is { longitude, latitude }.',
			),
		alternatives: z
			.boolean()
			.optional()
			.describe('Also return up to two alternative routes.'),
		annotations: z
			.array(DirectionsAnnotationSchema)
			.min(1)
			.optional()
			.describe(
				'Extra per-segment data on each leg. Needs overview: "full". congestion, congestion_numeric and closure need mapbox/driving-traffic; maxspeed needs a driving profile.',
			),
		continue_straight: z
			.boolean()
			.optional()
			.describe(
				'Keep the direction of travel when leaving intermediate waypoints. Mapbox defaults to true for the driving profiles and false for walking and cycling.',
			),
		exclude: z
			.array(ExcludeSchema)
			.min(1)
			.optional()
			.describe(
				'Road types to avoid. Driving profiles take all five; walking takes ferry and cash_only_tolls; cycling also takes unpaved.',
			),
		geometries: GeometriesSchema.optional(),
		overview: OverviewSchema.optional(),
		steps: z
			.boolean()
			.optional()
			.describe('Return turn-by-turn steps on each leg.'),
		language: LanguageSchema.optional().describe(
			'Language of step instructions, such as en or fr. Needs steps: true.',
		),
	})
	.superRefine(refineRoutingOptions);

export type DirectionsRouteInput = z.input<typeof DirectionsRouteInputSchema>;

// A no-route answer is a 200 with `code: "NoRoute"` or `"NoSegment"`; the
// client throws on that, so a parsed response always has code "Ok".
const DirectionsRouteResponseSchema = z
	.object({
		code: z.string(),
		uuid: z.string().nullish(),
		waypoints: z.array(WaypointSchema).nullish(),
		routes: z.array(RouteSchema),
	})
	.loose();

export type DirectionsRouteResponse = z.infer<
	typeof DirectionsRouteResponseSchema
>;

// ── matrix.calculate ──────────────────────────────────────────────────────

const MatrixIndexesSchema = z.union([
	z.literal('all'),
	z.array(z.number().int().min(0)).min(1),
]);

const MatrixCalculateInputSchema = z
	.object({
		profile: ProfileSchema,
		coordinates: z
			.array(CoordinateSchema)
			.min(2)
			.max(25)
			.describe(
				'Between 2 and 25 points, or at most 10 for mapbox/driving-traffic. Each is { longitude, latitude }.',
			),
		annotations: z
			.array(z.enum(['duration', 'distance']))
			.min(1)
			.optional()
			.describe(
				'Which matrices to return: duration (default), distance, or both.',
			),
		sources: MatrixIndexesSchema.optional().describe(
			'Zero-based indexes into coordinates to use as sources, or "all" (default).',
		),
		destinations: MatrixIndexesSchema.optional().describe(
			'Zero-based indexes into coordinates to use as destinations, or "all" (default).',
		),
	})
	.superRefine((value, ctx) => {
		if (
			value.profile === 'mapbox/driving-traffic' &&
			value.coordinates.length > 10
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['coordinates'],
				message: 'mapbox/driving-traffic takes at most 10 coordinates.',
			});
		}
		for (const field of ['sources', 'destinations'] as const) {
			const indexes = value[field];
			if (
				Array.isArray(indexes) &&
				indexes.some((index) => index >= value.coordinates.length)
			) {
				ctx.addIssue({
					code: 'custom',
					path: [field],
					message: `${field} must index into coordinates.`,
				});
			}
		}
	});

export type MatrixCalculateInput = z.input<typeof MatrixCalculateInputSchema>;

const MatrixTableSchema = z.array(z.array(z.number().nullable()));

const MatrixResponseSchema = z
	.object({
		// Mapbox's Matrix errors table lists a 200 with code null when the
		// request mixes routable and unroutable pairs.
		code: z
			.string()
			.nullable()
			.describe(
				'Ok, or null when some pairs are unroutable (those cells are null).',
			),
		durations: MatrixTableSchema.nullish().describe(
			'Seconds from each source (row) to each destination (column); null where no route exists.',
		),
		distances: MatrixTableSchema.nullish().describe(
			'Meters from each source (row) to each destination (column); null where no route exists. Only present when annotations includes distance.',
		),
		sources: z.array(WaypointSchema),
		destinations: z.array(WaypointSchema),
	})
	.loose();

export type MatrixCalculateResponse = z.infer<typeof MatrixResponseSchema>;

// ── isochrone.get ─────────────────────────────────────────────────────────

const IsochroneInputBaseSchema = z.object({
	profile: ProfileSchema,
	coordinate: CoordinateSchema.describe(
		'The point the contours are centered on.',
	),
	contours_minutes: z
		.array(z.number().int().min(1).max(60))
		.min(1)
		.max(4)
		.optional()
		.describe(
			'Travel times in minutes, 1 to 60, up to four, strictly increasing. Give this or contours_meters, not both.',
		),
	contours_meters: z
		.array(z.number().int().min(1).max(100_000))
		.min(1)
		.max(4)
		.optional()
		.describe(
			'Travel distances in meters, 1 to 100000, up to four, strictly increasing. Give this or contours_minutes, not both.',
		),
	contours_colors: z
		.array(
			z
				.string()
				.regex(/^[0-9a-fA-F]{6}$/, 'Use six hex digits without a leading #.'),
		)
		.min(1)
		.max(4)
		.optional()
		.describe(
			'Hex colors without a leading #, one per contour, such as ff0000.',
		),
	polygons: z
		.boolean()
		.optional()
		.describe(
			'Return contours as polygons (true) or linestrings (false, the default).',
		),
	denoise: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe(
			'0 to 1; removes contours smaller than this fraction of the largest. Defaults to 1.',
		),
	generalize: z
		.number()
		.min(0)
		.optional()
		.describe(
			'Douglas-Peucker tolerance in meters, 0 or more. Mapbox chooses one when omitted.',
		),
	exclude: z
		.array(ExcludeSchema)
		.min(1)
		.optional()
		.describe('Road types to avoid. Driving profiles only.'),
	depart_at: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(Z|[+-]\d{2}:\d{2}))?$/,
			'Use YYYY-MM-DDThh:mm, YYYY-MM-DDThh:mm:ssZ or YYYY-MM-DDThh:mm:ss+hh:mm.',
		)
		.optional()
		.describe(
			'Departure time, so contours reflect traffic then. Without a zone it is local to the coordinate.',
		),
});

function isStrictlyIncreasing(values: readonly number[]): boolean {
	return values.every(
		(value, index) => value > (values[index - 1] ?? Number.NEGATIVE_INFINITY),
	);
}

const IsochroneGetInputSchema = IsochroneInputBaseSchema.superRefine(
	(value, ctx) => {
		const { contours_minutes: minutes, contours_meters: meters } = value;
		if ((minutes === undefined) === (meters === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Give exactly one of contours_minutes or contours_meters.',
			});
		}
		const contours = minutes ?? meters;
		if (contours && !isStrictlyIncreasing(contours)) {
			ctx.addIssue({
				code: 'custom',
				path: [minutes ? 'contours_minutes' : 'contours_meters'],
				message: 'Contours must be strictly increasing.',
			});
		}
		if (
			value.contours_colors &&
			contours &&
			value.contours_colors.length !== contours.length
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['contours_colors'],
				message: 'Give one color per contour.',
			});
		}
		if (value.exclude && !MAPBOX_DRIVING_PROFILES.includes(value.profile)) {
			ctx.addIssue({
				code: 'custom',
				path: ['exclude'],
				message:
					'exclude only applies to driving profiles; Mapbox ignores it otherwise.',
			});
		}
	},
);

export type IsochroneGetInput = z.input<typeof IsochroneGetInputSchema>;

const IsochroneFeatureSchema = z
	.object({
		type: z.string().nullish(),
		properties: z
			.object({
				contour: z.number(),
				metric: z.string(),
				color: z.string().nullish(),
			})
			.loose(),
		geometry: z
			.object({ type: z.string(), coordinates: GeoCoordinatesSchema })
			.loose(),
	})
	.loose();

const IsochroneGetResponseSchema = z
	.object({
		type: z.string().nullish(),
		features: z.array(IsochroneFeatureSchema),
	})
	.loose();

export type IsochroneGetResponse = z.infer<typeof IsochroneGetResponseSchema>;

// ── tilequery.query ───────────────────────────────────────────────────────

const TILESET_ID = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const TilequeryQueryInputSchema = z.object({
	tileset_ids: z
		.array(
			z
				.string()
				.regex(
					TILESET_ID,
					'Use a tileset ID such as mapbox.mapbox-streets-v8.',
				),
		)
		.min(1)
		.max(25)
		.describe(
			'One to 25 vector tileset IDs, such as mapbox.mapbox-streets-v8.',
		),
	coordinate: CoordinateSchema.describe('The point to query.'),
	radius: z
		.number()
		.min(0)
		.optional()
		.describe(
			'Search distance in meters. 0 (the default) is a point-in-polygon query. Needed for point and line data.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Maximum features, 1 to 50. Defaults to 5.'),
	dedupe: z
		.boolean()
		.optional()
		.describe('Remove duplicate features (true, the default) or keep them.'),
	geometry: z
		.enum(['polygon', 'linestring', 'point'])
		.optional()
		.describe('Only return features of this original geometry type.'),
	layers: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only query these layers, such as poi_label and building.'),
});

export type TilequeryQueryInput = z.input<typeof TilequeryQueryInputSchema>;

const TilequeryFeatureSchema = z
	.object({
		type: z.string(),
		id: z.union([z.number(), z.string()]).nullish(),
		geometry: PointGeometrySchema,
		properties: z
			.object({
				tilequery: z
					.object({
						distance: z.number(),
						geometry: z.string(),
						layer: z.string(),
					})
					.loose(),
			})
			.loose(),
	})
	.loose();

const TilequeryQueryResponseSchema = z
	.object({
		type: z.string(),
		features: z.array(TilequeryFeatureSchema),
	})
	.loose();

export type TilequeryQueryResponse = z.infer<
	typeof TilequeryQueryResponseSchema
>;

// ── trips.optimize ────────────────────────────────────────────────────────

const TripsOptimizeInputSchema = z
	.object({
		profile: ProfileSchema,
		coordinates: z
			.array(CoordinateSchema)
			.min(2)
			.max(12)
			.describe(
				'Between 2 and 12 stops. Each is { longitude, latitude }. The first is the start unless source is "any".',
			),
		annotations: z
			.array(z.enum(['duration', 'distance', 'speed']))
			.min(1)
			.optional()
			.describe('Extra per-segment data on each leg. Needs overview: "full".'),
		destination: z
			.enum(['any', 'last'])
			.optional()
			.describe('End at the last coordinate, or any (default).'),
		geometries: GeometriesSchema.optional(),
		language: LanguageSchema.optional().describe(
			'Language of step instructions, such as en or fr. Needs steps: true.',
		),
		overview: OverviewSchema.optional(),
		roundtrip: z
			.boolean()
			.optional()
			.describe(
				'Return to the start (true, the default). With false, source must be "first" and destination "last"; Mapbox answers NotImplemented for any other pair.',
			),
		source: z
			.enum(['any', 'first'])
			.optional()
			.describe('Start at the first coordinate, or any (default).'),
		steps: z
			.boolean()
			.optional()
			.describe('Return turn-by-turn steps on each leg.'),
	})
	.superRefine((value, ctx) => {
		refineRoutingOptions({ ...value, profile: value.profile }, ctx);
		if (
			value.roundtrip === false &&
			(value.source !== 'first' || value.destination !== 'last')
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['roundtrip'],
				message:
					'roundtrip: false needs source: "first" and destination: "last".',
			});
		}
	});

export type TripsOptimizeInput = z.input<typeof TripsOptimizeInputSchema>;

const TripsOptimizeResponseSchema = z
	.object({
		code: z.string(),
		waypoints: z.array(WaypointSchema),
		trips: z.array(RouteSchema),
	})
	.loose();

export type TripsOptimizeResponse = z.infer<typeof TripsOptimizeResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type MapboxEndpointInputs = {
	geocodingForward: GeocodingForwardInput;
	geocodingReverse: GeocodingReverseInput;
	directionsRoute: DirectionsRouteInput;
	matrixCalculate: MatrixCalculateInput;
	isochroneGet: IsochroneGetInput;
	tilequeryQuery: TilequeryQueryInput;
	tripsOptimize: TripsOptimizeInput;
};

export type MapboxEndpointOutputs = {
	geocodingForward: GeocodingResponse;
	geocodingReverse: GeocodingResponse;
	directionsRoute: DirectionsRouteResponse;
	matrixCalculate: MatrixCalculateResponse;
	isochroneGet: IsochroneGetResponse;
	tilequeryQuery: TilequeryQueryResponse;
	tripsOptimize: TripsOptimizeResponse;
};

export const MapboxEndpointInputSchemas = {
	geocodingForward: GeocodingForwardInputSchema,
	geocodingReverse: GeocodingReverseInputSchema,
	directionsRoute: DirectionsRouteInputSchema,
	matrixCalculate: MatrixCalculateInputSchema,
	isochroneGet: IsochroneGetInputSchema,
	tilequeryQuery: TilequeryQueryInputSchema,
	tripsOptimize: TripsOptimizeInputSchema,
} as const;

export const MapboxEndpointOutputSchemas = {
	geocodingForward: GeocodingResponseSchema,
	geocodingReverse: GeocodingResponseSchema,
	directionsRoute: DirectionsRouteResponseSchema,
	matrixCalculate: MatrixResponseSchema,
	isochroneGet: IsochroneGetResponseSchema,
	tilequeryQuery: TilequeryQueryResponseSchema,
	tripsOptimize: TripsOptimizeResponseSchema,
} as const;
