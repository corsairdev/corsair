import { ApiError } from 'corsair/http';
import {
	clearWacheteTokenCache,
	describeWacheteError,
	isWacheteFailure,
	login,
	makeWacheteRequest,
	parseWacheteKey,
	resolveWacheteToken,
	segment,
	WACHETE_API_BASE,
	WacheteAPIError,
} from './client';
import {
	invalidCredentials,
	invalidToken,
	loginResponse,
	missingAuth,
	notFound,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	PACKED_KEY,
	respond,
	TOKEN,
	USER_ID,
} from './test-support';

describe('makeWacheteRequest', () => {
	const fetchMock = installFetchMock();

	beforeEach(() => {
		clearWacheteTokenCache();
	});

	it('sends a bare token as the bearer, with the lowercase scheme', async () => {
		respond(fetchMock, { id: 'abc' });

		await makeWacheteRequest(TOKEN, {
			method: 'GET',
			path: '/thirdparty/v1/task/abc',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.wachete.com');
		expect(sent.path).toBe('/thirdparty/v1/task/abc');
		expect(sent.headers['authorization']).toBe(`bearer ${TOKEN}`);
	});

	it('logs in first when the key is a packed userId/apiKey pair', async () => {
		respond(fetchMock, loginResponse);
		respond(fetchMock, { id: 'abc' });

		await makeWacheteRequest(PACKED_KEY, {
			method: 'GET',
			path: '/thirdparty/v1/task/abc',
		});

		// The first call is the login, the second is the actual request.
		expect(fetchMock).toHaveBeenCalledTimes(2);
		const [loginUrl, loginInit] = fetchMock.mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(loginUrl).toContain('/thirdparty/v1/user/apilogin');
		expect(JSON.parse(String(loginInit.body))).toEqual({
			userId: USER_ID,
			apiKey: API_KEY,
		});
		expect(lastRequest(fetchMock).headers['authorization']).toBe(
			`bearer ${TOKEN}`,
		);
	});

	it('reuses the token rather than logging in on every call', async () => {
		respond(fetchMock, loginResponse);
		respond(fetchMock, { id: 'one' });
		respond(fetchMock, { id: 'two' });

		await makeWacheteRequest(PACKED_KEY, {
			method: 'GET',
			path: '/thirdparty/v1/task/one',
		});
		await makeWacheteRequest(PACKED_KEY, {
			method: 'GET',
			path: '/thirdparty/v1/task/two',
		});

		// One login, then two requests.
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it('logs in again once the cached token has expired', async () => {
		let now = 0;
		const clock = () => now;

		respond(fetchMock, loginResponse);
		respond(fetchMock, loginResponse);

		await resolveWacheteToken(PACKED_KEY, clock);
		now = 3_600_001;
		await resolveWacheteToken(PACKED_KEY, clock);

		// Two logins, because the clock moved past the stated lifetime.
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(lastRequest(fetchMock).path).toBe('/thirdparty/v1/user/apilogin');
	});

	it('throws a WacheteAPIError carrying the code', async () => {
		respond(fetchMock, notFound, 404);

		const error = (await makeWacheteRequest(TOKEN, {
			method: 'GET',
			path: '/thirdparty/v1/task/abc',
		}).catch((thrown: unknown) => thrown)) as WacheteAPIError;

		expect(error).toBeInstanceOf(WacheteAPIError);
		expect(error.status).toBe(404);
		expect(error.code).toBe('NotFound');
		expect(error.message).toBe('Wachete 404 NotFound: Task not found');
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeWacheteRequest(TOKEN, {
			method: 'PUT',
			path: '/thirdparty/v1/task',
		}).catch((thrown: unknown) => thrown)) as WacheteAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('PUT');
	});

	it('keeps a path segment encoded', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});

describe('parseWacheteKey', () => {
	it('splits a packed userId/apiKey pair', () => {
		expect(parseWacheteKey(PACKED_KEY)).toEqual({
			userId: USER_ID,
			apiKey: API_KEY,
		});
	});

	it('treats a bare token as a token, not a pair', () => {
		expect(parseWacheteKey(TOKEN)).toBeUndefined();
	});

	it('rejects a pair with an empty half', () => {
		expect(parseWacheteKey(`${USER_ID}\n`)).toBeUndefined();
		expect(parseWacheteKey(`\n${API_KEY}`)).toBeUndefined();
	});

	it('rejects more than one newline, which would be a malformed key', () => {
		expect(parseWacheteKey(`${USER_ID}\n${API_KEY}\nextra`)).toBeUndefined();
	});

	it('trims whitespace around each half', () => {
		expect(parseWacheteKey(` ${USER_ID} \n ${API_KEY} `)).toEqual({
			userId: USER_ID,
			apiKey: API_KEY,
		});
	});
});

describe('login', () => {
	const fetchMock = installFetchMock();

	it('exchanges the pair for a token', async () => {
		respond(fetchMock, loginResponse);

		const result = await login(USER_ID, API_KEY);

		expect(result).toEqual({ token: TOKEN, expiresInSec: 3600 });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/thirdparty/v1/user/apilogin');
		expect(sent.body).toEqual({ userId: USER_ID, apiKey: API_KEY });
	});

	it('raises when bad credentials are refused', async () => {
		respond(fetchMock, invalidCredentials, 401);

		const error = (await login(USER_ID, 'bad').catch(
			(thrown: unknown) => thrown,
		)) as WacheteAPIError;

		expect(error).toBeInstanceOf(WacheteAPIError);
		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
	});

	it('raises when the answer holds no token', async () => {
		respond(fetchMock, { expiresInSec: 3600 });

		await expect(login(USER_ID, API_KEY)).rejects.toThrow('returned no token');
	});
});

describe('WacheteAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new WacheteAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it.each([
		['a missing header', missingAuth],
		['a bad token', invalidToken],
		['bad credentials', invalidCredentials],
	])('treats %s as an auth error', (_label, body) => {
		expect(new WacheteAPIError('x', { body }).isAuthError).toBe(true);
	});

	it('recognises an expired token from its message', () => {
		const error = new WacheteAPIError('x', {
			status: 401,
			body: invalidToken,
		});
		expect(error.isTokenExpired).toBe(true);
	});

	it('does not call a missing header an expired token', () => {
		const error = new WacheteAPIError('x', {
			status: 401,
			body: missingAuth,
		});
		expect(error.isTokenExpired).toBe(false);
	});

	it('is not an auth error for a 404', () => {
		const error = new WacheteAPIError('x', { status: 404, body: notFound });
		expect(error.isAuthError).toBe(false);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/thirdparty/v1/task/abc' },
			{
				url: 'https://api.wachete.com/thirdparty/v1/task/abc',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: notFound,
			},
			'Not Found',
		);
		const error = new WacheteAPIError('wrapped', { cause });
		expect(error.status).toBe(404);
		expect(error.code).toBe('NotFound');
	});
});

describe('describeWacheteError', () => {
	it('labels the status and code', () => {
		expect(describeWacheteError(401, invalidToken, 'fallback')).toBe(
			'Wachete 401 Unauthorized: Invalid token',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(describeWacheteError(502, '<html>bad</html>', 'Bad gateway')).toBe(
			'Wachete 502: Bad gateway',
		);
	});

	it('drops the label when there is neither status nor code', () => {
		expect(describeWacheteError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported base', () => {
	it('is the documented host', () => {
		expect(WACHETE_API_BASE).toBe('https://api.wachete.com');
	});
});

describe('isWacheteFailure', () => {
	it('narrows a thrown error', () => {
		expect(isWacheteFailure(new WacheteAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isWacheteFailure(new Error('other'))).toBe(false);
		expect(isWacheteFailure('nope')).toBe(false);
	});
});
