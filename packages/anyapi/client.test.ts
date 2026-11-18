import {
	AnyApiAPIError,
	describeAnyApiError,
	makeAnyApiRequest,
} from './client';
import { errorBody, requestSnapshot, runResult } from './test-fixtures';

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

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<AnyApiAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(AnyApiAPIError);
	return error as AnyApiAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeAnyApiRequest', () => {
	it('POSTs JSON with the bearer key, query controls and headers', async () => {
		const body = runResult({ name: 'Fieldkit' });
		respond(body, 200);

		const result = await makeAnyApiRequest('aa-key', {
			method: 'POST',
			path: '/v1/run/linkedin.company',
			query: { fields: 'name', max_cost_usd: '0.01', jq: undefined },
			body: { url: 'https://www.linkedin.com/company/fieldkit' },
			headers: { 'Idempotency-Key': 'k-1' },
		});

		expect(result).toEqual(body);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.getanyapi.com/v1/run/linkedin.company?fields=name&max_cost_usd=0.01',
		);
		const headers = new Headers(init.headers);
		expect(init.method).toBe('POST');
		expect(headers.get('authorization')).toBe('Bearer aa-key');
		expect(headers.get('content-type')).toBe('application/json');
		expect(headers.get('idempotency-key')).toBe('k-1');
		expect(JSON.parse(String(init.body))).toEqual({
			url: 'https://www.linkedin.com/company/fieldkit',
		});
	});

	it('returns a 202 durable snapshot as a success', async () => {
		respond(requestSnapshot, 202);

		await expect(
			makeAnyApiRequest('aa-key', {
				method: 'POST',
				path: '/v1/run/email_verification.bounceban',
				body: { email: 'a@b.example' },
			}),
		).resolves.toEqual(requestSnapshot);
	});

	it('turns an error body into an AnyApiAPIError with code and request id', async () => {
		respond(
			errorBody('sku not found', {
				code: 'sku_not_found',
				requestId: '91f46cac-eb87-433e-9a4e-96c1a2778d0a',
			}),
			404,
		);

		const error = await failure(
			makeAnyApiRequest('aa-key', {
				method: 'POST',
				path: '/v1/run/x.y',
				body: {},
			}),
		);
		expect(error.status).toBe(404);
		expect(error.code).toBe('sku_not_found');
		expect(error.requestId).toBe('91f46cac-eb87-433e-9a4e-96c1a2778d0a');
		expect(error.charged).toBe(false);
		expect(error.message).toBe(
			'AnyAPI 404: sku not found (request 91f46cac-eb87-433e-9a4e-96c1a2778d0a)',
		);
	});

	it('flags a failure that reports a payment as charged', async () => {
		respond(
			errorBody('upstream failed after settlement', {
				payment: {
					rail: 'wallet',
					settlementState: 'charged_undelivered',
					costUsd: 0.0011,
				},
			}),
			502,
		);

		const error = await failure(
			makeAnyApiRequest('aa-key', {
				method: 'POST',
				path: '/v1/run/a.b',
				body: {},
			}),
		);
		expect(error.status).toBe(502);
		expect(error.charged).toBe(true);
	});

	it('reads Retry-After from a 409 idempotency_in_progress response', async () => {
		respond(
			errorBody('in progress', { code: 'idempotency_in_progress' }),
			409,
			{
				'Retry-After': '2',
			},
		);

		const error = await failure(
			makeAnyApiRequest('aa-key', {
				method: 'POST',
				path: '/v1/run/a.b',
				body: {},
			}),
		);
		expect(error.code).toBe('idempotency_in_progress');
		expect(error.retryAfter).toBeGreaterThan(0);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeAnyApiRequest('aa-key', { method: 'GET', path: '/v1/balance' }),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
	});
});

describe('describeAnyApiError', () => {
	it('names the alternatives a 422 offers', () => {
		const body = {
			error: 'this API cannot serve that site',
			alternatives: ['web.scrape', { slug: 'web.scrape_js' }],
		};
		expect(describeAnyApiError(422, body, 'x')).toBe(
			'AnyAPI 422: this API cannot serve that site Try: web.scrape, web.scrape_js',
		);
	});

	it('falls back when the body has no error text', () => {
		expect(describeAnyApiError(503, '<html>down</html>', 'Unavailable')).toBe(
			'AnyAPI 503: Unavailable',
		);
		expect(describeAnyApiError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});
