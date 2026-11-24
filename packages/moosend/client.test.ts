import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeMoosendRequest, maskEmails, statusForEnvelope } from './client';
import { errorHandlers } from './error-handlers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or HTML test payloads.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

const post = {
	method: 'POST' as const,
	path: '/subscribers/l1/subscribe.json',
	body: { Email: 'jana@example.com' },
};

async function failure(): Promise<ApiError> {
	try {
		await makeMoosendRequest('secret-key', post);
	} catch (error) {
		if (error instanceof ApiError) return error;
		throw error;
	}
	throw new Error('expected a failure');
}

describe('makeMoosendRequest', () => {
	it('sends the key as the apikey query parameter and unwraps Context', async () => {
		respond({ Code: 0, Error: null, Context: { ID: 'x' } });
		await expect(makeMoosendRequest('secret-key', post)).resolves.toEqual({
			code: 0,
			notice: null,
			context: { ID: 'x' },
		});
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(new URL(url).searchParams.get('apikey')).toBe('secret-key');
	});

	it('passes a success warning through as a masked notice', async () => {
		respond({
			Code: 0,
			Error:
				'1 items were ignored because Email is not valid for recipients bad@x',
			Context: [],
		});
		const result = await makeMoosendRequest('secret-key', post);
		expect(result.notice).toBe(
			'1 items were ignored because Email is not valid for recipients [email]',
		);
	});

	it.each([
		[104, 'API_KEY_NOT_VALID', 401],
		[429, 'RATE_LIMITING', 429],
		[200, 'LIST_NOT_FOUND', 404],
		[400, 'CAMPAIGN_NOT_FOUND', 404],
		[203, 'SEGMENT_CRITERIA_NOT_FOUND', 404],
		[501, 'VALIDATION_ERROR: Provide at least one test email', 400],
		[-1, 'Mailing list ID must be provided', 400],
		[-1, 'UNEXPECTED_ERROR', 500],
		[-1, 'An internal error occurred while performing your request', 500],
		[
			-1,
			'UNEXPECTED_ERROR: The email is unsubscribed from the mailing list',
			400,
		],
	])(
		'turns envelope Code %i %s into ApiError %i',
		async (code, error, status) => {
			respond({ Code: code, Error: error, Context: null });
			const thrown = await failure();
			expect(thrown.status).toBe(status);
			expect(thrown.body).toEqual({ Code: code, Error: error });
			expect(thrown.message).toBe(`Moosend ${code}: ${error}`);
		},
	);

	it('keeps the key, the request body and quoted emails out of envelope errors', async () => {
		respond({
			Code: 501,
			Error: 'VALIDATION_ERROR: jana@example.com is not valid',
			Context: null,
		});
		const thrown = await failure();
		const dump = JSON.stringify({ ...thrown, message: thrown.message });
		expect(dump).not.toContain('secret-key');
		expect(dump).not.toContain('jana@example.com');
		expect(thrown.request.body).toBeUndefined();
	});

	it('rebuilds an HTTP error without the request body or the key', async () => {
		respond('<html>The resource cannot be found.</html>', 404, 'text/html');
		const thrown = await failure();
		expect(thrown.status).toBe(404);
		expect(thrown.request.body).toBeUndefined();
		expect(JSON.stringify(thrown)).not.toContain('secret-key');
		expect(JSON.stringify(thrown)).not.toContain('jana@example.com');
	});

	it.each([
		['an envelope failure', { Code: 501, Error: 'VALIDATION_ERROR' }, 200],
		['an HTTP failure', '<html>Server Error</html>', 500],
	])('keeps an Email lookup out of %s', async (_, body, status) => {
		respond(
			body,
			status,
			typeof body === 'string' ? 'text/html' : 'application/json',
		);
		let thrown: unknown;
		try {
			await makeMoosendRequest('secret-key', {
				method: 'GET',
				path: '/subscribers/l1/view.json',
				query: { Email: 'jana@example.com' },
			});
		} catch (error) {
			thrown = error;
		}
		expect(thrown).toBeInstanceOf(ApiError);
		const dump = JSON.stringify(thrown);
		expect(dump).not.toContain('jana');
		expect(dump).not.toContain('secret-key');
	});

	it('fails a 200 answer without the envelope instead of returning it', async () => {
		respond({ hello: 'world' });
		const thrown = await failure();
		expect(thrown.status).toBe(502);
	});
});

describe('statusForEnvelope and maskEmails', () => {
	it('maps rate limiting by name too', () => {
		expect(statusForEnvelope(9, 'RATE-LIMITING')).toBe(429);
	});

	it('masks every address', () => {
		expect(maskEmails('a@b.com, c.d@e.org')).toBe('[email], [email]');
	});
});

function context(operation: string): ErrorContext {
	return {
		pluginId: 'moosend',
		operation,
		input: {},
		originalError: new Error('x'),
	};
}

// unknown: tests build both envelope objects and plain-text HTTP bodies.
function apiError(status: number, body: unknown) {
	return new ApiError(
		{ method: 'GET', url: '/lists.json' },
		{ url: '/lists.json', ok: false, status, statusText: '', body },
		'failed',
	);
}

describe('errorHandlers', () => {
	const read = context('lists.list');
	const write = context('subscribers.subscribe');

	it('retries an envelope 429 (core never saw it) but not an HTTP 429', async () => {
		const envelope429 = apiError(429, { Code: 429, Error: 'RATE_LIMITING' });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(envelope429)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(envelope429),
		).resolves.toMatchObject({ maxRetries: 3 });

		const http429 = apiError(429, 'Too Many Requests');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(http429),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('never retries a bad key or a validation error', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401, {}))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(404, {}))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(400, {}))).toBe(true);
	});

	it('retries a 5xx only for reads', () => {
		const error = apiError(503, 'unavailable');
		expect(errorHandlers.SERVER_ERROR.match(error, read)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(error, write)).toBe(false);
	});

	it('retries a dropped connection only for reads', () => {
		const error = new TypeError('fetch failed');
		expect(errorHandlers.NETWORK_ERROR.match(error, read)).toBe(true);
		expect(errorHandlers.NETWORK_ERROR.match(error, write)).toBe(false);
		expect(errorHandlers.NETWORK_ERROR.match(apiError(500, {}), read)).toBe(
			false,
		);
	});
});
