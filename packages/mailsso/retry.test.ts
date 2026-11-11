import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { MailssoAPIError, MailssoSubscriptionRequiredError } from './client';
import { mailsso } from './index';
import {
	batchCreatedFixture,
	batchProcessingFixture,
	singleRiskyFixture,
	subscriptionRequiredBody,
	unauthorizedBody,
} from './test-fixtures';
import { captureError, jsonResponse } from './test-helpers';

async function createClient(options: Parameters<typeof mailsso>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mailsso', 'default');
	const corsair = createCorsair({
		plugins: [mailsso(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const SINGLE = { email: 'hello@mails.so' };
const BATCH = { emails: ['probe-a@example.com', 'probe-b@example.com'] };

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
	// Core sleeps with setTimeout; the database needs the other timers real.
	jest.useFakeTimers({
		doNotFake: ['nextTick', 'setImmediate', 'queueMicrotask'],
	});
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('Mails.so retries through createCorsair', () => {
	it('retries a 429 on a read after 1s when Mails.so sends no Retry-After', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ data: null, error: 'Slow down' }, 429),
				)
				.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

			const pending = corsair.mailsso.api.validations.single(SINGLE);
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.result).toBe('risky');
		} finally {
			testDb.cleanup();
		}
	});

	it('waits for the Retry-After Mails.so sends instead', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ data: null, error: 'Slow down' }, 429, {
						'Retry-After': '3',
					}),
				)
				.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

			const pending = corsair.mailsso.api.validations.single(SINGLE);
			await jest.advanceTimersByTimeAsync(2999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);
			await pending;

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a write, which the limit stopped before it ran', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ data: null, error: 'Slow down' }, 429),
				)
				.mockResolvedValueOnce(jsonResponse(batchCreatedFixture));

			const pending = corsair.mailsso.api.validations.batch(BATCH);
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.id).toBe(batchCreatedFixture.id);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries of a 429', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock.mockImplementation(async () =>
				jsonResponse({ data: null, error: 'Slow down' }, 429),
			);

			const pending = captureError(
				corsair.mailsso.api.validations.single(SINGLE),
			);
			// 1s + 2s + 4s of backoff between the four attempts.
			await jest.advanceTimersByTimeAsync(7000);
			const caught = await pending;

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(caught).toBeInstanceOf(MailssoAPIError);
			expect(caught).toMatchObject({ status: 429 });
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse(
						{ data: null, error: 'failed to check job status' },
						500,
					),
				)
				.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

			const pending = corsair.mailsso.api.validations.single(SINGLE);
			await jest.advanceTimersByTimeAsync(1000);
			await pending;

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a batch write on a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock.mockResolvedValue(
				jsonResponse({ data: null, error: 'Server error' }, 500),
			);

			const caught = await captureError(
				corsair.mailsso.api.validations.batch(BATCH),
			);
			await jest.advanceTimersByTimeAsync(10_000);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(caught).toMatchObject({ status: 500, method: 'POST' });
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a batch write when the connection drops', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock.mockRejectedValue(new TypeError('fetch failed'));

			const caught = await captureError(
				corsair.mailsso.api.validations.batch(BATCH),
			);
			await jest.advanceTimersByTimeAsync(10_000);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(caught).toMatchObject({ transport: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection on a read', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock
				.mockRejectedValueOnce(new TypeError('fetch failed'))
				.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

			const pending = corsair.mailsso.api.validations.single(SINGLE);
			await jest.advanceTimersByTimeAsync(1000);
			await pending;

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry the paid-plan error', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock.mockResolvedValue(jsonResponse(subscriptionRequiredBody, 401));

			const caught = await captureError(
				corsair.mailsso.api.validations.batch(BATCH),
			);
			await jest.advanceTimersByTimeAsync(10_000);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(caught).toBeInstanceOf(MailssoSubscriptionRequiredError);
		} finally {
			testDb.cleanup();
		}
	});

	it('hands back a running job at once instead of retrying the 202', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock.mockResolvedValue(jsonResponse(batchProcessingFixture, 202));

			const result = await corsair.mailsso.api.validations.getBatch({
				id: batchProcessingFixture.data.id,
			});
			await jest.advanceTimersByTimeAsync(10_000);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(result.status).toBe('processing');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'k' });
		try {
			fetchMock.mockResolvedValue(jsonResponse(unauthorizedBody, 401));

			const caught = await captureError(
				corsair.mailsso.api.validations.single(SINGLE),
			);
			await jest.advanceTimersByTimeAsync(10_000);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(caught).toMatchObject({ status: 401, message: 'Unauthorized' });
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Mails.so key resolution through createCorsair', () => {
	it('sends the key stored for the account when no inline key is set', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.mailsso.keys.issue_new_dek();
			await corsair.mailsso.keys.set_api_key('mails-stored-key');
			fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

			await corsair.mailsso.api.validations.single(SINGLE);

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-mails-api-key')).toBe(
				'mails-stored-key',
			);
			expect(url).not.toContain('mails-stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.mailsso.keys.issue_new_dek();

			await expect(
				corsair.mailsso.api.validations.single(SINGLE),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers the inline key over the stored one', async () => {
		const { corsair, testDb } = await createClient({ key: 'mails-inline-key' });
		try {
			await corsair.mailsso.keys.issue_new_dek();
			await corsair.mailsso.keys.set_api_key('mails-stored-key');
			fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

			await corsair.mailsso.api.validations.single(SINGLE);

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-mails-api-key')).toBe(
				'mails-inline-key',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
