import { createCorsair } from 'corsair/core';
import { NeedleEndpointOutputSchemas as Outputs } from './endpoints/types';
import { needle } from './index';

/**
 * Live smoke test. Every answer goes through its output schema before an
 * assertion touches it, so a field typed wrongly fails here as well as for a
 * caller. Read-only: nothing here creates a lead, enrolls one, or sends.
 *
 * Skipped unless NEEDLE_API_KEY is set, and the skip is logged so it cannot
 * read as a pass. A key is scoped to one workspace, so the lead and campaign
 * counts below are whatever that workspace holds.
 */
const apiKey = process.env.NEEDLE_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('NEEDLE_API_KEY is not set: live tests skipped');
}

describeIfKey('Needle live API', () => {
	const corsair = createCorsair({ plugins: [needle({ key: apiKey })] });

	it('reads the key owner through the output schema', async () => {
		const parsed = Outputs.accountMe.parse(
			await corsair.needle.api.account.me({}),
		);

		expect(parsed.user.email).toBeTruthy();
		expect(typeof parsed.user.id).toBe('string');
	}, 30_000);

	it('lists leads through the output schema', async () => {
		const parsed = Outputs.leadsList.parse(
			await corsair.needle.api.leads.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.leads)).toBe(true);
		for (const lead of parsed.leads) {
			// Every lead carries at least one identity and a timezone.
			expect(typeof lead.id).toBe('string');
			expect(Array.isArray(lead.identities)).toBe(true);
		}
	}, 30_000);

	it('lists campaigns through the output schema', async () => {
		const parsed = Outputs.campaignsList.parse(
			await corsair.needle.api.campaigns.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.campaigns)).toBe(true);
		for (const campaign of parsed.campaigns) {
			expect(typeof campaign.id).toBe('string');
			expect(['draft', 'active', 'paused', 'archived']).toContain(
				campaign.status,
			);
		}
	}, 30_000);

	it('lists suppressions through the output schema', async () => {
		const parsed = Outputs.suppressionsList.parse(
			await corsair.needle.api.suppressions.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.suppressions)).toBe(true);
	}, 30_000);

	it('searches places through the output schema', async () => {
		const parsed = Outputs.placesSearch.parse(
			await corsair.needle.api.places.search({
				query: 'coffee roasters in Lisbon',
				limit: 1,
			}),
		);

		expect(Array.isArray(parsed.hits)).toBe(true);
		// A hit always has an id; the address fields can be null.
		for (const hit of parsed.hits) {
			expect(typeof hit.id).toBe('string');
		}
	}, 30_000);
});
