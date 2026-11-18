import { inspect } from 'node:util';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { LinguapopAPIError } from './client';
import { linguapop } from './index';
import {
	invalidKeyBody,
	invitationRequestFixture,
	invitationResponseFixture,
	languagesFixture,
} from './test-fixtures';
import {
	captureError,
	jsonResponse,
	lastCall,
	textResponse,
} from './test-helpers';

const API_KEY = 'lp-bound-test-key';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'linguapop', 'default');
	const corsair = createCorsair({
		plugins: [linguapop({ key: API_KEY })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

function rateLimited(headers: Record<string, string> = {}): Response {
	return new Response('Too many requests', {
		status: 429,
		headers: { 'Content-Type': 'text/plain', ...headers },
	});
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// send a live request, so every call a test did not stub fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/** Core sleeps between retries with a plain setTimeout, so fake timers step over it. */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 10 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(8000);
	}
	return tracked;
}

describe('Linguapop through createCorsair', () => {
	it('sends apiKey in the body of a bound invitations.create call', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse(invitationResponseFixture));

			const result = await corsair.linguapop.api.invitations.create(
				invitationRequestFixture,
			);

			const call = lastCall(fetchMock);
			expect(call.url).toBe(
				'https://app.linguapop.eu/api/actions/sendInvitation',
			);
			expect(call.method).toBe('POST');
			expect(call.body).toEqual({
				...invitationRequestFixture,
				apiKey: API_KEY,
			});
			expect(call.headers.get('authorization')).toBeNull();
			expect(call.url).not.toContain(API_KEY);
			expect(result.invitationId).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists languages through the bound client without sending the key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse(languagesFixture));

			const result = await corsair.linguapop.api.languages.list({});

			const call = lastCall(fetchMock);
			expect(call.method).toBe('GET');
			expect(call.rawBody).toBeUndefined();
			expect(call.url).not.toContain(API_KEY);
			expect(result).toHaveLength(5);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not leak the key in the error a bound call throws', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(textResponse(invalidKeyBody, 400));

			const error = await captureError(
				corsair.linguapop.api.invitations.create(invitationRequestFixture),
			);

			expect(error).toBeInstanceOf(LinguapopAPIError);
			expect(error).toMatchObject({ invalidApiKey: true, status: 400 });
			expect(inspect(error, { depth: 10 })).not.toContain(API_KEY);
			expect(JSON.stringify(error)).not.toContain(API_KEY);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Linguapop retries through the bound client', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(rateLimited({ 'Retry-After': '1' }))
				.mockResolvedValueOnce(jsonResponse(languagesFixture));

			const result = await withFakeTimers(
				corsair.linguapop.api.languages.list({}),
			);

			expect(result).toHaveLength(5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited invitation and resends the key in the body', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(rateLimited())
				.mockResolvedValueOnce(jsonResponse(invitationResponseFixture));

			const result = await withFakeTimers(
				corsair.linguapop.api.invitations.create(invitationRequestFixture),
			);

			expect(result.invitationId).toBe(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(lastCall(fetchMock).body).toMatchObject({ apiKey: API_KEY });
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and throws the last 429', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++) {
				fetchMock.mockResolvedValueOnce(rateLimited());
			}

			const error = await withFakeTimers(
				captureError(corsair.linguapop.api.languages.list({})),
			);

			expect(error).toMatchObject({ status: 429, isRateLimit: true });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the one-second backoff when 429 carries no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(rateLimited())
				.mockResolvedValueOnce(jsonResponse(languagesFixture));

			const pending = corsair.linguapop.api.languages.list({});
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toHaveLength(5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits as long as Retry-After says', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(rateLimited({ 'Retry-After': '3' }))
				.mockResolvedValueOnce(jsonResponse(languagesFixture));

			const pending = corsair.linguapop.api.languages.list({});
			await jest.advanceTimersByTimeAsync(2999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toHaveLength(5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(textResponse('boom', 503))
				.mockResolvedValueOnce(jsonResponse(languagesFixture));

			const result = await withFakeTimers(
				corsair.linguapop.api.languages.list({}),
			);

			expect(result).toHaveLength(5);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay an invitation after a 5xx, which may have been created', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(textResponse('boom', 503));

			await expect(
				corsair.linguapop.api.invitations.create(invitationRequestFixture),
			).rejects.toMatchObject({ status: 503, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay an invitation after a dropped connection', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.linguapop.api.invitations.create(invitationRequestFixture),
			).rejects.toMatchObject({ transport: true, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
