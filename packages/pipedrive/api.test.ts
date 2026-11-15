import { makePipedriveRequest } from './client';
import { PipedriveEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.PIPEDRIVE_API_KEY;

describe('Pipedrive live API smoke', () => {
	const liveTest = apiKey ? it : it.skip;
	if (!apiKey)
		console.warn(
			'Skipping Pipedrive live API tests: PIPEDRIVE_API_KEY is not set.',
		);

	liveTest(
		'reads the first deals page without exposing the API token',
		async () => {
			const response = await makePipedriveRequest(
				'/deals',
				apiKey ?? '',
				'api_key',
				{ method: 'GET', query: { limit: 1 } },
			);
			expect(
				PipedriveEndpointOutputSchemas.dealList.parse(response).success,
			).toBe(true);
		},
	);
});
