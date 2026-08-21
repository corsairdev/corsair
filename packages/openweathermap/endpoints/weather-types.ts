import { z } from 'zod';
import {
	OPENWEATHERMAP_UNITS,
	WeatherConditionSchema,
	withExactlyOneLocation,
} from './schema-helpers';

export const CurrentWeatherInputSchema = withExactlyOneLocation({
	units: z.enum(OPENWEATHERMAP_UNITS).optional(),
	lang: z.string().optional(),
});

export type CurrentWeatherInput = z.infer<typeof CurrentWeatherInputSchema>;

export const CurrentWeatherResponseSchema = z.looseObject({
	coord: z
		.looseObject({
			lon: z.number(),
			lat: z.number(),
		})
		.optional(),
	weather: z.array(WeatherConditionSchema).optional(),
	main: z
		.looseObject({
			temp: z.number(),
			feels_like: z.number().optional(),
			temp_min: z.number().optional(),
			temp_max: z.number().optional(),
			pressure: z.number().optional(),
			humidity: z.number().optional(),
		})
		.optional(),
	wind: z
		.looseObject({
			speed: z.number(),
			deg: z.number().optional(),
			gust: z.number().optional(),
		})
		.optional(),
	clouds: z.looseObject({ all: z.number() }).optional(),
	dt: z.number().optional(),
	sys: z
		.looseObject({
			country: z.string().optional(),
			sunrise: z.number().optional(),
			sunset: z.number().optional(),
		})
		.optional(),
	timezone: z.number().optional(),
	id: z.number().optional(),
	name: z.string().optional(),
	cod: z.number().optional(),
});

export type CurrentWeatherResponse = z.infer<
	typeof CurrentWeatherResponseSchema
>;

export const Forecast5DayInputSchema = withExactlyOneLocation({
	units: z.enum(OPENWEATHERMAP_UNITS).optional(),
	lang: z.string().optional(),
	cnt: z
		.number()
		.int()
		.min(1)
		.max(40)
		.optional()
		.describe('Number of timestamps to return (1-40)'),
});

export type Forecast5DayInput = z.infer<typeof Forecast5DayInputSchema>;

export const Forecast5DayResponseSchema = z.looseObject({
	cod: z.string().optional(),
	message: z.number().optional(),
	cnt: z.number().optional(),
	list: z
		.array(
			z.looseObject({
				dt: z.number(),
				main: z.looseObject({}).optional(),
				weather: z.array(WeatherConditionSchema).optional(),
				clouds: z.looseObject({}).optional(),
				wind: z.looseObject({}).optional(),
				pop: z.number().optional(),
				rain: z.looseObject({}).optional(),
				snow: z.looseObject({}).optional(),
				sys: z.looseObject({}).optional(),
				dt_txt: z.string().optional(),
			}),
		)
		.optional(),
	city: z
		.looseObject({
			id: z.number().optional(),
			name: z.string().optional(),
			coord: z.looseObject({}).optional(),
			country: z.string().optional(),
			population: z.number().optional(),
			timezone: z.number().optional(),
			sunrise: z.number().optional(),
			sunset: z.number().optional(),
		})
		.optional(),
});

export type Forecast5DayResponse = z.infer<typeof Forecast5DayResponseSchema>;

export const CircleCityInputSchema = z.object({
	lat: z.number().min(-90).max(90).describe('Latitude of circle center'),
	lon: z.number().min(-180).max(180).describe('Longitude of circle center'),
	cnt: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Number of cities to return (1-50, default 10)'),
	units: z.enum(OPENWEATHERMAP_UNITS).optional(),
	lang: z.string().optional(),
});

export type CircleCityInput = z.infer<typeof CircleCityInputSchema>;

export const CircleCityResponseSchema = z.looseObject({
	cod: z.string().optional(),
	count: z.number().optional(),
	list: z.array(CurrentWeatherResponseSchema).optional(),
});

export type CircleCityResponse = z.infer<typeof CircleCityResponseSchema>;
