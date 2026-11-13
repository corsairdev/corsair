import { createCorsair } from 'corsair/core';
import { KanbanizeEndpointOutputSchemas as Outputs } from './endpoints/types';
import { kanbanize } from './index';

// Live smoke tests. They run only with a real key and subdomain, and every
// answer goes through the operation's output schema before an assertion
// touches it, so a field typed wrongly fails here as well as for a caller.
// Read-only: nothing here creates, moves or deletes anything.
const apiKey = process.env.KANBANIZE_API_KEY;
const subdomain = process.env.KANBANIZE_SUBDOMAIN;
const describeIfKey = apiKey && subdomain ? describe : describe.skip;

if (!apiKey || !subdomain) {
	// A skipped run must not read as a pass, so say which variable is missing.
	if (!apiKey) console.warn('KANBANIZE_API_KEY is not set: live tests skipped');
	if (!subdomain)
		console.warn('KANBANIZE_SUBDOMAIN is not set: live tests skipped');
}

describeIfKey('Businessmap live API', () => {
	const corsair = createCorsair({
		plugins: [kanbanize({ key: apiKey, subdomain })],
	});

	it('reads the key’s own user through the output schema', async () => {
		const parsed = Outputs.meGet.parse(await corsair.kanbanize.api.me.get({}));

		expect(typeof parsed.data.user_id).toBe('number');
	}, 30_000);

	it('lists the boards through the output schema', async () => {
		const parsed = Outputs.boardsList.parse(
			await corsair.kanbanize.api.boards.list({ fields: ['board_id', 'name'] }),
		);

		expect(Array.isArray(parsed.data)).toBe(true);
		for (const board of parsed.data) {
			expect(typeof board.board_id).toBe('number');
		}
	}, 30_000);

	it('reads the account’s request ceilings through the output schema', async () => {
		const parsed = Outputs.limitsGet.parse(
			await corsair.kanbanize.api.limits.get({}),
		);

		const windows = parsed.data.map(({ type }) => type);
		expect(windows).toEqual(expect.arrayContaining(['hourly', 'minutely']));
	}, 30_000);
});
