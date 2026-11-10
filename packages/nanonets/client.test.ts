import {
	describeNanonetsError,
	makeNanonetsRequest,
	NanonetsAPIError,
} from './client';
import {
	error400,
	error401,
	error402,
	error429,
	error500,
	modelId,
	plainTextError,
	predictionEnvelope,
	requestFileId,
} from './test-fixtures';

const API_KEY = 'nn-test-key';

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
async function failure(promise: Promise<unknown>): Promise<NanonetsAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(NanonetsAPIError);
	if (!(error instanceof NanonetsAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		// No test may reach the network: a call nobody queued a response for fails.
		throw new Error('unmocked fetch');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeNanonetsRequest', () => {
	it('authenticates with HTTP Basic, the key as username and an empty password', async () => {
		respond(predictionEnvelope, 200);

		const result = await makeNanonetsRequest(API_KEY, {
			method: 'GET',
			path: `/Inferences/Model/${modelId}/InferenceRequestFiles/GetPredictions/${requestFileId}`,
		});

		expect(result).toEqual(predictionEnvelope);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			`https://app.nanonets.com/api/v2/Inferences/Model/${modelId}/InferenceRequestFiles/GetPredictions/${requestFileId}`,
		);
		expect(init.method).toBe('GET');
		const expectedAuthorization = `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`;
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(expectedAuthorization);
		expect(headers.get('authorization')).not.toMatch(/^Bearer /);
		expect(init.body).toBeUndefined();
	});

	it('merges query parameters into the URL', async () => {
		respond(predictionEnvelope, 200);

		await makeNanonetsRequest(API_KEY, {
			method: 'GET',
			path: `/Inferences/Model/${modelId}/ImageLevelInferences`,
			query: { start_day_interval: 20357, current_batch_day: 20360 },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			`https://app.nanonets.com/api/v2/Inferences/Model/${modelId}/ImageLevelInferences?start_day_interval=20357&current_batch_day=20360`,
		);
	});

	it('sends multipart form fields and no API key in the body', async () => {
		respond(predictionEnvelope, 200);

		await makeNanonetsRequest(API_KEY, {
			method: 'POST',
			path: `/OCR/Model/${modelId}/LabelFile/`,
			query: { async: true },
			form: {
				base64_data: 'aGVsbG8gbmFub25ldHM=',
				request_metadata: 'invoice-0042',
				pages_to_process: '1,2',
			},
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			`https://app.nanonets.com/api/v2/OCR/Model/${modelId}/LabelFile/?async=true`,
		);
		expect(init.body).toBeInstanceOf(FormData);
		const form = init.body as FormData;
		expect(form.get('base64_data')).toBe('aGVsbG8gbmFub25ldHM=');
		expect(form.get('request_metadata')).toBe('invoice-0042');
		expect(form.get('pages_to_process')).toBe('1,2');
		expect([...form.keys()].sort()).toEqual([
			'base64_data',
			'pages_to_process',
			'request_metadata',
		]);
		expect(form.get('api_key')).toBeNull();
		expect(form.get('apiKey')).toBeNull();
	});

	it('repeats array form values under one field name', async () => {
		respond(predictionEnvelope, 200);

		await makeNanonetsRequest(API_KEY, {
			method: 'POST',
			path: `/OCR/Model/${modelId}/LabelFile/`,
			form: {
				urls: ['https://img.example/a.png', 'https://img.example/b.png'],
			},
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const form = init.body as FormData;
		expect(form.getAll('urls')).toEqual([
			'https://img.example/a.png',
			'https://img.example/b.png',
		]);
	});

	it('sends a urlencoded raw body with repeated urls entries', async () => {
		respond(predictionEnvelope, 200);

		const rawBody = new URLSearchParams();
		rawBody.append('urls', 'https://img.example/a.png');
		rawBody.append('urls', 'https://img.example/b.png');

		await makeNanonetsRequest(API_KEY, {
			method: 'POST',
			path: `/OCR/Model/${modelId}/LabelUrls`,
			query: { async: true },
			rawBody: rawBody.toString(),
			mediaType: 'application/x-www-form-urlencoded',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			`https://app.nanonets.com/api/v2/OCR/Model/${modelId}/LabelUrls?async=true`,
		);
		expect(typeof init.body).toBe('string');
		const params = new URLSearchParams(init.body as string);
		expect(params.getAll('urls')).toEqual([
			'https://img.example/a.png',
			'https://img.example/b.png',
		]);
		const headers = new Headers(init.headers);
		expect(headers.get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
	});

	it('reads the message from an error body and echoes its code', async () => {
		respond(error400, 400);

		const error = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'POST',
				path: `/OCR/Model/${modelId}/LabelFile/`,
				form: { base64_data: 'aGVsbG8gbmFub25ldHM=' },
			}),
		);
		expect(error.status).toBe(400);
		expect(error.code).toBe(400);
		expect(error.message).toBe('Nanonets 400: No file attached');
		expect(error.body).toEqual(error400);
		expect(error.isRateLimit).toBe(false);
		expect(error.isQuotaExhausted).toBe(false);
	});

	it('treats a 429 as a rate limit, reads Retry-After and tries once', async () => {
		respond(error429, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'POST',
				path: `/OCR/Model/${modelId}/LabelUrls`,
				rawBody: 'urls=https%3A%2F%2Fimg.example%2Fa.png',
				mediaType: 'application/x-www-form-urlencoded',
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(error.message).toBe('Nanonets 429: Too many requests');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('marks a 402 as quota exhaustion', async () => {
		respond(error402, 402);

		const error = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'POST',
				path: `/OCR/Model/${modelId}/LabelFile/`,
				form: { base64_data: 'aGVsbG8gbmFub25ldHM=' },
			}),
		);
		expect(error.isQuotaExhausted).toBe(true);
		expect(error.status).toBe(402);
		expect(error.code).toBe(402);
		expect(error.message).toBe('Nanonets 402: Free API calls exhausted');
	});

	it('falls back to a plain-text error body', async () => {
		respond(plainTextError, 404);

		const error = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'GET',
				path: `/Inferences/Model/${modelId}/ImageLevelInferences/b1d5c0a2-3e47-4e89-9f21-7c8f5a3d6e10`,
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Nanonets 404: Model not found.');
		expect(error.body).toBe(plainTextError);
	});

	it('carries the replay-safe flag onto errors', async () => {
		respond(error500, 500);

		const safe = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'GET',
				path: `/Inferences/Model/${modelId}/InferenceRequestFiles/GetPredictions/${requestFileId}`,
				replaySafe: true,
			}),
		);
		expect(safe.replaySafe).toBe(true);
		expect(safe.status).toBe(500);

		respond(error500, 500);
		const unsafe = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'POST',
				path: `/OCR/Model/${modelId}/LabelFile/`,
				form: { base64_data: 'aGVsbG8gbmFub25ldHM=' },
			}),
		);
		expect(unsafe.replaySafe).toBe(false);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'GET',
				path: '/externalIntegrations',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'GET',
				path: '/externalIntegrations',
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('leaves the API key out of errors', async () => {
		respond(error401, 401);

		const error = await failure(
			makeNanonetsRequest(API_KEY, {
				method: 'GET',
				path: '/externalIntegrations',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		const causeJson = error.cause ? JSON.stringify(error.cause) : '';
		expect(causeJson).not.toContain(API_KEY);
	});
});

describe('describeNanonetsError', () => {
	it('uses plain-text bodies directly', () => {
		expect(describeNanonetsError(404, plainTextError, 'Not Found')).toBe(
			'Nanonets 404: Model not found.',
		);
	});

	it('falls back when the body carries no message', () => {
		expect(describeNanonetsError(503, undefined, 'Service Unavailable')).toBe(
			'Nanonets 503: Service Unavailable',
		);
		expect(
			describeNanonetsError(500, { code: 500 }, 'Internal Server Error'),
		).toBe('Nanonets 500: Internal Server Error');
		expect(describeNanonetsError(undefined, undefined, 'fetch failed')).toBe(
			'fetch failed',
		);
	});
});
