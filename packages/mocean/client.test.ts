import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	cleanMessage,
	makeMoceanRequest,
	readBodyStatus,
	statusForBody,
} from './client';
import { errorHandlers } from './error-handlers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text test payloads.
function respond(body: unknown, status = 202) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
			},
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

const send = {
	family: 'sms' as const,
	method: 'POST' as const,
	path: '/rest/2/sms',
	body: 'mocean-to=60123456789&mocean-text=secret+text&mocean-resp-format=json',
	mediaType: 'application/x-www-form-urlencoded',
};

async function failure(
	options: Parameters<typeof makeMoceanRequest>[1] = send,
): Promise<ApiError> {
	try {
		await makeMoceanRequest('secret-token', options);
	} catch (error) {
		if (error instanceof ApiError) return error;
		throw error;
	}
	throw new Error('expected a failure');
}

describe('makeMoceanRequest', () => {
	it('authenticates with the Bearer token and returns the body', async () => {
		respond({ status: 0, value: 20 });
		await expect(
			makeMoceanRequest('secret-token', {
				family: 'query',
				method: 'GET',
				path: '/rest/2/account/balance',
				query: { 'mocean-resp-format': 'json' },
			}),
		).resolves.toEqual({ status: 0, value: 20 });
		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('Authorization')).toBe(
			'Bearer secret-token',
		);
	});

	it.each([
		['sms', 1, 401],
		['sms', 2, 402],
		['sms', 32, 429],
		['sms', 40, 503],
		['sms', 45, 500],
		['query', 46, 400],
		['verify', 1, 429],
		['verify', 2, 401],
		['verify', 18, 402],
		['verify', 3, 503],
		['verify', 17, 400],
		['voice', 10, 500],
		['voice', 14, 500],
		['voice', 15, 503],
		['voice', 7, 400],
	] as const)(
		'maps a %s body status %i to ApiError %i',
		async (family, code, status) => {
			respond({ status: code, err_msg: 'x' });
			const thrown = await failure({ ...send, family });
			expect(thrown.status).toBe(status);
			expect(thrown.body).toMatchObject({ status: code });
		},
	);

	it('reads a status sent as a string (voice routes)', async () => {
		respond({ status: '1', err_msg: 'Authorization failed' });
		const thrown = await failure({ ...send, family: 'voice' });
		expect(thrown.status).toBe(401);
	});

	it('keeps HTTP statuses and decodes the message (seen live)', async () => {
		respond(
			{
				reqid: 'nonexistent',
				status: 17,
				err_msg: 'Associated+verify+request+has+already+expired+or+invalid',
			},
			404,
		);
		const thrown = await failure({ ...send, family: 'verify' });
		expect(thrown.status).toBe(404);
		expect(thrown.message).toBe(
			'Mocean HTTP 404: Associated verify request has already expired or invalid',
		);
	});

	it('reads the status a send wraps in messages[0] (seen live)', async () => {
		respond(
			{
				messages: [{ status: 6, err_msg: 'No destination number specified.' }],
			},
			400,
		);
		const thrown = await failure();
		expect(thrown.status).toBe(400);
		expect(thrown.body).toEqual({
			status: 6,
			err_msg: 'No destination number specified.',
		});
	});

	it('keeps the token, numbers and message text out of errors', async () => {
		respond({ status: 28, err_msg: 'Invalid number 60123456789' });
		const thrown = await failure();
		const dump = JSON.stringify({ ...thrown, message: thrown.message });
		expect(dump).not.toContain('secret-token');
		expect(dump).not.toContain('60123456789');
		expect(dump).not.toContain('secret text');
		expect(thrown.request.body).toBeUndefined();
		expect(thrown.message).toBe('Mocean status 28: Invalid number [number]');
	});

	it('keeps an HTTP error free of request data and numbers', async () => {
		respond({ status: 7, err_msg: 'Invalid call 60123456789' }, 400);
		const thrown = await failure({
			family: 'voice',
			method: 'GET',
			path: '/rest/2/voice/rec',
			query: { 'mocean-call-uuid': 'c1' },
		});
		const dump = JSON.stringify(thrown);
		expect(dump).not.toContain('60123456789');
		expect(dump).not.toContain('secret-token');
		expect(thrown.request.query).toBeUndefined();
		expect(thrown.stack ?? '').not.toContain('60123456789');
	});

	it('returns a send with a failed receiver instead of throwing', async () => {
		respond({
			messages: [
				{ status: 0, receiver: '601', msgid: 'm1' },
				{ status: 28, err_msg: 'Invalid+destination+number' },
			],
		});
		await expect(
			makeMoceanRequest('secret-token', send),
		).resolves.toMatchObject({
			messages: [{ status: 0 }, { status: 28 }],
		});
	});
});

describe('helpers', () => {
	it('readBodyStatus accepts numbers and numeric strings only', () => {
		expect(readBodyStatus({ status: 0 })).toBe(0);
		expect(readBodyStatus({ status: '32' })).toBe(32);
		expect(readBodyStatus({ status: 'x' })).toBeUndefined();
		expect(readBodyStatus(null)).toBeUndefined();
	});

	it('statusForBody treats an unknown code as a bad request', () => {
		expect(statusForBody('whatsapp', 94)).toBe(400);
	});

	it('cleanMessage decodes and masks', () => {
		expect(cleanMessage('Sent+to+%2B60+12-345+6789+by+a@b.com')).toBe(
			'Sent to [number] by [email]',
		);
	});
});

function context(operation: string): ErrorContext {
	return {
		pluginId: 'mocean',
		operation,
		input: {},
		originalError: new Error('x'),
	};
}

function httpError(status: number) {
	return new ApiError(
		{ method: 'GET', url: '/rest/2/account/balance' },
		{
			url: '/rest/2/account/balance',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		'failed',
	);
}

describe('errorHandlers', () => {
	const read = context('account.balance');
	const send = context('sms.send');

	it('retries a body throttle (core never saw it) but not an HTTP 429', async () => {
		respond({ status: 32, err_msg: 'Throttled' });
		const throttled = await failure();
		expect(errorHandlers.RATE_LIMIT_ERROR.match(throttled)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(throttled),
		).resolves.toMatchObject({ maxRetries: 3 });
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(httpError(429)),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('never retries auth, credit or validation failures', () => {
		expect(errorHandlers.AUTH_ERROR.match(httpError(401))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(httpError(402))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(httpError(400))).toBe(true);
	});

	it('retries a 5xx only for reads, never a send', () => {
		expect(errorHandlers.SERVER_ERROR.match(httpError(503), read)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(httpError(503), send)).toBe(false);
	});

	it('retries a dropped connection only for reads', () => {
		const error = new TypeError('fetch failed');
		expect(errorHandlers.NETWORK_ERROR.match(error, read)).toBe(true);
		expect(errorHandlers.NETWORK_ERROR.match(error, send)).toBe(false);
	});
});
