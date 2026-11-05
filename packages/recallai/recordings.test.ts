import { makeRecallaiRequest } from './client';
import { recallai } from './index';
import { recallaiTestContext } from './test-context';

jest.mock('./client', () => {
	const makeRecallaiRequest = jest.fn();
	return {
		makeRecallaiRequest,
		makeRecallaiContextRequest: jest.fn((ctx, path, options) =>
			makeRecallaiRequest(path, ctx.key, options),
		),
	};
});

const id = '550e8400-e29b-41d4-a716-446655440000';
const response = { id, metadata: {}, status: { code: 'done' } };

describe('Recall.ai recording operations', () => {
	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());
	it('asserts the recording lifecycle routes and methods', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request
			.mockResolvedValueOnce({
				next: null,
				previous: null,
				results: [response],
			})
			.mockResolvedValue(response);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = recallaiTestContext;
		await plugin.endpoints.recordings.list(ctx, {
			bot_id: id,
			status_code: 'paused',
		});
		await plugin.endpoints.recordings.retrieve(ctx, { id });
		await plugin.endpoints.recordings.update(ctx, {
			id,
			metadata: { source: 'test' },
		});
		await plugin.endpoints.recordings.delete(ctx, { id });
		await plugin.endpoints.recordings.createTranscript(ctx, {
			id,
			provider: { recallai_async: { language_code: 'en' } },
			diarization: { use_separate_streams_when_available: true },
			metadata: { source: 'test' },
		});
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/recording/',
			'recall-key',
			{ method: 'GET', query: { bot_id: id, status_code: 'paused' } },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/recording/${id}/`,
			'recall-key',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			`/api/v1/recording/${id}/`,
			'recall-key',
			{ method: 'PATCH', body: { metadata: { source: 'test' } } },
		);
		expect(request).toHaveBeenNthCalledWith(
			4,
			`/api/v1/recording/${id}/`,
			'recall-key',
			{ method: 'DELETE' },
		);
		expect(request).toHaveBeenNthCalledWith(
			5,
			`/api/v1/recording/${id}/create_transcript/`,
			'recall-key',
			{
				method: 'POST',
				body: {
					provider: { recallai_async: { language_code: 'en' } },
					diarization: { use_separate_streams_when_available: true },
					metadata: { source: 'test' },
				},
			},
		);
	});
	it('asserts real-time endpoint routes', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request
			.mockResolvedValueOnce({
				next: null,
				previous: null,
				results: [response],
			})
			.mockResolvedValue(response);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = recallaiTestContext;
		await plugin.endpoints.realtimeEndpoints.list(ctx, {
			status_code: 'running',
			type: 'websocket',
		});
		await plugin.endpoints.realtimeEndpoints.retrieve(ctx, { id });
		await plugin.endpoints.realtimeEndpoints.update(ctx, {
			id,
			metadata: { source: 'test' },
		});
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/realtime_endpoint/',
			'recall-key',
			{ method: 'GET', query: { status_code: 'running', type: 'websocket' } },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/realtime_endpoint/${id}/`,
			'recall-key',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			`/api/v1/realtime_endpoint/${id}/`,
			'recall-key',
			{ method: 'PATCH', body: { metadata: { source: 'test' } } },
		);
	});
	it('lists Desktop SDK uploads through the current route', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue({ next: null, previous: null, results: [] });
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await plugin.endpoints.sdkUploads.list(recallaiTestContext, {});
		expect(request).toHaveBeenCalledWith('/api/v1/sdk_upload/', 'recall-key', {
			method: 'GET',
			query: {},
		});
	});

	it('rejects filters each list does not document', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = recallaiTestContext;
		await expect(
			plugin.endpoints.recordings.list(ctx, {
				status_code: 'deleted',
			} as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.realtimeEndpoints.list(ctx, {
				status_code: 'processing',
			} as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.audioMixed.list(ctx, {
				status_code: 'deleted',
			} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('requires the transcript provider as one provider object', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = recallaiTestContext;
		for (const provider of [
			'recallai',
			{},
			{ recallai_async: {}, deepgram_async: {} },
			{ made_up_async: {} },
		]) {
			await expect(
				plugin.endpoints.recordings.createTranscript(ctx, {
					id,
					provider,
				} as never),
			).rejects.toThrow();
		}
		expect(request).not.toHaveBeenCalled();
	});
});
