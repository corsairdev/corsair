import {
	describeRevoltError,
	makeRevoltRequest,
	REVOLT_API_BASE,
	REVOLT_TOKEN_HEADERS,
	RevoltAPIError,
} from './client';
import {
	BLOCKED,
	NOT_FOUND,
	RATE_LIMITED,
	UNAUTHORIZED,
	VALIDATION_ERROR,
} from './test-fixtures';
import { captureError, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('credential headers', () => {
	it('sends a bot token in X-Bot-Token, never Authorization', async () => {
		respond(fetchMock, { _id: 'u' });

		await makeRevoltRequest('bot-token', 'bot', REVOLT_API_BASE, {
			method: 'GET',
			path: '/users/@me',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.headers.get('x-bot-token')).toBe('bot-token');
		expect(request.headers.get('x-session-token')).toBeNull();
		expect(request.headers.get('authorization')).toBeNull();
		expect(REVOLT_TOKEN_HEADERS.bot).toBe('X-Bot-Token');
	});

	it('sends a user token in X-Session-Token', async () => {
		respond(fetchMock, { _id: 'u' });

		await makeRevoltRequest('user-token', 'user', REVOLT_API_BASE, {
			method: 'GET',
			path: '/users/@me',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.headers.get('x-session-token')).toBe('user-token');
		expect(request.headers.get('x-bot-token')).toBeNull();
		expect(REVOLT_TOKEN_HEADERS.user).toBe('X-Session-Token');
	});

	it('uses the configured host, for a self-hosted instance', async () => {
		respond(fetchMock, {});

		await makeRevoltRequest('key', 'bot', 'https://stoat.example.com', {
			method: 'GET',
			path: '/users/@me',
			replayable: true,
		});

		expect(lastRequest(fetchMock).origin).toBe('https://stoat.example.com');
	});
});

describe('the error envelope', () => {
	it('reads the live 401 body', async () => {
		respond(fetchMock, UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRevoltRequest('bad', 'bot', REVOLT_API_BASE, {
				method: 'GET',
				path: '/users/@me',
				replayable: true,
			}),
		)) as RevoltAPIError;

		expect(error).toBeInstanceOf(RevoltAPIError);
		expect(error.status).toBe(401);
		expect(error.reason).toBe('Unauthorized');
		expect(error.isAuthError).toBe(true);
		// The body's code repeats the status, so it is printed once.
		expect(error.message).toBe(
			'Revolt 401: The request requires user authentication.',
		);
	});

	it('reads a 404 and a 400', async () => {
		respond(fetchMock, NOT_FOUND, 404);
		const notFound = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'GET',
				path: '/channels/x',
				replayable: true,
			}),
		)) as RevoltAPIError;
		expect(notFound.isNotFound).toBe(true);

		respond(fetchMock, VALIDATION_ERROR, 400);
		const invalid = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'POST',
				path: '/channels/x/messages',
				body: { content: '' },
				replayable: false,
			}),
		)) as RevoltAPIError;
		expect(invalid.isValidationError).toBe(true);
		expect(invalid.message).toContain('cannot be empty');
	});

	it('reads the body retry_after on a 429', async () => {
		respond(fetchMock, RATE_LIMITED, 429);

		const error = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'GET',
				path: '/channels/x/messages',
				replayable: true,
			}),
		)) as RevoltAPIError;

		// The docs give this value in milliseconds, so it is used as-is.
		expect(error.retryAfter).toBe(1200);
		expect(error.isBlockedError).toBe(false);
	});

	it('reports a Blocked 429 separately from a rate limit', async () => {
		respond(fetchMock, BLOCKED, 429);

		const error = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'POST',
				path: '/channels/x/messages',
				body: { content: 'hi' },
				replayable: false,
			}),
		)) as RevoltAPIError;

		expect(error.status).toBe(429);
		expect(error.isBlockedError).toBe(true);
	});

	it('describes a body with no error key from the fallback', () => {
		expect(describeRevoltError(500, {}, 'Request failed')).toBe(
			'Revolt 500: Request failed',
		);
	});
});

describe('key hygiene', () => {
	it('does not leak the token through the error', async () => {
		respond(fetchMock, UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRevoltRequest('super-secret-token', 'bot', REVOLT_API_BASE, {
				method: 'GET',
				path: '/users/@me',
				replayable: true,
			}),
		)) as RevoltAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-token');
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'GET',
				path: '/users/@me',
				replayable: true,
			}),
		)) as RevoltAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
	});
});
