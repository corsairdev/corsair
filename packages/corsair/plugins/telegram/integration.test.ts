import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createCorsairOrm } from '../../db/orm';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { telegram } from './index';

dotenv.config();

async function createTelegramClient() {
	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TEST_TELEGRAM_CHAT_ID;
	if (!botToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'telegram', 'default');

	const corsair = createCorsair({
		plugins: [telegram({})],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.telegram.keys.issue_new_dek();
	await corsair.telegram.keys.set_bot_token(botToken);

	return { corsair, testDb, chatId };
}

describe('Telegram plugin integration', () => {
	it('me endpoints interact with API and DB', async () => {
		const setup = await createTelegramClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const botInfo = await corsair.telegram.api.me.getMe({});

		expect(botInfo).toBeDefined();
		expect(botInfo.id).toBeDefined();
		expect(botInfo.is_bot).toBe(true);
		expect(botInfo.first_name).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'telegram.me.getMe' },
		});

		expect(events.length).toBeGreaterThan(0);
		const event = events[events.length - 1]!;
		expect(event.event_type).toBe('telegram.me.getMe');
		expect(event.status).toBe('completed');

		testDb.cleanup();
	});

	it('messages endpoints interact with API and DB', async () => {
		const setup = await createTelegramClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, chatId } = setup;

		// Get bot info to use as chat ID if no test chat ID provided
		const botInfo = await corsair.telegram.api.me.getMe({});
		const targetChatId = chatId || botInfo.id.toString();

		const sendInput = {
			chat_id: targetChatId,
			text: `corsair telegram integration test ${Date.now()}`,
		};

		const sent = await corsair.telegram.api.messages.sendMessage(sendInput);

		expect(sent).toBeDefined();
		expect(sent.message_id).toBeDefined();
		expect(sent.chat).toBeDefined();
		expect(sent.chat.id).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const sendEvents = await orm.events.findMany({
			where: { event_type: 'telegram.messages.sendMessage' },
		});

		expect(sendEvents.length).toBeGreaterThan(0);
		const sendEvent = sendEvents[sendEvents.length - 1]!;
		const sendEventPayload =
			typeof sendEvent.payload === 'string'
				? JSON.parse(sendEvent.payload)
				: sendEvent.payload;
		expect(sendEventPayload).toMatchObject(sendInput);

		// Check if message was saved to database
		if (sent.message_id && corsair.telegram.db.messages) {
			const messageFromDb = await corsair.telegram.db.messages.findByEntityId(
				sent.message_id.toString(),
			);
			expect(messageFromDb).not.toBeNull();
			if (messageFromDb) {
				expect(messageFromDb.data.message_id).toBe(sent.message_id);
			}
		}

		// Test edit message
		if (sent.message_id) {
			const editInput = {
				chat_id: targetChatId,
				message_id: sent.message_id,
				text: 'updated by corsair test',
			};

			const edited = await corsair.telegram.api.messages.editMessageText(editInput);

			expect(edited).toBeDefined();

			const editEvents = await orm.events.findMany({
				where: { event_type: 'telegram.messages.editMessageText' },
			});

			expect(editEvents.length).toBeGreaterThan(0);
			const editEvent = editEvents[editEvents.length - 1]!;
			const editEventPayload =
				typeof editEvent.payload === 'string'
					? JSON.parse(editEvent.payload)
					: editEvent.payload;
			expect(editEventPayload).toMatchObject(editInput);
		}

		// Test delete message
		if (sent.message_id) {
			const deleteInput = {
				chat_id: targetChatId,
				message_id: sent.message_id,
			};

			const deleted = await corsair.telegram.api.messages.deleteMessage(deleteInput);

			expect(deleted).toBeDefined();
			expect(typeof deleted === 'boolean').toBe(true);

			const deleteEvents = await orm.events.findMany({
				where: { event_type: 'telegram.messages.deleteMessage' },
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

	it('chat endpoints interact with API and DB', async () => {
		const setup = await createTelegramClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, chatId } = setup;

		// Get bot info to use as chat ID if no test chat ID provided
		const botInfo = await corsair.telegram.api.me.getMe({});
		const targetChatId = chatId || botInfo.id.toString();

		const getChatInput = {
			chat_id: targetChatId,
		};

		const chat = await corsair.telegram.api.chat.getChat(getChatInput);

		expect(chat).toBeDefined();
		expect(chat.id).toBeDefined();
		expect(chat.type).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const getChatEvents = await orm.events.findMany({
			where: { event_type: 'telegram.chat.getChat' },
		});

		expect(getChatEvents.length).toBeGreaterThan(0);
		const getChatEvent = getChatEvents[getChatEvents.length - 1]!;
		const getChatEventPayload =
			typeof getChatEvent.payload === 'string'
				? JSON.parse(getChatEvent.payload)
				: getChatEvent.payload;
		expect(getChatEventPayload).toMatchObject(getChatInput);

		// Check if chat was saved to database
		if (corsair.telegram.db.chats) {
			const chatFromDb = await corsair.telegram.db.chats.findByEntityId(chat.id.toString());
			expect(chatFromDb).not.toBeNull();
			if (chatFromDb) {
				expect(chatFromDb.data.chat_id).toBe(chat.id);
			}
		}

		// Test getChatMember
		const getChatMemberInput = {
			chat_id: targetChatId,
			user_id: botInfo.id,
		};

		const chatMember = await corsair.telegram.api.chat.getChatMember(getChatMemberInput);

		expect(chatMember).toBeDefined();
		expect(chatMember.status).toBeDefined();

		const getChatMemberEvents = await orm.events.findMany({
			where: { event_type: 'telegram.chat.getChatMember' },
		});

		expect(getChatMemberEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('webhook endpoints interact with API', async () => {
		const setup = await createTelegramClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		// Test setWebhook
		const setWebhookInput = {
			url: 'https://example.com/webhook',
			secret_token: 'test-secret-token',
		};

		const setResult = await corsair.telegram.api.webhook.setWebhook(setWebhookInput);

		expect(setResult).toBeDefined();
		expect(setResult.ok).toBeDefined();
		expect(typeof setResult.result === 'boolean').toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const setWebhookEvents = await orm.events.findMany({
			where: { event_type: 'telegram.webhook.setWebhook' },
		});

		expect(setWebhookEvents.length).toBeGreaterThan(0);
		const setWebhookEvent = setWebhookEvents[setWebhookEvents.length - 1]!;
		const setWebhookEventPayload =
			typeof setWebhookEvent.payload === 'string'
				? JSON.parse(setWebhookEvent.payload)
				: setWebhookEvent.payload;
		expect(setWebhookEventPayload).toMatchObject(setWebhookInput);

		// Test deleteWebhook
		const deleteResult = await corsair.telegram.api.webhook.deleteWebhook({
			drop_pending_updates: false,
		});

		expect(deleteResult).toBeDefined();
		expect(deleteResult.ok).toBeDefined();
		expect(typeof deleteResult.result === 'boolean').toBe(true);

		const deleteWebhookEvents = await orm.events.findMany({
			where: { event_type: 'telegram.webhook.deleteWebhook' },
		});

		expect(deleteWebhookEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('updates endpoints interact with API', async () => {
		const setup = await createTelegramClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		// Delete webhook first to allow getUpdates
		await corsair.telegram.api.webhook.deleteWebhook({ drop_pending_updates: false });

		const getUpdatesInput = {
			limit: 10,
		};

		const updates = await corsair.telegram.api.updates.getUpdates(getUpdatesInput);

		expect(updates).toBeDefined();
		expect(Array.isArray(updates)).toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const getUpdatesEvents = await orm.events.findMany({
			where: { event_type: 'telegram.updates.getUpdates' },
		});

		expect(getUpdatesEvents.length).toBeGreaterThan(0);
		const getUpdatesEvent = getUpdatesEvents[getUpdatesEvents.length - 1]!;
		const getUpdatesEventPayload =
			typeof getUpdatesEvent.payload === 'string'
				? JSON.parse(getUpdatesEvent.payload)
				: getUpdatesEvent.payload;
		expect(getUpdatesEventPayload).toMatchObject(getUpdatesInput);

		testDb.cleanup();
	});

	it('sendChatAction endpoint interacts with API', async () => {
		const setup = await createTelegramClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, chatId } = setup;

		// Get bot info to use as chat ID if no test chat ID provided
		const botInfo = await corsair.telegram.api.me.getMe({});
		const targetChatId = chatId || botInfo.id.toString();

		const sendChatActionInput = {
			chat_id: targetChatId,
			action: 'typing' as const,
		};

		const result = await corsair.telegram.api.messages.sendChatAction(sendChatActionInput);

		expect(result).toBeDefined();
		expect(typeof result === 'boolean').toBe(true);

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'telegram.messages.sendChatAction' },
		});

		expect(events.length).toBeGreaterThan(0);
		const event = events[events.length - 1]!;
		const eventPayload =
			typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload;
		expect(eventPayload).toMatchObject(sendChatActionInput);

		testDb.cleanup();
	});
});
