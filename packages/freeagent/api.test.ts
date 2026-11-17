import { makeFreeAgentRequest } from './client';
import { FreeAgentEndpointOutputSchemas } from './endpoints/types';

const accessToken = process.env.FREEAGENT_API_KEY;

describe('FreeAgent live API smoke', () => {
	if (!accessToken) {
		console.warn(
			'Skipping FreeAgent live tests: FREEAGENT_API_KEY is not set.',
		);
		it.skip('reads the authenticated company profile', () => undefined);
		return;
	}

	it('reads the authenticated company profile', async () => {
		const response = await makeFreeAgentRequest('/v2/company', accessToken);
		expect(
			FreeAgentEndpointOutputSchemas.companyGet.parse(response),
		).toHaveProperty('company');
	});
});
