import { createHmac } from 'node:crypto';
import { createCorsair } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { twilio } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Twilio plugin integration', () => {
	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('interacts with API, webhooks, and database', async () => {
		const accountSid = 'ACmockaccountsid123';
		const authToken = 'mockauthtoken123';
		const testMessageSid = 'MMmockmessagesid123';
		const testCallSid = 'CAmockcallsid123';

		// Mock responses
		mockRequest.mockImplementation(
			(config: OpenAPIConfig, options: { url: string; method?: string }) => {
				const method = options.method ?? 'GET';
				if (
					options.url === `Accounts/${accountSid}/Messages.json` &&
					method === 'POST'
				) {
					return Promise.resolve({
						sid: testMessageSid,
						to: '+1234567890',
						from: '+1098765432',
						body: 'Hello from Corsair!',
						status: 'queued',
						direction: 'outbound-api',
						date_sent: 'Fri, 05 Jun 2026 00:00:00 +0000',
						price: '0.0075',
						price_unit: 'USD',
					});
				}
				if (
					options.url ===
						`Accounts/${accountSid}/Messages/${testMessageSid}.json` &&
					method === 'GET'
				) {
					return Promise.resolve({
						sid: testMessageSid,
						to: '+1234567890',
						from: '+1098765432',
						body: 'Hello from Corsair!',
						status: 'sent',
						direction: 'outbound-api',
						date_sent: 'Fri, 05 Jun 2026 00:00:00 +0000',
						price: '0.0075',
						price_unit: 'USD',
					});
				}
				if (
					options.url === `Accounts/${accountSid}/Messages.json` &&
					method === 'GET'
				) {
					return Promise.resolve({
						messages: [
							{
								sid: testMessageSid,
								to: '+1234567890',
								from: '+1098765432',
								body: 'Hello from Corsair!',
								status: 'sent',
								direction: 'outbound-api',
								date_sent: 'Fri, 05 Jun 2026 00:00:00 +0000',
								price: '0.0075',
								price_unit: 'USD',
							},
						],
					});
				}
				if (
					options.url === `Accounts/${accountSid}/Calls.json` &&
					method === 'POST'
				) {
					return Promise.resolve({
						sid: testCallSid,
						to: '+1234567890',
						from: '+1098765432',
						status: 'queued',
						direction: 'outbound-api',
						duration: '60',
						start_time: 'Fri, 05 Jun 2026 00:00:00 +0000',
						end_time: 'Fri, 05 Jun 2026 00:01:00 +0000',
						price: '0.015',
						price_unit: 'USD',
					});
				}
				if (
					options.url === `Accounts/${accountSid}/Calls/${testCallSid}.json` &&
					method === 'GET'
				) {
					return Promise.resolve({
						sid: testCallSid,
						to: '+1234567890',
						from: '+1098765432',
						status: 'completed',
						direction: 'outbound-api',
						duration: '60',
						start_time: 'Fri, 05 Jun 2026 00:00:00 +0000',
						end_time: 'Fri, 05 Jun 2026 00:01:00 +0000',
						price: '0.015',
						price_unit: 'USD',
					});
				}
				if (
					options.url === `Accounts/${accountSid}/Calls.json` &&
					method === 'GET'
				) {
					return Promise.resolve({
						calls: [
							{
								sid: testCallSid,
								to: '+1234567890',
								from: '+1098765432',
								status: 'completed',
								direction: 'outbound-api',
								duration: '60',
								start_time: 'Fri, 05 Jun 2026 00:00:00 +0000',
								end_time: 'Fri, 05 Jun 2026 00:01:00 +0000',
								price: '0.015',
								price_unit: 'USD',
							},
						],
					});
				}
				return Promise.reject(new Error(`Unexpected request: ${options.url}`));
			},
		);

		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'twilio');

		const corsair = createCorsair({
			plugins: [
				twilio({
					authType: 'api_key',
					key: authToken,
					accountSid: accountSid,
				}),
			],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});

		const orm = createCorsairOrm(testDb.database);

		// --- 1. Send SMS message ---
		const sendRes = await corsair.twilio.api.messages.send({
			To: '+1234567890',
			From: '+1098765432',
			Body: 'Hello from Corsair!',
		});
		expect(sendRes.sid).toBe(testMessageSid);

		// Check message in DB
		const msgInDb =
			await corsair.twilio.db.messages.findByEntityId(testMessageSid);
		expect(msgInDb).not.toBeNull();
		expect(msgInDb?.data.body).toBe('Hello from Corsair!');
		expect(msgInDb?.data.status).toBe('queued');

		// --- 2. Retrieve SMS message ---
		const getRes = await corsair.twilio.api.messages.get({
			messageSid: testMessageSid,
		});
		expect(getRes.sid).toBe(testMessageSid);
		expect(getRes.status).toBe('sent');

		// --- 3. List messages ---
		const listRes = await corsair.twilio.api.messages.list({});
		expect(listRes.messages.length).toBe(1);
		expect(listRes.messages[0]?.sid).toBe(testMessageSid);

		// --- 4. Create Call ---
		const createCallRes = await corsair.twilio.api.calls.create({
			To: '+1234567890',
			From: '+1098765432',
			Url: 'http://demo.twilio.com/docs/voice.xml',
		});
		expect(createCallRes.sid).toBe(testCallSid);

		// Check call in DB
		const callInDb = await corsair.twilio.db.calls.findByEntityId(testCallSid);
		expect(callInDb).not.toBeNull();
		expect(callInDb?.data.status).toBe('queued');

		// --- 5. Retrieve Call ---
		const getCallRes = await corsair.twilio.api.calls.get({
			callSid: testCallSid,
		});
		expect(getCallRes.sid).toBe(testCallSid);
		expect(getCallRes.status).toBe('completed');

		// --- 6. List Calls ---
		const listCallsRes = await corsair.twilio.api.calls.list({});
		expect(listCallsRes.calls.length).toBe(1);
		expect(listCallsRes.calls[0]?.sid).toBe(testCallSid);

		// --- 7. Webhook signature verification ---
		const url = 'https://example.com/webhook';
		const webhookParams = {
			MessageSid: 'MMwebhookreceived123',
			AccountSid: accountSid,
			From: '+1234567890',
			To: '+1098765432',
			Body: 'Incoming SMS!',
			NumMedia: '0',
		};

		// Generate signature using mock secret
		const sortedKeys = Object.keys(webhookParams).sort();
		let dataStr = url;
		for (const key of sortedKeys) {
			dataStr += key + webhookParams[key as keyof typeof webhookParams];
		}
		const signature = createHmac('sha1', authToken)
			.update(dataStr)
			.digest('base64');

		// Trigger webhook
		const webhookResult =
			await corsair.twilio.webhooks.message.received.handler({
				headers: {
					'x-forwarded-url': url,
					'x-twilio-signature': signature,
				},
				payload: webhookParams,
			} as any);

		expect(webhookResult.success).toBe(true);

		testDb.cleanup();
	});
});
