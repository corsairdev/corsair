/**
 * Live smoke tests. CI skips this file by name, and it skips itself without keys.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with both keys set:
 *   USERFLOW_API_KEY=ak_... USERFLOW_PERSONAL_KEY=pak_... \
 *     pnpm --filter @corsair-dev/userflow test:live
 *
 * The Users API needs an environment key and the Accounts API a personal key, so
 * the Accounts cases are skipped when only the environment key is present.
 */
import { Accounts, Attributes, Content, Groups, Users } from './endpoints';
import type { UserflowContext } from './index';

const apiKey = process.env.USERFLOW_API_KEY;
const personalKey = process.env.USERFLOW_PERSONAL_KEY;

const describeIfKey = apiKey ? describe : describe.skip;
const describeIfPersonal = apiKey && personalKey ? describe : describe.skip;

if (!apiKey || !personalKey) {
	// A skipped run must not read as a green one.
	console.warn(
		[
			apiKey ? null : 'USERFLOW_API_KEY',
			personalKey ? null : 'USERFLOW_PERSONAL_KEY',
		]
			.filter(Boolean)
			.join(' and ') +
			' not set: the matching live Userflow cases are skipped, not passing.',
	);
}

function liveContext(key?: string): UserflowContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key, options: { region: 'us' } } as unknown as UserflowContext;
}

describeIfKey('live Userflow Users API', () => {
	it('lists users through the output schema', async () => {
		const result = await Users.list(
			liveContext(apiKey) as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
		for (const user of result.data ?? []) {
			expect(typeof user.id).toBe('string');
		}
	});

	it('lists groups through the output schema', async () => {
		const result = await Groups.list(
			liveContext(apiKey) as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists attribute definitions through the output schema', async () => {
		const result = await Attributes.listAttributes(
			liveContext(apiKey) as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists content through the output schema', async () => {
		const result = await Content.list(
			liveContext(apiKey) as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('accepts a descending order_by over the wire', async () => {
		const result = await Users.list(
			liveContext(apiKey) as never,
			{
				limit: 1,
				order_by: ['-created_at'],
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});
});

describeIfPersonal('live Userflow Accounts API', () => {
	it('lists accounts through the output schema', async () => {
		const result = await Accounts.listAccounts(
			liveContext(personalKey) as never,
			{
				limit: 5,
			} as never,
		);

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('never exposes either key in a returned object', async () => {
		const result = await Accounts.listAccounts(
			liveContext(personalKey) as never,
			{
				limit: 1,
			} as never,
		);
		const text = JSON.stringify(result);

		expect(text).not.toContain(apiKey as string);
		expect(text).not.toContain(personalKey as string);
	});
});
