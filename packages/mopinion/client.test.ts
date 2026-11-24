import { ApiError } from 'corsair/http';
import {
	MOPINION_API_VERSION,
	makeMopinionRequest,
	mopinionAuthToken,
	mopinionErrorCode,
	splitCredentials,
} from './client';
import { invalidCredentialsProblem, serverProblem } from './test-fixtures';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, { status, headers: { 'Content-Type': contentType } }),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url: new URL(url), headers: new Headers(init.headers) };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('mopinionAuthToken', () => {
	// The worked example from https://developer.mopinion.com/api/ (Authentication):
	// public key 123abc, signature token $1gn47ur3T0k3n, POST /reports with
	// that exact JSON body.
	it('reproduces the docs worked example byte for byte', () => {
		const token = mopinionAuthToken(
			'123abc',
			'$1gn47ur3T0k3n',
			'/reports',
			'{"name":"My new report","language":"en"}',
		);
		expect(token).toBe(
			'MTIzYWJjOjhkMGQ2OTNmMzRjNThjNjBmYzQ2Y2YzYTcyNTY0MmRjNWE0MzU5NGJjYzhiZTI1MzdlODFjOTA0ZWU0ZGMyYzE=',
		);
	});

	it('signs an empty body for GET requests', () => {
		const token = mopinionAuthToken('pk', 'st', '/account', '');
		const decoded = Buffer.from(token, 'base64').toString('utf-8');
		expect(decoded).toMatch(/^pk:[0-9a-f]{64}$/);
	});
});

describe('splitCredentials', () => {
	it('splits on the first colon so a colon in the token survives', () => {
		expect(splitCredentials('pub:tok:en')).toEqual({
			publicKey: 'pub',
			signatureToken: 'tok:en',
		});
	});

	it.each(['', 'nocolon', ':token', 'pub:'])(
		'treats %p as missing credentials',
		(key) => {
			expect(() => splitCredentials(key)).toThrow(/mopinion/i);
		},
	);
});

describe('makeMopinionRequest', () => {
	it('signs the path without the query, pins 2.5 and keeps the query', async () => {
		respond({ data: [], _meta: { code: 200 } });
		await makeMopinionRequest(
			{ key: 'pub-1:sig-1' },
			{ method: 'GET', path: '/reports/7/feedback', query: { limit: 5 } },
		);
		const { url, headers } = lastRequest();
		expect(url.origin).toBe('https://api.mopinion.com');
		expect(url.pathname).toBe('/reports/7/feedback');
		expect(url.searchParams.get('limit')).toBe('5');
		expect(headers.get('version')).toBe(MOPINION_API_VERSION);
		expect(MOPINION_API_VERSION).toBe('2.5.0');
		expect(headers.get('x-auth-token')).toBe(
			mopinionAuthToken('pub-1', 'sig-1', '/reports/7/feedback', ''),
		);
	});

	it('throws a core ApiError with the problem title and no request headers', async () => {
		respond(invalidCredentialsProblem, 401, 'application/problem+json');
		const error = (await makeMopinionRequest(
			{ key: 'pub-1:sig-1' },
			{ method: 'GET', path: '/account', query: { 'filter[tags]': 'vip' } },
		).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(error.message).toBe(
			'Mopinion 401 18: The credentials you provided are not valid',
		);
		expect(mopinionErrorCode(error)).toBe(18);
		expect(error.request.headers).toBeUndefined();
		expect(JSON.stringify(error.request)).not.toContain('vip');
		expect(error.url).toBe('https://api.mopinion.com/account?[REDACTED]');
	});

	it('keeps the problem fields but drops the details text on a 500', async () => {
		respond(serverProblem, 500, 'application/problem+json');
		const error = (await makeMopinionRequest(
			{ key: 'pub-1:sig-1' },
			{ method: 'GET', path: '/deployments' },
		).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(500);
		expect(error.message).toBe('Mopinion 500 2: Server error');
		expect(error.body).toEqual({
			status: 500,
			error_code: 2,
			title: 'Server error',
			type: serverProblem.type,
		});
	});

	it('survives a gateway error page that is not JSON', async () => {
		respond('<html>Bad gateway</html>', 502, 'text/html');
		const error = (await makeMopinionRequest(
			{ key: 'pub-1:sig-1' },
			{ method: 'GET', path: '/account' },
		).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(502);
		expect(error.message).toMatch(/^Mopinion 502: /);
		expect(error.body).toEqual({});
	});
});
