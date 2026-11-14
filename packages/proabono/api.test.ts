// Live ProAbono smoke tests. Excluded from the default run; run with:
//
//   PROABONO_ACCOUNT=42 PROABONO_AGENT_KEY=... PROABONO_API_KEY=... pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently.
// Nothing here creates a customer or a subscription.
import { apiBase, makeProabonoRequest, ProabonoAPIError } from './client';
import { ProabonoEndpointOutputSchemas } from './endpoints/types';
import { captureError } from './test-helpers';

const ACCOUNT = process.env.PROABONO_ACCOUNT ?? '';
const AGENT_KEY = process.env.PROABONO_AGENT_KEY ?? '';
const API_KEY = process.env.PROABONO_API_KEY ?? '';

const missing = [
	ACCOUNT ? undefined : 'PROABONO_ACCOUNT',
	AGENT_KEY ? undefined : 'PROABONO_AGENT_KEY',
	API_KEY ? undefined : 'PROABONO_API_KEY',
].filter((name): name is string => name !== undefined);

if (missing.length > 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn(`Skipping ProAbono live tests: ${missing.join(', ')} not set.`);
}
const describeLive = missing.length === 0 ? describe : describe.skip;

const credentials = { account: ACCOUNT, agentKey: AGENT_KEY, apiKey: API_KEY };

describeLive('ProAbono live API', () => {
	it('lists offers through the output schema', async () => {
		const raw = await makeProabonoRequest(credentials, {
			method: 'GET',
			path: '/v1/Offers',
		});
		const parsed = ProabonoEndpointOutputSchemas.offersList.parse(
			Array.isArray(raw) ? { offers: raw } : raw,
		);

		expect(Array.isArray(parsed.offers)).toBe(true);
	});

	it('lists customers through the output schema', async () => {
		const raw = await makeProabonoRequest(credentials, {
			method: 'GET',
			path: '/v1/Customers',
		});
		const parsed = ProabonoEndpointOutputSchemas.customersList.parse(
			Array.isArray(raw) ? { customers: raw } : raw,
		);

		expect(Array.isArray(parsed.customers)).toBe(true);
	});

	it('lists the features your offers carry', async () => {
		const raw = await makeProabonoRequest(credentials, {
			method: 'GET',
			path: '/v1/Features',
		});
		const parsed = ProabonoEndpointOutputSchemas.featuresList.parse(
			Array.isArray(raw) ? { features: raw } : raw,
		);

		expect(Array.isArray(parsed.features)).toBe(true);
	});

	it('rejects a wrong pair as a credential failure, keeping it off the error', async () => {
		const error = await captureError(
			makeProabonoRequest(
				{ ...credentials, apiKey: 'definitely-not-a-key' },
				{ method: 'GET', path: '/v1/Offers' },
			),
		);

		expect(error).toBeInstanceOf(ProabonoAPIError);
		if (!(error instanceof ProabonoAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.credentialsRejected).toBe(true);
		// The keys rode in a header, so nothing may echo them back.
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-key');
	});

	it('builds the per-account host the docs use', () => {
		expect(apiBase('42')).toBe('https://api-42.proabono.com');
	});
});
