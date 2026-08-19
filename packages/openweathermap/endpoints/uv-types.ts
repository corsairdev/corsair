import { z } from 'zod';
import { withTimeRange } from './schema-helpers';

const UvLatLonInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude'),
	lon: z.number().min(-180).max(180).describe('Longitude'),
});

export const UvCurrentInputSchema = UvLatLonInputSchema;
export type UvCurrentInput = z.infer<typeof UvCurrentInputSchema>;

export const UvForecastInputSchema = UvLatLonInputSchema.extend({
	cnt: z
		.number()
		.int()
		.min(1)
		.max(8)
		.optional()
		.describe('Number of timestamps to return (1-8)'),
});

export type UvForecastInput = z.infer<typeof UvForecastInputSchema>;

export const UvHistoryInputSchema = withTimeRange({
	lat: z.number().min(-90).max(90).describe('Latitude'),
	lon: z.number().min(-180).max(180).describe('Longitude'),
	start: z.number().describe('Start UNIX timestamp (UTC)'),
	end: z.number().describe('End UNIX timestamp (UTC)'),
});

export type UvHistoryInput = z.infer<typeof UvHistoryInputSchema>;

export const UvValueSchema = z.looseObject({
	lat: z.number().optional(),
	lon: z.number().optional(),
	date_iso: z.string().optional(),
	date: z.number().optional(),
	value: z.number().optional(),
});

export const UvCurrentResponseSchema = UvValueSchema;
export type UvCurrentResponse = z.infer<typeof UvCurrentResponseSchema>;

export const UvForecastResponseSchema = z.array(UvValueSchema);
export type UvForecastResponse = z.infer<typeof UvForecastResponseSchema>;

export const UvHistoryResponseSchema = z.array(UvValueSchema);
export type UvHistoryResponse = z.infer<typeof UvHistoryResponseSchema>;
