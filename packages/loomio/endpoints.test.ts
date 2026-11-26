import { logEventFromContext } from 'corsair/core';
import { ZodError } from 'zod';
import { Comments, Discussions, Groups, Polls, Threads } from './endpoints';
import { nextOffset } from './endpoints/types';
import {
	comment,
	discussion,
	discussionsEnvelope,
	group,
	groupsEnvelope,
	itemsEnvelope,
	markdownResponse,
	poll,
	pollsEnvelope,
	threadsEnvelope,
	topic,
	topicItem,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'loomio-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
// The fake context only carries what the endpoints read (ctx.key).
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('groups.list keeps every envelope array and derives next_offset', async () => {
		const many = { ...groupsEnvelope, meta: { root: 'groups', total: 60 } };
		respond(many);

		const result = await invoke(Groups.list, { offset: 0 });

		expect(result).toMatchObject({
			groups: [group],
			users: [expect.objectContaining({ id: 7 })],
			meta: { root: 'groups', total: 60 },
			next_offset: 1,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'loomio.groups.list',
			{ count: 1 },
			'completed',
		);
	});

	it('groups.get unwraps the single record into `group`', async () => {
		respond(groupsEnvelope);

		const result = await invoke(Groups.get, { id: 12 });

		expect(result).toMatchObject({ group });
	});

	it('discussions.list passes related topics and groups through', async () => {
		respond(discussionsEnvelope);

		const result = await invoke(Discussions.list, { group_id: 12 });

		expect(result).toMatchObject({
			discussions: [discussion],
			meta: { root: 'discussions', total: 24 },
		});
	});

	it('discussions.get unwraps the single record', async () => {
		respond(discussionsEnvelope);

		const result = await invoke(Discussions.get, { id: 88 });

		expect(result).toMatchObject({ discussion });
	});

	it('discussions.create returns the created discussion', async () => {
		respond(discussionsEnvelope);

		const result = await invoke(Discussions.create, {
			group_id: 12,
			title: 'Spring palette',
		});

		expect(result).toMatchObject({ discussion });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'loomio.discussions.create',
			{ discussionId: 88, groupId: 12 },
			'completed',
		);
	});

	it('comments.create returns the created comment', async () => {
		respond({
			comments: [comment],
			users: [],
			meta: { root: 'comments', total: null },
		});

		const result = await invoke(Comments.create, {
			discussion_id: 88,
			body: 'I like the blue.',
		});

		expect(result).toMatchObject({ comment });
	});

	it('threads.list keeps the threads array and related discussions', async () => {
		respond(threadsEnvelope);

		const result = await invoke(Threads.list, {});

		expect(result).toMatchObject({
			threads: [topic],
			discussions: [discussion],
			meta: { root: 'threads', total: 6 },
		});
	});

	it('threads.items keeps the items array in sequence order', async () => {
		respond(itemsEnvelope);

		const result = await invoke(Threads.items, { topic_id: 55 });

		expect(result).toMatchObject({ items: [topicItem] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'loomio.threads.items',
			{ topicId: 55, count: 1 },
			'completed',
		);
	});

	it('threads.markdown returns the markdown document', async () => {
		respond(markdownResponse);

		const result = await invoke(Threads.markdown, { topic_id: 55 });

		expect(result).toEqual(markdownResponse);
	});

	it('polls.list keeps polls and rides the related arrays through', async () => {
		respond(pollsEnvelope);

		const result = await invoke(Polls.list, { group_id: 12, status: 'all' });

		expect(result).toMatchObject({
			polls: [poll],
			meta: { root: 'polls', total: 5 },
		});
		expect(result).toMatchObject({
			poll_options: expect.arrayContaining([
				expect.objectContaining({ id: 5, name: 'Sky blue' }),
				expect.objectContaining({ id: 6, name: 'Navy' }),
			]),
		});
	});

	it('polls.get unwraps the single record', async () => {
		respond(pollsEnvelope);

		const result = await invoke(Polls.get, { id: 63 });

		expect(result).toMatchObject({ poll });
	});

	it('polls.create returns the created poll', async () => {
		respond(pollsEnvelope);

		const result = await invoke(Polls.create, {
			discussion_id: 88,
			title: 'Which blue?',
			poll_type: 'poll',
		});

		expect(result).toMatchObject({ poll });
	});
});

describe('next page derivation', () => {
	it('returns undefined once offset plus returned reaches total', () => {
		expect(nextOffset(60, 50, 10)).toBeUndefined();
		expect(nextOffset(60, 55, 5)).toBeUndefined();
	});

	it('returns the next offset while records remain', () => {
		expect(nextOffset(60, 0, 50)).toBe(50);
	});

	it('never returns the current offset after an empty page', () => {
		// Loomio counts the total before reading the page, so a shrinking
		// collection can answer an empty page while total > offset.
		expect(nextOffset(60, 50, 0)).toBeUndefined();
	});

	it('returns undefined without a total', () => {
		expect(nextOffset(null, 0, 50)).toBeUndefined();
		expect(nextOffset(undefined, 0, 50)).toBeUndefined();
	});

	it('threads.list stops paging on the last full page', async () => {
		const last = {
			...threadsEnvelope,
			meta: { root: 'threads', total: 6 },
			threads: Array.from({ length: 6 }, () => topic),
		};
		respond(last);

		const result = await invoke(Threads.list, { limit: 50 });

		expect(result).toMatchObject({ next_offset: undefined });
	});
});

describe('loud failures', () => {
	it('rejects a list response whose primary array is missing', async () => {
		respond({ users: [], meta: { root: 'discussions', total: 0 } });

		await expect(
			invoke(Discussions.list, { group_id: 12 }),
		).rejects.toBeInstanceOf(ZodError);
	});

	it('rejects a get response with an empty primary array', async () => {
		respond({ groups: [], meta: { root: 'groups', total: 0 } });

		await expect(invoke(Groups.get, { id: 12 })).rejects.toBeInstanceOf(
			ZodError,
		);
	});

	it('rejects a known field that arrives with the wrong type', async () => {
		respond({
			...pollsEnvelope,
			polls: [{ ...poll, vote_count_cast: 'four' }],
		});

		await expect(invoke(Polls.get, { id: 63 })).rejects.toBeInstanceOf(
			ZodError,
		);
	});

	it('rejects a markdown response without the markdown string', async () => {
		respond({ content: 'nope' });

		await expect(
			invoke(Threads.markdown, { topic_id: 55 }),
		).rejects.toBeInstanceOf(ZodError);
	});
});

describe('input validation before any request', () => {
	it.each([
		[
			'polls.create without a place',
			Polls.create,
			{ title: 'No home', poll_type: 'poll' },
		],
		[
			'polls.create with a poll_type the schema rejects',
			Polls.create,
			{ group_id: 12, title: 'Q', poll_type: 'referendum' },
		],
		[
			'polls.list with a status the schema rejects',
			Polls.list,
			{ group_id: 12, status: 'archived' },
		],
		[
			'discussions.list with a status the schema rejects',
			Discussions.list,
			{ group_id: 12, status: 'archived' },
		],
		['discussions.list without the required group', Discussions.list, {}],
		['polls.list without the required group', Polls.list, {}],
		['groups.list above the 500 cap', Groups.list, { limit: 501 }],
		[
			'threads.items above the 500 cap',
			Threads.items,
			{ topic_id: 55, limit: 501 },
		],
		[
			'discussions.create with a blank title',
			Discussions.create,
			{ group_id: 12, title: '' },
		],
		[
			'comments.create with a body_format the schema rejects',
			Comments.create,
			{ discussion_id: 88, body: 'hi', body_format: 'rtf' },
		],
		[
			'polls.create with a non-ISO closing_at',
			Polls.create,
			{ group_id: 12, title: 'Q', poll_type: 'poll', closing_at: 'april 1st' },
		],
	])('rejects %s before fetching', async (_name, endpoint, input) => {
		await expect(invoke(endpoint, input)).rejects.toBeInstanceOf(ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
