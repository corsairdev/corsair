import { makeKlipfolioRequest } from './client';
import { KlipfolioEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.KLIPFOLIO_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive('Klipfolio live API', () => {
	it('authenticates and reads the account profile', async () => {
		const response = await makeKlipfolioRequest<unknown>(
			// unknown: the live smoke test only proves authentication, transport,
			// and envelope parsing; the response body itself is provider-defined
			// and only its documented envelope shape is asserted.
			{ key: apiKey! },
			'/profile',
			{ method: 'GET' },
		);

		const profile =
			KlipfolioEndpointOutputSchemas.retrieveProfile.parse(response);
		expect(profile).toBeDefined();
	});
});
