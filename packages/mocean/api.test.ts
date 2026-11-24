import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mocean } from './index';

/**
 * Live run against a real Mocean account. Skipped unless MOCEAN_API_TOKEN
 * (or MOCEAN_API_KEY) is set. It only makes calls that cost nothing and send
 * nothing: account reads, a status lookup, and requests Mocean rejects before
 * anything is sent or charged. The balance must be unchanged at the end.
 *
 *   MOCEAN_API_TOKEN=... pnpm test:live
 */
const apiKey = process.env.MOCEAN_API_TOKEN ?? process.env.MOCEAN_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('Skipping Mocean live tests: set MOCEAN_API_TOKEN.');
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mocean', 'default');
	const corsair = createCorsair({
		// Only the rejected-before-sending calls below touch write routes.
		plugins: [mocean({ key: apiKey, permissions: { mode: 'open' } })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('mocean live', () => {
	jest.setTimeout(60_000);

	let client: Awaited<ReturnType<typeof createClient>>;
	let api: Awaited<ReturnType<typeof createClient>>['corsair']['mocean']['api'];
	let startBalance = 0;

	beforeAll(async () => {
		client = await createClient();
		api = client.corsair.mocean.api;
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('account.balance', async () => {
		const result = await api.account.balance({});
		expect(typeof result.value).toBe('number');
		startBalance = result.value;
	});

	it('account.pricing for sms and number-lookup', async () => {
		const sms = await api.account.pricing({});
		expect(sms.destinations.length).toBeGreaterThan(0);
		const lookup = await api.account.pricing({ mocean_type: 'number-lookup' });
		expect(lookup.destinations.length).toBeGreaterThan(0);
	});

	it('account.pricing without a rate answers 400 (verify on a trial)', async () => {
		await expect(
			api.account.pricing({ mocean_type: 'verify' }),
		).rejects.toMatchObject({ status: 400 });
	});

	it('sms.status of an unknown msgid answers message_status 5', async () => {
		const result = await api.sms.status({ mocean_msgid: 'corsair-unknown-1' });
		expect(result.message_status).toBe(5);
	});

	it('sms.reportConversion of an unknown msgid answers 400', async () => {
		await expect(
			api.sms.reportConversion({
				mocean_msgid: 'corsair-unknown-1',
				mocean_delivered: true,
			}),
		).rejects.toMatchObject({ status: 400 });
	});

	it('verify.check of an unknown reqid answers 404', async () => {
		await expect(
			api.verify.check({
				mocean_reqid: 'corsair-unknown-1',
				mocean_code: '0000',
			}),
		).rejects.toMatchObject({ status: 404 });
	});

	it('voice.hangup of an unknown call answers 400', async () => {
		await expect(
			api.voice.hangup({
				mocean_call_uuid: '00000000-0000-0000-0000-000000000000',
			}),
		).rejects.toMatchObject({ status: 400 });
	});

	it('templates.list without a WhatsApp sender answers 401', async () => {
		await expect(api.templates.list({ limit: 2 })).rejects.toMatchObject({
			status: 401,
		});
	});

	it('the balance is unchanged', async () => {
		const result = await api.account.balance({});
		expect(result.value).toBe(startBalance);
	});
});
