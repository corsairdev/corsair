import { z } from 'zod';

/**
 * Local record of the most recent air-quality reading for a location.
 * Keyed by rounded coordinates so repeated lookups update one row.
 */
export const AmbeeAirQualityReading = z.object({
	locationKey: z.string(),
	city: z.string().optional(),
	state: z.string().optional(),
	countryCode: z.string().optional(),
	postalCode: z.string().optional(),
	placeName: z.string().optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	aqi: z.number().optional(),
	aqiCategory: z.string().optional(),
	dominantPollutant: z.string().optional(),
	pm25: z.number().optional(),
	pm10: z.number().optional(),
	no2: z.number().optional(),
	so2: z.number().optional(),
	co: z.number().optional(),
	ozone: z.number().optional(),
	/** Ambee's own `updatedAt` for the reading (ISO 8601). */
	observedAt: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local record of the most recent weather observation for a location.
 */
export const AmbeeWeatherObservation = z.object({
	locationKey: z.string(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	timezone: z.string().optional(),
	summary: z.string().optional(),
	icon: z.string().optional(),
	temperature: z.number().optional(),
	apparentTemperature: z.number().optional(),
	humidity: z.number().optional(),
	pressure: z.number().optional(),
	windSpeed: z.number().optional(),
	windGust: z.number().optional(),
	cloudCover: z.number().optional(),
	uvIndex: z.number().optional(),
	/** Ambee returns observation time as a Unix timestamp in seconds. */
	observedAt: z.number().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local record of a geocoding / reverse-geocoding result, so a repeated
 * lookup for the same query does not need another API call to be resolvable.
 */
export const AmbeeGeocodedPlace = z.object({
	query: z.string(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	countryCode: z.string().optional(),
	postalCode: z.string().optional(),
	placeName: z.string().optional(),
	formattedAddress: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type AmbeeAirQualityReading = z.infer<typeof AmbeeAirQualityReading>;
export type AmbeeWeatherObservation = z.infer<typeof AmbeeWeatherObservation>;
export type AmbeeGeocodedPlace = z.infer<typeof AmbeeGeocodedPlace>;
