import { ApiError } from 'corsair/http';
import {
	describeWatiError,
	isWatiFailure,
	makeWatiRequest,
	segment,
	target,
	WATI_API_BASE,
	WATI_REGIONS,
	WatiAPIError,
} from './client';
import { resolveBase } from './endpoints/call';
import {
	badRequest,
	invalidApiKey,
	invalidToken,
	missingToken,
	rateLimited,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeWatiRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the token as a bearer against the global host', async () => {
		respond(fetchMock, { contact_list: [] });

		await makeWatiRequest(API_KEY, {
			method: 'GET',
			path: '/contacts',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://live-mt-server.wati.io');
		// V3: no tenant in the path.
		expect(sent.path).toBe('/api/ext/v3/contacts');
		expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
	});

	it('uses the given region host, since a token is bound to one', async () => {
		respond(fetchMock, {});

		await makeWatiRequest(
			API_KEY,
			{ method: 'GET', path: '/contacts' },
			`${WATI_REGIONS.eu}/api/ext/v3`,
		);

		expect(lastRequest(fetchMock).origin).toBe('https://eu-api.wati.io');
	});

	it('serializes a POST body as JSON', async () => {
		respond(fetchMock, {});

		await makeWatiRequest(API_KEY, {
			method: 'POST',
			path: '/contacts',
			body: { whatsapp_number: '123', name: 'John' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ whatsapp_number: '123', name: 'John' });
	});

	it('keeps a path segment encoded, which a leading + needs', () => {
		expect(segment('+1234567890')).toBe('%2B1234567890');
		expect(target('+1234567890')).toBe('%2B1234567890');
	});

	it('throws a WatiAPIError carrying the code and the body status', async () => {
		respond(fetchMock, invalidToken, 401);

		const error = (await makeWatiRequest(API_KEY, {
			method: 'GET',
			path: '/contacts',
			// unknown: a rejection can carry any value; the cast below narrows it.
		}).catch((thrown: unknown) => thrown)) as WatiAPIError;

		expect(error).toBeInstanceOf(WatiAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('invalid_token');
		// WATI repeats the status in the body; both are kept.
		expect(error.statusCode).toBe(401);
		expect(error.timestamp).toBe('2026-11-11T05:42:55.5588199Z');
		expect(error.message).toContain('WATI 401 invalid_token:');
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeWatiRequest(API_KEY, {
			method: 'POST',
			path: '/messages/template',
			// unknown: a rejection can carry any value; the cast below narrows it.
		}).catch((thrown: unknown) => thrown)) as WatiAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});

	it('does not retry a 429 itself, leaving that to the handler', async () => {
		respond(fetchMock, rateLimited, 429);

		await expect(
			makeWatiRequest(API_KEY, { method: 'GET', path: '/contacts' }),
		).rejects.toBeInstanceOf(WatiAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('WatiAPIError', () => {
	it('tells a missing token from an invalid one', () => {
		const missing = new WatiAPIError('x', {
			status: 401,
			body: missingToken,
		});
		const invalid = new WatiAPIError('x', {
			status: 401,
			body: invalidToken,
		});

		expect(missing.isMissingToken).toBe(true);
		expect(missing.isInvalidToken).toBe(false);

		expect(invalid.isInvalidToken).toBe(true);
		expect(invalid.isMissingToken).toBe(false);
	});

	it('reads invalid_api_key, the live answer for a key from another region, as an invalid token', () => {
		const error = new WatiAPIError('x', { status: 401, body: invalidApiKey });

		expect(error.isInvalidToken).toBe(true);
		expect(error.isMissingToken).toBe(false);
	});

	it('treats either token failure as an auth error', () => {
		expect(new WatiAPIError('x', { body: missingToken }).isAuthError).toBe(
			true,
		);
		expect(new WatiAPIError('x', { body: invalidToken }).isAuthError).toBe(
			true,
		);
	});

	it('treats a bare 401 as an auth error even without a body', () => {
		expect(new WatiAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it('is not an auth error for a 400', () => {
		const error = new WatiAPIError('x', { status: 400, body: badRequest });
		expect(error.isAuthError).toBe(false);
		expect(error.code).toBe('bad_request');
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/api/ext/v3/contacts' },
			{
				url: 'https://live-mt-server.wati.io/api/ext/v3/contacts',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: invalidToken,
			},
			'Unauthorized',
		);
		const error = new WatiAPIError('wrapped', { cause });
		expect(error.status).toBe(401);
		expect(error.code).toBe('invalid_token');
	});
});

describe('describeWatiError', () => {
	it('labels the status and code from the error field', () => {
		expect(describeWatiError(401, invalidToken, 'fallback')).toBe(
			'WATI 401 invalid_token: The bearer token is invalid, malformed, or has expired.',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(describeWatiError(502, '<html>bad</html>', 'Bad gateway')).toBe(
			'WATI 502: Bad gateway',
		);
	});

	it('drops the label when there is neither status nor code', () => {
		expect(describeWatiError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the regional hosts', () => {
	it('has all three documented regions', () => {
		expect(WATI_REGIONS.global).toBe('https://live-mt-server.wati.io');
		expect(WATI_REGIONS.eu).toBe('https://eu-api.wati.io');
		expect(WATI_REGIONS.ksa).toBe('https://ksa-api.wati.io');
	});

	it('exposes the global V3 base', () => {
		expect(WATI_API_BASE).toBe('https://live-mt-server.wati.io/api/ext/v3');
	});

	it('keeps the three hosts distinct, since a token cannot move between them', () => {
		const hosts = new Set(Object.values(WATI_REGIONS));
		expect(hosts.size).toBe(3);
	});
});

describe('resolveBase', () => {
	const ctx = (options: object) => ({ options }) as never;

	it('appends the V3 path to a dedicated host', () => {
		expect(resolveBase(ctx({ apiHost: 'acme.wati.io/' }))).toBe(
			'https://acme.wati.io/api/ext/v3',
		);
	});

	it('refuses a plain-http host, since the token is in a header', () => {
		expect(() => resolveBase(ctx({ apiHost: 'http://acme.wati.io' }))).toThrow(
			'https',
		);
	});

	it('uses the region host when no apiHost is set', () => {
		expect(resolveBase(ctx({ region: 'ksa' }))).toBe(
			'https://ksa-api.wati.io/api/ext/v3',
		);
	});
});

describe('isWatiFailure', () => {
	it('narrows a thrown error', () => {
		expect(isWatiFailure(new WatiAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isWatiFailure(new Error('other'))).toBe(false);
		expect(isWatiFailure(null)).toBe(false);
	});
});
