import { makeForceManagerRequest } from './client';
import { operationDefinitions } from './endpoints/definitions';

const apiKey = process.env.FORCEMANAGER_API_KEY;
const liveTest = apiKey ? test : test.skip;

describe('ForceManager live read-only smoke test', () => {
	liveTest('lists time zones using the configured v4 session key', async () => {
		const definition = operationDefinitions.listTimezones;
		// `unknown` because live provider JSON is untrusted until parsed by the documented response schema.
		const response: unknown = await makeForceManagerRequest(
			definition.path,
			apiKey,
			{ method: definition.method, query: { page: 0 } },
		);
		expect(Array.isArray(response)).toBe(true);
		expect(definition.output.parse(response)).toBeDefined();
	});
});
