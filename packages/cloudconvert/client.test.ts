import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CLOUDCONVERT_API_BASE,
	CLOUDCONVERT_SYNC_API_BASE,
	DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
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
		expect(mockedRequest.mock.calls[0]?.[0]?.TIMEOUT).toBe(
			DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
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
			timeoutMs: 120_000,
			body: { tasks: { export: { operation: 'export/url' } }, redirect: false },
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(
			CLOUDCONVERT_SYNC_API_BASE,
		);
		expect(mockedRequest.mock.calls[0]?.[0]?.TIMEOUT).toBe(120_000);
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
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('redacts export credentials from propagated ApiError request bodies', async () => {
		const requestBody = {
			tasks: {
				export: {
					operation: 'export/s3',
					project_id: 'fixture-project',
					client_email: 'fixture@example.test',
					access_key_id: 'fixture-access-key',
					secret_access_key: 'fixture-secret-key',
					private_key: 'fixture-private-key',
					session_token: 'fixture-session-token',
					storage_access_key: 'fixture-storage-key',
					sas_token: 'fixture-sas-token',
				},
			},
		};

		const error = new ApiError(
			{ method: 'POST', url: '/jobs', body: requestBody },
			{
				url: 'https://api.cloudconvert.com/v2/jobs',
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: { code: 'INVALID_DATA' },
			},
			'Unprocessable Entity',
			{
				retryAfter: 1500,
				rateLimitReset: 1_800_000_000_000,
				rateLimitRemaining: 3,
				rateLimitLimit: 10,
			},
		);
		mockedRequest.mockRejectedValue(error);

		// `unknown` because a rejected value is only narrowed by the assertions
		// below; typing it as Error would hide a wrong error class.
		let propagated: unknown;
		try {
			await makeCloudConvertRequest('fixture-api-key', {
				method: 'POST',
				path: '/jobs',
				body: requestBody,
			});
		} catch (error) {
			propagated = error;
		}

		expect(propagated).toBeInstanceOf(ApiError);
		if (!(propagated instanceof ApiError)) {
			throw new Error(
				'Expected the CloudConvert request to throw an ApiError.',
			);
		}
		expect(propagated).not.toBe(error);
		expect(propagated.status).toBe(422);
		expect(propagated.retryAfter).toBe(1500);
		expect(propagated.rateLimitReset).toBe(1_800_000_000_000);
		expect(propagated.rateLimitRemaining).toBe(3);
		expect(propagated.rateLimitLimit).toBe(10);
		expect(propagated.stack).toBe(error.stack);
		expect(propagated.request.body).toEqual({
			tasks: {
				export: {
					operation: 'export/s3',
					project_id: '[REDACTED]',
					client_email: '[REDACTED]',
					access_key_id: '[REDACTED]',
					secret_access_key: '[REDACTED]',
					private_key: '[REDACTED]',
					session_token: '[REDACTED]',
					storage_access_key: '[REDACTED]',
					sas_token: '[REDACTED]',
				},
			},
		});
	});

	it('redacts inline generic-task credentials and auth headers', async () => {
		const requestBody = {
			tasks: {
				import: {
					operation: 'import/sftp',
					host: 'sftp.example.test',
					username: 'fixture-user',
					password: 'fixture-password',
				},
				upload: {
					operation: 'export/upload',
					url: 'https://example.test/upload',
					headers: { Authorization: 'Bearer fixture-token' },
				},
			},
		};
		mockedRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/jobs', body: requestBody },
				{
					url: 'https://api.cloudconvert.com/v2/jobs',
					ok: false,
					status: 422,
					statusText: 'Unprocessable Entity',
					body: { code: 'INVALID_DATA' },
				},
				'Unprocessable Entity',
			),
		);

		await expect(
			makeCloudConvertRequest('fixture-api-key', {
				method: 'POST',
				path: '/jobs',
				body: requestBody,
			}),
		).rejects.toMatchObject({
			request: {
				body: {
					tasks: {
						import: {
							operation: 'import/sftp',
							host: 'sftp.example.test',
							username: 'fixture-user',
							password: '[REDACTED]',
						},
						upload: {
							operation: 'export/upload',
							url: 'https://example.test/upload',
							headers: { Authorization: '[REDACTED]' },
						},
					},
				},
			},
		});
	});
});
