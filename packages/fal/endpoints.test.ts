import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeFalRequest, putToSignedUrl, waitOnStatusStream } from './client';
import { billing as accountBilling } from './endpoints/account';
import { upload as filesUpload } from './endpoints/files';
import {
	estimateCost as modelsEstimateCost,
	pricing as modelsPricing,
	run as modelsRun,
	search as modelsSearch,
} from './endpoints/models';
import {
	cancel as queueCancel,
	result as queueResult,
	status as queueStatus,
	submit as queueSubmit,
} from './endpoints/queue';
import {
	deletePayloads as requestsDeletePayloads,
	list as requestsList,
} from './endpoints/requests';
import {
	billingEvents as usageBillingEvents,
	get as usageGet,
} from './endpoints/usage';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeFalRequest: jest.fn(),
	putToSignedUrl: jest.fn().mockResolvedValue(undefined),
	waitOnStatusStream: jest.fn().mockResolvedValue('completed'),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeFalRequest as jest.MockedFunction<
	typeof makeFalRequest
>;
const mockPut = putToSignedUrl as jest.MockedFunction<typeof putToSignedUrl>;
const mockStream = waitOnStatusStream as jest.MockedFunction<
	typeof waitOnStatusStream
>;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

// Endpoints only read ctx.key; the rest of the context is the runtime's.
// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: 'fal-test-key' } as unknown as Parameters<
	typeof queueSubmit
>[0];

const REQUEST_ID = '01a1b266-5b01-74f3-9ff7-03a43d7a2cc5';
const RESPONSE_URL = `https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`;
const BASE = `/fal-ai/flux/requests/${REQUEST_ID}`;

const queued = {
	status: 'IN_QUEUE',
	request_id: REQUEST_ID,
	response_url: RESPONSE_URL,
	status_url: `${RESPONSE_URL}/status`,
	cancel_url: `${RESPONSE_URL}/cancel`,
	logs: null,
	metrics: {},
	queue_position: 0,
};

const output = {
	images: [
		{
			url: 'https://v3b.fal.media/files/b/0ab16b11/lighthouse.jpg',
			width: 512,
			height: 512,
			content_type: 'image/jpeg',
		},
	],
	seed: 35683856,
};

// unknown: error bodies are arbitrary JSON.
function apiError(status: number, body: unknown): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/x' },
		{ url: 'https://queue.fal.run/x', ok: false, status, statusText: '', body },
		'fal error',
	);
}

beforeEach(() => {
	mockRequest.mockReset();
	mockPut.mockClear();
	mockStream.mockClear();
	mockLog.mockClear();
});

describe('queue.submit', () => {
	it('posts the input to the full endpoint path with webhook and headers', async () => {
		mockRequest.mockResolvedValueOnce(queued);
		const response = await queueSubmit(ctx, {
			endpointId: 'fal-ai/flux/schnell',
			input: { prompt: 'a lighthouse' },
			webhookUrl: 'https://example.com/hooks/fal',
			priority: 'low',
			startTimeout: 30,
			noRetry: true,
			maxQueueLength: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'queue',
			'/fal-ai/flux/schnell',
			'fal-test-key',
			expect.objectContaining({
				method: 'POST',
				body: { prompt: 'a lighthouse' },
				query: {
					fal_webhook: 'https://example.com/hooks/fal',
					fal_max_queue_length: 10,
				},
				headers: expect.objectContaining({
					'X-Fal-Queue-Priority': 'low',
					'X-Fal-Request-Start-Timeout': '30',
					'X-Fal-No-Retry': '1',
				}),
			}),
		);
		expect(response.request_id).toBe(REQUEST_ID);
		expect(response.response_url).toBe(RESPONSE_URL);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'fal.queue.submit',
			{ endpointId: 'fal-ai/flux/schnell', requestId: REQUEST_ID },
			'completed',
		);
	});

	it('rejects an endpoint id that is not owner/app', async () => {
		await expect(
			queueSubmit(ctx, { endpointId: 'flux', input: {} }),
		).rejects.toThrow();
		await expect(
			queueSubmit(ctx, { endpointId: 'fal-ai/../keys', input: {} }),
		).rejects.toThrow('not a fal endpoint id');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('queue.status', () => {
	it('reports IN_QUEUE without reading the result', async () => {
		mockRequest.mockResolvedValueOnce({ ...queued, queue_position: 3 });
		const response = await queueStatus(ctx, {
			endpointId: 'fal-ai/flux/schnell',
			requestId: REQUEST_ID,
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledWith(
			'queue',
			`${BASE}/status`,
			'fal-test-key',
			{ method: 'GET', query: { logs: undefined } },
		);
		expect(response.state).toBe('IN_QUEUE');
		expect(response.queue_position).toBe(3);
	});

	it('reports IN_PROGRESS and asks for logs', async () => {
		mockRequest.mockResolvedValueOnce({ ...queued, status: 'IN_PROGRESS' });
		const response = await queueStatus(ctx, {
			responseUrl: RESPONSE_URL,
			logs: true,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'queue',
			`${BASE}/status`,
			'fal-test-key',
			{ method: 'GET', query: { logs: '1' } },
		);
		expect(response.state).toBe('IN_PROGRESS');
	});

	it('reads the result once COMPLETED and answers SUCCEEDED with the output', async () => {
		mockRequest
			.mockResolvedValueOnce({
				...queued,
				status: 'COMPLETED',
				metrics: { inference_time: 0.73 },
			})
			.mockResolvedValueOnce(output);
		const response = await queueStatus(ctx, { responseUrl: RESPONSE_URL });
		expect(mockRequest).toHaveBeenLastCalledWith(
			'queue',
			BASE,
			'fal-test-key',
			{ method: 'GET' },
		);
		expect(response.state).toBe('SUCCEEDED');
		expect(response.output).toEqual(output);
	});

	it('answers FAILED when the result read is a validation error', async () => {
		mockRequest
			.mockResolvedValueOnce({ ...queued, status: 'COMPLETED' })
			.mockRejectedValueOnce(
				apiError(422, {
					detail: [
						{ type: 'missing', loc: ['body', 'prompt'], msg: 'Field required' },
					],
				}),
			);
		const response = await queueStatus(ctx, { responseUrl: RESPONSE_URL });
		expect(response.state).toBe('FAILED');
		expect(response.error).toBe('422: body.prompt: Field required');
		expect(response.output).toBeUndefined();
	});

	it('answers FAILED from the status error without reading the result', async () => {
		mockRequest.mockResolvedValueOnce({
			...queued,
			status: 'COMPLETED',
			error: 'Request timed out',
			error_type: 'request_timeout',
		});
		const response = await queueStatus(ctx, { responseUrl: RESPONSE_URL });
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(response.state).toBe('FAILED');
		expect(response.error).toBe('Request timed out');
	});

	it.each([401, 403, 404])(
		'raises a %s on the result read instead of calling the run FAILED',
		async (code) => {
			mockRequest
				.mockResolvedValueOnce({ ...queued, status: 'COMPLETED' })
				.mockRejectedValueOnce(apiError(code, { detail: 'no access' }));
			await expect(
				queueStatus(ctx, { responseUrl: RESPONSE_URL }),
			).rejects.toMatchObject({ status: code });
		},
	);

	it('rethrows a passing server fault on the result read so it is asked again', async () => {
		mockRequest
			.mockResolvedValueOnce({ ...queued, status: 'COMPLETED' })
			.mockRejectedValueOnce(apiError(503, 'upstream unavailable'));
		await expect(
			queueStatus(ctx, { responseUrl: RESPONSE_URL }),
		).rejects.toBeInstanceOf(ApiError);
	});

	it('requires endpointId + requestId or responseUrl', async () => {
		await expect(queueStatus(ctx, { requestId: REQUEST_ID })).rejects.toThrow(
			'Pass endpointId and requestId',
		);
		await expect(
			queueStatus(ctx, {
				responseUrl: `https://evil.example.com/fal-ai/flux/requests/${REQUEST_ID}`,
			}),
		).rejects.toThrow('responseUrl must be');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('queue.result', () => {
	it('reads the output from the app path, not the endpoint path', async () => {
		mockRequest.mockResolvedValueOnce(output);
		const response = await queueResult(ctx, {
			endpointId: 'fal-ai/flux/schnell',
			requestId: REQUEST_ID,
		});
		expect(mockRequest).toHaveBeenCalledWith('queue', BASE, 'fal-test-key', {
			method: 'GET',
		});
		expect(response).toEqual(output);
	});
});

describe('queue.cancel', () => {
	it('cancels a waiting request', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'OK' });
		const response = await queueCancel(ctx, { responseUrl: RESPONSE_URL });
		expect(mockRequest).toHaveBeenCalledWith(
			'queue',
			`${BASE}/cancel`,
			'fal-test-key',
			{ method: 'PUT' },
		);
		expect(response.status).toBe('OK');
	});

	it('returns ALREADY_COMPLETED (HTTP 400) as an answer', async () => {
		mockRequest.mockRejectedValueOnce(
			apiError(400, { status: 'ALREADY_COMPLETED' }),
		);
		const response = await queueCancel(ctx, { responseUrl: RESPONSE_URL });
		expect(response.status).toBe('ALREADY_COMPLETED');
	});

	it('returns NOT_FOUND (HTTP 404) as an answer', async () => {
		mockRequest.mockRejectedValueOnce(apiError(404, { status: 'NOT_FOUND' }));
		const response = await queueCancel(ctx, {
			endpointId: 'fal-ai/flux/dev',
			requestId: REQUEST_ID,
		});
		expect(response.status).toBe('NOT_FOUND');
	});

	it('rethrows other errors', async () => {
		mockRequest.mockRejectedValueOnce(apiError(401, { detail: 'No key' }));
		await expect(
			queueCancel(ctx, { responseUrl: RESPONSE_URL }),
		).rejects.toBeInstanceOf(ApiError);
	});
});

describe('models', () => {
	it('run waits on the status stream and answers SUCCEEDED with the output', async () => {
		mockStream.mockResolvedValueOnce('completed');
		mockRequest
			.mockResolvedValueOnce(queued)
			.mockResolvedValueOnce({ ...queued, status: 'COMPLETED' })
			.mockResolvedValueOnce(output);
		const response = await modelsRun(ctx, {
			endpointId: 'fal-ai/flux/schnell',
			input: { prompt: 'a lighthouse' },
			waitSeconds: 5,
		});
		expect(mockStream).toHaveBeenCalledWith(
			'fal-test-key',
			BASE,
			expect.any(Number),
		);
		expect(
			mockRequest.mock.calls.map(([host, path]) => `${host} ${path}`),
		).toEqual([
			'queue /fal-ai/flux/schnell',
			`queue ${BASE}/status`,
			`queue ${BASE}`,
		]);
		expect(response).toMatchObject({
			state: 'SUCCEEDED',
			output,
			request_id: REQUEST_ID,
			response_url: RESPONSE_URL,
		});
	});

	it('run polls the status when the stream is unavailable', async () => {
		mockStream.mockResolvedValueOnce('unavailable');
		mockRequest
			.mockResolvedValueOnce(queued)
			.mockResolvedValueOnce({ ...queued, status: 'IN_QUEUE' })
			.mockResolvedValueOnce({ ...queued, status: 'COMPLETED' })
			.mockResolvedValueOnce(output);
		const response = await modelsRun(ctx, {
			endpointId: 'fal-ai/flux/schnell',
			input: { prompt: 'a lighthouse' },
			waitSeconds: 5,
		});
		expect(
			mockRequest.mock.calls.map(([host, path]) => `${host} ${path}`),
		).toEqual([
			'queue /fal-ai/flux/schnell',
			`queue ${BASE}/status`,
			`queue ${BASE}/status`,
			`queue ${BASE}`,
		]);
		expect(response).toMatchObject({ state: 'SUCCEEDED', output });
	});

	it('run hands back a video still rendering as a job, not a timeout', async () => {
		mockStream.mockResolvedValueOnce('waiting');
		mockRequest
			.mockResolvedValueOnce(queued)
			.mockResolvedValueOnce({ ...queued, status: 'IN_PROGRESS' });
		const response = await modelsRun(ctx, {
			endpointId: 'fal-ai/minimax/hailuo-02/standard/text-to-video',
			input: { prompt: 'a red kite over a beach' },
			waitSeconds: 1,
		});
		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(response).toMatchObject({
			state: 'IN_PROGRESS',
			request_id: REQUEST_ID,
			response_url: RESPONSE_URL,
		});
		expect(response.output).toBeUndefined();
	});

	it('run with no wait answers the queued job without reading it', async () => {
		mockRequest.mockResolvedValueOnce(queued);
		const response = await modelsRun(ctx, {
			endpointId: 'fal-ai/flux/schnell',
			input: { prompt: 'a lighthouse' },
			waitSeconds: 0,
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(response).toMatchObject({
			state: 'IN_QUEUE',
			response_url: RESPONSE_URL,
		});
	});

	it.each([
		['a 429', () => apiError(429, { detail: 'Too many requests' })],
		['a network error', () => new Error('ECONNRESET')],
	])(
		'run answers the accepted job, not an error, when a read hits %s',
		async (_case, failure) => {
			mockStream.mockResolvedValueOnce('completed');
			mockRequest
				.mockResolvedValueOnce(queued)
				.mockRejectedValueOnce(failure());
			const response = await modelsRun(ctx, {
				endpointId: 'fal-ai/flux/schnell',
				input: { prompt: 'a lighthouse' },
				waitSeconds: 2,
			});
			// One submit only: a thrown 429 would make the rate-limit handler
			// run the whole operation, and pay for the run, again.
			expect(
				mockRequest.mock.calls.filter(
					([, path]) => path === '/fal-ai/flux/schnell',
				),
			).toHaveLength(1);
			expect(response).toMatchObject({
				state: 'IN_QUEUE',
				response_url: RESPONSE_URL,
			});
		},
	);

	it('run returns the job when a read is slower than the wait', async () => {
		mockStream.mockResolvedValueOnce('waiting');
		mockRequest
			.mockResolvedValueOnce(queued)
			.mockReturnValueOnce(new Promise(() => undefined));
		const started = Date.now();
		const response = await modelsRun(ctx, {
			endpointId: 'fal-ai/minimax/hailuo-02/standard/text-to-video',
			input: { prompt: 'a red kite over a beach' },
			waitSeconds: 1,
		});
		expect(Date.now() - started).toBeLessThan(1_500);
		expect(response).toMatchObject({
			state: 'IN_QUEUE',
			response_url: RESPONSE_URL,
		});
	});

	it('run gives the stream the wait minus time for the closing read', async () => {
		mockStream.mockResolvedValueOnce('waiting');
		mockRequest
			.mockResolvedValueOnce(queued)
			.mockResolvedValueOnce({ ...queued, status: 'IN_PROGRESS' });
		await modelsRun(ctx, {
			endpointId: 'fal-ai/flux/schnell',
			input: {},
			waitSeconds: 10,
		});
		const streamMs = mockStream.mock.calls[0]![2];
		expect(streamMs).toBeLessThanOrEqual(7_500);
		expect(streamMs).toBeGreaterThan(7_000);
	});

	it('run refuses a wait longer than a script can hold', async () => {
		await expect(
			modelsRun(ctx, {
				endpointId: 'fal-ai/flux/schnell',
				input: {},
				waitSeconds: 16,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('search maps filters to the Platform API query', async () => {
		mockRequest.mockResolvedValueOnce({
			models: [
				{
					endpoint_id: 'fal-ai/kling-video/v2.1/master/text-to-video',
					metadata: {
						display_name: 'Kling 2.1 Master',
						category: 'text-to-video',
					},
				},
			],
			next_cursor: 'Mg==',
			has_more: true,
		});
		const response = await modelsSearch(ctx, {
			query: 'video',
			category: 'text-to-video',
			endpointIds: ['fal-ai/kling-video/v2.1/master/text-to-video'],
			includeOpenApi: true,
			limit: 5,
		});
		expect(mockRequest).toHaveBeenCalledWith('api', '/models', 'fal-test-key', {
			method: 'GET',
			query: {
				q: 'video',
				category: 'text-to-video',
				status: undefined,
				endpoint_id: ['fal-ai/kling-video/v2.1/master/text-to-video'],
				sort: undefined,
				expand: 'openapi-3.0',
				limit: 5,
				cursor: undefined,
			},
		});
		expect(response.models[0]?.metadata?.category).toBe('text-to-video');
		expect(response.has_more).toBe(true);
	});

	it('pricing asks for the given endpoints', async () => {
		mockRequest.mockResolvedValueOnce({
			prices: [
				{
					endpoint_id: 'fal-ai/flux/schnell',
					unit_price: 0.003,
					unit: 'megapixels',
					currency: 'USD',
				},
			],
			next_cursor: null,
			has_more: false,
		});
		const response = await modelsPricing(ctx, {
			endpointIds: ['fal-ai/flux/schnell'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'api',
			'/models/pricing',
			'fal-test-key',
			{ method: 'GET', query: { endpoint_id: ['fal-ai/flux/schnell'] } },
		);
		expect(response.prices[0]?.unit_price).toBe(0.003);
	});

	it.each([
		['historical_api_price', 'call_quantity'],
		['unit_price', 'unit_quantity'],
	] as const)('estimateCost (%s) sends %s', async (estimateType, field) => {
		mockRequest.mockResolvedValueOnce({
			estimate_type: estimateType,
			total_cost: 0.3,
			currency: 'USD',
		});
		const response = await modelsEstimateCost(ctx, {
			estimateType,
			endpoints: { 'fal-ai/flux/schnell': { quantity: 100 } },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'api',
			'/models/pricing/estimate',
			'fal-test-key',
			{
				method: 'POST',
				body: {
					estimate_type: estimateType,
					endpoints: { 'fal-ai/flux/schnell': { [field]: 100 } },
				},
			},
		);
		expect(response.total_cost).toBe(0.3);
	});
});

describe('requests', () => {
	const record = {
		request_id: REQUEST_ID,
		endpoint_id: 'fal-ai/flux/schnell',
		started_at: '2026-11-07T01:00:00Z',
		sent_at: '2026-11-07T01:00:00Z',
		ended_at: '2026-11-07T01:00:01Z',
		status_code: 200,
		duration: 0.7,
	};

	it('list sends filters and expands payloads', async () => {
		mockRequest.mockResolvedValueOnce({
			items: [record],
			next_cursor: null,
			has_more: false,
		});
		const response = await requestsList(ctx, {
			endpointIds: ['fal-ai/flux/schnell'],
			status: 'success',
			includePayloads: true,
			limit: 10,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'api',
			'/models/requests/by-endpoint',
			'fal-test-key',
			{
				method: 'GET',
				query: expect.objectContaining({
					endpoint_id: ['fal-ai/flux/schnell'],
					status: 'success',
					expand: 'payloads',
					limit: 10,
				}),
			},
		);
		expect(response.items[0]?.request_id).toBe(REQUEST_ID);
	});

	it('deletePayloads deletes by request id', async () => {
		mockRequest.mockResolvedValueOnce({
			cdn_delete_results: [{ link: output.images[0]!.url, exception: null }],
		});
		const response = await requestsDeletePayloads(ctx, {
			requestId: REQUEST_ID,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'api',
			`/models/requests/${REQUEST_ID}/payloads`,
			'fal-test-key',
			{ method: 'DELETE' },
		);
		expect(response.cdn_delete_results).toHaveLength(1);
	});
});

describe('usage and account', () => {
	const line = {
		endpoint_id: 'fal-ai/flux/schnell',
		unit: 'megapixels',
		quantity: 0.26,
		unit_price: 0.003,
		percent_discount: null,
		cost_subtotal: 0.0008,
		cost_discount: 0,
		cost_total: 0.0008,
		cost: 0.0008,
		currency: 'USD',
	};

	it('usage.get sends the range and expansions', async () => {
		mockRequest.mockResolvedValueOnce({
			time_series: [{ bucket: '2026-11-07T00:00:00Z', results: [line] }],
			summary: [line],
			next_cursor: null,
			has_more: false,
		});
		const response = await usageGet(ctx, {
			start: '2026-11-01',
			end: '2026-11-08',
			timeframe: 'day',
			expand: ['time_series', 'summary'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'api',
			'/models/usage',
			'fal-test-key',
			{
				method: 'GET',
				query: expect.objectContaining({
					start: '2026-11-01',
					end: '2026-11-08',
					timeframe: 'day',
					expand: ['time_series', 'summary'],
				}),
			},
		);
		expect(response.summary?.[0]?.cost_total).toBe(0.0008);
	});

	it('usage.billingEvents filters by request ids', async () => {
		mockRequest.mockResolvedValueOnce({
			billing_events: [
				{
					request_id: REQUEST_ID,
					endpoint_id: 'fal-ai/flux/schnell',
					timestamp: '2026-11-07T01:00:01Z',
					quantity: 0.26,
					unit: 'megapixels',
					unit_price: 0.003,
					cost_subtotal: 0.0008,
					cost_discount: 0,
					cost_total: 0.0008,
					cost_estimate_nano_usd: 800000,
				},
			],
			next_cursor: null,
			has_more: false,
		});
		const response = await usageBillingEvents(ctx, {
			requestIds: [REQUEST_ID],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'api',
			'/models/billing-events',
			'fal-test-key',
			{
				method: 'GET',
				query: expect.objectContaining({ request_id: [REQUEST_ID] }),
			},
		);
		expect(response.billing_events[0]?.cost_total).toBe(0.0008);
	});

	it('account.billing asks for the credit balance', async () => {
		mockRequest.mockResolvedValueOnce({
			username: 'corsair',
			credits: { current_balance: 12.5, currency: 'USD' },
		});
		const response = await accountBilling(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			'api',
			'/account/billing',
			'fal-test-key',
			{ method: 'GET', query: { expand: 'credits' } },
		);
		expect(response.credits?.current_balance).toBe(12.5);
	});
});

describe('files.upload', () => {
	const png = Buffer.from('89504e470d0a1a0a', 'hex').toString('base64');

	it('initiates an upload, PUTs the bytes and returns the file URL', async () => {
		mockRequest.mockResolvedValueOnce({
			upload_url: 'https://storage.example/signed?sig=abc',
			file_url: 'https://v3b.fal.media/files/b/x/pixel.png',
		});
		const response = await filesUpload(ctx, {
			contentBase64: `data:image/png;base64,${png}`,
			contentType: 'image/png',
			fileName: 'pixel.png',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'rest',
			'/storage/upload/initiate',
			'fal-test-key',
			{
				method: 'POST',
				query: { storage_type: 'fal-cdn-v3' },
				body: { content_type: 'image/png', file_name: 'pixel.png' },
			},
		);
		expect(mockPut).toHaveBeenCalledWith(
			'https://storage.example/signed?sig=abc',
			expect.any(Uint8Array),
			'image/png',
		);
		expect(mockPut.mock.calls[0]?.[1]).toHaveLength(8);
		expect(response).toEqual({
			file_url: 'https://v3b.fal.media/files/b/x/pixel.png',
			file_name: 'pixel.png',
			content_type: 'image/png',
			size: 8,
		});
	});

	it('accepts unpadded and URL-safe base64', async () => {
		mockRequest.mockResolvedValueOnce({
			upload_url: 'https://storage.example/signed',
			file_url: 'https://v3b.fal.media/files/b/x/f.bin',
		});
		const response = await filesUpload(ctx, {
			// "ab?" in URL-safe base64 without padding.
			contentBase64: 'YWI_',
			contentType: 'application/octet-stream',
		});
		expect(response.size).toBe(3);
		expect(Buffer.from(mockPut.mock.calls[0]![1]).toString()).toBe('ab?');
	});

	it.each([
		['an incomplete last group', 'YWJjA'],
		['padding that does not complete a group', 'YWJj='],
		['padding in the middle', 'YW=Jj'],
	])('refuses %s instead of uploading fewer bytes', async (_case, content) => {
		await expect(
			filesUpload(ctx, { contentBase64: content, contentType: 'text/plain' }),
		).rejects.toThrow('not valid base64');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses content that is not base64', async () => {
		await expect(
			filesUpload(ctx, {
				contentBase64: 'not base64!',
				contentType: 'image/png',
			}),
		).rejects.toThrow('not valid base64');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
