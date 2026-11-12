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

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant, and Output is inferred from the endpoint. The
// endpoints read only `key` and `options.region` off the context, and each
// input below fits its operation's schema, which parses it again.
function live<Output>(
	endpoint: (ctx: never, input: never) => Promise<Output>,
	key: string | undefined,
	input: object,
): Promise<Output> {
	return endpoint(liveContext(key) as never, input as never);
}

describeIfKey('live Userflow Users API', () => {
	it('lists users through the output schema', async () => {
		const result = await live(Users.list, apiKey, {
			limit: 5,
		});

		expect(Array.isArray(result.data)).toBe(true);
		for (const user of result.data ?? []) {
			expect(typeof user.id).toBe('string');
		}
	});

	it('lists groups through the output schema', async () => {
		const result = await live(Groups.list, apiKey, {
			limit: 5,
		});

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists attribute definitions through the output schema', async () => {
		const result = await live(Attributes.listAttributes, apiKey, {
			limit: 5,
		});

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists content through the output schema', async () => {
		const result = await live(Content.list, apiKey, {
			limit: 5,
		});

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('accepts a descending order_by over the wire', async () => {
		const result = await live(Users.list, apiKey, {
			limit: 1,
			order_by: ['-created_at'],
		});

		expect(Array.isArray(result.data)).toBe(true);
	});
});

describeIfPersonal('live Userflow Accounts API', () => {
	it('lists accounts through the output schema', async () => {
		const result = await live(Accounts.listAccounts, personalKey, {
			limit: 5,
		});

		expect(Array.isArray(result.data)).toBe(true);
	});

	it('never exposes either key in a returned object', async () => {
		const result = await live(Accounts.listAccounts, personalKey, {
			limit: 1,
		});
		const text = JSON.stringify(result);

		// Each key is a string here: this suite runs only when both are set.
		expect(text).not.toContain(apiKey as string);
		expect(text).not.toContain(personalKey as string);
	});
});
