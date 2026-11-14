import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { kofi } from '../index';
import { donation, formBody, TOKEN, wrongToken } from '../test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

/**
 * What the documented route does with Ko-fi's form body: read the `data` field
 * and hand processWebhook the payment object. processWebhook runs JSON.parse
 * on a string body, so the raw form text cannot be passed straight through.
 */
function decodeForm(body: string) {
	const data = new URLSearchParams(body).get('data');
	return JSON.parse(data ?? 'null');
}

const cleanups: Array<() => void> = [];

async function setup(options: Parameters<typeof kofi>[0] = {}) {
	const testDb = createTestDatabase();
	cleanups.push(() => testDb.cleanup());
	await createIntegrationAndAccount(testDb.db, 'kofi', 'default');
	const corsair = createCorsair({
		plugins: [kofi(options)],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.kofi.keys.issue_new_dek();
	return corsair;
}

afterEach(() => {
	for (const cleanup of cleanups.splice(0)) cleanup();
});

describe('a Ko-fi delivery through processWebhook', () => {
	it('handles the payment the documented route passes in', async () => {
		const corsair = await setup({ key: TOKEN });

		const result = await processWebhook(
			corsair,
			{ 'content-type': 'application/x-www-form-urlencoded' },
			decodeForm(formBody(donation)),
		);

		expect(result).toMatchObject({
			plugin: 'kofi',
			action: 'donation',
			response: { success: true },
		});
	});

	it('reports a wrong token as a 401 refusal', async () => {
		const corsair = await setup({ key: TOKEN });

		const result = await processWebhook(
			corsair,
			{ 'content-type': 'application/x-www-form-urlencoded' },
			decodeForm(formBody(wrongToken)),
		);

		expect(result.plugin).toBe('kofi');
		expect(result.response).toMatchObject({ success: false, statusCode: 401 });
	});

	it('verifies against a token stored as the account api_key', async () => {
		const corsair = await setup();
		await corsair.kofi.keys.set_api_key(TOKEN);

		const ok = await processWebhook(
			corsair,
			{},
			decodeForm(formBody(donation)),
		);
		const refused = await processWebhook(
			corsair,
			{},
			decodeForm(formBody(wrongToken)),
		);

		expect(ok.response).toMatchObject({ success: true });
		expect(refused.response).toMatchObject({ success: false, statusCode: 401 });
	});

	it('accepts a Hub-verified delivery when no token is stored', async () => {
		const corsair = await setup();

		const result = await processWebhook(
			corsair,
			{},
			decodeForm(formBody(donation)),
			undefined,
			{ plugin: 'kofi', hubVerified: true },
		);

		expect(result.response).toMatchObject({ success: true });
	});

	it('throws on the raw form text, which is why the route decodes it first', async () => {
		const corsair = await setup({ key: TOKEN });

		await expect(
			processWebhook(corsair, {}, formBody(donation)),
		).rejects.toThrow(SyntaxError);
	});
});
