// Live LiveSession run. CI skips this file (*api.test.ts); it runs only with a
// real personal access token in LIVESESSION_API_KEY.
// A token made in LiveSession's UI only gets users.sessions:read (11-15), so
// alerts, webhooks and websites calls are expected to fail with LiveSession's
// 401 insufficient_scope unless the token carries those scopes.
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { livesession } from './index';

const apiKey = process.env.LIVESESSION_API_KEY;
if (!apiKey) {
	console.warn(
		'Skipping LiveSession live test: LIVESESSION_API_KEY is not set.',
	);
}
const live = apiKey ? describe : describe.skip;

function makeCorsair(db: ReturnType<typeof createTestDatabase>['db']) {
	return createCorsair({
		plugins: [livesession({ key: apiKey })],
		database: db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
}

type Corsair = ReturnType<typeof makeCorsair>;

// Each call either returns data or fails with the provider's scope error;
// anything else (a 404, a schema failure, a transport error) fails the test.
async function readOrScopeError(
	// `unknown` because each wrapped operation returns its own response type; only success or failure matters here.
	call: () => Promise<unknown>,
): Promise<'ok' | 'insufficient_scope'> {
	try {
		await call();
		return 'ok';
	} catch (error) {
		if (
			error instanceof ApiError &&
			error.status === 401 &&
			JSON.stringify(error.body).includes('insufficient_scope')
		) {
			return 'insufficient_scope';
		}
		throw error;
	}
}

live('LiveSession live API', () => {
	let corsair: Corsair;
	let cleanup: () => void;

	beforeAll(async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'livesession', 'default');
		corsair = makeCorsair(testDb.db);
		cleanup = testDb.cleanup;
	});

	afterAll(async () => {
		cleanup?.();
	});

	const api = () => corsair.livesession.api;

	it('sessions.list: default page', async () => {
		const result = await api().sessions.list({});
		expect(typeof result.total).toBe('number');
		expect(result.page.size).toBe(25);
	});

	it('sessions.list: page and size', async () => {
		const result = await api().sessions.list({ page: 0, size: 5 });
		expect(result.page.size).toBe(5);
	});

	it('sessions.list: relative date and timezone', async () => {
		const result = await api().sessions.list({
			date_from: 'TODAY-30DAYS',
			tz: 'Europe/London',
		});
		expect(typeof result.total).toBe('number');
	});

	it('sessions.list: ISO datetimes filter by date', async () => {
		const result = await api().sessions.list({
			date_from: '2020-01-01T00:00:00Z',
			date_to: '2020-01-02T00:00:00Z',
		});
		expect(result.total).toBe(0);
		expect(result.sessions ?? []).toHaveLength(0);
	});

	it('sessions.list: email filter', async () => {
		const result = await api().sessions.list({ email: 'nobody@example.com' });
		expect(result.total).toBe(0);
	});

	it('sessions.list: visitor_id of a recorded session', async () => {
		const all = await api().sessions.list({ date_from: 'TODAY-30DAYS' });
		const visitorId = all.sessions?.[0]?.visitor?.id;
		if (!visitorId) return;
		const result = await api().sessions.list({
			visitor_id: visitorId,
			date_from: 'TODAY-30DAYS',
		});
		expect(result.sessions?.every((s) => s.visitor?.id === visitorId)).toBe(
			true,
		);
	});

	it('sessions.list: a 400 keeps the filter email out of the error', async () => {
		const error = await api()
			.sessions.list({
				email: 'nobody@example.com',
				date_from: 'TODAY',
				tz: 'Not/AZone',
			})
			// `unknown` because a rejected promise can carry any value; the assertions below narrow it.
			.catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(400);
		expect(JSON.stringify(error)).not.toContain('nobody');
		expect(String((error as Error).stack)).not.toContain('nobody');
	});

	it.each([
		['alerts.list', () => api().alerts.list({})],
		['webhooks.list', () => api().webhooks.list({})],
		['websites.list', () => api().websites.list({})],
	])('%s: data or insufficient_scope', async (_name, call) => {
		expect(['ok', 'insufficient_scope']).toContain(
			await readOrScopeError(call),
		);
	});
});
