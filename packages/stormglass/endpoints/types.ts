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
		.regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?:-?\d+(\.\d+)?,-?\d+(\.\d+)?$/),
});
export type BoxInput = z.infer<typeof BoxInputSchema>;

export const PointInputSchema = z.object({
	lat: z.number().gte(-90).lte(90),
	lng: z.number().gte(-180).lte(180),
});
export type PointInput = z.infer<typeof PointInputSchema>;

export const SeriesInputSchema = PointInputSchema.extend({
	params: z.string().min(1),
});
export type SeriesInput = z.infer<typeof SeriesInputSchema>;

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
	quota: StormglassQuotaEntity,
});
export type ExtremeListResponse = z.infer<typeof ExtremeListResponseSchema>;

export const HourSchema = z.object({
	time: z.string(),
	values: z.record(z.string(), z.number()),
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
	'tides.extremes': PointInputSchema,
	'solar.get': SeriesInputSchema,
	'weather.get': SeriesInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'stations.list': StationListResponseSchema,
	'stations.area': StationListResponseSchema,
	'elevation.get': PointResponseSchema,
	'tides.extremes': ExtremeListResponseSchema,
	'solar.get': SeriesResponseSchema,
	'weather.get': SeriesResponseSchema,
} as const;
