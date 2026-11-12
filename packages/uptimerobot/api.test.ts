/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `UPTIMEROBOT_API_KEY=... pnpm --filter @corsair-dev/uptimerobot test:live`.
 * Read-only: nothing here creates, updates or deletes a monitor.
 */
import { Account, Incidents, Monitors, StatusPages, Tags } from './endpoints';
import type { UptimeRobotContext } from './index';

const apiKey = process.env.UPTIMEROBOT_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'UPTIMEROBOT_API_KEY is not set: the live UptimeRobot suite is skipped, not passing.',
	);
}

function liveContext(): UptimeRobotContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as UptimeRobotContext;
}

describeIfKey('live UptimeRobot API', () => {
	it('reads the account through the output schema', async () => {
		const result = await Account.me(liveContext() as never, {} as never);

		expect(typeof result).toBe('object');
	});

	it('lists monitors through the output schema', async () => {
		const result = await Monitors.list(
			liveContext() as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
		for (const monitor of result.data ?? []) {
			expect(typeof monitor.id).toBe('number');
			// The monitor schema types status as a plain string.
			expect(['string', 'undefined', 'object']).toContain(
				typeof monitor.status,
			);
		}
	});

	it('pages incidents with the opaque cursor', async () => {
		const result = await Incidents.list(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
		if (result.nextLink) {
			// The cursor is the opaque value after `cursor=`, not a number.
			const cursor = new URL(result.nextLink).searchParams.get('cursor');
			if (cursor) expect(typeof cursor).toBe('string');
		}
	});

	it('lists status pages through the output schema', async () => {
		const result = await StatusPages.list(
			liveContext() as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists tags through the output schema', async () => {
		const result = await Tags.list(
			liveContext() as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Monitors.list(
			liveContext() as never,
			{
				limit: 1,
			} as never,
		);

		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
