import { recallai } from './index';

jest.mock('./client', () => ({ makeRecallaiRequest: jest.fn() }));
import { makeRecallaiRequest } from './client';

const id = '550e8400-e29b-41d4-a716-446655440000';
const response = { id, metadata: {}, status: { code: 'done' } };

describe('Recall.ai recording operations', () => {
	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());
	it('asserts the recording lifecycle routes and methods', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValueOnce({ next: null, previous: null, results: [response] }).mockResolvedValue(response);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = { key: 'recall-key' } as never;
		await plugin.endpoints.recordings.list(ctx, { status_code: 'done' });
		await plugin.endpoints.recordings.retrieve(ctx, { id });
		await plugin.endpoints.recordings.update(ctx, { id, metadata: { source: 'test' } });
		await plugin.endpoints.recordings.delete(ctx, { id });
		await plugin.endpoints.recordings.createTranscript(ctx, { id, provider: 'recallai' });
		expect(request).toHaveBeenNthCalledWith(1, '/api/v1/recording/', 'recall-key', { method: 'GET', query: { status_code: 'done' } });
		expect(request).toHaveBeenNthCalledWith(2, `/api/v1/recording/${id}/`, 'recall-key', { method: 'GET' });
		expect(request).toHaveBeenNthCalledWith(3, `/api/v1/recording/${id}/`, 'recall-key', { method: 'PATCH', body: { metadata: { source: 'test' } } });
		expect(request).toHaveBeenNthCalledWith(4, `/api/v1/recording/${id}/`, 'recall-key', { method: 'DELETE' });
		expect(request).toHaveBeenNthCalledWith(5, `/api/v1/recording/${id}/create_transcript/`, 'recall-key', { method: 'POST', body: { provider: 'recallai' } });
	});
	it('asserts real-time endpoint routes', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValueOnce({ next: null, previous: null, results: [response] }).mockResolvedValue(response);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = { key: 'recall-key' } as never;
		await plugin.endpoints.realtimeEndpoints.list(ctx, {});
		await plugin.endpoints.realtimeEndpoints.retrieve(ctx, { id });
		await plugin.endpoints.realtimeEndpoints.update(ctx, { id, metadata: { source: 'test' } });
		expect(request).toHaveBeenNthCalledWith(1, '/api/v1/realtime_endpoint/', 'recall-key', { method: 'GET', query: {} });
		expect(request).toHaveBeenNthCalledWith(2, `/api/v1/realtime_endpoint/${id}/`, 'recall-key', { method: 'GET' });
		expect(request).toHaveBeenNthCalledWith(3, `/api/v1/realtime_endpoint/${id}/`, 'recall-key', { method: 'PATCH', body: { metadata: { source: 'test' } } });
	});
	it('lists Desktop SDK uploads through the current route', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue({ next: null, previous: null, results: [] });
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await plugin.endpoints.sdkUploads.list({ key: 'recall-key' } as never, {});
		expect(request).toHaveBeenCalledWith('/api/v1/sdk_upload/', 'recall-key', { method: 'GET', query: {} });
	});
});
