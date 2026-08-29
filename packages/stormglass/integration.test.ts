import fs from 'node:fs';
import path from 'node:path';
import { StormglassAPIError } from './client';
import { getPoint as getElevationPoint } from './endpoints/elevation';
import { getPoint as getSolarPoint } from './endpoints/solar';
import {
	getExtremesPoint,
	getStationsInArea,
	listStations,
} from './endpoints/tide';
import {
	ElevationPointResponseSchema,
	SolarPointResponseSchema,
	TideExtremesPointResponseSchema,
	TideStationsAreaResponseSchema,
	TideStationsListResponseSchema,
	WeatherPointResponseSchema,
} from './endpoints/types';
import { getPoint as getWeatherPoint } from './endpoints/weather';

/**
 * Hits the real Stormglass API. Opt in locally by dropping
 * STORMGLASS_API_KEY=... into `packages/stormglass/.env` — matches
 * ../merriamwebsterdict's gate-on-key-presence pattern. Off in CI since no
 * key is provisioned there. The free-tier key only allows 10 requests/day,
 * so an expired key or an exhausted quota is expected mid-run rather than a
 * bug — see runOrSkip below.
 */
function loadDotEnvIfPresent() {
	const envPath = path.join(__dirname, '.env');
	if (!fs.existsSync(envPath)) return;

	for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;

		const eq = trimmed.indexOf('=');
		if (eq === -1) continue;

		const key = trimmed.slice(0, eq).trim();
		let value = trimmed.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (key && !(key in process.env)) {
			process.env[key] = value;
		}
	}
}
loadDotEnvIfPresent();

const TEST_API_KEY = process.env.STORMGLASS_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

// Stockholm archipelago
const TEST_LAT = 58.7984;
const TEST_LNG = 17.8081;

function makeCtx() {
	return { key: TEST_API_KEY, options: {} } as never;
}

/**
 * 401/403 (expired/invalid key), 402 (daily quota exhausted), and 429 (rate
 * limited) are expected outcomes for a free-tier key, not test failures — see
 * the status table in ./error-handlers.ts. A key that was valid when exported
 * can easily go stale or run out of its 10 requests/day between runs, so
 * these are skipped visibly rather than failing the suite.
 */
const SKIPPABLE_STATUSES = new Set([401, 402, 403, 429]);

function isSkippableApiError(error: unknown): error is StormglassAPIError {
	return (
		error instanceof StormglassAPIError &&
		error.status !== undefined &&
		SKIPPABLE_STATUSES.has(error.status)
	);
}

async function runOrSkip(label: string, fn: () => Promise<void>) {
	try {
		await fn();
	} catch (error) {
		if (isSkippableApiError(error)) {
			console.warn(
				`[integration.test] skipping ${label}: ${error.status} ${error.message}`,
			);
			return;
		}
		throw error;
	}
}

describeIfApiKey('Stormglass live API', () => {
	it('weather.getPoint returns hourly per-source readings', async () => {
		await runOrSkip('weather.getPoint', async () => {
			const response = await getWeatherPoint(makeCtx(), {
				lat: TEST_LAT,
				lng: TEST_LNG,
				params: ['waveHeight', 'windSpeed'],
			});

			WeatherPointResponseSchema.parse(response);
			expect(response.hours.length).toBeGreaterThan(0);
			expect(response.hours[0]?.waveHeight).toBeDefined();
		});
	});

	it('solar.getPoint returns hourly UV index readings', async () => {
		await runOrSkip('solar.getPoint', async () => {
			const response = await getSolarPoint(makeCtx(), {
				lat: TEST_LAT,
				lng: TEST_LNG,
				params: ['uvIndex'],
			});

			SolarPointResponseSchema.parse(response);
			expect(response.hours.length).toBeGreaterThan(0);
		});
	});

	it('tide.getExtremesPoint returns high/low tide events', async () => {
		await runOrSkip('tide.getExtremesPoint', async () => {
			const response = await getExtremesPoint(makeCtx(), {
				lat: TEST_LAT,
				lng: TEST_LNG,
			});

			TideExtremesPointResponseSchema.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
			expect(['high', 'low']).toContain(response.data[0]?.type);
		});
	});

	it('tide.listStations returns the full station catalog', async () => {
		await runOrSkip('tide.listStations', async () => {
			const response = await listStations(makeCtx(), {});

			TideStationsListResponseSchema.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
		});
	});

	it('tide.getStationsInArea returns stations within the bounding box', async () => {
		await runOrSkip('tide.getStationsInArea', async () => {
			const response = await getStationsInArea(makeCtx(), {
				swLat: 58,
				swLng: 17,
				neLat: 59,
				neLng: 18,
			});

			TideStationsAreaResponseSchema.parse(response);
			for (const station of response.data) {
				expect(station.lat).toBeGreaterThanOrEqual(58);
				expect(station.lat).toBeLessThanOrEqual(59);
			}
		});
	});

	it('elevation.getPoint returns a numeric elevation reading', async () => {
		await runOrSkip('elevation.getPoint', async () => {
			const response = await getElevationPoint(makeCtx(), {
				lat: TEST_LAT,
				lng: TEST_LNG,
			});

			ElevationPointResponseSchema.parse(response);
			expect(typeof response.data.elevation).toBe('number');
		});
	});
});
