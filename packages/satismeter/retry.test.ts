import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { satismeter } from './index';
import {
	PROJECT_BODY,
	PROJECT_NOT_FOUND_BODY,
	SERVER_ERROR_BODY,
} from './test-fixtures';
import {
	fetchCallCount,
	installFetchMock,
	rejectNextFetch,
	respond,
	restoreFetchMock,
	sentHeaders,
} from './test-helpers';

async function createClient(options: Parameters<typeof satismeter>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'satismeter', 'default');
	const corsair = createCorsair({
		plugins: [satismeter(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

beforeEach(() => {
	installFetchMock();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	restoreFetchMock();
	jest.useRealTimers();
});

/** Core sleeps between retries with a plain setTimeout, so fake timers step it. */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 12 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(10_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('replays a read after a 500', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sm-test-key' });
		try {
			respond(SERVER_ERROR_BODY, 500);
			respond(PROJECT_BODY);

			const result = await withFakeTimers(
				corsair.satismeter.api.projects.get({ projectId: 'abc' }),
			);

			expect(result.project.name).toBe('SatisMeter Sample App');
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 500, which may have landed', async () => {
		const { corsair, testDb } = await createClient({ key: 'sm-test-key' });
		try {
			respond(SERVER_ERROR_BODY, 500);

			// users.track counts the event every time it arrives.
			await expect(
				corsair.satismeter.api.users.track({
					projectId: 'abc',
					userId: '007',
					event: 'checkout',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a missing project', async () => {
		const { corsair, testDb } = await createClient({ key: 'sm-test-key' });
		try {
			respond(PROJECT_NOT_FOUND_BODY, 404);

			await expect(
				corsair.satismeter.api.projects.get({ projectId: 'abc' }),
			).rejects.toMatchObject({ status: 404, title: 'Project not found' });
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a transport failure', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sm-test-key' });
		try {
			rejectNextFetch(new TypeError('fetch failed'));
			respond(PROJECT_BODY);

			const result = await withFakeTimers(
				corsair.satismeter.api.projects.get({ projectId: 'abc' }),
			);

			expect(result.project.id).toBeDefined();
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after a transport failure', async () => {
		const { corsair, testDb } = await createClient({ key: 'sm-test-key' });
		try {
			rejectNextFetch(new TypeError('fetch failed'));

			await expect(
				corsair.satismeter.api.users
					.upsert({ projectId: 'abc', userId: '007' })
					// unknown: a rejection can carry any value, and the assertion
					// below narrows it to the transport flag.
					.catch((caught: unknown) => caught),
			).resolves.toMatchObject({ isTransport: true });
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a request whose input failed validation', async () => {
		const { corsair, testDb } = await createClient({ key: 'sm-test-key' });
		try {
			await expect(
				corsair.satismeter.api.responses.list({
					projectId: 'a',
					pageSize: 500,
				}),
			).rejects.toThrow();
			expect(fetchCallCount()).toBe(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('uses an inline key without reading the stored one', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond(PROJECT_BODY);

			await corsair.satismeter.api.projects.get({ projectId: 'abc' });

			expect(sentHeaders().get('Authorization')).toBe('Bearer inline-key');
		} finally {
			testDb.cleanup();
		}
	});
});
