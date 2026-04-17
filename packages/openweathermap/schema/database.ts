import { z } from 'zod';

/**
 * Flattened day summary record for local storage.
 * Captures the key aggregated weather metrics for a specific location and date.
 */
export const OpenWeatherMapDaySummary = z.object({
	/** Latitude of the location */
	lat: z.number(),
	/** Longitude of the location */
	lon: z.number(),
	/** Date in YYYY-MM-DD format */
	date: z.string(),
	/** Timezone string */
	tz: z.string().optional(),
	/** Units used (standard, metric, imperial) */
	units: z.string().optional(),
	/** Minimum temperature */
	temperatureMin: z.number().optional(),
	/** Maximum temperature */
	temperatureMax: z.number().optional(),
	/** Afternoon temperature */
	temperatureAfternoon: z.number().optional(),
	/** Morning temperature */
	temperatureMorning: z.number().optional(),
	/** Evening temperature */
	temperatureEvening: z.number().optional(),
	/** Night temperature */
	temperatureNight: z.number().optional(),
	/** Total precipitation in mm */
	precipitationTotal: z.number().optional(),
	/** Maximum wind speed */
	windMaxSpeed: z.number().optional(),
	/** Wind direction at max speed (degrees) */
	windMaxDirection: z.number().optional(),
	/** Afternoon cloud cover percentage */
	cloudCoverAfternoon: z.number().optional(),
	/** Afternoon humidity percentage */
	humidityAfternoon: z.number().optional(),
	/** Afternoon pressure in hPa */
	pressureAfternoon: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/**
 * Weather overview record for local storage.
 * Captures the human-readable weather summary for a specific location and date.
 */
export const OpenWeatherMapOverview = z.object({
	/** Latitude of the location */
	lat: z.number(),
	/** Longitude of the location */
	lon: z.number(),
	/** Date in YYYY-MM-DD format */
	date: z.string(),
	/** Timezone string */
	tz: z.string().optional(),
	/** Units used (standard, metric, imperial) */
	units: z.string().optional(),
	/** Human-readable weather overview text */
	weatherOverview: z.string(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type OpenWeatherMapDaySummary = z.infer<typeof OpenWeatherMapDaySummary>;
export type OpenWeatherMapOverview = z.infer<typeof OpenWeatherMapOverview>;
