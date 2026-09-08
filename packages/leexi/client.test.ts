import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	LeexiAPIError,
	makeLeexiRequest,
	resolveLeexiCredentials,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/calls' },
		{
			body: { message },
			ok: false,
			status,
			statusText: message,
			url: 'https://public-api.leexi.ai/v1/calls',
		},
		message,
		{ retryAfter },
	);
}

describe('makeLeexiRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends a Basic auth header built from keyId:keySecret', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });
		await makeLeexiRequest('teams', {
			keyId: 'key_123',
			keySecret: 'secret_456',
		});

		const expectedHeader = `Basic ${Buffer.from('key_123:secret_456').toString('base64')}`;
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://public-api.leexi.ai/v1',
				HEADERS: expect.objectContaining({ Authorization: expectedHeader }),
			}),
			expect.objectContaining({ method: 'GET', url: 'teams' }),
		);
	});

	it('sends query params on GET and omits body', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });
		await makeLeexiRequest(
			'calls',
			{ keyId: 'k', keySecret: 's' },
			{ method: 'GET', query: { page: 2, items: 10 } },
		);

		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.query).toEqual({ page: 2, items: 10 });
		expect(options?.body).toBeUndefined();
	});

	it('sends a JSON body on POST and omits query', async () => {
		mockRequest.mockResolvedValueOnce({ success: true });
		await makeLeexiRequest(
			'meeting_events',
			{ keyId: 'k', keySecret: 's' },
			{ method: 'POST', body: { title: 'Sync' }, query: { page: 1 } },
		);

		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.body).toEqual({ title: 'Sync' });
		expect(options?.query).toBeUndefined();
		expect(options?.method).toBe('POST');
	});

	it('rejects when the key id is missing', async () => {
		await expect(
			makeLeexiRequest('teams', { keyId: '', keySecret: 'secret' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects when the key secret is missing', async () => {
		await expect(
			makeLeexiRequest('teams', { keyId: 'key', keySecret: '   ' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('wraps ApiError rejections preserving status and retry-after', async () => {
		mockRequest.mockRejectedValueOnce(apiError(429, 'Too Many Requests', 30));

		const error = await makeLeexiRequest('calls', {
			keyId: 'k',
			keySecret: 's',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(LeexiAPIError);
		expect((error as LeexiAPIError).status).toBe(429);
		expect((error as LeexiAPIError).retryAfter).toBe(30);
	});

	it('wraps plain Error rejections', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));
		await expect(
			makeLeexiRequest('calls', { keyId: 'k', keySecret: 's' }),
		).rejects.toMatchObject({ name: 'LeexiAPIError', message: 'network down' });
	});

	it('wraps non-error rejections as unknown errors', async () => {
		mockRequest.mockRejectedValueOnce('boom');
		await expect(
			makeLeexiRequest('calls', { keyId: 'k', keySecret: 's' }),
		).rejects.toMatchObject({
			name: 'LeexiAPIError',
			message: 'Unknown error',
		});
	});
});

describe('resolveLeexiCredentials', () => {
	it('prefers an explicit keySecret option over the stored account secret', async () => {
		const getKeySecret = jest.fn().mockResolvedValue('stored-secret');
		const credentials = await resolveLeexiCredentials({
			key: 'key-id',
			options: { keySecret: 'override-secret' },
			keys: { get_key_secret: getKeySecret },
		});

		expect(credentials).toEqual({
			keyId: 'key-id',
			keySecret: 'override-secret',
		});
		expect(getKeySecret).not.toHaveBeenCalled();
	});

	it('falls back to the stored account secret when no override is given', async () => {
		const getKeySecret = jest.fn().mockResolvedValue('stored-secret');
		const credentials = await resolveLeexiCredentials({
			key: 'key-id',
			options: {},
			keys: { get_key_secret: getKeySecret },
		});

		expect(credentials).toEqual({
			keyId: 'key-id',
			keySecret: 'stored-secret',
		});
	});

	it('falls back to an empty string when no secret is available anywhere', async () => {
		const getKeySecret = jest.fn().mockResolvedValue(null);
		const credentials = await resolveLeexiCredentials({
			key: 'key-id',
			options: {},
			keys: { get_key_secret: getKeySecret },
		});

		expect(credentials).toEqual({ keyId: 'key-id', keySecret: '' });
	});
});
