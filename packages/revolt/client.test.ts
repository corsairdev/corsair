import {
	describeRevoltError,
	makeRevoltRequest,
	REVOLT_API_BASE,
	REVOLT_TOKEN_HEADERS,
	RevoltAPIError,
} from './client';
import {
	MISSING_PERMISSION,
	NOT_FOUND,
	RATE_LIMITED,
	UNAUTHORIZED,
	UNPROCESSABLE,
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

describe('the error body', () => {
	it('reads the live 401 envelope', async () => {
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
		// The envelope's code repeats the status, so it is printed once.
		expect(error.message).toBe(
			'Revolt 401: The request requires user authentication.',
		);
	});

	it('reads the live 422 envelope for a body Rocket cannot parse', async () => {
		respond(fetchMock, UNPROCESSABLE, 422);

		const error = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'POST',
				path: '/channels/x/messages',
				body: { content: 'x', replies: [{ id: 'y' }] },
				replayable: false,
			}),
		)) as RevoltAPIError;

		expect(error.isValidationError).toBe(true);
		expect(error.message).toMatch(/^Revolt 422: The request was well-formed/);
	});

	it('names the error type and the missing permission', async () => {
		respond(fetchMock, MISSING_PERMISSION, 403);

		const error = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'PATCH',
				path: '/channels/x',
				body: { name: 'y' },
				replayable: false,
			}),
		)) as RevoltAPIError;

		expect(error.reason).toBe('MissingPermission');
		expect(error.isAuthError).toBe(true);
		// The source location is not repeated in the message.
		expect(error.message).toBe(
			'Revolt 403: MissingPermission (permission: ManageChannel)',
		);
	});

	it('reads a 404 and a 422', async () => {
		respond(fetchMock, NOT_FOUND, 404);
		const notFound = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'GET',
				path: '/channels/x',
				replayable: true,
			}),
		)) as RevoltAPIError;
		expect(notFound.isNotFound).toBe(true);
		expect(notFound.message).toBe('Revolt 404: NotFound');

		respond(fetchMock, VALIDATION_ERROR, 422);
		const invalid = (await captureError(
			makeRevoltRequest('key', 'bot', REVOLT_API_BASE, {
				method: 'POST',
				path: '/channels/x/messages',
				body: {},
				replayable: false,
			}),
		)) as RevoltAPIError;
		expect(invalid.isValidationError).toBe(true);
		expect(invalid.message).toBe('Revolt 422: EmptyMessage');
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

		// Revolt sends this in milliseconds, so it is used as-is.
		expect(error.retryAfter).toBe(1200);
		expect(error.message).toMatch(/^Revolt 429: /);
	});

	it('describes a body with no type from the fallback', () => {
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

	it('fails captureError when the operation resolves', async () => {
		// The helper must not hand its own "resolved" error back as a rejection,
		// or a test that expects a 401 passes when the request succeeds.
		await expect(captureError(Promise.resolve('ok'))).rejects.toThrow(
			'the operation resolved',
		);
	});
});
