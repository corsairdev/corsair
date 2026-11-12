import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { SearchesCreateInput } from './endpoints/types';
import { melo } from './index';
import {
	propertyResponse,
	searchCreatedResponse,
	searchesListResponse,
} from './test-fixtures';
import {
	captureError,
	lastCall,
	respondEmpty,
	respondLd,
	respondText,
	withView,
} from './test-helpers';

const PROPERTY_ID = '38cb65b9-2965-4bd0-bc9b-2b8a8be7c457';
const SEARCH_ID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
const VALID_SEARCH: SearchesCreateInput = {
	title: 'mySearch',
	transactionType: 0,
	propertyTypes: [0, 1],
};

let fetchMock: jest.SpyInstance;

async function createClient(plugin = melo({ key: 'melo-test-key' })) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'melo', 'default');
	const corsair = createCorsair({
		plugins: [plugin],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const tooMany = (headers: Record<string, string> = {}) =>
	respondText(fetchMock, 'Too Many Requests', 429, 'text/plain', headers);

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('Melo retries through the bound client', () => {
	it('retries a rate-limited read after the Retry-After the API sent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			tooMany({ 'Retry-After': '1' });
			respondLd(fetchMock, propertyResponse);

			const result = await corsair.melo.api.properties.get({ id: PROPERTY_ID });

			expect(result.uuid).toBe(PROPERTY_ID);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited write, because a 429 is a refusal', async () => {
		const { corsair, testDb } = await createClient();
		try {
			tooMany({ 'Retry-After': '1' });
			respondLd(fetchMock, searchCreatedResponse, 201);

			const result = await corsair.melo.api.searches.create(VALID_SEARCH);

			expect(result.title).toBe('mySearch');
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(lastCall(fetchMock).method).toBe('POST');
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the one-second backoff when a 429 carries no Retry-After', async () => {
		const { corsair, testDb } = await createClient();
		try {
			jest.useFakeTimers();
			tooMany();
			respondLd(fetchMock, propertyResponse);

			const pending = corsair.melo.api.properties.get({ id: PROPERTY_ID });
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.uuid).toBe(PROPERTY_ID);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and throws the last 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			jest.useFakeTimers();
			for (let attempt = 0; attempt < 4; attempt++) tooMany();

			const pending = captureError(
				corsair.melo.api.properties.get({ id: PROPERTY_ID }),
			);
			await jest.advanceTimersByTimeAsync(1000 + 2000 + 4000);
			const error = await pending;

			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			jest.useFakeTimers();
			respondText(fetchMock, 'Internal Server Error', 500);
			respondLd(fetchMock, withView(searchesListResponse, '/searches'));

			const pending = corsair.melo.api.searches.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result['hydra:member']).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on create, which may have been applied', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondText(fetchMock, 'Internal Server Error', 500);

			const error = await captureError(
				corsair.melo.api.searches.create(VALID_SEARCH),
			);

			expect(error).toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on update or delete', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondText(fetchMock, 'Internal Server Error', 500);
			const updated = await captureError(
				corsair.melo.api.searches.update({ id: SEARCH_ID, ...VALID_SEARCH }),
			);
			expect(updated).toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);

			respondText(fetchMock, 'Internal Server Error', 500);
			const deleted = await captureError(
				corsair.melo.api.searches.delete({ id: SEARCH_ID }),
			);
			expect(deleted).toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on webhooks.simulate, a GET that delivers a payload', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondText(fetchMock, 'Internal Server Error', 500);

			const error = await captureError(
				corsair.melo.api.webhooks.simulate({
					endpoint: 'https://example.com/webhook',
				}),
			);

			expect(error).toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection on a read but not on a write', async () => {
		const { corsair, testDb } = await createClient();
		try {
			jest.useFakeTimers();
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respondLd(fetchMock, propertyResponse);

			const pending = corsair.melo.api.properties.get({ id: PROPERTY_ID });
			await jest.advanceTimersByTimeAsync(1000);
			expect((await pending).uuid).toBe(PROPERTY_ID);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			const error = await captureError(
				corsair.melo.api.searches.create(VALID_SEARCH),
			);
			expect(error).toMatchObject({ transport: true });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401, 404 or 400', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondText(fetchMock, 'Authentication failed', 401);
			expect(
				await captureError(corsair.melo.api.searches.list({})),
			).toMatchObject({ status: 401 });

			respondText(fetchMock, 'Not Found', 404);
			expect(
				await captureError(
					corsair.melo.api.properties.get({ id: PROPERTY_ID }),
				),
			).toMatchObject({ status: 404 });

			respondText(fetchMock, 'Bad Request', 400);
			expect(
				await captureError(corsair.melo.api.searches.list({})),
			).toMatchObject({ status: 400 });

			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a delete as done on a 204 through the bound client', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondEmpty(fetchMock, 204);

			const result = await corsair.melo.api.searches.delete({ id: SEARCH_ID });

			expect(result).toEqual({ id: SEARCH_ID, deleted: true });
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Melo key resolution through the bound client', () => {
	it('sends the key stored on the account when no key is configured inline', async () => {
		const { corsair, testDb } = await createClient(melo());
		try {
			await corsair.melo.keys.issue_new_dek();
			await corsair.melo.keys.set_api_key('stored-melo-key');
			respondLd(fetchMock, propertyResponse);

			await corsair.melo.api.properties.get({ id: PROPERTY_ID });

			expect(lastCall(fetchMock).headers.get('x-api-key')).toBe(
				'stored-melo-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('throws before any request when there is no key at all', async () => {
		const { corsair, testDb } = await createClient(melo());
		try {
			await corsair.melo.keys.issue_new_dek();

			const error = await captureError(
				corsair.melo.api.properties.get({ id: PROPERTY_ID }),
			);

			expect(error).toBeInstanceOf(Error);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
