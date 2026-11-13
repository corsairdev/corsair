import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { rocketlane } from './index';
import { AUTH_ERROR, TASK_PAGE, VALIDATION_ERROR } from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof rocketlane>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'rocketlane', 'default');
	const corsair = createCorsair({
		plugins: [rocketlane(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers step over
 * the wait instead of taking it. The rejection handler is attached before the
 * clock moves: otherwise the promise rejects mid-step with nothing listening,
 * and Node reports an unhandled rejection instead of the assertion the test
 * wants.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	tracked.catch(() => undefined);
	for (let step = 0; step < 20 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(10_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rocketlane-key' });
		try {
			respond(fetchMock, { errors: [{ errorCode: 'RATE_LIMITED' }] }, 429);
			respond(fetchMock, TASK_PAGE);

			const result = await withFakeTimers(
				corsair.rocketlane.api.tasks.list({}),
			);

			expect(result.tasks).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rocketlane-key' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { errors: [{ errorCode: 'RATE_LIMITED' }] }, 429);
			}

			await expect(
				withFakeTimers(corsair.rocketlane.api.tasks.list({})),
			).rejects.toThrow(/Rocketlane 429/);
			// One original attempt plus the three the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rocketlane-key' });
		try {
			respond(fetchMock, { errors: [{ errorCode: 'SERVER_ERROR' }] }, 500);

			await expect(
				withFakeTimers(
					corsair.rocketlane.api.tasks.create({
						task_name: 'Kickoff',
						project_id: 201,
					}),
				),
			).rejects.toThrow(/Rocketlane 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rocketlane-key' });
		try {
			respond(fetchMock, { errors: [{ errorCode: 'SERVER_ERROR' }] }, 500);
			respond(fetchMock, TASK_PAGE);

			const result = await withFakeTimers(
				corsair.rocketlane.api.tasks.list({}),
			);

			expect(result.tasks).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond(fetchMock, AUTH_ERROR, 401);

			await expect(
				withFakeTimers(corsair.rocketlane.api.tasks.list({})),
			).rejects.toThrow(/NOT_AUTHORIZED/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a validation rejection', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rocketlane-key' });
		try {
			respond(fetchMock, VALIDATION_ERROR, 400);

			// The body passes local validation, so the rejection is the provider's:
			// a schema-valid name that Rocketlane refuses for another reason.
			await expect(
				withFakeTimers(
					corsair.rocketlane.api.projects.create({
						project_name: 'Acme onboarding',
						customer: { company_id: 301 },
						owner: { user_id: 401 },
					}),
				),
			).rejects.toThrow(/projectName must not be blank/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
