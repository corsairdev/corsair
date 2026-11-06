import { makeSalesflareRequest } from './client';
import { SalesflareEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.SALESFLARE_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive('Salesflare live API', () => {
	it('authenticates and parses the current user', async () => {
		const response = await makeSalesflareRequest<unknown>(
			{ key: apiKey! },
			'/me',
			{ method: 'GET' },
		);

		const user =
			SalesflareEndpointOutputSchemas.retrieveCurrentUser.parse(response);
		expect(user).toBeDefined();
	});
});
