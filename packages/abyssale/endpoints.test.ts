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
	const upsert = jest.fn();
	const ctx = {
		key: apiKey,
		db: { banners: { upsertByEntityId: upsert } },
	} as any;

	beforeEach(() => {
		mockRequest.mockReset();
		upsert.mockReset();
		upsert.mockResolvedValue({ id: 'corsair-entity-1' });
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

	describe('generation.image', () => {
		const designId = '5978e8d9-ab34-4735-a2cb-fe95c2c56251';

		it('sends POST /banner-builder/{designId}/generate without the path param in the body', async () => {
			const mockResponse = {
				id: 'b3f1a6ea-0d47-4e29-9c02-8f7f5f4e6a01',
				version: 1,
				file: {
					type: 'jpeg',
					url: 'https://cdn.abyssale.com/banner.jpeg',
					filename: 'banner.jpeg',
				},
				format: { id: 'facebook-feed', width: 1200, height: 628 },
				template: { id: designId, name: 'Summer campaign' },
			};
			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await plugin.endpoints.generation.image(ctx, {
				designId,
				template_format_name: 'facebook-feed',
				image_file_type: 'png',
				file_compression_level: 90,
				elements: {
					text_title: { payload: 'Hello', color: '#FF0000' },
				},
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
					url: `banner-builder/${designId}/generate`,
					body: {
						template_format_name: 'facebook-feed',
						image_file_type: 'png',
						file_compression_level: 90,
						elements: {
							text_title: { payload: 'Hello', color: '#FF0000' },
						},
					},
				}),
			);
			expect(result).toEqual(mockResponse);
			expect(upsert).toHaveBeenCalledWith(
				mockResponse.id,
				expect.objectContaining({ id: mockResponse.id }),
			);
		});

		it('rejects a non-uuid design id before calling the API', async () => {
			await expect(
				plugin.endpoints.generation.image(ctx, { designId: 'not-a-uuid' }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('rejects an unsupported image_file_type before calling the API', async () => {
			await expect(
				plugin.endpoints.generation.image(ctx, {
					designId,
					image_file_type: 'mp4',
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('generation.batch', () => {
		const designId = '46d22c62-d134-44d3-a040-138e4ea9ea08';

		it('sends POST /async/banner-builder/{designId}/generate', async () => {
			const requestId = 'df75afa8-5a77-4e03-aeef-6d1b6dd0580a';
			mockRequest.mockResolvedValueOnce({
				generation_request_id: requestId,
			});

			const result = await plugin.endpoints.generation.batch(ctx, {
				designId,
				template_format_names: ['facebook-feed', 'instagram-post'],
				callback_url: 'https://webhook.example.com/abyssale',
				gif: { max_fps: 9 },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: `async/banner-builder/${designId}/generate`,
					body: {
						template_format_names: ['facebook-feed', 'instagram-post'],
						callback_url: 'https://webhook.example.com/abyssale',
						gif: { max_fps: 9 },
					},
				}),
			);
			expect(result).toEqual({ generation_request_id: requestId });
		});

		it('rejects a gif fps outside the documented 2-9 range', async () => {
			await expect(
				plugin.endpoints.generation.batch(ctx, {
					designId,
					gif: { max_fps: 30 as never },
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('generation.status', () => {
		const requestId = '497f6eca-6276-4993-bfeb-53cbbbba6f08';

		it('polls GET /generation-request/{id} while not finalized', async () => {
			mockRequest.mockResolvedValueOnce({
				is_finalized: false,
				id: requestId,
				banners: [],
				errors: [],
			});

			const result = await plugin.endpoints.generation.status(ctx, {
				generationRequestId: requestId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: `generation-request/${requestId}`,
				}),
			);
			expect(result.is_finalized).toBe(false);
			expect(upsert).not.toHaveBeenCalled();
		});

		it('returns per-format errors alongside finished banners', async () => {
			const banner = {
				id: 'ec3a9fcd-f209-4077-b5ea-037d4bdfa9f2',
				file: { type: 'jpeg', url: 'https://cdn.abyssale.com/a.jpeg' },
				format: { id: 'facebook', width: 1200, height: 628 },
			};
			mockRequest.mockResolvedValueOnce({
				is_finalized: true,
				id: requestId,
				banners: [banner],
				errors: [
					{
						template_format_name: 'instagram-story',
						reason: 'The text cannot fit within the defined space.',
					},
				],
			});

			const result = await plugin.endpoints.generation.status(ctx, {
				generationRequestId: requestId,
			});

			expect(result.banners).toEqual([banner]);
			expect(result.errors).toHaveLength(1);
			expect(upsert).toHaveBeenCalledWith(
				banner.id,
				expect.objectContaining({ id: banner.id }),
			);
		});

		it('accepts a finalized payload that omits errors and caches banners', async () => {
			const banner = {
				id: 'ec3a9fcd-f209-4077-b5ea-037d4bdfa9f2',
				file: { type: 'jpeg', url: 'https://cdn.abyssale.com/a.jpeg' },
			};
			mockRequest.mockResolvedValueOnce({
				is_finalized: true,
				id: requestId,
				banners: [banner],
			});

			const result = await plugin.endpoints.generation.status(ctx, {
				generationRequestId: requestId,
			});

			expect(result.errors).toEqual([]);
			expect(upsert).toHaveBeenCalledWith(
				banner.id,
				expect.objectContaining({ id: banner.id }),
			);
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
