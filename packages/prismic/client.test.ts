import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	contentBase,
	describePrismicError,
	isCredentialRejection,
	makePrismicRequest,
	nextPagePath,
	PRISMIC_MIGRATION_BASE,
	PrismicAPIError,
	readErrorMessage,
	readErrorType,
	readFieldErrors,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const CREDENTIALS = {
	repository: 'my-cafe',
	writeToken: 'write-token',
	accessToken: 'access-token',
};

/** An ApiError carrying one of Prismic's error shapes. */
function apiError(
	status: number,
	// unknown: each API sends a different error shape.
	body: Untyped,
	method: 'GET' | 'POST' = 'GET',
) {
	return new ApiError(
		{ method, url: '/documents' },
		{
			url: `${PRISMIC_MIGRATION_BASE}/documents`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		'error',
	);
}

type Untyped = unknown; // unknown: see the note above.

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Prismic error bodies', () => {
	it('reads the Content API shape', () => {
		const body = {
			type: 'api_security_error',
			message: 'Invalid access token',
		};

		expect(readErrorType(body)).toBe('api_security_error');
		expect(readErrorMessage(body)).toBe('Invalid access token');
		expect(describePrismicError(401, body, 'fallback')).toBe(
			'Prismic 401 api_security_error: Invalid access token',
		);
	});

	it('reads the Migration API field-error array', () => {
		const body = [
			{
				property: 'data.richtext.2.type',
				value: 'heading2',
				error:
					'Invalid block type. Supported block types are: paragraph, embed',
			},
		];

		expect(readFieldErrors(body)).toEqual([
			{
				property: 'data.richtext.2.type',
				error:
					'Invalid block type. Supported block types are: paragraph, embed',
			},
		]);
		expect(describePrismicError(400, body, 'fallback')).toBe(
			'Prismic 400: data.richtext.2.type: Invalid block type. Supported block types are: paragraph, embed',
		);
	});

	it('summarises at most three field errors, so the message stays readable', () => {
		const body = Array.from({ length: 5 }, (_, index) => ({
			property: `data.field${index}`,
			error: 'is required',
		}));

		const message = describePrismicError(400, body, 'fallback');

		expect(message).toContain('data.field0');
		expect(message).toContain('data.field2');
		expect(message).not.toContain('data.field3');
	});

	it('reads the Migration API 403 Message, which is capitalised', () => {
		const body = {
			Message:
				'User is not authorized to access this resource with an explicit deny in an identity-based policy',
		};

		expect(readErrorMessage(body)).toContain('not authorized');
		expect(isCredentialRejection(403, body)).toBe(true);
	});

	it('does not treat a 403 that is not access-denied as a credential problem', () => {
		expect(isCredentialRejection(403, { message: 'Forbidden' })).toBe(false);
	});

	it('treats a bare 401 as an auth failure, since a missing repo answers one', () => {
		expect(isCredentialRejection(401, undefined)).toBe(true);
	});

	it('does not treat a 429 as a credential problem', () => {
		expect(
			isCredentialRejection(429, {
				message: 'Rate limit exceeded.',
				request_id: 'req_1',
			}),
		).toBe(false);
	});
});

describe('nextPagePath', () => {
	it('keeps only the path and query, so the call stays on the repository host', () => {
		expect(
			nextPagePath(
				'https://my-cafe.cdn.prismic.io/api/v2/documents/search?ref=X47BMBAAACAAVh4N&page=2&pageSize=2',
			),
		).toBe('/api/v2/documents/search?ref=X47BMBAAACAAVh4N&page=2&pageSize=2');
	});

	it('keeps an access_token the URL carries, which authorises a private repository', () => {
		const path = nextPagePath(
			'https://my-cafe.cdn.prismic.io/api/v2/documents/search?ref=abc&access_token=secret',
		);

		expect(path).toContain('access_token=secret');
	});
});

describe('makePrismicRequest', () => {
	it('sends the write token and repository headers to the Migration host', async () => {
		mockRequest.mockResolvedValue({ id: 'doc_1' });

		await makePrismicRequest(CREDENTIALS, {
			method: 'POST',
			api: 'migration',
			url: '/documents',
			body: { title: 'Hi' },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: PRISMIC_MIGRATION_BASE,
			HEADERS: {
				Authorization: 'Bearer write-token',
				repository: 'my-cafe',
				'Content-Type': 'application/json',
			},
		});
		expect(options).toMatchObject({ method: 'POST', url: '/documents' });
	});

	it('sends the access token as a query parameter on a Content read', async () => {
		mockRequest.mockResolvedValue({ results: [] });

		await makePrismicRequest(CREDENTIALS, {
			method: 'GET',
			api: 'content',
			url: '/documents/search',
			query: { pageSize: 2 },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		// The Content host is the repository's own, not the migration host.
		expect(config).toMatchObject({ BASE: contentBase('my-cafe') });
		expect(options).toMatchObject({
			query: { pageSize: 2, access_token: 'access-token' },
		});
		// A read carries no write token.
		expect(
			(config as { HEADERS: Record<string, string> }).HEADERS,
		).not.toHaveProperty('Authorization');
	});

	it('omits the access token when none is configured, as for a public repository', async () => {
		mockRequest.mockResolvedValue({ results: [] });

		await makePrismicRequest(
			{ repository: 'my-cafe' },
			{
				method: 'GET',
				api: 'content',
				url: '/documents/search',
				query: { pageSize: 2 },
			},
		);

		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.query).toEqual({ pageSize: 2 });
	});

	it('throws AuthMissingError without a request when the repository is blank', async () => {
		await expect(
			makePrismicRequest(
				{ repository: '  ' },
				{ method: 'GET', api: 'content', url: '' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when a migration call has no write token', async () => {
		await expect(
			makePrismicRequest(
				{ repository: 'my-cafe' },
				{ method: 'POST', api: 'migration', url: '/documents', body: {} },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a write token carrying a newline, which would break the header', async () => {
		await expect(
			makePrismicRequest(
				{ repository: 'my-cafe', writeToken: 'token\nX-Injected: 1' },
				{ method: 'POST', api: 'migration', url: '/documents', body: {} },
			),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('reports a rejected write token as a credential failure without echoing it', async () => {
		mockRequest.mockRejectedValue(
			apiError(
				403,
				{ Message: 'User is not authorized to access this resource' },
				'POST',
			),
		);

		const error = await captureError(
			makePrismicRequest(CREDENTIALS, {
				method: 'POST',
				api: 'migration',
				url: '/documents',
				body: { title: 'Hi' },
			}),
		);

		expect(error).toBeInstanceOf(PrismicAPIError);
		if (!(error instanceof PrismicAPIError)) return;
		expect(error.status).toBe(403);
		expect(error.credentialsRejected).toBe(true);
		// The token rode in a header, so no error may repeat it.
		expect(JSON.stringify(error)).not.toContain('write-token');
	});

	it('keeps the field errors from a Migration rejection', async () => {
		mockRequest.mockRejectedValue(
			apiError(
				400,
				[{ property: 'title', error: 'The value must be a string' }],
				'POST',
			),
		);

		const error = await captureError(
			makePrismicRequest(CREDENTIALS, {
				method: 'POST',
				api: 'migration',
				url: '/documents',
				body: { title: 1 },
			}),
		);

		expect(error).toBeInstanceOf(PrismicAPIError);
		if (!(error instanceof PrismicAPIError)) return;
		expect(error.fieldErrors).toEqual([
			{ property: 'title', error: 'The value must be a string' },
		]);
		expect(error.message).toContain('title');
	});

	it('keeps a 429 and its Retry-After', async () => {
		const rateLimited = new ApiError(
			{ method: 'POST', url: '/documents' },
			{
				url: `${PRISMIC_MIGRATION_BASE}/documents`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Rate limit exceeded.', request_id: 'req_1' },
			},
			'Rate limit exceeded.',
			{ retryAfter: 1000 },
		);
		mockRequest.mockRejectedValue(rateLimited);

		const error = await captureError(
			makePrismicRequest(CREDENTIALS, {
				method: 'POST',
				api: 'migration',
				url: '/documents',
				body: {},
			}),
		);

		expect(error).toBeInstanceOf(PrismicAPIError);
		if (!(error instanceof PrismicAPIError)) return;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(1000);
		expect(error.credentialsRejected).toBe(false);
	});

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePrismicRequest(CREDENTIALS, {
				method: 'POST',
				api: 'migration',
				url: '/documents',
				body: {},
			}),
		);

		expect(error).toBeInstanceOf(PrismicAPIError);
		if (!(error instanceof PrismicAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.method).toBe('POST');
	});
});
