/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * key. Every read goes through its operation's output schema, so a field the
 * schema gets wrong fails here rather than in a caller's hands.
 *
 * Run with `ROCKETLANE_API_KEY=... pnpm --filter @corsair-dev/rocketlane test:live`.
 */

import * as Directory from './endpoints/directory';
import * as Projects from './endpoints/projects';
import * as Tasks from './endpoints/tasks';
import * as TimeEntries from './endpoints/time-entries';
import type { RocketlaneContext } from './index';

const apiKey = process.env.ROCKETLANE_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'ROCKETLANE_API_KEY is not set: the live Rocketlane suite is skipped, not passing.',
	);
}

function liveContext(): RocketlaneContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as RocketlaneContext;
}

describeIfKey('live Rocketlane API', () => {
	it('lists tasks through the output schema', async () => {
		const result = await Tasks.list(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.tasks)).toBe(true);
		// The token is a string or null, never an empty string.
		expect(result.next_page_token).not.toBe('');
	});

	it('lists projects through the output schema', async () => {
		const result = await Projects.list(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.projects)).toBe(true);
	});

	it('lists companies through the output schema', async () => {
		const result = await Directory.companiesList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.companies)).toBe(true);
	});

	it('lists users through the output schema', async () => {
		const result = await Directory.usersList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.users)).toBe(true);
		if (result.users.length > 0 && result.users[0]?.userId !== undefined) {
			// Read one back by id to pin the single-object form too.
			const one = await Directory.usersGet(
				liveContext() as never,
				{
					user_id: result.users[0].userId,
				} as never,
			);
			expect(one.user.userId).toBe(result.users[0].userId);
		}
	});

	it('lists time entries through the output schema', async () => {
		const result = await TimeEntries.list(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.time_entries)).toBe(true);
	});
});
