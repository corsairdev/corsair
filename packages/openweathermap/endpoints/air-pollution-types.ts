import { z } from 'zod';
import { withTimeRange } from './schema-helpers';

const AirPollutionComponentsSchema = z.looseObject({
	co: z.number().optional(),
	no: z.number().optional(),
	no2: z.number().optional(),
	o3: z.number().optional(),
	so2: z.number().optional(),
	pm2_5: z.number().optional(),
	pm10: z.number().optional(),
	nh3: z.number().optional(),
});

const AirPollutionEntrySchema = z.looseObject({
	dt: z.number(),
	main: z.looseObject({ aqi: z.number() }).optional(),
	components: AirPollutionComponentsSchema.optional(),
});

const AirPollutionLatLonInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude'),
	lon: z.number().min(-180).max(180).describe('Longitude'),
});

export const AirPollutionCurrentInputSchema = AirPollutionLatLonInputSchema;
export type AirPollutionCurrentInput = z.infer<
	typeof AirPollutionCurrentInputSchema
>;

export const AirPollutionForecastInputSchema = AirPollutionLatLonInputSchema;
export type AirPollutionForecastInput = z.infer<
	typeof AirPollutionForecastInputSchema
>;

export const AirPollutionHistoryInputSchema = withTimeRange({
	lat: z.number().min(-90).max(90).describe('Latitude'),
	lon: z.number().min(-180).max(180).describe('Longitude'),
	start: z.number().describe('Start UNIX timestamp (UTC)'),
	end: z.number().describe('End UNIX timestamp (UTC)'),
});

export type AirPollutionHistoryInput = z.infer<
	typeof AirPollutionHistoryInputSchema
>;

export const AirPollutionResponseSchema = z.looseObject({
	coord: z
		.union([z.tuple([z.number(), z.number()]), z.looseObject({})])
		.optional(),
	list: z.array(AirPollutionEntrySchema).optional(),
});

export type AirPollutionResponse = z.infer<typeof AirPollutionResponseSchema>;
