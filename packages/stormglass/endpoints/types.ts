import { z } from 'zod';

const LatSchema = z.number().min(-90).max(90).describe('Latitude (-90 to 90)');
const LngSchema = z
	.number()
	.min(-180)
	.max(180)
	.describe('Longitude (-180 to 180)');

/** ISO 8601 timestamp or UNIX epoch (seconds), per Stormglass docs. */
const TimestampSchema = z
	.union([z.string(), z.number()])
	.describe('ISO 8601 timestamp or UNIX epoch seconds');

const MetaSchema = z.record(z.string(), z.unknown());

// ─────────────────────────────────────────────────────────────────────────────
// Elevation for Point
// ─────────────────────────────────────────────────────────────────────────────

export const ElevationPointInputSchema = z.object({
	lat: LatSchema,
	lng: LngSchema,
});
export type ElevationPointInput = z.infer<typeof ElevationPointInputSchema>;

const ElevationEntrySchema = z
	.object({
		elevation: z
			.number()
			.describe('Elevation in meters (negative = below sea level)'),
		time: z.string().optional(),
	})
	.loose();

export const ElevationPointResponseSchema = z
	.object({
		data: z.union([ElevationEntrySchema, z.array(ElevationEntrySchema)]),
		meta: MetaSchema.optional(),
	})
	.loose();
export type ElevationPointResponse = z.infer<
	typeof ElevationPointResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Tide Stations in Area
// ─────────────────────────────────────────────────────────────────────────────

export const TideStationsAreaInputSchema = z.object({
	box: z
		.string()
		.regex(
			/^-?\d+(\.\d+)?,-?\d+(\.\d+)?:-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
			"Bounding box must be formatted 'lat,lng:lat,lng'",
		)
		.describe(
			"Bounding box as 'lat,lng:lat,lng' (e.g. '38.0,-122.0:37.5,-122.5')",
		),
});
export type TideStationsAreaInput = z.infer<typeof TideStationsAreaInputSchema>;

const TideStationSchema = z
	.object({
		name: z.string(),
		lat: z.number(),
		lng: z.number(),
		distance: z.number().optional(),
		source: z.string().optional(),
	})
	.loose();

export const TideStationsResponseSchema = z
	.object({
		data: z.array(TideStationSchema),
		meta: MetaSchema.optional(),
	})
	.loose();
export type TideStationsResponse = z.infer<typeof TideStationsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// List All Tide Stations
// ─────────────────────────────────────────────────────────────────────────────

export const TideStationsListInputSchema = z.object({});
export type TideStationsListInput = z.infer<typeof TideStationsListInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tide Extremes for a Point
// ─────────────────────────────────────────────────────────────────────────────

export const TideExtremesPointInputSchema = z.object({
	lat: LatSchema,
	lng: LngSchema,
	start: TimestampSchema.optional().describe(
		'Start of the time interval (defaults to now)',
	),
	end: TimestampSchema.optional().describe(
		'End of the time interval (defaults to start + 7 days)',
	),
	datum: z
		.string()
		.optional()
		.describe(
			"Tide reference datum, e.g. 'MLLW' or 'MSL' (defaults to MLLW/CD)",
		),
});
export type TideExtremesPointInput = z.infer<
	typeof TideExtremesPointInputSchema
>;

const TideExtremeSchema = z
	.object({
		height: z
			.number()
			.describe('Sea level height relative to the datum, in meters'),
		time: z.string(),
		type: z.enum(['high', 'low']),
	})
	.loose();

export const TideExtremesPointResponseSchema = z
	.object({
		data: z.array(TideExtremeSchema),
		meta: MetaSchema.optional(),
	})
	.loose();
export type TideExtremesPointResponse = z.infer<
	typeof TideExtremesPointResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Solar Data for a Point
// ─────────────────────────────────────────────────────────────────────────────

export const SolarPointInputSchema = z.object({
	lat: LatSchema,
	lng: LngSchema,
	params: z
		.array(z.string())
		.min(1)
		.describe(
			'Solar parameters to fetch, e.g. uvIndex, downwardShortWaveRadiationFlux, ' +
				'solarDownwardRadiationFlux, surfaceNetShortwaveRadiationDownwardsFlux',
		),
	start: TimestampSchema.optional().describe(
		'Start of the time interval (defaults to now)',
	),
	end: TimestampSchema.optional().describe(
		'End of the time interval (defaults to start + 7 days)',
	),
	source: z
		.string()
		.optional()
		.describe("Weather model source, e.g. 'sg' or 'noaa'"),
});
export type SolarPointInput = z.infer<typeof SolarPointInputSchema>;

const PointHourSchema = z
	.object({
		time: z.string(),
	})
	.loose();

export const SolarPointResponseSchema = z
	.object({
		hours: z.array(PointHourSchema),
		meta: MetaSchema.optional(),
	})
	.loose();
export type SolarPointResponse = z.infer<typeof SolarPointResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Weather Data for a Point
// ─────────────────────────────────────────────────────────────────────────────

export const WeatherPointInputSchema = z.object({
	lat: LatSchema,
	lng: LngSchema,
	params: z
		.array(z.string())
		.min(1)
		.describe(
			'Weather parameters to fetch, e.g. airTemperature, humidity, cloudCover, ' +
				'precipitation, pressure, windSpeed, windDirection, gust, visibility, ' +
				'waveHeight, wavePeriod, waveDirection, swellHeight, swellPeriod, ' +
				'swellDirection, waterTemperature, currentSpeed, currentDirection, seaLevel, snowDepth',
		),
	start: TimestampSchema.optional().describe(
		'Start of the time interval (defaults to now)',
	),
	end: TimestampSchema.optional().describe(
		'End of the time interval (defaults to start + 7 days)',
	),
	source: z
		.string()
		.optional()
		.describe(
			"Weather model source, e.g. 'sg', 'noaa', 'icon', 'dwd', 'fcoo', 'meteo', 'yr', 'meto', 'fmi', 'smhi'",
		),
});
export type WeatherPointInput = z.infer<typeof WeatherPointInputSchema>;

export const WeatherPointResponseSchema = z
	.object({
		hours: z.array(PointHourSchema),
		meta: MetaSchema.optional(),
	})
	.loose();
export type WeatherPointResponse = z.infer<typeof WeatherPointResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint maps
// ─────────────────────────────────────────────────────────────────────────────

export type StormglassEndpointInputs = {
	elevationPoint: ElevationPointInput;
	tideStationsArea: TideStationsAreaInput;
	tideStationsList: TideStationsListInput;
	tideExtremesPoint: TideExtremesPointInput;
	solarPoint: SolarPointInput;
	weatherPoint: WeatherPointInput;
};

export type StormglassEndpointOutputs = {
	elevationPoint: ElevationPointResponse;
	tideStationsArea: TideStationsResponse;
	tideStationsList: TideStationsResponse;
	tideExtremesPoint: TideExtremesPointResponse;
	solarPoint: SolarPointResponse;
	weatherPoint: WeatherPointResponse;
};

export const StormglassEndpointInputSchemas = {
	elevationPoint: ElevationPointInputSchema,
	tideStationsArea: TideStationsAreaInputSchema,
	tideStationsList: TideStationsListInputSchema,
	tideExtremesPoint: TideExtremesPointInputSchema,
	solarPoint: SolarPointInputSchema,
	weatherPoint: WeatherPointInputSchema,
} as const;

export const StormglassEndpointOutputSchemas = {
	elevationPoint: ElevationPointResponseSchema,
	tideStationsArea: TideStationsResponseSchema,
	tideStationsList: TideStationsResponseSchema,
	tideExtremesPoint: TideExtremesPointResponseSchema,
	solarPoint: SolarPointResponseSchema,
	weatherPoint: WeatherPointResponseSchema,
} as const;
