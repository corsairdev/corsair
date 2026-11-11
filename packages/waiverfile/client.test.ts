import { ApiError } from 'corsair/http';
import {
	describeWaiverFileError,
	isWaiverFileFailure,
	makeWaiverFileRequest,
	parseWaiverFileKey,
	requireWaiverFileKey,
	WAIVERFILE_API_BASE,
	WaiverFileAPIError,
	WaiverFileConfigurationError,
} from './client';
import {
	badRequest,
	invalidKey,
	missingCredential,
	routeNotFound,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	PACKED_KEY,
	respond,
	respondText,
	SITE_ID,
} from './test-support';

describe('makeWaiverFileRequest', () => {
	const fetchMock = installFetchMock();
	const credentials = { apiKey: API_KEY, siteID: SITE_ID };

	it('puts both credentials on the query string, with no auth header', async () => {
		respond(fetchMock, { Message: 'ok' });

		await makeWaiverFileRequest(credentials, {
			method: 'GET',
			path: '/api/v1/Ping',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.waiverfile.com');
		expect(sent.path).toBe('/api/v1/Ping');
		expect(sent.query.apiKey).toBe(API_KEY);
		expect(sent.query.siteID).toBe(SITE_ID);
		expect(sent.headers['authorization']).toBeUndefined();
	});

	it('merges the endpoint query with the credentials', async () => {
		respond(fetchMock, { Waivers: [] });

		await makeWaiverFileRequest(credentials, {
			method: 'GET',
			path: '/api/v1/GetWaiver',
			query: { waiverID: 'abc' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.waiverID).toBe('abc');
		expect(sent.query.apiKey).toBe(API_KEY);
		expect(sent.query.siteID).toBe(SITE_ID);
	});

	it('serializes a POST body as JSON', async () => {
		respond(fetchMock, { WaiverEventID: 'e1' });

		await makeWaiverFileRequest(credentials, {
			method: 'POST',
			path: '/api/v1/InsertEvent',
			body: { APIKey: API_KEY, SiteID: SITE_ID, EventName: 'Open jump' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toMatchObject({ EventName: 'Open jump' });
	});

	it('reads a PDF body as text rather than failing on it', async () => {
		respondText(fetchMock, '%PDF-1.4 fake bytes', 'application/pdf');

		const result = await makeWaiverFileRequest(credentials, {
			method: 'GET',
			path: '/api/v1/GetWaiverPDF',
			query: { waiverID: 'abc' },
		});

		expect(result).toBe('%PDF-1.4 fake bytes');
	});

	it('throws a WaiverFileAPIError carrying the status and message', async () => {
		respond(fetchMock, routeNotFound, 404);

		const error = (await makeWaiverFileRequest(credentials, {
			method: 'GET',
			path: '/api/v1/Nope',
		}).catch((thrown: unknown) => thrown)) as WaiverFileAPIError;

		expect(error).toBeInstanceOf(WaiverFileAPIError);
		expect(error.status).toBe(404);
		expect(error.isNotFound).toBe(true);
		expect(error.message).toContain('WaiverFile 404:');
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeWaiverFileRequest(credentials, {
			method: 'GET',
			path: '/api/v1/Ping',
		}).catch((thrown: unknown) => thrown)) as WaiverFileAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('GET');
	});
});

describe('parseWaiverFileKey', () => {
	it('splits a packed apiKey/siteID pair', () => {
		expect(parseWaiverFileKey(PACKED_KEY)).toEqual({
			apiKey: API_KEY,
			siteID: SITE_ID,
		});
	});

	it('rejects a bare key with no site', () => {
		expect(parseWaiverFileKey(API_KEY)).toBeUndefined();
	});

	it('rejects an empty half', () => {
		expect(parseWaiverFileKey(`${API_KEY}\n`)).toBeUndefined();
		expect(parseWaiverFileKey(`\n${SITE_ID}`)).toBeUndefined();
	});

	it('rejects more than one newline', () => {
		expect(parseWaiverFileKey(`${API_KEY}\n${SITE_ID}\nextra`)).toBeUndefined();
	});

	it('trims whitespace around each half', () => {
		expect(parseWaiverFileKey(` ${API_KEY} \n ${SITE_ID} `)).toEqual({
			apiKey: API_KEY,
			siteID: SITE_ID,
		});
	});
});

describe('requireWaiverFileKey', () => {
	it('returns the pair for a valid key', () => {
		expect(requireWaiverFileKey(PACKED_KEY)).toEqual({
			apiKey: API_KEY,
			siteID: SITE_ID,
		});
	});

	it('raises a configuration error before any request for a bare key', () => {
		expect(() => requireWaiverFileKey(API_KEY)).toThrow(
			WaiverFileConfigurationError,
		);
		expect(() => requireWaiverFileKey(API_KEY)).toThrow(
			'must hold the API key and the site ID',
		);
	});
});

describe('WaiverFileAPIError', () => {
	it('treats 401 and 403 as auth errors', () => {
		expect(new WaiverFileAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new WaiverFileAPIError('x', { status: 403 }).isAuthError).toBe(true);
	});

	it('treats the documented InvalidService message as an auth error, though it is a 400', () => {
		// A bad key answers 400, not 401 — the status alone reads like a
		// validation problem, so the message is what decides.
		const error = new WaiverFileAPIError('x', {
			status: 400,
			body: invalidKey,
		});
		expect(error.isAuthError).toBe(true);
	});

	it('treats a missing credential message as an auth error', () => {
		const error = new WaiverFileAPIError('x', {
			status: 400,
			body: missingCredential,
		});
		expect(error.isAuthError).toBe(true);
	});

	it('does not treat a genuine validation 400 as an auth error', () => {
		const error = new WaiverFileAPIError('x', {
			status: 400,
			body: badRequest,
		});
		expect(error.isAuthError).toBe(false);
	});

	it('treats 404 as not found', () => {
		expect(new WaiverFileAPIError('x', { status: 404 }).isNotFound).toBe(true);
	});

	it('reads the status from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/api/v1/Nope' },
			{
				url: 'https://api.waiverfile.com/api/v1/Nope',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: routeNotFound,
			},
			'Not Found',
		);
		const error = new WaiverFileAPIError('wrapped', { cause });
		expect(error.status).toBe(404);
	});
});

describe('describeWaiverFileError', () => {
	it('reads the capitalised Message field', () => {
		expect(describeWaiverFileError(404, routeNotFound, 'fallback')).toContain(
			'WaiverFile 404:',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(
			describeWaiverFileError(502, '<html>bad</html>', 'Bad gateway'),
		).toBe('WaiverFile 502: Bad gateway');
	});

	it('drops the label when there is no status', () => {
		expect(describeWaiverFileError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported base', () => {
	it('is the documented host', () => {
		expect(WAIVERFILE_API_BASE).toBe('https://api.waiverfile.com');
	});
});

describe('isWaiverFileFailure', () => {
	it('narrows a thrown error', () => {
		expect(isWaiverFileFailure(new WaiverFileAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isWaiverFileFailure(new Error('other'))).toBe(false);
		expect(isWaiverFileFailure(null)).toBe(false);
	});
});
