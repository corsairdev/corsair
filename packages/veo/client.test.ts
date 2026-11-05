import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeVeoRequest,
	parseOperationName,
	tryGetStoredKey,
	veoHost,
	veoModelPath,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Veo HTTP client', () => {
	it('uses the regional host and the global host', () => {
		expect(veoHost('us-central1')).toBe(
			'https://us-central1-aiplatform.googleapis.com',
		);
		expect(veoHost('global')).toBe('https://aiplatform.googleapis.com');
	});

	it('builds the documented predict and fetch paths', () => {
		expect(
			veoModelPath(
				'my-proj',
				'us-central1',
				'veo-3.1-generate-001',
				'predictLongRunning',
			),
		).toBe(
			'/v1/projects/my-proj/locations/us-central1/publishers/google/models/veo-3.1-generate-001:predictLongRunning',
		);
		expect(
			veoModelPath(
				'my-proj',
				'us-central1',
				'veo-3.1-generate-001',
				'fetchPredictOperation',
			),
		).toBe(
			'/v1/projects/my-proj/locations/us-central1/publishers/google/models/veo-3.1-generate-001:fetchPredictOperation',
		);
	});

	it('parses a full operation name', () => {
		expect(
			parseOperationName(
				'projects/my-proj/locations/us-central1/publishers/google/models/veo-3.1-generate-001/operations/op-1',
			),
		).toEqual({
			projectId: 'my-proj',
			location: 'us-central1',
			model: 'veo-3.1-generate-001',
			operationId: 'op-1',
		});
		expect(parseOperationName('operations/op-1')).toBeUndefined();
	});

	it('sends a bearer token and does not retry inside the transport', async () => {
		mockRequest.mockResolvedValue({ name: 'operations/1' });
		await makeVeoRequest(
			'https://us-central1-aiplatform.googleapis.com',
			'/v1/projects/p/locations/us-central1/publishers/google/models/veo-3.1-generate-001:predictLongRunning',
			'ya29.token',
			{
				body: { instances: [{ prompt: 'a cat' }] },
			},
		);

		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://us-central1-aiplatform.googleapis.com',
			HEADERS: {
				Authorization: 'Bearer ya29.token',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { instances: [{ prompt: 'a cat' }] },
			}),
		);
		const retryConfig = mockRequest.mock.calls[0]?.[2]?.rateLimitConfig;
		expect(retryConfig?.maxRetries).toBe(0);
		expect(retryConfig?.isRateLimitError?.(429, {})).toBe(true);
		expect(retryConfig?.isRateLimitError?.(503, {})).toBe(false);
	});

	it('rejects a missing access token before calling the API', async () => {
		await expect(
			makeVeoRequest('https://aiplatform.googleapis.com', '/v1/x', '', {
				body: {},
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError so status codes survive', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/v1/x' },
			{
				url: 'https://aiplatform.googleapis.com/v1/x',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Resource exhausted',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			makeVeoRequest('https://aiplatform.googleapis.com', '/v1/x', 'token', {
				body: {},
			}),
		).rejects.toBe(error);
	});

	it('treats a missing DEK as no stored key', async () => {
		await expect(
			tryGetStoredKey(() =>
				Promise.reject(new Error('No DEK found for account (tenant: "t")')),
			),
		).resolves.toBeUndefined();
		await expect(
			tryGetStoredKey(() => Promise.reject(new Error('decrypt failed'))),
		).rejects.toThrow('decrypt failed');
	});
});
