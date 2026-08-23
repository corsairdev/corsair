import { AuthMissingError } from 'corsair/core';
import * as client from '../client';
import { googlecloudvision } from '../index';
import {
	FilesAsyncBatchAnnotateInputSchema,
	ImagesAnnotateInputSchema,
	ImagesAsyncBatchAnnotateInputSchema,
	ProductsPurgeInputSchema,
} from './types';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeGoogleCloudVisionRequest: jest.fn().mockResolvedValue({}),
}));

const request = client.makeGoogleCloudVisionRequest as jest.MockedFunction<
	typeof client.makeGoogleCloudVisionRequest
>;

describe('Google Cloud Vision Endpoints', () => {
	const plugin = googlecloudvision({ key: 'test-api-key' });
	const { endpoints } = plugin;
	const ctx = {
		key: 'test-api-key',
		authType: 'api_key' as const,
		$getAccountId: async () => 'acct',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('images.annotate', async () => {
		const input = {
			requests: [
				{
					image: { source: { imageUri: 'https://example.com/x.jpg' } },
					features: [{ type: 'LABEL_DETECTION' }],
				},
			],
		};
		await endpoints!.images.annotate(ctx as never, input);
		expect(request).toHaveBeenCalledWith(
			'images:annotate',
			ctx,
			expect.objectContaining({ method: 'POST', body: input }),
		);
	});

	it('images.asyncBatchAnnotate', async () => {
		const input = {
			requests: [
				{
					image: { source: { gcsImageUri: 'gs://bucket/x.jpg' } },
					features: [{ type: 'LABEL_DETECTION' }],
				},
			],
			outputConfig: { gcsDestination: { uri: 'gs://out/' } },
		};
		await endpoints!.images.asyncBatchAnnotate(ctx as never, input);
		expect(request).toHaveBeenCalledWith(
			'images:asyncBatchAnnotate',
			ctx,
			expect.objectContaining({ method: 'POST', body: input }),
		);
	});

	it('images.locationAnnotate', async () => {
		const requests = [
			{
				image: { source: { imageUri: 'https://example.com/x.jpg' } },
				features: [{ type: 'LABEL_DETECTION' }],
			},
		];
		await endpoints!.images.locationAnnotate(ctx as never, {
			parent: 'projects/p/locations/l',
			requests,
		});
		expect(request).toHaveBeenCalledWith(
			'projects/p/locations/l/images:annotate',
			ctx,
			expect.objectContaining({ method: 'POST', body: { requests } }),
		);
	});

	it('files.annotate', async () => {
		const input = {
			requests: [
				{
					inputConfig: {
						gcsSource: { uri: 'gs://bucket/doc.pdf' },
						mimeType: 'application/pdf',
					},
					features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
				},
			],
		};
		await endpoints!.files.annotate(ctx as never, input);
		expect(request).toHaveBeenCalledWith(
			'files:annotate',
			ctx,
			expect.objectContaining({ method: 'POST', body: input }),
		);
	});

	it('files.asyncBatchAnnotate', async () => {
		const input = {
			requests: [
				{
					inputConfig: {
						gcsSource: { uri: 'gs://bucket/doc.pdf' },
						mimeType: 'application/pdf',
					},
					features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
					outputConfig: { gcsDestination: { uri: 'gs://out/' } },
				},
			],
		};
		await endpoints!.files.asyncBatchAnnotate(ctx as never, input);
		expect(request).toHaveBeenCalledWith(
			'files:asyncBatchAnnotate',
			ctx,
			expect.objectContaining({ method: 'POST', body: input }),
		);
	});

	it('productSets.create sends ProductSet body and productSetId query', async () => {
		await endpoints!.productSets.create(ctx as never, {
			parent: 'projects/p/locations/l',
			productSetId: 'set-1',
			productSet: { displayName: 'x' },
		});
		expect(request).toHaveBeenCalledWith(
			'projects/p/locations/l/productSets',
			ctx,
			expect.objectContaining({
				method: 'POST',
				body: { displayName: 'x' },
				query: { productSetId: 'set-1' },
			}),
		);
	});

	it('productSets.get', async () => {
		await endpoints!.productSets.get(ctx as never, { name: 'ps' });
		expect(request).toHaveBeenCalledWith(
			'ps',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('productSets.list', async () => {
		await endpoints!.productSets.list(ctx as never, {
			parent: 'projects/p/locations/l',
			pageSize: 10,
			pageToken: 'n',
		});
		expect(request).toHaveBeenCalledWith(
			'projects/p/locations/l/productSets',
			ctx,
			expect.objectContaining({
				method: 'GET',
				query: { pageSize: 10, pageToken: 'n' },
			}),
		);
	});

	it('productSets.update forwards updateMask', async () => {
		await endpoints!.productSets.update(ctx as never, {
			name: 'ps',
			productSet: { displayName: 'x' },
			updateMask: 'displayName',
		});
		expect(request).toHaveBeenCalledWith(
			'ps',
			ctx,
			expect.objectContaining({
				method: 'PATCH',
				body: { displayName: 'x' },
				query: { updateMask: 'displayName' },
			}),
		);
	});

	it('productSets.delete', async () => {
		await endpoints!.productSets.delete(ctx as never, { name: 'ps' });
		expect(request).toHaveBeenCalledWith(
			'ps',
			ctx,
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('productSets.import', async () => {
		await endpoints!.productSets.import(ctx as never, {
			parent: 'p',
			inputConfig: { gcsSource: { csvFileUri: 'gs://x' } },
		});
		expect(request).toHaveBeenCalledWith(
			'p/productSets:import',
			ctx,
			expect.objectContaining({
				method: 'POST',
				body: { inputConfig: { gcsSource: { csvFileUri: 'gs://x' } } },
			}),
		);
	});

	it('productSets.addProduct', async () => {
		await endpoints!.productSets.addProduct(ctx as never, {
			name: 'ps',
			product: 'p',
		});
		expect(request).toHaveBeenCalledWith(
			'ps:addProduct',
			ctx,
			expect.objectContaining({
				method: 'POST',
				body: { product: 'p' },
			}),
		);
	});

	it('productSets.removeProduct', async () => {
		await endpoints!.productSets.removeProduct(ctx as never, {
			name: 'ps',
			product: 'p',
		});
		expect(request).toHaveBeenCalledWith(
			'ps:removeProduct',
			ctx,
			expect.objectContaining({
				method: 'POST',
				body: { product: 'p' },
			}),
		);
	});

	it('productSets.listProducts', async () => {
		await endpoints!.productSets.listProducts(ctx as never, { name: 'ps' });
		expect(request).toHaveBeenCalledWith(
			'ps/products',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('products.create', async () => {
		await endpoints!.products.create(ctx as never, {
			parent: 'p',
			productId: 'sku-1',
			product: { displayName: 'x', productCategory: 'home' },
		});
		expect(request).toHaveBeenCalledWith(
			'p/products',
			ctx,
			expect.objectContaining({
				method: 'POST',
				body: { displayName: 'x', productCategory: 'home' },
				query: { productId: 'sku-1' },
			}),
		);
	});

	it('products.get', async () => {
		await endpoints!.products.get(ctx as never, { name: 'pr' });
		expect(request).toHaveBeenCalledWith(
			'pr',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('products.list', async () => {
		await endpoints!.products.list(ctx as never, { parent: 'p' });
		expect(request).toHaveBeenCalledWith(
			'p/products',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('products.update', async () => {
		await endpoints!.products.update(ctx as never, {
			name: 'pr',
			product: { displayName: 'x', productCategory: 'home' },
			updateMask: 'displayName',
		});
		expect(request).toHaveBeenCalledWith(
			'pr',
			ctx,
			expect.objectContaining({
				method: 'PATCH',
				query: { updateMask: 'displayName' },
			}),
		);
	});

	it('products.delete', async () => {
		await endpoints!.products.delete(ctx as never, { name: 'pr' });
		expect(request).toHaveBeenCalledWith(
			'pr',
			ctx,
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('products.purge', async () => {
		await endpoints!.products.purge(ctx as never, {
			parent: 'p',
			force: true,
			deleteOrphanProducts: true,
		});
		expect(request).toHaveBeenCalledWith(
			'p/products:purge',
			ctx,
			expect.objectContaining({
				method: 'POST',
				body: {
					productSetPurgeConfig: undefined,
					deleteOrphanProducts: true,
					force: true,
				},
			}),
		);
	});

	it('referenceImages.create', async () => {
		await endpoints!.referenceImages.create(ctx as never, {
			parent: 'p',
			referenceImageId: 'ri-1',
			referenceImage: { uri: 'gs://x' },
		});
		expect(request).toHaveBeenCalledWith(
			'p/referenceImages',
			ctx,
			expect.objectContaining({
				method: 'POST',
				body: { uri: 'gs://x' },
				query: { referenceImageId: 'ri-1' },
			}),
		);
	});

	it('referenceImages.get', async () => {
		await endpoints!.referenceImages.get(ctx as never, { name: 'ri' });
		expect(request).toHaveBeenCalledWith(
			'ri',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('referenceImages.delete', async () => {
		await endpoints!.referenceImages.delete(ctx as never, { name: 'ri' });
		expect(request).toHaveBeenCalledWith(
			'ri',
			ctx,
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('referenceImages.list', async () => {
		await endpoints!.referenceImages.list(ctx as never, { parent: 'p' });
		expect(request).toHaveBeenCalledWith(
			'p/referenceImages',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('operations.get', async () => {
		await endpoints!.operations.get(ctx as never, { name: 'op' });
		expect(request).toHaveBeenCalledWith(
			'op',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('operations.list', async () => {
		await endpoints!.operations.list(ctx as never, { name: 'p' });
		expect(request).toHaveBeenCalledWith(
			'p/operations',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('operations.cancel', async () => {
		await endpoints!.operations.cancel(ctx as never, { name: 'op' });
		expect(request).toHaveBeenCalledWith(
			'op:cancel',
			ctx,
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('operations.delete', async () => {
		await endpoints!.operations.delete(ctx as never, { name: 'op' });
		expect(request).toHaveBeenCalledWith(
			'op',
			ctx,
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('locations.list', async () => {
		await endpoints!.locations.list(ctx as never, { name: 'projects/p' });
		expect(request).toHaveBeenCalledWith(
			'projects/p/locations',
			ctx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('does not register Cloud Resource Manager or Vision AI hosts', () => {
		expect(endpoints).not.toHaveProperty('projects');
		expect(endpoints).not.toHaveProperty('indexEndpoints');
	});
});

describe('keyBuilder', () => {
	it('throws AuthMissingError when the api key is missing', async () => {
		const plugin = googlecloudvision({ authType: 'api_key' });
		await expect(
			plugin.keyBuilder!(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the access token is missing', async () => {
		const plugin = googlecloudvision({ authType: 'oauth_2' });
		await expect(
			plugin.keyBuilder!(
				{
					authType: 'oauth_2',
					keys: { get_access_token: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns an explicit key', async () => {
		const plugin = googlecloudvision({ key: 'static-key' });
		await expect(
			plugin.keyBuilder!(
				{ authType: 'api_key', keys: {} } as never,
				'endpoint',
			),
		).resolves.toBe('static-key');
	});
});

describe('input schemas', () => {
	it('rejects async image requests with inline content', () => {
		const parsed = ImagesAsyncBatchAnnotateInputSchema.safeParse({
			requests: [
				{
					image: {
						content: 'abc',
						source: { gcsImageUri: 'gs://bucket/x.jpg' },
					},
					features: [{ type: 'LABEL_DETECTION' }],
				},
			],
			outputConfig: { gcsDestination: { uri: 'gs://out/' } },
		});
		expect(parsed.success).toBe(false);
	});

	it('rejects async image requests without gcsImageUri', () => {
		expect(
			ImagesAsyncBatchAnnotateInputSchema.safeParse({
				requests: [
					{
						image: { source: { imageUri: 'https://example.com/x.jpg' } },
						features: [{ type: 'LABEL_DETECTION' }],
					},
				],
				outputConfig: { gcsDestination: { uri: 'gs://out/' } },
			}).success,
		).toBe(false);
	});

	it('rejects async file requests with inline content', () => {
		const parsed = FilesAsyncBatchAnnotateInputSchema.safeParse({
			requests: [
				{
					inputConfig: {
						content: 'abc',
						gcsSource: { uri: 'gs://bucket/doc.pdf' },
						mimeType: 'application/pdf',
					},
					features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
					outputConfig: { gcsDestination: { uri: 'gs://out/' } },
				},
			],
		});
		expect(parsed.success).toBe(false);
	});

	it('requires image content or a source URI', () => {
		expect(
			ImagesAnnotateInputSchema.safeParse({
				requests: [{ image: {}, features: [{ type: 'LABEL_DETECTION' }] }],
			}).success,
		).toBe(false);
	});

	it('requires force true and exactly one purge target', () => {
		expect(
			ProductsPurgeInputSchema.safeParse({ parent: 'p', force: true }).success,
		).toBe(false);
		expect(
			ProductsPurgeInputSchema.safeParse({
				parent: 'p',
				force: false,
				deleteOrphanProducts: true,
			}).success,
		).toBe(false);
		expect(
			ProductsPurgeInputSchema.safeParse({
				parent: 'p',
				force: true,
				deleteOrphanProducts: true,
				productSetPurgeConfig: { productSetId: 'set' },
			}).success,
		).toBe(false);
		expect(
			ProductsPurgeInputSchema.safeParse({
				parent: 'p',
				force: true,
				deleteOrphanProducts: true,
			}).success,
		).toBe(true);
	});
});
