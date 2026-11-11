import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CLOUDCONVERT_API_BASE,
	CLOUDCONVERT_SYNC_API_BASE,
	makeCloudConvertRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function rateLimitError() {
	return new ApiError(
		{ method: 'GET', url: '/tasks' },
		{
			url: 'https://api.cloudconvert.com/v2/tasks',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: { code: 'TOO_MANY_REQUESTS' },
		},
		'Too Many Requests',
		{ retryAfter: 1800 },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeCloudConvertRequest', () => {
	it('uses the v2 base URL and Authorization: Bearer <key>', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'job-123' } });

		await makeCloudConvertRequest('fixture-api-key', {
			method: 'POST',
			path: '/jobs',
			body: { tasks: { export: { operation: 'export/s3' } } },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDCONVERT_API_BASE,
			VERSION: 'v2',
			HEADERS: {
				Authorization: 'Bearer fixture-api-key',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/jobs',
				body: { tasks: { export: { operation: 'export/s3' } } },
			}),
		);
	});

	it('omits Authorization when called without a key', async () => {
		mockedRequest.mockResolvedValue({ data: [] });

		await makeCloudConvertRequest(undefined, {
			method: 'GET',
			path: '/operations',
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(CLOUDCONVERT_API_BASE);
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('uses the sync API base for a synchronous GET', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'task-123' } });

		await makeCloudConvertRequest('fixture-api-key', {
			method: 'GET',
			path: '/tasks/task-123',
			host: 'sync',
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(
			CLOUDCONVERT_SYNC_API_BASE,
		);
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).toMatchObject({
			Authorization: 'Bearer fixture-api-key',
		});
	});

	it('uses the sync API base for a synchronous POST', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'job-123' } });

		await makeCloudConvertRequest('fixture-api-key', {
			method: 'POST',
			path: '/jobs',
			host: 'sync',
			body: { tasks: { export: { operation: 'export/url' } }, redirect: false },
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(
			CLOUDCONVERT_SYNC_API_BASE,
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/jobs',
				body: {
					tasks: { export: { operation: 'export/url' } },
					redirect: false,
				},
			}),
		);
	});

	it('sends DELETE without a request body and accepts a bodyless 204 response', async () => {
		mockedRequest.mockResolvedValue(undefined);

		await expect(
			makeCloudConvertRequest<undefined>('fixture-api-key', {
				method: 'DELETE',
				path: '/jobs/job-123',
			}),
		).resolves.toBeUndefined();

		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'DELETE',
				url: '/jobs/job-123',
				body: undefined,
			}),
		);
	});

	it('throws AuthMissingError for an explicitly empty key without a request', async () => {
		await expect(
			makeCloudConvertRequest('', { method: 'GET', path: '/tasks' }),
		).rejects.toThrow(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('passes 429 ApiError and retryAfter through unchanged', async () => {
		const error = rateLimitError();
		mockedRequest.mockRejectedValue(error);

		await expect(
			makeCloudConvertRequest('fixture-api-key', {
				method: 'GET',
				path: '/tasks',
			}),
		).rejects.toBe(error);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1800,
		});
	});
});
