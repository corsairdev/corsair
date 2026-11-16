import { z } from 'zod';

/**
 * Every route is a GET over TomTom's map data, and the provider is one of the
 * four whose key travels as a query parameter, so the same shape is used
 * throughout.
 *
 * Responses are typed from the reference's example bodies. Search answers wrap
 * their results in `{ summary, results }`; routing answers a `routes` array;
 * traffic answers a list of incidents or a flow object.
 */

const PositionSchema = z
	.object({
		lat: z.number(),
		lon: z.number(),
	})
	.loose();

/** One search result: a POI, an address, a geography, or a street. */
const SearchResultSchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe('POI, Address, Geography, Street, or a mapcode'),
		id: z.string().nullish(),
		score: z.number().nullish(),
		dist: z.number().nullish().describe('Metres from the geo-bias point'),
		name: z.string().nullish(),
		address: z
			.object({
				streetName: z.string().nullish(),
				municipality: z.string().nullish(),
				countrySubdivision: z.string().nullish(),
				postalCode: z.string().nullish(),
				countryCode: z.string().nullish(),
				country: z.string().nullish(),
				freeformAddress: z.string().nullish(),
			})
			.loose()
			.nullish(),
		position: PositionSchema.nullish(),
		viewport: z
			.object({
				topLeftPoint: PositionSchema.nullish(),
				btmRightPoint: PositionSchema.nullish(),
			})
			.loose()
			.nullish(),
		poi: z
			.object({
				name: z.string().nullish(),
				categories: z.array(z.string()).nullish(),
				classifications: z.array(z.object({}).loose()).nullish(),
				phone: z.string().nullish(),
				url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		entryPoints: z.array(z.object({}).loose()).nullish(),
	})
	.loose();
export type SearchResultOutput = z.output<typeof SearchResultSchema>;

/**
 * The search envelope. `summary` carries the paging counters; `numResults` is
 * the total available, not the size of this page.
 */
const SearchEnvelopeSchema = z
	.object({
		summary: z
			.object({
				query: z.string().nullish(),
				queryType: z.string().nullish(),
				queryTime: z.number().nullish(),
				numResults: z.number().nullish(),
				offset: z.number().nullish(),
				totalResults: z.number().nullish(),
				fuzzyLevel: z.number().nullish(),
			})
			.loose()
			.nullish(),
		results: z.array(SearchResultSchema),
	})
	.loose();
export type SearchOutput = z.output<typeof SearchEnvelopeSchema>;

const RouteSchema = z
	.object({
		summary: z
			.object({
				lengthInMeters: z.number().nullish(),
				travelTimeInSeconds: z.number().nullish(),
				trafficDelayInSeconds: z.number().nullish(),
				departureTime: z.string().nullish(),
				arrivalTime: z.string().nullish(),
				hasTollRoad: z.boolean().nullish(),
				hasHighway: z.boolean().nullish(),
				hasFerry: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		legs: z.array(z.object({}).loose()).nullish(),
		guidance: z.object({}).loose().nullish(),
	})
	.loose();

const RouteEnvelopeSchema = z
	.object({
		formatVersion: z.string().nullish(),
		routes: z.array(RouteSchema),
	})
	.loose();
export type RouteOutput = z.output<typeof RouteEnvelopeSchema>;

const IncidentSchema = z
	.object({
		id: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe('Accident, Fog, LaneClosure, RoadWorks, and so on'),
		geometry: z.object({}).loose().nullish(),
		properties: z
			.object({
				id: z.string().nullish(),
				iconCategory: z.number().nullish(),
				magnitudeOfDelay: z.number().nullish(),
				events: z.array(z.object({}).loose()).nullish(),
				startTime: z.string().nullish(),
				endTime: z.string().nullish(),
				from: z.string().nullish(),
				to: z.string().nullish(),
				length: z.number().nullish(),
				delay: z.number().nullish(),
				roadNumbers: z.array(z.string()).nullish(),
				aci: z.object({}).loose().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type IncidentOutput = z.output<typeof IncidentSchema>;

const TrafficFlowSchema = z
	.object({
		flowSegmentData: z
			.object({
				frc: z.string().nullish(),
				currentSpeed: z.number().nullish(),
				freeFlowSpeed: z.number().nullish(),
				currentTravelTime: z.number().nullish(),
				freeFlowTravelTime: z.number().nullish(),
				confidence: z.number().nullish(),
				roadClosure: z.boolean().nullish(),
				coordinates: z.object({}).loose().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type TrafficFlowOutput = z.output<typeof TrafficFlowSchema>;

const GeocodeResultSchema = z
	.object({
		type: z.string().nullish(),
		id: z.string().nullish(),
		address: z.object({}).loose().nullish(),
		position: PositionSchema.nullish(),
	})
	.loose();

const GeocodeEnvelopeSchema = z
	.object({
		summary: z.object({}).loose().nullish(),
		results: z.array(GeocodeResultSchema).nullish(),
	})
	.loose();
export type GeocodeOutput = z.output<typeof GeocodeEnvelopeSchema>;

const ReverseGeocodeSchema = z
	.object({
		summary: z.object({}).loose().nullish(),
		addresses: z.array(
			z
				.object({
					address: z
						.object({
							streetName: z.string().nullish(),
							municipality: z.string().nullish(),
							countrySubdivision: z.string().nullish(),
							postalCode: z.string().nullish(),
							countryCode: z.string().nullish(),
							country: z.string().nullish(),
							freeformAddress: z.string().nullish(),
						})
						.loose()
						.nullish(),
					position: z.string().nullish(),
				})
				.loose(),
		),
	})
	.loose();
export type ReverseGeocodeOutput = z.output<typeof ReverseGeocodeSchema>;

/** A raster tile: PNG bytes, base64-encoded so they survive JSON. */
const TrafficTileSchema = z.object({
	content_type: z.string().describe('Usually image/png'),
	base64: z.string().describe('The tile image, base64-encoded'),
});

/** Shared paging and filtering fields for the search routes. */
const SearchFields = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page; default 10, maximum 100'),
	offset: z.number().int().min(0).optional().describe('Default 0'),
	country_set: z
		.string()
		.optional()
		.describe('Comma-separated ISO country codes, e.g. "US,MX"'),
	language: z.string().optional().describe('BCP-47 language tag, e.g. "en-GB"'),
	lat: z
		.number()
		.min(-90)
		.max(90)
		.optional()
		.describe('Latitude for the geo bias'),
	lon: z
		.number()
		.min(-180)
		.max(180)
		.optional()
		.describe('Longitude for the geo bias'),
};

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

const FuzzySearchInputSchema = z
	.object({
		query: z.string().min(1).describe('What to search for, e.g. "pizza"'),
		typeahead: z
			.boolean()
			.optional()
			.describe('Treat the query as partial input for predictive search'),
		radius: z
			.number()
			.int()
			.min(0)
			.max(50_000)
			.optional()
			.describe('Metres from the bias point; requires lat and lon'),
		...SearchFields,
	})
	.superRefine((value, ctx) => {
		// `radius` is meaningless, and rejected by the API, without a point.
		if (
			value.radius !== undefined &&
			(value.lat === undefined || value.lon === undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				message: '`radius` needs both `lat` and `lon`',
				path: ['radius'],
			});
		}
	});
export type FuzzySearchInput = z.input<typeof FuzzySearchInputSchema>;

const GeocodeInputSchema = z.object({
	query: z.string().min(1).describe('An address to turn into coordinates'),
	...SearchFields,
});
export type GeocodeInput = z.input<typeof GeocodeInputSchema>;

const ReverseGeocodeInputSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	radius: z
		.number()
		.int()
		.min(0)
		.max(1000)
		.optional()
		.describe('Metres to search around the point, up to 1000'),
	language: z.string().optional(),
});
export type ReverseGeocodeInput = z.input<typeof ReverseGeocodeInputSchema>;

// ---------------------------------------------------------------------------
// routing
// ---------------------------------------------------------------------------

const WaypointSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
});

const CalculateRouteInputSchema = z.object({
	origins: z.array(WaypointSchema).min(1).describe('Where the route starts'),
	destinations: z.array(WaypointSchema).min(1).describe('Where the route ends'),
	travel_mode: z
		.enum([
			'car',
			'truck',
			'taxi',
			'bus',
			'van',
			'motorcycle',
			'bicycle',
			'pedestrian',
		])
		.optional()
		.describe('Default car'),
	route_type: z
		.enum(['fastest', 'shortest', 'eco', 'thrilling'])
		.optional()
		.describe('Default fastest'),
	traffic: z
		.boolean()
		.optional()
		.describe('Use live traffic in the calculation'),
	depart_at: z.iso
		.datetime()
		.optional()
		.describe(
			'Departure time as an ISO 8601 instant, for future-traffic routing',
		),
	vehicle_max_speed: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('Kilometres per hour for the travel mode'),
	avoid: z
		.array(
			z.enum([
				'tollRoads',
				'motorways',
				'ferries',
				'unpavedRoads',
				'carpools',
				'alreadyUsedRoads',
			]),
		)
		.optional()
		.describe('Features to route around'),
	language: z.string().optional(),
});
export type CalculateRouteInput = z.input<typeof CalculateRouteInputSchema>;

// ---------------------------------------------------------------------------
// traffic
// ---------------------------------------------------------------------------

const IncidentDetailsInputSchema = z
	.object({
		bbox: z
			.string()
			.describe(
				'Bounding box as "minLon,minLat,maxLon,maxLat", at most 10,000 km² in area',
			),
		language: z.string().optional().describe('Default en-GB'),
		category_filter: z
			.array(z.number().int().min(0).max(14))
			.min(1)
			.optional()
			.describe(
				'Incident categories to include, such as [1, 6] for Accident and Jam; sent comma-separated',
			),
		time_validity_filter: z
			.array(z.enum(['present', 'future']))
			.min(1)
			.optional()
			.describe('present, future or both; default present'),
	})
	.superRefine((value, ctx) => {
		// A malformed box is a 400 at the provider; catching it here saves a call.
		const parts = value.bbox.split(',').map((part) => Number(part.trim()));
		if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
			ctx.addIssue({
				code: 'custom',
				message: '`bbox` must be four numbers: minLon,minLat,maxLon,maxLat',
				path: ['bbox'],
			});
			return;
		}
		const [minLon, minLat, maxLon, maxLat] = parts as [
			number,
			number,
			number,
			number,
		];
		if (minLon >= maxLon || minLat >= maxLat) {
			ctx.addIssue({
				code: 'custom',
				message: '`bbox` needs minLon < maxLon and minLat < maxLat',
				path: ['bbox'],
			});
		}
	});
export type IncidentDetailsInput = z.input<typeof IncidentDetailsInputSchema>;

const IncidentDetailsOutputSchema = z
	.object({
		incidents: z.array(IncidentSchema),
	})
	.loose();
export type IncidentDetailsOutput = z.output<
	typeof IncidentDetailsOutputSchema
>;

const TrafficFlowInputSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	zoom: z
		.number()
		.int()
		.min(0)
		.max(22)
		.optional()
		.describe('Detail level; higher is more precise'),
	unit: z.enum(['kmph', 'mph']).optional().describe('Speed unit, default kmph'),
});
export type TrafficFlowInput = z.input<typeof TrafficFlowInputSchema>;

const TrafficTileInputSchema = z.object({
	layer: z.enum(['flow', 'incidents']).optional().describe('Default flow'),
	style: z
		.enum(['absolute', 'relative', 'relative-delay', 'reduced-sensitivity'])
		.optional()
		.describe('Flow layer style, default relative'),
	incident_style: z
		.enum(['s0', 's0-dark', 's1', 's2', 's3', 'night'])
		.optional()
		.describe('Incidents layer style, default s3'),
	zoom: z.number().int().min(0).max(22),
	x: z.number().int().min(0),
	y: z.number().int().min(0),
});
export type TrafficTileInput = z.input<typeof TrafficTileInputSchema>;

export type TomTomEndpointInputs = {
	fuzzySearch: FuzzySearchInput;
	geocode: GeocodeInput;
	reverseGeocode: ReverseGeocodeInput;
	calculateRoute: CalculateRouteInput;
	incidentDetails: IncidentDetailsInput;
	trafficFlow: TrafficFlowInput;
	trafficTile: TrafficTileInput;
};

export type TomTomEndpointOutputs = {
	fuzzySearch: SearchOutput;
	geocode: GeocodeOutput;
	reverseGeocode: ReverseGeocodeOutput;
	calculateRoute: RouteOutput;
	incidentDetails: IncidentDetailsOutput;
	trafficFlow: TrafficFlowOutput;
	trafficTile: z.output<typeof TrafficTileSchema>;
};

export const TomTomEndpointInputSchemas = {
	fuzzySearch: FuzzySearchInputSchema,
	geocode: GeocodeInputSchema,
	reverseGeocode: ReverseGeocodeInputSchema,
	calculateRoute: CalculateRouteInputSchema,
	incidentDetails: IncidentDetailsInputSchema,
	trafficFlow: TrafficFlowInputSchema,
	trafficTile: TrafficTileInputSchema,
} as const;

export const TomTomEndpointOutputSchemas = {
	fuzzySearch: SearchEnvelopeSchema,
	geocode: GeocodeEnvelopeSchema,
	reverseGeocode: ReverseGeocodeSchema,
	calculateRoute: RouteEnvelopeSchema,
	incidentDetails: IncidentDetailsOutputSchema,
	trafficFlow: TrafficFlowSchema,
	trafficTile: TrafficTileSchema,
} as const;
