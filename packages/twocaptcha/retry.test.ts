import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { twocaptcha } from './index';
import { balance, noSlot, taskCreated } from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'twocaptcha', 'default');
	const corsair = createCorsair({
		plugins: [twocaptcha({ key: 'a'.repeat(32) })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('retries a no-slot answer on createTask and returns the task', async () => {
		const { corsair, testDb } = await createClient();
		respond(noSlot);
		respond(taskCreated);
		const result = await corsair.twocaptcha.api.tasks.create({
			type: 'RecaptchaV2TaskProxyless',
			task: { websiteURL: 'https://example.com', websiteKey: 'k' },
		});
		expect(result.taskId).toBe(72345678901);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		testDb.cleanup?.();
	}, 30_000);

	it('retries a 5xx on getBalance', async () => {
		const { corsair, testDb } = await createClient();
		respond({ message: 'busy' }, 502);
		respond(balance);
		const result = await corsair.twocaptcha.api.account.balance({});
		expect(result.balance).toBe(0.93958);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		testDb.cleanup?.();
	}, 30_000);

	it('does not replay createTask after a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		respond({ message: 'busy' }, 502);
		await expect(
			corsair.twocaptcha.api.tasks.create({
				type: 'RecaptchaV2TaskProxyless',
				task: { websiteURL: 'https://example.com', websiteKey: 'k' },
			}),
		).rejects.toBeDefined();
		expect(fetchMock).toHaveBeenCalledTimes(1);
		testDb.cleanup?.();
	}, 30_000);
});
