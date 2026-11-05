import { z } from 'zod';

export const WEATHER_MAP_LAYERS = [
	'PAC0',
	'PR0',
	'PA0',
	'PAR0',
	'PAS0',
	'SD0',
	'WS10',
	'WND',
	'APM',
	'TA2',
	'TD2',
	'TS0',
	'TS10',
	'HRD0',
	'CL',
] as const;

export type WeatherMapLayer = (typeof WEATHER_MAP_LAYERS)[number];

export const WeatherMapTileInputSchema = z.object({
	layer: z
		.enum(WEATHER_MAP_LAYERS)
		.describe('Weather map layer code (Maps 2.0 op parameter)'),
	z: z.number().int().min(0).describe('Zoom level'),
	x: z.number().int().min(0).describe('Tile X coordinate'),
	y: z.number().int().min(0).describe('Tile Y coordinate'),
	date: z
		.number()
		.optional()
		.describe('Unix timestamp for forecast/historical tile'),
	opacity: z.number().min(0).max(1).optional(),
	palette: z.string().optional(),
	fill_bound: z.boolean().optional(),
	arrow_step: z.number().int().optional(),
	use_norm: z.boolean().optional(),
});

export type WeatherMapTileInput = z.infer<typeof WeatherMapTileInputSchema>;

export const WeatherMapTileResponseSchema = z.object({
	contentType: z.literal('image/png'),
	dataBase64: z.base64().min(1),
});

export type WeatherMapTileResponse = z.infer<
	typeof WeatherMapTileResponseSchema
>;
