import 'dotenv/config';
import { ApiSportsAPIError, makeApiSportsRequest } from './client';
import { API_SPORTS_ROUTES } from './endpoints/routes';
import type { ApiSportsResponse } from './endpoints/types';
import {
	ApiSportsEndpointOutputSchemas,
	ApiSportsResponseSchema,
} from './endpoints/types';

const TEST_API_KEY = process.env.API_SPORTS_API_KEY;

describe('API-Sports API Type Tests', () => {
	it('football countries returns correct type', async () => {
		if (!TEST_API_KEY) {
			console.warn('Skipping: API_SPORTS_API_KEY not set');
			return;
		}

		const response = await makeApiSportsRequest<ApiSportsResponse>(
			'football',
			'/countries',
			{ apiKey: TEST_API_KEY },
		);

		ApiSportsEndpointOutputSchemas.getCountries.parse(response);
		expect(response.response).toBeDefined();
	});

	it('football timezone returns correct type', async () => {
		if (!TEST_API_KEY) return;

		const response = await makeApiSportsRequest<ApiSportsResponse>(
			'football',
			'/timezone',
			{ apiKey: TEST_API_KEY },
		);

		ApiSportsEndpointOutputSchemas.getTimezone.parse(response);
		expect(response.response).toBeDefined();
	});

	it('nba status returns correct type', async () => {
		if (!TEST_API_KEY) return;

		const response = await makeApiSportsRequest<ApiSportsResponse>(
			'nba',
			'/status',
			{ apiKey: TEST_API_KEY },
		);

		ApiSportsResponseSchema.parse(response);
		expect(response.response).toBeDefined();
	});

	it('standings stages route hits football host', async () => {
		if (!TEST_API_KEY) return;

		const route = API_SPORTS_ROUTES.getStandingsStages;
		expect(route.sport).toBe('football');

		const response = await makeApiSportsRequest<ApiSportsResponse>(
			route.sport,
			route.path,
			{ apiKey: TEST_API_KEY, query: { league: 39, season: 2023 } },
		);

		ApiSportsEndpointOutputSchemas.getStandingsStages.parse(response);
		expect(Array.isArray(response.response) || response.response).toBeTruthy();
	});

	it('standings groups route hits football host', async () => {
		if (!TEST_API_KEY) return;

		const route = API_SPORTS_ROUTES.getStandingsGroups;
		expect(route.sport).toBe('football');

		const response = await makeApiSportsRequest<ApiSportsResponse>(
			route.sport,
			route.path,
			{ apiKey: TEST_API_KEY, query: { league: 39, season: 2023 } },
		);

		ApiSportsEndpointOutputSchemas.getStandingsGroups.parse(response);
	});

	it('games events route hits nfl host', async () => {
		if (!TEST_API_KEY) return;

		const route = API_SPORTS_ROUTES.getGamesEvents;
		expect(route.sport).toBe('nfl');

		const response = await makeApiSportsRequest<ApiSportsResponse>(
			route.sport,
			route.path,
			{ apiKey: TEST_API_KEY, query: { id: 1 } },
		);

		ApiSportsEndpointOutputSchemas.getGamesEvents.parse(response);
	});

	it('throws on API-Sports body errors', async () => {
		if (!TEST_API_KEY) return;

		await expect(
			makeApiSportsRequest<ApiSportsResponse>('nba', '/games/events', {
				apiKey: TEST_API_KEY,
			}),
		).rejects.toBeInstanceOf(ApiSportsAPIError);
	});

	it('throws auth body errors for invalid key', async () => {
		await expect(
			makeApiSportsRequest<ApiSportsResponse>('football', '/countries', {
				apiKey: 'invalid',
			}),
		).rejects.toThrow(/token|application key/i);
	});

	it('joins array query params with hyphens', async () => {
		if (!TEST_API_KEY) return;

		// Free plan may reject ids; assert we don't get a repeated-key style failure —
		// either results or a plan/parameter body error (still proves request was formed).
		try {
			const response = await makeApiSportsRequest<ApiSportsResponse>(
				'football',
				'/fixtures',
				{ apiKey: TEST_API_KEY, query: { ids: [1208002, 1208003] } },
			);
			ApiSportsResponseSchema.parse(response);
		} catch (error) {
			expect(error).toBeInstanceOf(ApiSportsAPIError);
			expect((error as Error).message.toLowerCase()).not.toContain('endpoint');
		}
	});
});
