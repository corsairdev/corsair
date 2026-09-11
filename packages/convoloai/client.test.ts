import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { ConvoloAiAPIError, makeConvoloAiRequest } from './client';
import { convoloai } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('makeConvoloAiRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it('targets the Brightcall base URL with the api-key header', async () => {
		await makeConvoloAiRequest('api/v1/agents', 'test-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://app.brightcall.ai',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
					'api-key': 'test-key',
				}),
			}),
			expect.anything(),
		);
	});

	it('forwards query params on GET with no body', async () => {
		await makeConvoloAiRequest('api/v1/agents', 'test-key', {
			method: 'GET',
			query: { page: 2, itemsPerPage: 25 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'api/v1/agents',
				query: { page: 2, itemsPerPage: 25 },
				body: undefined,
			}),
		);
	});

	it('forwards JSON bodies on POST', async () => {
		await makeConvoloAiRequest('api/v1/agents', 'test-key', {
			method: 'POST',
			body: { name: 'Support' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'api/v1/agents',
				body: { name: 'Support' },
				mediaType: 'application/json; charset=utf-8',
			}),
		);
	});

	it('sends no body on DELETE', async () => {
		await makeConvoloAiRequest('api/v1/widgets/3', 'test-key', {
			method: 'DELETE',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'DELETE', body: undefined }),
		);
	});

	it('propagates ApiError as-is with status and retry metadata', async () => {
		const rateLimitError = new ApiError(
			{ method: 'GET', url: 'api/v1/agents' },
			{
				url: 'https://app.brightcall.ai/api/v1/agents',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Too Many Requests' },
			},
			'Too Many Requests',
			{ retryAfter: 30000 },
		);
		mockRequest.mockRejectedValueOnce(rateLimitError);

		await expect(
			makeConvoloAiRequest('api/v1/agents', 'test-key'),
		).rejects.toBe(rateLimitError);
	});

	it('wraps non-API network failures as ConvoloAiAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('socket hang up'));

		const rejection = makeConvoloAiRequest('api/v1/agents', 'test-key');

		await expect(rejection).rejects.toBeInstanceOf(ConvoloAiAPIError);
		await expect(rejection).rejects.not.toBeInstanceOf(ApiError);
		await expect(rejection).rejects.toThrow('socket hang up');
	});
});

describe('convoloai keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = convoloai({ key: 'from-options' });

		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('from-options');
	});

	it('returns the stored api key when options.key is absent', async () => {
		const plugin = convoloai();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'from-store' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('from-store');
	});

	it('throws AuthMissingError when the api key is missing', async () => {
		const plugin = convoloai();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});
