import { z } from 'zod';
import {
	StormglassExtremeEntity,
	StormglassPointEntity,
	StormglassQuotaEntity,
	StormglassStationEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const BoxInputSchema = z.object({
	box: z
		.string()
		.regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?:-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)
		.describe('Top-right and bottom-left corners as lat,lng:lat,lng.'),
});
export type BoxInput = z.infer<typeof BoxInputSchema>;

export const PointInputSchema = z.object({
	lat: z.number().gte(-90).lte(90),
	lng: z.number().gte(-180).lte(180),
});
export type PointInput = z.infer<typeof PointInputSchema>;

// Stormglass takes a UNIX timestamp or an ISO string (a prefix such as
// 2024-01-01 is fine). Times are UTC.
const TimeSchema = z.union([z.string().min(1), z.number().int().nonnegative()]);

const RangeShape = {
	start: TimeSchema.optional().describe(
		'First hour, UTC. UNIX seconds or ISO (2024-01-01 or 2024-01-01T06).',
	),
	end: TimeSchema.optional().describe(
		'Last hour, UTC. UNIX seconds or ISO. At most 10 days after start.',
	),
};

export const DatumSchema = z.enum([
	'HAT',
	'MHHW',
	'MHW',
	'MSL',
	'MLW',
	'MLLW',
	'LAT',
]);

export const TideInputSchema = PointInputSchema.extend({
	...RangeShape,
	datum: DatumSchema.optional().describe(
		'Reference level the heights are relative to. Stormglass defaults to MSL.',
	),
});
export type TideInput = z.infer<typeof TideInputSchema>;

export const AstronomyInputSchema = PointInputSchema.extend(RangeShape);
export type AstronomyInput = z.infer<typeof AstronomyInputSchema>;

export const SeriesInputSchema = PointInputSchema.extend({
	params: z
		.string()
		.min(1)
		.describe('Comma-separated parameters, e.g. airTemperature,waveHeight.'),
	...RangeShape,
	source: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Comma-separated sources, e.g. sg or noaa,dwd. The first one fills `values`.',
		),
});
export type SeriesInput = z.infer<typeof SeriesInputSchema>;

export const HistoricalInputSchema = SeriesInputSchema.refine(
	(input) => input.start !== undefined || input.end !== undefined,
	{ message: 'Historical weather needs start or end' },
);
export type HistoricalInput = z.infer<typeof HistoricalInputSchema>;

/** Tide station that served a tide request (meta.station). */
export const TideStationSchema = z.object({
	name: z.string().optional(),
	source: z.string().optional(),
	distance: z.number().optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
});

export const StationListResponseSchema = z.object({
	stations: z.array(StormglassStationEntity),
});
export type StationListResponse = z.infer<typeof StationListResponseSchema>;

export const PointResponseSchema = z.object({
	point: StormglassPointEntity,
	quota: StormglassQuotaEntity,
});
export type PointResponse = z.infer<typeof PointResponseSchema>;

export const ExtremeListResponseSchema = z.object({
	extremes: z.array(StormglassExtremeEntity),
	station: TideStationSchema.optional(),
	quota: StormglassQuotaEntity,
});
export type ExtremeListResponse = z.infer<typeof ExtremeListResponseSchema>;

export const SeaLevelSchema = z.object({
	time: z.string(),
	height: z.number().optional(),
	sources: z.record(z.string(), z.number()),
});

export const SeaLevelResponseSchema = z.object({
	levels: z.array(SeaLevelSchema),
	station: TideStationSchema.optional(),
	quota: StormglassQuotaEntity,
});
export type SeaLevelResponse = z.infer<typeof SeaLevelResponseSchema>;

export const MoonPhaseSchema = z.object({
	text: z.string().optional(),
	time: z.string().optional(),
	value: z.number().optional(),
});

export const AstronomyDaySchema = z.object({
	time: z.string(),
	sunrise: z.string().nullable().optional(),
	sunset: z.string().nullable().optional(),
	moonrise: z.string().nullable().optional(),
	moonset: z.string().nullable().optional(),
	moonFraction: z.number().optional(),
	moonPhase: z
		.object({
			current: MoonPhaseSchema.optional(),
			closest: MoonPhaseSchema.optional(),
		})
		.optional(),
	astronomicalDawn: z.string().nullable().optional(),
	astronomicalDusk: z.string().nullable().optional(),
	civilDawn: z.string().nullable().optional(),
	civilDusk: z.string().nullable().optional(),
	nauticalDawn: z.string().nullable().optional(),
	nauticalDusk: z.string().nullable().optional(),
});

export const AstronomyResponseSchema = z.object({
	days: z.array(AstronomyDaySchema),
	quota: StormglassQuotaEntity,
});
export type AstronomyResponse = z.infer<typeof AstronomyResponseSchema>;

export const HourSchema = z.object({
	time: z.string(),
	values: z.record(z.string(), z.number()),
	sources: z.record(z.string(), z.record(z.string(), z.number())),
});

export const SeriesResponseSchema = z.object({
	hours: z.array(HourSchema),
	quota: StormglassQuotaEntity,
});
export type SeriesResponse = z.infer<typeof SeriesResponseSchema>;

export const EndpointInputSchemas = {
	'stations.list': EmptyInputSchema,
	'stations.area': BoxInputSchema,
	'elevation.get': PointInputSchema,
	'tides.extremes': TideInputSchema,
	'tides.seaLevel': TideInputSchema,
	'astronomy.get': AstronomyInputSchema,
	'solar.get': SeriesInputSchema,
	'bio.get': SeriesInputSchema,
	'weather.get': SeriesInputSchema,
	'weather.historical': HistoricalInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'stations.list': StationListResponseSchema,
	'stations.area': StationListResponseSchema,
	'elevation.get': PointResponseSchema,
	'tides.extremes': ExtremeListResponseSchema,
	'tides.seaLevel': SeaLevelResponseSchema,
	'astronomy.get': AstronomyResponseSchema,
	'solar.get': SeriesResponseSchema,
	'bio.get': SeriesResponseSchema,
	'weather.get': SeriesResponseSchema,
	'weather.historical': SeriesResponseSchema,
} as const;
