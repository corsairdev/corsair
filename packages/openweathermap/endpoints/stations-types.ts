import { z } from 'zod';
import { EmptySuccessSchema } from './schema-helpers';

export const StationSchema = z.looseObject({
	id: z.string().optional(),
	external_id: z.string().optional(),
	name: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	altitude: z.number().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	rank: z.number().optional(),
});

export type Station = z.infer<typeof StationSchema>;

/** POST /stations returns uppercase `ID`; normalize to lowercase `id`. */
export const StationCreateResponseSchema = z.preprocess((value) => {
	if (typeof value !== 'object' || value === null) return value;
	const record = value as Record<string, unknown>;
	if (record.id !== undefined || typeof record.ID !== 'string') return value;
	const { ID, ...rest } = record;
	return { ...rest, id: ID };
}, StationSchema);

export type StationCreateResponse = z.infer<typeof StationCreateResponseSchema>;

export const StationsListResponseSchema = z.array(StationSchema);
export type StationsListResponse = z.infer<typeof StationsListResponseSchema>;

export const StationGetInputSchema = z.object({
	station_id: z.string().min(1).describe('Internal OpenWeather station ID'),
});

export type StationGetInput = z.infer<typeof StationGetInputSchema>;

export const StationCreateInputSchema = z.object({
	external_id: z.string().min(1).describe('Your external station identifier'),
	name: z.string().min(1).describe('Station name'),
	latitude: z.number().min(-90).max(90).describe('Station latitude'),
	longitude: z.number().min(-180).max(180).describe('Station longitude'),
	altitude: z.number().describe('Station altitude in meters'),
});

export type StationCreateInput = z.infer<typeof StationCreateInputSchema>;

export const StationUpdateInputSchema = z.object({
	station_id: z.string().min(1).describe('Internal OpenWeather station ID'),
	name: z.string().optional(),
	external_id: z.string().optional(),
	latitude: z.number().min(-90).max(90).optional(),
	longitude: z.number().min(-180).max(180).optional(),
	altitude: z.number().optional(),
});

export type StationUpdateInput = z.infer<typeof StationUpdateInputSchema>;

export const StationRemoveInputSchema = z.object({
	station_id: z.string().min(1).describe('Internal OpenWeather station ID'),
});

export type StationRemoveInput = z.infer<typeof StationRemoveInputSchema>;

export const STATION_MEASUREMENT_TYPES = ['m', 'h', 'd'] as const;

export const StationGetMeasurementsInputSchema = z.object({
	station_id: z.string().min(1).describe('Internal OpenWeather station ID'),
	type: z
		.enum(STATION_MEASUREMENT_TYPES)
		.describe('Aggregation interval: m, h, or d'),
	from: z.number().describe('Start of interval (Unix timestamp)'),
	to: z.number().describe('End of interval (Unix timestamp)'),
	limit: z
		.number()
		.int()
		.positive()
		.describe('Maximum number of records to return'),
});

export type StationGetMeasurementsInput = z.infer<
	typeof StationGetMeasurementsInputSchema
>;

const AggregatedMeasurementValueSchema = z.looseObject({
	min: z.number().optional(),
	max: z.number().optional(),
	average: z.number().optional(),
	weight: z.number().optional(),
});

const MeasurementValueSchema = z.union([
	z.number(),
	AggregatedMeasurementValueSchema,
]);

export const StationMeasurementSchema = z.looseObject({
	station_id: z.string().optional(),
	dt: z.number().optional(),
	date: z.number().optional(),
	temperature: MeasurementValueSchema.optional(),
	temp: MeasurementValueSchema.optional(),
	wind_speed: MeasurementValueSchema.optional(),
	wind_gust: MeasurementValueSchema.optional(),
	wind_deg: MeasurementValueSchema.optional(),
	pressure: MeasurementValueSchema.optional(),
	humidity: MeasurementValueSchema.optional(),
	precipitation: MeasurementValueSchema.optional(),
});

export const StationGetMeasurementsResponseSchema = z.array(
	StationMeasurementSchema,
);

export type StationGetMeasurementsResponse = z.infer<
	typeof StationGetMeasurementsResponseSchema
>;

export const StationMeasurementInputSchema = z.looseObject({
	station_id: z.string().describe('Internal OpenWeather station ID'),
	dt: z.number().describe('Measurement timestamp (Unix)'),
	temperature: z.number().optional(),
	wind_speed: z.number().optional(),
	wind_gust: z.number().optional(),
	wind_deg: z.number().optional(),
	pressure: z.number().optional(),
	humidity: z.number().optional(),
	precipitation: z.number().optional(),
	rain_1h: z.number().optional(),
	snow_1h: z.number().optional(),
});

export const StationSubmitMeasurementsInputSchema = z.object({
	measurements: z
		.array(StationMeasurementInputSchema)
		.min(1)
		.describe('Measurement records to submit'),
});

export type StationSubmitMeasurementsInput = z.infer<
	typeof StationSubmitMeasurementsInputSchema
>;

export const StationSubmitMeasurementsResponseSchema = EmptySuccessSchema;

export type StationSubmitMeasurementsResponse = z.infer<
	typeof StationSubmitMeasurementsResponseSchema
>;

export const StationRemoveResponseSchema = EmptySuccessSchema;

export type StationRemoveResponse = z.infer<typeof StationRemoveResponseSchema>;
