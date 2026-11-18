/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a token.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `WRIKE_PERMANENT_TOKEN=... pnpm --filter @corsair-dev/wrike test:live`.
 * Read-only: nothing here creates, edits or deletes a task.
 */
import { Contacts, Tasks, Timelogs } from './endpoints';
import type { WrikeContext, WrikeHostOption } from './index';

const token = process.env.WRIKE_PERMANENT_TOKEN;

const describeIfKey = token ? describe : describe.skip;

if (!token) {
	// A skipped run must not read as a green one.
	console.warn(
		'WRIKE_PERMANENT_TOKEN is not set: the live Wrike suite is skipped, not passing.',
	);
}

/**
 * A Wrike token only works against the host that issued it, so the host is a
 * plugin option. `www` is the default; set `WRIKE_HOST` for a regional one.
 */
const hostEnv = process.env.WRIKE_HOST;
const hostKeys: WrikeHostOption[] = ['www', 'eu', 'us2'];
if (hostEnv !== undefined && !hostKeys.includes(hostEnv as WrikeHostOption)) {
	throw new Error(
		`WRIKE_HOST must be one of ${hostKeys.join(', ')}; got ${hostEnv}`,
	);
}
const host = hostEnv as WrikeHostOption | undefined;

function liveContext(): WrikeContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key` and the host option.
	return {
		key: token,
		options: host ? { host } : {},
	} as unknown as WrikeContext;
}

describeIfKey('live Wrike API', () => {
	it('reads the account through the output schema', async () => {
		const result = await Contacts.account(liveContext() as never, {} as never);

		expect(result).toBeDefined();
	});

	it('lists contacts through the output schema', async () => {
		const result = await Contacts.list(liveContext() as never, {} as never);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('searches tasks through the output schema', async () => {
		const result = await Tasks.list(
			liveContext() as never,
			{
				pageSize: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists comments in the account, capped by limit', async () => {
		const result = await Timelogs.listComments(
			liveContext() as never,
			{
				limit: 5,
			} as never,
		);

		expect(result).toBeDefined();
	});

	it('never exposes the token in a returned object', async () => {
		const result = await Contacts.list(liveContext() as never, {} as never);

		expect(JSON.stringify(result)).not.toContain(token as string);
	});
});
