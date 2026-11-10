import { makeNutshellRequest, NUTSHELL_BASE_URL } from './client';
import { NutshellEndpointOutputSchemas } from './endpoints/types';

const email = process.env.NUTSHELL_EMAIL;
const apiKey = process.env.NUTSHELL_API_KEY;

const describeLive = email && apiKey ? describe : describe.skip;

// One read-only smoke test: it proves authentication, transport, and schema
// parsing still work against the live API. Destructive and mutation
// operations are deliberately not exercised live; they are covered by the
// mocked route and schema suites instead.
describeLive('Nutshell live API', () => {
	it('authenticates and parses the stage list', async () => {
		// The key's presence is already checked by describeLive above.
		const key = `${email!}:${apiKey!}`;
		// unknown: the live smoke test only proves authentication, transport,
		// and envelope parsing; the response body is provider-defined and only
		// its documented stage envelope is asserted.
		const response = await makeNutshellRequest<unknown>('/stages', key, {
			method: 'GET',
		});

		const result = NutshellEndpointOutputSchemas['stages.list'].parse(response);
		expect(NUTSHELL_BASE_URL).toBe('https://app.nutshell.com/rest');
		expect(Array.isArray(result.stages)).toBe(true);
	});
});
