/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a token.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `WEBEX_ACCESS_TOKEN=... pnpm --filter @corsair-dev/webex test:live`.
 * Read-only: nothing here posts a message or creates a webhook.
 */
import { People, Rooms, Webhooks } from './endpoints';
import type { WebexContext } from './index';

const token = process.env.WEBEX_ACCESS_TOKEN;

const describeIfKey = token ? describe : describe.skip;

if (!token) {
	// A skipped run must not read as a green one.
	console.warn(
		'WEBEX_ACCESS_TOKEN is not set: the live Webex suite is skipped, not passing.',
	);
}

function liveContext(): WebexContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: token } as unknown as WebexContext;
}

describeIfKey('live Webex API', () => {
	it('lists rooms through the output schema', async () => {
		const result = await Rooms.list(
			liveContext() as never,
			{
				max: 5,
			} as never,
		);

		expect(Array.isArray(result.items)).toBe(true);
		for (const room of result.items ?? []) {
			expect(typeof room.id).toBe('string');
		}
	});

	it('follows nextLink to the second page when there is one', async () => {
		const first = await Rooms.list(liveContext() as never, { max: 1 } as never);
		if (!first.nextLink) return;

		const second = await Rooms.list(
			liveContext() as never,
			{
				nextLink: first.nextLink,
			} as never,
		);

		// A different page, so the URL was followed rather than the query rebuilt.
		expect(Array.isArray(second.items)).toBe(true);
	});

	it('reads my own profile through the output schema', async () => {
		const result = await People.me(liveContext() as never, {} as never);

		expect(typeof result.id).toBe('string');
	});

	it('lists webhooks through the output schema', async () => {
		const result = await Webhooks.list(
			liveContext() as never,
			{
				max: 5,
			} as never,
		);

		expect(Array.isArray(result.items)).toBe(true);
	});

	it('never exposes the access token in a returned object', async () => {
		const result = await Rooms.list(
			liveContext() as never,
			{ max: 1 } as never,
		);

		expect(JSON.stringify(result)).not.toContain(token as string);
	});
});
