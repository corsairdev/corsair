import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared / Common
// ─────────────────────────────────────────────────────────────────────────────

/** Weather model/data sources Stormglass can blend or be pinned to. */
export const STORMGLASS_SOURCES = [
	'dwd',
	'dwd:gwam',
	'ecmwf',
	'ecmwf:aifs',
	'ecmwf:oper',
	'ecmwf:wave',
	'fcoo',
	'fmi',
	'icon',
	'meteo',
	'metno',
	'metno:arome-arctic',
	'metno:nordic',
	'metno:nordic-seas',
	'metno:topaz5-arctic',
	'meto',
	'noaa',
	'noaa:aigfs',
	'noaa:rtofs',
	'sg',
	'smhi',
	'yr',
] as const;
export type StormglassSource = (typeof STORMGLASS_SOURCES)[number];

/** Weather parameters selectable on the weather/point endpoint. */
export const STORMGLASS_WEATHER_PARAMS = [
	'airTemperature',
	'airTemperature1000hpa',
	'airTemperature100m',
	'airTemperature200hpa',
	'airTemperature500hpa',
	'airTemperature800hpa',
	'airTemperature80m',
	'cloudCover',
	'currentDirection',
	'currentSpeed',
	'dewPointTemperature',
	'graupel',
	'gust',
	'humidity',
	'iceCover',
	'precipitation',
	'pressure',
	'rain',
	'seaIceThickness',
	'seaLevel',
	'secondarySwellDirection',
	'secondarySwellHeight',
	'secondarySwellPeriod',
	'snow',
	'snowAlbedo',
	'snowDepth',
	'surfaceTemperature',
	'swellDirection',
	'swellHeight',
	'swellPeriod',
	'visibility',
	'waterTemperature',
	'waveDirection',
	'waveHeight',
	'wavePeriod',
	'windDirection',
	'windDirection1000hpa',
	'windDirection100m',
	'windDirection200hpa',
	'windDirection20m',
	'windDirection30m',
	'windDirection40m',
	'windDirection500hpa',
	'windDirection50m',
	'windDirection800hpa',
	'windDirection80m',
	'windSpeed',
	'windSpeed1000hpa',
	'windSpeed100m',
	'windSpeed200hpa',
	'windSpeed20m',
	'windSpeed30m',
	'windSpeed40m',
	'windSpeed500hpa',
	'windSpeed50m',
	'windSpeed800hpa',
	'windSpeed80m',
	'windWaveDirection',
	'windWaveHeight',
	'windWavePeriod',
] as const;
export type StormglassWeatherParam = (typeof STORMGLASS_WEATHER_PARAMS)[number];

/** Solar parameters selectable on the solar/point endpoint. */
export const STORMGLASS_SOLAR_PARAMS = [
	'downwardShortWaveRadiationFlux',
	'solarDownwardRadiationFlux',
	'surfaceNetShortwaveRadiationDownwardsFlux',
	'uvIndex',
] as const;
export type StormglassSolarParam = (typeof STORMGLASS_SOLAR_PARAMS)[number];

/** A point coordinate, validated to real-world lat/lng ranges. */
const PointCoordinatesSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude of the point'),
	lng: z.number().min(-180).max(180).describe('Longitude of the point'),
});

/** ISO-8601 timestamp in UTC (`Z` suffix), as Stormglass expects. */
const StormglassTimestamp = z.iso.datetime();

/** Per-source value map, e.g. `{ sg: 1.23, noaa: 1.19 }`. */
const StormglassSourceValuesSchema = z.record(z.string(), z.number());

/** Request/response metadata Stormglass attaches to every point response. */
export const StormglassMetaSchema = z.looseObject({
	cost: z.number().optional(),
	dailyQuota: z.number().optional(),
	requestCount: z.number().optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
	params: z.array(z.string()).optional(),
	source: z.array(z.string()).optional(),
	station: z.looseObject({}).nullable().optional(),
});
export type StormglassMeta = z.infer<typeof StormglassMetaSchema>;

const StormglassTideStationSchema = z.looseObject({
	name: z.string().optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	distance: z.number().optional(),
	source: z.string().optional(),
});
export type StormglassTideStation = z.infer<typeof StormglassTideStationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Weather — GET /weather/point
// ─────────────────────────────────────────────────────────────────────────────

export const WeatherPointInputSchema = PointCoordinatesSchema.extend({
	params: z
		.array(z.enum(STORMGLASS_WEATHER_PARAMS))
		.min(1)
		.describe('Weather parameters to return, e.g. ["waveHeight", "windSpeed"]'),
	start: StormglassTimestamp.optional().describe(
		'ISO-8601 start of the requested time range',
	),
	end: StormglassTimestamp.optional().describe(
		'ISO-8601 end of the requested time range',
	),
	source: z
		.array(z.enum(STORMGLASS_SOURCES))
		.optional()
		.describe('Restrict results to specific weather model sources'),
});
export type WeatherPointInput = z.infer<typeof WeatherPointInputSchema>;

const WeatherHourSchema = z
	.object({ time: z.string() })
	.catchall(StormglassSourceValuesSchema);

export const WeatherPointResponseSchema = z.object({
	hours: z.array(WeatherHourSchema),
	meta: StormglassMetaSchema,
});
export type WeatherPointResponse = z.infer<typeof WeatherPointResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Solar — GET /solar/point
// ─────────────────────────────────────────────────────────────────────────────

export const SolarPointInputSchema = PointCoordinatesSchema.extend({
	params: z
		.array(z.enum(STORMGLASS_SOLAR_PARAMS))
		.min(1)
		.describe('Solar parameters to return, e.g. ["uvIndex"]'),
	start: StormglassTimestamp.optional().describe(
		'ISO-8601 start of the requested time range',
	),
	end: StormglassTimestamp.optional().describe(
		'ISO-8601 end of the requested time range',
	),
	source: z
		.array(z.enum(STORMGLASS_SOURCES))
		.optional()
		.describe('Restrict results to specific weather model sources'),
});
export type SolarPointInput = z.infer<typeof SolarPointInputSchema>;

export const SolarPointResponseSchema = z.object({
	hours: z.array(WeatherHourSchema),
	meta: StormglassMetaSchema,
});
export type SolarPointResponse = z.infer<typeof SolarPointResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tide extremes — GET /tide/extremes/point
// ─────────────────────────────────────────────────────────────────────────────

export const TideExtremesPointInputSchema = PointCoordinatesSchema.extend({
	start: StormglassTimestamp.optional().describe(
		'ISO-8601 start of the requested time range',
	),
	end: StormglassTimestamp.optional().describe(
		'ISO-8601 end of the requested time range',
	),
});
export type TideExtremesPointInput = z.infer<
	typeof TideExtremesPointInputSchema
>;

const TideExtremeSchema = z.object({
	height: z.number(),
	time: z.string(),
	type: z.enum(['high', 'low']),
});

export const TideExtremesPointResponseSchema = z.object({
	data: z.array(TideExtremeSchema),
	meta: StormglassMetaSchema,
});
export type TideExtremesPointResponse = z.infer<
	typeof TideExtremesPointResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Tide stations — GET /tide/stations, GET /tide/stations/area
// ─────────────────────────────────────────────────────────────────────────────

export const TideStationsListInputSchema = z.object({});
export type TideStationsListInput = z.infer<typeof TideStationsListInputSchema>;

export const TideStationsListResponseSchema = z.object({
	data: z.array(StormglassTideStationSchema),
	meta: StormglassMetaSchema,
});
export type TideStationsListResponse = z.infer<
	typeof TideStationsListResponseSchema
>;

/** Bounding box defined by two opposite corners. */
export const TideStationsAreaInputSchema = z.object({
	swLat: z
		.number()
		.min(-90)
		.max(90)
		.describe('Latitude of the south-west corner'),
	swLng: z
		.number()
		.min(-180)
		.max(180)
		.describe('Longitude of the south-west corner'),
	neLat: z
		.number()
		.min(-90)
		.max(90)
		.describe('Latitude of the north-east corner'),
	neLng: z
		.number()
		.min(-180)
		.max(180)
		.describe('Longitude of the north-east corner'),
});
export type TideStationsAreaInput = z.infer<typeof TideStationsAreaInputSchema>;

export const TideStationsAreaResponseSchema = TideStationsListResponseSchema;
export type TideStationsAreaResponse = z.infer<
	typeof TideStationsAreaResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Elevation — GET /elevation/point
// ─────────────────────────────────────────────────────────────────────────────

export const ElevationPointInputSchema = PointCoordinatesSchema;
export type ElevationPointInput = z.infer<typeof ElevationPointInputSchema>;

export const ElevationPointResponseSchema = z.object({
	data: z.object({
		elevation: z.number(),
	}),
	meta: StormglassMetaSchema,
});
export type ElevationPointResponse = z.infer<
	typeof ElevationPointResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Input / Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type StormglassEndpointInputs = {
	weatherGetPoint: WeatherPointInput;
	solarGetPoint: SolarPointInput;
	tideGetExtremesPoint: TideExtremesPointInput;
	tideListStations: TideStationsListInput;
	tideGetStationsInArea: TideStationsAreaInput;
	elevationGetPoint: ElevationPointInput;
};

export type StormglassEndpointOutputs = {
	weatherGetPoint: WeatherPointResponse;
	solarGetPoint: SolarPointResponse;
	tideGetExtremesPoint: TideExtremesPointResponse;
	tideListStations: TideStationsListResponse;
	tideGetStationsInArea: TideStationsAreaResponse;
	elevationGetPoint: ElevationPointResponse;
};

export const StormglassEndpointInputSchemas = {
	weatherGetPoint: WeatherPointInputSchema,
	solarGetPoint: SolarPointInputSchema,
	tideGetExtremesPoint: TideExtremesPointInputSchema,
	tideListStations: TideStationsListInputSchema,
	tideGetStationsInArea: TideStationsAreaInputSchema,
	elevationGetPoint: ElevationPointInputSchema,
} as const;

export const StormglassEndpointOutputSchemas = {
	weatherGetPoint: WeatherPointResponseSchema,
	solarGetPoint: SolarPointResponseSchema,
	tideGetExtremesPoint: TideExtremesPointResponseSchema,
	tideListStations: TideStationsListResponseSchema,
	tideGetStationsInArea: TideStationsAreaResponseSchema,
	elevationGetPoint: ElevationPointResponseSchema,
} as const;
