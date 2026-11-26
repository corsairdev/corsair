import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeLoomioError,
	makeLoomioRequest,
	normalizeLoomioBaseUrl,
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
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

function sentRequest() {
	const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

const KEY = { key: 'loomio-secret-key' };

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeLoomioRequest', () => {
	it('sends the key as a Bearer header under /api/user0 and never in the URL', async () => {
		respond({ ok: true });

		await makeLoomioRequest(KEY, { method: 'GET', path: '/groups' });

		const sent = sentRequest();
		expect(sent.url).toBe('https://www.loomio.com/api/user0/groups');
		expect(sent.init.method).toBe('GET');
		expect(sent.headers.get('authorization')).toBe('Bearer loomio-secret-key');
		expect(sent.headers.get('accept')).toBe('application/json');
		expect(sent.url).not.toContain('loomio-secret-key');
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('targets a self-hosted origin and the Server API prefix', async () => {
		respond({ users: [] });

		await makeLoomioRequest(
			{ key: 'server-key', baseUrl: 'https://loomio.example.org/' },
			{ api: 'server', method: 'GET', path: '/users' },
		);

		expect(sentRequest().url).toBe(
			'https://loomio.example.org/api/server0/users',
		);
	});

	it('refuses a base URL that is not an https origin before any request', async () => {
		for (const bad of [
			'http://loomio.example.org',
			'https://user:pw@loomio.example.org',
			'https://loomio.example.org/sub',
			'https://loomio.example.org?x=1',
			'not a url',
		]) {
			await expect(
				makeLoomioRequest(
					{ key: 'k', baseUrl: bad },
					{ method: 'GET', path: '/groups' },
				),
			).rejects.toThrow(/base_url/);
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends no Authorization header when the key is empty', async () => {
		respond({ ok: true });

		await makeLoomioRequest({ key: '' }, { method: 'GET', path: '/groups' });

		expect(sentRequest().headers.get('authorization')).toBeNull();
	});

	it('sends PATCH and DELETE with the right method', async () => {
		respond({ comments: [{ id: 1 }] });
		await makeLoomioRequest(KEY, {
			method: 'PATCH',
			path: '/comments/1',
			body: { body: 'x' },
		});
		expect(sentRequest().init.method).toBe('PATCH');
		fetchMock.mockClear();
		respond({ comments: [{ id: 1 }] });
		await makeLoomioRequest(KEY, { method: 'DELETE', path: '/comments/1' });
		expect(sentRequest().init.method).toBe('DELETE');
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ ok: true });

		await makeLoomioRequest(KEY, {
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

	it('throws core ApiError with the status and the provider message', async () => {
		respond(BAD_KEY_BODY, 403);

		const error = await failure(
			makeLoomioRequest(KEY, { method: 'GET', path: '/groups' }),
		);

		expect(error.status).toBe(403);
		expect(error.message).toBe(`Loomio 403: ${BAD_KEY_BODY.error}`);
		expect(error.body).toEqual({ error: BAD_KEY_BODY.error });
		const printed = `${error.message} ${JSON.stringify(error)} ${inspect(error)}`;
		expect(printed).not.toContain('loomio-secret-key');
	});

	it('strips the sent body (emails, content) from the error', async () => {
		respond(VALIDATION_BODY, 422);

		const error = await failure(
			makeLoomioRequest(KEY, {
				method: 'POST',
				path: '/memberships',
				body: { group_id: 1, emails: ['person@private.example'] },
			}),
		);

		expect(error.status).toBe(422);
		const printed = `${error.message} ${JSON.stringify(error)} ${inspect(error)}`;
		expect(printed).not.toContain('person@private.example');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
	});

	it('keeps only the error fields of a provider body', async () => {
		respond({ error: 'nope', echoed: 'person@private.example' }, 400);

		const error = await failure(
			makeLoomioRequest(KEY, { method: 'GET', path: '/search' }),
		);

		expect(JSON.stringify(error.body)).not.toContain('private.example');
	});

	it('says both readings on a 403 for a resource-scoped call', async () => {
		respond(BAD_KEY_BODY, 403);

		const error = await failure(
			makeLoomioRequest(KEY, {
				method: 'GET',
				path: '/groups/999999',
				resourceScoped: true,
			}),
		);

		expect(error.message).toContain('permission');
		expect(error.message).toContain('may not exist');
	});

	it('reads the bare-number 404 body as HTTP 404', async () => {
		respond(NOT_FOUND_BODY, 404);

		const error = await failure(
			makeLoomioRequest(KEY, { method: 'GET', path: '/polls/1' }),
		);

		expect(error.status).toBe(404);
		expect(error.message).toBe('Loomio 404: HTTP 404');
	});

	it('reads an unrouted path by its status', async () => {
		respond(UNKNOWN_ROUTE_BODY, 404);

		const error = await failure(
			makeLoomioRequest(KEY, { method: 'GET', path: '/nope' }),
		);

		expect(error.status).toBe(404);
		expect(error.message).toContain('Not Found');
	});

	it('keeps a malformed key out of a header-construction error', async () => {
		fetchMock.mockRestore();
		fetchMock = jest.spyOn(globalThis, 'fetch');
		const key = '\nloomio-pasted-key';

		const error = await makeLoomioRequest(
			{ key },
			{ method: 'GET', path: '/groups' },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('[REDACTED]');
		const printed = `${String(error)} ${inspect(error)}`;
		expect(printed).not.toContain('loomio-pasted-key');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lets transport failures through unchanged', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			makeLoomioRequest(KEY, { method: 'GET', path: '/groups' }),
		).rejects.toThrow(TypeError);
	});
});

describe('normalizeLoomioBaseUrl', () => {
	it('returns the origin of a valid https URL', () => {
		expect(normalizeLoomioBaseUrl(' https://loomio.example.org/ ')).toBe(
			'https://loomio.example.org',
		);
		expect(normalizeLoomioBaseUrl('http://localhost:3000')).toBe(
			'http://localhost:3000',
		);
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
