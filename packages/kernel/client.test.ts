import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	buildUrl,
	encodeKernelPathValue,
	kernelErrorMessage,
	makeKernelPagedRequest,
	makeKernelRequest,
	tryGetStoredKey,
} from './client';

const realFetch = global.fetch;
const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

beforeEach(() => {
	fetchMock.mockReset();
	// `unknown` because jest's mock type and fetch's overloads don't overlap; the mock answers every call this file makes.
	global.fetch = fetchMock as unknown as typeof fetch;
});

afterAll(() => {
	global.fetch = realFetch;
});

function json(
	status: number,
	// `unknown` because the fake answer is any JSON value a test needs.
	body: unknown,
	headers: Record<string, string> = {},
) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

describe('makeKernelRequest', () => {
	it('sends the key as a bearer token and the body as JSON', async () => {
		fetchMock.mockResolvedValue(json(200, { session_id: 'abc' }));
		const result = await makeKernelRequest({
			apiKey: 'sk_test',
			method: 'POST',
			path: '/browsers',
			body: { headless: true },
		});
		expect(result).toEqual({ session_id: 'abc' });
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(url).toBe('https://api.onkernel.com/browsers');
		const headers = init?.headers as Headers;
		expect(headers.get('authorization')).toBe('Bearer sk_test');
		expect(headers.get('content-type')).toContain('application/json');
		expect(init?.body).toBe('{"headless":true}');
	});

	it('encodes a path value so it cannot reach another route', async () => {
		fetchMock.mockResolvedValue(json(200, {}));
		await makeKernelRequest({
			apiKey: 'sk_test',
			method: 'GET',
			path: '/profiles/{id_or_name}',
			pathParameters: { id_or_name: 'a/../api_keys' },
		});
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'https://api.onkernel.com/profiles/a%2F..%2Fapi_keys',
		);
		expect(() => encodeKernelPathValue('..')).toThrow(
			'Invalid Kernel path value',
		);
		expect(() => encodeKernelPathValue('')).toThrow(
			'Invalid Kernel path value',
		);
	});

	it('returns a binary response as bytes', async () => {
		fetchMock.mockResolvedValue(
			new Response(new Uint8Array([0x89, 0x50]), {
				status: 200,
				headers: { 'content-type': 'image/png' },
			}),
		);
		const result = await makeKernelRequest({
			apiKey: 'sk_test',
			method: 'POST',
			path: '/browsers/{id_or_name}/computer/screenshot',
			pathParameters: { id_or_name: 'abc' },
			body: {},
			responseType: 'binary',
		});
		expect(result).toEqual({
			bytes: new Uint8Array([0x89, 0x50]),
			contentType: 'image/png',
		});
	});

	it("rebuilds an error with Kernel's reason and without the request body", async () => {
		fetchMock.mockResolvedValue(
			json(400, {
				code: 'invalid_request',
				message: "headless browsers don't support replays at this time",
				details: [{ field: 'password', value: 'hunter2' }],
			}),
		);
		const error = await makeKernelRequest({
			apiKey: 'sk_test',
			method: 'POST',
			path: '/credentials',
			body: { values: { password: 'hunter2' } },
			// `unknown` because a rejected promise carries no type; the next line checks it is an ApiError.
		}).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(400);
		expect(apiError.message).toBe(
			"Kernel 400: headless browsers don't support replays at this time (invalid_request)",
		);
		expect(apiError.request.body).toBe('[REDACTED]');
		expect(JSON.stringify(apiError.body)).not.toContain('hunter2');
		expect(JSON.stringify(apiError)).not.toContain('sk_test');
	});

	it('takes query values and sent strings Kernel echoes back out of the error', async () => {
		fetchMock.mockResolvedValue(
			json(400, {
				code: 'invalid_request',
				message:
					"no credential matches 'person@example.com' for 'hunter22secret'",
			}),
		);
		const error = (await makeKernelRequest({
			apiKey: 'sk_test',
			method: 'POST',
			path: '/credentials',
			query: { search: 'person@example.com' },
			body: { values: { password: 'hunter22secret' } },
			// `unknown` because a rejected promise carries no type; it is cast to the ApiError the transport throws.
		}).catch((caught: unknown) => caught)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(400);
		// Kernel's reason stays, the values it quoted don't.
		expect(error.message).toBe(
			"Kernel 400: no credential matches '[REDACTED]' for '[REDACTED]' (invalid_request)",
		);
		expect(error.request.query).toEqual({ search: '[REDACTED]' });
		expect(error.url).toBe(
			'https://api.onkernel.com/credentials?search=[REDACTED]',
		);
		const serialized = JSON.stringify(error);
		expect(serialized).not.toContain('person@example.com');
		expect(serialized).not.toContain('person%40example.com');
		expect(serialized).not.toContain('hunter22secret');
	});

	it('refuses to send a request without a key', async () => {
		await expect(
			makeKernelRequest({ apiKey: '', method: 'GET', path: '/browsers' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('makeKernelPagedRequest', () => {
	it('returns the page with its paging headers', async () => {
		fetchMock.mockResolvedValue(
			json(200, [{ session_id: 'a' }], {
				'x-has-more': 'true',
				'x-next-offset': '1',
			}),
		);
		const page = await makeKernelPagedRequest({
			apiKey: 'sk_test',
			method: 'GET',
			path: '/browsers',
			query: { limit: 1, tags: { team: 'growth' }, status: 'active' },
		});
		expect(page.body).toEqual([{ session_id: 'a' }]);
		expect(page.headers.get('x-next-offset')).toBe('1');
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'https://api.onkernel.com/browsers?limit=1&tags%5Bteam%5D=growth&status=active',
		);
		const init = fetchMock.mock.calls[0]?.[1];
		expect((init?.headers as Record<string, string>).Authorization).toBe(
			'Bearer sk_test',
		);
	});

	it('retries a 429 after Retry-After, then returns the page', async () => {
		fetchMock
			.mockResolvedValueOnce(
				json(429, { message: 'slow down' }, { 'retry-after': '0' }),
			)
			.mockResolvedValueOnce(json(200, [], { 'x-has-more': 'false' }));
		const page = await makeKernelPagedRequest({
			apiKey: 'sk_test',
			method: 'GET',
			path: '/profiles',
		});
		expect(page.body).toEqual([]);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('raises an ApiError with the status and a scrubbed message', async () => {
		fetchMock.mockResolvedValue(
			json(403, {
				code: 'forbidden',
				message: 'proxy IPs are not on this plan',
			}),
		);
		const error = await makeKernelPagedRequest({
			apiKey: 'sk_test',
			method: 'GET',
			path: '/proxy_ips',
			// `unknown` because a rejected promise carries no type; the next line checks it is an ApiError.
		}).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
		expect((error as ApiError).message).toBe(
			'Kernel 403: proxy IPs are not on this plan (forbidden)',
		);
	});

	it('repeats an array query value and fills path values', () => {
		expect(
			buildUrl({
				apiKey: 'k',
				method: 'GET',
				path: '/browsers/{id_or_name}/telemetry/events',
				pathParameters: { id_or_name: 'abc' },
				query: { category: ['console', 'network'], limit: 5 },
			}),
		).toBe(
			'https://api.onkernel.com/browsers/abc/telemetry/events?category=console&category=network&limit=5',
		);
	});
});

describe('kernelErrorMessage', () => {
	it('falls back to the status text and caps the length', () => {
		expect(kernelErrorMessage(502, 'Bad Gateway', 'upstream')).toBe(
			'Kernel 502: Bad Gateway',
		);
		expect(
			kernelErrorMessage(400, 'Bad Request', { message: 'x'.repeat(600) })
				.length,
		).toBe(500);
	});
});

describe('tryGetStoredKey', () => {
	it('treats a missing DEK as no stored key and rethrows anything else', async () => {
		await expect(
			tryGetStoredKey(() =>
				Promise.reject(new Error('No DEK found for account')),
			),
		).resolves.toBeUndefined();
		await expect(
			tryGetStoredKey(() => Promise.reject(new Error('decryption failed'))),
		).rejects.toThrow('decryption failed');
		await expect(tryGetStoredKey(() => Promise.resolve('sk_1'))).resolves.toBe(
			'sk_1',
		);
	});
});
