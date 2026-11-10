import {
	describeRoamError,
	makeRoamRequest,
	ROAM_API_BASE,
	ROAM_API_VERSION,
	RoamAPIError,
} from './client';
import {
	INVALID_TOKEN_TEXT,
	MISSING_SCOPE,
	NOT_AUTHED_TEXT,
	NOT_FOUND,
	TOKEN_REVOKED,
} from './test-fixtures';
import {
	captureError,
	lastRequest,
	respond,
	respondAsText,
	spyOnFetch,
} from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request construction', () => {
	it('sends the token as a bearer and pins the API version', async () => {
		respond(fetchMock, { ok: true });

		await makeRoamRequest('secret-token', {
			method: 'GET',
			path: '/token.info',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://api.ro.am');
		expect(request.path).toBe('/v1/token.info');
		expect(request.headers.get('authorization')).toBe('Bearer secret-token');
		// Without this header Roam renders the integration's pinned default,
		// which can change under the plugin.
		expect(request.headers.get('roam-version')).toBe(ROAM_API_VERSION);
		expect(ROAM_API_BASE).toBe('https://api.ro.am/v1');
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { ok: true });

		await makeRoamRequest('key', {
			method: 'POST',
			path: '/chat.post',
			body: { chatId: 'x', text: 'hi' },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({ chatId: 'x', text: 'hi' });
	});

	it('sends no body on a read', async () => {
		respond(fetchMock, {});

		await makeRoamRequest('key', {
			method: 'GET',
			path: '/chat.list',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.hasBody).toBe(false);
		expect(request.contentType).toBe('');
	});
});

describe('parsing a text/plain error body', () => {
	it('parses the JSON out of the string Roam labels text/plain', async () => {
		respondAsText(fetchMock, INVALID_TOKEN_TEXT, 401);

		const error = (await captureError(
			makeRoamRequest('bad', {
				method: 'GET',
				path: '/token.info',
				replayable: true,
			}),
		)) as RoamAPIError;

		// The whole point: without the parse every field would be undefined and
		// the message would be one unreadable string.
		expect(error).toBeInstanceOf(RoamAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('invalid_token');
		expect(error.requestId).toBe('523b4f75-76eb-48a3-9daf-879a26756377');
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe(
			'Roam 401 invalid_token: Could not process OAuth access token',
		);
	});

	it('reads a not_authed body the same way', async () => {
		respondAsText(fetchMock, NOT_AUTHED_TEXT, 401);

		const error = (await captureError(
			makeRoamRequest('', {
				method: 'GET',
				path: '/token.info',
				replayable: true,
			}),
		)) as RoamAPIError;

		expect(error.code).toBe('not_authed');
		expect(error.isAuthError).toBe(true);
		expect(error.message).toContain('Could not find bearer token');
	});

	it('also reads a body that arrives already parsed', async () => {
		respond(fetchMock, NOT_FOUND, 404);

		const error = (await captureError(
			makeRoamRequest('key', {
				method: 'GET',
				path: '/nope.nope',
				replayable: true,
			}),
		)) as RoamAPIError;

		expect(error.code).toBe('not_found');
		expect(error.isNotFound).toBe(true);
	});

	it('falls back without inventing a code when the body is not JSON', async () => {
		respondAsText(fetchMock, '<html>Bad gateway</html>', 502);

		const error = (await captureError(
			makeRoamRequest('key', {
				method: 'GET',
				path: '/token.info',
				replayable: true,
			}),
		)) as RoamAPIError;

		expect(error.status).toBe(502);
		expect(error.code).toBeUndefined();
		expect(error.message).toContain('Roam 502');
		expect(error.message).not.toContain('<html>');
	});
});

describe('missing_scope', () => {
	it('reads the needed and provided scopes', async () => {
		respond(fetchMock, MISSING_SCOPE, 403);

		const error = (await captureError(
			makeRoamRequest('key', {
				method: 'POST',
				path: '/chat.post',
				body: { chatId: 'x', text: 'hi' },
				replayable: false,
			}),
		)) as RoamAPIError;

		expect(error.code).toBe('missing_scope');
		expect(error.needed).toEqual(['chat:send_message', 'chat:write']);
		expect(error.provided).toEqual(['chat:read', 'chat:history']);
		// A scope failure is a permission problem, not a dead token.
		expect(error.isPermissionError).toBe(true);
		expect(error.isAuthError).toBe(false);
		// The message names what would fix it.
		expect(error.message).toContain('chat:send_message');
	});

	it('reports a revoked token as auth, distinct from missing_scope', () => {
		const error = new RoamAPIError('revoked', {
			status: 401,
			code: TOKEN_REVOKED.error,
		});

		expect(error.isAuthError).toBe(true);
		expect(error.isPermissionError).toBe(false);
	});
});

describe('key hygiene', () => {
	it('does not leak the token through the error', async () => {
		respondAsText(fetchMock, INVALID_TOKEN_TEXT, 401);

		const error = (await captureError(
			makeRoamRequest('super-secret-token', {
				method: 'GET',
				path: '/token.info',
				replayable: true,
			}),
		)) as RoamAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-token');
		expect(require('node:util').inspect(error)).not.toContain(
			'super-secret-token',
		);
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRoamRequest('key', {
				method: 'GET',
				path: '/token.info',
				replayable: true,
			}),
		)) as RoamAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
	});
});

describe('message building', () => {
	it('describes a body with no message from the fallback', () => {
		expect(describeRoamError(500, {}, 'Request failed')).toBe(
			'Roam 500: Request failed',
		);
		expect(describeRoamError(undefined, {}, 'Oops')).toBe('Oops');
	});

	it('names the needed scopes when the body carries them', () => {
		const message = describeRoamError(403, MISSING_SCOPE, 'fallback');

		expect(message).toContain('Roam 403 missing_scope');
		expect(message).toContain('needs one of: chat:send_message, chat:write');
	});
});
