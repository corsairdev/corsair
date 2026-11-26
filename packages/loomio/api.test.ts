import { ApiError } from 'corsair/http';
import {
	Comments,
	Discussions,
	Groups,
	Memberships,
	Polls,
	Reports,
	Search,
	Threads,
	Webhooks,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// Live smoke tests through the real endpoint code (shaping and output
// schemas included). They run only when LOOMIO_API_KEY is set (create one at
// https://www.loomio.com/profile/api_access) and are read-only, so a run never
// posts into a real group. LOOMIO_BASE_URL points them at a self-hosted install.
//
// The write round trip runs only with LOOMIO_LIVE_WRITES=1 and LOOMIO_GROUP_ID
// set to a throwaway group you administer. It sends no recipients, keeps the
// poll a draft, and soft-deletes everything it creates.
const hasKey = Boolean(process.env.LOOMIO_API_KEY);
if (!hasKey) {
	console.warn('Skipping Loomio live tests: LOOMIO_API_KEY is not set.');
}
const describeIfKey = hasKey ? describe : describe.skip;
const writeGroupId = Number(process.env.LOOMIO_GROUP_ID);
const canWrite =
	hasKey &&
	process.env.LOOMIO_LIVE_WRITES === '1' &&
	Number.isInteger(writeGroupId) &&
	writeGroupId > 0;
const describeIfWrites = canWrite ? describe : describe.skip;

// Hosted search across every visible group can take longer than the client's
// 20 s timeout; the group-scoped search below answers in about a second.
jest.setTimeout(60_000);

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

	it('searches a group, lists its webhooks, and builds participation reports', async () => {
		if (groupId === undefined) return;
		const results = await run<{ search_results: unknown[] }>(Search.query, {
			query: 'corsair',
			group_id: groupId,
		});
		expect(Array.isArray(results.search_results)).toBe(true);

		const webhooks = await run<{ chatbots: unknown[] }>(Webhooks.list, {
			group_id: groupId,
		});
		expect(Array.isArray(webhooks.chatbots)).toBe(true);

		for (const section of ['base', 'users'] as const) {
			const report = await run<Record<string, unknown>>(Reports.get, {
				section,
				group_scope: 'my',
			});
			expect(typeof report).toBe('object');
		}
	});

	it('answers a bad key with 403', async () => {
		const error = await run(Groups.list, {}, 'definitely-not-a-key').catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
	});
});

describeIfWrites('loomio live API (write round trip, throwaway group)', () => {
	const title = `corsair-plugin-test ${new Date().toISOString()}`;
	let discussionId: number | undefined;
	let pollId: number | undefined;

	afterAll(async () => {
		// Soft-delete whatever a failed step left behind.
		if (pollId !== undefined) {
			await run(Polls.remove, { id: pollId }).catch(() => undefined);
		}
		if (discussionId !== undefined) {
			await run(Discussions.remove, { id: discussionId }).catch(
				() => undefined,
			);
		}
	});

	it('creates, edits, and deletes a discussion with comments', async () => {
		const created = await run<{ discussion: { id: number; title: string } }>(
			Discussions.create,
			{
				group_id: writeGroupId,
				title,
				description: 'Created by the Corsair Loomio plugin live test.',
			},
		);
		discussionId = created.discussion.id;
		expect(created.discussion.title).toBe(title);

		const updated = await run<{ discussion: { title: string } }>(
			Discussions.update,
			{ id: discussionId, title: `${title} (edited)` },
		);
		expect(updated.discussion.title).toBe(`${title} (edited)`);

		const comment = await run<{ comment: { id: number } }>(Comments.create, {
			discussion_id: discussionId,
			body: 'corsair-plugin-test comment',
		});
		const reply = await run<{ comment: { id: number; parent_id?: number } }>(
			Comments.create,
			{
				discussion_id: discussionId,
				parent_id: comment.comment.id,
				body: 'corsair-plugin-test reply',
			},
		);
		expect(reply.comment.id).not.toBe(comment.comment.id);

		const edited = await run<{ comment: { body: string } }>(Comments.update, {
			id: comment.comment.id,
			body: 'corsair-plugin-test comment (edited)',
		});
		expect(edited.comment.body).toContain('(edited)');

		await run(Comments.remove, { id: reply.comment.id });
		await run(Comments.remove, { id: comment.comment.id });
	});

	it('creates, edits, and deletes a draft proposal', async () => {
		const created = await run<{ poll: { id: number; title: string } }>(
			Polls.create,
			{
				group_id: writeGroupId,
				poll_type: 'proposal',
				title: `${title} poll`,
				details: 'Draft poll from the Corsair Loomio plugin live test.',
			},
		);
		pollId = created.poll.id;
		expect(created.poll.title).toBe(`${title} poll`);

		const shown = await run<{ poll: { id: number } }>(Polls.get, {
			id: pollId,
		});
		expect(shown.poll.id).toBe(pollId);

		const updated = await run<{ poll: { title: string } }>(Polls.update, {
			id: pollId,
			title: `${title} poll (edited)`,
		});
		expect(updated.poll.title).toBe(`${title} poll (edited)`);

		await run(Polls.remove, { id: pollId });
		pollId = undefined;

		if (discussionId !== undefined) {
			await run(Discussions.remove, { id: discussionId });
			discussionId = undefined;
		}
	});
});
