import {
	basicAuthHeader,
	describeESignaturesError,
	ESignaturesAPIError,
	makeESignaturesRequest,
	segment,
} from './client';
import { contract, errorBody } from './test-fixtures';

const API_KEY = 'es-secret-test-key';

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
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	promise: Promise<unknown>,
): Promise<ESignaturesAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(ESignaturesAPIError);
	if (!(error instanceof ESignaturesAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('basicAuthHeader', () => {
	it('encodes the token as the username with an empty password', () => {
		expect(basicAuthHeader('tok')).toBe(
			`Basic ${Buffer.from('tok:').toString('base64')}`,
		);
	});
});

describe('makeESignaturesRequest', () => {
	it('authenticates with HTTP Basic and no x-api-key header', async () => {
		respond({ data: { contract } }, 200);

		const result = await makeESignaturesRequest(API_KEY, {
			method: 'GET',
			path: '/contracts/1contr11-2222',
		});

		expect(result).toEqual({ data: { contract } });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://esignatures.com/api/contracts/1contr11-2222');
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(
			`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
		);
		expect(headers.get('accept')).toBe('application/json');
		expect(headers.get('x-api-key')).toBeNull();
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ status: 'queued' }, 200);

		await makeESignaturesRequest(API_KEY, {
			method: 'POST',
			path: '/contracts',
			body: { template_id: '4templ44-8888', test: 'yes' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			template_id: '4templ44-8888',
			test: 'yes',
		});
	});

	it('sends no body or content type on a bodyless POST', async () => {
		respond({ status: 'withdrawn' }, 200);

		await expect(
			makeESignaturesRequest(API_KEY, {
				method: 'POST',
				path: '/contracts/1contr11-2222/withdraw',
			}),
		).resolves.toEqual({ status: 'withdrawn' });

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('percent-encodes a path segment', async () => {
		respond({ data: {} }, 200);

		await makeESignaturesRequest(API_KEY, {
			method: 'GET',
			path: `/contracts/${segment('a/b?c')}`,
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://esignatures.com/api/contracts/a%2Fb%3Fc');
	});

	it('reads the error field of an undocumented error body', async () => {
		respond(errorBody('Contract not found'), 404);

		const error = await failure(
			makeESignaturesRequest(API_KEY, {
				method: 'GET',
				path: '/contracts/1contr11-2222',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.method).toBe('GET');
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toBe('eSignatures 404: Contract not found');
	});

	it('reads message and error_message when the error field is absent', async () => {
		respond({ message: 'nope' }, 400);
		expect(
			(
				await failure(
					makeESignaturesRequest(API_KEY, {
						method: 'POST',
						path: '/contracts',
					}),
				)
			).message,
		).toBe('eSignatures 400: nope');

		respond({ error_message: 'later' }, 400);
		expect(
			(
				await failure(
					makeESignaturesRequest(API_KEY, {
						method: 'POST',
						path: '/contracts',
					}),
				)
			).message,
		).toBe('eSignatures 400: later');
	});

	it('falls back to plain text when the body is not JSON', async () => {
		respond('<html>down</html>', 503);

		const error = await failure(
			makeESignaturesRequest(API_KEY, {
				method: 'GET',
				path: '/templates',
			}),
		);
		expect(error.message).toContain('503');
		expect(error.body).toBe('<html>down</html>');
	});

	it('treats a 429 as a rate limit and reads Retry-After without retrying', async () => {
		respond(errorBody('Slow down'), 429, { 'Retry-After': '2' });

		const error = await failure(
			makeESignaturesRequest(API_KEY, {
				method: 'GET',
				path: '/templates',
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeESignaturesRequest(API_KEY, {
				method: 'GET',
				path: '/templates',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeESignaturesRequest(API_KEY, {
				method: 'POST',
				path: '/contracts',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('resolves a bodyless 204 as undefined', async () => {
		respondEmpty(204);

		await expect(
			makeESignaturesRequest(API_KEY, {
				method: 'GET',
				path: '/templates',
			}),
		).resolves.toBeUndefined();
	});

	it('leaves the API key out of errors', async () => {
		respond(errorBody('Contract not found'), 401);

		const error = await failure(
			makeESignaturesRequest(API_KEY, {
				method: 'GET',
				path: '/contracts/1contr11-2222',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeESignaturesError', () => {
	it('reads data.error_message from the body the live API sends', () => {
		expect(
			describeESignaturesError(
				403,
				{
					status: 'error',
					data: {
						error_code: 'forbidden',
						error_message: 'Invalid or missing Secret token',
					},
				},
				'Forbidden',
			),
		).toBe('eSignatures 403: Invalid or missing Secret token');
	});

	it('keeps the fallback when the body has no error text', () => {
		expect(describeESignaturesError(502, { code: 7 }, 'Bad gateway')).toBe(
			'eSignatures 502: Bad gateway',
		);
		expect(describeESignaturesError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});
