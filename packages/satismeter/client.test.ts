import {
	makeSatisMeterRequest,
	parseJsonBody,
	SATISMETER_API_V3,
	SATISMETER_API_WRITE,
	SatisMeterAPIError,
} from './client';
import {
	NO_WRITE_KEY_BODY,
	NOT_AUTHORIZED_BODY,
	PROJECT_NOT_FOUND_BODY,
	USER_NOT_FOUND_BODY,
} from './test-fixtures';
import {
	installFetchMock,
	respond,
	restoreFetchMock,
	sentHeaders,
	sentUrl,
} from './test-helpers';

const API_KEY = 'sm-test-key';

/** The rejection as a SatisMeterAPIError, so each test can assert on it. */
async function failure(promise: Promise<string>): Promise<SatisMeterAPIError> {
	// unknown: a rejection can carry any value, not just an Error, so this
	// catches it untyped and asserts on the class below.
	const error: unknown = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(SatisMeterAPIError);
	if (!(error instanceof SatisMeterAPIError)) {
		throw new Error('expected a SatisMeterAPIError');
	}
	return error;
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('makeSatisMeterRequest', () => {
	it('sends the key as a bearer token and never in the query', async () => {
		respond({ data: {} });

		await makeSatisMeterRequest(API_KEY, {
			base: SATISMETER_API_V3,
			method: 'GET',
			path: '/projects/abc',
		});

		expect(sentHeaders().get('Authorization')).toBe(`Bearer ${API_KEY}`);
		expect(sentQuery(sentUrl())).toBeUndefined();
	});

	it('drops an unset query value instead of sending it empty', async () => {
		respond({ data: [] });

		await makeSatisMeterRequest(API_KEY, {
			base: SATISMETER_API_V3,
			method: 'GET',
			path: '/projects/abc/responses',
			query: { startDate: undefined, pageSize: 20 },
		});

		expect([...sentUrl().searchParams.keys()]).toEqual(['pageSize']);
	});

	it('serialises a JSON body and sets the content type', async () => {
		respond('', 200);

		await makeSatisMeterRequest(API_KEY, {
			base: SATISMETER_API_WRITE,
			method: 'POST',
			path: '/users',
			body: { userId: '007', project: 'abc' },
		});

		expect(sentHeaders().get('Content-Type')).toBe('application/json');
	});

	it('sends no content type and no body when there is none', async () => {
		respond('', 204);

		await makeSatisMeterRequest(API_KEY, {
			base: SATISMETER_API_WRITE,
			method: 'DELETE',
			path: '/users/abc',
		});

		expect(sentHeaders().has('Content-Type')).toBe(false);
	});

	it('returns the raw text so a bodyless answer stays distinguishable', async () => {
		respond('', 204);

		const text = await makeSatisMeterRequest(API_KEY, {
			base: SATISMETER_API_WRITE,
			method: 'DELETE',
			path: '/users/abc',
		});

		expect(text).toBe('');
	});

	it('reports a 404 with the provider title', async () => {
		respond(PROJECT_NOT_FOUND_BODY, 404);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_V3,
				method: 'GET',
				path: '/projects/abc',
			}),
		);

		expect(error.status).toBe(404);
		expect(error.title).toBe('Project not found');
		expect(error.isResourceNotFound).toBe(true);
		// A v3 read looks the project up before checking the key, so this same
		// body also comes back for a bad key: it must not claim to be auth.
		expect(error.isAuthError).toBe(false);
	});

	it('reads the users API 403 as the auth failure it is', async () => {
		respond(NOT_AUTHORIZED_BODY, 403);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_WRITE,
				method: 'POST',
				path: '/users',
				body: {},
			}),
		);

		expect(error.isAuthError).toBe(true);
		expect(error.status).toBe(403);
	});

	it('tells a missing write key apart from a refused one', async () => {
		respond(NO_WRITE_KEY_BODY, 400);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_WRITE,
				method: 'POST',
				path: '/users',
				body: {},
			}),
		);

		expect(error.isMissingWriteKey).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('reports a user-not-found delete', async () => {
		respond(USER_NOT_FOUND_BODY, 404);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_WRITE,
				method: 'DELETE',
				path: '/users/nope',
			}),
		);

		expect(error.title).toBe('User not found');
	});

	it('joins several error titles', async () => {
		respond(
			{ errors: [{ title: 'First problem' }, { title: 'Second problem' }] },
			400,
		);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_V3,
				method: 'GET',
				path: '/projects/abc',
			}),
		);

		expect(error.title).toBe('First problem; Second problem');
	});

	it('falls back to the status when the error body is not JSON', async () => {
		respond('<html>gateway error</html>', 502);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_V3,
				method: 'GET',
				path: '/projects/abc',
			}),
		);

		expect(error.status).toBe(502);
		expect(error.title).toBeUndefined();
		expect(error.message).toContain('502');
	});

	it('carries Retry-After through as milliseconds', async () => {
		respond({ errors: [{ title: 'slow down' }] }, 429, { 'Retry-After': '3' });

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_V3,
				method: 'GET',
				path: '/projects/abc',
			}),
		);

		expect(error.retryAfter).toBe(3000);
	});

	it('flags a GET as replayable and a write as not', async () => {
		respond(PROJECT_NOT_FOUND_BODY, 404);
		const readError = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_V3,
				method: 'GET',
				path: '/projects/abc',
			}),
		);
		expect(readError.isReplayable).toBe(true);

		respond(NOT_AUTHORIZED_BODY, 403);
		const writeError = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_WRITE,
				method: 'POST',
				path: '/users',
				body: {},
			}),
		);
		expect(writeError.isReplayable).toBe(false);
	});

	it('flags a transport failure as replayable only for a read', async () => {
		(globalThis.fetch as jest.Mock).mockRejectedValueOnce(
			new TypeError('fetch failed'),
		);
		const readError = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_V3,
				method: 'GET',
				path: '/projects/abc',
			}),
		);
		expect(readError.isTransport).toBe(true);
		expect(readError.isTimeout).toBe(false);
		expect(readError.isReplayable).toBe(true);
	});

	it('flags the client deadline as a timeout', async () => {
		const timeout = new Error('The operation timed out.');
		timeout.name = 'TimeoutError';
		(globalThis.fetch as jest.Mock).mockRejectedValueOnce(timeout);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_V3,
				method: 'GET',
				path: '/projects/abc',
			}),
		);

		expect(error.isTimeout).toBe(true);
	});

	it('keeps the key out of the error', async () => {
		respond(NOT_AUTHORIZED_BODY, 403);

		const error = await failure(
			makeSatisMeterRequest(API_KEY, {
				base: SATISMETER_API_WRITE,
				method: 'POST',
				path: '/users',
				body: {},
			}),
		);

		// The key rides in a header, so nothing in the error can echo it.
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(error.cause).toBeUndefined();
	});
});

/** The request's query, so a test can assert on its presence rather than shape. */
function sentQuery(url: URL): string | undefined {
	return url.search.length > 1 ? url.search : undefined;
}

describe('parseJsonBody', () => {
	it('parses JSON', () => {
		expect(parseJsonBody('{"data":{"id":"a"}}')).toEqual({ data: { id: 'a' } });
	});

	it('throws on a non-JSON body rather than returning it', () => {
		expect(() => parseJsonBody('<html>oops</html>')).toThrow(
			SatisMeterAPIError,
		);
	});
});
