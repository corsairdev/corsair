import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	makeSuzanneDownloadRequest,
	makeSuzanneRequest,
	SUZANNE_API_BASE,
	SuzanneAPIError,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

// jest.mock replaces request but the imported binding stays a function type.
const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [
	OpenAPIConfig,
	ApiRequestOptions,
	{ rateLimitConfig?: { enabled?: boolean; maxRetries?: number } },
] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	// jest.MockedFunction hides the rateLimitConfig argument on request().
	return call as unknown as [
		OpenAPIConfig,
		ApiRequestOptions,
		{ rateLimitConfig?: { enabled?: boolean; maxRetries?: number } },
	];
}

beforeEach(() => {
	mockRequest.mockReset();
	jest.restoreAllMocks();
});

describe('suzanne client', () => {
	it('sends a bearer token and does not retry inside the transport', async () => {
		mockRequest.mockResolvedValue({ ok: true });
		await makeSuzanneRequest('/v1/jobs/job_1', 'x_key_test');
		const [config, , requestOptions] = lastCall();
		expect(config.BASE).toBe(SUZANNE_API_BASE);
		expect(config.TOKEN).toBe('x_key_test');
		expect(requestOptions.rateLimitConfig).toMatchObject({
			enabled: true,
			maxRetries: 0,
		});
	});

	it('reads an object error envelope instead of [object Object]', async () => {
		const body = {
			error: {
				type: 'invalid_request',
				code: 'idempotency_key_conflict',
				message: 'different body',
				request_id: 'req_1',
			},
		};
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/v1/generations/text-to-3d' },
				{
					url: 'https://api.suzanne3d.com/v1/generations/text-to-3d',
					ok: false,
					status: 409,
					statusText: 'Conflict',
					body,
				},
				'[object Object]',
			),
		);
		await expect(
			makeSuzanneRequest('/v1/generations/text-to-3d', 'x_key_test', {
				method: 'POST',
				body: {},
			}),
		).rejects.toMatchObject({
			status: 409,
			code: 'idempotency_key_conflict',
		});
	});

	it('makes one fetch on a 429 and keeps Retry-After', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/v1/jobs/job_1' },
				{
					url: 'https://api.suzanne3d.com/v1/jobs/job_1',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {
						error: {
							code: 'rate_limit',
							message: 'slow down',
							type: 'rate_limit',
							request_id: 'r',
						},
					},
				},
				'Too Many Requests',
				{ retryAfter: 1500 },
			),
		);
		try {
			await makeSuzanneRequest('/v1/jobs/job_1', 'x_key_test');
			throw new Error('expected a 429');
		} catch (error) {
			expect(error).toBeInstanceOf(SuzanneAPIError);
			// catch bindings are unknown to the checker.
			const apiError = error as SuzanneAPIError;
			expect(apiError.retryAfter).toBe(1500);
			expect(mockRequest).toHaveBeenCalledTimes(1);
		}
	});

	it('returns a download Location and copies Retry-After on 429', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response(null, {
				status: 302,
				headers: { Location: 'https://s3.example/mesh.glb' },
			}),
		);
		await expect(
			makeSuzanneDownloadRequest('x_key_test', {
				jobId: 'job 1',
				format: 'glb',
			}),
		).resolves.toEqual({ url: 'https://s3.example/mesh.glb' });
		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.suzanne3d.com/v1/models/job%201/download?format=glb',
			expect.objectContaining({ redirect: 'manual' }),
		);

		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					error: {
						code: 'rate_limit',
						message: 'slow',
						type: 'rate_limit',
						request_id: 'r',
					},
				}),
				{ status: 429, headers: { 'Retry-After': '30' } },
			),
		);
		await expect(
			makeSuzanneDownloadRequest('x_key_test', {
				jobId: 'job_1',
				format: 'glb',
			}),
		).rejects.toMatchObject({ status: 429, retryAfter: 30_000 });
	});
});
