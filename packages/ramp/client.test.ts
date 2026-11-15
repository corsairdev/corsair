import {
	describeRampError,
	makeRampRequest,
	RAMP_API_BASE,
	RampAPIError,
	readNextCursor,
	readNextUrl,
} from './client';
import {
	INVALID_TOKEN_BODY,
	SCOPE_ERROR_BODY,
	TRANSACTION_ID,
	VALIDATION_ERROR_BODY,
} from './test-fixtures';
import { captureError, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request construction', () => {
	it('sends the token as a bearer header and keeps it out of the URL', async () => {
		respond(fetchMock, { ok: true });

		await makeRampRequest('ramp_business_tok_secret', {
			method: 'GET',
			path: '/business',
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe(RAMP_API_BASE);
		expect(request.path).toBe('/developer/v1/business');
		expect(request.headers.get('authorization')).toBe(
			'Bearer ramp_business_tok_secret',
		);
		expect(request.headers.get('accept')).toBe('application/json');
		expect(request.headers.get('x-api-key')).toBeNull();
		expect(Object.values(request.query)).not.toContain(
			'ramp_business_tok_secret',
		);
	});

	it('sends a JSON body and content type for a write', async () => {
		respond(fetchMock, { id: TRANSACTION_ID, memo: 'hello' });

		await makeRampRequest('key', {
			method: 'POST',
			path: `/memos/${TRANSACTION_ID}`,
			body: { memo: 'hello' },
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({ memo: 'hello' });
	});

	it('sends no body and no content type on a read', async () => {
		respond(fetchMock, { data: [], page: { next: null } });

		await makeRampRequest('key', {
			method: 'GET',
			path: '/departments',
			query: { page_size: 2 },
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('GET');
		expect(request.contentType).toBe('');
		expect(request.query).toEqual({ page_size: '2' });
	});
});

describe('error handling', () => {
	it('reads the error_v2 envelope into status, code and error id', async () => {
		respond(fetchMock, INVALID_TOKEN_BODY, 404);

		const error = await captureError(
			makeRampRequest('bad', { method: 'GET', path: '/business' }),
		);

		expect(error).toBeInstanceOf(RampAPIError);
		const rampError = error as RampAPIError;
		expect(rampError.status).toBe(404);
		expect(rampError.code).toBe('DEVELOPER_7002');
		expect(rampError.errorId).toBe('40ef21e2');
		expect(rampError.isAuthError).toBe(true);
		// The 404 must not read as a missing record.
		expect(rampError.isNotFound).toBe(false);
		expect(rampError.message).toContain('Ramp 404 DEVELOPER_7002');
		expect(rampError.message).toContain(
			'Access token with given access_token not found',
		);
	});

	it('treats a non-token 404 code as a missing record', async () => {
		respond(
			fetchMock,
			{ error_v2: { message: 'Not found', error_code: 'DEVELOPER_7004' } },
			404,
		);

		const error = (await captureError(
			makeRampRequest('key', { method: 'GET', path: '/bills/nope' }),
		)) as RampAPIError;

		expect(error.isNotFound).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('reads notes into the message on a validation error', async () => {
		respond(fetchMock, VALIDATION_ERROR_BODY, 400);

		const error = (await captureError(
			makeRampRequest('key', {
				method: 'POST',
				path: '/bills',
				body: {},
			}),
		)) as RampAPIError;

		expect(error.status).toBe(400);
		expect(error.notes).toBe(
			'invoice_currency must be a three-letter ISO code',
		);
		expect(error.message).toContain(
			'invoice_currency must be a three-letter ISO code',
		);
	});

	it('reports a read-only token refusal as a permission error', async () => {
		respond(fetchMock, SCOPE_ERROR_BODY, 403);

		const error = (await captureError(
			makeRampRequest('key', {
				method: 'POST',
				path: '/departments',
				body: { name: 'Eng' },
			}),
		)) as RampAPIError;

		expect(error.isPermissionError).toBe(true);
		expect(error.code).toBe('DEVELOPER_7100');
	});

	it('does not leak the request body through the error', async () => {
		respond(fetchMock, VALIDATION_ERROR_BODY, 400);

		const error = (await captureError(
			makeRampRequest('key', {
				method: 'POST',
				path: '/memos/abc',
				body: { memo: 'a confidential note' },
			}),
		)) as RampAPIError;

		// The cause is dropped on purpose: it holds the serialised request body.
		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('confidential');
		expect(require('node:util').inspect(error)).not.toContain('confidential');
	});

	it('keeps the cause for a transport failure, which carried no body', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRampRequest('key', { method: 'GET', path: '/business' }),
		)) as RampAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
	});

	it('describes a bodyless HTML 404 without inventing a code', () => {
		expect(
			describeRampError(404, '<html>Not Found</html>', 'Request failed'),
		).toBe('Ramp 404: Request failed');
	});

	it('keeps an error id out of a body that has none', async () => {
		respond(fetchMock, { error: { message: 'Legacy shape only' } }, 500);

		const error = (await captureError(
			makeRampRequest('key', { method: 'GET', path: '/business' }),
		)) as RampAPIError;

		expect(error.code).toBeUndefined();
		expect(error.message).toBe('Ramp 500: Legacy shape only');
	});
});

describe('pagination helpers', () => {
	it('reads the cursor out of the next URL', () => {
		expect(
			readNextCursor({
				next: `https://api.ramp.com/developer/v1/transactions?start=${TRANSACTION_ID}&page_size=20`,
			}),
		).toBe(TRANSACTION_ID);
	});

	it('returns null rather than an empty string when there is no next page', () => {
		expect(readNextCursor({ next: null })).toBeNull();
		expect(readNextCursor({})).toBeNull();
		expect(readNextUrl({ next: null })).toBeNull();
	});

	it('returns null when the next URL carries no start parameter', () => {
		expect(
			readNextCursor({ next: 'https://api.ramp.com/developer/v1/bills' }),
		).toBeNull();
	});

	it('decodes a percent-encoded cursor', () => {
		expect(
			readNextCursor({
				next: 'https://api.ramp.com/developer/v1/bills?start=a%2Fb',
			}),
		).toBe('a/b');
	});
});

describe('captureError', () => {
	it('fails when the operation resolves instead of returning an error', async () => {
		await expect(captureError(Promise.resolve('ok'))).rejects.toThrow(
			'the operation resolved',
		);
	});

	it('returns the error the operation rejected with', async () => {
		const error = await captureError(Promise.reject(new Error('boom')));

		expect(error.message).toBe('boom');
	});
});
