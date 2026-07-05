import 'dotenv/config';
import { makeApiSportsRequest } from './client';
import { ApiSportsEndpointOutputSchemas, ApiSportsResponseSchema, type ApiSportsResponse } from './endpoints/types';

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
});
