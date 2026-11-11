/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with both parts of a packed key:
 *   WACHETE_USER_ID=... WACHETE_API_KEY=... \
 *     pnpm --filter @corsair-dev/wachete test:live
 *
 * Read-only: nothing here creates, edits or deletes a monitor or folder.
 */
import { Folders, Notifications, Tasks } from './endpoints';
import type { WacheteContext } from './index';

const userId = process.env.WACHETE_USER_ID;
const apiKey = process.env.WACHETE_API_KEY;

const describeIfKey = userId && apiKey ? describe : describe.skip;

if (!userId || !apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		[userId ? null : 'WACHETE_USER_ID', apiKey ? null : 'WACHETE_API_KEY']
			.filter(Boolean)
			.join(' and ') +
			' not set: the live Wachete suite is skipped, not passing.',
	);
}

/** The packed key the plugin exchanges for a bearer token. */
function packedKey(): string {
	return `${userId}\n${apiKey}`;
}

function liveContext(): WacheteContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: packedKey() } as unknown as WacheteContext;
}

describeIfKey('live Wachete API', () => {
	it('lists the account folders through the output schema', async () => {
		const result = await Folders.list(liveContext() as never, {} as never);

		expect(Array.isArray(result)).toBe(true);
	});

	it('searches monitors through the output schema, which answers an array', async () => {
		const result = await Tasks.search(
			liveContext() as never,
			{
				query: '',
			} as never,
		);

		// A bare array, not an object with a `tasks` field.
		expect(Array.isArray(result)).toBe(true);
		for (const task of result) {
			expect(typeof task.id).toBe('string');
		}
	});

	it('reads one monitor by id', async () => {
		const list = await Tasks.search(
			liveContext() as never,
			{
				query: '',
			} as never,
		);
		const first = list[0];
		if (!first?.id) return;

		const one = await Tasks.get(
			liveContext() as never,
			{
				id: first.id,
			} as never,
		);

		expect(one.id).toBe(first.id);
	});

	it('lists triggered notifications through the output schema', async () => {
		const result = await Notifications.list(
			liveContext() as never,
			{} as never,
		);

		expect(Array.isArray(result)).toBe(true);
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Folders.list(liveContext() as never, {} as never);
		const text = JSON.stringify(result);

		expect(text).not.toContain(apiKey as string);
		expect(text).not.toContain(userId as string);
	});
});
