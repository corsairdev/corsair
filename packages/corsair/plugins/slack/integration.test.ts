import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createCorsairOrm } from '../../db/orm';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { slack } from './index';

dotenv.config();

async function createSlackClient() {
	const botToken = process.env.SLACK_BOT_TOKEN;
	const channel = process.env.TEST_SLACK_CHANNEL;
	const userId = process.env.TEST_SLACK_USER_ID;
	if (!botToken || !channel || !userId) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'slack', 'default');

	const corsair = createCorsair({
		plugins: [
			slack({}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	console.log(corsair);

	console.log(botToken);

	await corsair.slack.keys.issueNewDEK()
	
	await corsair.slack.keys.setApiKey(botToken);
	
	return { corsair, testDb, channel, userId };
}

describe('Slack plugin integration', () => {
	it('messages endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const postInput = {
			channel,
			text: `corsair slack integration test ${Date.now()}`,
		};

		const posted = await corsair.slack.api.messages.post(postInput);

		expect(posted).toBeDefined();
		expect(posted.ok).toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const postEvents = await orm.events.findMany({
			where: { event_type: 'slack.messages.postMessage' },
		});

		expect(postEvents.length).toBeGreaterThan(0);
		const postEvent = postEvents[postEvents.length - 1]!;
		const postEventPayload =
			typeof postEvent.payload === 'string'
				? JSON.parse(postEvent.payload)
				: postEvent.payload;
		expect(postEventPayload).toMatchObject(postInput);

		if (posted.ts) {
			const messageFromDb = await corsair.slack.db.messages.findByEntityId(
				posted.ts,
			);
			expect(messageFromDb).not.toBeNull();
			if (messageFromDb && posted.ts) {
				expect(messageFromDb.data.ts).toBe(posted.ts);
			}

			const updateInput = {
				channel,
				ts: posted.ts,
				text: 'updated by corsair test',
			};

			const updated = await corsair.slack.api.messages.update(updateInput);

			expect(updated).toBeDefined();
			expect(updated.ok).toBe(true);

			const updateEvents = await orm.events.findMany({
				where: { event_type: 'slack.messages.update' },
			});

			expect(updateEvents.length).toBeGreaterThan(0);
			const updateEvent = updateEvents[updateEvents.length - 1]!;
			const updateEventPayload =
				typeof updateEvent.payload === 'string'
					? JSON.parse(updateEvent.payload)
					: updateEvent.payload;
			expect(updateEventPayload).toMatchObject(updateInput);

			const deleteInput = {
				channel,
				ts: posted.ts,
			};

			const deleted = await corsair.slack.api.messages.delete(deleteInput);

			expect(deleted).toBeDefined();
			expect(deleted.ok).toBe(true);

			const deleteEvents = await orm.events.findMany({
				where: { event_type: 'slack.messages.delete' },
			});

			expect(deleteEvents.length).toBeGreaterThan(0);
			const deleteEvent = deleteEvents[deleteEvents.length - 1]!;
			const deleteEventPayload =
				typeof deleteEvent.payload === 'string'
					? JSON.parse(deleteEvent.payload)
					: deleteEvent.payload;
			expect(deleteEventPayload).toMatchObject(deleteInput);
		}

		testDb.cleanup();
	});

	it('channels endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const listInput = {
			types: 'public_channel,private_channel',
		};

		const list = await corsair.slack.api.channels.list(listInput);

		expect(list).toBeDefined();
		expect(list.ok).toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'slack.channels.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (list.channels && list.channels.length > 0) {
			const firstChannel = list.channels[0];
			if (firstChannel && firstChannel.id) {
				const channelFromDb = await corsair.slack.db.channels.findByEntityId(
					firstChannel.id,
				);
				expect(channelFromDb).not.toBeNull();
				if (channelFromDb) {
					expect(channelFromDb.data.id).toBe(firstChannel.id);
				}
			}
		}

		testDb.cleanup();
	});

	it('reactions endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const postInput = {
			channel,
			text: `test message for reactions ${Date.now()}`,
		};

		const posted = await corsair.slack.api.messages.post(postInput);

		if (posted.ok && posted.ts) {
			const addInput = {
				channel,
				timestamp: posted.ts,
				name: 'thumbsup',
			};

			const added = await corsair.slack.api.reactions.add(addInput);

			expect(added).toBeDefined();

			const orm = createCorsairOrm(testDb.database);
			const addEvents = await orm.events.findMany({
				where: { event_type: 'slack.reactions.add' },
			});

			expect(addEvents.length).toBeGreaterThan(0);
			const addEvent = addEvents[addEvents.length - 1]!;
			const addEventPayload =
				typeof addEvent.payload === 'string'
					? JSON.parse(addEvent.payload)
					: addEvent.payload;
			expect(addEventPayload).toMatchObject(addInput);

			const removeInput = {
				channel,
				timestamp: posted.ts,
				name: 'thumbsup',
			};

			const removed = await corsair.slack.api.reactions.remove(removeInput);

			expect(removed).toBeDefined();

			const removeEvents = await orm.events.findMany({
				where: { event_type: 'slack.reactions.remove' },
			});

			expect(removeEvents.length).toBeGreaterThan(0);
			const removeEvent = removeEvents[removeEvents.length - 1]!;
			const removeEventPayload =
				typeof removeEvent.payload === 'string'
					? JSON.parse(removeEvent.payload)
					: removeEvent.payload;
			expect(removeEventPayload).toMatchObject(removeInput);

			await corsair.slack.api.messages.delete({
				channel,
				ts: posted.ts,
			});
		}

		testDb.cleanup();
	});
});
