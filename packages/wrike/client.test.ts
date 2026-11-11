import { ApiError } from 'corsair/http';
import {
	describeWrikeError,
	id,
	isWrikeFailure,
	makeWrikeRequest,
	segment,
	WRIKE_API_BASE,
	WRIKE_HOSTS,
	WrikeAPIError,
} from './client';
import {
	badParameter,
	forbidden,
	invalidToken,
	missingToken,
	notFound,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeWrikeRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the token as a lowercase bearer against www', async () => {
		respond(fetchMock, { kind: 'tasks', data: [] });

		await makeWrikeRequest(API_KEY, { method: 'GET', path: '/tasks' });

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://www.wrike.com');
		expect(sent.path).toBe('/api/v4/tasks');
		// Wrike writes the scheme lowercase in its own docs.
		expect(sent.headers['authorization']).toBe(`bearer ${API_KEY}`);
	});

	it('uses the host it is given, since an account lives on one', async () => {
		respond(fetchMock, {});

		await makeWrikeRequest(
			API_KEY,
			{ method: 'GET', path: '/tasks' },
			`${WRIKE_HOSTS.eu}/api/v4`,
		);

		expect(lastRequest(fetchMock).origin).toBe('https://app-eu.wrike.com');
	});

	it('serializes a POST body as JSON', async () => {
		respond(fetchMock, {});

		await makeWrikeRequest(API_KEY, {
			method: 'POST',
			path: '/folders/IEA1/tasks',
			body: { title: 'Ship it' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ title: 'Ship it' });
	});

	it('keeps a path segment encoded, which a prefixed id needs', () => {
		expect(segment('IEAA/1')).toBe('IEAA%2F1');
		expect(id('IEAAABCDEF12345')).toBe('IEAAABCDEF12345');
	});

	it('throws a WrikeAPIError carrying the code and description', async () => {
		respond(fetchMock, invalidToken, 401);

		const error = (await makeWrikeRequest(API_KEY, {
			method: 'GET',
			path: '/tasks',
		}).catch((thrown: unknown) => thrown)) as WrikeAPIError;

		expect(error).toBeInstanceOf(WrikeAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('not_authorized');
		expect(error.description).toBe('Access token is unknown or invalid');
		expect(error.message).toBe(
			'Wrike 401 not_authorized: Access token is unknown or invalid',
		);
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeWrikeRequest(API_KEY, {
			method: 'POST',
			path: '/folders/IEA1/tasks',
		}).catch((thrown: unknown) => thrown)) as WrikeAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});
});

describe('WrikeAPIError', () => {
	it('tells a missing token from an invalid one, both 401', () => {
		const missing = new WrikeAPIError('x', {
			status: 401,
			body: missingToken,
		});
		const invalid = new WrikeAPIError('x', {
			status: 401,
			body: invalidToken,
		});

		expect(missing.isMissingToken).toBe(true);
		expect(missing.isInvalidToken).toBe(false);

		expect(invalid.isInvalidToken).toBe(true);
		expect(invalid.isMissingToken).toBe(false);
	});

	it('treats either as an auth error', () => {
		expect(new WrikeAPIError('x', { body: missingToken }).isAuthError).toBe(
			true,
		);
		expect(new WrikeAPIError('x', { body: invalidToken }).isAuthError).toBe(
			true,
		);
		expect(new WrikeAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it('treats a 403 and access_denied as forbidden', () => {
		const byStatus = new WrikeAPIError('x', { status: 403 });
		const byCode = new WrikeAPIError('x', { body: forbidden });
		expect(byStatus.isForbidden).toBe(true);
		expect(byCode.isForbidden).toBe(true);
	});

	it('is not an auth error for a validation failure', () => {
		const error = new WrikeAPIError('x', { status: 400, body: badParameter });
		expect(error.isAuthError).toBe(false);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/api/v4/tasks/IEAA1' },
			{
				url: 'https://www.wrike.com/api/v4/tasks/IEAA1',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: notFound,
			},
			'Not Found',
		);
		const error = new WrikeAPIError('wrapped', { cause });
		expect(error.status).toBe(404);
		expect(error.code).toBe('not_found');
		expect(error.description).toBe('Task not found');
	});
});

describe('describeWrikeError', () => {
	it('prefers the description over the code', () => {
		expect(describeWrikeError(401, invalidToken, 'fallback')).toBe(
			'Wrike 401 not_authorized: Access token is unknown or invalid',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(describeWrikeError(502, '<html>bad</html>', 'Bad gateway')).toBe(
			'Wrike 502: Bad gateway',
		);
	});

	it('drops the label when there is no status', () => {
		expect(describeWrikeError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the regional hosts', () => {
	it('has all three documented hosts', () => {
		expect(WRIKE_HOSTS.www).toBe('https://www.wrike.com');
		expect(WRIKE_HOSTS.eu).toBe('https://app-eu.wrike.com');
		expect(WRIKE_HOSTS.us2).toBe('https://app-us2.wrike.com');
	});

	it('exposes the www v4 base', () => {
		expect(WRIKE_API_BASE).toBe('https://www.wrike.com/api/v4');
	});
});

describe('isWrikeFailure', () => {
	it('narrows a thrown error', () => {
		expect(isWrikeFailure(new WrikeAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isWrikeFailure(new Error('other'))).toBe(false);
		expect(isWrikeFailure(null)).toBe(false);
	});
});
