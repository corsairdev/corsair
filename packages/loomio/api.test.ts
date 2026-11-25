import { makeLoomioRequest } from './client';
import { LoomioEndpointOutputSchemas as Outputs } from './endpoints/types';

// Live smoke tests. They run only when LOOMIO_API_KEY is set (create one at
// https://www.loomio.com/profile/api_access) and are read-only: the write
// operations stay untested here so a CI run cannot post into a real group.
const describeIfKey = process.env.LOOMIO_API_KEY ? describe : describe.skip;

describeIfKey('loomio live API', () => {
	const key = process.env.LOOMIO_API_KEY as string;

	it('lists and reads a group through its output schema', async () => {
		const raw = await makeLoomioRequest(key, {
			method: 'GET',
			path: '/groups',
			query: { limit: 5 },
		});
		const { groups } = Outputs.groupsList.parse(raw);

		expect(Array.isArray(groups)).toBe(true);
		const first = groups[0];
		if (first === undefined) return;

		const shown = Outputs.groupsGet.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: `/groups/${first.id}`,
				resourceScoped: true,
			}),
		);
		expect(shown.group.id).toBe(first.id);
	});

	it('lists discussions, threads, and polls through their output schemas', async () => {
		const rawGroups = Outputs.groupsList.parse(
			await makeLoomioRequest(key, { method: 'GET', path: '/groups' }),
		);
		const groupId = rawGroups.groups[0]?.id;
		if (groupId === undefined) return;

		const discussions = Outputs.discussionsList.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: '/discussions',
				query: { group_id: groupId, limit: 5 },
			}),
		);
		expect(Array.isArray(discussions.discussions)).toBe(true);

		const threads = Outputs.threadsList.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: '/threads',
				query: { limit: 5 },
			}),
		);
		expect(Array.isArray(threads.threads)).toBe(true);

		const polls = Outputs.pollsList.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: '/polls',
				query: { group_id: groupId, status: 'all', limit: 5 },
			}),
		);
		expect(Array.isArray(polls.polls)).toBe(true);
	});

	it('reads a thread timeline and markdown export for a real thread', async () => {
		const threads = Outputs.threadsList.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: '/threads',
				query: { limit: 1 },
			}),
		);
		const topicId = threads.threads[0]?.id;
		if (topicId === undefined) return;

		const items = Outputs.threadsItems.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: `/threads/${topicId}/items`,
				resourceScoped: true,
			}),
		);
		expect(Array.isArray(items.items)).toBe(true);

		const markdown = Outputs.threadsMarkdown.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: `/threads/${topicId}/markdown`,
				resourceScoped: true,
			}),
		);
		expect(markdown.markdown.length).toBeGreaterThan(0);
	});

	it('reads one poll with its options when the group has any', async () => {
		const groups = Outputs.groupsList.parse(
			await makeLoomioRequest(key, { method: 'GET', path: '/groups' }),
		);
		const groupId = groups.groups[0]?.id;
		if (groupId === undefined) return;

		const polls = Outputs.pollsList.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: '/polls',
				query: { group_id: groupId, status: 'all', limit: 5 },
			}),
		);
		const firstPoll = polls.polls[0];
		if (firstPoll === undefined) return;

		const shown = Outputs.pollsGet.parse(
			await makeLoomioRequest(key, {
				method: 'GET',
				path: `/polls/${firstPoll.id}`,
				resourceScoped: true,
			}),
		);
		expect(shown.poll.id).toBe(firstPoll.id);
	});

	it('answers a missing key with 403 and a message body', async () => {
		await expect(
			makeLoomioRequest('definitely-not-a-key', {
				method: 'GET',
				path: '/groups',
			}),
		).rejects.toThrow(/403/);
	});
});
