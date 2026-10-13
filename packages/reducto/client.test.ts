import type { ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	makeReductoRequest,
	REDUCTO_API_BASE,
	ReductoAPIError,
} from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	body: { error: { name: string } },
	retryAfter?: number,
): ApiError {
	const result: ApiResult = {
		url: `${REDUCTO_API_BASE}/parse`,
		ok: false,
		status,
		statusText: '',
		body,
	};
	return new ApiError(
		{ method: 'POST', url: '/parse' },
		result,
		'request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('makeReductoRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ version: '1.0.0' });
	});

	it('calls the documented host with the bearer token', async () => {
		await makeReductoRequest('/version', 'test-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: REDUCTO_API_BASE,
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/version',
			}),
			expect.anything(),
		);
	});

	it('retries 429 only for GET', async () => {
		await makeReductoRequest('/version', 'test-key');
		await makeReductoRequest('/parse', 'test-key', {
			method: 'POST',
			body: { input: 'https://cdn.reducto.ai/samples/fidelity-example.pdf' },
		});
		await makeReductoRequest('/job/{job_id}', 'test-key', {
			method: 'DELETE',
			path: { job_id: 'job-1' },
		});

		const rateLimit = (call: number) =>
			mockRequest.mock.calls[call]?.[2]?.rateLimitConfig;

		expect(rateLimit(0)).toMatchObject({ enabled: true, maxRetries: 3 });
		expect(rateLimit(1)).toMatchObject({ enabled: false, maxRetries: 0 });
		expect(rateLimit(2)).toMatchObject({ enabled: false, maxRetries: 0 });
	});

	it('sends JSON only when there is a JSON body', async () => {
		const file = new Blob(['hello']);
		await makeReductoRequest('/upload', 'test-key', {
			method: 'POST',
			formData: { file },
			query: { extension: 'txt' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				formData: { file },
				body: undefined,
				mediaType: undefined,
				query: { extension: 'txt' },
			}),
			expect.anything(),
		);
	});

	it('keeps status, method, and the error body on ReductoAPIError', async () => {
		mockRequest.mockRejectedValue(
			apiError(422, { error: { name: 'NOT_APPLICABLE' } }, 1500),
		);

		const error = await makeReductoRequest('/parse', 'test-key', {
			method: 'POST',
			body: { input: 'https://example.com/a.pdf' },
		}).then(
			() => {
				throw new Error('expected ReductoAPIError');
			},
			(caught: Error) => caught,
		);

		expect(error).toBeInstanceOf(ReductoAPIError);
		if (!(error instanceof ReductoAPIError)) return;
		expect(error.status).toBe(422);
		expect(error.method).toBe('POST');
		expect(error.retryAfter).toBe(1500);
		expect(error.message).toContain('NOT_APPLICABLE');
	});
});
