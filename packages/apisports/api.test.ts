import 'dotenv/config';
import {
	ApiSportsAPIError,
	makeApiSportsRequest,
	normalizeQuery,
} from './client';
import { API_SPORTS_ROUTES } from './endpoints/routes';
import type { ApiSportsResponse } from './endpoints/types';
import {
	ApiSportsEndpointOutputSchemas,
	ApiSportsResponseSchema,
} from './endpoints/types';

const TEST_API_KEY = process.env.API_SPORTS_API_KEY;

describe('normalizeQuery', () => {
	it('joins array query params with hyphens', () => {
		expect(normalizeQuery({ ids: [1208002, 1208003] })).toEqual({
			ids: '1208002-1208003',
		});
		expect(normalizeQuery({ ids: [1, 2], live: true })).toEqual({
			ids: '1-2',
			live: true,
		});
	});
});

describe('API-Sports auth body errors', () => {
	it('throws auth body errors for invalid key', async () => {
		await expect(
			makeApiSportsRequest<ApiSportsResponse>('football', '/countries', {
				apiKey: 'invalid',
			}),
		).rejects.toThrow(/token|application key/i);
	});
});

(TEST_API_KEY ? describe : describe.skip)('API-Sports API Type Tests', () => {
	if (!TEST_API_KEY) {
		console.warn('Skipping: API_SPORTS_API_KEY not set');
	}

	it('football countries returns correct type', async () => {
		const response = await makeApiSportsRequest<ApiSportsResponse>(
			'football',
			'/countries',
			{ apiKey: TEST_API_KEY },
		);

		ApiSportsEndpointOutputSchemas.getCountries.parse(response);
		expect(response.response).toBeDefined();
	});

	it('football timezone returns correct type', async () => {
		const response = await makeApiSportsRequest<ApiSportsResponse>(
			'football',
			'/timezone',
			{ apiKey: TEST_API_KEY },
		);

		ApiSportsEndpointOutputSchemas.getTimezone.parse(response);
		expect(response.response).toBeDefined();
	});

	it('nba status returns correct type', async () => {
		const response = await makeApiSportsRequest<ApiSportsResponse>(
			'nba',
			'/status',
			{ apiKey: TEST_API_KEY },
		);

		ApiSportsResponseSchema.parse(response);
		expect(response.response).toBeDefined();
	});

	it('standings stages route hits football host', async () => {
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
		const error = await makeApiSportsRequest<ApiSportsResponse>(
			'nba',
			'/games/events',
			{ apiKey: TEST_API_KEY },
		).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiSportsAPIError);
		expect((error as Error).message).toMatch(/endpoint/i);
	});
});
