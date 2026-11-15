import { makeStackExchangeRequest } from './client';
import { StackExchangeResponseSchema } from './endpoints/types';

const apiKey = process.env.STACKEXCHANGE_API_KEY;
if (!apiKey)
	console.warn(
		'Skipping Stack Exchange live API smoke test: STACKEXCHANGE_API_KEY is unset.',
	);

const liveTest = apiKey ? it : it.skip;

describe('Stack Exchange live API', () => {
	liveTest('reads public Stack Overflow site info', async () => {
		// Provider API responses are untrusted until runtime validation.
		const response: unknown = await makeStackExchangeRequest(
			'siteRead',
			'info',
			apiKey,
			'api_key',
			{ site: 'stackoverflow' },
		);
		const parsed = StackExchangeResponseSchema.parse(response);
		expect(parsed.items).toBeDefined();
	});
});
