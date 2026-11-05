import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	extendCreate,
	framesCreate,
	imageToVideoCreate,
	operationsGet,
	operationsWait,
	referencesCreate,
	textToVideoCreate,
} from './endpoints';
import type { VeoContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeVeoRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeVeoRequest);
const mockedLog = jest.mocked(logEventFromContext);

const OPERATION =
	'projects/my-proj/locations/us-central1/publishers/google/models/veo-3.1-generate-001/operations/op-1';

function buildCtx(options: VeoContext['options'] = {}): VeoContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'ya29.token',
		options,
		keys: {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_api_key: () => Promise.resolve('ya29.token'),
			set_api_key: () => Promise.resolve(),
			get_projectId: () => Promise.resolve('stored-proj'),
			set_projectId: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	} as VeoContext;
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
	mockedLog.mockResolvedValue('event-1');
});

describe('Veo generation endpoints', () => {
	it('starts text-to-video with only the fields the caller set', async () => {
		mockedRequest.mockResolvedValue({ name: OPERATION });
		const ctx = buildCtx({ projectId: 'my-proj' });

		const operation = await textToVideoCreate(ctx, {
			model: 'veo-3.1-generate-001',
			prompt: 'a cat reading a book',
			aspectRatio: '9:16',
			durationSeconds: 4,
			resolution: '1080p',
			personGeneration: 'allow_adult',
			sampleCount: 1,
			seed: 7,
			negativePrompt: 'text',
			storageUri: 'gs://bucket/out/',
		});

		expect(operation.name).toBe(OPERATION);
		expect(mockedRequest).toHaveBeenCalledWith(
			'https://us-central1-aiplatform.googleapis.com',
			'/v1/projects/my-proj/locations/us-central1/publishers/google/models/veo-3.1-generate-001:predictLongRunning',
			'ya29.token',
			{
				body: {
					instances: [{ prompt: 'a cat reading a book' }],
					parameters: {
						aspectRatio: '9:16',
						durationSeconds: 4,
						resolution: '1080p',
						personGeneration: 'allow_adult',
						sampleCount: 1,
						seed: 7,
						negativePrompt: 'text',
						storageUri: 'gs://bucket/out/',
					},
				},
			},
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'veo.textToVideo.create',
			{
				model: 'veo-3.1-generate-001',
				location: 'us-central1',
				operationName: OPERATION,
			},
			'completed',
		);
	});

	it('sends an image as bytes and resizeMode, and omits an empty prompt', async () => {
		mockedRequest.mockResolvedValue({ name: OPERATION });
		await imageToVideoCreate(buildCtx({ projectId: 'my-proj' }), {
			model: 'veo-3.1-fast-generate-001',
			image: { mimeType: 'image/png', bytesBase64Encoded: 'aW1n' },
			resizeMode: 'pad',
		});

		expect(mockedRequest.mock.calls[0]?.[3]).toEqual({
			body: {
				instances: [
					{
						image: { mimeType: 'image/png', bytesBase64Encoded: 'aW1n' },
					},
				],
				parameters: { resizeMode: 'pad' },
			},
		});
		const logged = mockedLog.mock.calls[0]?.[2];
		expect(JSON.stringify(logged)).not.toContain('aW1n');
	});

	it('sends first and last frames as Cloud Storage images', async () => {
		mockedRequest.mockResolvedValue({ name: OPERATION });
		await framesCreate(buildCtx({ projectId: 'my-proj', location: 'global' }), {
			model: 'veo-3.1-generate-001',
			prompt: 'a hand places a glass',
			image: { mimeType: 'image/png', gcsUri: 'gs://bucket/first.png' },
			lastFrame: { mimeType: 'image/jpeg', gcsUri: 'gs://bucket/last.jpg' },
		});

		expect(mockedRequest.mock.calls[0]?.[0]).toBe(
			'https://aiplatform.googleapis.com',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toContain('/locations/global/');
		expect(mockedRequest.mock.calls[0]?.[3]).toEqual({
			body: {
				instances: [
					{
						prompt: 'a hand places a glass',
						image: { mimeType: 'image/png', gcsUri: 'gs://bucket/first.png' },
						lastFrame: {
							mimeType: 'image/jpeg',
							gcsUri: 'gs://bucket/last.jpg',
						},
					},
				],
			},
		});
	});

	it('sends up to three asset reference images', async () => {
		mockedRequest.mockResolvedValue({ name: OPERATION });
		await referencesCreate(buildCtx({ projectId: 'my-proj' }), {
			model: 'veo-3.1-generate-001',
			prompt: 'walk in with the vase',
			durationSeconds: 8,
			referenceImages: [
				{
					referenceType: 'asset',
					image: { mimeType: 'image/png', bytesBase64Encoded: 'dmFzZQ==' },
				},
			],
		});

		expect(mockedRequest.mock.calls[0]?.[3]).toEqual({
			body: {
				instances: [
					{
						prompt: 'walk in with the vase',
						referenceImages: [
							{
								image: {
									mimeType: 'image/png',
									bytesBase64Encoded: 'dmFzZQ==',
								},
								referenceType: 'asset',
							},
						],
					},
				],
				parameters: { durationSeconds: 8 },
			},
		});
	});

	it('extends a Cloud Storage video', async () => {
		mockedRequest.mockResolvedValue({ name: OPERATION });
		await extendCreate(buildCtx({ projectId: 'my-proj' }), {
			model: 'veo-3.1-generate-001',
			prompt: 'the butterfly lands',
			video: { gcsUri: 'gs://bucket/flower.mp4', mimeType: 'video/mp4' },
			resolution: '720p',
		});

		expect(mockedRequest.mock.calls[0]?.[3]).toEqual({
			body: {
				instances: [
					{
						prompt: 'the butterfly lands',
						video: { gcsUri: 'gs://bucket/flower.mp4', mimeType: 'video/mp4' },
					},
				],
				parameters: { resolution: '720p' },
			},
		});
	});

	it('uses the stored project id when the call does not pass one', async () => {
		mockedRequest.mockResolvedValue({ name: OPERATION });
		await textToVideoCreate(buildCtx(), {
			model: 'veo-3.1-lite-generate-001',
			prompt: 'a wave',
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toContain(
			'/projects/stored-proj/locations/us-central1/',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toContain(
			'veo-3.1-lite-generate-001:predictLongRunning',
		);
	});

	it('logs a failed start and rethrows', async () => {
		mockedRequest.mockRejectedValue(new Error('unavailable'));
		await expect(
			textToVideoCreate(buildCtx({ projectId: 'my-proj' }), {
				model: 'veo-3.1-generate-001',
				prompt: 'a cat',
			}),
		).rejects.toThrow('unavailable');
		expect(mockedLog).toHaveBeenCalledWith(
			expect.anything(),
			'veo.textToVideo.create',
			{ model: 'veo-3.1-generate-001', location: 'us-central1' },
			'failed',
		);
	});
});

describe('Veo operations', () => {
	it('fetches an operation using ids parsed from the operation name', async () => {
		mockedRequest.mockResolvedValue({
			name: OPERATION,
			done: true,
			response: {
				raiMediaFilteredCount: 0,
				videos: [
					{ gcsUri: 'gs://bucket/out/sample_0.mp4', mimeType: 'video/mp4' },
				],
			},
		});

		const operation = await operationsGet(buildCtx(), {
			operationName: OPERATION,
		});

		expect(operation.done).toBe(true);
		expect(operation.response?.videos?.[0]?.gcsUri).toBe(
			'gs://bucket/out/sample_0.mp4',
		);
		expect(mockedRequest).toHaveBeenCalledWith(
			'https://us-central1-aiplatform.googleapis.com',
			'/v1/projects/my-proj/locations/us-central1/publishers/google/models/veo-3.1-generate-001:fetchPredictOperation',
			'ya29.token',
			{ body: { operationName: OPERATION } },
		);
	});

	it('polls until the operation is done', async () => {
		mockedRequest
			.mockResolvedValueOnce({ name: OPERATION, done: false })
			.mockResolvedValueOnce({
				name: OPERATION,
				done: true,
				response: {
					videos: [{ bytesBase64Encoded: 'dmlk', mimeType: 'video/mp4' }],
				},
			});

		const operation = await operationsWait(buildCtx(), {
			operationName: OPERATION,
			pollIntervalMs: 0,
			timeoutMs: 5_000,
		});

		expect(mockedRequest).toHaveBeenCalledTimes(2);
		expect(operation.response?.videos?.[0]?.bytesBase64Encoded).toBe('dmlk');
		expect(mockedLog).toHaveBeenCalledWith(
			expect.anything(),
			'veo.operations.wait',
			{ operationName: OPERATION, done: true },
			'completed',
		);
	});

	it('polls again when the timeout is shorter than the interval', async () => {
		mockedRequest
			.mockResolvedValueOnce({ name: OPERATION, done: false })
			.mockResolvedValueOnce({
				name: OPERATION,
				done: true,
				response: { videos: [] },
			});

		const operation = await operationsWait(buildCtx(), {
			operationName: OPERATION,
			pollIntervalMs: 60_000,
			timeoutMs: 40,
		});

		expect(mockedRequest).toHaveBeenCalledTimes(2);
		expect(operation.done).toBe(true);
	});

	it('returns the last operation when the timeout is already due', async () => {
		mockedRequest.mockResolvedValue({ name: OPERATION, done: false });
		const operation = await operationsWait(buildCtx(), {
			operationName: OPERATION,
			pollIntervalMs: 10_000,
			timeoutMs: 0,
		});
		expect(operation.done).toBe(false);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedLog.mock.calls[0]?.[3]).toBe('pending');
	});

	it('stops when the operation carries an error', async () => {
		mockedRequest.mockResolvedValue({
			name: OPERATION,
			done: true,
			error: { code: 3, message: 'filtered', status: 'INVALID_ARGUMENT' },
		});
		const operation = await operationsWait(buildCtx(), {
			operationName: OPERATION,
			pollIntervalMs: 0,
			timeoutMs: 5_000,
		});
		expect(operation.error?.message).toBe('filtered');
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedLog.mock.calls[0]?.[3]).toBe('failed');
	});
});
