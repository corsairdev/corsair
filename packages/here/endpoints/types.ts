import { z } from 'zod';
import { HerePlace, HereRoute, HereWeatherPlace } from '../schema/database';

const SearchItems = z
	.object({
		items: z.array(HerePlace).optional(),
	})
	.loose();

const WeatherReport = z
	.object({
		places: z.array(HereWeatherPlace).optional(),
	})
	.loose();

const RoutesResponse = z
	.object({
		routes: z.array(HereRoute).optional(),
		notices: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const AutosuggestInputSchema = z.object({
	q: z.string().describe('Partial search term.'),
	at: z.string().describe('Proximity lat,lng.'),
	limit: z.number().int().positive().optional(),
	lang: z.string().optional(),
	in: z
		.string()
		.optional()
		.describe('Geographic filter, e.g. countryCode:USA.'),
});
export const AutosuggestResponseSchema = SearchItems;

export const AutocompleteInputSchema = z.object({
	q: z.string().describe('Partial address.'),
	at: z.string().optional(),
	limit: z.number().int().positive().optional(),
	lang: z.string().optional(),
	in: z.string().optional(),
});
export const AutocompleteResponseSchema = SearchItems;

export const BrowseInputSchema = z.object({
	at: z.string().describe('Center lat,lng.'),
	categories: z.string().optional(),
	name: z.string().optional(),
	foodTypes: z.string().optional(),
	limit: z.number().int().positive().optional(),
	lang: z.string().optional(),
	in: z.string().optional(),
});
export const BrowseResponseSchema = SearchItems;

export const DiscoverInputSchema = z.object({
	q: z.string().describe('Free-form place or address query.'),
	at: z.string().describe('Proximity lat,lng.'),
	limit: z.number().int().positive().optional(),
	lang: z.string().optional(),
	in: z.string().optional(),
});
export const DiscoverResponseSchema = SearchItems;

export const GeocodeInputSchema = z.object({
	q: z.string().describe('Free-form or qualified address.'),
	at: z.string().optional(),
	limit: z.number().int().positive().optional(),
	lang: z.string().optional(),
	in: z.string().optional(),
	qq: z
		.string()
		.optional()
		.describe('Qualified query, e.g. city=Berlin;country=Germany.'),
});
export const GeocodeResponseSchema = SearchItems;

export const ReverseGeocodeInputSchema = z.object({
	at: z.string().describe('Coordinates lat,lng.'),
	limit: z.number().int().positive().optional(),
	lang: z.string().optional(),
});
export const ReverseGeocodeResponseSchema = SearchItems;

export const LookupInputSchema = z.object({
	id: z.string().describe('HERE place or address id from a prior search.'),
	lang: z.string().optional(),
});
export const LookupResponseSchema = HerePlace;

export const GetRoutesInputSchema = z.object({
	origin: z.string().describe('Origin lat,lng.'),
	destination: z.string().describe('Destination lat,lng.'),
	transportMode: z
		.enum(['car', 'truck', 'pedestrian', 'bicycle', 'scooter', 'taxi', 'bus'])
		.default('car'),
	via: z.union([z.string(), z.array(z.string())]).optional(),
	return: z
		.string()
		.optional()
		.describe('Comma list, e.g. summary,polyline,actions.'),
	departureTime: z.string().optional(),
	routingMode: z.enum(['fast', 'short']).optional(),
	lang: z.string().optional(),
});
export const GetRoutesResponseSchema = RoutesResponse;

export const PostRoutesInputSchema = GetRoutesInputSchema.extend({
	body: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Avoid areas, EV, or other POST-only Routing v8 fields.'),
});
export const PostRoutesResponseSchema = RoutesResponse;

export const GetIsolinesInputSchema = z.object({
	origin: z.string().describe('Center lat,lng.'),
	transportMode: z
		.enum(['car', 'truck', 'pedestrian', 'bicycle'])
		.default('car'),
	rangeType: z.enum(['time', 'distance', 'consumption']).default('time'),
	rangeValues: z.string().describe('Comma-separated ranges, e.g. 600,1200.'),
	departureTime: z.string().optional(),
});
export const GetIsolinesResponseSchema = z
	.object({
		isolines: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

const MatrixPoint = z.object({
	lat: z.number(),
	lng: z.number(),
});

export const ComputeMatrixInputSchema = z.object({
	origins: z.array(MatrixPoint).min(1),
	destinations: z.array(MatrixPoint).min(1),
	regionDefinition: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Defaults to { type: "world" }.'),
	transportMode: z.string().optional(),
	departureTime: z.string().optional(),
	async: z.boolean().optional(),
	matrixAttributes: z.array(z.string()).optional(),
});
export const ComputeMatrixResponseSchema = z
	.object({
		matrixId: z.string().optional(),
		status: z.string().optional(),
		matrix: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export const GetMatrixResultInputSchema = z.object({
	matrixId: z.string(),
});
export const GetMatrixResultResponseSchema = ComputeMatrixResponseSchema;

export const ListMatrixProfilesInputSchema = z.object({});
export const ListMatrixProfilesResponseSchema = z
	.object({
		profiles: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const GetMatrixProfileInputSchema = z.object({
	profileId: z.string(),
});
export const GetMatrixProfileResponseSchema = z
	.object({
		id: z.string().optional(),
		type: z.string().optional(),
	})
	.loose();

export const DecodeRouteHandleInputSchema = z.object({
	routeHandle: z.string(),
	transportMode: z.enum([
		'car',
		'truck',
		'pedestrian',
		'bicycle',
		'scooter',
		'taxi',
		'bus',
	]),
	return: z.string().optional(),
});
export const DecodeRouteHandleResponseSchema = RoutesResponse;

export const FindWaypointSequenceInputSchema = z.object({
	start: z.string().describe('start=name;lat,lng or lat,lng.'),
	destination: z.string().describe('Fixed end waypoint.'),
	destination1: z.string().optional(),
	destination2: z.string().optional(),
	destination3: z.string().optional(),
	destination4: z.string().optional(),
	destination5: z.string().optional(),
	mode: z.string().optional().describe('e.g. fastest;car;traffic:disabled'),
	improveFor: z.enum(['time', 'distance']).optional(),
});
export const FindWaypointSequenceResponseSchema = z
	.object({
		results: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

const WeatherLocationFields = {
	q: z.string().optional().describe('City name, e.g. Berlin, Germany.'),
	location: z.string().optional().describe('lat,lng.'),
	zipCode: z.string().optional(),
	units: z.enum(['metric', 'imperial']).optional(),
	lang: z.string().optional(),
};

function hasWeatherLocation(value: {
	q?: string;
	location?: string;
	zipCode?: string;
}) {
	return Boolean(value.q || value.location || value.zipCode);
}

export const GetWeatherObservationInputSchema = z
	.object({
		...WeatherLocationFields,
		oneObservation: z.boolean().optional(),
	})
	.refine(hasWeatherLocation, { message: 'Provide q, location, or zipCode' });
export const GetWeatherObservationResponseSchema = WeatherReport;

export const GetWeatherForecastDailyInputSchema = z
	.object({
		...WeatherLocationFields,
		product: z
			.enum(['forecast7days', 'forecast7daysSimple'])
			.optional()
			.describe('Defaults to forecast7daysSimple.'),
	})
	.refine(hasWeatherLocation, { message: 'Provide q, location, or zipCode' });
export const GetWeatherForecastDailyResponseSchema = WeatherReport;

export const GetWeatherForecastHourlyInputSchema = z
	.object(WeatherLocationFields)
	.refine(hasWeatherLocation, { message: 'Provide q, location, or zipCode' });
export const GetWeatherForecastHourlyResponseSchema = WeatherReport;

export const GetAstronomyForecastInputSchema = z
	.object(WeatherLocationFields)
	.refine(hasWeatherLocation, { message: 'Provide q, location, or zipCode' });
export const GetAstronomyForecastResponseSchema = WeatherReport;

export const GetWeatherAlertsInputSchema = z
	.object(WeatherLocationFields)
	.refine(hasWeatherLocation, { message: 'Provide q, location, or zipCode' });
export const GetWeatherAlertsResponseSchema = WeatherReport;

export const GetTrafficFlowInputSchema = z.object({
	in: z
		.string()
		.describe('Geospatial filter, e.g. bbox:west,south,east,north.'),
	locationReferencing: z.string().optional().describe('Defaults to shape.'),
	minJamFactor: z.number().optional(),
	maxJamFactor: z.number().optional(),
});
export const GetTrafficFlowResponseSchema = z
	.object({
		results: z.array(z.record(z.string(), z.unknown())).optional(),
		sourceUpdated: z.string().optional(),
	})
	.loose();

export const GetTrafficIncidentsInputSchema = z.object({
	in: z
		.string()
		.describe('Geospatial filter, e.g. bbox:west,south,east,north.'),
	locationReferencing: z.string().optional().describe('Defaults to shape.'),
});
export const GetTrafficIncidentsResponseSchema = GetTrafficFlowResponseSchema;

export const GetIncidentByIdInputSchema = z.object({
	id: z.string(),
	locationReferencing: z.string().optional(),
});
export const GetIncidentByIdResponseSchema = z
	.object({
		result: z.record(z.string(), z.unknown()).optional(),
		results: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const GetStationsInputSchema = z.object({
	in: z.string().describe('lat,lng or lat,lng;r=meters.'),
	name: z.string().optional(),
	maxPlaces: z.number().int().positive().optional(),
});
export const GetStationsResponseSchema = z
	.object({
		stations: z.array(z.record(z.string(), z.unknown())).optional(),
		boards: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const GetDeparturesInputSchema = z
	.object({
		ids: z.string().optional().describe('Comma-separated station ids.'),
		in: z.string().optional().describe('lat,lng;r=meters when ids is omitted.'),
		maxPerBoard: z.number().int().positive().optional(),
	})
	.refine((value) => Boolean(value.ids) !== Boolean(value.in), {
		message: 'Provide exactly one of ids or in',
	});
export const GetDeparturesResponseSchema = z
	.object({
		boards: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const GetMapImageInputSchema = z.object({
	lat: z.number(),
	lng: z.number(),
	zoom: z.number().int().min(0).max(23).default(14),
	width: z.number().int().positive().default(800),
	height: z.number().int().positive().default(400),
	format: z.enum(['png', 'jpeg']).optional(),
	style: z.string().optional(),
});
export const GetMapImageResponseSchema = z.object({
	contentType: z.string(),
	imageBase64: z.string(),
});

export const CoordinatesToTileIndicesInputSchema = z.object({
	lat: z.number().min(-85.05112878).max(85.05112878),
	lng: z.number().min(-180).max(180),
	zoom: z.number().int().min(0).max(23),
});
export const CoordinatesToTileIndicesResponseSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
	z: z.number().int(),
});

export const HereEndpointInputSchemas = {
	autosuggest: AutosuggestInputSchema,
	autocomplete: AutocompleteInputSchema,
	browse: BrowseInputSchema,
	discover: DiscoverInputSchema,
	geocode: GeocodeInputSchema,
	reverseGeocode: ReverseGeocodeInputSchema,
	lookup: LookupInputSchema,
	getRoutes: GetRoutesInputSchema,
	postRoutes: PostRoutesInputSchema,
	getIsolines: GetIsolinesInputSchema,
	computeMatrix: ComputeMatrixInputSchema,
	getMatrixResult: GetMatrixResultInputSchema,
	listMatrixProfiles: ListMatrixProfilesInputSchema,
	getMatrixProfile: GetMatrixProfileInputSchema,
	decodeRouteHandle: DecodeRouteHandleInputSchema,
	findWaypointSequence: FindWaypointSequenceInputSchema,
	getWeatherObservation: GetWeatherObservationInputSchema,
	getWeatherForecastDaily: GetWeatherForecastDailyInputSchema,
	getWeatherForecastHourly: GetWeatherForecastHourlyInputSchema,
	getAstronomyForecast: GetAstronomyForecastInputSchema,
	getWeatherAlerts: GetWeatherAlertsInputSchema,
	getTrafficFlow: GetTrafficFlowInputSchema,
	getTrafficIncidents: GetTrafficIncidentsInputSchema,
	getIncidentById: GetIncidentByIdInputSchema,
	getStations: GetStationsInputSchema,
	getDepartures: GetDeparturesInputSchema,
	getMapImage: GetMapImageInputSchema,
	coordinatesToTileIndices: CoordinatesToTileIndicesInputSchema,
} as const;

export const HereEndpointOutputSchemas = {
	autosuggest: AutosuggestResponseSchema,
	autocomplete: AutocompleteResponseSchema,
	browse: BrowseResponseSchema,
	discover: DiscoverResponseSchema,
	geocode: GeocodeResponseSchema,
	reverseGeocode: ReverseGeocodeResponseSchema,
	lookup: LookupResponseSchema,
	getRoutes: GetRoutesResponseSchema,
	postRoutes: PostRoutesResponseSchema,
	getIsolines: GetIsolinesResponseSchema,
	computeMatrix: ComputeMatrixResponseSchema,
	getMatrixResult: GetMatrixResultResponseSchema,
	listMatrixProfiles: ListMatrixProfilesResponseSchema,
	getMatrixProfile: GetMatrixProfileResponseSchema,
	decodeRouteHandle: DecodeRouteHandleResponseSchema,
	findWaypointSequence: FindWaypointSequenceResponseSchema,
	getWeatherObservation: GetWeatherObservationResponseSchema,
	getWeatherForecastDaily: GetWeatherForecastDailyResponseSchema,
	getWeatherForecastHourly: GetWeatherForecastHourlyResponseSchema,
	getAstronomyForecast: GetAstronomyForecastResponseSchema,
	getWeatherAlerts: GetWeatherAlertsResponseSchema,
	getTrafficFlow: GetTrafficFlowResponseSchema,
	getTrafficIncidents: GetTrafficIncidentsResponseSchema,
	getIncidentById: GetIncidentByIdResponseSchema,
	getStations: GetStationsResponseSchema,
	getDepartures: GetDeparturesResponseSchema,
	getMapImage: GetMapImageResponseSchema,
	coordinatesToTileIndices: CoordinatesToTileIndicesResponseSchema,
} as const;

export type HereEndpointInputs = {
	[K in keyof typeof HereEndpointInputSchemas]: z.input<
		(typeof HereEndpointInputSchemas)[K]
	>;
};

export type HereEndpointOutputs = {
	[K in keyof typeof HereEndpointOutputSchemas]: z.infer<
		(typeof HereEndpointOutputSchemas)[K]
	>;
};

export type AutosuggestInput = HereEndpointInputs['autosuggest'];
export type AutosuggestResponse = HereEndpointOutputs['autosuggest'];
export type AutocompleteInput = HereEndpointInputs['autocomplete'];
export type AutocompleteResponse = HereEndpointOutputs['autocomplete'];
export type BrowseInput = HereEndpointInputs['browse'];
export type BrowseResponse = HereEndpointOutputs['browse'];
export type DiscoverInput = HereEndpointInputs['discover'];
export type DiscoverResponse = HereEndpointOutputs['discover'];
export type GeocodeInput = HereEndpointInputs['geocode'];
export type GeocodeResponse = HereEndpointOutputs['geocode'];
export type ReverseGeocodeInput = HereEndpointInputs['reverseGeocode'];
export type ReverseGeocodeResponse = HereEndpointOutputs['reverseGeocode'];
export type LookupInput = HereEndpointInputs['lookup'];
export type LookupResponse = HereEndpointOutputs['lookup'];
export type GetRoutesInput = HereEndpointInputs['getRoutes'];
export type GetRoutesResponse = HereEndpointOutputs['getRoutes'];
export type PostRoutesInput = HereEndpointInputs['postRoutes'];
export type PostRoutesResponse = HereEndpointOutputs['postRoutes'];
export type GetIsolinesInput = HereEndpointInputs['getIsolines'];
export type GetIsolinesResponse = HereEndpointOutputs['getIsolines'];
export type ComputeMatrixInput = HereEndpointInputs['computeMatrix'];
export type ComputeMatrixResponse = HereEndpointOutputs['computeMatrix'];
export type GetMatrixResultInput = HereEndpointInputs['getMatrixResult'];
export type GetMatrixResultResponse = HereEndpointOutputs['getMatrixResult'];
export type ListMatrixProfilesInput = HereEndpointInputs['listMatrixProfiles'];
export type ListMatrixProfilesResponse =
	HereEndpointOutputs['listMatrixProfiles'];
export type GetMatrixProfileInput = HereEndpointInputs['getMatrixProfile'];
export type GetMatrixProfileResponse = HereEndpointOutputs['getMatrixProfile'];
export type DecodeRouteHandleInput = HereEndpointInputs['decodeRouteHandle'];
export type DecodeRouteHandleResponse =
	HereEndpointOutputs['decodeRouteHandle'];
export type FindWaypointSequenceInput =
	HereEndpointInputs['findWaypointSequence'];
export type FindWaypointSequenceResponse =
	HereEndpointOutputs['findWaypointSequence'];
export type GetWeatherObservationInput =
	HereEndpointInputs['getWeatherObservation'];
export type GetWeatherObservationResponse =
	HereEndpointOutputs['getWeatherObservation'];
export type GetWeatherForecastDailyInput =
	HereEndpointInputs['getWeatherForecastDaily'];
export type GetWeatherForecastDailyResponse =
	HereEndpointOutputs['getWeatherForecastDaily'];
export type GetWeatherForecastHourlyInput =
	HereEndpointInputs['getWeatherForecastHourly'];
export type GetWeatherForecastHourlyResponse =
	HereEndpointOutputs['getWeatherForecastHourly'];
export type GetAstronomyForecastInput =
	HereEndpointInputs['getAstronomyForecast'];
export type GetAstronomyForecastResponse =
	HereEndpointOutputs['getAstronomyForecast'];
export type GetWeatherAlertsInput = HereEndpointInputs['getWeatherAlerts'];
export type GetWeatherAlertsResponse = HereEndpointOutputs['getWeatherAlerts'];
export type GetTrafficFlowInput = HereEndpointInputs['getTrafficFlow'];
export type GetTrafficFlowResponse = HereEndpointOutputs['getTrafficFlow'];
export type GetTrafficIncidentsInput =
	HereEndpointInputs['getTrafficIncidents'];
export type GetTrafficIncidentsResponse =
	HereEndpointOutputs['getTrafficIncidents'];
export type GetIncidentByIdInput = HereEndpointInputs['getIncidentById'];
export type GetIncidentByIdResponse = HereEndpointOutputs['getIncidentById'];
export type GetStationsInput = HereEndpointInputs['getStations'];
export type GetStationsResponse = HereEndpointOutputs['getStations'];
export type GetDeparturesInput = HereEndpointInputs['getDepartures'];
export type GetDeparturesResponse = HereEndpointOutputs['getDepartures'];
export type GetMapImageInput = HereEndpointInputs['getMapImage'];
export type GetMapImageResponse = HereEndpointOutputs['getMapImage'];
export type CoordinatesToTileIndicesInput =
	HereEndpointInputs['coordinatesToTileIndices'];
export type CoordinatesToTileIndicesResponse =
	HereEndpointOutputs['coordinatesToTileIndices'];
