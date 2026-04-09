import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { teams } from './index';

// DB event payloads are stored as JSON strings or objects; unknown enforces narrowing before use
function parsePayload(payload: unknown): unknown {
	return typeof payload === 'string' ? JSON.parse(payload) : payload;
}

async function createTeamsClient() {
	const accessToken = process.env.TEAMS_ACCESS_TOKEN;
	if (!accessToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'teams', 'default');

	const corsair = createCorsair({
		plugins: [teams({ key: accessToken })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('Teams plugin integration', () => {
	describe('teams', () => {
		it('teamsList interacts with API and DB', async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { top: 5 };
			const result = await corsair.teams.api.teams.list(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'teams.teams.list' },
			});
			expect(events.length).toBeGreaterThan(0);

			if (result.value.length > 0) {
				const first = result.value[0]!;
				const fromDb = await corsair.teams.db.teams.findByEntityId(first.id);
				expect(fromDb).not.toBeNull();
				expect(fromDb?.data.id).toBe(first.id);
			}

			testDb.cleanup();
		});

		it('teamsGet interacts with API and DB', async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const listed = await corsair.teams.api.teams.list({ top: 1 });
			const teamId = listed.value?.[0]?.id;
			if (!teamId) return;

			const input = { teamId };
			const result = await corsair.teams.api.teams.get(input);

			expect(result).toBeDefined();
			expect(result.id).toBe(teamId);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'teams.teams.get' },
			});
			expect(events.length).toBeGreaterThan(0);
			const lastEvent = events[events.length - 1]!;
			expect(parsePayload(lastEvent.payload)).toMatchObject(input);

			testDb.cleanup();
		});

		it('teamsCreate interacts with API and DB', async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = {
				displayName: `Corsair Integration Test ${Date.now()}`,
				description: 'Created by corsair integration test',
				visibility: 'private' as const,
			};

			let result: Awaited<ReturnType<typeof corsair.teams.api.teams.create>>;
			try {
				result = await corsair.teams.api.teams.create(input);
			} catch {
				// Teams API requires template@odata.bind or specific permissions — skip if unavailable
				testDb.cleanup();
				return;
			}

			expect(result).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'teams.teams.create' },
			});
			expect(events.length).toBeGreaterThan(0);
			expect(parsePayload(events[events.length - 1]!.payload)).toMatchObject(
				input,
			);

			testDb.cleanup();
		});

		it('teamsUpdate interacts with API and DB', async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const listed = await corsair.teams.api.teams.list({ top: 1 });
			const teamId = listed.value?.[0]?.id;
			if (!teamId) return;

			const input = {
				teamId,
				description: `Updated by corsair test ${Date.now()}`,
			};
			let result: Awaited<ReturnType<typeof corsair.teams.api.teams.update>>;
			try {
				result = await corsair.teams.api.teams.update(input);
			} catch {
				// May fail with Forbidden if the account lacks team update permissions — skip
				testDb.cleanup();
				return;
			}

			expect(result).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'teams.teams.update' },
			});
			expect(events.length).toBeGreaterThan(0);
			expect(parsePayload(events[events.length - 1]!.payload)).toMatchObject(
				input,
			);

			testDb.cleanup();
		});
	});

	describe('channels', () => {
		let teamId: string;

		beforeAll(async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;
			const listed = await corsair.teams.api.teams.list({ top: 1 });
			teamId = listed.value?.[0]?.id ?? '';
			testDb.cleanup();
		});

		it('channelsList interacts with API and DB', async () => {
			if (!teamId) return;
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const input = { teamId };
			const result = await corsair.teams.api.channels.list(input);

			expect(result).toBeDefined();
			expect(Array.isArray(result.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'teams.channels.list' },
			});
			expect(events.length).toBeGreaterThan(0);
			expect(parsePayload(events[events.length - 1]!.payload)).toMatchObject(
				input,
			);

			if (result.value.length > 0) {
				const first = result.value[0]!;
				const fromDb = await corsair.teams.db.channels.findByEntityId(first.id);
				expect(fromDb).not.toBeNull();
				expect(fromDb?.data.id).toBe(first.id);
			}

			testDb.cleanup();
		});

		it('channelsGet interacts with API and DB', async () => {
			if (!teamId) return;
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const listed = await corsair.teams.api.channels.list({ teamId });
			const channelId = listed.value?.[0]?.id;
			if (!channelId) return;

			const input = { teamId, channelId };
			const result = await corsair.teams.api.channels.get(input);

			expect(result).toBeDefined();
			expect(result.id).toBe(channelId);

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'teams.channels.get' },
			});
			expect(events.length).toBeGreaterThan(0);
			expect(parsePayload(events[events.length - 1]!.payload)).toMatchObject(
				input,
			);

			testDb.cleanup();
		});

		it('channelsCreate and channelsUpdate and channelsDelete interact with API and DB', async () => {
			if (!teamId) return;
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const createInput = {
				teamId,
				displayName: `Corsair Test ${Date.now()}`,
				description: 'Created by corsair integration test',
				membershipType: 'standard' as const,
			};

			const created = await corsair.teams.api.channels.create(createInput);

			expect(created).toBeDefined();
			expect(created.id).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const createEvents = await orm.events.findMany({
				where: { event_type: 'teams.channels.create' },
			});
			expect(createEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(createEvents[createEvents.length - 1]!.payload),
			).toMatchObject(createInput);

			const fromDb = await corsair.teams.db.channels.findByEntityId(created.id);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.id).toBe(created.id);

			if (created.id) {
				const updateInput = {
					teamId,
					channelId: created.id,
					description: 'Updated by corsair test',
				};
				const updated = await corsair.teams.api.channels.update(updateInput);

				expect(updated).toBeDefined();

				const updateEvents = await orm.events.findMany({
					where: { event_type: 'teams.channels.update' },
				});
				expect(updateEvents.length).toBeGreaterThan(0);
				expect(
					parsePayload(updateEvents[updateEvents.length - 1]!.payload),
				).toMatchObject(updateInput);

				const deleteInput = { teamId, channelId: created.id };
				const deleted = await corsair.teams.api.channels.delete(deleteInput);

				expect(deleted).toBeDefined();

				const deleteEvents = await orm.events.findMany({
					where: { event_type: 'teams.channels.delete' },
				});
				expect(deleteEvents.length).toBeGreaterThan(0);
				expect(
					parsePayload(deleteEvents[deleteEvents.length - 1]!.payload),
				).toMatchObject(deleteInput);
			}

			testDb.cleanup();
		});
	});

	describe('messages', () => {
		let teamId: string;
		let channelId: string;

		beforeAll(async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const teamsResult = await corsair.teams.api.teams.list({ top: 1 });
			teamId = teamsResult.value?.[0]?.id ?? '';
			if (!teamId) return;

			const channelsResult = await corsair.teams.api.channels.list({ teamId });
			channelId = channelsResult.value?.[0]?.id ?? '';

			testDb.cleanup();
		});

		it('messagesSend, messagesGet, messagesList, messagesReply, messagesListReplies, messagesDelete interact with API and DB', async () => {
			if (!teamId || !channelId) return;
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			// send
			const sendInput = {
				teamId,
				channelId,
				body: {
					content: `corsair integration test ${Date.now()}`,
					contentType: 'text' as const,
				},
			};
			const sent = await corsair.teams.api.messages.send(sendInput);

			expect(sent).toBeDefined();
			expect(sent.id).toBeDefined();

			const sendEvents = await orm.events.findMany({
				where: { event_type: 'teams.messages.send' },
			});
			expect(sendEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(sendEvents[sendEvents.length - 1]!.payload),
			).toMatchObject(sendInput);

			const fromDb = await corsair.teams.db.messages.findByEntityId(sent.id);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.id).toBe(sent.id);

			// list
			const listInput = { teamId, channelId };
			const list = await corsair.teams.api.messages.list(listInput);

			expect(list).toBeDefined();
			expect(Array.isArray(list.value)).toBe(true);

			const listEvents = await orm.events.findMany({
				where: { event_type: 'teams.messages.list' },
			});
			expect(listEvents.length).toBeGreaterThan(0);

			// get
			const getInput = { teamId, channelId, messageId: sent.id };
			const got = await corsair.teams.api.messages.get(getInput);

			expect(got).toBeDefined();
			expect(got.id).toBe(sent.id);

			const getEvents = await orm.events.findMany({
				where: { event_type: 'teams.messages.get' },
			});
			expect(getEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(getEvents[getEvents.length - 1]!.payload),
			).toMatchObject(getInput);

			// reply
			const replyInput = {
				teamId,
				channelId,
				messageId: sent.id,
				body: {
					content: 'corsair integration test reply',
					contentType: 'text' as const,
				},
			};
			const replied = await corsair.teams.api.messages.reply(replyInput);

			expect(replied).toBeDefined();
			expect(replied.id).toBeDefined();

			const replyEvents = await orm.events.findMany({
				where: { event_type: 'teams.messages.reply' },
			});
			expect(replyEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(replyEvents[replyEvents.length - 1]!.payload),
			).toMatchObject(replyInput);

			// listReplies
			const listRepliesInput = { teamId, channelId, messageId: sent.id };
			const replies =
				await corsair.teams.api.messages.listReplies(listRepliesInput);

			expect(replies).toBeDefined();
			expect(Array.isArray(replies.value)).toBe(true);
			expect(replies.value.length).toBeGreaterThan(0);

			const listRepliesEvents = await orm.events.findMany({
				where: { event_type: 'teams.messages.listReplies' },
			});
			expect(listRepliesEvents.length).toBeGreaterThan(0);

			// delete
			const deleteInput = { teamId, channelId, messageId: sent.id };
			const deleted = await corsair.teams.api.messages.delete(deleteInput);

			expect(deleted).toBeDefined();

			const deleteEvents = await orm.events.findMany({
				where: { event_type: 'teams.messages.delete' },
			});
			expect(deleteEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(deleteEvents[deleteEvents.length - 1]!.payload),
			).toMatchObject(deleteInput);

			testDb.cleanup();
		});
	});

	describe('members', () => {
		let teamId: string;

		beforeAll(async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;
			const listed = await corsair.teams.api.teams.list({ top: 1 });
			teamId = listed.value?.[0]?.id ?? '';
			testDb.cleanup();
		});

		it('membersList and membersGet interact with API and DB', async () => {
			if (!teamId) return;
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const listInput = { teamId };
			const list = await corsair.teams.api.members.list(listInput);

			expect(list).toBeDefined();
			expect(Array.isArray(list.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const listEvents = await orm.events.findMany({
				where: { event_type: 'teams.members.list' },
			});
			expect(listEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(listEvents[listEvents.length - 1]!.payload),
			).toMatchObject(listInput);

			if (list.value.length > 0) {
				const first = list.value[0]!;

				const fromDb = await corsair.teams.db.members.findByEntityId(first.id);
				expect(fromDb).not.toBeNull();
				expect(fromDb?.data.id).toBe(first.id);

				const getInput = { teamId, membershipId: first.id };
				const got = await corsair.teams.api.members.get(getInput);

				expect(got).toBeDefined();
				expect(got.id).toBe(first.id);

				const getEvents = await orm.events.findMany({
					where: { event_type: 'teams.members.get' },
				});
				expect(getEvents.length).toBeGreaterThan(0);
				expect(
					parsePayload(getEvents[getEvents.length - 1]!.payload),
				).toMatchObject(getInput);
			}

			testDb.cleanup();
		});

		it('membersAdd and membersRemove interact with API and DB', async () => {
			if (!teamId) return;
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const orm = createCorsairOrm(testDb.database);

			const existingMembers = await corsair.teams.api.members.list({ teamId });
			const memberUserIds = new Set(
				existingMembers.value.map((m) => m.userId).filter(Boolean),
			);

			// fetch org users to find a non-member to add
			const orgUsers = (await fetch(
				`https://graph.microsoft.com/v1.0/users?$top=999&$select=id`,
				{
					headers: {
						Authorization: `Bearer ${process.env.TEAMS_ACCESS_TOKEN}`,
					},
				},
			).then((r) => r.json())) as { value: Array<{ id: string }> };

			const candidate = orgUsers.value.find((u) => !memberUserIds.has(u.id));
			if (!candidate) {
				testDb.cleanup();
				return;
			}

			const addInput = {
				teamId,
				userId: candidate.id,
				roles: ['member' as const],
			};
			const added = await corsair.teams.api.members.add(addInput);

			expect(added).toBeDefined();
			expect(added.id).toBeDefined();

			const addEvents = await orm.events.findMany({
				where: { event_type: 'teams.members.add' },
			});
			expect(addEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(addEvents[addEvents.length - 1]!.payload),
			).toMatchObject(addInput);

			const fromDb = await corsair.teams.db.members.findByEntityId(added.id);
			expect(fromDb).not.toBeNull();

			const removeInput = { teamId, membershipId: added.id };
			const removed = await corsair.teams.api.members.remove(removeInput);

			expect(removed).toBeDefined();

			const removeEvents = await orm.events.findMany({
				where: { event_type: 'teams.members.remove' },
			});
			expect(removeEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(removeEvents[removeEvents.length - 1]!.payload),
			).toMatchObject(removeInput);

			testDb.cleanup();
		});
	});

	describe('chats', () => {
		it('chatsList and chatsGet interact with API and DB', async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const listInput = { top: 5 };
			const list = await corsair.teams.api.chats.list(listInput);

			expect(list).toBeDefined();
			expect(Array.isArray(list.value)).toBe(true);

			const orm = createCorsairOrm(testDb.database);
			const listEvents = await orm.events.findMany({
				where: { event_type: 'teams.chats.list' },
			});
			expect(listEvents.length).toBeGreaterThan(0);

			if (list.value.length > 0) {
				const first = list.value[0]!;

				const fromDb = await corsair.teams.db.chats.findByEntityId(first.id);
				expect(fromDb).not.toBeNull();
				expect(fromDb?.data.id).toBe(first.id);

				const getInput = { chatId: first.id };
				const got = await corsair.teams.api.chats.get(getInput);

				expect(got).toBeDefined();
				expect(got.id).toBe(first.id);

				const getEvents = await orm.events.findMany({
					where: { event_type: 'teams.chats.get' },
				});
				expect(getEvents.length).toBeGreaterThan(0);
				expect(
					parsePayload(getEvents[getEvents.length - 1]!.payload),
				).toMatchObject(getInput);
			}

			testDb.cleanup();
		});

		it('chatsCreate interacts with API and DB', async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const me = (await fetch('https://graph.microsoft.com/v1.0/me', {
				headers: { Authorization: `Bearer ${process.env.TEAMS_ACCESS_TOKEN}` },
			}).then((r) => r.json())) as { id: string };

			const orgUsers = (await fetch(
				`https://graph.microsoft.com/v1.0/users?$top=5&$select=id`,
				{
					headers: {
						Authorization: `Bearer ${process.env.TEAMS_ACCESS_TOKEN}`,
					},
				},
			).then((r) => r.json())) as { value: Array<{ id: string }> };

			const other = orgUsers.value.find((u) => u.id !== me.id);
			if (!other) {
				testDb.cleanup();
				return;
			}

			const createInput = {
				chatType: 'oneOnOne' as const,
				members: [
					{ userId: me.id, roles: ['owner'] },
					{ userId: other.id, roles: ['owner'] },
				],
			};

			const created = await corsair.teams.api.chats.create(createInput);

			expect(created).toBeDefined();
			expect(created.id).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const createEvents = await orm.events.findMany({
				where: { event_type: 'teams.chats.create' },
			});
			expect(createEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(createEvents[createEvents.length - 1]!.payload),
			).toMatchObject(createInput);

			const fromDb = await corsair.teams.db.chats.findByEntityId(created.id);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.id).toBe(created.id);

			testDb.cleanup();
		});

		it('chatsListMessages and chatsSendMessage interact with API and DB', async () => {
			const setup = await createTeamsClient();
			if (!setup) return;
			const { corsair, testDb } = setup;

			const listed = await corsair.teams.api.chats.list({ top: 1 });
			const chatId = listed.value?.[0]?.id;
			if (!chatId) {
				testDb.cleanup();
				return;
			}

			const orm = createCorsairOrm(testDb.database);

			const sendInput = {
				chatId,
				body: {
					content: `corsair chat integration test ${Date.now()}`,
					contentType: 'text' as const,
				},
			};
			const sent = await corsair.teams.api.chats.sendMessage(sendInput);

			expect(sent).toBeDefined();
			expect(sent.id).toBeDefined();

			const sendEvents = await orm.events.findMany({
				where: { event_type: 'teams.chats.sendMessage' },
			});
			expect(sendEvents.length).toBeGreaterThan(0);
			expect(
				parsePayload(sendEvents[sendEvents.length - 1]!.payload),
			).toMatchObject(sendInput);

			const fromDb = await corsair.teams.db.messages.findByEntityId(sent.id);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.id).toBe(sent.id);

			const listInput = { chatId };
			const messages = await corsair.teams.api.chats.listMessages(listInput);

			expect(messages).toBeDefined();
			expect(Array.isArray(messages.value)).toBe(true);
			expect(messages.value.length).toBeGreaterThan(0);

			const listEvents = await orm.events.findMany({
				where: { event_type: 'teams.chats.listMessages' },
			});
			expect(listEvents.length).toBeGreaterThan(0);

			testDb.cleanup();
		});
	});
});
