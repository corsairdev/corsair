import { createCorsair } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { makeClickSendRequest } from './client';
import { clicksend } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('ClickSend plugin integration', () => {
	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('interacts with API endpoints, database sync, and webhooks securely', async () => {
		const username = 'testuser';
		const apiKey = 'c598a123-mock-api-key';
		const webhookSecret = 'super-secret-webhook-key';
		const testMessageId = 'MSG-123456';
		const testVoiceId = 'VOICE-789012';

		mockRequest.mockImplementation(
			(
				_config: OpenAPIConfig,
				options: { url: string; method?: string; body?: any; query?: any },
			) => {
				const method = options.method ?? 'GET';
				const url = options.url.replace(/^\//, '');

				if (url === 'account' && method === 'GET') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Account retrieved.',
						data: {
							user_id: 12345,
							username: 'testuser',
							user_email: 'test@example.com',
							user_first_name: 'Test',
							user_last_name: 'User',
							balance: 25.5,
							currency: 'USD',
						},
					});
				}

				if (url === 'sms/send' && method === 'POST') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Messages queued.',
						data: {
							total_price: 0.05,
							total_count: 1,
							queued_count: 1,
							messages: [
								{
									direction: 'out',
									date: 1693526400,
									to: '+1234567890',
									body: 'Hello from Corsair ClickSend!',
									from: 'ClickSend',
									schedule: 0,
									message_id: testMessageId,
									message_parts: 1,
									message_price: '0.05',
									status: 'SUCCESS',
								},
							],
						},
					});
				}

				if (url === 'sms/history' && method === 'GET') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Success',
						data: {
							current_page: 1,
							per_page: 15,
							total: 1,
							last_page: 1,
							data: [
								{
									direction: 'out',
									date: 1693526400,
									to: '+1234567890',
									body: 'Hello from Corsair ClickSend!',
									from: 'ClickSend',
									message_id: testMessageId,
									message_price: '0.05',
									status: 'SUCCESS',
								},
							],
						},
					});
				}

				if (url === 'sms/inbound-sms' && method === 'GET') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Success',
						data: {
							current_page: 1,
							per_page: 15,
							total: 1,
							last_page: 1,
							data: [
								{
									message_id: 'INBOUND-001',
									to: '+1098765432',
									from: '+1234567890',
									body: 'Got your message!',
									timestamp: 1693526500,
								},
							],
						},
					});
				}

				if (url === 'sms/receipts' && method === 'GET') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Success',
						data: {
							current_page: 1,
							per_page: 15,
							total: 1,
							last_page: 1,
							data: [
								{
									message_id: testMessageId,
									status: 'Delivered',
									status_code: '200',
									status_text: 'Delivered to handset',
									timestamp: 1693526410,
								},
							],
						},
					});
				}

				if (url === 'voice/send' && method === 'POST') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Voice call queued.',
						data: {
							total_price: 0.08,
							total_count: 1,
							queued_count: 1,
							messages: [
								{
									to: '+1234567890',
									body: 'Your verification code is 123456',
									voice: 'female',
									lang: 'en-us',
									message_id: testVoiceId,
									status: 'SUCCESS',
								},
							],
						},
					});
				}

				if (url === 'voice/history' && method === 'GET') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Success',
						data: {
							current_page: 1,
							per_page: 15,
							total: 1,
							last_page: 1,
							data: [
								{
									to: '+1234567890',
									body: 'Your verification code is 123456',
									voice: 'female',
									lang: 'en-us',
									message_id: testVoiceId,
									status: 'SUCCESS',
									date: 1693526600,
								},
							],
						},
					});
				}

				if (url === 'lists' && method === 'GET') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Success',
						data: {
							current_page: 1,
							per_page: 15,
							total: 1,
							last_page: 1,
							data: [
								{
									list_id: 101,
									list_name: 'VIP Leads',
									contact_count: 5,
								},
							],
						},
					});
				}

				if (url === 'lists' && method === 'POST') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'List created',
						data: {
							list_id: 102,
							list_name: options.body?.list_name ?? 'New List',
							contact_count: 0,
						},
					});
				}

				if (url === 'lists/101/contacts' && method === 'POST') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Contact created',
						data: {
							contact_id: 501,
							list_id: 101,
							first_name: options.body?.first_name,
							last_name: options.body?.last_name,
							phone_number: options.body?.phone_number,
							email: options.body?.email,
						},
					});
				}

				if (url === 'lists/101/contacts' && method === 'GET') {
					return Promise.resolve({
						http_code: 200,
						response_code: 'SUCCESS',
						response_msg: 'Success',
						data: {
							current_page: 1,
							per_page: 15,
							total: 1,
							last_page: 1,
							data: [
								{
									contact_id: 501,
									list_id: 101,
									first_name: 'Alice',
									last_name: 'Smith',
									phone_number: '+1234567890',
									email: 'alice@example.com',
								},
							],
						},
					});
				}

				return Promise.reject(
					new Error(`Unexpected request url: ${options.url}`),
				);
			},
		);

		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'clicksend');

		const corsair = createCorsair({
			plugins: [
				clicksend({
					authType: 'api_key',
					username,
					apiKey,
					webhookSecret,
				}),
			],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});

		// 1. Account.get
		const accountRes = await corsair.clicksend.api.account.get({});
		expect(accountRes.username).toBe('testuser');
		expect(accountRes.balance).toBe(25.5);

		// 2. Sms.send
		const sendSmsRes = await corsair.clicksend.api.sms.send({
			messages: [
				{
					to: '+1234567890',
					body: 'Hello from Corsair ClickSend!',
				},
			],
		});
		expect(sendSmsRes.messages.length).toBe(1);
		expect(sendSmsRes.messages[0]?.message_id).toBe(testMessageId);

		// Verify saved in DB
		const savedMsg =
			await corsair.clicksend.db.messages.findByEntityId(testMessageId);
		expect(savedMsg).not.toBeNull();
		expect(savedMsg?.data.body).toBe('Hello from Corsair ClickSend!');
		expect(savedMsg?.data.status).toBe('SUCCESS');

		// 3. Sms.history
		const historyRes = await corsair.clicksend.api.sms.history({ page: 1 });
		expect(historyRes.data.length).toBe(1);
		expect(historyRes.data[0]?.message_id).toBe(testMessageId);

		// 4. Sms.inbound
		const inboundRes = await corsair.clicksend.api.sms.inbound({ page: 1 });
		expect(inboundRes.data.length).toBe(1);
		expect(inboundRes.data[0]?.message_id).toBe('INBOUND-001');

		// Verify inbound saved in DB
		const savedInbound =
			await corsair.clicksend.db.messages.findByEntityId('INBOUND-001');
		expect(savedInbound).not.toBeNull();
		expect(savedInbound?.data.direction).toBe('in');

		// 5. Sms.receipts
		const receiptsRes = await corsair.clicksend.api.sms.receipts({ page: 1 });
		expect(receiptsRes.data.length).toBe(1);
		expect(receiptsRes.data[0]?.status).toBe('Delivered');

		// 6. Voice.send
		const voiceSendRes = await corsair.clicksend.api.voice.send({
			messages: [
				{
					to: '+1234567890',
					body: 'Your verification code is 123456',
					voice: 'female',
					lang: 'en-us',
				},
			],
		});
		expect(voiceSendRes.messages.length).toBe(1);
		expect(voiceSendRes.messages[0]?.message_id).toBe(testVoiceId);

		// 7. Voice.history
		const voiceHistoryRes = await corsair.clicksend.api.voice.history({
			page: 1,
		});
		expect(voiceHistoryRes.data.length).toBe(1);
		expect(voiceHistoryRes.data[0]?.message_id).toBe(testVoiceId);

		// 8. ContactLists.create
		const createListRes = await corsair.clicksend.api.contactLists.create({
			list_name: 'VIP Leads',
		});
		expect(createListRes.list_id).toBe(102);
		expect(createListRes.list_name).toBe('VIP Leads');

		// 9. ContactLists.getAll
		const allListsRes = await corsair.clicksend.api.contactLists.getAll({
			page: 1,
		});
		expect(allListsRes.data.length).toBe(1);
		expect(allListsRes.data[0]?.list_id).toBe(101);

		// 10. Contacts.create
		const createContactRes = await corsair.clicksend.api.contacts.create({
			list_id: 101,
			first_name: 'Alice',
			last_name: 'Smith',
			phone_number: '+1234567890',
			email: 'alice@example.com',
		});
		expect(createContactRes.contact_id).toBe(501);

		// Verify contact saved in DB
		const savedContact =
			await corsair.clicksend.db.contacts.findByEntityId('501');
		expect(savedContact).not.toBeNull();
		expect(savedContact?.data.first_name).toBe('Alice');
		expect(savedContact?.data.phone_number).toBe('+1234567890');

		// 11. Contacts.list
		const listContactsRes = await corsair.clicksend.api.contacts.list({
			list_id: 101,
			page: 1,
		});
		expect(listContactsRes.data.length).toBe(1);
		expect(listContactsRes.data[0]?.contact_id).toBe(501);

		// 12. Security Test: Unauthorized Webhook is Rejected
		const unauthorizedWebhookResult =
			await corsair.clicksend.webhooks.sms.inbound.handler({
				headers: {
					'x-clicksend-token': 'wrong-secret',
				},
				payload: {
					message_id: 'INBOUND-MALICIOUS',
					to: '+1098765432',
					from: '+1234567890',
					body: 'Malicious payload',
				},
			} as any);
		expect(unauthorizedWebhookResult.success).toBe(false);
		expect(unauthorizedWebhookResult.statusCode).toBe(401);

		// Verify malicious message was NOT saved in DB
		const maliciousMsg =
			await corsair.clicksend.db.messages.findByEntityId('INBOUND-MALICIOUS');
		expect(maliciousMsg).toBeNull();

		// 13. Authorized Webhook: Inbound SMS
		const inboundWebhookResult =
			await corsair.clicksend.webhooks.sms.inbound.handler({
				headers: {
					'x-clicksend-token': webhookSecret,
				},
				payload: {
					message_id: 'INBOUND-WEBHOOK-002',
					to: '+1098765432',
					from: '+1234567890',
					body: 'Replying to your SMS!',
					timestamp: 1693527000,
				},
			} as any);
		expect(inboundWebhookResult.success).toBe(true);

		const webhookSavedMsg = await corsair.clicksend.db.messages.findByEntityId(
			'INBOUND-WEBHOOK-002',
		);
		expect(webhookSavedMsg).not.toBeNull();
		expect(webhookSavedMsg?.data.body).toBe('Replying to your SMS!');

		// 14. Authorized Webhook: Delivery Receipt
		const receiptWebhookResult =
			await corsair.clicksend.webhooks.sms.deliveryReceipt.handler({
				headers: {
					'x-clicksend-token': webhookSecret,
				},
				payload: {
					message_id: testMessageId,
					status: 'Delivered',
					status_code: '200',
					status_text: 'Delivered successfully',
					timestamp: 1693527100,
				},
			} as any);
		expect(receiptWebhookResult.success).toBe(true);

		const updatedMsg =
			await corsair.clicksend.db.messages.findByEntityId(testMessageId);
		expect(updatedMsg?.data.status).toBe('Delivered');

		// 15. Security Test: Missing credentials guard
		await expect(makeClickSendRequest('sms/send', '', '')).rejects.toThrow(
			'Missing ClickSend credentials',
		);

		// 16. Security Test: CRLF header injection protection
		await expect(
			makeClickSendRequest('sms/send', 'user\r\nInject: true', 'apiKey'),
		).rejects.toThrow(
			'Invalid credentials: username and apiKey must not contain newline',
		);

		testDb.cleanup();
	});
});
