import { makeDialpadRequest } from './client';
import { DialpadOperationDefinitions } from './endpoints/definitions';
import { DialpadEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.DIALPAD_API_KEY;

if (!apiKey) {
	console.warn('DIALPAD_API_KEY is not set; skipping the live Dialpad test.');
}
const liveTest = apiKey ? test : test.skip;

liveTest('reads the authenticated Dialpad company profile', async () => {
	// `unknown` because the provider response remains untrusted until Zod parses it.
	const response: unknown = await makeDialpadRequest(
		DialpadOperationDefinitions['company.get'],
		{},
		{ apiKey },
	);
	const company = DialpadEndpointOutputSchemas['company.get'].parse(response);

	expect(company).toBeDefined();
});
