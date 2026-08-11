import { z } from 'zod';

/**
 * Core Ambient Weather reading fields from the REST API docs sample + wiki.
 * Devices emit a subset; unknown sensor keys are not stored on the local row.
 * https://github.com/ambient-weather/api-docs/wiki/Device-Data-Specs
 */
const AmbientWeatherReadingFields = {
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
} as const;

/**
 * Local cache of an Ambient Weather station and its latest reading.
 * Synced from GET /v1/devices.
 */
export const AmbientWeatherDevice = z.object({
	macAddress: z.string(),
	name: z.string(),
	location: z.string().optional(),
	...AmbientWeatherReadingFields,
	dateutc: z.number().int().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local cache of a historical reading for a station.
 * Synced from GET /v1/devices/{macAddress}.
 */
export const AmbientWeatherReading = z.object({
	macAddress: z.string(),
	...AmbientWeatherReadingFields,
	checkedAt: z.coerce.date().nullable().optional(),
});

export type AmbientWeatherDevice = z.infer<typeof AmbientWeatherDevice>;
export type AmbientWeatherReading = z.infer<typeof AmbientWeatherReading>;

export function pickAmbientWeatherReadingFields(
	data: Record<string, unknown>,
): Omit<AmbientWeatherReading, 'macAddress' | 'checkedAt'> {
	const out: Record<string, unknown> = {};
	for (const key of Object.keys(AmbientWeatherReadingFields)) {
		if (key in data) out[key] = data[key];
	}
	return out as Omit<AmbientWeatherReading, 'macAddress' | 'checkedAt'>;
}
