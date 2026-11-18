import { ApiError } from 'corsair/http';
import {
	describeVirustotalError,
	isVirustotalFailure,
	makeVirustotalRequest,
	segment,
	urlId,
	VIRUSTOTAL_API_BASE,
	VIRUSTOTAL_API_KEY_HEADER,
	VirustotalAPIError,
} from './client';
import {
	invalidKey,
	missingKey,
	notAvailableYet,
	notFound,
	quotaExceeded,
	tooManyRequests,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeVirustotalRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the key in x-apikey, never as a bearer token', async () => {
		respond(fetchMock, { data: {} });

		await makeVirustotalRequest(API_KEY, {
			method: 'GET',
			path: '/files/abc',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://www.virustotal.com');
		expect(sent.path).toBe('/api/v3/files/abc');
		expect(sent.headers['x-apikey']).toBe(API_KEY);
		expect(sent.headers['authorization']).toBeUndefined();
	});

	it('sends a form body for the URL scan, not JSON', async () => {
		respond(fetchMock, { data: { type: 'analysis', id: 'x' } });

		await makeVirustotalRequest(API_KEY, {
			method: 'POST',
			path: '/urls',
			body: 'url=https%3A%2F%2Facme.example',
			mediaType: 'application/x-www-form-urlencoded',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain(
			'application/x-www-form-urlencoded',
		);
		expect(sent.rawBody).toBe('url=https%3A%2F%2Facme.example');
	});

	it('defaults the media type to JSON', async () => {
		respond(fetchMock, { data: {} });

		await makeVirustotalRequest(API_KEY, {
			method: 'POST',
			path: '/files/abc/analyse',
			body: {},
		});

		expect(lastRequest(fetchMock).headers['content-type']).toContain(
			'application/json',
		);
	});

	it('keeps a path segment encoded, since a domain is a path value', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});

	it('throws a VirustotalAPIError carrying the status and code', async () => {
		respond(fetchMock, notFound, 404);

		const error = (await makeVirustotalRequest(API_KEY, {
			method: 'GET',
			path: '/files/abc',
			// unknown: a promise can reject with any value; the cast on the next line
			// narrows it to the plugin's error type.
		}).catch((thrown: unknown) => thrown)) as VirustotalAPIError;

		expect(error).toBeInstanceOf(VirustotalAPIError);
		expect(error.status).toBe(404);
		expect(error.code).toBe('NotFoundError');
		expect(error.message).toBe(
			'VirusTotal 404 NotFoundError: Resource not found.',
		);
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeVirustotalRequest(API_KEY, {
			method: 'GET',
			path: '/files/abc',
			// unknown: a promise can reject with any value; the cast on the next line
			// narrows it to the plugin's error type.
		}).catch((thrown: unknown) => thrown)) as VirustotalAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('GET');
	});

	it('does not retry a 429 itself, leaving that to the handler', async () => {
		respond(fetchMock, tooManyRequests, 429);

		await expect(
			makeVirustotalRequest(API_KEY, { method: 'GET', path: '/files/abc' }),
		).rejects.toBeInstanceOf(VirustotalAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('urlId', () => {
	it('encodes a URL as unpadded base64url', () => {
		// The docs' own example shape: base64url without "=" padding.
		expect(urlId('https://acme.example/login')).toBe(
			'aHR0cHM6Ly9hY21lLmV4YW1wbGUvbG9naW4',
		);
	});

	it('produces the documented value for a docs example', () => {
		// From the VirusTotal docs: this URL encodes to this identifier.
		expect(urlId('http://www.somedomain.com/this/is/my/url')).toBe(
			'aHR0cDovL3d3dy5zb21lZG9tYWluLmNvbS90aGlzL2lzL215L3VybA',
		);
	});

	it('never pads with =', () => {
		const encoded = urlId('https://a.example/');
		expect(encoded).not.toContain('=');
	});

	it('uses - and _ rather than + and /', () => {
		// A URL with bytes that land on 62 and 63 in the base64 alphabet.
		const encoded = urlId('https://acme.example/???>>>');
		expect(encoded).not.toContain('+');
		expect(encoded).not.toContain('/');
	});

	it('round-trips through base64url', () => {
		const original = 'https://acme.example/path?a=1&b=2';
		const encoded = urlId(original);
		const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
		expect(Buffer.from(padded, 'base64').toString('utf8')).toBe(original);
	});
});

describe('VirustotalAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new VirustotalAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it.each([
		['missingKey', missingKey],
		['invalidKey', invalidKey],
	])('treats the %s code as an auth error', (_name, body) => {
		expect(new VirustotalAPIError('x', { body }).isAuthError).toBe(true);
	});

	it('tells a spent quota from a rate limit, both of which are 429', () => {
		const quota = new VirustotalAPIError('x', {
			status: 429,
			body: quotaExceeded,
		});
		const burst = new VirustotalAPIError('x', {
			status: 429,
			body: tooManyRequests,
		});

		expect(quota.isQuotaExceeded).toBe(true);
		expect(quota.isRateLimited).toBe(false);

		expect(burst.isRateLimited).toBe(true);
		expect(burst.isQuotaExceeded).toBe(false);
	});

	it('treats NotAvailableYet as its own case, distinct from not found', () => {
		const error = new VirustotalAPIError('x', {
			status: 400,
			body: notAvailableYet,
		});
		expect(error.isNotAvailableYet).toBe(true);
		expect(error.isNotFound).toBe(false);
	});

	it('treats 404 and NotFoundError as not found', () => {
		expect(new VirustotalAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new VirustotalAPIError('x', { body: notFound }).isNotFound).toBe(
			true,
		);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/files/abc' },
			{
				url: 'https://www.virustotal.com/api/v3/files/abc',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: invalidKey,
			},
			'Unauthorized',
		);
		const error = new VirustotalAPIError('wrapped', { cause });
		expect(error.status).toBe(401);
		expect(error.code).toBe('WrongCredentialsError');
	});
});

describe('describeVirustotalError', () => {
	it('labels the status and code', () => {
		expect(describeVirustotalError(404, notFound, 'fallback')).toBe(
			'VirusTotal 404 NotFoundError: Resource not found.',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(
			describeVirustotalError(502, '<html>bad</html>', 'Bad gateway'),
		).toBe('VirusTotal 502: Bad gateway');
	});

	it('drops the label when there is neither status nor code', () => {
		expect(describeVirustotalError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported constants', () => {
	it('uses the v3 base', () => {
		expect(VIRUSTOTAL_API_BASE).toBe('https://www.virustotal.com/api/v3');
	});

	it('names the header the key goes in', () => {
		expect(VIRUSTOTAL_API_KEY_HEADER).toBe('x-apikey');
	});
});

describe('isVirustotalFailure', () => {
	it('narrows a thrown error', () => {
		expect(isVirustotalFailure(new VirustotalAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isVirustotalFailure(new Error('other'))).toBe(false);
		expect(isVirustotalFailure(null)).toBe(false);
	});
});
