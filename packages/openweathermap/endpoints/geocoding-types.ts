import { z } from 'zod';

export const GeocodingDirectInputSchema = z.object({
	q: z
		.string()
		.min(1)
		.describe('City name, state code, and country code (e.g. London,UK)'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(5)
		.optional()
		.describe('Max number of results (1-5)'),
});

export type GeocodingDirectInput = z.infer<typeof GeocodingDirectInputSchema>;

export const GeocodingReverseInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude'),
	lon: z.number().min(-180).max(180).describe('Longitude'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(5)
		.optional()
		.describe('Max number of results (1-5)'),
});

export type GeocodingReverseInput = z.infer<typeof GeocodingReverseInputSchema>;

export const GeocodingByZipInputSchema = z.object({
	zip: z
		.string()
		.min(1)
		.describe('Zip/post code and country code (e.g. E14,GB)'),
});

export type GeocodingByZipInput = z.infer<typeof GeocodingByZipInputSchema>;

export const GeocodingLocationSchema = z.looseObject({
	name: z.string().optional(),
	local_names: z.record(z.string(), z.string()).optional(),
	lat: z.number(),
	lon: z.number(),
	country: z.string().optional(),
	state: z.string().optional(),
});

export const GeocodingDirectResponseSchema = z.array(GeocodingLocationSchema);
export type GeocodingDirectResponse = z.infer<
	typeof GeocodingDirectResponseSchema
>;

export const GeocodingReverseResponseSchema = z.array(GeocodingLocationSchema);
export type GeocodingReverseResponse = z.infer<
	typeof GeocodingReverseResponseSchema
>;

export const GeocodingByZipResponseSchema = z.looseObject({
	zip: z.string().optional(),
	name: z.string().optional(),
	lat: z.number(),
	lon: z.number(),
	country: z.string().optional(),
});

export type GeocodingByZipResponse = z.infer<
	typeof GeocodingByZipResponseSchema
>;
