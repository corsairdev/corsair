import { makeFidelRequest } from './client';
import { FidelEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.FIDEL_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive('Fidel live API', () => {
	it('authenticates and lists programs', async () => {
		const response = await makeFidelRequest<unknown>(
			// unknown: the live smoke test only proves authentication, transport,
			// and envelope parsing; the response body itself is provider-defined
			// and only its documented envelope shape is asserted.
			{ key: apiKey! },
			'/v1/programs',
			{ method: 'GET' },
		);

		const programs = FidelEndpointOutputSchemas.listPrograms.parse(response);
		expect(programs).toBeDefined();
	});
});
