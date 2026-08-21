import { z } from 'zod';

/**
 * Core Ambient Weather reading fields from the REST API docs sample + wiki.
 * https://github.com/ambient-weather/api-docs/wiki/Device-Data-Specs
 */
const AmbientWeatherReadingFieldsSchema = z.object({
	dateutc: z.number().int(),
	date: z.string().optional(),
	tz: z.string().optional(),
	winddir: z.number().optional(),
	windspeedmph: z.number().optional(),
	windgustmph: z.number().optional(),
	maxdailygust: z.number().optional(),
	windgustdir: z.number().optional(),
	winddir_avg2m: z.number().optional(),
	windspdmph_avg2m: z.number().optional(),
	winddir_avg10m: z.number().optional(),
	windspdmph_avg10m: z.number().optional(),
	tempf: z.number().optional(),
	humidity: z.number().optional(),
	baromrelin: z.number().optional(),
	baromabsin: z.number().optional(),
	tempinf: z.number().optional(),
	humidityin: z.number().optional(),
	hourlyrainin: z.number().optional(),
	dailyrainin: z.number().optional(),
	weeklyrainin: z.number().optional(),
	monthlyrainin: z.number().optional(),
	yearlyrainin: z.number().optional(),
	eventrainin: z.number().optional(),
	totalrainin: z.number().optional(),
	uv: z.number().optional(),
	solarradiation: z.number().optional(),
	feelsLike: z.number().optional(),
	dewPoint: z.number().optional(),
	lastRain: z.string().optional(),
});

/** Latest-reading cache row from GET /v1/devices. */
export const AmbientWeatherDevice = z.object({
	macAddress: z.string(),
	name: z.string(),
	location: z.string().optional(),
	...AmbientWeatherReadingFieldsSchema.shape,
	dateutc: z.number().int().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/** Historical reading cache row from GET /v1/devices/{macAddress}. */
export const AmbientWeatherReading = z.object({
	macAddress: z.string(),
	...AmbientWeatherReadingFieldsSchema.shape,
	checkedAt: z.coerce.date().nullable().optional(),
});

export type AmbientWeatherDevice = z.infer<typeof AmbientWeatherDevice>;
export type AmbientWeatherReading = z.infer<typeof AmbientWeatherReading>;

export function pickAmbientWeatherReadingFields(
	data: unknown,
): z.infer<typeof AmbientWeatherReadingFieldsSchema> {
	return AmbientWeatherReadingFieldsSchema.parse(data);
}
