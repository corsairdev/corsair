import * as client from '../client';
import { googlecloudvision } from '../index';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeGoogleCloudVisionRequest: jest.fn().mockResolvedValue({}),
}));

describe('Google Cloud Vision Endpoints', () => {
	const plugin = googlecloudvision({ key: 'test-api-key' });
	const ctx = { key: 'test-api-key', authType: 'api_key' } as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('images.annotate', async () => {
		await plugin.endpoints!.images.annotate(ctx, { requests: [] });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'images:annotate',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('images.asyncBatchAnnotate', async () => {
		await plugin.endpoints!.images.asyncBatchAnnotate(ctx, {
			requests: [],
			outputConfig: { gcsDestination: { uri: 'gs://x' } },
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'images:asyncBatchAnnotate',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('images.locationAnnotate', async () => {
		await plugin.endpoints!.images.locationAnnotate(ctx, {
			parent: 'projects/p/locations/l',
			requests: [],
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'projects/p/locations/l/images:annotate',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('files.annotate', async () => {
		await plugin.endpoints!.files.annotate(ctx, { requests: [] });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'files:annotate',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('files.asyncBatchAnnotate', async () => {
		await plugin.endpoints!.files.asyncBatchAnnotate(ctx, { requests: [] });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'files:asyncBatchAnnotate',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('productSets.create', async () => {
		await plugin.endpoints!.productSets.create(ctx, {
			parent: 'p',
			productSet: { displayName: 'x' },
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/productSets',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('productSets.get', async () => {
		await plugin.endpoints!.productSets.get(ctx, { name: 'ps' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ps',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('productSets.update', async () => {
		await plugin.endpoints!.productSets.update(ctx, {
			name: 'ps',
			productSet: { displayName: 'x' },
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ps',
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
	});

	it('productSets.delete', async () => {
		await plugin.endpoints!.productSets.delete(ctx, { name: 'ps' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ps',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('productSets.import', async () => {
		await plugin.endpoints!.productSets.import(ctx, {
			parent: 'p',
			inputConfig: { gcsSource: { csvFileUri: 'gs://x' } },
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/productSets:import',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('productSets.addProduct', async () => {
		await plugin.endpoints!.productSets.addProduct(ctx, {
			name: 'ps',
			product: 'p',
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ps:addProduct',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('productSets.removeProduct', async () => {
		await plugin.endpoints!.productSets.removeProduct(ctx, {
			name: 'ps',
			product: 'p',
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ps:removeProduct',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('productSets.listProducts', async () => {
		await plugin.endpoints!.productSets.listProducts(ctx, { name: 'ps' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ps/products',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('products.create', async () => {
		await plugin.endpoints!.products.create(ctx, {
			parent: 'p',
			product: { displayName: 'x', productCategory: 'home' },
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/products',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('products.get', async () => {
		await plugin.endpoints!.products.get(ctx, { name: 'pr' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'pr',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('products.update', async () => {
		await plugin.endpoints!.products.update(ctx, {
			name: 'pr',
			product: { displayName: 'x', productCategory: 'home' },
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'pr',
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
	});

	it('products.delete', async () => {
		await plugin.endpoints!.products.delete(ctx, { name: 'pr' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'pr',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('products.purge', async () => {
		await plugin.endpoints!.products.purge(ctx, { parent: 'p', force: true });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/products:purge',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('referenceImages.create', async () => {
		await plugin.endpoints!.referenceImages.create(ctx, {
			parent: 'p',
			referenceImage: { uri: 'gs://x' },
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/referenceImages',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('referenceImages.get', async () => {
		await plugin.endpoints!.referenceImages.get(ctx, { name: 'ri' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ri',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('referenceImages.delete', async () => {
		await plugin.endpoints!.referenceImages.delete(ctx, { name: 'ri' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'ri',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('referenceImages.list', async () => {
		await plugin.endpoints!.referenceImages.list(ctx, { parent: 'p' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/referenceImages',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('operations.get', async () => {
		await plugin.endpoints!.operations.get(ctx, { name: 'op' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'op',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('operations.list', async () => {
		await plugin.endpoints!.operations.list(ctx, { name: 'p' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/operations',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('operations.cancel', async () => {
		await plugin.endpoints!.operations.cancel(ctx, { name: 'op' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'op:cancel',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('operations.delete', async () => {
		await plugin.endpoints!.operations.delete(ctx, { name: 'op' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'op',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('locations.list', async () => {
		await plugin.endpoints!.locations.list(ctx, { name: 'p' });
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'p/locations',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('projects.list', async () => {
		await plugin.endpoints!.projects.list(ctx, {});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'v1/projects',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				baseUrl: 'https://cloudresourcemanager.googleapis.com',
			}),
		);
	});

	it('indexEndpoints.list', async () => {
		await plugin.endpoints!.indexEndpoints.list(ctx, {
			parent: 'projects/p/locations/l',
		});
		expect(client.makeGoogleCloudVisionRequest).toHaveBeenCalledWith(
			'v1/projects/p/locations/l/indexEndpoints',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				baseUrl: 'https://visionai.googleapis.com',
			}),
		);
	});
});
