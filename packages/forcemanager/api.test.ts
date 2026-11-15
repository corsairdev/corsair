import { makeForceManagerRequest, packForceManagerCredentials } from './client';
import { operationDefinitions } from './endpoints/definitions';
import { toResponseSchema } from './endpoints/runtime';

const publicKey = process.env.FORCEMANAGER_PUBLIC_KEY;
const privateKey = process.env.FORCEMANAGER_PRIVATE_KEY;
const environment =
	process.env.FORCEMANAGER_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';
const liveTest = publicKey && privateKey ? test : test.skip;

describe('ForceManager live read-only smoke test', () => {
	liveTest('logs in with the key pair and lists time zones', async () => {
		const definition = operationDefinitions.listTimezones;
		// `unknown` because live provider JSON is untrusted until parsed by the response schema.
		const response: unknown = await makeForceManagerRequest(
			definition.path,
			packForceManagerCredentials({
				publicKey: publicKey ?? '',
				privateKey: privateKey ?? '',
			}),
			{ method: definition.method, query: { page: 0 } },
			environment,
		);
		expect(Array.isArray(response)).toBe(true);
		expect(toResponseSchema(definition.output).parse(response)).toBeDefined();
	});
});
