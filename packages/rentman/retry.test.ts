import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { rentman } from './index';
import {
	CONTACT_PAGE,
	GATEWAY_UNAUTHORIZED,
	VALIDATION_ERROR,
} from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof rentman>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'rentman', 'default');
	const corsair = createCorsair({
		plugins: [rentman(options)],
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
 * the wait. The rejection handler is attached before the clock moves, or the
 * promise rejects mid-step with nothing listening.
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
		const { corsair, testDb } = await createClient({ key: 'rentman-token' });
		try {
			respond(fetchMock, { message: 'Too many requests' }, 429);
			respond(fetchMock, CONTACT_PAGE);

			const result = await withFakeTimers(
				corsair.rentman.api.contacts.list({}),
			);

			expect(result.contacts).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rentman-token' });
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(fetchMock, { message: 'Too many requests' }, 429);
			}

			await expect(
				withFakeTimers(corsair.rentman.api.contacts.list({})),
			).rejects.toThrow(/Rentman 429/);
			// One original attempt plus the three the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rentman-token' });
		try {
			respond(fetchMock, { message: 'Server error' }, 500);

			await expect(
				withFakeTimers(
					corsair.rentman.api.projects.create({
						name: 'Festival 2026',
					}),
				),
			).rejects.toThrow(/Rentman 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 502', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rentman-token' });
		try {
			respond(fetchMock, { message: 'Bad gateway' }, 502);
			respond(fetchMock, CONTACT_PAGE);

			const result = await withFakeTimers(
				corsair.rentman.api.contacts.list({}),
			);

			expect(result.contacts).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected token', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad-token' });
		try {
			respond(fetchMock, GATEWAY_UNAUTHORIZED, 401);

			await expect(
				withFakeTimers(corsair.rentman.api.contacts.list({})),
			).rejects.toThrow(/Unauthorized/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a field validation rejection', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'rentman-token' });
		try {
			respond(fetchMock, VALIDATION_ERROR, 422);

			await expect(
				withFakeTimers(
					corsair.rentman.api.contacts.create({ name: 'Acme Inc' }),
				),
			).rejects.toThrow(/name: The name field is required/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
