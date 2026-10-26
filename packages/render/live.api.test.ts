import { makeRenderRequest } from './client';
import { RenderEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.RENDER_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive('Render live API', () => {
	it('authenticates and parses the current user', async () => {
		const response = await makeRenderRequest<unknown>('/v1/users', apiKey!, {
			method: 'GET',
			query: {},
		});

		const user = RenderEndpointOutputSchemas.getUser.parse(response);
		expect(user).toBeDefined();
	});
});
