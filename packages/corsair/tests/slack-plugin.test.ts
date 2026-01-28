import { createCorsair } from '../core';
import { slack } from '../plugins/slack';
import { SlackAPIError } from '../plugins/slack/client';
import { createTestDatabase } from './setup-db';
import { createIntegrationAndAccount } from './plugins-test-utils';
import dotenv from 'dotenv';
dotenv.config();  

async function createSlackClient() {
	const botToken = process.env.SLACK_BOT_TOKEN;
	const channel = process.env.TEST_SLACK_CHANNEL;
	const userId = process.env.TEST_SLACK_USER_ID;
	if (!botToken || !channel || !userId) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'slack');

	const corsair = createCorsair({
		plugins: [
			slack({
				authType: 'bot_token',
				credentials: {
					botToken,
				},
			}),
		],
		database: testDb.adapter,
	});

	return { corsair, testDb, channel, userId };
}

describe('Slack plugin integration', () => {
	it('messages endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const posted = await corsair.slack.api.messages.post({
			channel,
			text: `corsair slack integration test ${Date.now()}`,
		});

		expect(posted).toBeDefined();

		const postEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.messages.postMessage' }],
		});

		expect(postEvents.length).toBeGreaterThan(0);

		const messageTs = posted.ts;

		if (messageTs) {
			const updated = await corsair.slack.api.messages.update({
				channel,
				ts: messageTs,
				text: 'updated by corsair test',
			});

			expect(updated).toBeDefined();

			const updateEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'slack.messages.update' }],
			});

			expect(updateEvents.length).toBeGreaterThan(0);

			try {
				const permalink = await corsair.slack.api.messages.getPermalink({
					channel,
					message_ts: messageTs,
				});

				expect(permalink).toBeDefined();

				const permalinkEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [
						{ field: 'event_type', value: 'slack.messages.getPermalink' },
					],
				});

				expect(permalinkEvents.length).toBeGreaterThan(0);
			} catch (error) {
				if (
					error instanceof SlackAPIError &&
					error.code === 'invalid_auth'
				) {
					console.warn(
						'Skipping getPermalink test - bot token missing required scopes',
					);
				} else {
					throw error;
				}
			}

			try {
				const searchResult = await corsair.slack.api.messages.search({
					query: 'corsair',
				});

				expect(searchResult).toBeDefined();

				const searchEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'slack.messages.search' }],
				});

				expect(searchEvents.length).toBeGreaterThan(0);
			} catch (error) {
				if (
					error instanceof SlackAPIError &&
					error.code === 'invalid_auth'
				) {
					console.warn(
						'Skipping search test - bot token missing required scopes',
					);
				} else {
					throw error;
				}
			}

			const deleted = await corsair.slack.api.messages.delete({
				channel,
				ts: messageTs,
			});

			expect(deleted).toBeDefined();

			const deleteEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'slack.messages.delete' }],
			});

			expect(deleteEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('users endpoints reach API', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, userId } = setup;

		const profile = await corsair.slack.api.users.getProfile({
			user: userId,
		});

		expect(profile).toBeDefined();

		const getProfileEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.users.getProfile' }],
		});

		expect(getProfileEvents.length).toBeGreaterThan(0);

		const list = await corsair.slack.api.users.list({});

		expect(list).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.users.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const presence = await corsair.slack.api.users.getPresence({
			user: userId,
		});

		expect(presence).toBeDefined();

		const presenceEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.users.getPresence' }],
		});

		expect(presenceEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('channels endpoints reach API', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const list = await corsair.slack.api.channels.list({
			types: 'public_channel,private_channel',
		});

		expect(list).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.channels.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const info = await corsair.slack.api.channels.get({
			channel,
		});

		expect(info).toBeDefined();

		const getEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.channels.get' }],
		});

		expect(getEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});

