/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a token.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `WORKSNAPS_API_TOKEN=... pnpm --filter @corsair-dev/worksnaps test:live`.
 *
 * Reads only: nothing here creates a project, logs time or assigns anyone. The
 * empty-collection case is worth watching here: an account with no projects at all
 * is exactly what the XML fix was for.
 */
import { Projects, Users } from './endpoints';
import type { WorksnapsContext } from './index';

const token = process.env.WORKSNAPS_API_TOKEN;

const describeIfKey = token ? describe : describe.skip;

if (!token) {
	// A skipped run must not read as a green one.
	console.warn(
		'WORKSNAPS_API_TOKEN is not set: the live Worksnaps suite is skipped, not passing.',
	);
}

function liveContext(): WorksnapsContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: token } as unknown as WorksnapsContext;
}

describeIfKey('live Worksnaps API', () => {
	it('lists projects through the output schema, including an empty list', async () => {
		const result = await Projects.list(liveContext() as never, {} as never);

		// An account with no projects answers `<projects type="array"/>`, which used
		// to fail the parse.
		expect(Array.isArray(result.projects ?? [])).toBe(true);
	});

	it('reads the account user through the output schema', async () => {
		const result = await Users.me(liveContext() as never, {} as never);

		expect(result).toBeDefined();
	});

	it('lists users through the output schema', async () => {
		const result = await Users.list(liveContext() as never, {} as never);

		expect(Array.isArray(result.users ?? [])).toBe(true);
	});

	it('reads a project when the account has one', async () => {
		const list = await Projects.list(liveContext() as never, {} as never);
		const id = list.projects?.[0]?.id;
		if (id === undefined) return;

		const one = await Projects.get(
			liveContext() as never,
			{
				project_id: id,
			} as never,
		);

		expect(one.project?.id).toBe(id);
	});

	it('never exposes the token in a returned object', async () => {
		const result = await Projects.list(liveContext() as never, {} as never);

		expect(JSON.stringify(result)).not.toContain(token as string);
	});
});
