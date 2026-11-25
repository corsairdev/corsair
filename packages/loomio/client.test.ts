import { inspect } from 'node:util';
import {
	describeLoomioError,
	LoomioAPIError,
	makeLoomioRequest,
	readLoomioErrorDetail,
	segment,
} from './client';
import {
	BAD_KEY_BODY,
	NOT_FOUND_BODY,
	UNKNOWN_ROUTE_BODY,
	VALIDATION_BODY,
} from './test-fixtures';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<LoomioAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(LoomioAPIError);
	if (!(error instanceof LoomioAPIError)) throw error;
	return error;
}

function sentRequest() {
	const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeLoomioRequest', () => {
	it('sends the key as a Bearer header under /api/user0 and never in the URL', async () => {
		respond({ ok: true });

		await makeLoomioRequest('loomio-secret-key', {
			method: 'GET',
			path: '/groups',
		});

		const sent = sentRequest();
		expect(sent.url).toBe('https://www.loomio.com/api/user0/groups');
		expect(sent.init.method).toBe('GET');
		expect(sent.headers.get('authorization')).toBe('Bearer loomio-secret-key');
		expect(sent.headers.get('accept')).toBe('application/json');
		expect(sent.url).not.toContain('loomio-secret-key');
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('sends no Authorization header when the key is empty', async () => {
		respond({ ok: true });

		await makeLoomioRequest('', { method: 'GET', path: '/groups' });

		expect(sentRequest().headers.get('authorization')).toBeNull();
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ ok: true });

		await makeLoomioRequest('loomio-secret-key', {
			method: 'POST',
			path: '/comments',
			body: { discussion_id: 55, body: 'hello' },
		});

		const sent = sentRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(sent.init.body))).toEqual({
			discussion_id: 55,
			body: 'hello',
		});
	});

	it('keeps the error body out of the thrown error and its message', async () => {
		respond(BAD_KEY_BODY, 403);

		const error = await failure(
			makeLoomioRequest('loomio-secret-key', {
				method: 'GET',
				path: '/groups',
			}),
		);

		expect(error.status).toBe(403);
		expect(error.detail).toBe(BAD_KEY_BODY.error);
		expect(error.method).toBe('GET');
		expect(error.isAuthError).toBe(true);
		expect(error.replaySafe).toBe(true);
		const printed = `${error.message} ${JSON.stringify(error)} ${inspect(error)}`;
		expect(printed).not.toContain('loomio-secret-key');
	});

	it('marks a 403 on a resource-scoped call as both readings at once', async () => {
		respond(BAD_KEY_BODY, 403);

		const error = await failure(
			makeLoomioRequest('loomio-secret-key', {
				method: 'GET',
				path: '/groups/999999',
				resourceScoped: true,
			}),
		);

		expect(error.resourceScoped).toBe(true);
		expect(error.isAuthError).toBe(false);
		expect(error.resourceNotFound).toBe(true);
		expect(error.message).toContain('permission');
	});

	it('reads the bare-number 404 body as HTTP 404', async () => {
		respond(NOT_FOUND_BODY, 404);

		const error = await failure(
			makeLoomioRequest('k', {
				method: 'GET',
				path: '/polls/1',
				resourceScoped: true,
			}),
		);

		expect(error.status).toBe(404);
		expect(error.detail).toBe('HTTP 404');
		expect(error.resourceNotFound).toBe(true);
	});

	it('classifies an unrouted path by its status, not its body shape', async () => {
		respond(UNKNOWN_ROUTE_BODY, 404);

		const error = await failure(
			makeLoomioRequest('k', { method: 'GET', path: '/nope' }),
		);

		expect(error.status).toBe(404);
		expect(error.detail).toBe('Not Found');
	});

	it('tags transport failures with the method and keeps the cause', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeLoomioRequest('k', { method: 'GET', path: '/groups' }),
		);

		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.replaySafe).toBe(true);
		expect(error.cause).toBeInstanceOf(TypeError);
	});
});

describe('readLoomioErrorDetail', () => {
	it('renders 422 field errors as field: messages', () => {
		expect(readLoomioErrorDetail(VALIDATION_BODY)).toBe(
			"title: can't be blank",
		);
	});

	it('returns undefined for a body with nothing readable', () => {
		expect(readLoomioErrorDetail(null)).toBeUndefined();
		expect(readLoomioErrorDetail({})).toBeUndefined();
		expect(readLoomioErrorDetail('gateway timeout')).toBeUndefined();
	});
});

describe('describeLoomioError', () => {
	it('uses the provider message with the status', () => {
		expect(describeLoomioError(403, BAD_KEY_BODY, false)).toBe(
			'Loomio 403: You are not authorized to access this page.',
		);
	});

	it('keeps both readings in the scoped-403 message', () => {
		const message = describeLoomioError(403, BAD_KEY_BODY, true);
		expect(message).toContain('permission');
		expect(message).toContain('may not exist');
	});

	it('falls back when the body says nothing', () => {
		expect(describeLoomioError(500, {}, false)).toBe(
			'Loomio request failed (500)',
		);
		expect(describeLoomioError(undefined, null, false)).toBe(
			'Loomio request failed',
		);
	});
});

describe('segment', () => {
	it('url-encodes keys and handles', () => {
		expect(segment('a b/c')).toBe('a%20b%2Fc');
		expect(segment(12)).toBe('12');
	});
});
