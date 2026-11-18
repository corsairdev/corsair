import { MISSIVE_BASE_URL, makeMissiveRequest } from './client';
import { MissiveEndpointOutputSchemas } from './endpoints/types';

const token = process.env.MISSIVE_API_TOKEN;

const describeLive = token ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive('Missive live API', () => {
	it('authenticates and parses the contact book list', async () => {
		// unknown: the live smoke test only proves authentication, transport,
		// and envelope parsing; the response body is provider-defined and only
		// its documented contact-book envelope is asserted.
		const response = await makeMissiveRequest<unknown>(
			'/contact_books',
			token!,
			{ method: 'GET' },
		);

		const result =
			MissiveEndpointOutputSchemas['contactBooks.list'].parse(response);
		expect(MISSIVE_BASE_URL).toBe('https://public.missiveapp.com/v1');
		expect(Array.isArray(result.contact_books)).toBe(true);
	});
});
