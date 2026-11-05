import { makeEnginemailerRequest } from './client';
import { makeEnginemailerN8nRequest } from './n8n-client';

const apiKey =
	process.env.ENGINEMAILER_N8N_API_KEY ?? process.env.ENGINEMAILER_API_KEY;
const describeIfApiKey = apiKey ? describe : describe.skip;

describeIfApiKey('Enginemailer live API', () => {
	it('can read the campaign list without mutating the account', async () => {
		// Only the envelope is asserted; the campaign list shape is not checked here.
		const response = await makeEnginemailerRequest<{ Result: unknown }>(
			'/restapi/campaign/emcampaign/ListCampaign',
			apiKey!,
			{ method: 'GET' },
		);
		expect(response).toHaveProperty('Result');
	});

	it('can check the N8N connection without mutating the account', async () => {
		// /connect publishes no response schema; the call succeeding is the check.
		const response = await makeEnginemailerN8nRequest<unknown>(
			'/connect',
			apiKey!,
		);
		expect(response).toBeDefined();
	});
});
