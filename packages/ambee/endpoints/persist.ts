import type { AmbeeContext } from '../index';
import type { AirQualityStation, GeocodeResult, WeatherPoint } from './types';

/**
 * Builds a stable entity id for a reading. Ambee has no record ids of its own
 * — a reading is identified by where it was taken — so the key is derived from
 * the location, rounded to ~11 m so that repeated calls for the same place
 * update one row instead of accumulating near-duplicates.
 */
function locationKey(
	lat: number | null | undefined,
	lng: number | null | undefined,
	fallback: string,
): string {
	if (typeof lat !== 'number' || typeof lng !== 'number') {
		return fallback;
	}
	return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

/**
 * Persisting is best-effort: a storage failure must not fail an otherwise
 * successful API call, and the entity is absent entirely when the host app
 * runs without a database.
 */
async function safeUpsert(
	label: string,
	upsert: () => Promise<unknown>,
): Promise<void> {
	try {
		await upsert();
	} catch (error) {
		console.warn(`Failed to save Ambee ${label} to database:`, error);
	}
}

export async function persistAirQualityStations(
	ctx: AmbeeContext,
	stations: AirQualityStation[] | undefined,
): Promise<void> {
	const table = ctx.db.airQualityReadings;
	if (!table || !stations?.length) return;

	for (const station of stations) {
		const entityId = locationKey(
			station.lat,
			station.lng,
			`${station.placeName ?? station.city ?? station.postalCode ?? 'unknown'}`,
		);

		await safeUpsert('air quality reading', () =>
			table.upsertByEntityId(entityId, {
				locationKey: entityId,
				city: station.city ?? undefined,
				state: station.state ?? undefined,
				countryCode: station.countryCode ?? undefined,
				postalCode:
					station.postalCode === null || station.postalCode === undefined
						? undefined
						: String(station.postalCode),
				placeName: station.placeName ?? undefined,
				lat: station.lat ?? undefined,
				lng: station.lng ?? undefined,
				aqi: station.AQI ?? undefined,
				aqiCategory: station.aqiInfo?.category ?? undefined,
				dominantPollutant: station.aqiInfo?.pollutant ?? undefined,
				pm25: station.PM25 ?? undefined,
				pm10: station.PM10 ?? undefined,
				no2: station.NO2 ?? undefined,
				so2: station.SO2 ?? undefined,
				co: station.CO ?? undefined,
				ozone: station.OZONE ?? undefined,
				observedAt: station.updatedAt ?? undefined,
				fetchedAt: new Date(),
			}),
		);
	}
}

export async function persistWeatherObservation(
	ctx: AmbeeContext,
	lat: number,
	lng: number,
	point: WeatherPoint | undefined,
	timezone: string | undefined,
): Promise<void> {
	const table = ctx.db.weatherObservations;
	if (!table || !point) return;

	const entityId = locationKey(lat, lng, `${lat},${lng}`);

	await safeUpsert('weather observation', () =>
		table.upsertByEntityId(entityId, {
			locationKey: entityId,
			lat,
			lng,
			timezone: timezone ?? undefined,
			summary: point.summary ?? undefined,
			icon: point.icon ?? undefined,
			temperature: point.temperature ?? undefined,
			apparentTemperature: point.apparentTemperature ?? undefined,
			humidity: point.humidity ?? undefined,
			pressure: point.pressure ?? undefined,
			windSpeed: point.windSpeed ?? undefined,
			windGust: point.windGust ?? undefined,
			cloudCover: point.cloudCover ?? undefined,
			uvIndex: point.uvIndex ?? undefined,
			observedAt: point.time ?? undefined,
			fetchedAt: new Date(),
		}),
	);
}

export async function persistGeocodeResults(
	ctx: AmbeeContext,
	query: string,
	results: GeocodeResult[] | undefined,
): Promise<void> {
	const table = ctx.db.geocodedPlaces;
	if (!table || !results?.length) return;

	for (const [index, result] of results.entries()) {
		const lat = Number(result.lat);
		const lng = Number(result.lng);

		await safeUpsert('geocode result', () =>
			table.upsertByEntityId(`${query}#${index}`, {
				query,
				lat:
					result.lat === null ||
					result.lat === undefined ||
					!Number.isFinite(lat)
						? undefined
						: lat,
				lng:
					result.lng === null ||
					result.lng === undefined ||
					!Number.isFinite(lng)
						? undefined
						: lng,
				city: result.city ?? undefined,
				state: result.state ?? undefined,
				countryCode: result.countryCode ?? undefined,
				postalCode:
					result.postalCode === null || result.postalCode === undefined
						? undefined
						: String(result.postalCode),
				placeName: result.placeName ?? undefined,
				formattedAddress: result.formattedAddress ?? undefined,
				fetchedAt: new Date(),
			}),
		);
	}
}
