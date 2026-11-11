/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `UNISENDER_API_KEY=... pnpm --filter @corsair-dev/unisender test:live`.
 * Read-only: nothing here sends mail or changes a contact.
 */
import * as Api from './endpoints';
import type { UnisenderContext } from './index';

const apiKey = process.env.UNISENDER_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'UNISENDER_API_KEY is not set: the live Unisender suite is skipped, not passing.',
	);
}

function liveContext(): UnisenderContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as UnisenderContext;
}

describeIfKey('live Unisender API', () => {
	it('lists the subscriber lists through the output schema', async () => {
		const result = await Api.list(liveContext() as never, {} as never);

		expect(Array.isArray(result.result)).toBe(true);
		for (const list of result.result) {
			expect(typeof list.id).toBe('number');
		}
	});

	it('reads custom fields through the output schema', async () => {
		const result = await Api.fields(liveContext() as never, {} as never);

		expect(Array.isArray(result.result)).toBe(true);
	});

	it('reads tags through the output schema', async () => {
		const result = await Api.tags(liveContext() as never, {} as never);

		expect(Array.isArray(result.result)).toBe(true);
	});

	it('counts contacts in a list, whose count arrives as a string', async () => {
		const lists = await Api.list(liveContext() as never, {} as never);
		const first = lists.result[0];
		if (!first?.id) return;

		const result = await Api.count(
			liveContext() as never,
			{
				list_id: first.id,
			} as never,
		);

		// Documented as "500", not 500; a z.number() would reject this.
		expect(result.result.count).toBeDefined();
		expect(['number', 'string']).toContain(typeof result.result.count);
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Api.list(liveContext() as never, {} as never);

		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
