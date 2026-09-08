import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Account, Improvement, RemoveBackground } from './endpoints';
import type { RemovebgContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const TEST_API_KEY = 'test-api-key';

const ctx = { key: TEST_API_KEY } as unknown as RemovebgContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('Account.get', () => {
	it('fetches the account resource with the API key header', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				attributes: {
					credits: { total: 50, subscription: 50, payg: 0, enterprise: 0 },
					api: { free_calls: 50, sizes: 'all' },
				},
			},
		});

		await Account.get(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.remove.bg/v1.0',
				HEADERS: expect.objectContaining({ 'X-Api-Key': TEST_API_KEY }),
			}),
			expect.objectContaining({ method: 'GET', url: '/account' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
	});

	it('logs the resolved credit balance', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				attributes: {
					credits: { total: 12, subscription: 12, payg: 0, enterprise: 0 },
					api: { free_calls: 50, sizes: 'all' },
				},
			},
		});

		await Account.get(ctx, {});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'removebg.account.get',
			{ totalCredits: 12 },
			'completed',
		);
	});
});

describe('RemoveBackground.remove', () => {
	it('posts the image url and options as a JSON body', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { result_b64: 'aGVsbG8=' },
		});

		await RemoveBackground.remove(ctx, {
			imageUrl: 'https://example.com/photo.jpg',
			size: 'auto',
			type: 'product',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({ 'X-Api-Key': TEST_API_KEY }),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/removebg',
				body: expect.objectContaining({
					image_url: 'https://example.com/photo.jpg',
					size: 'auto',
					type: 'product',
				}),
			}),
			expect.anything(),
		);
	});

	it('rejects a request that provides neither imageUrl nor imageFileB64', async () => {
		await expect(RemoveBackground.remove(ctx, {} as never)).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a request that provides both imageUrl and imageFileB64', async () => {
		await expect(
			RemoveBackground.remove(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
				imageFileB64: 'aGVsbG8=',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a request that provides both bgColor and bgImageUrl', async () => {
		await expect(
			RemoveBackground.remove(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
				bgColor: '#ffffff',
				bgImageUrl: 'https://example.com/bg.jpg',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts the current size, format, and type option set', async () => {
		mockRequest.mockResolvedValueOnce({ data: { result_b64: 'aGVsbG8=' } });

		await RemoveBackground.remove(ctx, {
			imageUrl: 'https://example.com/photo.jpg',
			size: '50MP',
			format: 'webp',
			type: 'animal',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				body: expect.objectContaining({
					size: '50MP',
					format: 'webp',
					type: 'animal',
				}),
			}),
			expect.anything(),
		);
	});

	it('maps shadowType/shadowOpacity to shadow_type/shadow_opacity, not the deprecated add_shadow', async () => {
		mockRequest.mockResolvedValueOnce({ data: { result_b64: 'aGVsbG8=' } });

		await RemoveBackground.remove(ctx, {
			imageUrl: 'https://example.com/photo.jpg',
			shadowType: 'drop',
			shadowOpacity: 80,
		});

		const [, options] = mockRequest.mock.calls[0] ?? [];
		const body = options?.body as Record<string, unknown>;
		expect(body.shadow_type).toBe('drop');
		expect(body.shadow_opacity).toBe(80);
		expect(body).not.toHaveProperty('add_shadow');
	});

	it('accepts each documented shadowType', async () => {
		for (const shadowType of ['auto', 'car', '3D', 'drop', 'none'] as const) {
			mockRequest.mockResolvedValueOnce({ data: { result_b64: 'aGVsbG8=' } });

			await RemoveBackground.remove(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
				shadowType,
			});

			const [, options] = mockRequest.mock.calls.at(-1) ?? [];
			const body = options?.body as Record<string, unknown>;
			expect(body.shadow_type).toBe(shadowType);
		}
	});

	it('rejects shadowOpacity without shadowType', async () => {
		await expect(
			RemoveBackground.remove(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
				shadowOpacity: 80,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an unknown shadowType', async () => {
		await expect(
			RemoveBackground.remove(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
				shadowType: 'natural',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('disables transport-level 429 retries so the plugin handler owns backoff', async () => {
		mockRequest.mockResolvedValueOnce({ data: { result_b64: 'aGVsbG8=' } });

		await RemoveBackground.remove(ctx, {
			imageUrl: 'https://example.com/photo.jpg',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
	});

	it('returns the base64 cutout from the API response', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				result_b64: 'aGVsbG8=',
				foreground_width: 240,
				foreground_height: 100,
			},
		});

		const result = await RemoveBackground.remove(ctx, {
			imageUrl: 'https://example.com/photo.jpg',
		});

		expect(result.data.result_b64).toBe('aGVsbG8=');
		expect(result.data.foreground_width).toBe(240);
	});

	it('surfaces the remove.bg error title when the request fails', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'POST', url: '/removebg' },
				{
					url: '/removebg',
					ok: false,
					status: 402,
					statusText: 'Payment Required',
					body: { errors: [{ title: 'Insufficient credits' }] },
				},
				'Payment Required',
			),
		);

		await expect(
			RemoveBackground.remove(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
			}),
		).rejects.toThrow('Insufficient credits');
	});
});

describe('Improvement.submit', () => {
	it('posts the original image and error type', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Improvement.submit(ctx, {
			imageUrl: 'https://example.com/photo.jpg',
			errorType: 'foreground-edges',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/improve',
				body: expect.objectContaining({
					image_url: 'https://example.com/photo.jpg',
					error_type: 'foreground-edges',
				}),
			}),
			expect.anything(),
		);
		expect(result).toEqual({ success: true });
	});

	it('rejects a request that provides neither imageUrl nor imageFileB64', async () => {
		await expect(
			Improvement.submit(ctx, { errorType: 'other' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts a JSON acknowledgement body from remove.bg', async () => {
		mockRequest.mockResolvedValueOnce({ data: { attributes: {} } });

		const result = await Improvement.submit(ctx, {
			imageUrl: 'https://example.com/photo.jpg',
			errorType: 'other',
		});

		expect(result).toEqual({ success: true });
	});

	it('throws instead of reporting success on an unexpected response shape', async () => {
		mockRequest.mockResolvedValueOnce('unexpected-plain-text-body');

		await expect(
			Improvement.submit(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
				errorType: 'other',
			}),
		).rejects.toThrow();
	});

	it('throws instead of reporting success when the body contains provider errors', async () => {
		mockRequest.mockResolvedValueOnce({
			errors: [{ title: 'Could not process image' }],
		});

		await expect(
			Improvement.submit(ctx, {
				imageUrl: 'https://example.com/photo.jpg',
				errorType: 'other',
			}),
		).rejects.toThrow();
	});
});
