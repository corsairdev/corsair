import { createCorsair } from 'corsair/core';
import { KeenEndpointOutputSchemas as Outputs } from './endpoints/types';
import { keen } from './index';

// Live smoke tests. They run only with a real key and project ID, and every
// answer goes through the operation's output schema before an assertion
// touches it, so a field typed wrongly fails here as well as for a caller.
// Read-only: nothing here records an event or spends a write call.
const apiKey = process.env.KEEN_API_KEY;
const projectId = process.env.KEEN_PROJECT_ID;
const describeIfKey = apiKey && projectId ? describe : describe.skip;

if (!apiKey || !projectId) {
	// A skipped run must not read as a pass, so say which variable is missing.
	if (!apiKey) console.warn('KEEN_API_KEY is not set: live tests skipped');
	if (!projectId)
		console.warn('KEEN_PROJECT_ID is not set: live tests skipped');
}

describeIfKey('Keen live API', () => {
	const corsair = createCorsair({
		plugins: [keen({ key: apiKey, projectId })],
	});

	it('lists the event collections through the output schema', async () => {
		const parsed = Outputs.collectionsList.parse(
			await corsair.keen.api.collections.list({}),
		);

		expect(Array.isArray(parsed)).toBe(true);
		for (const collection of parsed) {
			expect(typeof collection.name).toBe('string');
		}
	}, 30_000);

	it('runs a count query through the output schema', async () => {
		const parsed = Outputs.queriesRun.parse(
			await corsair.keen.api.queries.run({
				analysis_type: 'count',
				event_collection: 'purchases',
				timeframe: 'this_7_days',
			}),
		);

		// A scalar count is a number; an empty project can still answer 0.
		expect(typeof parsed.result).toBe('number');
	}, 30_000);

	it('reads the key’s own saved queries through the output schema', async () => {
		const parsed = Outputs.savedQueriesList.parse(
			await corsair.keen.api.savedQueries.list({}),
		);

		expect(Array.isArray(parsed.queries)).toBe(true);
	}, 30_000);
});
