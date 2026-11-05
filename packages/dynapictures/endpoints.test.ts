import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Media, Templates, Webhooks, Workspaces } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { DynapicturesContext } from './index';
import { dynapictures } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const TEST_API_KEY = 'test-dynapictures-token';
const ctx = { key: TEST_API_KEY } as unknown as DynapicturesContext;

const workspace = {
	id: '74b5b2c96a',
	name: 'Banners for client 22',
	dateCreated: '2021-06-15T12:30:14.000Z',
	dateUpdated: '2021-06-15T12:30:14.000Z',
};

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string, retryAfter?: number) {
	const err = new ApiError(
		{ method: 'GET', url: 'https://api.dynapictures.com/workspaces' },
		{
			url: 'https://api.dynapictures.com/workspaces',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message },
		},
		message,
	);
	if (retryAfter !== undefined) {
		(err as { retryAfter?: number }).retryAfter = retryAfter;
	}
	return err;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('plugin shape', () => {
	it('registers 7 catalog endpoints and no triggers', () => {
		const plugin = dynapictures();
		expect(plugin.id).toBe('dynapictures');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.endpoints ?? {})).toEqual([
			'workspaces',
			'templates',
			'webhooks',
			'media',
		]);
	});

	it('resolves api_key and rejects webhook key lookup', async () => {
		const plugin = dynapictures({ key: TEST_API_KEY });
		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe(TEST_API_KEY);
		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('Workspaces.list', () => {
	it('GET /workspaces', async () => {
		mockRequest.mockResolvedValueOnce([workspace]);
		const result = await Workspaces.list(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.dynapictures.com',
				HEADERS: expect.objectContaining({
					Authorization: `Bearer ${TEST_API_KEY}`,
				}),
			}),
			expect.objectContaining({ method: 'GET', url: '/workspaces' }),
		);
		expect(result[0]?.id).toBe('74b5b2c96a');
	});
});

describe('Workspaces.create', () => {
	it('POST /workspaces with name', async () => {
		mockRequest.mockResolvedValueOnce(workspace);
		const result = await Workspaces.create(ctx, {
			name: 'Banners for client 22',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/workspaces',
				body: { name: 'Banners for client 22' },
			}),
		);
		expect(result.name).toBe('Banners for client 22');
	});
});

describe('Workspaces.update', () => {
	it('PUT /workspaces/{ID} with name', async () => {
		mockRequest.mockResolvedValueOnce({
			...workspace,
			name: 'Banners for client 1234',
		});
		const result = await Workspaces.update(ctx, {
			id: '74b5b2c96a',
			name: 'Banners for client 1234',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PUT',
				url: '/workspaces/74b5b2c96a',
				body: { name: 'Banners for client 1234' },
			}),
		);
		expect(result.name).toBe('Banners for client 1234');
	});
});

describe('Workspaces.delete', () => {
	it('DELETE /workspaces/{ID}', async () => {
		mockRequest.mockResolvedValueOnce(workspace);
		const result = await Workspaces.delete(ctx, { id: '74b5b2c96a' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/workspaces/74b5b2c96a',
			}),
		);
		expect(result.id).toBe('74b5b2c96a');
	});
});

describe('Templates.list', () => {
	it('GET /templates with official thumbnail field', async () => {
		mockRequest.mockResolvedValueOnce([
			{
				id: '000d61e4f7',
				name: 'Twitter Template',
				thumbnail:
					'https://dynapictures.com/rest/public/designs/000d61e4f7/thumb.png',
				dateCreated: '2021-05-09T11:54:04.000Z',
				dateUpdated: '2021-05-09T11:54:26.000Z',
				layers: [],
			},
		]);
		const result = await Templates.list(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: '/templates' }),
		);
		expect(result[0]?.thumbnail).toContain('000d61e4f7');
	});
});

describe('Webhooks.unsubscribe', () => {
	it('DELETE /hooks with subscribe identity fields', async () => {
		mockRequest.mockResolvedValueOnce({ error: false, message: '' });
		const result = await Webhooks.unsubscribe(ctx, {
			targetUrl: 'https://mycompany.com/webhooks/my-endpoint',
			eventType: 'NEW_IMAGE',
			templateId: '000d61e4f7',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/hooks',
				body: {
					targetUrl: 'https://mycompany.com/webhooks/my-endpoint',
					eventType: 'NEW_IMAGE',
					templateId: '000d61e4f7',
				},
			}),
		);
		expect(result.error).toBe(false);
	});
});

describe('Media.upload', () => {
	it('POST multipart /media/{workspaceId}/assets', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
			headers: { get: () => 'image/jpeg' },
		}) as unknown as typeof fetch;
		mockRequest.mockResolvedValueOnce({
			id: '5a12844966',
			folder: false,
			mimeType: 'image/jpeg',
			filename: 'cat1.jpeg',
			size: 32137,
			url: 'https://blobs.dynapictures.com/media/8eb9e4869b/d3b98332a5.jpg',
			thumbnailUrl:
				'https://blobs.dynapictures.com/media/8eb9e4869b/d3b98332a5_t.jpg',
			dateCreated: '2022-05-31T19:57:08.458Z',
			dateUpdated: '2022-05-31T19:57:08.458Z',
		});

		try {
			const result = await Media.upload(ctx, {
				workspaceId: 'e6c1b8758b',
				fileUrl: 'https://dynapictures.com/images/banners/cat1.jpeg',
			});
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					HEADERS: expect.objectContaining({
						Authorization: `Bearer ${TEST_API_KEY}`,
					}),
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/media/e6c1b8758b/assets',
					formData: expect.objectContaining({
						file: expect.any(File),
					}),
				}),
			);
			expect(result.id).toBe('5a12844966');
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});

describe('error classification', () => {
	it('keeps 429 status and Retry-After on wrapped errors', async () => {
		const err = httpError(429, 'Too Many Requests', 2000);
		expect(classify(err)).toBe('RATE_LIMIT_ERROR');
		const policy = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(policy.headersRetryAfterMs).toBe(2000);
		expect(classify(httpError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(classify(httpError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(classify(httpError(500, 'Server'))).toBe('DEFAULT');
	});
});
