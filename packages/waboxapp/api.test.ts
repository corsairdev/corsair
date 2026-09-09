import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { waboxapp } from './index';
import { parseWaboxappWebhookBody } from './webhooks/types';

const MESSAGE_BODY =
	'event=message&token=tok12345&uid=34666123456' +
	'&contact%5Buid%5D=34666789123&contact%5Bname%5D=Peter&contact%5Btype%5D=user' +
	'&message%5Bdtm%5D=1487082303&message%5Buid%5D=62397B58E3E0B' +
	'&message%5Bdir%5D=i&message%5Btype%5D=chat' +
	'&message%5Bbody%5D%5Btext%5D=Hey&message%5Back%5D=3';

describe('Waboxapp plugin', () => {
	it('handles an incoming form-encoded message webhook', async () => {
		const testDb = createTestDatabase();
		const corsair = createCorsair({
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
			plugins: [
				waboxapp({
					key: 'tok12345',
					uid: '34666123456',
				}),
			],
		});
		await createIntegrationAndAccount(testDb.db, 'waboxapp');

		const result = await processWebhook(
			corsair,
			{ 'content-type': 'application/x-www-form-urlencoded' },
			MESSAGE_BODY,
		);

		expect(result.plugin).toBe('waboxapp');
		expect(result.action).toBe('message.received');
		expect(result.response?.success).toBe(true);
		const parsed = parseWaboxappWebhookBody(result.body);
		expect(parsed).toMatchObject({
			event: 'message',
			uid: '34666123456',
			token: 'tok12345',
		});
	});
});
