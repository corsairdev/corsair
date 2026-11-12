/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `WATI_API_KEY=... pnpm --filter @corsair-dev/wati test:live`.
 * Read-only: nothing here sends a WhatsApp message, which would reach a real
 * recipient and cost messaging credits.
 */
import { Contacts, Templates, Workspace } from './endpoints';
import type { WatiContext } from './index';

const apiKey = process.env.WATI_API_KEY;
const apiHost = process.env.WATI_API_HOST;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'WATI_API_KEY is not set: the live WATI suite is skipped, not passing.',
	);
}

function liveContext(): WatiContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key` and the optional host, so it is cast here.
	return {
		key: apiKey,
		options: apiHost ? { apiHost } : {},
	} as unknown as WatiContext;
}

describeIfKey('live WATI API', () => {
	it('reads the account credits through the output schema', async () => {
		const result = await Workspace.credits(liveContext() as never, {} as never);

		expect(result).toBeDefined();
	});

	it('lists contacts through the output schema with required paging', async () => {
		const result = await Contacts.list(
			liveContext() as never,
			{
				page_number: 1,
				page_size: 5,
			} as never,
		);

		// The list answers `contact_list`; a wrong envelope fails the parse.
		expect(Array.isArray(result.contact_list)).toBe(true);
	});

	it('lists conversation channels through the output schema', async () => {
		const result = await Workspace.channels(
			liveContext() as never,
			{} as never,
		);

		expect(result).toBeDefined();
	});

	it('lists templates through the output schema', async () => {
		const result = await Templates.list(
			liveContext() as never,
			{
				page_number: 1,
				page_size: 5,
			} as never,
		);

		expect(result).toBeDefined();
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Contacts.list(
			liveContext() as never,
			{
				page_number: 1,
				page_size: 1,
			} as never,
		);

		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
