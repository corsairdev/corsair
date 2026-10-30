import { makeEmeliaRestRequest } from './client';
import { EmeliaEndpointOutputSchemas } from './endpoints/types';

// Live tests only — they call the real Emelia REST API and are skipped in CI
// unless EMELIA_API_KEY is set. Never mock here: this file is the working
// proof that the documented method + path actually respond.
const LIVE_KEY = process.env.EMELIA_API_KEY;
const describeLive = LIVE_KEY === undefined ? describe.skip : describe;

function liveKey() {
	if (LIVE_KEY === undefined) {
		throw new Error('EMELIA_API_KEY is not set');
	}
	return LIVE_KEY;
}

describeLive('Emelia live API', () => {
	it('lists campaigns', async () => {
		const raw = await makeEmeliaRestRequest('/advanced/campaigns', liveKey(), {
			method: 'GET',
			query: { page: 1, limit: 5 },
		});
		const parsed = EmeliaEndpointOutputSchemas.restListCampaigns.parse(raw);
		expect(parsed).toBeDefined();
	});

	it('lists email providers', async () => {
		const raw = await makeEmeliaRestRequest('/email-providers', liveKey(), {
			method: 'GET',
		});
		const parsed = EmeliaEndpointOutputSchemas.listProviders.parse(raw);
		expect(parsed).toBeDefined();
	});

	it('lists webhooks', async () => {
		const raw = await makeEmeliaRestRequest('/webhook', liveKey(), {
			method: 'GET',
		});
		const parsed = EmeliaEndpointOutputSchemas.listWebhooks.parse(raw);
		expect(parsed).toBeDefined();
	});
});
