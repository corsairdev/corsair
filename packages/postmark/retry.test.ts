import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import {
	POSTMARK_API_BASE,
	POSTMARK_SERVER_TOKEN_HEADER,
	readErrorCode,
} from './client';
import { postmark } from './index';
import { captureError } from './test-helpers';

async function createClient(options: Parameters<typeof postmark>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'postmark', 'default');
	const corsair = createCorsair({
		plugins: [postmark(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one response for the next fetch call. */
function respond(
	body: unknown, // unknown: each test passes one of Postmark's response shapes.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

const sendResult = {
	To: 'receiver@example.com',
	SubmittedAt: '2024-02-17T07:25:01.4178645-05:00',
	MessageID: '0a129aee-e1cd-480d-b08d-4f48548ff48d',
	ErrorCode: 0,
	Message: 'OK',
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Postmark plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no token is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postmark.keys.issue_new_dek();
			await expect(corsair.postmark.api.server.get({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored token in X-Postmark-Server-Token', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postmark.keys.issue_new_dek();
			await corsair.postmark.keys.set_api_key('stored-token');
			respond({ ID: 1234, DeliveryType: 'Live' });

			const result = await corsair.postmark.api.server.get({});

			expect(result.DeliveryType).toBe('Live');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${POSTMARK_API_BASE}/server`);
			const headers = new Headers(init.headers);
			expect(headers.get(POSTMARK_SERVER_TOKEN_HEADER)).toBe('stored-token');
			// Postmark answers 415 without a Content-Type, even on a read.
			expect(headers.get('Content-Type')).toBe('application/json');
		} finally {
			testDb.cleanup();
		}
	});

	it('sends an email with the configured token', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond(sendResult);

			const result = await corsair.postmark.api.email.send({
				From: 'sender@example.com',
				To: 'receiver@example.com',
				TextBody: 'Hello',
			});

			expect(result.message.MessageID).toBe(sendResult.MessageID);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${POSTMARK_API_BASE}/email`);
			expect(JSON.parse(String(init.body))).toMatchObject({
				From: 'sender@example.com',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected token', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-token' });
		try {
			respond(
				{
					ErrorCode: 10,
					Message: 'Request does not contain a valid Server token.',
				},
				401,
			);

			const error = await captureError(corsair.postmark.api.server.get({}));

			// Core's ApiError passes through, and the code stays on its body.
			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 401 });
			expect(readErrorCode((error as ApiError).body)).toBe(10);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(JSON.stringify(error)).not.toContain('bad-token');
			expect((error as Error).message).not.toContain('bad-token');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries maintenance, which the API says will end', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond({ ErrorCode: 100, Message: 'Maintenance' }, 503);
			respond({ ID: 1234 });

			const pending = corsair.postmark.api.server.get({});
			await jest.advanceTimersByTimeAsync(10_000);
			const result = await pending;

			expect(result.ID).toBe(1234);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('does not replay a send after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond({ ErrorCode: 101, Message: 'Unexpected error' }, 500);

			await expect(
				corsair.postmark.api.email.send({
					From: 'sender@example.com',
					To: 'receiver@example.com',
					TextBody: 'Hello',
				}),
			).rejects.toBeInstanceOf(ApiError);
			// One attempt only: the message may already be queued.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-token' });
		try {
			respond({ ErrorCode: 0, Message: 'Rate limit' }, 429);
			respond({ ID: 1234 });

			const pending = corsair.postmark.api.server.get({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.ID).toBe(1234);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
