import {
	describeUnipileError,
	makeUnipileRequest,
	UnipileAPIError,
} from './client';
import { accountsPage, problem } from './test-fixtures';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/html' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<UnipileAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(UnipileAPIError);
	return error as UnipileAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeUnipileRequest', () => {
	it('sends X-API-KEY (no bearer token) and JSON bodies', async () => {
		respond({ object: 'HostedAuthLink', link: 'https://x' }, 200);

		await makeUnipileRequest('uk-key', {
			method: 'POST',
			path: '/v2/auth/link',
			body: { providers: 'linkedin' },
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(url).toBe('https://api.unipile.com/v2/auth/link');
		expect(init.method).toBe('POST');
		expect(headers.get('x-api-key')).toBe('uk-key');
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(init.body))).toEqual({ providers: 'linkedin' });
	});

	it('sends no body or content type on a bodiless POST', async () => {
		respond({ object: 'RelationRequestConfirmed' }, 200);

		await makeUnipileRequest('uk-key', {
			method: 'POST',
			path: '/v2/acc_1/users/me/relation-requests/inv_1/accept',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('repeats array query params and drops undefined ones', async () => {
		respond(accountsPage, 200);

		await makeUnipileRequest('uk-key', {
			method: 'GET',
			path: '/v2/acc_1/users/me',
			query: {
				with_sections: ['linkedin_experience', 'linkedin_skills'],
				variant: undefined,
				limit: 5,
			},
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe(
			'https://api.unipile.com/v2/acc_1/users/me?with_sections=linkedin_experience&with_sections=linkedin_skills&limit=5',
		);
	});

	it('reads type, title, detail and req_id from an RFC 7807 body', async () => {
		respond(
			problem(
				401,
				'provider/invalid_authorization',
				'Invalid authorization',
				'Account requires re-authentication.',
			),
			401,
		);

		const error = await failure(
			makeUnipileRequest('uk-key', { method: 'GET', path: '/v2/acc_1/chats' }),
		);

		expect(error.status).toBe(401);
		expect(error.type).toBe('provider/invalid_authorization');
		expect(error.title).toBe('Invalid authorization');
		expect(error.detail).toBe('Account requires re-authentication.');
		expect(error.reqId).toBe('req_test_1');
		expect(error.message).toBe(
			'Unipile 401 provider/invalid_authorization: Invalid authorization: Account requires re-authentication. (req req_test_1)',
		);
	});

	it('makes one attempt on a 429 and keeps Retry-After in ms', async () => {
		respond(problem(429, 'api/too_many_requests', 'Too Many Requests'), 429, {
			'retry-after': '18',
		});

		const error = await failure(
			makeUnipileRequest('uk-key', { method: 'GET', path: '/v2/acc_1/chats' }),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.type).toBe('api/too_many_requests');
		expect(error.retryAfter).toBe(18_000);
	});

	it('wraps a non-JSON error page', async () => {
		respond('<html>Bad gateway</html>', 502);

		const error = await failure(
			makeUnipileRequest('uk-key', { method: 'GET', path: '/v2/accounts/' }),
		);

		expect(error.status).toBe(502);
		expect(error.type).toBeUndefined();
		expect(error.body).toBe('<html>Bad gateway</html>');
	});

	it('wraps a timeout with its cause', async () => {
		const timeout = new Error('The operation was aborted due to timeout');
		timeout.name = 'TimeoutError';
		fetchMock.mockRejectedValueOnce(timeout);

		const error = await failure(
			makeUnipileRequest('uk-key', { method: 'GET', path: '/v2/accounts/' }),
		);

		expect(error.status).toBeUndefined();
		expect((error.cause as Error).name).toBe('TimeoutError');
	});

	it('never puts the API key in the error', async () => {
		respond(problem(403, 'api/insufficient_permissions', 'Forbidden'), 403);

		const error = await failure(
			makeUnipileRequest('uk-secret-key', {
				method: 'GET',
				path: '/v2/accounts/',
			}),
		);

		expect(JSON.stringify(error)).not.toContain('uk-secret-key');
		expect(error.message).not.toContain('uk-secret-key');
	});
});

describe('describeUnipileError', () => {
	it('falls back to the transport message without a body', () => {
		expect(describeUnipileError(503, undefined, 'Service Unavailable')).toBe(
			'Unipile 503: Service Unavailable',
		);
	});
});
