import { logEventFromContext } from 'corsair/core';
import { makeReplicateRequest } from './client';
import {
	accountGet,
	collectionsGet,
	collectionsList,
	deploymentsCreate,
	deploymentsDelete,
	deploymentsGet,
	deploymentsList,
	deploymentsPredictionsCreate,
	filesCreate,
	filesDelete,
	filesGet,
	filesList,
	hardwareList,
	modelsExamplesList,
	modelsGet,
	modelsList,
	modelsPredictionsCreate,
	modelsReadmeGet,
	modelsUpdate,
	modelsVersionsGet,
	modelsVersionsList,
	predictionsCancel,
	predictionsCreate,
	predictionsGet,
	predictionsList,
	search,
	trainingsCancel,
	trainingsCreate,
	trainingsGet,
	trainingsList,
	webhooksDefaultSecretGet,
} from './endpoints/operations';

jest.mock('./client', () => ({
	makeReplicateRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeReplicateRequest as jest.MockedFunction<
	typeof makeReplicateRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = { key: 'replicate-test-key' };

const prediction = {
	id: 'pred_123',
	status: 'succeeded' as const,
	created_at: '2025-01-01T00:00:00Z',
	input: {},
	output: null,
};

const model = {
	owner: 'replicate',
	name: 'hello-world',
	visibility: 'public' as const,
	is_official: true,
};

const version = {
	id: '5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa',
	created_at: '2025-01-01T00:00:00Z',
};

const training = {
	id: 'tr_123',
	status: 'processing' as const,
	created_at: '2025-01-01T00:00:00Z',
	input: {},
};

const deployment = {
	owner: 'me',
	name: 'demo-deployment',
};

const uploadedFile = {
	id: 'file_123',
	content_type: 'application/octet-stream',
	size: 10,
	checksums: { sha256: 'abc' },
	metadata: {},
	created_at: '2025-01-01T00:00:00Z',
	expires_at: '2025-01-01T01:00:00Z',
	urls: { get: 'https://api.replicate.com/v1/files/file_123' },
};

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('Replicate endpoint contracts', () => {
	it('account.get', async () => {
		mockRequest.mockResolvedValueOnce({ username: 'alice', type: 'user' });
		await accountGet(ctx as never, {});
		expect(mockRequest).toHaveBeenCalledWith('/account', ctx.key, {
			method: 'GET',
		});
	});

	it('collections.list', async () => {
		mockRequest.mockResolvedValueOnce({
			results: [{ name: 'Image', slug: 'image', description: 'desc' }],
		});
		await collectionsList(ctx as never, { cursor: 'next-page-token' });
		expect(mockRequest).toHaveBeenCalledWith('/collections', ctx.key, {
			method: 'GET',
			query: {
				cursor: 'next-page-token',
			},
		});
	});

	it('collections.get', async () => {
		mockRequest.mockResolvedValueOnce({
			name: 'Image',
			slug: 'image',
			description: 'desc',
			models: [model],
		});
		await collectionsGet(ctx as never, { collectionSlug: 'image' });
		expect(mockRequest).toHaveBeenCalledWith('/collections/image', ctx.key, {
			method: 'GET',
		});
	});

	it('deployments.list', async () => {
		mockRequest.mockResolvedValueOnce([deployment]);
		await deploymentsList(ctx as never, {});
		expect(mockRequest).toHaveBeenCalledWith('/deployments', ctx.key, {
			method: 'GET',
		});
	});

	it('deployments.create', async () => {
		mockRequest.mockResolvedValueOnce(deployment);
		await deploymentsCreate(ctx as never, {
			name: 'demo-deployment',
			model: 'replicate/hello-world',
			version: version.id,
			hardware: 'cpu',
			min_instances: 0,
			max_instances: 1,
		});
		expect(mockRequest).toHaveBeenCalledWith('/deployments', ctx.key, {
			method: 'POST',
			body: {
				name: 'demo-deployment',
				model: 'replicate/hello-world',
				version: version.id,
				hardware: 'cpu',
				min_instances: 0,
				max_instances: 1,
			},
		});
	});

	it('deployments.delete', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		const result = await deploymentsDelete(ctx as never, {
			owner: 'me',
			name: 'demo-deployment',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/deployments/me/demo-deployment',
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('deployments.get', async () => {
		mockRequest.mockResolvedValueOnce(deployment);
		await deploymentsGet(ctx as never, {
			owner: 'me',
			name: 'demo-deployment',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/deployments/me/demo-deployment',
			ctx.key,
			{
				method: 'GET',
			},
		);
	});

	it('deployments.predictions.create', async () => {
		mockRequest.mockResolvedValueOnce(prediction);
		await deploymentsPredictionsCreate(ctx as never, {
			owner: 'me',
			name: 'demo-deployment',
			input: { prompt: 'hi' },
			prefer: 'wait=5',
			cancelAfter: '30s',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/deployments/me/demo-deployment/predictions',
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					Prefer: 'wait=5',
					'Cancel-After': '30s',
				}),
			}),
		);
	});

	it('files.list', async () => {
		mockRequest.mockResolvedValueOnce({ results: [uploadedFile] });
		await filesList(ctx as never, { cursor: 'files-cursor' });
		expect(mockRequest).toHaveBeenCalledWith('/files', ctx.key, {
			method: 'GET',
			query: {
				cursor: 'files-cursor',
			},
		});
	});

	it('files.create', async () => {
		mockRequest.mockResolvedValueOnce(uploadedFile);
		await filesCreate(ctx as never, {
			content: new Blob(['hello'], { type: 'text/plain' }),
			filename: 'hello.txt',
			type: 'text/plain',
			metadata: { test: true },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/files',
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				formData: expect.objectContaining({
					filename: 'hello.txt',
					type: 'text/plain',
					metadata: JSON.stringify({ test: true }),
				}),
			}),
		);
	});

	it('files.delete', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		const result = await filesDelete(ctx as never, { fileId: 'file_123' });
		expect(mockRequest).toHaveBeenCalledWith('/files/file_123', ctx.key, {
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it('files.get', async () => {
		mockRequest.mockResolvedValueOnce(uploadedFile);
		await filesGet(ctx as never, { fileId: 'file_123' });
		expect(mockRequest).toHaveBeenCalledWith('/files/file_123', ctx.key, {
			method: 'GET',
		});
	});

	it('hardware.list', async () => {
		mockRequest.mockResolvedValueOnce([{ sku: 'cpu', name: 'CPU' }]);
		await hardwareList(ctx as never, {});
		expect(mockRequest).toHaveBeenCalledWith('/hardware', ctx.key, {
			method: 'GET',
		});
	});

	it('models.list', async () => {
		mockRequest.mockResolvedValueOnce({ results: [model] });
		await modelsList(ctx as never, {
			cursor: 'models-cursor',
			sort_by: 'latest_version_created_at',
			sort_direction: 'desc',
		});
		expect(mockRequest).toHaveBeenCalledWith('/models', ctx.key, {
			method: 'GET',
			query: {
				cursor: 'models-cursor',
				sort_by: 'latest_version_created_at',
				sort_direction: 'desc',
			},
		});
	});

	it('models.get', async () => {
		mockRequest.mockResolvedValueOnce(model);
		await modelsGet(ctx as never, { owner: 'replicate', name: 'hello-world' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/models/replicate/hello-world',
			ctx.key,
			{
				method: 'GET',
			},
		);
	});

	it('models.update', async () => {
		mockRequest.mockResolvedValueOnce(model);
		await modelsUpdate(ctx as never, {
			owner: 'me',
			name: 'demo',
			description: 'updated',
		});
		expect(mockRequest).toHaveBeenCalledWith('/models/me/demo', ctx.key, {
			method: 'PATCH',
			body: expect.objectContaining({ description: 'updated' }),
		});
	});

	it('models.examples.list', async () => {
		mockRequest.mockResolvedValueOnce({ results: [prediction] });
		await modelsExamplesList(ctx as never, {
			owner: 'replicate',
			name: 'hello-world',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/models/replicate/hello-world/examples',
			ctx.key,
			{ method: 'GET' },
		);
	});

	it('models.predictions.create', async () => {
		mockRequest.mockResolvedValueOnce(prediction);
		await modelsPredictionsCreate(ctx as never, {
			owner: 'meta',
			name: 'model',
			input: { prompt: 'hi' },
			webhook_events_filter: ['completed'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/models/meta/model/predictions',
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ input: { prompt: 'hi' } }),
			}),
		);
	});

	it('models.readme.get', async () => {
		mockRequest.mockResolvedValueOnce('# README');
		await modelsReadmeGet(ctx as never, {
			owner: 'replicate',
			name: 'hello-world',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/models/replicate/hello-world/readme',
			ctx.key,
			{ method: 'GET' },
		);
	});

	it('models.versions.get', async () => {
		mockRequest.mockResolvedValueOnce(version);
		await modelsVersionsGet(ctx as never, {
			owner: 'replicate',
			name: 'hello-world',
			versionId: version.id,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			`/models/replicate/hello-world/versions/${version.id}`,
			ctx.key,
			{ method: 'GET' },
		);
	});

	it('models.versions.list', async () => {
		mockRequest.mockResolvedValueOnce({ results: [version] });
		await modelsVersionsList(ctx as never, {
			owner: 'replicate',
			name: 'hello-world',
			cursor: 'versions-cursor',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/models/replicate/hello-world/versions',
			ctx.key,
			{
				method: 'GET',
				query: {
					cursor: 'versions-cursor',
				},
			},
		);
	});

	it('predictions.list', async () => {
		mockRequest.mockResolvedValueOnce({ results: [prediction] });
		await predictionsList(ctx as never, {
			cursor: 'predictions-cursor',
			created_after: '2025-01-01T00:00:00Z',
			source: 'web',
		});
		expect(mockRequest).toHaveBeenCalledWith('/predictions', ctx.key, {
			method: 'GET',
			query: {
				cursor: 'predictions-cursor',
				created_after: '2025-01-01T00:00:00Z',
				created_before: undefined,
				source: 'web',
			},
		});
	});

	it('predictions.create', async () => {
		mockRequest.mockResolvedValueOnce(prediction);
		await predictionsCreate(ctx as never, {
			version: version.id,
			input: { text: 'Alice' },
			prefer: 'wait=5',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/predictions',
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({ Prefer: 'wait=5' }),
				body: expect.objectContaining({ version: version.id }),
			}),
		);
	});

	it('predictions.get', async () => {
		mockRequest.mockResolvedValueOnce(prediction);
		await predictionsGet(ctx as never, { predictionId: 'pred_123' });
		expect(mockRequest).toHaveBeenCalledWith('/predictions/pred_123', ctx.key, {
			method: 'GET',
		});
	});

	it('predictions.cancel', async () => {
		mockRequest.mockResolvedValueOnce(prediction);
		await predictionsCancel(ctx as never, { predictionId: 'pred_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/predictions/pred_123/cancel',
			ctx.key,
			{ method: 'POST' },
		);
	});

	it('search', async () => {
		mockRequest.mockResolvedValueOnce({
			query: 'image',
			models: [{ model, metadata: {} }],
			collections: [{ name: 'Image', slug: 'image' }],
			pages: [{ title: 'Docs' }],
		});
		await search(ctx as never, { query: 'image', limit: 10 });
		expect(mockRequest).toHaveBeenCalledWith('/search', ctx.key, {
			method: 'GET',
			query: { query: 'image', limit: 10 },
		});
	});

	it('trainings.create', async () => {
		mockRequest.mockResolvedValueOnce(training);
		await trainingsCreate(ctx as never, {
			owner: 'replicate',
			name: 'hello-world',
			versionId: version.id,
			destination: 'me/my-model',
			input: { train_data: 'https://example.com/data.zip' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			`/models/replicate/hello-world/versions/${version.id}/trainings`,
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ destination: 'me/my-model' }),
			}),
		);
	});

	it('trainings.get', async () => {
		mockRequest.mockResolvedValueOnce(training);
		await trainingsGet(ctx as never, { trainingId: 'tr_123' });
		expect(mockRequest).toHaveBeenCalledWith('/trainings/tr_123', ctx.key, {
			method: 'GET',
		});
	});

	it('trainings.list', async () => {
		mockRequest.mockResolvedValueOnce({ results: [training] });
		await trainingsList(ctx as never, { cursor: 'trainings-cursor' });
		expect(mockRequest).toHaveBeenCalledWith('/trainings', ctx.key, {
			method: 'GET',
			query: {
				cursor: 'trainings-cursor',
			},
		});
	});

	it('trainings.cancel', async () => {
		mockRequest.mockResolvedValueOnce(training);
		await trainingsCancel(ctx as never, { trainingId: 'tr_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/trainings/tr_123/cancel',
			ctx.key,
			{
				method: 'POST',
			},
		);
	});

	it('webhooks.default.secret.get', async () => {
		mockRequest.mockResolvedValueOnce({ key: 'whsec_123' });
		await webhooksDefaultSecretGet(ctx as never, {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/webhooks/default/secret',
			ctx.key,
			{
				method: 'GET',
			},
		);
	});

	it('validates required input and rejects invalid payloads', async () => {
		await expect(
			predictionsCreate(ctx as never, { input: {} } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('logs endpoint execution', async () => {
		mockRequest.mockResolvedValueOnce({ username: 'alice', type: 'user' });
		await accountGet(ctx as never, {});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'replicate.account.get',
			{},
			'completed',
		);
	});
});
