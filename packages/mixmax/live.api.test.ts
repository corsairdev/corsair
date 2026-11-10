import { makeMixmaxRequest } from './client';
import { UsersGetMeOutputSchema } from './endpoints/types';

const apiKey = process.env.MIXMAX_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive('Mixmax live API', () => {
	it('authenticates and parses the current user', async () => {
		// unknown: the live smoke test only proves authentication, transport,
		// and envelope parsing; the response body itself is provider-defined
		// and only its documented `_id` envelope is asserted.
		const response = await makeMixmaxRequest<unknown>(
			// The key's presence is already checked by describeLive above.
			{ key: apiKey! },
			'/v1/users/me',
			{ method: 'GET' },
		);

		const user = UsersGetMeOutputSchema.parse(response);
		expect(user._id).toBeDefined();
	});
});
