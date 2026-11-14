import { makeDigicertRequest } from './client';
import type { DigicertEndpointOutputs } from './endpoints/types';
import { DigicertEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.DIGICERT_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

describeLive('DigiCert live read-only smoke tests', () => {
	it('lists intermediate certificates without printing the API key', async () => {
		const response = await makeDigicertRequest<
			DigicertEndpointOutputs['intermediatesList']
		>('certcentral', '/certificate/intermediates', apiKey);
		expect(
			DigicertEndpointOutputSchemas.intermediatesList.parse(response)
				.intermediates,
		).toBeDefined();
	});
});
