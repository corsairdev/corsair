/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 *
 * Run with `USERLIST_API_KEY=... pnpm --filter @corsair-dev/userlist test:live`.
 *
 * The Push API is write-only: every operation creates or updates data and answers
 * `202` with no body, so there is nothing to read back and nothing here that can be
 * verified by parsing a response. These cases therefore assert the acknowledgement
 * the plugin builds, and they write real records, so point the key at a test
 * workspace. Nothing here deletes.
 */
import { Companies, Events, Users } from './endpoints';
import type { UserlistContext } from './index';

const apiKey = process.env.USERLIST_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'USERLIST_API_KEY is not set: the live Userlist suite is skipped, not passing.',
	);
}

function liveContext(): UserlistContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as UserlistContext;
}

describeIfKey('live Userlist Push API', () => {
	it('accepts a user upsert and reports it as queued', async () => {
		const result = await Users.upsert(
			liveContext() as never,
			{
				identifier: `corsair-smoke-${Date.now()}`,
				email: 'corsair-smoke@example.com',
				properties: { source: 'corsair-live-test' },
			} as never,
		);

		// The answer is built from what was sent: a 202 carries no body.
		expect(result.accepted).toBe(true);
		expect(result.operation).toBeDefined();
	});

	it('accepts a company upsert', async () => {
		const result = await Companies.upsert(
			liveContext() as never,
			{
				identifier: `corsair-smoke-co-${Date.now()}`,
				name: 'Corsair Smoke Test',
			} as never,
		);

		expect(result.accepted).toBe(true);
		expect(result.operation).toBeDefined();
	});

	it('accepts an event against a user', async () => {
		const result = await Events.create(
			liveContext() as never,
			{
				name: 'corsair_smoke_test',
				user: `corsair-smoke-${Date.now()}`,
				properties: { ok: true },
			} as never,
		);

		expect(result.accepted).toBe(true);
		expect(result.operation).toBeDefined();
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Events.create(
			liveContext() as never,
			{
				name: 'corsair_smoke_test',
				user: `corsair-smoke-${Date.now()}`,
			} as never,
		);

		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
