import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	isCredentialRejection,
	makePointagramRequest,
	POINTAGRAM_API_BASE,
	PointagramAPIError,
	resolvePointagramApiUser,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const CREDENTIALS = { apiKey: 'key-abc', apiUser: 'ops@example.com' };

/** An ApiError with the status and body a test wants to exercise. */
function apiError(
	status: number,
	message: string,
	body?: unknown, // unknown: each test passes one of Pointagram's response shapes.
	retryAfter?: number,
	method: 'GET' | 'POST' = 'GET',
) {
	return new ApiError(
		{ method, url: '/players' },
		{
			url: `${POINTAGRAM_API_BASE}/players`,
			ok: false,
			status,
			statusText: message,
			body: body ?? {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makePointagramRequest', () => {
	it('sends Api-Key and Api-User headers to the Custom Api 2.0 base', async () => {
		mockRequest.mockResolvedValue({ status: 'Ok', message: 'ok', data: {} });

		await makePointagramRequest(CREDENTIALS, {
			method: 'GET',
			path: '/players',
			query: { limit: 10 },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: POINTAGRAM_API_BASE,
			HEADERS: {
				'Api-Key': 'key-abc',
				'Api-User': 'ops@example.com',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/players',
			query: { limit: 10 },
		});
	});

	it('omits the media type when there is no body, and JSON-encodes one that exists', async () => {
		mockRequest.mockResolvedValue({ status: 'Ok', data: {} });

		await makePointagramRequest(CREDENTIALS, {
			method: 'DELETE',
			path: '/players/1',
		});
		expect(mockRequest.mock.calls[0]?.[1]?.mediaType).toBeUndefined();

		await makePointagramRequest(CREDENTIALS, {
			method: 'POST',
			path: '/players',
			body: { player_name: 'Axl' },
		});
		expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({
			method: 'POST',
			body: { player_name: 'Axl' },
			mediaType: 'application/json',
		});
	});

	it('throws AuthMissingError without a request when a credential is blank', async () => {
		await expect(
			makePointagramRequest(
				{ apiKey: '  ', apiUser: 'ops@example.com' },
				{ method: 'GET', path: '/players' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makePointagramRequest(
				{ apiKey: 'key', apiUser: '' },
				{ method: 'GET', path: '/players' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a credential carrying a newline, which would break the header', async () => {
		await expect(
			makePointagramRequest(
				{ apiKey: 'key\r\nX-Injected: 1', apiUser: 'ops@example.com' },
				{ method: 'GET', path: '/players' },
			),
		).rejects.toThrow(/must not contain newline/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('keeps core ApiError with its status, body and Retry-After', async () => {
		const core = apiError(
			404,
			'Not Found',
			{ status: 'Error', message: 'Invalid Credentials', data: {} },
			1500,
		);
		mockRequest.mockRejectedValue(core);

		const error = await makePointagramRequest(CREDENTIALS, {
			method: 'GET',
			path: '/players',
		}).then(
			() => undefined,
			(caught) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(404);
		expect(error.retryAfter).toBe(1500);
		expect(error.body).toEqual(core.body);
		expect(error.message).toBe('Not Found');
	});

	it('drops a searched email from the failed call url, request and body', async () => {
		const email = 'corsair-tests@inkboxmail.com';
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'GET',
					url: '/players',
					query: { search_by: 'Email', filter: email },
				},
				{
					url: `${POINTAGRAM_API_BASE}/players?search_by=Email&filter=${encodeURIComponent(email)}`,
					ok: false,
					status: 409,
					statusText: 'Conflict',
					body: { status: 'Error', message: `No player ${email}`, data: {} },
				},
				`No player ${email}`,
			),
		);

		const error = await makePointagramRequest(CREDENTIALS, {
			method: 'GET',
			path: '/players',
			query: { search_by: 'Email', filter: email },
		}).then(
			() => undefined,
			(caught) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(409);
		expect(error.url).toBe(`${POINTAGRAM_API_BASE}/players`);
		expect(error.message).toBe('No player [redacted]');
		const serialized = JSON.stringify({
			url: error.url,
			request: error.request,
			body: error.body,
			message: error.message,
		});
		expect(serialized).not.toContain('inkboxmail');
	});

	it('drops the player fields of a failed write from the error', async () => {
		mockRequest.mockRejectedValue(
			apiError(
				409,
				'Conflict',
				{ status: 'Error', message: 'Player already exists.' },
				undefined,
				'POST',
			),
		);

		const error = await makePointagramRequest(CREDENTIALS, {
			method: 'POST',
			path: '/players',
			body: { player_name: 'Axl Rose', player_email: 'axl@example.com' },
		}).then(
			() => undefined,
			(caught) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error.request)).not.toContain('axl@example.com');
		expect(error.message).toBe('Conflict');
	});

	it('keeps a plain 404 distinguishable from a rejected key', async () => {
		const core = apiError(404, 'Not Found', {
			status: 'Error',
			message: 'Player not found',
		});
		mockRequest.mockRejectedValue(core);

		const error = await makePointagramRequest(CREDENTIALS, {
			method: 'GET',
			path: '/players/9',
		}).then(
			() => undefined,
			(caught) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 404, body: core.body });
		expect(isCredentialRejection(404, (error as ApiError).body)).toBe(false);
	});

	it('keeps a 429 with its Retry-After on the core error', async () => {
		mockRequest.mockRejectedValue(
			apiError(429, 'Too Many Requests', { status: 'Error' }, 2500, 'POST'),
		);

		const error = await makePointagramRequest(CREDENTIALS, {
			method: 'POST',
			path: '/scoreseries/points',
		}).then(
			() => undefined,
			(caught) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2500);
		expect(error.request.method).toBe('POST');
		// The key rode in a header of the config, never in the request options.
		expect(JSON.stringify(error)).not.toContain('key-abc');
		expect(String(error.stack)).not.toContain('key-abc');
	});

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await makePointagramRequest(CREDENTIALS, {
			method: 'GET',
			path: '/teams',
		}).then(
			() => undefined,
			(caught) => caught,
		);

		expect(error).toBeInstanceOf(PointagramAPIError);
		if (!(error instanceof PointagramAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
	});
});

describe('isCredentialRejection', () => {
	it('matches only the credential body on a 401/403/404', () => {
		const body = { status: 'Error', message: 'Invalid credentials' };
		expect(isCredentialRejection(404, body)).toBe(true);
		expect(isCredentialRejection(401, body)).toBe(true);
		expect(isCredentialRejection(403, body)).toBe(true);
		// A 500 carrying the same text is a server failure, not a rejected key.
		expect(isCredentialRejection(500, body)).toBe(false);
		expect(isCredentialRejection(undefined, body)).toBe(false);
	});

	it('ignores a 404 whose message is about a resource', () => {
		expect(
			isCredentialRejection(404, {
				status: 'Error',
				message: 'Team not found',
			}),
		).toBe(false);
	});
});

describe('resolvePointagramApiUser', () => {
	it('reads the stored account field', async () => {
		const value = await resolvePointagramApiUser({
			keys: { get_api_user: async () => 'stored@example.com' },
		});
		expect(value).toBe('stored@example.com');
	});

	it('trims the stored value', async () => {
		const value = await resolvePointagramApiUser({
			keys: { get_api_user: async () => '  stored@example.com  ' },
		});
		expect(value).toBe('stored@example.com');
	});

	it('throws AuthMissingError when the account holds nothing', async () => {
		await expect(
			resolvePointagramApiUser({
				keys: { get_api_user: async () => null },
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			resolvePointagramApiUser({
				keys: { get_api_user: async () => '   ' },
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(resolvePointagramApiUser({})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
