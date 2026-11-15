import { createCorsair } from 'corsair/core';
import { KadoaEndpointOutputSchemas as Outputs } from './endpoints/types';
import { kadoa } from './index';

// Live smoke tests. They run only with a real key, and every answer goes
// through the operation's output schema before an assertion touches it, so a
// field typed wrongly fails here as well as for a caller. Read-only: nothing
// here starts a run or spends credits.
const describeIfKey = process.env.KADOA_API_KEY
	? describe
	: (() => {
			console.warn('Skipping Kadoa live API tests: KADOA_API_KEY is not set.');
			return describe.skip;
		})();

describeIfKey('Kadoa live API', () => {
	const corsair = createCorsair({
		plugins: [kadoa({ key: process.env.KADOA_API_KEY })],
	});

	it('lists workflows through the output schema', async () => {
		const parsed = Outputs.workflowsList.parse(
			await corsair.kadoa.api.workflows.list({ limit: 5 }),
		);

		expect(Array.isArray(parsed.workflows)).toBe(true);
		for (const workflow of parsed.workflows) {
			expect(typeof workflow.id).toBe('string');
		}
	}, 30_000);

	it('reads one workflow through the output schema', async () => {
		const list = Outputs.workflowsList.parse(
			await corsair.kadoa.api.workflows.list({ limit: 1 }),
		);
		const [first] = list.workflows;
		if (!first) {
			// A team with no workflows still proves the list contract above.
			return;
		}

		const detail = Outputs.workflowsGet.parse(
			await corsair.kadoa.api.workflows.get({ workflowId: first.id }),
		);

		expect(detail.id).toBe(first.id);
	}, 30_000);

	it('lists the scrape locations through the output schema', async () => {
		const parsed = Outputs.locationsList.parse(
			await corsair.kadoa.api.locations.list({}),
		);

		expect(parsed.locations.length).toBeGreaterThan(0);
		expect(parsed.locations[0]?.isoCode).toMatch(/^[A-Z]{2}$/);
	}, 30_000);
});
