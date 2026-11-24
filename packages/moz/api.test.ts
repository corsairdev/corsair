import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moz } from './index';

/**
 * Live smoke against the free calls only: test.ping, test.ping.async +
 * jobs.lookup, the global top lists, quota.lookup,
 * index.fetch and locales.list cost no rows. Skipped without MOZ_API_TOKEN.
 */
const TOKEN = process.env.MOZ_API_TOKEN;
const describeIfKey = TOKEN ? describe : describe.skip;
if (!TOKEN) console.warn('Skipping Moz live tests: set MOZ_API_TOKEN.');

describeIfKey('moz live (free calls)', () => {
	jest.setTimeout(60_000);
	let testDb: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;

	beforeAll(async () => {
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'moz', 'default');
		corsair = createCorsair({
			plugins: [moz()],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.moz.keys.issue_new_dek();
		await corsair.moz.keys.set_api_key(TOKEN ?? '');
	});

	afterAll(() => testDb?.cleanup());

	it('pings', async () => {
		const result = await corsair.moz.api.test.ping({});
		expect(result).toBeDefined();
	});

	it('reads the row quota', async () => {
		const result = await corsair.moz.api.quota.lookup({
			path: 'api.limits.data.rows',
		});
		expect(result).toHaveProperty('quota');
	});

	it('reads the index id and the google locales', async () => {
		await expect(corsair.moz.api.index.fetch({})).resolves.toBeDefined();
		const locales = await corsair.moz.api.locales.list({ engine: 'google' });
		expect(Array.isArray(locales.locales)).toBe(true);
	});

	it('runs the async ping through jobs.lookup', async () => {
		const pending = await corsair.moz.api.test.pingAsync({
			message: 'corsair live test',
		});
		const id = pending.async_call?.id ?? '';
		let status: string | null | undefined;
		for (let i = 0; i < 10 && status !== 'complete'; i++) {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			const job = await corsair.moz.api.jobs.lookup({ id });
			status = job.async_call?.status;
		}
		expect(status).toBe('complete');
	});

	it('reads the global top lists (free) one row at a time', async () => {
		const domains = await corsair.moz.api.global.topDomains({
			page: { n: 0, limit: 1 },
		});
		const pages = await corsair.moz.api.global.topPages({
			page: { n: 0, limit: 1 },
		});
		expect(domains.top_domains).toHaveLength(1);
		expect(pages.top_pages).toHaveLength(1);
	});
});
