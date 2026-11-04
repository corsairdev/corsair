import { ApiError, request } from 'corsair/http';
import { CuttlyAPIError, makeCuttlyRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeCuttlyRequest', () => {
	it('sends GET /api/api.php against https://cutt.ly with the key merged into query', async () => {
		mockRequest.mockResolvedValue({ url: { status: 7 } });

		await makeCuttlyRequest('live-key', { short: 'https://example.com/x' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cutt.ly' }),
			expect.objectContaining({
				method: 'GET',
				url: '/api/api.php',
				query: expect.objectContaining({
					key: 'live-key',
					short: 'https://example.com/x',
				}),
			}),
		);
	});

	it('returns the decoded provider payload to the caller', async () => {
		mockRequest.mockResolvedValue({
			url: {
				status: 7,
				shortLink: 'https://cutt.ly/abc',
				fullLink: 'https://example.com/x',
			},
		});

		const payload = await makeCuttlyRequest<{ url: { status: number } }>(
			'live-key',
			{ short: 'https://example.com/x' },
		);

		expect(payload.url.status).toBe(7);
	});

	it('wraps ApiError while preserving HTTP status and retryAfter', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/api/api.php' },
				{
					url: '/api/api.php',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
				},
				'Too Many Requests',
				{ retryAfter: 2000 },
			),
		);

		await expect(
			makeCuttlyRequest('live-key', { short: 'https://example.com/x' }),
		).rejects.toBeInstanceOf(CuttlyAPIError);
		await expect(
			makeCuttlyRequest('live-key', { short: 'https://example.com/x' }),
		).rejects.toMatchObject({ status: 429, retryAfter: 2000 });
	});

	it('wraps transport errors without an HTTP status', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		await expect(
			makeCuttlyRequest('live-key', { short: 'https://example.com/x' }),
		).rejects.toMatchObject({
			name: 'CuttlyAPIError',
			message: 'fetch failed',
			status: undefined,
		});
	});

	it('wraps non-Error rejections as an unknown Cutt.ly API error', async () => {
		mockRequest.mockImplementation(() => {
			throw 'boom';
		});

		await expect(
			makeCuttlyRequest('live-key', { short: 'https://example.com/x' }),
		).rejects.toMatchObject({
			name: 'CuttlyAPIError',
			message: 'Unknown Cutt.ly API error',
		});
	});
});

describe('CuttlyAPIError', () => {
	it('carries the provider status code and HTTP details', () => {
		const error = new CuttlyAPIError('The Cutt.ly link does not exist', 0);

		expect(error.name).toBe('CuttlyAPIError');
		expect(error.message).toBe('The Cutt.ly link does not exist');
		expect(error.code).toBe(0);
		expect(error.status).toBeUndefined();
		expect(error.retryAfter).toBeUndefined();
	});
});
