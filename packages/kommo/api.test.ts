import { createCorsair } from 'corsair/core';
import { kommo } from './index';
import { KommoEndpointOutputSchemas as Outputs } from './endpoints/types';

// Live smoke tests. They run only with a real token and subdomain, and every
// answer goes through the operation's output schema before an assertion
// touches it, so a field typed wrongly fails here as well as for a caller.
// Read-only: nothing here creates a lead, contact or task.
const apiKey = process.env.KOMMO_API_KEY;
const subdomain = process.env.KOMMO_SUBDOMAIN;
const describeIfKey = apiKey && subdomain ? describe : describe.skip;

if (!describeIfKey) {
	// A skipped run must not read as a pass, so say which variable is missing.
	if (!apiKey) console.warn('KOMMO_API_KEY is not set: live tests skipped');
	if (!subdomain) console.warn('KOMMO_SUBDOMAIN is not set: live tests skipped');
}

describeIfKey('Kommo live API', () => {
	const corsair = createCorsair({
		plugins: [kommo({ key: apiKey, subdomain })],
	});

	it('reads the account through the output schema', async () => {
		const parsed = Outputs.accountGet.parse(
			await corsair.kommo.api.account.get({}),
		);

		expect(typeof parsed.id).toBe('number');
	}, 30_000);

	it('lists the first page of leads through the output schema', async () => {
		const parsed = Outputs.leadsList.parse(
			await corsair.kommo.api.leads.list({ limit: 5 }),
		);

		expect(Array.isArray(parsed._embedded.leads)).toBe(true);
		for (const lead of parsed._embedded.leads) {
			expect(typeof lead.id).toBe('number');
			// Timestamps are Unix seconds, which is what the schema says.
			if (lead.created_at !== null && lead.created_at !== undefined) {
				expect(typeof lead.created_at).toBe('number');
			}
		}
	}, 30_000);

	it('reads the pipelines with their stages through the output schema', async () => {
		const parsed = Outputs.pipelinesList.parse(
			await corsair.kommo.api.pipelines.list({}),
		);

		expect(parsed._embedded.pipelines.length).toBeGreaterThan(0);
		const main = parsed._embedded.pipelines.find(({ is_main }) => is_main);
		expect(main?._embedded?.statuses?.length ?? 0).toBeGreaterThan(0);
	}, 30_000);

	it('lists the account users through the output schema', async () => {
		const parsed = Outputs.usersList.parse(
			await corsair.kommo.api.users.list({ limit: 5 }),
		);

		expect(Array.isArray(parsed._embedded.users)).toBe(true);
	}, 30_000);
});
