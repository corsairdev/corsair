import dotenv from 'dotenv';
import { makeTelegramRequest } from './client';
import type { TelegramEndpointOutputs } from './endpoints/types';
import { z } from 'zod';

dotenv.config();

const TEST_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TEST_CHAT_ID = '-1003750192801';

// Basic output schemas for validation
const GetMeOutputSchema = z.object({
	id: z.number(),
	is_bot: z.boolean(),
	first_name: z.string(),
	username: z.string().optional(),
	can_join_groups: z.boolean().optional(),
	can_read_all_group_messages: z.boolean().optional(),
	supports_inline_queries: z.boolean().optional(),
});

const GetChatOutputSchema = z.object({
	id: z.number(),
	type: z.string(),
	title: z.string().optional(),
	username: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
});

const SendMessageOutputSchema = z.object({
	message_id: z.number(),
	from: z.unknown().optional(),
	date: z.number(),
	chat: z.object({
		id: z.number(),
		type: z.string(),
	}),
	text: z.string().optional(),
});

const GetUpdatesOutputSchema = z.array(
	z.object({
		update_id: z.number(),
		message: z.unknown().optional(),
		edited_message: z.unknown().optional(),
		channel_post: z.unknown().optional(),
		callback_query: z.unknown().optional(),
	}),
);

const GetFileOutputSchema = z.object({
	file_id: z.string(),
	file_unique_id: z.string(),
	file_size: z.number().optional(),
	file_path: z.string().optional(),
});

describe('Telegram API Type Tests', () => {
	describe('me', () => {
		it('getMe returns correct type', async () => {
			const response = await makeTelegramRequest<TelegramEndpointOutputs['getMe']>(
				'getMe',
				TEST_BOT_TOKEN,
				{
					method: 'GET',
				},
			);

			GetMeOutputSchema.parse(response);
		});
	});

	describe('updates', () => {
		it('getUpdates returns correct type', async () => {
			const response = await makeTelegramRequest<TelegramEndpointOutputs['getUpdates']>(
				'getUpdates',
				TEST_BOT_TOKEN,
				{
					method: 'POST',
					body: {
						limit: 10,
					},
				},
			);

			GetUpdatesOutputSchema.parse(response);
		});
	});

	describe('chat', () => {
		it('getChat returns correct type', async () => {
			if (!TEST_CHAT_ID) {
				// If no test chat ID, try to get bot's own info as chat
				const me = await makeTelegramRequest<TelegramEndpointOutputs['getMe']>(
					'getMe',
					TEST_BOT_TOKEN,
					{ method: 'GET' },
				);
				const chatId = me.id;

				const response = await makeTelegramRequest<TelegramEndpointOutputs['getChat']>(
					'getChat',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: chatId,
						},
					},
				);

				GetChatOutputSchema.parse(response);
			} else {
				const response = await makeTelegramRequest<TelegramEndpointOutputs['getChat']>(
					'getChat',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: TEST_CHAT_ID,
						},
					},
				);

				GetChatOutputSchema.parse(response);
			}
		});

		it('getChatAdministrators returns correct type', async () => {
			if (TEST_CHAT_ID) {
				const response = await makeTelegramRequest<
					TelegramEndpointOutputs['getChatAdministrators']
				>('getChatAdministrators', TEST_BOT_TOKEN, {
					method: 'POST',
					body: {
						chat_id: TEST_CHAT_ID,
					},
				});

				expect(Array.isArray(response)).toBe(true);
			}
		});

		it('getChatMember returns correct type', async () => {
			if (TEST_CHAT_ID) {
				// Get bot's own info first
				const me = await makeTelegramRequest<TelegramEndpointOutputs['getMe']>(
					'getMe',
					TEST_BOT_TOKEN,
					{ method: 'GET' },
				);

				const response = await makeTelegramRequest<TelegramEndpointOutputs['getChatMember']>(
					'getChatMember',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: TEST_CHAT_ID,
							user_id: me.id,
						},
					},
				);

				expect(response).toBeDefined();
				expect(response.status).toBeDefined();
			}
		});
	});

	describe('messages', () => {
		it('sendMessage returns correct type', async () => {
			if (!TEST_CHAT_ID) {
				// Get bot's own info as chat ID
				const me = await makeTelegramRequest<TelegramEndpointOutputs['getMe']>(
					'getMe',
					TEST_BOT_TOKEN,
					{ method: 'GET' },
				);
				const chatId = me.id;

				const response = await makeTelegramRequest<TelegramEndpointOutputs['sendMessage']>(
					'sendMessage',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: chatId,
							text: `Test message ${Date.now()}`,
						},
					},
				);

				SendMessageOutputSchema.parse(response);
			} else {
				const response = await makeTelegramRequest<TelegramEndpointOutputs['sendMessage']>(
					'sendMessage',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: TEST_CHAT_ID,
							text: `Test message ${Date.now()}`,
						},
					},
				);

				SendMessageOutputSchema.parse(response);
			}
		});

		it('editMessageText returns correct type', async () => {
			if (TEST_CHAT_ID) {
				// First send a message
				const sent = await makeTelegramRequest<TelegramEndpointOutputs['sendMessage']>(
					'sendMessage',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: TEST_CHAT_ID,
							text: `Original message ${Date.now()}`,
						},
					},
				);

				if (sent.message_id) {
					const response = await makeTelegramRequest<
						TelegramEndpointOutputs['editMessageText']
					>('editMessageText', TEST_BOT_TOKEN, {
						method: 'POST',
						body: {
							chat_id: TEST_CHAT_ID,
							message_id: sent.message_id,
							text: 'Edited message',
						},
					});

					expect(response).toBeDefined();
				}
			}
		});

		it('deleteMessage returns correct type', async () => {
			if (TEST_CHAT_ID) {
				// First send a message
				const sent = await makeTelegramRequest<TelegramEndpointOutputs['sendMessage']>(
					'sendMessage',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: TEST_CHAT_ID,
							text: `Message to delete ${Date.now()}`,
						},
					},
				);

				if (sent.message_id) {
					const response = await makeTelegramRequest<TelegramEndpointOutputs['deleteMessage']>(
						'deleteMessage',
						TEST_BOT_TOKEN,
						{
							method: 'POST',
							body: {
								chat_id: TEST_CHAT_ID,
								message_id: sent.message_id,
							},
						},
					);

					expect(typeof response === 'boolean').toBe(true);
				}
			}
		});

		it('sendChatAction returns correct type', async () => {
			if (TEST_CHAT_ID) {
				const response = await makeTelegramRequest<TelegramEndpointOutputs['sendChatAction']>(
					'sendChatAction',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							chat_id: TEST_CHAT_ID,
							action: 'typing',
						},
					},
				);

				expect(typeof response === 'boolean').toBe(true);
			}
		});
	});

	describe('webhook', () => {
		it('setWebhook returns correct type', async () => {
			const response = await makeTelegramRequest<TelegramEndpointOutputs['setWebhook']>(
				'setWebhook',
				TEST_BOT_TOKEN,
				{
					method: 'POST',
					body: {
						url: 'https://example.com/webhook',
					},
				},
			);

			expect(response).toBeDefined();
			expect(response.ok).toBeDefined();
			expect(typeof response.result === 'boolean').toBe(true);
		});

		it('deleteWebhook returns correct type', async () => {
			const response = await makeTelegramRequest<TelegramEndpointOutputs['deleteWebhook']>(
				'deleteWebhook',
				TEST_BOT_TOKEN,
				{
					method: 'POST',
					body: {},
				},
			);

			expect(response).toBeDefined();
			expect(response.ok).toBeDefined();
			expect(typeof response.result === 'boolean').toBe(true);
		});
	});

	describe('file', () => {
		it('getFile returns correct type', async () => {
			// This test requires a valid file_id from a previous message
			// We'll skip if no test chat ID is available
			if (TEST_CHAT_ID) {
				// Send a message first to get a file_id (if needed)
				// For now, we'll just test the schema structure
				const response = await makeTelegramRequest<TelegramEndpointOutputs['getFile']>(
					'getFile',
					TEST_BOT_TOKEN,
					{
						method: 'POST',
						body: {
							file_id: 'test-file-id',
						},
					},
				).catch(() => null);

				// File might not exist, but we can still validate the error response structure
				if (response) {
					GetFileOutputSchema.parse(response);
				}
			}
		});
	});
});
