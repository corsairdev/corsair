import { request } from 'corsair/http';
import * as buckets from './endpoints/buckets';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('griptape bucket endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('bucket.list sends GET /buckets with pagination', async () => {
		const payload = {
			buckets: [],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 0,
				total_pages: 0,
			},
		};
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'buckets' }),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.create sends POST /buckets', async () => {
		const payload = { bucket_id: 'bucket-test-001', name: 'test-bucket' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.create(ctx, { body: { name: 'test-bucket' } });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'buckets' }),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.get sends GET /buckets/{bucket_id}', async () => {
		const payload = { bucket_id: 'bucket-test-001', name: 'test-bucket' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.get(ctx, { bucket_id: 'bucket-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'buckets/bucket-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.update sends PATCH /buckets/{bucket_id}', async () => {
		const payload = { bucket_id: 'bucket-test-001', name: 'renamed-bucket' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.update(ctx, {
			bucket_id: 'bucket-test-001',
			body: { name: 'renamed-bucket' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'buckets/bucket-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.delete sends DELETE /buckets/{bucket_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await buckets.remove(ctx, { bucket_id: 'bucket-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'buckets/bucket-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('bucket.listAssets sends GET /buckets/{bucket_id}/assets with filters', async () => {
		const payload = { assets: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.listAssets(ctx, {
			bucket_id: 'bucket-test-001',
			page: 1,
			page_size: 10,
			prefix: 'docs/',
			postfix: '.pdf',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'buckets/bucket-test-001/assets',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.getAsset sends GET /buckets/{bucket_id}/assets/{name}', async () => {
		const payload = { name: 'report.pdf', bucket_id: 'bucket-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.getAsset(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'buckets/bucket-test-001/assets/report.pdf',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.createAsset sends PUT /buckets/{bucket_id}/assets', async () => {
		const payload = { name: 'report.pdf', bucket_id: 'bucket-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.createAsset(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
			body: { content_type: 'application/pdf' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PUT',
				url: 'buckets/bucket-test-001/assets',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.deleteAsset sends DELETE /buckets/{bucket_id}/assets/{name}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await buckets.deleteAsset(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'buckets/bucket-test-001/assets/report.pdf',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('bucket.assetUrl sends POST /buckets/{bucket_id}/asset-urls/{name}', async () => {
		const payload = { url: 'https://example.com/signed/report.pdf' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.assetUrl(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
			body: { expires_in: 3600 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'buckets/bucket-test-001/asset-urls/report.pdf',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates bucketCreateAsset input and rejects an empty name', () => {
		const valid = GriptapeEndpointInputSchemas.bucketCreateAsset.safeParse({
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
		});

		expect(valid.success).toBe(true);
	});

	it('rejects bucketCreateAsset input with an empty name', () => {
		const invalid = GriptapeEndpointInputSchemas.bucketCreateAsset.safeParse({
			bucket_id: 'bucket-test-001',
			name: '',
		});

		expect(invalid.success).toBe(false);
	});
});
