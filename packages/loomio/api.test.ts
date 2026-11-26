import { ApiError } from 'corsair/http';
import {
	Discussions,
	Groups,
	Memberships,
	Polls,
	Reports,
	Search,
	Threads,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// Live smoke tests through the real endpoint code (shaping and output
// schemas included). They run only when LOOMIO_API_KEY is set (create one at
// https://www.loomio.com/profile/api_access) and are read-only, so a run never
// posts into a real group. LOOMIO_BASE_URL points them at a self-hosted install.
const hasKey = Boolean(process.env.LOOMIO_API_KEY);
if (!hasKey) {
	console.warn('Skipping Loomio live tests: LOOMIO_API_KEY is not set.');
}
const describeIfKey = hasKey ? describe : describe.skip;

type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function run<T>(endpoint: AnyEndpoint, input: unknown, key?: string) {
	const ctx = {
		key: key ?? process.env.LOOMIO_API_KEY,
		options: { baseUrl: process.env.LOOMIO_BASE_URL },
	};
	return endpoint(ctx as never, input as never) as Promise<T>;
}

describeIfKey('loomio live API (read-only)', () => {
	let groupId: number | undefined;

	it('lists and reads a group', async () => {
		const list = await run<{ groups: { id: number }[] }>(Groups.list, {
			limit: 5,
		});
		expect(Array.isArray(list.groups)).toBe(true);
		groupId = list.groups[0]?.id;
		if (groupId === undefined) return;

		const shown = await run<{ group: { id: number } }>(Groups.get, {
			id: groupId,
			compact: true,
		});
		expect(shown.group.id).toBe(groupId);
	});

	it('lists discussions, polls, and memberships in the first group', async () => {
		if (groupId === undefined) return;
		const discussions = await run<{ discussions: { id: number }[] }>(
			Discussions.list,
			{ group_id: groupId, status: 'all', limit: 5 },
		);
		const firstDiscussion = discussions.discussions[0];
		if (firstDiscussion) {
			const shown = await run<{ discussion: { id: number } }>(Discussions.get, {
				id: firstDiscussion.id,
			});
			expect(shown.discussion.id).toBe(firstDiscussion.id);
		}

		const polls = await run<{ polls: { id: number }[] }>(Polls.list, {
			group_id: groupId,
			status: 'all',
			limit: 5,
		});
		const firstPoll = polls.polls[0];
		if (firstPoll) {
			const shown = await run<{ poll: { id: number } }>(Polls.get, {
				id: firstPoll.id,
			});
			expect(shown.poll.id).toBe(firstPoll.id);
		}

		const memberships = await run<{ memberships: unknown[] }>(
			Memberships.list,
			{ group_id: groupId, limit: 5 },
		);
		expect(Array.isArray(memberships.memberships)).toBe(true);
	});

	it('reads a thread, its timeline, and its markdown export', async () => {
		const threads = await run<{ threads: { id: number }[] }>(Threads.list, {
			limit: 1,
		});
		const topicId = threads.threads[0]?.id;
		if (topicId === undefined) return;

		const thread = await run<{ thread: { id: number } }>(Threads.get, {
			topic_id: topicId,
		});
		expect(thread.thread.id).toBe(topicId);

		const items = await run<{ items: unknown[] }>(Threads.items, {
			topic_id: topicId,
			compact: true,
		});
		expect(Array.isArray(items.items)).toBe(true);

		const markdown = await run<{ markdown: string }>(Threads.markdown, {
			topic_id: topicId,
		});
		expect(typeof markdown.markdown).toBe('string');
	});

	it('searches and builds a participation report', async () => {
		const results = await run<{ search_results: unknown[] }>(Search.query, {
			query: 'the',
		});
		expect(Array.isArray(results.search_results)).toBe(true);

		const report = await run<Record<string, unknown>>(Reports.get, {
			section: 'base',
			group_scope: 'my',
		});
		expect(typeof report).toBe('object');
	});

	it('answers a bad key with 403', async () => {
		const error = await run(Groups.list, {}, 'definitely-not-a-key').catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
	});
});
