import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { AbyssaleAPIError, makeAbyssaleRequest } from './client';
import { abyssale } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('Abyssale Plugin API', () => {
	const apiKey = 'test-api-key';
	const plugin = abyssale({ key: apiKey }) as any;
	const ctx = { key: apiKey } as any;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	describe('createProject', () => {
		it('sends POST /projects and parses response', async () => {
			const mockResponse = {
				id: 'b75f8507-6ad4-41d1-817b-d0a0b162c9c7',
				name: 'New Project',
				created_at_ts: 1700000000,
			};
			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await plugin.endpoints.projects.create(ctx, {
				name: 'New Project',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://api.abyssale.com',
					HEADERS: expect.objectContaining({
						'x-api-key': apiKey,
					}),
				}),
				expect.objectContaining({
					method: 'POST',
					url: 'projects',
					body: { name: 'New Project' },
				}),
			);
			expect(result).toEqual(mockResponse);
		});

		it('throws validation error if name is too short', async () => {
			const input = { name: 'a' }; // min length is 2
			await expect(
				plugin.endpointSchemas['projects.create'].input.parseAsync(input),
			).rejects.toThrow();
		});
	});

	describe('getDesigns', () => {
		it('sends GET /designs with query filters', async () => {
			const mockResponse = [
				{
					id: 'a98f4507-6ad4-41d1-817b-d0a0b162c9c1',
					name: 'Design 1',
					type: 'static',
					project_id: 'b75f8507-6ad4-41d1-817b-d0a0b162c9c7',
					project_name: 'New Project',
				},
			];
			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await plugin.endpoints.designs.list(ctx, {
				project_id: 'b75f8507-6ad4-41d1-817b-d0a0b162c9c7',
				type: 'static',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'designs',
					query: {
						project_id: 'b75f8507-6ad4-41d1-817b-d0a0b162c9c7',
						type: 'static',
					},
				}),
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('getFonts', () => {
		it('sends GET /fonts with type filter', async () => {
			const mockResponse = [
				{
					id: 'font-id-1',
					name: 'Arial',
					type: 'google',
					available_weights: [400, '400-italic'],
				},
			];
			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await plugin.endpoints.fonts.list(ctx, {
				type: 'google',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'fonts',
					query: {
						type: 'google',
					},
				}),
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('testAuth', () => {
		it('sends POST /auth and returns company', async () => {
			const mockResponse = {
				company: 'Acme Inc.',
			};
			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await plugin.endpoints.auth.test(ctx, {});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: 'auth',
				}),
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('error handling', () => {
		it('maps ApiError to AbyssaleAPIError with cause', async () => {
			const apiError = new ApiError(
				{ method: 'POST', url: '/auth' } as any,
				{
					status: 401,
					statusText: 'Unauthorized',
					body: { message: 'Invalid API key' },
				} as any,
				'Unauthorized request',
			);
			mockRequest.mockRejectedValueOnce(apiError);

			await expect(makeAbyssaleRequest('auth', apiKey)).rejects.toThrow(
				AbyssaleAPIError,
			);
		});
	});

	describe('keyBuilder', () => {
		it('resolves key from options', async () => {
			const mockKeyBuilderContext = {
				authType: 'api_key',
				keys: {
					get_api_key: jest.fn().mockResolvedValue('dynamic-key'),
				},
			} as any;

			const key = await plugin.keyBuilder(mockKeyBuilderContext, 'endpoint');
			expect(key).toBe(apiKey);
		});

		it('resolves dynamic key when options key is missing', async () => {
			const pluginWithoutKey = abyssale({}) as any;
			const mockKeyBuilderContext = {
				authType: 'api_key',
				keys: {
					get_api_key: jest.fn().mockResolvedValue('dynamic-key'),
				},
			} as any;

			const key = await pluginWithoutKey.keyBuilder(
				mockKeyBuilderContext,
				'endpoint',
			);
			expect(key).toBe('dynamic-key');
			expect(mockKeyBuilderContext.keys.get_api_key).toHaveBeenCalled();
		});

		it('throws AuthMissingError when no key is found', async () => {
			const pluginWithoutKey = abyssale({}) as any;
			const mockKeyBuilderContext = {
				authType: 'api_key',
				keys: {
					get_api_key: jest.fn().mockResolvedValue(null),
				},
			} as any;

			await expect(
				pluginWithoutKey.keyBuilder(mockKeyBuilderContext, 'endpoint'),
			).rejects.toThrow(AuthMissingError);
		});
	});
});
