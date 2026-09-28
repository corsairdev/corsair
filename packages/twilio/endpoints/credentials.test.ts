import { createCorsair } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { twilio } from '../index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const COLON_KEY = 'AC123:my:secret:with:colons';
const EXPECTED_AUTH = `Basic ${Buffer.from(COLON_KEY).toString('base64')}`;

describe('twilio colon-containing credentials (request level)', () => {
	beforeEach(() => {
		mockRequest.mockClear();
		mockRequest.mockImplementation(() => Promise.resolve({ sid: 'SM123' }));
	});

	async function setup() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'twilio');

		const corsair = createCorsair({
			plugins: [
				twilio({
					authType: 'api_key',
					key: COLON_KEY,
				}),
			],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});

		// Initialize the account DEK with an empty stored config so the
		// stored accountSid lookup resolves to undefined and the key is
		// the source of both the SID and the token below.
		await corsair.twilio.keys.issue_new_dek();

		return { corsair, testDb };
	}

	function expectColonCredentials(url: string) {
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: EXPECTED_AUTH,
				}),
			}),
			expect.objectContaining({ url }),
		);
	}

	it('passes the full token for messages.send', async () => {
		const { corsair, testDb } = await setup();

		await corsair.twilio.api.messages.send({
			To: '+1234567890',
			From: '+1098765432',
			Body: 'hi',
		});

		expectColonCredentials('Accounts/AC123/Messages.json');
		testDb.cleanup();
	});

	it('passes the full token for messages.get', async () => {
		const { corsair, testDb } = await setup();

		await corsair.twilio.api.messages.get({ messageSid: 'SM123' });

		expectColonCredentials('Accounts/AC123/Messages/SM123.json');
		testDb.cleanup();
	});

	it('passes the full token for messages.list', async () => {
		const { corsair, testDb } = await setup();

		await corsair.twilio.api.messages.list({});

		expectColonCredentials('Accounts/AC123/Messages.json');
		testDb.cleanup();
	});

	it('passes the full token for calls.create', async () => {
		const { corsair, testDb } = await setup();

		await corsair.twilio.api.calls.create({
			To: '+1234567890',
			From: '+1098765432',
			Url: 'https://example.com/voice.xml',
		});

		expectColonCredentials('Accounts/AC123/Calls.json');
		testDb.cleanup();
	});

	it('passes the full token for calls.get', async () => {
		const { corsair, testDb } = await setup();

		await corsair.twilio.api.calls.get({ callSid: 'CA123' });

		expectColonCredentials('Accounts/AC123/Calls/CA123.json');
		testDb.cleanup();
	});

	it('passes the full token for calls.list', async () => {
		const { corsair, testDb } = await setup();

		await corsair.twilio.api.calls.list({});

		expectColonCredentials('Accounts/AC123/Calls.json');
		testDb.cleanup();
	});
});
