import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { clicksend } from './index';

// Live credentials are never committed: export CLICKSEND_USERNAME and
// CLICKSEND_API_KEY to run this suite against the real ClickSend API.
// Without them the suite is skipped so CI stays green.
const LIVE_USERNAME = process.env.CLICKSEND_USERNAME;
const LIVE_API_KEY = process.env.CLICKSEND_API_KEY;
const hasLiveCredentials =
	LIVE_USERNAME !== undefined &&
	LIVE_USERNAME.length > 0 &&
	LIVE_API_KEY !== undefined &&
	LIVE_API_KEY.length > 0;

const describeLive = hasLiveCredentials ? describe : describe.skip;

describeLive('ClickSend live API', () => {
	const testDb = createTestDatabase();

	afterAll(() => {
		testDb.cleanup();
	});

	async function liveApi() {
		await createIntegrationAndAccount(testDb.db, 'clicksend-live');
		const corsair = createCorsair({
			plugins: [
				clicksend({
					authType: 'api_key',
					username: LIVE_USERNAME,
					apiKey: LIVE_API_KEY,
				}),
			],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});
		return corsair.clicksend.api;
	}

	it('reads account details and balance', async () => {
		const api = await liveApi();
		const account = await api.account.get({});
		expect(account.username).toBeDefined();
		expect(typeof account.balance).toBe('number');
	});

	it('lists supported countries', async () => {
		const api = await liveApi();
		const countries = await api.countries.list({});
		expect(Array.isArray(countries)).toBe(true);
	});

	it('lists global sending countries', async () => {
		const api = await liveApi();
		const countries = await api.countries.globalList({});
		expect(Array.isArray(countries)).toBe(true);
	});

	it('lists supported timezones', async () => {
		const api = await liveApi();
		const timezones = await api.timezones.list({});
		expect(timezones.length).toBeGreaterThan(0);
	});

	it('lists voice languages', async () => {
		const api = await liveApi();
		const languages = await api.voice.languages({});
		expect(Array.isArray(languages)).toBe(true);
	});

	it('lists SMS templates', async () => {
		const api = await liveApi();
		const templates = await api.smsTemplates.list({ limit: 5 });
		expect(templates).toBeDefined();
	});

	it('lists contact lists', async () => {
		const api = await liveApi();
		const lists = await api.contactLists.getAll({ limit: 5 });
		expect(lists).toBeDefined();
	});

	it('lists dedicated numbers', async () => {
		const api = await liveApi();
		const numbers = await api.numbers.list({ limit: 5 });
		expect(numbers).toBeDefined();
	});

	it('lists recharge packages', async () => {
		const api = await liveApi();
		const packages = await api.recharge.packages({});
		expect(packages).toBeDefined();
	});

	it('reads SMS history (paginated)', async () => {
		const api = await liveApi();
		const history = await api.sms.history({ page: 1, limit: 5 });
		expect(history).toBeDefined();
	});
});
