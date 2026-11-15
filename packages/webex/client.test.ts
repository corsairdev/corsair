import { ApiError } from 'corsair/http';
import {
	describeWebexError,
	isWebexFailure,
	makeWebexRequest,
	nextPageFromLink,
	segment,
	WEBEX_API_BASE,
	WebexAPIError,
} from './client';
import { badRequest, forbidden, notFound, unauthorized } from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeWebexRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the token as a bearer against v1', async () => {
		respond(fetchMock, { items: [] });

		await makeWebexRequest(API_KEY, { method: 'GET', path: '/rooms' });

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://webexapis.com');
		expect(sent.path).toBe('/v1/rooms');
		expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
		expect(sent.headers['accept']).toBe('application/json');
	});

	it('serializes a POST body as JSON', async () => {
		respond(fetchMock, {});

		await makeWebexRequest(API_KEY, {
			method: 'POST',
			path: '/messages',
			body: { roomId: 'r1', text: 'hi' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ roomId: 'r1', text: 'hi' });
	});

	it('keeps a path segment encoded', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});

	it('throws a WebexAPIError carrying the trackingId', async () => {
		respond(fetchMock, unauthorized, 401);

		const error = (await makeWebexRequest(API_KEY, {
			method: 'GET',
			path: '/rooms',
		}).catch((thrown: unknown) => thrown)) as WebexAPIError;

		expect(error).toBeInstanceOf(WebexAPIError);
		expect(error.status).toBe(401);
		// Cisco support asks for this, so it survives on the error.
		expect(error.trackingId).toBe(
			'ROUTERGW_adef69b1-7ab9-4498-9a11-111111111111',
		);
		expect(error.message).toContain('trackingId');
	});

	it('keeps the per-field error descriptions', async () => {
		respond(fetchMock, badRequest, 400);

		const error = (await makeWebexRequest(API_KEY, {
			method: 'POST',
			path: '/messages',
		}).catch((thrown: unknown) => thrown)) as WebexAPIError;

		expect(error.errors).toEqual(['roomId is required']);
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeWebexRequest(API_KEY, {
			method: 'POST',
			path: '/messages',
		}).catch((thrown: unknown) => thrown)) as WebexAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});
});

describe('WebexAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new WebexAPIError('x', { status: 401 }).isAuthError).toBe(true);
	});

	it('treats 403 as both an auth and a forbidden error', () => {
		const error = new WebexAPIError('x', { status: 403, body: forbidden });
		// A 403 means the token works but the scope does not, so it is an auth
		// problem and a permission one at once.
		expect(error.isAuthError).toBe(true);
		expect(error.isForbidden).toBe(true);
	});

	it('is not forbidden for a 401', () => {
		expect(new WebexAPIError('x', { status: 401 }).isForbidden).toBe(false);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/v1/rooms' },
			{
				url: 'https://webexapis.com/v1/rooms',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: notFound,
			},
			'Not Found',
		);
		const error = new WebexAPIError('wrapped', { cause });
		expect(error.status).toBe(404);
		expect(error.trackingId).toBe('ROUTERGW_cccc3333');
		expect(error.errors).toEqual(['Room not found']);
	});
});

describe('describeWebexError', () => {
	it('prefers the per-field description over the summary message', () => {
		expect(describeWebexError(403, forbidden, 'fallback')).toContain(
			'Required scope: spark:messages_write',
		);
	});

	it('falls back to the message when there are no field errors', () => {
		expect(
			describeWebexError(
				500,
				{ message: 'Internal error', trackingId: 'T1' },
				'fallback',
			),
		).toBe('Webex 500: Internal error (trackingId T1)');
	});

	it('falls back when the body is not an error shape', () => {
		expect(describeWebexError(502, '<html>bad</html>', 'Bad gateway')).toBe(
			'Webex 502: Bad gateway',
		);
	});

	it('drops the label when there is no status', () => {
		expect(describeWebexError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('nextPageFromLink', () => {
	it('reads the next URL out of a Link header', () => {
		// Webex pages by header, not by a cursor in the body.
		const link =
			'<https://webexapis.com/v1/rooms?max=100&page=2>; rel="next", <https://webexapis.com/v1/rooms?max=100&page=9>; rel="last"';
		expect(nextPageFromLink(link)).toBe(
			'https://webexapis.com/v1/rooms?max=100&page=2',
		);
	});

	it('accepts an unquoted rel', () => {
		expect(nextPageFromLink('<https://x/next>; rel=next')).toBe(
			'https://x/next',
		);
	});

	it('returns undefined when there is no next rel', () => {
		expect(nextPageFromLink('<https://x/last>; rel="last"')).toBeUndefined();
	});

	it('returns undefined for a missing header', () => {
		expect(nextPageFromLink(undefined)).toBeUndefined();
		expect(nextPageFromLink(null)).toBeUndefined();
	});

	it('returns undefined for an empty header', () => {
		expect(nextPageFromLink('')).toBeUndefined();
	});
});

describe('the exported base', () => {
	it('is the documented v1 base', () => {
		expect(WEBEX_API_BASE).toBe('https://webexapis.com/v1');
	});
});

describe('isWebexFailure', () => {
	it('narrows a thrown error', () => {
		expect(isWebexFailure(new WebexAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isWebexFailure(new Error('other'))).toBe(false);
		expect(isWebexFailure(null)).toBe(false);
	});
});
