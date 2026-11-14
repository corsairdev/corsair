import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	buildQuery,
	describePostmarkError,
	isCredentialRejection,
	makePostmarkRequest,
	POSTMARK_API_BASE,
	POSTMARK_SERVER_TOKEN_HEADER,
	PostmarkAPIError,
	readErrorCode,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

/** An ApiError carrying Postmark's `{ ErrorCode, Message }` body. */
function apiError(status: number, errorCode: number, message: string) {
	return new ApiError(
		{ method: 'GET', url: '/server' },
		{
			url: `${POSTMARK_API_BASE}/server`,
			ok: false,
			status,
			statusText: message,
			body: { ErrorCode: errorCode, Message: message },
		},
		message,
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Postmark error body', () => {
	it('reads the numeric code and builds a labelled message', () => {
		const body = { ErrorCode: 300, Message: 'Invalid request field(s): From.' };

		expect(readErrorCode(body)).toBe(300);
		expect(describePostmarkError(422, body, 'fallback')).toBe(
			'Postmark 422 code 300: Invalid request field(s): From.',
		);
	});

	it('treats code 10 as the authentication failure', () => {
		const body = {
			ErrorCode: 10,
			Message: 'Request does not contain a valid Server token.',
		};
		expect(isCredentialRejection(401, body)).toBe(true);
		expect(describePostmarkError(401, body, 'fallback')).toBe(
			'Postmark 401 code 10: Request does not contain a valid Server token.',
		);
	});

	it('treats a bodyless 401 as an authentication failure too', () => {
		// A gateway can strip the body; the status alone is still decisive.
		expect(isCredentialRejection(401, undefined)).toBe(true);
	});

	it('does not call a 422 a credential problem', () => {
		expect(isCredentialRejection(422, { ErrorCode: 300 })).toBe(false);
	});
});

describe('buildQuery', () => {
	it('sends a list as repeated keys without brackets', () => {
		expect(buildQuery({ tag: ['a', 'b'], count: 10 })).toEqual({
			tag: ['a', 'b'],
			count: 10,
		});
	});

	it('drops an undefined value rather than sending the word undefined', () => {
		expect(buildQuery({ Count: undefined, Offset: 0 })).toEqual({ Offset: 0 });
	});
});

describe('makePostmarkRequest', () => {
	it('sends the server token in X-Postmark-Server-Token', async () => {
		mockRequest.mockResolvedValue({ ID: 1 });

		await makePostmarkRequest('server-token', {
			method: 'GET',
			path: '/server',
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: POSTMARK_API_BASE,
			HEADERS: {
				[POSTMARK_SERVER_TOKEN_HEADER]: 'server-token',
				Accept: 'application/json',
				// Postmark answers 415 without a Content-Type even on a read.
				'Content-Type': 'application/json',
			},
		});
		expect(options).toMatchObject({ method: 'GET', url: '/server' });
	});

	it('throws AuthMissingError without a request when the token is blank', async () => {
		await expect(
			makePostmarkRequest('  ', { method: 'GET', path: '/server' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a token carrying a newline, which would break the header', async () => {
		await expect(
			makePostmarkRequest('token\nX-Injected: 1', {
				method: 'GET',
				path: '/server',
			}),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reports a rejected token as a credential failure without echoing it', async () => {
		mockRequest.mockRejectedValue(
			apiError(401, 10, 'Request does not contain a valid Server token.'),
		);

		const error = await captureError(
			makePostmarkRequest('secret-token', { method: 'GET', path: '/server' }),
		);

		expect(error).toBeInstanceOf(PostmarkAPIError);
		if (!(error instanceof PostmarkAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.errorCode).toBe(10);
		expect(error.credentialsRejected).toBe(true);
		expect(error.method).toBe('GET');
		// The token rides in a header, so no error may repeat it.
		expect(JSON.stringify(error)).not.toContain('secret-token');
	});

	it('keeps the numeric code and status on a validation rejection', async () => {
		mockRequest.mockRejectedValue(apiError(422, 300, "Invalid 'To' address"));

		const error = await captureError(
			makePostmarkRequest('token', { method: 'POST', path: '/email' }),
		);

		expect(error).toBeInstanceOf(PostmarkAPIError);
		if (!(error instanceof PostmarkAPIError)) return;
		expect(error.status).toBe(422);
		expect(error.errorCode).toBe(300);
		expect(error.credentialsRejected).toBe(false);
	});

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePostmarkRequest('token', { method: 'POST', path: '/email' }),
		);

		expect(error).toBeInstanceOf(PostmarkAPIError);
		if (!(error instanceof PostmarkAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.method).toBe('POST');
	});
});
