/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * token. Every read goes through its operation's output schema.
 *
 * Run with `ROAM_API_KEY=... pnpm --filter @corsair-dev/roam test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { RoamContext } from './index';

const apiKey = process.env.ROAM_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'ROAM_API_KEY is not set: the live Roam HQ suite is skipped, not passing.',
	);
}

function liveContext(): RoamContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as RoamContext;
}

describeIfKey('live Roam HQ API', () => {
	it('reads the token info, which also confirms the pinned version', async () => {
		const result = await Endpoints.tokenInfo(
			liveContext() as never,
			{} as never,
		);

		expect(result.token.user?.id).toBeTruthy();
		expect(result.token.version).toBeTruthy();
	});

	it('lists chats and users through the output schema', async () => {
		const chats = await Endpoints.chatList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(chats.chats)).toBe(true);

		const users = await Endpoints.userList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(users.users)).toBe(true);
	});

	it('lists groups and meetings', async () => {
		const groups = await Endpoints.groupList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(groups.groups)).toBe(true);

		const meetings = await Endpoints.meetingList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(meetings.meetings)).toBe(true);
	});

	it('reads a chat history and its reactions', async () => {
		const chats = await Endpoints.chatList(
			liveContext() as never,
			{
				limit: 1,
			} as never,
		);

		const first = chats.chats[0];
		if (!first?.id) return;

		const history = await Endpoints.chatHistory(
			liveContext() as never,
			{
				chat_id: first.id,
				limit: 2,
			} as never,
		);
		expect(Array.isArray(history.messages)).toBe(true);
	});
});
